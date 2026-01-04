#!/bin/bash

# Script para crear la base de datos de test en PostgreSQL local
# Uso: ./scripts/create-test-db.sh

set -e

# Configuración por defecto (puede ser sobrescrita por variables de entorno)
DB_NAME="${TEST_DB_NAME:-clinical_story_manager_test}"
DB_USER="${POSTGRES_USER:-${USER}}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"

echo "Creando base de datos de test: $DB_NAME"
echo "Usuario: $DB_USER"
echo "Host: $DB_HOST"
echo "Puerto: $DB_PORT"
echo ""

# Verificar si la base de datos ya existe
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
  echo "✓ La base de datos '$DB_NAME' ya existe"
else
  echo "Creando base de datos '$DB_NAME'..."
  if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"; then
    echo "✓ Base de datos '$DB_NAME' creada exitosamente"
  else
    echo "✗ Error al crear la base de datos"
    echo ""
    echo "Posibles soluciones:"
    echo "1. Verifica que PostgreSQL esté ejecutándose: brew services list | grep postgresql"
    echo "2. Verifica que el usuario '$DB_USER' tenga permisos para crear bases de datos"
    echo "3. Si usas un socket Unix, intenta: psql -U $DB_USER -d postgres -c \"CREATE DATABASE $DB_NAME;\""
    exit 1
  fi
fi

