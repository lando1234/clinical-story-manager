# Sistema de Historias Clínicas Psiquiátricas — Especificación Funcional del Root del Sistema

## Resumen Ejecutivo

Este documento define el comportamiento funcional del punto de entrada raíz del sistema (`/`) y su relación con la lista de pacientes.

El root del sistema actúa como punto de entrada operativo que presenta la lista de pacientes junto con información estadística y operativa de contexto, manteniendo al paciente como eje central del flujo. El root proporciona una vista de situación general del consultorio que facilita decisiones organizativas diarias, sin constituir un dashboard clínico ni mostrar información clínica sensible.

Esta especificación define **QUÉ** debe ocurrir cuando el usuario accede al root, sin describir implementación técnica ni detalles de routing.

**Nota:** Esta especificación actualiza la versión anterior que definía el root como un simple mecanismo de redirección. La actualización incorpora información estadística y operativa manteniendo los principios arquitectónicos fundamentales del sistema.

---

## 1. Propósito del Root del Sistema

### 1.1 Rol como Punto de Entrada

El root del sistema (`/`) es el punto de entrada principal cuando un usuario accede a la aplicación.

El root existe para:

- **Facilitar el acceso inmediato a la lista de pacientes** — Reducir la fricción entre el inicio de sesión y el inicio del trabajo clínico
- **Establecer el contexto clínico** — Orientar al usuario hacia la selección de un paciente como primer paso en cualquier flujo clínico
- **Reflejar la organización del sistema** — Manifestar que el sistema se estructura alrededor del paciente como entidad central
- **Proporcionar contexto operativo** — Ofrecer información estadística y operativa que facilite la orientación diaria del consultorio
- **Facilitar decisiones organizativas** — Presentar información de situación general que apoye la planificación operativa diaria

### 1.2 Propósito Ampliado del Root

El root del sistema cumple un propósito ampliado como:

- **Punto de entrada operativo del sistema** — Primera vista funcional que el usuario encuentra al acceder a la aplicación
- **Vista de situación general del consultorio / práctica** — Presenta información agregada que refleja el estado operativo general
- **Facilitador de decisiones organizativas diarias** — Proporciona contexto que ayuda al clínico a orientarse en su jornada de trabajo

**Principio de Centralidad:** A pesar de su propósito ampliado, el root mantiene al paciente como eje central. Toda la información presentada está orientada a facilitar el acceso y la selección de pacientes, no a proporcionar análisis clínicos o métricas de desempeño.

### 1.3 Relación con el Flujo Clínico Diario

En el flujo clínico diario típico:

1. El clínico inicia la aplicación
2. El clínico necesita acceder a un paciente específico
3. El clínico busca o selecciona el paciente de la lista
4. El clínico accede al registro clínico del paciente

El root del sistema debe optimizar este flujo eliminando pasos intermedios innecesarios y llevando directamente al clínico a la lista de pacientes.

**Principio:** El root no debe interponerse entre el usuario y su objetivo primario (acceder a un paciente).

---

## 2. Definición de la Vista Raíz

### 2.1 Qué Representa `/`

El root (`/`) representa:

- **Un punto de entrada funcional** — Vista operativa que presenta la lista de pacientes junto con información de contexto
- **Una vista de situación general** — Muestra información estadística y operativa que orienta al usuario sobre el estado del consultorio
- **Un facilitador de acceso** — Reduce la distancia entre el inicio de la aplicación y el inicio del trabajo clínico
- **Un organizador de flujo** — Estructura la información de manera que el paciente siga siendo el elemento principal

### 2.2 Qué NO Representa

El root **NO** representa:

- **Un dashboard clínico** — No muestra resúmenes clínicos, evaluaciones, diagnósticos, o interpretaciones de datos clínicos
- **Un análisis de métricas clínicas** — No presenta estadísticas que requieran interpretación clínica o evaluación de desempeño
- **Una pantalla de bienvenida** — No muestra mensajes de bienvenida, instrucciones, o contenido informativo educativo
- **Una vista de configuración** — No expone opciones de sistema, preferencias, o configuraciones
- **Un punto de decisión complejo** — No requiere que el usuario elija entre múltiples rutas o funcionalidades

**Principio de Exclusión:** El root no muestra información clínica sensible, no genera eventos, y no permite acciones que modifiquen el estado clínico de los pacientes.

### 2.3 Estructura Conceptual del Root

El root se organiza conceptualmente en áreas funcionales:

- **Área de Lista de Pacientes** — Contiene el listado completo de pacientes, que sigue siendo el elemento principal de la vista
- **Área de Información Estadística y Operativa** — Contiene métricas operativas y contexto que facilitan la orientación diaria

**Nota:** Esta especificación define las áreas conceptuales y su propósito, no el layout visual concreto ni la implementación técnica de la interfaz.

### 2.4 Estado del Root

El root requiere datos operativos para mostrar información estadística:

- **Requiere datos de pacientes** — Necesita acceso a la entidad Patient para calcular estadísticas
- **Requiere datos de turnos** — Necesita acceso a la entidad Appointment para mostrar turnos próximos
- **No depende de autenticación** — Asume que el acceso al root implica acceso autorizado (la gestión de autenticación está fuera del alcance de esta especificación)
- **No almacena preferencias** — No recuerda elecciones previas del usuario o configuraciones de sesión
- **No tiene lógica condicional compleja** — Su comportamiento es predecible aunque los datos mostrados varíen según el estado del sistema

**Garantía:** El comportamiento del root es determinístico y predecible. La información mostrada refleja el estado actual del sistema en el momento de la carga.

---

## 3. Comportamiento Esperado

### 3.1 Presentación de la Vista del Root

Cuando un usuario accede al root (`/`), el sistema debe presentar una vista que incluye:

1. **Lista de pacientes** — El elemento principal de la vista, accesible y funcional
2. **Información estadística operativa** — Métricas de contexto que facilitan la orientación diaria
3. **Información de turnos próximos** — Recorte temporal de turnos agendados para los próximos 7 días

**Comportamiento específico:**

| Acción del Usuario | Comportamiento del Sistema |
|-------------------|---------------------------|
| Acceso inicial al root (`/`) | Presentación de la vista completa con lista de pacientes y estadísticas |
| Refresh en el root (`/`) | Recarga de la vista completa con datos actualizados |
| Navegación directa por URL al root (`/`) | Presentación de la vista completa |
| Navegación desde otra vista hacia el root (`/`) | Presentación de la vista completa |

**Principio de Consistencia:** El comportamiento del root es idéntico independientemente de cómo se acceda a él.

### 3.2 Características de la Vista

La vista del root debe cumplir con las siguientes características:

| Característica | Requisito |
|---------------|-----------|
| **Inmediatez** | La vista se carga sin demora perceptible |
| **Completitud** | Presenta todos los elementos definidos (lista de pacientes y estadísticas) |
| **Consistencia** | El comportamiento es idéntico en todos los escenarios de acceso |
| **Claridad** | La lista de pacientes es claramente identificable como elemento principal |

### 3.3 Comportamiento en Primera Carga

Cuando el usuario accede al sistema por primera vez en una sesión:

1. El usuario accede al root (`/`)
2. El sistema presenta la vista completa con lista de pacientes y estadísticas
3. El usuario ve la lista de pacientes (que puede estar vacía si no hay pacientes registrados) junto con las estadísticas correspondientes

**La vista es funcional inmediatamente, sin pasos intermedios.**

### 3.4 Comportamiento en Refresh

Cuando el usuario realiza un refresh (recarga de página) mientras está en el root (`/`):

1. El sistema detecta que está en el root
2. El sistema recarga la vista completa con datos actualizados
3. El usuario ve la lista de pacientes actualizada junto con estadísticas actualizadas

**El refresh actualiza todos los datos mostrados en la vista.**

### 3.5 Comportamiento en Navegación Directa por URL

Cuando el usuario navega directamente al root usando la URL (`/`):

1. El sistema procesa la solicitud del root
2. El sistema presenta la vista completa
3. El usuario ve la lista de pacientes junto con las estadísticas

**La URL del root permanece visible en la barra de direcciones, reflejando que es una vista funcional.**

---

## 4. Relación con la Lista de Pacientes

### 4.1 La Lista de Pacientes como Vista Primaria

La lista de pacientes es la vista primaria del sistema después del root.

**Características de la lista de pacientes como vista primaria:**

| Aspecto | Descripción |
|---------|-------------|
| **Accesibilidad** | Es la primera vista funcional que el usuario encuentra |
| **Centralidad** | Es el punto desde el cual se accede a todos los registros clínicos |
| **Completitud** | Contiene toda la información necesaria para seleccionar un paciente |
| **Autosuficiencia** | No requiere contexto previo para ser útil |

### 4.2 Rol en la Selección de Contexto Clínico

La lista de pacientes es el mecanismo principal para establecer el contexto clínico:

1. **El usuario selecciona un paciente** de la lista
2. **El sistema establece el contexto clínico** para ese paciente
3. **El usuario accede al registro clínico** del paciente seleccionado

El root facilita este flujo llevando directamente al usuario a la lista de pacientes, eliminando pasos innecesarios.

### 4.3 Integración con el Flujo Clínico

El root y la lista de pacientes forman parte de un flujo integrado:

```
Root (`/`) 
  → Redirección automática
    → Lista de Pacientes
      → Selección de Paciente
        → Registro Clínico del Paciente
```

**Principio de Flujo:** El root es el punto de partida de un flujo que conduce naturalmente al trabajo clínico.

### 4.4 Estado de la Lista de Pacientes

La lista de pacientes que se muestra en el root debe:

- **Mostrar todos los pacientes disponibles** (según los criterios de búsqueda y filtrado definidos en las especificaciones de Patient CRUD)
- **Mantener el estado de búsqueda por defecto** (si existe un estado por defecto definido)
- **No requerir interacción previa** — La lista está lista para usar inmediatamente

**Nota:** Los detalles específicos de cómo se muestra la lista de pacientes (ordenamiento, filtros, paginación) están definidos en las especificaciones de Patient CRUD y están fuera del alcance de este documento.

---

## 5. Información Estadística y Operativa en el Root

### 5.1 Propósito de las Estadísticas

Las estadísticas mostradas en el root tienen un propósito exclusivamente operativo e informativo:

- **Proporcionar contexto general** — Ofrecer una visión de situación del consultorio
- **Facilitar orientación diaria** — Ayudar al clínico a entender rápidamente el estado operativo
- **Apoyar decisiones organizativas** — Proporcionar información que facilite la planificación diaria

**Principio de No Interpretación:** Las estadísticas son informativas y no requieren interpretación clínica. No generan eventos, no modifican estado clínico, y no permiten acciones sobre pacientes.

### 5.2 Estadística: Cantidad de Pacientes

#### 5.2.1 Qué Representa la Métrica

La métrica de cantidad de pacientes representa el número total de pacientes registrados en el sistema, segmentado por estado operativo.

**Fuente de datos:** Entidad `Patient` del modelo de dominio.

#### 5.2.2 Segmentación de la Métrica

La métrica debe presentar al menos las siguientes segmentaciones:

- **Pacientes activos** — Pacientes con `status = Active`
- **Pacientes inactivos** — Pacientes con `status = Inactive`

**Nota:** La especificación no define el formato visual de presentación, solo el contenido conceptual que debe mostrarse.

#### 5.2.3 Uso Exclusivo de la Métrica

La métrica de cantidad de pacientes tiene uso exclusivo para:

- **Contexto general** — Proporcionar información sobre el volumen de pacientes en el sistema
- **Orientación operativa** — Ayudar al clínico a entender la escala de su práctica

**Restricciones explícitas:**

- **No genera eventos** — La visualización de esta métrica no crea ningún evento en el sistema
- **No es interactiva clínicamente** — No permite acciones que modifiquen el estado clínico de pacientes
- **No permite acciones sobre pacientes** — No proporciona mecanismos para crear, editar, o eliminar pacientes desde la métrica misma
- **No es evaluativa** — No proporciona análisis de desempeño ni métricas de calidad clínica

#### 5.2.4 Actualización de la Métrica

La métrica se actualiza:

- **Al cargar la vista** — Refleja el estado actual del sistema en el momento de la carga
- **Al refrescar la página** — Se recalcula con los datos más recientes
- **No en tiempo real** — No se actualiza automáticamente sin recarga de la vista

### 5.3 Estadística Operativa: Turnos Próximos 7 Días

#### 5.3.1 Qué Representa esta Sección

La sección de turnos próximos representa un recorte temporal de la agenda que muestra los turnos agendados para los próximos 7 días calendario desde la fecha actual.

**Propósito:** Facilitar el acceso rápido a pacientes con turnos programados en el corto plazo, mejorando la orientación diaria del clínico.

#### 5.3.2 Horizonte Temporal

**Horizonte fijo:** Los próximos 7 días calendario desde la fecha actual.

**Criterios de inclusión:**

- Turnos con `scheduledDate` dentro del rango de los próximos 7 días
- Turnos con `status = Scheduled` (turnos programados, no completados ni cancelados)
- Ordenados cronológicamente por fecha y hora

**Nota:** La especificación no define el comportamiento para turnos que cruzan el límite de 7 días, ni el manejo de zonas horarias. Estos detalles quedan para la implementación técnica.

#### 5.3.3 Relación con la Agenda

La información de turnos próximos:

- **No reemplaza la agenda completa** — Es un recorte operativo, no la vista completa de agenda
- **No pertenece a la timeline** — Los turnos futuros no son eventos clínicos y no aparecen en la timeline del paciente
- **No genera eventos** — La visualización de turnos próximos no crea eventos clínicos
- **Es informativa** — Proporciona contexto operativo, no documentación clínica

**Relación con Appointment:** La información proviene de la entidad `Appointment`, pero su presentación en el root es operativa, no clínica.

#### 5.3.4 Contenido Mínimo por Turno

Cada turno mostrado en la sección debe incluir al menos:

- **Fecha** — Fecha programada del turno (`scheduledDate`)
- **Hora** — Hora programada del turno (`scheduledTime`), si está disponible
- **Identificación del paciente** — Información suficiente para identificar al paciente (nombre completo como mínimo)

**Nota:** La especificación no define el formato visual ni los campos adicionales que pueden mostrarse (tipo de turno, duración, etc.). Estos detalles quedan para la implementación.

#### 5.3.5 Regla Clave: Acceso a Historia Clínica desde Turnos

**Regla fundamental:** Desde cada turno mostrado en la sección de turnos próximos, debe ser posible acceder a la historia clínica del paciente correspondiente.

**Características del acceso:**

- **Por navegación** — El acceso se realiza mediante navegación hacia la vista del paciente, no mediante duplicación de datos
- **Desde la identidad del paciente** — El acceso se hace siempre desde la identidad del paciente, nunca desde una métrica agregada
- **No duplica información** — La información del turno en el root es un punto de entrada, no una vista completa de datos del paciente

**Principio de Centralidad:** El acceso a la historia clínica siempre se realiza desde la identidad del paciente, manteniendo el principio arquitectónico de que el sistema se organiza alrededor del paciente.

### 5.4 Relación con Agenda y Timeline

#### 5.4.1 Diferenciación con Timeline

La información de turnos en el root:

- **No pertenece a la timeline** — Los turnos futuros no son eventos clínicos y no aparecen en la timeline del paciente
- **No genera eventos** — La visualización de turnos próximos no crea eventos de tipo `ClinicalEvent`
- **Es operativa, no clínica** — Su propósito es facilitar la organización diaria, no documentar hechos clínicos

**Referencia:** Ver `docs/23_encounter_appointment_spec.md` para la definición de eventos Encounter y su relación con turnos pasados.

#### 5.4.2 Diferenciación con Agenda Completa

El root solo muestra un recorte temporal y operativo:

- **No es la agenda completa** — Muestra solo los próximos 7 días, no toda la agenda
- **No reemplaza la funcionalidad de agenda** — La agenda completa (si existe) sigue siendo la fuente de verdad para gestión de turnos
- **Es un resumen operativo** — Proporciona contexto rápido, no gestión completa de turnos

**Principio:** El root facilita el acceso rápido a información operativa, pero no reemplaza las vistas especializadas de agenda o timeline.

---

## 6. Reglas Explícitas

### 6.1 El Root No Debe Mostrar Información Clínica Sensible

**Regla:** El root nunca debe mostrar información clínica sensible de ningún tipo.

| Tipo de Información | ¿Permitido en Root? |
|---------------------|---------------------|
| Información clínica de pacientes (notas, diagnósticos, evaluaciones) | No |
| Resúmenes clínicos | No |
| Eventos NOTE | No |
| Eventos Encounter (de turnos pasados) | No |
| Contenido de notas clínicas | No |
| Medicamentos o tratamientos | No |
| Historial psiquiátrico | No |
| Cualquier dato clínico sensible | No |

**Justificación:** El root es una vista operativa que facilita el acceso a pacientes, no una vista de documentación clínica. La información clínica solo debe mostrarse en el contexto de la historia clínica del paciente.

### 6.1.1 Información Permitida en el Root

El root puede mostrar:

| Tipo de Información | ¿Permitido en Root? | Justificación |
|---------------------|---------------------|---------------|
| Lista de pacientes (identidad y datos administrativos) | Sí | Es el elemento principal del root |
| Cantidad de pacientes (estadística agregada) | Sí | Es información operativa, no clínica |
| Turnos próximos (fecha, hora, identificación de paciente) | Sí | Es información operativa de agenda |
| Datos administrativos de pacientes (nombre, contacto) | Sí | Son necesarios para identificar y acceder a pacientes |

**Principio:** El root muestra información necesaria para la operación diaria y el acceso a pacientes, pero no información que requiera interpretación clínica.

### 6.2 El Root No Debe Requerir Interacción para Funcionar

**Regla:** El root no debe requerir interacción del usuario para mostrar su contenido básico.

| Tipo de Interacción | ¿Permitida? | Justificación |
|---------------------|-------------|---------------|
| Clic en botón para continuar | No | La vista debe mostrarse automáticamente |
| Selección de opción para ver contenido | No | El contenido debe estar disponible inmediatamente |
| Confirmación de acción para acceder | No | El acceso debe ser directo |
| Introducción de datos para ver información | No | La información debe mostrarse sin requisitos previos |
| Interacción para acceder a pacientes desde la lista | Sí | La selección de pacientes es parte del flujo normal |
| Interacción para acceder a historia clínica desde turnos | Sí | La navegación hacia pacientes es funcionalidad esperada |

**Justificación:** El root debe ser funcional inmediatamente, pero la interacción para acceder a pacientes es parte del flujo esperado.

### 6.3 El Root No Debe Mantener Estado Persistente

**Regla:** El root no mantiene estado persistente de preferencias o configuraciones del usuario.

| Tipo de Estado | ¿Permitido? | Justificación |
|----------------|-------------|---------------|
| Estado de sesión | Sí (asume acceso autorizado) | Necesario para autenticación |
| Estado de preferencias de visualización | No | Las estadísticas no son configurables |
| Estado de navegación previa | No | El root no depende de navegación previa |
| Estado de datos en caché (temporal) | Sí | Puede usar caché para optimización, pero no persistente |
| Estado persistente de configuración | No | No hay configuración de métricas |

**Justificación:** El root debe funcionar de manera consistente. Las estadísticas mostradas no son configurables por el usuario.

### 6.4 El Root No Debe Generar Eventos Clínicos

**Regla:** El root no genera eventos clínicos ni modifica el estado clínico de pacientes.

| Tipo de Acción | ¿Permitida? | Justificación |
|----------------|-------------|---------------|
| Consultas a base de datos para estadísticas | Sí | Necesario para mostrar información |
| Cálculos de métricas agregadas | Sí | Necesario para estadísticas operativas |
| Generación de eventos NOTE | No | El root no documenta encuentros clínicos |
| Generación de eventos Encounter | No | El root no crea eventos de timeline |
| Modificación de estado clínico | No | El root es de solo lectura clínica |
| Acciones destructivas sobre pacientes | No | El root no permite eliminación o modificación desde estadísticas |

**Justificación:** El root es una vista informativa y operativa. Toda la información mostrada es de solo lectura desde la perspectiva clínica.

### 6.5 El Root Debe Ser Consistente

**Regla:** El comportamiento del root debe ser idéntico en todos los escenarios.

| Escenario | Comportamiento Esperado |
|-----------|------------------------|
| Primera carga | Presentación de vista completa con lista de pacientes y estadísticas |
| Refresh | Recarga de vista completa con datos actualizados |
| Navegación directa | Presentación de vista completa |
| Navegación desde otra vista | Presentación de vista completa |
| Con pacientes en el sistema | Vista completa con lista de pacientes y estadísticas pobladas |
| Sin pacientes en el sistema | Vista completa con lista vacía y estadísticas en cero |
| Con turnos próximos | Vista completa con sección de turnos poblada |
| Sin turnos próximos | Vista completa con sección de turnos vacía |

**Justificación:** La consistencia reduce la confusión y mejora la experiencia del usuario.

### 6.6 Reglas Adicionales sobre Estadísticas

**Regla:** Las estadísticas en el root deben cumplir con las siguientes restricciones:

| Restricción | Descripción |
|-------------|-------------|
| **No son configurables** | El usuario no puede configurar qué métricas mostrar ni cómo calcularlas |
| **No son exportables** | Las estadísticas no pueden exportarse como reportes o análisis |
| **No generan eventos** | La visualización de estadísticas no crea eventos en el sistema |
| **No permiten acciones destructivas** | No hay acciones de eliminación o modificación masiva desde las estadísticas |
| **No muestran métricas clínicas** | Solo muestran información operativa, no evaluaciones clínicas |

**Justificación:** Las estadísticas son informativas y operativas, no herramientas de análisis o gestión clínica.

---

## 7. Impacto en UX

### 7.1 Reducción de Fricción

El comportamiento del root reduce la fricción en el flujo del usuario:

| Aspecto | Impacto |
|---------|---------|
| **Acceso inmediato a lista de pacientes** | El usuario accede directamente a la funcionalidad principal |
| **Contexto operativo disponible** | La información estadística facilita la orientación diaria sin navegación adicional |
| **Acceso rápido a pacientes próximos** | Los turnos próximos permiten acceso directo a pacientes relevantes |
| **Claridad de propósito** | El usuario entiende inmediatamente que debe seleccionar un paciente |

### 7.2 Claridad de Flujo

El comportamiento del root proporciona claridad en el flujo de la aplicación:

| Aspecto | Beneficio |
|---------|-----------|
| **Flujo predecible** | El usuario sabe qué esperar al acceder al root |
| **Orientación clara** | El sistema guía al usuario hacia el siguiente paso lógico (selección de paciente) |
| **Eliminación de ambigüedad** | No hay confusión sobre qué hacer después de acceder al root |
| **Coherencia con el modelo mental** | El comportamiento refleja que el sistema se organiza alrededor del paciente |

### 7.3 Mejora de Orientación Diaria

El root ampliado mejora la orientación diaria del clínico:

| Aspecto | Beneficio |
|---------|-----------|
| **Vista de situación general** | El clínico obtiene rápidamente una visión del estado operativo del consultorio |
| **Acceso rápido a pacientes próximos** | Los turnos próximos facilitan la preparación para encuentros inminentes |
| **Reducción de navegación innecesaria** | La información operativa está disponible sin necesidad de navegar a otras vistas |
| **Contexto para decisiones organizativas** | Las estadísticas proporcionan contexto que apoya la planificación diaria |

### 7.4 Evitar Pantallas "Vacías" o Ambiguas

El comportamiento del root evita problemas comunes de UX:

| Problema Evitado | Cómo se Evita |
|------------------|---------------|
| **Pantalla vacía** | La vista presenta contenido funcional inmediatamente (lista de pacientes y estadísticas) |
| **Ambiguidad sobre qué hacer** | La lista de pacientes es claramente el elemento principal y guía la acción |
| **Sensación de "pantalla de carga"** | La vista se carga con contenido funcional, no hay espera perceptible |
| **Confusión sobre el propósito** | El comportamiento es claro: facilitar el acceso a pacientes con contexto operativo |

### 7.5 Experiencia de Primera Impresión

El comportamiento del root contribuye a una experiencia de primera impresión positiva:

| Aspecto | Contribución |
|---------|--------------|
| **Inmediatez** | El usuario accede rápidamente a la funcionalidad principal |
| **Profesionalismo** | El comportamiento pulido transmite calidad |
| **Eficiencia** | El usuario percibe que el sistema está optimizado para su flujo de trabajo |
| **Enfoque** | El sistema se presenta como una herramienta clínica centrada en el paciente |

---

## 8. Casos Fuera de Alcance

### 8.1 Dashboards Clínicos

**Fuera de alcance:** El root no debe mostrar dashboards con análisis clínicos o métricas de desempeño clínico.

| Tipo de Dashboard | ¿Permitido? |
|-------------------|-------------|
| Análisis de diagnósticos | No |
| Métricas de tratamiento | No |
| Estadísticas clínicas interpretativas | No |
| Evaluaciones de resultados clínicos | No |
| Gráficos de evolución clínica | No |

**Justificación:** El root es operativo, no analítico. Las métricas mostradas son informativas y operativas, no interpretativas ni clínicas.

### 8.2 Métricas de Desempeño Clínico

**Fuera de alcance:** El root no debe mostrar métricas que requieran interpretación clínica o evaluación de desempeño.

| Tipo de Métrica | ¿Permitida? |
|-----------------|-------------|
| Tasa de éxito de tratamientos | No |
| Métricas de adherencia | No |
| Estadísticas de diagnósticos | No |
| Análisis de evolución clínica | No |
| Cualquier métrica que requiera interpretación clínica | No |

**Justificación:** Las métricas en el root son operativas (cantidad de pacientes, turnos próximos), no evaluativas ni clínicas.

### 8.3 Análisis Históricos

**Fuera de alcance:** El root no debe mostrar análisis históricos ni tendencias temporales.

| Tipo de Análisis | ¿Permitido? |
|------------------|-------------|
| Tendencias de pacientes a lo largo del tiempo | No |
| Análisis de evolución histórica | No |
| Comparativas temporales | No |
| Reportes históricos | No |

**Justificación:** El root muestra información del estado actual, no análisis históricos ni comparativas temporales.

### 8.4 Métricas Exportables

**Fuera de alcance:** El root no debe proporcionar funcionalidad de exportación de estadísticas.

| Tipo de Exportación | ¿Permitida? |
|---------------------|-------------|
| Exportación de métricas a reportes | No |
| Generación de reportes estadísticos | No |
| Exportación de datos para análisis externo | No |
| Compartir estadísticas | No |

**Justificación:** Las estadísticas en el root son informativas y operativas, no herramientas de reporte o análisis.

### 8.5 Filtros Avanzados

**Fuera de alcance:** El root no debe proporcionar filtros avanzados para las estadísticas.

| Tipo de Filtro | ¿Permitido? |
|----------------|-------------|
| Filtros configurables por el usuario | No |
| Filtros temporales avanzados | No |
| Filtros por criterios clínicos | No |
| Filtros personalizados | No |

**Justificación:** Las estadísticas en el root son fijas y operativas, no configurables ni filtrables por el usuario.

### 8.6 Configuración de Métricas

**Fuera de alcance:** El root no debe permitir configuración de qué métricas mostrar o cómo calcularlas.

| Tipo de Configuración | ¿Permitida? |
|----------------------|-------------|
| Selección de métricas a mostrar | No |
| Configuración de cálculos | No |
| Personalización de estadísticas | No |
| Ajustes de presentación de métricas | No |

**Justificación:** Las estadísticas en el root son fijas y no configurables. Su propósito es proporcionar contexto operativo estándar.

### 8.7 Configuración del Sistema

**Fuera de alcance:** El root no debe proporcionar acceso a configuración del sistema.

| Tipo de Configuración | ¿Permitida? |
|----------------------|-------------|
| Preferencias de usuario | No |
| Configuración de la aplicación | No |
| Ajustes del sistema | No |
| Opciones administrativas | No |

**Justificación:** La configuración no es parte del flujo clínico diario y debe estar en una sección dedicada.

### 8.8 Información de Bienvenida o Tutoriales

**Fuera de alcance:** El root no debe mostrar información de bienvenida o tutoriales.

| Tipo de Contenido | ¿Permitido? |
|-------------------|-------------|
| Mensajes de bienvenida | No |
| Tutoriales interactivos | No |
| Guías de uso | No |
| Información de ayuda | No |

**Justificación:** El root debe ser funcional, no educativo. Los tutoriales deben estar en secciones dedicadas.

### 8.9 Notificaciones o Alertas

**Fuera de alcance:** El root no debe mostrar notificaciones o alertas del sistema.

| Tipo de Notificación | ¿Permitida? |
|---------------------|-------------|
| Alertas clínicas | No |
| Notificaciones del sistema | No |
| Recordatorios | No |
| Mensajes informativos | No |

**Justificación:** Las notificaciones deben estar integradas en las vistas funcionales relevantes, no en el root.

---

## 9. Relación con Otras Especificaciones

### 9.1 Dependencias

Esta especificación depende de:

- **`18_patient_crud_specs.md`** — Define el comportamiento de la lista de pacientes que es el elemento principal del root
- **`01_specs.md`** — Define el propósito general del sistema y el principio de organización alrededor del paciente
- **`02_domain.md`** — Define el modelo de dominio, la centralidad del paciente, y la entidad Appointment
- **`23_encounter_appointment_spec.md`** — Define la relación entre turnos (Appointments) y eventos Encounter, y establece que turnos futuros no aparecen en timeline

### 9.2 Consumidores

Esta especificación es consumida por:

- **Implementación de Frontend** — Define el comportamiento del componente/vista del root
- **Implementación de Routing** — Define cómo debe manejarse la ruta raíz
- **Diseño de UX** — Define las expectativas de experiencia del usuario en el root
- **QA Testing** — Define los casos de prueba para validar el comportamiento del root

### 9.3 Integración con Otras Funcionalidades

El root se integra con:

| Funcionalidad | Punto de Integración |
|---------------|---------------------|
| **Lista de Pacientes** | El root presenta la lista de pacientes como elemento principal |
| **Búsqueda de Pacientes** | La lista de pacientes incluye funcionalidad de búsqueda (definida en Patient CRUD) |
| **Registro Clínico** | El flujo continúa desde la lista de pacientes hacia el registro clínico del paciente seleccionado |
| **Agenda de Turnos** | El root muestra un recorte de turnos próximos, relacionado con la agenda completa (si existe) |
| **Entidad Patient** | El root consulta la entidad Patient para calcular estadísticas de cantidad de pacientes |
| **Entidad Appointment** | El root consulta la entidad Appointment para mostrar turnos próximos |

---

## 10. Garantías Funcionales

### 10.1 Garantías de Comportamiento

El sistema garantiza que:

| Garantía | Descripción |
|----------|-------------|
| **Vista Completa Inmediata** | El acceso al root siempre resulta en presentación inmediata de la vista completa con lista de pacientes y estadísticas |
| **Consistencia** | El comportamiento es idéntico en todos los escenarios de acceso |
| **Previsibilidad** | El usuario siempre sabe qué esperar al acceder al root |
| **Centralidad del Paciente** | La lista de pacientes siempre es el elemento principal de la vista |

### 10.2 Garantías de No Comportamiento

El sistema garantiza que el root:

| Garantía | Descripción |
|----------|-------------|
| **No muestra contenido clínico sensible** | Nunca presenta información clínica de pacientes (notas, diagnósticos, evaluaciones) |
| **No muestra eventos NOTE ni Encounter** | Nunca presenta eventos clínicos en el root |
| **No genera eventos** | Nunca crea eventos clínicos al mostrar estadísticas o turnos |
| **No modifica estado clínico** | Nunca altera el estado clínico de pacientes |
| **No permite acciones destructivas** | Nunca permite eliminación o modificación masiva desde las estadísticas |
| **No es configurable** | Las estadísticas mostradas no son configurables por el usuario |

---

## 11. Resumen

### 11.1 Comportamiento del Root

El root del sistema (`/`) es un punto de entrada operativo que presenta la lista de pacientes junto con información estadística y operativa de contexto.

**Características principales:**

1. **Vista funcional completa** — El acceso al root siempre resulta en presentación inmediata de la vista completa con lista de pacientes y estadísticas
2. **Lista de pacientes como elemento principal** — La lista de pacientes sigue siendo el elemento central de la vista
3. **Información estadística operativa** — Muestra métricas de contexto (cantidad de pacientes, turnos próximos) que facilitan la orientación diaria
4. **Comportamiento consistente** — El comportamiento es idéntico en todos los escenarios
5. **Información de solo lectura clínica** — Las estadísticas son informativas y no permiten acciones que modifiquen el estado clínico

### 11.2 Principio Arquitectónico

El comportamiento del root refleja el principio arquitectónico central del sistema:

**El sistema se organiza alrededor del paciente.**

El root facilita este principio presentando la lista de pacientes como elemento principal, junto con información operativa que apoya el acceso a pacientes. Toda la información mostrada está orientada a facilitar la selección y acceso a pacientes, manteniendo al paciente como eje central del flujo.

### 11.3 Impacto en el Flujo Clínico

El comportamiento del root optimiza el flujo clínico diario:

1. El clínico accede al sistema (root)
2. El sistema presenta la vista completa con lista de pacientes y contexto operativo
3. El clínico obtiene orientación diaria a través de las estadísticas y turnos próximos
4. El clínico selecciona un paciente desde la lista o desde los turnos próximos
5. El clínico accede al registro clínico del paciente seleccionado

**Resultado:** Reducción de fricción, claridad de flujo, acceso inmediato a la funcionalidad principal, y mejora de la orientación diaria del consultorio.

### 11.4 Información Estadística y Operativa

El root presenta dos tipos de información estadística y operativa:

1. **Cantidad de pacientes** — Métrica operativa que muestra el número total de pacientes segmentado por estado (activos/inactivos)
2. **Turnos próximos 7 días** — Recorte temporal de la agenda que muestra turnos programados para facilitar el acceso rápido a pacientes relevantes

**Características de las estadísticas:**

- Son informativas y operativas, no interpretativas ni clínicas
- No generan eventos ni modifican estado clínico
- No son configurables por el usuario
- Facilitan decisiones organizativas diarias
- Mantienen al paciente como eje central del acceso

---

*Versión del Documento: 2.0*  
*Estado: Final*  
*Depende De: 01_specs.md, 02_domain.md, 18_patient_crud_specs.md, 23_encounter_appointment_spec.md*  
*Consumido Por: Implementación de Frontend, Implementación de Routing, Diseño de UX, QA Testing*

---

## Nota de Actualización

Esta especificación actualiza la versión 1.0 que definía el root como un simple mecanismo de redirección. La versión 2.0 incorpora información estadística y operativa (cantidad de pacientes y turnos próximos 7 días) manteniendo los principios arquitectónicos fundamentales:

- El paciente sigue siendo el eje central del flujo
- El root no muestra información clínica sensible
- Las estadísticas son operativas e informativas, no interpretativas ni clínicas
- El acceso a la historia clínica siempre se realiza desde la identidad del paciente

La actualización amplía el propósito del root sin alterar su naturaleza fundamental como punto de entrada operativo centrado en el paciente.
