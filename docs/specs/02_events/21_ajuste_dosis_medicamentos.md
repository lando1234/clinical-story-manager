# Especificación Funcional: Ajuste de Dosis de Medicamentos

## 1. Propósito

Este documento define el mecanismo funcional para ajustar la dosis de un medicamento existente en el historial farmacológico del paciente, garantizando la preservación completa de la trazabilidad histórica.

**Principio fundamental:** Ajustar dosis NO es editar un registro, es crear una nueva versión.

---

## 2. Definición de Ajuste de Dosis

### 2.1 Concepto

Un **ajuste de dosis** es una modificación de los parámetros posológicos de un medicamento activo que requiere documentación como un nuevo registro vinculado al registro original, preservando el historial completo del tratamiento.

### 2.2 Parámetros Ajustables

Los siguientes parámetros pueden ser modificados mediante un ajuste de dosis:

- **Dosis** (`dosage`): Cantidad numérica del medicamento
- **Unidad de dosis** (`dosageUnit`): Unidad de medida (mg, ml, tabletas, etc.)
- **Frecuencia** (`frequency`): Intervalo de administración (diario, dos veces al día, etc.)

**Nota:** El nombre del medicamento (`drugName`) NO puede ser modificado mediante un ajuste. Un cambio de medicamento constituye una discontinuación y un nuevo inicio.

### 2.3 Características del Ajuste

- **Inmutabilidad del registro original:** El registro del medicamento original nunca se modifica.
- **Creación de nueva versión:** Se crea un nuevo registro de medicamento vinculado al anterior.
- **Preservación histórica:** Ambos registros (original y ajustado) permanecen en el historial.
- **Trazabilidad completa:** La relación entre versiones se mantiene mediante `predecessorId`.

---

## 3. Relación entre Versiones de un Mismo Medicamento

### 3.1 Estructura de Versiones

Las versiones de un medicamento forman una **cadena lineal** donde:

- Cada versión tiene exactamente **un predecesor** (excepto la versión inicial).
- Cada versión puede tener **múltiples sucesores** (en casos de correcciones, aunque no es el caso normal).
- La relación se establece mediante el campo `predecessorId` en el modelo `Medication`.

### 3.2 Cadena de Versiones

```
Medicamento V1 (Inicial)
    ↓ (predecessorId)
Medicamento V2 (Ajuste 1)
    ↓ (predecessorId)
Medicamento V3 (Ajuste 2)
    ↓ (predecessorId)
Medicamento V4 (Ajuste 3)
```

### 3.3 Identificación de Versiones

- **Versión inicial:** `predecessorId = null`
- **Versiones ajustadas:** `predecessorId` contiene el ID del medicamento predecesor
- **Versión activa:** Única versión con `status = Active` y `endDate = null`
- **Versiones históricas:** Versiones con `status = Discontinued` y `endDate` definido

### 3.4 Navegación del Historial

Para reconstruir el historial completo de un medicamento:

1. Partir de cualquier versión (típicamente la activa).
2. Seguir la cadena de `predecessorId` hacia atrás hasta encontrar `predecessorId = null`.
3. Cada versión en la cadena representa un estado del medicamento en un período específico.

---

## 4. Datos Requeridos para el Ajuste

### 4.1 Datos de Entrada Obligatorios

| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `medicationId` | String (UUID) | Identificador del medicamento a ajustar | Debe existir y estar activo |
| `newDosage` | Decimal | Nueva dosis numérica | > 0 |
| `effectiveDate` | Date | Fecha efectiva del ajuste | No puede ser futura, no puede ser anterior a `prescriptionIssueDate` del medicamento original |
| `changeReason` | String (opcional) | Razón clínica del ajuste | Si se proporciona, no puede estar vacío |

### 4.2 Datos de Entrada Opcionales

| Campo | Tipo | Descripción | Valor por Defecto |
|-------|------|-------------|-------------------|
| `newDosageUnit` | String | Nueva unidad de dosis | Se mantiene la unidad del medicamento original |
| `newFrequency` | String | Nueva frecuencia | Se mantiene la frecuencia del medicamento original |

### 4.3 Datos Derivados Automáticamente

Los siguientes datos se derivan automáticamente del medicamento original:

- `drugName`: Se mantiene idéntico al medicamento original
- `comments`: Se mantiene idéntico al medicamento original (puede ser null)
- `clinicalRecordId`: Se mantiene idéntico al medicamento original
- `predecessorId`: Se establece como el ID del medicamento original

---

## 5. Estado Previo y Estado Posterior

### 5.1 Estado Previo (Medicamento Original)

Antes del ajuste, el medicamento original tiene:

```typescript
{
  id: "med-001",
  status: "Active",
  endDate: null,
  dosage: 50.0,
  dosageUnit: "mg",
  frequency: "Una vez al día",
  prescriptionIssueDate: "2024-01-15",
  predecessorId: null,  // Es la versión inicial
  discontinuationReason: null
}
```

### 5.2 Proceso de Transición

1. **Descontinuación del original:**
   - `status` → `"Discontinued"`
   - `endDate` → `effectiveDate - 1 día`
   - `discontinuationReason` → `changeReason` o `"Dosage changed"`

2. **Creación de nueva versión:**
   - Nuevo registro con `status = "Active"`
   - `prescriptionIssueDate` → `effectiveDate`
   - `predecessorId` → ID del medicamento original
   - Parámetros ajustados según entrada

### 5.3 Estado Posterior (Medicamento Original)

Después del ajuste, el medicamento original queda:

```typescript
{
  id: "med-001",
  status: "Discontinued",
  endDate: "2024-02-14",  // Un día antes de effectiveDate
  dosage: 50.0,  // Inmutable
  dosageUnit: "mg",  // Inmutable
  frequency: "Una vez al día",  // Inmutable
  prescriptionIssueDate: "2024-01-15",  // Inmutable
  predecessorId: null,  // Inmutable
  discontinuationReason: "Dosage changed"
}
```

### 5.4 Estado Posterior (Nueva Versión)

La nueva versión creada tiene:

```typescript
{
  id: "med-002",
  status: "Active",
  endDate: null,
  dosage: 75.0,  // Ajustado
  dosageUnit: "mg",  // Mantenido o ajustado
  frequency: "Una vez al día",  // Mantenido o ajustado
  prescriptionIssueDate: "2024-02-15",  // effectiveDate
  predecessorId: "med-001",  // Vinculado al original
  discontinuationReason: null
}
```

### 5.5 Continuidad Temporal

- El medicamento original cubre el período: `[prescriptionIssueDate, endDate]`
- La nueva versión cubre el período: `[effectiveDate, ∞)` (hasta el próximo ajuste o discontinuación)
- **No hay solapamiento:** `endDate` del original = `effectiveDate - 1 día`
- **No hay brechas:** `prescriptionIssueDate` de la nueva versión = `effectiveDate`

---

## 6. Evento de Timeline Generado

### 6.1 Tipo de Evento

Se genera un evento de tipo `MedicationChange` en el timeline del paciente.

### 6.2 Estructura del Evento

```typescript
{
  id: "event-xxx",
  clinicalRecordId: "record-xxx",
  eventType: "MedicationChange",
  eventDate: effectiveDate,  // Fecha del ajuste
  title: "Sertralina: 50mg → 75mg",  // Formato: "DrugName: oldDosage → newDosage"
  description: changeReason || "Dosage changed",
  sourceType: "Medication",
  sourceId: "med-002",  // ID de la nueva versión
  medicationId: "med-002",
  recordedAt: new Date()  // Timestamp de creación
}
```

### 6.3 Título del Evento

El título se genera automáticamente con el formato:

```
"{drugName}: {oldDosage}{oldUnit} → {newDosage}{newUnit}"
```

**Ejemplos:**
- `"Sertralina: 50mg → 75mg"`
- `"Fluoxetina: 20mg → 40mg"`
- `"Risperidona: 2mg → 3mg"`

Si también cambian otros parámetros (frecuencia, vía), el título puede incluir información adicional según la política de visualización.

### 6.4 Posición en el Timeline

El evento aparece en el timeline ordenado por:

1. `eventDate` (fecha del ajuste)
2. `recordedAt` (timestamp de registro)
3. Prioridad del tipo de evento (`MedicationChange = 3`)
4. `id` del evento (para desempate)

### 6.5 Vinculación con el Medicamento

El evento está vinculado a la **nueva versión** del medicamento mediante:
- `sourceId` = ID de la nueva versión
- `medicationId` = ID de la nueva versión

**Nota:** El evento NO está vinculado al medicamento original, ya que representa el cambio hacia la nueva versión.

---

## 7. Reglas de Consistencia

### 7.1 Una Sola Versión Activa

**Regla R-CONS-1: Unicidad de Versión Activa**

Para un mismo medicamento (mismo `drugName` en el mismo `clinicalRecordId`), solo puede existir **una versión activa** a la vez.

**Validación:**
- Antes de crear una nueva versión activa, se debe verificar que no exista otra versión activa del mismo medicamento.
- Si existe una versión activa, debe ser descontinuada antes de crear la nueva.

**Implementación:**
```typescript
// Verificar que el medicamento original esté activo
if (currentMedication.status !== MedicationStatus.Active) {
  return error("MEDICATION_NOT_ACTIVE");
}

// La transacción garantiza atomicidad
await prisma.$transaction(async (tx) => {
  // Descontinuar original
  await tx.medication.update({
    where: { id: originalId },
    data: { status: "Discontinued", endDate: ... }
  });
  
  // Crear nueva versión activa
  await tx.medication.create({
    data: { status: "Active", ... }
  });
});
```

### 7.2 No Permitir Sobrescritura

**Regla R-CONS-2: Inmutabilidad de Registros**

Ningún registro de medicamento puede ser modificado después de su creación, excepto:
- La transición de `status: Active` → `status: Discontinued` durante un ajuste
- El establecimiento de `endDate` y `discontinuationReason` durante un ajuste

**Campos inmutables:**
- `id`
- `drugName`
- `dosage` (del registro original)
- `dosageUnit` (del registro original)
- `frequency` (del registro original)
- `prescriptionIssueDate`
- `comments`
- `predecessorId`
- `createdAt`

**Validación:**
- No se permiten operaciones `UPDATE` directas sobre campos inmutables.
- Solo se permite `UPDATE` para descontinuar durante un ajuste.

### 7.3 No Permitir Ajustes Futuros

**Regla R-CONS-3: Restricción Temporal**

La fecha efectiva del ajuste (`effectiveDate`) no puede ser una fecha futura.

**Validación:**
```typescript
if (effectiveDate > new Date()) {
  return error("INVALID_TIMESTAMP_FUTURE");
}
```

**Justificación clínica:**
- Los ajustes de dosis documentan cambios que ya han ocurrido o están ocurriendo.
- No se puede documentar un ajuste que aún no ha tenido lugar.
- Si se necesita programar un ajuste futuro, debe documentarse como una nota o planificación, no como un ajuste efectivo.

### 7.4 Restricción de Fecha Mínima

**Regla R-CONS-4: Fecha Efectiva Válida**

La fecha efectiva del ajuste no puede ser anterior a la fecha de emisión de receta del medicamento original.

**Validación:**
```typescript
if (effectiveDate < currentMedication.prescriptionIssueDate) {
  return error("INVALID_DATE_RANGE");
}
```

**Justificación:**
- Un ajuste no puede ocurrir antes de que el medicamento haya sido iniciado.
- Si se necesita documentar un ajuste retroactivo, debe validarse que la fecha esté dentro del rango válido del medicamento original.

### 7.5 Integridad de la Cadena

**Regla R-CONS-5: Integridad Referencial**

La cadena de versiones debe mantener integridad referencial:

- Si un medicamento tiene `predecessorId`, el predecesor debe existir.
- Si un medicamento es descontinuado por un ajuste, debe tener exactamente un sucesor inmediato.
- No pueden existir "huecos" en la cadena (versiones huérfanas).

**Validación:**
- Las foreign keys en la base de datos garantizan la existencia del predecesor.
- La lógica de negocio garantiza que cada descontinuación por ajuste tenga un sucesor.

---

## 8. Visualización Conceptual del Historial

### 8.1 Representación Lineal del Historial

```
Timeline del Medicamento: Sertralina

┌─────────────────────────────────────────────────────────────┐
│ Versión 1 (Inicial)                                          │
│ ID: med-001                                                  │
│ Período: 2024-01-15 → 2024-02-14                            │
│ Dosis: 50mg, Una vez al día, Oral                           │
│ Estado: Discontinued                                         │
│ Razón: Dosage changed                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ (predecessorId)
┌─────────────────────────────────────────────────────────────┐
│ Versión 2 (Ajuste 1)                                         │
│ ID: med-002                                                  │
│ Período: 2024-02-15 → 2024-03-20                             │
│ Dosis: 75mg, Una vez al día, Oral                            │
│ Estado: Discontinued                                         │
│ Razón: Dosage changed                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ (predecessorId)
┌─────────────────────────────────────────────────────────────┐
│ Versión 3 (Ajuste 2) - ACTIVA                                │
│ ID: med-003                                                  │
│ Período: 2024-03-21 → presente                               │
│ Dosis: 100mg, Una vez al día, Oral                           │
│ Estado: Active                                               │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Vista de Timeline de Eventos

```
Timeline del Paciente (Eventos)

2024-01-15  [MedicationStart]  Sertralina: 50mg iniciado
                                Razón: Tratamiento de depresión

2024-02-15  [MedicationChange] Sertralina: 50mg → 75mg
                                Razón: Aumento por respuesta subóptima

2024-03-21  [MedicationChange] Sertralina: 75mg → 100mg
                                Razón: Optimización de dosis

2024-04-10  [Encounter]        Consulta de seguimiento
```

### 8.3 Vista de Estado Actual

```
Medicamentos Activos (Estado Actual)

Sertralina
├─ Dosis actual: 100mg
├─ Frecuencia: Una vez al día
├─ Vía: Oral
├─ Iniciado: 2024-01-15
└─ Último ajuste: 2024-03-21 (75mg → 100mg)
```

### 8.4 Vista de Historial Completo

```
Historial de Sertralina

1. 2024-01-15 → 2024-02-14
   Dosis: 50mg, Una vez al día, Oral
   Estado: Discontinued
   Razón de discontinuación: Dosage changed

2. 2024-02-15 → 2024-03-20
   Dosis: 75mg, Una vez al día, Oral
   Estado: Discontinued
   Razón de discontinuación: Dosage changed

3. 2024-03-21 → presente
   Dosis: 100mg, Una vez al día, Oral
   Estado: Active
```

### 8.5 Navegación del Historial

Para navegar el historial:

1. **Desde la versión activa hacia atrás:**
   - Partir de `med-003` (versión activa)
   - Seguir `predecessorId` → `med-002`
   - Seguir `predecessorId` → `med-001`
   - `predecessorId = null` → fin de la cadena

2. **Desde cualquier versión hacia adelante:**
   - Partir de cualquier versión (ej: `med-001`)
   - Buscar en `successors` → `med-002`
   - Buscar en `successors` de `med-002` → `med-003`
   - Continuar hasta encontrar la versión activa

---

## 9. Errores Clínicos que se Evitan con este Modelo

### 9.1 Pérdida de Trazabilidad Histórica

**Error evitado:** Modificar directamente la dosis de un medicamento sin preservar el historial.

**Consecuencia sin el modelo:**
- Imposibilidad de conocer qué dosis tenía el paciente en una fecha histórica específica.
- Pérdida de información sobre la evolución del tratamiento.
- Dificultad para evaluar la efectividad de ajustes previos.

**Protección del modelo:**
- Cada versión preserva su estado completo e inmutable.
- El historial completo está disponible para consulta en cualquier momento.
- La reconstrucción del estado histórico es precisa y completa.

### 9.2 Múltiples Versiones Activas Simultáneas

**Error evitado:** Tener múltiples registros activos del mismo medicamento con diferentes dosis.

**Consecuencia sin el modelo:**
- Confusión sobre cuál es la dosis actual correcta.
- Riesgo de prescripción errónea basada en información inconsistente.
- Imposibilidad de determinar el estado real del tratamiento.

**Protección del modelo:**
- Regla R-CONS-1 garantiza una sola versión activa.
- La transacción atómica previene condiciones de carrera.
- La validación previa bloquea la creación de versiones activas duplicadas.

### 9.3 Sobrescritura de Información Clínica

**Error evitado:** Editar un registro existente, perdiendo la información original.

**Consecuencia sin el modelo:**
- Imposibilidad de auditar cambios realizados.
- Pérdida de evidencia sobre decisiones clínicas previas.
- Violación de principios de integridad de registros médicos.

**Protección del modelo:**
- Regla R-CONS-2 garantiza inmutabilidad de registros.
- Cada cambio se documenta como un nuevo registro.
- El historial completo de cambios es auditable.

### 9.4 Ajustes Retroactivos Incorrectos

**Error evitado:** Documentar ajustes con fechas que violan la lógica temporal.

**Consecuencia sin el modelo:**
- Ajustes documentados antes de que el medicamento fuera iniciado.
- Solapamientos temporales entre versiones.
- Brechas temporales en el historial del tratamiento.

**Protección del modelo:**
- Regla R-CONS-3 previene ajustes futuros.
- Regla R-CONS-4 previene ajustes anteriores al inicio.
- El cálculo automático de `endDate` previene solapamientos y brechas.

### 9.5 Pérdida de Contexto Clínico

**Error evitado:** Ajustar dosis sin documentar la razón clínica.

**Consecuencia sin el modelo:**
- Imposibilidad de entender por qué se realizó un ajuste.
- Dificultad para evaluar la efectividad de decisiones previas.
- Falta de contexto para futuras decisiones clínicas.

**Protección del modelo:**
- El campo `changeReason` documenta la razón del ajuste.
- El evento de timeline incluye la razón en la descripción.
- El historial completo preserva el contexto de cada decisión.

### 9.6 Inconsistencias en el Timeline

**Error evitado:** Eventos de timeline que no reflejan correctamente los cambios de medicamentos.

**Consecuencia sin el modelo:**
- Timeline con información incorrecta o desincronizada.
- Imposibilidad de reconstruir el estado histórico preciso.
- Confusión en la visualización cronológica del tratamiento.

**Protección del modelo:**
- Generación automática de eventos `MedicationChange` durante el ajuste.
- Vinculación correcta entre eventos y versiones de medicamentos.
- Ordenamiento garantizado según reglas de timeline.

### 9.7 Imposibilidad de Corrección de Errores

**Error evitado:** No poder corregir un ajuste documentado incorrectamente.

**Consecuencia sin el modelo:**
- Errores permanentes en el historial.
- Imposibilidad de rectificar documentación incorrecta.
- Compromiso de la integridad del registro clínico.

**Protección del modelo:**
- Aunque no se permite editar, se puede descontinuar una versión errónea.
- Se puede crear una nueva versión con la información correcta.
- El historial preserva tanto el error como la corrección, manteniendo transparencia.

---

## 10. Flujo de Operación Completo

### 10.1 Flujo de Ajuste de Dosis

```
1. Usuario solicita ajuste de dosis
   ↓
2. Sistema valida:
   - medicationId existe
   - Medicamento está activo
   - effectiveDate no es futura
   - effectiveDate >= prescriptionIssueDate del original
   - newDosage > 0
   ↓
3. Sistema inicia transacción atómica:
   ↓
4. Sistema descontinúa medicamento original:
   - status → Discontinued
   - endDate → effectiveDate - 1 día
   - discontinuationReason → changeReason
   ↓
5. Sistema crea nueva versión:
   - status → Active
   - prescriptionIssueDate → effectiveDate
   - predecessorId → ID del original
   - Parámetros ajustados según entrada
   ↓
6. Sistema confirma transacción
   ↓
7. Sistema genera evento MedicationChange:
   - eventType → MedicationChange
   - eventDate → effectiveDate
   - title → "DrugName: oldDosage → newDosage"
   - description → changeReason
   - sourceId → ID de nueva versión
   ↓
8. Sistema retorna nueva versión del medicamento
```

### 10.2 Validaciones en Detalle

**Validación V1: Existencia del Medicamento**
```typescript
const medication = await findMedication(medicationId);
if (!medication) {
  return error("MEDICATION_NOT_FOUND");
}
```

**Validación V2: Estado Activo**
```typescript
if (medication.status !== "Active") {
  return error("MEDICATION_NOT_ACTIVE");
}
```

**Validación V3: Fecha No Futura**
```typescript
if (effectiveDate > new Date()) {
  return error("INVALID_TIMESTAMP_FUTURE");
}
```

**Validación V4: Fecha Válida**
```typescript
if (effectiveDate < medication.prescriptionIssueDate) {
  return error("INVALID_DATE_RANGE");
}
```

**Validación V5: Dosis Positiva**
```typescript
if (newDosage <= 0) {
  return error("INVALID_DOSAGE");
}
```

### 10.3 Transacción Atómica

La operación completa se ejecuta en una transacción atómica para garantizar:

- **Consistencia:** O se completa todo el ajuste, o no se realiza ningún cambio.
- **Integridad:** No puede quedar el medicamento original descontinuado sin una nueva versión activa.
- **Atomicidad:** No puede existir un estado intermedio visible para otros procesos.

---

## 11. Casos de Uso Específicos

### 11.1 Ajuste Simple de Dosis

**Escenario:** Aumentar dosis de 50mg a 75mg el 15 de febrero de 2024.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  newDosage: 75,
  effectiveDate: "2024-02-15",
  changeReason: "Aumento por respuesta subóptima"
}
```

**Resultado:**
- `med-001`: Descontinuado el 14 de febrero de 2024
- `med-002`: Creado, activo desde el 15 de febrero de 2024
- Evento `MedicationChange` generado para el 15 de febrero

### 11.2 Ajuste Múltiple de Parámetros

**Escenario:** Ajustar dosis (50mg → 75mg) y frecuencia (una vez al día → dos veces al día) el 20 de marzo de 2024.

**Entrada:**
```typescript
{
  medicationId: "med-002",
  newDosage: 75,
  newFrequency: "Dos veces al día",
  effectiveDate: "2024-03-20",
  changeReason: "Optimización de régimen posológico"
}
```

**Resultado:**
- `med-002`: Descontinuado el 19 de marzo de 2024
- `med-003`: Creado con dosis 75mg y frecuencia "Dos veces al día", activo desde el 20 de marzo
- Evento `MedicationChange` generado

### 11.3 Ajuste Retroactivo (Válido)

**Escenario:** Documentar un ajuste que ocurrió hace una semana.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  newDosage: 75,
  effectiveDate: "2024-02-08",  // Hace una semana
  changeReason: "Ajuste documentado retroactivamente"
}
```

**Validación:**
- `effectiveDate < new Date()` ✓ (no es futura)
- `effectiveDate >= medication.prescriptionIssueDate` ✓ (después de la emisión de receta)

**Resultado:**
- Ajuste documentado correctamente con fecha retroactiva
- El evento aparece en el timeline en la fecha correcta (8 de febrero)

### 11.4 Intento de Ajuste Futuro (Rechazado)

**Escenario:** Intentar documentar un ajuste programado para mañana.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  newDosage: 75,
  effectiveDate: "2025-12-31",  // Fecha futura
  changeReason: "Ajuste programado"
}
```

**Resultado:**
- Error: `INVALID_TIMESTAMP_FUTURE`
- No se realiza ningún cambio
- El medicamento original permanece activo

---

## 12. Consideraciones de Implementación

### 12.1 Transacciones de Base de Datos

El ajuste de dosis debe ejecutarse en una transacción atómica para garantizar:

- Descontinuación del original y creación de la nueva versión ocurren juntas.
- No puede existir un estado donde el original esté descontinuado sin sucesor.
- Rollback automático en caso de error en cualquier paso.

### 12.2 Generación de Eventos

El evento `MedicationChange` debe generarse:

- **Después** de la creación exitosa de la nueva versión.
- **Con** la información correcta de la nueva versión.
- **Vinculado** a la nueva versión mediante `sourceId` y `medicationId`.

### 12.3 Consultas de Historial

Para consultar el historial completo de un medicamento:

```typescript
// Obtener versión activa
const active = await findActiveMedication(drugName, clinicalRecordId);

// Navegar hacia atrás
let current = active;
const history = [active];
while (current.predecessorId) {
  current = await findMedication(current.predecessorId);
  history.unshift(current);  // Agregar al inicio para orden cronológico
}
```

### 12.4 Consultas de Estado Histórico

Para determinar qué medicamento estaba activo en una fecha histórica:

```typescript
function getActiveMedicationOnDate(
  drugName: string,
  clinicalRecordId: string,
  targetDate: Date
): Medication | null {
  // Buscar todas las versiones del medicamento
  const versions = await findMedicationVersions(drugName, clinicalRecordId);
  
  // Encontrar la versión activa en targetDate
  return versions.find(med => 
    med.prescriptionIssueDate <= targetDate &&
    (med.endDate === null || med.endDate >= targetDate)
  ) || null;
}
```

---

## 13. Resumen de Principios Clave

1. **Inmutabilidad:** Los registros de medicamentos nunca se modifican, solo se descontinúan y se crean nuevas versiones.

2. **Trazabilidad:** Cada versión está vinculada a su predecesor, permitiendo reconstruir el historial completo.

3. **Unicidad Activa:** Solo una versión de un medicamento puede estar activa a la vez.

4. **Temporalidad:** Los ajustes no pueden ser futuros y deben respetar la secuencia temporal del tratamiento.

5. **Eventos Automáticos:** Cada ajuste genera automáticamente un evento en el timeline.

6. **Atomicidad:** El ajuste completo (descontinuación + creación) ocurre en una transacción atómica.

7. **Preservación Histórica:** Todo el historial se preserva para consulta y auditoría.

---

## 14. Referencias

- **Modelo de Datos:** `docs/10_data_models.md` - Sección Medication
- **Dominio:** `docs/02_domain.md` - Sección Medication Entity
- **Contratos de Timeline:** `docs/14_timeline_contracts.md` - WRITE-EVENT-MEDICATION-CHANGE
- **Implementación:** `src/domain/medications/medication-service.ts` - `changeMedication()`

---

**Documento creado:** 2024
**Última actualización:** 2024
**Versión:** 1.0
