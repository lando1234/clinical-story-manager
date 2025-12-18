# Sistema de Historias Clínicas Psiquiátricas — Especificación Funcional del Root del Sistema

## Resumen Ejecutivo

Este documento define el comportamiento funcional del punto de entrada raíz del sistema (`/`) y su relación con la lista de pacientes.

El root del sistema actúa como punto de entrada que facilita el acceso inmediato a la lista de pacientes, reflejando el principio arquitectónico de que el sistema se organiza alrededor del paciente.

Esta especificación define **QUÉ** debe ocurrir cuando el usuario accede al root, sin describir implementación técnica ni detalles de routing.

---

## 1. Propósito del Root del Sistema

### 1.1 Rol como Punto de Entrada

El root del sistema (`/`) es el punto de entrada principal cuando un usuario accede a la aplicación.

El root existe para:

- **Facilitar el acceso inmediato a la lista de pacientes** — Reducir la fricción entre el inicio de sesión y el inicio del trabajo clínico
- **Establecer el contexto clínico** — Orientar al usuario hacia la selección de un paciente como primer paso en cualquier flujo clínico
- **Reflejar la organización del sistema** — Manifestar que el sistema se estructura alrededor del paciente como entidad central

### 1.2 Relación con el Flujo Clínico Diario

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

- **Un punto de entrada funcional** — No es una vista con contenido propio, sino un mecanismo de navegación
- **Una transición automática** — Conduce al usuario hacia la lista de pacientes sin requerir interacción
- **Un facilitador de acceso** — Reduce la distancia entre el inicio de la aplicación y el inicio del trabajo clínico

### 2.2 Qué NO Representa

El root **NO** representa:

- **Un dashboard clínico** — No muestra resúmenes, métricas o información agregada
- **Un resumen global** — No presenta estadísticas del sistema, contadores de pacientes, o información administrativa
- **Una pantalla de bienvenida** — No muestra mensajes de bienvenida, instrucciones, o contenido informativo
- **Una vista de configuración** — No expone opciones de sistema, preferencias, o configuraciones
- **Un punto de decisión** — No requiere que el usuario elija entre múltiples opciones o rutas

**Principio de Exclusión:** El root no tiene contenido propio. Su única función es redirigir a la lista de pacientes.

### 2.3 Estado del Root

El root no mantiene estado propio:

- **No requiere datos previos** — Funciona independientemente de cualquier estado de la aplicación
- **No depende de autenticación** — Asume que el acceso al root implica acceso autorizado (la gestión de autenticación está fuera del alcance de esta especificación)
- **No almacena preferencias** — No recuerda elecciones previas del usuario o configuraciones de sesión
- **No tiene lógica condicional** — Su comportamiento es idéntico en todos los casos

**Garantía:** El comportamiento del root es determinístico y predecible en todas las circunstancias.

---

## 3. Comportamiento Esperado

### 3.1 Redirección Automática a la Lista de Pacientes

Cuando un usuario accede al root (`/`), el sistema debe redirigir automáticamente a la lista de pacientes.

**Comportamiento específico:**

| Acción del Usuario | Comportamiento del Sistema |
|-------------------|---------------------------|
| Acceso inicial al root (`/`) | Redirección inmediata a la lista de pacientes |
| Refresh en el root (`/`) | Redirección inmediata a la lista de pacientes |
| Navegación directa por URL al root (`/`) | Redirección inmediata a la lista de pacientes |
| Navegación desde otra vista hacia el root (`/`) | Redirección inmediata a la lista de pacientes |

**Principio de Consistencia:** El comportamiento del root es idéntico independientemente de cómo se acceda a él.

### 3.2 Características de la Redirección

La redirección debe cumplir con las siguientes características:

| Característica | Requisito |
|---------------|-----------|
| **Inmediatez** | La redirección ocurre sin demora perceptible |
| **Transparencia** | El usuario no debe percibir que está en una vista intermedia |
| **Consistencia** | El comportamiento es idéntico en todos los escenarios de acceso |
| **Simplicidad** | No requiere lógica condicional ni evaluación de estado |

### 3.3 Comportamiento en Primera Carga

Cuando el usuario accede al sistema por primera vez en una sesión:

1. El usuario accede al root (`/`)
2. El sistema redirige inmediatamente a la lista de pacientes
3. El usuario ve la lista de pacientes (que puede estar vacía si no hay pacientes registrados)

**No hay pasos intermedios ni pantallas de transición.**

### 3.4 Comportamiento en Refresh

Cuando el usuario realiza un refresh (recarga de página) mientras está en el root (`/`):

1. El sistema detecta que está en el root
2. El sistema redirige inmediatamente a la lista de pacientes
3. El usuario ve la lista de pacientes actualizada

**El refresh no debe resultar en una pantalla vacía o en el root visible.**

### 3.5 Comportamiento en Navegación Directa por URL

Cuando el usuario navega directamente al root usando la URL (`/`):

1. El sistema procesa la solicitud del root
2. El sistema redirige inmediatamente a la lista de pacientes
3. El usuario ve la lista de pacientes

**La URL del root no debe permanecer visible en la barra de direcciones después de la redirección.**

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

La lista de pacientes que se muestra después de la redirección desde el root debe:

- **Mostrar todos los pacientes disponibles** (según los criterios de búsqueda y filtrado definidos en las especificaciones de Patient CRUD)
- **Mantener el estado de búsqueda por defecto** (si existe un estado por defecto definido)
- **No requerir interacción previa** — La lista está lista para usar inmediatamente

**Nota:** Los detalles específicos de cómo se muestra la lista de pacientes (ordenamiento, filtros, paginación) están definidos en las especificaciones de Patient CRUD y están fuera del alcance de este documento.

---

## 5. Reglas Explícitas

### 5.1 El Root No Debe Mostrar Información Clínica

**Regla:** El root nunca debe mostrar información clínica de ningún tipo.

| Tipo de Información | ¿Permitido en Root? |
|---------------------|---------------------|
| Información de pacientes | No |
| Resúmenes clínicos | No |
| Métricas o estadísticas | No |
| Eventos recientes | No |
| Notificaciones clínicas | No |
| Cualquier dato clínico | No |

**Justificación:** El root no es una vista funcional. Su único propósito es la redirección.

### 5.2 El Root No Debe Requerir Interacción Previa

**Regla:** El root no debe requerir ninguna interacción del usuario para funcionar.

| Tipo de Interacción | ¿Permitida? |
|---------------------|-------------|
| Clic en botón para continuar | No |
| Selección de opción | No |
| Confirmación de acción | No |
| Introducción de datos | No |
| Cualquier interacción | No |

**Justificación:** La redirección debe ser automática e inmediata.

### 5.3 El Root No Debe Tener Estado Propio

**Regla:** El root no mantiene ni requiere estado de la aplicación.

| Tipo de Estado | ¿Permitido? |
|----------------|-------------|
| Estado de sesión | No (asume acceso autorizado) |
| Estado de preferencias | No |
| Estado de navegación previa | No |
| Estado de datos en caché | No |
| Cualquier estado persistente | No |

**Justificación:** El root debe funcionar de manera idéntica independientemente del estado de la aplicación.

### 5.4 El Root No Debe Generar Lógica de Negocio

**Regla:** El root no ejecuta lógica de negocio más allá de la redirección.

| Tipo de Lógica | ¿Permitida? |
|----------------|-------------|
| Validación de datos | No |
| Cálculos o procesamiento | No |
| Consultas a base de datos | No (más allá de lo necesario para la redirección) |
| Transformación de datos | No |
| Lógica condicional compleja | No |

**Justificación:** El root es un punto de transición, no un procesador de información.

### 5.5 El Root Debe Ser Consistente

**Regla:** El comportamiento del root debe ser idéntico en todos los escenarios.

| Escenario | Comportamiento Esperado |
|-----------|------------------------|
| Primera carga | Redirección a lista de pacientes |
| Refresh | Redirección a lista de pacientes |
| Navegación directa | Redirección a lista de pacientes |
| Navegación desde otra vista | Redirección a lista de pacientes |
| Con pacientes en el sistema | Redirección a lista de pacientes |
| Sin pacientes en el sistema | Redirección a lista de pacientes (que mostrará estado vacío) |

**Justificación:** La consistencia reduce la confusión y mejora la experiencia del usuario.

---

## 6. Impacto en UX

### 6.1 Reducción de Fricción

El comportamiento del root reduce la fricción en el flujo del usuario:

| Aspecto | Impacto |
|---------|---------|
| **Eliminación de pasos innecesarios** | El usuario no debe navegar manualmente a la lista de pacientes |
| **Reducción de clics** | No se requiere interacción para acceder a la funcionalidad principal |
| **Aceleración del flujo** | El acceso a la lista de pacientes es inmediato |
| **Claridad de propósito** | El usuario entiende inmediatamente que debe seleccionar un paciente |

### 6.2 Claridad de Flujo

El comportamiento del root proporciona claridad en el flujo de la aplicación:

| Aspecto | Beneficio |
|---------|-----------|
| **Flujo predecible** | El usuario sabe qué esperar al acceder al root |
| **Orientación clara** | El sistema guía al usuario hacia el siguiente paso lógico |
| **Eliminación de ambigüedad** | No hay confusión sobre qué hacer después de acceder al root |
| **Coherencia con el modelo mental** | El comportamiento refleja que el sistema se organiza alrededor del paciente |

### 6.3 Evitar Pantallas "Vacías" o Ambiguas

El comportamiento del root evita problemas comunes de UX:

| Problema Evitado | Cómo se Evita |
|------------------|---------------|
| **Pantalla vacía** | La redirección inmediata lleva al usuario a una vista con contenido (lista de pacientes) |
| **Ambiguidad sobre qué hacer** | La redirección automática elimina la necesidad de decisión |
| **Sensación de "pantalla de carga"** | La transición es inmediata, no hay espera perceptible |
| **Confusión sobre el propósito** | El comportamiento es claro: llevar al usuario a la lista de pacientes |

### 6.4 Experiencia de Primera Impresión

El comportamiento del root contribuye a una experiencia de primera impresión positiva:

| Aspecto | Contribución |
|---------|--------------|
| **Inmediatez** | El usuario accede rápidamente a la funcionalidad principal |
| **Profesionalismo** | El comportamiento pulido transmite calidad |
| **Eficiencia** | El usuario percibe que el sistema está optimizado para su flujo de trabajo |
| **Enfoque** | El sistema se presenta como una herramienta clínica centrada en el paciente |

---

## 7. Casos Fuera de Alcance

### 7.1 Dashboards Estadísticos

**Fuera de alcance:** El root no debe mostrar dashboards con estadísticas del sistema.

| Tipo de Dashboard | ¿Permitido? |
|-------------------|-------------|
| Resumen de pacientes activos | No |
| Métricas de uso del sistema | No |
| Gráficos o visualizaciones | No |
| Estadísticas clínicas agregadas | No |

**Justificación:** El root no es una vista de información, es un punto de transición.

### 7.2 Métricas Globales

**Fuera de alcance:** El root no debe mostrar métricas globales del sistema.

| Tipo de Métrica | ¿Permitida? |
|-----------------|-------------|
| Contador de pacientes totales | No |
| Contador de pacientes activos | No |
| Número de encuentros recientes | No |
| Cualquier métrica agregada | No |

**Justificación:** Las métricas no son parte del flujo clínico primario y no pertenecen al root.

### 7.3 Configuración del Sistema

**Fuera de alcance:** El root no debe proporcionar acceso a configuración del sistema.

| Tipo de Configuración | ¿Permitida? |
|----------------------|-------------|
| Preferencias de usuario | No |
| Configuración de la aplicación | No |
| Ajustes del sistema | No |
| Opciones administrativas | No |

**Justificación:** La configuración no es parte del flujo clínico diario y debe estar en una sección dedicada.

### 7.4 Información de Bienvenida o Tutoriales

**Fuera de alcance:** El root no debe mostrar información de bienvenida o tutoriales.

| Tipo de Contenido | ¿Permitido? |
|-------------------|-------------|
| Mensajes de bienvenida | No |
| Tutoriales interactivos | No |
| Guías de uso | No |
| Información de ayuda | No |

**Justificación:** El root debe ser funcional, no educativo. Los tutoriales deben estar en secciones dedicadas.

### 7.5 Notificaciones o Alertas

**Fuera de alcance:** El root no debe mostrar notificaciones o alertas del sistema.

| Tipo de Notificación | ¿Permitida? |
|---------------------|-------------|
| Alertas clínicas | No |
| Notificaciones del sistema | No |
| Recordatorios | No |
| Mensajes informativos | No |

**Justificación:** Las notificaciones deben estar integradas en las vistas funcionales relevantes, no en el root.

---

## 8. Relación con Otras Especificaciones

### 8.1 Dependencias

Esta especificación depende de:

- **`18_patient_crud_specs.md`** — Define el comportamiento de la lista de pacientes a la cual el root redirige
- **`01_specs.md`** — Define el propósito general del sistema y el principio de organización alrededor del paciente
- **`02_domain.md`** — Define el modelo de dominio y la centralidad del paciente

### 8.2 Consumidores

Esta especificación es consumida por:

- **Implementación de Frontend** — Define el comportamiento del componente/vista del root
- **Implementación de Routing** — Define cómo debe manejarse la ruta raíz
- **Diseño de UX** — Define las expectativas de experiencia del usuario en el root
- **QA Testing** — Define los casos de prueba para validar el comportamiento del root

### 8.3 Integración con Otras Funcionalidades

El root se integra con:

| Funcionalidad | Punto de Integración |
|---------------|---------------------|
| **Lista de Pacientes** | El root redirige a la lista de pacientes |
| **Búsqueda de Pacientes** | La lista de pacientes (destino de la redirección) incluye funcionalidad de búsqueda |
| **Registro Clínico** | El flujo continúa desde la lista de pacientes hacia el registro clínico del paciente seleccionado |

---

## 9. Garantías Funcionales

### 9.1 Garantías de Comportamiento

El sistema garantiza que:

| Garantía | Descripción |
|----------|-------------|
| **Redirección Inmediata** | El acceso al root siempre resulta en redirección inmediata a la lista de pacientes |
| **Consistencia** | El comportamiento es idéntico en todos los escenarios de acceso |
| **Simplicidad** | No hay lógica condicional compleja que pueda fallar |
| **Previsibilidad** | El usuario siempre sabe qué esperar al acceder al root |

### 9.2 Garantías de No Comportamiento

El sistema garantiza que el root:

| Garantía | Descripción |
|----------|-------------|
| **No muestra contenido clínico** | Nunca presenta información de pacientes o datos clínicos |
| **No requiere interacción** | Nunca requiere que el usuario haga clic, seleccione, o interactúe |
| **No mantiene estado** | Nunca depende de estado previo de la aplicación |
| **No ejecuta lógica de negocio** | Nunca procesa datos más allá de la redirección |

---

## 10. Resumen

### 10.1 Comportamiento del Root

El root del sistema (`/`) es un punto de entrada que redirige automáticamente a la lista de pacientes.

**Características principales:**

1. **Redirección automática** — El acceso al root siempre resulta en redirección inmediata a la lista de pacientes
2. **Sin contenido propio** — El root no muestra información, no es una vista funcional
3. **Comportamiento consistente** — El comportamiento es idéntico en todos los escenarios
4. **Sin interacción requerida** — La redirección es automática, no requiere acción del usuario
5. **Sin estado** — El root no mantiene ni depende de estado de la aplicación

### 10.2 Principio Arquitectónico

El comportamiento del root refleja el principio arquitectónico central del sistema:

**El sistema se organiza alrededor del paciente.**

El root facilita este principio llevando directamente al usuario a la lista de pacientes, que es el punto desde el cual se accede a todos los registros clínicos.

### 10.3 Impacto en el Flujo Clínico

El comportamiento del root optimiza el flujo clínico diario:

1. El clínico accede al sistema (root)
2. El sistema redirige automáticamente a la lista de pacientes
3. El clínico selecciona un paciente
4. El clínico accede al registro clínico

**Resultado:** Reducción de fricción, claridad de flujo, y acceso inmediato a la funcionalidad principal.

---

*Versión del Documento: 1.0*  
*Estado: Final*  
*Depende De: 01_specs.md, 02_domain.md, 18_patient_crud_specs.md*  
*Consumido Por: Implementación de Frontend, Implementación de Routing, Diseño de UX, QA Testing*
