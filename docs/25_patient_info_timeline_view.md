# Sistema de Historias Clínicas Psiquiátricas — Información del Paciente en Vista de Timeline

## Overview

Este documento define las especificaciones funcionales para la presentación de información del paciente en la vista de timeline clínica.

La información del paciente proporciona contexto clínico permanente y no forma parte de la timeline de eventos.

Este documento especifica **QUÉ** información del paciente debe mostrarse y **CÓMO** debe comportarse, no **CÓMO** se implementa visualmente.

---

## 1. Propósito de la Información del Paciente en la Vista de Timeline

### 1.1 Contextualización Clínica

La información del paciente en la vista de timeline cumple una función de **contexto permanente**.

Permite al clínico:

- **Identificar inequívocamente al paciente** — Confirmar que está revisando la historia clínica correcta
- **Comprender el contexto demográfico** — La edad del paciente informa la interpretación de eventos clínicos
- **Mantener continuidad narrativa** — La identidad del paciente permanece visible mientras se navega por la timeline
- **Reducir errores de identificación** — La información siempre visible previene confusiones entre pacientes

### 1.2 Separación Conceptual de la Timeline

La información del paciente **NO es parte de la timeline**.

| Aspecto | Información del Paciente | Timeline de Eventos |
|---------|-------------------------|---------------------|
| **Naturaleza** | Contexto estático | Narrativa temporal |
| **Origen** | Entidad Patient | Entidades clínicas (Notes, Medications, ClinicalEvents) |
| **Mutabilidad** | Puede cambiar (actualizaciones administrativas) | Inmutable (eventos históricos) |
| **Posición temporal** | Sin fecha de ocurrencia | Anclada a fechas específicas |
| **Generación de eventos** | Nunca genera eventos | Cada evento es un hecho clínico |

**Principio fundamental:** La información del paciente es el **marco** dentro del cual se desarrolla la timeline, no un **evento** dentro de ella.

### 1.3 Rol en la Experiencia Clínica

La información persistente del paciente:

- **Facilita la revisión longitudinal** — El clínico puede desplazarse por años de historia sin perder la identidad del paciente
- **Apoya la toma de decisiones** — La edad y el estado del paciente informan la interpretación de eventos
- **Mejora la seguridad clínica** — La identificación constante reduce el riesgo de errores de identidad
- **Mantiene el contexto durante la documentación** — Al crear nuevos eventos, el clínico siempre tiene visible a quién está documentando

---

## 2. Definición de "Información del Paciente"

### 2.1 Qué Constituye Información del Paciente

La información del paciente comprende **datos de identidad y estado administrativo** que identifican al individuo y su relación operativa con el sistema.

Esta información proviene exclusivamente de la entidad **Patient** y no incluye ningún dato clínico.

### 2.2 Datos de Identidad

Los datos de identidad son aquellos que identifican únicamente al paciente:

| Campo | Propósito | Fuente |
|-------|-----------|--------|
| **Nombre completo** | Identificación primaria del paciente | Patient.fullName |
| **Fecha de nacimiento** | Identificación y cálculo de edad | Patient.dateOfBirth |
| **Edad** | Contexto demográfico derivado | Calculada desde Patient.dateOfBirth |
| **Identificador interno** | Identificación única del sistema | Patient.id |

**Características:**
- Son datos administrativos, no clínicos
- Pueden modificarse (correcciones, cambios legales)
- No generan eventos en la timeline cuando cambian
- Son necesarios para la identificación inequívoca

### 2.3 Datos Administrativos Relevantes

Los datos administrativos relevantes para el contexto clínico:

| Campo | Propósito | Fuente |
|-------|-----------|--------|
| **Estado del paciente** | Indica si el paciente está activo en el sistema | Patient.status |

**Características:**
- El estado (Activo/Inactivo) es relevante para el contexto clínico
- Indica si el paciente está recibiendo atención actualmente
- No afecta la accesibilidad de la historia clínica
- No genera eventos cuando cambia

### 2.4 Exclusiones Explícitas

La siguiente información **NO forma parte** de la información del paciente en la vista de timeline:

| Información Excluida | Razón |
|---------------------|-------|
| **Datos de contacto** (teléfono, email, dirección) | No son relevantes para el contexto clínico en la timeline |
| **Contacto de emergencia** | No es información de identidad del paciente |
| **Información clínica resumida** | Pertenece a la timeline, no al contexto del paciente |
| **Indicadores de riesgo o alertas** | Son información clínica, no identidad |
| **Historial psiquiátrico** | Es contenido clínico, no información del paciente |
| **Medicamentos actuales** | Son eventos clínicos, no datos del paciente |
| **Última consulta** | Es un evento de timeline, no información del paciente |
| **Fechas de registro o actualización** | Son metadatos del sistema, no identidad |

**Principio de exclusión:** Solo se incluye información que identifica al paciente y su estado operativo. Toda información clínica o de contacto queda excluida.

---

## 3. Ubicación Conceptual en la Vista

### 3.1 Información Persistente

La información del paciente debe estar **siempre visible** en la vista de timeline, independientemente de:

- La posición del scroll en la timeline
- La fecha del evento más reciente o más antiguo visible
- El filtro temporal aplicado (si existe)
- La cantidad de eventos en la timeline

**Garantía funcional:** El clínico siempre puede ver la identidad del paciente sin necesidad de desplazarse o realizar acciones adicionales.

### 3.2 Separación Clara Respecto de la Timeline

La información del paciente debe estar **conceptualmente separada** de la timeline de eventos.

| Característica | Información del Paciente | Timeline de Eventos |
|----------------|-------------------------|---------------------|
| **Posición visual** | Área persistente (header, sidebar, panel fijo) | Área de scroll (contenido principal) |
| **Comportamiento al scroll** | Permanece fija | Se desplaza con el contenido |
| **Ordenamiento** | Sin orden (información estática) | Ordenada cronológicamente |
| **Interacción** | Solo lectura (no editable desde timeline) | Interactiva (navegación, expansión) |

**Principio de separación:** La información del paciente y la timeline deben ser visualmente y funcionalmente distinguibles.

### 3.3 Independencia del Scroll Cronológico

La información del paciente **no depende** del scroll cronológico de la timeline.

| Escenario | Comportamiento Esperado |
|-----------|------------------------|
| **Timeline vacía** | La información del paciente sigue visible |
| **Scroll al inicio** | La información del paciente sigue visible |
| **Scroll al final** | La información del paciente sigue visible |
| **Navegación a fecha específica** | La información del paciente sigue visible |
| **Filtrado de eventos** | La información del paciente sigue visible |

**Garantía:** La visibilidad de la información del paciente es independiente del estado de navegación de la timeline.

---

## 4. Campos Mínimos a Mostrar

### 4.1 Campos Obligatorios

Los siguientes campos **DEBEN** mostrarse siempre en la vista de timeline:

| Campo | Descripción | Formato |
|-------|-------------|---------|
| **Nombre completo** | Nombre legal del paciente | Texto completo tal como está registrado |
| **Edad** | Edad actual del paciente | Número de años derivado de fecha de nacimiento |
| **Fecha de nacimiento** | Fecha de nacimiento del paciente | Formato de fecha legible (ej: "15 de marzo de 1985") |
| **Estado del paciente** | Estado operativo en el sistema | "Activo" o "Inactivo" |
| **Identificador interno** | Identificador único del sistema | Identificador numérico o alfanumérico |

### 4.2 Cálculo de Edad

La edad debe calcularse dinámicamente desde la fecha de nacimiento:

- **Cálculo:** Edad = Año actual - Año de nacimiento (ajustado por mes y día)
- **Actualización:** La edad se recalcula automáticamente sin intervención del usuario
- **Precisión:** Debe reflejar la edad exacta del paciente en la fecha actual
- **Formato:** Número entero seguido de "años" (ej: "39 años")

**Regla de cálculo:** Si la fecha de cumpleaños aún no ha ocurrido en el año actual, la edad se reduce en 1 año.

### 4.3 Formato de Fecha de Nacimiento

La fecha de nacimiento debe mostrarse en formato legible:

- **Formato preferido:** "DD de [mes] de YYYY" (ej: "15 de marzo de 1985")
- **Alternativa aceptable:** Formato numérico estándar si el formato completo no es viable
- **Idioma:** Español
- **Consistencia:** El formato debe ser consistente en toda la aplicación

### 4.4 Presentación del Estado

El estado del paciente debe mostrarse claramente:

- **Valores:** "Activo" o "Inactivo"
- **Idioma:** Español
- **Visibilidad:** Debe ser claramente distinguible (puede usar indicadores visuales adicionales)

### 4.5 Campos Opcionales (Fuera de Alcance del MVP)

Los siguientes campos **NO** deben mostrarse en el MVP:

- Datos de contacto (teléfono, email)
- Dirección
- Contacto de emergencia
- Fecha de registro
- Fechas de creación/actualización del registro

**Razón:** Estos campos no son necesarios para el contexto clínico en la timeline y pueden agregarse en versiones posteriores si se requiere.

---

## 5. Reglas de Comportamiento

### 5.1 No Editable Desde la Timeline

La información del paciente **NO puede editarse** desde la vista de timeline.

| Acción | Comportamiento |
|--------|----------------|
| **Clic en nombre** | No inicia edición |
| **Clic en fecha de nacimiento** | No inicia edición |
| **Clic en estado** | No inicia edición |
| **Hover sobre campos** | No muestra indicadores de edición |

**Razón:** La edición de datos del paciente es una operación administrativa que debe realizarse desde el módulo de gestión de pacientes, no desde la vista clínica.

**Excepción:** No hay excepciones. La información del paciente es de solo lectura en la vista de timeline.

### 5.2 Cambios Administrativos No Impactan la Timeline

Cuando los datos del paciente se actualizan desde el módulo de gestión de pacientes:

| Tipo de Cambio | Impacto en Timeline |
|----------------|---------------------|
| **Cambio de nombre** | La información mostrada se actualiza, pero NO se genera evento |
| **Corrección de fecha de nacimiento** | La edad se recalcula, pero NO se genera evento |
| **Cambio de estado (Activo ↔ Inactivo)** | El estado mostrado se actualiza, pero NO se genera evento |
| **Actualización de contacto** | No afecta la información mostrada (contacto no se muestra) |

**Garantía explícita:** Ninguna actualización de datos del paciente genera eventos en la timeline. Los cambios administrativos son independientes de la narrativa clínica.

### 5.3 Información Siempre Consistente

La información del paciente mostrada en la timeline **DEBE** ser siempre consistente con el registro actual del paciente.

| Escenario | Comportamiento |
|-----------|----------------|
| **Actualización de nombre** | La timeline muestra el nombre actualizado inmediatamente |
| **Corrección de fecha de nacimiento** | La edad se recalcula y muestra el valor correcto |
| **Cambio de estado** | El estado mostrado refleja el estado actual |
| **Paciente desactivado** | El estado muestra "Inactivo" |

**Garantía de consistencia:** La información mostrada siempre refleja el estado actual de la entidad Patient, sin retrasos ni cachés obsoletos.

### 5.4 Actualización en Tiempo Real

Cuando los datos del paciente cambian:

- **Actualización inmediata:** La información visible se actualiza sin requerir recarga de la página
- **Sin eventos:** La actualización no genera eventos ni notificaciones en la timeline
- **Transparente:** El cambio es visible pero no interrumpe la navegación de la timeline

**Comportamiento esperado:** Si el clínico tiene abierta la timeline y actualiza los datos del paciente en otra vista, la información en la timeline se actualiza automáticamente.

---

## 6. Relación con ClinicalRecord y Timeline

### 6.1 La Información Pertenece al Paciente

La información mostrada en la timeline **pertenece a la entidad Patient**, no a ClinicalRecord ni a la Timeline.

| Entidad | Responsabilidad |
|---------|-----------------|
| **Patient** | Almacena y gestiona la información de identidad y estado |
| **ClinicalRecord** | Contiene la timeline y eventos clínicos, pero NO la información del paciente |
| **Timeline** | Presenta eventos clínicos, pero NO incluye información del paciente como evento |

**Principio de propiedad:** La información del paciente es propiedad de Patient. La timeline solo la **muestra** como contexto, no la **posee**.

### 6.2 La Timeline Pertenece al Registro Clínico

La timeline de eventos **pertenece a ClinicalRecord**, que a su vez pertenece a Patient.

| Relación | Descripción |
|----------|-------------|
| **Patient → ClinicalRecord** | Un paciente tiene exactamente un registro clínico |
| **ClinicalRecord → Timeline** | El registro clínico contiene la timeline de eventos |
| **Patient → Información mostrada** | El paciente proporciona la información de contexto |

**Separación de responsabilidades:** Patient proporciona contexto. ClinicalRecord proporciona contenido clínico.

### 6.3 No Mezclar Responsabilidades

Las responsabilidades deben mantenerse estrictamente separadas:

| Responsabilidad | Entidad Responsable | NO Responsable |
|-----------------|---------------------|----------------|
| **Identidad del paciente** | Patient | ClinicalRecord, Timeline |
| **Eventos clínicos** | ClinicalRecord (Timeline) | Patient |
| **Contexto en la vista** | Vista de Timeline (lee de Patient) | Patient (solo almacena) |
| **Narrativa clínica** | Timeline | Patient |

**Principio de separación:** Cada entidad tiene responsabilidades claras y no debe asumir las de otras.

### 6.4 Integración en la Vista

La vista de timeline **integra** información de ambas fuentes:

```
Vista de Timeline
├── Información del Paciente (fuente: Patient)
│   ├── Nombre completo
│   ├── Edad
│   ├── Fecha de nacimiento
│   ├── Estado
│   └── Identificador
│
└── Timeline de Eventos (fuente: ClinicalRecord)
    ├── Evento 1
    ├── Evento 2
    └── ...
```

**Integración, no fusión:** La vista combina información de Patient y ClinicalRecord, pero mantiene la separación conceptual y funcional.

---

## 7. Impacto en UX Clínico

### 7.1 Reducción de Errores de Identificación

La información persistente del paciente reduce errores de identificación:

| Escenario de Riesgo | Mitigación |
|---------------------|------------|
| **Múltiples pestañas abiertas** | El nombre siempre visible permite confirmar el paciente correcto |
| **Navegación entre pacientes** | La identidad visible previene documentación en el paciente equivocado |
| **Revisión de historias similares** | La edad y nombre permiten distinguir pacientes con nombres similares |
| **Sesiones prolongadas** | La identidad constante previene confusión después de pausas |

**Beneficio:** El clínico siempre sabe con certeza a qué paciente está documentando o revisando.

### 7.2 Mejora de Continuidad Narrativa

La información persistente mejora la continuidad de la narrativa clínica:

| Aspecto | Beneficio |
|---------|-----------|
| **Contexto demográfico constante** | La edad visible informa la interpretación de eventos (ej: medicación en paciente joven vs. mayor) |
| **Identidad estable** | El nombre visible mantiene la conexión emocional y profesional con el paciente |
| **Estado operativo claro** | El estado visible indica si el paciente está en atención activa |

**Beneficio:** El clínico mantiene el contexto completo mientras navega por la historia longitudinal.

### 7.3 Acceso Rápido al Contexto

La información siempre visible proporciona acceso inmediato al contexto esencial:

| Necesidad del Clínico | Solución |
|-----------------------|----------|
| **Confirmar identidad antes de documentar** | Nombre e identificador siempre visibles |
| **Calcular edad para decisión clínica** | Edad calculada y visible |
| **Verificar estado del paciente** | Estado siempre visible |
| **Contexto para interpretar eventos** | Información demográfica constante |

**Beneficio:** El clínico no necesita navegar a otra vista para obtener información básica del paciente.

### 7.4 Experiencia de Uso Optimizada

La información persistente optimiza el flujo de trabajo clínico:

- **Menos clics:** No es necesario abrir el perfil del paciente para ver información básica
- **Menos cambios de contexto:** El clínico permanece en la vista de timeline
- **Mayor confianza:** La identidad constante genera confianza en la documentación
- **Mejor eficiencia:** Menos interrupciones para verificar información

**Beneficio general:** La experiencia clínica es más fluida y eficiente.

---

## 8. Casos Fuera de Alcance

### 8.1 Edición de Datos del Paciente

La edición de datos del paciente **NO es responsabilidad** de la vista de timeline.

| Operación | Dónde se Realiza |
|-----------|------------------|
| **Actualizar nombre** | Módulo de gestión de pacientes |
| **Corregir fecha de nacimiento** | Módulo de gestión de pacientes |
| **Cambiar estado** | Módulo de gestión de pacientes |
| **Actualizar contacto** | Módulo de gestión de pacientes |

**Razón:** La edición es una operación administrativa que requiere validación y flujos específicos del módulo de pacientes.

### 8.2 Información Clínica Resumida

La información clínica resumida **NO forma parte** de la información del paciente.

| Información Excluida | Razón |
|---------------------|-------|
| **Última consulta** | Es un evento de timeline, no información del paciente |
| **Medicamentos actuales** | Son eventos clínicos, no datos del paciente |
| **Diagnóstico principal** | Es información clínica, no identidad |
| **Próxima cita** | Es información de Appointments, no de Patient |
| **Resumen de síntomas** | Es contenido clínico, no información del paciente |

**Principio:** Solo se muestra información de identidad y estado. Toda información clínica pertenece a la timeline.

### 8.3 Indicadores de Riesgo o Alertas

Los indicadores de riesgo o alertas clínicas **NO forman parte** de la información del paciente.

| Tipo de Indicador | Dónde Pertenece |
|-------------------|-----------------|
| **Alertas de medicación** | Timeline o vista de medicamentos |
| **Indicadores de riesgo** | Timeline o vista de evaluación |
| **Notas importantes** | Timeline o notas clínicas |
| **Alertas del sistema** | Sistema de notificaciones (fuera de timeline) |

**Razón:** Los indicadores de riesgo son información clínica, no información de identidad del paciente.

### 8.4 Información de Contacto

Los datos de contacto **NO se muestran** en la vista de timeline.

| Campo Excluido | Razón |
|----------------|-------|
| **Teléfono** | No es necesario para el contexto clínico en la timeline |
| **Email** | No es necesario para el contexto clínico en la timeline |
| **Dirección** | No es necesario para el contexto clínico en la timeline |
| **Contacto de emergencia** | No es información del paciente, es información administrativa |

**Razón:** La información de contacto no es relevante para la revisión de la timeline clínica. Puede accederse desde el módulo de pacientes si es necesario.

### 8.5 Metadatos del Sistema

Los metadatos del sistema **NO se muestran** en la información del paciente.

| Metadato Excluido | Razón |
|-------------------|-------|
| **Fecha de registro** | Es metadato administrativo, no identidad |
| **Fecha de creación** | Es metadato técnico, no identidad |
| **Fecha de última actualización** | Es metadato técnico, no identidad |
| **Usuario que creó el registro** | Es metadato de auditoría, no identidad |

**Razón:** Los metadatos del sistema no son relevantes para el contexto clínico en la timeline.

---

## 9. Garantías Funcionales

### 9.1 Visibilidad Permanente

**Garantía:** La información del paciente está siempre visible en la vista de timeline, independientemente del estado de navegación.

| Condición | Garantía |
|-----------|----------|
| **Timeline vacía** | Información del paciente visible |
| **Scroll en cualquier posición** | Información del paciente visible |
| **Filtros aplicados** | Información del paciente visible |
| **Navegación a fecha específica** | Información del paciente visible |

### 9.2 Consistencia con Patient

**Garantía:** La información mostrada siempre refleja el estado actual de la entidad Patient.

| Actualización en Patient | Efecto en Vista |
|--------------------------|-----------------|
| **Cambio de nombre** | Nombre actualizado inmediatamente |
| **Corrección de fecha de nacimiento** | Edad recalculada inmediatamente |
| **Cambio de estado** | Estado actualizado inmediatamente |

### 9.3 No Generación de Eventos

**Garantía:** Ninguna actualización de información del paciente genera eventos en la timeline.

| Operación | Garantía |
|-----------|----------|
| **Actualización de nombre** | No genera ClinicalEvent |
| **Corrección de fecha de nacimiento** | No genera ClinicalEvent |
| **Cambio de estado** | No genera ClinicalEvent |

### 9.4 Separación de Responsabilidades

**Garantía:** La información del paciente y la timeline mantienen responsabilidades separadas.

| Responsabilidad | Entidad |
|-----------------|---------|
| **Almacenar información del paciente** | Patient |
| **Mostrar información del paciente** | Vista de Timeline |
| **Gestionar eventos clínicos** | ClinicalRecord (Timeline) |
| **Presentar eventos clínicos** | Vista de Timeline |

---

## 10. Restricciones de Implementación

### 10.1 No Modificar Schema

Este documento **NO especifica** cambios al schema de base de datos.

- La entidad Patient ya existe y contiene los campos necesarios
- No se requieren nuevos campos
- No se requieren nuevas relaciones
- No se requieren nuevas tablas

**Razón:** La especificación define qué información mostrar, no cómo almacenarla.

### 10.2 No Agregar Lógica de Negocio

Este documento **NO especifica** nueva lógica de negocio.

- El cálculo de edad es una operación de presentación, no lógica de negocio
- La actualización de información es responsabilidad del módulo de pacientes
- No se requieren nuevas reglas de validación
- No se requieren nuevos procesos de negocio

**Razón:** La especificación define comportamiento de presentación, no reglas de negocio.

### 10.3 No Definir Layout Visual

Este documento **NO especifica** el layout visual concreto.

- No define posición exacta (header, sidebar, panel)
- No define estilos visuales
- No define componentes específicos
- No define animaciones o transiciones

**Razón:** La especificación es funcional, no de diseño. El layout es responsabilidad de la implementación de UX.

### 10.4 No Duplicar Información Clínica

Este documento **NO permite** duplicar información clínica en la información del paciente.

- No se muestra información de eventos en la sección del paciente
- No se muestra información de medicamentos en la sección del paciente
- No se muestra información de notas en la sección del paciente

**Razón:** La información clínica pertenece a la timeline, no al contexto del paciente.

---

## 11. Resumen

### 11.1 Qué Es

La información del paciente en la vista de timeline es:

- **Contexto permanente** que identifica al paciente y proporciona datos demográficos esenciales
- **Información de solo lectura** que no puede editarse desde la timeline
- **Información siempre visible** independientemente de la navegación en la timeline
- **Información de identidad** que pertenece a la entidad Patient, no a ClinicalRecord

### 11.2 Qué No Es

La información del paciente en la vista de timeline NO es:

- Un evento de timeline
- Información clínica
- Información editable desde la timeline
- Información que genera eventos cuando cambia
- Información de contacto o administrativa detallada

### 11.3 Campos Obligatorios

Los siguientes campos deben mostrarse siempre:

1. Nombre completo
2. Edad (calculada desde fecha de nacimiento)
3. Fecha de nacimiento
4. Estado del paciente (Activo/Inactivo)
5. Identificador interno

### 11.4 Principios Fundamentales

1. **Separación de responsabilidades:** Patient proporciona contexto, ClinicalRecord proporciona contenido clínico
2. **No generación de eventos:** Los cambios en información del paciente no generan eventos
3. **Visibilidad permanente:** La información siempre está visible
4. **Consistencia:** La información siempre refleja el estado actual de Patient
5. **Solo lectura:** La información no se edita desde la timeline

---

*Versión del Documento: 1.0*  
*Estado: Final*  
*Depende De: 02_domain.md, 03_timeline.md, 18_patient_crud_specs.md*  
*Consumido Por: Implementación de Backend, Implementación de UX, Testing QA*
