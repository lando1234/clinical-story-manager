# Sistema de Registros Médicos Psiquiátricos — Especificación Funcional: Nota Clínica y Evento NOTE

## Overview

> **Referencia de terminología:** Este documento utiliza la terminología estándar definida en [`09_terminology_glossary.md`](../00_foundation/09_terminology_glossary.md). Términos clave: **Encuentro clínico**, **Evento NOTE**, **Nota Clínica**, **Turno agendado**, **Evento Encounter**.

Este documento define formalmente el modelo funcional de:
- **Nota Clínica** (documento clínico)
- **Evento NOTE** (evento en la timeline)

Esta especificación establece la separación conceptual y funcional entre el documento clínico y su representación en la timeline, garantizando la integridad clínica y legal del sistema.

**Principio central (no negociable):**
- Al finalizar una Nota clínica se crea un evento **NOTE** en la timeline (no un evento Encounter).
- La Nota (documento) y el evento NOTE (timeline) son entidades distintas.
- **Encounter es un tipo de evento válido, pero se genera desde Appointments, no desde Notes.**

---

## 1. Propósito de la Nota Clínica

### 1.1 Función Clínica

La Nota Clínica es el documento que captura la documentación estructurada de un Encuentro clínico entre el clínico y el paciente.

**Propósito fundamental:**

1. **Documentar el contenido clínico** — Registra las observaciones, hallazgos, evaluaciones y planes del Encuentro clínico
2. **Preservar el razonamiento clínico** — Mantiene registro de qué pensó el clínico en el momento del Encuentro clínico
3. **Cumplir requisitos legales** — Proporciona documentación médica completa y estructurada
4. **Permitir revisión histórica** — Facilita la comprensión de decisiones clínicas pasadas
5. **Soportar trabajo en progreso** — Permite documentación en borrador antes de finalizar

### 1.2 Contexto en el Sistema

La Nota Clínica es la unidad fundamental de documentación clínica en el sistema.

- **Toda interacción clínica documentada** se registra mediante una Nota Clínica
- **La Nota precede al evento** — El evento NOTE solo existe después de que una Nota es finalizada
- **La Nota es el documento fuente** — El evento NOTE referencia a la Nota, no al revés

### 1.3 Relación con Otros Componentes

**Con el Timeline Engine:**
- La Nota finalizada genera un evento NOTE
- El evento NOTE aparece en la timeline del paciente
- La Nota no aparece directamente en la timeline

**Con el ClinicalRecord:**
- La Nota pertenece a un ClinicalRecord
- El ClinicalRecord contiene todas las Notas del paciente
- Las Notas se organizan por fecha de Encuentro clínico

**Con Addenda:**
- Los Addenda se adjuntan a Notas finalizadas
- Los Addenda no generan eventos separados
- Los Addenda forman parte del documento Nota

---

## 2. Definición de la Nota como Documento Clínico

### 2.1 Qué es una Nota Clínica

Una **Nota Clínica** es una instancia de la entidad `Note` que contiene la documentación estructurada de un Encuentro clínico.

**Características esenciales:**

- Es un **documento clínico** con contenido estructurado
- Puede existir en estado **Draft** (borrador) o **Finalized** (finalizada)
- Solo las Notas finalizadas generan un evento NOTE
- Una vez finalizada, la Nota es inmutable en su contenido
- Puede tener Addenda (anexos) para correcciones o ampliaciones

### 2.2 Atributos de la Nota Clínica

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación de la nota | Inmutable |
| **encounterDate** | Fecha | Fecha en que ocurrió el Encuentro clínico | Inmutable (una vez finalizada) |
| **encounterType** | Enumeration | Tipo de Encuentro clínico | Inmutable (una vez finalizada) |
| **status** | Enumeration | Draft o Finalized | Solo transición Draft → Finalized |
| **subjective** | Texto (opcional) | Observaciones subjetivas del paciente | Inmutable (una vez finalizada) |
| **objective** | Texto (opcional) | Hallazgos objetivos del clínico | Inmutable (una vez finalizada) |
| **assessment** | Texto (opcional) | Evaluación clínica e interpretación | Inmutable (una vez finalizada) |
| **plan** | Texto (opcional) | Plan de tratamiento y próximos pasos | Inmutable (una vez finalizada) |
| **createdAt** | Timestamp | Cuándo fue creada la nota | Inmutable |
| **finalizedAt** | Timestamp (opcional) | Cuándo fue finalizada la nota | Inmutable (una vez establecido) |

### 2.3 Estados de la Nota Clínica

#### 2.3.1 Estado Draft (Borrador)

**Características:**

- La Nota existe pero **no ha sido finalizada**
- **Todas las Notas en estado Draft son mutables**
- Pueden editarse, modificarse o eliminarse libremente
- **NO generan eventos NOTE**
- **NO aparecen en la timeline**
- No tienen restricciones de inmutabilidad

**Propósito del estado Draft:**

- Permitir documentación en progreso
- Facilitar correcciones antes de finalizar
- Soportar trabajo interrumpido que se retoma más tarde
- Evitar que borradores aparezcan como eventos clínicos

#### 2.3.2 Estado Finalized (Finalizada)

**Características:**

- La Nota ha sido **finalizada por el clínico**
- **Una vez finalizada, la Nota Clínica es inmutable en su contenido**
- Todos los campos de contenido son permanentes
- **Genera automáticamente un evento NOTE** en la timeline
- **NO puede volver a estado Draft**
- Solo puede ser corregida mediante Addenda

**Propósito del estado Finalized:**

- Preservar la documentación legal
- Garantizar integridad clínica
- Permitir que el Encuentro clínico aparezca en la timeline
- Establecer el documento como parte del registro permanente

### 2.4 Inmutabilidad de la Nota Clínica

#### 2.4.1 Principio de Inmutabilidad

**Regla fundamental:**

Una vez que una Nota Clínica transiciona a estado `Finalized`, su contenido es **permanentemente inmutable**.

**Razones de inmutabilidad:**

1. **Protección legal** — Los registros médicos pueden ser requeridos en procesos legales. La inmutabilidad asegura que el registro refleje lo que el clínico documentó en el momento.
2. **Integridad clínica** — Las decisiones de tratamiento se basaron en información disponible en un momento dado. Cambios retroactivos oscurecerían el razonamiento clínico.
3. **Confianza** — Los pacientes confían en que sus registros reflejen con precisión su atención. La inmutabilidad es la base de esta confianza mutua.

#### 2.4.2 Campos Inmutables (Estado Finalized)

Una vez finalizada, los siguientes campos son **permanentemente inmutables**:

- `encounterDate` — La fecha del Encuentro clínico no puede cambiar
- `encounterType` — El tipo de Encuentro clínico no puede cambiar
- `subjective` — Las observaciones subjetivas no pueden modificarse
- `objective` — Los hallazgos objetivos no pueden modificarse
- `assessment` — La evaluación clínica no puede modificarse
- `plan` — El plan de tratamiento no puede modificarse
- `finalizedAt` — La fecha de finalización no puede cambiar

#### 2.4.3 Mecanismo de Corrección: Addenda

**Cuando se requiere corrección:**

Las correcciones se realizan mediante **Addenda**, no mediante modificación del contenido original.

**Características de los Addenda:**

- Se adjuntan a Notas finalizadas
- Son inmutables desde su creación
- NO modifican el contenido original de la Nota
- Contienen el contenido corregido o ampliado
- Incluyen una razón para la corrección
- Se muestran junto con la Nota original

**Principio de transparencia:**

El contenido original y los Addenda se presentan juntos, preservando la transparencia del registro.

### 2.5 Tipos de Encuentro Clínico

Los tipos de Encuentro clínico definen la naturaleza de la interacción clínica:

| Tipo | Descripción |
|------|-------------|
| **Initial Evaluation** | Primera evaluación del paciente |
| **Follow-up** | Seguimiento de tratamiento en curso |
| **Crisis Intervention** | Intervención en situación de crisis |
| **Medication Review** | Revisión específica de medicación |
| **Therapy Session** | Sesión de terapia |
| **Phone Consultation** | Consulta telefónica |
| **Other** | Otro tipo de Encuentro clínico no especificado |

**Regla:** El tipo de Encuentro clínico es inmutable una vez finalizada la Nota.

---

## 3. Definición del Evento NOTE

### 3.1 Qué es un Evento NOTE

Un **Evento NOTE** es una instancia de `ClinicalEvent` con `eventType = NOTE` que representa que una Nota Clínica fue finalizada.

**Características esenciales:**

- Es una instancia de `ClinicalEvent` con `eventType = NOTE`
- Representa el **hecho** de que una Nota Clínica fue finalizada
- Aparece en la Timeline del paciente
- Es inmutable desde el momento de su creación
- Tiene una fecha de ocurrencia clínica (`eventDate`) que representa cuándo ocurrió el Encuentro clínico
- Tiene una fecha de registro (`recordedAt`) que representa cuándo fue documentado en el sistema
- Referencia a la Nota Clínica que lo generó

### 3.2 Atributos del Evento NOTE

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación del evento | Inmutable |
| **eventDate** | Fecha | Fecha en que ocurrió el Encuentro clínico | Inmutable |
| **eventType** | Enumeration | Siempre "NOTE" | Inmutable |
| **title** | Texto | Resumen breve del Encuentro clínico | Inmutable |
| **description** | Texto (opcional) | Descripción detallada del Encuentro clínico | Inmutable |
| **recordedAt** | Timestamp | Cuándo fue documentado el evento | Inmutable |
| **sourceType** | Enumeration | Siempre "Note" | Inmutable |
| **sourceId** | Identificador | Referencia a la Nota que lo generó | Inmutable |

### 3.3 Propósito Clínico del Evento NOTE

El Evento NOTE existe para:

1. **Marcar temporalmente el Encuentro clínico** — Establece cuándo ocurrió la interacción clínica en la historia del paciente
2. **Aparecer en la Timeline** — Proporciona un punto de referencia cronológico en la narrativa longitudinal
3. **Preservar el hecho histórico** — Garantiza que el hecho de que se documentó un Encuentro clínico no puede ser eliminado
4. **Permitir navegación temporal** — Facilita la ubicación de Encuentros clínicos en el tiempo
5. **Correlacionar con otros eventos** — Permite ver encuentros junto con cambios de medicación, hospitalizaciones, etc.

### 3.4 Lo que NO es un Evento NOTE

- **NO es el documento clínico** — No contiene la documentación clínica (subjetivo, objetivo, evaluación, plan)
- **NO es editable** — Una vez creado, no puede modificarse
- **NO aparece en estado Draft** — Solo existe cuando una Nota es finalizada
- **NO puede eliminarse** — Es permanente en la Timeline
- **NO es un tipo de evento "Encounter"** — El tipo de evento es NOTE, no Encounter (los eventos Encounter son un tipo diferente generado desde Appointments)

### 3.5 Separación entre NOTE y Encounter

**Clarificación importante:**

**NOTE y Encounter son tipos de evento diferentes con orígenes distintos:**

| Aspecto | Evento NOTE | Evento Encounter |
|---------|-------------|------------------|
| **Origen** | Note (nota clínica finalizada) | Appointment (turno agendado que ya pasó) |
| **Representa** | Documentación de un Encuentro clínico | Ocurrencia de un Turno agendado |
| **Tipo de evento** | `NOTE` | `Encounter` |
| **Source Type** | `Note` | `Appointment` |
| **Cuándo se genera** | Al finalizar una Nota | Cuando la fecha del turno ya pasó |

**Principio de separación:**

- **NOTE** representa la **documentación** de un Encuentro clínico (desde una Nota finalizada)
- **Encounter** representa la **ocurrencia** de un turno agendado (desde un Appointment pasado)
- Ambos tipos de evento son válidos y coexisten en el sistema
- Un turno (Appointment) puede generar un evento Encounter sin tener una Nota asociada
- Una Nota finalizada genera un evento NOTE, no un evento Encounter

Para más detalles sobre eventos Encounter, ver `23_encounter_appointment_spec.md`.

---

## 4. Relación Nota ↔ Evento NOTE

### 4.1 Relación de Generación

**Regla fundamental:**

Una Nota Clínica **finalizada** genera exactamente **un** Evento NOTE.

**Dirección de la relación:**

```
Nota Clínica (finalizada) → genera → Evento NOTE
```

**Cardinalidad:**

- Una Nota finalizada genera exactamente 1 Evento NOTE
- Un Evento NOTE referencia exactamente 1 Nota
- Una Nota en estado Draft NO genera Evento NOTE

### 4.2 Momento de Generación

El Evento NOTE se crea **en el momento exacto** en que una Nota Clínica transiciona de estado `Draft` a estado `Finalized`.

**Secuencia temporal:**

1. Nota existe en estado `Draft` → **NO hay Evento NOTE**
2. Clínico finaliza la Nota → Transición `Draft` → `Finalized`
3. Sistema crea automáticamente el Evento NOTE
4. Evento NOTE aparece en la Timeline

**Garantía del sistema:**

La generación del evento es **automática e inmediata**. No hay intervención manual requerida.

### 4.3 Sincronización de Datos

| Dato | Fuente | Destino | Regla |
|------|--------|---------|-------|
| **Fecha del Encuentro clínico** | `Note.encounterDate` | `ClinicalEvent.eventDate` | Copia exacta al momento de finalización |
| **Tipo de Encuentro clínico** | `Note.encounterType` | `ClinicalEvent.title` | Transformado en título descriptivo |
| **Referencia** | `Note.id` | `ClinicalEvent.sourceId` | Establecida al crear el evento |
| **Tipo de fuente** | N/A | `ClinicalEvent.sourceType` | Siempre "Note" |
| **Tipo de evento** | N/A | `ClinicalEvent.eventType` | Siempre "NOTE" |

### 4.4 Independencia Después de la Creación

**Una vez creado el Evento NOTE:**

- El Evento NOTE es **independiente** de la Nota en términos de inmutabilidad
- Ambos son inmutables, pero por razones diferentes:
  - **Evento NOTE**: Inmutable porque representa un hecho histórico
  - **Nota Clínica**: Inmutable porque preserva la documentación legal

**No hay dependencia funcional:**

- El Evento NOTE NO depende de la Nota para su existencia en la Timeline
- La Nota NO depende del Evento NOTE para su existencia
- Ambos coexisten como entidades relacionadas pero independientes

### 4.5 Relación con Addenda

**Regla importante:**

Los Addenda (anexos) de una Nota **NO generan nuevos Eventos NOTE**.

**Razón:**

- El Addendum es una corrección o ampliación del documento original
- El hecho de que la Nota fue finalizada ya fue registrado cuando la Nota fue finalizada
- Los Addenda son parte del documento Nota, no eventos separados

**Presentación:**

- Los Addenda se muestran junto con la Nota cuando se accede al Evento NOTE
- Los Addenda NO aparecen como eventos separados en la Timeline

---

## 5. Flujo Completo

### 5.1 Crear Nota

**Flujo de creación:**

1. **Clínico inicia creación de Nota**
   - Sistema crea nueva instancia de `Note`
   - Estado inicial: `Draft`
   - `createdAt` se establece al momento de creación

2. **Clínico completa campos**
   - `encounterDate` — Fecha del Encuentro clínico
   - `encounterType` — Tipo de Encuentro clínico
   - `subjective` — Observaciones subjetivas (opcional)
   - `objective` — Hallazgos objetivos (opcional)
   - `assessment` — Evaluación clínica (opcional)
   - `plan` — Plan de tratamiento (opcional)

3. **Nota permanece en estado Draft**
   - Puede ser editada libremente
   - Puede ser guardada y retomada más tarde
   - Puede ser eliminada
   - **NO genera evento NOTE**
   - **NO aparece en timeline**

**Reglas de validación:**

- `encounterDate` es requerido
- `encounterType` es requerido
- `encounterDate` no puede ser una fecha futura
- Al menos una sección de contenido debe tener información (subjetivo, objetivo, evaluación o plan)

### 5.2 Editar Nota

**Edición en estado Draft:**

1. **Clínico accede a Nota en estado Draft**
2. **Clínico modifica cualquier campo**
   - Todos los campos son editables
   - No hay restricciones de inmutabilidad
3. **Cambios se guardan**
   - La Nota permanece en estado `Draft`
   - `createdAt` no cambia
   - **NO se genera evento NOTE**

**Edición en estado Finalized:**

**NO PERMITIDA.**

Una Nota finalizada **NO puede ser editada**.

**Alternativa para correcciones:**

- Usar el mecanismo de Addenda
- Crear un Addendum con la corrección
- El Addendum se adjunta a la Nota finalizada
- El contenido original permanece inalterado

### 5.3 Finalizar Nota

**Flujo de finalización:**

1. **Clínico solicita finalizar la Nota**
   - La Nota debe estar en estado `Draft`
   - Debe cumplir validaciones mínimas

2. **Sistema valida la Nota**
   - `encounterDate` está presente
   - `encounterType` está presente
   - Al menos una sección tiene contenido

3. **Sistema transiciona estado**
   - `status` cambia de `Draft` a `Finalized`
   - `finalizedAt` se establece al momento actual
   - Todos los campos de contenido se vuelven inmutables

4. **Sistema genera Evento NOTE automáticamente**
   - Crea nueva instancia de `ClinicalEvent`
   - `eventType = NOTE`
   - `eventDate = Note.encounterDate`
   - `title` se genera a partir de `encounterType`
   - `sourceType = "Note"`
   - `sourceId = Note.id`
   - `recordedAt` = momento actual

5. **Evento NOTE aparece en Timeline**
   - El evento se ordena según las reglas del Timeline Engine
   - El evento es visible en la timeline del paciente

**Garantías del sistema:**

- La finalización es **irreversible**
- La generación del evento es **automática**
- El evento es **inmutable** desde su creación
- La Nota es **inmutable** desde la finalización

**Validaciones previas a finalización:**

- La Nota debe estar en estado `Draft`
- `encounterDate` no puede ser una fecha futura
- Debe existir contenido clínico (al menos una sección con información)

---

## 6. Generación del Evento NOTE

### 6.1 Momento Exacto

**Momento de generación:**

El Evento NOTE se crea **exactamente en el instante** en que una Nota Clínica transiciona de estado `Draft` a estado `Finalized`.

**No hay retraso:**

- La generación es **síncrona** con la finalización
- No hay procesamiento asíncrono
- No hay cola de eventos pendientes
- El evento existe inmediatamente después de la finalización

**Transacción atómica:**

La finalización de la Nota y la creación del Evento NOTE deben ser **atómicas**:
- Si la finalización falla, no se crea el evento
- Si la creación del evento falla, la finalización se revierte
- No puede existir una Nota finalizada sin su evento NOTE correspondiente

### 6.2 Datos Mínimos del Evento NOTE

**Datos requeridos:**

| Campo | Origen | Regla |
|------|--------|-------|
| **eventType** | Constante | Siempre "NOTE" |
| **eventDate** | `Note.encounterDate` | Copia directa |
| **title** | `Note.encounterType` | Transformado en título descriptivo |
| **sourceType** | Constante | Siempre "Note" |
| **sourceId** | `Note.id` | Referencia a la Nota |
| **recordedAt** | Sistema | Timestamp de creación |

**Datos opcionales:**

| Campo | Origen | Regla |
|------|--------|-------|
| **description** | `Note` | Puede derivarse de resumen de contenido o estar vacío |

**Reglas de transformación:**

**Title (título):**
- Se genera a partir de `encounterType`
- Ejemplos:
  - `Initial Evaluation` → "Evaluación Inicial"
  - `Follow-up` → "Seguimiento"
  - `Crisis Intervention` → "Intervención en Crisis"
  - `Medication Review` → "Revisión de Medicación"
  - `Therapy Session` → "Sesión de Terapia"
  - `Phone Consultation` → "Consulta Telefónica"
  - `Other` → "Encuentro Clínico"

**Description (descripción):**
- Opcional
- Puede estar vacío
- Si se genera, puede ser un resumen breve del contenido de la Nota
- No debe contener el contenido completo de la Nota

### 6.3 Garantías de Generación

**Garantía 1: Unicidad**

Cada Nota finalizada genera exactamente **un** Evento NOTE.

- No se generan múltiples eventos
- No se generan eventos duplicados
- La relación es 1:1

**Garantía 2: Inmutabilidad Inmediata**

El Evento NOTE es **inmutable desde el momento de su creación**.

- No hay período de gracia para edición
- Todos los atributos son permanentes
- No puede ser modificado ni eliminado

**Garantía 3: Trazabilidad**

El Evento NOTE mantiene **referencia permanente** a la Nota que lo generó.

- `sourceId` apunta a la Nota
- `sourceType` identifica el tipo de fuente
- La relación es permanente e inmutable

**Garantía 4: Ordenamiento Correcto**

El Evento NOTE se ordena en la Timeline según las reglas del Timeline Engine.

- `eventDate` determina la posición temporal
- `recordedAt` se usa para desempate
- El evento aparece en su posición cronológica correcta

---

## 7. Comportamiento en la Timeline

### 7.1 Qué Aparece en la Timeline

**Aparece en la Timeline:**

- **Eventos NOTE** (ClinicalEvent con eventType = NOTE)
- Otros tipos de eventos clínicos (Medication Start, Medication Change, Medication Stop, Hospitalization, Life Event, History Update, Other)

**NO aparece en la Timeline:**

- Notas Clínicas directamente (solo a través de su Evento NOTE asociado)
- Notas en estado Draft
- Addenda (se muestran al acceder a la Nota, no como eventos separados)

### 7.2 Por Qué Aparece el Evento NOTE

**Razones clínicas:**

1. **Narrativa longitudinal** — La Timeline muestra la secuencia de eventos clínicamente significativos
2. **Navegación temporal** — Permite ubicar encuentros en el tiempo del paciente
3. **Correlación con otros eventos** — Facilita ver encuentros junto con cambios de medicación, hospitalizaciones, etc.
4. **Completitud histórica** — Garantiza que todos los encuentros documentados aparezcan en la Timeline

**Razones de diseño:**

1. **Abstracción unificada** — La Timeline presenta eventos de diferentes fuentes de manera uniforme
2. **Ordenamiento consistente** — Todos los eventos siguen las mismas reglas de ordenamiento
3. **Filtrado y búsqueda** — Permite filtrar por tipo de evento de manera consistente

### 7.3 Por Qué NO Aparece la Nota Directamente

**Razones funcionales:**

1. **La Nota es el documento, no el evento** — La Timeline muestra eventos, no documentos
2. **Estado Draft** — Las Notas en borrador no deben aparecer en la Timeline clínica
3. **Granularidad diferente** — La Timeline opera a nivel de eventos, no de documentos
4. **Acceso indirecto** — La Nota se accede a través del Evento NOTE cuando se necesita ver el contenido

### 7.4 Cómo se Accede a la Nota desde la Timeline

**Flujo de acceso:**

1. Usuario ve Evento NOTE en la Timeline
2. Usuario selecciona el Evento NOTE
3. Sistema muestra detalles del evento (fecha, título, descripción)
4. Sistema proporciona acceso a la Nota Clínica asociada
5. Usuario accede a la Nota para ver contenido completo (subjetivo, objetivo, evaluación, plan, addenda)

**Principio de presentación:**

- La Timeline muestra **qué ocurrió** (eventos)
- La Nota muestra **qué se documentó** (contenido clínico)

### 7.5 Ordenamiento del Evento NOTE en la Timeline

**Reglas de ordenamiento (según Timeline Engine):**

1. **Ordenamiento primario:** Por `eventDate` (fecha del Encuentro clínico)
2. **Ordenamiento secundario:** Por `recordedAt` (fecha de registro)
3. **Ordenamiento terciario:** Por prioridad de tipo de evento
   - Los eventos NOTE tienen prioridad según las reglas del Timeline Engine
4. **Ordenamiento cuaternario:** Por identificador único

**Comportamiento con eventos del mismo día:**

- Si múltiples eventos NOTE ocurren el mismo día, se ordenan por `recordedAt`
- Si comparten `recordedAt`, se ordenan por identificador único
- El orden es determinístico y estable

---

## 8. Reglas Explícitas de Exclusión

### 8.1 Separación entre NOTE y Encounter

**Regla fundamental:**

**Las Notas finalizadas generan eventos NOTE, no eventos Encounter.**

**Separación de tipos de evento:**

1. **Evento NOTE** (este documento)
   - Generado por: Notas Clínicas finalizadas
   - `eventType = NOTE`
   - `sourceType = Note`
   - Representa: La documentación clínica de un Encuentro clínico

2. **Evento Encounter** (ver `23_encounter_appointment_spec.md`)
   - Generado por: Appointments (turnos agendados) cuya fecha ya pasó
   - `eventType = Encounter`
   - `sourceType = Appointment`
   - Representa: El hecho de que ocurrió un turno agendado

**Principio de separación:**

- **NOTE** = Documentación clínica (Nota finalizada)
- **Encounter** = Turno agendado que ocurrió (Appointment pasado)
- Son dos tipos de eventos diferentes con fuentes diferentes
- Una Nota finalizada **nunca** genera un evento Encounter
- Un Appointment pasado **nunca** genera un evento NOTE

**Razón de la separación:**

- La separación conceptual entre documento (Nota) y evento (NOTE) requiere un nombre distinto
- "NOTE" refleja que el evento representa la finalización de una Nota Clínica
- "Encounter" refleja que el evento representa un turno agendado que ocurrió
- Esta distinción previene confusiones entre documentación clínica y planificación administrativa

### 8.2 Otras Exclusiones

**No se introducen nuevos tipos de evento:**

- Solo se usa el tipo de evento NOTE existente
- No se crean variantes (NOTE_DRAFT, NOTE_FINALIZED, etc.)
- No se crean subtipos de NOTE

**No se modifican invariantes del Timeline Engine:**

- Las reglas de ordenamiento permanecen sin cambios
- Las reglas de inmutabilidad permanecen sin cambios
- Las reglas de generación de eventos permanecen sin cambios

**No se define UI concreta:**

- Esta especificación define semántica, no presentación visual
- No se especifican componentes de UI
- No se especifican layouts o diseños
- Solo se define qué información debe ser accesible y cómo

**No se cambia el schema:**

- Esta especificación no modifica el schema de base de datos
- No se agregan nuevos campos
- No se modifican tipos de datos existentes
- La implementación debe usar el schema existente

---

## 9. Impacto Clínico y Legal

### 9.1 Integridad Clínica

**Preservación del razonamiento clínico:**

- La inmutabilidad de las Notas finalizadas preserva el razonamiento clínico tal como existía en el momento de la documentación
- Los futuros clínicos pueden entender qué información estaba disponible cuando se tomaron decisiones
- La separación entre Nota y evento NOTE garantiza que el hecho histórico (evento) y la documentación (nota) se preservan independientemente

**Trazabilidad temporal:**

- El evento NOTE marca cuándo ocurrió el Encuentro clínico (`eventDate`)
- El evento NOTE registra cuándo fue documentado (`recordedAt`)
- Esta dualidad temporal permite reconstruir la secuencia de eventos y documentación

**Correlación con otros eventos:**

- Los eventos NOTE aparecen junto con otros eventos clínicos en la Timeline
- Esto permite correlacionar encuentros con cambios de medicación, hospitalizaciones, etc.
- La narrativa longitudinal se preserva y es accesible

### 9.2 Integridad Legal

**Inmutabilidad del registro médico:**

- Las Notas finalizadas son inmutables, preservando el registro médico legal
- Los eventos NOTE son inmutables, preservando el hecho histórico
- Esta doble inmutabilidad garantiza la integridad del registro para propósitos legales

**Trazabilidad de documentación:**

- `finalizedAt` en la Nota registra cuándo fue finalizada
- `recordedAt` en el evento NOTE registra cuándo fue documentado
- Esta trazabilidad es esencial para auditorías y procesos legales

**Mecanismo de corrección transparente:**

- Los Addenda proporcionan un mecanismo transparente para correcciones
- El contenido original permanece intacto
- Las correcciones son visibles y documentadas
- Esto cumple con requisitos legales de transparencia en registros médicos

**Preservación permanente:**

- Los eventos NOTE no pueden eliminarse
- Las Notas finalizadas no pueden eliminarse
- El registro clínico es permanente e irremovible
- Esto garantiza que la evidencia clínica no puede ser destruida

### 9.3 Cumplimiento Normativo

**Requisitos de documentación:**

- La estructura de la Nota (subjetivo, objetivo, evaluación, plan) cumple con estándares de documentación médica
- La inmutabilidad cumple con requisitos de integridad de registros médicos
- La trazabilidad cumple con requisitos de auditoría

**Transparencia:**

- La separación entre Nota y evento NOTE es transparente
- Los Addenda son visibles y documentados
- No hay modificación oculta de registros

**Accesibilidad:**

- El registro completo es accesible a través de la Nota
- La Timeline proporciona acceso cronológico
- La correlación entre eventos es visible

---

## 10. Casos Fuera de Alcance

### 10.1 Tipos de Evento Adicionales

**Fuera de alcance:**

- Crear nuevos tipos de evento relacionados con Notas
- Crear subtipos de eventos NOTE
- Modificar tipos de evento existentes (excepto la exclusión de Encounter)

### 10.2 Modificaciones al Timeline Engine

**Fuera de alcance:**

- Cambiar las reglas de ordenamiento del Timeline Engine
- Modificar las reglas de inmutabilidad del Timeline Engine
- Alterar los contratos del Timeline Engine
- Cambiar la arquitectura del Timeline Engine

### 10.3 Cambios al Schema

**Fuera de alcance:**

- Modificar el schema de base de datos
- Agregar nuevos campos a las entidades existentes
- Cambiar tipos de datos
- Modificar relaciones entre entidades

### 10.4 Definición de UI

**Fuera de alcance:**

- Especificar componentes de UI concretos
- Definir layouts o diseños visuales
- Especificar flujos de usuario detallados
- Definir estilos o temas visuales

**En alcance (semántica):**

- Qué información debe ser accesible
- Cómo debe relacionarse la información
- Qué acciones deben estar disponibles
- Qué restricciones deben aplicarse

### 10.5 Integraciones Externas

**Fuera de alcance:**

- Integración con sistemas externos
- Importación de Notas desde otros sistemas
- Exportación de Notas a otros formatos
- Sincronización con sistemas externos

### 10.6 Funcionalidades Avanzadas

**Fuera de alcance:**

- Búsqueda de texto completo en Notas
- Análisis de contenido de Notas
- Generación automática de resúmenes
- Sugerencias de contenido basadas en IA

### 10.7 Gestión de Versiones de Notas

**Fuera de alcance:**

- Sistema de versionado de Notas (como en PsychiatricHistory)
- Historial de cambios en Notas Draft
- Comparación de versiones de Notas

**Nota:** Las Notas solo tienen dos estados (Draft y Finalized), no un sistema de versionado.

### 10.8 Colaboración Multi-usuario

**Fuera de alcance:**

- Edición concurrente de Notas
- Bloqueo de Notas en edición
- Notificaciones de cambios
- Resolución de conflictos

---

## 11. Resumen Ejecutivo

### 11.1 Separación Fundamental

**Nota Clínica:**
- Es el **documento** que contiene la documentación estructurada del Encuentro clínico
- Puede estar en Draft o Finalizada
- Solo las finalizadas generan eventos NOTE
- Es inmutable en contenido una vez finalizada

**Evento NOTE:**
- Representa el **hecho** de que una Nota Clínica fue finalizada
- Aparece en la Timeline
- Es inmutable desde su creación
- Se genera automáticamente al finalizar una Nota

### 11.2 Principios Clave

1. **Un Encuentro clínico, dos representaciones** — El documento (Nota) y el evento (NOTE) son entidades distintas
2. **Generación automática** — El Evento NOTE se crea cuando la Nota se finaliza
3. **Independencia después de la creación** — Una vez creado, el Evento NOTE es independiente
4. **Inmutabilidad por razones diferentes** — Evento preserva historia, Nota preserva documentación legal
5. **Presentación diferenciada** — La UI debe distinguir claramente entre evento y documento
6. **Exclusión de Encounter** — Encounter NO existe como tipo de evento

### 11.3 Garantías del Sistema

- **Integridad histórica** — Los encuentros no pueden eliminarse de la Timeline
- **Integridad legal** — La documentación clínica no puede alterarse después de finalizar
- **Consistencia temporal** — Las fechas de encuentros son inmutables y preservan el orden
- **Completitud** — Toda Nota finalizada tiene su Evento NOTE correspondiente
- **Claridad conceptual** — La separación previene confusiones en la UI y en el uso del sistema
- **Exclusión garantizada** — Encounter no existe como tipo de evento

### 11.4 Flujos Principales

**Crear y Finalizar Nota:**
1. Crear Nota en estado Draft
2. Completar contenido clínico
3. Finalizar Nota (transición irreversible)
4. Sistema genera automáticamente Evento NOTE
5. Evento NOTE aparece en Timeline

**Acceder a Documentación:**
1. Ver Evento NOTE en Timeline
2. Acceder a Nota Clínica asociada
3. Ver contenido completo (subjetivo, objetivo, evaluación, plan, addenda)

**Corregir Nota Finalizada:**
1. Acceder a Nota finalizada
2. Crear Addendum con corrección
3. Addendum se adjunta a Nota
4. No se genera nuevo evento NOTE

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Idioma: Español*  
*Depende de: 02_domain.md, 13_timeline_engine.md, 14_timeline_contracts.md*  
*Consumido por: Implementación de UI, Implementación de Backend, QA Testing*  
*Reemplaza referencias a: Evento de Encuentro / Encounter como tipo de evento*
