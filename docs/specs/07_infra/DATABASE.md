# Database Setup & Migrations

This document explains how to configure the database connection and run migrations.

## Prerequisites

- Node.js and npm installed
- A PostgreSQL database (Neon recommended)
- Project dependencies installed (`npm install`)

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |

### Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
   ```

### Getting a Neon Database URL

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (or use existing)
3. Copy the connection string from the dashboard
4. Paste into your `.env` file

## Running Migrations

### First-Time Setup

After configuring your `DATABASE_URL`, apply the initial migration:

```bash
npm run db:migrate
```

This will:
- Apply all pending migrations
- Generate the Prisma Client

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:migrate` | Create and apply migrations (development) |
| `npm run db:migrate:deploy` | Apply pending migrations (production) |
| `npm run db:push` | Push schema changes without migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database and reapply all migrations |

### Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `npm run db:migrate` to create a migration
3. Name the migration descriptively (e.g., `add_patient_notes_field`)
4. The migration is applied automatically

### Production Deployment

In production, use `npm run db:migrate:deploy` instead of `npm run db:migrate`:

```bash
npm run db:migrate:deploy
```

This applies pending migrations without prompting or creating new ones.

## Handling Migration Failures

### Common Issues

#### 1. Cannot connect to database
```
Error: P1001: Can't reach database server
```

**Solutions:**
- Verify `DATABASE_URL` is correct in `.env`
- Check if database server is running
- Verify network connectivity to Neon
- Check if SSL is required (`?sslmode=require`)

#### 2. Migration conflict
```
Error: P3006: Migration failed to apply cleanly
```

**Solutions:**
- Check the error message for the specific SQL that failed
- If in development, consider `npm run db:reset` (⚠️ destroys data)
- If in production, manually fix the database state

#### 3. Schema drift
```
Error: Prisma Migrate detected drift
```

**Solutions:**
- Run `npm run db:migrate` to create a migration that fixes drift
- Or run `npx prisma migrate resolve --rolled-back <migration_name>` if a migration failed

### Recovery Steps

If migrations are in a bad state:

1. **Development (data loss acceptable):**
   ```bash
   npm run db:reset
   ```

2. **Production (preserve data):**
   ```bash
   # Mark a failed migration as rolled back
   npx prisma migrate resolve --rolled-back 0001_init
   
   # Or mark it as applied if manually fixed
   npx prisma migrate resolve --applied 0001_init
   ```

3. **Last resort - baseline reset:**
   ```bash
   # This recreates the migration history
   npx prisma migrate reset --skip-seed
   ```

## Migration Files

Migrations are stored in `prisma/migrations/`:

```
prisma/migrations/
├── 0001_init/
│   └── migration.sql
└── (future migrations...)
```

**Important:**
- Migration files are SQL and should be committed to git
- Never manually edit applied migrations
- Migration order is determined by folder name (timestamp-based)

## Prisma Client Generation

The Prisma Client is generated to `src/generated/prisma/` (gitignored).

Regenerate after schema changes:

```bash
npm run db:generate
```

The client is also regenerated automatically when running migrations.

---

*Last updated: Initial setup*
