# Auditoría Lingüística-Clínica: Textos Visibles en UI

**Fecha:** 2024  
**Revisor:** Revisor Lingüístico-Clínico Senior  
**Alcance:** Todos los textos visibles para el usuario en el sistema de Historias Clínicas Psiquiátricas

---

## Resumen Ejecutivo

Se revisaron **todos los componentes de UI** del sistema, identificando textos visibles para el usuario. Se encontraron **3 problemas críticos** y **2 advertencias de ambigüedad** que requieren corrección.

**Estado general:**
- ✅ Coherencia NOTE vs Encounter vs Turno: **CORRECTO** (con excepciones marcadas)
- ✅ Uso de español argentino: **CORRECTO** (con excepciones marcadas)
- ✅ Alineación con specs: **MAYORMENTE CORRECTO** (con excepciones marcadas)

---

## Problemas Críticos Detectados

### ERROR 1: Tipo de evento inconsistente en tipos UI

**Ubicación:** `src/types/ui.ts` línea 12

**Texto actual:**
```typescript
export type EventType =
  | 'Inicio de Historia Clínica'
  | 'Encuentro'  // ← PROBLEMA
  | 'Inicio de Medicación'
  | ...
```

**Problema identificado:**
- El tipo `'Encuentro'` está definido pero **nunca se usa** en el código
- El mapeo real en `src/data/patient-data.ts` línea 40 usa `'Turno'` para eventos Encounter
- Esto crea inconsistencia entre la definición del tipo y su uso real

**Propuesta de corrección:**
```typescript
export type EventType =
  | 'Inicio de Historia Clínica'
  | 'Nota clínica'
  | 'Turno'  // ← CORRECCIÓN
  | 'Inicio de Medicación'
  | ...
```

**Justificación:**
- Según `docs/23_encounter_appointment_spec.md`, los eventos Encounter representan turnos agendados que ya ocurrieron
- El mapeo en `src/data/patient-data.ts` línea 40 ya usa `'Turno'` correctamente
- El componente `TimelineEvent.tsx` línea 18 compara con `'Turno'`
- El término "Encuentro" podría confundirse con el concepto de "encuentro clínico" (que se documenta en Notas)

**Referencia a specs:**
- `docs/23_encounter_appointment_spec.md` - Evento Encounter representa turno agendado
- `src/data/patient-data.ts` línea 40 - Mapeo real usa 'Turno'

---

### ERROR 2: Texto ambiguo en TimelineEvent - "Turno agendado"

**Ubicación:** `src/ui/components/TimelineEvent.tsx` línea 100

**Texto actual:**
```typescript
{isEncounter
  ? 'Turno agendado'  // ← PROBLEMA
  : event.source_type === 'Appointment'
  ? 'Origen: Turno'
  : ...}
```

**Problema identificado:**
- El texto "Turno agendado" es **semánticamente incorrecto** para un evento Encounter
- Según `docs/23_encounter_appointment_spec.md`, los eventos Encounter SOLO aparecen cuando la fecha del turno **ya pasó**
- Un evento Encounter representa un turno que **ya ocurrió**, no uno "agendado" (futuro)
- El término "agendado" sugiere planificación futura, lo cual contradice el modelo

**Propuesta de corrección:**
```typescript
{isEncounter
  ? 'Turno realizado'  // ← CORRECCIÓN
  : event.source_type === 'Appointment'
  ? 'Origen: Turno'
  : ...}
```

**Justificación:**
- Los eventos Encounter solo aparecen en timeline cuando el turno ya ocurrió (specs línea 10-11)
- "Realizado" indica que el hecho ya ocurrió, alineado con el modelo temporal
- Evita confusión con turnos futuros que no aparecen en timeline

**Referencia a specs:**
- `docs/23_encounter_appointment_spec.md` líneas 10-11: "SOLO deben mostrarse en la timeline si la fecha del turno ya pasó"
- `docs/23_encounter_appointment_spec.md` línea 24: "Representa el **hecho** de que ocurrió un turno agendado"

---

### ERROR 3: Uso de "encounter" en nombres de variables y campos (no visible pero afecta claridad)

**Ubicación:** Múltiples archivos (variables internas, no UI visible)

**Observación:**
- Los campos `encounterDate` y `encounterType` en formularios son **correctos** porque se refieren al tipo de encuentro clínico documentado en la Nota
- Estos NO se refieren al evento Encounter de turnos
- Los labels visibles en UI usan "Fecha del Encuentro" y "Tipo de Encuentro", lo cual es correcto

**Estado:** ✅ **CORRECTO** - No requiere corrección

**Justificación:**
- "Encuentro" en contexto de Nota se refiere al encuentro clínico documentado
- "Turno" se refiere al evento Encounter de turnos agendados
- La distinción es clara en el contexto de uso

---

## Advertencias de Ambigüedad

### ADVERTENCIA 1: Término "encuentro" en múltiples contextos

**Ubicación:** `src/ui/components/AddClinicalNoteForm.tsx` líneas 230, 258, 73, 79, 84

**Texto actual:**
- "Fecha del Encuentro"
- "Tipo de Encuentro"
- "La fecha del encuentro es requerida"
- "La fecha del encuentro no puede ser futura"
- "El tipo de encuentro es requerido"

**Análisis:**
- Estos textos son **correctos** porque se refieren al encuentro clínico documentado en la Nota
- No se refieren al evento Encounter de turnos
- El contexto (formulario de Nota) es claro

**Recomendación:**
- ✅ **MANTENER** - Los textos son correctos en su contexto
- Considerar agregar tooltip o ayuda contextual si se detecta confusión en usuarios

---

### ADVERTENCIA 2: Formato de fecha con locale 'es-ES'

**Ubicación:** Múltiples archivos (funciones `formatDate`, `formatDateTime`)

**Texto actual:**
```typescript
date.toLocaleDateString('es-ES', { ... })
```

**Análisis:**
- El locale 'es-ES' es español de España, no de Argentina
- En Argentina se usa 'es-AR' o 'es-419' (Latinoamérica)
- Sin embargo, la diferencia visual es mínima (formato de fecha similar)

**Recomendación:**
- ⚠️ **OPCIONAL** - Cambiar a 'es-AR' o 'es-419' para mayor precisión regional
- No es crítico ya que el formato es similar
- Si se cambia, verificar que todas las funciones de formato usen el mismo locale

**Ubicaciones a revisar:**
- `src/ui/components/TimelineEvent.tsx` línea 216
- `src/ui/components/NotesPanel.tsx` líneas 135, 144
- `src/ui/components/AppointmentsPanel.tsx` líneas 146, 156
- `src/ui/components/MedicationsPanel.tsx` línea 168
- `src/ui/components/PatientDetailView.tsx` líneas 384, 393

---

## Confirmaciones de Correctitud

### ✅ Timeline - Eventos NOTE y Encounter

**Ubicación:** `src/ui/components/TimelineEvent.tsx`

**Textos verificados:**
- Línea 17: `'Nota clínica'` ✅ CORRECTO - Evento NOTE
- Línea 18: `'Turno'` ✅ CORRECTO - Evento Encounter
- Línea 98: `'Nota Clínica asociada'` ✅ CORRECTO - Para eventos NOTE
- Línea 102: `'Origen: Turno'` ✅ CORRECTO - Para source_type Appointment

**Justificación:**
- Coherente con el modelo: NOTE = Nota finalizada, Encounter = Turno realizado
- No confunde documento (Nota) con evento (NOTE/Encounter)

---

### ✅ Formulario de Nota Clínica

**Ubicación:** `src/ui/components/AddClinicalNoteForm.tsx`

**Textos verificados:**
- Línea 218: `"Agregar Nota Clínica"` ✅ CORRECTO
- Línea 230: `"Fecha del Encuentro"` ✅ CORRECTO - Se refiere al encuentro clínico
- Línea 258: `"Tipo de Encuentro"` ✅ CORRECTO - Se refiere al tipo de encuentro clínico
- Línea 419: `"Finalizar inmediatamente (crea evento en la línea de tiempo)"` ✅ CORRECTO
- Línea 455: `"Crear y Finalizar Nota"` ✅ CORRECTO
- Línea 456: `"Crear Borrador"` ✅ CORRECTO

**Justificación:**
- Usa "Nota Clínica" consistentemente
- "Encuentro" se refiere al encuentro clínico documentado, no al evento Encounter
- No sugiere que una Nota finalizada pueda editarse

---

### ✅ Panel de Notas

**Ubicación:** `src/ui/components/NotesPanel.tsx`

**Textos verificados:**
- Línea 40: `"Nota Más Reciente"` ✅ CORRECTO
- Línea 46: `"Agregar nota clínica"` (title) ✅ CORRECTO
- Línea 61: `"Agregar"` ✅ CORRECTO
- Línea 67: `"Sin notas finalizadas"` ✅ CORRECTO
- Línea 104: `"Finalizada {fecha}"` ✅ CORRECTO

**Justificación:**
- Usa "Nota" consistentemente
- Distingue entre "notas finalizadas" y borradores
- No confunde con turnos o eventos Encounter

---

### ✅ Panel de Turnos/Agenda

**Ubicación:** `src/ui/components/AppointmentsPanel.tsx`, `src/ui/components/AddAppointmentForm.tsx`

**Textos verificados:**
- `AppointmentsPanel.tsx` línea 40: `"Próxima Cita"` ✅ CORRECTO
- `AppointmentsPanel.tsx` línea 46: `"Programar cita"` (title) ✅ CORRECTO
- `AppointmentsPanel.tsx` línea 67: `"Sin citas programadas"` ✅ CORRECTO
- `AddAppointmentForm.tsx` línea 211: `"Programar Cita"` ✅ CORRECTO
- `AddAppointmentForm.tsx` línea 222: `"Tipo de Cita"` ✅ CORRECTO
- `AddAppointmentForm.tsx` línea 256: `"Fecha Programada"` ✅ CORRECTO

**Justificación:**
- Usa "Cita" o "Turno" consistentemente para appointments
- No confunde con Notas ni eventos NOTE
- Claramente distingue planificación (turnos) de documentación (notas)

---

### ✅ Panel de Medicación

**Ubicación:** `src/ui/components/MedicationsPanel.tsx`, `src/ui/components/AddMedicationForm.tsx`, `src/ui/components/StopMedicationModal.tsx`, `src/ui/components/ChangeMedicationModal.tsx`

**Textos verificados:**
- `MedicationsPanel.tsx` línea 54: `"Medicamentos Activos"` ✅ CORRECTO
- `MedicationsPanel.tsx` línea 118: `"Ajustar dosis"` ✅ CORRECTO
- `MedicationsPanel.tsx` línea 130: `"Suspender"` ✅ CORRECTO
- `StopMedicationModal.tsx` línea 126: `"Suspender Medicamento"` ✅ CORRECTO
- `ChangeMedicationModal.tsx` línea 147: `"Ajustar Dosis"` ✅ CORRECTO

**Justificación:**
- Léxico clínico correcto en español argentino
- "Suspender" es el término correcto (no "detener" ni "descontinuar")
- "Ajustar dosis" es correcto (no "cambiar dosis" ni "modificar dosis")

---

### ✅ Timeline Component

**Ubicación:** `src/ui/components/Timeline.tsx`

**Textos verificados:**
- Línea 30: `"Sin eventos"` ✅ CORRECTO
- Línea 33: `"La línea de tiempo de este paciente está vacía."` ✅ CORRECTO
- Línea 43: `"Línea de Tiempo Clínica"` ✅ CORRECTO
- Línea 46: `"{n} evento{s}"` ✅ CORRECTO

**Justificación:**
- Usa "Línea de Tiempo" (no "Timeline" ni "Cronología")
- Pluralización correcta en español
- No muestra eventos futuros (correcto según specs)

---

## Textos que NO Requieren Corrección

Los siguientes textos fueron revisados y confirmados como **correctos**:

1. ✅ Todos los botones de acción ("Cancelar", "Guardar", "Agregar", etc.)
2. ✅ Todos los estados ("Borrador", "Finalizada", "Activa", "Suspendida")
3. ✅ Todos los mensajes de error y validación
4. ✅ Todos los labels de formularios
5. ✅ Todos los títulos de secciones y paneles
6. ✅ Todos los placeholders de campos
7. ✅ Todos los tooltips y textos de ayuda

---

## Resumen de Correcciones Requeridas

### Correcciones OBLIGATORIAS ✅ APLICADAS

1. **`src/types/ui.ts` línea 12** ✅
   - Cambiado `'Encuentro'` → `'Turno'` en el tipo `EventType`
   - Agregado `'Nota clínica'` para completitud

2. **`src/ui/components/TimelineEvent.tsx` línea 100** ✅
   - Cambiado `'Turno agendado'` → `'Turno realizado'`

### Correcciones OPCIONALES ✅ APLICADAS

3. **Múltiples archivos - Funciones de formato de fecha** ✅
   - Cambiado `'es-ES'` → `'es-AR'` en todas las funciones `formatDate` y `formatDateTime`
   - Archivos actualizados:
     - `src/ui/components/TimelineEvent.tsx`
     - `src/ui/components/NotesPanel.tsx`
     - `src/ui/components/AppointmentsPanel.tsx`
     - `src/ui/components/MedicationsPanel.tsx`
     - `src/ui/components/PatientDetailView.tsx`
     - `src/ui/components/PatientHeader.tsx`
     - `src/ui/components/UpdatePatientForm.tsx`

---

## Confirmación Final

### Coherencia NOTE vs Encounter vs Turno

✅ **CONFIRMADO** (con correcciones aplicadas):
- NOTE = Evento de timeline que representa Nota finalizada
- Encounter = Evento de timeline que representa Turno realizado
- Turno = Appointment (planificación administrativa)
- Nota = Documento clínico (Borrador/Finalizada)

### Uso Correcto de Español Argentino

✅ **CONFIRMADO**:
- Léxico clínico apropiado
- Formulación profesional
- Sin anglicismos visibles en UI
- Tono adecuado

### Alineación con Specs

✅ **CONFIRMADO** (con correcciones aplicadas):
- No contradice el significado de NOTE, Encounter ni Turno
- Respeta el modelo clínico y administrativo
- Claridad y profesionalismo mantenidos

---

## Notas Finales

- **No se detectaron textos en inglés** visibles para el usuario
- **No se detectaron contradicciones funcionales** que requieran decisión funcional
- **Todas las correcciones son puramente lingüísticas** y no afectan el comportamiento del sistema
- **El sistema está bien estructurado** desde el punto de vista lingüístico, con solo ajustes menores necesarios

---

---

## Estado de Implementación

**Todas las correcciones han sido aplicadas:**
- ✅ Correcciones obligatorias: 2/2 completadas
- ✅ Correcciones opcionales: 1/1 completada
- ✅ Sin errores de linting o TypeScript
- ✅ Consistencia verificada en todos los archivos

**Fecha de aplicación:** 2024

---

**Fin del Informe de Auditoría**
