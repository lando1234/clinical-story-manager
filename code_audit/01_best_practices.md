### Auditoría de código y arquitectura

**Proyecto**: clinical-story-manager  
**Fecha**: 2025-12-18  
**Stack**: Next.js (App Router), React, TypeScript, Prisma, PostgreSQL

---

### 1. Visión general

El proyecto presenta una arquitectura claramente orientada a dominio, con separación explícita entre capas (`docs/specs`, `src/domain`, `src/data`, `src/app`, `src/ui`, `src/tests`) y un uso consistente de TypeScript y Prisma. La existencia de specs extensas y tests de invariantes es un punto muy fuerte para un sistema clínico. La mayoría de las observaciones son de mejora incremental para reforzar mantenibilidad, consistencia y riesgos operativos.

---

### 2. Hallazgos sobre arquitectura y organización

#### 2.1. Uso inconsistente de la capa de datos vs. acceso directo a Prisma

1. **Descripción**  
   - En `src/domain/patient/service.ts` se utiliza directamente `prisma` dentro de la capa de dominio para operaciones transaccionales (creación de `Patient`, `ClinicalRecord`, `PsychiatricHistory` y evento fundacional), mientras que en el mismo servicio se delegan otras operaciones de lectura/actualización a `PatientRepository` (`src/data/patient/repository.ts`).  
   - En `src/domain/timeline/state-resolver.ts` también se accede directamente a `prisma` para consultas complejas de estado clínico.  
   - Esto genera un patrón mixto: una parte de la lógica de dominio se apoya en repositorios, otra en Prisma directo.

2. **Severidad**  
   - **Media**

3. **Riesgo asociado**  
   - Aumento del acoplamiento entre dominio e infraestructura de persistencia, dificultando cambios futuros en el ORM o la base de datos.  
   - Mayor probabilidad de duplicar lógica de queries o criterios de ordenamiento/filtrado en múltiples archivos.  
   - Dificultad para testear de forma aislada la lógica de dominio sin acceder a la base de datos real.

4. **Recomendación concreta**  
   - Definir una política clara de acceso a datos en la capa de dominio (por ejemplo, "la capa de dominio solo conversa con repositorios / adaptadores, nunca con `prisma` directamente").  
   - Extraer las operaciones complejas de lectura/escritura (incluyendo transacciones) a repositorios o a una capa de `data` especializada (p. ej. `ClinicalRecordRepository`, `TimelineRepository`) que encapsule Prisma.  
   - Actualizar gradualmente los servicios de dominio para depender exclusivamente de esas abstracciones, manteniendo la semántica transaccional.

---

#### 2.2. Lógica de dominio en servicios "estáticos" vs. servicios instanciados

1. **Descripción**  
   - `PatientService` se expone como objeto literal con métodos estáticos, mientras que `AppointmentService` es una clase instanciada (`appointmentService = new AppointmentService(appointmentRepository)`).  
   - Esta diferencia de patrón no parece responder a una diferencia esencial de dominio, y rompe la consistencia interna de la capa de servicios.

2. **Severidad**  
   - **Baja**

3. **Riesgo asociado**  
   - Dificulta la inyección sistemática de dependencias (por ejemplo, repositorios mockeados) en todos los servicios de dominio.  
   - Complica la adopción de patrones uniformes para testing, logging o cross-cutting concerns a nivel de servicio.

4. **Recomendación concreta**  
   - Acordar un patrón único para servicios de dominio (por ejemplo, clases instanciadas con dependencias explícitas en el constructor).  
   - Planificar una migración gradual de servicios tipo objeto estático a servicios instanciados, priorizando aquellos donde se desee mayor testabilidad o desacoplamiento.

---

#### 2.3. Dependencia directa de `NextRequest`/`NextResponse` en controladores API sin capa de adaptación intermedia

1. **Descripción**  
   - Los handlers en `src/app/api/.../route.ts` usan directamente `NextRequest`/`NextResponse` y realizan parseo manual de parámetros y cuerpos (por ejemplo, parseo de fechas en `patients/route.ts` y en rutas de timeline).  
   - La lógica de mapeo HTTP ↔ comandos de dominio está dispersa por varios handlers, sin una capa común de adaptación o helpers más estructurados (más allá de `src/lib/api-helpers.ts`, que se usa poco en los ejemplos revisados).

2. **Severidad**  
   - **Media**

3. **Riesgo asociado**  
   - Duplicación de lógica de parseo/validación superficial (por ejemplo, manejo de fechas, códigos de error y status HTTP).  
   - Mayor probabilidad de inconsistencias en el tratamiento de errores (p. ej. cuándo devolver 400 vs 404 vs 500) entre endpoints diferentes.  
   - Dificultad para aplicar políticas transversales (logging, autenticación futura, tracing) de forma homogénea.

4. **Recomendación concreta**  
   - Definir un pequeño conjunto de convenciones para controladores (por ejemplo, helpers para parsear fechas, construir respuestas de error uniformes y mapear `DomainError` → HTTP status).  
   - Centralizar en `lib/api-helpers` o módulo similar las funciones de adaptación HTTP más repetidas (parseo de parámetros, gestión de errores, validación básica), e ir adoptándolas progresivamente en los handlers existentes.  
   - Mantener la lógica clínica y de negocio exclusivamente en la capa de dominio, asegurando que los handlers sean lo más finos posible.

---

### 3. Hallazgos sobre diseño de dominio y reglas clínicas

#### 3.1. Comentarios que documentan excepciones operativas no modeladas formalmente

1. **Descripción**  
   - En `PatientService.createPatient` se documenta explícitamente que si falla la creación del evento fundacional, se registra el error pero **no se revierte** la transacción clínica (paciente + historia). Esto se consigna en comentarios, pero no está modelado como parte de un contrato explícito de consistencia eventual.  
   - Esta decisión es comprensible, pero relega una inconsistencia clínica potencial a un simple `console.error`.

2. **Severidad**  
   - **Media** (para un sistema clínico, por impacto en trazabilidad).

3. **Riesgo asociado**  
   - Existencia de pacientes/historias clínicas sin evento fundacional en la timeline, lo que puede romper invariantes esperadas en specs y tests o producir resultados sorpresivos en vistas basadas en timeline.  
   - Dificultad para detectar y corregir estos desfasajes en producción si solo se registran en logs.

4. **Recomendación concreta**  
   - Formalizar en specs e invariantes cuándo es aceptable que falte un evento fundacional y cómo se debe manejar (p. ej. proceso de reparación, alertas internas).  
   - Definir una política clara: o bien la creación del evento fundacional es parte integral de la transacción (y el alta falla si no se puede crear), o bien se introduce un mecanismo explícito de compensación / verificación periódica.  
   - Alinear los tests de invariantes para cubrir estos escenarios y asegurar que cualquier excepción quede bajo control clínico.

---

#### 3.2. Mezcla de DTOs de dominio con tipos generados de Prisma en servicios

1. **Descripción**  
   - `PatientService` combina tipos de dominio (`CreatePatientInput`, `PatientOutput`) con tipos generados (`Patient` de `generated/prisma`) y conversores directos (`toPatientOutput`).  
   - En `state-resolver` se trabaja directamente con modelos Prisma (`medication`, `psychiatricHistory`, `clinicalEvent`) y se mapearon manualmente a tipos de dominio (`ActiveMedication`, `TimelineEventSummary`, etc.).

2. **Severidad**  
   - **Media**

3. **Riesgo asociado**  
   - Propagación de tipos de infraestructura (Prisma) en la capa de dominio, lo que dificulta cambios futuros en el modelo físico de base de datos sin impacto directo en lógica clínica.  
   - Posibilidad de fuga de detalles no deseados hacia capas superiores (p. ej. campos técnicos, relaciones internas) si no se controla sistemáticamente el mapeo.

4. **Recomendación concreta**  
   - Establecer como principio que la capa de dominio opera solo con tipos propios (DTOs y tipos de dominio) y delega la conversión desde/hacia modelos Prisma a la capa de datos.  
   - Consolidar las funciones de mapeo en un lugar único por agregado (p. ej. `patient-mapper`, `timeline-mapper`) en la capa de datos o en un submódulo de dominio claramente marcado como boundary.  
   - Revisar los servicios más críticos para asegurar que exponen solo tipos de dominio hacia la UI y API.

---

### 4. Hallazgos sobre UI y componentes React

#### 4.1. Fetching de datos en componentes de cliente sin reutilización de hooks o capa de queries

1. **Descripción**  
   - Componentes como `PatientDetailView` realizan `fetch` directamente dentro de un `useEffect`, parsean errores y manejan estados de carga, error y not-found de forma local.  
   - No se observa una capa común de hooks de datos (p. ej. `usePatient`, `useTimeline`) ni el uso sistemático de bibliotecas de manejo de datos remotos (SWR, React Query, etc.), aunque esto puede ser una decisión deliberada.

2. **Severidad**  
   - **Baja/Media** (depende de la escala esperada, pero en un sistema clínico la consistencia de estados de error es relevante).

3. **Riesgo asociado**  
   - Duplicación de patrones de carga/errores en múltiples componentes, con posibles diferencias sutiles en mensajes y manejo de estados.  
   - Mayor esfuerzo de mantenimiento si se modifican rutas API, estructuras de datos o políticas de reintento/cache.  
   - Dificultad para aplicar políticas transversales de error handling o logging en la UI.

4. **Recomendación concreta**  
   - Definir, como mínimo, una pequeña librería interna de hooks de datos para casos de uso centrales (paciente, timeline, citas, medicación), incluso si se decide no introducir una librería externa de data fetching.  
   - Estandarizar el contrato de estados (loading, error, empty, success) y los mensajes de error UX, alineándolos con las guías de `docs/specs/06_ux_ui`.  
   - Evaluar en el mediano plazo la conveniencia de una solución de data fetching/revalidación unificada si el número de vistas crece.

---

#### 4.2. Formateo y cálculo de fechas directamente en componentes de presentación

1. **Descripción**  
   - En `PatientDetailView` se realiza cálculo de edad y formateo de fechas con `toLocaleDateString`/`toLocaleString` directamente en el componente.  
   - En otras partes (por ejemplo, `appointments/upcoming`) se formatean fechas a mano con `toISOString().split('T')...`.

2. **Severidad**  
   - **Baja**

3. **Riesgo asociado**  
   - Posible inconsistencia de formatos de fecha/hora entre distintas vistas (especialmente relevante para un sistema clínico donde los timestamps son críticos).  
   - Mayor dificultad para cambios globales de formato (por ejemplo, ajustes de zona horaria, localización más fina) o para introducir reglas clínicas específicas sobre límites de fecha.

4. **Recomendación concreta**  
   - Centralizar las utilidades de formateo de fechas/horas en un módulo compartido (`date-utils` o similar), siguiendo las pautas de localización definidas en las specs.  
   - Mantener los componentes de presentación enfocados en layout y estilos, delegando cálculo/transformación de datos a capas previas (hooks, view-models o helpers).

---

### 5. Hallazgos sobre consistencia técnica y naming

#### 5.1. Patrones mixtos de importación (paths relativos vs. aliases)

1. **Descripción**  
   - En algunos archivos se usan imports relativos largos (por ejemplo, `../../domain/patient/service`), mientras que en otros se emplean aliases de TypeScript/Next (`@/domain/timeline`, `@/lib/prisma`).  
   - Esta mezcla se observa incluso dentro de la misma capa, lo que sugiere una transición incompleta hacia aliases.

2. **Severidad**  
   - **Baja**

3. **Riesgo asociado**  
   - Menor legibilidad en rutas relativas profundas, y mayor probabilidad de errores al mover archivos.  
   - Inconsistencia estética y cognitiva para nuevos contribuidores al proyecto.

4. **Recomendación concreta**  
   - Definir una convención explícita en las guías de contribución sobre cuándo usar aliases vs. rutas relativas.  
   - Normalizar progresivamente los imports hacia aliases para módulos de alto nivel (`domain`, `data`, `types`, `ui`, `lib`).  
   - Incorporar una regla de linting o validación automatizada si se desea forzar esta convención.

---

#### 5.2. Tipos y contratos bien definidos pero dispersos entre `types/` y `domain`

1. **Descripción**  
   - Existen tipos transversales en `src/types` (`patient`, `timeline`, `ui`, `errors`, etc.) y tipos específicos dentro de `src/domain/.../types.ts`.  
   - La separación parece razonable, pero no está documentado de forma explícita qué va en `types/` y qué va en `domain/*/types.ts`.

2. **Severidad**  
   - **Baja**

3. **Riesgo asociado**  
   - Posible duplicación de interfaces o tipos conceptualmente equivalentes en distintas carpetas.  
   - Dificultad para que nuevos desarrolladores localicen el "tipo fuente" de verdad para una entidad o DTO concreto.

4. **Recomendación concreta**  
   - Documentar en `README` o en una pequeña spec interna la política de ubicación de tipos (por ejemplo, "`src/types` contiene contratos compartidos entre capas; `src/domain/*/types` contiene tipos internos a ese subdominio").  
   - Realizar una revisión ligera para detectar tipos duplicados o muy similares y consolidarlos donde sea apropiado.

---

### 6. Hallazgos sobre rendimiento y escalabilidad

#### 6.1. Posible sobrecarga en consultas de pacientes para features específicas

1. **Descripción**  
   - En `api/appointments/upcoming`, para enriquecer las citas con nombre de paciente, se llama a `PatientService.listPatients()` y luego se filtra en memoria por IDs relevantes.  
   - Esto implica traer todos los pacientes para cada request, independientemente del número real de citas.

2. **Severidad**  
   - **Media** (baja hoy por volumen esperado, pero con potencial de crecer).

3. **Riesgo asociado**  
   - Degradación de rendimiento a medida que aumenta el número de pacientes, con impacto directo en vistas de agenda.  
   - Mayor consumo de memoria y tiempo de respuesta innecesario en endpoints sensibles al tiempo.

4. **Recomendación concreta**  
   - Ajustar la capa de datos o de servicio para permitir queries selectivas de pacientes por un conjunto de IDs (p. ej. método `findByIds`).  
   - Evitar el patrón de `listAll` en endpoints que solo necesitan un subconjunto pequeño de entidades.  
   - Mantener bajo observación este tipo de patrones en endpoints que podrían usarse frecuentemente en la práctica clínica.

---

### 7. Hallazgos sobre pruebas e invariantes

#### 7.1. Dependencia fuerte de tests de invariantes, pero sin capa de contrato clara para todos los servicios

1. **Descripción**  
   - Existen tests de invariantes clínicos bien organizados (`src/tests/invariants/*`), lo que es un punto fuerte.  
   - Sin embargo, no todos los servicios de dominio tienen contratos tan explícitos como el `state-resolver` (que referencia directamente a `docs/14_timeline_contracts.md`).

2. **Severidad**  
   - **Baja/Media**

3. **Riesgo asociado**  
   - Decisiones de negocio importantes (por ejemplo, reglas de cancelación de turnos, validaciones de alta de paciente) pueden quedar documentadas solo en código o tests, sin un enlace explícito a specs.  
   - Menor trazabilidad entre cambios de dominio y la documentación clínica que los respalda.

4. **Recomendación concreta**  
   - Extender la práctica usada en `state-resolver` (referencias a contratos específicos de specs) a otros servicios de dominio clave, utilizando comentarios breves que enlace a las specs correspondientes.  
   - Mantener sincronizados contratos, servicios y tests mediante una checklist en `docs/specs/99_appendix` o similar, para cambios de alto impacto.

---

### 8. Conclusión

En conjunto, el proyecto muestra una arquitectura sólida y alineada con buenas prácticas modernas para aplicaciones clínicas basadas en Next.js y Prisma, con énfasis claro en dominio y en tests de invariantes. Las mejoras sugeridas se enfocan principalmente en reforzar la separación entre dominio y persistencia, homogenizar patrones (servicios, imports, manejo de errores y fechas) y evitar posibles cuellos de botella o inconsistencias futuras. Implementar estas recomendaciones de forma gradual, priorizando las áreas de mayor riesgo clínico y operacional, permitirá mantener la calidad del sistema a medida que crezca en alcance y complejidad.