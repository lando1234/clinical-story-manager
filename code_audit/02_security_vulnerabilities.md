# Auditoría de Seguridad - Clinical Story Manager

> Informe inicial generado automáticamente. Revisar y complementar antes de usar en compliance formal.

## 1. Resumen ejecutivo

Este documento identifica riesgos de seguridad a nivel de código, arquitectura y configuración para la aplicación **Clinical Story Manager**, enfocada en historiales psiquiátricos (datos altamente sensibles).

Se analizan:
- **Frontend (Next.js 16 App Router)**
- **Backend / API Routes** (`src/app/api/...`)
- **Capa de dominio y acceso a datos (Prisma + PostgreSQL)**
- **Configuración de despliegue en Vercel / entorno serverless**

Las vulnerabilidades se agrupan por temática (OWASP) e incluyen descripción, severidad, superficie de ataque y recomendaciones.

---

## 2. Autenticación y autorización

### 2.1 Ausencia total de autenticación en la API

- **Descripción**: Los endpoints en `src/app/api/**` (p. ej. `/api/patients`, `/api/patients/[id]/timeline`, `/api/appointments/upcoming`, `/api/stats/patients`) no realizan **ningún tipo de autenticación**. No se verifica identidad de usuario (no hay tokens, sesiones, cabeceras de auth ni middleware).
- **Tipo**: OWASP A01:2021 – *Broken Access Control* (y ausencia de A07:2017 *Insufficient Attack Protection*).
- **Severidad**: **Crítico**.
- **Superficie de ataque**:
  - Cualquier cliente que pueda resolver el dominio puede:
    - Listar todos los pacientes (`GET /api/patients`).
    - Consultar timelines clínicos completos (`GET /api/patients/:id/timeline`, `current-state`, `at-date`).
    - Gestionar notas clínicas, medicaciones y turnos (creación, modificación, cancelación).
  - Impacto directo sobre **confidencialidad, integridad y trazabilidad** de datos psiquiátricos.
- **Recomendación**:
  - Implementar un mecanismo de autenticación robusto en el backend (por ejemplo, **OIDC/OAuth2** con un IdP confiable, o **NextAuth** con JWT/Session Cookies seguras).
  - Exigir autenticación en todas las rutas API que acceden a datos de pacientes.
  - Centralizar la verificación en un helper/middleware de servidor y utilizarlo en cada handler de `route.ts`.

### 2.2 Falta de autorización a nivel de dominio (control de acceso por rol / ámbito)

- **Descripción**: La capa de dominio (`src/domain/**`) y los servicios que se invocan desde la API no reciben ningún contexto de usuario (rol, organización, permisos). Todas las operaciones asumen acceso pleno a cualquier paciente/nota/medicación.
- **Tipo**: OWASP A01:2021 – *Broken Access Control*.
- **Severidad**: **Alto**.
- **Superficie de ataque**:
  - Un usuario autenticado (cuando se agregue auth) podría acceder o modificar **cualquier** paciente si sólo se verifica que está autenticado pero no sus permisos.
- **Recomendación**:
  - Definir un modelo de **roles y scopes** (p.ej. psiquiatra, administrativo, solo lectura, auditoría).
  - Pasar un contexto de seguridad (usuario + rol + organización) a servicios de dominio clave.
  - Implementar verificaciones sistemáticas, p. ej. `canReadPatient(user, patientId)`, `canEditClinicalNote(user, noteId)`.

---

## 3. Manejo de datos sensibles

### 3.1 Exposición de datos clínicos completos vía API sin minimización

- **Descripción**: Varios endpoints devuelven objetos de dominio completos (patient, timeline, notes, medications) sin aplicar **minimización** ni máscaras. Para un sistema psiquiátrico, esto implica exponer:
  - Historial psiquiátrico completo.
  - Notas clínicas detalladas.
  - Medicación y eventos sensibles.
- **Tipo**: OWASP A03:2021 – *Sensitive Data Exposure*.
- **Severidad**: **Alto** (dadas las regulaciones típicas del sector salud).
- **Superficie de ataque**:
  - `GET /api/patients` puede devolver todos los pacientes con todos sus campos clínicos si la capa de servicio no restringe los select.
  - Endpoints de timeline devuelven la historia clínica longitudinal.
- **Recomendación**:
  - Definir **DTOs específicos** para respuestas públicas, con sólo los campos necesarios para la UI.
  - Evitar exponer campos especialmente sensibles en listados; usarlos sólo en vistas detalladas con controles de acceso más estrictos.
  - Aplicar principios de **data minimization** y **privacidad por defecto**.

### 3.2 Falta de enmascaramiento / tokenización de identificadores

- **Descripción**: Los IDs de pacientes (`Patient.id`) se exponen directamente en la API y en la UI. Si están basados en UUIDs (como en el schema), la exposición es moderada, pero sigue permitiendo enumeración en algunos escenarios.
- **Tipo**: OWASP A01:2021 – *Broken Access Control* / OWASP A02:2021 – *Cryptographic Failures* (parcial).
- **Severidad**: **Medio**.
- **Superficie de ataque**:
  - URLs como `/patients/:id` y `/api/patients/:id/...` permiten que un atacante que obtenga un ID válido intente adivinar o reutilizarlo en otros contextos.
- **Recomendación**:
  - Mantener UUIDs, pero añadir controles de acceso estrictos.
  - Considerar **scoping** por organización/tenant si la app se usa en múltiples entornos.
  - Registrar y monitorizar accesos por ID de paciente.

---

## 4. Exposición de endpoints y superficie de API

### 4.1 API REST abierta sin rate limiting ni protección básica

- **Descripción**: No se observa ningún mecanismo de **rate limiting**, **throttling**, CAPTCHAs o similares en los endpoints bajo `/api`. La API está pensada para uso interno de la SPA, pero queda expuesta a clientes externos.
- **Tipo**: OWASP A10:2021 – *Server-Side Request Forgery* (no aplica directo) / OWASP API Security – *Lack of Resource & Rate Limiting*.
- **Severidad**: **Medio-Alto**.
- **Superficie de ataque**:
  - Brute force para descubrimiento de IDs de pacientes, notas, medicaciones.
  - Generación masiva de datos (no hay límites de tamaño de payload ni conteo por IP/usuario).
- **Recomendación**:
  - Implementar **rate limiting** a nivel de edge o middleware (Vercel Edge Middleware, API Gateway, etc.).
  - Establecer **límites de tamaño de cuerpo** de petición (body size limit) y timeouts razonables.
  - Registrar y monitorizar patrones anómalos de tráfico.

### 4.2 Métodos HTTP privilegiados accesibles sin protección adicional

- **Descripción**: Muchos endpoints `POST`, `PATCH`, `DELETE` permiten operaciones críticas (crear pacientes, modificar notas, suspender medicación). Sin auth ni autorización, representan un riesgo muy alto.
- **Tipo**: OWASP A01:2021 – *Broken Access Control*.
- **Severidad**: **Crítico**.
- **Superficie de ataque**:
  - `POST /api/patients` crea nuevos historiales.
  - `PATCH /api/patients/:id`, `POST /api/patients/:id/notes`, `POST /api/patients/:id/medications` modifican datos clínicos.
- **Recomendación**:
  - Requerir autenticación y autorización específicas por rol.
  - Añadir validaciones adicionales (p.ej. imposibilidad de borrar notas finalizadas).
  - Implementar **auditoría** (logging estructurado) para todas las operaciones de escritura.

---

## 5. Inyección, XSS y CSRF

### 5.1 Riesgo de inyección SQL mitigado parcialmente por Prisma pero sin validación fuerte

- **Descripción**: El acceso a base de datos se realiza vía Prisma (`src/lib/prisma.ts`, `schema.prisma`), lo que reduce el riesgo de SQL injection directa. Sin embargo, no hay evidencias de **validación robusta** de entradas en todas las rutas.
- **Tipo**: OWASP A03:2021 – *Injection*.
- **Severidad**: **Medio**.
- **Superficie de ataque**:
  - Campos de texto libres en notas clínicas, motivos de medicación, etc., son persistidos tal cual.
  - La ausencia de validaciones consistentes a nivel de dominio podría propagar datos malformados.
- **Recomendación**:
  - Centralizar validación de input (p.ej. usando Zod o validaciones estrictas en servicios de dominio).
  - Mantener uso exclusivo de Prisma (evitar consultas SQL crudas salvo con parametrización estricta).

### 5.2 Riesgo de XSS almacenado (contenido clínico renderizado en la UI)

- **Descripción**: Notas clínicas, addendas, motivos de medicación y otros textos libres son cadenas controladas por usuario. En React, si se renderizan como texto plano no hay problema; pero **cualquier uso de `dangerouslySetInnerHTML` o librerías que interpreten HTML/Markdown sin sanitización** podría causar XSS almacenado.
- **Tipo**: OWASP A03:2021 – *Injection* / *Cross-Site Scripting (XSS)*.
- **Severidad**: **Alto** (puede comprometer sesión, datos y credenciales).
- **Superficie de ataque**:
  - Vistas como `Timeline`, `NotesPanel`, `PatientDetailView` (no se ha detectado código peligroso en este análisis automatizado, pero son superficies probables).
- **Recomendación**:
  - Asegurarse de **no usar `dangerouslySetInnerHTML`** con datos de notas/medicaciones.
  - Si se necesita formato enriquecido, incorporar una librería de sanitización (DOMPurify u otra) y limitar el subconjunto de HTML permitido.
  - Añadir tests específicos de XSS (p.ej. introducir `<script>` en notas y garantizar que se escapa correctamente).

### 5.3 Ausencia de protecciones CSRF (para escenarios con cookies de sesión)

- **Descripción**: Actualmente no hay auth, pero si en el futuro se adoptan **cookies de sesión** (en lugar de JWT en Authorization header), los endpoints mutadores (`POST`, `PATCH`, `DELETE`) son vulnerables a **CSRF** si no se añaden contramedidas.
- **Tipo**: OWASP A05:2021 – *Security Misconfiguration* / Clásico **CSRF**.
- **Severidad**: **Alto** (potencialmente crítico cuando se implemente auth basada en cookies).
- **Superficie de ataque**:
  - Formularios o peticiones desde terceros dominios podrían disparar acciones en nombre del usuario logueado.
- **Recomendación**:
  - Si se usan cookies de sesión, implementar **tokens CSRF** y cabeceras específicas (p.ej. `X-CSRF-Token`).
  - Configurar cookies con `SameSite=Lax` o `Strict`, `HttpOnly`, `Secure`.
  - Considerar uso de **JWT en Authorization header** para reducir superficie de CSRF (aunque no elimina todos los vectores).

---

## 6. Variables de entorno y secretos

### 6.1 `DATABASE_URL` sin validación y uso de SSL con `rejectUnauthorized: false`

- **Descripción**: En `src/lib/prisma.ts` el pool de `pg` se configura con:
  - `connectionString: process.env.DATABASE_URL`
  - `ssl: { rejectUnauthorized: false }`

  Esto desactiva la validación del certificado TLS, permitiendo ataques de tipo **Man-in-the-Middle** si alguien logra interponerse en la conexión.
- **Tipo**: OWASP A02:2021 – *Cryptographic Failures* / *Security Misconfiguration*.
- **Severidad**: **Alto**.
- **Superficie de ataque**:
  - Conexión a base de datos (Neon/Postgres) podría ser interceptada en redes comprometidas o por un actor en la ruta.
- **Recomendación**:
  - Configurar SSL con validación adecuada (usar certificados de confianza, `rejectUnauthorized: true`).
  - Documentar en `.env.example` el formato correcto de `DATABASE_URL` y cualquier variable extra para certificados.
  - Evitar desactivar verificaciones TLS en producción; si se necesita para desarrollo local, condicionar por `NODE_ENV`.

### 6.2 Ausencia de variables de entorno para claves de cifrado / secretos de aplicación

- **Descripción**: No se observan referencias a secretos de aplicación (claves JWT, claves de cifrado de datos, etc.) en el código ni en `.env.example` (no analizable por restricciones de entorno). Esto sugiere que aún **no hay cifrado a nivel de aplicación** ni JWT firmados.
- **Tipo**: OWASP A02:2021 – *Cryptographic Failures*.
- **Severidad**: **Medio-Alto** (se volverá crítico al introducir auth).
- **Superficie de ataque**:
  - Futuras implementaciones de auth podrían usar valores por defecto inseguros si no se definen secretos fuertes.
- **Recomendación**:
  - Definir claramente variables como `AUTH_SECRET`, `JWT_SECRET`, etc., con generación de claves fuertes.
  - Gestionar estos secretos exclusivamente via **Vercel Environment Variables** u otro secret manager (no commitearlos en git).

---

## 7. Dependencias y configuración de build/deploy

### 7.1 Uso de versiones recientes pero sin política explícita de actualización de seguridad

- **Descripción**: `package.json` utiliza versiones modernas (`next@16`, `react@19`, `prisma@7`, etc.) y define algunos `overrides` de seguridad (`undici`, `esbuild`, `path-to-regexp`). No obstante, no se ve una política documentada para gestión de vulnerabilidades en dependencias.
- **Tipo**: OWASP A06:2021 – *Vulnerable and Outdated Components*.
- **Severidad**: **Medio**.
- **Superficie de ataque**:
  - Vulnerabilidades futuras en dependencias de red (`undici`, `pg`, `next`, etc.) podrían afectar la app si no se actualizan a tiempo.
- **Recomendación**:
  - Integrar **Dependabot, Renovate o similar** para actualización automática/monitorizada de dependencias.
  - Añadir al pipeline de CI un paso de **SCA (Software Composition Analysis)** (p.ej. `npm audit`, `snyk`, etc.).

### 7.2 Build en Vercel sin capa de hardening documentada

- **Descripción**: `next.config.ts` es mínimo y no incluye:
  - Cabeceras de seguridad HTTP (CSP, HSTS, X-Frame-Options, etc.).
  - Configuración de imágenes remotas o restricciones de dominio.
- **Tipo**: OWASP A05:2021 – *Security Misconfiguration*.
- **Severidad**: **Medio**.
- **Superficie de ataque**:
  - Menor hardening a nivel de navegador (falta de CSP facilita XSS, falta de HSTS permite downgrade a HTTP en ciertos escenarios).
- **Recomendación**:
  - Definir `headers()` o configuración equivalente para:
    - `Content-Security-Policy` restrictiva (bloquear inline scripts, limitar orígenes).
    - `Strict-Transport-Security` (HSTS) para forzar HTTPS.
    - `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, etc.
  - Revisar docs internas (`docs/specs/07_infra`) para alinear con requisitos de producción.

---

## 8. Observaciones específicas por capa

### 8.1 Frontend (Next.js App Router)

- **Descripción**: Las páginas en `src/app` parecen server components que consumen datos desde la API/capa de datos interna (`fetchAllPatientsForUI`, etc.). No se observan patrones peligrosos de manipulación directa del DOM.
- **Riesgos principales**:
  - Reutilización de datos sin sanitizar desde el backend (posible XSS si en el futuro se usa HTML crudo).
  - Ausencia de controles de sesión/estado visible en la UI (no hay login/logout).
- **Recomendación**:
  - Introducir flujo de autenticación visible en frontend.
  - Asegurar que todos los componentes que muestran texto clínico lo hagan como texto plano escapado por React.

### 8.2 Backend / API Routes

- **Descripción**: Los handlers siguen buenas prácticas de manejo de errores y status codes, pero carecen de contexto de seguridad.
- **Riesgos principales**:
  - Ausencia total de auth/roles.
  - No hay logging de seguridad estructurado (quién hizo qué acción, sobre qué paciente, cuándo).
- **Recomendación**:
  - Implementar middleware de autenticación y autorización.
  - Añadir logging estructurado con trazabilidad (ID de usuario, paciente, operación, timestamp) para auditoría clínica.

### 8.3 Prisma / DB Access

- **Descripción**: Prisma se usa como ORM tipado, lo que reduce el riesgo de SQL injection.
- **Riesgos principales**:
  - TLS mal configurado (`rejectUnauthorized: false`).
  - Falta de separación clara entre permisos de DB (usuario de DB probablemente con permisos amplios).
- **Recomendación**:
  - Configurar un rol de base de datos con mínimos privilegios.
  - Arreglar configuración SSL y revisar parámetros de conexión en Neon.

### 8.4 Build & Deploy (Vercel)

- **Descripción**: Hay documentación interna sobre constraints de Vercel (`docs/specs/07_infra`), pero no se observa en código una configuración de seguridad de cabeceras ni middleware.
- **Riesgos principales**:
  - Falta de cabeceras de seguridad y CSP.
  - Ausencia de separación clara de entornos (dev/staging/prod) en el código (se asume que se manejan vía variables de entorno en Vercel, pero no se ve enforcement).
- **Recomendación**:
  - Definir entornos separados en Vercel con variables específicas.
  - Añadir middleware para logging y control de acceso si se exponen endpoints públicamente.

---

## 9. Priorización de acciones

**Alta prioridad (hacer antes de exponer a usuarios reales)**
- Implementar **autenticación** obligatoria para todas las rutas API.
- Añadir **autorización basada en roles/ámbitos** en la capa de dominio.
- Corregir configuración de TLS hacia la base de datos (`rejectUnauthorized: true` en producción).
- Definir **cabeceras de seguridad** y una **CSP** adecuada.

**Prioridad media**
- Minimizar datos expuestos en respuestas API.
- Definir y documentar uso de **secretos de aplicación** (JWT, claves de cifrado).
- Introducir **rate limiting** y monitoreo de tráfico.

**Prioridad baja (pero recomendable)**
- Integrar SCA (auditoría de dependencias) y política de actualización.
- Añadir tests automatizados de seguridad (XSS, CSRF, control de acceso) en la suite de `vitest`.
