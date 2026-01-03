## Auditoría de consistencia de dominio clínico

Rol: Auditor senior de arquitectura y dominio funcional.
Ámbito: Backend (dominio, datos, API), Frontend (UI/UX clínica), contratos de timeline y tests de invariantes.
Dominio canónico considerado: Paciente, Nota (Draft/Finalizada), Evento NOTE, Evento Encounter (solo turnos ocurridos), Timeline (solo hechos), Turnos ≠ eventos clínicos.

---

### 1. Modelado de Paciente y registro clínico

#### 1.1 Creación de paciente y ClinicalRecord

- **Invariante / regla**: Paciente es agregado raíz clínico y debe tener exactamente un `ClinicalRecord` con evento fundacional en timeline.
- **Ubicación**:
  - `PatientService.createPatient` crea `Patient`, `ClinicalRecord` y `PsychiatricHistory` inicial, y emite evento fundacional:
    - ```196:265:src/domain/patient/service.ts```
- **Análisis**:
  - La creación transaccional de `Patient + ClinicalRecord + PsychiatricHistory(version 1)` respeta la idea de historia clínica como agregado derivado de paciente.
  - El uso de `emitFoundationalEvent` crea un único evento fundacional en timeline vinculado al `clinicalRecordId`, alineado con la spec de evento fundacional.
  - No se exponen detalles clínicos del paciente en el DTO de salida (`toPatientOutput`), respetando la separación de datos demográficos vs historia clínica.
- **Impacto clínico / técnico**:
  - **Positivo**: garantiza que toda lectura de timeline o estado clínico pueda anclarse en un `clinicalRecordId` único por paciente.
  - **Riesgo bajo**: el comentario indica que si falla la emisión del evento fundacional no se revierte la transacción. Esto puede dejar pacientes sin evento fundacional, rompiendo invariantes de timeline.
- **Severidad**: Media.
- **Recomendación conceptual**:
  - Tratar la creación del evento fundacional como parte esencial del agregado de historia clínica: un fallo al crear el evento debería considerarse fallo en la creación de la historia clínica, o bien existir un mecanismo explícito de reparación/auditoría que detecte y regenere eventos fundacionales faltantes bajo control de dominio.

#### 1.2 Separación Paciente vs Historia Clínica en capa de API/UI

- **Invariante / regla**: El paciente es eje, pero la historia clínica (timeline, notas, medicación) se deriva de `ClinicalRecord`, no de atributos del paciente.
- **Ubicación**:
  - Servicios de timeline y estado derivado usan siempre `ClinicalRecord` para consultas:
    - `getClinicalRecordIdForPatient` en `StateResolver`.
      - ```31:44:src/domain/timeline/state-resolver.ts```
  - Endpoints de timeline trabajan con `patientId` y delegan a capa de dominio:
      - ```1:43:src/app/api/patients/[id]/timeline/route.ts```
- **Análisis**:
  - La API nunca mezcla directamente datos clínicos con CRUD de paciente; en lugar de eso, se obtiene el `clinicalRecordId` y se trabaja sobre `clinicalEvent`, `medication`, `psychiatricHistory`, etc.
  - Esto respeta la regla de paciente como agregado raíz administrativo y la historia como vista longitudinal.
- **Impacto clínico / técnico**:
  - Mantiene baja la probabilidad de introducir lógica clínica en flujos administrativos (alta trazabilidad y menor riesgo de errores de dominio en CRUD de pacientes).
- **Severidad**: Baja (implementación consistente con dominio).
- **Recomendación conceptual**:
  - Mantener esta separación y documentarla explícitamente en servicios/handlers nuevos (por ejemplo, evitar leer o derivar estado clínico desde campos del paciente cuando se incorporen features de resumen rápido).

---

### 2. Notas clínicas y evento NOTE

#### 2.1 Ciclo de vida Draft/Finalizada e inmutabilidad

- **Invariante / regla**: Nota Draft es editable y eliminable; Nota Finalizada es inmutable, solo corregible vía addendum; la finalización genera exactamente un evento NOTE en timeline.
- **Ubicación**:
  - Lógica de notas en `NoteService`:
    - ```24:310:src/domain/notes/note-service.ts```
  - Reglas de finalización e inmutabilidad:
    - Uso de `NoteStatus.Draft`/`Finalized`, `canFinalizeNote`, y validaciones de fecha.
    - ```69:98:src/types/notes.ts```
- **Análisis**:
  - `createDraftNote` y `updateDraftNote` validan explícitamente que solo notas `Draft` sean actualizables y que las fechas de encuentro no estén en el futuro.
  - `deleteDraftNote` prohíbe borrar notas finalizadas y declara explícitamente que es la única operación de borrado permitida en el sistema.
  - `finalizeNote`:
    - Verifica existencia de la nota y que no esté ya finalizada.
    - Usa `canFinalizeNote` para chequear campos clínicos mínimos (subjective, assessment, plan) y fecha no futura.
    - Actualiza estado y `finalizedAt` dentro de una transacción.
    - Emite un evento NOTE vía `emitNoteEvent` después de la transacción.
  - La creación de addenda (`createAddendum`) obliga a que la nota esté finalizada y exige contenido + motivo, respetando la regla de corrección sin edición de la nota original.
- **Impacto clínico / técnico**:
  - **Positivo**: la inmutabilidad de notas finalizadas está garantizada por diseño (no hay paths de actualización ni borrado para `Finalized`).
  - **Riesgo medio**: la emisión del evento NOTE ocurre fuera de la transacción y un fallo de `emitNoteEvent` no revierte la finalización. Esto puede violar la invariante "nota finalizada ⇒ exactamente un evento NOTE".
- **Severidad**: Media.
- **Recomendación conceptual**:
  - Tratar la relación "finalización de nota" ↔ "NOTE event" como un solo contrato atómico a nivel de dominio: o ambas cosas ocurren o ninguna.
  - Si se mantiene la separación técnica (por resiliencia), definir en las specs un mecanismo sistemático de reconciliación/auditoría de eventos NOTE faltantes y dejarlo explícito como responsabilidad de dominio, no como detalle operativo.

#### 2.2 Separación Nota vs Evento NOTE

- **Invariante / regla**: Nota es documento clínico; Evento NOTE es hecho en timeline derivado de transición Draft→Finalizada, con títulos y metadatos mapeados por specs.
- **Ubicación**:
  - Mapeo de `EncounterType` a título de evento NOTE:
    - ```49:63:src/types/notes.ts```
  - Emisión de evento NOTE desde timeline emitter:
    - ```87:104:src/domain/timeline/event-emitter.ts```
- **Análisis**:
  - El código distingue claramente entre modelo `Note` de Prisma y `ClinicalEvent` con `eventType = ClinicalEventType.NOTE`.
  - `getEncounterTitle` se basa en `EncounterType` (InitialEvaluation, FollowUp, etc.), alineado con la spec de NOTE como evento timeline con semántica de tipo de encuentro, no del texto completo.
  - Los tests de invariantes (`INV-STATE-07` y otros) referencian explícitamente que notas finalizadas deben tener exactamente un evento NOTE, reforzando el contrato a nivel de QA.
- **Impacto clínico / técnico**:
  - Minimiza riesgo de que UI o API traten la nota como el propio evento timeline; la UI debería consumir eventos ya procesados.
- **Severidad**: Baja.
- **Recomendación conceptual**:
  - Mantener el patrón en nuevas extensiones (p.ej., si se agregan resúmenes automáticos de notas, que se modelen como atributos derivados del evento NOTE o vistas de lectura, no como nuevos tipos de evento).

---

### 3. Turnos (appointments) vs Evento Encounter

#### 3.1 Turnos explícitamente fuera de la timeline clínica

- **Invariante / regla**: Turnos representan planificación futura; no son eventos clínicos ni deben poblar timeline directamente.
- **Ubicación**:
  - Servicio de turnos:
    - ```1:351:src/domain/appointments/service.ts```
  - Comentario explícito de exclusión de ClinicalEvents:
    - ```8:11:src/domain/appointments/service.ts```
  - Definición de eventos de appointments como domain events in-memory, no clinical events:
    - ```1:181:src/domain/appointments/events.ts```
- **Análisis**:
  - El servicio de turnos declara explícitamente que **no** crea `ClinicalEvent` ni se usa para inferir estado clínico, lo cual respeta de forma directa la separación conceptual Turnos ≠ eventos clínicos.
  - Los eventos de appointments (`AppointmentScheduled`, `AppointmentUpdated`, `AppointmentCancelled`) se implementan como `DomainEvent` in-memory, usados potencialmente para side-effects no clínicos.
- **Impacto clínico / técnico**:
  - Reduce el riesgo de que el timeline se llene de información administrativa (turnos futuros o cancelados) y preserve su naturaleza de historia de hechos.
- **Severidad**: Baja (alineación fuerte con dominio).
- **Recomendación conceptual**:
  - Mantener esta separación cuando se agreguen recordatorios, notificaciones o dashboards: estos deben basarse en consultas de appointments, no en ClinicalEvents ni modificarlos.

#### 3.2 Generación de eventos Encounter solo para turnos ocurridos

- **Invariante / regla**: Evento Encounter se genera únicamente para turnos efectivamente ocurridos (no futuros), y la timeline incluye únicamente Encounter ya materializados.
- **Ubicación**:
  - Generador de eventos Encounter para citas pasadas:
    - ```1:187:src/domain/appointments/encounter-event-generator.ts```
  - Uso en lector de timeline (`timeline-reader`):
    - ```22:291:src/domain/timeline/timeline-reader.ts```
  - Exclusión de Encounter futuros al leer timeline:
    - ```159:177:src/domain/timeline/timeline-reader.ts```
- **Análisis**:
  - `ensureEncounterEventForAppointment` y `ensureEncounterEventsForPatient` generan eventos `ClinicalEventType.Encounter` sólo cuando la fecha programada es pasada y no existe aún un Encounter para ese turno.
  - `timeline-reader` llama a `ensureEncounterEventsForPatient(patientId)` antes de devolver timeline completo o filtrado, garantizando la materialización de Encounter en base a appointments históricos.
  - La consulta de timeline excluye explícitamente `ClinicalEventType.Encounter` con fecha futura, asegurando que la timeline de hechos no muestre consultas aún no ocurridas.
- **Impacto clínico / técnico**:
  - **Positivo**: alinea exactamente la regla de "Solo eventos de Encounter para turnos ocurridos".
  - **Riesgo bajo**: el generador de Encounter depende de la invocación desde `timeline-reader`; si se construyen futuras vistas basadas en ClinicalEvents sin pasar por este lector, podrían omitirse Encounter.
- **Severidad**: Baja-Media.
- **Recomendación conceptual**:
  - Establecer `timeline-reader` como única puerta de entrada autorizada para leer historia de ClinicalEvents en el dominio de UI/API.
  - Cualquier nueva lectura de historia clínica debería usar los servicios de dominio de timeline (no consultar `ClinicalEvent` directo) para garantizar que Encounter derivados de turnos estén materializados y filtrados correctamente.

#### 3.3 Uso de Turnos en UI sin confundirlos con eventos clínicos

- **Invariante / regla**: En la UI, Turnos se muestran como planificación; la timeline se reserva a eventos clínicos.
- **Ubicación**:
  - Panel de próximas citas del paciente:
    - ```1:162:src/ui/components/AppointmentsPanel.tsx```
  - Componente de citas futuras globales:
    - ```1:68:src/app/api/appointments/upcoming/route.ts```
- **Análisis**:
  - `AppointmentsPanel` muestra "Próxima Cita" con `status`, fecha y notas de turno, sin mezclarlo visualmente con la `Línea de Tiempo Clínica` (renderizada por el componente `Timeline`).
  - El endpoint `/api/appointments/upcoming` consulta únicamente appointments con `status: Scheduled` y devuelve un DTO orientado a agenda, no ClinicalEvents.
- **Impacto clínico / técnico**:
  - La UI mantiene claramente separados los conceptos de agenda (turnos) y timeline clínica (eventos NOTE/Encounter/etc.).
- **Severidad**: Baja.
- **Recomendación conceptual**:
  - Evitar incorporar en la timeline componentes de presentación de Turnos (por ejemplo, no agregar un tipo de evento "Turno" en la UI para appointments programados; solo mostrar Encounter cuando corresponda según el motor de timeline).

---

### 4. Timeline como historia de hechos

#### 4.1 Contratos de lectura y estructura de eventos

- **Invariante / regla**: Timeline contiene sólo eventos clínicos/administrativos relevantes, ordenados según contratos de prioridad; la lectura se realiza via servicios de dominio, no acceso directo a DB desde UI.
- **Ubicación**:
  - Tipos de timeline:
    - ```1:315:src/domain/timeline/timeline-types.ts```
  - Orden de eventos y prioridad por tipo:
    - ```27:38:src/types/timeline.ts```
  - Lector de timeline (`getFullTimeline`, `getFilteredTimeline` en `timeline-reader`):
    - ```1:400:src/domain/timeline/timeline-reader.ts```
- **Análisis**:
  - Los tipos de salida (`FullTimelineResult`, `FilteredTimelineResult`, `TimelineEvent`, `TimelineEventSummary`) embeben sólo metadatos clínicamente relevantes (timestamps, type, title, description, sourceType/sourceIdentifier), no el contenido completo de notas o medicación, lo que respeta la idea de timeline como índice de hechos.
  - `EVENT_TYPE_PRIORITY` define una jerarquía (Foundational, NOTE, Encounter, Medication*, etc.) usada en `applyFourTierOrdering`, alineando el ordenamiento con las specs de QA temporal.
  - `timeline-reader` se ocupa de aplicar filtros (por tipo de evento, rango de fechas, dirección) y de excluir Encounter futuros.
- **Impacto clínico / técnico**:
  - **Positivo**: se centraliza en dominio la semántica de qué es un evento timeline y cómo se ordena, protegiendo de interpretaciones ad-hoc en UI o API.
- **Severidad**: Baja.
- **Recomendación conceptual**:
  - Mantener la evolución de contratos de timeline exclusivamente en esta capa, evitando que UI/handlers agreguen filtros o transformaciones que repliquen la lógica de ordenamiento o filtrado.

#### 4.2 Exclusión de borradores y turnos del timeline

- **Invariante / regla**: Timeline no muestra borradores de notas ni turnos.
- **Ubicación**:
  - Estado derivado e invariantes de tests:
    - `INV-STATE-08: Draft Notes Excluded from Timeline` y `INV-STATE-09: Appointments Excluded from Timeline`:
      - ```556:680:src/tests/invariants/clinical-state.test.ts```
- **Análisis**:
  - Los tests de invariantes verifican explícitamente que, tras crear una nota en Draft o agendar turnos sin generarse Encounter, la timeline no contenga eventos correspondientes.
  - Esto refuerza las reglas de dominio a nivel QA y asegura que cambios futuros no rompan la distinción "solo hechos".
- **Impacto clínico / técnico**:
  - Aumenta la confianza en que la timeline es una representación fiel de hechos ya ocurridos o decisiones confirmadas, no de intenciones.
- **Severidad**: Baja.
- **Recomendación conceptual**:
  - Mantener la suite de tests de invariantes como guardián de estas reglas y exigir nuevos tests equivalentes cuando se agreguen tipos de evento adicionales.

---

### 5. Uso de conceptos clínicos en Frontend (UI)

#### 5.1 Terminología Encounter/Appointment en UI

- **Invariante / regla**: Por convención del README, "Encounter" no debe usarse en código/UI como nombre genérico salvo según specs de eventos; la UI trabaja con nombres localizados.
- **Ubicación**:
  - Tipos de UI para timeline y appointments:
    - ```1:200:src/types/ui.ts```
  - Componentes de timeline y eventos:
    - ```1:58:src/ui/components/Timeline.tsx```
    - ```1:200:src/ui/components/TimelineEvent.tsx```
- **Análisis**:
  - En UI se usa `appointment_type`, `status`, `Línea de Tiempo Clínica`, `evento`, etc., en español, y el tipo `EncounterType` se usa solo como discriminante técnico en modelos y mapeos (no como label directo en UI).
  - `TimelineEvent` localiza tipos de evento (por ejemplo, mapeando `event_type === 'Turno'` para renderización específica) sin introducir nuevos conceptos clínicos fuera de los definidos en specs.
- **Impacto clínico / técnico**:
  - Alineado con la política de no inventar términos de dominio en UI; se remite a tipos y mapeos ya establecidos.
- **Severidad**: Baja.
- **Recomendación conceptual**:
  - Asegurar que toda nueva etiqueta clínica de UI pase por la spec de localización de eventos (`docs/specs/06_ux_ui/21_event_type_localization_spec.md`) y no se codifique directamente en componentes aislados.

#### 5.2 Separación de vistas: timeline vs panels administrativos

- **Invariante / regla**: Vistas centradas en paciente diferencian timeline clínica (hechos) de paneles de apoyo (próxima cita, medicación actual, datos administrativos).
- **Ubicación**:
  - `PatientDetailView` y paneles asociados (`Timeline`, `AppointmentsPanel`, `MedicationsPanel`, etc.):
    - ```1:400:src/ui/components/PatientDetailView.tsx```
- **Análisis**:
  - La composición de vistas mantiene timeline como eje narrativo diferente de paneles de turnos y medicación.
  - No se observa lógica clínica compleja en componentes de presentación; se limitan a mostrar datos provenientes de API/servicios de dominio.
- **Impacto clínico / técnico**:
  - Disminuye el riesgo de duplicar validaciones o reglas clínicas en UI.
- **Severidad**: Baja.
- **Recomendación conceptual**:
  - Mantener el nivel de inteligencia clínica en servicios de dominio y usar UI solo como consumidor pasivo de resultados (especialmente para estado derivado como `CurrentStateResult`).

---

### 6. Riesgos transversales y posibles inconsistencias

#### 6.1 Desacople parcial entre operaciones clínicas y generación de eventos timeline

- **Invariante / regla**: Cada cambio clínico relevante debe ser rastreable a un evento en timeline, según contratos WRITE-EVENT-*.
- **Ubicación**:
  - Extracción de eventos NOTE y Encounter ya señalada en secciones 2 y 3.
  - Emisión de eventos de medicación e historia psiquiátrica en `timeline/event-emitter` (no detallado aquí pero seguiría patrón similar).
- **Análisis**:
  - Varias operaciones críticas (finalizar nota, ajustes de medicación, creación de Encounter a partir de turnos) dependen de llamadas a `emit*Event` que no están siempre dentro de las mismas transacciones que actualizan los modelos de origen.
  - Los tests de invariantes cubren muchos de estos contratos, pero la arquitectura actual asume que errores en creación de ClinicalEvents son raros o recuperables sin mecanismos de reconciliación explícitos.
- **Impacto clínico / técnico**:
  - En fallos parciales (nota finalizada sin evento, appointment pasado sin Encounter, medicación cambiada sin evento), la timeline podría perder trazabilidad, afectando reconstrucción histórica.
- **Severidad**: Alta (por impacto en auditoría y reconstrucción clínica, aunque la probabilidad técnica pueda ser baja).
- **Recomendación conceptual**:
  - Definir a nivel de specs de timeline un modelo claro para manejo de fallos de escritura de eventos clínicos: o se garantizan atómicamente con las operaciones de dominio, o se define un proceso de reconciliación/auditoría con responsabilidades claras (por ejemplo, jobs de dominio que escanean inconsistencias y las corrigen bajo reglas controladas).

#### 6.2 Riesgo de accesos directos a ClinicalEvent fuera de servicios de timeline

- **Invariante / regla**: Timeline y estado clínico derivado sólo deben calcularse desde servicios de dominio de timeline, no desde consultas ad-hoc a `ClinicalEvent`.
- **Ubicación**:
  - En el código actual, los accesos a `clinicalEvent` relevantes se concentran en `timeline-reader` y `state-resolver`.
- **Análisis**:
  - La estructura actual respeta la regla, pero no existe barrera técnica fuerte que impida que nuevos handlers o servicios futuros consulten `prisma.clinicalEvent` directamente.
  - Dado que Encounter para turnos se materializa de forma lazy al leer timeline, cualquier bypass del lector perdería esa lógica.
- **Impacto clínico / técnico**:
  - Potencial de duplicación semántica o de vistas inconsistentes de la historia clínica si se construyen nuevas features sin seguir el patrón actual.
- **Severidad**: Media.
- **Recomendación conceptual**:
  - Formalizar en las specs de arquitectura una regla: "Toda lectura de ClinicalEvent para fines clínicos debe pasar por servicios de timeline" y exigir referencias explícitas a estas specs en nuevos endpoints/vistas.

---

### 7. Conclusión general

- **Respeto global del dominio**: El código revisado respeta de forma consistente las distinciones canónicas: Paciente vs Historia Clínica, Nota vs Evento NOTE, Turnos vs Encounter, Timeline como historia de hechos, y exclusión de borradores/turnos de la timeline.
- **Puntos fuertes**: Capa de dominio bien delimitada, uso intensivo de contratos de timeline, tests de invariantes alineados con specs, y una UI que no introduce conceptos clínicos nuevos fuera de las specs.
- **Riesgos principales**: Manejo no atómico de la creación de ClinicalEvents respecto de las operaciones clínicas de origen y dependencia implícita en que todos los consumidores usen `timeline-reader`/`state-resolver` en lugar de acceder a datos crudos.
- **Recomendación global**: Consolidar en las specs de arquitectura una sección explícita de "Invariantes de acoplamiento entre operaciones clínicas y eventos de timeline" y "Puntos de entrada autorizados para lectura de historia clínica", de forma que cualquier nueva funcionalidad pueda ser auditada rápidamente frente a estas reglas sin requerir inspección minuciosa de la implementación.