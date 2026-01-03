# Auditoría de manejo de errores – Clinical Story Manager

> Rol: Auditor de manejo de errores en sistema clínico
> Alcance: Backend (API / dominio) y Frontend (UI), incluyendo errores de red y datos.

---

## 1. Visión general

- **Fortalezas principales**
  - **Backend**: uso consistente de `try/catch` en rutas API, retorno estructurado de errores en JSON (`{ error: string }`), diferenciación razonable entre errores de validación (400), no encontrado (404) y error interno (500).
  - **Dominio**: uso de tipo `Result<T, DomainError>` y clase `DomainError` con `code` y `details` para operaciones críticas de timeline y medicación (`timeline-reader`, `medication-service`, etc.), reduciendo excepciones no controladas.
  - **Frontend**: manejo explícito de estados de carga y error en componentes clave (`PatientDetailView`, `UpcomingAppointments`, formularios de alta/edición), mensajes en español y páginas de error globales (`app/error.tsx`, `app/patients/[id]/error.tsx`).
  - **Logs**: captura de excepciones inesperadas en backend con `console.error`, y logging de errores de dominio en servicios de timeline/medicación.

- **Patrones de riesgo recurrentes**
  - **Errores de dominio que no se propagan al usuario** (se loguean pero la operación "sigue"), con riesgo de **estado clínico inconsistente entre modelo de datos y timeline** (p.ej. creación de paciente o medicación sin evento correspondiente).
  - **Falta de un contrato uniforme de errores de dominio hacia el API** (combinación de `Error` genérico y `DomainError`/`Result`), lo que complica distinguir entre error clínico/validación vs. fallo técnico.
  - **UX de error principalmente textual y genérica**, con poca diferenciación entre problemas de validación, de negocio o de infraestructura; no siempre hay guidance claro sobre si se completó la acción clínica.

---

## 2. Backend – API / dominio

### 2.1. Uso de `try/catch` y propagación de errores

#### 2.1.1. Rutas de pacientes (`src/app/api/patients/*.ts`)

- **Comportamiento actual**
  - `POST /api/patients` y `PATCH /api/patients/:id`:
    - Envuelven la lógica en `try/catch`.
    - Capturan `PatientValidationError` y devuelven `400` con `error: error.message`.
    - Capturan `PatientNotFoundError` (en `GET`/`PATCH :id`) y devuelven `404`.
    - Cualquier otro error devuelve `500` con `"Internal server error"` y se loguea con `console.error`.
  - `GET /api/patients`:
    - Maneja parseo de `dateOfBirth`, pero **no devuelve 400 si la fecha es inválida**; simplemente ignora el filtro si el parse falla.

- **Evaluación**
  - **Detección**: correcta para errores de dominio (`PatientValidationError`/`PatientNotFoundError`). Hay una zona gris en `GET /api/patients` donde un input inválido de fecha no es tratado como error.
  - **Propagación**: las excepciones de dominio se traducen adecuadamente en HTTP status; las otras quedan encapsuladas en 500.
  - **Registro**: los errores inesperados se registran con `console.error`.
  - **Comunicación al usuario**: mensajes genéricos en 500 (`Internal server error`) y mensajes más específicos en 400/404.

- **Problema 1** – Fecha de nacimiento inválida en búsqueda de pacientes no se comunica al usuario
  1. **Error no manejado o mal manejado**
     - En `GET /api/patients`, si `dateOfBirth` es inválida, se ignora silenciosamente y se hace una búsqueda sin ese filtro. El usuario puede creer que el filtro se aplicó, cuando en realidad no.
  2. **Impacto clínico/operativo**
     - Búsquedas demográficas pueden devolver un conjunto de pacientes más amplio de lo esperado, dificultando la localización de un paciente específico.
     - En contextos de alta presión (guardia, internación) puede derivar en selección del paciente equivocado al depender de resultados parcialmente filtrados.
  3. **Riesgo**
     - **Medio**: no es un fallo directo de integridad clínica, pero sí de seguridad operacional y precisión en identificación.
  4. **Recomendación**
     - Tratar `dateOfBirth` inválida como **error de validación del request**, devolviendo 400 con mensaje claro.
     - Mantener la semántica de `Result`/errores de dominio donde aplique, pero no silenciosamente degradar a una búsqueda distinta a la solicitada.

---

#### 2.1.2. Rutas de appointments, notas, timeline, medicación

- **Comportamiento actual**
  - Rutas como:
    - `GET/POST /api/patients/:id/appointments`
    - `POST /api/patients/:id/appointments/:appointmentId/cancel`
    - `POST /api/patients/:id/notes`
    - `POST /api/patients/:id/notes/:noteId/finalize`
    - `POST /api/patients/:id/notes/:noteId/addenda`
    - `GET /api/patients/:id/timeline`, `/timeline/at-date`, `/timeline/current-state`
    - `POST /api/patients/:id/medications` y cambios/suspensiones de medicación
  - Patrones:
    - `try { ... } catch (error) { console.error('...:', error); return 500 + { error: 'Internal server error' } }`.
    - Inputs de fechas y parámetros clave se validan y devuelven 400 con mensajes específicos (por ejemplo, `Invalid or missing scheduledDate`, `Invalid or missing effectiveDate`, `Invalid or missing encounterDate`).
    - Resultados de servicios de dominio basados en `Result<..., DomainError>` se inspeccionan; cuando `!result.success`, se mapear `result.error.code` a 404 vs 400.

- **Evaluación**
  - **Detección**: buena cobertura de errores de parámetros (fechas requeridas, formatos de hora). Errores de dominio (por ejemplo `PATIENT_NOT_FOUND`, `MEDICATION_NOT_FOUND`) son detectados y diferenciados en 400 vs 404.
  - **Propagación**: se respeta el contrato de `Result` para timeline y medicación, evitando lanzar excepciones innecesarias.
  - **Registro**: en general, sólo se loguean errores imprevistos en el `catch` (500). Los errores esperados de dominio no se loguean, lo cual es consistente con un enfoque de logging.
  - **Comunicación al usuario**: los mensajes de error en JSON son en inglés y relativamente claros a nivel técnico; el frontend traduce algunos a español.

- **Problema 2** – En algunas rutas, errores de dominio se colapsan a 400 genérico
  1. **Error no manejado o mal manejado**
     - En endpoints como creación de notas (`POST /api/patients/:id/notes`), si la operación de dominio devuelve `Result` con `success=false`, se devuelve siempre 400 y `error: result.error.message`, sin distinguir códigos (`code`) ni tipos de error.
  2. **Impacto clínico/operativo**
     - Los distintos escenarios de fallo (por ejemplo, violación de invariante de timeline vs. dato clínico faltante) se representan igual para el cliente. Esto dificulta que la UI ofrezca acciones correctivas específicas (corregir un campo vs. reintentar más tarde) y puede producir reintentos improductivos.
  3. **Riesgo**
     - **Medio**: puede llevar a UX confusa y a que el profesional no sepa si el fallo se debe a datos ingresados o a un problema sistémico.
  4. **Recomendación**
     - Estandarizar la respuesta de errores de dominio incluyendo siempre `code` además de `message` (p. ej. `{ error: result.error.message, code: result.error.code }`).
     - Mantener el mapping 404/400, pero permitir al frontend discriminar la causa y adecuar la UX.

---

### 2.2. Eventos de timeline y servicio de medicación – errores silenciosos

#### 2.2.1. Emisión de eventos de timeline en creación de paciente

- **Comportamiento actual** (`PatientService.createPatient`)
  - Dentro de la transacción de creación de paciente y ClinicalRecord se llama a `emitFoundationalEvent(...)`.
  - Si el `Result` devuelto es `!success`, se ejecuta:
    - `console.error("Failed to emit foundational event:", foundationalEventResult.error);`
    - **No se lanza excepción ni se revierte la transacción.** El paciente queda creado sin el evento fundacional correspondiente en la timeline.

- **Problema 3** – Paciente creado sin evento fundacional en timeline
  1. **Error no manejado o mal manejado**
     - El fallo en la emisión del evento fundacional se considera no crítico y no se propaga (sólo se loguea). El API `POST /api/patients` devuelve 201 indicando éxito completo, aunque la timeline haya quedado inconsistente con las especificaciones.
  2. **Impacto clínico/operativo**
     - La timeline puede no reflejar correctamente el inicio del registro clínico del paciente.
     - Módulos que dependen de ese evento (visitas subsiguientes, inferencias de estado) podrían operar sobre una historia incompleta.
     - Para el clínico, el paciente aparece creado pero con una historia inicial ausente o incompleta, lo que puede llevar a decisiones basadas en información parcial.
  3. **Riesgo**
     - **Alto**: inconsistencia entre el modelo de datos operativo (paciente/ClinicalRecord existen) y la timeline, que suele ser la fuente de verdad para la reconstrucción clínica.
  4. **Recomendación**
     - Tratar el fallo en `emitFoundationalEvent` como **error crítico de consistencia**:
       - Opción A: hacer que el fallo convierta el `Result` en `err(...)` y que la ruta API devuelva 500, sin crear el paciente.
       - Opción B: mantener la creación del paciente pero devolver un HTTP 207/409 (o 500) que deje explícito que la timeline no pudo inicializarse, para que la UI advierta al clínico y prevenga uso normal hasta que se corrija.

---

#### 2.2.2. Emisión de eventos de medicación (`startMedication`, `changeMedication`, `stopMedication`)

- **Comportamiento actual**
  - En cada operación:
    - Se realiza la transacción principal sobre entidades de medicación (crear, actualizar, discontinuar).
    - Luego se llama a `emitMedicationStartEvent`, `emitMedicationChangeEvent` o `emitMedicationStopEvent`.
    - Si `!eventResult.success`, se hace `console.error("Failed to emit medication ... event:", eventResult.error);` y **se devuelve `ok(...)` igualmente**.

- **Problema 4** – Estado de medicación actualizado sin evento asociado en timeline
  1. **Error no manejado o mal manejado**
     - El fallo en la escritura del evento de medicación se registra pero no altera el `Result` que se devuelve: el servicio indica `success: true`, ocultando que la timeline quedó desincronizada respecto del estado de medicaciones.
  2. **Impacto clínico/operativo**
     - La lista de medicaciones en la timeline (derivada de eventos) puede no reflejar el estado real de la entidad `Medication` en base de datos.
     - Riesgo de que un profesional vea información de medicación incompleta/errónea (por ejemplo, un inicio o suspensión no reflejada en el tiempo correcto).
  3. **Riesgo**
     - **Alto**: afecta directamente la seguridad de la medicación, uno de los ejes más sensibles en sistemas clínicos (dosis, inicio, cambios, suspensión).
  4. **Recomendación**
     - Elevar estos fallos al mismo nivel de criticidad que la operación principal:
       - Devolver `Result` con `success: false` y `DomainError` específico si la emisión del evento falla, para que la API pueda responder con 500 o un 409 explícito.
       - O, si se mantiene la separación, añadir un canal de salida explícito (por ejemplo, `warnings`) para que el API informe que la operación de medicación se completó, pero la timeline no pudo registrar el cambio.

---

#### 2.2.3. Event emitter genérico (`timeline/event-emitter.ts` y `domain-event.ts`)

- **Comportamiento actual**
  - Los handlers de eventos de dominio son llamados y, si devuelven Promises, sus rechazos se capturan con `result.catch(...)` donde se hace `console.error(...)`.
  - El propósito explícito es evitar `unhandled promise rejections`.

- **Problema 5** – Errores en handlers de eventos quedan completamente encapsulados
  1. **Error no manejado o mal manejado**
     - Errores en handlers de eventos se loguean pero **no se reflejan en el flujo de control** que llama al emisor, por diseño.
  2. **Impacto clínico/operativo**
     - Si un handler fallido es responsable de una acción clínica (p.ej. derivar datos a otro módulo, actualizar índices de búsqueda, agregar anotaciones derivadas), esas acciones pueden no ocurrir y el resto del sistema seguir comportándose como si todo hubiera sido exitoso.
  3. **Riesgo**
     - **Medio–Alto** según la criticidad de cada handler.
  4. **Recomendación**
     - Clasificar handlers por criticidad (críticos vs. no críticos) y permitir que los errores en handlers críticos se propaguen como `Result` de error hacia el servicio que disparó el evento.
     - Mantener el patrón actual sólo para handlers explícitamente no críticos.

---

## 3. Frontend – UI y UX ante errores

### 3.1. Estados de carga, error y datos

- **Componentes con manejo explícito de estado**
  - `PatientDetailView`: maneja `loading`, `success`, `not-found`, `error`, con mensajes específicos y acciones de recuperación (`Reintentar`, volver a lista).
  - `UpcomingAppointments`: maneja `loading`, `error` y estados vacíos, con mensajes claros.
  - Formularios (`CreatePatientForm`, `UpdatePatientForm`, `AddAppointmentForm`, `AddClinicalNoteForm`, `AddMedicationForm`, `ChangeMedicationModal`, `StopMedicationModal`):
    - Realizan validación de campos en frontend con mensajes en español.
    - Tras el `fetch`, si `!response.ok`, intentan leer `data.error` y arrojan `Error(data.error || '...')`.
    - Capturan en `catch` y muestran mensajes de error de envío (`submitError`).
  - `PatientHeader`, `DeactivatePatientDialog`, `PatientSidebar`, `PatientStats`, `UpcomingAppointments` manejan errores de red con mensajes de texto y sin bloqueo de toda la app (salvo error boundaries globales).

- **Evaluación**
  - **Detección**: la mayoría de los fallos de red (HTTP !ok) y excepciones en `fetch` se detectan correctamente.
  - **Propagación**: los errores se propagan a estados locales (`error`, `submitError`) y se muestran al usuario.
  - **UX**: hay buena separación entre estados de carga, vacío y error en componentes críticos.

---

### 3.2. Uso de `try/catch` en frontend y errores silenciosos

- **Observaciones**
  - Casi todos los `try/catch` en frontend asignan mensajes de error a un estado de la UI.
  - Excepción puntual en `calculateAge` dentro de `PatientList`:
    - La función encapsula el parseo en `try { ... } catch { return null; }`.
    - Aquí el `catch` vacío **es intencionalmente no ruidoso** y degrada a "edad no mostrada".

- **Problema 6** – Errores silenciosos potenciales en utilitarios de UI (baja criticidad)
  1. **Error no manejado o mal manejado**
     - En `calculateAge`, cualquier excepción (incluyendo bugs de implementación) produce simplemente `null` sin logging ni visibilidad, desigual a otras partes del sistema.
  2. **Impacto clínico/operativo**
     - Sólo afecta la visualización de la edad en la lista de pacientes; no hay impacto directo en decisiones clínicas, pero podría confundir si el problema es sistemático.
  3. **Riesgo**
     - **Bajo** en términos clínicos; es más un riesgo de depuración.
  4. **Recomendación**
     - Mantener el catch silencioso a nivel UX está bien, pero a nivel ingeniería podría ser útil registrar al menos en entorno de desarrollo (sin cambiar mensajes al usuario) para detectar errores de formato sistemáticos.

---

### 3.3. Mensajes de error y traducción

- **Comportamiento actual**
  - Backend devuelve mensajes de error principalmente en inglés.
  - `CreatePatientForm` y `UpdatePatientForm` mantienen un mapa de traducción explícito de mensajes backend → mensajes de validación en español.
  - Otros formularios muestran `data.error` directamente o un mensaje genérico en español.

- **Problema 7** – Inconsistencia en el mapeo de errores backend → mensajes clínicamente útiles
  1. **Error no manejado o mal manejado**
     - Sólo algunos mensajes de backend se traducen a mensajes de UX amigables. Otros se propagan en inglés o como texto genérico, sin diferenciar causa de validación vs. causa sistémica.
  2. **Impacto clínico/operativo**
     - Experiencia inconsistente: en algunos flujos el profesional recibe un mensaje claro y accionable; en otros, un mensaje técnico o genérico.
  3. **Riesgo**
     - **Medio** para usabilidad, bajo para integridad clínica, pero en escenarios críticos puede generar frustración y reintentos manuales.
  4. **Recomendación**
     - Establecer un contrato uniforme: el backend debe exponer un `code` estable (p.ej. `PATIENT_NOT_FOUND`, `INVALID_DATE_RANGE`, etc.) y el frontend debe basar la traducción en `code`, no en el `message`.
     - Conservar mensajes actuales pero evitar depender de texto inglés para la lógica.

---

## 4. Errores de red y datos – coherencia extremo a extremo

### 4.1. Red – timeouts, desconexiones y 5xx

- **Comportamiento actual**
  - El frontend asume que cualquier `!response.ok` es un error y muestra un mensaje genérico (por ejemplo, `Ocurrió un error al ...`, `No se pudo conectar con el servidor`).
  - No se distinguen explícitamente errores de red puros (timeout/conexión) de respuestas 5xx del backend, más allá de la presencia o ausencia de `data.error`.

- **Problema 8** – Falta de diferenciación UX entre error de red e error del backend
  1. **Error no manejado o mal manejado**
     - Un 500 del backend y una caída de red pueden producir mensajes similares en UI, sin guidance específica (reintentar vs. escalar a soporte).
  2. **Impacto clínico/operativo**
     - Ante un problema persistente de backend, el usuario puede seguir reintentando sin saber que se trata de un fallo del sistema.
     - Ante una caída de red local, el usuario no recibe una indicación clara de que el problema está en su conectividad.
  3. **Riesgo**
     - **Medio** para operatividad; puede ralentizar la atención y generar duplicación de esfuerzos.
  4. **Recomendación**
     - Manteniendo los mensajes actuales, enriquecer la lógica en frontend (sin cambiar textos) para diferenciar, al menos internamente, entre:
       - `fetch` que lanza excepción (probable fallo de red).
       - Respuestas 5xx.
     - Usar esa diferenciación para decidir si ofrecer acciones como "verificar conexión" vs. «contactar soporte».

---

### 4.2. Datos – consistencia entre modelo operativo y timeline

- **Síntesis de riesgos ya mencionados**
  - Creación de paciente sin evento fundacional (Problema 3).
  - Operaciones de medicación exitosas sin eventos correspondientes (Problema 4).
  - `ensureEncounterEventsForPatient` se llama en timeline, pero fallos en ese proceso (si los hubiera) podrían tener efectos similares.

- **Problema 9** – Riesgo sistémico de divergencia entre timeline y entidades clínicas
  1. **Error no manejado o mal manejado**
     - Múltiples puntos del código tratan como "warning" errores que afectan directamente la integridad histórica (timeline) sin cortar la operación clínica base (paciente/medicación).
  2. **Impacto clínico/operativo**
     - La timeline puede no ser una representación fiel y exhaustiva de la realidad clínica registrada en el resto de tablas.
     - Cualquier módulo que dependa exclusivamente de la timeline para reconstruir estado (p.ej. `getCurrentState`) puede omitir eventos que sí sucedieron a nivel de entidades, o viceversa.
  3. **Riesgo**
     - **Alto**: la divergencia entre "registro médico" y "vista cronológica" es una fuente clásica de errores clínicos, especialmente en medicación y eventos agudos.
  4. **Recomendación**
     - Definir explícitamente, a nivel de diseño, qué invariantes **no pueden violarse** (por ejemplo: "no puede existir medicación activa sin evento inicial asociado", "todo ClinicalRecord debe tener exactamente un evento fundacional").
     - Para esos invariantes, tratar los errores de timeline como fallos duros (transacción fallida o HTTP 5xx) y no sólo como logs.

---

## 5. Conclusiones y prioridades de mitigación

- **Alta prioridad**
  - Endurecer el tratamiento de fallos en **emisión de eventos de timeline y medicación** (Problemas 3, 4, 9) para evitar estados clínicos inconsistentes entre entidades y timeline.
  - Estandarizar la **propagación de errores de dominio hacia el API** con códigos (`code`) bien definidos, permitiendo a la UI diferenciar validaciones, no-encontrado y fallos sistémicos.

- **Prioridad media**
  - Mejorar la gestión de entradas inválidas en APIs de lectura (por ejemplo, fecha de nacimiento en búsqueda de pacientes) para evitar comportamientos silenciosos.
  - Homogeneizar la lógica del frontend para distinguir red vs. backend y mejorar la UX sin cambiar los mensajes actuales.

- **Prioridad baja (pero recomendable)**
  - Revisar `catch` silenciosos en utilitarios de UI y, al menos, documentar claramente su uso y alcance.
  - Ampliar de forma gradual la capa de traducción de mensajes de backend a códigos/UX-friendly en frontend basados en `code` en lugar de `message` textual.
