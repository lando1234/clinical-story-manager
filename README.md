## Sistema de Historias Clínicas Psiquiátricas

Plataforma de manejo de historia clínica longitudinal para un psiquiatra en práctica privada. El foco está en preservar la continuidad narrativa, la trazabilidad clínica y la seguridad de la información, más que en cubrir todos los casos de uso de un EHR genérico.

---

## 1. Descripción general del proyecto

**Qué problema resuelve**

- Gestionar historias clínicas psiquiátricas longitudinales para un único profesional.
- Registrar, organizar y consultar la evolución clínica de cada paciente a lo largo del tiempo.
- Dar soporte a tareas diarias: consulta de antecedentes, registro de notas, programación de turnos y seguimiento de medicación.

**Para quién está pensado**

- Un solo psiquiatra en consultorio privado (no multiusuario, no multi-sede).
- Desarrolladores y agentes que implementan funcionalidades bajo especificaciones clínicas controladas.

**Qué NO intenta ser**

- No es un EHR hospitalario genérico ni un sistema multiusuario de gran escala.
- No es una herramienta de business intelligence ni de reporting poblacional.
- No es un sistema de facturación, turnero masivo ni agenda para múltiples profesionales.
- No es un repositorio de datos clínicos anónimos para investigación.

---

## 2. Principios del sistema

**Paciente como eje**

- Toda la información del sistema se organiza alrededor del paciente individual.
- La navegación y las vistas principales están pensadas para trabajar "un paciente a la vez".

**Timeline como historia de hechos ocurridos**

- El eje principal de la historia clínica es una línea de tiempo de eventos clínicos.
- Cada modificación relevante en el estado clínico aparece como un evento fechado en la timeline.

**Separación conceptual clave**

- **Documento (Nota)**: texto clínico redactado por el profesional, con intención narrativa y contexto.
- **Evento (NOTE / Encounter)**: hecho clínico atómico que impacta el estado del paciente (p. ej. una consulta, una nota de evolución, un cambio de medicación).
- **Planificación (Turnos)**: acciones futuras planeadas (consultas programadas) que pueden o no concretarse en eventos reales.

**Inmutabilidad clínica**

- Una vez finalizado un documento clínico, su contenido no se edita; solo se corrige mediante mecanismos explícitos (addenda, rectificaciones, etc.) definidos en las specs.
- La historia clínica debe poder reconstruirse exactamente tal como fue registrada en cada momento.

**Trazabilidad**

- Cada cambio relevante en el estado clínico debe ser rastreable a un evento y, cuando aplica, a una nota asociada.
- Las reglas de auditoría y corrección clínica viven en las specs y se verifican mediante tests e invariantes.

---

## 3. Arquitectura conceptual (dominio)

**Paciente**

- Representa a la persona atendida (datos demográficos y estado administrativo básico).
- Es el agregado raíz a partir del cual se navegan timeline, notas, turnos y medicación.

**Historia clínica**

- Es el conjunto de todos los eventos, notas y decisiones de tratamiento vinculados a un paciente.
- No es un único documento, sino una vista longitudinal compuesta principalmente por la timeline.

**Timeline**

- Secuencia ordenada de eventos clínicos asociados a un paciente.
- Integra eventos de notas, turnos concretados, cambios de medicación y otros tipos definidos en las specs.
- Es la forma principal de leer la historia clínica y de razonar sobre el estado actual e histórico.

**Eventos**

- Cada evento representa un hecho clínico o administrativo relevante en un punto del tiempo.
- Los tipos de evento (p. ej. consulta, nota clínica, ajuste de medicación) se definen y documentan exclusivamente en las specs.

**Notas**

- Documentos clínicos redactados por el profesional.
- Pueden estar asociadas a uno o más eventos (por ejemplo, una consulta que genera una nota clínica y cambios terapéuticos).
- Su ciclo de vida (borrador, finalizada, addenda, correcciones) está definido en las specs y se implementa en servicios de dominio.

**Turnos (appointments)**

- Representan planificación futura de encuentros clínicos.
- Pueden transformarse en eventos efectivamente ocurridos o cancelarse.
- La relación entre turnos y eventos concretos de consulta se rige por las specs de timeline y de encuentros.

**Medicación**

- Conjunto de prescripciones y cambios de medicación a lo largo del tiempo.
- Los cambios (inicio, ajuste de dosis, suspensión) se modelan como eventos para preservar la trazabilidad.
- La vista de medicación actual se deriva de la interpretación de la timeline.

---

## 4. Estructura del proyecto

**Visión general del repositorio**

- `docs/` → Contiene la jerarquía de specs clínicas, de dominio, UX, timeline, calidad e infraestructura (ver sección de specs).
- `prisma/` → Esquema de base de datos y migraciones.
- `src/` → Código de aplicación (frontend, backend/API, dominio, datos, UI, tests, tipos compartidos).
- `public/` → Activos estáticos.
- Archivos de configuración (TypeScript, linting, Next.js, PostCSS, etc.).

**Rol de `/docs/specs`**

- Dentro de `docs/specs` se organiza toda la documentación de verdad clínica y de negocio.
- Los subdirectorios agrupan por tema: fundamentos, dominio, eventos, timeline, vistas, UX/UI, infra, calidad y apéndices.

**Frontend (Next.js / React)**

- Vive principalmente en `src/app` (rutas, layouts, entrypoints) y `src/ui/components` (componentes reutilizables).
- Implementa las vistas de paciente, timeline, notas, turnos y medicación siguiendo las constraints de UX y stack definidas en las specs.

**Backend / API**

- Endpoints HTTP bajo `src/app/api` exponen operaciones sobre pacientes, timeline, notas, turnos y medicación.
- La API es deliberadamente simple y orientada a los casos de uso definidos en las specs, no a un API pública genérica.

**Capa de dominio**

- `src/domain` contiene la lógica de negocio pura (servicios, validaciones, motores de timeline, etc.).
- Esta capa no conoce detalles de persistencia ni de UI, y es donde se implementan las invariantes clínicas verificadas por tests.

**Capa de datos**

- `src/data` encapsula el acceso a la base de datos (repositorios, adaptadores a Prisma, etc.).
- Garantiza que el resto del sistema no dependa directamente de detalles de SQL/ORM.

**Infraestructura (Vercel, Prisma)**

- La configuración de Prisma y las migraciones viven en `prisma/`.
- Las decisiones de deploy en Vercel y el flujo de build/run están documentadas en `docs/specs/07_infra`.

---

## 5. Specs como fuente de verdad

**Qué son las specs**

- Son documentos versionados que definen comportamiento clínico, modelo de dominio, timeline, vistas, UX, calidad e infraestructura.
- Son la referencia primaria para cualquier cambio en el sistema.

**Organización principal**

- `docs/specs/00_foundation` → Fundamentos, política de agentes y principios generales.
- `docs/specs/01_domain` → Modelo de dominio, datos y CRUD de pacientes.
- `docs/specs/02_events` → Definición de eventos clínicos, encuentros, notas como eventos, turnos, etc.
- `docs/specs/03_timeline` → Motor de timeline, contratos, invariantes y QA.
- `docs/specs/04_views` → Comportamiento de root, vistas de paciente y timeline, y reglas de responsividad.
- `docs/specs/06_ux_ui` → Lineamientos de UX/UI, localización de eventos clínicos, correcciones clínicas.
- `docs/specs/07_infra` → Lineamientos de base de datos, deploy en Vercel y proceso de build.
- `docs/specs/08_quality` y `docs/specs/99_appendix` → QA clínica, edge cases, checklists y apéndices.

**Cómo leerlas**

- Comenzar por los documentos de fundamentos y dominio antes de tocar código.
- Para cada feature, revisar:
  - Especificación funcional correspondiente.
  - Especificación de timeline (si afecta eventos o estado clínico).
  - Especificaciones de vistas/UX si tiene impacto en UI.

**Cómo extenderlas**

- Toda nueva funcionalidad debe:
  - Proponer o extender la spec correspondiente.
  - Explicitar las invariantes clínicas y de timeline que introduce.
  - Definir los cambios esperados en tests de dominio o invariantes.

**Regla fundamental**

- **No se implementa nada sin spec correspondiente**.
- Si una decisión no está explicitada en las specs, primero se documenta y revisa, luego se implementa.

---

## 6. Flujos principales del sistema

**Entrada al sistema (root)**

- La ruta inicial muestra la perspectiva de trabajo actual del profesional según lo definido en las specs de root y vistas.
- Desde aquí se accede a la selección de paciente y a la vista principal de trabajo.

**Selección de paciente**

- Listado y búsqueda de pacientes, con indicadores básicos de estado.
- La selección de un paciente lleva a la vista centrada en ese paciente (timeline y paneles asociados).

**Timeline clínica**

- Vista principal que muestra los eventos clínicos del paciente en orden temporal.
- Integra notas, turnos concretados, cambios de medicación y otros eventos definidos en las specs.

**Notas clínicas**

- Flujo para creación, edición y finalización de notas clínicas.
- Una vez finalizada, la nota se vuelve inmutable; las correcciones se realizan mediante mecanismos definidos (addenda, rectificaciones) que generan nuevos eventos.

**Turnos (appointments)**

- Creación y gestión de turnos futuros del paciente.
- Relación explícita entre turnos agendados y eventos que representan consultas efectivamente realizadas o canceladas.

**Medicación**

- Gestión de medicación activa e histórica del paciente.
- Los cambios de medicación se representan como eventos en la timeline, permitiendo reconstruir la historia farmacológica.

---

## 7. Desarrollo local (alto nivel)

**Requisitos básicos**

- Entorno Node.js y gestor de paquetes estándar.
- Acceso a una base de datos PostgreSQL compatible con Prisma.
- Variables de entorno configuradas según el archivo de ejemplo del proyecto.

**Levantando el proyecto**

- Instalar dependencias según el gestor de paquetes elegido.
- Aplicar las migraciones de Prisma a la base de datos configurada.
- Iniciar el servidor de desarrollo de Next.js.

**Configuración de base de datos de test**

Para ejecutar los tests, necesitas configurar una base de datos local de PostgreSQL:

1. Crea un archivo `.env.test` en la raíz del proyecto:
   ```bash
   DATABASE_URL="postgresql://tu_usuario@localhost:5432/clinical_story_manager_test"
   ```

2. Crea la base de datos de test:
   ```bash
   npm run test:db:create
   ```

3. Aplica las migraciones:
   ```bash
   npm run test:db:setup
   ```

4. Ejecuta los tests:
   ```bash
   npm test
   ```

Para más detalles, consulta `docs/TEST_DATABASE_SETUP.md`.

**Qué NO hacer**

- No agregar comandos de migración o seed en pasos de build de producción.
- No ejecutar migraciones automáticas en tiempo de ejecución en Vercel.
- No modificar el esquema de base de datos sin antes actualizar las specs correspondientes.

Para detalles concretos de comandos y flujos, consultar las specs de infraestructura en `docs/specs/07_infra`.

---

## 8. Deploy y entorno

**Uso de Vercel**

- El proyecto está pensado para deploy en Vercel utilizando el modelo de App Router de Next.js.
- El proceso de build se realiza en el entorno de Vercel y debe ser determinista y libre de efectos colaterales en la base de datos.

**Principios de build seguro**

- Durante el build no se deben ejecutar migraciones, seeds ni operaciones que cambien el estado de la base de datos.
- Todas las operaciones de escritura pertenecen al runtime (ejecución de la app) o a pasos de migración controlados fuera del build.

**Separación build / runtime**

- El código debe distinguir claramente entre:
  - Configuración y generación de artefactos en tiempo de build.
  - Lógica de negocio y acceso a datos en tiempo de ejecución.
- Las specs de infraestructura definen qué está permitido en cada fase y cómo manejar conexiones a la base de datos en Vercel.

---

## 9. Convenciones clave

**Naming**

- Nombres de entidades y servicios de dominio en inglés técnico consistente (patient, timeline, note, appointment, medication, etc.).
- Textos de interfaz de usuario en español (Argentina), siguiendo las guías lingüísticas en `docs/specs/06_ux_ui`.

**Commits**

- Mensajes breves y descriptivos, centrados en el propósito (p. ej. "Implementar flujo de creación de nota clínica"), no en detalles de implementación.
- Mantener alineación entre commits y cambios en specs cuando corresponda.

**Idioma y terminología**

- UI en español Argentina, con cuidado en la terminología clínica.
- En código, priorizar términos de dominio claros y consistentes; las traducciones de eventos y labels se definen en las specs de localización.

**Uso del término "Encounter"**

- **No usar "Encounter" fuera de las specs** para nombrar entidades nuevas o conceptos de UI.
- En el código y la UI concreta, seguir los nombres y contratos establecidos en las specs de eventos y timeline.

**No duplicar reglas clínicas**

- Las reglas clínicas viven en las specs y en la capa de dominio (tests + servicios), no en la UI ni en múltiples capas.
- Evitar reimplementar validaciones clínicas en varios lugares; referenciar servicios de dominio o helpers centralizados.

---

## 10. Cómo contribuir

**Proceso esperado**

1. Identificar la necesidad o cambio (bug, mejora, nueva funcionalidad).
2. Localizar las specs relevantes y verificar si el caso ya está cubierto.
3. Si falta cobertura, proponer actualización o nueva spec:
   - Describir el comportamiento esperado.
   - Explicitar invariantes clínicas y de timeline.
4. Alinear la implementación con las specs:
   - Actualizar o agregar tests de dominio y de invariantes.
   - Implementar en las capas correspondientes (dominio, datos, API, UI).
5. Preparar el commit/PR con referencia a la spec que justifica el cambio.

**Qué revisar antes de agregar algo nuevo**

- Que exista una spec que lo respalde o una propuesta clara para incorporarla.
- Que no rompa invariantes clínicas definidas en las specs de timeline y QA.
- Que no duplique reglas ya existentes en otra parte del sistema.
- Que respete las constraints de stack y UX establecidas.

---

## 11. Estado del proyecto

**MVP en evolución**

- El proyecto se encuentra en una fase de MVP avanzado con foco en paciente único, timeline, notas, turnos y medicación.

**Áreas relativamente estables**

- Modelo de paciente y operaciones básicas de CRUD.
- Estructura general de timeline y sus invariantes principales.
- Organización de specs y principios de infraestructura (Prisma + Vercel).

**Áreas en crecimiento o susceptibles de cambio**

- Detalles de UX/UI en vistas específicas de timeline, notas y medicación.
- Tipos de eventos clínicos adicionales y reglas de corrección clínica.
- Integraciones futuras y mejoras en estadísticas o paneles de apoyo a la decisión.

La referencia siempre vigente para saber qué está estable y qué está en evolución son las specs en `docs/specs` y la batería de tests de invariantes en `src/tests`. Cualquier duda debe resolverse primero a nivel de documentación antes de modificar código.