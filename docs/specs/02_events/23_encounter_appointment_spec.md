# Sistema de Registros Médicos Psiquiátricos — Especificación Funcional: Eventos Encounter de Turnos Agendados

## Overview

> **Referencia de terminología:** Este documento utiliza la terminología estándar definida en [`09_terminology_glossary.md`](../00_foundation/09_terminology_glossary.md). Términos clave: **Encuentro clínico**, **Evento NOTE**, **Nota Clínica**, **Turno agendado**, **Evento Encounter**.

Este documento define formalmente el comportamiento funcional de los eventos de tipo **Encounter** asociados a Turnos agendados (Appointments) en el sistema de Historias Clínicas Psiquiátricas.

Esta especificación establece las reglas de creación, visibilidad temporal y relación con la timeline clínica para eventos Encounter derivados de Turnos agendados, preservando la integridad de la narrativa clínica longitudinal.

**Principio central (no negociable):**
- Los eventos Encounter derivados de Turnos agendados SOLO deben mostrarse en la timeline si la fecha del Turno agendado ya pasó.
- Los Turnos agendados futuros NO forman parte de la timeline clínica.

---

## 1. Propósito del Evento Encounter en el Sistema

### 1.1 Función del Evento Encounter

Un **Evento Encounter** es una instancia de `ClinicalEvent` con `eventType = Encounter` que representa que tuvo lugar un Turno agendado.

**Características esenciales:**

- Es una instancia de `ClinicalEvent` con `eventType = Encounter`
- Representa el **hecho** de que ocurrió un Turno agendado
- Aparece en la Timeline del paciente **solo si la fecha del Turno agendado ya pasó**
- Es inmutable desde el momento de su creación
- Tiene una fecha de ocurrencia clínica (`eventDate`) que representa cuándo ocurrió el Turno agendado
- Tiene una fecha de registro (`recordedAt`) que representa cuándo fue documentado en el sistema
- Referencia al Appointment (Turno agendado) que lo generó

### 1.2 Diferencia entre Encounter (turno) y NOTE (documentación)

**Separación conceptual fundamental:**

| Aspecto | Evento Encounter (Turno agendado) | Evento NOTE (documentación) |
|---------|--------------------------|-----------------------------|
| **Origen** | Appointment (Turno agendado) | Note (nota clínica finalizada) |
| **Representa** | El hecho de que ocurrió un Turno agendado | El hecho de que se documentó un Encuentro clínico |
| **Contenido clínico** | NO contiene contenido clínico | Referencia a Nota que contiene documentación completa |
| **Rol** | Administrativo/temporal | Clínico/documental |
| **Visibilidad temporal** | Solo si fecha del Turno agendado ya pasó | Solo si Nota fue finalizada |
| **Relación con documentación** | Puede existir sin Nota asociada | Requiere Nota finalizada |

**Principio de separación:**

- **Encounter** representa **planificación ejecutada** (el Turno agendado ocurrió)
- **NOTE** representa **documentación clínica** (el Encuentro clínico fue documentado)
- Un Turno agendado puede ocurrir sin generar documentación (Nota)
- Una Nota puede documentar un Encuentro clínico que no fue agendado previamente

### 1.3 Rol Administrativo vs Clínico

**Rol administrativo del Encounter:**

- Marca temporalmente que un turno agendado tuvo lugar
- Proporciona referencia cronológica en la timeline
- Permite correlacionar turnos con otros eventos clínicos
- NO contiene información clínica (observaciones, evaluaciones, planes)

**Rol clínico del NOTE:**

- Representa documentación clínica estructurada
- Contiene contenido clínico (subjetivo, objetivo, evaluación, plan)
- Es el registro médico legal del encuentro
- Preserva el razonamiento clínico del momento

**Separación de responsabilidades:**

- El Encounter responde: "¿Cuándo ocurrió el Turno agendado?"
- El NOTE responde: "¿Qué se documentó del Encuentro clínico?"

---

## 2. Definición del Turno Agendado (Appointment)

### 2.1 Qué Representa un Turno Agendado

Un **Turno agendado** (Appointment) es una instancia de la entidad `Appointment` que representa una cita agendada entre el clínico y el paciente.

**Características esenciales:**

- Es una entidad administrativa, no clínica
- Representa una **intención** de Encuentro clínico futuro o un **registro** de Encuentro clínico pasado
- Tiene una fecha programada (`scheduledDate`) que puede estar en el futuro o en el pasado
- Puede tener estado: Scheduled, Completed, Cancelled, NoShow
- NO contiene documentación clínica
- NO genera eventos automáticamente al crearse

### 2.2 Qué NO Representa un Turno Agendado

Un Turno agendado **NO representa:**

- **Documentación clínica** — El Turno agendado no contiene observaciones, evaluaciones o planes
- **Un Encuentro clínico documentado** — El Turno agendado puede existir sin Nota asociada
- **Un evento clínico** — El Turno agendado en sí no es un evento en la timeline
- **Un hecho ocurrido** — Los Turnos agendados futuros son planificación, no hechos
- **Contenido clínico** — El campo `notes` del Appointment es administrativo, no clínico

### 2.3 Relación con el Tiempo (Futuro vs Pasado)

**Turnos agendados futuros:**

- Representan **planificación** de Encuentros clínicos
- La fecha programada está en el futuro
- **SÍ generan eventos Encounter** inmediatamente al agendar
- **NO aparecen en la timeline** hasta que la fecha pase (se ocultan)
- Los eventos Encounter futuros existen en la base de datos pero se filtran en la visualización
- Son información administrativa, pero el evento se crea para mantener consistencia

**Turnos agendados pasados:**

- Representan **Turnos agendados que ya ocurrieron**
- La fecha programada está en el pasado
- **Tienen eventos Encounter** (creados al agendar o al pasar la fecha)
- **Aparecen en la timeline** (son visibles)
- Son hechos ocurridos, no planificación

**Principio temporal:**

- **Futuro = Planificación** → Evento existe pero se oculta en timeline
- **Pasado = Hecho** → Evento visible en timeline

---

## 3. Definición del Evento Encounter

### 3.1 Qué Significa la Existencia de un Evento Encounter

La existencia de un Evento Encounter significa que:

1. **Un turno agendado tuvo lugar** — La fecha programada del turno ya pasó
2. **El turno es un hecho histórico** — No es planificación, es ocurrencia
3. **El evento marca temporalmente el turno** — Establece cuándo ocurrió en la historia del paciente
4. **El evento es parte de la narrativa clínica** — Aparece en la timeline junto con otros eventos

**NO significa:**

- Que el encuentro fue documentado clínicamente (eso requiere un evento NOTE)
- Que el turno fue completado exitosamente (puede haber sido no-show)
- Que existe una Nota asociada (el Encounter puede existir sin Nota)

### 3.2 Información Mínima del Evento Encounter

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación del evento | Inmutable |
| **eventDate** | Fecha | Fecha en que ocurrió el turno (scheduledDate del Appointment) | Inmutable |
| **eventType** | Enumeration | Siempre "Encounter" | Inmutable |
| **title** | Texto | Resumen breve del turno (derivado de appointmentType) | Inmutable |
| **description** | Texto (opcional) | Descripción del turno (puede incluir estado: completed, no-show) | Inmutable |
| **recordedAt** | Timestamp | Cuándo fue documentado el evento | Inmutable |
| **sourceType** | Enumeration | Siempre "Appointment" | Inmutable |
| **sourceId** | Identificador | Referencia al Appointment que lo generó | Inmutable |

**Datos derivados del Appointment:**

- `eventDate` = `Appointment.scheduledDate`
- `title` = Transformación de `Appointment.appointmentType` a texto descriptivo
- `description` = Opcionalmente puede incluir estado del turno (Completed, NoShow) y notas administrativas
- `sourceId` = `Appointment.id`

### 3.3 Qué NO Contiene el Evento Encounter

El Evento Encounter **NO contiene:**

- **Contenido clínico** — No tiene subjetivo, objetivo, evaluación o plan
- **Observaciones del encuentro** — Esas pertenecen a la Nota Clínica
- **Razonamiento clínico** — No documenta decisiones de tratamiento
- **Información de medicación** — No registra cambios de medicación
- **Evaluaciones diagnósticas** — No contiene evaluaciones clínicas

**Principio de contenido:**

- El Encounter es un **marcador temporal** del turno
- El contenido clínico pertenece a la **Nota Clínica** (evento NOTE)

---

## 4. Relación Appointment ↔ Encounter

### 4.1 Cuándo se Crea el Evento Encounter

**Regla fundamental:**

Un Evento Encounter se crea **inmediatamente** al agendar el turno, independientemente de si la fecha es futura o pasada, cuando se cumple la condición:

1. **El turno no ha generado un Encounter previamente** — No existe un Evento Encounter con `sourceId = Appointment.id`

**Momento de creación:**

- **Creación inmediata al agendar** — El sistema crea el evento Encounter tan pronto como se crea el Appointment
- **Aplicable a turnos futuros y pasados** — No hay distinción temporal en la creación
- **Visibilidad diferida para futuros** — Los eventos Encounter con fecha futura se crean pero se ocultan en la timeline hasta que la fecha pase

**Garantía del sistema:**

- Cada turno genera **exactamente un** Evento Encounter al agendar
- No se generan eventos duplicados
- La creación es automática e inmediata, no requiere intervención manual
- Los eventos Encounter futuros existen en la base de datos pero se filtran en la visualización de la timeline

### 4.2 Relación Temporal entre Appointment y Encounter

**Relación temporal:**

```
Appointment.scheduledDate → Evento Encounter.eventDate
```

- La fecha del evento Encounter es **siempre igual** a la fecha programada del turno
- El evento Encounter **no puede tener una fecha diferente** a la del turno
- Si el turno se reprograma (cambia su scheduledDate), el evento Encounter existente mantiene su fecha original (inmutabilidad)

**Principio de inmutabilidad temporal:**

- Una vez creado el Evento Encounter, su `eventDate` es inmutable
- Si un turno se reprograma después de generar el evento, el evento mantiene la fecha original
- Esto preserva la integridad histórica: el evento refleja cuándo el turno realmente ocurrió según la planificación original

### 4.3 Cardinalidad de la Relación

**Cardinalidad:**

- Un Appointment puede generar **exactamente un** Evento Encounter
- Un Evento Encounter referencia **exactamente un** Appointment
- Relación 1:1 entre Appointment y Evento Encounter

**Casos especiales:**

- **Turno cancelado antes de la fecha:** El Evento Encounter asociado debe eliminarse (el turno no ocurrió)
- **Turno reprogramado antes de la fecha:** El Evento Encounter original debe eliminarse y se crea uno nuevo con la nueva fecha
- **Turno sin evento:** Un turno sin evento Encounter indica un error en el sistema (debería existir desde el agendamiento)

---

## 5. Regla de Visibilidad en la Timeline

### 5.1 Condición Exacta para Mostrarse

**Regla de visibilidad:**

Un Evento Encounter aparece en la timeline **solo si** se cumple la condición:

1. **La fecha del evento ya pasó** — `eventDate <= fecha actual`

**Condición equivalente:**

```
Evento Encounter visible en timeline ⟺ eventDate <= fecha actual
```

**Garantía del sistema:**

- Los eventos Encounter con `eventDate` futura **existen en la base de datos** pero **no aparecen en la timeline**
- El filtrado es a nivel de visualización/consulta, no de creación
- La timeline solo muestra hechos ocurridos, no eventos futuros
- Los eventos Encounter futuros se hacen visibles automáticamente cuando su fecha pasa

### 5.2 Comportamiento de Turnos Futuros

**Turnos futuros (scheduledDate > fecha actual):**

- **SÍ generan eventos Encounter** — El sistema crea el evento inmediatamente al agendar
- **NO aparecen en la timeline** — Los eventos Encounter futuros se filtran en la visualización
- **Existen en la base de datos** — Los eventos se persisten pero se ocultan hasta que la fecha pase
- **Se hacen visibles automáticamente** — Cuando la fecha del turno pasa, el evento aparece en la timeline sin intervención

**Principio de separación:**

- **Planificación (futuro)** → Evento existe pero se oculta en timeline
- **Hechos (pasado)** → Evento visible en timeline

### 5.3 Comportamiento de Turnos Pasados

**Turnos pasados (scheduledDate <= fecha actual):**

- **Generan eventos Encounter** — El sistema crea el evento automáticamente
- **Aparecen en la timeline** — Los turnos pasados son hechos históricos
- **Son parte de la narrativa clínica** — Contribuyen a la historia longitudinal del paciente

**Momentos de aparición:**

- **Inmediato:** Si el evento se crea al pasar la fecha, aparece inmediatamente en la timeline
- **Bajo demanda:** Si el evento se crea al consultar la timeline, aparece cuando se consulta

**Independencia del estado del turno:**

- El evento Encounter aparece en la timeline **independientemente** del estado del turno (Completed, NoShow, Cancelled)
- Un turno con estado NoShow puede tener un Encounter visible si su fecha ya pasó
- Un turno cancelado **antes** de su fecha no tiene Encounter (se elimina al cancelar)
- Un turno cancelado **después** de su fecha mantiene su Encounter (inmutabilidad de eventos pasados)

---

## 6. Flujo Temporal Completo

### 6.1 Agendar Turno Futuro

**Secuencia temporal:**

1. **Clínico agenda un turno**
   - Se crea Appointment con `scheduledDate` en el futuro
   - Estado inicial: `Scheduled`
   - **Se crea Evento Encounter inmediatamente**

2. **Evento Encounter se crea**
   - `eventDate = Appointment.scheduledDate` (fecha futura)
   - `eventType = Encounter`
   - `sourceId = Appointment.id`
   - `recordedAt = momento actual`
   - **Evento se persiste en la base de datos**

3. **Turno existe como planificación**
   - El turno es visible en calendario/agenda
   - **Evento Encounter existe pero NO aparece en timeline** (filtrado por fecha futura)
   - El evento está oculto hasta que la fecha pase

4. **Sistema mantiene separación temporal**
   - El evento existe en la base de datos
   - El evento se filtra en la visualización de la timeline
   - No contamina la narrativa clínica con eventos futuros visibles

### 6.2 Llegada de la Fecha del Turno

**Secuencia temporal:**

1. **Fecha del turno llega o pasa**
   - `Appointment.scheduledDate <= fecha actual`
   - El turno deja de ser futuro, ahora es pasado

2. **Evento Encounter ya existe**
   - El Evento Encounter fue creado al agendar
   - No se requiere creación adicional
   - El evento ya está en la base de datos

3. **Evento Encounter aparece en timeline**
   - El evento ahora cumple la condición de visibilidad (`eventDate <= fecha actual`)
   - El evento es visible en la timeline del paciente
   - Se ordena según las reglas del Timeline Engine
   - Aparece en su posición cronológica correcta
   - **No se requiere intervención del sistema** — el filtrado automático lo hace visible

### 6.3 Visualización en Timeline

**Cuando se consulta la timeline:**

1. **Sistema recupera eventos clínicos**
   - Incluye eventos NOTE, Medication, Hospitalization, etc.
   - **Incluye eventos Encounter** con `eventDate <= fecha actual` (filtrado de futuros)

2. **Sistema ordena eventos**
   - Aplica reglas de ordenamiento del Timeline Engine
   - Eventos Encounter se ordenan por `eventDate`, luego `recordedAt`, luego prioridad de tipo

3. **Sistema presenta timeline**
   - Muestra eventos en orden cronológico
   - Eventos Encounter aparecen en su posición temporal
   - **NO muestra eventos Encounter futuros** (existen en BD pero se filtran en visualización)

**Presentación del evento Encounter:**

- Muestra fecha del turno (`eventDate`)
- Muestra tipo de turno (derivado de `appointmentType`)
- Muestra estado del turno si es relevante (Completed, NoShow)
- Proporciona acceso al Appointment asociado (opcional)

### 6.4 Casos sin Nota Asociada

**Escenario: Turno pasado sin Nota Clínica**

1. **Turno ocurre** (fecha pasa)
2. **Sistema crea Evento Encounter** (automáticamente)
3. **Evento Encounter aparece en timeline**
4. **NO existe Nota Clínica asociada**
5. **NO existe Evento NOTE**

**Implicaciones:**

- El Encounter marca que el turno ocurrió
- La timeline muestra que hubo un turno en esa fecha
- No hay documentación clínica del encuentro
- El Encounter puede existir independientemente de la Nota

**Escenario: Turno pasado con Nota Clínica posterior**

1. **Turno ocurre** (fecha pasa)
2. **Sistema crea Evento Encounter**
3. **Clínico crea Nota Clínica** (días después, con `encounterDate` = fecha del turno)
4. **Clínico finaliza Nota**
5. **Sistema crea Evento NOTE**

**Resultado en timeline:**

- **Dos eventos en la misma fecha:**
  - Evento Encounter (del turno)
  - Evento NOTE (de la Nota finalizada)
- **Ordenamiento:** Según reglas del Timeline Engine (NOTE tiene prioridad sobre Encounter en mismo día)
- **Ambos eventos son visibles** y referencian el mismo encuentro desde perspectivas diferentes

---

## 7. Reglas Explícitas

### 7.1 Encounter No Sustituye Nota

**Regla fundamental:**

El Evento Encounter **NO sustituye** la necesidad de documentación clínica (Nota Clínica).

**Implicaciones:**

- Un Encounter puede existir sin Nota asociada
- La existencia de un Encounter no implica que el encuentro fue documentado
- La documentación clínica requiere crear y finalizar una Nota
- El Encounter y el NOTE son eventos independientes con propósitos diferentes

**Principio de complementariedad:**

- **Encounter** = "El turno ocurrió"
- **NOTE** = "El encuentro fue documentado"
- Ambos pueden coexistir para el mismo encuentro
- Ninguno sustituye al otro

### 7.2 Encounter No Genera Estado Clínico

**Regla fundamental:**

El Evento Encounter **NO genera** estado clínico en el paciente.

**Implicaciones:**

- El Encounter no modifica medicaciones activas
- El Encounter no actualiza la historia psiquiátrica
- El Encounter no cambia el estado clínico del paciente
- El Encounter es un marcador temporal, no una acción clínica

**Principio de neutralidad clínica:**

- El Encounter es **informativo**, no **transformativo**
- Solo marca que un turno ocurrió
- No tiene efectos clínicos en el estado del paciente

### 7.3 Encounter No Es Editable Históricamente

**Regla fundamental:**

El Evento Encounter es **inmutable** desde el momento de su creación.

**Implicaciones:**

- Una vez creado, el Encounter no puede modificarse
- La fecha del evento (`eventDate`) es permanente
- El título y descripción son inmutables
- La referencia al Appointment es permanente

**Principio de inmutabilidad:**

- El Encounter preserva el hecho histórico tal como fue registrado
- No se permite modificación retroactiva
- Si el turno se reprograma después de generar el evento, el evento mantiene su fecha original

### 7.4 Encounter No Aparece Antes de Ocurrir

**Regla fundamental:**

El Evento Encounter **NO aparece** en la timeline antes de que la fecha del turno pase.

**Implicaciones:**

- Los turnos futuros no generan eventos Encounter
- Los eventos Encounter no se crean para fechas futuras
- La timeline no muestra eventos Encounter con `eventDate` futura
- La planificación no contamina la narrativa clínica

**Principio de temporalidad:**

- **Futuro** = Planificación → No es timeline
- **Pasado** = Hecho → Es timeline
- La timeline solo muestra hechos ocurridos

---

## 8. Impacto en la Narrativa Clínica

### 8.1 Separación entre Planificación y Hechos

**Principio de separación:**

La timeline clínica **solo muestra hechos ocurridos**, no planificación futura.

**Beneficios:**

- **Claridad narrativa** — La timeline cuenta la historia del paciente, no sus planes
- **Integridad temporal** — Los eventos aparecen cuando ocurrieron, no cuando se planificaron
- **Prevención de contaminación** — La planificación no mezcla con la documentación histórica
- **Enfoque clínico** — La timeline se enfoca en lo que pasó, no en lo que pasará

**Implementación:**

- Los turnos futuros existen como información administrativa
- Los turnos pasados generan eventos Encounter que aparecen en la timeline
- La separación es automática basada en la fecha

### 8.2 Prevención de Contaminación de la Timeline

**Problema evitado:**

Sin la regla de visibilidad temporal, la timeline podría mostrar:
- Turnos futuros mezclados con eventos pasados
- Planificación confundida con documentación
- Eventos que aún no ocurrieron apareciendo como hechos

**Solución:**

- **Regla estricta:** Solo eventos con `eventDate <= fecha actual` aparecen en timeline
- **Aplicación automática:** El sistema no crea eventos Encounter para turnos futuros
- **Garantía del sistema:** La timeline solo contiene hechos ocurridos

**Resultado:**

- Timeline limpia y cronológicamente precisa
- Separación clara entre planificación y documentación
- Narrativa clínica enfocada en hechos históricos

---

## 9. Casos Fuera de Alcance

### 9.1 Recordatorios

**Fuera de alcance:**

- Sistema de recordatorios automáticos de turnos
- Notificaciones de turnos próximos
- Alertas de turnos vencidos sin documentación

**Razón:**

- Los recordatorios son funcionalidad administrativa, no clínica
- No afectan la generación o visibilidad de eventos Encounter
- Son responsabilidad de módulos de gestión de turnos, no del Timeline Engine

### 9.2 Confirmaciones

**Fuera de alcance:**

- Confirmación de asistencia a turnos
- Verificación de que el paciente asistió
- Marcado manual de turnos como "confirmados"

**Razón:**

- Las confirmaciones son administrativas
- El Encounter se genera automáticamente cuando la fecha pasa, independientemente de confirmación
- El estado del turno (Completed, NoShow) puede reflejarse en la descripción del evento, pero no afecta su creación

### 9.3 Cancelaciones y Reprogramaciones de Turnos Futuros

**Regla fundamental:**

Cuando un turno futuro se cancela o se reprograma **antes de su fecha programada**, el Evento Encounter asociado debe eliminarse.

**Cancelación de turno futuro:**

1. **Turno futuro se cancela**
   - El Appointment cambia su estado a `Cancelled`
   - La fecha programada aún no ha pasado

2. **Sistema elimina Evento Encounter**
   - Se busca el Evento Encounter con `sourceId = Appointment.id`
   - Si existe y `eventDate > fecha actual`, se elimina
   - El turno cancelado no debe aparecer en la timeline

**Reprogramación de turno futuro:**

1. **Turno futuro se reprograma**
   - El Appointment cambia su `scheduledDate` a una nueva fecha
   - La fecha original aún no ha pasado

2. **Sistema elimina Evento Encounter original**
   - Se busca el Evento Encounter con `sourceId = Appointment.id`
   - Si existe y la fecha original es futura, se elimina

3. **Sistema crea nuevo Evento Encounter**
   - Se crea un nuevo Evento Encounter con la nueva fecha programada
   - El nuevo evento sigue las mismas reglas de creación y visibilidad

**Garantía del sistema:**

- Cada turno futuro tiene exactamente un Evento Encounter
- Si un turno futuro se cancela/reprograma, el evento anterior se elimina
- Los eventos Encounter de turnos pasados son inmutables (no se eliminan al cancelar/reprogramar)

### 9.4 Cancelaciones y Reprogramaciones de Turnos Pasados

**Fuera de alcance:**

- Cancelación de turnos pasados que ya generaron eventos visibles
- Reprogramación de turnos pasados (el evento mantiene su fecha original por inmutabilidad)
- Lógica específica de manejo de estados de turnos pasados

**Nota:**

- Los turnos pasados con eventos Encounter visibles mantienen sus eventos (inmutabilidad)
- Si un turno pasado se cancela, el evento Encounter puede reflejar el estado en su descripción
- La lógica específica de cancelación/reprogramación de turnos pasados es responsabilidad del módulo de Appointments

### 9.5 Asistencia / Inasistencia

**Fuera de alcance:**

- Marcado de asistencia o inasistencia a turnos
- Impacto de no-show en la generación de eventos Encounter
- Lógica de seguimiento de inasistencias

**Nota:**

- El estado del turno (Completed, NoShow) puede reflejarse en la descripción del evento Encounter
- El estado no afecta la creación del evento: un turno pasado genera Encounter independientemente de si el paciente asistió
- La lógica específica de asistencia/inasistencia es responsabilidad del módulo de Appointments

---

## 10. Resumen Ejecutivo

### 10.1 Principios Fundamentales

1. **Separación Encounter vs NOTE**
   - Encounter = turno ocurrido (administrativo)
   - NOTE = encuentro documentado (clínico)
   - Son eventos independientes con propósitos diferentes

2. **Visibilidad Temporal Estricta**
   - Solo eventos con `eventDate <= fecha actual` aparecen en timeline
   - Turnos futuros NO generan eventos Encounter
   - La timeline solo muestra hechos ocurridos

3. **Inmutabilidad del Encounter**
   - Una vez creado, el Encounter es inmutable
   - Preserva el hecho histórico tal como fue registrado
   - No se permite modificación retroactiva

4. **Independencia de Documentación**
   - El Encounter puede existir sin Nota asociada
   - El Encounter no sustituye la necesidad de documentación clínica
   - El Encounter y el NOTE son complementarios, no sustitutivos

### 10.2 Garantías del Sistema

- **Integridad temporal** — Los eventos Encounter aparecen solo cuando la fecha del turno ya pasó
- **Separación clara** — Planificación (futuro) no contamina la timeline (pasado)
- **Inmutabilidad** — Los eventos Encounter son permanentes una vez creados
- **Trazabilidad** — Cada Encounter referencia su Appointment fuente
- **Completitud** — Cada turno pasado genera exactamente un Encounter

### 10.3 Flujos Principales

**Agendar Turno Futuro:**
1. Se crea Appointment con fecha futura
2. NO se crea Evento Encounter
3. NO aparece en timeline

**Pasar Fecha del Turno:**
1. Sistema detecta turno pasado
2. Sistema crea Evento Encounter automáticamente
3. Evento Encounter aparece en timeline

**Consultar Timeline:**
1. Sistema recupera eventos con `eventDate <= fecha actual`
2. Incluye eventos Encounter de turnos pasados
3. Excluye eventos Encounter futuros (no existen)
4. Ordena según reglas del Timeline Engine

### 10.4 Reglas No Negociables

1. **Encounter solo para turnos pasados** — Los turnos futuros NO generan eventos Encounter
2. **Timeline solo muestra hechos** — Los eventos futuros NO aparecen en timeline
3. **Encounter no es documentación** — El Encounter NO contiene contenido clínico
4. **Encounter es inmutable** — Una vez creado, el Encounter no puede modificarse
5. **Separación de responsabilidades** — Encounter (turno) y NOTE (documentación) son independientes

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Idioma: Español*  
*Depende de: 02_domain.md, 03_timeline.md, 13_timeline_engine.md, 22_nota_clinica_evento_note.md*  
*Consumido por: Implementación de Timeline Engine, Implementación de Appointment Service, QA Testing*
