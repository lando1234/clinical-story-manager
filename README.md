# Psychiatric Medical Records System (MVP)

A longitudinal clinical record management tool for a single psychiatrist in private practice.

## Purpose

This system serves as a clinical documentation platform that:

- Captures, organizes, and retrieves patient clinical information across time
- Preserves the narrative continuity of each patient's psychiatric history
- Enables documentation of encounters, treatment evolution tracking, and structured clinical timeline management

## Stack Decisions

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Runtime** | Node.js | Single-language stack, mature ecosystem |
| **Language** | TypeScript | Strong typing reduces implementation ambiguity |
| **Framework** | Next.js (React) | Full-stack React framework with App Router |
| **Styling** | Tailwind CSS | Utility-first CSS, rapid UI development |
| **ORM** | Prisma | Type-safe database access, schema migrations |
| **Database** | PostgreSQL (Neon) | Relational model enforces referential integrity |

## Architectural Constraints

### Must Follow

- **Modular Monolith**: Application runs as a single process with clear module boundaries
- **Clear Separation**: Distinct layers for persistence, domain logic, and presentation
- **Single User**: System designed for one clinician, no concurrent access
- **Data Immutability**: Finalized clinical records cannot be modified, only amended
- **Timeline-First**: Clinical timeline is the primary navigation structure

### Must NOT Do

- No microservices architecture
- No GraphQL
- No real-time synchronization
- No container orchestration
- No message queues
- No caching layers
- No ORMs with lazy loading
- No NoSQL document stores

## Project Structure

```
clinical-story-manager/
├── docs/                    # Specification documents
├── prisma/
│   └── schema.prisma        # Database schema (TODO: define models)
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts)
│   ├── data/                # Data access layer (repositories)
│   ├── domain/              # Domain entities and business logic
│   ├── lib/                 # Shared utilities
│   ├── types/               # TypeScript type definitions
│   └── ui/
│       └── components/      # Reusable React components
├── .env                     # Environment variables (gitignored)
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

## Environment Setup

1. Copy the `.env` file and configure your database connection:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Next Steps

### Immediate (Infrastructure)

- [ ] Configure Neon PostgreSQL database connection in `.env`
- [ ] Define Prisma schema based on `docs/10_data_models.md`
- [ ] Run initial database migration
- [ ] Set up Prisma client singleton in `src/data/`

### Phase 1 (Core Domain)

- [ ] Implement Patient entity and repository
- [ ] Implement Clinical Encounter entity and repository
- [ ] Implement Medication Record entity and repository
- [ ] Implement Psychiatric History entity and repository

### Phase 2 (UI Foundation)

- [ ] Create layout with patient context visibility
- [ ] Implement patient list/search view
- [ ] Implement timeline view (default patient view)
- [ ] Create encounter documentation forms

### Phase 3 (Clinical Workflows)

- [ ] Implement encounter finalization workflow
- [ ] Implement medication management
- [ ] Implement psychiatric history versioning
- [ ] Implement addendum creation for finalized notes

## Development Guidelines

### Agent Guardrails

Before implementing any feature:

1. **Check specifications** - All features must be documented in `docs/`
2. **No assumptions** - If not specified, ask before implementing
3. **No scope creep** - Do not add "helpful" features not in specifications
4. **Confirm before**: Adding dependencies, changing schema, modifying validation rules

### Code Conventions

- Follow existing TypeScript conventions
- Use Tailwind CSS for styling (no custom CSS unless necessary)
- Domain logic stays in `src/domain/`
- Database access stays in `src/data/`
- UI components in `src/ui/components/`

## Documentation

Detailed specifications are available in the `docs/` directory:

- `01_specs.md` - Functional specifications
- `02_domain.md` - Domain model
- `03_timeline.md` - Timeline behavior
- `04_use_cases.md` - Use case definitions
- `05_edge_cases.md` - Edge case handling
- `06_dev_checklist.md` - Development checklist
- `07_stack_ux_constraints.md` - Stack and UX constraints
- `08_agent_policy.md` - AI agent development policy
- `09_agent_architecture.md` - Agent architecture guidelines
- `10_data_models.md` - Data model specifications

---

*Version: 0.1.0 (Scaffolding)*
*Status: Infrastructure Only - No Features Implemented*
