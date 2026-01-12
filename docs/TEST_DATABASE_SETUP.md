# Configuración de Base de Datos de Test

Este documento explica cómo configurar la base de datos local de PostgreSQL para ejecutar los tests.

## Requisitos Previos

- PostgreSQL 16 (o compatible) instalado y ejecutándose
- Acceso a la base de datos `postgres` para crear nuevas bases de datos
- Usuario de PostgreSQL con permisos para crear bases de datos

## Configuración Inicial

### 1. Crear el archivo de configuración

Crea un archivo `.env.test` en la raíz del proyecto con la siguiente configuración:

```bash
# Base de datos local de PostgreSQL
DATABASE_URL="postgresql://tu_usuario@localhost:5432/clinical_story_manager_test"
```

**Nota:** Si tu PostgreSQL requiere contraseña, inclúyela en la URL:
```bash
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/clinical_story_manager_test"
```

Si usas un puerto diferente al 5432, ajusta el puerto en la URL.

### 2. Crear la base de datos

Ejecuta el script para crear la base de datos de test:

```bash
npm run test:db:create
```

Este script creará la base de datos `clinical_story_manager_test` si no existe.

**Alternativa manual:**
```bash
psql -U tu_usuario -d postgres -c "CREATE DATABASE clinical_story_manager_test;"
```

### 3. Aplicar las migraciones

Una vez creada la base de datos, aplica las migraciones:

```bash
npm run test:db:setup
```

Este comando aplicará todas las migraciones de Prisma a la base de datos de test.

## Ejecutar Tests

Una vez configurado, puedes ejecutar los tests con:

```bash
# Ejecutar tests una vez
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

Todos estos comandos cargarán automáticamente el archivo `.env.test` y usarán la base de datos de test.

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run test:db:create` | Crea la base de datos de test si no existe |
| `npm run test:db:setup` | Aplica las migraciones a la base de datos de test |
| `npm run test:db:reset` | Resetea la base de datos de test y reaplica todas las migraciones |
| `npm test` | Ejecuta los tests usando la base de datos de test |
| `npm run test:watch` | Ejecuta los tests en modo watch |
| `npm run test:coverage` | Ejecuta los tests con reporte de cobertura |

## Variables de Entorno

Puedes personalizar la creación de la base de datos usando variables de entorno:

```bash
# Nombre de la base de datos (por defecto: clinical_story_manager_test)
export TEST_DB_NAME="mi_base_de_test"

# Usuario de PostgreSQL (por defecto: usuario actual)
export POSTGRES_USER="postgres"

# Host de PostgreSQL (por defecto: localhost)
export POSTGRES_HOST="localhost"

# Puerto de PostgreSQL (por defecto: 5432)
export POSTGRES_PORT="5432"

# Luego ejecuta el script
npm run test:db:create
```

## Solución de Problemas

### Error: "database does not exist"

Asegúrate de haber creado la base de datos:
```bash
npm run test:db:create
```

### Error: "password authentication failed"

Verifica que la URL en `.env.test` tenga la contraseña correcta:
```bash
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/clinical_story_manager_test"
```

### Error: "permission denied to create database"

Asegúrate de que tu usuario de PostgreSQL tenga permisos para crear bases de datos. Puedes otorgar permisos con:
```sql
ALTER USER tu_usuario CREATEDB;
```

### Los tests no encuentran la base de datos

Verifica que:
1. El archivo `.env.test` existe en la raíz del proyecto
2. La URL en `.env.test` es correcta
3. PostgreSQL está ejecutándose
4. La base de datos fue creada correctamente

## Notas Importantes

- La base de datos de test se limpia automáticamente antes y después de cada test
- Los datos de test no afectan tu base de datos de desarrollo o producción
- El archivo `.env.test` está en `.gitignore` y no se subirá al repositorio
- Para bases de datos locales, no se requiere SSL (se detecta automáticamente)


