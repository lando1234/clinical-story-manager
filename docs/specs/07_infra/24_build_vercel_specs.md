# Sistema de Historias Clínicas Psiquiátricas — Especificación de Build y Deploy en Vercel

## Overview

Este documento define la especificación funcional y técnica para la configuración y optimización del proceso de build del sistema en Vercel.

Esta especificación define **QUÉ** debe cumplirse en el proceso de build y deploy, no los pasos manuales de implementación.

El build es un proceso crítico que debe garantizar builds reproducibles, deploys estables, tiempos controlados y compatibilidad total con Prisma y Neon, sin efectos colaterales sobre datos clínicos.

---

## 1. Propósito del Build en el Sistema Clínico

### 1.1 Separación entre Build, Deploy y Runtime

El sistema debe mantener una separación estricta entre tres fases distintas:

| Fase | Propósito | Cuándo Ocurre | Qué Puede Hacer | Qué NO Puede Hacer |
|------|-----------|---------------|-----------------|-------------------|
| **Build** | Compilar y preparar artefactos | Durante `next build` en Vercel | Generar Prisma Client, compilar TypeScript, optimizar bundles | Acceder a base de datos, ejecutar migraciones, leer datos clínicos |
| **Deploy** | Desplegar artefactos a producción | Después del build exitoso | Copiar artefactos a funciones serverless | Modificar datos, ejecutar lógica clínica |
| **Runtime** | Ejecutar la aplicación | Durante requests de usuarios | Acceder a base de datos, ejecutar lógica clínica, procesar requests | Modificar código, regenerar artefactos |

**Principio fundamental:** El build es un proceso de transformación estática que produce artefactos inmutables. No debe tener efectos colaterales sobre el estado del sistema.

### 1.2 Riesgos Clínicos de un Build Mal Configurado

Un build mal configurado puede introducir riesgos críticos en un sistema clínico:

| Riesgo | Impacto Clínico | Severidad |
|--------|-----------------|-----------|
| **Ejecución de migraciones durante build** | Puede modificar esquema de base de datos durante compilación, causando inconsistencias entre artefactos y esquema | 🔴 Crítico |
| **Acceso a datos clínicos durante build** | Exposición accidental de datos sensibles en logs de build, violación de privacidad | 🔴 Crítico |
| **Builds no reproducibles** | Diferentes artefactos para el mismo código, comportamiento impredecible en producción | 🟠 Alto |
| **Prisma Client no generado** | Errores en runtime por falta de tipos generados, aplicación inoperable | 🟠 Alto |
| **Variables de entorno faltantes en build** | Build falla o genera artefactos incompletos, deploy bloqueado | 🟡 Medio |
| **Dependencias no determinísticas** | Versiones diferentes de paquetes entre builds, bugs intermitentes | 🟡 Medio |
| **Tiempos de build excesivos** | Deploys lentos, demoras en correcciones críticas | 🟢 Bajo |

**Principio de seguridad clínica:** El build nunca debe ejecutar código que pueda modificar, leer o exponer datos clínicos.

---

## 2. Principios de Optimización de Build

### 2.1 Determinismo

**Definición:** Un build es determinístico cuando, dado el mismo código fuente y las mismas dependencias, produce exactamente los mismos artefactos.

**Requisitos:**

| Aspecto | Requisito | Justificación |
|---------|-----------|---------------|
| **Versiones de dependencias** | Todas las dependencias deben estar fijadas en `package-lock.json` | Evita variaciones por actualizaciones automáticas |
| **Orden de operaciones** | El orden de comandos de build debe ser consistente | Evita race conditions y resultados no determinísticos |
| **Variables de entorno** | Variables de build deben ser explícitas y documentadas | Evita builds que dependen de estado implícito |
| **Timestamps** | No incluir timestamps en artefactos (salvo metadata de Next.js) | Permite comparación bit-a-bit de builds |
| **Node.js version** | Versión de Node.js debe estar fijada en Vercel | Evita diferencias por versiones de runtime |

**Verificación:** Dos builds del mismo commit deben producir artefactos idénticos (salvo metadata de timestamps de Next.js).

### 2.2 Reproducibilidad

**Definición:** Un build es reproducible cuando puede ejecutarse en diferentes momentos y entornos produciendo resultados equivalentes.

**Requisitos:**

| Aspecto | Requisito | Justificación |
|---------|-----------|---------------|
| **Prisma Client generation** | `prisma generate` debe ejecutarse en cada build | Garantiza que el cliente esté sincronizado con el schema |
| **No dependencias externas en build** | Build no debe requerir acceso a servicios externos (excepto npm registry) | Permite builds en entornos aislados |
| **Cache de dependencias** | Vercel debe cachear `node_modules` entre builds | Acelera builds sin comprometer reproducibilidad |
| **Build artifacts** | Artefactos deben ser autocontenidos | Permite deploy sin dependencias del entorno de build |

**Verificación:** Un build ejecutado hoy debe producir los mismos resultados que un build del mismo código ejecutado mañana.

### 2.3 Idempotencia

**Definición:** Un build es idempotente cuando ejecutarlo múltiples veces produce el mismo resultado que ejecutarlo una vez.

**Requisitos:**

| Aspecto | Requisito | Justificación |
|---------|-----------|---------------|
| **Prisma generate** | `prisma generate` debe ser idempotente | Regenerar el cliente no debe causar cambios si el schema no cambió |
| **Next.js build** | `next build` debe ser idempotente | Rebuilds no deben introducir cambios si el código no cambió |
| **No operaciones de estado** | Build no debe modificar archivos fuera de directorios de output | Evita efectos colaterales entre builds |

**Verificación:** Ejecutar el build dos veces consecutivas sin cambios debe producir resultados idénticos.

### 2.4 Seguridad: No Ejecución Clínica en Build

**Principio fundamental:** El build nunca debe ejecutar código que acceda, modifique o exponga datos clínicos.

**Restricciones absolutas:**

| Operación | Estado | Justificación |
|-----------|--------|---------------|
| **Conexión a base de datos** | ❌ Prohibido | Build no debe acceder a datos clínicos |
| **Ejecución de migraciones** | ❌ Prohibido | Migraciones modifican esquema, deben ejecutarse manualmente |
| **Lectura de datos** | ❌ Prohibido | No leer pacientes, notas, medicamentos durante build |
| **Escritura de datos** | ❌ Prohibido | No crear, actualizar o eliminar datos durante build |
| **Logs con datos clínicos** | ❌ Prohibido | Logs de build no deben contener información de pacientes |
| **Seed scripts** | ❌ Prohibido | No poblar base de datos durante build |
| **Test de conectividad** | ❌ Prohibido | No probar conexión a base de datos durante build |

**Operaciones permitidas:**

| Operación | Estado | Justificación |
|-----------|--------|---------------|
| **Generación de Prisma Client** | ✅ Permitido | Genera tipos TypeScript, no accede a datos |
| **Compilación de TypeScript** | ✅ Permitido | Transformación estática de código |
| **Optimización de bundles** | ✅ Permitido | Proceso de transformación estática |
| **Validación de schema Prisma** | ✅ Permitido | Valida estructura, no accede a datos |

**Verificación:** El build debe completarse exitosamente sin la variable `DATABASE_URL` configurada (aunque Prisma Client puede requerirla para validación de schema).

---

## 3. Configuración de Build en Vercel

### 3.1 Comandos de Build Permitidos

Los siguientes comandos son los únicos permitidos en el proceso de build:

| Comando | Fase | Propósito | Requisitos |
|---------|------|-----------|------------|
| `npm install` | Pre-build | Instalar dependencias | Ejecutado automáticamente por Vercel |
| `npm run postinstall` | Pre-build | Generar Prisma Client | Debe ejecutar `prisma generate` |
| `next build` | Build principal | Compilar aplicación Next.js | Debe ejecutarse después de `postinstall` |

**Secuencia requerida:**
```
npm install → npm run postinstall → next build
```

**Nota:** Vercel ejecuta `npm install` automáticamente. El comando de build configurado debe ser:
```
npm run build
```

Donde `build` en `package.json` debe ser:
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

Y `postinstall` debe ejecutarse automáticamente después de `npm install`.

### 3.2 Comandos Explícitamente Prohibidos

Los siguientes comandos **NUNCA** deben ejecutarse durante el build:

| Comando | Razón de Prohibición |
|---------|---------------------|
| `prisma migrate deploy` | Modifica esquema de base de datos, debe ejecutarse manualmente |
| `prisma migrate dev` | Modifica esquema y puede acceder a datos, solo para desarrollo |
| `prisma db push` | Modifica esquema sin migraciones, no es para producción |
| `prisma db seed` | Poblaría base de datos con datos de prueba |
| `prisma studio` | Abre interfaz gráfica, no aplicable en build |
| `npm run test` | Tests pueden acceder a base de datos, no deben ejecutarse en build |
| Cualquier script que acceda a `DATABASE_URL` | Riesgo de acceso a datos clínicos |

**Verificación:** El build debe fallar explícitamente si detecta intentos de ejecutar comandos prohibidos.

### 3.3 Rol del `postinstall` y Generación de Prisma Client

**Propósito del `postinstall`:**

El script `postinstall` tiene un rol crítico: garantizar que Prisma Client esté generado antes de que Next.js intente compilar código que lo importa.

**Requisitos del script `postinstall`:**

| Requisito | Descripción | Justificación |
|-----------|-------------|---------------|
| **Ejecutar `prisma generate`** | Debe generar Prisma Client en el directorio configurado | Next.js necesita los tipos generados para compilar |
| **Ser idempotente** | Ejecutarse múltiples veces sin efectos colaterales | Vercel puede ejecutar `postinstall` en diferentes contextos |
| **No requerir `DATABASE_URL`** | Debe funcionar sin conexión a base de datos | Build no debe acceder a datos |
| **Manejar errores explícitamente** | Fallar claramente si `prisma generate` falla | Evita builds silenciosamente incorrectos |
| **Crear archivos de re-export si es necesario** | Crear `index.ts` para facilitar imports | Compatibilidad con alias de TypeScript |

**Comportamiento esperado:**

1. `postinstall` se ejecuta automáticamente después de `npm install`
2. Ejecuta `npx prisma generate` (o `npm run db:generate`)
3. Prisma Client se genera en `src/generated/prisma` (o directorio configurado)
4. Si la generación falla, el build debe fallar explícitamente
5. Next.js puede entonces compilar código que importa `@/generated/prisma`

**Verificación:** El build debe fallar si Prisma Client no se genera correctamente, con un mensaje de error claro indicando que `prisma generate` falló.

---

## 4. Prisma y Build

### 4.1 Qué Puede Ejecutarse en Build

Las siguientes operaciones de Prisma están permitidas durante el build:

| Operación | Comando | Propósito | Cuándo se Ejecuta |
|-----------|---------|-----------|-------------------|
| **Generar Prisma Client** | `prisma generate` | Crear tipos TypeScript y cliente ORM | Durante `postinstall` |
| **Validar schema** | `prisma validate` (implícito en `generate`) | Verificar que `schema.prisma` es válido | Durante `prisma generate` |

**Requisitos:**

- `prisma generate` debe ejecutarse en cada build
- Debe generar tipos TypeScript correctos
- Debe crear el cliente en el directorio configurado en `schema.prisma`
- No debe requerir conexión a base de datos (aunque Prisma puede validar la URL si está presente)

### 4.2 Qué NUNCA Debe Ejecutarse en Build

Las siguientes operaciones de Prisma están **absolutamente prohibidas** durante el build:

| Operación | Comando | Razón de Prohibición |
|-----------|---------|---------------------|
| **Aplicar migraciones** | `prisma migrate deploy` | Modifica esquema de base de datos |
| **Crear migraciones** | `prisma migrate dev` | Modifica esquema y puede acceder a datos |
| **Sincronizar schema** | `prisma db push` | Modifica esquema sin control de versiones |
| **Resetear base de datos** | `prisma migrate reset` | Destruiría todos los datos clínicos |
| **Poblar datos** | `prisma db seed` | Crearía datos de prueba en producción |
| **Abrir Studio** | `prisma studio` | Interfaz gráfica, no aplicable en build |
| **Introspect schema** | `prisma db pull` | Modificaría `schema.prisma` desde base de datos |

**Principio:** El build solo puede **leer** el schema de Prisma para generar código. Nunca puede **escribir** en la base de datos o modificar el schema.

### 4.3 Separación entre Operaciones

Debe existir una separación clara entre tres tipos de operaciones de Prisma:

| Tipo de Operación | Cuándo se Ejecuta | Responsable | Propósito |
|-------------------|-------------------|-------------|-----------|
| **`prisma generate`** | Durante build (automático) | Sistema de build | Generar tipos y cliente |
| **`prisma migrate deploy`** | Manualmente, antes de deploy | Desarrollador/DevOps | Aplicar migraciones a base de datos |
| **Acceso a datos clínicos** | Durante runtime (requests) | Aplicación en producción | Leer/escribir datos de pacientes |

**Flujo correcto:**

1. **Desarrollo:** Desarrollador crea migración con `prisma migrate dev`
2. **Pre-deploy:** Desarrollador aplica migración a producción con `prisma migrate deploy` (manual)
3. **Build:** Vercel ejecuta `prisma generate` durante build (automático)
4. **Deploy:** Vercel despliega artefactos compilados
5. **Runtime:** Aplicación usa Prisma Client para acceder a datos

**Verificación:** El build debe completarse exitosamente incluso si hay migraciones pendientes en la base de datos (aunque esto puede causar errores en runtime).

---

## 5. Variables de Entorno

### 5.1 Variables Requeridas en Build

Las siguientes variables de entorno deben estar disponibles durante el build:

| Variable | Requerida | Propósito | Cuándo se Usa |
|----------|-----------|-----------|---------------|
| `NODE_ENV` | Automática (Vercel) | Indicar entorno de build | Next.js optimiza según entorno |
| `DATABASE_URL` | Opcional (para validación) | Validar formato de connection string | Prisma puede validar formato (no conecta) |

**Nota importante:** `DATABASE_URL` puede estar presente durante build para validación, pero el build **NO debe conectarse** a la base de datos. Prisma puede validar el formato de la URL sin establecer conexión.

### 5.2 Variables Solo de Runtime

Las siguientes variables son **solo para runtime** y no deben usarse durante build:

| Variable | Propósito | Por Qué No en Build |
|----------|-----------|---------------------|
| `DATABASE_URL` | Conexión a base de datos Neon | Build no debe acceder a datos |
| Cualquier variable de configuración de API | Configuración de servicios externos | Build no hace requests externos |

**Principio:** Si una variable se usa solo en código que se ejecuta en runtime (API routes, server components), no necesita estar disponible durante build.

### 5.3 Manejo Seguro de Secretos

**Requisitos de seguridad:**

| Aspecto | Requisito | Justificación |
|---------|-----------|---------------|
| **No en código** | Secretos nunca en código fuente | Prevenir exposición accidental |
| **No en logs de build** | Logs no deben mostrar valores de secretos | Prevenir exposición en logs públicos |
| **Solo en Vercel** | Secretos solo en variables de entorno de Vercel | Centralizar gestión de secretos |
| **Scoping apropiado** | Variables con scope correcto (Production/Preview/Development) | Limitar exposición a entornos necesarios |

**Variables sensibles:**

- `DATABASE_URL` contiene credenciales de base de datos
- Debe estar marcada como "sensitive" en Vercel
- No debe aparecer en logs de build (Vercel la oculta automáticamente)

### 5.4 Diferencias entre Preview / Production

**Requisitos por entorno:**

| Entorno | `DATABASE_URL` | `NODE_ENV` | Propósito |
|---------|----------------|------------|-----------|
| **Production** | Base de datos de producción | `production` | Entorno de producción real |
| **Preview** | Base de datos de preview (recomendado) o producción | `production` | Testing de cambios antes de producción |
| **Development** | Base de datos de desarrollo | `development` | Desarrollo local |

**Principios:**

- **Production:** Debe usar base de datos de producción (única fuente de verdad)
- **Preview:** Idealmente usa base de datos separada para evitar contaminar datos de producción
- **Build process:** Idéntico en todos los entornos (mismo comando, misma secuencia)

**Verificación:** El build debe comportarse de manera idéntica en Preview y Production. Las diferencias solo aparecen en runtime.

---

## 6. Serverless Considerations

### 6.1 Cold Starts

**Definición:** Cold start es el tiempo que tarda una función serverless en inicializarse cuando no ha sido invocada recientemente.

**Impacto del build sobre cold starts:**

| Aspecto | Impacto | Requisito |
|---------|---------|-----------|
| **Tamaño del bundle** | Bundles más grandes = cold starts más lentos | Build debe optimizar tamaño de bundles |
| **Prisma Client** | Prisma Client debe estar incluido en bundle | `prisma generate` debe ejecutarse en build |
| **Dependencias** | Dependencias innecesarias aumentan tamaño | Tree-shaking debe eliminar código no usado |

**Optimizaciones permitidas:**

- Code splitting automático de Next.js
- Tree-shaking de dependencias no usadas
- Optimización de imports de Prisma Client

**Optimizaciones prohibidas:**

- Eliminar código clínico para reducir tamaño (riesgo de funcionalidad faltante)
- Pre-compilar queries de Prisma (puede causar inconsistencias)

### 6.2 Singleton de Prisma Client

**Problema:** En funciones serverless, cada invocación puede crear una nueva instancia de Prisma Client, causando:
- Múltiples conexiones a la base de datos
- Consumo excesivo de recursos
- Posibles timeouts de conexión

**Solución requerida:**

El código debe implementar un patrón singleton para Prisma Client que:
- Reutilice la misma instancia entre invocaciones en el mismo proceso
- Cree nueva instancia solo cuando sea necesario
- Maneje correctamente el ciclo de vida en serverless

**Verificación:** El código en `src/lib/prisma.ts` debe implementar el patrón singleton correctamente.

**Nota:** Este es un requisito de **runtime**, no de build. El build debe compilar correctamente el código que implementa el singleton.

### 6.3 Conexión a Neon

**Características de Neon relevantes para build:**

| Aspecto | Impacto en Build | Impacto en Runtime |
|---------|------------------|-------------------|
| **Connection string** | No se usa durante build | Se usa para conectar en runtime |
| **SSL requerido** | N/A | Connection string debe incluir `?sslmode=require` |
| **Serverless-friendly** | N/A | Neon es compatible con funciones serverless |
| **Connection pooling** | N/A | Debe usarse `@prisma/adapter-pg` con Pool |

**Requisitos de build:**

- Build no debe validar conectividad a Neon
- Build no debe probar la connection string
- Prisma Client generado debe ser compatible con Neon (usando `@prisma/adapter-pg`)

**Requisitos de runtime:**

- Conexión debe usar SSL
- Debe usar connection pooling
- Debe manejar desconexiones gracefully

### 6.4 Impacto del Build sobre Funciones Serverless

**Artefactos generados en build:**

| Artefacto | Impacto en Serverless | Requisito |
|-----------|----------------------|-----------|
| **Bundles de Next.js** | Código ejecutado en cada función | Debe ser optimizado y minificado |
| **Prisma Client generado** | Incluido en bundle de cada función | Debe estar presente y correcto |
| **TypeScript compilado** | Código JavaScript ejecutado | Debe compilar sin errores |
| **Assets estáticos** | Servidos por CDN de Vercel | Debe estar en directorio correcto |

**Optimizaciones automáticas de Next.js:**

- Code splitting por ruta
- Tree-shaking de código no usado
- Minificación de JavaScript
- Optimización de imágenes (si aplica)

**Verificación:** Cada función serverless debe poder ejecutarse independientemente con todos los artefactos necesarios incluidos en su bundle.

---

## 7. Optimización de Performance

### 7.1 Tree-shaking

**Definición:** Eliminación de código no usado del bundle final.

**Requisitos:**

| Aspecto | Requisito | Justificación |
|---------|-----------|---------------|
| **Habilitado por defecto** | Next.js debe hacer tree-shaking automáticamente | Reducir tamaño de bundles |
| **Imports específicos** | Usar imports específicos de Prisma (ej: `import { PrismaClient } from '@prisma/client'`) | Permitir tree-shaking de Prisma |
| **No tree-shaking de código clínico** | No eliminar código clínico aunque parezca no usado | Garantizar funcionalidad completa |

**Verificación:** El bundle final no debe incluir código de dependencias no importadas.

### 7.2 Code Splitting

**Definición:** División del código en chunks más pequeños cargados bajo demanda.

**Requisitos:**

| Aspecto | Requisito | Justificación |
|---------|-----------|---------------|
| **Automático por ruta** | Next.js debe hacer code splitting por ruta automáticamente | Cargar solo código necesario por página |
| **API routes separadas** | Cada API route debe ser un bundle separado | Reducir tamaño de funciones serverless |
| **No splitting agresivo** | No dividir código clínico en chunks muy pequeños | Evitar overhead de múltiples requests |

**Verificación:** Cada ruta debe tener su propio bundle optimizado.

### 7.3 Uso de Edge vs Node

**Contexto:** Next.js soporta tanto Edge Runtime como Node.js Runtime.

**Requisitos:**

| Runtime | Uso Permitido | Restricciones |
|---------|---------------|---------------|
| **Node.js Runtime** | ✅ API routes que usan Prisma | Requerido para Prisma Client |
| **Edge Runtime** | ❌ No aplicable | Prisma no funciona en Edge Runtime |

**Justificación:** Prisma Client requiere Node.js Runtime porque:
- Usa módulos nativos de Node.js
- Requiere acceso al sistema de archivos (para queries)
- No es compatible con Edge Runtime (V8 isolates)

**Requisito:** Todas las API routes que usan Prisma deben usar Node.js Runtime (default).

### 7.4 Qué NO Optimizar por Riesgo Clínico

**Principio:** La optimización de performance nunca debe comprometer la funcionalidad clínica o la integridad de datos.

**Optimizaciones prohibidas:**

| Optimización | Por Qué Está Prohibida |
|--------------|------------------------|
| **Eliminar validaciones** | Validaciones son críticas para integridad de datos clínicos |
| **Cachear datos clínicos** | Datos clínicos deben ser siempre actuales, no cacheados |
| **Lazy loading de validaciones** | Validaciones deben ejecutarse siempre, no bajo demanda |
| **Optimizar queries a costa de consistencia** | Consistencia de datos es más importante que performance |
| **Eliminar logs de errores** | Logs son críticos para debugging de problemas clínicos |

**Optimizaciones permitidas:**

- Optimizar tamaño de bundles (tree-shaking, minificación)
- Code splitting por ruta
- Optimización de assets estáticos (CSS, imágenes)
- Optimización de queries de Prisma (índices, selects específicos)

**Verificación:** Todas las optimizaciones deben ser verificadas para asegurar que no afectan la funcionalidad clínica.

---

## 8. Manejo de Errores de Build

### 8.1 Tipos de Errores Críticos

Los siguientes errores deben **bloquear el deploy** y fallar el build explícitamente:

| Tipo de Error | Ejemplo | Acción Requerida |
|---------------|---------|------------------|
| **Prisma Client no generado** | `Cannot find module '@/generated/prisma'` | Build debe fallar con mensaje claro |
| **Error de compilación TypeScript** | `Type error: Property 'x' does not exist` | Build debe fallar, mostrar error completo |
| **Schema de Prisma inválido** | `Error: Schema validation failed` | Build debe fallar, mostrar errores de validación |
| **Dependencias faltantes** | `Cannot find module 'x'` | Build debe fallar, indicar dependencia faltante |
| **Comando prohibido ejecutado** | `prisma migrate deploy` en build | Build debe fallar, indicar comando prohibido |
| **Error en postinstall** | Script `postinstall` falla | Build debe fallar, mostrar error del script |

**Principio:** Cualquier error que impida que la aplicación funcione correctamente en runtime debe bloquear el build.

### 8.2 Qué Debe Bloquear el Deploy

**Regla general:** Cualquier error que cause que la aplicación sea inoperable en runtime debe bloquear el deploy.

**Errores que bloquean deploy:**

| Error | Bloquea Deploy | Razón |
|-------|----------------|-------|
| Errores de compilación TypeScript | ✅ Sí | Código no compila, aplicación no funciona |
| Prisma Client no generado | ✅ Sí | Aplicación no puede acceder a base de datos |
| Schema de Prisma inválido | ✅ Sí | Prisma Client no se puede generar |
| Dependencias faltantes | ✅ Sí | Código no puede ejecutarse |
| Errores de sintaxis | ✅ Sí | Código no es válido |

**Errores que NO bloquean deploy (pero generan warnings):**

| Error | Bloquea Deploy | Acción |
|-------|----------------|--------|
| Warnings de TypeScript | ❌ No | Mostrar warning, continuar build |
| Dependencias deprecadas | ❌ No | Mostrar warning, continuar build |
| Assets no optimizados | ❌ No | Mostrar warning, continuar build |

### 8.3 Qué Errores No Deben Silenciarse

**Principio:** Los errores críticos nunca deben ser silenciados o ignorados.

**Errores que no deben silenciarse:**

| Error | Por Qué No Silenciar |
|-------|---------------------|
| **Errores de Prisma** | Pueden indicar problemas con schema o generación de cliente |
| **Errores de TypeScript** | Indican problemas de tipos que pueden causar bugs en runtime |
| **Errores de dependencias** | Indican problemas con el entorno de build |
| **Timeouts de build** | Indican problemas de performance o configuración |

**Manejo requerido:**

- Todos los errores críticos deben mostrarse en logs de build
- Mensajes de error deben ser claros y accionables
- Stack traces deben incluirse para debugging
- Build debe fallar explícitamente (exit code != 0)

**Verificación:** Un build con errores críticos debe fallar con un código de salida distinto de cero y mostrar mensajes de error claros.

---

## 9. Auditoría y Verificación

### 9.1 Señales de un Build Correcto

Un build correcto debe exhibir las siguientes señales:

**En logs de build:**

| Señal | Qué Indica | Dónde Aparece |
|-------|-----------|---------------|
| `✔ Generated Prisma Client` | Prisma Client se generó correctamente | Logs de `postinstall` |
| `✔ Compiled successfully` | Next.js compiló sin errores | Logs de `next build` |
| `Build completed` | Build terminó exitosamente | Logs finales de Vercel |
| Tiempo de build razonable | Build no tiene problemas de performance | Métricas de Vercel (< 5 min típicamente) |

**En artefactos generados:**

| Artefacto | Verificación |
|-----------|--------------|
| **Prisma Client** | Directorio `src/generated/prisma` existe y contiene archivos generados |
| **Bundles de Next.js** | Directorio `.next` contiene bundles compilados |
| **TypeScript compilado** | Código JavaScript en `.next` sin errores de sintaxis |

**En configuración:**

| Aspecto | Verificación |
|---------|--------------|
| **Comando de build** | `npm run build` configurado en Vercel |
| **Variables de entorno** | Variables requeridas están configuradas |
| **Node.js version** | Versión compatible con Next.js 16 y Prisma 7 |

### 9.2 Logs Esperados

**Secuencia de logs esperada en un build exitoso:**

```
1. Installing dependencies...
   ✓ npm install completado

2. Running postinstall script...
   ✓ Generating Prisma Client...
   ✓ Created index.ts for Prisma Client exports
   ✓ postinstall completado

3. Building application...
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages
   ✓ Finalizing page optimization
   ✓ Build completed

4. Deploying...
   ✓ Deployment ready
```

**Logs que indican problemas:**

| Log | Indica Problema | Acción Requerida |
|-----|----------------|------------------|
| `Error: Cannot find module '@/generated/prisma'` | Prisma Client no generado | Verificar que `postinstall` ejecuta `prisma generate` |
| `Type error: ...` | Error de TypeScript | Corregir errores de tipos |
| `Error: Schema validation failed` | Schema de Prisma inválido | Corregir `schema.prisma` |
| `Build timeout` | Build toma demasiado tiempo | Investigar dependencias o configuración |

### 9.3 Indicadores de Drift o Mala Configuración

**Señales de que el build está mal configurado:**

| Indicador | Qué Indica | Cómo Verificar |
|-----------|-----------|----------------|
| **Builds inconsistentes** | Mismo código produce diferentes resultados | Comparar builds del mismo commit |
| **Tiempos de build variables** | Dependencias no determinísticas | Revisar `package-lock.json` está commitado |
| **Errores intermitentes** | Configuración inconsistente | Verificar variables de entorno están fijadas |
| **Prisma Client desincronizado** | Schema cambió pero cliente no se regeneró | Verificar `postinstall` se ejecuta siempre |
| **Deploys fallan después de cambios de schema** | Migraciones no aplicadas antes de deploy | Verificar proceso de migraciones |

**Verificación de configuración correcta:**

| Aspecto | Verificación |
|---------|--------------|
| **`package-lock.json` commitado** | Debe estar en repositorio para builds determinísticos |
| **`postinstall` en `package.json`** | Debe ejecutar `prisma generate` |
| **Comando de build en Vercel** | Debe ser `npm run build` (que ejecuta `next build`) |
| **Variables de entorno** | Deben estar configuradas en Vercel, no en código |
| **Node.js version** | Debe estar fijada en Vercel (o usar versión LTS) |

---

## 10. Casos Fuera de Alcance

Esta especificación **NO cubre** los siguientes aspectos:

### 10.1 CI/CD Externos

**Fuera de alcance:**
- Configuración de pipelines de CI/CD externos (GitHub Actions, GitLab CI, etc.)
- Integración con sistemas de CI/CD de terceros
- Automatización de tests en CI/CD

**Justificación:** Esta especificación se enfoca en el build en Vercel. CI/CD externos tienen sus propias especificaciones.

### 10.2 Rollbacks Automáticos

**Fuera de alcance:**
- Estrategias de rollback automático
- Configuración de canary deployments
- Feature flags para controlar deploys

**Justificación:** Rollbacks son parte del proceso de deploy, no del build. Deben manejarse manualmente en un sistema clínico para garantizar control.

### 10.3 Multi-Región Avanzada

**Fuera de alcance:**
- Configuración de deploys multi-región
- Replicación de base de datos entre regiones
- Routing geográfico de requests

**Justificación:** Sistema MVP está diseñado para single-region. Multi-región requiere especificación separada.

### 10.4 Observabilidad Post-Deploy

**Fuera de alcance:**
- Configuración de monitoreo (Sentry, DataDog, etc.)
- Alertas y notificaciones
- Dashboards de métricas
- Log aggregation y análisis

**Justificación:** Observabilidad es parte del runtime, no del build. Requiere especificación separada.

### 10.5 Optimizaciones Avanzadas

**Fuera de alcance:**
- Pre-rendering avanzado (ISR, SSG complejo)
- Edge functions personalizadas
- CDN personalizado
- Cache strategies avanzadas

**Justificación:** Estas optimizaciones son opcionales y no afectan el build básico requerido.

---

## Resumen de Requisitos Críticos

### ✅ Requisitos Obligatorios

1. **Build debe ejecutar `prisma generate` antes de `next build`**
2. **Build nunca debe ejecutar migraciones o acceder a base de datos**
3. **Build debe ser determinístico y reproducible**
4. **Build debe fallar explícitamente ante errores críticos**
5. **Prisma Client debe generarse en cada build**
6. **Variables de entorno deben estar configuradas en Vercel**
7. **Build debe completarse sin acceso a datos clínicos**

### ❌ Prohibiciones Absolutas

1. **NUNCA ejecutar `prisma migrate` durante build**
2. **NUNCA acceder a base de datos durante build**
3. **NUNCA leer o escribir datos clínicos durante build**
4. **NUNCA silenciar errores críticos**
5. **NUNCA comprometer funcionalidad clínica por optimización**

### 🔍 Verificaciones Requeridas

1. Build produce artefactos consistentes para el mismo código
2. Prisma Client se genera correctamente en cada build
3. Build falla explícitamente ante errores críticos
4. Logs de build muestran secuencia correcta de operaciones
5. No hay comandos prohibidos en scripts de build

---

*Última actualización: [Fecha]*
*Estado: Especificación funcional y técnica del build en Vercel*
*Versión: 1.0*
