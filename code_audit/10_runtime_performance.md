# Auditoría de Performance en Runtime (Next.js App Router)

## Alcance y enfoque

Evaluación conceptual de performance en tiempo de ejecución (no build) para la aplicación de historias clínicas, con foco en experiencia real del usuario:

- **TTFB** (Time To First Byte)
- **Hidratación y carga en cliente**
- **Re-renders y manejo de estado**
- **Fetch duplicado o innecesario**
- **Uso de Server vs Client Components**
- **Impacto percibido en mobile**

Rutas y vistas analizadas:

- **Root** (`src/app/page.tsx`)
- **Lista de pacientes** (`src/app/patients/page.tsx`, `PatientSidebar`, `PatientList`)
- **Vista de paciente / Timeline / Notas** (páginas bajo `src/app/patients/[id]/...`, componentes `Timeline`, `NotesPanel`, `PatientDetailView`, `AppShell`)
- **Consultas a API y renderizado** (`src/app/api/**`, uso de `fetchAllPatientsForUI`, `fetchPatientForUI`, `PatientSidebar`)

La auditoría se basa exclusivamente en el código disponible, sin correr benchmarks ni asumir métricas concretas de latencia.

---

## 1. Root (`/`)

### 1.1. Carga inicial y TTFB

**Fuente del problema**

- La página root es un **Server Component async** que hace un `await fetchAllPatientsForUI()` antes de renderizar (`src/app/page.tsx`).
- El resultado (`allPatients`) se pasa al `AppShell` y al `PatientSidebar` como prop.

**Escenario típico**

- Un usuario entra a `/` para ver la vista general (estadísticas + próximos turnos).
- El TTFB queda acoplado al tiempo de respuesta de la consulta completa de pacientes, aunque el usuario en esa vista no necesariamente necesita ver la lista entera inmediatamente (la prioridad UX aquí son estadísticas y turnos).

**Impacto percibido**

- **TTFB mayor** cuando hay muchos pacientes o la base está bajo carga.
- En conexiones móviles con alta latencia, el usuario percibe que la página “tarda en aparecer”, aun si luego el contenido es liviano.

**Severidad**

- **Media**: no es un bloqueo crítico, pero impacta la sensación de “snappiness” del dashboard root.

**Recomendación conceptual**

- **Patrón de “Progressive Data Fetching” para la sidebar**:
  - Mantener la vista root como Server Component, pero desacoplar la carga de la lista completa de pacientes de la TTFB de la root.
  - Opciones conceptuales:
    - Cargar solo un **subset resumido** de pacientes para root (los más recientes / más consultados) y delegar el listado completo a la ruta `/patients`.
    - O bien, mover la carga pesada de pacientes a una sección client-side con **SWR / React Query / fetch client** que se hidrata después de pintar el esqueleto inicial.
- Priorizar que el **primer byte** y el **primer contenido significativo** correspondan a estadísticas y próximos turnos, que son el propósito principal de la ruta.

---

## 2. Lista de pacientes (`/patients`, `PatientSidebar`, `PatientList`)

### 2.1. Doble origen de datos (Server + Client) y fetch duplicado

**Fuente del problema**

- `/patients` es un **Server Component async** que hace `await fetchAllPatientsForUI()` y pasa `patients` al `AppShell` y `PatientSidebar`.
- `PatientSidebar` es un **Client Component (`'use client'`)** que:
  - Inicializa el estado con `initialPatients` (si se pasa).
  - También hace **fetch al endpoint `/api/patients` en el lado cliente** para carga inicial si no recibe `initialPatients` y para cualquier búsqueda.
- En la ruta root (`/`), también se pasa `patients` al `PatientSidebar`, por lo que existe una mezcla de escenarios “con datos de servidor” y “carga vía API cliente”.

**Escenario típico**

- En `/patients`, el usuario entra y la página Server ya trae todos los pacientes.
- Dependiendo de cómo se navegue dentro del App Router, es posible que:
  - El cliente igual dispare un `fetchPatients()` inicial desde `useEffect` si `initialPatients` no está presente o cambia,
  - O se produzcan **re-fetch redundantes** para obtener el mismo listado sin que el usuario haya interactuado.

**Impacto percibido**

- **Carga innecesaria de red** (duplicación de queries al backend) en ciertas transiciones.
- Posible **salto visual** si el estado inicial se construye con `initialPatients` y luego se reemplaza por el resultado de un nuevo fetch, especialmente en conexiones lentas.

**Severidad**

- **Media**: no rompe UX, pero desperdicia recursos y puede generar flicker.

**Recomendación conceptual**

- **Patrón “Single Source of Truth para el listado”**:
  - Elegir un enfoque dominante:
    - O bien el listado se resuelve **siempre en Server Component** y se pasa pre-renderizado (sin refetch cliente para carga inicial).
    - O bien la sidebar es **totalmente client-driven**, y el server solo entrega shell + datos mínimos (y se usa cacheo en cliente para evitar duplicaciones).
  - En ambos casos, usar un **mecanismo de cacheo** (SWR/React Query o caché del propio `fetch` de Next) para que las transiciones dentro del App Router reutilicen la lista ya cargada.

### 2.2. Hidratación de Sidebar rica en lógica

**Fuente del problema**

- `PatientSidebar` contiene:
  - Lógica de **estado local** (búsqueda, loading, error, isSearching).
  - Llamadas a API con `fetch` directo.
  - Gestión de distintos estados de UI (loading, empty, error, listado, contador).
- `AppShell` también es un **Client Component** con estado para el sidebar (abierto/cerrado) y layout completo.

**Escenario típico**

- En mobile, cada navegación a `/patients` o a vistas de paciente monta `AppShell` + `PatientSidebar`, que deben hidratarse (reconciliar el HTML del server con la lógica cliente) antes de ser totalmente interactivos.

**Impacto percibido**

- En dispositivos móviles de gama media/baja:
  - **Tiempo de hidratación** mayor por el peso de componentes client-side complejos (sidebar + shell) en toda la pantalla.
  - Posible sensación de “UI congelada” hasta que se resuelven hooks y efectos.

**Severidad**

- **Alta en mobile de baja gama**, **media en desktop**.

**Recomendación conceptual**

- **Patrón “Layout híbrido Server/Client”**:
  - Mantener `AppShell` y la mayor parte del layout como **Server Components livianos**, y extraer:
    - Únicamente el **toggle mobile del sidebar** a un Client Component pequeño.
    - La **lógica de búsqueda y fetch** a un Client Component insertado en un árbol mayor de Server Components.
  - Objetivo: **minimizar la superficie de hidratación** a los elementos realmente interactivos, dejando estructura y contenido estático en server.

---

## 3. Timeline de paciente (`Timeline`, vista de paciente)

### 3.1. Renderizado lineal de todos los eventos

**Fuente del problema**

- `Timeline` recibe `events` (arreglo de `TimelineEventType`) y hace un `map` simple para renderizar `TimelineEvent` para **cada evento**.
- No hay paginación, virtualización ni lazy loading en la vista timeline.

**Escenario típico**

- Pacientes con **historia clínica extensa** (años de seguimiento, muchos eventos de nota, medicación y turnos concretados).
- La ruta de detalle de paciente o la vista principal de trabajo carga toda la timeline en una sola página.

**Impacto percibido**

- En desktop con buen hardware puede sentirse aceptable al principio.
- En mobile y en pacientes con muchos años de seguimiento:
  - **Tiempo de render** inicial alto (muchos nodos React).
  - Scroll pesado / lag en interacción con la página.
  - Potencialmente, TTFB afectado si la timeline se arma en server con todo el set de eventos de una sola vez.

**Severidad**

- **Alta** para pacientes con historias largas; **baja/media** para bases pequeñas.

**Recomendación conceptual**

- **Patrón “Timeline paginada / lazy-loaded”**:
  - Mantener la timeline como piedra angular de UX, pero limitar el **número de eventos renderizados inicialmente** (por ejemplo, últimos N meses o últimos N eventos).
  - Incorporar un patrón de **“cargar más” histórico** o navegación por rangos de fecha.
  - Evaluar técnicas de **virtualización de listas** (por ejemplo, sólo renderizar los ítems visibles en viewport) si el DOM se hace muy grande.

### 3.2. Coste de hidratación en vista de paciente

**Fuente del problema**

- Aunque `Timeline` en sí misma es un componente aparentemente **server-safe** (no usa hooks), se inserta en un contexto donde:
  - `AppShell` es client.
  - `PatientHeader`, `NotesPanel`, paneles de medicación y turnos pueden incluir lógica client-side.

**Escenario típico**

- Al abrir la vista de un paciente, el usuario espera rápidamente ver:
  - Encabezado con datos básicos.
  - Timeline principal.
  - Panel de nota reciente y medicación.

**Impacto percibido**

- Si demasiados paneles son **Client Components pesados**, la hidratación simultánea deteriora la experiencia, sobre todo en mobile.

**Severidad**

- **Media/Alta** dependiendo de cuántos subcomponentes sean client.

**Recomendación conceptual**

- **Patrón “islas interactivas”**:
  - Mantener la **timeline como Server Component puro** que sólo recibe datos serializables y no tiene hooks.
  - Mover la interacción intensiva (por ejemplo, formularios de nueva nota, cambios de medicación) a **islas client-side** encapsuladas, mientras el resto del árbol permanece server-rendered.
  - Priorizar que lo primero que llega al usuario (texto plano de historia, eventos, encabezado) no dependa de hidratación compleja.

---

## 4. Notas clínicas (`NotesPanel` y formularios)

### 4.1. Dependencia de hooks y navegación en client

**Fuente del problema**

- `NotesPanel` es un **Client Component** que:
  - Usa `useParams()` de `next/navigation` para obtener `patientId`.
  - Maneja estado local para abrir/cerrar el formulario de nueva nota.
  - Renderiza componentes adicionales (`AddClinicalNoteForm`) que probablemente tienen lógica de red y validación.

**Escenario típico**

- Usuario entra en la vista de paciente y quiere **leer la nota más reciente**.
- La información de la última nota ya viene desde server, pero la experiencia total depende de que el panel se hidrate para permitir interacciones (agregar nota, tal vez navegar a detalle completo, etc.).

**Impacto percibido**

- En mobile, la parte estática del panel (Título, resumen de evaluación, plan, fecha) podría verse muy rápido si fuera server-rendered.
- Al ser client-side completo, se paga un **costo de hidratación** incluso para el mero consumo visual de información.

**Severidad**

- **Media** (especialmente en vista de paciente, que es altamente consultada).

**Recomendación conceptual**

- **Patrón “split read vs write”**:
  - Separar la **vista de lectura** de la nota más reciente (Server Component puro con props) de la **interacción de escritura/edición**, que sí requiere Client Component.
  - Ejemplo conceptual:
    - `RecentNoteSummary` (Server) muestra evaluación/plan/fechas.
    - Un botón “Agregar nota” monta bajo demanda el `AddClinicalNoteForm` (Client) como una pequeña isla.
  - Beneficio: la **primera pintura** del contenido clínico no depende de la hidratación del formulario ni de hooks de navegación.

---

## 5. Consultas a API y renderizado (queries)

### 5.1. Uso mixto de `fetchAllPatientsForUI` y `/api/patients`

**Fuente del problema**

- Hay dos caminos principales para obtener pacientes:
  - Llamadas internas a helpers de datos en server (`fetchAllPatientsForUI`, `fetchPatientForUI`).
  - Llamadas HTTP desde cliente al endpoint `/api/patients`.
- `PatientSidebar` usa ambos enfoques según el contexto (initial props vs búsqueda).

**Escenario típico**

- En navegación a diferentes rutas, se pueden mezclar respuestas obtenidas vía server y vía cliente, con potencial falta de **coherencia de caché** y estrategias diferentes de error/loading.

**Impacto percibido**

- Estados de loading y error inconsistentes.
- Posibles **refetch de la misma información** y falta de reuse de datos ya presentes (ej. se vuelve a pedir la misma lista por cada transición de ruta).

**Severidad**

- **Media**: sobrecarga de red y complejidad lógica.

**Recomendación conceptual**

- **Patrón “Backend for Frontend unificado”**:
  - Definir un **único canal de obtención de datos** para los casos de uso principales (ej. lista de pacientes):
    - O bien a través de una **función de datos server-first** (que luego puede ser envuelta por un handler de API para usos especiales).
    - O bien exclusivamente vía endpoint `/api/…` y un cliente compartido con cache (SWR/React Query) que se use tanto en lado cliente como en RSC mediante helpers.
  - El objetivo es **reutilizar la misma fuente de datos** y sus políticas de caché/timeouts en todas las vistas.

### 5.2. Re-renders en lista y búsqueda

**Fuente del problema**

- `PatientSidebar` vuelve a renderizar completamente la lista en cada cambio de `searchQuery` que dispara un fetch.
- La lista se renderiza como `<ul>` con `.map`, sin memoización adicional.

**Escenario típico**

- Un usuario teclea términos de búsqueda en mobile.
- Cada cambio (con debounce) provoca:
  - Estado intermedio de loading.
  - Reemplazo total del arreglo de pacientes y re-render de todos los ítems.

**Impacto percibido**

- Puede sentirse **lag** en móviles si el número de pacientes es grande.
- Las animaciones de carga (spinner) pueden causar saltos de layout.

**Severidad**

- **Media**: coste acumulado en experiencias de búsqueda frecuentes.

**Recomendación conceptual**

- **Patrón “UI-aware search + memoization ligera”**:
  - Mantener el debounce (bueno para red) pero reducir re-renders soportándose en:
    - **Memoización** de ítems de lista cuando sólo cambia el conjunto pero no la representación básica.
    - Técnicas de **“skeleton loading” en lugar de vaciar completamente la lista**, para mantener el layout estable.
  - Opcional: considerar un **límite de resultados visibles** y paginación en búsquedas cuando la base crezca.

---

## 6. Server vs Client Components y mobile

### 6.1. Superficie client-side más grande de lo necesario

**Fuente del problema**

- `AppShell` es client completo, aunque gran parte de su responsabilidad es layout.
- `PatientSidebar` y otros paneles (notas, medicación, etc.) también son client.
- Muchos componentes son client no por usar APIs del navegador, sino por combinar layout + interacción en una sola unidad.

**Escenario típico**

- Navegación en mobile (Vercel/Next App Router, SPA-like) entre root, lista y vistas de paciente.
- En cada nueva vista se monta un árbol con alta proporción de componentes client que requieren hidratación y gestión de estado.

**Impacto percibido**

- En dispositivos con CPU limitada:
  - **TTI (Time to Interactive)** mayor.
  - Animaciones de apertura/cierre de sidebar y scroll menos fluidos.

**Severidad**

- **Alta** a medida que crece la complejidad de la UI.

**Recomendación conceptual**

- **Patrón “Server-first, client-minimal”**:
  - Revisar sistemáticamente qué componentes **realmente necesitan** ser client (hooks, APIs de navegador, eventos complejos).
  - Dividir componentes grandes en:
    - Un contenedor **Server Component** para layout y datos.
    - **Islas client** pequeñas para interacción puntual (botones, formularios, toggles, modales).
  - Beneficio: menor JS enviado al cliente, menos trabajo de hidratación, mejor experiencia mobile.

---

## 7. Resumen ejecutivo de riesgos y prioridades

- **Riesgos altos**:
  - Superficie de Client Components más grande de lo necesario (`AppShell`, `PatientSidebar`, paneles complejos) → afecta hidratación y TTI en mobile.
  - Timeline sin paginación ni virtualización para historias largas → riesgo de vistas lentas para pacientes con muchos años de datos.
- **Riesgos medios**:
  - TTFB de root atado a carga completa de pacientes.
  - Fetch duplicado / estrategias mixtas de datos (`fetchAllPatientsForUI` vs `/api/patients`).
  - Re-renders completos de listas en búsqueda sin memoización.
- **Riesgos bajos** (pero acumulativos):
  - Pequeños saltos de layout al alternar estados de loading/error en sidebar.
  - Dependencia de hooks para paneles que podrían ser mayormente de lectura.

**Línea conceptual general**: ir hacia un diseño **Server-first con islas client-side**, consolidar la capa de datos para evitar fetch duplicado y **paginación/virtualización de timeline** para pacientes con historias largas, priorizando siempre la experiencia en mobile (TTFB razonable + TTI bajo + scroll fluido).