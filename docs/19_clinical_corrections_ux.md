# Sistema de Historia Clínica Psiquiátrica — Diseño UX: Flujo de Correcciones Clínicas

## Overview

Este documento define el diseño UX del flujo de **Correcciones Clínicas** del sistema, garantizando que **ninguna corrección implique borrado, sobrescritura o pérdida de información**, y que toda modificación sea **aditiva, trazable y conforme a las invariantes clínicas**.

**Alcance:** Este documento especifica **QUÉ debe permitir el sistema y CÓMO debe presentarse al clínico**, sin introducir nuevas features ni alterar el dominio.

---

## 1. Alcance y Restricciones

### 1.1 Alcance Permitido (Estricto)

El sistema permite correcciones exclusivamente mediante:

1. **Corrección de notas finalizadas** → exclusivamente mediante **Addendum**
2. **Corrección / actualización de Historia Psiquiátrica** → exclusivamente mediante **nueva versión**

**Casos de uso para correcciones:**
- Error factual en nota finalizada
- Omisión relevante en nota finalizada
- Información conocida posteriormente que debe agregarse a nota finalizada
- Corrección de información en Historia Psiquiátrica
- Actualización de Historia Psiquiátrica con nueva información

### 1.2 Alcance Prohibido (Bloqueante)

El sistema **NO permite**:
- ❌ Editar contenido de notas finalizadas
- ❌ Borrar notas, eventos o versiones
- ❌ Modificar timestamps históricos
- ❌ Generar eventos no especificados
- ❌ Introducir nuevas entidades o estados
- ❌ Simplificar flujos a costa de invariantes

---

## 2. Flujo 1: Addendum sobre Nota Finalizada

### 2.1 Punto de Inicio

**Contexto:** El clínico está visualizando una nota finalizada en el timeline o en la vista de detalle de la nota.

**Condición previa:** La nota debe estar en estado `Finalized`.

**Acceso al flujo:**
- Desde la vista de detalle de la nota finalizada
- Botón visible: "Agregar addendum" o "Corregir nota"
- El botón aparece únicamente si `note.status === Finalized`

### 2.2 Flujo Paso a Paso

#### Paso 1: Iniciar Corrección
1. Clínico visualiza nota finalizada
2. Clínico identifica necesidad de corrección o adición de información
3. Clínico hace clic en "Agregar addendum"
4. Sistema valida que la nota está finalizada
5. Sistema muestra formulario de addendum

**Validación en este paso:**
- Si `note.status !== Finalized` → Bloquear con mensaje: "Solo se pueden agregar addenda a notas finalizadas. Esta nota está en estado borrador."

#### Paso 2: Completar Formulario
1. Sistema muestra formulario con dos campos:
   - **Campo 1: Contenido** (textarea, requerido)
     - Label: "Contenido del addendum"
     - Placeholder: "Ingrese la información adicional o corrección..."
     - Validación: No puede estar vacío (después de trim)
   - **Campo 2: Razón** (textarea, requerido)
     - Label: "Razón del addendum"
     - Placeholder: "Explique por qué se agrega este addendum..."
     - Validación: No puede estar vacío (después de trim)
2. Clínico completa ambos campos
3. Clínico puede cancelar (cierra formulario sin guardar)

**Estados del formulario:**
- Campos vacíos → Botón "Guardar addendum" deshabilitado
- Al menos un campo con contenido → Botón "Guardar addendum" habilitado
- Validación en tiempo real: mostrar error si campo queda vacío tras trim

#### Paso 3: Confirmación y Guardado
1. Clínico hace clic en "Guardar addendum"
2. Sistema valida:
   - Contenido no vacío (después de trim)
   - Razón no vacía (después de trim)
   - Nota sigue siendo finalizada (verificación de estado)
3. Si validación falla → Mostrar mensaje de error específico
4. Si validación pasa → Sistema crea addendum
5. Sistema muestra confirmación: "Addendum agregado correctamente"
6. Sistema actualiza vista para mostrar nota con addendum

**Post-condiciones:**
- Addendum creado con `noteId` vinculado a la nota original
- Addendum es inmutable desde su creación
- Nota original permanece inalterada
- Addendum aparece en la vista junto a la nota original

### 2.3 Acciones Permitidas

| Acción | Cuándo | Resultado |
|--------|--------|-----------|
| Ver nota finalizada | Siempre | Muestra contenido original |
| Agregar addendum | Solo si nota está finalizada | Crea nuevo addendum |
| Ver addenda existentes | Siempre | Muestra todos los addenda en orden cronológico |
| Cancelar creación de addendum | Durante formulario | Cierra formulario sin guardar |

### 2.4 Acciones Bloqueadas

| Acción | Cuándo | Mensaje de Bloqueo |
|--------|--------|-------------------|
| Editar contenido de nota finalizada | Siempre | "Las notas finalizadas no son editables. Use un addendum para agregar información o correcciones." |
| Editar addendum existente | Siempre | "Los addenda no son editables una vez creados." |
| Borrar addendum | Siempre | "Los addenda no pueden eliminarse. Son parte del registro clínico permanente." |
| Agregar addendum a nota borrador | Si nota está en Draft | "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente." |

### 2.5 Confirmaciones Explícitas

**No se requiere confirmación explícita para:**
- Abrir formulario de addendum
- Cancelar formulario

**Confirmación implícita:**
- El acto de hacer clic en "Guardar addendum" es la confirmación
- El sistema muestra mensaje de éxito tras guardar: "Addendum agregado correctamente"

### 2.6 Visibilidad y Estados

#### Vista de Nota Finalizada (sin addenda)
- **Campos visibles:**
  - Fecha de encuentro (solo lectura)
  - Tipo de encuentro (solo lectura)
  - Subjetivo (solo lectura)
  - Objetivo (solo lectura)
  - Evaluación (solo lectura)
  - Plan (solo lectura)
  - Fecha de finalización (solo lectura)
- **Acciones visibles:**
  - "Agregar addendum" (habilitado)
  - "Ver timeline" (habilitado)
- **Indicadores:**
  - Badge: "Finalizada"
  - Icono de candado en campos de contenido

#### Vista de Nota Finalizada (con addenda)
- **Mismo contenido que arriba, más:**
  - Sección "Addenda" debajo del contenido original
  - Cada addendum muestra:
    - Fecha de creación (solo lectura)
    - Contenido (solo lectura)
    - Razón (solo lectura)
    - Separador visual entre addenda
  - Addenda ordenados cronológicamente (más antiguo primero)
- **Acciones visibles:**
  - "Agregar addendum" (habilitado)
  - "Ver timeline" (habilitado)
- **Indicadores:**
  - Contador: "X addenda" en la sección de addenda

#### Formulario de Addendum
- **Campos editables:**
  - Contenido (textarea)
  - Razón (textarea)
- **Acciones visibles:**
  - "Guardar addendum" (habilitado si campos válidos)
  - "Cancelar" (siempre habilitado)
- **Indicadores:**
  - Campos requeridos marcados con asterisco (*)
  - Mensajes de validación en tiempo real

---

## 3. Flujo 2: Nueva Versión de PsychiatricHistory

### 3.1 Punto de Inicio

**Contexto:** El clínico está visualizando la Historia Psiquiátrica actual del paciente.

**Condición previa:** Debe existir al menos una versión de PsychiatricHistory (versión 1 creada al registrar paciente).

**Acceso al flujo:**
- Desde la vista de Historia Psiquiátrica
- Botón visible: "Actualizar historia" o "Crear nueva versión"
- El botón aparece siempre (siempre se puede crear una nueva versión)

### 3.2 Flujo Paso a Paso

#### Paso 1: Iniciar Actualización
1. Clínico visualiza Historia Psiquiátrica actual
2. Clínico identifica necesidad de corrección o actualización
3. Clínico hace clic en "Actualizar historia"
4. Sistema carga versión actual (is_current = true)
5. Sistema muestra formulario pre-poblado con valores actuales

**Validación en este paso:**
- Sistema verifica que existe versión actual
- Si no existe versión actual → Error: "No se encontró historia psiquiátrica actual"

#### Paso 2: Editar Contenido
1. Sistema muestra formulario con todos los campos de Historia Psiquiátrica:
   - Motivo de consulta (textarea, opcional)
   - Historia de la enfermedad actual (textarea, opcional)
   - Antecedentes psiquiátricos (textarea, opcional)
   - Hospitalizaciones previas (textarea, opcional)
   - Antecedentes de intentos de suicidio (textarea, opcional)
   - Antecedentes de uso de sustancias (textarea, opcional)
   - Antecedentes psiquiátricos familiares (textarea, opcional)
   - Antecedentes médicos (textarea, opcional)
   - Antecedentes quirúrgicos (textarea, opcional)
   - Alergias (textarea, opcional)
   - Historia social (textarea, opcional)
   - Historia del desarrollo (textarea, opcional)
2. Clínico modifica uno o más campos
3. Clínico puede cancelar (cierra formulario sin guardar)

**Estados del formulario:**
- Todos los campos son opcionales
- Validación: Al menos un campo debe tener contenido diferente a la versión actual
- Si todos los campos son idénticos a la versión actual → Botón "Guardar nueva versión" deshabilitado con mensaje: "No hay cambios para guardar"

#### Paso 3: Confirmación y Guardado
1. Clínico hace clic en "Guardar nueva versión"
2. Sistema valida:
   - Al menos un campo tiene contenido diferente a la versión actual
   - Versión actual sigue existiendo
3. Si validación falla → Mostrar mensaje de error específico
4. Si validación pasa → Sistema crea nueva versión:
   - Marca versión actual con `is_current = false`
   - Establece `superseded_at = now()` en versión anterior
   - Crea nueva versión con `version_number = anterior + 1`
   - Marca nueva versión con `is_current = true`
   - Genera evento "History Update" (solo si version_number >= 2)
5. Sistema muestra confirmación: "Historia psiquiátrica actualizada. Nueva versión creada."
6. Sistema actualiza vista para mostrar nueva versión como actual

**Post-condiciones:**
- Nueva versión creada con número incrementado
- Versión anterior marcada como no actual (is_current = false)
- Versión anterior tiene superseded_at establecido
- Si version_number >= 2 → Evento "History Update" generado
- Versión anterior permanece accesible en historial de versiones
- Nueva versión es inmutable desde su creación

### 3.3 Acciones Permitidas

| Acción | Cuándo | Resultado |
|--------|--------|-----------|
| Ver versión actual | Siempre | Muestra versión con is_current = true |
| Crear nueva versión | Siempre | Crea nueva versión y marca anterior como no actual |
| Ver historial de versiones | Siempre | Muestra todas las versiones con fechas |
| Ver versión histórica específica | Siempre | Muestra versión seleccionada (solo lectura) |
| Cancelar creación de nueva versión | Durante formulario | Cierra formulario sin guardar |

### 3.4 Acciones Bloqueadas

| Acción | Cuándo | Mensaje de Bloqueo |
|--------|--------|-------------------|
| Editar versión existente | Siempre | "Las versiones de historia psiquiátrica no son editables. Cree una nueva versión para actualizar la información." |
| Borrar versión | Siempre | "Las versiones de historia psiquiátrica no pueden eliminarse. Son parte del registro clínico permanente." |
| Modificar número de versión | Siempre | "El número de versión es asignado automáticamente por el sistema." |
| Modificar fecha de creación | Siempre | "La fecha de creación no puede modificarse." |
| Modificar fecha de supersedencia | Siempre | "La fecha de supersedencia es asignada automáticamente por el sistema." |

### 3.5 Confirmaciones Explícitas

**No se requiere confirmación explícita para:**
- Abrir formulario de actualización
- Cancelar formulario

**Confirmación implícita:**
- El acto de hacer clic en "Guardar nueva versión" es la confirmación
- El sistema muestra mensaje de éxito tras guardar: "Historia psiquiátrica actualizada. Nueva versión creada."

**Advertencia visual (opcional pero recomendado):**
- Mostrar mensaje informativo: "Se creará una nueva versión. La versión actual quedará preservada en el historial."

### 3.6 Visibilidad y Estados

#### Vista de Historia Psiquiátrica Actual
- **Campos visibles (todos solo lectura):**
  - Número de versión (badge: "Versión X")
  - Fecha de creación
  - Todos los campos de contenido (motivo de consulta, antecedentes, etc.)
  - Si existe versión anterior → Indicador: "Versión anterior disponible"
- **Acciones visibles:**
  - "Actualizar historia" (habilitado)
  - "Ver historial de versiones" (habilitado si hay más de una versión)
- **Indicadores:**
  - Badge: "Versión actual"
  - Icono de candado en todos los campos

#### Vista de Historial de Versiones
- **Lista de versiones:**
  - Cada versión muestra:
    - Número de versión
    - Fecha de creación
    - Fecha de supersedencia (si aplica)
    - Badge "Actual" o "Histórica"
    - Botón "Ver detalles"
  - Versiones ordenadas por número (más reciente primero)
- **Acciones visibles:**
  - "Ver detalles" para cada versión (habilitado)
  - "Volver a versión actual" (habilitado)

#### Vista de Versión Histórica Específica
- **Mismo formato que versión actual, pero:**
  - Badge: "Versión histórica"
  - Todos los campos solo lectura
  - Fecha de supersedencia visible (si aplica)
- **Acciones visibles:**
  - "Volver a historial" (habilitado)
  - "Ver versión actual" (habilitado)

#### Formulario de Nueva Versión
- **Campos editables:**
  - Todos los campos de Historia Psiquiátrica (pre-poblados con valores actuales)
- **Acciones visibles:**
  - "Guardar nueva versión" (habilitado si hay cambios)
  - "Cancelar" (siempre habilitado)
- **Indicadores:**
  - Mensaje informativo: "Se creará una nueva versión. La versión actual quedará preservada."
  - Campos modificados destacados visualmente (opcional)

---

## 4. Estados y Visibilidad

### 4.1 Estados de Nota

| Estado | Campos Editables | Acciones Disponibles | Indicadores Visuales |
|--------|------------------|---------------------|---------------------|
| **Draft** | Todos (subjetivo, objetivo, evaluación, plan, fecha, tipo) | Editar, Finalizar, Eliminar | Badge "Borrador", campos editables |
| **Finalized** | Ninguno | Agregar addendum, Ver timeline | Badge "Finalizada", icono de candado, campos solo lectura |

### 4.2 Estados de Addendum

| Estado | Campos Editables | Acciones Disponibles | Indicadores Visuales |
|--------|------------------|---------------------|---------------------|
| **Creado** | Ninguno | Ver (solo lectura) | Fecha de creación visible, contenido y razón solo lectura |

### 4.3 Estados de PsychiatricHistory

| Estado | Campos Editables | Acciones Disponibles | Indicadores Visuales |
|--------|------------------|---------------------|---------------------|
| **Versión Actual** | Ninguno (solo lectura) | Crear nueva versión, Ver historial | Badge "Versión actual", icono de candado |
| **Versión Histórica** | Ninguno (solo lectura) | Ver detalles | Badge "Versión histórica", fecha de supersedencia visible |

### 4.4 Campos Solo Lectura (Inmutables)

**Nota Finalizada:**
- Fecha de encuentro
- Tipo de encuentro
- Subjetivo
- Objetivo
- Evaluación
- Plan
- Fecha de finalización

**Addendum:**
- Contenido
- Razón
- Fecha de creación

**PsychiatricHistory (cualquier versión):**
- Todos los campos de contenido
- Número de versión
- Fecha de creación
- Fecha de supersedencia (si aplica)

### 4.5 Acciones que Aparecen / Desaparecen

**En Nota Finalizada:**
- ✅ Aparece: "Agregar addendum"
- ❌ Desaparece: "Editar nota", "Eliminar nota"

**En Nota Borrador:**
- ✅ Aparece: "Editar nota", "Finalizar nota", "Eliminar nota"
- ❌ Desaparece: "Agregar addendum"

**En Addendum:**
- ✅ Aparece: Ninguna acción (solo lectura)
- ❌ Desaparece: Todas las acciones de edición/eliminación

**En Historia Psiquiátrica:**
- ✅ Aparece siempre: "Actualizar historia"
- ✅ Aparece si hay >1 versión: "Ver historial de versiones"
- ❌ Desaparece siempre: "Editar versión", "Eliminar versión"

---

## 5. Microcopy Clínica (Español)

### 5.1 Mensajes de Bloqueo

| Contexto | Mensaje |
|----------|---------|
| Intentar editar nota finalizada | "Las notas finalizadas no son editables. Use un addendum para agregar información o correcciones." |
| Intentar editar addendum | "Los addenda no son editables una vez creados." |
| Intentar borrar addendum | "Los addenda no pueden eliminarse. Son parte del registro clínico permanente." |
| Agregar addendum a nota borrador | "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente." |
| Editar versión de historia | "Las versiones de historia psiquiátrica no son editables. Cree una nueva versión para actualizar la información." |
| Borrar versión de historia | "Las versiones de historia psiquiátrica no pueden eliminarse. Son parte del registro clínico permanente." |

### 5.2 Mensajes de Guía

| Contexto | Mensaje |
|----------|---------|
| Botón agregar addendum | "Agregar addendum" |
| Explicación de addendum | "Los addenda permiten agregar información o correcciones a notas finalizadas sin modificar el contenido original." |
| Botón actualizar historia | "Actualizar historia" |
| Explicación de nueva versión | "Se creará una nueva versión. La versión actual quedará preservada en el historial." |
| Información sobre versiones | "Todas las versiones anteriores permanecen accesibles para consulta histórica." |

### 5.3 Mensajes de Confirmación

| Acción | Mensaje |
|--------|---------|
| Addendum creado exitosamente | "Addendum agregado correctamente" |
| Nueva versión creada exitosamente | "Historia psiquiátrica actualizada. Nueva versión creada." |

### 5.4 Mensajes de Error

| Error | Mensaje |
|-------|---------|
| Contenido de addendum vacío | "El contenido del addendum es requerido." |
| Razón de addendum vacía | "La razón del addendum es requerida." |
| Nota no finalizada al crear addendum | "Solo se pueden agregar addenda a notas finalizadas." |
| No hay cambios en nueva versión | "No hay cambios para guardar. Modifique al menos un campo para crear una nueva versión." |
| Versión actual no encontrada | "No se encontró historia psiquiátrica actual." |

### 5.5 Labels y Placeholders

| Campo | Label | Placeholder |
|--------|-------|-------------|
| Contenido addendum | "Contenido del addendum" | "Ingrese la información adicional o corrección..." |
| Razón addendum | "Razón del addendum" | "Explique por qué se agrega este addendum..." |
| Motivo de consulta | "Motivo de consulta" | "Ingrese el motivo principal de consulta..." |
| Historia enfermedad actual | "Historia de la enfermedad actual" | "Describa la evolución del cuadro actual..." |

### 5.6 Indicadores de Estado

| Estado | Texto del Badge |
|--------|----------------|
| Nota borrador | "Borrador" |
| Nota finalizada | "Finalizada" |
| Versión actual | "Versión actual" |
| Versión histórica | "Versión histórica" |
| Addendum | "Addendum" (con fecha) |

---

## 6. Manejo de Errores

### 6.1 Errores Bloqueantes

| Error | Condición | Mensaje al Usuario | Acción del Sistema |
|-------|-----------|-------------------|-------------------|
| **NOTA_NO_FINALIZADA** | Intentar agregar addendum a nota borrador | "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente." | Bloquear creación de addendum |
| **CONTENIDO_VACIO** | Contenido de addendum vacío tras trim | "El contenido del addendum es requerido." | Bloquear guardado, mostrar error en campo |
| **RAZON_VACIA** | Razón de addendum vacía tras trim | "La razón del addendum es requerida." | Bloquear guardado, mostrar error en campo |
| **NOTA_NO_ENCONTRADA** | Nota no existe al crear addendum | "La nota especificada no existe." | Bloquear creación, mostrar error |
| **SIN_CAMBIOS** | Nueva versión sin cambios respecto a actual | "No hay cambios para guardar. Modifique al menos un campo para crear una nueva versión." | Bloquear guardado, mostrar error |
| **HISTORIA_NO_ENCONTRADA** | Versión actual no existe | "No se encontró historia psiquiátrica actual." | Bloquear actualización, mostrar error |

### 6.2 Mensajes de Error Orientados a Práctica Clínica

**Principios:**
- Mensajes en español, profesional, neutral
- Explican QUÉ está mal y POR QUÉ no se puede proceder
- Sugieren acción alternativa cuando aplica
- Sin mensajes técnicos (códigos de error, stack traces)

**Ejemplos de mensajes correctos:**
- ✅ "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente."
- ✅ "El contenido del addendum es requerido."
- ✅ "No hay cambios para guardar. Modifique al menos un campo para crear una nueva versión."

**Ejemplos de mensajes incorrectos:**
- ❌ "Error 400: Bad Request"
- ❌ "NOTE_NOT_FINALIZED"
- ❌ "Validation failed: content is empty"

### 6.3 Errores No Bloqueantes (Advertencias)

| Advertencia | Condición | Mensaje | Acción del Sistema |
|-------------|-----------|---------|-------------------|
| **Versión anterior disponible** | Existe versión anterior | "Versión anterior disponible en historial" | Mostrar como información, no bloquea |

### 6.4 Errores del Sistema (No Mostrados al Usuario)

| Error Técnico | Manejo |
|---------------|--------|
| Error de base de datos | Registrar en logs, mostrar mensaje genérico: "Ocurrió un error al guardar. Por favor, intente nuevamente." |
| Error de red | Registrar en logs, mostrar mensaje genérico: "Error de conexión. Verifique su conexión e intente nuevamente." |
| Error inesperado | Registrar en logs con detalles técnicos, mostrar mensaje genérico: "Ocurrió un error inesperado. Por favor, contacte al soporte si el problema persiste." |

---

## 7. Checklist de Cumplimiento

### 7.1 Flujo: Addendum sobre Nota Finalizada

#### Inmutabilidad
- [x] Nota original permanece inalterada al crear addendum
- [x] Campos de nota finalizada son solo lectura
- [x] Addendum es inmutable desde su creación
- [x] No se permite editar addendum existente
- [x] No se permite borrar addendum

#### Aditividad
- [x] Addendum se agrega sin modificar nota original
- [x] Múltiples addenda pueden agregarse a la misma nota
- [x] Addenda se muestran junto a nota original (no reemplazan)

#### Trazabilidad
- [x] Cada addendum tiene fecha de creación
- [x] Cada addendum tiene razón explícita
- [x] Addenda se muestran en orden cronológico
- [x] Relación addendum-nota es permanente

#### No Generación Indebida de Eventos
- [x] Crear addendum NO genera evento en timeline
- [x] Addenda no aparecen como eventos separados
- [x] Solo la nota finalizada genera evento Encounter

#### Cumplimiento de Invariantes del Timeline
- [x] Addenda no afectan orden del timeline
- [x] Addenda no modifican fecha de evento de nota
- [x] Addenda no crean nuevos eventos

### 7.2 Flujo: Nueva Versión de PsychiatricHistory

#### Inmutabilidad
- [x] Versión anterior permanece inalterada
- [x] Campos de versión anterior son solo lectura
- [x] Nueva versión es inmutable desde su creación
- [x] No se permite editar versión existente
- [x] No se permite borrar versión

#### Aditividad
- [x] Nueva versión se crea sin modificar versión anterior
- [x] Versión anterior queda marcada como no actual (is_current = false)
- [x] Versión anterior tiene superseded_at establecido
- [x] Todas las versiones permanecen accesibles

#### Trazabilidad
- [x] Cada versión tiene número secuencial
- [x] Cada versión tiene fecha de creación
- [x] Versiones anteriores tienen fecha de supersedencia
- [x] Historial de versiones es completo y accesible
- [x] Versiones forman secuencia contigua (sin gaps)

#### No Generación Indebida de Eventos
- [x] Versión 1 NO genera evento History Update
- [x] Versión 2+ genera exactamente un evento History Update
- [x] Evento se genera solo al crear nueva versión (no al ver)

#### Cumplimiento de Invariantes del Timeline
- [x] Evento History Update aparece en fecha de creación de nueva versión
- [x] Evento no modifica posición de otros eventos
- [x] Versión actual es correcta para fecha actual
- [x] Versión histórica es correcta para fecha histórica

---

## 8. Supuestos Explícitos

### 8.1 Qué NO Hace el Sistema

**Correcciones:**
- ❌ El sistema NO permite editar contenido de notas finalizadas
- ❌ El sistema NO permite borrar notas, addenda o versiones
- ❌ El sistema NO permite modificar timestamps históricos
- ❌ El sistema NO permite "deshacer" correcciones

**Validación Clínica:**
- ❌ El sistema NO valida contenido clínico (solo estructura)
- ❌ El sistema NO valida coherencia médica entre addenda y nota original
- ❌ El sistema NO valida que la razón del addendum sea apropiada

**Gestión de Versiones:**
- ❌ El sistema NO permite fusionar versiones
- ❌ El sistema NO permite reordenar versiones
- ❌ El sistema NO permite modificar números de versión

### 8.2 Decisiones que Quedan Fuera de Alcance

**Responsabilidad del Clínico:**
- Decidir cuándo es apropiado agregar un addendum vs crear nueva nota
- Decidir qué información incluir en el addendum
- Decidir si la razón del addendum es suficiente para contexto legal
- Decidir cuándo actualizar historia psiquiátrica vs dejar versión actual

**Responsabilidad del Sistema:**
- Garantizar inmutabilidad técnica
- Garantizar trazabilidad completa
- Garantizar que correcciones sean aditivas
- Presentar información de forma clara y accesible

### 8.3 Casos No Soportados

**Correcciones Masivas:**
- ❌ No se soporta corrección de múltiples notas simultáneamente
- ❌ No se soporta corrección de múltiples campos de historia simultáneamente con un solo addendum

**Correcciones Retroactivas Complejas:**
- ❌ No se soporta "corregir" un evento del timeline directamente
- ❌ No se soporta modificar fecha de encuentro de nota finalizada

**Gestión de Conflictos:**
- ❌ No se detecta ni resuelve conflictos si dos clínicos crean addenda simultáneamente
- ❌ No se detecta ni resuelve conflictos si dos clínicos crean nuevas versiones simultáneamente

**Exportación/Importación:**
- ❌ No se soporta exportar solo versiones actuales (sin históricas)
- ❌ No se soporta importar correcciones desde sistemas externos

---

## 9. Reglas de Diseño UX

### 9.1 Principios de Diseño

**UX Mínima y Clínica:**
- Interfaz sin ornamentación innecesaria
- Priorizar claridad sobre estética
- Información clínica siempre visible y accesible
- Sin animaciones o transiciones distractoras

**Seguridad sobre Velocidad:**
- Confirmaciones implícitas claras (botones con labels descriptivos)
- Validación en tiempo real para prevenir errores
- Mensajes de error claros y accionables
- No permitir acciones irreversibles sin contexto claro

**Cero Ambigüedad:**
- Labels de botones descriptivos ("Agregar addendum" no "Agregar")
- Mensajes de error explícitos sobre qué está mal y por qué
- Indicadores visuales claros de estado (badges, iconos de candado)
- Diferenciación visual clara entre contenido original y correcciones

### 9.2 Lenguaje

**100% Español:**
- Todos los textos visibles al usuario en español
- Terminología clínica profesional pero accesible
- Sin anglicismos innecesarios
- Sin jerga técnica expuesta al usuario

**Profesional y Neutral:**
- Tono formal pero no distante
- Sin juicios de valor en mensajes
- Sin sugerencias sobre qué debería hacer el clínico (solo qué puede hacer)

### 9.3 Diseño Listo para Implementación

**Especificaciones Completas:**
- Todos los estados definidos
- Todos los mensajes especificados
- Todas las validaciones documentadas
- Todas las acciones permitidas/bloqueadas listadas

**Sin Ambiguidad:**
- Cada flujo tiene pasos numerados
- Cada mensaje tiene texto exacto
- Cada validación tiene condición explícita
- Cada estado tiene indicadores visuales definidos

---

## 10. Resumen de Entregables

### ✅ 1. Flujos UX Clínicos (Paso a Paso)
- **Flujo 1:** Addendum sobre nota finalizada (Sección 2)
- **Flujo 2:** Nueva versión de PsychiatricHistory (Sección 3)
- Cada flujo incluye: punto de inicio, acciones permitidas, acciones bloqueadas, confirmaciones explícitas

### ✅ 2. Estados y Visibilidad
- Estados de Nota, Addendum, PsychiatricHistory (Sección 4)
- Campos solo lectura definidos
- Acciones que aparecen/desaparecen documentadas

### ✅ 3. Microcopy Clínica (Español)
- Mensajes de bloqueo (Sección 5.1)
- Mensajes de guía (Sección 5.2)
- Mensajes de confirmación (Sección 5.3)
- Mensajes de error (Sección 5.4)
- Labels y placeholders (Sección 5.5)
- Indicadores de estado (Sección 5.6)

### ✅ 4. Manejo de Errores
- Errores bloqueantes (Sección 6.1)
- Mensajes orientados a práctica clínica (Sección 6.2)
- Errores no bloqueantes (Sección 6.3)
- Errores del sistema (Sección 6.4)

### ✅ 5. Checklist de Cumplimiento
- Para Addendum (Sección 7.1)
- Para Nueva Versión (Sección 7.2)
- Validación de: inmutabilidad, aditividad, trazabilidad, no generación indebida de eventos, cumplimiento de invariantes

### ✅ 6. Supuestos Explícitos
- Qué NO hace el sistema (Sección 8.1)
- Decisiones fuera de alcance (Sección 8.2)
- Casos no soportados (Sección 8.3)

---

*Document Version: 1.0*  
*Status: Final*  
*Depends On: 02_domain.md, 03_timeline.md, 04_use_cases.md, 14_timeline_contracts.md, 15_timeline_qa_invariants.md*  
*Consumed By: UX Implementation, Backend Implementation, QA Testing*
