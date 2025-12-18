# Sistema de Historias Clínicas Psiquiátricas — Especificación Funcional: Evento Fundacional de Timeline

## Overview

Este documento define la especificación funcional completa para el "Evento Fundacional de Timeline", un evento especial que marca el inicio formal de la historia clínica del paciente en el sistema.

Este documento especifica **QUÉ** es el evento y cómo se comporta funcionalmente, no **CÓMO** se implementa técnicamente.

El Evento Fundacional establece el punto de origen del timeline clínico y proporciona un marcador temporal para el inicio de la relación terapéutica documentada.

---

## 1. Propósito del Evento

### 1.1 Por Qué Existe el Evento Fundacional

El Evento Fundacional de Timeline existe para:

- **Marcar el inicio formal de la historia clínica** — Establece un punto de origen claro y explícito para el timeline del paciente
- **Proporcionar un ancla temporal** — Ofrece una referencia temporal absoluta desde la cual se ordenan todos los eventos subsecuentes
- **Establecer el contexto inicial** — Representa el momento en que la relación terapéutica documentada comienza, independientemente de cuándo se registró administrativamente al paciente
- **Garantizar completitud del timeline** — Asegura que todo paciente con un ClinicalRecord tenga al menos un evento en su timeline, eliminando estados vacíos

### 1.2 Problema que Resuelve

Sin el Evento Fundacional, el timeline de un paciente podría permanecer vacío hasta que ocurra el primer evento clínico documentado (típicamente la primera nota finalizada). Esto crea:

- **Ambiguidad temporal** — No hay un punto de referencia claro para el inicio de la historia
- **Estados vacíos** — Un ClinicalRecord podría existir sin eventos, dificultando la presentación y navegación
- **Desconexión conceptual** — La creación administrativa del paciente y el inicio de la historia clínica documentada no tienen un marcador explícito

El Evento Fundacional resuelve estos problemas proporcionando un evento garantizado que siempre existe y marca el inicio formal de la historia clínica.

### 1.3 Relación con Otros Eventos

El Evento Fundacional es único en el timeline:

- **Es el primer evento** — Siempre ocupa la posición más temprana en el timeline
- **No es un evento clínico** — No representa una ocurrencia clínica (encuentro, medicación, hospitalización)
- **No genera estado clínico** — No afecta medicaciones activas, historia psiquiátrica, o estado de tratamiento
- **Es inmutable** — Una vez creado, no puede ser modificado ni eliminado
- **No tiene fuente clínica** — No está vinculado a una Note, Medication, o PsychiatricHistory

---

## 2. Definición Funcional

### 2.1 Qué Es el Evento Fundacional

El Evento Fundacional de Timeline es un evento especial del sistema que marca el inicio formal de la historia clínica documentada de un paciente.

**Características esenciales:**

- Es un evento del tipo "Fundacional" (nuevo tipo de evento, distinto de los tipos clínicos existentes)
- Tiene una fecha de evento que representa el inicio de la historia clínica
- Tiene un título y descripción estándar definidos por el sistema
- No está vinculado a ninguna entidad clínica (Note, Medication, PsychiatricHistory)
- Es inmutable una vez creado
- No puede ser eliminado del timeline
- Siempre aparece como el primer evento en el timeline

### 2.2 Qué NO Es el Evento Fundacional

El Evento Fundacional **NO** es:

- **Un evento clínico** — No representa una ocurrencia clínica (encuentro, medicación, hospitalización, etc.)
- **Un evento generado por una entidad clínica** — No tiene fuente en Note, Medication, o PsychiatricHistory
- **Un evento editable** — Una vez creado, es completamente inmutable
- **Un evento opcional** — Es obligatorio para todo ClinicalRecord
- **Un marcador administrativo** — No representa la creación del Patient, sino el inicio de la historia clínica documentada
- **Un evento que genera estado** — No afecta medicaciones activas, historia psiquiátrica, o estado de tratamiento

### 2.3 Tipo de Evento

El Evento Fundacional introduce un nuevo tipo de evento: **"Foundational"** (o "Fundacional" en español para UX).

Este tipo es distinto de los tipos clínicos existentes:
- Encounter
- Medication Start
- Medication Change
- Medication Stop
- Hospitalization
- Life Event
- History Update
- Other

**Prioridad de ordenamiento:** El tipo "Foundational" tiene la prioridad más alta (0) en el ordenamiento por tipo de evento, garantizando que siempre aparezca primero.

---

## 3. Momento de Creación

### 3.1 Cuándo Se Crea el Evento Fundacional

El Evento Fundacional se crea **automáticamente** cuando se crea el ClinicalRecord del paciente.

**Secuencia de creación:**

1. Se crea el Patient (registro administrativo)
2. Se crea automáticamente el ClinicalRecord (contenedor de información clínica)
3. Se crea automáticamente el PsychiatricHistory versión 1 (historia inicial vacía)
4. **Se crea automáticamente el Evento Fundacional** (marca el inicio del timeline)

Esta secuencia ocurre en una única transacción atómica durante la creación del paciente.

### 3.2 Condiciones de Creación

El Evento Fundacional se crea si y solo si:

- Se ha creado exitosamente un ClinicalRecord
- El ClinicalRecord no tiene ya un Evento Fundacional (garantía de unicidad)

**No se crea si:**
- El ClinicalRecord no existe
- Ya existe un Evento Fundacional para ese ClinicalRecord
- La creación del ClinicalRecord falla

### 3.3 Unicidad

**Regla de unicidad:** Cada ClinicalRecord tiene exactamente un Evento Fundacional.

- No puede haber múltiples Eventos Fundacionales para el mismo ClinicalRecord
- No puede haber un ClinicalRecord sin Evento Fundacional
- La creación del Evento Fundacional es idempotente: si ya existe, no se crea otro

### 3.4 Fecha del Evento

**Fecha de evento (event_timestamp):**

La fecha del Evento Fundacional es la **fecha de creación del ClinicalRecord** (clinicalRecord.createdAt).

**Justificación funcional:**

- Representa el momento en que la historia clínica documentada comienza formalmente
- Proporciona una referencia temporal absoluta y consistente
- No depende de eventos clínicos futuros (que pueden no existir)
- Es determinista y no ambigua

**Fecha de registro (recorded_timestamp):**

La fecha de registro es la misma que la fecha de evento (ambas son el momento de creación del ClinicalRecord).

**No se permite backdating del Evento Fundacional:**

A diferencia de otros eventos clínicos, el Evento Fundacional no puede tener una fecha de evento en el pasado relativo a su creación. Su fecha siempre coincide con la creación del ClinicalRecord.

---

## 4. Relación con Patient / ClinicalRecord

### 4.1 Relación con Patient

El Evento Fundacional **NO** está directamente relacionado con el Patient.

**Separación de dominios:**

- **Patient** — Entidad administrativa (identidad, contacto, estado)
- **ClinicalRecord** — Contenedor de información clínica
- **Evento Fundacional** — Evento dentro del ClinicalRecord

El Evento Fundacional existe en el dominio clínico (ClinicalRecord), no en el dominio administrativo (Patient).

**Implicaciones:**

- La creación del Patient no genera el Evento Fundacional directamente
- La creación del Patient genera el ClinicalRecord, que a su vez genera el Evento Fundacional
- Las modificaciones al Patient no afectan el Evento Fundacional
- El Evento Fundacional no contiene información del Patient

### 4.2 Relación con ClinicalRecord

El Evento Fundacional pertenece a un ClinicalRecord específico.

**Relación:**

- Un ClinicalRecord tiene exactamente un Evento Fundacional
- Un Evento Fundacional pertenece a exactamente un ClinicalRecord
- La relación es 1:1

**Dependencia:**

- El Evento Fundacional no puede existir sin un ClinicalRecord
- Si un ClinicalRecord se elimina (operación no permitida en el MVP, pero conceptualmente), su Evento Fundacional también se eliminaría
- El Evento Fundacional referencia al ClinicalRecord a través de clinicalRecordId

### 4.3 Independencia de Entidades Clínicas

El Evento Fundacional **NO** está relacionado con:

- **Notes** — No tiene noteId
- **Medications** — No tiene medicationId
- **PsychiatricHistory** — No tiene psychiatricHistoryId
- **Addenda** — No tiene relación con addenda

**Tipo de fuente (sourceType):**

El Evento Fundacional tiene sourceType = "System" (o equivalente), indicando que es generado por el sistema, no por una entidad clínica.

**sourceId:**

El sourceId del Evento Fundacional es null, ya que no tiene una entidad fuente.

---

## 5. Comportamiento en la Timeline

### 5.1 Posición en el Timeline

**Posición absoluta:**

El Evento Fundacional **siempre** ocupa la primera posición en el timeline del paciente.

**Garantía de ordenamiento:**

Independientemente de las fechas de otros eventos, el Evento Fundacional aparece primero debido a:

1. **Prioridad de tipo de evento:** Tipo "Foundational" tiene prioridad 0 (más alta)
2. **Fecha de evento:** Coincide con la creación del ClinicalRecord (típicamente la fecha más temprana)
3. **Fecha de registro:** Coincide con la fecha de evento (más temprana posible)

### 5.2 Orden Determinista

El ordenamiento del Evento Fundacional sigue las reglas estándar del Timeline Engine:

```
ORDER BY
  event_timestamp ASC,
  recorded_timestamp ASC,
  event_type_priority ASC,
  event_identifier ASC
```

**Aplicación al Evento Fundacional:**

- **event_timestamp:** Fecha de creación del ClinicalRecord (típicamente la más temprana)
- **recorded_timestamp:** Misma que event_timestamp (más temprana posible)
- **event_type_priority:** 0 (más alta, tipo "Foundational")
- **event_identifier:** Identificador único del evento

**Resultado:** El Evento Fundacional siempre aparece primero, incluso si otros eventos tienen la misma fecha de evento.

### 5.3 Visibilidad en el Timeline

**Siempre visible:**

El Evento Fundacional es siempre visible en el timeline, sin excepciones.

**No se puede ocultar:**

- No hay mecanismo para ocultar el Evento Fundacional
- No hay filtros que excluyan el Evento Fundacional
- No hay estados que hagan invisible el Evento Fundacional

**Presentación:**

El Evento Fundacional aparece en todas las vistas del timeline:
- Vista cronológica completa (forward)
- Vista cronológica inversa (reverse)
- Vistas filtradas por tipo de evento
- Vistas filtradas por rango de fechas (siempre incluido si está en el rango)

### 5.4 Interacción con Otros Eventos

**Eventos con la misma fecha:**

Si otros eventos tienen la misma fecha de evento que el Evento Fundacional, el Evento Fundacional aparece primero debido a su prioridad de tipo de evento.

**Eventos backdated:**

Si se crean eventos con fechas anteriores a la fecha del Evento Fundacional (backdating), el Evento Fundacional sigue apareciendo primero debido a su prioridad de tipo de evento.

**Nota importante:** En la práctica, la fecha del Evento Fundacional (fecha de creación del ClinicalRecord) es típicamente anterior o igual a cualquier evento clínico, ya que los eventos clínicos requieren que el ClinicalRecord ya exista.

### 5.5 Navegación desde el Evento Fundacional

**Navegación hacia adelante:**

Desde el Evento Fundacional, el usuario puede navegar hacia eventos subsecuentes en el timeline.

**Navegación hacia atrás:**

No hay eventos anteriores al Evento Fundacional, ya que es el primer evento.

**Enlaces a entidades:**

El Evento Fundacional no tiene enlaces a entidades clínicas (Notes, Medications, etc.), ya que no tiene sourceId.

---

## 6. Restricciones Explícitas

### 6.1 No Editable

**Inmutabilidad completa:**

El Evento Fundacional es completamente inmutable una vez creado.

**Atributos inmutables:**

- **event_timestamp:** No puede ser modificado
- **recorded_timestamp:** No puede ser modificado
- **event_type:** No puede ser modificado (siempre "Foundational")
- **title:** No puede ser modificado
- **description:** No puede ser modificado
- **sourceType:** No puede ser modificado
- **sourceId:** No puede ser modificado (siempre null)
- **clinicalRecordId:** No puede ser modificado

**No hay excepciones:**

A diferencia de otros eventos que podrían tener mecanismos de corrección (addenda, versiones), el Evento Fundacional no tiene mecanismos de modificación.

**Justificación:**

El Evento Fundacional representa un hecho histórico: el inicio de la historia clínica documentada. Este hecho no puede cambiar retroactivamente.

### 6.2 No Clínico

**No representa una ocurrencia clínica:**

El Evento Fundacional no representa:
- Un encuentro clínico
- Un cambio de medicación
- Una hospitalización
- Un evento de vida
- Una actualización de historia

**No genera estado clínico:**

El Evento Fundacional no afecta:
- Medicaciones activas
- Historia psiquiátrica actual
- Estado de tratamiento
- Evaluaciones o planes

**No tiene contenido clínico:**

El título y descripción del Evento Fundacional son estándar y definidos por el sistema. No contienen información clínica específica del paciente.

### 6.3 No Genera Estado

**No modifica el estado del sistema:**

El Evento Fundacional es puramente informativo. No:
- Crea medicaciones
- Crea notas
- Modifica historia psiquiátrica
- Cambia estado de tratamiento
- Genera otros eventos

**Es un marcador temporal:**

El Evento Fundacional solo marca el inicio del timeline. No tiene efectos secundarios más allá de su presencia en el timeline.

### 6.4 No Eliminable

**Eliminación prohibida:**

El Evento Fundacional no puede ser eliminado del timeline.

**Justificación:**

- Garantiza que todo ClinicalRecord tenga al menos un evento
- Preserva la integridad histórica del timeline
- Mantiene el punto de origen del timeline

**No hay excepciones:**

Incluso en casos de corrección de datos o migración, el Evento Fundacional no se elimina. Si es necesario corregir información, se crea un nuevo ClinicalRecord (operación no permitida en el MVP, pero conceptualmente).

### 6.5 No Duplicable

**Unicidad garantizada:**

No puede haber múltiples Eventos Fundacionales para el mismo ClinicalRecord.

**Prevención:**

- La creación del Evento Fundacional es idempotente
- Si ya existe un Evento Fundacional, no se crea otro
- El sistema valida la unicidad antes de crear

### 6.6 No Backdateable

**Fecha fija:**

La fecha del Evento Fundacional es la fecha de creación del ClinicalRecord y no puede ser modificada.

**No se permite backdating:**

A diferencia de eventos clínicos que pueden tener fechas en el pasado (backdating), el Evento Fundacional siempre tiene la fecha de creación del ClinicalRecord.

**Justificación:**

El Evento Fundacional marca el inicio de la historia clínica documentada en el sistema, no el inicio de la relación terapéutica en el mundo real. Por lo tanto, su fecha debe reflejar cuándo comenzó la documentación en el sistema.

---

## 7. Consideraciones de UX (Descriptivas)

### 7.1 Presentación Visual

**Apariencia distintiva:**

El Evento Fundacional debe ser visualmente distinguible de los eventos clínicos para comunicar claramente que no es una ocurrencia clínica.

**Indicadores sugeridos:**

- Icono o símbolo distintivo que indique "inicio" o "fundación"
- Estilo visual diferente (por ejemplo, más sutil o con un borde especial)
- Etiqueta o badge que indique "Evento Fundacional" o "Inicio de Historia Clínica"

**No debe confundirse con eventos clínicos:**

La presentación debe evitar que el usuario interprete el Evento Fundacional como un encuentro, medicación, o evento de vida.

### 7.2 Información Mostrada

**Título estándar:**

El título del Evento Fundacional es fijo y definido por el sistema. Ejemplo: "Inicio de Historia Clínica" o "Historia Clínica Iniciada".

**Descripción estándar:**

La descripción es también fija y puede incluir información como: "Este evento marca el inicio formal de la historia clínica documentada del paciente en el sistema."

**Fecha mostrada:**

Se muestra la fecha del evento (fecha de creación del ClinicalRecord).

**No hay detalles adicionales:**

A diferencia de eventos clínicos que pueden tener enlaces a notas o medicaciones, el Evento Fundacional no tiene detalles adicionales para mostrar.

### 7.3 Interacción del Usuario

**Solo lectura:**

El Evento Fundacional es completamente de solo lectura. No hay acciones disponibles:
- No se puede editar
- No se puede eliminar
- No se puede duplicar
- No se puede navegar a entidades relacionadas (no hay entidades relacionadas)

**Click o hover:**

Si el usuario hace click o hover sobre el Evento Fundacional, puede mostrar información contextual explicando qué es y por qué existe, pero no permite modificaciones.

### 7.4 Navegación y Contexto

**Punto de referencia:**

El Evento Fundacional sirve como punto de referencia para navegar el timeline:
- "Desde el inicio" — Navegar desde el Evento Fundacional hacia adelante
- "Hasta el inicio" — Navegar desde cualquier evento hacia el Evento Fundacional

**Contexto temporal:**

El Evento Fundacional proporciona contexto temporal:
- "La historia comenzó el [fecha]"
- "Han pasado X días desde el inicio"
- "Este es el primer evento después del inicio"

### 7.5 Estados Vacíos y Mensajes

**Timeline no vacío:**

Con el Evento Fundacional, el timeline nunca está completamente vacío. Siempre hay al menos un evento.

**Mensajes informativos:**

Si el timeline solo contiene el Evento Fundacional (sin eventos clínicos aún), el sistema puede mostrar un mensaje como: "La historia clínica comenzó el [fecha]. Aún no hay eventos clínicos documentados."

**Guía al usuario:**

El Evento Fundacional puede servir como guía para nuevos usuarios, explicando que este es el punto de inicio y que los eventos clínicos aparecerán después.

### 7.6 Filtros y Búsquedas

**Inclusión en filtros:**

El Evento Fundacional puede ser incluido o excluido de filtros según el contexto:

- **Filtro por tipo de evento:** Si el usuario filtra por "Todos los eventos", el Evento Fundacional se incluye. Si filtra por "Solo encuentros", se excluye.
- **Filtro por rango de fechas:** El Evento Fundacional se incluye si su fecha está dentro del rango.

**Búsqueda de texto:**

El Evento Fundacional puede ser encontrado en búsquedas de texto si el usuario busca términos como "inicio", "fundacional", o el título estándar del evento.

### 7.7 Exportación y Reportes

**Inclusión en exportaciones:**

El Evento Fundacional puede ser incluido o excluido de exportaciones según el propósito:

- **Exportación completa:** Incluye el Evento Fundacional
- **Exportación clínica:** Puede excluir el Evento Fundacional (solo eventos clínicos)

**Reportes:**

En reportes que muestran la historia completa, el Evento Fundacional aparece como el primer elemento, proporcionando contexto temporal.

---

## 8. Casos Fuera de Alcance

### 8.1 Modificación del Evento Fundacional

**Fuera de alcance:**

- Editar la fecha del Evento Fundacional
- Cambiar el título o descripción
- Eliminar el Evento Fundacional
- Duplicar el Evento Fundacional

**Justificación:**

El Evento Fundacional es inmutable por diseño. No hay casos de uso que requieran su modificación.

### 8.2 Evento Fundacional Múltiple

**Fuera de alcance:**

- Crear múltiples Eventos Fundacionales para el mismo ClinicalRecord
- Tener Eventos Fundacionales con diferentes fechas
- Reemplazar un Evento Fundacional con otro

**Justificación:**

La unicidad del Evento Fundacional es una garantía del sistema. No hay casos de uso que requieran múltiples eventos fundacionales.

### 8.3 Evento Fundacional Opcional

**Fuera de alcance:**

- Permitir ClinicalRecords sin Evento Fundacional
- Hacer opcional la creación del Evento Fundacional
- Eliminar el Evento Fundacional en casos especiales

**Justificación:**

El Evento Fundacional es obligatorio. Todo ClinicalRecord debe tener exactamente un Evento Fundacional.

### 8.4 Evento Fundacional con Contenido Clínico

**Fuera de alcance:**

- Permitir que el usuario edite el título o descripción del Evento Fundacional
- Agregar información clínica al Evento Fundacional
- Vincular el Evento Fundacional a una Note o Medication

**Justificación:**

El Evento Fundacional es un marcador del sistema, no un evento clínico. No contiene información clínica específica del paciente.

### 8.5 Evento Fundacional con Fecha Personalizada

**Fuera de alcance:**

- Permitir que el usuario especifique una fecha diferente para el Evento Fundacional
- Backdating del Evento Fundacional a una fecha anterior
- Forward dating del Evento Fundacional a una fecha futura

**Justificación:**

La fecha del Evento Fundacional es la fecha de creación del ClinicalRecord. No hay casos de uso que requieran una fecha diferente.

### 8.6 Evento Fundacional como Evento Clínico

**Fuera de alcance:**

- Tratar el Evento Fundacional como un encuentro clínico
- Incluir el Evento Fundacional en cálculos de estado clínico
- Usar el Evento Fundacional para determinar medicaciones activas o historia actual

**Justificación:**

El Evento Fundacional no es un evento clínico. No genera estado clínico ni afecta el estado del paciente.

### 8.7 Migración de Eventos Fundacionales

**Fuera de alcance:**

- Crear Eventos Fundacionales para ClinicalRecords existentes que no los tienen
- Migrar Eventos Fundacionales desde otros sistemas
- Corregir Eventos Fundacionales creados incorrectamente

**Justificación:**

Estas operaciones son de migración o corrección de datos, fuera del alcance funcional del MVP. Se manejarían como operaciones administrativas especiales, no como funcionalidad del sistema.

### 8.8 Evento Fundacional y Eliminación de ClinicalRecord

**Fuera de alcance:**

- Comportamiento del Evento Fundacional cuando se elimina un ClinicalRecord (operación no permitida en el MVP)
- Cascading delete del Evento Fundacional
- Preservación del Evento Fundacional después de eliminar el ClinicalRecord

**Justificación:**

La eliminación de ClinicalRecords no está permitida en el MVP. Este caso está fuera del alcance funcional.

### 8.9 Evento Fundacional y Duplicación de Pacientes

**Fuera de alcance:**

- Comportamiento del Evento Fundacional al duplicar un paciente
- Copiar el Evento Fundacional a un nuevo ClinicalRecord
- Preservar la fecha original del Evento Fundacional en una duplicación

**Justificación:**

La duplicación de pacientes no está en el alcance del MVP. Este caso está fuera del alcance funcional.

### 8.10 Evento Fundacional y Sincronización

**Fuera de alcance:**

- Sincronización del Evento Fundacional entre dispositivos
- Resolución de conflictos del Evento Fundacional en sistemas multi-usuario
- Replicación del Evento Fundacional en sistemas distribuidos

**Justificación:**

El MVP asume un solo usuario y un solo dispositivo. La sincronización está fuera del alcance.

---

## 9. Invariantes del Timeline

### 9.1 Invariante: Append-Only

**Garantía:**

El timeline solo crece; nunca se reduce.

**Aplicación al Evento Fundacional:**

- El Evento Fundacional se crea una vez y nunca se elimina
- No hay operación que reduzca el timeline eliminando el Evento Fundacional
- El timeline siempre contiene al menos el Evento Fundacional

**Verificación:**

El sistema garantiza que el Evento Fundacional existe y no puede ser eliminado, preservando el invariante append-only.

### 9.2 Invariante: Inmutabilidad

**Garantía:**

Los eventos son inmutables una vez creados.

**Aplicación al Evento Fundacional:**

- Todos los atributos del Evento Fundacional son inmutables
- No hay mecanismo de corrección o modificación
- El Evento Fundacional preserva su estado original permanentemente

**Verificación:**

El sistema no permite ninguna operación de modificación sobre el Evento Fundacional, preservando el invariante de inmutabilidad.

### 9.3 Invariante: Orden Determinista

**Garantía:**

El orden del timeline es determinista y estable.

**Aplicación al Evento Fundacional:**

- El Evento Fundacional siempre aparece en la primera posición
- El orden relativo del Evento Fundacional con respecto a otros eventos es estable
- Múltiples consultas del timeline producen el mismo orden

**Verificación:**

El sistema garantiza que el Evento Fundacional tiene la prioridad de tipo de evento más alta y siempre aparece primero, preservando el invariante de orden determinista.

### 9.4 Invariante: Completitud

**Garantía:**

Todo ClinicalRecord tiene al menos un evento en su timeline.

**Aplicación al Evento Fundacional:**

- Todo ClinicalRecord tiene exactamente un Evento Fundacional
- El Evento Fundacional garantiza que el timeline nunca está vacío
- No hay ClinicalRecords sin eventos

**Verificación:**

El sistema garantiza que la creación del ClinicalRecord siempre crea el Evento Fundacional, preservando el invariante de completitud.

---

## 10. Resumen

### 10.1 Características Clave

El Evento Fundacional de Timeline es:

1. **Obligatorio** — Todo ClinicalRecord tiene exactamente un Evento Fundacional
2. **Inmutable** — Una vez creado, no puede ser modificado ni eliminado
3. **No clínico** — No representa una ocurrencia clínica ni genera estado clínico
4. **Primero** — Siempre ocupa la primera posición en el timeline
5. **Automático** — Se crea automáticamente con el ClinicalRecord
6. **Sistema** — Generado por el sistema, no por el usuario

### 10.2 Propósito Funcional

El Evento Fundacional:

- Marca el inicio formal de la historia clínica documentada
- Proporciona un punto de referencia temporal absoluto
- Garantiza que el timeline nunca está vacío
- Establece el contexto inicial para la navegación del timeline

### 10.3 Restricciones Fundamentales

El Evento Fundacional:

- **NO** es editable
- **NO** es eliminable
- **NO** es clínico
- **NO** genera estado
- **NO** tiene fuente clínica
- **NO** puede ser duplicado

### 10.4 Consistencia con Documentos Existentes

Esta especificación es consistente con:

- **01_specs.md** — No introduce nuevas entidades clínicas
- **03_timeline.md** — Respeta las reglas de ordenamiento e inmutabilidad
- **13_timeline_engine.md** — Sigue los invariantes del Timeline Engine
- **18_patient_crud_specs.md** — Mantiene la separación entre dominio administrativo (Patient) y dominio clínico (ClinicalRecord)

El Evento Fundacional no viola ningún invariante existente y se integra naturalmente con el sistema de timeline actual.

---

*Versión del Documento: 1.0*  
*Estado: Final*  
*Depende De: 01_specs.md, 03_timeline.md, 13_timeline_engine.md, 18_patient_crud_specs.md*  
*Consumido Por: Backend Implementation, Timeline Engine Implementation, UX Implementation, QA Testing*
