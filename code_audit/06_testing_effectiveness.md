## 06 - Evaluación de la efectividad de la estrategia de testing

### 1. Panorama general

**Stack de testing identificado**
- **Runner**: `vitest` (configurado en `vitest.config.ts`, entorno `node`, tests secuenciales con pool `forks`).
- **Alcance actual de tests** (archivos en `src/tests/`):
  - `patient-crud.test.ts`: suite extensa de CRUD de paciente + reglas de negocio básicas.
  - `invariants/clinical-state.test.ts`: invariantes de estado clínico (medicación, notas, citas y su visibilidad en timeline).
  - `invariants/historical.test.ts`: invariantes de integridad histórica (inmutabilidad, addendas, cadenas de versiones, predecesores de medicación).
  - `invariants/temporal.test.ts`: invariantes temporales de la línea de tiempo (orden, backdating, timestamps).
  - `invariants/contract-compliance.test.ts`: cumplimiento de contratos de timeline (errores, required fields, shape de respuestas, empty states).
  - `utils/test-fixtures.ts`, `utils/test-helpers.ts`, `setup.ts`: infra común para crear datos de prueba y helpers de aserción.

**Cobertura conceptual (sin ejecutar coverage, inferida por lectura de código):**
- **Fuertemente cubierto (dominio/timeline):**
  - Servicio de pacientes (`PatientService`): validaciones, reglas de negocio, ausencia de delete, no generación de eventos de timeline en CRUD de paciente.
  - Motor de timeline (`domain/timeline`): creación de eventos, lectura de timeline completo, estado actual/histórico, orden determinista, prohibición de eventos futuros, inmutabilidad lógica.
  - Integridad de datos clínicos: historia psiquiátrica versionada, addendas, medicamentos activos/discontinuados.
- **Prácticamente sin cobertura automatizada:**
  - Rutas API (`src/app/api/...`): serialización/deserialización, códigos HTTP, manejo de errores de capa API.
  - Servicios de medicación, notas y citas en sí mismos (más allá de los invariantes de timeline): `medication-service`, `note-service`, `AppointmentService` y su validación.
  - Lógica de `stats` de pacientes y consultas de citas próximas.
  - Capa UI (`src/ui/components`) y páginas (`src/app/patients/...`): sin tests de componentes ni pruebas de integración frontend.

---

### 2. Qué se testea

#### 2.1 Pacientes (dominio)

- **Create / Update / Read / Search / List / Archive** cubiertos en `patient-crud.test.ts`:
  - **Validaciones de entrada**:
    - `fullName` obligatorio, no vacío ni solo espacios.
    - `dateOfBirth` válido, no futuro.
    - Formato de email básico y de teléfono (longitud y caracteres permitidos).
    - Reglas de contacto de emergencia: si hay nombre, el teléfono es obligatorio; validación de formato.
  - **Normalización de datos**:
    - `trim` de strings en alta y actualización (nombre, teléfonos, email, dirección, contactos).
  - **Efectos colaterales en modelo clínico**:
    - Creación automática de `ClinicalRecord` 1:1 y versión inicial de `PsychiatricHistory` (v1, `isCurrent = true`).
    - Verificación de que la creación/actualización de paciente **no genera** eventos en `clinicalEvent`.
  - **Lectura**:
    - `getPatientById` devuelve todos los campos esperados y **no incluye** relaciones clínicas (record, notas, meds, events) en el DTO.
    - Comportamiento frente a `PatientNotFoundError`.
  - **Búsqueda y listado**:
    - Búsqueda por nombre (parcial, case-insensitive, sin fuzzy/phonetic), por `id` exacto y por `dateOfBirth` exacta.
    - Combinación de criterios (AND) y casos sin resultados.
    - Ordenamiento por estado (Activos antes que Inactivos), nombre alfabético y fecha de registro.
  - **Update**:
    - Actualización de todos los campos mutables y preservación de campos inmutables (`id`, `registrationDate`, `createdAt`).
    - Autoupdate de `updatedAt`.
    - No afectación de datos clínicos ligados al paciente (notas, etc.).
    - Errores de validación al dejar nombre vacío, fechas inválidas/futuras, email/teléfono inválidos, contacto de emergencia inconsistente.
  - **Delete/Archive**:
    - Afirmación explícita de que **no existe** método de borrado en `PatientService`.
    - Deactivación por `status` y preservación de datos clínicos.
    - Posibilidad de reactivar; inclusión de pacientes inactivos en búsquedas.

**Calidad de estos tests**: alta. Cubren rutas felices, límites de validación, idempotencia de campos inmutables y efectos colaterales clínicos.

#### 2.2 Timeline: invariantes temporales, de estado e históricos

- **Temporal (`temporal.test.ts`)**:
  - **Permanencia de eventos**: eventos creados son recuperables por ID y aparecen en el timeline; agregar nuevos no “borra” los anteriores.
  - **Monotonía del conteo de eventos**: `eventCount` solo crece al agregar eventos.
  - **Orden determinista**:
    - Mismas consultas producen el mismo orden.
    - Algoritmo de orden de 4 niveles: `event_timestamp` → `recorded_timestamp` → prioridad de `eventType` → `event_identifier`.
    - Inserción estable: agregar eventos no reordena los existentes.
  - **Backdating**:
    - Eventos backdated a 1 semana / 1 año se insertan en la posición cronológica correcta.
    - `recordedTimestamp` refleja el momento de documentación y permite ver el “gap” de backdating (no se reescribe la historia).
  - **Prohibición de eventos futuros**: crear eventos con fechas futuras devuelve errores con códigos y mensajes esperados.
  - **Inmutabilidad de timestamps**: múltiples lecturas de `event_timestamp`/`recorded_timestamp` dan exactamente el mismo valor.

- **Históricas (`historical.test.ts`)**:
  - **Inmutabilidad de notas finalizadas**: contenido, fecha de encuentro y `finalizedAt` permanecen estables; se asume que la capa de dominio/DB preserva esto.
  - **Inmutabilidad de medicaciones discontinuadas**: dosis, fechas, motivo de discontinuación, estado.
  - **Versionado de historia psiquiátrica**: contenido, `versionNumber`, `createdAt` y `supersededAt` estables.
  - **Correcciones vía addenda**:
    - Addendas no modifican la nota original; ambas son accesibles.
    - Addendas requieren nota finalizada asociada y parent siempre recuperable.
    - Addendas son inmutables y preservan `createdAt`.
  - **Cadenas de versiones**:
    - Versiones psiquiátricas forman secuencias contiguas sin saltos (`1,2,3,...`).
    - Chequeo implícito de predecesores (para medicação) sin ciclos: seguir `predecessorId` termina siempre.
  - **Accesibilidad de datos supersedidos**:
    - Versiones antiguas de historia psiquiátrica, medicaciones discontinuadas y notas con addendas siguen siendo consultables.

- **Estado clínico (`clinical-state.test.ts`)**:
  - Derivación de **medicaciones activas** (actual/histórico) según `startDate`/`endDate` y `status`.
  - Consistencia `MedicationStatus` vs fechas (no se permite un estado que contradiga el rango de fechas).
  - Única versión actual de historia psiquiátrica y relación entre `isCurrent` y `supersededAt`.
  - Determinación no ambigua de versión histórica para una fecha dada.
  - Reglas de notas vs eventos de timeline:
    - Notas finalizadas generan exactamente un evento `NOTE` con `recordedAt` ≥ `finalizedAt`.
    - Notas borrador no generan eventos ni aparecen en timeline.
  - Citas excluidas del timeline y sin eventos asociados.

**Calidad de estos tests**: muy alta. Funcionan casi como especificación ejecutable de las reglas clínicas y de auditoría de la línea de tiempo.

#### 2.3 Contratos de timeline (`contract-compliance.test.ts`)

- **Validación de creación de eventos**:
  - Campos obligatorios (fecha, tipo, título, `clinicalRecordId`) devuelven código `MISSING_REQUIRED_FIELDS` con mensajes apropiados.
  - Rechazo sistemático de fechas futuras (cercanas y muy lejanas).
  - Errores específicos cuando el `clinicalRecordId` no existe (`CLINICAL_RECORD_NOT_FOUND`).
  - Determinismo en el rechazo: misma request inválida → mismo tipo de error.
- **Inmediatez de lectura tras escritura**:
  - Eventos creados aparecen inmediatamente en `getFullTimeline` y en `getSingleEvent` sin latencia eventual.
  - Medicaciones nuevas aparecen de inmediato en `getCurrentState`.
- **Errores de no existencia**:
  - Paciente inexistente → `PATIENT_NOT_FOUND` en timeline, estado actual e histórico; nunca se devuelve lista vacía “silenciosa”.
  - Evento inexistente (incluyendo UUID válido) → `EVENT_NOT_FOUND`.
- **Forma de respuestas**:
  - `FullTimeline`, `CurrentState`, `HistoricalState` y `SingleEvent` retornan siempre los campos requeridos por contrato (incluyendo los que pueden ser `null`).
  - Manejo de timeline vacío como caso válido (no error) para pacientes nuevos.

**Calidad**: muy buena, orientada a contratos y errores → protege integraciones backend y facilita debugging.

---

### 3. Qué no se testea (brechas relevantes)

#### 3.1 Rutas API HTTP (Next.js `app/api`)

**Área sin cobertura**
- Todas las rutas HTTP observadas:
  - `api/patients` (GET/POST).
  - `api/patients/[id]` (GET/PATCH).
  - `api/patients/[id]/appointments` (GET/POST), `.../[appointmentId]` (PATCH), `.../[appointmentId]/cancel` (POST).
  - `api/appointments/upcoming` (GET).
  - `api/patients/[id]/medications` (POST).
  - `api/patients/[id]/notes` (POST).
  - `api/patients/[id]/timeline` (GET) y variantes `current-state`/`at-date` (por estructura de carpetas).
  - `api/stats/patients` (GET).

**Riesgo asociado**
- **Mapping request/response**:
  - Errores de parseo de fechas (ISO → `Date`) que pasen valores `Invalid Date` al dominio.
  - Inconsistencias entre los códigos de estado HTTP esperados (200/201/400/404/500) y los realmente devueltos.
  - Mensajes de error no alineados con lo esperado en el frontend (estructura `{ error: string }`).
- **Seguridad y robustez**:
  - Falta de tests que verifiquen comportamientos frente a cuerpos malformados, tipos erróneos, falta de campos obligatorios a nivel HTTP.
  - No se testea el manejo de errores internos (`console.error` + 500) para garantizar que no se filtra información sensible.
- **Clínicamente relevante**:
  - Estos endpoints son la superficie real consumida por la UI; un bug aquí puede implicar **registro errado de citas, notas o medicaciones**, aunque el dominio tenga reglas correctas.

**Severidad**: **Alta** (la API es el contrato externo principal).

**Recomendación (tipo de test)**
- **Tests de integración HTTP** (Vitest + `supertest`/`fetch` contra handlers Next) que:
  - Verifiquen status codes, payloads, transformación de tipos y mapeo de errores del dominio a HTTP.
  - Cubran escenarios erróneos de parseo (fechas inválidas, tipos incorrectos) y falta de campos obligatorios.
  - Para endpoints clínicos (notas, medicación, citas, timeline) priorizar rutas felices + errores esperados (p.ej. paciente inexistente → 404 consistente).

---

#### 3.2 Servicios de medicación y notas (`medication-service`, `note-service`)

**Área sin cobertura**
- Servicios de dominio específicos para:
  - Iniciar/cambiar/detener medicaciones (`startMedication`, cambios de dosis, stops) más allá de los eventos de timeline.
  - Crear notas, finalizarlas, agregar addendas desde el servicio de negocio (los tests actuales operan mayormente a nivel Prisma + fixtures, no vía servicios públicos).

**Riesgo asociado**
- **Reglas clínicas no cubiertas punta a punta**:
  - Es posible que un bug en `medication-service` cree registros inconsistentes pero que los invariantes actuales no lo detecten porque se basan en escenarios felices definidos en `test-fixtures`.
  - Validaciones clínicas específicas (p.ej. no permitir `dosage <= 0`, restricciones según tipo de encuentro) pueden no estar cubiertas o no existir.
- **Desalineación entre servicios y timeline**:
  - Los invariantes prueban que, dado cierto estado en DB, el timeline es coherente; no prueban que **todas** las rutas de negocio que modifican medicación/notas generen esos estados correctos.

**Severidad**: **Alta** en términos de seguridad clínica (posible representación incorrecta de tratamiento o documentación).

**Recomendación (tipo de test)**
- **Tests de integración de dominio** sobre los servicios:
  - `medication-service`: escenarios de start/change/stop con validaciones clínicas (fechas, dosis, duplicados, predecesores, backdating) y verificación de eventos emitidos.
  - `note-service`: creación de borradores, finalización, creación de addendas; asegurar que se cumplen las reglas de inmutabilidad e integridad histórica ya especificadas en invariantes.
- Mantener el enfoque de **spec alignment**: usar como guía los documentos de `docs/21_ajuste_dosis_medicamentos.md`, `docs/22_nota_clinica_evento_note.md`, etc.

---

#### 3.3 Appointments / `AppointmentService`

**Área sin cobertura**
- `AppointmentService` (scheduling, update, cancel, queries) y sus validaciones (`validateScheduleAppointmentInput`, `validateUpdateAppointmentInput`, `validateCanCancel`) **no tienen tests directos**.
- El comportamiento de `emitAppointmentScheduled/Updated/Cancelled` no está cubierto.

**Riesgo asociado**
- **Errores en reglas de agenda**:
  - Permitir citas en el pasado o demasiado en el futuro fuera de los constraints de negocio (si existieran).
  - Falta de verificación de existencia de paciente (`patientExists`) en todos los caminos.
  - Inconsistencias en cambios de estado (p.ej., cancelar una cita ya cancelada, actualizar citas completadas, etc.).
- **Impacto UX/clínico**:
  - Citas mal agendadas, imposibles de cancelar o reprogramar correctamente; esto impacta la operativa clínica diaria y la confianza en el sistema.

**Severidad**: **Media-Alta** (alto impacto operativo, menor riesgo directo sobre integridad histórica de la historia clínica comparado con notas/medicación).

**Recomendación (tipo de test)**
- **Tests unitarios de `AppointmentService`**:
  - Casos felices de schedule/update/cancel con entradas válidas.
  - Errores específicos: `PATIENT_NOT_FOUND`, `APPOINTMENT_NOT_FOUND`, validaciones de cambios inválidos.
  - Comportamiento de `hasChanges` y `capturePreviousValues` para garantizar que solo se emiten eventos cuando hay cambios significativos.
- **Tests de integración API** sobre rutas de citas (ver sección 3.1) que verifiquen serialización de fechas y mapping de códigos.

---

#### 3.4 Estadísticas y consultas agregadas (`api/stats/patients`, `api/appointments/upcoming`)

**Área sin cobertura**
- Lógica de:
  - Conteo de pacientes activos/inactivos (`/api/stats/patients`).
  - Selección y enriquecimiento de citas próximas (`/api/appointments/upcoming`), incluyendo join con `PatientService.listPatients()` y ordenamiento final.

**Riesgo asociado**
- **Errores de cálculo / performance**:
  - Desfase entre la definición de “activo/inactivo” en dominio vs conteo en stats.
  - Duplicidades o pérdida de citas en el cálculo de próximas 7 días.
  - Problemas de precisión en fechas (zonas horarias, límites de día) por manipulación de `Date` en la API.
- **Impacto clínico**:
  - Dashboards incorrectos pueden inducir a decisiones operativas erróneas (por ejemplo, infraestimación de pacientes activos o citas próximas).

**Severidad**: **Media**.

**Recomendación (tipo de test)**
- **Tests de integración de API** para estos endpoints, con fixtures controladas:
  - Poblaciones pequeñas de pacientes/citas y expectativas exactas de contadores y orden.
  - Casos borde: sin pacientes, sin citas, citas todas fuera de la ventana de 7 días.

---

#### 3.5 UI y flujo extremo a extremo (frontend)

**Área sin cobertura**
- Componentes en `src/ui/components/`:
  - Formularios de creación/edición de paciente, notas, medicaciones y citas (`CreatePatientForm`, `AddClinicalNoteForm`, `AddMedicationForm`, `AddAppointmentForm`, etc.).
  - Vistas como `PatientDetailView`, `Timeline`, `UpcomingAppointments`, `PatientStats`.
- Páginas en `src/app/patients/...` (rutas de Next.js) no tienen tests de integración/end-to-end.

**Riesgo asociado**
- **Riesgos de regresión UI**:
  - Cambios en los contratos de API (nombres de campos, formatos, códigos de error) pueden romper la UI sin señal temprana.
  - Validaciones duplicadas o contradictorias entre frontend y backend (p.ej. formato de email/fecha).
- **Riesgo clínico**:
  - Flujos críticos (crear paciente, documentar nota clínica, iniciar o detener medicación, registrar cita) pueden fallar silenciosamente por errores de wiring o parsing.

**Severidad**: **Alta** en términos de experiencia clínica real, aunque no tanto desde la perspectiva de integridad de datos en DB.

**Recomendación (tipo de test)**
- **Tests de componentes** (Jest/Vitest + React Testing Library) para formularios críticos:
  - Envío de datos válidos/ inválidos, despliegue de mensajes de error, deshabilitado de botones, etc.
- **Pruebas end-to-end ligeras** (por ejemplo con Playwright o Cypress) sobre los flujos clínicos clave:
  - Crear paciente → ver en lista → ver detalle.
  - Crear nota borrador → finalizar → ver aparición en timeline.
  - Iniciar medicación → ver medicación activa en vista y estado de timeline.
  - Agendar/cancelar cita → ver aparición/desaparición en panel de próximas citas.

---

#### 3.6 Cobertura cuantitativa (coverage)

**Área sin cobertura**
- No se observa configuración de cobertura (por ejemplo, `coverage` en `vitest.config.ts`), ni reportes en `code_audit/`.

**Riesgo asociado**
- Difícil priorización: sin números de coverage, es complejo argumentar dónde invertir esfuerzo de testing y monitorear regresiones.
- Zonas silenciosas: módulos nuevos pueden quedar completamente sin tests sin que sea evidente.

**Severidad**: **Media**.

**Recomendación (tipo de test / tooling)**
- Habilitar **coverage de Vitest** (statement/branch/function/line) y:
  - Definir umbrales mínimos globales y, si es posible, por carpeta (p.ej. más alto en `domain/` y `src/app/api/`).
  - Integrarlo con CI para visibilidad continua.

---

### 4. Calidad de los tests existentes

- **Puntos fuertes**:
  - **Orientados a especificaciones clínicas**: los invariantes traducen documentos de diseño clínico a tests concretos, lo que es excepcionalmente bueno para auditoría.
  - **Alto foco en integridad histórica y de timeline**: se cubren escenarios muy específicos de backdating, inmutabilidad, cadenas de versiones y errores de contrato.
  - **Uso correcto de fixtures y helpers**: `test-fixtures` y `test-helpers` reducen duplicación y hacen los tests legibles.
  - **Buena separación de responsabilidades**: tests de CRUD de paciente vs invariantes de timeline vs contratos.

- **Limitaciones**:
  - **Visión parcial del sistema**: se testea muy bien el core de dominio/timeline, pero casi nada de la **superficie consumida por usuarios/otros sistemas** (API + UI).
  - **Dependencia fuerte de la base de datos**: todos los tests son de integración con Prisma/DB, lo que es bueno para realismo pero puede ser frágil/lento y dificulta aislar errores lógicos.
  - **Sin validación de resiliencia a entradas mal formadas en HTTP**.

En conjunto, la **calidad intrínseca** de los tests actuales es alta, pero **la cobertura es profundamente sesgada hacia el dominio/timeline**.

---

### 5. Resumen de hallazgos (formato solicitado)

A continuación, se listan hallazgos clave en el formato requerido (área sin cobertura, riesgo, severidad, recomendación).

#### Hallazgo 1: Rutas API HTTP sin tests

1. **Área sin cobertura**
   - Handlers de Next.js en `src/app/api/...` (pacientes, citas, medicaciones, notas, timeline, stats).
2. **Riesgo asociado**
   - Errores de parseo (fechas, tipos), códigos HTTP incorrectos, mensajes de error inconsistentes.
   - Alto impacto operativo y clínico, pues es la interfaz real de consumo.
3. **Severidad**
   - **Alta**.
4. **Recomendación (tipo de test)**
   - **Tests de integración HTTP** contra los handlers utilizando Vitest.
   - Enfocar primero en endpoints clínicamente críticos: creación/actualización de paciente, notas, medicaciones, citas y timeline.

#### Hallazgo 2: Servicios de medicación y notas sin tests directos

1. **Área sin cobertura**
   - `domain/medications/medication-service`, `domain/notes/note-service` (lógica de negocio principal de medicación y notas).
2. **Riesgo asociado**
   - Regla clínica implementada de forma incorrecta puede no ser detectada, siempre que los invariantes sigan pasando con datos “ideales”.
   - Inconsistencias entre eventos de timeline y estados internos creados por los servicios.
3. **Severidad**
   - **Alta**.
4. **Recomendación (tipo de test)**
   - **Tests de integración de dominio** sobre estos servicios, verificando tanto el estado en DB como los eventos emitidos y códigos de error/resultados devueltos.

#### Hallazgo 3: `AppointmentService` sin cobertura

1. **Área sin cobertura**
   - `domain/appointments/service.ts` y validaciones asociadas.
2. **Riesgo asociado**
   - Citas mal agendadas, imposibles de cancelar o actualizar correctamente.
   - Inconsistencias de negocio (p.ej. permitir cambios sobre citas ya canceladas/completadas).
3. **Severidad**
   - **Media-Alta**.
4. **Recomendación (tipo de test)**
   - **Tests unitarios de servicio** centrados en reglas de negocio y códigos de error.
   - Complementarlos con tests de integración de API para rutas de citas.

#### Hallazgo 4: Estadísticas y consultas agregadas sin validación

1. **Área sin cobertura**
   - `/api/stats/patients` y `/api/appointments/upcoming`.
2. **Riesgo asociado**
   - Dashboards y paneles de gestión pueden mostrar información incorrecta.
   - Errores de límite de fechas (inicio/fin del día, ventana de 7 días) y conteos.
3. **Severidad**
   - **Media**.
4. **Recomendación (tipo de test)**
   - **Tests de integración de API** con datasets controlados para verificar conteos y orden.

#### Hallazgo 5: UI sin tests (componentes y flujos)

1. **Área sin cobertura**
   - Componentes React de `src/ui/components` y páginas de `src/app/patients/...`.
2. **Riesgo asociado**
   - Flujos clínicos completos (crear paciente, nota, medicación, cita) pueden romperse sin detección temprana.
   - Validaciones inconsistentes entre frontend y backend.
3. **Severidad**
   - **Alta** desde la perspectiva de la experiencia del usuario clínico.
4. **Recomendación (tipo de test)**
   - **Tests de componentes** para formularios y vistas clave.
   - **Tests end-to-end** ligeros centrados en los principales flujos clínicos.

#### Hallazgo 6: Falta de medición de cobertura

1. **Área sin cobertura**
   - Ausencia de configuración/reportes de coverage (statements, branches, lines) en Vitest.
2. **Riesgo asociado**
   - Dificultad para priorizar y monitorear la calidad global del testing.
3. **Severidad**
   - **Media**.
4. **Recomendación (tipo de test/tooling)**
   - Activar **coverage** en `vitest.config.ts` y establecer umbrales mínimos.

---

### 6. Conclusión

- **Fortalezas**: la suite actual es sólida y detallada en la **capa de dominio/timeline**, con foco fuerte en invariantes clínicamente relevantes (inmutabilidad, backdating, consistencia de eventos y estados). Esto aporta una base muy robusta para la integridad de la historia clínica.
- **Debilidades**: falta cobertura en la **interfaz real** del sistema (API + UI) y en algunos servicios de negocio críticos (medicación, notas, citas), junto con ausencia de métricas cuantitativas de cobertura.
- **Prioridad recomendada**: primero incorporar tests de integración HTTP para endpoints clínicos clave y tests de servicios de medicación/notas/citas; en paralelo activar coverage y, en una segunda fase, añadir pruebas de UI/end-to-end para los flujos clínicos más críticos.