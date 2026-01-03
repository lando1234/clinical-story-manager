# Auditoría de Escalabilidad

**Sistema**: Clinical Story Manager (Next.js + Prisma + PostgreSQL)

---

## 1. Alcance y supuestos

- **Dimensiones analizadas**:
  - Volumen de **pacientes**.
  - Volumen de **eventos de timeline**.
  - Volumen de **notas**.
  - Volumen de **turnos (appointments)**.
  - Cantidad de **usuarios concurrentes** (mismo psiquiatra, múltiples sesiones/dispositivos).
- **Ejes técnicos**:
  - Acceso a base de datos (Prisma, consultas y patrones de uso).
  - Paginación y batch loading.
  - Carga de datos en el backend (App Router, server components) y en el cliente.
  - Renderizado de UI (principalmente timeline y root).
  - Restricciones típicas de **serverless / Vercel**: conexiones, tiempo de ejecución, memoria por request.
- **Restricciones de la auditoría**:
  - No se ejecutaron benchmarks ni mediciones de tiempo reales.
  - No se modificó el código ni se realizaron refactors; todo el análisis es estático y teórico.

---

## 2. Prisma, modelo de datos y conexión

### 2.1 Hallazgos relevantes

- **Prisma Client**
  - Esquema en `prisma/schema.prisma` con entidades principales: `Patient`, `ClinicalRecord`, `Note`, `ClinicalEvent`, `Medication`, `Appointment`, etc.
  - Uso de enums para estados (`PatientStatus`, `AppointmentStatus`, `ClinicalEventType`, etc.), lo cual favorece filtros baratos a nivel DB.
- **Conexión y pooling** (`src/lib/prisma.ts`):
  - Se crea un `Pool` de `pg` reutilizable vía `globalThis`, patrón correcto para evitar exceso de conexiones en dev/hot reload.
  - Prisma se inicializa con `PrismaPg` adapter, apropiado para Postgres/Neon.
- **Consultas típicas pesadas**:
  - `prisma.patient.findMany` sin `take` obligatorio (`PatientRepository.findAll`).
  - `prisma.clinicalEvent.findMany` sin límites en timeline (`getFullTimeline`, `getFilteredTimeline`).

### 2.2 Posibles cuellos de botella

1. **Lectura completa de pacientes sin límites por defecto**
   - `PatientRepository.findAll` acepta `{ take, skip }` pero **los callers no los usan por defecto**:
     - `PatientService.listPatients()` se llama sin parámetros en varios lugares.
     - `fetchAllPatientsForUI` trae **todos los pacientes** para el sidebar.
     - `/api/patients` sin query params devuelve todos los pacientes.
     - `/api/stats/patients` lee todos los pacientes para computar conteos.

2. **Lectura completa de eventos de timeline por paciente**
   - `getFullTimeline(patientId)` realiza `prisma.clinicalEvent.findMany` para **todo el historial** de un paciente, filtrando solo encounters futuros.
   - `fetchTimelineForUI` llama siempre a `getFullTimeline` sin paginar y mapea **todos los eventos** a UI.

3. **Uso directo de `prisma` en algunas rutas** (bypass de repositorios)
   - `timeline-reader.ts` y `patient-data.ts` acceden directamente a Prisma, lo cual está bien para lectura intensiva, pero dificulta introducir cross-cutting concerns de caching/paginación si no se unifica criterio.

### 2.3 Escenarios de crecimiento

- **Pacientes**:
  - Pasar de ~decenas a **miles** de pacientes (2–10k).
  - Cada llamada a `/` (root) o `/api/patients` sin filtros implicaría un `findMany` de **toda la tabla**, con coste lineal en N.
- **Eventos por paciente**:
  - Pacientes crónicos con años de seguimiento pueden acumular **cientos o miles de `ClinicalEvent`**.
  - La timeline completa para un solo paciente crecerá linealmente con el tiempo.

### 2.4 Impacto esperado

- **CPU y tiempo de respuesta**:
  - `findMany` sin límites sobre tablas crecientes aumenta el tiempo de consulta y la deserialización de resultados en Node.
  - Mapear todos los pacientes y todos los eventos a DTOs de UI genera trabajo adicional en JS.
- **Memoria por request (serverless)**:
  - Cargar cientos/miles de filas en memoria para cada request puede acercarse a los límites de memoria de funciones serverless.
  - Especialmente crítico en vistas que arman estructuras ricas de UI (timeline, listas completas).
- **Conexiones DB y cold starts**:
  - El patrón de singleton atenúa el riesgo, pero bajo alta concurrencia múltiples lambdas seguirán abriendo conexiones (limitadas por Neon/Vercel); consultas pesadas por request agravan el problema.

### 2.5 Recomendaciones de mitigación

1. **Paginación por defecto en `PatientRepository.findAll` / `PatientService.listPatients`**
   - Definir un **límite por defecto** (por ejemplo 50–100 pacientes) cuando no se pasa `take`.
   - Permitir paginación controlada vía query params en `/api/patients` (ej: `page`, `pageSize`) y en `fetchAllPatientsForUI`.
   - Mantener la vista actual (single-doctor) pero evitar lecturas completas innecesarias.

2. **Introducir paginación/cortes en timeline**
   - Agregar variantes como `getTimelinePage(patientId, { cursor/offset, limit })` que deleguen el ordenamiento a SQL donde sea posible y solo apliquen el sort adicional en un subconjunto.
   - En UI, renderizar **la ventana más reciente** de eventos (ej: últimos 100) y ofrecer navegación histórica (scroll/paginación) en lugar de todo el historial de una vez.

3. **Estandarizar un límite máximo de filas por request**
   - Definir una constante global de `MAX_ROWS_PER_REQUEST` (ej: 500) y aplicarla en `findMany` sobre entidades grandes (`Patient`, `ClinicalEvent`, `Appointment`).

4. **Preparar capa para caching en lecturas de alta frecuencia**
   - A nivel de dominio/datos, diseñar interfaces que permitan introducir caching (por ejemplo, en conteos de pacientes activos) sin cambiar la API pública.

---

## 3. API: consultas, paginación y carga de datos

### 3.1 Endpoints de pacientes

- **`GET /api/patients`** (`src/app/api/patients/route.ts`):
  - Si hay parámetros de búsqueda (`name`, `id`, `dateOfBirth`), se delega en `PatientService.searchPatients`, lo cual está bien y restringe el conjunto.
  - Si **no** hay parámetros, llama a `PatientService.listPatients()` → `PatientRepository.findAll()` sin `take/skip`, devolviendo **todos los pacientes**.

- **Cuello de botella**
  1. **Listado completo sin paginación**:
     - En un escenario con miles de pacientes, este endpoint se vuelve costoso y devuelve payloads grandes.

- **Escenario de crecimiento**
  - Uso habitual de la UI que liste pacientes sin filtros.
  - Integraciones futuras que reutilicen `/api/patients` como fuente de datos administrativa.

- **Impacto esperado**
  - Payloads crecientes → más tiempo de serialización JSON y transferencia.
  - Aumento del TTFB y del tiempo total de render en cliente.

- **Recomendaciones**
  - Paginación en `/api/patients` (obligatoria o con tamaño por defecto):
    - Parámetros sugeridos: `page`, `pageSize`, con límites superiores razonables.
  - Exponer un endpoint separado para **autocomplete/búsqueda** que limite fuertemente el número de resultados.

### 3.2 Endpoints de stats y root

- **`GET /api/stats/patients`** (`src/app/api/stats/patients/route.ts`):
  - Obtiene todos los pacientes y computa conteos en memoria: `total`, `active`, `inactive`.

- **Cuello de botella**
  1. **Conteos por escaneo completo**:
     - Para miles de pacientes, cada llamada a stats hace `findMany` completo.

- **Escenario de crecimiento**
  - Root (`/`) llama a este endpoint vía `PatientStats` en el cliente.
  - Con más interacción, las stats pueden pedirse repetidamente.

- **Impacto esperado**
  - Costo de CPU y memoria innecesarios; cada consulta podría resolverse con **3 COUNT agregados** en SQL.

- **Recomendaciones**
  - Reemplazar lógica de stats por:
    - `SELECT COUNT(*)` total, `COUNT(*) WHERE status='Active'`, etc., vía Prisma (`count` con filtros) en lugar de `findMany` completo.
  - Evaluar caching leve (ej. revalidación cada X segundos) si las stats no necesitan ser en tiempo real.

- **Root page** (`src/app/page.tsx`):
  - Llama a `fetchAllPatientsForUI()` en el servidor, que a su vez lee todos los pacientes.
  - Además, el cliente llama a `/api/stats/patients` y `/api/appointments/upcoming`.

- **Cuello de botella compuesto**
  - Una sola visita a `/` implica:
    - Lectura completa de `Patient` para el sidebar.
    - Lectura completa de `Patient` nuevamente desde stats (indirectamente).

- **Recomendaciones**
  - Reutilizar datos cuando sea posible (por ejemplo, derivar `total/active/inactive` del mismo query que alimenta el sidebar o usar consultas especializadas más baratas).
  - Paginación del listado en el sidebar cuando crezca el panel de pacientes.

### 3.3 Endpoints de turnos

- **`GET /api/appointments/upcoming`** (`src/app/api/appointments/upcoming/route.ts`):
  - Obtiene turnos `Scheduled` en los próximos 7 días vía `appointmentService.getAppointments` con `fromDate`/`toDate`.
  - Luego:
    - Extrae `patientIds` únicos.
    - Llama a `PatientService.listPatients()` (todos los pacientes) y filtra en memoria.

- **Cuello de botella**
  1. **Carga de todos los pacientes para mapear nombres**:
     - El número de turnos en 7 días suele ser bajo, pero la carga de **todos** los pacientes para construir `patientMap` no escala.

- **Escenario de crecimiento**
  - Aumento del panel de pacientes generales mientras la carga de turnos diarios permanece moderada.

- **Impacto esperado**
  - El endpoint de turnos pasa a estar limitado por el tamaño global de `Patient`, no por el número real de turnos.

- **Recomendaciones**
  - Resolver el join a nivel SQL:
    - Usar `include: { patient: { select: { id, fullName }}}` en la consulta de `Appointment`, o
    - Hacer `findMany` de pacientes con `where: { id: { in: patientIds }}` en lugar de `listPatients()` completo.

### 3.4 Endpoints de timeline

- **`GET /api/patients/:id/timeline`** (`src/app/api/patients/[id]/timeline/route.ts`):
  - Llama a `getFullTimeline` y devuelve todo el historial.

- **Cuello de botella**
  1. **Timeline completa en una sola respuesta**:
     - Sin límite de eventos ni paginación.

- **Escenario de crecimiento**
  - Pacientes con 500–2000 eventos clínicos (factible en muchos años de práctica).

- **Impacto esperado**
  - Payload y tiempo de render de UI proporcional al historial completo.

- **Recomendaciones**
  - Extender el endpoint con parámetros de ventana (por ejemplo `limit`, `beforeEventId` o `beforeDate`).
  - Introducir un endpoint alternativo para **resumen** (eventos recientes) y dejar la carga completa solo para vistas específicas de auditoría.

---

## 4. Timeline rendering y vistas de paciente

### 4.1 Componentes involucrados

- **Página de paciente** (`src/app/patients/[id]/page.tsx`):
  - En `Promise.all` carga:
    - Datos del paciente (`fetchPatientForUI`).
    - Todos los pacientes (`fetchAllPatientsForUI`) para el sidebar.
    - **Toda la timeline** (`fetchTimelineForUI`).
    - Medicaciones activas, próximo turno, nota más reciente.
  - Renderiza `Timeline events={events}` como lista simple de React.

- **`Timeline` (`src/ui/components/Timeline.tsx`)**:
  - Mapea `events.map` a `TimelineEvent` sin virtualización ni paginación.

### 4.2 Cuellos de botella

1. **Carga y renderizado de timeline completa**
   - La timeline se envía ya mapeada desde el servidor como arreglo **completo** de eventos.
   - En el cliente, React debe renderizar un componente por evento.

2. **Sidebar con todos los pacientes por cada vista**
   - Cada vez que se accede a un paciente, se cargan **todos los pacientes** para poblar el sidebar.

3. **Combinación de datos intensivos en una sola página**
   - La vista de paciente combina:
     - Timeline completa.
     - Medicación actual, próximo turno, nota reciente.
     - Sidebar entero.
   - Todo esto en un único server component, amplificando el coste por request.

### 4.3 Escenarios de crecimiento

- **Más pacientes + timelines más largas**:
  - Un solo psiquiatra puede acumular decenas de pacientes con historiales largos.
  - La vista de paciente para cada uno puede volverse pesada si la timeline tiene centenares de eventos.

- **Multiple tabs / dispositivos**:
  - El mismo profesional puede tener varias pestañas abiertas (ej. distintos pacientes) → varias requests simultáneas, alto consumo agregado de CPU/memoria.

### 4.4 Impacto esperado

- **Tiempo de TTFB y LCP** para la vista de paciente aumentará con el tamaño del historial.
- **Uso de memoria** por request más alto al construir grandes arrays de eventos y pacientes.
- En device menos potente, el renderizado inicial del árbol de React puede volverse notorio (scroll lento en timelines largas).

### 4.5 Recomendaciones

1. **Paginación/virtualización en timeline de UI**
   - Introducir un mecanismo de **lazy loading** de eventos:
     - Mostrar primero una ventana de eventos recientes.
     - Cargar bloques adicionales conforme el usuario scrollée o navegue por fechas.
   - Para timelines muy largas, considerar virtualización (ej. componentes que solo montan los elementos visibles).

2. **Dividir carga de datos en la página de paciente**
   - Mantener datos críticos en SSR (cabecera del paciente, summary de estado actual).
   - Cargar timeline extendida y sidebar enriquecido mediante llamadas adicionales (por ejemplo, componentes cliente que llamen a endpoints específicos).

3. **Optimizar el sidebar**
   - Para el caso de uso actual (un solo profesional), el sidebar puede mostrar **solo pacientes activos recientes** y ofrecer un buscador que traiga más bajo demanda.

---

## 5. Root stats y componentes derivados

### 5.1 Root (`Home`) y `PatientStats`

- **Patrones observados**:
  - `Home` obtiene todos los pacientes para el sidebar.
  - `PatientStats` (cliente) pide stats por separado a `/api/stats/patients`.

### 5.2 Cuellos de botella

1. **Duplicación de consultas sobre `Patient`**
   - Dos caminos diferentes cargan información relacionada con pacientes al entrar al root.

2. **Stats calculadas en memoria sobre listas completas**
   - `PatientStats` depende de un endpoint que escanea toda la tabla.

### 5.3 Escenario de crecimiento

- Cada visita a `/` con miles de pacientes implica doble trabajo sobre la tabla `patients`.

### 5.4 Impacto esperado

- Incremento del tiempo de respuesta y coste de CPU, aunque se trate de una sola persona usuaria.

### 5.5 Recomendaciones

1. **Evitar recálculo completo de stats**
   - Aplicar los cambios de sección 3.2 (usar `count` en SQL, posible caching ligero).

2. **Reutilizar datos existentes**
   - Cuando la lista de pacientes ya está cargada en el servidor, considerar derivar las stats en el mismo server component y pasarlas como props a `PatientStats` (cliente) o migrar `PatientStats` a componente de servidor.

---

## 6. Uso de memoria y CPU bajo carga

### 6.1 Factores principales

- **CPU**:
  - Mapeos intensivos de arrays grandes a DTOs de UI (`fetchAllPatientsForUI`, `fetchTimelineForUI`).
  - Transformaciones adicionales (ordenamientos en `applyFourTierOrdering`, conversiones de fechas a string).
- **Memoria**:
  - Arrays de pacientes, eventos, notas cargados completamente en cada request.
  - Objetos intermedios generados por mapeos y serialización JSON.

### 6.2 Escenarios ejemplo

1. **1000 pacientes, 500 eventos por paciente (casos extremos de práctica larga)**
   - Cargar la vista de un paciente:
     - ~500 eventos en memoria + estructura de paciente + lista de todos los pacientes para el sidebar.
   - Cargar root:
     - ~1000 pacientes para sidebar + otra vez ~1000 para stats (con la implementación actual).

2. **5–10 tabs abiertas simultáneamente**
   - Cada tab genera requests independientes; las funciones serverless replican el coste por tab.

### 6.3 Impacto esperado

- Riesgo de **superar límites de memoria por lambda** en Vercel bajo combinaciones de:
  - Tablas grandes.
  - Múltiples requests simultáneos.
  - Endpoints que cargan todo sin límites.

### 6.4 Recomendaciones generales

1. **Aplicar límites defensivos en consultas**
   - Siempre que se expone un `findMany` sin filtros estrictos, introducir `take` con máximo razonable.

2. **Reducir duplicación de consultas pesadas**
   - Compartir fuentes de verdad de datos (ej. lista de pacientes) entre root, stats y sidebar mediante props o endpoints más específicos.

3. **Monitorizar y ajustar**
   - Una vez desplegado, medir logs básicos (tiempos y tamaños de payload) para ajustar límites por defecto.

---

## 7. Serverless constraints específicas

### 7.1 Conexiones a base de datos

- El uso de `pg.Pool` global minimiza la creación de conexiones, pero en entornos serverless cada instancia de función mantiene su propio pool.
- Consultas que escanean tablas enteras incrementan el tiempo de ocupación de cada conexión, reduciendo capacidad máxima bajo concurrencia.

### 7.2 Tiempo de ejecución por request

- Endpoints como `/api/patients`, `/api/stats/patients`, `/api/appointments/upcoming` y las páginas de paciente/root escalan su tiempo de ejecución con el tamaño de las tablas.
- Bajo constraints de tiempo de Vercel, esto puede convertirse en timeouts cuando los datos crezcan.

### 7.3 Recomendaciones enfocadas en serverless

1. **Optimizar queries costosas**
   - Reemplazar escaneos completos por COUNTs y filtros selectivos.

2. **Diseñar endpoints para ser “baratos”**
   - Perseguir respuestas pequeñas, tanto en número de filas como en tamaño de cada fila.

3. **Usar contratos orientados a ventanas de datos**
   - Para timeline, turnos y listas de pacientes, hacer que los contratos de API (y las specs) trabajen con **ventanas/páginas** en lugar de conjuntos completos.

---

## 8. Resumen ejecutivo por tipo de entidad

### 8.1 Pacientes

1. **Cuello de botella**: listados completos (`listPatients`, `fetchAllPatientsForUI`, `/api/patients`, `/api/stats/patients`, `/api/appointments/upcoming`).
2. **Escenario**: crecimiento a miles de pacientes.
3. **Impacto**: aumentan linealmente tiempos y memoria; endpoints secundarios (stats/turnos) se vuelven dependientes del tamaño total de la tabla.
4. **Mitigación**: paginación por defecto, queries especializadas para stats, joins selectivos por `id IN`.

### 8.2 Eventos de timeline

1. **Cuello de botella**: carga de timeline completa para cada paciente (`getFullTimeline` + `fetchTimelineForUI` + `Timeline` de UI sin paginación/virtualización).
2. **Escenario**: historiales extensos con cientos/miles de eventos.
3. **Impacto**: payloads grandes, renderizado pesado, mayor uso de CPU/memoria por request.
4. **Mitigación**: introducción de paginación/ventanas, endpoints para secciones de timeline, virtualización/lazy loading en UI.

### 8.3 Notas

1. **Cuello de botella**: relativamente limitado hoy; se consulta solo la nota más reciente desde `getCurrentState` + una `findUnique` de nota.
2. **Escenario**: crecimiento grande de notas por paciente.
3. **Impacto**: mínimo mientras se siga trabajando con notas individuales o conjuntos pequeños (no se listan todas las notas de golpe en UI).
4. **Mitigación**: mantener el patrón de acceso puntual y evitar vistas que requieran cargar todas las notas de una vez.

### 8.4 Turnos (Appointments)

1. **Cuello de botella**: endpoint de `upcoming` que carga todos los pacientes para mapear nombres.
2. **Escenario**: muchos pacientes, cantidad moderada de turnos futuros.
3. **Impacto**: coste del endpoint dominado por volumen de pacientes en vez del número de turnos.
4. **Mitigación**: joins selectivos a nivel DB (`include patient` o `where id in (...)`).

### 8.5 Usuarios concurrentes

1. **Cuello de botella**: combinación de requests costosos (root, paciente, stats) con múltiples pestañas o dispositivos.
2. **Escenario**: mismo médico usando activamente la app en varias sesiones (consultorio + domicilio, etc.).
3. **Impacto**: multiplicación del coste por request; riesgo de alcanzar límites de Vercel/Neon en memoria o conexiones.
4. **Mitigación**: hacer que cada request sea lo más barato posible (paginación, reducción de payloads, queries especializadas) y considerar caching/ISR donde las invariantes clínicas lo permitan.

---

## 9. Conclusión

La arquitectura actual está bien alineada con un **MVP para un solo profesional** y un volumen de datos moderado. Sin embargo, existen varios puntos donde el patrón "traer todo" (pacientes, timeline completa) puede convertirse en un límite práctico a medida que crecen los historiales y el panel de pacientes.

La estrategia de mitigación recomendada pasa por:
- Introducir **paginación y ventanas de datos** en pacientes y timeline.
- Optimizar endpoints derivados (`stats`, `upcoming appointments`) para evitar escaneos completos de tablas.
- Reducir payloads y trabajo de renderizado en las vistas más críticas (root y paciente).

Con estos ajustes, el sistema debería poder escalar cómodamente dentro del escenario previsto (un único psiquiatra, varios cientos de pacientes y historiales extensos) sin comprometer tiempos de respuesta ni exceder las restricciones típicas de entornos serverless.