# Actualización de Especificaciones: Módulo de Medicación

## 1. RESUMEN DE CAMBIOS SOLICITADOS

Este documento especifica los cambios funcionales solicitados por el cliente para el módulo de Medicación del sistema de historias clínicas psiquiátricas. Los cambios mantienen la consistencia con el Timeline Engine y preservan la trazabilidad histórica completa.

### 1.1 Cambios Explícitos del Cliente

1. **Eliminación del concepto "vía de administración"**
   - El campo `route` (vía de administración) será eliminado del modelo de datos Medication
   - Se removerá de todos los parámetros ajustables en el flujo de ajuste de dosis
   - Se eliminarán todas las referencias y validaciones relacionadas

2. **Reemplazo de "fecha de inicio" por "fecha de emisión de receta"**
   - El campo `startDate` será renombrado semánticamente a `prescriptionIssueDate`
   - El concepto clínico cambia de "cuándo inició el medicamento" a "cuándo se emitió la receta"
   - Todos los eventos relacionados usarán esta nueva semántica

3. **Nueva acción clínica: "Nueva receta emitida"**
   - Se introduce un nuevo tipo de evento: `MedicationPrescriptionIssued` (Nueva Receta Emitida)
   - Este evento coexiste con:
     - Ajuste de dosis (MedicationChange)
     - Suspensión de medicación (MedicationStop)
   - Tiene reglas de validación específicas que se detallan más adelante

4. **Cambio de "Razón de la prescripción" a "Comentarios" (opcional)**
   - El campo `prescribingReason` será renombrado semánticamente a `comments` (Comentarios)
   - El concepto clínico cambia de "razón obligatoria" a "comentarios opcionales"
   - El campo deja de ser obligatorio y pasa a ser opcional

5. **Incorporación de período de renovación de recetas**
   - Se agrega el campo `prescription_renewal_period` al modelo de datos Medication
   - Campo numérico opcional que indica el intervalo en días de validez/renovación de la receta
   - Mejora la gestión administrativa de las recetas permitiendo el seguimiento de períodos de validez
   - Sigue las reglas de inmutabilidad: si cambia, genera una nueva versión del registro

### 1.2 Justificación Clínica

**Eliminación de vía de administración:**
- La mayoría de medicamentos psiquiátricos tienen una vía de administración estándar (oral)
- El campo agregaba fricción sin valor clínico significativo en el contexto del MVP
- Simplifica el modelo de datos sin perder información clínica esencial

**Cambio semántico de fecha:**
- La "fecha de emisión de receta" es más precisa clínicamente
- Refleja mejor el momento de la decisión prescriptiva
- Alinea el modelo con la práctica clínica real donde se emite la receta antes o al momento de iniciar el tratamiento

**Nueva receta emitida:**
- Permite documentar emisiones adicionales de recetas sin modificar parámetros posológicos
- Diferencia claramente entre "emitir nueva receta" y "ajustar dosis"
- Facilita el seguimiento de renovaciones de prescripciones

**Cambio de razón de prescripción a comentarios:**
- "Comentarios" es más flexible que "razón de prescripción" obligatoria
- Permite documentar información adicional sin requerir una justificación formal
- Reduce fricción en el flujo de entrada de datos
- Alinea con prácticas clínicas donde los comentarios son opcionales

**Incorporación de período de renovación:**
- Facilita la gestión administrativa y el seguimiento de validez de recetas
- Permite documentar intervalos estándar de renovación (ej: 30 días, 90 días)
- Mejora la trazabilidad administrativa sin afectar la lógica clínica del tratamiento

---

## 2. IMPACTO EN LAS ESPECIFICACIONES DE MEDICACIÓN

### 2.1 Campos Eliminados

#### 2.1.1 Campo `route` (Vía de administración)

**Estado actual:**
- Campo `route` en modelo Medication (tipo: `String?`, nullable)
- Referenciado en ~91 líneas de documentación
- Incluido como parámetro ajustable en especificación de ajuste de dosis

**Impacto en especificaciones:**

**Archivo: `docs/specs/02_events/21_ajuste_dosis_medicamentos.md`**
- **Sección 2.2 "Parámetros Ajustables"**: Eliminar la línea que menciona "Vía de administración (`route`)"
- **Sección 4.2 "Datos de Entrada Opcionales"**: Eliminar el campo `newRoute` de la tabla
- **Sección 5.4 "Estado Posterior"**: Eliminar referencias a `route` en ejemplos de código
- **Sección 7.2 "No Permitir Sobrescritura"**: Eliminar `route` de la lista de campos inmutables

**Archivo: `docs/specs/01_domain/10_data_models.md`**
- **Tabla de Persistent Attributes**: Eliminar la fila `route | Text (nullable) | Route of administration`

**Archivo: `docs/specs/01_domain/02_domain.md`**
- **Sección "Core Attributes"**: Eliminar "Route of administration" de la lista
- **Sección "Business Rules"**: Eliminar la regla "Route of administration is optional"

**Archivo: `docs/specs/99_appendix/04_use_cases.md`**
- **UC-04, Paso 5**: Eliminar "The clinician optionally enters the route of administration"
- **Tabla de Validations**: Eliminar la fila "Route of administration | Optional"

**Archivo: `docs/specs/03_timeline/14_timeline_contracts.md`**
- Eliminar cualquier referencia a `route` en estructuras de datos de eventos

**Archivo: `docs/all_specs.md`**
- Actualizar todas las referencias consolidadas para eliminar menciones a `route`

**Archivo: `prisma/schema.prisma`**
- **Modelo Medication**: Eliminar el campo `route String? @map("route")` (nota: este cambio está fuera del alcance de especificaciones, pero se documenta para referencia)

### 2.2 Campos Renombrados

#### 2.2.1 Campo `startDate` → `prescriptionIssueDate`

**Estado actual:**
- Campo `startDate` en modelo Medication (tipo: `DateTime`, mapeado a `start_date`)
- Referenciado en ~82 líneas de documentación
- Usado en contratos de timeline como `event_timestamp` para MedicationStart

**Cambio semántico:**
- **Nombre técnico**: `startDate` → `prescriptionIssueDate` (o mantener `startDate` con semántica actualizada)
- **Nombre de mapeo DB**: `start_date` → `prescription_issue_date` (o mantener `start_date` con documentación actualizada)
- **Concepto clínico**: "Fecha de inicio del medicamento" → "Fecha de emisión de receta"

**Impacto en especificaciones:**

**Archivo: `docs/specs/01_domain/10_data_models.md`**
- **Tabla de Persistent Attributes**: 
  - Cambiar `start_date | Date | When medication was initiated`
  - Por: `prescription_issue_date | Date | When prescription was issued`
- **Notas de validación**: Actualizar "start_date must not be in the future" a "prescription_issue_date must not be in the future"

**Archivo: `docs/specs/01_domain/02_domain.md`**
- **Sección "Core Attributes"**: Cambiar "Start date" por "Prescription issue date"
- **Sección "Business Rules"**: Actualizar referencias a "start date" por "prescription issue date"

**Archivo: `docs/specs/02_events/21_ajuste_dosis_medicamentos.md`**
- **Sección 4.1**: Cambiar validación de "no puede ser anterior a `startDate`" a "no puede ser anterior a `prescriptionIssueDate`"
- **Sección 5.1, 5.3, 5.4**: Actualizar ejemplos de código para usar `prescriptionIssueDate`
- **Sección 7.4**: Actualizar regla R-CONS-4 para referenciar `prescriptionIssueDate`
- **Sección 10.1**: Actualizar flujo para usar `prescriptionIssueDate`

**Archivo: `docs/specs/03_timeline/14_timeline_contracts.md`**
- **Contrato WRITE-EVENT-MEDICATION-START**:
  - Cambiar `event_timestamp | Medication.start_date` por `event_timestamp | Medication.prescription_issue_date`
  - Actualizar regla: "event_timestamp must equal Medication.prescription_issue_date"
  - Actualizar validación: "Medication.prescription_issue_date is a valid date not in the future"
  - Cambiar `description | Medication.prescribing_reason` por `description | Medication.comments (optional)`
  - Eliminar validación: "Medication.prescribing_reason is not empty"
  - Agregar nota: "description may be empty if comments are not provided"

- **Contrato WRITE-EVENT-MEDICATION-CHANGE**:
  - Cambiar `event_timestamp | New Medication.start_date` por `event_timestamp | New Medication.prescription_issue_date`
  - Actualizar regla: "event_timestamp equals the new Medication.prescription_issue_date"
  - Actualizar validación: "New Medication.prescription_issue_date is on or after predecessor.prescription_issue_date"

- **Contrato WRITE-EVENT-MEDICATION-STOP**:
  - Actualizar validación: "Medication.end_date must be on or after Medication.prescription_issue_date"

**Archivo: `docs/specs/99_appendix/04_use_cases.md`**
- **UC-04, Paso 6**: Cambiar "The clinician enters the start date" por "The clinician enters the prescription issue date"
- **Tabla de Validations**: Cambiar "Start date" por "Prescription issue date"

**Archivo: `docs/specs/03_timeline/13_timeline_engine.md`**
- Actualizar consultas que usan `start_date` para usar `prescription_issue_date`
- Actualizar reglas de medicamentos activos: `prescription_issue_date ≤ target_date AND (end_date IS NULL OR end_date > target_date)`

#### 2.2.2 Campo `prescribingReason` → `comments` (Comentarios)

**Estado actual:**
- Campo `prescribingReason` en modelo Medication (tipo: `String`, required)
- Referenciado en ~26 líneas de documentación
- Usado como campo obligatorio en validaciones y contratos de timeline
- Aparece como `description` en eventos MedicationStart

**Cambio semántico:**
- **Nombre técnico**: `prescribingReason` → `comments` (Comentarios)
- **Nombre de mapeo DB**: `prescribing_reason` → `comments` (o mantener `prescribing_reason` con documentación actualizada)
- **Concepto clínico**: "Razón de la prescripción" (obligatorio) → "Comentarios" (opcional)
- **Obligatoriedad**: `required` → `optional` (nullable)

**Impacto en especificaciones:**

**Archivo: `docs/specs/01_domain/10_data_models.md`**
- **Tabla de Persistent Attributes**: 
  - Cambiar `prescribing_reason | Text | Why medication was prescribed`
  - Por: `comments | Text (nullable) | Optional comments about the prescription`
- **Notas de validación**: Eliminar "prescribing_reason is required" o actualizar a "comments is optional"

**Archivo: `docs/specs/01_domain/02_domain.md`**
- **Sección "Core Attributes"**: Cambiar "Prescribing reason" por "Comments (optional)"
- **Sección "Business Rules"**: 
  - Eliminar o actualizar la regla que indica que prescribing reason es obligatorio
  - Agregar regla: "Comments are optional"

**Archivo: `docs/specs/02_events/21_ajuste_dosis_medicamentos.md`**
- **Sección 4.3 "Datos Derivados Automáticamente"**: 
  - Cambiar `prescribingReason` por `comments`
  - Nota: Se mantiene idéntico al medicamento original (puede ser null)

**Archivo: `docs/specs/03_timeline/14_timeline_contracts.md`**
- **Contrato WRITE-EVENT-MEDICATION-START**:
  - Cambiar `description | Medication.prescribing_reason` por `description | Medication.comments (optional)`
  - Actualizar validación: Eliminar "Medication.prescribing_reason is not empty"
  - Actualizar nota: "description may be empty if comments are not provided"

**Archivo: `docs/specs/99_appendix/04_use_cases.md`**
- **UC-04, Paso 7**: Cambiar "The clinician enters the prescribing reason" por "The clinician optionally enters comments"
- **Tabla de Validations**: 
  - Cambiar "Prescribing reason | Required" por "Comments | Optional"

**Archivo: `docs/specs/08_quality/16_clinical_qa_manual.md`**
- Actualizar paso de prueba: "Ingrese los comentarios (opcional)" en lugar de "Ingrese la razón de prescripción"

**Archivo: `docs/all_specs.md`**
- Actualizar todas las referencias consolidadas para cambiar "prescribing reason" por "comments (optional)"

**Archivo: `prisma/schema.prisma`**
- **Modelo Medication**: 
  - Cambiar `prescribingReason String @map("prescribing_reason")` por `comments String? @map("comments")` 
  - (nota: este cambio está fuera del alcance de especificaciones, pero se documenta para referencia)

### 2.3 Nuevos Conceptos Clínicos

#### 2.3.1 Fecha de Emisión de Receta como Concepto Clínico

**Definición:**
La fecha de emisión de receta (`prescriptionIssueDate`) representa el momento clínico en que el profesional emite la prescripción del medicamento. Esta fecha:

- Es el punto de referencia temporal para el inicio del tratamiento
- Se usa como `event_timestamp` para el evento MedicationStart
- Puede ser retroactiva (documentación de recetas emitidas en el pasado)
- No puede ser futura (no se puede documentar una receta que aún no se ha emitido)

**Relación con eventos:**
- **MedicationStart**: Usa `prescriptionIssueDate` como fecha del evento
- **MedicationChange**: Usa la nueva `prescriptionIssueDate` de la versión ajustada
- **Nueva Receta Emitida**: Usa la fecha de emisión de la nueva receta como `event_timestamp`

**Validaciones:**
- `prescriptionIssueDate` debe ser una fecha válida
- `prescriptionIssueDate` no puede ser futura **para nuevas medicaciones (MedicationStart)**
- **Excepción para ajustes (MedicationChange)**: La nueva `prescriptionIssueDate` puede ser futura. Los eventos con fecha futura se crean pero se filtran de la timeline hasta que la fecha pase.
- **Excepción para nuevas recetas (MedicationPrescriptionIssued)**: La fecha de emisión puede ser futura. Los eventos con fecha futura se crean pero se filtran de la timeline hasta que la fecha pase.
- Para ajustes: la nueva `prescriptionIssueDate` debe ser posterior o igual a la `prescriptionIssueDate` del predecesor

---

## 3. EVENTOS DE MEDICACIÓN ACTUALIZADOS

### 3.1 Ajuste de Dosis (MedicationChange)

#### 3.1.1 Estado Actualizado

**Sin cambios en lógica funcional**, pero con las siguientes actualizaciones:

**Parámetros ajustables (actualizados):**
- ✅ **Dosis** (`dosage`): Cantidad numérica del medicamento
- ✅ **Unidad de dosis** (`dosageUnit`): Unidad de medida (mg, ml, tabletas, etc.)
- ✅ **Frecuencia** (`frequency`): Intervalo de administración (diario, dos veces al día, etc.)
- ❌ **Vía de administración** (`route`): **ELIMINADO** - Ya no es un parámetro ajustable

**Referencias temporales actualizadas:**
- Todas las referencias a `startDate` deben cambiarse a `prescriptionIssueDate`
- La validación temporal: `effectiveDate >= medication.prescriptionIssueDate` (en lugar de `startDate`)

#### 3.1.2 Especificación Actualizada

**Trigger:** Sin cambios - Un nuevo Medication se crea con `predecessor_id` referenciando un Medication descontinuado.

**Estructura del evento:** Sin cambios en estructura, pero:
- `event_timestamp` ahora se deriva de `Medication.prescription_issue_date` (en lugar de `start_date`)
- El título y descripción no cambian

**Validaciones actualizadas:**
- `predecessor_id` referencia un Medication válido y descontinuado
- El predecesor pertenece al mismo clinical record
- Nueva `Medication.prescription_issue_date` es posterior o igual a `predecessor.prescription_issue_date`
- **NUEVO**: No se valida ni ajusta `route` (campo eliminado)
- **NUEVO**: `comments` es opcional (puede ser null o vacío)

### 3.2 Nueva Receta Emitida (MedicationPrescriptionIssued)

#### 3.2.1 Definición

**Nueva Receta Emitida** es un evento clínico que documenta la emisión de una nueva prescripción para un medicamento que ya está activo en el historial del paciente. Este evento:

- **NO modifica** parámetros posológicos (dosis, frecuencia, unidad)
- **NO crea** una nueva versión del medicamento
- **Solo documenta** que se emitió una nueva receta
- Genera un evento en el timeline para trazabilidad

#### 3.2.2 Diferencias Clave con Otros Eventos

| Aspecto | Nueva Receta Emitida | Ajuste de Dosis | Suspensión |
|---------|---------------------|-----------------|------------|
| **Modifica parámetros** | ❌ No | ✅ Sí (dosis/frecuencia) | ❌ No |
| **Crea nueva versión** | ❌ No | ✅ Sí | ❌ No |
| **Requiere medicamento activo** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Bloquea futuras acciones** | ❌ No | ❌ No | ✅ Sí (bloquea nuevas recetas) |
| **Fecha debe ser posterior a primera receta** | ✅ Sí | ❌ No (usa effectiveDate) | ❌ No |

#### 3.2.3 Trigger del Evento

**Contrato:** WRITE-EVENT-MEDICATION-PRESCRIPTION-ISSUED

**Trigger:**
Un profesional clínico emite una nueva receta para un medicamento activo existente, sin modificar parámetros posológicos.

**Condiciones previas:**
- Debe existir un Medication con `status = Active`
- El Medication debe pertenecer al mismo `clinicalRecordId`
- La fecha de emisión de la nueva receta debe ser posterior a la `prescriptionIssueDate` del Medication original (primera receta)

#### 3.2.4 Estructura del Evento

**Tipo de evento:** `MedicationPrescriptionIssued` (Nueva Receta Emitida)

**Información requerida:**

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `clinical_record_identifier` | Medication.clinical_record_id | Vincula evento al paciente |
| `event_timestamp` | Fecha de emisión de nueva receta | Fecha clínica de emisión de la receta |
| `title` | Derivado | e.g., "Nueva receta emitida: Sertralina 50mg" |
| `description` | Opcional | Razón o notas sobre la emisión de la receta |
| `source_type` | Constante: "Medication" | Identifica tipo de entidad fuente |
| `source_identifier` | Medication.id | Referencia al Medication activo |

**Asignación automática:**

| Campo | Valor |
|-------|-------|
| `event_identifier` | Identificador único generado por el sistema |
| `event_type` | Constante: "MedicationPrescriptionIssued" |
| `recorded_timestamp` | Timestamp actual del sistema |

#### 3.2.5 Reglas de Timestamp

- `event_timestamp` = fecha de emisión de la nueva receta (proporcionada por el usuario)
- `event_timestamp` **debe ser posterior** a `Medication.prescription_issue_date` (fecha de la primera receta)
- `event_timestamp` **no puede ser futura**
- `recorded_timestamp` se asigna en el momento de creación del evento

#### 3.2.6 Validaciones

**R-VAL-1: Restricción Temporal de Nueva Receta**

Una nueva receta solo puede emitirse en un día **posterior** a la fecha de emisión de la primera receta.

**Validación:**
```typescript
if (newPrescriptionDate <= medication.prescriptionIssueDate) {
  return error("INVALID_PRESCRIPTION_DATE_MUST_BE_AFTER_FIRST");
}
```

**Justificación clínica:**
- No tiene sentido clínico emitir una nueva receta en la misma fecha o antes de la primera receta
- La primera receta ya documenta el inicio del tratamiento
- Las recetas subsecuentes representan renovaciones o continuidad

**R-VAL-2: Restricción de Estado para Nueva Receta**

Si el medicamento está suspendido (`status = Discontinued`), **no pueden emitirse más recetas**.

**Validación:**
```typescript
if (medication.status !== MedicationStatus.Active) {
  return error("MEDICATION_NOT_ACTIVE_CANNOT_ISSUE_PRESCRIPTION");
}
```

**Justificación clínica:**
- Un medicamento suspendido no puede tener nuevas prescripciones
- La suspensión marca el fin del tratamiento
- Si se necesita reiniciar, debe crearse un nuevo Medication (nuevo episodio de tratamiento)

**R-VAL-3: Fecha No Futura**

La fecha de emisión de la nueva receta no puede ser futura.

**Validación:**
```typescript
if (newPrescriptionDate > new Date()) {
  return error("INVALID_TIMESTAMP_FUTURE");
}
```

**R-VAL-4: Medicamento Debe Existir**

El Medication referenciado debe existir y pertenecer al mismo clinical record.

**Validación:**
```typescript
const medication = await findMedication(medicationId);
if (!medication || medication.clinicalRecordId !== clinicalRecordId) {
  return error("MEDICATION_NOT_FOUND_OR_WRONG_RECORD");
}
```

#### 3.2.7 Flujo de Operación

```
1. Usuario solicita emitir nueva receta
   ↓
2. Sistema valida:
   - medicationId existe
   - Medicamento está activo (status = Active)
   - newPrescriptionDate no es futura
   - newPrescriptionDate > medication.prescriptionIssueDate
   ↓
3. Sistema genera evento MedicationPrescriptionIssued:
   - eventType → MedicationPrescriptionIssued
   - eventDate → newPrescriptionDate
   - title → "Nueva receta emitida: {drugName} {dosage}{dosageUnit}"
   - description → reason (opcional)
   - sourceId → medicationId (versión activa)
   ↓
4. Sistema retorna evento creado
```

**Nota importante:** Este evento **NO modifica** el Medication. El Medication permanece inalterado, solo se crea el evento de timeline.

#### 3.2.8 Ejemplos de Uso

**Ejemplo 1: Emisión de receta de renovación**

**Escenario:** El paciente tiene Sertralina 50mg activa desde el 15 de enero de 2024. El 15 de febrero de 2024 se emite una nueva receta para continuar el tratamiento.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  prescriptionIssueDate: "2024-02-15",
  reason: "Renovación de prescripción - seguimiento mensual"
}
```

**Resultado:**
- Medication `med-001` permanece inalterado (mismo `prescriptionIssueDate` original: 2024-01-15)
- Se crea evento `MedicationPrescriptionIssued` con `eventDate = 2024-02-15`
- El evento aparece en el timeline el 15 de febrero

**Ejemplo 2: Intento de emisión en fecha anterior (rechazado)**

**Escenario:** Intentar emitir nueva receta el 10 de enero cuando la primera receta fue el 15 de enero.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  prescriptionIssueDate: "2024-01-10",  // Anterior a primera receta
  reason: "Receta previa"
}
```

**Resultado:**
- Error: `INVALID_PRESCRIPTION_DATE_MUST_BE_AFTER_FIRST`
- No se crea evento
- No se modifica Medication

**Ejemplo 3: Intento de emisión para medicamento suspendido (rechazado)**

**Escenario:** Intentar emitir nueva receta para un medicamento que fue suspendido.

**Entrada:**
```typescript
{
  medicationId: "med-001",  // status = Discontinued
  prescriptionIssueDate: "2024-03-01",
  reason: "Reinicio"
}
```

**Resultado:**
- Error: `MEDICATION_NOT_ACTIVE_CANNOT_ISSUE_PRESCRIPTION`
- No se crea evento
- **Nota:** Para reiniciar tratamiento, debe crearse un nuevo Medication (nuevo episodio)

### 3.3 Suspensión de Medicación (MedicationStop)

#### 3.3.1 Estado Actualizado

**Sin cambios en lógica funcional**, pero con **nuevo impacto semántico**:

**Nuevo comportamiento:**
- Cuando un medicamento se suspende (`status = Discontinued`), **bloquea la posibilidad de emitir nuevas recetas** para ese medicamento
- Esta restricción se aplica mediante la validación R-VAL-2 del evento "Nueva Receta Emitida"

**Referencias temporales actualizadas:**
- Las validaciones que comparan con `startDate` deben actualizarse a `prescriptionIssueDate`
- La regla "end_date must be on or after start_date" se convierte en "end_date must be on or after prescription_issue_date"

#### 3.3.2 Especificación Actualizada

**Trigger:** Sin cambios - Un Medication transiciona de `status=Active` a `status=Discontinued`.

**Estructura del evento:** Sin cambios.

**Validaciones actualizadas:**
- `Medication.end_date` debe ser posterior o igual a `Medication.prescription_issue_date` (en lugar de `start_date`)
- `Medication.discontinuation_reason` no puede estar vacío
- `Medication.comments` es opcional (puede ser null)

**Impacto en otros eventos:**
- Después de la suspensión, el evento "Nueva Receta Emitida" no puede ejecutarse para ese Medication (validación R-VAL-2)

### 3.4 Matriz de Compatibilidad de Acciones

La siguiente matriz define qué acciones pueden realizarse según el estado del medicamento:

| Estado del Medicamento | Ajuste de Dosis | Nueva Receta Emitida | Suspensión |
|------------------------|-----------------|----------------------|------------|
| **Active** (sin predecesor) | ✅ Permitido | ✅ Permitido* | ✅ Permitido |
| **Active** (con predecesor) | ✅ Permitido | ✅ Permitido* | ✅ Permitido |
| **Discontinued** | ❌ No permitido | ❌ No permitido | ❌ No permitido |

*Nueva Receta Emitida requiere que la fecha sea posterior a `prescriptionIssueDate` del Medication original.

**Notas:**
- Un medicamento **Active** puede tener cualquier acción aplicada
- Un medicamento **Discontinued** no puede tener ninguna acción aplicada
- Para reiniciar un medicamento suspendido, debe crearse un **nuevo Medication** (nuevo episodio de tratamiento)

---

## 4. CONSIDERACIONES DE TIMELINE Y TRAZABILIDAD

### 4.1 Preservación de Eventos Históricos Existentes

**Principio fundamental:** Todos los eventos históricos existentes permanecen inmutables y válidos.

**Impacto de los cambios:**

1. **Eventos MedicationStart existentes:**
   - Mantienen su `event_timestamp` original (que corresponde a `start_date` histórico)
   - La semántica cambia de "fecha de inicio" a "fecha de emisión de receta", pero los datos históricos no se modifican
   - Los eventos siguen siendo válidos y consultables

2. **Eventos MedicationChange existentes:**
   - Mantienen su estructura y `event_timestamp` original
   - Las referencias a `start_date` en documentación se actualizan, pero los eventos históricos no cambian

3. **Eventos MedicationStop existentes:**
   - Mantienen su estructura y `event_timestamp` original
   - Siguen siendo válidos y consultables

**Migración de datos (fuera de alcance de especificaciones):**
- Si se renombra el campo `start_date` a `prescription_issue_date` en la base de datos, se requiere migración
- Los eventos históricos no requieren migración (usan `event_timestamp`, no el campo del Medication directamente)

### 4.2 Compatibilidad con Timeline Engine

**Principios del Timeline Engine preservados:**

1. **Inmutabilidad de eventos:**
   - El nuevo evento `MedicationPrescriptionIssued` es inmutable una vez creado
   - No puede ser modificado ni eliminado
   - Sigue el mismo patrón que otros eventos de medicación

2. **Ordenamiento temporal:**
   - Los eventos se ordenan por `event_timestamp` (fecha clínica)
   - El nuevo evento `MedicationPrescriptionIssued` se ordena cronológicamente según su `event_timestamp`
   - No hay conflictos con eventos existentes

3. **Vinculación con entidades:**
   - El evento `MedicationPrescriptionIssued` se vincula al Medication activo mediante `source_identifier`
   - Mantiene la relación `source_type = "Medication"` consistente con otros eventos

4. **Tipos de eventos:**
   - Se agrega `MedicationPrescriptionIssued` como nuevo tipo de evento
   - No modifica tipos existentes
   - El Timeline Engine debe reconocer este nuevo tipo (implementación fuera de alcance)

### 4.3 Reglas de Ordenamiento Temporal

**Reglas actualizadas:**

1. **MedicationStart:**
   - `event_timestamp = Medication.prescription_issue_date`
   - Debe ser la primera fecha relacionada con ese medicamento

2. **MedicationPrescriptionIssued:**
   - `event_timestamp = fecha de emisión de nueva receta`
   - Debe ser posterior a `Medication.prescription_issue_date` (primera receta)
   - Puede aparecer en cualquier momento después del MedicationStart, antes o después de MedicationChange

3. **MedicationChange:**
   - `event_timestamp = nueva Medication.prescription_issue_date`
   - Debe ser posterior o igual a `predecessor.prescription_issue_date`

4. **MedicationStop:**
   - `event_timestamp = Medication.end_date`
   - Debe ser posterior o igual a `Medication.prescription_issue_date`
   - Después de este evento, no pueden emitirse más recetas

**Ejemplo de timeline:**

```
2024-01-15  [MedicationStart]           Sertralina 50mg iniciado
                                    Comentarios: Tratamiento de depresión

2024-02-01  [MedicationPrescriptionIssued]  Nueva receta emitida: Sertralina 50mg
                                    Comentarios: Renovación mensual

2024-02-15  [MedicationChange]       Sertralina: 50mg → 75mg
                                    Comentarios: Aumento por respuesta subóptima

2024-03-01  [MedicationPrescriptionIssued]  Nueva receta emitida: Sertralina 75mg
                                    Comentarios: Renovación con nueva dosis

2024-03-20  [MedicationStop]         Sertralina suspendido
                                    Razón: Efectos adversos
```

**Nota:** En el ejemplo anterior, los eventos MedicationStart, MedicationPrescriptionIssued y MedicationChange pueden tener `description` vacío si no se proporcionan comentarios, ya que el campo es opcional.

### 4.4 Integridad de la Cadena de Versiones

**Preservación del modelo de versiones:**

1. **Estructura de versiones:**
   - El modelo de `predecessorId` se mantiene intacto
   - Las versiones siguen formando una cadena lineal
   - La eliminación de `route` no afecta la estructura de versiones

2. **Campos en versiones:**
   - Las versiones históricas que tenían `route` mantienen ese dato (si existe en BD)
   - Las nuevas versiones no incluyen `route`
   - Las versiones históricas que usaban `start_date` mantienen ese dato
   - Las nuevas versiones usan `prescription_issue_date` (o `start_date` con nueva semántica)
   - Las versiones históricas que tenían `prescribing_reason` mantienen ese dato
   - Las nuevas versiones usan `comments` (opcional, puede ser null)

3. **Navegación del historial:**
   - La navegación mediante `predecessorId` no cambia
   - La reconstrucción del historial completo sigue funcionando igual
   - Los eventos `MedicationPrescriptionIssued` no afectan la cadena de versiones (son eventos independientes)

4. **Consultas de estado histórico:**
   - Las consultas que determinan qué medicamento estaba activo en una fecha histórica siguen funcionando
   - Se actualizan para usar `prescription_issue_date` en lugar de `start_date`
   - La lógica: `prescription_issue_date ≤ target_date AND (end_date IS NULL OR end_date > target_date)`

### 4.5 Trazabilidad Completa

**Garantías de trazabilidad:**

1. **Eventos inmutables:**
   - Todos los eventos (incluido el nuevo `MedicationPrescriptionIssued`) son inmutables
   - No se pueden modificar ni eliminar después de la creación
   - Preservan el historial completo de decisiones clínicas

2. **Vinculación con Medication:**
   - Cada evento está vinculado a un Medication mediante `source_identifier`
   - El nuevo evento `MedicationPrescriptionIssued` se vincula al Medication activo
   - Permite rastrear todas las emisiones de recetas para un medicamento

3. **Reconstrucción histórica:**
   - Es posible reconstruir el estado completo del tratamiento en cualquier fecha histórica
   - Los eventos `MedicationPrescriptionIssued` documentan renovaciones sin modificar el Medication
   - La cadena de versiones documenta cambios en parámetros

4. **Auditoría:**
   - Todos los cambios quedan documentados en eventos
   - La eliminación de `route` no afecta la auditoría (los datos históricos se preservan)
   - El cambio semántico de fecha no afecta la auditoría (los timestamps se mantienen)
   - El cambio de `prescribingReason` a `comments` opcional no afecta la auditoría (los datos históricos se preservan, pero nuevos registros pueden tener `comments = null`)

---

## 5. CAMBIOS EXPLÍCITAMENTE FUERA DE ALCANCE

Este documento se limita **exclusivamente a especificaciones funcionales**. Los siguientes elementos están explícitamente fuera del alcance:

### 5.1 Implementación de Código

- ❌ **NO se escribirá código** para implementar estos cambios
- ❌ **NO se modificarán** archivos de código fuente (TypeScript, Prisma, etc.)
- ❌ **NO se actualizarán** servicios, controladores o componentes
- ❌ **NO se crearán** migraciones de base de datos

### 5.2 Diseño de UI/UX

- ❌ **NO se diseñará** la interfaz visual para el nuevo evento
- ❌ **NO se especificarán** componentes de UI para "Nueva receta emitida"
- ❌ **NO se modificarán** formularios existentes (aunque se documenten cambios necesarios)
- ❌ **NO se crearán** mockups o wireframes

### 5.3 Modificaciones al Timeline Engine

- ❌ **NO se redefinirá** el Timeline Engine
- ❌ **NO se modificarán** los contratos base del engine
- ❌ **NO se cambiará** la arquitectura del sistema de eventos
- ✅ **SÍ se documenta** cómo el nuevo evento se integra con el engine existente

### 5.4 Expansión del MVP

- ❌ **NO se introducirán** nuevos módulos o funcionalidades
- ❌ **NO se agregarán** campos adicionales más allá de los cambios solicitados
- ❌ **NO se expandirá** el alcance funcional del sistema
- ✅ **SÍ se mantiene** el alcance mínimo viable del proyecto

### 5.5 Migración de Datos

- ❌ **NO se especifican** scripts de migración de datos
- ❌ **NO se documentan** procedimientos de migración de `start_date` a `prescription_issue_date`
- ❌ **NO se definen** estrategias de migración de datos históricos con `route`
- ✅ **SÍ se documenta** el impacto en datos existentes para referencia futura

### 5.6 Testing y QA

- ❌ **NO se escriben** casos de prueba
- ❌ **NO se definen** criterios de aceptación formales
- ❌ **NO se especifican** procedimientos de testing
- ✅ **SÍ se documentan** validaciones y reglas que deben probarse

### 5.7 Documentación de Usuario

- ❌ **NO se crea** documentación para usuarios finales
- ❌ **NO se escriben** manuales de usuario
- ❌ **NO se crean** guías de uso
- ✅ **SÍ se documenta** el comportamiento funcional para referencia técnica

---

## 6. REFERENCIAS A ESPECIFICACIONES EXISTENTES

Este documento actualiza las siguientes especificaciones existentes:

- **`docs/specs/02_events/21_ajuste_dosis_medicamentos.md`** - Requiere actualización para eliminar `route`, cambiar `startDate` a `prescriptionIssueDate`, y cambiar `prescribingReason` a `comments` (opcional)
- **`docs/specs/03_timeline/14_timeline_contracts.md`** - Requiere nuevo contrato WRITE-EVENT-MEDICATION-PRESCRIPTION-ISSUED, actualización de contratos existentes para usar `prescription_issue_date` y `comments` (opcional)
- **`docs/specs/01_domain/02_domain.md`** - Requiere actualización de definición de Medication entity: eliminar `route`, cambiar `startDate` a `prescriptionIssueDate`, cambiar `prescribingReason` a `comments` (opcional)
- **`docs/specs/01_domain/10_data_models.md`** - Requiere actualización del modelo de datos Medication: eliminar `route`, cambiar `start_date` a `prescription_issue_date`, cambiar `prescribing_reason` a `comments` (nullable)
- **`docs/specs/99_appendix/04_use_cases.md`** - Requiere actualización de UC-04: eliminar paso de `route`, cambiar "start date" a "prescription issue date", cambiar "prescribing reason" (required) a "comments" (optional)
- **`docs/specs/03_timeline/03_timeline.md`** - Requiere mención del nuevo tipo de evento MedicationPrescriptionIssued
- **`docs/specs/08_quality/16_clinical_qa_manual.md`** - Requiere actualización de pasos de prueba para reflejar cambios en campos

---

**Documento creado:** 2024  
**Última actualización:** 2024  
**Versión:** 1.0  
**Estado:** Especificación funcional - Lista para implementación

