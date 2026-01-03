## Auditoría de resiliencia y confiabilidad

Contexto: Aplicación Next.js con Prisma + PostgreSQL (pool `pg`), dominio clínico basado en eventos (Timeline Engine), sin dependencias externas HTTP relevantes más allá de la base de datos. El foco de esta auditoría está en resiliencia ante fallos parciales, errores externos y condiciones adversas.

---

## 1. Prisma y base de datos

### 1.1. Escenario de falla: indisponibilidad total de la base de datos

- **Escenario de falla**: `DATABASE_URL` inválida, base de datos caída, credenciales incorrectas o red hacia la DB no disponible.
- **Impacto en el sistema**:
  - Todas las operaciones que usan `prisma` (lectura y escritura) fallan con errores en tiempo de ejecución.
  - Las rutas API capturan errores genéricos y responden `500 Internal server error` sin diferenciación entre fallo temporal y error lógico.
  - No hay modo degradado (por ejemplo, solo lectura con caché, respuestas parciales ni colas de trabajo).
- **Probabilidad**: Media.
  - Depende de la infraestructura (Neon u otro managed Postgres) pero son fallos esperables: mantenimientos, cambios de credenciales, cortes breves de red.
- **Nivel de resiliencia actual**: Bajo–Medio.
  - Hay un patrón consistente de `try/catch` en rutas API que evita caídas del proceso, pero no hay:
    - Reintentos configurados.
    - Circuit breakers.
    - Mecanismos de fallback o colas.
    - Diferenciación de errores recuperables vs. definitivos.
- **Recomendación (patrones)**:
  - **Circuit breaker a nivel de acceso a datos**: Encapsular las llamadas a `prisma` en un adaptador que implemente un patrón de circuit breaker (por ejemplo, contando fallos consecutivos y abriendo el circuito para evitar bombardear la DB durante una caída prolongada).
  - **Fail-fast bien tipado**: Introducir un tipo de error de infraestructura (e.g. `InfrastructureError` o `DatabaseUnavailableError`) que las capas superiores puedan mapear a respuestas 503 (`Service Unavailable`).
  - **Degradación controlada para lecturas**: Para endpoints de lectura “no críticos” (p.ej. `/api/appointments/upcoming`, `/api/stats/patients`), permitir:
    - Responder con datos cacheados o parciales si la última lectura exitosa está disponible (p.ej. caché en memoria o Redis) y marcar la respuesta como potencialmente desactualizada.
  - **Supervisión e indicadores**: Emitir métricas (contadores de errores de DB, latencia de consultas) y logs estructurados para facilitar detección temprana.

### 1.2. Escenario de falla: latencia alta y timeouts en base de datos

- **Escenario de falla**: La DB responde pero con latencias elevadas; conexiones saturadas o queries lentas.
- **Impacto en el sistema**:
  - Las peticiones HTTP quedan colgadas hasta que el runtime de Node/Next impone sus propios timeouts o el usuario aborta.
  - No se observan timeouts explícitos de aplicación (no hay configuración de `statement_timeout` por petición ni cancelación de consultas).
- **Probabilidad**: Media.
  - Cualquier sistema en producción puede experimentar picos de carga o consultas no optimizadas.
- **Nivel de resiliencia actual**: Bajo.
  - No hay timeouts ni límites por operación a nivel de código de aplicación.
- **Recomendación (patrones)**:
  - **Timeouts a nivel de aplicación**: Envolver las operaciones de Prisma en helpers que apliquen un timeout por operación (p.ej. `Promise.race` con un `TimeoutError` controlado) y devuelvan un error bien tipado si se excede.
  - **Policies de reintento con backoff**: Para lecturas idempotentes, considerar un patrón `retry` con backoff exponencial ante errores transitorios específicos (por ejemplo, timeouts de red, `ECONNRESET`). Evitar reintentos en escrituras no idempotentes.
  - **Límites de concurrencia**: Implementar un “bulkhead” a nivel de acceso a DB (limitar número de operaciones concurrentes en puntos de alto tráfico).
  - **Uso de límites de tiempo a nivel DB**: Configurar `statement_timeout` en la base de datos o a nivel de pool para impedir consultas que se eternizan.

### 1.3. Escenario de falla: errores transitorios de conexión (reset, DNS, etc.)

- **Escenario de falla**: Errores esporádicos en el pool `pg` (conexiones reseteadas, errores de TLS, etc.).
- **Impacto en el sistema**:
  - Operaciones individuales fallan con error 500.
  - No se intenta reestablacer de forma controlada (queda delegado al pool de `pg`).
- **Probabilidad**: Media–Alta en entornos cloud.
- **Nivel de resiliencia actual**: Medio.
  - El uso de `Pool` con SSL y un singleton de `PrismaClient` es una buena base (evita tormenta de conexiones) pero sin manejo explícito de reintentos ni clasificación de errores.
- **Recomendación (patrones)**:
  - **Clasificación de errores de infraestructura**: Introducir una capa de repositorio que traduzca errores de `pg`/Prisma a errores de dominio de infraestructura; esto permite tomar decisiones distintas (reintento, degradación, 503) sin que cada ruta tenga que conocer detalles de la DB.
  - **Reintentos limitados**: Implementar reintentos con backoff solo para errores marcados como transitorios.
  - **Monitorización del pool**: Registrar métricas sobre conexiones activas, errores y tiempos de espera para detectar problemas de forma proactiva.

### 1.4. Escenario de falla: inconsistencias parciales en transacciones

- **Escenario de falla**: Fallo en medio de transacciones Prisma (`$transaction`) en `PatientService.createPatient`, `changeMedication`, `finalizeNote`.
- **Impacto en el sistema**:
  - A nivel de ACID, la DB revierte la transacción, lo que es correcto.
  - Sin embargo, en algunas operaciones se ejecutan después de la transacción acciones no transaccionales (por ejemplo, emisión de eventos de timeline) que pueden fallar sin rollback de la entidad principal.
  - Ejemplos:
    - `PatientService.createPatient`: el fallo al emitir el evento fundacional se registra en log pero no invalida la creación del paciente.
    - `startMedication`/`changeMedication`/`stopMedication`: si fallan los eventos de timeline se registra el error pero la medicación queda modificada.
    - `finalizeNote`: la nota se finaliza en la transacción; el evento de timeline se emite fuera y puede fallar.
- **Probabilidad**: Baja–Media (fallos en timeline engine, DB secundaria, etc.).
- **Nivel de resiliencia actual**: Medio.
  - A nivel de integridad de la entidad principal, la resiliencia es buena (transacciones correctas).
  - A nivel de consistencia entre entidades y timeline, hay riesgo de **des-sincronización silenciosa**.
- **Recomendación (patrones)**:
  - **Outbox pattern / transactional outbox**: Persistir eventos de dominio en una tabla de “outbox” dentro de la misma transacción que modifica la entidad; un proceso separado publica esos eventos al Timeline Engine o los consume para reconstruir el timeline. Esto evita inconsistencias entre entidad y evento.
  - **Logs de compensación y tareas de reconciliación**: Diseñar procesos periódicos que comparen entidades clínicas (e.g. notas finalizadas, medicaciones activas) contra lo que aparece en la línea de tiempo y reparen gaps.
  - **Errores de consistencia elevados a observabilidad**: Elevar a métricas/alertas cuando una operación clave (finalizar nota, iniciar medicación) falla en la parte de eventos aunque haya persistencia exitosa de la entidad.

---

## 2. Manejo de errores en API y `fetch` (lado servidor)

### 2.1. Escenario de falla: errores de validación de dominio

- **Escenario de falla**: Inputs inválidos o estados de dominio inválidos (e.g. `PatientValidationError`, reglas de medicación, validaciones de notas).
- **Impacto en el sistema**:
  - La mayoría de rutas manejan bien estos casos:
    - `/api/patients` (POST y PATCH) traducen `PatientValidationError` a `400`.
    - Rutas de timeline/medicación/notas usan tipos `Result` (`success: false`) con `DomainError` y mapean a `400` o `404`.
  - Esto hace que los fallos de dominio no escalen a 500.
- **Probabilidad**: Alta (inputs de usuario siempre pueden ser inválidos).
- **Nivel de resiliencia actual**: Alto a nivel de dominio.
  - Uso consistente de tipos de resultado y errores específicos.
- **Recomendación (patrones)**:
  - **Estándar de error response**: Formalizar un contrato de respuesta de error (e.g. `{ code, message, details }`) homogéneo entre endpoints para facilitar clientes resilientes.
  - **Mapeo explícito dominio → HTTP**: Documentar en una capa común cómo se traducen `DomainErrorCode` a códigos HTTP; hoy se hace “ad hoc” en cada ruta.

### 2.2. Escenario de falla: errores inesperados en lógica de dominio o infraestructura

- **Escenario de falla**: Excepciones no controladas en servicios de dominio (bugs, nulls inesperados, etc.) o errores de infraestructura que se propagan.
- **Impacto en el sistema**:
  - Las rutas usan `try/catch` general y responden `500 { error: 'Internal server error' }`.
  - Se hace `console.error`, pero no hay:
    - Correlación entre peticiones.
    - Categorías de error.
    - Mecanismo de notificación/alerta.
- **Probabilidad**: Media.
- **Nivel de resiliencia actual**: Medio.
  - El sistema no se cae, pero la observabilidad y capacidad de recuperación son limitadas.
- **Recomendación (patrones)**:
  - **Middleware de error global**: Centralizar el manejo de errores en una capa común para las rutas API, que:
    - Clasifique errores (dominio vs. infraestructura vs. bug inesperado).
    - Asigne códigos HTTP y payloads uniformes.
    - Emita logs estructurados con IDs de petición.
  - **Correlation ID y logging estructurado**: Incluir un ID de correlación por request y usar logs JSON para facilitar trazas en agregadores.
  - **Política de redacción de mensajes**: Para seguridad, separar `message` de usuario y `technicalMessage` de logs internos.

### 2.3. Escenario de falla: timeouts HTTP y backpressure

- **Escenario de falla**: Operaciones de dominio/DB tardan demasiado, superando el tiempo aceptable para el usuario o para la plataforma (Vercel, etc.).
- **Impacto en el sistema**:
  - El código de rutas no define límites de tiempo.
  - No hay backpressure explícito ni colas.
- **Probabilidad**: Media en carga alta o consultas complejas.
- **Nivel de resiliencia actual**: Bajo–Medio.
- **Recomendación (patrones)**:
  - **Timeouts por endpoint**: Definir tiempos máximos aceptables por tipo de operación (por ejemplo, 1–2s para lecturas sencillas, 5s para operaciones complejas) y fallar con un error explícito si se exceden.
  - **Bulkhead por tipo de operación**: Limitar concurrencia en endpoints pesados para evitar que bloqueen el resto del sistema.
  - **Offloading a procesos asíncronos**: Para operaciones largas (ej., reconstrucciones complejas de timeline), considerar pasar a un modelo asíncrono (job + polling) en lugar de síncrono.

---

## 3. Supuestos de disponibilidad y dependencias críticas

### 3.1. Supuestos explícitos/implícitos

- **Supuestos observados**:
  - La base de datos está siempre disponible y responde en tiempos razonables.
  - El Timeline Engine (implementado localmente) es confiable y rápido; sus fallos se consideran excepcionales y solo se registran en logs.
  - No se contempla cacheo de datos ni almacenamiento local para lecturas si la DB está caída.
  - No se modelan `read-only modes` ni bloqueos de escritura en condiciones de fallo parcial.
- **Impacto**:
  - El sistema se comporta de forma “todo o nada”: ante caída de la DB, la mayor parte de la funcionalidad se vuelve 500, sin degradación controlada.
  - La línea de tiempo puede quedar temporalmente inconsistente sin mecanismos automáticos de reconciliación.
- **Probabilidad**: Alta de que, en la práctica, estos supuestos se vean violados en algún momento en producción.
- **Nivel de resiliencia actual**: Medio (buena claridad de dominio, poca ingeniería de resiliencia infra).
- **Recomendación (patrones)**:
  - **Documentar un modelo de disponibilidad objetivo**: Por ejemplo, aspirar a seguir el patrón CAP orientado a consistencia fuerte en datos clínicos, pero con degradación de ciertas vistas en modo sólo lectura.
  - **Definir modos de operación**: `NORMAL`, `DEGRADED-READ-ONLY`, `MAINTENANCE`, etc. y permitir que ciertas rutas se comporten distinto según el modo (por ejemplo, bloquear nuevas notas durante mantenimiento de DB secundaria, pero permitir lectura de datos cacheados).
  - **Feature toggles y flags de resiliencia**: Permitir activar/desactivar ciertas características (p.ej. generación de eventos de timeline) sin detener la funcionalidad principal.

### 3.2. Dependencias críticas

- **Base de datos PostgreSQL**: Única fuente de verdad para casi todo el dominio.
- **Timeline Engine interno**: Depende de la misma DB y genera eventos; aunque es local, actúa como subsistema crítico para la representación Longitudinal.
- **Next.js runtime / plataforma (Vercel u otra)**: Impone límites de tiempo de ejecución y concurrencia que deben ser considerados.

- **Recomendación (patrones)**:
  - **Mapa de criticidad de dependencias**: Clasificar componentes como `Tier 0/1/2` y definir objetivos de RTO/RPO para cada uno.
  - **Pruebas de caos (chaos engineering ligera)**: Sin llegar a simular caídas aquí, sí planificar en infra pruebas como: caída temporal de DB, latencia inyectada, errores en timeline, para validar supuestos de diseño.

---

## 4. Manejo de servicios externos y `fetch`

En el código revisado no se observan llamadas HTTP salientes a servicios externos (no hay `fetch` a APIs de terceros desde el backend). Los principales “servicios externos” efectivos son:

- DB PostgreSQL (vía Prisma + `pg`).
- Posibles plataformas de despliegue (Vercel) y su modelo de ejecución.

Por tanto, el análisis de errores de servicios externos se superpone con el de DB y con la capa de infraestructura.

- **Recomendación (patrones)** para futuras integraciones externas:
  - **Client HTTP con políticas explícitas**: Centralizar el uso de `fetch`/HTTP en un cliente con:
    - Timeouts por petición.
    - Reintentos con backoff para errores transitorios.
    - Circuit breaker y fallback.
  - **Contratos de error y degradación funcional**: Definir de antemano qué pantallas y funciones pueden operar con datos parcialmente disponibles (por ejemplo, mostrar últimos resultados cacheados si el servicio de analítica está caído).
  - **Separación de dominios críticos vs. no críticos**: Para datos clínicos esenciales, priorizar consistencia y señalización clara de fallo antes que degradación silenciosa.

---

## 5. Evaluación sintética de resiliencia por área

- **Prisma / acceso a DB**:
  - **Fortalezas**: Uso de pool compartido, transacciones atómicas, servicios de dominio bien encapsulados.
  - **Debilidades**: Sin timeouts ni circuit breakers, sin reintentos controlados, sin diferenciación de errores transitorios.
  - **Nivel de resiliencia**: Medio.

- **Manejo de errores en API**:
  - **Fortalezas**: Uso de tipos `Result` y errores específicos de dominio (`DomainError`, `PatientValidationError`), mapeo explícito a `400/404` en varios endpoints.
  - **Debilidades**: Tratamiento genérico de errores inesperados, respuesta 500 homogénea, sin middleware global ni logging estructurado.
  - **Nivel de resiliencia**: Medio–Alto a nivel de dominio, Medio a nivel de infraestructura.

- **Timeline Engine y consistencia de eventos**:
  - **Fortalezas**: Contratos bien documentados, uso de tipos de error y Result, transacciones para operaciones críticas.
  - **Debilidades**: Emisión de eventos fuera de transacciones, riesgo de des-sincronización silenciosa, sin mecanismo estándar de outbox.
  - **Nivel de resiliencia**: Medio.

- **Supuestos de disponibilidad y degradación controlada**:
  - **Fortalezas**: Modelo de dominio claro, sin dependencia de múltiples servicios externos.
  - **Debilidades**: Falta de modos de operación, ausencia de caché o degradación funcional consciente, supuestos fuertes de disponibilidad permanente de la DB.
  - **Nivel de resiliencia**: Bajo–Medio.

---

## 6. Recomendaciones priorizadas (sin código, solo patrones)

1. **Introducir una capa de infraestructura resiliente sobre Prisma**
   - Encapsular todas las llamadas a `prisma` en un módulo de acceso a datos que implemente:
     - Circuit breaker.
     - Timeouts por operación.
     - Clasificación de errores (transitorios vs. definitivos).
     - Reintentos con backoff para errores transitorios en operaciones idempotentes.

2. **Adoptar el patrón Outbox para eventos de dominio (Timeline Engine)**
   - Guardar eventos pendientes en una tabla de outbox dentro de las transacciones que modifican entidades clínicas.
   - Usar un proceso separado (worker) para publicar esos eventos al motor de timeline.
   - Implementar tareas de reconciliación para detectar diferencias entre entidades y timeline.

3. **Centralizar el manejo de errores HTTP y estandarizar respuestas**
   - Crear una capa/middleware común para las rutas API que:
     - Convierta errores de dominio e infraestructura en respuestas HTTP estandarizadas (`code`, `message`, `details`).
     - Registre errores con logs estructurados y correlation IDs.

4. **Definir y soportar modos de operación y degradación**
   - Especificar qué partes del sistema pueden operar en:
     - Modo normal.
     - Modo sólo lectura (por ejemplo, cuando la DB de escritura está degradada pero una réplica de lectura sigue operativa o hay caché).
     - Modo mantenimiento (bloqueo selectivo de escrituras).
   - Ajustar el comportamiento de endpoints según el modo activo.

5. **Diseñar una estrategia de timeouts y límites de concurrencia**
   - Establecer SLAs internos por tipo de endpoint.
   - Implementar timeouts explícitos en llamadas de dominio/DB.
   - Aplicar límites de concurrencia en operaciones pesadas.

6. **Preparar la integración futura de servicios externos con resiliencia desde el diseño**
   - Definir un cliente HTTP robusto compartido.
   - Diseñar contratos de error claros y planes de degradación para cada integración (p.ej. servicio de analítica, mensajería, etc.).

En conjunto, el sistema parte de una base sólida de modelado de dominio y uso de tipos de error, pero requiere una capa adicional de patrones de resiliencia de infraestructura (timeouts, circuit breakers, outbox, modos de operación) para comportarse de forma robusta frente a fallos parciales y condiciones adversas en producción.
