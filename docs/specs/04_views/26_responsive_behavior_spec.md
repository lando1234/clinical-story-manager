# Sistema de Historias Clínicas Psiquiátricas — Especificación Funcional de Comportamiento Responsive

## Resumen Ejecutivo

Este documento define el comportamiento funcional responsive del sistema de Historias Clínicas Psiquiátricas, asegurando usabilidad, claridad clínica y continuidad de flujo en distintos tamaños de pantalla.

El sistema debe adaptarse a diferentes dispositivos manteniendo los principios arquitectónicos fundamentales: el paciente como eje central, la legibilidad clínica como prioridad, y la preservación de toda información clínica y administrativa.

Esta especificación define **QUÉ** debe ocurrir en cada rango de pantalla y cómo se reorganiza la información, sin describir implementación técnica (CSS, breakpoints concretos, componentes).

**Nota:** Esta especificación complementa las especificaciones funcionales existentes del sistema, definiendo el comportamiento adaptativo sin alterar el modelo funcional ni el comportamiento clínico.

---

## 1. Principios Centrales (No Negociables)

### 1.1 Principio de Legibilidad Clínica

**Regla fundamental:** La legibilidad y el orden semántico priman sobre la densidad de información.

| Aspecto | Prioridad |
|---------|-----------|
| **Legibilidad del texto clínico** | Máxima prioridad |
| **Orden semántico de la información** | Máxima prioridad |
| **Densidad de información** | Prioridad secundaria |
| **Diseño estético** | Prioridad terciaria |

**Justificación:** El sistema es clínico. La información debe ser legible y comprensible en cualquier tamaño de pantalla, sin sacrificar claridad por densidad.

### 1.2 Principio de Centralidad del Paciente

**Regla fundamental:** El paciente sigue siendo el eje del flujo, independientemente del tamaño de pantalla.

| Escenario | Comportamiento Esperado |
|-----------|------------------------|
| **Pantalla grande** | El paciente es el elemento principal |
| **Pantalla mediana** | El paciente es el elemento principal |
| **Pantalla pequeña** | El paciente es el elemento principal |

**Justificación:** El sistema se organiza alrededor del paciente. Esta organización no cambia con el tamaño de pantalla.

### 1.3 Principio de Preservación de Información

**Regla fundamental:** La información clínica y administrativa NO debe perderse al reducir espacio.

| Tipo de Información | Regla |
|---------------------|-------|
| **Información clínica** | Nunca se oculta, se reorganiza |
| **Información administrativa** | Nunca se oculta, se reorganiza |
| **Acciones críticas** | Nunca se ocultan, se reorganizan |
| **Contexto del paciente** | Nunca se oculta, se reorganiza |

**Justificación:** La pérdida de información clínica o administrativa compromete la seguridad y continuidad del cuidado.

### 1.4 Principio de Experiencia Móvil

**Regla fundamental:** La experiencia móvil es de consulta, no de carga intensiva.

| Tipo de Operación | Experiencia Móvil |
|-------------------|-------------------|
| **Consulta de información** | Optimizada |
| **Revisión de timeline** | Optimizada |
| **Lectura de notas** | Optimizada |
| **Carga de datos extensos** | Funcional pero no optimizada |
| **Edición compleja** | Funcional pero no optimizada |

**Justificación:** Los dispositivos móviles son adecuados para consulta y revisión, pero la carga intensiva de datos se realiza mejor en pantallas más grandes.

### 1.5 Principio de Consistencia Funcional

**Regla fundamental:** No se redefine el modelo funcional por breakpoint.

| Aspecto | Regla |
|---------|-------|
| **Comportamiento clínico** | Idéntico en todos los tamaños |
| **Reglas de negocio** | Idénticas en todos los tamaños |
| **Validaciones** | Idénticas en todos los tamaños |
| **Flujos de trabajo** | Idénticos en todos los tamaños |
| **Organización de información** | Se reorganiza, no se redefine |

**Justificación:** El modelo funcional es independiente del tamaño de pantalla. Solo cambia la presentación, no la funcionalidad.

---

## 2. Tipos de Dispositivos Considerados

### 2.1 Definición de Rangos Conceptuales

El sistema considera tres rangos conceptuales de tamaño de pantalla:

| Rango | Descripción Conceptual | Características Funcionales |
|-------|------------------------|----------------------------|
| **Pantalla Grande (Desktop)** | Pantallas de escritorio y laptops grandes | Espacio suficiente para múltiples columnas simultáneas, información completa visible |
| **Pantalla Mediana (Tablet / Laptop Chico)** | Tablets y laptops pequeños | Espacio limitado para múltiples columnas, requiere reorganización pero mantiene funcionalidad completa |
| **Pantalla Pequeña (Mobile)** | Teléfonos móviles | Espacio muy limitado, requiere apilado vertical y navegación secuencial |

**Nota:** Esta especificación no define valores de píxeles ni breakpoints técnicos. Los rangos son conceptuales y deben implementarse según las mejores prácticas de diseño responsive.

### 2.2 Características Funcionales por Rango

#### 2.2.1 Pantalla Grande (Desktop)

**Características:**
- Múltiples columnas pueden mostrarse simultáneamente
- Información contextual puede permanecer visible junto al contenido principal
- Paneles laterales pueden coexistir con el contenido principal
- Navegación puede ser horizontal y vertical simultáneamente

**Expectativa funcional:** El usuario puede ver y acceder a toda la información relevante sin necesidad de navegación adicional.

#### 2.2.2 Pantalla Mediana (Tablet / Laptop Chico)

**Características:**
- Algunas columnas pueden mostrarse simultáneamente
- Información contextual puede requerir colapso o reorganización
- Paneles laterales pueden requerir alternancia con contenido principal
- Navegación puede requerir más interacciones que en desktop

**Expectativa funcional:** El usuario puede acceder a toda la información, pero puede requerir más interacciones (colapsar/expandir, alternar vistas) que en desktop.

#### 2.2.3 Pantalla Pequeña (Mobile)

**Características:**
- Una columna principal a la vez
- Información contextual debe reorganizarse o apilarse verticalmente
- Paneles laterales deben colapsarse o apilarse
- Navegación es principalmente vertical y secuencial

**Expectativa funcional:** El usuario puede acceder a toda la información, pero requiere navegación secuencial y apilado vertical. Un elemento a la vez tiene foco principal.

---

## 3. Root (`/`) — Comportamiento Responsive

### 3.1 Estructura Funcional del Root

El root presenta:
- **Lista de pacientes** — Elemento principal
- **Estadísticas operativas** — Cantidad de pacientes (activos/inactivos)
- **Turnos próximos 7 días** — Recorte temporal de agenda

**Referencia:** Ver `25_root_behavior_spec.md` para la definición completa del root.

### 3.2 Comportamiento en Pantalla Grande (Desktop)

#### 3.2.1 Visibilidad de Elementos

| Elemento | Visibilidad | Ubicación |
|----------|-------------|-----------|
| **Lista de pacientes** | Siempre visible | Columna principal (mayor ancho) |
| **Estadísticas operativas** | Siempre visible | Columna secundaria o panel lateral |
| **Turnos próximos** | Siempre visible | Columna secundaria o panel lateral |

**Regla:** Todos los elementos están simultáneamente visibles sin necesidad de scroll horizontal.

#### 3.2.2 Prioridad de Información

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Lista de pacientes | Es el elemento principal del root |
| **2 (Alta)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **3 (Media)** | Estadísticas operativas | Proporciona contexto pero no es acción primaria |

#### 3.2.3 Reglas de Colapso o Apilado

**No aplica:** En pantalla grande, no se requiere colapso ni apilado. Todos los elementos están visibles simultáneamente.

### 3.3 Comportamiento en Pantalla Mediana (Tablet / Laptop Chico)

#### 3.3.1 Visibilidad de Elementos

| Elemento | Visibilidad | Comportamiento |
|----------|-------------|---------------|
| **Lista de pacientes** | Siempre visible | Columna principal, puede ocupar ancho completo o parcial |
| **Estadísticas operativas** | Siempre visible | Puede estar en columna secundaria o apilada debajo |
| **Turnos próximos** | Siempre visible | Puede estar en columna secundaria o apilada debajo |

**Regla:** Todos los elementos están visibles, pero pueden requerir scroll vertical para acceder a todos.

#### 3.3.2 Prioridad de Información

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Lista de pacientes | Es el elemento principal del root |
| **2 (Alta)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **3 (Media)** | Estadísticas operativas | Proporciona contexto pero no es acción primaria |

#### 3.3.3 Reglas de Colapso o Apilado

**Apilado vertical permitido:**
- Las estadísticas operativas pueden apilarse debajo de la lista de pacientes
- Los turnos próximos pueden apilarse debajo de las estadísticas
- El orden de apilado respeta la prioridad: lista primero, luego turnos, luego estadísticas

**Colapso no requerido:** No se requiere colapsar elementos en pantalla mediana, solo reorganizar.

### 3.4 Comportamiento en Pantalla Pequeña (Mobile)

#### 3.4.1 Visibilidad de Elementos

| Elemento | Visibilidad | Comportamiento |
|----------|-------------|---------------|
| **Lista de pacientes** | Siempre visible | Ocupa ancho completo, elemento principal |
| **Estadísticas operativas** | Siempre visible | Apilada debajo de lista, puede requerir scroll |
| **Turnos próximos** | Siempre visible | Apilada debajo de estadísticas, puede requerir scroll |

**Regla:** Todos los elementos están visibles, pero requieren scroll vertical para acceder a todos. La lista de pacientes es lo primero que se ve.

#### 3.4.2 Prioridad de Información

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Lista de pacientes | Es el elemento principal del root |
| **2 (Alta)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **3 (Media)** | Estadísticas operativas | Proporciona contexto pero no es acción primaria |

#### 3.4.3 Reglas de Colapso o Apilado

**Apilado vertical obligatorio:**
- Lista de pacientes en la parte superior
- Turnos próximos debajo de la lista
- Estadísticas operativas debajo de los turnos

**Colapso no permitido:** Ningún elemento se oculta completamente. Todos están accesibles mediante scroll vertical.

#### 3.4.4 Acceso a la Lista de Pacientes

**Regla:** La lista de pacientes es siempre el primer elemento visible y accesible en pantalla pequeña.

**Comportamiento:**
- Al cargar el root en mobile, la lista de pacientes está en la parte superior
- No se requiere scroll para ver el inicio de la lista
- La lista es completamente funcional (búsqueda, selección) en mobile

### 3.5 Reglas Transversales del Root

#### 3.5.1 Qué Nunca Se Oculta

| Elemento | Regla |
|----------|-------|
| **Lista de pacientes** | Nunca se oculta, siempre visible |
| **Acceso a búsqueda de pacientes** | Nunca se oculta, siempre accesible |
| **Acceso a selección de paciente** | Nunca se oculta, siempre accesible |

**Justificación:** La lista de pacientes es el elemento principal del root. Sin ella, el root no cumple su propósito.

#### 3.5.2 Qué Puede Reubicarse

| Elemento | Regla de Reubicación |
|----------|---------------------|
| **Estadísticas operativas** | Puede moverse de columna lateral a apilado vertical |
| **Turnos próximos** | Puede moverse de columna lateral a apilado vertical |
| **Orden de apilado** | Respeta prioridad: lista, turnos, estadísticas |

**Justificación:** La reubicación mantiene la información accesible mientras optimiza el uso del espacio.

#### 3.5.3 Qué No Debe Mostrarse Simultáneamente en Mobile

**Regla:** En pantalla pequeña, la lista de pacientes y las estadísticas/turnos no deben competir por espacio horizontal.

**Comportamiento:**
- La lista de pacientes ocupa el ancho completo
- Las estadísticas y turnos se apilan debajo
- No hay columnas laterales en mobile

**Justificación:** En mobile, el espacio horizontal es limitado. El apilado vertical asegura legibilidad y usabilidad.

---

## 4. Lista de Pacientes — Responsive

### 4.1 Comportamiento en Desktop (Lista Persistente)

#### 4.1.1 Características Funcionales

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Lista siempre visible, puede estar en columna lateral o principal |
| **Persistencia** | La lista permanece visible durante la selección y navegación |
| **Búsqueda** | Campo de búsqueda siempre visible y accesible |
| **Selección** | Selección de paciente mantiene la lista visible |

**Regla:** La lista de pacientes es un elemento persistente que no se oculta al seleccionar un paciente.

#### 4.1.2 Integración con Otras Vistas

**En el root:**
- La lista está visible junto con estadísticas y turnos
- La selección de paciente navega a la vista del paciente, pero la lista permanece en el root

**En la vista del paciente:**
- La lista puede estar visible en una columna lateral
- La lista puede colapsarse pero no desaparece completamente

### 4.2 Comportamiento en Tablet

#### 4.2.1 Características Funcionales

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Lista puede estar en columna lateral o principal según espacio |
| **Persistencia** | La lista puede colapsarse pero permanece accesible |
| **Búsqueda** | Campo de búsqueda siempre visible y accesible |
| **Selección** | Selección de paciente puede ocultar la lista temporalmente si es necesario |

**Regla:** La lista de pacientes es accesible, pero puede requerir una acción (expandir/colapsar) para alternar con el contenido del paciente.

#### 4.2.2 Alternancia de Vistas

**Comportamiento permitido:**
- La lista y la vista del paciente pueden alternarse
- Un botón o acción permite volver a la lista
- La lista no se pierde, solo se oculta temporalmente

### 4.3 Comportamiento en Mobile

#### 4.3.1 Selección de Paciente

**Regla fundamental:** Un paciente a la vez en pantallas pequeñas.

| Acción | Comportamiento |
|--------|----------------|
| **Ver lista de pacientes** | Lista ocupa ancho completo, es el único elemento visible |
| **Seleccionar paciente** | La lista se oculta, se muestra la vista del paciente |
| **Volver a la lista** | Botón "Volver" o "Lista de pacientes" restaura la lista |

**Justificación:** En mobile, el espacio es limitado. Mostrar lista y paciente simultáneamente compromete la legibilidad y usabilidad.

#### 4.3.2 Navegación de Ida y Vuelta

**Flujo de navegación:**

1. **Estado inicial:** Lista de pacientes visible
2. **Selección:** Usuario selecciona un paciente
3. **Transición:** Lista se oculta, vista del paciente se muestra
4. **Navegación de vuelta:** Usuario activa "Volver" o "Lista de pacientes"
5. **Restauración:** Lista de pacientes se restaura, manteniendo estado de búsqueda si aplica

**Reglas:**
- El estado de búsqueda se preserva al navegar al paciente
- El estado de búsqueda se preserva al volver a la lista
- La posición de scroll en la lista se puede preservar (opcional, no requerido)

#### 4.3.3 Regla de Foco

**Regla:** Un paciente a la vez en pantallas pequeñas.

| Escenario | Comportamiento |
|-----------|----------------|
| **Lista visible** | Solo la lista tiene foco, no hay vista de paciente visible |
| **Paciente visible** | Solo la vista del paciente tiene foco, la lista está oculta |
| **Transición** | La transición es clara y no genera confusión sobre qué está visible |

**Justificación:** El foco único reduce la confusión y mejora la legibilidad en pantallas pequeñas.

### 4.4 Reglas Transversales de la Lista de Pacientes

#### 4.4.1 Funcionalidad Preservada

| Funcionalidad | Regla |
|---------------|-------|
| **Búsqueda** | Siempre accesible, independientemente del tamaño de pantalla |
| **Filtrado** | Siempre accesible, independientemente del tamaño de pantalla |
| **Selección** | Siempre funcional, independientemente del tamaño de pantalla |
| **Ordenamiento** | Siempre accesible, independientemente del tamaño de pantalla |

**Justificación:** La funcionalidad de la lista no cambia con el tamaño de pantalla. Solo cambia la presentación.

#### 4.4.2 Información Preservada

| Información | Regla |
|-------------|-------|
| **Nombre del paciente** | Siempre visible en todos los tamaños |
| **Identificador** | Siempre visible en todos los tamaños (puede estar abreviado en mobile) |
| **Estado (Activo/Inactivo)** | Siempre visible en todos los tamaños |
| **Información adicional** | Puede estar abreviada en mobile, pero accesible |

**Justificación:** La información esencial del paciente no se pierde al reducir el tamaño de pantalla.

---

## 5. Timeline Clínica — Responsive

### 5.1 Estructura Funcional de la Timeline

La timeline clínica presenta:
- **Información del paciente** (header) — Contexto permanente
- **Timeline de eventos** — Eventos NOTE y Encounter en orden cronológico
- **Paneles laterales** (opcional) — Medicamentos, turnos, notas, información del paciente

**Referencia:** Ver `25_patient_info_timeline_view.md` para la definición completa de la información del paciente en la timeline.

### 5.2 Orden de Información en Mobile

#### 5.2.1 Prioridad de Presentación

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Información del paciente (header) | Contexto permanente, identificación |
| **2 (Alta)** | Timeline de eventos | Contenido clínico principal |
| **3 (Media)** | Paneles laterales | Información de acceso rápido, puede colapsarse |

**Regla:** El orden de presentación en mobile respeta esta prioridad, apilando verticalmente.

#### 5.2.2 Apilado Vertical

**Orden de apilado en mobile:**

1. **Header del paciente** (siempre visible, fijo o sticky)
   - Nombre completo
   - Edad
   - Fecha de nacimiento
   - Estado

2. **Timeline de eventos** (contenido principal, scrollable)
   - Eventos en orden cronológico
   - Scroll vertical para navegar eventos

3. **Paneles laterales** (acceso rápido, pueden colapsarse)
   - Panel de medicamentos
   - Panel de turnos
   - Panel de notas
   - Panel de información del paciente

**Regla:** El apilado vertical mantiene el orden semántico y la prioridad clínica.

### 5.3 Comportamiento del Bloque de Información del Paciente

#### 5.3.1 En Pantalla Grande

| Característica | Comportamiento |
|----------------|----------------|
| **Ubicación** | Header fijo en la parte superior |
| **Visibilidad** | Siempre visible, no requiere scroll |
| **Panel de información** | Panel lateral siempre visible o accesible |

#### 5.3.2 En Pantalla Mediana

| Característica | Comportamiento |
|----------------|----------------|
| **Ubicación** | Header fijo o sticky en la parte superior |
| **Visibilidad** | Siempre visible, puede requerir scroll mínimo |
| **Panel de información** | Panel lateral puede colapsarse o apilarse debajo |

#### 5.3.3 En Pantalla Pequeña

| Característica | Comportamiento |
|----------------|----------------|
| **Ubicación** | Header sticky en la parte superior |
| **Visibilidad** | Siempre visible al hacer scroll hacia arriba |
| **Panel de información** | Panel apilado debajo de la timeline, puede colapsarse |

**Regla:** La información del paciente siempre está accesible, pero puede requerir scroll en mobile para ver el panel completo.

### 5.4 Visibilidad de Eventos NOTE y Encounter

#### 5.4.1 Regla Fundamental

**Regla:** Todos los eventos NOTE y Encounter son siempre visibles y accesibles, independientemente del tamaño de pantalla.

| Tipo de Evento | Visibilidad | Accesibilidad |
|----------------|-------------|---------------|
| **Eventos NOTE** | Siempre visibles | Siempre accesibles mediante scroll |
| **Eventos Encounter** | Siempre visibles | Siempre accesibles mediante scroll |

**Justificación:** Los eventos clínicos son el contenido principal de la timeline. No se ocultan ni se filtran por tamaño de pantalla.

#### 5.4.2 Presentación en Mobile

**Comportamiento:**
- Los eventos se apilan verticalmente
- Cada evento ocupa el ancho completo disponible
- El scroll vertical permite navegar todos los eventos
- No hay limitación en la cantidad de eventos visibles

**Regla:** La timeline nunca se fragmenta. Todos los eventos están en un solo flujo vertical.

### 5.5 Scroll y Jerarquía Temporal

#### 5.5.1 Dirección de Scroll

| Tamaño de Pantalla | Dirección de Scroll | Justificación |
|---------------------|---------------------|---------------|
| **Desktop** | Vertical (principal) | Orden cronológico vertical es estándar |
| **Tablet** | Vertical (principal) | Orden cronológico vertical es estándar |
| **Mobile** | Vertical (único) | Orden cronológico vertical, sin scroll horizontal |

**Regla:** El scroll es siempre vertical. No se introduce scroll horizontal en ningún tamaño de pantalla.

#### 5.5.2 Jerarquía Temporal

**Regla:** La timeline nunca se fragmenta.

| Aspecto | Regla |
|---------|-------|
| **Orden cronológico** | Se mantiene en todos los tamaños |
| **Fragmentación** | No se permite fragmentar la timeline en múltiples columnas o secciones |
| **Continuidad** | La timeline es un flujo continuo de eventos |

**Justificación:** La fragmentación de la timeline compromete la comprensión del flujo temporal y la narrativa clínica.

#### 5.5.3 Navegación Temporal

| Funcionalidad | Comportamiento Responsive |
|---------------|---------------------------|
| **Navegación a fecha específica** | Siempre accesible, puede requerir menú o botón en mobile |
| **Filtrado por fecha** | Siempre accesible, puede requerir menú o botón en mobile |
| **Ordenamiento** | Siempre accesible, puede requerir menú o botón en mobile |

**Regla:** Las funcionalidades de navegación temporal no se ocultan, pero pueden requerir más interacciones en mobile.

### 5.6 Reglas Transversales de la Timeline

#### 5.6.1 La Timeline Nunca Se Fragmenta

**Regla explícita:** La timeline de eventos es un flujo continuo y único. No se divide en múltiples columnas, secciones separadas, o vistas alternativas.

**Justificación:** La fragmentación compromete la comprensión del orden temporal y la narrativa clínica longitudinal.

#### 5.6.2 Los Eventos Mantienen Orden Cronológico

**Regla explícita:** El orden cronológico de los eventos se mantiene en todos los tamaños de pantalla, independientemente de cómo se reorganice la información circundante.

**Justificación:** El orden cronológico es fundamental para la comprensión clínica. No cambia con el tamaño de pantalla.

---

## 6. Vista de Nota Clínica — Responsive

### 6.1 Estructura Funcional de la Nota Clínica

Una nota clínica contiene:
- **Información del encuentro** — Fecha, tipo de encuentro
- **Contenido estructurado** — Subjetivo, Objetivo, Evaluación, Plan
- **Addenda** (si aplica) — Correcciones o ampliaciones
- **Acciones** — Finalizar (si es borrador), Agregar addendum (si está finalizada), Volver

**Referencia:** Ver `22_nota_clinica_evento_note.md` y `19_clinical_corrections_ux.md` para la definición completa de notas clínicas.

### 6.2 Prioridad del Contenido Textual

#### 6.2.1 Jerarquía de Prioridad

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Contenido de la nota (Subjetivo, Objetivo, Evaluación, Plan) | Es el contenido clínico principal |
| **2 (Alta)** | Información del encuentro (fecha, tipo) | Contexto necesario para interpretar la nota |
| **3 (Media)** | Addenda | Información adicional, importante pero secundaria |
| **4 (Baja)** | Metadatos (fechas de creación, finalización) | Información de soporte, no crítica para lectura |

**Regla:** El orden de presentación en mobile respeta esta prioridad, mostrando primero el contenido clínico.

#### 6.2.2 Apilado Vertical en Mobile

**Orden de apilado:**

1. **Información del encuentro** (header)
   - Fecha de encuentro
   - Tipo de encuentro
   - Estado (Borrador/Finalizada)

2. **Contenido estructurado** (contenido principal)
   - Subjetivo
   - Objetivo
   - Evaluación
   - Plan

3. **Addenda** (si aplica)
   - Cada addendum apilado en orden cronológico

4. **Acciones** (footer o sticky)
   - Botones de acción siempre accesibles

**Regla:** El apilado vertical asegura que el contenido clínico sea lo primero que se ve y lee.

### 6.3 Lectura Cómoda en Mobile

#### 6.3.1 Legibilidad del Texto

| Aspecto | Regla |
|---------|-------|
| **Tamaño de fuente** | Debe ser legible sin zoom en mobile |
| **Ancho de línea** | Debe optimizarse para lectura en mobile (no demasiado ancho ni estrecho) |
| **Espaciado** | Debe haber espaciado adecuado entre secciones |
| **Contraste** | Debe cumplir estándares de accesibilidad |

**Justificación:** La lectura de contenido clínico en mobile debe ser cómoda y sin fricción.

#### 6.3.2 Navegación del Contenido

| Funcionalidad | Comportamiento |
|---------------|----------------|
| **Scroll vertical** | Permite navegar todo el contenido de la nota |
| **Saltos a secciones** | Puede incluir enlaces o navegación a secciones específicas (opcional, no requerido) |
| **Preservación de posición** | La posición de scroll puede preservarse al volver a la nota (opcional, no requerido) |

**Regla:** El contenido completo de la nota es accesible mediante scroll vertical en mobile.

### 6.4 Acciones Visibles (Finalizar, Volver)

#### 6.4.1 Acciones Críticas

| Acción | Visibilidad | Comportamiento |
|--------|-------------|----------------|
| **Finalizar nota** (si es borrador) | Siempre visible y accesible | Puede estar en footer sticky en mobile |
| **Agregar addendum** (si está finalizada) | Siempre visible y accesible | Puede estar en footer sticky en mobile |
| **Volver a timeline** | Siempre visible y accesible | Puede estar en header o footer sticky en mobile |

**Regla:** Las acciones críticas nunca se ocultan. Pueden requerir scroll para acceder, pero están siempre presentes.

#### 6.4.2 Ubicación de Acciones en Mobile

**Comportamiento permitido:**
- Las acciones pueden estar en un footer sticky (siempre visible al hacer scroll hacia abajo)
- Las acciones pueden estar en un header sticky (siempre visible al hacer scroll hacia arriba)
- Las acciones pueden estar al final del contenido (requieren scroll, pero están presentes)

**Regla:** Las acciones están siempre accesibles, aunque puedan requerir scroll en mobile.

### 6.5 Restricciones de Edición en Pantallas Pequeñas

#### 6.5.1 Edición de Notas Borrador

| Aspecto | Regla |
|---------|-------|
| **Funcionalidad de edición** | Completa y funcional en mobile |
| **Optimización** | Puede no estar optimizada para carga extensa de texto, pero es funcional |
| **Validación** | Idéntica a desktop, sin simplificaciones |

**Justificación:** La edición en mobile es funcional, pero puede no ser la experiencia óptima para carga extensa de contenido.

#### 6.5.2 Restricciones No Aplicables

**Regla:** No se introducen restricciones funcionales en mobile que no existan en desktop.

| Funcionalidad | Restricción en Mobile |
|---------------|----------------------|
| **Editar campos** | No restringida |
| **Finalizar nota** | No restringida |
| **Agregar addendum** | No restringida |
| **Validaciones** | No simplificadas |

**Justificación:** El modelo funcional no cambia con el tamaño de pantalla. Solo cambia la presentación.

---

## 7. Estadísticas Operativas — Responsive

### 7.1 Estructura Funcional de las Estadísticas

Las estadísticas operativas en el root incluyen:
- **Gráfico de pacientes** — Cantidad de pacientes activos/inactivos
- **Listado de turnos próximos** — Turnos agendados para los próximos 7 días

**Referencia:** Ver `25_root_behavior_spec.md` para la definición completa de las estadísticas operativas.

### 7.2 Comportamiento del Gráfico de Pacientes

#### 7.2.1 En Pantalla Grande

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible en columna lateral o panel |
| **Tamaño** | Puede ser de tamaño completo sin restricciones |
| **Interactividad** | Puede incluir interactividad si está definida (no requerida) |

#### 7.2.2 En Pantalla Mediana

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, puede estar apilada |
| **Tamaño** | Puede reducirse pero mantiene legibilidad |
| **Interactividad** | Se preserva si existe |

#### 7.2.3 En Pantalla Pequeña

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, apilada debajo de lista y turnos |
| **Tamaño** | Puede reducirse pero mantiene legibilidad esencial |
| **Interactividad** | Se preserva si existe, puede adaptarse a touch |

**Regla:** El gráfico nunca se oculta completamente. Puede reducirse en tamaño pero mantiene la información esencial visible.

### 7.3 Comportamiento del Listado de Turnos Próximos

#### 7.3.1 En Pantalla Grande

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible en columna lateral o panel |
| **Cantidad de turnos** | Puede mostrar todos los turnos sin scroll |
| **Información por turno** | Completa (fecha, hora, paciente) |

#### 7.3.2 En Pantalla Mediana

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, puede estar apilada |
| **Cantidad de turnos** | Puede requerir scroll para ver todos |
| **Información por turno** | Completa (fecha, hora, paciente) |

#### 7.3.3 En Pantalla Pequeña

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, apilada debajo de lista |
| **Cantidad de turnos** | Requiere scroll para ver todos |
| **Información por turno** | Completa (fecha, hora, paciente), puede estar en formato más compacto |

**Regla:** El listado de turnos nunca se oculta completamente. Todos los turnos son accesibles mediante scroll.

### 7.4 Qué Métricas Se Muestran Primero

#### 7.4.1 Prioridad de Presentación

| Prioridad | Métrica | Justificación |
|-----------|---------|---------------|
| **1 (Máxima)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **2 (Alta)** | Cantidad de pacientes (gráfico) | Proporciona contexto operativo |

**Regla:** En mobile, los turnos próximos se muestran antes que el gráfico de pacientes, respetando la prioridad funcional.

### 7.5 Qué Métricas Pueden Resumirse

#### 7.5.1 Resumen Permitido

| Métrica | Resumen Permitido | Formato de Resumen |
|---------|-------------------|-------------------|
| **Cantidad de pacientes** | Sí, puede mostrarse como número en lugar de gráfico | "X activos, Y inactivos" |
| **Turnos próximos** | No, se muestran todos los turnos | Lista completa, scrollable |

**Regla:** Las métricas pueden resumirse visualmente (gráfico → número), pero la información completa sigue accesible.

#### 7.5.2 Resumen No Permitido

**Regla:** No se permite ocultar métricas completamente ni reducir la información mostrada más allá del resumen visual.

| Métrica | Restricción |
|---------|-------------|
| **Cantidad de pacientes** | No se oculta, solo se puede resumir visualmente |
| **Turnos próximos** | No se oculta, todos los turnos son accesibles |

### 7.6 Reglas Transversales de las Estadísticas

#### 7.6.1 No Se Pierden Métricas

**Regla explícita:** Todas las métricas mostradas en desktop están disponibles en mobile. No se ocultan métricas por tamaño de pantalla.

**Justificación:** Las estadísticas operativas proporcionan contexto importante. Perder métricas compromete la orientación diaria.

#### 7.6.2 Se Reorganizan, No Se Eliminan

**Regla explícita:** Las métricas se reorganizan (apilado vertical, resumen visual), pero no se eliminan ni se ocultan permanentemente.

**Justificación:** La reorganización mantiene la información accesible mientras optimiza el uso del espacio.

---

## 8. Reglas Transversales

### 8.1 No Duplicar Información en Distintos Lugares

**Regla:** La información no se duplica en múltiples lugares para compensar limitaciones de espacio.

| Escenario Problemático | Regla |
|------------------------|-------|
| **Mostrar información del paciente en header y panel** | Permitido (son contextos diferentes: header = identidad, panel = detalles) |
| **Duplicar eventos en múltiples secciones** | No permitido |
| **Repetir acciones en múltiples lugares** | No permitido (excepto acciones críticas que pueden estar en header y footer) |

**Justificación:** La duplicación genera confusión y aumenta la complejidad de mantenimiento.

### 8.2 No Esconder Acciones Críticas

**Regla:** Las acciones críticas nunca se ocultan completamente, independientemente del tamaño de pantalla.

| Acción Crítica | Regla de Visibilidad |
|----------------|---------------------|
| **Seleccionar paciente** | Siempre accesible |
| **Finalizar nota** | Siempre accesible |
| **Agregar addendum** | Siempre accesible |
| **Volver a lista** | Siempre accesible |
| **Navegar a timeline** | Siempre accesible |

**Justificación:** Las acciones críticas son esenciales para el flujo de trabajo clínico. Ocultarlas compromete la usabilidad.

### 8.3 No Generar Confusión Entre Contexto y Eventos

**Regla:** La información contextual (información del paciente) y los eventos clínicos (timeline) deben mantenerse claramente diferenciados en todos los tamaños de pantalla.

| Aspecto | Regla |
|---------|-------|
| **Separación visual** | Debe mantenerse en todos los tamaños |
| **Separación funcional** | Debe mantenerse en todos los tamaños |
| **Claridad de propósito** | Debe mantenerse en todos los tamaños |

**Justificación:** La confusión entre contexto y eventos compromete la comprensión clínica y la precisión de la documentación.

### 8.4 Mantener Consistencia Semántica y Clínica

**Regla:** El significado semántico y la organización clínica de la información se mantiene en todos los tamaños de pantalla.

| Aspecto | Regla |
|---------|-------|
| **Orden semántico** | Se mantiene (información del paciente → timeline → paneles) |
| **Jerarquía clínica** | Se mantiene (eventos más recientes primero, orden cronológico) |
| **Agrupación lógica** | Se mantiene (eventos NOTE juntos, eventos Encounter juntos) |

**Justificación:** La consistencia semántica y clínica asegura que el sistema sea predecible y comprensible en todos los contextos de uso.

---

## 9. Impacto en UX Clínico

### 9.1 Reducción de Errores de Navegación

#### 9.1.1 Claridad de Foco

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Reducción de confusión sobre qué está visible** | Foco único en mobile (un elemento a la vez) |
| **Reducción de errores de selección** | Lista de pacientes clara y accesible en todos los tamaños |
| **Reducción de navegación errónea** | Acciones críticas siempre visibles y accesibles |

**Impacto:** El clínico tiene menos probabilidad de cometer errores de navegación cuando el foco es claro y las acciones son accesibles.

#### 9.1.2 Preservación de Contexto

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Información del paciente siempre visible** | Header sticky o fijo en todos los tamaños |
| **Estado de navegación claro** | Transiciones claras entre vistas en mobile |
| **Acceso rápido a información contextual** | Paneles laterales accesibles (colapsables pero no ocultos) |

**Impacto:** El clínico mantiene el contexto del paciente incluso al navegar en mobile, reduciendo errores de identificación.

### 9.2 Continuidad del Trabajo Entre Dispositivos

#### 9.2.1 Consistencia Funcional

| Aspecto | Beneficio |
|---------|----------|
| **Mismo comportamiento clínico** | El clínico puede cambiar de dispositivo sin re-aprender el sistema |
| **Misma información disponible** | Toda la información está disponible en todos los dispositivos |
| **Mismos flujos de trabajo** | Los flujos son idénticos, solo cambia la presentación |

**Impacto:** El clínico puede continuar su trabajo en diferentes dispositivos sin interrupciones o confusiones.

#### 9.2.2 Preservación de Estado

| Aspecto | Beneficio |
|---------|----------|
| **Estado de búsqueda preservado** | Al volver a la lista, la búsqueda se mantiene |
| **Posición en timeline preservable** | El clínico puede retomar donde dejó (opcional, no requerido) |
| **Contexto del paciente preservado** | La información del paciente está siempre disponible |

**Impacto:** El clínico puede retomar su trabajo sin perder contexto o tener que re-navegar.

### 9.3 Claridad de Foco en Cada Tamaño de Pantalla

#### 9.3.1 Foco Único en Mobile

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Reducción de distracciones** | Un elemento a la vez tiene foco principal |
| **Mejora de legibilidad** | Contenido ocupa ancho completo, optimizado para lectura |
| **Claridad de acción** | Acciones críticas claramente visibles y accesibles |

**Impacto:** El clínico puede concentrarse en una tarea a la vez en mobile, mejorando la precisión y eficiencia.

#### 9.3.2 Foco Múltiple en Desktop

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Vista panorámica** | Múltiples elementos visibles simultáneamente |
| **Acceso rápido a contexto** | Paneles laterales siempre visibles |
| **Eficiencia en navegación** | Menos interacciones necesarias para acceder a información |

**Impacto:** El clínico puede trabajar de manera más eficiente en desktop, aprovechando el espacio disponible.

---

## 10. Casos Fuera de Alcance

### 10.1 Aplicación Móvil Nativa

**Fuera de alcance:** Esta especificación no define el comportamiento de una aplicación móvil nativa.

| Aspecto | Alcance de esta Especificación |
|---------|-------------------------------|
| **Aplicación web responsive** | Dentro del alcance |
| **Aplicación móvil nativa (iOS/Android)** | Fuera del alcance |
| **Progressive Web App (PWA)** | Fuera del alcance (puede considerarse en el futuro) |

**Justificación:** Esta especificación se enfoca en el comportamiento responsive de la aplicación web existente, no en aplicaciones nativas.

### 10.2 Gestos Avanzados

**Fuera de alcance:** Esta especificación no define el uso de gestos avanzados (swipe, pinch, etc.).

| Gestos | Alcance |
|--------|---------|
| **Clic/tap** | Dentro del alcance (interacción estándar) |
| **Scroll** | Dentro del alcance (navegación estándar) |
| **Swipe** | Fuera del alcance |
| **Pinch to zoom** | Fuera del alcance (comportamiento del navegador) |
| **Gestos personalizados** | Fuera del alcance |

**Justificación:** Esta especificación se enfoca en el comportamiento funcional responsive, no en interacciones avanzadas con gestos.

### 10.3 Modo Offline

**Fuera de alcance:** Esta especificación no define el comportamiento del sistema en modo offline.

| Aspecto | Alcance |
|---------|---------|
| **Funcionalidad online** | Dentro del alcance |
| **Funcionalidad offline** | Fuera del alcance |
| **Sincronización** | Fuera del alcance |
| **Caché local** | Fuera del alcance |

**Justificación:** Esta especificación asume conectividad a internet. El modo offline es una funcionalidad futura que requiere especificación separada.

### 10.4 Personalización por Usuario

**Fuera de alcance:** Esta especificación no define personalización de la experiencia responsive por usuario.

| Aspecto | Alcance |
|---------|---------|
| **Comportamiento estándar responsive** | Dentro del alcance |
| **Personalización de layout** | Fuera del alcance |
| **Preferencias de usuario** | Fuera del alcance |
| **Configuración de breakpoints** | Fuera del alcance |

**Justificación:** Esta especificación define el comportamiento responsive estándar del sistema. La personalización es una funcionalidad futura que requiere especificación separada.

---

## 11. Restricciones

### 11.1 No Modificar Modelo de Datos

**Restricción:** Esta especificación no requiere ni permite modificaciones al modelo de datos.

| Aspecto | Regla |
|---------|-------|
| **Entidades existentes** | No se modifican |
| **Relaciones existentes** | No se modifican |
| **Campos existentes** | No se modifican |
| **Nuevas entidades** | No se crean |

**Justificación:** Esta especificación define comportamiento de presentación, no cambios al dominio.

### 11.2 No Alterar Comportamiento Clínico

**Restricción:** Esta especificación no altera el comportamiento clínico del sistema.

| Aspecto | Regla |
|---------|-------|
| **Reglas de negocio** | No se modifican |
| **Validaciones** | No se modifican |
| **Flujos de trabajo clínicos** | No se modifican |
| **Generación de eventos** | No se modifica |

**Justificación:** El comportamiento clínico es independiente del tamaño de pantalla. Solo cambia la presentación.

### 11.3 No Introducir Nuevas Vistas

**Restricción:** Esta especificación no introduce nuevas vistas o pantallas.

| Aspecto | Regla |
|---------|-------|
| **Vistas existentes** | Se adaptan responsive, no se crean nuevas |
| **Nuevas pantallas** | No se crean |
| **Vistas alternativas** | No se crean (solo reorganización de vistas existentes) |

**Justificación:** Esta especificación define la adaptación de vistas existentes, no la creación de nuevas funcionalidades.

### 11.4 No Definir UI Concreta ni Breakpoints Técnicos

**Restricción:** Esta especificación no define implementación técnica concreta.

| Aspecto | Regla |
|---------|-------|
| **Breakpoints en píxeles** | No se definen |
| **Componentes específicos** | No se definen |
| **CSS concreto** | No se define |
| **Framework de UI** | No se especifica |

**Justificación:** Esta especificación es funcional, no técnica. La implementación queda para el equipo de desarrollo.

### 11.5 No Cambiar Stack Tecnológico

**Restricción:** Esta especificación no requiere cambios al stack tecnológico.

| Aspecto | Regla |
|---------|-------|
| **Tecnologías existentes** | Se mantienen |
| **Nuevas tecnologías** | No se introducen |
| **Dependencias** | No se modifican (excepto actualizaciones normales) |

**Justificación:** Esta especificación define comportamiento funcional, no cambios tecnológicos.

---

## 12. Relación con Otras Especificaciones

### 12.1 Dependencias

Esta especificación depende de:

- **`25_root_behavior_spec.md`** — Define el comportamiento funcional del root que se adapta responsive
- **`18_patient_crud_specs.md`** — Define el comportamiento de la lista de pacientes que se adapta responsive
- **`25_patient_info_timeline_view.md`** — Define la información del paciente en la timeline que se adapta responsive
- **`22_nota_clinica_evento_note.md`** — Define las notas clínicas que se adaptan responsive
- **`19_clinical_corrections_ux.md`** — Define el flujo de correcciones que se adapta responsive

### 12.2 Consumidores

Esta especificación es consumida por:

- **Implementación de Frontend** — Define cómo deben adaptarse los componentes a diferentes tamaños
- **Diseño de UX** — Define las expectativas de experiencia responsive
- **QA Testing** — Define los casos de prueba para validar el comportamiento responsive

### 12.3 Integración con Otras Funcionalidades

Esta especificación se integra con todas las vistas del sistema:

| Vista | Punto de Integración |
|-------|---------------------|
| **Root (`/`)** | Adaptación de lista de pacientes, estadísticas y turnos |
| **Lista de Pacientes** | Adaptación de búsqueda, selección y navegación |
| **Timeline Clínica** | Adaptación de información del paciente, eventos y paneles laterales |
| **Vista de Nota Clínica** | Adaptación de contenido, addenda y acciones |
| **Estadísticas Operativas** | Adaptación de gráficos y listados |

---

## 13. Garantías Funcionales

### 13.1 Garantías de Comportamiento Responsive

El sistema garantiza que:

| Garantía | Descripción |
|----------|-------------|
| **Información Completa Accesible** | Toda la información disponible en desktop está accesible en mobile |
| **Funcionalidad Preservada** | Toda la funcionalidad disponible en desktop está disponible en mobile |
| **Orden Semántico Mantenido** | El orden semántico y clínico se mantiene en todos los tamaños |
| **Legibilidad Asegurada** | El contenido clínico es legible en todos los tamaños de pantalla |

### 13.2 Garantías de No Comportamiento

El sistema garantiza que el comportamiento responsive:

| Garantía | Descripción |
|----------|-------------|
| **No oculta información clínica** | Nunca se oculta información clínica por tamaño de pantalla |
| **No oculta acciones críticas** | Nunca se ocultan acciones críticas por tamaño de pantalla |
| **No fragmenta la timeline** | La timeline nunca se fragmenta en múltiples secciones |
| **No altera el modelo funcional** | El modelo funcional no cambia con el tamaño de pantalla |

---

## 14. Resumen

### 14.1 Objetivo de la Especificación

Esta especificación define el comportamiento funcional responsive del sistema de Historias Clínicas Psiquiátricas, asegurando:

1. **Usabilidad** — El sistema es usable en todos los tamaños de pantalla
2. **Claridad clínica** — La información clínica es clara y legible en todos los tamaños
3. **Continuidad de flujo** — El flujo de trabajo clínico se mantiene en todos los tamaños
4. **Preservación de información** — Toda la información clínica y administrativa está accesible

### 14.2 Principios Fundamentales

1. **Legibilidad clínica prima sobre densidad** — El sistema es clínico, la legibilidad es prioritaria
2. **El paciente es el eje central** — Independientemente del tamaño de pantalla
3. **La información no se pierde** — Se reorganiza, no se oculta
4. **Mobile es para consulta** — No para carga intensiva
5. **El modelo funcional no cambia** — Solo cambia la presentación

### 14.3 Comportamiento por Vista

| Vista | Comportamiento Responsive |
|-------|---------------------------|
| **Root (`/`)** | Lista siempre visible, estadísticas y turnos se apilan en mobile |
| **Lista de Pacientes** | Persistente en desktop, alternante en tablet, única en mobile |
| **Timeline Clínica** | Información del paciente sticky, timeline scrollable, paneles apilados en mobile |
| **Vista de Nota Clínica** | Contenido apilado verticalmente, acciones siempre accesibles |
| **Estadísticas Operativas** | Gráficos y listados se apilan, información completa accesible |

### 14.4 Reglas Transversales

1. **No duplicar información** — La información no se duplica en múltiples lugares
2. **No esconder acciones críticas** — Las acciones críticas siempre están accesibles
3. **No generar confusión** — Contexto y eventos se mantienen diferenciados
4. **Mantener consistencia** — Consistencia semántica y clínica en todos los tamaños

---

*Versión del Documento: 1.0*  
*Estado: Final*  
*Depende De: 25_root_behavior_spec.md, 18_patient_crud_specs.md, 25_patient_info_timeline_view.md, 22_nota_clinica_evento_note.md, 19_clinical_corrections_ux.md*  
*Consumido Por: Implementación de Frontend, Diseño de UX, QA Testing*
