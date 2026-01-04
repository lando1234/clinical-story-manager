# Auditoría de Inconsistencias — Sistema de Historias Clínicas Psiquiátricas

## Overview

Este documento identifica inconsistencias detectadas en el conjunto completo de especificaciones del sistema. Las inconsistencias se clasifican según su tipo y se evalúa su riesgo y severidad.

**Fecha de auditoría:** 2024  
**Alcance:** Todas las especificaciones en `docs/specs/`  
**Metodología:** Análisis cruzado de documentos, detección de contradicciones semánticas, temporales, funcionales y de alcance

---

## INC-01 — Conflicto Semántico: Encounter vs NOTE como Tipos de Evento

- **Tipo:** Semántica / Eventos
- **Specs involucradas:**
  - `02_events/22_nota_clinica_evento_note.md` (líneas 12-14, 235-240, 614-640)
  - `02_events/23_encounter_appointment_spec.md` (líneas 1-24, 147, 327)
  - `03_timeline/03_timeline.md` (líneas 59-66, 109-117)
  - `03_timeline/13_timeline_engine.md` (líneas 230-250)
  - `03_timeline/14_timeline_contracts.md` (líneas 574-628)
  - `15_timeline_qa_invariants.md` (líneas 345-351)
- **Descripción:**
  
  Existe una contradicción fundamental sobre la existencia del tipo de evento "Encounter":
  
  **Posición A (22_nota_clinica_evento_note.md):**
  - Establece explícitamente: "Encounter NO existe como tipo de evento" (línea 12)
  - Declara que al finalizar una Nota se crea un evento de tipo "NOTE"
  - Prohíbe el uso de "Encounter" como tipo de evento
  - Define que el único tipo relacionado con Notas es "NOTE"
  
  **Posición B (23_encounter_appointment_spec.md y specs base):**
  - Define "Encounter" como un tipo de evento válido para turnos agendados
  - Establece que `eventType = Encounter` para eventos derivados de Appointments
  - `03_timeline.md` lista "Encounter" como tipo de evento para encuentros clínicos
  - `13_timeline_engine.md` define "Encounter" como evento generado por Notes finalizadas
  - `14_timeline_contracts.md` tiene un contrato WRITE-EVENT-ENCOUNTER
  - `15_timeline_qa_invariants.md` referencia eventos Encounter en invariantes
  
  **Conflicto específico:**
  - `22_nota_clinica_evento_note.md` línea 109: "A finalized Note generates exactly one Encounter event" contradice su propia regla de exclusión
  - `03_timeline.md` línea 111: "A finalized Note generates exactly one Encounter event" usa el término prohibido
  - `13_timeline_engine.md` línea 230: Define "Encounter" como tipo de evento para Notes finalizadas
  - `23_encounter_appointment_spec.md` define "Encounter" para Appointments, creando ambigüedad sobre qué entidad genera qué tipo
  
- **Riesgo:**
  - **Clínico:** Alto — Implementaciones podrían generar eventos incorrectos, confundiendo encuentros documentados (NOTE) con turnos agendados (Encounter)
  - **Técnico:** Alto — Contratos y tipos de eventos contradictorios generan implementaciones inconsistentes
  - **Test:** Alto — Invariantes y tests pueden validar comportamientos opuestos
  - **Mantenimiento:** Alto — Documentación contradictoria genera confusión en desarrollo futuro
  
- **Severidad:** Alta

---

## INC-02 — Evento Fundacional No Integrado en Especificaciones Base

- **Tipo:** Funcional / Eventos
- **Specs involucradas:**
  - `02_events/21_foundational_timeline_event.md` (documento completo)
  - `03_timeline/03_timeline.md` (no menciona Foundational)
  - `03_timeline/13_timeline_engine.md` (no menciona Foundational)
  - `03_timeline/14_timeline_contracts.md` (no menciona Foundational)
  - `03_timeline/15_timeline_qa_invariants.md` (no menciona Foundational)
  - `01_domain/02_domain.md` (no menciona Foundational)
- **Descripción:**
  
  El documento `21_foundational_timeline_event.md` define un nuevo tipo de evento "Foundational" (o "Fundacional") que:
  - Debe crearse automáticamente con cada ClinicalRecord
  - Tiene prioridad 0 (más alta) en ordenamiento
  - Garantiza que el timeline nunca esté vacío
  - Es inmutable y no eliminable
  
  Sin embargo, este tipo de evento:
  - **NO aparece** en la enumeración de tipos de evento en `03_timeline.md` (líneas 58-98)
  - **NO está** en la lista de tipos de evento en `13_timeline_engine.md` (líneas 226-409)
  - **NO tiene** contrato definido en `14_timeline_contracts.md`
  - **NO está** cubierto por invariantes en `15_timeline_qa_invariants.md`
  - **NO se menciona** en el modelo de dominio `02_domain.md`
  
  **Conflicto de ordenamiento:**
  - `21_foundational_timeline_event.md` línea 87: Foundational tiene prioridad 0
  - `13_timeline_engine.md` líneas 438-447: La prioridad más alta es Encounter (1)
  - `14_timeline_contracts.md` línea 84: Encounter tiene prioridad 1 (más alta)
  
  Esto crea una inconsistencia en las reglas de ordenamiento: si Foundational existe con prioridad 0, debe aparecer en todas las especificaciones de ordenamiento.
  
- **Riesgo:**
  - **Clínico:** Medio — Timeline podría no mostrar el evento fundacional o mostrarlo en orden incorrecto
  - **Técnico:** Alto — Implementación sin guía clara sobre cómo manejar este tipo de evento
  - **Test:** Medio — Invariantes no validan la existencia del evento fundacional
  - **Mantenimiento:** Medio — Especificación aislada puede ser ignorada o malinterpretada
  
- **Severidad:** Alta

---

## INC-03 — Campos de Medication No Actualizados Según Especificación de Cambios

- **Tipo:** Temporal / Semántica
- **Specs involucradas:**
  - `02_events/22_cambios_medicacion_actualizacion.md` (documento completo — especifica cambios)
  - `01_domain/02_domain.md` (líneas 205-235 — usa campos antiguos)
  - `01_domain/10_data_models.md` (líneas 198-234 — usa campos antiguos)
  - `02_events/21_ajuste_dosis_medicamentos.md` (líneas 84, 121, 136, 153, 172, 180, 293, 328, 622, 701, 778 — usa `startDate`)
  - `03_timeline/14_timeline_contracts.md` (líneas 646, 662, 669, 694, 710, 717, 753 — usa `start_date` y `prescribing_reason`)
  - `03_timeline/15_timeline_qa_invariants.md` (líneas 189, 281, 301, 433, 583 — usa `start_date`)
  - `99_appendix/04_use_cases.md` (líneas 365-435 — usa campos antiguos)
- **Descripción:**
  
  El documento `22_cambios_medicacion_actualizacion.md` especifica cambios que deben aplicarse:
  
  1. **Eliminación de `route` (vía de administración):**
     - `22_cambios_medicacion_actualizacion.md` líneas 9-12: Eliminar campo `route`
     - `02_domain/02_domain.md` línea 211: Aún lista "Route of administration" como atributo
     - `02_domain/10_data_models.md` línea 213: Aún incluye `route | Text (nullable)`
     - `21_ajuste_dosis_medicamentos.md` línea 24: Aún menciona "Vía de administración" como parámetro ajustable
  
  2. **Renombramiento `startDate` → `prescriptionIssueDate`:**
     - `22_cambios_medicacion_actualizacion.md` líneas 15-18, 97-150: Especifica el cambio semántico
     - `02_domain/02_domain.md` línea 212: Aún usa "Start date"
     - `02_domain/10_data_models.md` línea 214: Aún usa `start_date`
     - `21_ajuste_dosis_medicamentos.md`: Múltiples referencias a `startDate` sin actualizar
     - `14_timeline_contracts.md` líneas 646, 662, 669: Usa `Medication.start_date`
     - `15_timeline_qa_invariants.md` líneas 281, 301: Usa `start_date`
  
  3. **Renombramiento `prescribingReason` → `comments` (opcional):**
     - `22_cambios_medicacion_actualizacion.md` líneas 26-29, 152-205: Especifica el cambio
     - `02_domain/02_domain.md` línea 214: Aún usa "Prescribing reason"
     - `02_domain/10_data_models.md` línea 216: Aún usa `prescribing_reason | Text`
     - `14_timeline_contracts.md` línea 648: Usa `Medication.prescribing_reason`
     - `04_use_cases.md` línea 431: Valida "Prescribing reason" como requerido
  
  **Estado:** El documento de actualización existe pero los cambios NO se han propagado a las specs base. Esto crea un estado de inconsistencia donde:
  - Una spec dice "eliminar route"
  - Otras specs aún definen y usan route
  - Una spec dice "usar prescriptionIssueDate"
  - Otras specs aún usan startDate
  
- **Riesgo:**
  - **Clínico:** Medio — Implementación podría usar campos incorrectos o faltantes
  - **Técnico:** Alto — Especificaciones contradictorias generan implementaciones inconsistentes
  - **Test:** Alto — Tests pueden validar campos que ya no deberían existir
  - **Mantenimiento:** Alto — Desarrolladores no saben qué versión de los campos es la correcta
  
- **Severidad:** Alta

---

## INC-04 — Nuevo Tipo de Evento MedicationPrescriptionIssued No Integrado

- **Tipo:** Funcional / Eventos
- **Specs involucradas:**
  - `02_events/22_cambios_medicacion_actualizacion.md` (líneas 19-20, 264-403 — define el nuevo tipo)
  - `03_timeline/03_timeline.md` (líneas 58-98 — no incluye MedicationPrescriptionIssued)
  - `03_timeline/13_timeline_engine.md` (líneas 226-409 — no incluye MedicationPrescriptionIssued)
  - `03_timeline/14_timeline_contracts.md` (no tiene contrato WRITE-EVENT-MEDICATION-PRESCRIPTION-ISSUED)
  - `03_timeline/15_timeline_qa_invariants.md` (no cubre este tipo de evento)
- **Descripción:**
  
  `22_cambios_medicacion_actualizacion.md` introduce un nuevo tipo de evento:
  - **MedicationPrescriptionIssued** (Nueva Receta Emitida)
  - Se genera cuando se emite una nueva receta sin modificar parámetros posológicos
  - Tiene reglas de validación específicas (R-VAL-1, R-VAL-2, R-VAL-3, R-VAL-4)
  
  Sin embargo:
  - **NO aparece** en la enumeración de tipos de evento en `03_timeline.md`
  - **NO está** en la lista de tipos en `13_timeline_engine.md`
  - **NO tiene** contrato en `14_timeline_contracts.md` (aunque el documento de actualización línea 715 dice que requiere uno)
  - **NO está** cubierto por invariantes en `15_timeline_qa_invariants.md`
  - **NO tiene** prioridad definida en las reglas de ordenamiento
  
  **Conflicto de ordenamiento:**
  - Las reglas de ordenamiento en `13_timeline_engine.md` líneas 438-447 no incluyen MedicationPrescriptionIssued
  - No está claro dónde se ordena este evento en relación con Medication Start, Change, Stop
  
- **Riesgo:**
  - **Clínico:** Medio — Eventos de nueva receta podrían no generarse o generarse incorrectamente
  - **Técnico:** Alto — Tipo de evento sin definición completa en specs base
  - **Test:** Medio — Invariantes no validan este tipo de evento
  - **Mantenimiento:** Medio — Especificación aislada puede ser ignorada
  
- **Severidad:** Alta

---

## INC-05 — Contradicción en Generación de Eventos para Notes Finalizadas

- **Tipo:** Funcional / Eventos
- **Specs involucradas:**
  - `02_events/22_nota_clinica_evento_note.md` (líneas 12-14, 189-204, 414-420 — dice que genera NOTE)
  - `03_timeline/03_timeline.md` (líneas 109-117 — dice que genera Encounter)
  - `03_timeline/13_timeline_engine.md` (líneas 230-250 — dice que genera Encounter)
  - `03_timeline/14_timeline_contracts.md` (líneas 574-628 — contrato WRITE-EVENT-ENCOUNTER)
- **Descripción:**
  
  Existe una contradicción sobre qué tipo de evento genera una Note finalizada:
  
  **Posición A (22_nota_clinica_evento_note.md):**
  - Línea 12: "Encounter NO existe como tipo de evento"
  - Línea 13: "Al finalizar una Nota clínica se crea un evento NOTE"
  - Línea 414: "Sistema genera automáticamente el Evento NOTE"
  - Línea 416: "eventType = NOTE"
  
  **Posición B (03_timeline.md, 13_timeline_engine.md, 14_timeline_contracts.md):**
  - `03_timeline.md` línea 111: "A finalized Note generates exactly one Encounter event"
  - `13_timeline_engine.md` línea 230: Define "Encounter" como tipo generado por Notes finalizadas
  - `14_timeline_contracts.md` línea 576: Contrato "WRITE-EVENT-ENCOUNTER" para Notes finalizadas
  - `14_timeline_contracts.md` línea 600: "event_type | Constant: 'Encounter'"
  
  **Conflicto directo:**
  - Mismo trigger (Note finalizada) genera tipos de evento diferentes según qué spec se lea
  - Los contratos del Timeline Engine esperan "Encounter"
  - La spec de separación NOTE/Encounter prohíbe "Encounter" y requiere "NOTE"
  
- **Riesgo:**
  - **Clínico:** Alto — Implementación podría generar tipo incorrecto, afectando ordenamiento y presentación
  - **Técnico:** Crítico — Contratos y tipos de eventos contradictorios imposibilitan implementación consistente
  - **Test:** Alto — Tests validarían comportamientos opuestos
  - **Mantenimiento:** Crítico — Imposible determinar qué tipo de evento es correcto
  
- **Severidad:** Crítica

---

## INC-06 — Ambigüedad en Ordenamiento de Tipos de Evento

- **Tipo:** Temporal / Funcional
- **Specs involucradas:**
  - `03_timeline/13_timeline_engine.md` (líneas 438-447 — lista de prioridades)
  - `03_timeline/14_timeline_contracts.md` (línea 84 — lista de prioridades)
  - `02_events/21_foundational_timeline_event.md` (línea 87 — Foundational con prioridad 0)
  - `02_events/22_cambios_medicacion_actualizacion.md` (no define prioridad para MedicationPrescriptionIssued)
- **Descripción:**
  
  Las reglas de ordenamiento por tipo de evento son inconsistentes:
  
  **En 13_timeline_engine.md líneas 438-447:**
  - Priority 1: Encounter
  - Priority 2: Medication Start
  - Priority 3: Medication Change
  - Priority 4: Medication Stop
  - Priority 5: Hospitalization
  - Priority 6: Life Event
  - Priority 7: History Update
  - Priority 8: Other
  
  **Problemas:**
  1. **Foundational no está en la lista:** `21_foundational_timeline_event.md` dice que tiene prioridad 0 (más alta), pero no aparece en las reglas de ordenamiento base
  2. **MedicationPrescriptionIssued no está en la lista:** El nuevo tipo de evento no tiene prioridad definida
  3. **NOTE vs Encounter:** Si NOTE existe como tipo (según `22_nota_clinica_evento_note.md`), no tiene prioridad definida
  
  **Conflicto de prioridades:**
  - Si Foundational tiene prioridad 0, debe aparecer primero en todas las listas de ordenamiento
  - Si MedicationPrescriptionIssued existe, necesita una prioridad (¿entre Medication Start y Change? ¿después de Stop?)
  - Si NOTE reemplaza a Encounter, ¿mantiene la prioridad 1?
  
- **Riesgo:**
  - **Clínico:** Medio — Eventos podrían ordenarse incorrectamente en la timeline
  - **Técnico:** Alto — Algoritmo de ordenamiento incompleto o contradictorio
  - **Test:** Medio — Invariantes de ordenamiento no cubren todos los tipos
  - **Mantenimiento:** Medio — Nuevos tipos de evento no tienen guía clara de prioridad
  
- **Severidad:** Alta

- **Estado:** ✅ RESUELTO

- **Resolución:**
  
  Se actualizaron las reglas de ordenamiento para resolver todas las ambigüedades:
  
  1. **Foundational (prioridad 0):** Confirmado como el evento con mayor prioridad, siempre aparece primero en la timeline.
  
  2. **MedicationPrescriptionIssued (prioridad 5):** Se asignó prioridad 5, posicionado entre Medication Change (prioridad 4) y Medication Stop (prioridad 6).
  
  3. **NOTE (sin prioridad fija):** Se estableció que los eventos NOTE no usan prioridad basada en tipo. Se ordenan puramente por:
     - Event timestamp (fecha clínica)
     - Recorded timestamp (fecha de documentación)
     - Event identifier (identificador único)
  
  **Prioridades finales:**
  - 0: Foundational
  - 2: Encounter
  - 3: Medication Start
  - 4: Medication Change
  - 5: Medication Prescription Issued
  - 6: Medication Stop
  - 7: Hospitalization
  - 8: Life Event
  - 9: History Update
  - 10: Other
  
  **Archivos actualizados:**
  - `03_timeline/13_timeline_engine.md` — Sección 4.3 actualizada con nueva tabla de prioridades y explicación de ordenamiento de NOTE
  - `03_timeline/14_timeline_contracts.md` — Contrato G-ORD-2 actualizado
  - `01_domain/10_data_models.md` — Sección 3.1 actualizada con lista completa de prioridades
  - `src/types/timeline.ts` — Constante EVENT_TYPE_PRIORITY actualizada
  - `src/domain/timeline/timeline-reader.ts` — Función applyFourTierOrdering actualizada con manejo especial para eventos NOTE

---

## INC-07 — Inconsistencia en Campos Requeridos de Medication

- **Tipo:** Funcional
- **Specs involucradas:**
  - `01_domain/02_domain.md` (líneas 225-234 — reglas de negocio)
  - `01_domain/10_data_models.md` (líneas 563-564 — campos requeridos)
  - `02_events/22_cambios_medicacion_actualizacion.md` (líneas 26-29, 152-205 — prescribingReason → comments opcional)
  - `99_appendix/04_use_cases.md` (líneas 422-434 — validaciones)
  - `03_timeline/14_timeline_contracts.md` (líneas 667-670 — validaciones)
- **Descripción:**
  
  Existe inconsistencia sobre qué campos de Medication son requeridos:
  
  **prescribingReason / comments:**
  - `02_domain/02_domain.md` línea 214: Lista "Prescribing reason" sin indicar si es requerido
  - `10_data_models.md` línea 216: `prescribing_reason | Text` (sin nullable, implica requerido)
  - `04_use_cases.md` línea 431: "Prescribing reason | Required"
  - `14_timeline_contracts.md` línea 670: "Medication.prescribing_reason is not empty"
  - `22_cambios_medicacion_actualizacion.md` líneas 26-29: Cambia a "comments" (opcional)
  - `22_cambios_medicacion_actualizacion.md` líneas 186-189: "description may be empty if comments are not provided"
  
  **route (vía de administración):**
  - `02_domain/02_domain.md` línea 211: Lista "Route of administration" sin clarificar requerimiento
  - `10_data_models.md` línea 213: `route | Text (nullable)` — opcional
  - `04_use_cases.md` línea 432: "Route of administration | Optional"
  - `22_cambios_medicacion_actualizacion.md` líneas 9-12: Debe eliminarse completamente
  
  **Conflicto:**
  - El documento de actualización dice eliminar `route`, pero otras specs aún lo definen como opcional (no eliminado)
  - El documento de actualización dice que `comments` es opcional, pero specs base dicen que `prescribing_reason` es requerido
  
- **Riesgo:**
  - **Clínico:** Medio — Validaciones podrían rechazar datos válidos o aceptar datos incompletos
  - **Técnico:** Medio — Implementación no sabe si validar campos que deberían eliminarse
  - **Test:** Medio — Tests validan campos que ya no deberían existir
  - **Mantenimiento:** Medio — Confusión sobre qué campos implementar
  
- **Severidad:** Media

- **Estado:** ✅ RESUELTO

- **Resolución:**
  
  Se estandarizaron los campos requeridos y opcionales de Medication en todas las especificaciones e implementación:
  
  **Campos Requeridos:**
  - `drug_name` (Nombre del medicamento): Requerido, no puede estar vacío
  - `dosage` (Dosis): Requerido, debe ser un valor positivo
  - `dosage_unit` (Unidades): Requerido, no puede estar vacío
  - `frequency` (Frecuencia): Requerido, no puede estar vacío
  - `prescription_issue_date` (Fecha de emisión de receta): Requerido, debe ser una fecha válida, no puede ser futura
  
  **Campos Opcionales:**
  - `comments` (Comentarios): Opcional, puede ser null o vacío
  - `end_date` (Fecha de fin): Opcional, requerido solo al discontinuar medicamento
  - `discontinuation_reason` (Razón de discontinuación): Opcional, requerido solo al discontinuar medicamento
  - `predecessor_id` (ID del predecesor): Opcional, usado para vincular cambios de dosis
  
  **Nota:** El campo `comments` es el nombre correcto (no `prescribingReason`). El campo `route` (vía de administración) fue eliminado según `22_cambios_medicacion_actualizacion.md`.
  
  **Archivos actualizados:**
  - `01_domain/02_domain.md` — Reglas de negocio actualizadas con lista explícita de campos requeridos y opcionales
  - `01_domain/10_data_models.md` — Verificado: campos requeridos no son nullable, campos opcionales son nullable
  - `99_appendix/04_use_cases.md` — Verificado: tabla de validación correcta, Comments marcado como Optional
  - `03_timeline/14_timeline_contracts.md` — Verificado: no hay validaciones que requieran prescribing_reason/comments
  - `src/types/medications.ts` — Verificado: validación correcta de campos requeridos, comments es opcional
  - `src/ui/components/AddMedicationForm.tsx` — Verificado: validación de formulario correcta, comments es opcional

---

## INC-08 — Contradicción en Origen de Eventos Encounter

- **Tipo:** Funcional / Eventos
- **Specs involucradas:**
  - `02_events/23_encounter_appointment_spec.md` (líneas 19-24, 180-200 — Encounter de Appointments)
  - `03_timeline/03_timeline.md` (líneas 109-117 — Encounter de Notes)
  - `03_timeline/13_timeline_engine.md` (líneas 230-250 — Encounter de Notes)
  - `02_events/22_nota_clinica_evento_note.md` (líneas 12-14 — prohíbe Encounter, requiere NOTE)
- **Descripción:**
  
  Existe ambigüedad sobre qué entidad genera eventos de tipo "Encounter":
  
  **Posición A (23_encounter_appointment_spec.md):**
  - Línea 19: "Un Evento Encounter es una instancia de `ClinicalEvent` con `eventType = Encounter` que representa que tuvo lugar un turno agendado"
  - Línea 23: "Es una instancia de `ClinicalEvent` con `eventType = Encounter`"
  - Línea 184: "Un Evento Encounter se crea automáticamente cuando se cumplen ambas condiciones: [Appointment pasado]"
  - Encounter se genera desde Appointments (turnos)
  
  **Posición B (03_timeline.md, 13_timeline_engine.md):**
  - `03_timeline.md` línea 111: "A finalized Note generates exactly one Encounter event"
  - `13_timeline_engine.md` línea 230: "Encounter" — "Generated By: Finalization of a Note entity"
  - Encounter se genera desde Notes finalizadas
  
  **Posición C (22_nota_clinica_evento_note.md):**
  - Línea 12: "Encounter NO existe como tipo de evento"
  - Línea 13: "Al finalizar una Nota clínica se crea un evento NOTE"
  - Prohíbe Encounter completamente
  
  **Conflicto:**
  - Mismo nombre de tipo de evento ("Encounter") usado para dos orígenes diferentes (Appointments vs Notes)
  - Una spec prohíbe el tipo completamente
  - No hay claridad sobre si Appointments y Notes pueden generar el mismo tipo o tipos diferentes
  
- **Riesgo:**
  - **Clínico:** Alto — Timeline podría mostrar eventos duplicados o confundir turnos con documentación
  - **Técnico:** Crítico — Implementación no puede determinar qué entidad genera qué tipo de evento
  - **Test:** Alto — Tests validarían comportamientos contradictorios
  - **Mantenimiento:** Crítico — Imposible implementar sin resolver la contradicción
  
- **Severidad:** Crítica

- **Estado:** ✅ RESUELTO

- **Resolución:**
  
  Se clarificó que tanto NOTE como Encounter son tipos de evento válidos, pero con orígenes diferentes:
  
  **Eventos NOTE:**
  - Generados por: Notes finalizadas (notas clínicas)
  - Representan: Documentación de encuentros clínicos
  - Source Type: `Note`
  - Event Type: `NOTE`
  - Contrato: WRITE-EVENT-NOTE
  
  **Eventos Encounter:**
  - Generados por: Appointments pasados (turnos agendados cuya fecha ya pasó)
  - Representan: Ocurrencia de turnos agendados
  - Source Type: `Appointment`
  - Event Type: `Encounter`
  - Contrato: WRITE-EVENT-ENCOUNTER
  
  **Separación conceptual:**
  - NOTE = documentación de encuentro clínico (desde Note entity)
  - Encounter = turno agendado que ocurrió (desde Appointment entity)
  - Son tipos de evento diferentes con fuentes diferentes
  - Ambos son válidos y coexisten en el sistema
  
  **Corrección principal:**
  - Se eliminó la sección incorrecta en `22_nota_clinica_evento_note.md` que decía "Encounter NO existe como tipo de evento"
  - Se actualizó para clarificar que Encounter es válido pero se genera desde Appointments, no desde Notes
  - Se agregó tabla comparativa que distingue claramente ambos tipos de evento
  
  **Archivos actualizados:**
  - `02_events/22_nota_clinica_evento_note.md` — Sección 3.5 actualizada: eliminada afirmación incorrecta, agregada clarificación sobre separación NOTE/Encounter
  - `03_timeline/03_timeline.md` — Verificado: correctamente distingue NOTE (desde Notes) vs Encounter (desde Appointments)
  - `03_timeline/13_timeline_engine.md` — Verificado: correctamente documenta ambos tipos de evento con sus fuentes
  - `03_timeline/14_timeline_contracts.md` — Verificado: ambos contratos WRITE-EVENT-NOTE y WRITE-EVENT-ENCOUNTER existen y están correctamente documentados

---

## INC-09 — Especificación de Actualización de Medication No Referenciada en Specs Base

- **Tipo:** De Alcance / Temporal
- **Specs involucradas:**
  - `02_events/22_cambios_medicacion_actualizacion.md` (documento completo)
  - `01_domain/02_domain.md` (no referencia el documento de actualización)
  - `01_domain/10_data_models.md` (no referencia el documento de actualización)
  - `03_timeline/14_timeline_contracts.md` (no referencia el documento de actualización)
- **Descripción:**
  
  El documento `22_cambios_medicacion_actualizacion.md` especifica cambios importantes al modelo de Medication:
  - Eliminación de campo `route`
  - Renombramiento semántico `startDate` → `prescriptionIssueDate`
  - Renombramiento `prescribingReason` → `comments` (opcional)
  - Nuevo tipo de evento `MedicationPrescriptionIssued`
  
  Sin embargo:
  - Las specs base (`02_domain.md`, `10_data_models.md`, `14_timeline_contracts.md`) **NO referencian** este documento de actualización
  - No hay indicación en las specs base de que existe una actualización pendiente
  - No hay versión o estado que indique qué specs están "obsoletas" vs "actuales"
  
  **Problema de estado:**
  - Un desarrollador leyendo solo las specs base no sabría que existen cambios especificados
  - No está claro si `22_cambios_medicacion_actualizacion.md` es una propuesta, una actualización pendiente, o una actualización ya aplicada pero no propagada
  
- **Riesgo:**
  - **Clínico:** Bajo — Afecta principalmente implementación
  - **Técnico:** Alto — Desarrolladores pueden implementar modelo obsoleto
  - **Test:** Medio — Tests pueden validar modelo incorrecto
  - **Mantenimiento:** Alto — Confusión sobre qué versión de las specs es la correcta
  
- **Severidad:** Media

- **Estado:** ✅ RESUELTO

- **Resolución:**

  Se agregaron referencias explícitas al documento de actualización `22_cambios_medicacion_actualizacion.md` en todas las specs base afectadas:

  1. **`01_domain/02_domain.md`:** Se agregó nota de referencia en la sección Medication que indica que el modelo refleja los cambios especificados en el documento de actualización.

  2. **`01_domain/10_data_models.md`:** Se agregó nota de referencia en la sección Medication que apunta al documento de actualización para detalles completos de cambios de campos.

  3. **`03_timeline/14_timeline_contracts.md`:** Se agregó sección "Related Documents" que incluye referencia al documento de actualización de Medication.

  **Resultado:**
  - Los desarrolladores ahora pueden identificar fácilmente el origen de los cambios en el modelo de Medication
  - Pueden consultar el documento de actualización para entender la justificación clínica completa
  - Las specs base están explícitamente vinculadas a la especificación de actualización

  **Archivos actualizados:**
  - `docs/specs/01_domain/02_domain.md` — Nota de referencia agregada en sección Medication
  - `docs/specs/01_domain/10_data_models.md` — Nota de referencia agregada en sección Medication
  - `docs/specs/03_timeline/14_timeline_contracts.md` — Sección "Related Documents" agregada

---

## INC-10 — Inconsistencia en Terminología: "Encuentro" vs "Turno" vs "Evento Encounter"

- **Tipo:** Semántica
- **Specs involucradas:**
  - `02_events/21_evento_encuentro_nota_clinica.md` (usa "Evento de Encuentro")
  - `02_events/22_nota_clinica_evento_note.md` (prohíbe "Encounter", usa "NOTE")
  - `02_events/23_encounter_appointment_spec.md` (usa "Evento Encounter" para turnos)
  - `03_timeline/03_timeline.md` (usa "Encounter Events" para encuentros clínicos)
  - `../code/auditoria_linguistica_ui.md` (documenta confusión terminológica)
- **Descripción:**
  
  Existe inconsistencia en la terminología usada para referirse a encuentros clínicos:
  
  **Términos encontrados:**
  1. **"Encuentro"** — Usado en `21_evento_encuentro_nota_clinica.md` para referirse al encuentro clínico documentado
  2. **"Evento de Encuentro"** — Usado en `21_evento_encuentro_nota_clinica.md` para el evento en timeline
  3. **"Evento NOTE"** — Usado en `22_nota_clinica_evento_note.md` para el evento generado por Notes
  4. **"Evento Encounter"** — Usado en `23_encounter_appointment_spec.md` para eventos de turnos
  5. **"Encounter"** — Usado en `03_timeline.md` para encuentros clínicos documentados
  6. **"Turno"** — Usado en `23_encounter_appointment_spec.md` para Appointments
  
  **Confusión semántica:**
  - "Encuentro" puede referirse al encuentro clínico (hecho) o al evento en timeline
  - "Encounter" se usa tanto para encuentros documentados (Notes) como para turnos (Appointments)
  - "Turno" se refiere a Appointment, pero el evento se llama "Encounter"
  - No está claro si "Encuentro" y "Encounter" son sinónimos o conceptos diferentes
  
  **Evidencia de confusión:**
  - `../code/auditoria_linguistica_ui.md` líneas 14-28 documenta errores de terminología en la implementación
  - Indica que hay confusión entre "encounter", "turno", y "nota clínica" en el código
  
- **Riesgo:**
  - **Clínico:** Medio — Usuarios podrían confundir conceptos en la UI
  - **Técnico:** Medio — Implementación inconsistente por ambigüedad terminológica
  - **Test:** Bajo — Afecta principalmente claridad
  - **Mantenimiento:** Alto — Documentación confusa dificulta desarrollo
  
- **Severidad:** Media

- **Estado:** ✅ RESUELTO

- **Resolución:**

  Se creó un glosario de terminología estándar y se actualizaron todas las especificaciones para usar consistentemente la terminología completa:

  1. **Glosario de términos:** Se creó `00_foundation/09_terminology_glossary.md` que define:
     - **Encuentro clínico** (siempre completo) = la interacción clínica documentada
     - **Turno agendado** (siempre completo) = la cita agendada (Appointment)
     - **Evento NOTE** = evento en timeline que representa documentación de un Encuentro clínico
     - **Evento Encounter** = evento en timeline que representa un Turno agendado que ya ocurrió

  2. **Actualización de documentos:**
     - `02_events/21_evento_encuentro_nota_clinica.md`: Reemplazado "Encuentro" por "Encuentro clínico", agregada referencia al glosario
     - `02_events/22_nota_clinica_evento_note.md`: Estandarizado uso de "Encuentro clínico", agregada referencia al glosario
     - `02_events/23_encounter_appointment_spec.md`: Estandarizado uso de "Turno agendado", agregada referencia al glosario
     - `03_timeline/03_timeline.md`: Agregadas referencias al glosario y clarificaciones terminológicas
     - `03_timeline/13_timeline_engine.md`: Agregadas referencias al glosario y clarificaciones terminológicas

  3. **Resultado:**
     - Todos los documentos usan "Encuentro clínico" (completo) para encuentros documentados
     - Todos los documentos usan "Turno agendado" (completo) para Appointments cuando se requiere claridad
     - Todos los documentos distinguen claramente entre "Evento NOTE" y "Evento Encounter"
     - El glosario está referenciado en los documentos principales
     - La terminología es consistente y no ambigua

  **Archivos actualizados:**
  - `docs/specs/00_foundation/09_terminology_glossary.md` — Glosario de términos estándar creado
  - `docs/specs/02_events/21_evento_encuentro_nota_clinica.md` — Terminología estandarizada, referencia al glosario agregada
  - `docs/specs/02_events/22_nota_clinica_evento_note.md` — Terminología estandarizada, referencia al glosario agregada
  - `docs/specs/02_events/23_encounter_appointment_spec.md` — Terminología estandarizada, referencia al glosario agregada
  - `docs/specs/03_timeline/03_timeline.md` — Referencias al glosario agregadas
  - `docs/specs/03_timeline/13_timeline_engine.md` — Referencias al glosario agregadas

---

## INC-11 — Reglas de Visibilidad Temporal de Eventos Encounter Contradictorias

- **Tipo:** Temporal / Funcional
- **Specs involucradas:**
  - `02_events/23_encounter_appointment_spec.md` (líneas 10-11, 234-273 — solo turnos pasados)
  - `03_timeline/03_timeline.md` (líneas 197-203 — eventos futuros prohibidos en general)
  - `03_timeline/13_timeline_engine.md` (líneas 493-503 — eventos futuros prohibidos)
- **Descripción:**
  
  Existe una regla específica para eventos Encounter de turnos que puede entrar en conflicto con reglas generales:
  
  **Regla específica (23_encounter_appointment_spec.md):**
  - Líneas 10-11: "Los eventos Encounter derivados de turnos SOLO deben mostrarse en la timeline si la fecha del turno ya pasó"
  - Línea 240: "Un Evento Encounter aparece en la timeline solo si: eventDate <= fecha actual"
  - Línea 261: "Turnos futuros NO generan eventos Encounter"
  
  **Regla general (03_timeline.md, 13_timeline_engine.md):**
  - `03_timeline.md` líneas 197-203: "The timeline does not display events with future occurrence dates"
  - `13_timeline_engine.md` líneas 493-503: "Events with event timestamps in the future are not permitted"
  
  **Potencial conflicto:**
  - La regla específica para Encounter de turnos es redundante si la regla general ya prohíbe eventos futuros
  - Sin embargo, la regla específica habla de "cuándo se crea" el evento, no solo "cuándo se muestra"
  - No está claro si la regla específica permite crear eventos Encounter con fecha futura pero ocultarlos, o si prohíbe su creación
  
  **Ambigüedad:**
  - `23_encounter_appointment_spec.md` línea 191: Menciona "Opción A: Creación automática al pasar la fecha" vs "Opción B: Creación bajo demanda"
  - Esto sugiere que los eventos se crean cuando la fecha pasa, no antes
  - Pero no está claro si esto es una excepción a la regla general o una aplicación de la misma
  
- **Riesgo:**
  - **Clínico:** Bajo — Afecta principalmente lógica de creación
  - **Técnico:** Medio — Implementación no tiene claridad sobre cuándo crear eventos de turnos
  - **Test:** Medio — Tests necesitan validar regla específica vs general
  - **Mantenimiento:** Medio — Redundancia puede generar confusión
  
- **Severidad:** Baja

- **Estado:** ✅ RESUELTO

- **Resolución:**
  
  Se clarificó que los eventos Encounter se crean inmediatamente al agendar turnos (tanto futuros como pasados), pero los eventos con fecha futura se filtran de la visualización de la timeline hasta que su fecha pase.
  
  **Cambios implementados:**
  
  1. **Creación inmediata:** Los eventos Encounter se crean al agendar el turno, independientemente de si la fecha es futura o pasada.
  
  2. **Filtrado en visualización:** Los eventos Encounter futuros existen en la base de datos pero se ocultan en la timeline hasta que la fecha pase.
  
  3. **Excepción explícita:** Se agregó una excepción explícita a la regla general de "prohibir eventos futuros" para eventos Encounter en todas las especificaciones relevantes.
  
  4. **Eliminación al cancelar/reprogramar:** Si un turno futuro se cancela o reprograma antes de su fecha, el evento Encounter asociado se elimina.
  
  5. **Visibilidad automática:** Cuando la fecha de un evento Encounter futuro pasa, el evento se hace visible automáticamente en la timeline sin intervención del sistema.
  
  **Archivos actualizados:**
  - `docs/specs/02_events/23_encounter_appointment_spec.md` — Actualizado para reflejar creación inmediata y filtrado de futuros
  - `docs/specs/03_timeline/03_timeline.md` — Agregada excepción explícita para eventos Encounter
  - `docs/specs/03_timeline/13_timeline_engine.md` — Actualizada sección 4.7 con excepción para Encounter
  - `docs/specs/03_timeline/14_timeline_contracts.md` — Actualizado contrato WRITE-EVENT-ENCOUNTER para permitir fechas futuras
  - `docs/specs/03_timeline/15_timeline_qa_invariants.md` — Actualizado INV-TEMP-09 con excepción para Encounter
  - `src/domain/appointments/encounter-event-generator.ts` — Eliminada validación de fecha futura, agregada función de eliminación
  - `src/domain/appointments/service.ts` — Integrada creación/eliminación de eventos Encounter en operaciones de appointments
  - `src/domain/timeline/timeline-reader.ts` — Verificado filtrado de eventos Encounter futuros (ya implementado)
  - `src/tests/invariants/clinical-state.test.ts` — Actualizados tests para reflejar nuevo comportamiento

---

## INC-12 — Patient Creation: Generación de Eventos vs No Generación

- **Tipo:** Funcional / Eventos
- **Specs involucradas:**
  - `01_domain/18_patient_crud_specs.md` (líneas 191-197 — explícitamente NO genera eventos)
  - `02_events/21_foundational_timeline_event.md` (líneas 95-103 — crea Evento Fundacional al crear ClinicalRecord)
  - `03_timeline/13_timeline_engine.md` (líneas 112-118 — Patient no genera eventos)
  - `99_appendix/04_use_cases.md` (líneas 13-66 — UC-01 no menciona eventos)
- **Descripción:**
  
  Existe una aparente contradicción sobre si la creación de Patient genera eventos:
  
  **Posición A (18_patient_crud_specs.md, 13_timeline_engine.md):**
  - `18_patient_crud_specs.md` línea 191: "Patient creation does NOT generate timeline events"
  - `18_patient_crud_specs.md` línea 197: "Explicit Guarantee: No ClinicalEvent is created when a Patient is created"
  - `13_timeline_engine.md` línea 114: "Patient: Registration does not appear on the clinical timeline"
  
  **Posición B (21_foundational_timeline_event.md):**
  - Líneas 95-103: Al crear Patient → se crea ClinicalRecord → se crea Evento Fundacional
  - Línea 102: "Se crea automáticamente el Evento Fundacional"
  - El Evento Fundacional se crea como parte de la creación del ClinicalRecord (que se crea con el Patient)
  
  **Análisis:**
  - Técnicamente no hay contradicción: Patient creation no genera eventos DIRECTAMENTE
  - Pero Patient creation genera ClinicalRecord, que genera Evento Fundacional
  - La garantía en `18_patient_crud_specs.md` podría interpretarse como "ningún evento" vs "ningún evento directo"
  
  **Ambigüedad:**
  - `18_patient_crud_specs.md` dice "Patient creation does NOT generate timeline events" pero el Evento Fundacional SÍ aparece en el timeline
  - No está claro si el Evento Fundacional cuenta como "evento de timeline" en el contexto de la garantía
  
- **Riesgo:**
  - **Clínico:** Bajo — Afecta principalmente interpretación de garantías
  - **Técnico:** Bajo — La implementación puede ser correcta, pero la documentación es ambigua
  - **Test:** Bajo — Tests pueden validar correctamente, pero la especificación es confusa
  - **Mantenimiento:** Medio — Ambigüedad en garantías puede generar confusión
  
- **Severidad:** Baja

---

## INC-13 — Especificaciones de Separación NOTE/Encounter No Referenciadas en Timeline Engine

- **Tipo:** De Alcance / Funcional
- **Specs involucradas:**
  - `02_events/21_evento_encuentro_nota_clinica.md` (define separación Encounter/Note)
  - `02_events/22_nota_clinica_evento_note.md` (define separación NOTE/Nota, prohíbe Encounter)
  - `02_events/23_encounter_appointment_spec.md` (define Encounter para turnos)
  - `03_timeline/13_timeline_engine.md` (no referencia estos documentos)
  - `03_timeline/14_timeline_contracts.md` (no referencia estos documentos)
- **Descripción:**
  
  Existen tres documentos específicos sobre separación de eventos:
  - `21_evento_encuentro_nota_clinica.md` — Define separación entre Evento de Encuentro y Nota Clínica
  - `22_nota_clinica_evento_note.md` — Define separación entre Nota Clínica y Evento NOTE (prohíbe Encounter)
  - `23_encounter_appointment_spec.md` — Define Eventos Encounter de turnos
  
  Sin embargo:
  - `13_timeline_engine.md` **NO referencia** estos documentos en sus secciones de tipos de evento
  - `14_timeline_contracts.md` **NO referencia** estos documentos en sus contratos
  - El Timeline Engine usa terminología que contradice las especificaciones de separación
  
  **Problema:**
  - Las specs de separación son más recientes/detalladas pero no están integradas en las specs base del Timeline Engine
  - Un desarrollador leyendo solo `13_timeline_engine.md` no sabría que existe una especificación que prohíbe "Encounter" como tipo de evento
  - Los contratos en `14_timeline_contracts.md` usan "WRITE-EVENT-ENCOUNTER" que contradice la prohibición en `22_nota_clinica_evento_note.md`
  
- **Riesgo:**
  - **Clínico:** Medio — Timeline Engine podría implementarse sin considerar las especificaciones de separación
  - **Técnico:** Alto — Especificaciones aisladas generan implementaciones inconsistentes
  - **Test:** Medio — Tests del Timeline Engine no validan reglas de separación
  - **Mantenimiento:** Alto — Especificaciones desconectadas generan confusión
  
- **Severidad:** Alta

---

## INC-14 — Inconsistencia en Validación de Fechas Futuras para Medications

- **Tipo:** Temporal / Funcional
- **Specs involucradas:**
  - `99_appendix/04_use_cases.md` (línea 430 — "Cannot be in the future for new medications")
  - `99_appendix/05_edge_cases.md` (líneas 532-541 — marca como resuelto: futuras prohibidas)
  - `02_events/22_cambios_medicacion_actualizacion.md` (línea 226 — "prescriptionIssueDate no puede ser futura")
  - `03_timeline/14_timeline_contracts.md` (línea 669 — "Medication.start_date is a valid date not in the future")
- **Descripción:**
  
  Existe una ambigüedad en la validación de fechas futuras:
  
  **Regla en 04_use_cases.md:**
  - Línea 430: "Start date | Required. Must be a valid date. Cannot be in the future for new medications"
  - La frase "for new medications" sugiere que podría haber excepciones
  
  **Regla en 05_edge_cases.md:**
  - Líneas 532-541: Marca como resuelto que futuras están prohibidas
  - Línea 541: "Planned future prescriptions are documented in the encounter note's Plan section, not as medication entries"
  
  **Regla en 22_cambios_medicacion_actualizacion.md:**
  - Línea 226: "prescriptionIssueDate no puede ser futura"
  - Sin calificadores
  
  **Regla en 14_timeline_contracts.md:**
  - Línea 669: "Medication.start_date is a valid date not in the future"
  - Sin excepciones
  
  **Ambigüedad:**
  - La redacción "for new medications" en UC-04 sugiere que medicamentos existentes podrían tener fechas futuras (¿en ajustes?)
  - Pero otras specs prohíben fechas futuras sin excepciones
  - No está claro si un ajuste de dosis con fecha futura está permitido
  
- **Riesgo:**
  - **Clínico:** Bajo — Afecta principalmente validación de entrada
  - **Técnico:** Medio — Implementación no sabe si permitir excepciones
  - **Test:** Bajo — Tests pueden validar correctamente con regla estricta
  - **Mantenimiento:** Bajo — Ambigüedad menor, fácil de resolver
  
- **Severidad:** Baja

---

## INC-15 — Contradicción en Inmutabilidad de Eventos: Foundational vs Otros Eventos

- **Tipo:** Funcional
- **Specs involucradas:**
  - `02_events/21_foundational_timeline_event.md` (líneas 291-316 — inmutabilidad completa)
  - `03_timeline/13_timeline_engine.md` (líneas 525-556 — inmutabilidad de eventos)
  - `03_timeline/14_timeline_contracts.md` (líneas 872-891 — contrato IMMUTABLE-EVENT)
- **Descripción:**
  
  El Evento Fundacional tiene reglas de inmutabilidad que son idénticas a otros eventos, pero se documentan de forma separada:
  
  **21_foundational_timeline_event.md:**
  - Líneas 291-316: Documenta extensamente la inmutabilidad del Evento Fundacional
  - Línea 311: "A diferencia de otros eventos que podrían tener mecanismos de corrección (addenda, versiones), el Evento Fundacional no tiene mecanismos de modificación"
  
  **13_timeline_engine.md:**
  - Líneas 525-556: Establece inmutabilidad para todos los eventos
  - Línea 555: "No exceptions exist for these attributes"
  
  **Análisis:**
  - Técnicamente no hay contradicción: ambos dicen que los eventos son inmutables
  - Pero la documentación del Evento Fundacional sugiere que otros eventos "podrían tener mecanismos de corrección"
  - Esto contradice la regla general de que los eventos son inmutables sin excepciones
  
  **Conflicto implícito:**
  - La frase "A diferencia de otros eventos que podrían tener mecanismos de corrección" sugiere que otros eventos tienen mecanismos de corrección
  - Pero las specs base dicen que los eventos son inmutables sin excepciones
  - No está claro si esta es una redacción incorrecta o si hay una excepción no documentada
  
- **Riesgo:**
  - **Clínico:** Bajo — No afecta comportamiento, solo documentación
  - **Técnico:** Bajo — Implementación correcta, documentación confusa
  - **Test:** Bajo — No afecta validación
  - **Mantenimiento:** Medio — Documentación contradictoria puede generar confusión
  
- **Severidad:** Baja

---

## Resumen Ejecutivo

### Inconsistencias Críticas (Severidad: Crítica)
- **INC-05:** Contradicción en generación de eventos para Notes finalizadas (Encounter vs NOTE)
- **INC-08:** Contradicción en origen de eventos Encounter (Appointments vs Notes)

### Inconsistencias de Alta Severidad
- **INC-01:** Conflicto semántico Encounter vs NOTE como tipos de evento
- **INC-02:** Evento Fundacional no integrado en specs base
- **INC-03:** Campos de Medication no actualizados según especificación de cambios
- **INC-04:** Nuevo tipo MedicationPrescriptionIssued no integrado
- **INC-06:** Ambigüedad en ordenamiento de tipos de evento
- **INC-13:** Especificaciones de separación NOTE/Encounter no referenciadas en Timeline Engine

### Inconsistencias de Severidad Media
- **INC-07:** Inconsistencia en campos requeridos de Medication
- **INC-09:** Especificación de actualización no referenciada en specs base
- **INC-10:** Inconsistencia en terminología "Encuentro" vs "Turno" vs "Evento Encounter"

### Inconsistencias de Severidad Baja
- **INC-11:** Reglas de visibilidad temporal contradictorias (redundancia)
- **INC-12:** Ambigüedad en generación de eventos al crear Patient
- **INC-14:** Ambigüedad en validación de fechas futuras
- **INC-15:** Contradicción implícita en documentación de inmutabilidad

### Recomendaciones Prioritarias

1. **Resolver INC-05 e INC-08 inmediatamente** — Son críticas y bloquean implementación consistente
2. **Integrar INC-02, INC-03, INC-04** — Eventos y campos no integrados generan implementaciones incompletas
3. **Unificar terminología (INC-10)** — Clarificar vocabulario para evitar confusión continua
4. **Propagar cambios de INC-03** — Actualizar todas las specs que referencian campos obsoletos

---

*Documento generado: 2024*  
*Metodología: Análisis cruzado exhaustivo de todas las especificaciones*  
*Total de inconsistencias detectadas: 15*

