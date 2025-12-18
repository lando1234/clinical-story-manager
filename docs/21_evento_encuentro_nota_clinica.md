# Sistema de Registros Médicos Psiquiátricos — Especificación Funcional: Separación Evento de Encuentro / Nota Clínica

## Overview

Este documento define formalmente la separación conceptual y funcional entre:
- **Evento de Encuentro** (ClinicalEvent de tipo Encounter)
- **Documento Nota Clínica** (Note)

Esta especificación preserva la lógica clínica y la integridad legal del sistema, estableciendo límites claros que previenen confusiones en la presentación y manipulación de datos clínicos.

---

## 1. Definición de Evento de Encuentro

### 1.1 Qué es un Evento de Encuentro

Un **Evento de Encuentro** es una ocurrencia clínicamente significativa que representa que tuvo lugar una interacción directa entre el clínico y el paciente.

**Características esenciales:**

- Es una instancia de `ClinicalEvent` con `eventType = Encounter`
- Representa el **hecho** de que ocurrió un encuentro clínico
- Aparece en la Timeline del paciente
- Es inmutable desde el momento de su creación
- Tiene una fecha de ocurrencia clínica (`eventDate`) que representa cuándo ocurrió el encuentro
- Tiene una fecha de registro (`recordedAt`) que representa cuándo fue documentado en el sistema

### 1.2 Atributos del Evento de Encuentro

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación del evento | Inmutable |
| **eventDate** | Fecha | Fecha en que ocurrió el encuentro clínico | Inmutable |
| **eventType** | Enumeration | Siempre "Encounter" | Inmutable |
| **title** | Texto | Resumen breve del encuentro | Inmutable |
| **description** | Texto (opcional) | Descripción detallada del encuentro | Inmutable |
| **recordedAt** | Timestamp | Cuándo fue documentado el evento | Inmutable |
| **sourceType** | Enumeration | Siempre "Note" | Inmutable |
| **sourceId** | Identificador | Referencia a la Nota que lo generó | Inmutable |

### 1.3 Propósito Clínico del Evento de Encuentro

El Evento de Encuentro existe para:

1. **Marcar temporalmente el encuentro** — Establece cuándo ocurrió la interacción clínica en la historia del paciente
2. **Aparecer en la Timeline** — Proporciona un punto de referencia cronológico en la narrativa longitudinal
3. **Preservar el hecho histórico** — Garantiza que el hecho de que ocurrió un encuentro no puede ser eliminado
4. **Permitir navegación temporal** — Facilita la ubicación de encuentros en el tiempo

### 1.4 Lo que NO es un Evento de Encuentro

- **NO es el documento clínico** — No contiene la documentación clínica (subjetivo, objetivo, evaluación, plan)
- **NO es editable** — Una vez creado, no puede modificarse
- **NO aparece en estado Draft** — Solo existe cuando una Nota es finalizada
- **NO puede eliminarse** — Es permanente en la Timeline

---

## 2. Definición de Nota Clínica

### 2.1 Qué es una Nota Clínica

Una **Nota Clínica** es el documento que contiene la documentación estructurada de un encuentro entre el clínico y el paciente.

**Características esenciales:**

- Es una instancia de la entidad `Note`
- Contiene el contenido clínico del encuentro (subjetivo, objetivo, evaluación, plan)
- Puede existir en estado **Draft** (borrador) o **Finalized** (finalizada)
- Solo las Notas finalizadas generan un Evento de Encuentro
- Una vez finalizada, la Nota es inmutable en su contenido
- Puede tener Addenda (anexos) para correcciones o ampliaciones

### 2.2 Atributos de la Nota Clínica

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación de la nota | Inmutable |
| **encounterDate** | Fecha | Fecha en que ocurrió el encuentro | Inmutable (una vez finalizada) |
| **encounterType** | Enumeration | Tipo de encuentro (evaluación inicial, seguimiento, etc.) | Inmutable (una vez finalizada) |
| **status** | Enumeration | Draft o Finalized | Solo transición Draft → Finalized |
| **subjective** | Texto (opcional) | Observaciones subjetivas del paciente | Inmutable (una vez finalizada) |
| **objective** | Texto (opcional) | Hallazgos objetivos del clínico | Inmutable (una vez finalizada) |
| **assessment** | Texto (opcional) | Evaluación clínica e interpretación | Inmutable (una vez finalizada) |
| **plan** | Texto (opcional) | Plan de tratamiento y próximos pasos | Inmutable (una vez finalizada) |
| **createdAt** | Timestamp | Cuándo fue creada la nota | Inmutable |
| **finalizedAt** | Timestamp (opcional) | Cuándo fue finalizada la nota | Inmutable (una vez establecido) |

### 2.3 Propósito Clínico de la Nota Clínica

La Nota Clínica existe para:

1. **Documentar el contenido clínico** — Captura las observaciones, hallazgos, evaluaciones y planes del encuentro
2. **Preservar el razonamiento clínico** — Mantiene registro de qué pensó el clínico en el momento del encuentro
3. **Cumplir requisitos legales** — Proporciona documentación médica completa y estructurada
4. **Permitir revisión histórica** — Facilita la comprensión de decisiones clínicas pasadas
5. **Soportar trabajo en progreso** — Permite documentación en borrador antes de finalizar

### 2.4 Lo que NO es una Nota Clínica

- **NO es el evento en la Timeline** — La Nota no aparece directamente en la Timeline
- **NO es necesariamente visible en la Timeline** — Solo las Notas finalizadas generan eventos visibles
- **NO puede modificarse después de finalizar** — El contenido es inmutable (excepto mediante Addenda)
- **NO puede eliminarse una vez finalizada** — Es parte permanente del registro clínico

---

## 3. Relación entre Evento de Encuentro y Nota Clínica

### 3.1 Relación de Generación

**Regla fundamental:**

Una Nota Clínica **finalizada** genera exactamente **un** Evento de Encuentro.

**Dirección de la relación:**

```
Nota Clínica (finalizada) → genera → Evento de Encuentro
```

**Cardinalidad:**

- Una Nota finalizada genera exactamente 1 Evento de Encuentro
- Un Evento de Encuentro referencia exactamente 1 Nota
- Una Nota en estado Draft NO genera Evento de Encuentro

### 3.2 Momento de Generación

El Evento de Encuentro se crea **en el momento exacto** en que una Nota Clínica transiciona de estado `Draft` a estado `Finalized`.

**Secuencia temporal:**

1. Nota existe en estado `Draft` → **NO hay Evento de Encuentro**
2. Clínico finaliza la Nota → Transición `Draft` → `Finalized`
3. Sistema crea automáticamente el Evento de Encuentro
4. Evento de Encuentro aparece en la Timeline

### 3.3 Sincronización de Datos

| Dato | Fuente | Destino | Regla |
|------|--------|---------|-------|
| **Fecha del encuentro** | `Note.encounterDate` | `ClinicalEvent.eventDate` | Copia exacta al momento de finalización |
| **Tipo de encuentro** | `Note.encounterType` | `ClinicalEvent.title` | Transformado en título descriptivo |
| **Referencia** | `Note.id` | `ClinicalEvent.noteId` | Establecida al crear el evento |
| **Tipo de fuente** | N/A | `ClinicalEvent.sourceType` | Siempre "Note" |

### 3.4 Independencia Después de la Creación

**Una vez creado el Evento de Encuentro:**

- El Evento de Encuentro es **independiente** de la Nota en términos de inmutabilidad
- Ambos son inmutables, pero por razones diferentes:
  - **Evento de Encuentro**: Inmutable porque representa un hecho histórico
  - **Nota Clínica**: Inmutable porque preserva la documentación legal

**No hay dependencia funcional:**

- El Evento de Encuentro NO depende de la Nota para su existencia en la Timeline
- La Nota NO depende del Evento de Encuentro para su existencia
- Ambos coexisten como entidades relacionadas pero independientes

### 3.5 Relación con Addenda

**Regla importante:**

Los Addenda (anexos) de una Nota **NO generan nuevos Eventos de Encuentro**.

**Razón:**

- El Addendum es una corrección o ampliación del documento original
- El hecho del encuentro ya fue registrado cuando la Nota fue finalizada
- Los Addenda son parte del documento Nota, no eventos separados

**Presentación:**

- Los Addenda se muestran junto con la Nota cuando se accede al Evento de Encuentro
- Los Addenda NO aparecen como eventos separados en la Timeline

---

## 4. Qué Aparece en la Timeline y Por Qué

### 4.1 Qué Aparece en la Timeline

**Aparece en la Timeline:**

- **Eventos de Encuentro** (ClinicalEvent con eventType = Encounter)
- Otros tipos de eventos clínicos (Medication Start, Medication Change, Hospitalization, etc.)

**NO aparece en la Timeline:**

- Notas Clínicas directamente (solo a través de su Evento de Encuentro asociado)
- Notas en estado Draft
- Addenda (se muestran al acceder a la Nota, no como eventos separados)

### 4.2 Por Qué Aparece el Evento de Encuentro

**Razones clínicas:**

1. **Narrativa longitudinal** — La Timeline muestra la secuencia de eventos clínicamente significativos
2. **Navegación temporal** — Permite ubicar encuentros en el tiempo del paciente
3. **Correlación con otros eventos** — Facilita ver encuentros junto con cambios de medicación, hospitalizaciones, etc.
4. **Completitud histórica** — Garantiza que todos los encuentros documentados aparezcan en la Timeline

**Razones de diseño:**

1. **Abstracción unificada** — La Timeline presenta eventos de diferentes fuentes de manera uniforme
2. **Ordenamiento consistente** — Todos los eventos siguen las mismas reglas de ordenamiento
3. **Filtrado y búsqueda** — Permite filtrar por tipo de evento de manera consistente

### 4.3 Por Qué NO Aparece la Nota Directamente

**Razones funcionales:**

1. **La Nota es el documento, no el evento** — La Timeline muestra eventos, no documentos
2. **Estado Draft** — Las Notas en borrador no deben aparecer en la Timeline clínica
3. **Granularidad diferente** — La Timeline opera a nivel de eventos, no de documentos
4. **Acceso indirecto** — La Nota se accede a través del Evento de Encuentro cuando se necesita ver el contenido

### 4.4 Cómo se Accede a la Nota desde la Timeline

**Flujo de acceso:**

1. Usuario ve Evento de Encuentro en la Timeline
2. Usuario selecciona el Evento de Encuentro
3. Sistema muestra detalles del evento (fecha, título, descripción)
4. Sistema proporciona acceso a la Nota Clínica asociada
5. Usuario accede a la Nota para ver contenido completo (subjetivo, objetivo, evaluación, plan, addenda)

**Principio de presentación:**

- La Timeline muestra **qué ocurrió** (eventos)
- La Nota muestra **qué se documentó** (contenido clínico)

---

## 5. Qué Nunca Debe Confundirse

### 5.1 Confusiones Prohibidas

**NUNCA debe confundirse:**

1. **Evento de Encuentro con Nota Clínica**
   - El Evento es el hecho histórico
   - La Nota es el documento clínico
   - Son entidades diferentes con propósitos diferentes

2. **Fecha del evento con fecha de creación de la nota**
   - `eventDate` del Evento = fecha en que ocurrió el encuentro
   - `createdAt` de la Nota = fecha en que se creó el documento
   - Pueden ser diferentes (documentación tardía)

3. **Finalización de Nota con creación de Evento**
   - Finalizar una Nota es una acción del clínico
   - Crear el Evento es una consecuencia automática
   - No son la misma operación

4. **Edición de Nota Draft con modificación de Evento**
   - Editar una Nota Draft no afecta eventos (porque no existe evento aún)
   - Una vez finalizada, la Nota no puede editarse
   - El Evento nunca puede editarse

5. **Addenda con nuevos eventos**
   - Los Addenda son parte de la Nota
   - Los Addenda NO generan nuevos Eventos de Encuentro
   - Los Addenda NO aparecen como eventos separados en la Timeline

### 5.2 Errores de Presentación que Deben Prevenirse

**Errores de UI que esta separación previene:**

1. **Mostrar Notas Draft en la Timeline**
   - ❌ Incorrecto: Mostrar Notas en borrador como si fueran eventos
   - ✅ Correcto: Solo mostrar Eventos de Encuentro de Notas finalizadas

2. **Permitir edición de Notas finalizadas desde la Timeline**
   - ❌ Incorrecto: Mostrar botón "Editar" en Notas finalizadas
   - ✅ Correcto: Mostrar solo "Ver" o "Agregar Addendum"

3. **Mostrar contenido de Nota directamente en la Timeline**
   - ❌ Incorrecto: Mostrar texto completo de subjetivo/objetivo en cada evento
   - ✅ Correcto: Mostrar título y descripción del evento, con acceso a la Nota

4. **Tratar Addenda como eventos separados**
   - ❌ Incorrecto: Mostrar Addenda como eventos independientes en la Timeline
   - ✅ Correcto: Mostrar Addenda dentro del contexto de la Nota

5. **Permitir eliminación de Eventos de Encuentro**
   - ❌ Incorrecto: Botón "Eliminar" en eventos de encuentro
   - ✅ Correcto: Eventos son permanentes, no se pueden eliminar

### 5.3 Garantías de Separación

**El sistema debe garantizar:**

1. **Identidad distinta** — Evento de Encuentro y Nota Clínica tienen identificadores únicos diferentes
2. **Ciclo de vida independiente** — Una vez creado el Evento, su existencia no depende de modificaciones a la Nota
3. **Inmutabilidad independiente** — Cada uno tiene sus propias reglas de inmutabilidad
4. **Presentación diferenciada** — La UI debe distinguir claramente entre evento y documento

---

## 6. Reglas de Inmutabilidad

### 6.1 Inmutabilidad del Evento de Encuentro

**Desde el momento de creación, el Evento de Encuentro es completamente inmutable:**

| Atributo | Inmutabilidad | Razón |
|----------|---------------|-------|
| **id** | Inmutable | Identificador único permanente |
| **eventDate** | Inmutable | Fecha histórica del encuentro no puede cambiar |
| **eventType** | Inmutable | Tipo de evento es parte de la identidad |
| **title** | Inmutable | Título preserva cómo se documentó el evento |
| **description** | Inmutable | Descripción preserva el contexto original |
| **recordedAt** | Inmutable | Timestamp de registro es histórico |
| **sourceType** | Inmutable | Tipo de fuente es parte de la estructura |
| **sourceId** (noteId) | Inmutable | Referencia a la Nota no puede cambiar |

**No hay excepciones a esta inmutabilidad.**

### 6.2 Inmutabilidad de la Nota Clínica

**Estado Draft:**

- **Todas las Notas en estado Draft son mutables**
- Pueden editarse, modificarse o eliminarse libremente
- No tienen restricciones de inmutabilidad

**Estado Finalized:**

- **Una vez finalizada, la Nota Clínica es inmutable en su contenido:**
  - `encounterDate` → Inmutable
  - `encounterType` → Inmutable
  - `subjective` → Inmutable
  - `objective` → Inmutable
  - `assessment` → Inmutable
  - `plan` → Inmutable
  - `finalizedAt` → Inmutable (una vez establecido)

**Mecanismo de corrección:**

- Las correcciones se realizan mediante **Addenda**
- Los Addenda son inmutables desde su creación
- Los Addenda NO modifican el contenido original de la Nota

### 6.3 Relación entre Inmutabilidades

**Principio de independencia:**

- La inmutabilidad del Evento de Encuentro **NO depende** de la inmutabilidad de la Nota
- La inmutabilidad de la Nota **NO depende** de la inmutabilidad del Evento
- Ambas inmutabilidades son **independientes** y se aplican por razones diferentes

**Razones de inmutabilidad:**

| Entidad | Razón de Inmutabilidad |
|---------|----------------------|
| **Evento de Encuentro** | Preserva el hecho histórico de que ocurrió un encuentro |
| **Nota Clínica** | Preserva la documentación legal y el razonamiento clínico |

### 6.4 Transiciones de Estado

**Nota Clínica:**

```
Draft → Finalized (transición única, irreversible)
```

- Una vez `Finalized`, la Nota **NO puede** volver a `Draft`
- Esta transición es **unidireccional** y **permanente**

**Evento de Encuentro:**

```
No existe → Existe (creación única)
```

- El Evento de Encuentro **NO tiene estados**
- Una vez creado, existe permanentemente
- **NO puede eliminarse** ni modificarse

---

## 7. Reglas de Presentación Semántica

### 7.1 Presentación del Evento de Encuentro en la Timeline

**Elementos semánticos que deben aparecer:**

1. **Indicador de tipo** — Debe ser claro que es un "Encuentro" o "Evento de Encuentro"
2. **Fecha del encuentro** — Fecha clínica (eventDate), no fecha de registro
3. **Título descriptivo** — Resumen breve del encuentro
4. **Descripción opcional** — Contexto adicional si está disponible
5. **Indicador de documento asociado** — Señal de que existe una Nota Clínica relacionada

**Elementos que NO deben aparecer:**

1. **Contenido completo de la Nota** — Subjetivo, objetivo, evaluación, plan no deben mostrarse en la Timeline
2. **Estado de la Nota** — No es relevante mostrar si la Nota está finalizada (si hay evento, está finalizada)
3. **Fecha de creación de la Nota** — No debe confundirse con la fecha del encuentro
4. **Addenda** — No deben mostrarse como parte del evento en la Timeline

### 7.2 Presentación de la Nota Clínica al Acceder desde el Evento

**Elementos semánticos que deben aparecer:**

1. **Identificación como documento** — Debe ser claro que es una "Nota Clínica" o "Documento Clínico"
2. **Fecha del encuentro** — Debe coincidir con eventDate del Evento asociado
3. **Tipo de encuentro** — Debe ser visible y claro
4. **Secciones estructuradas** — Subjetivo, Objetivo, Evaluación, Plan claramente diferenciadas
5. **Addenda** — Deben mostrarse como anexos al documento, con sus razones
6. **Fecha de finalización** — Debe ser visible para contexto legal/auditoría

**Elementos que NO deben aparecer:**

1. **Información del Evento de Encuentro** — No debe duplicarse información que ya está en la Timeline
2. **Opciones de edición** — Si la Nota está finalizada, no debe haber opción de editar contenido
3. **Estado Draft** — Si se accede desde un Evento, la Nota siempre está finalizada

### 7.3 Diferenciación Semántica en la UI

**Términos que deben usarse consistentemente:**

| Concepto | Término en UI | Contexto |
|----------|--------------|----------|
| Evento en Timeline | "Encuentro" o "Evento de Encuentro" | Timeline, lista de eventos |
| Documento clínico | "Nota Clínica" o "Nota" | Vista de documento, acceso desde evento |
| Acción de ver documento | "Ver Nota" o "Ver Documento" | Botón/link desde evento |
| Acción de crear | "Crear Nota" o "Documentar Encuentro" | Creación de nueva nota |
| Estado de nota | "Borrador" o "Finalizada" | Solo en contexto de edición de nota |

**Principios de presentación:**

1. **Claridad conceptual** — El usuario debe entender que el evento y el documento son cosas diferentes
2. **Navegación lógica** — Desde evento → documento, no al revés en la Timeline
3. **Jerarquía visual** — El evento es el punto de entrada, el documento es el detalle
4. **Consistencia terminológica** — Usar los mismos términos en toda la aplicación

### 7.4 Indicadores Semánticos (sin especificar UI concreta)

**Para Evento de Encuentro:**

- Debe haber un **indicador visual o textual** que identifique el tipo de evento
- Debe haber un **mecanismo de acceso** al documento Nota asociado
- Debe ser **distinguible** de otros tipos de eventos (medicación, hospitalización, etc.)

**Para Nota Clínica:**

- Debe haber un **indicador** de que es un documento clínico
- Debe haber **separación clara** entre secciones (subjetivo, objetivo, etc.)
- Debe haber **diferenciación visual** entre contenido original y Addenda
- Debe haber un **indicador** de que el documento está finalizado (si aplica)

**Principio general:**

- La presentación debe **reforzar la separación conceptual**, no ocultarla
- El usuario debe poder distinguir entre "el hecho de que ocurrió un encuentro" y "el documento que lo documenta"

---

## 8. Errores que Esta Separación Previene

### 8.1 Errores de Integridad de Datos

**Error 1: Modificación de fecha de encuentro después de finalizar**

- **Sin separación:** Modificar `encounterDate` de una Nota finalizada podría afectar el orden de la Timeline
- **Con separación:** El `eventDate` del Evento es independiente e inmutable, preservando el orden histórico

**Error 2: Eliminación accidental de encuentros**

- **Sin separación:** Eliminar una Nota podría eliminar el registro del encuentro en la Timeline
- **Con separación:** El Evento de Encuentro es independiente y no puede eliminarse, preservando la historia clínica

**Error 3: Duplicación de eventos por re-finalización**

- **Sin separación:** Si una Nota pudiera "re-finalizarse", podría generar múltiples eventos
- **Con separación:** La transición Draft → Finalized es única e irreversible, garantizando un solo evento por Nota

### 8.2 Errores de Presentación

**Error 4: Mostrar borradores como eventos clínicos**

- **Sin separación:** Notas en Draft podrían aparecer en la Timeline como si fueran encuentros reales
- **Con separación:** Solo los Eventos de Encuentro (de Notas finalizadas) aparecen en la Timeline

**Error 5: Confusión entre fecha de encuentro y fecha de documentación**

- **Sin separación:** Podría mostrarse la fecha de creación de la Nota como fecha del encuentro
- **Con separación:** `eventDate` (fecha clínica) y `recordedAt` (fecha de registro) están claramente diferenciados

**Error 6: Edición de contenido clínico desde la Timeline**

- **Sin separación:** Podría permitirse editar Notas finalizadas desde la vista de Timeline
- **Con separación:** La Timeline muestra eventos inmutables; la edición solo es posible en Notas Draft

### 8.3 Errores de Lógica Clínica

**Error 7: Pérdida de contexto histórico**

- **Sin separación:** Modificar una Nota podría cambiar cómo se interpreta un encuentro pasado
- **Con separación:** El Evento preserva el hecho histórico; la Nota preserva la documentación original

**Error 8: Correlación incorrecta de eventos**

- **Sin separación:** Si las fechas de Notas cambian, el orden temporal de la Timeline se corrompe
- **Con separación:** Los `eventDate` inmutables garantizan orden temporal consistente

**Error 9: Documentación incompleta en Timeline**

- **Sin separación:** Notas finalizadas podrían no aparecer en la Timeline si hay errores en la generación de eventos
- **Con separación:** La generación automática de eventos garantiza que toda Nota finalizada tenga su evento correspondiente

### 8.4 Errores de Integridad Legal

**Error 10: Alteración de registros médicos**

- **Sin separación:** Modificar Notas finalizadas podría alterar el registro médico legal
- **Con separación:** La inmutabilidad de Notas finalizadas y Eventos preserva la integridad legal

**Error 11: Falta de trazabilidad**

- **Sin separación:** No habría registro claro de cuándo se documentó un encuentro vs. cuándo ocurrió
- **Con separación:** `eventDate` y `recordedAt` proporcionan trazabilidad completa

**Error 12: Eliminación de evidencia clínica**

- **Sin separación:** Eliminar Notas podría eliminar evidencia de que ocurrió un encuentro
- **Con separación:** Los Eventos de Encuentro son permanentes e independientes de las Notas

### 8.5 Errores de Usabilidad

**Error 13: Confusión sobre qué se está viendo**

- **Sin separación:** El usuario podría no entender si está viendo un evento o un documento
- **Con separación:** La diferenciación semántica clara previene esta confusión

**Error 14: Acciones incorrectas disponibles**

- **Sin separación:** Podrían mostrarse opciones de edición en eventos o eliminar en documentos finalizados
- **Con separación:** Las acciones disponibles son consistentes con la naturaleza inmutable de eventos y documentos finalizados

**Error 15: Navegación inconsistente**

- **Sin separación:** Podría no ser claro cómo acceder desde un evento a su documento o viceversa
- **Con separación:** La relación unidireccional (evento → documento) es clara y consistente

---

## 9. Compatibilidad con Timeline Engine

### 9.1 Integración con el Motor de Timeline

Esta especificación es **compatible** con el Timeline Engine existente:

- **No requiere nuevos tipos de evento** — Usa el tipo `Encounter` existente
- **No modifica reglas de generación** — Respeta el mecanismo de generación automática al finalizar Notas
- **No cambia reglas de ordenamiento** — Los Eventos de Encuentro siguen las mismas reglas de ordenamiento que otros eventos
- **No altera contratos existentes** — Mantiene compatibilidad con los contratos definidos en `14_timeline_contracts.md`

### 9.2 Preservación de Garantías del Timeline Engine

**Garantías que se mantienen:**

1. **Completitud** — Toda Nota finalizada genera exactamente un Evento de Encuentro
2. **Exclusión** — Notas en Draft no aparecen en la Timeline
3. **Inmutabilidad** — Los Eventos de Encuentro son inmutables como todos los eventos
4. **Ordenamiento** — Los Eventos de Encuentro se ordenan según las reglas del Timeline Engine
5. **Determinismo** — El orden de eventos es determinístico y consistente

### 9.3 Uso de Contratos Existentes

**Contratos del Timeline Engine que aplican:**

- **CREATE-EVENT-FROM-NOTE** — Generación de Evento de Encuentro al finalizar Nota
- **IMMUTABLE-EVENT** — Inmutabilidad de todos los atributos del Evento de Encuentro
- **READ-EVENT-SOURCE** — Acceso a la Nota desde el Evento de Encuentro
- **TIMELINE-ORDERING** — Ordenamiento de Eventos de Encuentro en la Timeline

**Esta especificación no modifica estos contratos, solo los clarifica en el contexto de la separación conceptual.**

---

## 10. Resumen Ejecutivo

### 10.1 Separación Fundamental

**Evento de Encuentro:**
- Representa el **hecho** de que ocurrió un encuentro clínico
- Aparece en la Timeline
- Es inmutable desde su creación
- Se genera automáticamente al finalizar una Nota

**Nota Clínica:**
- Contiene la **documentación** del encuentro
- Puede estar en Draft o Finalizada
- Solo las finalizadas generan eventos
- Es inmutable en contenido una vez finalizada

### 10.2 Principios Clave

1. **Un encuentro, dos representaciones** — El hecho (Evento) y el documento (Nota) son entidades distintas
2. **Generación automática** — El Evento se crea cuando la Nota se finaliza
3. **Independencia después de la creación** — Una vez creado, el Evento es independiente
4. **Inmutabilidad por razones diferentes** — Evento preserva historia, Nota preserva documentación legal
5. **Presentación diferenciada** — La UI debe distinguir claramente entre evento y documento

### 10.3 Garantías del Sistema

- **Integridad histórica** — Los encuentros no pueden eliminarse de la Timeline
- **Integridad legal** — La documentación clínica no puede alterarse después de finalizar
- **Consistencia temporal** — Las fechas de encuentros son inmutables y preservan el orden
- **Completitud** — Toda Nota finalizada tiene su Evento correspondiente
- **Claridad conceptual** — La separación previene confusiones en la UI y en el uso del sistema

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Idioma: Español*  
*Depende de: 02_domain.md, 13_timeline_engine.md, 14_timeline_contracts.md*  
*Consumido por: Implementación de UI, Implementación de Backend, QA Testing*
