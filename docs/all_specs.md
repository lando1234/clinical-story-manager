# Sistema de Historias Clínicas Psiquiátricas — Especificaciones Completas

Este documento consolida todas las especificaciones del sistema en un único archivo para referencia completa.

**Última actualización:** 2024  
**Versión del documento:** 1.0

---

# Tabla de Contenidos

1. [Fundación](#fundación)
2. [Dominio](#dominio)
3. [Eventos](#eventos)
4. [Timeline](#timeline)
5. [Vistas](#vistas)
6. [UX/UI](#uxui)
7. [Infraestructura](#infraestructura)
8. [Calidad](#calidad)
9. [Apéndices](#apéndices)
10. [Arquitectura de Agentes](#arquitectura-de-agentes)

---

# Fundación

## 01_specs.md

# Psychiatric Medical Records System — Functional Specifications (MVP)

## 1. System Purpose

This system serves as a longitudinal clinical record management tool for a single psychiatrist in private practice.

The primary function is to capture, organize, and retrieve patient clinical information across time.

The system preserves the narrative continuity of each patient's psychiatric history.

It enables the clinician to document encounters, track treatment evolution, and maintain a structured clinical timeline.

---

## 2. Clinical Problems Solved

### 2.1 Fragmented Patient History

Psychiatric treatment spans months or years. Clinical notes become scattered across files, formats, and time periods. This system consolidates all patient information into a single, chronologically organized record.

### 2.2 Loss of Narrative Continuity

Mental health treatment relies on understanding patterns, triggers, and responses over time. The system preserves the patient's story as a continuous thread rather than isolated snapshots.

### 2.3 Difficulty Tracking Treatment Evolution

Medication changes, dosage adjustments, and therapeutic interventions accumulate. The system provides clear visibility into what was tried, when, and with what outcome.

### 2.4 Time-Consuming Information Retrieval

Locating specific past events, medications, or clinical observations requires manual search through extensive records. The system enables rapid access to relevant historical data.

### 2.5 Inconsistent Documentation Structure

Without a defined format, clinical notes vary in completeness and organization. The system provides consistent structure while preserving clinical flexibility.

---

## 3. MVP Scope

### 3.1 Patient Registry

The system maintains a registry of patients with basic demographic and contact information.

Each patient record contains: full name, date of birth, contact information, and emergency contact.

Patients can be added, edited, and marked as inactive.

### 3.2 Clinical Encounters

Each patient visit is recorded as a discrete clinical encounter.

An encounter includes: date, encounter type, subjective observations, objective findings, assessment, and plan.

Encounters are immutable once finalized. Amendments are recorded as separate addendum entries.

### 3.3 Psychiatric History

The system captures a structured initial psychiatric history for each patient.

This includes: chief complaint, history of present illness, past psychiatric history, substance use history, family psychiatric history, medical history, and additional clinical background sections as detailed in the domain model.

The psychiatric history can be updated but all versions are retained.

### 3.4 Medication Record

The system tracks current and past psychiatric medications.

Each medication entry includes: drug name, dosage, dosage unit, frequency, start date, end date, prescribing reason, and discontinuation reason. Route of administration is optional.

The medication list reflects the complete pharmacological timeline.

### 3.5 Clinical Timeline

All clinical events are presented in chronological order.

The timeline includes encounters, medication changes, and significant clinical events.

The clinician can navigate the timeline to any point in the patient's history.

### 3.6 Search and Retrieval

The system supports patient lookup by name, date of birth, or identifier.

Within a selected patient's record, text-based search is available across all clinical content.

Search results display relevant excerpts with temporal context.

---

## 4. Explicit Assumptions

### 4.1 Single User

The system is designed for one clinician. There is no concurrent access by multiple users.

### 4.2 Single Device Context

The clinician accesses the system from a single workstation or device at a time.

### 4.3 Manual Data Entry

All clinical data is entered manually by the clinician. There is no automated data capture.

### 4.4 Local Data Persistence

Patient data is stored locally. The clinician is responsible for data backup procedures.

### 4.5 Clinical Competence

The system assumes the user is a licensed psychiatrist who understands clinical documentation standards.

### 4.6 Patient Consent

The clinician has obtained appropriate consent for maintaining electronic records. Consent management is outside the system.

### 4.7 Stable Terminology

Medication names and clinical terms follow standard psychiatric nomenclature. The system does not validate clinical terminology.

---

## 5. Explicit Limitations (Out of Scope)

### 5.1 User Authentication and Roles

The MVP does not include login systems, user accounts, or role-based access control.

### 5.2 External Integrations

There is no integration with pharmacies, laboratories, hospitals, or other clinical systems.

### 5.3 Prescription Generation

The system does not generate, transmit, or manage prescriptions. It only documents medications.

### 5.4 Billing and Insurance

There are no billing codes, insurance claims, or financial tracking features.

### 5.5 Appointment Scheduling

Full appointment scheduling with calendar management, conflict detection, and automated reminders is outside MVP scope.

The system supports minimal recording of intended next encounter dates (see UC-05).

### 5.6 Patient Portal

Patients do not have access to the system. There is no patient-facing interface.

### 5.7 Regulatory Compliance Automation

The system does not automatically enforce HIPAA, state regulations, or documentation requirements. Compliance is the clinician's responsibility.

### 5.8 Clinical Decision Support

There are no alerts, drug interaction checks, or diagnostic suggestions.

### 5.9 Reporting and Analytics

The MVP does not include statistical reports, outcome tracking, or population-level analytics.

### 5.10 Data Migration

There is no automated import from other systems. Historical records must be entered manually.

### 5.11 Mobile Access

The system is not designed for mobile devices or tablets.

### 5.12 Offline Synchronization

There is no cloud synchronization or multi-device data sharing.

---

*Document Version: 1.0*  
*Status: Draft*  
*Scope: Minimum Viable Product*



---

## 08_agent_policy.md

# Psychiatric Medical Records System — Global Agent Policy

## Overview

This policy governs ALL AI agents participating in the implementation of this system.

Compliance is mandatory. Violations invalidate the agent's output.

---

## 1. Purpose of the Policy

### 1.1 Why This Policy Exists

This policy exists to:

- Establish deterministic boundaries for AI decision-making
- Prevent divergence from approved specifications
- Ensure clinical data integrity through constrained implementation
- Enable parallel agent work without coordination conflicts
- Provide clear escalation paths when ambiguity is encountered

### 1.2 What Problems It Prevents

| Problem | How Policy Prevents It |
|---------|------------------------|
| Scope creep | Explicit scope protection rules prohibit feature invention |
| Specification drift | Document rules restrict modification of approved specs |
| Inconsistent decisions | Decision authority matrix defines who decides what |
| Silent failures | Failure modes require explicit escalation |
| Over-engineering | Scope protection rules enforce MVP minimalism |
| Data integrity violations | Timeline invariants are defined as non-negotiable |
| Stack contamination | Technology constraints are locked |
| UX bloat | UX boundaries prohibit unauthorized enhancements |
| Language inconsistency | UX language requirements enforce Spanish-only UI |

---

## 2. Decision Authority

### 2.1 Autonomous Agent Decisions

Agents ARE ALLOWED to decide the following without human confirmation:

**Code Organization**
- Internal function and method names
- Private variable naming
- File placement within established module structure
- Import organization and grouping
- Code comments and inline documentation

**Implementation Details**
- Algorithm selection for defined behaviors
- Loop vs recursion for iteration
- Error message text (non-clinical, non-user-facing)
- Internal data structure selection
- Helper function extraction
- Null/undefined handling strategies

**Testing**
- Test file organization
- Test naming conventions
- Mock data generation (non-clinical content)
- Assertion style and library usage
- Test coverage priorities within defined use cases

**Performance**
- Database index creation
- Query optimization within schema constraints
- Debounce/throttle timing
- Pagination limits
- In-memory caching of non-persistent data

### 2.2 Decisions Requiring Human Confirmation

Agents MUST REQUEST explicit human confirmation before:

**Schema & Data**
- Adding any database table or column not in domain model
- Modifying any existing table structure
- Changing foreign key relationships
- Adding or removing required field constraints
- Altering data types for existing fields

**Dependencies**
- Adding any external package or library
- Upgrading major versions of existing dependencies
- Removing any dependency
- Adding development dependencies that affect build

**Domain Logic**
- Changing validation rules defined in use cases
- Modifying event generation triggers
- Altering timeline ordering logic
- Changing immutability enforcement
- Modifying state transition rules (draft → finalized)

**User-Facing Changes**
- Adding any user-visible text or labels
- Creating new screens or views
- Modifying navigation structure
- Adding confirmation dialogs
- Changing error messages shown to users

**Security & Privacy**
- Any logging that could contain clinical content
- Any data persistence beyond defined entities
- Any network communication
- Any file system access outside application data

### 2.3 Decisions Agents Must NEVER Make

Agents MUST NEVER decide:

**Specification Changes**
- DO NOT modify approved specifications
- DO NOT reinterpret specification intent
- DO NOT resolve specification conflicts autonomously
- DO NOT add features not in specifications

**Clinical Domain**
- DO NOT invent clinical terminology
- DO NOT add clinical validation rules not specified
- DO NOT create clinical content examples with real-seeming data
- DO NOT modify encounter types or event types

**Architecture**
- DO NOT change the defined runtime
- DO NOT add external services
- DO NOT introduce new architectural patterns
- DO NOT add authentication mechanisms

**Data Lifecycle**
- DO NOT implement hard delete for any clinical data
- DO NOT add data export functionality
- DO NOT implement data synchronization
- DO NOT create backup mechanisms

**Database Technology**
- DO NOT use any database other than PostgreSQL
- DO NOT use any provider other than Neon
- DO NOT introduce database abstraction layers for portability
- DO NOT add database engines, embedded databases, or in-memory stores

**ORM Technology**
- DO NOT use any ORM other than Prisma
- DO NOT write raw SQL outside Prisma (unless explicitly approved)
- DO NOT use alternative query builders (Knex, TypeORM, Drizzle, Sequelize, etc.)
- DO NOT bypass Prisma for database operations

### 2.4 Database Technology Lock-In

**Locked Decision:**
- Database: PostgreSQL
- Provider: Neon (serverless Postgres)

**This decision is final and non-negotiable.**

**What Agents MAY Assume About PostgreSQL:**
- Standard SQL syntax is available
- Foreign key constraints are enforced
- Transactions with ACID guarantees are available
- Timestamps with timezone support are available
- UUID generation is available
- Standard data types (TEXT, INTEGER, BOOLEAN, DATE, TIMESTAMP, DECIMAL) are available
- NOT NULL and UNIQUE constraints are supported
- Primary key and foreign key constraints are supported

**What Agents MUST NOT Assume:**
- PostgreSQL extensions are available (DO NOT use pg_trgm, ltree, hstore, etc.)
- Triggers are available (DO NOT create database triggers)
- Stored procedures are available (DO NOT create functions in database)
- Full-text search extensions are available
- Custom types beyond standard are available
- Row-level security is available
- Listen/notify is available
- Neon-specific features beyond standard Postgres

**Prohibited Alternatives:**

| Category | Prohibited |
|----------|------------|
| SQL Databases | MySQL, MariaDB, SQLite, SQL Server, Oracle |
| NoSQL Databases | MongoDB, DynamoDB, Firestore, CouchDB |
| Embedded Databases | SQLite, LevelDB, RocksDB |
| In-Memory Stores | Redis, Memcached |
| Search Engines | Elasticsearch, Algolia, Meilisearch |

### 2.5 ORM Technology Lock-In

**Locked Decision:**
- ORM: Prisma
- Schema location: `prisma/schema.prisma`

**This decision is final and non-negotiable.**

**What Agents MAY Assume About Prisma:**
- Schema-driven model generation is available
- Prisma Migrate handles database migrations
- Prisma Client provides type-safe database access
- Relations are defined declaratively in schema
- Standard CRUD operations are generated
- Transactions are supported via Prisma Client
- Filtering, sorting, and pagination are available
- Connect/disconnect for relations is available

**What Agents MUST NOT Assume:**
- Raw SQL queries are permitted (FORBIDDEN unless explicitly approved)
- Prisma extensions are available
- Custom generators beyond Prisma Client are available
- Experimental features are enabled
- Interactive transactions beyond default timeout are available
- Database-level features not exposed by Prisma are accessible
- Prisma Accelerate or Pulse are available
- Third-party Prisma extensions are permitted

**Prohibited Alternatives:**

| Category | Prohibited |
|----------|------------|
| ORMs | TypeORM, Sequelize, MikroORM, Objection.js |
| Query Builders | Knex, Kysely, Drizzle |
| Raw Access | Direct pg client, node-postgres, postgres.js |
| ODMs | Mongoose (not applicable but explicitly excluded) |

**Schema File Ownership:**

| Agent | Permission |
|-------|------------|
| AG-01 (Schema Agent) | WRITE — exclusive owner of `prisma/schema.prisma` |
| All other agents | READ ONLY — may import generated Prisma Client |

**Schema Modification Rules:**
- Only AG-01 (Schema Agent) may modify `prisma/schema.prisma`
- Any agent may PROPOSE schema changes by escalating to human
- Schema changes require human confirmation before implementation
- Migrations must be created via `prisma migrate dev` (by AG-01 only)

---

## 3. MCP Usage Rules

### 3.1 File System MCP

**Allowed:**
- Reading specification documents for implementation guidance
- Creating implementation files within defined project structure
- Modifying implementation files created by agents
- Reading existing code to understand context

**Forbidden:**
- Modifying files in `docs/` folder (specifications)
- Deleting any file without explicit human instruction
- Creating files outside project directory
- Modifying configuration files without confirmation

**Escalation:**
- If unsure whether a file is a specification: STOP and ask
- If a required file does not exist: STOP and ask
- If file permissions prevent access: STOP and ask

### 3.2 Git MCP

**Allowed:**
- Reading git status to understand current state
- Reading git log to understand history
- Reading git diff to review changes
- Staging files for commit when instructed
- Creating commits with provided messages

**Forbidden:**
- Creating commits without explicit instruction
- Modifying commit history (rebase, amend without instruction)
- Pushing to remote without explicit instruction
- Creating or switching branches without instruction
- Resolving merge conflicts autonomously

**Escalation:**
- If uncommitted changes exist unexpectedly: STOP and report
- If branch state is unclear: STOP and ask
- If conflicts are detected: STOP and report

### 3.3 Shell/Terminal MCP

**Allowed:**
- Running build commands for the project
- Running test commands
- Running linting or formatting tools
- Installing dependencies when confirmed
- Reading command output

**Forbidden:**
- Running commands that modify system configuration
- Running commands that access network without confirmation
- Running commands that delete files
- Running long-running background processes without instruction
- Running commands outside project directory

**Escalation:**
- If a command fails unexpectedly: Report error and STOP
- If a command requires elevated permissions: STOP and ask
- If command output is unclear: Report and ask for guidance

### 3.4 Web/Search MCP

**Allowed:**
- Searching for syntax or API documentation
- Searching for error message explanations
- Searching for library usage examples

**Forbidden:**
- Searching for alternative technologies
- Searching for features to add
- Searching for architectural patterns not in specifications
- Using search results to justify scope expansion

**Escalation:**
- If search suggests specification may be incomplete: Report finding, do not act
- If search reveals security concern: STOP and report immediately

### 3.5 Postgres MCP

**When Postgres MCP May Be Enabled:**
- During schema implementation by Schema Agent (AG-01)
- During migration execution
- During data integrity verification
- During query development and testing
- When explicitly instructed by human

**Allowed When Enabled:**
- Reading schema information
- Executing SELECT queries for verification
- Executing INSERT, UPDATE for test data
- Executing schema DDL when instructed
- Running migrations when instructed
- Verifying foreign key relationships
- Checking constraint enforcement

**Forbidden Even When Enabled:**
- Creating or modifying triggers
- Creating stored procedures or functions
- Enabling or using PostgreSQL extensions
- Modifying database roles or permissions
- Accessing system catalogs for modification
- Creating materialized views
- Executing TRUNCATE or DROP on clinical data tables
- Modifying connection or runtime parameters
- Any action that would delete clinical data

**Escalation:**
- If schema change is needed after initial implementation: STOP and request confirmation
- If query performance requires extension: STOP and report limitation
- If Neon-specific behavior is observed: Document and continue if non-blocking

---

## 4. Scope Protection Rules

### 4.1 Scope Creep Prevention

**DO:**
- Implement exactly what specifications define
- Stop at specification boundaries
- Ask when a specification edge is reached
- Reference specific specification sections in decisions

**DO NOT:**
- Add "helpful" features not in specifications
- Implement "obvious" improvements
- Add defensive code for undefined scenarios
- Create abstractions for hypothetical future needs

### 4.2 Feature Invention Prevention

**DO:**
- Implement only defined use cases (UC-01 through UC-08)
- Implement only defined entity types
- Implement only defined event types
- Implement only defined validations

**DO NOT:**
- Create new use cases
- Create new entity types
- Create new event types
- Create new validation rules
- Add configuration options not specified

### 4.3 Stack Drift Prevention

**DO:**
- Use only technologies defined in `07_stack_ux_constraints.md`
- Use PostgreSQL (Neon) as the only database
- Respect explicit exclusions
- Maintain single-runtime model

**DO NOT:**
- Suggest alternative databases or providers
- Add packages that introduce excluded patterns
- Create abstraction layers for database portability
- Implement features that require excluded technologies
- Use database features not permitted in §2.4

### 4.4 UX Over-Design Prevention

**DO:**
- Implement UX exactly as constrained in `07_stack_ux_constraints.md`
- Maintain timeline-first navigation
- Keep one-interaction access to key information
- Preserve visible immutability

**DO NOT:**
- Add animations or transitions not specified
- Create onboarding flows
- Add tooltips or help systems
- Implement keyboard shortcuts
- Add themes or customization
- Create dashboard views
- Add data visualization

### 4.5 UX Language Requirements

**Mandatory Language:**
- All user-facing text MUST be written in Spanish
- This applies to: labels, headings, placeholders, buttons, messages, empty states, validation errors, and confirmation dialogs

**Forbidden:**
- English or mixed-language UI text
- Placeholder text in English (e.g., "Enter name here")
- Developer-centric wording exposed to users (e.g., "null", "undefined", "error 500")

**Exceptions:**
- Internal code identifiers may remain in English
- Database field names and variable names are not affected
- Log messages not shown to users are not affected

---

## 5. Document & File Rules

### 5.1 Files Agents May Create

Agents ARE AUTHORIZED to create:

- Source code files within `src/` directory
- Test files within `tests/` or `__tests__/` directories
- Type definition files
- Configuration files required by defined tooling
- Migration files for database schema

### 5.2 Files Agents May Modify

Agents ARE AUTHORIZED to modify:

- Source code files they created
- Source code files created by other agents (implementation only)
- Test files
- Package dependency list (with confirmation)
- Build configuration (with confirmation)

### 5.3 Files Agents Must NOT Modify

Agents MUST NOT modify:

| File Pattern | Reason |
|--------------|--------|
| `docs/*.md` | Approved specifications |
| `README.md` | Project documentation requires human review |
| `.git/*` | Git internals |
| License files | Legal documents |
| Any file outside project root | System protection |
| `prisma/schema.prisma` | Schema Agent (AG-01) exclusive — see §2.5 |

**Exception:** AG-01 (Schema Agent) IS authorized to modify `prisma/schema.prisma`.

### 5.4 Rules for Specification Documents

**Reading:**
- Agents MUST read relevant specs before implementation
- Agents SHOULD reference spec sections in code comments
- Agents MUST verify implementation matches spec

**Modification:**
- Agents MUST NOT modify specification documents
- Agents MUST NOT create new specification documents
- Agents MUST NOT rename or move specification documents

**Conflict Detection:**
- If implementation reveals spec ambiguity: STOP and report
- If implementation contradicts spec: STOP and report
- If spec appears incomplete: STOP and report

---

## 6. Failure Modes

### 6.1 When Specifications Are Unclear

**Agent MUST:**

1. STOP current implementation task
2. Identify the specific unclear element
3. Reference the specification document and section
4. State what is unclear and why
5. Propose possible interpretations (without acting on them)
6. Wait for human clarification

**Agent MUST NOT:**

- Guess the intended meaning
- Choose a "reasonable" interpretation
- Implement multiple options
- Proceed with partial implementation

### 6.2 When Conflicts Are Detected

**Agent MUST:**

1. STOP current implementation task
2. Identify both conflicting sources
3. Quote the conflicting statements
4. Explain why they conflict
5. Wait for human resolution

**Types of conflicts to detect:**

- Domain model vs use case validation rules
- Timeline document vs domain model event types
- Checklist item vs specification detail
- Stack constraint vs implementation requirement

**Agent MUST NOT:**

- Resolve conflicts autonomously
- Prioritize one document over another
- Implement a compromise solution
- Ignore the conflict

### 6.3 When a Required Decision Is Missing

**Agent MUST:**

1. STOP current implementation task
2. Identify what decision is needed
3. Explain why the decision is required
4. List the options if known
5. Explain impact of each option if known
6. Wait for human decision

**Examples of missing decisions:**

- Identifier generation strategy not specified
- Timezone handling not defined
- Maximum field lengths not specified
- Specific error behavior not documented

**Agent MUST NOT:**

- Make the decision autonomously
- Implement a default and note it
- Defer the decision to later
- Implement without the decision

### 6.4 When Edge Cases Are Encountered

**Agent MUST:**

1. Check `05_edge_cases.md` for the scenario
2. If documented with resolution: Follow the resolution
3. If documented without resolution: STOP and ask
4. If not documented: STOP and report as new edge case

**Agent MUST NOT:**

- Invent edge case handling
- Assume edge cases won't occur
- Implement defensive catch-all handling

### 6.5 When Technology Limitations Block Requirements

**When Prisma Limitations Are Encountered:**

**Agent MUST:**

1. STOP current implementation task
2. Document the specific limitation
3. Reference the requirement being blocked
4. Explain what Prisma cannot do in this case
5. Wait for human decision

**Examples of Prisma limitations requiring escalation:**
- Query pattern not expressible via Prisma Client
- Performance issue requiring raw SQL optimization
- Schema pattern not supported by Prisma
- Migration conflict or failure
- Relation type not supported by Prisma

**Agent MUST NOT:**

- Use `$queryRaw` or `$executeRaw` without explicit approval
- Bypass Prisma with direct database connection
- Implement workarounds using unsupported features
- Downgrade requirements to fit Prisma limitations

**When Schema Change Is Needed:**

**Agent MUST:**

1. STOP current implementation task
2. Document the required schema change
3. Reference the specification requiring the change
4. Explain impact on existing data (if any)
5. Escalate to human for approval
6. Wait for AG-01 (Schema Agent) to implement change

**Agent MUST NOT:**

- Modify `prisma/schema.prisma` directly (except AG-01)
- Create migration files directly (except AG-01)
- Assume schema changes will be approved
- Implement code dependent on unapproved schema changes

---

## 7. Compliance Verification

### 7.1 Before Starting Any Task

Agent must verify:

- [ ] Relevant specifications have been read
- [ ] Task is within specification scope
- [ ] No specification conflicts exist for this task
- [ ] All required decisions are documented

### 7.2 Before Completing Any Task

Agent must verify:

- [ ] Implementation matches specification exactly
- [ ] No unauthorized features added
- [ ] No unauthorized dependencies added
- [ ] No specification documents modified
- [ ] All failure modes properly handled

### 7.3 Reporting Requirements

For each completed task, agent must be able to state:

- Which specification sections were implemented
- Which autonomous decisions were made
- Which confirmations were obtained
- Which edge cases were encountered

---

## 8. Policy Violations

### 8.1 What Constitutes a Violation

- Modifying specification documents
- Adding features not in specifications
- Using excluded technologies
- Making decisions reserved for humans
- Proceeding past a STOP condition
- Resolving conflicts autonomously
- Ignoring edge cases

### 8.2 Consequences of Violation

- Violating output is considered invalid
- Implementation must be reviewed by human
- Violating changes may be reverted
- Agent must explain the violation

### 8.3 Violation Reporting

If an agent detects a previous violation (by itself or another agent):

1. STOP current task
2. Report the violation
3. Identify the violating change
4. Wait for human remediation

---

*Document Version: 1.3*
*Status: Final*
*Scope: All implementation agents*
*Effective: Immediately upon creation*
*Updates:*
- *v1.1: PostgreSQL/Neon decision lock-in added*
- *v1.2: Prisma ORM decision lock-in added*
- *v1.3: UX language requirements added (Spanish-only UI)*


---

# Dominio

## 02_domain.md

# Psychiatric Medical Records System — Domain Model

## Overview

This document defines the core domain entities for the Psychiatric Medical Records System.

Each entity represents a distinct clinical concept within the longitudinal patient record.

The model prioritizes narrative continuity and temporal integrity of clinical information.

---

## Entity: Patient

### Functional Description

A Patient represents an individual receiving psychiatric care from the clinician.

The Patient is the central entity around which all clinical information is organized.

Each Patient has exactly one clinical record that persists for the duration of the therapeutic relationship.

### Core Attributes

- Identifier
- Full name
- Date of birth
- Contact phone
- Contact email
- Address
- Emergency contact name
- Emergency contact phone
- Emergency contact relationship
- Status (active or inactive)
- Registration date

### Relationships

- A Patient has exactly one ClinicalRecord.
- A Patient has zero or more Appointments.

### Business Rules

- A Patient must have a full name and date of birth.
- A Patient cannot be deleted; they can only be marked as inactive.
- Marking a Patient as inactive does not affect the visibility of their clinical record.
- A Patient's identifier is immutable once assigned.
- Reactivating an inactive Patient restores full access to their clinical record.

---

## Entity: ClinicalRecord

### Functional Description

A ClinicalRecord is the complete longitudinal container for a patient's clinical information.

It aggregates all encounters, events, notes, medications, and psychiatric history for one patient.

The ClinicalRecord provides the unified view into the patient's treatment journey.

### Core Attributes

- Identifier
- Creation date
- Last updated date

### Relationships

- A ClinicalRecord belongs to exactly one Patient.
- A ClinicalRecord contains exactly one current PsychiatricHistory (with previous versions retained).
- A ClinicalRecord contains zero or more ClinicalEvents.
- A ClinicalRecord contains zero or more Notes.
- A ClinicalRecord contains zero or more Medications.

### Business Rules

- A ClinicalRecord is created automatically when a Patient is registered.
- A ClinicalRecord cannot exist without an associated Patient.
- A ClinicalRecord cannot be deleted.
- The last updated date reflects the most recent modification to any contained entity.

---

## Entity: ClinicalEvent

### Functional Description

A ClinicalEvent represents any discrete occurrence that is clinically significant in the patient's timeline.

Clinical events provide the chronological backbone of the patient's record.

Events include encounters, medication changes, hospitalizations, and other milestone occurrences.

### Core Attributes

- Identifier
- Event date
- Event type
- Title
- Description
- Recorded date

### Relationships

- A ClinicalEvent belongs to exactly one ClinicalRecord.
- A ClinicalEvent may reference zero or one Note (for Encounter events).
- A ClinicalEvent may reference zero or one Medication (for Medication events).
- A ClinicalEvent may reference zero or one PsychiatricHistory version (for History Update events).
- Some event types (Hospitalization, Life Event, Other) are standalone with no entity reference.

### Business Rules

- A ClinicalEvent must have an event date and event type.
- The event date represents when the event occurred clinically.
- The recorded date represents when the event was documented in the system.
- Clinical events are immutable once created.
- Event types are: Encounter, Medication Start, Medication Change, Medication Stop, Hospitalization, Life Event, History Update, Other.

---

## Entity: Note

### Functional Description

A Note captures the clinical documentation for a patient encounter.

Notes follow a structured format while allowing narrative flexibility within each section.

Once finalized, a Note becomes immutable and can only be amended through addenda.

### Core Attributes

- Identifier
- Encounter date
- Encounter type
- Status (draft or finalized)
- Subjective observations
- Objective findings
- Assessment
- Plan
- Created date
- Finalized date

### Relationships

- A Note belongs to exactly one ClinicalRecord.
- A Note generates exactly one ClinicalEvent upon finalization.
- A Note has zero or more Addenda.

### Business Rules

- A Note must have an encounter date and encounter type.
- Encounter types are: Initial Evaluation, Follow-up, Crisis Intervention, Medication Review, Therapy Session, Phone Consultation, Other.
- A draft Note can be edited freely.
- Finalizing a Note makes all content fields immutable.
- A Note cannot transition from finalized back to draft.
- Only finalized Notes appear in the clinical timeline.
- A Note in draft status does not generate a ClinicalEvent.

---

## Entity: Addendum

### Functional Description

An Addendum is a supplementary entry attached to a finalized Note.

Addenda provide a mechanism to add information or corrections without altering the original documentation.

Each Addendum preserves the integrity of the clinical record while allowing necessary amendments.

### Core Attributes

- Identifier
- Content
- Reason
- Created date

### Relationships

- An Addendum belongs to exactly one Note.
- An Addendum can only be attached to a finalized Note.

### Business Rules

- An Addendum must have content and a reason.
- An Addendum is immutable once created.
- There is no limit to the number of Addenda per Note.
- Addenda are displayed in chronological order following the parent Note.

---

## Entity: Medication

### Functional Description

A Medication represents a pharmaceutical agent prescribed to the patient.

The Medication entity tracks the complete lifecycle from initiation through discontinuation.

All medications, current and historical, remain visible in the patient's record.

### Core Attributes

- Identifier
- Drug name
- Dosage
- Dosage unit
- Frequency
- Route of administration
- Start date
- End date
- Prescribing reason
- Discontinuation reason
- Status (active or discontinued)

### Relationships

- A Medication belongs to exactly one ClinicalRecord.
- A Medication generates one or more ClinicalEvents (start, changes, discontinuation).

### Business Rules

- A Medication must have a drug name, dosage, dosage unit, frequency, and start date.
- Route of administration is optional.
- A Medication without an end date is considered active.
- Setting an end date changes the status to discontinued.
- Discontinuing a Medication requires a discontinuation reason.
- Dosage changes create a new Medication entry rather than modifying the existing one.
- The original Medication is discontinued and linked to the new entry.
- Medications cannot be deleted from the record.
- Medication entries are finalized immediately upon creation; there is no draft state.
- Medication events are generated at the moment the entry is saved.

---

## Entity: PsychiatricHistory

### Functional Description

A PsychiatricHistory captures the comprehensive background information for a patient.

This entity contains the foundational clinical context gathered during initial evaluation.

The history is versioned to preserve changes over time while maintaining access to prior versions.

### Core Attributes

- Identifier
- Version number
- Chief complaint
- History of present illness
- Past psychiatric history
- Past hospitalizations
- Suicide attempt history
- Substance use history
- Family psychiatric history
- Medical history
- Surgical history
- Allergies
- Social history
- Developmental history
- Created date
- Superseded date

### Relationships

- A PsychiatricHistory belongs to exactly one ClinicalRecord.
- A PsychiatricHistory may supersede a previous PsychiatricHistory version.

### Business Rules

- Each ClinicalRecord has at least one PsychiatricHistory.
- Only the most recent version is considered current.
- Updating the history creates a new version rather than modifying the existing one.
- Previous versions are marked with a superseded date.
- All versions remain accessible for historical reference.
- Version numbering is sequential starting from one.

---

## Entity: Appointment

### Functional Description

An Appointment represents a scheduled future encounter between the clinician and patient.

This entity serves as a placeholder for potential future scheduling functionality.

In the current scope, Appointment exists only to record the intended date of future encounters.

### Core Attributes

- Identifier
- Scheduled date
- Scheduled time
- Duration
- Appointment type
- Status (scheduled, completed, cancelled, no-show)
- Notes

### Relationships

- An Appointment belongs to exactly one Patient.
- An Appointment may be linked to zero or one Note (when the encounter occurs).

### Business Rules

- Appointment scheduling and calendar management are outside MVP scope.
- This entity exists to support minimal encounter date tracking.
- An Appointment does not generate ClinicalEvents.
- Completing an Appointment does not automatically create a Note.
- Future expansion may include full scheduling capabilities.

---

## Entity Relationship Summary

```
Patient (1) ─────────────────── (1) ClinicalRecord
    │                                    │
    │                                    ├──── (1) PsychiatricHistory ──── (versions)
    │                                    │
    │                                    ├──── (0..*) ClinicalEvent
    │                                    │
    │                                    ├──── (0..*) Note ──── (0..*) Addendum
    │                                    │
    └──── (0..*) Appointment             └──── (0..*) Medication
```

---

## Temporal Integrity Principles

### Immutability After Finalization

Finalized clinical documentation cannot be altered.

This preserves the legal and clinical integrity of the record.

Amendments are captured through Addenda, maintaining a clear audit trail.

### Version Retention

Entities that evolve over time retain all historical versions.

The PsychiatricHistory and Medication entities exemplify this pattern.

No clinical information is ever lost through updates.

### Chronological Ordering

All entities with temporal attributes support chronological presentation.

The ClinicalEvent entity serves as the unifying timeline structure.

Events are ordered by their clinical occurrence date, not their documentation date.

---

*Document Version: 1.0*  
*Status: Draft*  
*Source: 01_specs.md*



---

## 10_data_models.md

# Psychiatric Medical Records System — Persistent Data Models

## Overview

This document defines the persistent data model for the MVP.

The target database is PostgreSQL (Neon serverless).

All definitions are implementation-agnostic. No SQL, DDL, or ORM code is included.

The model prioritizes longitudinal clinical timeline integrity.

---

## 1. Persistent Entities

### 1.1 Patient

**Purpose:**
Represents an individual receiving psychiatric care. Central entity around which all clinical data is organized.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique, immutable patient identifier |
| full_name | Text | Patient's complete legal name |
| date_of_birth | Date | Patient's birth date |
| contact_phone | Text (nullable) | Primary phone number |
| contact_email | Text (nullable) | Primary email address |
| address | Text (nullable) | Residential address |
| emergency_contact_name | Text (nullable) | Emergency contact full name |
| emergency_contact_phone | Text (nullable) | Emergency contact phone |
| emergency_contact_relationship | Text (nullable) | Relationship to patient |
| status | Enumeration | Active or Inactive |
| registration_date | Timestamp | When patient was registered |
| created_at | Timestamp | Record creation timestamp |
| updated_at | Timestamp | Last modification timestamp |

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| ClinicalRecord | Has | 1:1 |
| Appointment | Has | 1:N |

**Cardinality Notes:**
- Each Patient has exactly one ClinicalRecord (created automatically)
- Each Patient may have zero or more Appointments

---

### 1.2 ClinicalRecord

**Purpose:**
Longitudinal container aggregating all clinical information for a single patient. Provides unified access to the patient's complete treatment journey.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique clinical record identifier |
| patient_id | Foreign Key | Reference to owning Patient |
| created_at | Timestamp | Record creation timestamp |
| updated_at | Timestamp | Last modification to any contained entity |

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| Patient | Belongs to | N:1 |
| PsychiatricHistory | Contains | 1:N (versioned) |
| Note | Contains | 1:N |
| Medication | Contains | 1:N |
| ClinicalEvent | Contains | 1:N |

**Cardinality Notes:**
- Each ClinicalRecord belongs to exactly one Patient
- Each ClinicalRecord contains one or more PsychiatricHistory versions
- Zero or more Notes, Medications, and ClinicalEvents

---

### 1.3 PsychiatricHistory

**Purpose:**
Captures comprehensive psychiatric background information. Versioned entity where updates create new versions rather than modifying existing records.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique version identifier |
| clinical_record_id | Foreign Key | Reference to owning ClinicalRecord |
| version_number | Integer | Sequential version (starts at 1) |
| chief_complaint | Text (nullable) | Primary presenting concern |
| history_of_present_illness | Text (nullable) | Current episode narrative |
| past_psychiatric_history | Text (nullable) | Prior psychiatric treatment |
| past_hospitalizations | Text (nullable) | Inpatient psychiatric episodes |
| suicide_attempt_history | Text (nullable) | Self-harm and suicide history |
| substance_use_history | Text (nullable) | Alcohol and drug use patterns |
| family_psychiatric_history | Text (nullable) | Family mental health history |
| medical_history | Text (nullable) | General medical conditions |
| surgical_history | Text (nullable) | Past surgeries |
| allergies | Text (nullable) | Known allergies |
| social_history | Text (nullable) | Living situation, occupation, relationships |
| developmental_history | Text (nullable) | Early development milestones |
| is_current | Boolean | Whether this is the active version |
| created_at | Timestamp | When this version was created |
| superseded_at | Timestamp (nullable) | When this version was replaced |

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| ClinicalRecord | Belongs to | N:1 |
| ClinicalEvent | Generates | 1:1 (for version 2+) |

**Cardinality Notes:**
- Multiple versions may exist per ClinicalRecord
- Only one version has is_current = true
- Version 1 does not generate a ClinicalEvent

---

### 1.4 Note

**Purpose:**
Clinical documentation for a patient encounter. Supports draft and finalized states with immutability upon finalization.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique note identifier |
| clinical_record_id | Foreign Key | Reference to owning ClinicalRecord |
| encounter_date | Date | When the clinical encounter occurred |
| encounter_type | Enumeration | Type of clinical encounter |
| status | Enumeration | Draft or Finalized |
| subjective | Text (nullable) | Patient's reported symptoms and concerns |
| objective | Text (nullable) | Clinician's observations and findings |
| assessment | Text (nullable) | Clinical interpretation and diagnosis |
| plan | Text (nullable) | Treatment plan and next steps |
| created_at | Timestamp | When note was created |
| finalized_at | Timestamp (nullable) | When note was finalized |

**Encounter Type Values:**
- Initial Evaluation
- Follow-up
- Crisis Intervention
- Medication Review
- Therapy Session
- Phone Consultation
- Other

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| ClinicalRecord | Belongs to | N:1 |
| Addendum | Has | 1:N |
| ClinicalEvent | Generates | 1:1 (when finalized) |

**Cardinality Notes:**
- Each Note belongs to exactly one ClinicalRecord
- Only finalized Notes generate ClinicalEvents
- A finalized Note may have zero or more Addenda

---

### 1.5 Addendum

**Purpose:**
Immutable supplement to a finalized Note. Provides mechanism to add information or corrections without altering original documentation.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique addendum identifier |
| note_id | Foreign Key | Reference to parent Note |
| content | Text | Addendum text content |
| reason | Text | Why the addendum was added |
| created_at | Timestamp | When addendum was created |

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| Note | Belongs to | N:1 |

**Cardinality Notes:**
- Each Addendum belongs to exactly one finalized Note
- No limit on number of Addenda per Note

---

### 1.6 Medication

**Purpose:**
Pharmaceutical agent record tracking the complete lifecycle from initiation through discontinuation. Dosage changes create new records linked to predecessors.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique medication identifier |
| clinical_record_id | Foreign Key | Reference to owning ClinicalRecord |
| drug_name | Text | Name of the medication |
| dosage | Decimal | Numeric dosage value |
| dosage_unit | Text | Unit of measurement (mg, mcg, etc.) |
| frequency | Text | Dosing schedule |
| route | Text (nullable) | Route of administration |
| start_date | Date | When medication was initiated |
| end_date | Date (nullable) | When medication was discontinued |
| prescribing_reason | Text | Why medication was prescribed |
| discontinuation_reason | Text (nullable) | Why medication was stopped |
| status | Enumeration | Active or Discontinued |
| predecessor_id | Foreign Key (nullable) | Reference to previous version if dosage changed |
| created_at | Timestamp | When record was created |

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| ClinicalRecord | Belongs to | N:1 |
| Medication | Predecessor | N:1 (self-reference, nullable) |
| ClinicalEvent | Generates | 1:N (Start, Change, Stop) |

**Cardinality Notes:**
- Each Medication belongs to exactly one ClinicalRecord
- A Medication may have a predecessor (for dosage changes)
- Each Medication generates one to three ClinicalEvents over its lifecycle

---

### 1.7 ClinicalEvent

**Purpose:**
Timeline entry representing a clinically significant occurrence. Provides unified chronological view of patient history.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique event identifier |
| clinical_record_id | Foreign Key | Reference to owning ClinicalRecord |
| event_date | Date | When the event occurred clinically |
| event_type | Enumeration | Category of clinical event |
| title | Text | Brief event summary |
| description | Text (nullable) | Detailed event description |
| source_type | Enumeration (nullable) | Type of source entity (Note, Medication, PsychiatricHistory, Manual) |
| source_id | Identifier (nullable) | Reference to source entity |
| recorded_at | Timestamp | When event was documented |

**Event Type Values:**
- Encounter
- Medication Start
- Medication Change
- Medication Stop
- Hospitalization
- Life Event
- History Update
- Other

**Source Type Values:**
- Note (for Encounter events)
- Medication (for Medication events)
- PsychiatricHistory (for History Update events)
- Manual (for Hospitalization, Life Event, Other)

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| ClinicalRecord | Belongs to | N:1 |
| Note | References | N:1 (nullable) |
| Medication | References | N:1 (nullable) |
| PsychiatricHistory | References | N:1 (nullable) |

**Cardinality Notes:**
- Each ClinicalEvent belongs to exactly one ClinicalRecord
- Source reference is polymorphic based on event type
- Manual events have no source entity reference

---

### 1.8 Appointment

**Purpose:**
Placeholder for scheduled future encounters. Minimal implementation supporting next-encounter tracking only.

**Persistent Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| id | Identifier | Unique appointment identifier |
| patient_id | Foreign Key | Reference to Patient |
| scheduled_date | Date | Intended date of encounter |
| scheduled_time | Time (nullable) | Intended time of encounter |
| duration_minutes | Integer (nullable) | Expected duration |
| appointment_type | Enumeration | Type of planned encounter |
| status | Enumeration | Appointment status |
| notes | Text (nullable) | Additional scheduling notes |
| created_at | Timestamp | When appointment was created |
| updated_at | Timestamp | Last modification timestamp |

**Appointment Type Values:**
- Initial Evaluation
- Follow-up
- Crisis Intervention
- Medication Review
- Therapy Session
- Phone Consultation
- Other

**Status Values:**
- Scheduled
- Completed
- Cancelled
- No-show

**Relationships:**

| Related Entity | Relationship | Cardinality |
|----------------|--------------|-------------|
| Patient | Belongs to | N:1 |

**Cardinality Notes:**
- Each Appointment belongs to exactly one Patient
- Appointments do not generate ClinicalEvents
- No automatic link to Notes

---

## 2. PostgreSQL-Aware Considerations

### 2.1 Identity Strategy

**Primary Keys:**
- All entities use surrogate identifiers
- Identifiers are system-generated, not user-provided
- Identifiers are immutable once assigned
- Recommended: UUID for global uniqueness without coordination

**Natural Keys:**
- Patient: full_name + date_of_birth (for duplicate detection only, not primary key)
- PsychiatricHistory: clinical_record_id + version_number (uniqueness constraint)
- No composite primary keys

### 2.2 Referential Integrity

**Foreign Key Enforcement:**
- All relationships must be enforced at database level
- Cascading deletes are prohibited (no clinical data deletion)
- Orphan records are not permitted

**Reference Expectations:**

| Child Entity | Parent Entity | On Parent Change |
|--------------|---------------|------------------|
| ClinicalRecord | Patient | Restrict (no patient deletion) |
| PsychiatricHistory | ClinicalRecord | Restrict |
| Note | ClinicalRecord | Restrict |
| Addendum | Note | Restrict |
| Medication | ClinicalRecord | Restrict |
| ClinicalEvent | ClinicalRecord | Restrict |
| Appointment | Patient | Restrict |

### 2.3 Temporal Handling

**Date vs Timestamp:**
- Clinical dates (encounter_date, start_date, event_date): Date only, no time component
- System timestamps (created_at, finalized_at, recorded_at): Full timestamp with timezone
- Scheduled times (scheduled_time): Time only, separate from date

**Timezone Strategy:**
- Store all timestamps in UTC
- Application layer handles timezone conversion for display
- Date fields are calendar dates (no timezone conversion)

**Temporal Ordering:**
- Primary sort: event_date (clinical occurrence)
- Secondary sort: recorded_at (documentation timestamp)
- Tertiary sort: event_type ordinal position

### 2.4 Soft-Correction Patterns

**Instead of UPDATE:**
- PsychiatricHistory: Create new version, mark previous as superseded
- Medication dosage: Discontinue current, create new with predecessor link
- Note corrections: Create Addendum, never modify original

**Instead of DELETE:**
- Patient: Set status to Inactive
- Draft Note: Allowed to delete (only entity with true deletion)
- All other entities: No deletion mechanism

---

## 3. Timeline Invariants

### 3.1 Chronological Ordering

**Ordering Algorithm:**
1. Primary: event_date ascending (clinical date)
2. Secondary: recorded_at ascending (documentation timestamp)
3. Tertiary: event_type priority ascending

**Event Type Priority Order:**
1. Encounter (priority 1)
2. Medication Start (priority 2)
3. Medication Change (priority 3)
4. Medication Stop (priority 4)
5. Hospitalization (priority 5)
6. Life Event (priority 6)
7. History Update (priority 7)
8. Other (priority 8)

**Invariant:**
Timeline ordering must be deterministic. Given the same data, the same order must always result.

### 3.2 Historical Integrity

**Append-Only Entities:**
- ClinicalEvent: Never modified after creation
- Addendum: Never modified after creation
- PsychiatricHistory (individual version): Never modified after creation

**Immutable After State Change:**
- Note (after finalization): All content fields locked
- Medication (after discontinuation): All fields locked

**Version Chain Integrity:**
- PsychiatricHistory versions form unbroken sequence (1, 2, 3, ...)
- Medication predecessor chain is acyclic (no circular references)
- Version numbers never reused within same ClinicalRecord

### 3.3 Event Generation Integrity

**Guaranteed Event Creation:**
- Note finalization MUST create exactly one Encounter event
- Medication creation MUST create exactly one Medication Start event
- Medication discontinuation MUST create exactly one Medication Stop event
- PsychiatricHistory version 2+ MUST create exactly one History Update event

**Prohibited Event Creation:**
- Draft Note MUST NOT create any event
- Patient registration MUST NOT create any event
- Appointment MUST NOT create any event
- PsychiatricHistory version 1 MUST NOT create any event

### 3.4 Backdating Rules

**Permitted:**
- event_date may be in the past relative to recorded_at
- Backdated events must integrate correctly into existing timeline
- No constraint on how far back an event may be dated

**Prohibited:**
- event_date must not be in the future
- encounter_date must not be in the future
- start_date must not be in the future (for medications)

---

## 4. Mutability & Corrections

### 4.1 Immutable Data

**Always Immutable:**

| Entity | Immutable Fields |
|--------|------------------|
| Patient | id, registration_date |
| ClinicalRecord | id, patient_id, created_at |
| PsychiatricHistory | All fields after creation |
| Note (finalized) | All content fields, encounter_date, encounter_type, finalized_at |
| Addendum | All fields |
| Medication (discontinued) | All fields |
| ClinicalEvent | All fields |

### 4.2 Mutable Data

**Conditionally Mutable:**

| Entity | Mutable Fields | Condition |
|--------|----------------|-----------|
| Patient | full_name, contact fields, emergency contact fields | Always |
| Patient | status | Always (active ↔ inactive) |
| Patient | date_of_birth | Until first finalized Note exists |
| Note | All content fields | Only while status = Draft |
| Note | status | Draft → Finalized only (one-way) |
| Medication | end_date, discontinuation_reason, status | Only when discontinuing |
| Appointment | All fields except id | Always |

### 4.3 Correction Representation

**For Note Errors:**
- Original finalized Note remains unchanged
- Create Addendum with reason explaining correction
- Addendum contains corrected information
- Display shows Note followed by all Addenda chronologically

**For Medication Errors:**
- If medication is still active: Discontinue with reason "Documented in error"
- Create new Medication record with correct information if applicable
- Timeline shows Stop event explaining the error
- No modification to original Medication record

**For PsychiatricHistory Errors:**
- Create new version with corrected information
- Previous version remains accessible with superseded_at timestamp
- History Update event generated for new version
- Version history shows complete correction trail

**For Patient Demographic Errors:**
- Direct update permitted (demographics are not clinical data)
- No version history for demographic changes in MVP
- No ClinicalEvent generated for demographic updates

### 4.4 Supersession Pattern

**For Versioned Entities (PsychiatricHistory):**

1. Create new record with incremented version_number
2. Set is_current = true on new record
3. Set is_current = false on previous record
4. Set superseded_at = current timestamp on previous record
5. Generate History Update ClinicalEvent for new version

**For Medication Changes:**

1. Set end_date on current Medication (day before new effective date)
2. Set discontinuation_reason = "Dosage changed" or similar
3. Set status = Discontinued on current Medication
4. Create new Medication with new dosage values
5. Set predecessor_id on new Medication referencing discontinued one
6. Generate Medication Stop event for old, Medication Start or Change event for new

---

## 5. Data Constraints

### 5.1 Required Fields

**Patient:**
- id, full_name, date_of_birth, status, registration_date

**ClinicalRecord:**
- id, patient_id

**PsychiatricHistory:**
- id, clinical_record_id, version_number, is_current

**Note:**
- id, clinical_record_id, encounter_date, encounter_type, status
- For finalization: subjective, assessment, plan (additional requirements)

**Addendum:**
- id, note_id, content, reason

**Medication:**
- id, clinical_record_id, drug_name, dosage, dosage_unit, frequency, start_date, prescribing_reason, status
- For discontinuation: end_date, discontinuation_reason (additional requirements)

**ClinicalEvent:**
- id, clinical_record_id, event_date, event_type, title, recorded_at

**Appointment:**
- id, patient_id, scheduled_date, appointment_type, status

### 5.2 Uniqueness Rules

| Entity | Unique Constraint |
|--------|-------------------|
| Patient | id (primary) |
| Patient | full_name + date_of_birth (soft warning, not enforced) |
| ClinicalRecord | id (primary) |
| ClinicalRecord | patient_id (one record per patient) |
| PsychiatricHistory | id (primary) |
| PsychiatricHistory | clinical_record_id + version_number |
| Note | id (primary) |
| Addendum | id (primary) |
| Medication | id (primary) |
| ClinicalEvent | id (primary) |
| Appointment | id (primary) |

### 5.3 Enumeration Constraints

**Patient.status:**
- Valid values: Active, Inactive
- Default: Active

**Note.status:**
- Valid values: Draft, Finalized
- Default: Draft
- Transition: Draft → Finalized only

**Medication.status:**
- Valid values: Active, Discontinued
- Default: Active

**Appointment.status:**
- Valid values: Scheduled, Completed, Cancelled, No-show
- Default: Scheduled

### 5.4 Referential Constraints

| Constraint | Description |
|------------|-------------|
| ClinicalRecord.patient_id | Must reference existing Patient |
| PsychiatricHistory.clinical_record_id | Must reference existing ClinicalRecord |
| Note.clinical_record_id | Must reference existing ClinicalRecord |
| Addendum.note_id | Must reference existing finalized Note |
| Medication.clinical_record_id | Must reference existing ClinicalRecord |
| Medication.predecessor_id | Must reference existing Medication in same ClinicalRecord (if not null) |
| ClinicalEvent.clinical_record_id | Must reference existing ClinicalRecord |
| Appointment.patient_id | Must reference existing Patient |

---

## 6. Non-Goals

### 6.1 What Persistence Will NOT Handle

**Analytics & Reporting:**
- No aggregate tables or materialized views
- No statistical summaries
- No outcome tracking structures
- No population-level query optimization

**Multi-Tenancy:**
- No tenant isolation mechanisms
- No row-level security policies
- No tenant identifier columns
- Single clinician, single dataset assumed

**Scalability Patterns:**
- No sharding strategy
- No read replica configuration
- No partitioning scheme
- No connection pooling beyond Neon defaults

**Audit Logging:**
- No separate audit log tables
- No change tracking beyond immutability
- No user action logging
- No login/access logging (no authentication in MVP)

**Data Lifecycle:**
- No data archival strategy
- No retention policies
- No purging mechanisms
- No data export structures

**Search Optimization:**
- No full-text search indexes
- No search-specific tables
- No denormalized search structures
- Basic query-based search only

**Backup & Recovery:**
- No point-in-time recovery structures
- No backup metadata tables
- Relies on Neon platform capabilities

**External Integration:**
- No staging tables for imports
- No export queue tables
- No integration event tables
- No external system references

---

## 7. Entity Relationship Summary

```
Patient (1) ←──────────────────→ (1) ClinicalRecord
    │                                     │
    │                                     ├──→ (1..N) PsychiatricHistory [versioned]
    │                                     │            └──→ (0..1) ClinicalEvent
    │                                     │
    │                                     ├──→ (0..N) Note
    │                                     │            ├──→ (0..N) Addendum
    │                                     │            └──→ (0..1) ClinicalEvent
    │                                     │
    │                                     ├──→ (0..N) Medication
    │                                     │            ├──→ (0..1) Medication [predecessor]
    │                                     │            └──→ (1..N) ClinicalEvent
    │                                     │
    │                                     └──→ (0..N) ClinicalEvent [manual]
    │
    └──→ (0..N) Appointment
```

---

*Document Version: 1.0*
*Status: Final*
*Database Target: PostgreSQL (Neon)*
*Sources: 02_domain.md, 03_timeline.md, 04_use_cases.md, 06_dev_checklist.md*


---

## 18_patient_crud_specs.md

# Psychiatric Medical Records System — Patient CRUD Functional Specifications

## Overview

This document defines the functional specifications for the Patient CRUD (Create, Read, Update, Delete) module in the Psychiatric Medical Records System MVP.

This document specifies **WHAT** the Patient CRUD does, not **HOW** it is implemented.

The Patient CRUD module is responsible exclusively for patient identity and administrative information management. It does not handle clinical data, which is managed by the Timeline Engine and ClinicalRecord entities.

---

## 1. Purpose of the Patient Module

### 1.1 Why the Patient Entity Exists

The Patient entity serves as the primary aggregation root for the entire clinical record system. Every piece of clinical information in the system is associated with a Patient.

The Patient entity exists to:

- **Establish patient identity** — Provide a stable, unique identifier for each individual receiving care
- **Enable clinical data organization** — Serve as the anchor point around which all clinical documentation is structured
- **Support patient lookup** — Allow the clinician to locate and access a specific patient's clinical record
- **Maintain administrative information** — Store contact details and emergency information needed for clinical operations

### 1.2 Role in the Overall System

The Patient module is the entry point to the clinical record system:

1. **Before clinical documentation can begin**, a Patient must exist
2. **All clinical entities** (Notes, Medications, ClinicalEvents, PsychiatricHistory) are associated with a Patient through the ClinicalRecord
3. **Patient search** is the primary mechanism for accessing clinical records
4. **Patient status** (active/inactive) controls visibility but does not affect clinical data accessibility

The Patient module operates independently from clinical data management. Changes to patient demographic information do not affect clinical documentation, and clinical events do not modify patient identity information.

### 1.3 Relationship to the Clinical Timeline

The Patient module has a **strict boundary** with the Timeline Engine:

- **Patient creation does NOT generate timeline events** — Patient registration is an administrative action, not a clinical occurrence
- **Patient updates do NOT generate timeline events** — Demographic changes are not clinically significant events
- **Patient status changes do NOT generate timeline events** — Activating or deactivating a patient is administrative, not clinical
- **The Timeline Engine never modifies Patient data** — Clinical events are read-only with respect to patient identity

The Patient module creates and manages the ClinicalRecord container, but the Timeline Engine owns all content within that container.

---

## 2. Patient Entity Definition (Functional)

### 2.1 What a Patient Represents

A Patient represents an individual receiving psychiatric care from the clinician.

The Patient entity captures:
- **Identity information** — Who the patient is
- **Administrative information** — How to contact the patient and their emergency contact
- **System state** — Whether the patient is currently active in the system

The Patient entity does **NOT** represent:
- Clinical observations or assessments
- Treatment history or medication records
- Encounter documentation
- Psychiatric background information

### 2.2 Identifying Information

Identifying information is data that uniquely identifies the patient:

| Field | Purpose | Immutability |
|-------|---------|--------------|
| **Identifier** | System-assigned unique identifier | Immutable once assigned |
| **Full name** | Legal name of the patient | Mutable (name changes are permitted) |
| **Date of birth** | Birth date of the patient | Mutable (corrections are permitted) |

**Rationale:** The identifier is immutable to maintain referential integrity. Name and date of birth may change due to legal name changes or data entry corrections.

### 2.3 Administrative Information

Administrative information supports clinical operations but is not part of the clinical record:

| Field | Purpose | Required |
|-------|---------|----------|
| **Contact phone** | Primary phone number for patient contact | Optional |
| **Contact email** | Primary email address for patient contact | Optional |
| **Address** | Residential address | Optional |
| **Emergency contact name** | Full name of emergency contact person | Optional |
| **Emergency contact phone** | Phone number of emergency contact | Required if emergency contact name is provided |
| **Emergency contact relationship** | Relationship of emergency contact to patient | Optional |

**Rationale:** Contact information may change frequently and does not affect clinical documentation. Emergency contact information is required only when an emergency contact is specified.

### 2.4 System State Information

System state tracks the patient's operational status:

| Field | Purpose | Values |
|-------|---------|--------|
| **Status** | Whether patient is currently active | Active, Inactive |
| **Registration date** | When patient was first registered | Immutable timestamp |
| **Created at** | System timestamp of record creation | Immutable |
| **Updated at** | System timestamp of last modification | Auto-updated |

**Rationale:** Status allows filtering active patients from inactive ones. Timestamps provide audit information but are not part of clinical history.

### 2.5 What Is Explicitly NOT Part of the Patient Entity

The following information is **explicitly excluded** from the Patient entity:

- **Clinical observations** — Stored in Notes
- **Medication records** — Stored in Medication entities
- **Psychiatric history** — Stored in PsychiatricHistory versions
- **Clinical events** — Stored in ClinicalEvent entities
- **Encounter documentation** — Stored in Note entities
- **Treatment plans** — Stored in Note Plan sections
- **Assessment information** — Stored in Note Assessment sections

**Boundary Principle:** The Patient entity contains only identity and administrative data. All clinical information lives in the ClinicalRecord and its contained entities.

---

## 3. Create Patient

### 3.1 Purpose

Create Patient establishes a new patient identity in the system and initializes their clinical record container.

### 3.2 Required Fields

The following fields must be provided to create a patient:

| Field | Validation Rule |
|-------|----------------|
| **Full name** | Cannot be empty. Must contain at least one non-whitespace character. |
| **Date of birth** | Must be a valid date. Cannot be in the future. |

### 3.3 Optional Fields

The following fields may be provided but are not required:

- Contact phone
- Contact email
- Address
- Emergency contact name
- Emergency contact phone (required if emergency contact name is provided)
- Emergency contact relationship

### 3.4 Validation Rules

| Field | Validation |
|-------|------------|
| **Full name** | Required. Non-empty after trimming whitespace. |
| **Date of birth** | Required. Valid calendar date. Must be ≤ current date. |
| **Contact phone** | Optional. If provided, must be a valid phone number format (format validation is implementation-specific). |
| **Contact email** | Optional. If provided, must be a valid email format. |
| **Emergency contact name** | Optional. |
| **Emergency contact phone** | Conditional. Required if emergency contact name is provided. Must be a valid phone number format if provided. |

### 3.5 Error Conditions

| Condition | System Behavior |
|-----------|----------------|
| Missing full name | Creation is blocked. Error message indicates full name is required. |
| Missing date of birth | Creation is blocked. Error message indicates date of birth is required. |
| Invalid date format | Creation is blocked. Error message requests valid date format. |
| Future date of birth | Creation is blocked. Error message indicates date cannot be in the future. |
| Invalid email format | Creation is blocked. Error message indicates invalid email format. |
| Invalid phone format | Creation is blocked. Error message indicates invalid phone format. |
| Emergency contact name without phone | Creation is blocked. Error message indicates emergency contact phone is required when name is provided. |

### 3.6 What Happens After Creation

Upon successful patient creation:

1. **Patient record is created** with:
   - System-generated unique identifier
   - Status set to Active
   - Registration date set to current timestamp
   - Created at timestamp set to current time
   - Updated at timestamp set to current time

2. **ClinicalRecord is automatically created** and linked to the Patient (1:1 relationship)

3. **Initial PsychiatricHistory (version 1) is automatically created** within the ClinicalRecord with all content fields empty (to be populated during initial evaluation)

4. **Patient becomes searchable** — The patient appears in search results immediately

5. **Patient is available for clinical documentation** — Notes, medications, and other clinical entities can be created

### 3.7 Timeline Event Generation

**Patient creation does NOT generate timeline events.**

**Rationale:** Patient registration is an administrative action, not a clinical occurrence. The Timeline Engine only tracks clinically significant events (encounters, medication changes, hospitalizations, etc.). Administrative actions like patient registration, demographic updates, and status changes are outside the timeline scope.

**Explicit Guarantee:** No ClinicalEvent is created when a Patient is created.

---

## 4. Read / View Patient

### 4.1 Purpose

Read Patient retrieves patient identity and administrative information for display or processing.

### 4.2 How a Patient Can Be Retrieved

A patient can be retrieved by:

1. **Direct identifier lookup** — Using the patient's unique identifier
2. **Search by criteria** — Using name, date of birth, or identifier (see Section 5)
3. **List all patients** — Retrieving all patients in the system

### 4.3 What Information Is Returned

When a patient is retrieved, the following information is returned:

| Field | Included | Rationale |
|-------|----------|-----------|
| Identifier | Yes | Required for all operations |
| Full name | Yes | Primary identifying information |
| Date of birth | Yes | Primary identifying information |
| Contact phone | Yes | Administrative information |
| Contact email | Yes | Administrative information |
| Address | Yes | Administrative information |
| Emergency contact name | Yes | Administrative information |
| Emergency contact phone | Yes | Administrative information |
| Emergency contact relationship | Yes | Administrative information |
| Status | Yes | System state information |
| Registration date | Yes | Audit information |
| Created at | Yes | Audit information |
| Updated at | Yes | Audit information |

### 4.4 What Information Is Excluded

The following information is **explicitly excluded** from patient read operations:

- **ClinicalRecord contents** — Notes, medications, events are not included
- **PsychiatricHistory content** — History versions are not included
- **Timeline events** — Clinical events are not included
- **Appointments** — Appointment records are not included

**Rationale:** Patient read operations return only patient identity and administrative data. Clinical data is accessed through separate ClinicalRecord operations.

### 4.5 Guarantees Provided

| Guarantee | Description |
|-----------|-------------|
| **Consistency** | Multiple reads of the same patient return identical data (unless modified between reads) |
| **Freshness** | Read operations return the current state of patient data as of the read time |
| **Completeness** | All patient fields are included in the response (null values for optional fields) |
| **Existence validation** | Reading a non-existent patient returns an explicit error, not null or empty data |

### 4.6 Error Conditions

| Condition | System Behavior |
|-----------|----------------|
| Patient does not exist | Returns explicit error: Patient not found |
| Invalid identifier format | Returns explicit error: Invalid identifier |

---

## 5. Search / List Patients

### 5.1 Purpose

Search Patient allows the clinician to locate existing patients by various criteria. List Patients provides access to all patients in the system.

### 5.2 Supported Search Criteria (MVP Only)

The MVP supports the following search criteria:

| Criterion | Matching Behavior |
|-----------|------------------|
| **Full name** | Partial match (substring search). Case-insensitive. Matches anywhere within the name. |
| **Date of birth** | Exact match. Must match the complete date. |
| **Patient identifier** | Exact match. Must match the complete identifier. |

**Combination:** Multiple criteria can be combined (e.g., name AND date of birth). All specified criteria must match for a patient to be included in results.

### 5.3 Sorting and Ordering Rules

Search results are ordered as follows:

1. **Primary sort:** Status (Active patients before Inactive patients)
2. **Secondary sort:** Full name (alphabetical, case-insensitive)
3. **Tertiary sort:** Registration date (most recently registered first)

**Rationale:** Active patients are most relevant for daily operations. Alphabetical ordering provides predictable navigation. Recent registrations may be more relevant than older ones.

### 5.4 Expected Behavior with Partial Matches

| Scenario | Behavior |
|----------|----------|
| **Name partial match** | "Mar" matches "María", "Martínez", "Marco" |
| **Name case variation** | "maria" matches "María", "MARIA", "Maria" |
| **No matches found** | Returns empty result set (not an error condition) |
| **Multiple matches** | All matching patients are returned, ordered per sorting rules |

### 5.5 Explicit Non-Goals

The following search capabilities are **explicitly excluded** from the MVP:

- **Fuzzy search** — No typo tolerance or approximate matching
- **Full-text search** — No search across clinical content (Notes, medications, etc.)
- **Phonetic matching** — No soundex or similar phonetic algorithms
- **Advanced filters** — No filtering by registration date range, status combinations, etc.
- **Search history** — No saved searches or recent searches
- **Search suggestions** — No autocomplete or suggestion features

**Rationale:** MVP focuses on basic patient lookup. Advanced search features are deferred to post-MVP.

### 5.6 List All Patients

When no search criteria are provided, the system returns all patients in the system, ordered by the same sorting rules as search results.

**Use case:** The clinician may want to browse all patients or see the complete patient registry.

**Performance consideration:** For large patient registries, pagination may be necessary, but pagination strategy is an implementation detail, not a functional requirement.

---

## 6. Update Patient

### 6.1 Purpose

Update Patient allows modification of patient demographic and administrative information.

### 6.2 What Patient Data Can Be Updated

The following fields can be updated:

| Field | Update Allowed | Notes |
|-------|----------------|-------|
| Full name | Yes | Name changes (legal name changes, corrections) |
| Date of birth | Yes | Corrections to originally entered date |
| Contact phone | Yes | Phone number updates |
| Contact email | Yes | Email address updates |
| Address | Yes | Address changes |
| Emergency contact name | Yes | Emergency contact updates |
| Emergency contact phone | Yes | Emergency contact phone updates |
| Emergency contact relationship | Yes | Relationship updates |
| Status | Yes | Activate or deactivate patient |

### 6.3 What Is Immutable

The following fields **cannot be updated**:

| Field | Immutability Rationale |
|-------|------------------------|
| **Identifier** | Referential integrity. All clinical data references this identifier. |
| **Registration date** | Historical record of when patient entered the system. |
| **Created at** | Audit timestamp. |
| **Updated at** | System-managed. Automatically updated on any modification. |

### 6.4 Validation and Error Scenarios

Update operations use the same validation rules as Create operations:

| Validation | Error Behavior |
|-----------|----------------|
| Full name becomes empty | Update is blocked. Error message indicates full name is required. |
| Date of birth becomes invalid | Update is blocked. Error message indicates invalid date. |
| Date of birth becomes future date | Update is blocked. Error message indicates date cannot be in the future. |
| Invalid email format | Update is blocked. Error message indicates invalid email format. |
| Invalid phone format | Update is blocked. Error message indicates invalid phone format. |
| Emergency contact name without phone | Update is blocked. Error message indicates emergency contact phone is required. |
| Patient does not exist | Update is blocked. Error message indicates patient not found. |

### 6.5 Impact on Clinical Data

**Patient updates do NOT affect clinical data.**

| Aspect | Behavior |
|--------|----------|
| **ClinicalRecord** | Unchanged. All clinical data remains intact. |
| **Timeline events** | No events are generated. Patient updates are not clinical events. |
| **Notes** | Unchanged. All encounter documentation remains intact. |
| **Medications** | Unchanged. All medication records remain intact. |
| **PsychiatricHistory** | Unchanged. All history versions remain intact. |

**Explicit Guarantee:** Updating patient demographic information is completely independent from clinical documentation. The two domains do not interact.

### 6.6 Status Change Behavior

When patient status is changed:

| Change | Behavior |
|--------|----------|
| **Active → Inactive** | Patient is marked inactive. Clinical record remains fully accessible. Patient appears in search results but is visually distinguished as inactive. |
| **Inactive → Active** | Patient is reactivated. Full access to clinical record is restored. Patient appears as active in search results. |

**Rationale:** Status is a visibility and workflow marker, not a data access control. Inactive patients retain full clinical history for legal and clinical reasons.

---

## 7. Delete / Archive Patient

### 7.1 Deletion Policy

**Patient deletion is NOT allowed in the MVP.**

**Rationale:** 
- Medical records must be retained for legal and clinical reasons
- Deleting a patient would require cascading deletion of all clinical data, which violates immutability principles
- Historical clinical data must remain accessible even if a patient is no longer active

### 7.2 Alternative: Deactivation

Instead of deletion, patients are **deactivated**:

1. Patient status is set to Inactive
2. Patient remains in the system
3. All clinical data remains accessible
4. Patient appears in search results but is distinguished as inactive

**Use cases for deactivation:**
- Patient has moved and is no longer receiving care
- Patient has transferred to another provider
- Patient has passed away (clinical record must be retained)
- Patient has requested to discontinue care

### 7.3 Impact on Historical Clinical Data

When a patient is deactivated:

| Clinical Data | Impact |
|---------------|--------|
| **ClinicalRecord** | Remains fully accessible |
| **All Notes** | Remain accessible and immutable |
| **All Medications** | Remain accessible and immutable |
| **All ClinicalEvents** | Remain accessible and immutable |
| **All PsychiatricHistory versions** | Remain accessible and immutable |
| **Timeline** | Remains fully queryable |

**Explicit Guarantee:** Deactivation does not affect any clinical data. All historical documentation remains intact and accessible.

### 7.4 Safety Rules

The following safety rules apply to patient deactivation:

| Rule | Rationale |
|------|-----------|
| **Deactivation is reversible** | Patients can be reactivated if they return to care |
| **No data is hidden** | Inactive patients' clinical records are fully visible |
| **No timeline events are generated** | Status change is administrative, not clinical |
| **No clinical data is modified** | All clinical documentation remains unchanged |

### 7.5 Explicit Non-Goals

The following capabilities are **explicitly excluded**:

- **Hard deletion** — No mechanism to permanently remove patients
- **Data archival** — No separate archival system for inactive patients
- **Data export on deactivation** — No automatic export when patient is deactivated
- **Retention policy enforcement** — No automatic deletion based on time or other criteria

**Rationale:** MVP focuses on deactivation as the sole mechanism for managing patient lifecycle. Advanced data management features are outside scope.

---

## 8. Integration with Timeline Engine

### 8.1 How the Patient Module Interacts with the Timeline Engine

The Patient module and Timeline Engine have a **strict separation of concerns**:

| Operation | Patient Module Responsibility | Timeline Engine Responsibility |
|-----------|------------------------------|-------------------------------|
| **Patient creation** | Creates Patient and ClinicalRecord | No involvement. No events generated. |
| **Patient update** | Updates patient demographic data | No involvement. No events generated. |
| **Patient deactivation** | Updates patient status | No involvement. No events generated. |
| **Clinical documentation** | Provides patient identifier for lookup | Generates and manages all clinical events |
| **Timeline queries** | Provides patient identifier | Returns timeline events for that patient |

**Boundary Principle:** The Patient module manages identity. The Timeline Engine manages clinical history. They interact only through the patient identifier.

### 8.2 What the Patient Module Must NEVER Do

The Patient module must **NEVER**:

- **Generate timeline events** — Patient operations are administrative, not clinical
- **Modify clinical data** — Patient updates do not touch Notes, Medications, or Events
- **Query timeline data** — Patient module does not read clinical events
- **Depend on timeline state** — Patient operations are independent of clinical documentation

### 8.3 Boundaries Between Identity Management and Clinical History

| Domain | Owned By | Contains |
|--------|----------|----------|
| **Patient Identity** | Patient Module | Name, DOB, contact info, status |
| **Clinical History** | Timeline Engine | Events, notes, medications, psychiatric history |
| **Container** | Patient Module (creates) | ClinicalRecord (structure only) |
| **Container Contents** | Timeline Engine (manages) | All clinical entities within ClinicalRecord |

**Integration Point:** The ClinicalRecord is created by the Patient module but immediately becomes the domain of the Timeline Engine. The Patient module never modifies ClinicalRecord contents.

### 8.4 Explicit Guarantees

| Guarantee | Description |
|-----------|-------------|
| **No event generation** | Patient CRUD operations never create ClinicalEvents |
| **No clinical data access** | Patient module does not read or modify clinical entities |
| **Independent operations** | Patient updates succeed regardless of clinical record state |
| **Identifier stability** | Patient identifier never changes, ensuring Timeline Engine references remain valid |

---

## 9. UX & Language Constraints

### 9.1 UX Expectations Related to Patient CRUD (Conceptual)

The following UX expectations apply to patient CRUD operations:

| Operation | UX Expectation |
|-----------|----------------|
| **Create Patient** | Clear form with required fields indicated. Validation errors shown inline. Success confirmation displayed. |
| **Search Patient** | Search input with immediate feedback. Results displayed in list format. Empty state shown when no results. |
| **View Patient** | Patient information displayed in readable format. Clear distinction between identity and administrative information. |
| **Update Patient** | Editable form pre-populated with current values. Changes saved explicitly (not auto-save). Success confirmation displayed. |
| **Deactivate Patient** | Confirmation dialog before deactivation. Clear indication of what deactivation means (data remains accessible). |

**Note:** These are functional expectations, not UI specifications. Implementation details (layout, styling, components) are outside this document's scope.

### 9.2 Spanish Language Requirements

**All user-facing text in Patient CRUD operations MUST be in Spanish.**

This includes:

| Text Type | Examples |
|-----------|----------|
| **Labels** | "Nombre completo", "Fecha de nacimiento", "Teléfono de contacto" |
| **Buttons** | "Crear paciente", "Buscar", "Guardar cambios", "Desactivar" |
| **Messages** | "Paciente creado exitosamente", "Paciente no encontrado" |
| **Validation errors** | "El nombre completo es requerido", "La fecha no puede ser futura" |
| **Empty states** | "No se encontraron pacientes", "No hay pacientes registrados" |
| **Status indicators** | "Activo", "Inactivo" |

**Exceptions:**
- Internal code identifiers may remain in English
- Database field names are not affected
- System-generated identifiers are not translated
- Technical error codes (for debugging) may be in English

### 9.3 Error and Empty-State Expectations (Conceptual)

| Scenario | Expected Behavior |
|----------|------------------|
| **Validation error** | Clear message in Spanish explaining what is wrong and how to fix it |
| **Patient not found** | Explicit message: "Paciente no encontrado" (not a generic error) |
| **Empty search results** | Message: "No se encontraron pacientes que coincidan con la búsqueda" |
| **No patients in system** | Message: "No hay pacientes registrados. Cree su primer paciente." |
| **Network/system error** | Generic error message in Spanish. Technical details logged but not shown to user. |

**Rationale:** Users must understand what went wrong and what they can do about it. Empty states should guide users toward next actions.

---

## 10. Non-Goals & Exclusions

### 10.1 What Patient CRUD Will NOT Handle in MVP

The following capabilities are **explicitly excluded** from the Patient CRUD module in the MVP:

| Excluded Capability | Rationale |
|---------------------|-----------|
| **Duplicate patient detection** | MVP does not prevent or detect duplicate patient registrations. Clinician is responsible for checking before creation. |
| **Patient merge** | No mechanism to merge duplicate patient records. |
| **Bulk patient operations** | No import/export, bulk update, or batch operations. |
| **Patient history/audit trail** | No tracking of who changed what patient data and when (beyond updated_at timestamp). |
| **Patient photos or documents** | No file attachments or image storage. |
| **Patient tags or categories** | No custom labeling or categorization system. |
| **Patient notes/comments** | No free-form administrative notes about patients. |
| **Insurance information** | No insurance details, policy numbers, or coverage information. |
| **Billing information** | No payment methods, billing addresses, or financial data. |
| **Patient preferences** | No storage of patient communication preferences or special instructions. |
| **Advanced search** | No fuzzy matching, phonetic search, or full-text search across clinical content. |
| **Patient relationships** | No tracking of family relationships or guardian information beyond emergency contact. |
| **Patient demographics beyond basics** | No gender, ethnicity, preferred language, or other demographic fields. |
| **Patient consent tracking** | No consent forms, consent dates, or consent management. |
| **Patient portal integration** | No patient-facing access or self-service capabilities. |
| **External system integration** | No import from EHRs, no export to other systems, no API for external access. |
| **Data migration tools** | No utilities to migrate patient data from other systems. |
| **Patient data validation against external sources** | No verification against government databases, insurance records, etc. |
| **Multi-language patient names** | No special handling for names in non-Latin scripts (stored as-is). |
| **Patient data encryption beyond standard** | No field-level encryption or special security beyond standard database security. |

### 10.2 Clinical Data Exclusions

The Patient CRUD module explicitly does NOT handle:

- **Clinical documentation** — Notes, assessments, plans
- **Medication management** — Prescribing, tracking, discontinuing medications
- **Timeline events** — Creating, viewing, or modifying clinical events
- **Psychiatric history** — Creating or updating history versions
- **Encounter documentation** — Creating or finalizing clinical notes
- **Treatment planning** — No treatment plan entities or planning tools

**Boundary:** All clinical data is managed by the Timeline Engine and ClinicalRecord entities, not by the Patient CRUD module.

### 10.3 Post-MVP Considerations

The following capabilities may be considered for post-MVP but are explicitly out of scope:

- Advanced duplicate detection algorithms
- Patient data import/export
- Patient audit trail with change history
- Integration with external patient registries
- Advanced demographic data collection
- Patient portal functionality

---

## Summary

The Patient CRUD module is responsible for:

1. **Creating patient identities** — Registering new patients and initializing their clinical record containers
2. **Retrieving patient information** — Providing access to patient identity and administrative data
3. **Searching patients** — Enabling patient lookup by name, date of birth, or identifier
4. **Updating patient data** — Modifying demographic and contact information
5. **Deactivating patients** — Marking patients as inactive without deleting data

The module operates with **strict boundaries**:

- **No timeline event generation** — Patient operations are administrative, not clinical
- **No clinical data access** — Patient module does not read or modify clinical entities
- **No data deletion** — Patients are deactivated, never deleted
- **Spanish-only UX** — All user-facing text must be in Spanish

The Patient CRUD module can be implemented independently of clinical data management, with integration occurring only through the patient identifier shared between systems.

---

*Document Version: 1.0*  
*Status: Final*  
*Depends On: 01_specs.md, 02_domain.md, 04_use_cases.md, 13_timeline_engine.md, 14_timeline_contracts.md, 15_timeline_qa_invariants.md, 08_agent_policy.md*  
*Consumed By: Backend Implementation, UX Implementation, QA Testing*


---

# Eventos

## 21_foundational_timeline_event.md

# Sistema de Historias Clínicas Psiquiátricas — Especificación Funcional: Evento Fundacional de Timeline

## Overview

Este documento define la especificación funcional completa para el "Evento Fundacional de Timeline", un evento especial que marca el inicio formal de la historia clínica del paciente en el sistema.

Este documento especifica **QUÉ** es el evento y cómo se comporta funcionalmente, no **CÓMO** se implementa técnicamente.

El Evento Fundacional establece el punto de origen del timeline clínico y proporciona un marcador temporal para el inicio de la relación terapéutica documentada.

---

## 1. Propósito del Evento

### 1.1 Por Qué Existe el Evento Fundacional

El Evento Fundacional de Timeline existe para:

- **Marcar el inicio formal de la historia clínica** — Establece un punto de origen claro y explícito para el timeline del paciente
- **Proporcionar un ancla temporal** — Ofrece una referencia temporal absoluta desde la cual se ordenan todos los eventos subsecuentes
- **Establecer el contexto inicial** — Representa el momento en que la relación terapéutica documentada comienza, independientemente de cuándo se registró administrativamente al paciente
- **Garantizar completitud del timeline** — Asegura que todo paciente con un ClinicalRecord tenga al menos un evento en su timeline, eliminando estados vacíos

### 1.2 Problema que Resuelve

Sin el Evento Fundacional, el timeline de un paciente podría permanecer vacío hasta que ocurra el primer evento clínico documentado (típicamente la primera nota finalizada). Esto crea:

- **Ambiguidad temporal** — No hay un punto de referencia claro para el inicio de la historia
- **Estados vacíos** — Un ClinicalRecord podría existir sin eventos, dificultando la presentación y navegación
- **Desconexión conceptual** — La creación administrativa del paciente y el inicio de la historia clínica documentada no tienen un marcador explícito

El Evento Fundacional resuelve estos problemas proporcionando un evento garantizado que siempre existe y marca el inicio formal de la historia clínica.

### 1.3 Relación con Otros Eventos

El Evento Fundacional es único en el timeline:

- **Es el primer evento** — Siempre ocupa la posición más temprana en el timeline
- **No es un evento clínico** — No representa una ocurrencia clínica (encuentro, medicación, hospitalización)
- **No genera estado clínico** — No afecta medicaciones activas, historia psiquiátrica, o estado de tratamiento
- **Es inmutable** — Una vez creado, no puede ser modificado ni eliminado
- **No tiene fuente clínica** — No está vinculado a una Note, Medication, o PsychiatricHistory

---

## 2. Definición Funcional

### 2.1 Qué Es el Evento Fundacional

El Evento Fundacional de Timeline es un evento especial del sistema que marca el inicio formal de la historia clínica documentada de un paciente.

**Características esenciales:**

- Es un evento del tipo "Fundacional" (nuevo tipo de evento, distinto de los tipos clínicos existentes)
- Tiene una fecha de evento que representa el inicio de la historia clínica
- Tiene un título y descripción estándar definidos por el sistema
- No está vinculado a ninguna entidad clínica (Note, Medication, PsychiatricHistory)
- Es inmutable una vez creado
- No puede ser eliminado del timeline
- Siempre aparece como el primer evento en el timeline

### 2.2 Qué NO Es el Evento Fundacional

El Evento Fundacional **NO** es:

- **Un evento clínico** — No representa una ocurrencia clínica (encuentro, medicación, hospitalización, etc.)
- **Un evento generado por una entidad clínica** — No tiene fuente en Note, Medication, o PsychiatricHistory
- **Un evento editable** — Una vez creado, es completamente inmutable
- **Un evento opcional** — Es obligatorio para todo ClinicalRecord
- **Un marcador administrativo** — No representa la creación del Patient, sino el inicio de la historia clínica documentada
- **Un evento que genera estado** — No afecta medicaciones activas, historia psiquiátrica, o estado de tratamiento

### 2.3 Tipo de Evento

El Evento Fundacional introduce un nuevo tipo de evento: **"Foundational"** (o "Fundacional" en español para UX).

Este tipo es distinto de los tipos clínicos existentes:
- Encounter
- Medication Start
- Medication Change
- Medication Stop
- Hospitalization
- Life Event
- History Update
- Other

**Prioridad de ordenamiento:** El tipo "Foundational" tiene la prioridad más alta (0) en el ordenamiento por tipo de evento, garantizando que siempre aparezca primero.

---

## 3. Momento de Creación

### 3.1 Cuándo Se Crea el Evento Fundacional

El Evento Fundacional se crea **automáticamente** cuando se crea el ClinicalRecord del paciente.

**Secuencia de creación:**

1. Se crea el Patient (registro administrativo)
2. Se crea automáticamente el ClinicalRecord (contenedor de información clínica)
3. Se crea automáticamente el PsychiatricHistory versión 1 (historia inicial vacía)
4. **Se crea automáticamente el Evento Fundacional** (marca el inicio del timeline)

Esta secuencia ocurre en una única transacción atómica durante la creación del paciente.

### 3.2 Condiciones de Creación

El Evento Fundacional se crea si y solo si:

- Se ha creado exitosamente un ClinicalRecord
- El ClinicalRecord no tiene ya un Evento Fundacional (garantía de unicidad)

**No se crea si:**
- El ClinicalRecord no existe
- Ya existe un Evento Fundacional para ese ClinicalRecord
- La creación del ClinicalRecord falla

### 3.3 Unicidad

**Regla de unicidad:** Cada ClinicalRecord tiene exactamente un Evento Fundacional.

- No puede haber múltiples Eventos Fundacionales para el mismo ClinicalRecord
- No puede haber un ClinicalRecord sin Evento Fundacional
- La creación del Evento Fundacional es idempotente: si ya existe, no se crea otro

### 3.4 Fecha del Evento

**Fecha de evento (event_timestamp):**

La fecha del Evento Fundacional es la **fecha de creación del ClinicalRecord** (clinicalRecord.createdAt).

**Justificación funcional:**

- Representa el momento en que la historia clínica documentada comienza formalmente
- Proporciona una referencia temporal absoluta y consistente
- No depende de eventos clínicos futuros (que pueden no existir)
- Es determinista y no ambigua

**Fecha de registro (recorded_timestamp):**

La fecha de registro es la misma que la fecha de evento (ambas son el momento de creación del ClinicalRecord).

**No se permite backdating del Evento Fundacional:**

A diferencia de otros eventos clínicos, el Evento Fundacional no puede tener una fecha de evento en el pasado relativo a su creación. Su fecha siempre coincide con la creación del ClinicalRecord.

---

## 4. Relación con Patient / ClinicalRecord

### 4.1 Relación con Patient

El Evento Fundacional **NO** está directamente relacionado con el Patient.

**Separación de dominios:**

- **Patient** — Entidad administrativa (identidad, contacto, estado)
- **ClinicalRecord** — Contenedor de información clínica
- **Evento Fundacional** — Evento dentro del ClinicalRecord

El Evento Fundacional existe en el dominio clínico (ClinicalRecord), no en el dominio administrativo (Patient).

**Implicaciones:**

- La creación del Patient no genera el Evento Fundacional directamente
- La creación del Patient genera el ClinicalRecord, que a su vez genera el Evento Fundacional
- Las modificaciones al Patient no afectan el Evento Fundacional
- El Evento Fundacional no contiene información del Patient

### 4.2 Relación con ClinicalRecord

El Evento Fundacional pertenece a un ClinicalRecord específico.

**Relación:**

- Un ClinicalRecord tiene exactamente un Evento Fundacional
- Un Evento Fundacional pertenece a exactamente un ClinicalRecord
- La relación es 1:1

**Dependencia:**

- El Evento Fundacional no puede existir sin un ClinicalRecord
- Si un ClinicalRecord se elimina (operación no permitida en el MVP, pero conceptualmente), su Evento Fundacional también se eliminaría
- El Evento Fundacional referencia al ClinicalRecord a través de clinicalRecordId

### 4.3 Independencia de Entidades Clínicas

El Evento Fundacional **NO** está relacionado con:

- **Notes** — No tiene noteId
- **Medications** — No tiene medicationId
- **PsychiatricHistory** — No tiene psychiatricHistoryId
- **Addenda** — No tiene relación con addenda

**Tipo de fuente (sourceType):**

El Evento Fundacional tiene sourceType = "System" (o equivalente), indicando que es generado por el sistema, no por una entidad clínica.

**sourceId:**

El sourceId del Evento Fundacional es null, ya que no tiene una entidad fuente.

---

## 5. Comportamiento en la Timeline

### 5.1 Posición en el Timeline

**Posición absoluta:**

El Evento Fundacional **siempre** ocupa la primera posición en el timeline del paciente.

**Garantía de ordenamiento:**

Independientemente de las fechas de otros eventos, el Evento Fundacional aparece primero debido a:

1. **Prioridad de tipo de evento:** Tipo "Foundational" tiene prioridad 0 (más alta)
2. **Fecha de evento:** Coincide con la creación del ClinicalRecord (típicamente la fecha más temprana)
3. **Fecha de registro:** Coincide con la fecha de evento (más temprana posible)

### 5.2 Orden Determinista

El ordenamiento del Evento Fundacional sigue las reglas estándar del Timeline Engine:

```
ORDER BY
  event_timestamp ASC,
  recorded_timestamp ASC,
  event_type_priority ASC,
  event_identifier ASC
```

**Aplicación al Evento Fundacional:**

- **event_timestamp:** Fecha de creación del ClinicalRecord (típicamente la más temprana)
- **recorded_timestamp:** Misma que event_timestamp (más temprana posible)
- **event_type_priority:** 0 (más alta, tipo "Foundational")
- **event_identifier:** Identificador único del evento

**Resultado:** El Evento Fundacional siempre aparece primero, incluso si otros eventos tienen la misma fecha de evento.

### 5.3 Visibilidad en el Timeline

**Siempre visible:**

El Evento Fundacional es siempre visible en el timeline, sin excepciones.

**No se puede ocultar:**

- No hay mecanismo para ocultar el Evento Fundacional
- No hay filtros que excluyan el Evento Fundacional
- No hay estados que hagan invisible el Evento Fundacional

**Presentación:**

El Evento Fundacional aparece en todas las vistas del timeline:
- Vista cronológica completa (forward)
- Vista cronológica inversa (reverse)
- Vistas filtradas por tipo de evento
- Vistas filtradas por rango de fechas (siempre incluido si está en el rango)

### 5.4 Interacción con Otros Eventos

**Eventos con la misma fecha:**

Si otros eventos tienen la misma fecha de evento que el Evento Fundacional, el Evento Fundacional aparece primero debido a su prioridad de tipo de evento.

**Eventos backdated:**

Si se crean eventos con fechas anteriores a la fecha del Evento Fundacional (backdating), el Evento Fundacional sigue apareciendo primero debido a su prioridad de tipo de evento.

**Nota importante:** En la práctica, la fecha del Evento Fundacional (fecha de creación del ClinicalRecord) es típicamente anterior o igual a cualquier evento clínico, ya que los eventos clínicos requieren que el ClinicalRecord ya exista.

### 5.5 Navegación desde el Evento Fundacional

**Navegación hacia adelante:**

Desde el Evento Fundacional, el usuario puede navegar hacia eventos subsecuentes en el timeline.

**Navegación hacia atrás:**

No hay eventos anteriores al Evento Fundacional, ya que es el primer evento.

**Enlaces a entidades:**

El Evento Fundacional no tiene enlaces a entidades clínicas (Notes, Medications, etc.), ya que no tiene sourceId.

---

## 6. Restricciones Explícitas

### 6.1 No Editable

**Inmutabilidad completa:**

El Evento Fundacional es completamente inmutable una vez creado.

**Atributos inmutables:**

- **event_timestamp:** No puede ser modificado
- **recorded_timestamp:** No puede ser modificado
- **event_type:** No puede ser modificado (siempre "Foundational")
- **title:** No puede ser modificado
- **description:** No puede ser modificado
- **sourceType:** No puede ser modificado
- **sourceId:** No puede ser modificado (siempre null)
- **clinicalRecordId:** No puede ser modificado

**No hay excepciones:**

A diferencia de otros eventos que podrían tener mecanismos de corrección (addenda, versiones), el Evento Fundacional no tiene mecanismos de modificación.

**Justificación:**

El Evento Fundacional representa un hecho histórico: el inicio de la historia clínica documentada. Este hecho no puede cambiar retroactivamente.

### 6.2 No Clínico

**No representa una ocurrencia clínica:**

El Evento Fundacional no representa:
- Un encuentro clínico
- Un cambio de medicación
- Una hospitalización
- Un evento de vida
- Una actualización de historia

**No genera estado clínico:**

El Evento Fundacional no afecta:
- Medicaciones activas
- Historia psiquiátrica actual
- Estado de tratamiento
- Evaluaciones o planes

**No tiene contenido clínico:**

El título y descripción del Evento Fundacional son estándar y definidos por el sistema. No contienen información clínica específica del paciente.

### 6.3 No Genera Estado

**No modifica el estado del sistema:**

El Evento Fundacional es puramente informativo. No:
- Crea medicaciones
- Crea notas
- Modifica historia psiquiátrica
- Cambia estado de tratamiento
- Genera otros eventos

**Es un marcador temporal:**

El Evento Fundacional solo marca el inicio del timeline. No tiene efectos secundarios más allá de su presencia en el timeline.

### 6.4 No Eliminable

**Eliminación prohibida:**

El Evento Fundacional no puede ser eliminado del timeline.

**Justificación:**

- Garantiza que todo ClinicalRecord tenga al menos un evento
- Preserva la integridad histórica del timeline
- Mantiene el punto de origen del timeline

**No hay excepciones:**

Incluso en casos de corrección de datos o migración, el Evento Fundacional no se elimina. Si es necesario corregir información, se crea un nuevo ClinicalRecord (operación no permitida en el MVP, pero conceptualmente).

### 6.5 No Duplicable

**Unicidad garantizada:**

No puede haber múltiples Eventos Fundacionales para el mismo ClinicalRecord.

**Prevención:**

- La creación del Evento Fundacional es idempotente
- Si ya existe un Evento Fundacional, no se crea otro
- El sistema valida la unicidad antes de crear

### 6.6 No Backdateable

**Fecha fija:**

La fecha del Evento Fundacional es la fecha de creación del ClinicalRecord y no puede ser modificada.

**No se permite backdating:**

A diferencia de eventos clínicos que pueden tener fechas en el pasado (backdating), el Evento Fundacional siempre tiene la fecha de creación del ClinicalRecord.

**Justificación:**

El Evento Fundacional marca el inicio de la historia clínica documentada en el sistema, no el inicio de la relación terapéutica en el mundo real. Por lo tanto, su fecha debe reflejar cuándo comenzó la documentación en el sistema.

---

## 7. Consideraciones de UX (Descriptivas)

### 7.1 Presentación Visual

**Apariencia distintiva:**

El Evento Fundacional debe ser visualmente distinguible de los eventos clínicos para comunicar claramente que no es una ocurrencia clínica.

**Indicadores sugeridos:**

- Icono o símbolo distintivo que indique "inicio" o "fundación"
- Estilo visual diferente (por ejemplo, más sutil o con un borde especial)
- Etiqueta o badge que indique "Evento Fundacional" o "Inicio de Historia Clínica"

**No debe confundirse con eventos clínicos:**

La presentación debe evitar que el usuario interprete el Evento Fundacional como un encuentro, medicación, o evento de vida.

### 7.2 Información Mostrada

**Título estándar:**

El título del Evento Fundacional es fijo y definido por el sistema. Ejemplo: "Inicio de Historia Clínica" o "Historia Clínica Iniciada".

**Descripción estándar:**

La descripción es también fija y puede incluir información como: "Este evento marca el inicio formal de la historia clínica documentada del paciente en el sistema."

**Fecha mostrada:**

Se muestra la fecha del evento (fecha de creación del ClinicalRecord).

**No hay detalles adicionales:**

A diferencia de eventos clínicos que pueden tener enlaces a notas o medicaciones, el Evento Fundacional no tiene detalles adicionales para mostrar.

### 7.3 Interacción del Usuario

**Solo lectura:**

El Evento Fundacional es completamente de solo lectura. No hay acciones disponibles:
- No se puede editar
- No se puede eliminar
- No se puede duplicar
- No se puede navegar a entidades relacionadas (no hay entidades relacionadas)

**Click o hover:**

Si el usuario hace click o hover sobre el Evento Fundacional, puede mostrar información contextual explicando qué es y por qué existe, pero no permite modificaciones.

### 7.4 Navegación y Contexto

**Punto de referencia:**

El Evento Fundacional sirve como punto de referencia para navegar el timeline:
- "Desde el inicio" — Navegar desde el Evento Fundacional hacia adelante
- "Hasta el inicio" — Navegar desde cualquier evento hacia el Evento Fundacional

**Contexto temporal:**

El Evento Fundacional proporciona contexto temporal:
- "La historia comenzó el [fecha]"
- "Han pasado X días desde el inicio"
- "Este es el primer evento después del inicio"

### 7.5 Estados Vacíos y Mensajes

**Timeline no vacío:**

Con el Evento Fundacional, el timeline nunca está completamente vacío. Siempre hay al menos un evento.

**Mensajes informativos:**

Si el timeline solo contiene el Evento Fundacional (sin eventos clínicos aún), el sistema puede mostrar un mensaje como: "La historia clínica comenzó el [fecha]. Aún no hay eventos clínicos documentados."

**Guía al usuario:**

El Evento Fundacional puede servir como guía para nuevos usuarios, explicando que este es el punto de inicio y que los eventos clínicos aparecerán después.

### 7.6 Filtros y Búsquedas

**Inclusión en filtros:**

El Evento Fundacional puede ser incluido o excluido de filtros según el contexto:

- **Filtro por tipo de evento:** Si el usuario filtra por "Todos los eventos", el Evento Fundacional se incluye. Si filtra por "Solo encuentros", se excluye.
- **Filtro por rango de fechas:** El Evento Fundacional se incluye si su fecha está dentro del rango.

**Búsqueda de texto:**

El Evento Fundacional puede ser encontrado en búsquedas de texto si el usuario busca términos como "inicio", "fundacional", o el título estándar del evento.

### 7.7 Exportación y Reportes

**Inclusión en exportaciones:**

El Evento Fundacional puede ser incluido o excluido de exportaciones según el propósito:

- **Exportación completa:** Incluye el Evento Fundacional
- **Exportación clínica:** Puede excluir el Evento Fundacional (solo eventos clínicos)

**Reportes:**

En reportes que muestran la historia completa, el Evento Fundacional aparece como el primer elemento, proporcionando contexto temporal.

---

## 8. Casos Fuera de Alcance

### 8.1 Modificación del Evento Fundacional

**Fuera de alcance:**

- Editar la fecha del Evento Fundacional
- Cambiar el título o descripción
- Eliminar el Evento Fundacional
- Duplicar el Evento Fundacional

**Justificación:**

El Evento Fundacional es inmutable por diseño. No hay casos de uso que requieran su modificación.

### 8.2 Evento Fundacional Múltiple

**Fuera de alcance:**

- Crear múltiples Eventos Fundacionales para el mismo ClinicalRecord
- Tener Eventos Fundacionales con diferentes fechas
- Reemplazar un Evento Fundacional con otro

**Justificación:**

La unicidad del Evento Fundacional es una garantía del sistema. No hay casos de uso que requieran múltiples eventos fundacionales.

### 8.3 Evento Fundacional Opcional

**Fuera de alcance:**

- Permitir ClinicalRecords sin Evento Fundacional
- Hacer opcional la creación del Evento Fundacional
- Eliminar el Evento Fundacional en casos especiales

**Justificación:**

El Evento Fundacional es obligatorio. Todo ClinicalRecord debe tener exactamente un Evento Fundacional.

### 8.4 Evento Fundacional con Contenido Clínico

**Fuera de alcance:**

- Permitir que el usuario edite el título o descripción del Evento Fundacional
- Agregar información clínica al Evento Fundacional
- Vincular el Evento Fundacional a una Note o Medication

**Justificación:**

El Evento Fundacional es un marcador del sistema, no un evento clínico. No contiene información clínica específica del paciente.

### 8.5 Evento Fundacional con Fecha Personalizada

**Fuera de alcance:**

- Permitir que el usuario especifique una fecha diferente para el Evento Fundacional
- Backdating del Evento Fundacional a una fecha anterior
- Forward dating del Evento Fundacional a una fecha futura

**Justificación:**

La fecha del Evento Fundacional es la fecha de creación del ClinicalRecord. No hay casos de uso que requieran una fecha diferente.

### 8.6 Evento Fundacional como Evento Clínico

**Fuera de alcance:**

- Tratar el Evento Fundacional como un encuentro clínico
- Incluir el Evento Fundacional en cálculos de estado clínico
- Usar el Evento Fundacional para determinar medicaciones activas o historia actual

**Justificación:**

El Evento Fundacional no es un evento clínico. No genera estado clínico ni afecta el estado del paciente.

### 8.7 Migración de Eventos Fundacionales

**Fuera de alcance:**

- Crear Eventos Fundacionales para ClinicalRecords existentes que no los tienen
- Migrar Eventos Fundacionales desde otros sistemas
- Corregir Eventos Fundacionales creados incorrectamente

**Justificación:**

Estas operaciones son de migración o corrección de datos, fuera del alcance funcional del MVP. Se manejarían como operaciones administrativas especiales, no como funcionalidad del sistema.

### 8.8 Evento Fundacional y Eliminación de ClinicalRecord

**Fuera de alcance:**

- Comportamiento del Evento Fundacional cuando se elimina un ClinicalRecord (operación no permitida en el MVP)
- Cascading delete del Evento Fundacional
- Preservación del Evento Fundacional después de eliminar el ClinicalRecord

**Justificación:**

La eliminación de ClinicalRecords no está permitida en el MVP. Este caso está fuera del alcance funcional.

### 8.9 Evento Fundacional y Duplicación de Pacientes

**Fuera de alcance:**

- Comportamiento del Evento Fundacional al duplicar un paciente
- Copiar el Evento Fundacional a un nuevo ClinicalRecord
- Preservar la fecha original del Evento Fundacional en una duplicación

**Justificación:**

La duplicación de pacientes no está en el alcance del MVP. Este caso está fuera del alcance funcional.

### 8.10 Evento Fundacional y Sincronización

**Fuera de alcance:**

- Sincronización del Evento Fundacional entre dispositivos
- Resolución de conflictos del Evento Fundacional en sistemas multi-usuario
- Replicación del Evento Fundacional en sistemas distribuidos

**Justificación:**

El MVP asume un solo usuario y un solo dispositivo. La sincronización está fuera del alcance.

---

## 9. Invariantes del Timeline

### 9.1 Invariante: Append-Only

**Garantía:**

El timeline solo crece; nunca se reduce.

**Aplicación al Evento Fundacional:**

- El Evento Fundacional se crea una vez y nunca se elimina
- No hay operación que reduzca el timeline eliminando el Evento Fundacional
- El timeline siempre contiene al menos el Evento Fundacional

**Verificación:**

El sistema garantiza que el Evento Fundacional existe y no puede ser eliminado, preservando el invariante append-only.

### 9.2 Invariante: Inmutabilidad

**Garantía:**

Los eventos son inmutables una vez creados.

**Aplicación al Evento Fundacional:**

- Todos los atributos del Evento Fundacional son inmutables
- No hay mecanismo de corrección o modificación
- El Evento Fundacional preserva su estado original permanentemente

**Verificación:**

El sistema no permite ninguna operación de modificación sobre el Evento Fundacional, preservando el invariante de inmutabilidad.

### 9.3 Invariante: Orden Determinista

**Garantía:**

El orden del timeline es determinista y estable.

**Aplicación al Evento Fundacional:**

- El Evento Fundacional siempre aparece en la primera posición
- El orden relativo del Evento Fundacional con respecto a otros eventos es estable
- Múltiples consultas del timeline producen el mismo orden

**Verificación:**

El sistema garantiza que el Evento Fundacional tiene la prioridad de tipo de evento más alta y siempre aparece primero, preservando el invariante de orden determinista.

### 9.4 Invariante: Completitud

**Garantía:**

Todo ClinicalRecord tiene al menos un evento en su timeline.

**Aplicación al Evento Fundacional:**

- Todo ClinicalRecord tiene exactamente un Evento Fundacional
- El Evento Fundacional garantiza que el timeline nunca está vacío
- No hay ClinicalRecords sin eventos

**Verificación:**

El sistema garantiza que la creación del ClinicalRecord siempre crea el Evento Fundacional, preservando el invariante de completitud.

---

## 10. Resumen

### 10.1 Características Clave

El Evento Fundacional de Timeline es:

1. **Obligatorio** — Todo ClinicalRecord tiene exactamente un Evento Fundacional
2. **Inmutable** — Una vez creado, no puede ser modificado ni eliminado
3. **No clínico** — No representa una ocurrencia clínica ni genera estado clínico
4. **Primero** — Siempre ocupa la primera posición en el timeline
5. **Automático** — Se crea automáticamente con el ClinicalRecord
6. **Sistema** — Generado por el sistema, no por el usuario

### 10.2 Propósito Funcional

El Evento Fundacional:

- Marca el inicio formal de la historia clínica documentada
- Proporciona un punto de referencia temporal absoluto
- Garantiza que el timeline nunca está vacío
- Establece el contexto inicial para la navegación del timeline

### 10.3 Restricciones Fundamentales

El Evento Fundacional:

- **NO** es editable
- **NO** es eliminable
- **NO** es clínico
- **NO** genera estado
- **NO** tiene fuente clínica
- **NO** puede ser duplicado

### 10.4 Consistencia con Documentos Existentes

Esta especificación es consistente con:

- **01_specs.md** — No introduce nuevas entidades clínicas
- **03_timeline.md** — Respeta las reglas de ordenamiento e inmutabilidad
- **13_timeline_engine.md** — Sigue los invariantes del Timeline Engine
- **18_patient_crud_specs.md** — Mantiene la separación entre dominio administrativo (Patient) y dominio clínico (ClinicalRecord)

El Evento Fundacional no viola ningún invariante existente y se integra naturalmente con el sistema de timeline actual.

---

*Versión del Documento: 1.0*  
*Estado: Final*  
*Depende De: 01_specs.md, 03_timeline.md, 13_timeline_engine.md, 18_patient_crud_specs.md*  
*Consumido Por: Backend Implementation, Timeline Engine Implementation, UX Implementation, QA Testing*


---

## 21_evento_encuentro_nota_clinica.md

# Sistema de Registros Médicos Psiquiátricos — Especificación Funcional: Separación Evento de Encuentro / Nota Clínica

## Overview

Este documento define formalmente la separación conceptual y funcional entre:
- **Evento de Encuentro** (ClinicalEvent de tipo Encounter)
- **Documento Nota Clínica** (Note)

Esta especificación preserva la lógica clínica y la integridad legal del sistema, estableciendo límites claros que previenen confusiones en la presentación y manipulación de datos clínicos.

---

## 1. Definición de Evento de Encuentro

### 1.1 Qué es un Evento de Encuentro

Un **Evento de Encuentro** es una ocurrencia clínicamente significativa que representa que tuvo lugar una interacción directa entre el clínico y el paciente.

**Características esenciales:**

- Es una instancia de `ClinicalEvent` con `eventType = Encounter`
- Representa el **hecho** de que ocurrió un encuentro clínico
- Aparece en la Timeline del paciente
- Es inmutable desde el momento de su creación
- Tiene una fecha de ocurrencia clínica (`eventDate`) que representa cuándo ocurrió el encuentro
- Tiene una fecha de registro (`recordedAt`) que representa cuándo fue documentado en el sistema

### 1.2 Atributos del Evento de Encuentro

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación del evento | Inmutable |
| **eventDate** | Fecha | Fecha en que ocurrió el encuentro clínico | Inmutable |
| **eventType** | Enumeration | Siempre "Encounter" | Inmutable |
| **title** | Texto | Resumen breve del encuentro | Inmutable |
| **description** | Texto (opcional) | Descripción detallada del encuentro | Inmutable |
| **recordedAt** | Timestamp | Cuándo fue documentado el evento | Inmutable |
| **sourceType** | Enumeration | Siempre "Note" | Inmutable |
| **sourceId** | Identificador | Referencia a la Nota que lo generó | Inmutable |

### 1.3 Propósito Clínico del Evento de Encuentro

El Evento de Encuentro existe para:

1. **Marcar temporalmente el encuentro** — Establece cuándo ocurrió la interacción clínica en la historia del paciente
2. **Aparecer en la Timeline** — Proporciona un punto de referencia cronológico en la narrativa longitudinal
3. **Preservar el hecho histórico** — Garantiza que el hecho de que ocurrió un encuentro no puede ser eliminado
4. **Permitir navegación temporal** — Facilita la ubicación de encuentros en el tiempo

### 1.4 Lo que NO es un Evento de Encuentro

- **NO es el documento clínico** — No contiene la documentación clínica (subjetivo, objetivo, evaluación, plan)
- **NO es editable** — Una vez creado, no puede modificarse
- **NO aparece en estado Draft** — Solo existe cuando una Nota es finalizada
- **NO puede eliminarse** — Es permanente en la Timeline

---

## 2. Definición de Nota Clínica

### 2.1 Qué es una Nota Clínica

Una **Nota Clínica** es el documento que contiene la documentación estructurada de un encuentro entre el clínico y el paciente.

**Características esenciales:**

- Es una instancia de la entidad `Note`
- Contiene el contenido clínico del encuentro (subjetivo, objetivo, evaluación, plan)
- Puede existir en estado **Draft** (borrador) o **Finalized** (finalizada)
- Solo las Notas finalizadas generan un Evento de Encuentro
- Una vez finalizada, la Nota es inmutable en su contenido
- Puede tener Addenda (anexos) para correcciones o ampliaciones

### 2.2 Atributos de la Nota Clínica

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación de la nota | Inmutable |
| **encounterDate** | Fecha | Fecha en que ocurrió el encuentro | Inmutable (una vez finalizada) |
| **encounterType** | Enumeration | Tipo de encuentro (evaluación inicial, seguimiento, etc.) | Inmutable (una vez finalizada) |
| **status** | Enumeration | Draft o Finalized | Solo transición Draft → Finalized |
| **subjective** | Texto (opcional) | Observaciones subjetivas del paciente | Inmutable (una vez finalizada) |
| **objective** | Texto (opcional) | Hallazgos objetivos del clínico | Inmutable (una vez finalizada) |
| **assessment** | Texto (opcional) | Evaluación clínica e interpretación | Inmutable (una vez finalizada) |
| **plan** | Texto (opcional) | Plan de tratamiento y próximos pasos | Inmutable (una vez finalizada) |
| **createdAt** | Timestamp | Cuándo fue creada la nota | Inmutable |
| **finalizedAt** | Timestamp (opcional) | Cuándo fue finalizada la nota | Inmutable (una vez establecido) |

### 2.3 Propósito Clínico de la Nota Clínica

La Nota Clínica existe para:

1. **Documentar el contenido clínico** — Captura las observaciones, hallazgos, evaluaciones y planes del encuentro
2. **Preservar el razonamiento clínico** — Mantiene registro de qué pensó el clínico en el momento del encuentro
3. **Cumplir requisitos legales** — Proporciona documentación médica completa y estructurada
4. **Permitir revisión histórica** — Facilita la comprensión de decisiones clínicas pasadas
5. **Soportar trabajo en progreso** — Permite documentación en borrador antes de finalizar

### 2.4 Lo que NO es una Nota Clínica

- **NO es el evento en la Timeline** — La Nota no aparece directamente en la Timeline
- **NO es necesariamente visible en la Timeline** — Solo las Notas finalizadas generan eventos visibles
- **NO puede modificarse después de finalizar** — El contenido es inmutable (excepto mediante Addenda)
- **NO puede eliminarse una vez finalizada** — Es parte permanente del registro clínico

---

## 3. Relación entre Evento de Encuentro y Nota Clínica

### 3.1 Relación de Generación

**Regla fundamental:**

Una Nota Clínica **finalizada** genera exactamente **un** Evento de Encuentro.

**Dirección de la relación:**

```
Nota Clínica (finalizada) → genera → Evento de Encuentro
```

**Cardinalidad:**

- Una Nota finalizada genera exactamente 1 Evento de Encuentro
- Un Evento de Encuentro referencia exactamente 1 Nota
- Una Nota en estado Draft NO genera Evento de Encuentro

### 3.2 Momento de Generación

El Evento de Encuentro se crea **en el momento exacto** en que una Nota Clínica transiciona de estado `Draft` a estado `Finalized`.

**Secuencia temporal:**

1. Nota existe en estado `Draft` → **NO hay Evento de Encuentro**
2. Clínico finaliza la Nota → Transición `Draft` → `Finalized`
3. Sistema crea automáticamente el Evento de Encuentro
4. Evento de Encuentro aparece en la Timeline

### 3.3 Sincronización de Datos

| Dato | Fuente | Destino | Regla |
|------|--------|---------|-------|
| **Fecha del encuentro** | `Note.encounterDate` | `ClinicalEvent.eventDate` | Copia exacta al momento de finalización |
| **Tipo de encuentro** | `Note.encounterType` | `ClinicalEvent.title` | Transformado en título descriptivo |
| **Referencia** | `Note.id` | `ClinicalEvent.noteId` | Establecida al crear el evento |
| **Tipo de fuente** | N/A | `ClinicalEvent.sourceType` | Siempre "Note" |

### 3.4 Independencia Después de la Creación

**Una vez creado el Evento de Encuentro:**

- El Evento de Encuentro es **independiente** de la Nota en términos de inmutabilidad
- Ambos son inmutables, pero por razones diferentes:
  - **Evento de Encuentro**: Inmutable porque representa un hecho histórico
  - **Nota Clínica**: Inmutable porque preserva la documentación legal

**No hay dependencia funcional:**

- El Evento de Encuentro NO depende de la Nota para su existencia en la Timeline
- La Nota NO depende del Evento de Encuentro para su existencia
- Ambos coexisten como entidades relacionadas pero independientes

### 3.5 Relación con Addenda

**Regla importante:**

Los Addenda (anexos) de una Nota **NO generan nuevos Eventos de Encuentro**.

**Razón:**

- El Addendum es una corrección o ampliación del documento original
- El hecho del encuentro ya fue registrado cuando la Nota fue finalizada
- Los Addenda son parte del documento Nota, no eventos separados

**Presentación:**

- Los Addenda se muestran junto con la Nota cuando se accede al Evento de Encuentro
- Los Addenda NO aparecen como eventos separados en la Timeline

---

## 4. Qué Aparece en la Timeline y Por Qué

### 4.1 Qué Aparece en la Timeline

**Aparece en la Timeline:**

- **Eventos de Encuentro** (ClinicalEvent con eventType = Encounter)
- Otros tipos de eventos clínicos (Medication Start, Medication Change, Hospitalization, etc.)

**NO aparece en la Timeline:**

- Notas Clínicas directamente (solo a través de su Evento de Encuentro asociado)
- Notas en estado Draft
- Addenda (se muestran al acceder a la Nota, no como eventos separados)

### 4.2 Por Qué Aparece el Evento de Encuentro

**Razones clínicas:**

1. **Narrativa longitudinal** — La Timeline muestra la secuencia de eventos clínicamente significativos
2. **Navegación temporal** — Permite ubicar encuentros en el tiempo del paciente
3. **Correlación con otros eventos** — Facilita ver encuentros junto con cambios de medicación, hospitalizaciones, etc.
4. **Completitud histórica** — Garantiza que todos los encuentros documentados aparezcan en la Timeline

**Razones de diseño:**

1. **Abstracción unificada** — La Timeline presenta eventos de diferentes fuentes de manera uniforme
2. **Ordenamiento consistente** — Todos los eventos siguen las mismas reglas de ordenamiento
3. **Filtrado y búsqueda** — Permite filtrar por tipo de evento de manera consistente

### 4.3 Por Qué NO Aparece la Nota Directamente

**Razones funcionales:**

1. **La Nota es el documento, no el evento** — La Timeline muestra eventos, no documentos
2. **Estado Draft** — Las Notas en borrador no deben aparecer en la Timeline clínica
3. **Granularidad diferente** — La Timeline opera a nivel de eventos, no de documentos
4. **Acceso indirecto** — La Nota se accede a través del Evento de Encuentro cuando se necesita ver el contenido

### 4.4 Cómo se Accede a la Nota desde la Timeline

**Flujo de acceso:**

1. Usuario ve Evento de Encuentro en la Timeline
2. Usuario selecciona el Evento de Encuentro
3. Sistema muestra detalles del evento (fecha, título, descripción)
4. Sistema proporciona acceso a la Nota Clínica asociada
5. Usuario accede a la Nota para ver contenido completo (subjetivo, objetivo, evaluación, plan, addenda)

**Principio de presentación:**

- La Timeline muestra **qué ocurrió** (eventos)
- La Nota muestra **qué se documentó** (contenido clínico)

---

## 5. Qué Nunca Debe Confundirse

### 5.1 Confusiones Prohibidas

**NUNCA debe confundirse:**

1. **Evento de Encuentro con Nota Clínica**
   - El Evento es el hecho histórico
   - La Nota es el documento clínico
   - Son entidades diferentes con propósitos diferentes

2. **Fecha del evento con fecha de creación de la nota**
   - `eventDate` del Evento = fecha en que ocurrió el encuentro
   - `createdAt` de la Nota = fecha en que se creó el documento
   - Pueden ser diferentes (documentación tardía)

3. **Finalización de Nota con creación de Evento**
   - Finalizar una Nota es una acción del clínico
   - Crear el Evento es una consecuencia automática
   - No son la misma operación

4. **Edición de Nota Draft con modificación de Evento**
   - Editar una Nota Draft no afecta eventos (porque no existe evento aún)
   - Una vez finalizada, la Nota no puede editarse
   - El Evento nunca puede editarse

5. **Addenda con nuevos eventos**
   - Los Addenda son parte de la Nota
   - Los Addenda NO generan nuevos Eventos de Encuentro
   - Los Addenda NO aparecen como eventos separados en la Timeline

### 5.2 Errores de Presentación que Deben Prevenirse

**Errores de UI que esta separación previene:**

1. **Mostrar Notas Draft en la Timeline**
   - ❌ Incorrecto: Mostrar Notas en borrador como si fueran eventos
   - ✅ Correcto: Solo mostrar Eventos de Encuentro de Notas finalizadas

2. **Permitir edición de Notas finalizadas desde la Timeline**
   - ❌ Incorrecto: Mostrar botón "Editar" en Notas finalizadas
   - ✅ Correcto: Mostrar solo "Ver" o "Agregar Addendum"

3. **Mostrar contenido de Nota directamente en la Timeline**
   - ❌ Incorrecto: Mostrar texto completo de subjetivo/objetivo en cada evento
   - ✅ Correcto: Mostrar título y descripción del evento, con acceso a la Nota

4. **Tratar Addenda como eventos separados**
   - ❌ Incorrecto: Mostrar Addenda como eventos independientes en la Timeline
   - ✅ Correcto: Mostrar Addenda dentro del contexto de la Nota

5. **Permitir eliminación de Eventos de Encuentro**
   - ❌ Incorrecto: Botón "Eliminar" en eventos de encuentro
   - ✅ Correcto: Eventos son permanentes, no se pueden eliminar

### 5.3 Garantías de Separación

**El sistema debe garantizar:**

1. **Identidad distinta** — Evento de Encuentro y Nota Clínica tienen identificadores únicos diferentes
2. **Ciclo de vida independiente** — Una vez creado el Evento, su existencia no depende de modificaciones a la Nota
3. **Inmutabilidad independiente** — Cada uno tiene sus propias reglas de inmutabilidad
4. **Presentación diferenciada** — La UI debe distinguir claramente entre evento y documento

---

## 6. Reglas de Inmutabilidad

### 6.1 Inmutabilidad del Evento de Encuentro

**Desde el momento de creación, el Evento de Encuentro es completamente inmutable:**

| Atributo | Inmutabilidad | Razón |
|----------|---------------|-------|
| **id** | Inmutable | Identificador único permanente |
| **eventDate** | Inmutable | Fecha histórica del encuentro no puede cambiar |
| **eventType** | Inmutable | Tipo de evento es parte de la identidad |
| **title** | Inmutable | Título preserva cómo se documentó el evento |
| **description** | Inmutable | Descripción preserva el contexto original |
| **recordedAt** | Inmutable | Timestamp de registro es histórico |
| **sourceType** | Inmutable | Tipo de fuente es parte de la estructura |
| **sourceId** (noteId) | Inmutable | Referencia a la Nota no puede cambiar |

**No hay excepciones a esta inmutabilidad.**

### 6.2 Inmutabilidad de la Nota Clínica

**Estado Draft:**

- **Todas las Notas en estado Draft son mutables**
- Pueden editarse, modificarse o eliminarse libremente
- No tienen restricciones de inmutabilidad

**Estado Finalized:**

- **Una vez finalizada, la Nota Clínica es inmutable en su contenido:**
  - `encounterDate` → Inmutable
  - `encounterType` → Inmutable
  - `subjective` → Inmutable
  - `objective` → Inmutable
  - `assessment` → Inmutable
  - `plan` → Inmutable
  - `finalizedAt` → Inmutable (una vez establecido)

**Mecanismo de corrección:**

- Las correcciones se realizan mediante **Addenda**
- Los Addenda son inmutables desde su creación
- Los Addenda NO modifican el contenido original de la Nota

### 6.3 Relación entre Inmutabilidades

**Principio de independencia:**

- La inmutabilidad del Evento de Encuentro **NO depende** de la inmutabilidad de la Nota
- La inmutabilidad de la Nota **NO depende** de la inmutabilidad del Evento
- Ambas inmutabilidades son **independientes** y se aplican por razones diferentes

**Razones de inmutabilidad:**

| Entidad | Razón de Inmutabilidad |
|---------|----------------------|
| **Evento de Encuentro** | Preserva el hecho histórico de que ocurrió un encuentro |
| **Nota Clínica** | Preserva la documentación legal y el razonamiento clínico |

### 6.4 Transiciones de Estado

**Nota Clínica:**

```
Draft → Finalized (transición única, irreversible)
```

- Una vez `Finalized`, la Nota **NO puede** volver a `Draft`
- Esta transición es **unidireccional** y **permanente**

**Evento de Encuentro:**

```
No existe → Existe (creación única)
```

- El Evento de Encuentro **NO tiene estados**
- Una vez creado, existe permanentemente
- **NO puede eliminarse** ni modificarse

---

## 7. Reglas de Presentación Semántica

### 7.1 Presentación del Evento de Encuentro en la Timeline

**Elementos semánticos que deben aparecer:**

1. **Indicador de tipo** — Debe ser claro que es un "Encuentro" o "Evento de Encuentro"
2. **Fecha del encuentro** — Fecha clínica (eventDate), no fecha de registro
3. **Título descriptivo** — Resumen breve del encuentro
4. **Descripción opcional** — Contexto adicional si está disponible
5. **Indicador de documento asociado** — Señal de que existe una Nota Clínica relacionada

**Elementos que NO deben aparecer:**

1. **Contenido completo de la Nota** — Subjetivo, objetivo, evaluación, plan no deben mostrarse en la Timeline
2. **Estado de la Nota** — No es relevante mostrar si la Nota está finalizada (si hay evento, está finalizada)
3. **Fecha de creación de la Nota** — No debe confundirse con la fecha del encuentro
4. **Addenda** — No deben mostrarse como parte del evento en la Timeline

### 7.2 Presentación de la Nota Clínica al Acceder desde el Evento

**Elementos semánticos que deben aparecer:**

1. **Identificación como documento** — Debe ser claro que es una "Nota Clínica" o "Documento Clínico"
2. **Fecha del encuentro** — Debe coincidir con eventDate del Evento asociado
3. **Tipo de encuentro** — Debe ser visible y claro
4. **Secciones estructuradas** — Subjetivo, Objetivo, Evaluación, Plan claramente diferenciadas
5. **Addenda** — Deben mostrarse como anexos al documento, con sus razones
6. **Fecha de finalización** — Debe ser visible para contexto legal/auditoría

**Elementos que NO deben aparecer:**

1. **Información del Evento de Encuentro** — No debe duplicarse información que ya está en la Timeline
2. **Opciones de edición** — Si la Nota está finalizada, no debe haber opción de editar contenido
3. **Estado Draft** — Si se accede desde un Evento, la Nota siempre está finalizada

### 7.3 Diferenciación Semántica en la UI

**Términos que deben usarse consistentemente:**

| Concepto | Término en UI | Contexto |
|----------|--------------|----------|
| Evento en Timeline | "Encuentro" o "Evento de Encuentro" | Timeline, lista de eventos |
| Documento clínico | "Nota Clínica" o "Nota" | Vista de documento, acceso desde evento |
| Acción de ver documento | "Ver Nota" o "Ver Documento" | Botón/link desde evento |
| Acción de crear | "Crear Nota" o "Documentar Encuentro" | Creación de nueva nota |
| Estado de nota | "Borrador" o "Finalizada" | Solo en contexto de edición de nota |

**Principios de presentación:**

1. **Claridad conceptual** — El usuario debe entender que el evento y el documento son cosas diferentes
2. **Navegación lógica** — Desde evento → documento, no al revés en la Timeline
3. **Jerarquía visual** — El evento es el punto de entrada, el documento es el detalle
4. **Consistencia terminológica** — Usar los mismos términos en toda la aplicación

### 7.4 Indicadores Semánticos (sin especificar UI concreta)

**Para Evento de Encuentro:**

- Debe haber un **indicador visual o textual** que identifique el tipo de evento
- Debe haber un **mecanismo de acceso** al documento Nota asociado
- Debe ser **distinguible** de otros tipos de eventos (medicación, hospitalización, etc.)

**Para Nota Clínica:**

- Debe haber un **indicador** de que es un documento clínico
- Debe haber **separación clara** entre secciones (subjetivo, objetivo, etc.)
- Debe haber **diferenciación visual** entre contenido original y Addenda
- Debe haber un **indicador** de que el documento está finalizado (si aplica)

**Principio general:**

- La presentación debe **reforzar la separación conceptual**, no ocultarla
- El usuario debe poder distinguir entre "el hecho de que ocurrió un encuentro" y "el documento que lo documenta"

---

## 8. Errores que Esta Separación Previene

### 8.1 Errores de Integridad de Datos

**Error 1: Modificación de fecha de encuentro después de finalizar**

- **Sin separación:** Modificar `encounterDate` de una Nota finalizada podría afectar el orden de la Timeline
- **Con separación:** El `eventDate` del Evento es independiente e inmutable, preservando el orden histórico

**Error 2: Eliminación accidental de encuentros**

- **Sin separación:** Eliminar una Nota podría eliminar el registro del encuentro en la Timeline
- **Con separación:** El Evento de Encuentro es independiente y no puede eliminarse, preservando la historia clínica

**Error 3: Duplicación de eventos por re-finalización**

- **Sin separación:** Si una Nota pudiera "re-finalizarse", podría generar múltiples eventos
- **Con separación:** La transición Draft → Finalized es única e irreversible, garantizando un solo evento por Nota

### 8.2 Errores de Presentación

**Error 4: Mostrar borradores como eventos clínicos**

- **Sin separación:** Notas en Draft podrían aparecer en la Timeline como si fueran encuentros reales
- **Con separación:** Solo los Eventos de Encuentro (de Notas finalizadas) aparecen en la Timeline

**Error 5: Confusión entre fecha de encuentro y fecha de documentación**

- **Sin separación:** Podría mostrarse la fecha de creación de la Nota como fecha del encuentro
- **Con separación:** `eventDate` (fecha clínica) y `recordedAt` (fecha de registro) están claramente diferenciados

**Error 6: Edición de contenido clínico desde la Timeline**

- **Sin separación:** Podría permitirse editar Notas finalizadas desde la vista de Timeline
- **Con separación:** La Timeline muestra eventos inmutables; la edición solo es posible en Notas Draft

### 8.3 Errores de Lógica Clínica

**Error 7: Pérdida de contexto histórico**

- **Sin separación:** Modificar una Nota podría cambiar cómo se interpreta un encuentro pasado
- **Con separación:** El Evento preserva el hecho histórico; la Nota preserva la documentación original

**Error 8: Correlación incorrecta de eventos**

- **Sin separación:** Si las fechas de Notas cambian, el orden temporal de la Timeline se corrompe
- **Con separación:** Los `eventDate` inmutables garantizan orden temporal consistente

**Error 9: Documentación incompleta en Timeline**

- **Sin separación:** Notas finalizadas podrían no aparecer en la Timeline si hay errores en la generación de eventos
- **Con separación:** La generación automática de eventos garantiza que toda Nota finalizada tenga su evento correspondiente

### 8.4 Errores de Integridad Legal

**Error 10: Alteración de registros médicos**

- **Sin separación:** Modificar Notas finalizadas podría alterar el registro médico legal
- **Con separación:** La inmutabilidad de Notas finalizadas y Eventos preserva la integridad legal

**Error 11: Falta de trazabilidad**

- **Sin separación:** No habría registro claro de cuándo se documentó un encuentro vs. cuándo ocurrió
- **Con separación:** `eventDate` y `recordedAt` proporcionan trazabilidad completa

**Error 12: Eliminación de evidencia clínica**

- **Sin separación:** Eliminar Notas podría eliminar evidencia de que ocurrió un encuentro
- **Con separación:** Los Eventos de Encuentro son permanentes e independientes de las Notas

### 8.5 Errores de Usabilidad

**Error 13: Confusión sobre qué se está viendo**

- **Sin separación:** El usuario podría no entender si está viendo un evento o un documento
- **Con separación:** La diferenciación semántica clara previene esta confusión

**Error 14: Acciones incorrectas disponibles**

- **Sin separación:** Podrían mostrarse opciones de edición en eventos o eliminar en documentos finalizados
- **Con separación:** Las acciones disponibles son consistentes con la naturaleza inmutable de eventos y documentos finalizados

**Error 15: Navegación inconsistente**

- **Sin separación:** Podría no ser claro cómo acceder desde un evento a su documento o viceversa
- **Con separación:** La relación unidireccional (evento → documento) es clara y consistente

---

## 9. Compatibilidad con Timeline Engine

### 9.1 Integración con el Motor de Timeline

Esta especificación es **compatible** con el Timeline Engine existente:

- **No requiere nuevos tipos de evento** — Usa el tipo `Encounter` existente
- **No modifica reglas de generación** — Respeta el mecanismo de generación automática al finalizar Notas
- **No cambia reglas de ordenamiento** — Los Eventos de Encuentro siguen las mismas reglas de ordenamiento que otros eventos
- **No altera contratos existentes** — Mantiene compatibilidad con los contratos definidos en `14_timeline_contracts.md`

### 9.2 Preservación de Garantías del Timeline Engine

**Garantías que se mantienen:**

1. **Completitud** — Toda Nota finalizada genera exactamente un Evento de Encuentro
2. **Exclusión** — Notas en Draft no aparecen en la Timeline
3. **Inmutabilidad** — Los Eventos de Encuentro son inmutables como todos los eventos
4. **Ordenamiento** — Los Eventos de Encuentro se ordenan según las reglas del Timeline Engine
5. **Determinismo** — El orden de eventos es determinístico y consistente

### 9.3 Uso de Contratos Existentes

**Contratos del Timeline Engine que aplican:**

- **CREATE-EVENT-FROM-NOTE** — Generación de Evento de Encuentro al finalizar Nota
- **IMMUTABLE-EVENT** — Inmutabilidad de todos los atributos del Evento de Encuentro
- **READ-EVENT-SOURCE** — Acceso a la Nota desde el Evento de Encuentro
- **TIMELINE-ORDERING** — Ordenamiento de Eventos de Encuentro en la Timeline

**Esta especificación no modifica estos contratos, solo los clarifica en el contexto de la separación conceptual.**

---

## 10. Resumen Ejecutivo

### 10.1 Separación Fundamental

**Evento de Encuentro:**
- Representa el **hecho** de que ocurrió un encuentro clínico
- Aparece en la Timeline
- Es inmutable desde su creación
- Se genera automáticamente al finalizar una Nota

**Nota Clínica:**
- Contiene la **documentación** del encuentro
- Puede estar en Draft o Finalizada
- Solo las finalizadas generan eventos
- Es inmutable en contenido una vez finalizada

### 10.2 Principios Clave

1. **Un encuentro, dos representaciones** — El hecho (Evento) y el documento (Nota) son entidades distintas
2. **Generación automática** — El Evento se crea cuando la Nota se finaliza
3. **Independencia después de la creación** — Una vez creado, el Evento es independiente
4. **Inmutabilidad por razones diferentes** — Evento preserva historia, Nota preserva documentación legal
5. **Presentación diferenciada** — La UI debe distinguir claramente entre evento y documento

### 10.3 Garantías del Sistema

- **Integridad histórica** — Los encuentros no pueden eliminarse de la Timeline
- **Integridad legal** — La documentación clínica no puede alterarse después de finalizar
- **Consistencia temporal** — Las fechas de encuentros son inmutables y preservan el orden
- **Completitud** — Toda Nota finalizada tiene su Evento correspondiente
- **Claridad conceptual** — La separación previene confusiones en la UI y en el uso del sistema

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Idioma: Español*  
*Depende de: 02_domain.md, 13_timeline_engine.md, 14_timeline_contracts.md*  
*Consumido por: Implementación de UI, Implementación de Backend, QA Testing*


---

## 21_ajuste_dosis_medicamentos.md

# Especificación Funcional: Ajuste de Dosis de Medicamentos

## 1. Propósito

Este documento define el mecanismo funcional para ajustar la dosis de un medicamento existente en el historial farmacológico del paciente, garantizando la preservación completa de la trazabilidad histórica.

**Principio fundamental:** Ajustar dosis NO es editar un registro, es crear una nueva versión.

---

## 2. Definición de Ajuste de Dosis

### 2.1 Concepto

Un **ajuste de dosis** es una modificación de los parámetros posológicos de un medicamento activo que requiere documentación como un nuevo registro vinculado al registro original, preservando el historial completo del tratamiento.

### 2.2 Parámetros Ajustables

Los siguientes parámetros pueden ser modificados mediante un ajuste de dosis:

- **Dosis** (`dosage`): Cantidad numérica del medicamento
- **Unidad de dosis** (`dosageUnit`): Unidad de medida (mg, ml, tabletas, etc.)
- **Frecuencia** (`frequency`): Intervalo de administración (diario, dos veces al día, etc.)
- **Vía de administración** (`route`): Ruta de administración (oral, intramuscular, etc.)

**Nota:** El nombre del medicamento (`drugName`) NO puede ser modificado mediante un ajuste. Un cambio de medicamento constituye una discontinuación y un nuevo inicio.

### 2.3 Características del Ajuste

- **Inmutabilidad del registro original:** El registro del medicamento original nunca se modifica.
- **Creación de nueva versión:** Se crea un nuevo registro de medicamento vinculado al anterior.
- **Preservación histórica:** Ambos registros (original y ajustado) permanecen en el historial.
- **Trazabilidad completa:** La relación entre versiones se mantiene mediante `predecessorId`.

---

## 3. Relación entre Versiones de un Mismo Medicamento

### 3.1 Estructura de Versiones

Las versiones de un medicamento forman una **cadena lineal** donde:

- Cada versión tiene exactamente **un predecesor** (excepto la versión inicial).
- Cada versión puede tener **múltiples sucesores** (en casos de correcciones, aunque no es el caso normal).
- La relación se establece mediante el campo `predecessorId` en el modelo `Medication`.

### 3.2 Cadena de Versiones

```
Medicamento V1 (Inicial)
    ↓ (predecessorId)
Medicamento V2 (Ajuste 1)
    ↓ (predecessorId)
Medicamento V3 (Ajuste 2)
    ↓ (predecessorId)
Medicamento V4 (Ajuste 3)
```

### 3.3 Identificación de Versiones

- **Versión inicial:** `predecessorId = null`
- **Versiones ajustadas:** `predecessorId` contiene el ID del medicamento predecesor
- **Versión activa:** Única versión con `status = Active` y `endDate = null`
- **Versiones históricas:** Versiones con `status = Discontinued` y `endDate` definido

### 3.4 Navegación del Historial

Para reconstruir el historial completo de un medicamento:

1. Partir de cualquier versión (típicamente la activa).
2. Seguir la cadena de `predecessorId` hacia atrás hasta encontrar `predecessorId = null`.
3. Cada versión en la cadena representa un estado del medicamento en un período específico.

---

## 4. Datos Requeridos para el Ajuste

### 4.1 Datos de Entrada Obligatorios

| Campo | Tipo | Descripción | Validación |
|-------|------|-------------|------------|
| `medicationId` | String (UUID) | Identificador del medicamento a ajustar | Debe existir y estar activo |
| `newDosage` | Decimal | Nueva dosis numérica | > 0 |
| `effectiveDate` | Date | Fecha efectiva del ajuste | No puede ser futura, no puede ser anterior a `startDate` del medicamento original |
| `changeReason` | String (opcional) | Razón clínica del ajuste | Si se proporciona, no puede estar vacío |

### 4.2 Datos de Entrada Opcionales

| Campo | Tipo | Descripción | Valor por Defecto |
|-------|------|-------------|-------------------|
| `newDosageUnit` | String | Nueva unidad de dosis | Se mantiene la unidad del medicamento original |
| `newFrequency` | String | Nueva frecuencia | Se mantiene la frecuencia del medicamento original |
| `newRoute` | String | Nueva vía de administración | Se mantiene la vía del medicamento original |

### 4.3 Datos Derivados Automáticamente

Los siguientes datos se derivan automáticamente del medicamento original:

- `drugName`: Se mantiene idéntico al medicamento original
- `prescribingReason`: Se mantiene idéntico al medicamento original
- `clinicalRecordId`: Se mantiene idéntico al medicamento original
- `predecessorId`: Se establece como el ID del medicamento original

---

## 5. Estado Previo y Estado Posterior

### 5.1 Estado Previo (Medicamento Original)

Antes del ajuste, el medicamento original tiene:

```typescript
{
  id: "med-001",
  status: "Active",
  endDate: null,
  dosage: 50.0,
  dosageUnit: "mg",
  frequency: "Una vez al día",
  route: "Oral",
  startDate: "2024-01-15",
  predecessorId: null,  // Es la versión inicial
  discontinuationReason: null
}
```

### 5.2 Proceso de Transición

1. **Descontinuación del original:**
   - `status` → `"Discontinued"`
   - `endDate` → `effectiveDate - 1 día`
   - `discontinuationReason` → `changeReason` o `"Dosage changed"`

2. **Creación de nueva versión:**
   - Nuevo registro con `status = "Active"`
   - `startDate` → `effectiveDate`
   - `predecessorId` → ID del medicamento original
   - Parámetros ajustados según entrada

### 5.3 Estado Posterior (Medicamento Original)

Después del ajuste, el medicamento original queda:

```typescript
{
  id: "med-001",
  status: "Discontinued",
  endDate: "2024-02-14",  // Un día antes de effectiveDate
  dosage: 50.0,  // Inmutable
  dosageUnit: "mg",  // Inmutable
  frequency: "Una vez al día",  // Inmutable
  route: "Oral",  // Inmutable
  startDate: "2024-01-15",  // Inmutable
  predecessorId: null,  // Inmutable
  discontinuationReason: "Dosage changed"
}
```

### 5.4 Estado Posterior (Nueva Versión)

La nueva versión creada tiene:

```typescript
{
  id: "med-002",
  status: "Active",
  endDate: null,
  dosage: 75.0,  // Ajustado
  dosageUnit: "mg",  // Mantenido o ajustado
  frequency: "Una vez al día",  // Mantenido o ajustado
  route: "Oral",  // Mantenido o ajustado
  startDate: "2024-02-15",  // effectiveDate
  predecessorId: "med-001",  // Vinculado al original
  discontinuationReason: null
}
```

### 5.5 Continuidad Temporal

- El medicamento original cubre el período: `[startDate, endDate]`
- La nueva versión cubre el período: `[effectiveDate, ∞)` (hasta el próximo ajuste o discontinuación)
- **No hay solapamiento:** `endDate` del original = `effectiveDate - 1 día`
- **No hay brechas:** `startDate` de la nueva versión = `effectiveDate`

---

## 6. Evento de Timeline Generado

### 6.1 Tipo de Evento

Se genera un evento de tipo `MedicationChange` en el timeline del paciente.

### 6.2 Estructura del Evento

```typescript
{
  id: "event-xxx",
  clinicalRecordId: "record-xxx",
  eventType: "MedicationChange",
  eventDate: effectiveDate,  // Fecha del ajuste
  title: "Sertralina: 50mg → 75mg",  // Formato: "DrugName: oldDosage → newDosage"
  description: changeReason || "Dosage changed",
  sourceType: "Medication",
  sourceId: "med-002",  // ID de la nueva versión
  medicationId: "med-002",
  recordedAt: new Date()  // Timestamp de creación
}
```

### 6.3 Título del Evento

El título se genera automáticamente con el formato:

```
"{drugName}: {oldDosage}{oldUnit} → {newDosage}{newUnit}"
```

**Ejemplos:**
- `"Sertralina: 50mg → 75mg"`
- `"Fluoxetina: 20mg → 40mg"`
- `"Risperidona: 2mg → 3mg"`

Si también cambian otros parámetros (frecuencia, vía), el título puede incluir información adicional según la política de visualización.

### 6.4 Posición en el Timeline

El evento aparece en el timeline ordenado por:

1. `eventDate` (fecha del ajuste)
2. `recordedAt` (timestamp de registro)
3. Prioridad del tipo de evento (`MedicationChange = 3`)
4. `id` del evento (para desempate)

### 6.5 Vinculación con el Medicamento

El evento está vinculado a la **nueva versión** del medicamento mediante:
- `sourceId` = ID de la nueva versión
- `medicationId` = ID de la nueva versión

**Nota:** El evento NO está vinculado al medicamento original, ya que representa el cambio hacia la nueva versión.

---

## 7. Reglas de Consistencia

### 7.1 Una Sola Versión Activa

**Regla R-CONS-1: Unicidad de Versión Activa**

Para un mismo medicamento (mismo `drugName` en el mismo `clinicalRecordId`), solo puede existir **una versión activa** a la vez.

**Validación:**
- Antes de crear una nueva versión activa, se debe verificar que no exista otra versión activa del mismo medicamento.
- Si existe una versión activa, debe ser descontinuada antes de crear la nueva.

**Implementación:**
```typescript
// Verificar que el medicamento original esté activo
if (currentMedication.status !== MedicationStatus.Active) {
  return error("MEDICATION_NOT_ACTIVE");
}

// La transacción garantiza atomicidad
await prisma.$transaction(async (tx) => {
  // Descontinuar original
  await tx.medication.update({
    where: { id: originalId },
    data: { status: "Discontinued", endDate: ... }
  });
  
  // Crear nueva versión activa
  await tx.medication.create({
    data: { status: "Active", ... }
  });
});
```

### 7.2 No Permitir Sobrescritura

**Regla R-CONS-2: Inmutabilidad de Registros**

Ningún registro de medicamento puede ser modificado después de su creación, excepto:
- La transición de `status: Active` → `status: Discontinued` durante un ajuste
- El establecimiento de `endDate` y `discontinuationReason` durante un ajuste

**Campos inmutables:**
- `id`
- `drugName`
- `dosage` (del registro original)
- `dosageUnit` (del registro original)
- `frequency` (del registro original)
- `route` (del registro original)
- `startDate`
- `prescribingReason`
- `predecessorId`
- `createdAt`

**Validación:**
- No se permiten operaciones `UPDATE` directas sobre campos inmutables.
- Solo se permite `UPDATE` para descontinuar durante un ajuste.

### 7.3 No Permitir Ajustes Futuros

**Regla R-CONS-3: Restricción Temporal**

La fecha efectiva del ajuste (`effectiveDate`) no puede ser una fecha futura.

**Validación:**
```typescript
if (effectiveDate > new Date()) {
  return error("INVALID_TIMESTAMP_FUTURE");
}
```

**Justificación clínica:**
- Los ajustes de dosis documentan cambios que ya han ocurrido o están ocurriendo.
- No se puede documentar un ajuste que aún no ha tenido lugar.
- Si se necesita programar un ajuste futuro, debe documentarse como una nota o planificación, no como un ajuste efectivo.

### 7.4 Restricción de Fecha Mínima

**Regla R-CONS-4: Fecha Efectiva Válida**

La fecha efectiva del ajuste no puede ser anterior a la fecha de inicio del medicamento original.

**Validación:**
```typescript
if (effectiveDate < currentMedication.startDate) {
  return error("INVALID_DATE_RANGE");
}
```

**Justificación:**
- Un ajuste no puede ocurrir antes de que el medicamento haya sido iniciado.
- Si se necesita documentar un ajuste retroactivo, debe validarse que la fecha esté dentro del rango válido del medicamento original.

### 7.5 Integridad de la Cadena

**Regla R-CONS-5: Integridad Referencial**

La cadena de versiones debe mantener integridad referencial:

- Si un medicamento tiene `predecessorId`, el predecesor debe existir.
- Si un medicamento es descontinuado por un ajuste, debe tener exactamente un sucesor inmediato.
- No pueden existir "huecos" en la cadena (versiones huérfanas).

**Validación:**
- Las foreign keys en la base de datos garantizan la existencia del predecesor.
- La lógica de negocio garantiza que cada descontinuación por ajuste tenga un sucesor.

---

## 8. Visualización Conceptual del Historial

### 8.1 Representación Lineal del Historial

```
Timeline del Medicamento: Sertralina

┌─────────────────────────────────────────────────────────────┐
│ Versión 1 (Inicial)                                          │
│ ID: med-001                                                  │
│ Período: 2024-01-15 → 2024-02-14                            │
│ Dosis: 50mg, Una vez al día, Oral                           │
│ Estado: Discontinued                                         │
│ Razón: Dosage changed                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ (predecessorId)
┌─────────────────────────────────────────────────────────────┐
│ Versión 2 (Ajuste 1)                                         │
│ ID: med-002                                                  │
│ Período: 2024-02-15 → 2024-03-20                             │
│ Dosis: 75mg, Una vez al día, Oral                            │
│ Estado: Discontinued                                         │
│ Razón: Dosage changed                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓ (predecessorId)
┌─────────────────────────────────────────────────────────────┐
│ Versión 3 (Ajuste 2) - ACTIVA                                │
│ ID: med-003                                                  │
│ Período: 2024-03-21 → presente                               │
│ Dosis: 100mg, Una vez al día, Oral                           │
│ Estado: Active                                               │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Vista de Timeline de Eventos

```
Timeline del Paciente (Eventos)

2024-01-15  [MedicationStart]  Sertralina: 50mg iniciado
                                Razón: Tratamiento de depresión

2024-02-15  [MedicationChange] Sertralina: 50mg → 75mg
                                Razón: Aumento por respuesta subóptima

2024-03-21  [MedicationChange] Sertralina: 75mg → 100mg
                                Razón: Optimización de dosis

2024-04-10  [Encounter]        Consulta de seguimiento
```

### 8.3 Vista de Estado Actual

```
Medicamentos Activos (Estado Actual)

Sertralina
├─ Dosis actual: 100mg
├─ Frecuencia: Una vez al día
├─ Vía: Oral
├─ Iniciado: 2024-01-15
└─ Último ajuste: 2024-03-21 (75mg → 100mg)
```

### 8.4 Vista de Historial Completo

```
Historial de Sertralina

1. 2024-01-15 → 2024-02-14
   Dosis: 50mg, Una vez al día, Oral
   Estado: Discontinued
   Razón de discontinuación: Dosage changed

2. 2024-02-15 → 2024-03-20
   Dosis: 75mg, Una vez al día, Oral
   Estado: Discontinued
   Razón de discontinuación: Dosage changed

3. 2024-03-21 → presente
   Dosis: 100mg, Una vez al día, Oral
   Estado: Active
```

### 8.5 Navegación del Historial

Para navegar el historial:

1. **Desde la versión activa hacia atrás:**
   - Partir de `med-003` (versión activa)
   - Seguir `predecessorId` → `med-002`
   - Seguir `predecessorId` → `med-001`
   - `predecessorId = null` → fin de la cadena

2. **Desde cualquier versión hacia adelante:**
   - Partir de cualquier versión (ej: `med-001`)
   - Buscar en `successors` → `med-002`
   - Buscar en `successors` de `med-002` → `med-003`
   - Continuar hasta encontrar la versión activa

---

## 9. Errores Clínicos que se Evitan con este Modelo

### 9.1 Pérdida de Trazabilidad Histórica

**Error evitado:** Modificar directamente la dosis de un medicamento sin preservar el historial.

**Consecuencia sin el modelo:**
- Imposibilidad de conocer qué dosis tenía el paciente en una fecha histórica específica.
- Pérdida de información sobre la evolución del tratamiento.
- Dificultad para evaluar la efectividad de ajustes previos.

**Protección del modelo:**
- Cada versión preserva su estado completo e inmutable.
- El historial completo está disponible para consulta en cualquier momento.
- La reconstrucción del estado histórico es precisa y completa.

### 9.2 Múltiples Versiones Activas Simultáneas

**Error evitado:** Tener múltiples registros activos del mismo medicamento con diferentes dosis.

**Consecuencia sin el modelo:**
- Confusión sobre cuál es la dosis actual correcta.
- Riesgo de prescripción errónea basada en información inconsistente.
- Imposibilidad de determinar el estado real del tratamiento.

**Protección del modelo:**
- Regla R-CONS-1 garantiza una sola versión activa.
- La transacción atómica previene condiciones de carrera.
- La validación previa bloquea la creación de versiones activas duplicadas.

### 9.3 Sobrescritura de Información Clínica

**Error evitado:** Editar un registro existente, perdiendo la información original.

**Consecuencia sin el modelo:**
- Imposibilidad de auditar cambios realizados.
- Pérdida de evidencia sobre decisiones clínicas previas.
- Violación de principios de integridad de registros médicos.

**Protección del modelo:**
- Regla R-CONS-2 garantiza inmutabilidad de registros.
- Cada cambio se documenta como un nuevo registro.
- El historial completo de cambios es auditable.

### 9.4 Ajustes Retroactivos Incorrectos

**Error evitado:** Documentar ajustes con fechas que violan la lógica temporal.

**Consecuencia sin el modelo:**
- Ajustes documentados antes de que el medicamento fuera iniciado.
- Solapamientos temporales entre versiones.
- Brechas temporales en el historial del tratamiento.

**Protección del modelo:**
- Regla R-CONS-3 previene ajustes futuros.
- Regla R-CONS-4 previene ajustes anteriores al inicio.
- El cálculo automático de `endDate` previene solapamientos y brechas.

### 9.5 Pérdida de Contexto Clínico

**Error evitado:** Ajustar dosis sin documentar la razón clínica.

**Consecuencia sin el modelo:**
- Imposibilidad de entender por qué se realizó un ajuste.
- Dificultad para evaluar la efectividad de decisiones previas.
- Falta de contexto para futuras decisiones clínicas.

**Protección del modelo:**
- El campo `changeReason` documenta la razón del ajuste.
- El evento de timeline incluye la razón en la descripción.
- El historial completo preserva el contexto de cada decisión.

### 9.6 Inconsistencias en el Timeline

**Error evitado:** Eventos de timeline que no reflejan correctamente los cambios de medicamentos.

**Consecuencia sin el modelo:**
- Timeline con información incorrecta o desincronizada.
- Imposibilidad de reconstruir el estado histórico preciso.
- Confusión en la visualización cronológica del tratamiento.

**Protección del modelo:**
- Generación automática de eventos `MedicationChange` durante el ajuste.
- Vinculación correcta entre eventos y versiones de medicamentos.
- Ordenamiento garantizado según reglas de timeline.

### 9.7 Imposibilidad de Corrección de Errores

**Error evitado:** No poder corregir un ajuste documentado incorrectamente.

**Consecuencia sin el modelo:**
- Errores permanentes en el historial.
- Imposibilidad de rectificar documentación incorrecta.
- Compromiso de la integridad del registro clínico.

**Protección del modelo:**
- Aunque no se permite editar, se puede descontinuar una versión errónea.
- Se puede crear una nueva versión con la información correcta.
- El historial preserva tanto el error como la corrección, manteniendo transparencia.

---

## 10. Flujo de Operación Completo

### 10.1 Flujo de Ajuste de Dosis

```
1. Usuario solicita ajuste de dosis
   ↓
2. Sistema valida:
   - medicationId existe
   - Medicamento está activo
   - effectiveDate no es futura
   - effectiveDate >= startDate del original
   - newDosage > 0
   ↓
3. Sistema inicia transacción atómica:
   ↓
4. Sistema descontinúa medicamento original:
   - status → Discontinued
   - endDate → effectiveDate - 1 día
   - discontinuationReason → changeReason
   ↓
5. Sistema crea nueva versión:
   - status → Active
   - startDate → effectiveDate
   - predecessorId → ID del original
   - Parámetros ajustados según entrada
   ↓
6. Sistema confirma transacción
   ↓
7. Sistema genera evento MedicationChange:
   - eventType → MedicationChange
   - eventDate → effectiveDate
   - title → "DrugName: oldDosage → newDosage"
   - description → changeReason
   - sourceId → ID de nueva versión
   ↓
8. Sistema retorna nueva versión del medicamento
```

### 10.2 Validaciones en Detalle

**Validación V1: Existencia del Medicamento**
```typescript
const medication = await findMedication(medicationId);
if (!medication) {
  return error("MEDICATION_NOT_FOUND");
}
```

**Validación V2: Estado Activo**
```typescript
if (medication.status !== "Active") {
  return error("MEDICATION_NOT_ACTIVE");
}
```

**Validación V3: Fecha No Futura**
```typescript
if (effectiveDate > new Date()) {
  return error("INVALID_TIMESTAMP_FUTURE");
}
```

**Validación V4: Fecha Válida**
```typescript
if (effectiveDate < medication.startDate) {
  return error("INVALID_DATE_RANGE");
}
```

**Validación V5: Dosis Positiva**
```typescript
if (newDosage <= 0) {
  return error("INVALID_DOSAGE");
}
```

### 10.3 Transacción Atómica

La operación completa se ejecuta en una transacción atómica para garantizar:

- **Consistencia:** O se completa todo el ajuste, o no se realiza ningún cambio.
- **Integridad:** No puede quedar el medicamento original descontinuado sin una nueva versión activa.
- **Atomicidad:** No puede existir un estado intermedio visible para otros procesos.

---

## 11. Casos de Uso Específicos

### 11.1 Ajuste Simple de Dosis

**Escenario:** Aumentar dosis de 50mg a 75mg el 15 de febrero de 2024.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  newDosage: 75,
  effectiveDate: "2024-02-15",
  changeReason: "Aumento por respuesta subóptima"
}
```

**Resultado:**
- `med-001`: Descontinuado el 14 de febrero de 2024
- `med-002`: Creado, activo desde el 15 de febrero de 2024
- Evento `MedicationChange` generado para el 15 de febrero

### 11.2 Ajuste Múltiple de Parámetros

**Escenario:** Ajustar dosis (50mg → 75mg) y frecuencia (una vez al día → dos veces al día) el 20 de marzo de 2024.

**Entrada:**
```typescript
{
  medicationId: "med-002",
  newDosage: 75,
  newFrequency: "Dos veces al día",
  effectiveDate: "2024-03-20",
  changeReason: "Optimización de régimen posológico"
}
```

**Resultado:**
- `med-002`: Descontinuado el 19 de marzo de 2024
- `med-003`: Creado con dosis 75mg y frecuencia "Dos veces al día", activo desde el 20 de marzo
- Evento `MedicationChange` generado

### 11.3 Ajuste Retroactivo (Válido)

**Escenario:** Documentar un ajuste que ocurrió hace una semana.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  newDosage: 75,
  effectiveDate: "2024-02-08",  // Hace una semana
  changeReason: "Ajuste documentado retroactivamente"
}
```

**Validación:**
- `effectiveDate < new Date()` ✓ (no es futura)
- `effectiveDate >= medication.startDate` ✓ (después del inicio)

**Resultado:**
- Ajuste documentado correctamente con fecha retroactiva
- El evento aparece en el timeline en la fecha correcta (8 de febrero)

### 11.4 Intento de Ajuste Futuro (Rechazado)

**Escenario:** Intentar documentar un ajuste programado para mañana.

**Entrada:**
```typescript
{
  medicationId: "med-001",
  newDosage: 75,
  effectiveDate: "2025-12-31",  // Fecha futura
  changeReason: "Ajuste programado"
}
```

**Resultado:**
- Error: `INVALID_TIMESTAMP_FUTURE`
- No se realiza ningún cambio
- El medicamento original permanece activo

---

## 12. Consideraciones de Implementación

### 12.1 Transacciones de Base de Datos

El ajuste de dosis debe ejecutarse en una transacción atómica para garantizar:

- Descontinuación del original y creación de la nueva versión ocurren juntas.
- No puede existir un estado donde el original esté descontinuado sin sucesor.
- Rollback automático en caso de error en cualquier paso.

### 12.2 Generación de Eventos

El evento `MedicationChange` debe generarse:

- **Después** de la creación exitosa de la nueva versión.
- **Con** la información correcta de la nueva versión.
- **Vinculado** a la nueva versión mediante `sourceId` y `medicationId`.

### 12.3 Consultas de Historial

Para consultar el historial completo de un medicamento:

```typescript
// Obtener versión activa
const active = await findActiveMedication(drugName, clinicalRecordId);

// Navegar hacia atrás
let current = active;
const history = [active];
while (current.predecessorId) {
  current = await findMedication(current.predecessorId);
  history.unshift(current);  // Agregar al inicio para orden cronológico
}
```

### 12.4 Consultas de Estado Histórico

Para determinar qué medicamento estaba activo en una fecha histórica:

```typescript
function getActiveMedicationOnDate(
  drugName: string,
  clinicalRecordId: string,
  targetDate: Date
): Medication | null {
  // Buscar todas las versiones del medicamento
  const versions = await findMedicationVersions(drugName, clinicalRecordId);
  
  // Encontrar la versión activa en targetDate
  return versions.find(med => 
    med.startDate <= targetDate &&
    (med.endDate === null || med.endDate >= targetDate)
  ) || null;
}
```

---

## 13. Resumen de Principios Clave

1. **Inmutabilidad:** Los registros de medicamentos nunca se modifican, solo se descontinúan y se crean nuevas versiones.

2. **Trazabilidad:** Cada versión está vinculada a su predecesor, permitiendo reconstruir el historial completo.

3. **Unicidad Activa:** Solo una versión de un medicamento puede estar activa a la vez.

4. **Temporalidad:** Los ajustes no pueden ser futuros y deben respetar la secuencia temporal del tratamiento.

5. **Eventos Automáticos:** Cada ajuste genera automáticamente un evento en el timeline.

6. **Atomicidad:** El ajuste completo (descontinuación + creación) ocurre en una transacción atómica.

7. **Preservación Histórica:** Todo el historial se preserva para consulta y auditoría.

---

## 14. Referencias

- **Modelo de Datos:** `docs/10_data_models.md` - Sección Medication
- **Dominio:** `docs/02_domain.md` - Sección Medication Entity
- **Contratos de Timeline:** `docs/14_timeline_contracts.md` - WRITE-EVENT-MEDICATION-CHANGE
- **Implementación:** `src/domain/medications/medication-service.ts` - `changeMedication()`

---

**Documento creado:** 2024
**Última actualización:** 2024
**Versión:** 1.0


---

## 22_nota_clinica_evento_note.md

# Sistema de Registros Médicos Psiquiátricos — Especificación Funcional: Nota Clínica y Evento NOTE

## Overview

Este documento define formalmente el modelo funcional de:
- **Nota Clínica** (documento clínico)
- **Evento NOTE** (evento en la timeline)

Esta especificación establece la separación conceptual y funcional entre el documento clínico y su representación en la timeline, garantizando la integridad clínica y legal del sistema.

**Principio central (no negociable):**
- **Encounter NO existe como tipo de evento.**
- Al finalizar una Nota clínica se crea un evento NOTE en la timeline.
- La Nota (documento) y el evento NOTE (timeline) son entidades distintas.

---

## 1. Propósito de la Nota Clínica

### 1.1 Función Clínica

La Nota Clínica es el documento que captura la documentación estructurada de un encuentro entre el clínico y el paciente.

**Propósito fundamental:**

1. **Documentar el contenido clínico** — Registra las observaciones, hallazgos, evaluaciones y planes del encuentro
2. **Preservar el razonamiento clínico** — Mantiene registro de qué pensó el clínico en el momento del encuentro
3. **Cumplir requisitos legales** — Proporciona documentación médica completa y estructurada
4. **Permitir revisión histórica** — Facilita la comprensión de decisiones clínicas pasadas
5. **Soportar trabajo en progreso** — Permite documentación en borrador antes de finalizar

### 1.2 Contexto en el Sistema

La Nota Clínica es la unidad fundamental de documentación clínica en el sistema.

- **Toda interacción clínica documentada** se registra mediante una Nota Clínica
- **La Nota precede al evento** — El evento NOTE solo existe después de que una Nota es finalizada
- **La Nota es el documento fuente** — El evento NOTE referencia a la Nota, no al revés

### 1.3 Relación con Otros Componentes

**Con el Timeline Engine:**
- La Nota finalizada genera un evento NOTE
- El evento NOTE aparece en la timeline del paciente
- La Nota no aparece directamente en la timeline

**Con el ClinicalRecord:**
- La Nota pertenece a un ClinicalRecord
- El ClinicalRecord contiene todas las Notas del paciente
- Las Notas se organizan por fecha de encuentro

**Con Addenda:**
- Los Addenda se adjuntan a Notas finalizadas
- Los Addenda no generan eventos separados
- Los Addenda forman parte del documento Nota

---

## 2. Definición de la Nota como Documento Clínico

### 2.1 Qué es una Nota Clínica

Una **Nota Clínica** es una instancia de la entidad `Note` que contiene la documentación estructurada de un encuentro clínico.

**Características esenciales:**

- Es un **documento clínico** con contenido estructurado
- Puede existir en estado **Draft** (borrador) o **Finalized** (finalizada)
- Solo las Notas finalizadas generan un evento NOTE
- Una vez finalizada, la Nota es inmutable en su contenido
- Puede tener Addenda (anexos) para correcciones o ampliaciones

### 2.2 Atributos de la Nota Clínica

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación de la nota | Inmutable |
| **encounterDate** | Fecha | Fecha en que ocurrió el encuentro | Inmutable (una vez finalizada) |
| **encounterType** | Enumeration | Tipo de encuentro | Inmutable (una vez finalizada) |
| **status** | Enumeration | Draft o Finalized | Solo transición Draft → Finalized |
| **subjective** | Texto (opcional) | Observaciones subjetivas del paciente | Inmutable (una vez finalizada) |
| **objective** | Texto (opcional) | Hallazgos objetivos del clínico | Inmutable (una vez finalizada) |
| **assessment** | Texto (opcional) | Evaluación clínica e interpretación | Inmutable (una vez finalizada) |
| **plan** | Texto (opcional) | Plan de tratamiento y próximos pasos | Inmutable (una vez finalizada) |
| **createdAt** | Timestamp | Cuándo fue creada la nota | Inmutable |
| **finalizedAt** | Timestamp (opcional) | Cuándo fue finalizada la nota | Inmutable (una vez establecido) |

### 2.3 Estados de la Nota Clínica

#### 2.3.1 Estado Draft (Borrador)

**Características:**

- La Nota existe pero **no ha sido finalizada**
- **Todas las Notas en estado Draft son mutables**
- Pueden editarse, modificarse o eliminarse libremente
- **NO generan eventos NOTE**
- **NO aparecen en la timeline**
- No tienen restricciones de inmutabilidad

**Propósito del estado Draft:**

- Permitir documentación en progreso
- Facilitar correcciones antes de finalizar
- Soportar trabajo interrumpido que se retoma más tarde
- Evitar que borradores aparezcan como eventos clínicos

#### 2.3.2 Estado Finalized (Finalizada)

**Características:**

- La Nota ha sido **finalizada por el clínico**
- **Una vez finalizada, la Nota Clínica es inmutable en su contenido**
- Todos los campos de contenido son permanentes
- **Genera automáticamente un evento NOTE** en la timeline
- **NO puede volver a estado Draft**
- Solo puede ser corregida mediante Addenda

**Propósito del estado Finalized:**

- Preservar la documentación legal
- Garantizar integridad clínica
- Permitir que el encuentro aparezca en la timeline
- Establecer el documento como parte del registro permanente

### 2.4 Inmutabilidad de la Nota Clínica

#### 2.4.1 Principio de Inmutabilidad

**Regla fundamental:**

Una vez que una Nota Clínica transiciona a estado `Finalized`, su contenido es **permanentemente inmutable**.

**Razones de inmutabilidad:**

1. **Protección legal** — Los registros médicos pueden ser requeridos en procesos legales. La inmutabilidad asegura que el registro refleje lo que el clínico documentó en el momento.
2. **Integridad clínica** — Las decisiones de tratamiento se basaron en información disponible en un momento dado. Cambios retroactivos oscurecerían el razonamiento clínico.
3. **Confianza** — Los pacientes confían en que sus registros reflejen con precisión su atención. La inmutabilidad es la base de esta confianza mutua.

#### 2.4.2 Campos Inmutables (Estado Finalized)

Una vez finalizada, los siguientes campos son **permanentemente inmutables**:

- `encounterDate` — La fecha del encuentro no puede cambiar
- `encounterType` — El tipo de encuentro no puede cambiar
- `subjective` — Las observaciones subjetivas no pueden modificarse
- `objective` — Los hallazgos objetivos no pueden modificarse
- `assessment` — La evaluación clínica no puede modificarse
- `plan` — El plan de tratamiento no puede modificarse
- `finalizedAt` — La fecha de finalización no puede cambiar

#### 2.4.3 Mecanismo de Corrección: Addenda

**Cuando se requiere corrección:**

Las correcciones se realizan mediante **Addenda**, no mediante modificación del contenido original.

**Características de los Addenda:**

- Se adjuntan a Notas finalizadas
- Son inmutables desde su creación
- NO modifican el contenido original de la Nota
- Contienen el contenido corregido o ampliado
- Incluyen una razón para la corrección
- Se muestran junto con la Nota original

**Principio de transparencia:**

El contenido original y los Addenda se presentan juntos, preservando la transparencia del registro.

### 2.5 Tipos de Encuentro

Los tipos de encuentro definen la naturaleza de la interacción clínica:

| Tipo | Descripción |
|------|-------------|
| **Initial Evaluation** | Primera evaluación del paciente |
| **Follow-up** | Seguimiento de tratamiento en curso |
| **Crisis Intervention** | Intervención en situación de crisis |
| **Medication Review** | Revisión específica de medicación |
| **Therapy Session** | Sesión de terapia |
| **Phone Consultation** | Consulta telefónica |
| **Other** | Otro tipo de encuentro no especificado |

**Regla:** El tipo de encuentro es inmutable una vez finalizada la Nota.

---

## 3. Definición del Evento NOTE

### 3.1 Qué es un Evento NOTE

Un **Evento NOTE** es una instancia de `ClinicalEvent` con `eventType = NOTE` que representa que una Nota Clínica fue finalizada.

**Características esenciales:**

- Es una instancia de `ClinicalEvent` con `eventType = NOTE`
- Representa el **hecho** de que una Nota Clínica fue finalizada
- Aparece en la Timeline del paciente
- Es inmutable desde el momento de su creación
- Tiene una fecha de ocurrencia clínica (`eventDate`) que representa cuándo ocurrió el encuentro
- Tiene una fecha de registro (`recordedAt`) que representa cuándo fue documentado en el sistema
- Referencia a la Nota Clínica que lo generó

### 3.2 Atributos del Evento NOTE

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación del evento | Inmutable |
| **eventDate** | Fecha | Fecha en que ocurrió el encuentro clínico | Inmutable |
| **eventType** | Enumeration | Siempre "NOTE" | Inmutable |
| **title** | Texto | Resumen breve del encuentro | Inmutable |
| **description** | Texto (opcional) | Descripción detallada del encuentro | Inmutable |
| **recordedAt** | Timestamp | Cuándo fue documentado el evento | Inmutable |
| **sourceType** | Enumeration | Siempre "Note" | Inmutable |
| **sourceId** | Identificador | Referencia a la Nota que lo generó | Inmutable |

### 3.3 Propósito Clínico del Evento NOTE

El Evento NOTE existe para:

1. **Marcar temporalmente el encuentro** — Establece cuándo ocurrió la interacción clínica en la historia del paciente
2. **Aparecer en la Timeline** — Proporciona un punto de referencia cronológico en la narrativa longitudinal
3. **Preservar el hecho histórico** — Garantiza que el hecho de que se documentó un encuentro no puede ser eliminado
4. **Permitir navegación temporal** — Facilita la ubicación de encuentros en el tiempo
5. **Correlacionar con otros eventos** — Permite ver encuentros junto con cambios de medicación, hospitalizaciones, etc.

### 3.4 Lo que NO es un Evento NOTE

- **NO es el documento clínico** — No contiene la documentación clínica (subjetivo, objetivo, evaluación, plan)
- **NO es editable** — Una vez creado, no puede modificarse
- **NO aparece en estado Draft** — Solo existe cuando una Nota es finalizada
- **NO puede eliminarse** — Es permanente en la Timeline
- **NO es un tipo de evento "Encounter"** — El tipo de evento es NOTE, no Encounter

### 3.5 Exclusión Explícita: Encounter NO Existe

**Regla fundamental:**

**Encounter NO existe como tipo de evento en el sistema.**

**Implicaciones:**

- No existe `eventType = Encounter`
- No existe "Evento de Encuentro"
- El único tipo de evento relacionado con Notas es `NOTE`
- Cualquier referencia a "Encounter" como tipo de evento es incorrecta

**Razón de la exclusión:**

- La separación conceptual entre documento (Nota) y evento (NOTE) requiere un nombre distinto
- "Encounter" sugiere el encuentro clínico mismo, no la documentación
- "NOTE" refleja que el evento representa la finalización de una Nota Clínica

---

## 4. Relación Nota ↔ Evento NOTE

### 4.1 Relación de Generación

**Regla fundamental:**

Una Nota Clínica **finalizada** genera exactamente **un** Evento NOTE.

**Dirección de la relación:**

```
Nota Clínica (finalizada) → genera → Evento NOTE
```

**Cardinalidad:**

- Una Nota finalizada genera exactamente 1 Evento NOTE
- Un Evento NOTE referencia exactamente 1 Nota
- Una Nota en estado Draft NO genera Evento NOTE

### 4.2 Momento de Generación

El Evento NOTE se crea **en el momento exacto** en que una Nota Clínica transiciona de estado `Draft` a estado `Finalized`.

**Secuencia temporal:**

1. Nota existe en estado `Draft` → **NO hay Evento NOTE**
2. Clínico finaliza la Nota → Transición `Draft` → `Finalized`
3. Sistema crea automáticamente el Evento NOTE
4. Evento NOTE aparece en la Timeline

**Garantía del sistema:**

La generación del evento es **automática e inmediata**. No hay intervención manual requerida.

### 4.3 Sincronización de Datos

| Dato | Fuente | Destino | Regla |
|------|--------|---------|-------|
| **Fecha del encuentro** | `Note.encounterDate` | `ClinicalEvent.eventDate` | Copia exacta al momento de finalización |
| **Tipo de encuentro** | `Note.encounterType` | `ClinicalEvent.title` | Transformado en título descriptivo |
| **Referencia** | `Note.id` | `ClinicalEvent.sourceId` | Establecida al crear el evento |
| **Tipo de fuente** | N/A | `ClinicalEvent.sourceType` | Siempre "Note" |
| **Tipo de evento** | N/A | `ClinicalEvent.eventType` | Siempre "NOTE" |

### 4.4 Independencia Después de la Creación

**Una vez creado el Evento NOTE:**

- El Evento NOTE es **independiente** de la Nota en términos de inmutabilidad
- Ambos son inmutables, pero por razones diferentes:
  - **Evento NOTE**: Inmutable porque representa un hecho histórico
  - **Nota Clínica**: Inmutable porque preserva la documentación legal

**No hay dependencia funcional:**

- El Evento NOTE NO depende de la Nota para su existencia en la Timeline
- La Nota NO depende del Evento NOTE para su existencia
- Ambos coexisten como entidades relacionadas pero independientes

### 4.5 Relación con Addenda

**Regla importante:**

Los Addenda (anexos) de una Nota **NO generan nuevos Eventos NOTE**.

**Razón:**

- El Addendum es una corrección o ampliación del documento original
- El hecho de que la Nota fue finalizada ya fue registrado cuando la Nota fue finalizada
- Los Addenda son parte del documento Nota, no eventos separados

**Presentación:**

- Los Addenda se muestran junto con la Nota cuando se accede al Evento NOTE
- Los Addenda NO aparecen como eventos separados en la Timeline

---

## 5. Flujo Completo

### 5.1 Crear Nota

**Flujo de creación:**

1. **Clínico inicia creación de Nota**
   - Sistema crea nueva instancia de `Note`
   - Estado inicial: `Draft`
   - `createdAt` se establece al momento de creación

2. **Clínico completa campos**
   - `encounterDate` — Fecha del encuentro
   - `encounterType` — Tipo de encuentro
   - `subjective` — Observaciones subjetivas (opcional)
   - `objective` — Hallazgos objetivos (opcional)
   - `assessment` — Evaluación clínica (opcional)
   - `plan` — Plan de tratamiento (opcional)

3. **Nota permanece en estado Draft**
   - Puede ser editada libremente
   - Puede ser guardada y retomada más tarde
   - Puede ser eliminada
   - **NO genera evento NOTE**
   - **NO aparece en timeline**

**Reglas de validación:**

- `encounterDate` es requerido
- `encounterType` es requerido
- `encounterDate` no puede ser una fecha futura
- Al menos una sección de contenido debe tener información (subjetivo, objetivo, evaluación o plan)

### 5.2 Editar Nota

**Edición en estado Draft:**

1. **Clínico accede a Nota en estado Draft**
2. **Clínico modifica cualquier campo**
   - Todos los campos son editables
   - No hay restricciones de inmutabilidad
3. **Cambios se guardan**
   - La Nota permanece en estado `Draft`
   - `createdAt` no cambia
   - **NO se genera evento NOTE**

**Edición en estado Finalized:**

**NO PERMITIDA.**

Una Nota finalizada **NO puede ser editada**.

**Alternativa para correcciones:**

- Usar el mecanismo de Addenda
- Crear un Addendum con la corrección
- El Addendum se adjunta a la Nota finalizada
- El contenido original permanece inalterado

### 5.3 Finalizar Nota

**Flujo de finalización:**

1. **Clínico solicita finalizar la Nota**
   - La Nota debe estar en estado `Draft`
   - Debe cumplir validaciones mínimas

2. **Sistema valida la Nota**
   - `encounterDate` está presente
   - `encounterType` está presente
   - Al menos una sección tiene contenido

3. **Sistema transiciona estado**
   - `status` cambia de `Draft` a `Finalized`
   - `finalizedAt` se establece al momento actual
   - Todos los campos de contenido se vuelven inmutables

4. **Sistema genera Evento NOTE automáticamente**
   - Crea nueva instancia de `ClinicalEvent`
   - `eventType = NOTE`
   - `eventDate = Note.encounterDate`
   - `title` se genera a partir de `encounterType`
   - `sourceType = "Note"`
   - `sourceId = Note.id`
   - `recordedAt` = momento actual

5. **Evento NOTE aparece en Timeline**
   - El evento se ordena según las reglas del Timeline Engine
   - El evento es visible en la timeline del paciente

**Garantías del sistema:**

- La finalización es **irreversible**
- La generación del evento es **automática**
- El evento es **inmutable** desde su creación
- La Nota es **inmutable** desde la finalización

**Validaciones previas a finalización:**

- La Nota debe estar en estado `Draft`
- `encounterDate` no puede ser una fecha futura
- Debe existir contenido clínico (al menos una sección con información)

---

## 6. Generación del Evento NOTE

### 6.1 Momento Exacto

**Momento de generación:**

El Evento NOTE se crea **exactamente en el instante** en que una Nota Clínica transiciona de estado `Draft` a estado `Finalized`.

**No hay retraso:**

- La generación es **síncrona** con la finalización
- No hay procesamiento asíncrono
- No hay cola de eventos pendientes
- El evento existe inmediatamente después de la finalización

**Transacción atómica:**

La finalización de la Nota y la creación del Evento NOTE deben ser **atómicas**:
- Si la finalización falla, no se crea el evento
- Si la creación del evento falla, la finalización se revierte
- No puede existir una Nota finalizada sin su evento NOTE correspondiente

### 6.2 Datos Mínimos del Evento NOTE

**Datos requeridos:**

| Campo | Origen | Regla |
|------|--------|-------|
| **eventType** | Constante | Siempre "NOTE" |
| **eventDate** | `Note.encounterDate` | Copia directa |
| **title** | `Note.encounterType` | Transformado en título descriptivo |
| **sourceType** | Constante | Siempre "Note" |
| **sourceId** | `Note.id` | Referencia a la Nota |
| **recordedAt** | Sistema | Timestamp de creación |

**Datos opcionales:**

| Campo | Origen | Regla |
|------|--------|-------|
| **description** | `Note` | Puede derivarse de resumen de contenido o estar vacío |

**Reglas de transformación:**

**Title (título):**
- Se genera a partir de `encounterType`
- Ejemplos:
  - `Initial Evaluation` → "Evaluación Inicial"
  - `Follow-up` → "Seguimiento"
  - `Crisis Intervention` → "Intervención en Crisis"
  - `Medication Review` → "Revisión de Medicación"
  - `Therapy Session` → "Sesión de Terapia"
  - `Phone Consultation` → "Consulta Telefónica"
  - `Other` → "Encuentro Clínico"

**Description (descripción):**
- Opcional
- Puede estar vacío
- Si se genera, puede ser un resumen breve del contenido de la Nota
- No debe contener el contenido completo de la Nota

### 6.3 Garantías de Generación

**Garantía 1: Unicidad**

Cada Nota finalizada genera exactamente **un** Evento NOTE.

- No se generan múltiples eventos
- No se generan eventos duplicados
- La relación es 1:1

**Garantía 2: Inmutabilidad Inmediata**

El Evento NOTE es **inmutable desde el momento de su creación**.

- No hay período de gracia para edición
- Todos los atributos son permanentes
- No puede ser modificado ni eliminado

**Garantía 3: Trazabilidad**

El Evento NOTE mantiene **referencia permanente** a la Nota que lo generó.

- `sourceId` apunta a la Nota
- `sourceType` identifica el tipo de fuente
- La relación es permanente e inmutable

**Garantía 4: Ordenamiento Correcto**

El Evento NOTE se ordena en la Timeline según las reglas del Timeline Engine.

- `eventDate` determina la posición temporal
- `recordedAt` se usa para desempate
- El evento aparece en su posición cronológica correcta

---

## 7. Comportamiento en la Timeline

### 7.1 Qué Aparece en la Timeline

**Aparece en la Timeline:**

- **Eventos NOTE** (ClinicalEvent con eventType = NOTE)
- Otros tipos de eventos clínicos (Medication Start, Medication Change, Medication Stop, Hospitalization, Life Event, History Update, Other)

**NO aparece en la Timeline:**

- Notas Clínicas directamente (solo a través de su Evento NOTE asociado)
- Notas en estado Draft
- Addenda (se muestran al acceder a la Nota, no como eventos separados)

### 7.2 Por Qué Aparece el Evento NOTE

**Razones clínicas:**

1. **Narrativa longitudinal** — La Timeline muestra la secuencia de eventos clínicamente significativos
2. **Navegación temporal** — Permite ubicar encuentros en el tiempo del paciente
3. **Correlación con otros eventos** — Facilita ver encuentros junto con cambios de medicación, hospitalizaciones, etc.
4. **Completitud histórica** — Garantiza que todos los encuentros documentados aparezcan en la Timeline

**Razones de diseño:**

1. **Abstracción unificada** — La Timeline presenta eventos de diferentes fuentes de manera uniforme
2. **Ordenamiento consistente** — Todos los eventos siguen las mismas reglas de ordenamiento
3. **Filtrado y búsqueda** — Permite filtrar por tipo de evento de manera consistente

### 7.3 Por Qué NO Aparece la Nota Directamente

**Razones funcionales:**

1. **La Nota es el documento, no el evento** — La Timeline muestra eventos, no documentos
2. **Estado Draft** — Las Notas en borrador no deben aparecer en la Timeline clínica
3. **Granularidad diferente** — La Timeline opera a nivel de eventos, no de documentos
4. **Acceso indirecto** — La Nota se accede a través del Evento NOTE cuando se necesita ver el contenido

### 7.4 Cómo se Accede a la Nota desde la Timeline

**Flujo de acceso:**

1. Usuario ve Evento NOTE en la Timeline
2. Usuario selecciona el Evento NOTE
3. Sistema muestra detalles del evento (fecha, título, descripción)
4. Sistema proporciona acceso a la Nota Clínica asociada
5. Usuario accede a la Nota para ver contenido completo (subjetivo, objetivo, evaluación, plan, addenda)

**Principio de presentación:**

- La Timeline muestra **qué ocurrió** (eventos)
- La Nota muestra **qué se documentó** (contenido clínico)

### 7.5 Ordenamiento del Evento NOTE en la Timeline

**Reglas de ordenamiento (según Timeline Engine):**

1. **Ordenamiento primario:** Por `eventDate` (fecha del encuentro)
2. **Ordenamiento secundario:** Por `recordedAt` (fecha de registro)
3. **Ordenamiento terciario:** Por prioridad de tipo de evento
   - Los eventos NOTE tienen prioridad según las reglas del Timeline Engine
4. **Ordenamiento cuaternario:** Por identificador único

**Comportamiento con eventos del mismo día:**

- Si múltiples eventos NOTE ocurren el mismo día, se ordenan por `recordedAt`
- Si comparten `recordedAt`, se ordenan por identificador único
- El orden es determinístico y estable

---

## 8. Reglas Explícitas de Exclusión

### 8.1 Eliminación del Concepto Encounter

**Regla fundamental:**

**Encounter NO existe como tipo de evento en el sistema.**

**Exclusiones específicas:**

1. **No existe `eventType = Encounter`**
   - El único tipo de evento relacionado con Notas es `NOTE`
   - Cualquier referencia a "Encounter" como tipo de evento es incorrecta

2. **No existe "Evento de Encuentro"**
   - El término correcto es "Evento NOTE"
   - No debe usarse "Evento de Encuentro" en documentación, código o UI

3. **No existe generación de "Encounter events"**
   - Las Notas finalizadas generan eventos NOTE, no eventos Encounter
   - Cualquier lógica que genere eventos Encounter es incorrecta

4. **No existe referencia a Encounter en el Timeline Engine**
   - El Timeline Engine no reconoce Encounter como tipo de evento válido
   - Las reglas de ordenamiento no incluyen Encounter

**Razón de la exclusión:**

- La separación conceptual entre documento (Nota) y evento (NOTE) requiere un nombre distinto
- "Encounter" sugiere el encuentro clínico mismo, no la documentación
- "NOTE" refleja que el evento representa la finalización de una Nota Clínica
- Esta distinción previene confusiones entre el hecho clínico y su documentación

### 8.2 Otras Exclusiones

**No se introducen nuevos tipos de evento:**

- Solo se usa el tipo de evento NOTE existente
- No se crean variantes (NOTE_DRAFT, NOTE_FINALIZED, etc.)
- No se crean subtipos de NOTE

**No se modifican invariantes del Timeline Engine:**

- Las reglas de ordenamiento permanecen sin cambios
- Las reglas de inmutabilidad permanecen sin cambios
- Las reglas de generación de eventos permanecen sin cambios (excepto la exclusión de Encounter)

**No se define UI concreta:**

- Esta especificación define semántica, no presentación visual
- No se especifican componentes de UI
- No se especifican layouts o diseños
- Solo se define qué información debe ser accesible y cómo

**No se cambia el schema:**

- Esta especificación no modifica el schema de base de datos
- No se agregan nuevos campos
- No se modifican tipos de datos existentes
- La implementación debe usar el schema existente

---

## 9. Impacto Clínico y Legal

### 9.1 Integridad Clínica

**Preservación del razonamiento clínico:**

- La inmutabilidad de las Notas finalizadas preserva el razonamiento clínico tal como existía en el momento de la documentación
- Los futuros clínicos pueden entender qué información estaba disponible cuando se tomaron decisiones
- La separación entre Nota y evento NOTE garantiza que el hecho histórico (evento) y la documentación (nota) se preservan independientemente

**Trazabilidad temporal:**

- El evento NOTE marca cuándo ocurrió el encuentro (`eventDate`)
- El evento NOTE registra cuándo fue documentado (`recordedAt`)
- Esta dualidad temporal permite reconstruir la secuencia de eventos y documentación

**Correlación con otros eventos:**

- Los eventos NOTE aparecen junto con otros eventos clínicos en la Timeline
- Esto permite correlacionar encuentros con cambios de medicación, hospitalizaciones, etc.
- La narrativa longitudinal se preserva y es accesible

### 9.2 Integridad Legal

**Inmutabilidad del registro médico:**

- Las Notas finalizadas son inmutables, preservando el registro médico legal
- Los eventos NOTE son inmutables, preservando el hecho histórico
- Esta doble inmutabilidad garantiza la integridad del registro para propósitos legales

**Trazabilidad de documentación:**

- `finalizedAt` en la Nota registra cuándo fue finalizada
- `recordedAt` en el evento NOTE registra cuándo fue documentado
- Esta trazabilidad es esencial para auditorías y procesos legales

**Mecanismo de corrección transparente:**

- Los Addenda proporcionan un mecanismo transparente para correcciones
- El contenido original permanece intacto
- Las correcciones son visibles y documentadas
- Esto cumple con requisitos legales de transparencia en registros médicos

**Preservación permanente:**

- Los eventos NOTE no pueden eliminarse
- Las Notas finalizadas no pueden eliminarse
- El registro clínico es permanente e irremovible
- Esto garantiza que la evidencia clínica no puede ser destruida

### 9.3 Cumplimiento Normativo

**Requisitos de documentación:**

- La estructura de la Nota (subjetivo, objetivo, evaluación, plan) cumple con estándares de documentación médica
- La inmutabilidad cumple con requisitos de integridad de registros médicos
- La trazabilidad cumple con requisitos de auditoría

**Transparencia:**

- La separación entre Nota y evento NOTE es transparente
- Los Addenda son visibles y documentados
- No hay modificación oculta de registros

**Accesibilidad:**

- El registro completo es accesible a través de la Nota
- La Timeline proporciona acceso cronológico
- La correlación entre eventos es visible

---

## 10. Casos Fuera de Alcance

### 10.1 Tipos de Evento Adicionales

**Fuera de alcance:**

- Crear nuevos tipos de evento relacionados con Notas
- Crear subtipos de eventos NOTE
- Modificar tipos de evento existentes (excepto la exclusión de Encounter)

### 10.2 Modificaciones al Timeline Engine

**Fuera de alcance:**

- Cambiar las reglas de ordenamiento del Timeline Engine
- Modificar las reglas de inmutabilidad del Timeline Engine
- Alterar los contratos del Timeline Engine
- Cambiar la arquitectura del Timeline Engine

### 10.3 Cambios al Schema

**Fuera de alcance:**

- Modificar el schema de base de datos
- Agregar nuevos campos a las entidades existentes
- Cambiar tipos de datos
- Modificar relaciones entre entidades

### 10.4 Definición de UI

**Fuera de alcance:**

- Especificar componentes de UI concretos
- Definir layouts o diseños visuales
- Especificar flujos de usuario detallados
- Definir estilos o temas visuales

**En alcance (semántica):**

- Qué información debe ser accesible
- Cómo debe relacionarse la información
- Qué acciones deben estar disponibles
- Qué restricciones deben aplicarse

### 10.5 Integraciones Externas

**Fuera de alcance:**

- Integración con sistemas externos
- Importación de Notas desde otros sistemas
- Exportación de Notas a otros formatos
- Sincronización con sistemas externos

### 10.6 Funcionalidades Avanzadas

**Fuera de alcance:**

- Búsqueda de texto completo en Notas
- Análisis de contenido de Notas
- Generación automática de resúmenes
- Sugerencias de contenido basadas en IA

### 10.7 Gestión de Versiones de Notas

**Fuera de alcance:**

- Sistema de versionado de Notas (como en PsychiatricHistory)
- Historial de cambios en Notas Draft
- Comparación de versiones de Notas

**Nota:** Las Notas solo tienen dos estados (Draft y Finalized), no un sistema de versionado.

### 10.8 Colaboración Multi-usuario

**Fuera de alcance:**

- Edición concurrente de Notas
- Bloqueo de Notas en edición
- Notificaciones de cambios
- Resolución de conflictos

---

## 11. Resumen Ejecutivo

### 11.1 Separación Fundamental

**Nota Clínica:**
- Es el **documento** que contiene la documentación estructurada del encuentro
- Puede estar en Draft o Finalizada
- Solo las finalizadas generan eventos NOTE
- Es inmutable en contenido una vez finalizada

**Evento NOTE:**
- Representa el **hecho** de que una Nota Clínica fue finalizada
- Aparece en la Timeline
- Es inmutable desde su creación
- Se genera automáticamente al finalizar una Nota

### 11.2 Principios Clave

1. **Un encuentro, dos representaciones** — El documento (Nota) y el evento (NOTE) son entidades distintas
2. **Generación automática** — El Evento NOTE se crea cuando la Nota se finaliza
3. **Independencia después de la creación** — Una vez creado, el Evento NOTE es independiente
4. **Inmutabilidad por razones diferentes** — Evento preserva historia, Nota preserva documentación legal
5. **Presentación diferenciada** — La UI debe distinguir claramente entre evento y documento
6. **Exclusión de Encounter** — Encounter NO existe como tipo de evento

### 11.3 Garantías del Sistema

- **Integridad histórica** — Los encuentros no pueden eliminarse de la Timeline
- **Integridad legal** — La documentación clínica no puede alterarse después de finalizar
- **Consistencia temporal** — Las fechas de encuentros son inmutables y preservan el orden
- **Completitud** — Toda Nota finalizada tiene su Evento NOTE correspondiente
- **Claridad conceptual** — La separación previene confusiones en la UI y en el uso del sistema
- **Exclusión garantizada** — Encounter no existe como tipo de evento

### 11.4 Flujos Principales

**Crear y Finalizar Nota:**
1. Crear Nota en estado Draft
2. Completar contenido clínico
3. Finalizar Nota (transición irreversible)
4. Sistema genera automáticamente Evento NOTE
5. Evento NOTE aparece en Timeline

**Acceder a Documentación:**
1. Ver Evento NOTE en Timeline
2. Acceder a Nota Clínica asociada
3. Ver contenido completo (subjetivo, objetivo, evaluación, plan, addenda)

**Corregir Nota Finalizada:**
1. Acceder a Nota finalizada
2. Crear Addendum con corrección
3. Addendum se adjunta a Nota
4. No se genera nuevo evento NOTE

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Idioma: Español*  
*Depende de: 02_domain.md, 13_timeline_engine.md, 14_timeline_contracts.md*  
*Consumido por: Implementación de UI, Implementación de Backend, QA Testing*  
*Reemplaza referencias a: Evento de Encuentro / Encounter como tipo de evento*


---

## 23_encounter_appointment_spec.md

# Sistema de Registros Médicos Psiquiátricos — Especificación Funcional: Eventos Encounter de Turnos Agendados

## Overview

Este documento define formalmente el comportamiento funcional de los eventos de tipo **Encounter** asociados a turnos agendados (Appointments) en el sistema de Historias Clínicas Psiquiátricas.

Esta especificación establece las reglas de creación, visibilidad temporal y relación con la timeline clínica para eventos Encounter derivados de turnos, preservando la integridad de la narrativa clínica longitudinal.

**Principio central (no negociable):**
- Los eventos Encounter derivados de turnos SOLO deben mostrarse en la timeline si la fecha del turno ya pasó.
- Los turnos futuros NO forman parte de la timeline clínica.

---

## 1. Propósito del Evento Encounter en el Sistema

### 1.1 Función del Evento Encounter

Un **Evento Encounter** es una instancia de `ClinicalEvent` con `eventType = Encounter` que representa que tuvo lugar un turno agendado.

**Características esenciales:**

- Es una instancia de `ClinicalEvent` con `eventType = Encounter`
- Representa el **hecho** de que ocurrió un turno agendado
- Aparece en la Timeline del paciente **solo si la fecha del turno ya pasó**
- Es inmutable desde el momento de su creación
- Tiene una fecha de ocurrencia clínica (`eventDate`) que representa cuándo ocurrió el turno
- Tiene una fecha de registro (`recordedAt`) que representa cuándo fue documentado en el sistema
- Referencia al Appointment (turno) que lo generó

### 1.2 Diferencia entre Encounter (turno) y NOTE (documentación)

**Separación conceptual fundamental:**

| Aspecto | Evento Encounter (turno) | Evento NOTE (documentación) |
|---------|--------------------------|-----------------------------|
| **Origen** | Appointment (turno agendado) | Note (nota clínica finalizada) |
| **Representa** | El hecho de que ocurrió un turno | El hecho de que se documentó un encuentro |
| **Contenido clínico** | NO contiene contenido clínico | Referencia a Nota que contiene documentación completa |
| **Rol** | Administrativo/temporal | Clínico/documental |
| **Visibilidad temporal** | Solo si fecha del turno ya pasó | Solo si Nota fue finalizada |
| **Relación con documentación** | Puede existir sin Nota asociada | Requiere Nota finalizada |

**Principio de separación:**

- **Encounter** representa **planificación ejecutada** (el turno ocurrió)
- **NOTE** representa **documentación clínica** (el encuentro fue documentado)
- Un turno puede ocurrir sin generar documentación (Nota)
- Una Nota puede documentar un encuentro que no fue agendado previamente

### 1.3 Rol Administrativo vs Clínico

**Rol administrativo del Encounter:**

- Marca temporalmente que un turno agendado tuvo lugar
- Proporciona referencia cronológica en la timeline
- Permite correlacionar turnos con otros eventos clínicos
- NO contiene información clínica (observaciones, evaluaciones, planes)

**Rol clínico del NOTE:**

- Representa documentación clínica estructurada
- Contiene contenido clínico (subjetivo, objetivo, evaluación, plan)
- Es el registro médico legal del encuentro
- Preserva el razonamiento clínico del momento

**Separación de responsabilidades:**

- El Encounter responde: "¿Cuándo ocurrió el turno?"
- El NOTE responde: "¿Qué se documentó del encuentro?"

---

## 2. Definición del Turno (Appointment)

### 2.1 Qué Representa un Turno

Un **Turno** (Appointment) es una instancia de la entidad `Appointment` que representa una cita agendada entre el clínico y el paciente.

**Características esenciales:**

- Es una entidad administrativa, no clínica
- Representa una **intención** de encuentro futuro o un **registro** de encuentro pasado
- Tiene una fecha programada (`scheduledDate`) que puede estar en el futuro o en el pasado
- Puede tener estado: Scheduled, Completed, Cancelled, NoShow
- NO contiene documentación clínica
- NO genera eventos automáticamente al crearse

### 2.2 Qué NO Representa un Turno

Un Turno **NO representa:**

- **Documentación clínica** — El turno no contiene observaciones, evaluaciones o planes
- **Un encuentro documentado** — El turno puede existir sin Nota asociada
- **Un evento clínico** — El turno en sí no es un evento en la timeline
- **Un hecho ocurrido** — Los turnos futuros son planificación, no hechos
- **Contenido clínico** — El campo `notes` del Appointment es administrativo, no clínico

### 2.3 Relación con el Tiempo (Futuro vs Pasado)

**Turnos futuros:**

- Representan **planificación** de encuentros
- La fecha programada está en el futuro
- **NO generan eventos Encounter**
- **NO aparecen en la timeline**
- Son información administrativa, no clínica

**Turnos pasados:**

- Representan **turnos que ya ocurrieron**
- La fecha programada está en el pasado
- **Pueden generar eventos Encounter** (si se cumplen las condiciones)
- **Pueden aparecer en la timeline** (si se cumplen las condiciones)
- Son hechos ocurridos, no planificación

**Principio temporal:**

- **Futuro = Planificación** → No es parte de la timeline clínica
- **Pasado = Hecho** → Puede ser parte de la timeline clínica

---

## 3. Definición del Evento Encounter

### 3.1 Qué Significa la Existencia de un Evento Encounter

La existencia de un Evento Encounter significa que:

1. **Un turno agendado tuvo lugar** — La fecha programada del turno ya pasó
2. **El turno es un hecho histórico** — No es planificación, es ocurrencia
3. **El evento marca temporalmente el turno** — Establece cuándo ocurrió en la historia del paciente
4. **El evento es parte de la narrativa clínica** — Aparece en la timeline junto con otros eventos

**NO significa:**

- Que el encuentro fue documentado clínicamente (eso requiere un evento NOTE)
- Que el turno fue completado exitosamente (puede haber sido no-show)
- Que existe una Nota asociada (el Encounter puede existir sin Nota)

### 3.2 Información Mínima del Evento Encounter

| Atributo | Tipo | Propósito | Inmutabilidad |
|----------|------|-----------|---------------|
| **id** | Identificador único | Identificación del evento | Inmutable |
| **eventDate** | Fecha | Fecha en que ocurrió el turno (scheduledDate del Appointment) | Inmutable |
| **eventType** | Enumeration | Siempre "Encounter" | Inmutable |
| **title** | Texto | Resumen breve del turno (derivado de appointmentType) | Inmutable |
| **description** | Texto (opcional) | Descripción del turno (puede incluir estado: completed, no-show) | Inmutable |
| **recordedAt** | Timestamp | Cuándo fue documentado el evento | Inmutable |
| **sourceType** | Enumeration | Siempre "Appointment" | Inmutable |
| **sourceId** | Identificador | Referencia al Appointment que lo generó | Inmutable |

**Datos derivados del Appointment:**

- `eventDate` = `Appointment.scheduledDate`
- `title` = Transformación de `Appointment.appointmentType` a texto descriptivo
- `description` = Opcionalmente puede incluir estado del turno (Completed, NoShow) y notas administrativas
- `sourceId` = `Appointment.id`

### 3.3 Qué NO Contiene el Evento Encounter

El Evento Encounter **NO contiene:**

- **Contenido clínico** — No tiene subjetivo, objetivo, evaluación o plan
- **Observaciones del encuentro** — Esas pertenecen a la Nota Clínica
- **Razonamiento clínico** — No documenta decisiones de tratamiento
- **Información de medicación** — No registra cambios de medicación
- **Evaluaciones diagnósticas** — No contiene evaluaciones clínicas

**Principio de contenido:**

- El Encounter es un **marcador temporal** del turno
- El contenido clínico pertenece a la **Nota Clínica** (evento NOTE)

---

## 4. Relación Appointment ↔ Encounter

### 4.1 Cuándo se Crea el Evento Encounter

**Regla fundamental:**

Un Evento Encounter se crea **automáticamente** cuando se cumplen **ambas** condiciones:

1. **La fecha programada del turno ya pasó** — `Appointment.scheduledDate <= fecha actual`
2. **El turno no ha generado un Encounter previamente** — No existe un Evento Encounter con `sourceId = Appointment.id`

**Momento de creación:**

- **Opción A: Creación automática al pasar la fecha** — El sistema verifica periódicamente turnos cuya fecha pasó y crea eventos Encounter
- **Opción B: Creación bajo demanda** — El evento se crea cuando se consulta la timeline y se detecta un turno pasado sin evento asociado

**Garantía del sistema:**

- Cada turno pasado genera **exactamente un** Evento Encounter
- No se generan eventos duplicados
- La creación es automática, no requiere intervención manual

### 4.2 Relación Temporal entre Appointment y Encounter

**Relación temporal:**

```
Appointment.scheduledDate → Evento Encounter.eventDate
```

- La fecha del evento Encounter es **siempre igual** a la fecha programada del turno
- El evento Encounter **no puede tener una fecha diferente** a la del turno
- Si el turno se reprograma (cambia su scheduledDate), el evento Encounter existente mantiene su fecha original (inmutabilidad)

**Principio de inmutabilidad temporal:**

- Una vez creado el Evento Encounter, su `eventDate` es inmutable
- Si un turno se reprograma después de generar el evento, el evento mantiene la fecha original
- Esto preserva la integridad histórica: el evento refleja cuándo el turno realmente ocurrió según la planificación original

### 4.3 Cardinalidad de la Relación

**Cardinalidad:**

- Un Appointment puede generar **exactamente un** Evento Encounter
- Un Evento Encounter referencia **exactamente un** Appointment
- Relación 1:1 entre Appointment y Evento Encounter

**Casos especiales:**

- **Turno cancelado antes de la fecha:** No genera Evento Encounter (el turno no ocurrió)
- **Turno reprogramado antes de la fecha:** El nuevo turno puede generar su propio Encounter cuando pase su fecha
- **Turno sin evento:** Un turno pasado sin evento Encounter indica que aún no se ha procesado (creación pendiente)

---

## 5. Regla de Visibilidad en la Timeline

### 5.1 Condición Exacta para Mostrarse

**Regla de visibilidad:**

Un Evento Encounter aparece en la timeline **solo si** se cumplen **todas** estas condiciones:

1. **El evento Encounter existe** — Fue creado por el sistema
2. **La fecha del evento ya pasó** — `eventDate <= fecha actual`
3. **El evento está asociado a un turno pasado** — `Appointment.scheduledDate <= fecha actual`

**Condición equivalente:**

```
Evento Encounter visible en timeline ⟺ eventDate <= fecha actual
```

**Garantía del sistema:**

- Los eventos Encounter con `eventDate` futura **nunca** aparecen en la timeline
- La timeline solo muestra hechos ocurridos, no eventos futuros

### 5.2 Comportamiento de Turnos Futuros

**Turnos futuros (scheduledDate > fecha actual):**

- **NO generan eventos Encounter** — El sistema no crea eventos para turnos futuros
- **NO aparecen en la timeline** — Los turnos futuros no son parte de la narrativa clínica
- **Son información administrativa** — Existen para planificación, no para documentación histórica

**Principio de separación:**

- **Planificación (futuro)** → No es parte de la timeline
- **Hechos (pasado)** → Es parte de la timeline

### 5.3 Comportamiento de Turnos Pasados

**Turnos pasados (scheduledDate <= fecha actual):**

- **Generan eventos Encounter** — El sistema crea el evento automáticamente
- **Aparecen en la timeline** — Los turnos pasados son hechos históricos
- **Son parte de la narrativa clínica** — Contribuyen a la historia longitudinal del paciente

**Momentos de aparición:**

- **Inmediato:** Si el evento se crea al pasar la fecha, aparece inmediatamente en la timeline
- **Bajo demanda:** Si el evento se crea al consultar la timeline, aparece cuando se consulta

**Independencia del estado del turno:**

- El evento Encounter aparece en la timeline **independientemente** del estado del turno (Completed, NoShow, Cancelled)
- Un turno con estado NoShow puede generar un Encounter si su fecha ya pasó
- Un turno cancelado **antes** de su fecha no genera Encounter
- Un turno cancelado **después** de su fecha puede tener un Encounter (si se creó antes de la cancelación)

---

## 6. Flujo Temporal Completo

### 6.1 Agendar Turno Futuro

**Secuencia temporal:**

1. **Clínico agenda un turno**
   - Se crea Appointment con `scheduledDate` en el futuro
   - Estado inicial: `Scheduled`
   - **NO se crea Evento Encounter**

2. **Turno existe como planificación**
   - El turno es visible en calendario/agenda
   - **NO aparece en timeline**
   - **NO genera eventos**

3. **Sistema mantiene turno como administrativo**
   - El turno es información de planificación
   - No afecta la narrativa clínica
   - No contamina la timeline con eventos futuros

### 6.2 Llegada de la Fecha del Turno

**Secuencia temporal:**

1. **Fecha del turno llega o pasa**
   - `Appointment.scheduledDate <= fecha actual`
   - El turno deja de ser futuro, ahora es pasado

2. **Sistema detecta turno pasado**
   - Verifica si existe Evento Encounter asociado
   - Si no existe, crea el Evento Encounter automáticamente

3. **Evento Encounter se crea**
   - `eventDate = Appointment.scheduledDate`
   - `eventType = Encounter`
   - `sourceId = Appointment.id`
   - `recordedAt = momento actual`

4. **Evento Encounter aparece en timeline**
   - El evento es visible en la timeline del paciente
   - Se ordena según las reglas del Timeline Engine
   - Aparece en su posición cronológica correcta

### 6.3 Visualización en Timeline

**Cuando se consulta la timeline:**

1. **Sistema recupera eventos clínicos**
   - Incluye eventos NOTE, Medication, Hospitalization, etc.
   - **Incluye eventos Encounter** con `eventDate <= fecha actual`

2. **Sistema ordena eventos**
   - Aplica reglas de ordenamiento del Timeline Engine
   - Eventos Encounter se ordenan por `eventDate`, luego `recordedAt`, luego prioridad de tipo

3. **Sistema presenta timeline**
   - Muestra eventos en orden cronológico
   - Eventos Encounter aparecen en su posición temporal
   - **NO muestra eventos Encounter futuros** (no existen)

**Presentación del evento Encounter:**

- Muestra fecha del turno (`eventDate`)
- Muestra tipo de turno (derivado de `appointmentType`)
- Muestra estado del turno si es relevante (Completed, NoShow)
- Proporciona acceso al Appointment asociado (opcional)

### 6.4 Casos sin Nota Asociada

**Escenario: Turno pasado sin Nota Clínica**

1. **Turno ocurre** (fecha pasa)
2. **Sistema crea Evento Encounter** (automáticamente)
3. **Evento Encounter aparece en timeline**
4. **NO existe Nota Clínica asociada**
5. **NO existe Evento NOTE**

**Implicaciones:**

- El Encounter marca que el turno ocurrió
- La timeline muestra que hubo un turno en esa fecha
- No hay documentación clínica del encuentro
- El Encounter puede existir independientemente de la Nota

**Escenario: Turno pasado con Nota Clínica posterior**

1. **Turno ocurre** (fecha pasa)
2. **Sistema crea Evento Encounter**
3. **Clínico crea Nota Clínica** (días después, con `encounterDate` = fecha del turno)
4. **Clínico finaliza Nota**
5. **Sistema crea Evento NOTE**

**Resultado en timeline:**

- **Dos eventos en la misma fecha:**
  - Evento Encounter (del turno)
  - Evento NOTE (de la Nota finalizada)
- **Ordenamiento:** Según reglas del Timeline Engine (NOTE tiene prioridad sobre Encounter en mismo día)
- **Ambos eventos son visibles** y referencian el mismo encuentro desde perspectivas diferentes

---

## 7. Reglas Explícitas

### 7.1 Encounter No Sustituye Nota

**Regla fundamental:**

El Evento Encounter **NO sustituye** la necesidad de documentación clínica (Nota Clínica).

**Implicaciones:**

- Un Encounter puede existir sin Nota asociada
- La existencia de un Encounter no implica que el encuentro fue documentado
- La documentación clínica requiere crear y finalizar una Nota
- El Encounter y el NOTE son eventos independientes con propósitos diferentes

**Principio de complementariedad:**

- **Encounter** = "El turno ocurrió"
- **NOTE** = "El encuentro fue documentado"
- Ambos pueden coexistir para el mismo encuentro
- Ninguno sustituye al otro

### 7.2 Encounter No Genera Estado Clínico

**Regla fundamental:**

El Evento Encounter **NO genera** estado clínico en el paciente.

**Implicaciones:**

- El Encounter no modifica medicaciones activas
- El Encounter no actualiza la historia psiquiátrica
- El Encounter no cambia el estado clínico del paciente
- El Encounter es un marcador temporal, no una acción clínica

**Principio de neutralidad clínica:**

- El Encounter es **informativo**, no **transformativo**
- Solo marca que un turno ocurrió
- No tiene efectos clínicos en el estado del paciente

### 7.3 Encounter No Es Editable Históricamente

**Regla fundamental:**

El Evento Encounter es **inmutable** desde el momento de su creación.

**Implicaciones:**

- Una vez creado, el Encounter no puede modificarse
- La fecha del evento (`eventDate`) es permanente
- El título y descripción son inmutables
- La referencia al Appointment es permanente

**Principio de inmutabilidad:**

- El Encounter preserva el hecho histórico tal como fue registrado
- No se permite modificación retroactiva
- Si el turno se reprograma después de generar el evento, el evento mantiene su fecha original

### 7.4 Encounter No Aparece Antes de Ocurrir

**Regla fundamental:**

El Evento Encounter **NO aparece** en la timeline antes de que la fecha del turno pase.

**Implicaciones:**

- Los turnos futuros no generan eventos Encounter
- Los eventos Encounter no se crean para fechas futuras
- La timeline no muestra eventos Encounter con `eventDate` futura
- La planificación no contamina la narrativa clínica

**Principio de temporalidad:**

- **Futuro** = Planificación → No es timeline
- **Pasado** = Hecho → Es timeline
- La timeline solo muestra hechos ocurridos

---

## 8. Impacto en la Narrativa Clínica

### 8.1 Separación entre Planificación y Hechos

**Principio de separación:**

La timeline clínica **solo muestra hechos ocurridos**, no planificación futura.

**Beneficios:**

- **Claridad narrativa** — La timeline cuenta la historia del paciente, no sus planes
- **Integridad temporal** — Los eventos aparecen cuando ocurrieron, no cuando se planificaron
- **Prevención de contaminación** — La planificación no mezcla con la documentación histórica
- **Enfoque clínico** — La timeline se enfoca en lo que pasó, no en lo que pasará

**Implementación:**

- Los turnos futuros existen como información administrativa
- Los turnos pasados generan eventos Encounter que aparecen en la timeline
- La separación es automática basada en la fecha

### 8.2 Prevención de Contaminación de la Timeline

**Problema evitado:**

Sin la regla de visibilidad temporal, la timeline podría mostrar:
- Turnos futuros mezclados con eventos pasados
- Planificación confundida con documentación
- Eventos que aún no ocurrieron apareciendo como hechos

**Solución:**

- **Regla estricta:** Solo eventos con `eventDate <= fecha actual` aparecen en timeline
- **Aplicación automática:** El sistema no crea eventos Encounter para turnos futuros
- **Garantía del sistema:** La timeline solo contiene hechos ocurridos

**Resultado:**

- Timeline limpia y cronológicamente precisa
- Separación clara entre planificación y documentación
- Narrativa clínica enfocada en hechos históricos

---

## 9. Casos Fuera de Alcance

### 9.1 Recordatorios

**Fuera de alcance:**

- Sistema de recordatorios automáticos de turnos
- Notificaciones de turnos próximos
- Alertas de turnos vencidos sin documentación

**Razón:**

- Los recordatorios son funcionalidad administrativa, no clínica
- No afectan la generación o visibilidad de eventos Encounter
- Son responsabilidad de módulos de gestión de turnos, no del Timeline Engine

### 9.2 Confirmaciones

**Fuera de alcance:**

- Confirmación de asistencia a turnos
- Verificación de que el paciente asistió
- Marcado manual de turnos como "confirmados"

**Razón:**

- Las confirmaciones son administrativas
- El Encounter se genera automáticamente cuando la fecha pasa, independientemente de confirmación
- El estado del turno (Completed, NoShow) puede reflejarse en la descripción del evento, pero no afecta su creación

### 9.3 Cancelaciones

**Fuera de alcance:**

- Lógica de cancelación de turnos y su impacto en eventos Encounter
- Cancelación de turnos pasados que ya generaron eventos
- Manejo de turnos cancelados antes de su fecha

**Nota:**

- Los turnos cancelados **antes** de su fecha no generan eventos Encounter (el turno no ocurrió)
- Los turnos cancelados **después** de su fecha pueden tener eventos Encounter si se crearon antes de la cancelación
- La lógica específica de cancelación es responsabilidad del módulo de Appointments, no de esta especificación

### 9.4 Reprogramaciones

**Fuera de alcance:**

- Lógica de reprogramación de turnos
- Manejo de turnos reprogramados después de generar eventos Encounter
- Creación de nuevos eventos para turnos reprogramados

**Nota:**

- Si un turno se reprograma **antes** de su fecha original, el nuevo turno puede generar su propio Encounter cuando pase su nueva fecha
- Si un turno se reprograma **después** de generar un Encounter, el evento mantiene su fecha original (inmutabilidad)
- La lógica específica de reprogramación es responsabilidad del módulo de Appointments

### 9.5 Asistencia / Inasistencia

**Fuera de alcance:**

- Marcado de asistencia o inasistencia a turnos
- Impacto de no-show en la generación de eventos Encounter
- Lógica de seguimiento de inasistencias

**Nota:**

- El estado del turno (Completed, NoShow) puede reflejarse en la descripción del evento Encounter
- El estado no afecta la creación del evento: un turno pasado genera Encounter independientemente de si el paciente asistió
- La lógica específica de asistencia/inasistencia es responsabilidad del módulo de Appointments

---

## 10. Resumen Ejecutivo

### 10.1 Principios Fundamentales

1. **Separación Encounter vs NOTE**
   - Encounter = turno ocurrido (administrativo)
   - NOTE = encuentro documentado (clínico)
   - Son eventos independientes con propósitos diferentes

2. **Visibilidad Temporal Estricta**
   - Solo eventos con `eventDate <= fecha actual` aparecen en timeline
   - Turnos futuros NO generan eventos Encounter
   - La timeline solo muestra hechos ocurridos

3. **Inmutabilidad del Encounter**
   - Una vez creado, el Encounter es inmutable
   - Preserva el hecho histórico tal como fue registrado
   - No se permite modificación retroactiva

4. **Independencia de Documentación**
   - El Encounter puede existir sin Nota asociada
   - El Encounter no sustituye la necesidad de documentación clínica
   - El Encounter y el NOTE son complementarios, no sustitutivos

### 10.2 Garantías del Sistema

- **Integridad temporal** — Los eventos Encounter aparecen solo cuando la fecha del turno ya pasó
- **Separación clara** — Planificación (futuro) no contamina la timeline (pasado)
- **Inmutabilidad** — Los eventos Encounter son permanentes una vez creados
- **Trazabilidad** — Cada Encounter referencia su Appointment fuente
- **Completitud** — Cada turno pasado genera exactamente un Encounter

### 10.3 Flujos Principales

**Agendar Turno Futuro:**
1. Se crea Appointment con fecha futura
2. NO se crea Evento Encounter
3. NO aparece en timeline

**Pasar Fecha del Turno:**
1. Sistema detecta turno pasado
2. Sistema crea Evento Encounter automáticamente
3. Evento Encounter aparece en timeline

**Consultar Timeline:**
1. Sistema recupera eventos con `eventDate <= fecha actual`
2. Incluye eventos Encounter de turnos pasados
3. Excluye eventos Encounter futuros (no existen)
4. Ordena según reglas del Timeline Engine

### 10.4 Reglas No Negociables

1. **Encounter solo para turnos pasados** — Los turnos futuros NO generan eventos Encounter
2. **Timeline solo muestra hechos** — Los eventos futuros NO aparecen en timeline
3. **Encounter no es documentación** — El Encounter NO contiene contenido clínico
4. **Encounter es inmutable** — Una vez creado, el Encounter no puede modificarse
5. **Separación de responsabilidades** — Encounter (turno) y NOTE (documentación) son independientes

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Idioma: Español*  
*Depende de: 02_domain.md, 03_timeline.md, 13_timeline_engine.md, 22_nota_clinica_evento_note.md*  
*Consumido por: Implementación de Timeline Engine, Implementación de Appointment Service, QA Testing*


---

# Timeline

## 03_timeline.md

# Psychiatric Medical Records System — Clinical Timeline

## Overview

The Clinical Timeline is the central organizing structure for longitudinal patient care.

It presents the complete history of a patient's psychiatric treatment as a chronological narrative.

The timeline transforms discrete clinical documentation into a coherent story of patient evolution.

---

## 1. Definition of a Clinical Event

### What Constitutes a Clinical Event

A Clinical Event is any discrete occurrence that holds significance in the patient's psychiatric treatment journey.

Each event represents a moment in time when something clinically meaningful happened.

Events are the atomic units from which the longitudinal narrative is constructed.

### Characteristics of a Clinical Event

**Temporal Anchor**

Every clinical event is anchored to a specific point in time.

The event date represents when the occurrence happened in the patient's life, not when it was documented.

This distinction preserves clinical accuracy when documentation occurs after the fact.

**Clinical Significance**

An event must carry meaning for the patient's care trajectory.

Routine administrative actions do not constitute clinical events.

The clinician's judgment determines what rises to the level of clinical significance.

**Atomicity**

Each event represents one discrete occurrence.

Complex situations that span time are decomposed into their constituent events.

A hospitalization, for example, is recorded as a single event capturing the episode of inpatient care.

**Permanence**

Once a clinical event exists, it cannot be removed from the timeline.

Events may be annotated or contextualized, but the fact of their occurrence is permanent.

This reflects the reality that what happened in a patient's history cannot be undone.

### Event Categories

**Encounter Events**

Direct clinical contact between the clinician and patient.

These events are generated when clinical notes are finalized.

Examples: initial evaluation, follow-up session, crisis intervention.

**Medication Events**

Changes to the patient's pharmacological treatment.

These events mark the start, modification, or discontinuation of medications.

Examples: starting an antidepressant, increasing dosage, stopping a medication due to side effects.

**Hospitalization Events**

Inpatient psychiatric care episodes.

Each hospitalization is recorded as a single event capturing the episode of care.

Examples: psychiatric hospitalization for stabilization, inpatient detoxification.

**Life Events**

Significant occurrences in the patient's life that affect their psychiatric condition.

These events provide context for understanding symptom changes or treatment responses.

Examples: job loss, divorce, death of a family member, relapse of substance use.

**History Update Events**

Revisions to the patient's psychiatric history.

These events mark when new historical information was incorporated into the record.

Examples: disclosure of previously unreported trauma, correction of family history.

---

## 2. Event Generation

### Entities That Generate Clinical Events

Not all domain entities produce timeline events.

Event generation is reserved for entities that represent clinically significant occurrences.

#### Note → Encounter Event

A finalized Note generates exactly one Encounter event.

The event is created at the moment of finalization, not when the note is drafted.

Draft notes do not appear on the timeline.

The event date matches the encounter date recorded in the note.

#### Medication → Medication Events

A Medication generates events at key lifecycle moments.

**Start Event**: Created when a new medication is initiated.

**Change Event**: Created when dosage or frequency is modified (through the new-version mechanism).

**Stop Event**: Created when the medication is discontinued.

Each medication may generate multiple events over its lifecycle.

#### PsychiatricHistory → History Update Event

A new version of the PsychiatricHistory generates a History Update event.

The event captures that the patient's background information was revised.

The initial psychiatric history (version one) does not generate an event; it is considered foundational.

#### Manual Event Entry

The clinician may create events directly for occurrences not captured by other entities.

Hospitalizations at external facilities are recorded this way.

Significant life events are entered manually.

These events stand alone without a linked source entity.

### Entities That Do Not Generate Events

**Patient**: Registration does not appear on the clinical timeline.

**ClinicalRecord**: The container itself has no timeline presence.

**Addendum**: Addenda attach to their parent note's event rather than creating separate events.

**Appointment**: Scheduled appointments do not generate clinical events.

---

## 3. Temporal Ordering Rules

### Primary Ordering Principle

Events are ordered by their clinical occurrence date.

The date something happened in the patient's life determines its position.

This produces a timeline that reflects the patient's lived experience.

### Secondary Ordering Principle

When multiple events share the same occurrence date, they are ordered by recorded date.

The event documented first appears first among same-day events.

This provides deterministic ordering without requiring artificial time precision.

### Tertiary Ordering Principle

When events share both occurrence date and recorded date, they are ordered by event type.

The ordering priority is: Encounter, Medication Start, Medication Change, Medication Stop, Hospitalization, Life Event, History Update, Other.

This ensures encounter documentation appears before related medication changes on the same day.

### Backdated Events

Events may be recorded with occurrence dates in the past.

A hospitalization from the previous month can be documented today.

The event appears at its clinical occurrence date, not its documentation date.

The recorded date is preserved for audit purposes but does not affect timeline position.

### Future Events

The timeline does not display events with future occurrence dates.

Planned future actions (such as intended medication starts) are not timeline events.

An event enters the timeline only when its occurrence date has passed.

### Timeline Direction

The default presentation is reverse chronological order.

The most recent events appear first, allowing quick access to current status.

The clinician may navigate to any point in the timeline.

Forward chronological presentation is available for reviewing the full patient journey.

---

## 4. Editability and Immutability

### The Immutability Principle

Finalized clinical documentation cannot be altered.

What was written at a point in time remains as written.

This preserves the legal validity of the medical record.

### Rationale for Immutability

**Legal Protection**

Medical records may be subpoenaed or audited.

Immutability ensures the record reflects what the clinician documented at the time.

Alterations would undermine the evidentiary value of the documentation.

**Clinical Integrity**

Treatment decisions were made based on information available at a given moment.

Retroactive changes would obscure the clinical reasoning that guided care.

Future clinicians must understand what was known when decisions were made.

**Trust**

Patients trust that their records accurately reflect their care.

The clinician trusts that past documentation remains reliable for reference.

Immutability is the foundation of this mutual trust.

### Exception: Draft Notes

Draft notes exist outside the immutability principle.

A note in draft status has not entered the clinical record timeline.

Drafts may be freely edited or deleted before finalization.

Once finalized, the note becomes immutable and the exception no longer applies.

### What Cannot Be Changed

**Finalized Notes**

All content fields of a finalized note are permanently locked.

Subjective, objective, assessment, and plan sections cannot be modified.

The encounter date and type cannot be changed.

**Clinical Events**

Once generated, an event's core attributes are fixed.

The event date, type, title, and description cannot be altered.

The event cannot be removed from the timeline.

**Addenda**

An addendum is immutable from the moment of creation.

Content and reason cannot be edited after submission.

**Medications After Discontinuation**

A discontinued medication's historical record is frozen.

The start date, original dosage, and discontinuation details are permanent.

### What Can Be Changed

**Draft Notes**

Notes in draft status may be freely edited.

All fields can be modified until finalization.

A draft may be abandoned (deleted) before finalization.

**Active Medications**

An active medication's current status can be updated.

Discontinuation can be recorded at any time.

This is not editing history; it is documenting a new event (the discontinuation).

**Psychiatric History**

The current psychiatric history can be updated.

Updates create a new version rather than modifying the existing one.

Previous versions remain accessible and unchanged.

### The Amendment Mechanism

**Purpose of Addenda**

When information must be added to a finalized note, an addendum is used.

Addenda do not change the original; they supplement it.

The original documentation and all addenda are presented together.

**When to Use Addenda**

Corrections to factual errors in the original note.

Additional information received after finalization.

Clarification of ambiguous documentation.

Follow-up observations related to the original encounter.

**Addendum Visibility**

Addenda are displayed immediately following their parent note.

Each addendum shows its creation date and reason.

The relationship between original and addenda is always clear.

---

## 5. Representing Patient Evolution

### The Patient Story

The timeline tells the story of a patient's psychiatric journey.

Each event is a chapter in an unfolding narrative.

The clinician reads this story to understand where the patient has been and where they are going.

### Phases of Treatment

**Initial Phase**

The timeline begins with the initial evaluation.

The first encounter establishes the baseline.

The psychiatric history provides the backstory.

**Active Treatment Phase**

Regular encounters accumulate.

Medication trials appear as start-change-stop sequences.

Life events provide context for clinical observations.

**Maintenance Phase**

Event frequency may decrease as stability is achieved.

Medication events become infrequent.

Follow-up encounters continue at longer intervals.

**Transitions**

Hospitalizations mark periods of crisis.

Significant life events correlate with symptom changes.

Medication changes respond to evolving clinical needs.

### Reading the Timeline for Patterns

**Medication Response**

The timeline reveals which medications were tried.

Duration of each trial is visible.

Discontinuation reasons explain what did not work.

**Symptom Trajectory**

Encounter notes capture symptom severity over time.

The sequence of assessments shows improvement, stability, or deterioration.

Life events can be correlated with symptom changes.

**Treatment Intensity**

Encounter frequency reflects treatment intensity.

Clustering of events may indicate periods of instability.

Gaps may indicate stable periods or disengagement.

### The Cumulative Record

Every patient begins with an empty timeline.

Each clinical interaction adds to the permanent record.

Over months and years, a comprehensive picture emerges.

The timeline becomes richer and more informative with time.

### Continuity Across Time

The timeline preserves continuity even across gaps in care.

A patient who returns after years away finds their history intact.

The clinician can review the entire journey before resuming care.

No information is lost to time.

### The Living Document

While individual entries are immutable, the timeline itself grows.

New events are continuously appended.

The story is never finished while the patient remains in care.

The timeline is a living document that evolves with the patient.

---

## Timeline Integrity Guarantees

### Completeness

Every finalized clinical action appears on the timeline.

No significant occurrence is omitted.

The timeline is the authoritative source for what happened.

### Accuracy

Event dates reflect clinical reality, not documentation convenience.

Backdated entries are permitted to maintain accuracy.

The recorded date provides transparency about documentation timing.

### Permanence

Events cannot be removed or destroyed.

The timeline only grows; it never shrinks.

Historical integrity is preserved indefinitely.

### Traceability

Each event links to its source entity when applicable.

The clinician can navigate from event to full documentation.

The connection between summary and detail is always available.

---

*Document Version: 1.0*  
*Status: Draft*  
*Sources: 01_specs.md, 02_domain.md*



---

## 13_timeline_engine.md

# Psychiatric Medical Records System — Timeline Engine

## Overview

The Timeline Engine is the conceptual core of the Psychiatric Medical Records System.

It defines the authoritative rules for how clinical events are created, ordered, queried, and protected.

All other system components—persistence, application logic, and future interfaces—consume the Timeline Engine's guarantees.

This document establishes the engine's contracts without prescribing implementation details.

---

## 1. Purpose of the Timeline Engine

### 1.1 Why the Timeline Engine Exists

Psychiatric treatment is inherently longitudinal. A patient's care unfolds over months or years, and clinical decisions depend on understanding patterns across time.

The Timeline Engine exists to provide a single, authoritative source of truth for the chronological history of each patient's psychiatric care.

Without a centralized timeline abstraction, clinical events would be scattered across entities (notes, medications, history versions), requiring each consumer to independently reconstruct temporal order and enforce consistency rules. This fragmentation creates opportunities for inconsistency, ordering ambiguity, and integrity violations.

The Timeline Engine solves this by:

1. **Centralizing temporal logic** — All ordering, sequencing, and chronological reasoning flows through one conceptual layer.
2. **Guaranteeing consistency** — Event creation, ordering, and immutability rules are enforced uniformly.
3. **Abstracting source complexity** — Consumers interact with a unified event stream rather than heterogeneous source entities.
4. **Enabling clinical reasoning** — The clinician can trace treatment evolution, correlate events, and understand the patient's journey as a coherent narrative.

### 1.2 Problems Solved in Psychiatric Practice

**Reconstructing Patient Journeys**

Psychiatric care requires understanding what happened, when, and in what sequence. The Timeline Engine guarantees that all clinically significant occurrences are captured and presented in their correct temporal position.

**Correlating Medications with Outcomes**

Treatment response depends on knowing which medications were active during specific periods. The Timeline Engine provides clear start/change/stop markers that enable temporal correlation.

**Preserving Legal and Clinical Integrity**

Medical records may be audited or subpoenaed. The Timeline Engine enforces immutability rules that ensure documentation cannot be altered retroactively, preserving evidentiary value.

**Handling Backdated Documentation**

Clinical reality often requires documenting events after they occurred—a hospitalization from last month, a medication started by another provider. The Timeline Engine handles backdated entries correctly, placing them at their clinical occurrence date while preserving audit transparency.

**Navigating Extensive Histories**

Long-term patients accumulate years of documentation. The Timeline Engine provides the ordering guarantees that enable efficient navigation and retrieval across large event volumes.

### 1.3 Guarantees to the Rest of the System

The Timeline Engine provides the following guarantees to all consuming components:

| Guarantee | Description |
|-----------|-------------|
| **Deterministic Ordering** | Given the same set of events, the timeline always produces the same order. |
| **Chronological Integrity** | Events are positioned by their clinical occurrence date, not their documentation date. |
| **Append-Only Growth** | The timeline only grows; events cannot be removed or destroyed. |
| **Event Immutability** | Once created, an event's core attributes are fixed. |
| **Source Traceability** | Each event links to its source entity when applicable, enabling navigation to full details. |
| **Completeness** | Every finalized clinical action produces exactly one event on the timeline. |
| **Exclusion Guarantee** | Draft documentation and administrative actions do not appear on the timeline. |

---

## 2. Core Concepts

### 2.1 Timeline

**Definition:**

A Timeline is the complete, ordered sequence of clinical events for a single patient.

**Characteristics:**

- Each patient has exactly one Timeline.
- The Timeline is derived from the patient's ClinicalRecord.
- The Timeline is not stored as a separate entity; it is a projection of clinical events ordered by the engine's rules.
- The Timeline represents the patient's longitudinal clinical narrative.

**Boundaries:**

- The Timeline begins with the first clinical event (typically the initial evaluation encounter).
- The Timeline has no end; it continues to grow as long as the patient receives care.
- The Timeline contains only clinical events—not administrative records, drafts, or appointments.

### 2.2 Clinical Event

**Definition:**

A Clinical Event is a discrete, timestamped occurrence of clinical significance that appears on the patient's Timeline.

**Characteristics:**

- Each event represents one atomic occurrence.
- Events are the fundamental units of the Timeline.
- Events have both a clinical occurrence date and a recorded date.
- Events are immutable once created.
- Events may reference a source entity (Note, Medication, PsychiatricHistory) or stand alone (manual events).

**What Constitutes a Clinical Event:**

- Direct clinical contact (encounters).
- Medication lifecycle changes (start, change, stop).
- Hospitalizations and significant life occurrences.
- Updates to psychiatric background information (version 2+).

**What Does Not Constitute a Clinical Event:**

- Patient registration.
- Demographic updates.
- Draft note creation or editing.
- Appointment scheduling.
- Administrative actions.

### 2.3 Event Source

**Definition:**

An Event Source is the domain entity that generates a clinical event.

**Source Types:**

| Source Type | Generates | Description |
|-------------|-----------|-------------|
| Note | Encounter event | A finalized clinical note produces exactly one Encounter event. |
| Medication | Medication Start, Change, Stop events | A medication produces events at lifecycle transitions. |
| PsychiatricHistory | History Update event | A new version (version 2+) produces one History Update event. |
| Manual | Hospitalization, Life Event, Other | Events without a linked entity are entered directly by the clinician. |

**Source Relationship:**

- Source-generated events maintain a reference to their source entity.
- Manual events have no source entity reference.
- The source relationship enables navigation from timeline event to full documentation.

### 2.4 Event Timestamp vs Recorded Timestamp

**Definition:**

Every clinical event carries two temporal markers that serve distinct purposes.

**Event Timestamp (Clinical Occurrence Date):**

- Represents when the event occurred in the patient's life.
- Determines the event's position on the Timeline.
- May be in the past relative to the recorded timestamp (backdating is permitted).
- Must not be in the future.
- Is the date the clinician specifies (e.g., encounter date, medication start date).

**Recorded Timestamp (Documentation Date):**

- Represents when the event was documented in the system.
- Is system-assigned at the moment of event creation.
- Provides audit transparency for documentation timing.
- Serves as secondary ordering criterion when event timestamps are identical.
- Cannot be modified after creation.

**Example:**

A hospitalization occurred on November 15. The clinician documents it on November 22.

- Event Timestamp: November 15 (the hospitalization date)
- Recorded Timestamp: November 22 (when it was entered into the system)
- Timeline Position: November 15 (based on event timestamp)

### 2.5 Historical Record

**Definition:**

A Historical Record is the complete, immutable documentation preserved at the point of creation.

**Scope:**

The Historical Record encompasses all finalized clinical documentation:

- Finalized Notes (with their addenda).
- Medication entries (from creation through discontinuation).
- PsychiatricHistory versions (each version as it was created).
- Clinical Events (as they were generated).

**Principle:**

The Historical Record reflects what was documented at each point in time. It cannot be retroactively altered to reflect current knowledge or preferences.

**Purpose:**

- Preserves clinical reasoning as it existed when decisions were made.
- Maintains legal evidentiary value.
- Enables future clinicians to understand the information available at each moment.
- Protects the integrity of the longitudinal narrative.

### 2.6 Correction vs Deletion

**Correction:**

A Correction is the documented amendment of previously recorded information without altering the original.

Corrections are achieved through:

- **Addenda** (for finalized Notes): Supplementary text attached to the original note explaining the correction.
- **Versioning** (for PsychiatricHistory): A new version containing corrected information, with previous versions retained.
- **Discontinuation with explanation** (for Medications): Ending the erroneous entry with an explanatory reason and creating a new correct entry if applicable.

Corrections preserve the original record while adding clarifying or correcting information. The correction mechanism makes the amendment transparent.

**Deletion:**

Deletion is the removal of clinical information from the record.

**Deletion is not supported for clinical data.**

The only exception is draft Notes, which may be deleted before finalization because they have not yet entered the clinical record.

| Concept | Definition |
|---------|------------|
| Correction | Adding amendment information while preserving the original |
| Deletion | Removing information from existence (prohibited for clinical data) |

---

## 3. Event Types

The Timeline Engine recognizes the following categories of clinical events. These are domain events representing clinically significant occurrences—not user interface actions or system operations.

### 3.1 Encounter

**Meaning:**

A direct clinical interaction between the clinician and patient has been documented.

**Generated By:**

Finalization of a Note entity.

**When Created:**

At the moment a Note transitions from draft to finalized status.

**Event Date Source:**

The encounter date recorded in the Note.

**Clinical Significance:**

Represents the core of psychiatric care—the therapeutic encounter itself.

### 3.2 Medication Start

**Meaning:**

A medication has been initiated for the patient.

**Generated By:**

Creation of a Medication entity.

**When Created:**

Immediately upon Medication record creation.

**Event Date Source:**

The start date recorded in the Medication.

**Clinical Significance:**

Marks the beginning of a pharmacological intervention.

### 3.3 Medication Change

**Meaning:**

An existing medication's dosage or frequency has been modified.

**Generated By:**

The successor Medication entity created through the version-through-discontinuation pattern.

**When Created:**

When a new Medication record is created as a continuation of a discontinued one.

**Event Date Source:**

The start date of the new Medication record (which is the effective date of the change).

**Clinical Significance:**

Documents titration, dose adjustments, and frequency modifications as part of treatment optimization.

### 3.4 Medication Stop

**Meaning:**

A medication has been discontinued.

**Generated By:**

Discontinuation of a Medication entity (setting end date and discontinuation reason).

**When Created:**

When the Medication status transitions to discontinued.

**Event Date Source:**

The end date recorded in the Medication.

**Clinical Significance:**

Marks the termination of a pharmacological intervention, with documented rationale.

### 3.5 Hospitalization

**Meaning:**

The patient experienced an inpatient psychiatric care episode.

**Generated By:**

Manual event entry by the clinician.

**When Created:**

When the clinician records the hospitalization event.

**Event Date Source:**

The date specified by the clinician (typically the admission date or a single date representing the episode).

**Clinical Significance:**

Marks periods of crisis requiring inpatient stabilization.

### 3.6 Life Event

**Meaning:**

A significant occurrence in the patient's life that affects their psychiatric condition.

**Generated By:**

Manual event entry by the clinician.

**When Created:**

When the clinician records the life event.

**Event Date Source:**

The date specified by the clinician.

**Clinical Significance:**

Provides context for understanding symptom changes, treatment responses, or clinical trajectory. Examples: job loss, bereavement, relationship changes, relapse.

### 3.7 History Update

**Meaning:**

The patient's psychiatric history has been revised with new or corrected background information.

**Generated By:**

Creation of a new PsychiatricHistory version (version 2 or later).

**When Created:**

When a new PsychiatricHistory version is saved.

**Event Date Source:**

The creation date of the new version (recorded timestamp serves as event date for this event type).

**Clinical Significance:**

Documents that the foundational understanding of the patient has evolved—new disclosures, corrections, or expanded information.

**Special Rule:**

The initial PsychiatricHistory (version 1) does not generate an event. It is considered foundational context, not a timeline occurrence.

### 3.8 Other

**Meaning:**

A clinically significant occurrence that does not fit the defined categories.

**Generated By:**

Manual event entry by the clinician.

**When Created:**

When the clinician records the event.

**Event Date Source:**

The date specified by the clinician.

**Clinical Significance:**

Provides flexibility for documenting significant events outside standard categories.

---

## 4. Ordering Rules

The Timeline Engine enforces deterministic ordering to ensure consistent presentation regardless of when or how events are retrieved.

### 4.1 Primary Ordering: Event Timestamp

Events are ordered by their clinical occurrence date (event timestamp).

Events with earlier occurrence dates appear before events with later occurrence dates.

This produces a timeline that reflects the patient's lived experience, not the documentation sequence.

### 4.2 Secondary Ordering: Recorded Timestamp

When multiple events share the same event timestamp, they are ordered by recorded timestamp.

The event documented first appears before the event documented later.

This provides determinism without requiring artificial temporal precision.

### 4.3 Tertiary Ordering: Event Type Priority

When events share both event timestamp and recorded timestamp, they are ordered by event type priority.

The priority order is:

| Priority | Event Type |
|----------|------------|
| 1 (highest) | Encounter |
| 2 | Medication Start |
| 3 | Medication Change |
| 4 | Medication Stop |
| 5 | Hospitalization |
| 6 | Life Event |
| 7 | History Update |
| 8 (lowest) | Other |

**Rationale:**

This ordering ensures that encounter documentation appears before related medication events on the same day, reflecting clinical workflow where encounter notes are typically completed before recording medication actions discussed during the encounter.

### 4.4 Quaternary Ordering: Event Identifier

When all previous ordering criteria produce identical results, events are ordered by their unique identifier.

This is a deterministic tiebreaker ensuring that even identical-appearing events maintain stable order.

This scenario is rare but possible (e.g., two medications started at the exact same moment, documented at the exact same time).

### 4.5 Ordering Summary

```
ORDER BY
  event_timestamp ASC,
  recorded_timestamp ASC,
  event_type_priority ASC,
  event_identifier ASC
```

This ordering is deterministic: given the same set of events, the same order is always produced.

### 4.6 Backdated Entry Handling

Events may have event timestamps significantly before their recorded timestamps.

**Behavior:**

- The event appears at its event timestamp position, not its recorded timestamp position.
- Existing events are not displaced or reordered; the backdated event is inserted at its correct chronological position.
- The recorded timestamp is preserved for audit transparency.

**Example:**

Timeline contains events on November 10 and November 20. On November 25, a hospitalization from November 15 is documented.

Result: Timeline order is November 10, November 15 (backdated), November 20.

**No Limit on Backdating:**

There is no constraint on how far in the past an event may be dated. Historical documentation (e.g., hospitalizations from years ago) is permitted.

### 4.7 Future Event Prohibition

Events with event timestamps in the future are not permitted.

The Timeline represents what has occurred, not what is planned.

**Enforcement:**

- Event creation must validate that event timestamp ≤ current date.
- Planned future actions are documented in encounter note Plan sections, not as timeline events.

### 4.8 Chronological Consistency Guarantees

**Guarantee 1: Stable Ordering**

The Timeline ordering is stable. Adding a new event does not change the relative order of existing events.

**Guarantee 2: Insertion Without Displacement**

Backdated events are inserted at their correct position without affecting the position of other events.

**Guarantee 3: No Orphaned Gaps**

There is no concept of "missing" timeline positions. The Timeline contains exactly what has been documented.

**Guarantee 4: Deterministic Retrieval**

Multiple retrievals of the same Timeline produce identical ordering.

---

## 5. Immutability and Corrections

### 5.1 Immutability Principle

Clinical documentation is immutable once finalized.

This means:

- Content cannot be modified.
- Timestamps cannot be altered.
- References cannot be changed.
- Records cannot be deleted.

**Rationale:**

Immutability preserves legal integrity, protects clinical reasoning at the time of documentation, and ensures the medical record is trustworthy over time.

### 5.2 Immutable Event Attributes

Once created, the following ClinicalEvent attributes are permanently fixed:

| Attribute | Immutability |
|-----------|--------------|
| Event identifier | Immutable |
| Event timestamp | Immutable |
| Event type | Immutable |
| Title | Immutable |
| Description | Immutable |
| Recorded timestamp | Immutable |
| Source reference | Immutable |

**No exceptions exist for these attributes.**

### 5.3 Immutable Source Entities

**Finalized Notes:**

- All content fields (subjective, objective, assessment, plan) are immutable.
- Encounter date and encounter type are immutable.
- Finalization timestamp is immutable.

**Addenda:**

- Content and reason are immutable from creation.
- Addenda cannot be modified or deleted.

**Medications (after discontinuation):**

- All fields become immutable when status is Discontinued.
- Start date, end date, dosage history, and discontinuation reason are preserved.

**PsychiatricHistory Versions:**

- Each version is immutable from creation.
- Content cannot be modified; corrections require a new version.
- Superseded timestamps are immutable once set.

### 5.4 Correction Mechanisms

When information must be corrected, the Timeline Engine supports three patterns:

**Pattern 1: Addendum (for Notes)**

- The original Note remains unchanged.
- An Addendum is attached explaining the correction.
- The Addendum contains the corrected information.
- Display presents both original and addendum, preserving transparency.

**Pattern 2: New Version (for PsychiatricHistory)**

- The current version is marked as superseded.
- A new version is created with corrected content.
- All versions remain accessible for historical review.
- A History Update event is generated for the new version.

**Pattern 3: Discontinuation with Explanation (for Medications)**

- The erroneous Medication is discontinued with reason indicating the error.
- A new Medication record is created with correct information if applicable.
- The timeline shows both the Stop event (with error explanation) and the new Start event.

### 5.5 What Superseded Information Looks Like

Superseded information remains visible but is contextualized:

- **Notes with Addenda:** Original note is displayed followed by addenda in chronological order. Each addendum shows its reason.
- **PsychiatricHistory Versions:** The current version is primary; previous versions are accessible through version history. Each version shows its creation and supersession dates.
- **Medication Chains:** Discontinued medications remain visible with their discontinuation reason. Predecessor links enable tracing the medication's evolution.

### 5.6 What Is Never Allowed

The following operations are explicitly prohibited by the Timeline Engine:

| Prohibited Operation | Rationale |
|---------------------|-----------|
| Deleting a finalized Note | Legal and clinical integrity |
| Deleting a ClinicalEvent | Timeline permanence guarantee |
| Modifying finalized Note content | Immutability principle |
| Changing an event's timestamp | Chronological integrity |
| Removing an Addendum | Amendment transparency |
| Deleting a Medication record | Treatment history preservation |
| Deleting a PsychiatricHistory version | Version chain integrity |
| Un-finalizing a Note | State transition is one-way |
| Modifying event title or description | Event immutability |

**The only deletion permitted:** Draft Notes may be deleted before finalization.

---

## 6. Timeline Queries (Conceptual)

The Timeline Engine supports three fundamental query patterns. These are conceptual operations, not API specifications.

### 6.1 Full Timeline Retrieval

**Purpose:**

Retrieve the complete chronological history of a patient's clinical care.

**Input:**

- Patient identifier

**Output:**

- Ordered sequence of all ClinicalEvents for the patient
- Events sorted according to ordering rules (Section 4)

**Characteristics:**

- Includes all event types.
- Includes backdated events at their correct chronological position.
- Default presentation is reverse chronological (most recent first).
- Forward chronological is available for complete journey review.
- Excludes draft Notes and their potential events.
- Excludes appointments.

**Use Cases:**

- Reviewing patient history before an encounter.
- Understanding treatment trajectory.
- Preparing summaries or reports.

### 6.2 Current State Retrieval

**Purpose:**

Retrieve the patient's current clinical state as of this moment.

**Input:**

- Patient identifier

**Output:**

- Current active medications (status = Active)
- Current PsychiatricHistory version (is_current = true)
- Most recent finalized Note
- Summary of recent events (optional)

**Characteristics:**

- Represents "what is true now" rather than "what happened."
- Active medications exclude discontinued entries.
- Current psychiatric history is the most recent version.
- Does not include historical events beyond current state.

**Use Cases:**

- Quick reference during patient encounter.
- Medication reconciliation.
- Understanding current treatment regimen.

### 6.3 Time-Sliced View (Point-in-Time State)

**Purpose:**

Retrieve the patient's clinical state as it existed at a specific historical date.

**Input:**

- Patient identifier
- Target date

**Output:**

- Events that had occurred by the target date
- Medications that were active on the target date
- PsychiatricHistory version that was current on the target date
- The "current state" as it would have appeared on that date

**Characteristics:**

- Excludes events with event timestamp after target date.
- Active medications are those with start date ≤ target date AND (end date is null OR end date > target date).
- Current psychiatric history is the version that was is_current on the target date.
- Enables reconstruction of historical clinical state.

**Use Cases:**

- Understanding what was known when a clinical decision was made.
- Reconstructing state for legal or audit purposes.
- Correlating symptoms with active treatments at specific periods.

**Resolution Logic:**

For a target date D:

- Include events where event_timestamp ≤ D.
- Include medications where start_date ≤ D AND (end_date IS NULL OR end_date > D).
- Include the psychiatric history version where created_at ≤ D AND (superseded_at IS NULL OR superseded_at > D).

### 6.4 Filtered Timeline Retrieval

**Purpose:**

Retrieve a subset of timeline events matching specific criteria.

**Input:**

- Patient identifier
- Filter criteria (event type, date range, or both)

**Output:**

- Ordered sequence of matching ClinicalEvents
- Events sorted according to ordering rules

**Filter Options:**

- By event type (e.g., only Encounter events, only Medication events)
- By date range (events within a specific period)
- Combined filters (e.g., Medication events in the past 6 months)

**Use Cases:**

- Reviewing medication history specifically.
- Examining encounters during a particular treatment phase.
- Finding hospitalization history.

---

## 7. Failure and Edge Conditions

### 7.1 Missing Timestamps

**Scenario:**

A clinical event source is missing its primary timestamp (e.g., medication without start date).

**Engine Behavior:**

Event creation is blocked. Timestamps are required attributes.

**Resolution:**

The clinician must provide the required timestamp. If the exact date is unknown, the clinician documents the best available estimate.

**Note:**

The system does not support "unknown" or "approximate" dates at the data level. The clinician's clinical judgment determines the date, and any uncertainty is documented in the event description or associated note.

### 7.2 Conflicting Events

**Scenario:**

Two events appear to conflict logically (e.g., medication stop before medication start for the same entry).

**Engine Behavior:**

The engine enforces basic temporal constraints:

- Medication end date must be on or after start date.
- Events cannot have future timestamps.

Beyond these constraints, the engine accepts the documented information. Clinical judgment determines logical consistency.

**Resolution:**

The clinician resolves conflicts through:

- Discontinuing erroneous entries with appropriate explanation.
- Creating addenda to clarify apparent contradictions.
- Documenting context in associated notes.

### 7.3 Late Data Entry

**Scenario:**

Clinical events are documented significantly after they occurred (backdating).

**Engine Behavior:**

The engine accepts backdated entries without constraint on the time gap. Events are placed at their clinical occurrence date.

**Transparency:**

- The recorded timestamp captures when documentation occurred.
- The gap between event timestamp and recorded timestamp is visible for audit purposes.
- No special marking or flagging of backdated entries occurs on the timeline.

**No Automatic Warnings:**

The engine does not warn about documentation delays. This is a clinical workflow concern, not a timeline integrity concern.

### 7.4 Partial Information

**Scenario:**

External clinical information is available but incomplete (e.g., hospitalization without specific dates, medication without exact dosage).

**Engine Behavior:**

The engine requires minimum attributes for event creation. Incomplete information must be approximated or captured in description text.

**Resolution:**

- Use the best available date estimate.
- Document uncertainty in the event description or associated note.
- Capture partial information (e.g., "hospitalization duration approximately 2 weeks").
- Update through addenda or history versions when complete information becomes available.

### 7.5 Duplicate Events

**Scenario:**

The same clinical occurrence appears to be documented twice.

**Engine Behavior:**

The engine does not automatically detect or prevent duplicate events. Each event creation produces a distinct event.

**Resolution:**

Duplicate events cannot be deleted. The clinician documents the duplication through:

- An addendum on the associated note explaining the duplicate.
- A manual event (type: Other) explaining that a previous event was entered in error.

**Prevention:**

Duplicate prevention is a UI/application concern, not an engine concern. The engine accepts all validly formed events.

### 7.6 Source Entity Corruption

**Scenario:**

An event's source entity becomes inaccessible or corrupted.

**Engine Behavior:**

The event remains on the timeline with its recorded attributes. The source reference may point to an inaccessible entity.

**Guarantee:**

The event itself preserves the title, description, and timestamps even if the full source documentation is unavailable.

**Resolution:**

Data integrity is a persistence layer concern. The Timeline Engine assumes referential integrity is maintained. Recovery procedures are implementation-specific.

### 7.7 System Clock Issues

**Scenario:**

The system clock is incorrect, producing inaccurate recorded timestamps.

**Engine Behavior:**

The engine trusts system-provided timestamps. It has no mechanism to detect or correct clock errors.

**Impact:**

- Recorded timestamps may be inaccurate.
- Event timestamps are clinician-specified and unaffected.
- Secondary ordering (by recorded timestamp) may produce unexpected results for same-day events.

**Resolution:**

Clock accuracy is an operational concern outside engine scope. Recorded timestamps are immutable and cannot be corrected after the fact.

### 7.8 Events at Date Boundaries

**Scenario:**

Events occur at midnight or span date boundaries (e.g., hospitalization admission at 11:59 PM).

**Engine Behavior:**

The engine uses dates only (not times) for event timestamps. The clinician specifies which calendar date represents the event.

**Resolution:**

Clinical judgment determines date assignment. For events spanning dates, the clinician typically uses the initiation date (e.g., admission date for hospitalizations).

---

## 8. Non-Goals

The Timeline Engine explicitly does not handle the following concerns in this MVP:

### 8.1 Multi-User Concurrency

The engine assumes a single user (one psychiatrist). Concurrent access, conflict resolution, and multi-user editing are not addressed.

### 8.2 Real-Time Updates

The engine does not provide push notifications, live updates, or subscription mechanisms. Consumers retrieve timeline state on demand.

### 8.3 Event Aggregation

The engine does not aggregate events into higher-level constructs (e.g., "treatment episodes," "medication trials"). Aggregation is a consumer concern.

### 8.4 Clinical Validation

The engine does not validate clinical appropriateness (e.g., drug interactions, dosage ranges, diagnostic consistency). It records what the clinician documents.

### 8.5 Natural Language Processing

The engine does not parse, analyze, or extract information from clinical text. Note content is opaque to the engine.

### 8.6 Search and Full-Text Indexing

The engine provides timeline ordering and retrieval. Text search across clinical content is a separate concern.

### 8.7 Analytics and Reporting

The engine does not calculate statistics, generate reports, or provide population-level insights. It serves individual patient timelines.

### 8.8 Event Scheduling

The engine handles past and present events. Future scheduling (appointments, planned interventions) is outside engine scope.

### 8.9 External System Integration

The engine does not import events from external sources (EHRs, pharmacies, hospitals). All events are created through local documentation.

### 8.10 Audit Logging

The engine does not maintain a separate audit log of who accessed what. The recorded timestamp provides creation transparency, but access logging is not provided.

### 8.11 Undo/Redo

The engine does not support undo/redo operations. Immutability means actions are permanent; corrections are documented rather than reversed.

### 8.12 Event Relationships

The engine does not model causal or correlative relationships between events (e.g., "medication change because of side effect"). Such relationships are documented in clinical text, not event metadata.

### 8.13 Soft Deletion or Archival

The engine does not support soft deletion, archival, or hiding of events. All events remain visible on the timeline permanently.

### 8.14 Patient-Facing Access

The engine does not provide mechanisms for patient access to their timeline. This is a single-clinician system.

### 8.15 Data Export

The engine does not define export formats or mechanisms. Export is an application-level concern.

---

## Summary

The Timeline Engine is the authoritative abstraction for longitudinal clinical data in the Psychiatric Medical Records System.

It guarantees:

- Deterministic, chronological ordering of clinical events.
- Immutability of finalized clinical documentation.
- Transparent handling of backdated entries.
- Clear correction mechanisms that preserve original documentation.
- Consistent query patterns for full timeline, current state, and point-in-time views.

All system components that interact with clinical history must respect the Timeline Engine's rules and guarantees.

---

*Document Version: 1.0*  
*Status: Final*  
*Sources: 01_specs.md, 02_domain.md, 03_timeline.md, 04_use_cases.md, 05_edge_cases.md, 10_data_models.md*


---

## 14_timeline_contracts.md

# Psychiatric Medical Records System — Timeline Engine Contracts

## Overview

This document defines the formal contracts for interacting with the Timeline Engine.

These contracts specify what consumers may request, what the engine guarantees in response, and what behaviors are explicitly excluded.

All system components—persistence layer, application logic, user interfaces, testing infrastructure, and AI agents—must adhere to these contracts.

---

## 1. Contract Purpose

### 1.1 Why These Contracts Exist

The Timeline Engine is the authoritative source for longitudinal clinical data. Multiple system components depend on its behavior. Without formal contracts, each component would make implicit assumptions about engine behavior, leading to:

- Inconsistent interpretations of timeline state.
- Fragile integrations that break when engine internals change.
- Ambiguous error handling that produces unpredictable user experiences.
- Testing gaps where edge cases are not explicitly defined.

These contracts exist to:

1. **Formalize expectations** — Every consumer knows exactly what to expect from the engine.
2. **Enable independent development** — Components can be built against contracts without waiting for engine implementation.
3. **Protect system integrity** — Contracts prevent consumers from depending on undefined behavior.
4. **Support verification** — QA can validate implementations against explicit contract specifications.

### 1.2 What These Contracts Protect the System From

| Risk | Protection |
|------|------------|
| **Ordering inconsistency** | Contracts guarantee deterministic ordering; consumers never see different orders for the same data. |
| **Data loss** | Contracts prohibit deletion; consumers can rely on historical completeness. |
| **Silent failures** | Contracts define explicit failure conditions; no operation fails without defined behavior. |
| **Assumption drift** | Contracts document exclusions; consumers cannot assume capabilities beyond what is specified. |
| **Retroactive modification** | Contracts enforce immutability; consumers can trust that past data remains unchanged. |

### 1.3 Contract Consumers

These contracts are consumed by:

| Consumer | Usage |
|----------|-------|
| **Backend (Persistence Layer)** | Implements storage and retrieval according to contract specifications. |
| **Backend (Application Logic)** | Orchestrates operations respecting contract guarantees and constraints. |
| **UX (User Interface)** | Presents timeline data according to contract output shapes; handles failures per contract definitions. |
| **QA (Testing)** | Validates implementation against contract guarantees and failure conditions. |
| **AI Agents** | Interact with timeline data respecting contract boundaries; never assume capabilities beyond contracts. |
| **Future Integrations** | Any new component integrates through these stable contracts. |

### 1.4 Contract Stability

These contracts are stable for the MVP scope.

- **Additions** are permitted (new optional capabilities).
- **Removals** are prohibited (no guarantee may be withdrawn).
- **Modifications** to existing guarantees require explicit versioning and migration.

Consumers may rely on these contracts remaining valid throughout the MVP lifecycle.

---

## 2. Core Guarantees

The Timeline Engine provides the following guarantees to all consumers. These guarantees are unconditional within the defined scope.

### 2.1 Ordering Guarantees

#### G-ORD-1: Deterministic Ordering

Given the same set of events, the Timeline Engine always produces the same order.

**Implication:** Multiple retrievals of a timeline return identical ordering. Consumers may cache ordering and expect consistency.

#### G-ORD-2: Four-Tier Ordering

Events are ordered by:

1. Event timestamp (ascending)
2. Recorded timestamp (ascending)
3. Event type priority (ascending: Encounter=1, Medication Start=2, Medication Change=3, Medication Stop=4, Hospitalization=5, Life Event=6, History Update=7, Other=8)
4. Event identifier (ascending)

**Implication:** Consumers can predict ordering for any set of events by applying this algorithm.

#### G-ORD-3: Stable Ordering

Adding a new event does not change the relative order of existing events.

**Implication:** Consumers displaying timeline data need only insert new events at their correct position; existing event positions remain valid.

#### G-ORD-4: Backdating Integration

Backdated events are inserted at their correct chronological position based on event timestamp.

**Implication:** A newly created event may appear before previously created events if its event timestamp is earlier.

### 2.2 Historical Completeness Guarantees

#### G-HIST-1: Append-Only Growth

The timeline only grows. Events cannot be removed or destroyed.

**Implication:** The count of events for a patient is monotonically non-decreasing.

#### G-HIST-2: Event Permanence

Every event that has been created remains retrievable indefinitely.

**Implication:** Consumers may store event identifiers and retrieve the same event later.

#### G-HIST-3: Finalization Completeness

Every finalized clinical action produces exactly one event on the timeline.

**Implication:** Consumers can rely on the timeline as the complete record of finalized clinical activity.

#### G-HIST-4: Exclusion Completeness

Draft documentation, administrative actions, and appointments do not appear on the timeline.

**Implication:** Consumers querying the timeline never encounter drafts or non-clinical records.

### 2.3 Deterministic State Reconstruction Guarantees

#### G-STATE-1: Current State Consistency

The current state (active medications, current psychiatric history version, most recent note) is deterministically derivable from the timeline.

**Implication:** Consumers receive identical current state on repeated queries.

#### G-STATE-2: Point-in-Time Reconstruction

For any past date, the engine can reconstruct the clinical state as it existed on that date.

**Implication:** Consumers can query historical state without maintaining their own snapshots.

#### G-STATE-3: Medication State Accuracy

Active medications at any point in time are those where start_date ≤ target_date AND (end_date IS NULL OR end_date > target_date).

**Implication:** Consumers can calculate medication state independently using this formula.

#### G-STATE-4: History Version Accuracy

The current psychiatric history version at any point in time is the version where created_at ≤ target_date AND (superseded_at IS NULL OR superseded_at > target_date).

**Implication:** Consumers can determine which history version was active at any historical moment.

### 2.4 Non-Destructive History Preservation Guarantees

#### G-PRES-1: Immutability of Created Events

Once created, an event's attributes (identifier, event timestamp, recorded timestamp, event type, title, description, source reference) cannot be modified.

**Implication:** Consumers can cache event data without invalidation concerns.

#### G-PRES-2: Immutability of Finalized Documentation

Finalized Notes, Addenda, discontinued Medications, and PsychiatricHistory versions cannot be modified.

**Implication:** Source entity content retrieved via event references remains stable.

#### G-PRES-3: Correction Transparency

Corrections to clinical information are additive (addenda, new versions, documented discontinuations), never destructive.

**Implication:** Consumers always see both original and correction; the correction never replaces the original.

#### G-PRES-4: Version Chain Integrity

PsychiatricHistory versions form an unbroken sequence. Medication predecessor chains are acyclic.

**Implication:** Consumers can traverse version history without encountering gaps or cycles.

---

## 3. Read Contracts (Queries)

### 3.1 Contract: Retrieve Full Timeline

**Contract Identifier:** READ-TIMELINE-FULL

**Purpose:** Retrieve the complete chronological history of clinical events for a patient.

#### Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| patient_identifier | Yes | Unique identifier of the patient |
| direction | No | Ordering direction: `ascending` (oldest first) or `descending` (most recent first). Default: `descending` |

#### Output Shape

```
{
  patient_identifier: Identifier
  event_count: Integer
  events: [
    {
      event_identifier: Identifier
      event_timestamp: Date
      recorded_timestamp: Timestamp
      event_type: EventType
      title: Text
      description: Text (nullable)
      source_type: SourceType (nullable)
      source_identifier: Identifier (nullable)
    },
    ...
  ]
}
```

Events are ordered according to the four-tier ordering rules (G-ORD-2), with order reversed if direction is `descending`.

#### Guarantees

- G-ORD-1: Ordering is deterministic.
- G-ORD-2: Events follow four-tier ordering.
- G-HIST-1: All events ever created are included.
- G-HIST-4: Drafts and appointments are excluded.

#### Failure Conditions

| Condition | Behavior |
|-----------|----------|
| Patient does not exist | Return error: `PATIENT_NOT_FOUND` |
| Patient has no events | Return success with empty events list and event_count = 0 |
| Invalid direction parameter | Return error: `INVALID_PARAMETER` |

---

### 3.2 Contract: Retrieve Current State

**Contract Identifier:** READ-STATE-CURRENT

**Purpose:** Retrieve the patient's current clinical state as of this moment.

#### Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| patient_identifier | Yes | Unique identifier of the patient |

#### Output Shape

```
{
  patient_identifier: Identifier
  as_of_date: Date (today)
  active_medications: [
    {
      medication_identifier: Identifier
      drug_name: Text
      dosage: Decimal
      dosage_unit: Text
      frequency: Text
      start_date: Date
      prescribing_reason: Text
    },
    ...
  ]
  current_psychiatric_history: {
    version_identifier: Identifier
    version_number: Integer
    created_at: Timestamp
    content: PsychiatricHistoryContent
  }
  most_recent_note: {
    note_identifier: Identifier
    encounter_date: Date
    encounter_type: EncounterType
    finalized_at: Timestamp
  } (nullable)
}
```

#### Guarantees

- G-STATE-1: Current state is deterministic.
- G-STATE-3: Active medications accurately reflect current status.
- G-STATE-4: Current psychiatric history is the non-superseded version.

#### Failure Conditions

| Condition | Behavior |
|-----------|----------|
| Patient does not exist | Return error: `PATIENT_NOT_FOUND` |
| Patient has no medications | Return success with empty active_medications list |
| Patient has no finalized notes | Return success with most_recent_note = null |
| Patient has no psychiatric history | Return error: `INVALID_STATE` (this should never occur; history is created with patient) |

---

### 3.3 Contract: Retrieve Point-in-Time State

**Contract Identifier:** READ-STATE-HISTORICAL

**Purpose:** Retrieve the patient's clinical state as it existed on a specific historical date.

#### Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| patient_identifier | Yes | Unique identifier of the patient |
| target_date | Yes | The date for which to reconstruct state |

#### Output Shape

```
{
  patient_identifier: Identifier
  as_of_date: Date (target_date)
  events_through_date: [
    {
      event_identifier: Identifier
      event_timestamp: Date
      event_type: EventType
      title: Text
    },
    ...
  ]
  active_medications_on_date: [
    {
      medication_identifier: Identifier
      drug_name: Text
      dosage: Decimal
      dosage_unit: Text
      frequency: Text
      start_date: Date
    },
    ...
  ]
  psychiatric_history_on_date: {
    version_identifier: Identifier
    version_number: Integer
    created_at: Timestamp
    content: PsychiatricHistoryContent
  } (nullable)
}
```

#### Guarantees

- G-STATE-2: Historical state is accurately reconstructed.
- G-STATE-3: Medications active on target_date are correctly identified.
- G-STATE-4: Psychiatric history version current on target_date is correctly identified.

#### Resolution Logic

Events are included where: `event_timestamp ≤ target_date`

Medications are included where: `start_date ≤ target_date AND (end_date IS NULL OR end_date > target_date)`

Psychiatric history version is included where: `created_at ≤ target_date AND (superseded_at IS NULL OR superseded_at > target_date)`

#### Failure Conditions

| Condition | Behavior |
|-----------|----------|
| Patient does not exist | Return error: `PATIENT_NOT_FOUND` |
| Target date is in the future | Return error: `INVALID_DATE_FUTURE` |
| Target date is before patient registration | Return success with empty events and medications, psychiatric_history_on_date = null |
| No psychiatric history version existed on target_date | Return psychiatric_history_on_date = null |

---

### 3.4 Contract: Retrieve Filtered Timeline

**Contract Identifier:** READ-TIMELINE-FILTERED

**Purpose:** Retrieve a subset of timeline events matching specific criteria.

#### Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| patient_identifier | Yes | Unique identifier of the patient |
| event_types | No | List of event types to include. If omitted, all types are included. |
| date_range_start | No | Include only events with event_timestamp ≥ this date |
| date_range_end | No | Include only events with event_timestamp ≤ this date |
| direction | No | Ordering direction: `ascending` or `descending`. Default: `descending` |

#### Output Shape

```
{
  patient_identifier: Identifier
  filters_applied: {
    event_types: [EventType, ...] (nullable)
    date_range_start: Date (nullable)
    date_range_end: Date (nullable)
  }
  event_count: Integer
  events: [
    {
      event_identifier: Identifier
      event_timestamp: Date
      recorded_timestamp: Timestamp
      event_type: EventType
      title: Text
      description: Text (nullable)
      source_type: SourceType (nullable)
      source_identifier: Identifier (nullable)
    },
    ...
  ]
}
```

#### Guarantees

- G-ORD-1: Ordering is deterministic within filtered results.
- G-ORD-2: Events follow four-tier ordering.
- Filtering is exact: only events matching all specified criteria are included.

#### Failure Conditions

| Condition | Behavior |
|-----------|----------|
| Patient does not exist | Return error: `PATIENT_NOT_FOUND` |
| Invalid event type in filter | Return error: `INVALID_EVENT_TYPE` |
| date_range_end before date_range_start | Return error: `INVALID_DATE_RANGE` |
| No events match filters | Return success with empty events list and event_count = 0 |

---

### 3.5 Contract: Retrieve Single Event

**Contract Identifier:** READ-EVENT-SINGLE

**Purpose:** Retrieve a specific event by its identifier.

#### Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| event_identifier | Yes | Unique identifier of the event |

#### Output Shape

```
{
  event_identifier: Identifier
  patient_identifier: Identifier
  event_timestamp: Date
  recorded_timestamp: Timestamp
  event_type: EventType
  title: Text
  description: Text (nullable)
  source_type: SourceType (nullable)
  source_identifier: Identifier (nullable)
}
```

#### Guarantees

- G-HIST-2: If the event was ever created, it is retrievable.
- G-PRES-1: Event attributes are identical to when created.

#### Failure Conditions

| Condition | Behavior |
|-----------|----------|
| Event does not exist | Return error: `EVENT_NOT_FOUND` |

---

### 3.6 Contract: Retrieve Event Source

**Contract Identifier:** READ-EVENT-SOURCE

**Purpose:** Retrieve the full source entity for a source-generated event.

#### Input Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| event_identifier | Yes | Unique identifier of the event |

#### Output Shape

Varies by source type:

**For Encounter events (source_type = Note):**
```
{
  source_type: "Note"
  note: {
    note_identifier: Identifier
    encounter_date: Date
    encounter_type: EncounterType
    subjective: Text
    objective: Text (nullable)
    assessment: Text
    plan: Text
    finalized_at: Timestamp
    addenda: [
      {
        addendum_identifier: Identifier
        content: Text
        reason: Text
        created_at: Timestamp
      },
      ...
    ]
  }
}
```

**For Medication events (source_type = Medication):**
```
{
  source_type: "Medication"
  medication: {
    medication_identifier: Identifier
    drug_name: Text
    dosage: Decimal
    dosage_unit: Text
    frequency: Text
    route: Text (nullable)
    start_date: Date
    end_date: Date (nullable)
    prescribing_reason: Text
    discontinuation_reason: Text (nullable)
    status: MedicationStatus
    predecessor_identifier: Identifier (nullable)
  }
}
```

**For History Update events (source_type = PsychiatricHistory):**
```
{
  source_type: "PsychiatricHistory"
  psychiatric_history: {
    version_identifier: Identifier
    version_number: Integer
    content: PsychiatricHistoryContent
    created_at: Timestamp
    superseded_at: Timestamp (nullable)
  }
}
```

**For Manual events (source_type = null):**
```
{
  source_type: null
  message: "This event has no source entity"
}
```

#### Guarantees

- G-PRES-2: Source entity content is immutable and matches original documentation.
- Source reference integrity is maintained.

#### Failure Conditions

| Condition | Behavior |
|-----------|----------|
| Event does not exist | Return error: `EVENT_NOT_FOUND` |
| Source entity is corrupted or inaccessible | Return error: `SOURCE_UNAVAILABLE` with event data preserved |

---

## 4. Write Contracts (Event Ingestion)

### 4.1 Contract: Create Event from Note Finalization

**Contract Identifier:** WRITE-EVENT-ENCOUNTER

**Purpose:** Generate an Encounter event when a Note is finalized.

#### Trigger

A Note entity transitions from status=Draft to status=Finalized.

#### Required Information

| Field | Source | Description |
|-------|--------|-------------|
| clinical_record_identifier | Note.clinical_record_id | Links event to patient |
| event_timestamp | Note.encounter_date | Clinical date of encounter |
| title | Derived from Note.encounter_type | e.g., "Follow-up encounter" |
| description | Optional summary | May be generated from note content |
| source_type | Constant: "Note" | Identifies source entity type |
| source_identifier | Note.id | Reference to source note |

#### Automatically Assigned

| Field | Value |
|-------|-------|
| event_identifier | System-generated unique identifier |
| event_type | Constant: "Encounter" |
| recorded_timestamp | Current system timestamp |

#### Timestamp Rules

- event_timestamp must equal Note.encounter_date.
- event_timestamp must not be in the future.
- recorded_timestamp is assigned at moment of event creation.

#### Validation Expectations

Before event creation, the following must be true:

- Note status is transitioning from Draft to Finalized.
- Note.encounter_date is a valid date not in the future.
- Note.encounter_type is a valid enumeration value.
- Required Note fields (subjective, assessment, plan) are populated.

#### Conflict Handling

- If a Note is finalized multiple times (should not occur), duplicate events may be created. Prevention is an application concern.
- The engine does not detect or prevent duplicate encounter events.

#### Post-Conditions

- Exactly one Encounter event exists for the finalized Note.
- The event is immediately queryable.
- The event is immutable from this point.

---

### 4.2 Contract: Create Event from Medication Creation

**Contract Identifier:** WRITE-EVENT-MEDICATION-START

**Purpose:** Generate a Medication Start event when a Medication is created.

#### Trigger

A new Medication entity is created with status=Active.

#### Required Information

| Field | Source | Description |
|-------|--------|-------------|
| clinical_record_identifier | Medication.clinical_record_id | Links event to patient |
| event_timestamp | Medication.start_date | Clinical date of medication start |
| title | Derived | e.g., "Started Sertraline 50mg" |
| description | Medication.prescribing_reason | Why medication was started |
| source_type | Constant: "Medication" | Identifies source entity type |
| source_identifier | Medication.id | Reference to source medication |

#### Automatically Assigned

| Field | Value |
|-------|-------|
| event_identifier | System-generated unique identifier |
| event_type | Constant: "Medication Start" |
| recorded_timestamp | Current system timestamp |

#### Timestamp Rules

- event_timestamp must equal Medication.start_date.
- event_timestamp must not be in the future.

#### Validation Expectations

- Medication.drug_name is not empty.
- Medication.dosage is a positive value.
- Medication.start_date is a valid date not in the future.
- Medication.prescribing_reason is not empty.

#### Conflict Handling

- Multiple medications with the same drug name may be started. The engine accepts this.
- The engine does not validate clinical appropriateness of prescriptions.

---

### 4.3 Contract: Create Event from Medication Change

**Contract Identifier:** WRITE-EVENT-MEDICATION-CHANGE

**Purpose:** Generate a Medication Change event when a medication dosage or frequency is modified.

#### Trigger

A new Medication entity is created with predecessor_id referencing a discontinued Medication.

#### Required Information

| Field | Source | Description |
|-------|--------|-------------|
| clinical_record_identifier | Medication.clinical_record_id | Links event to patient |
| event_timestamp | New Medication.start_date | Effective date of change |
| title | Derived | e.g., "Changed Sertraline from 50mg to 100mg" |
| description | Reason for change | May reference original discontinuation reason |
| source_type | Constant: "Medication" | Identifies source entity type |
| source_identifier | New Medication.id | Reference to new medication record |

#### Automatically Assigned

| Field | Value |
|-------|-------|
| event_identifier | System-generated unique identifier |
| event_type | Constant: "Medication Change" |
| recorded_timestamp | Current system timestamp |

#### Timestamp Rules

- event_timestamp equals the new Medication.start_date.
- The predecessor Medication.end_date should be the day before event_timestamp.

#### Validation Expectations

- predecessor_id references a valid, discontinued Medication.
- The predecessor belongs to the same clinical record.
- New Medication.start_date is on or after predecessor.start_date.

---

### 4.4 Contract: Create Event from Medication Discontinuation

**Contract Identifier:** WRITE-EVENT-MEDICATION-STOP

**Purpose:** Generate a Medication Stop event when a medication is discontinued.

#### Trigger

A Medication entity transitions from status=Active to status=Discontinued.

#### Required Information

| Field | Source | Description |
|-------|--------|-------------|
| clinical_record_identifier | Medication.clinical_record_id | Links event to patient |
| event_timestamp | Medication.end_date | Clinical date of discontinuation |
| title | Derived | e.g., "Stopped Sertraline" |
| description | Medication.discontinuation_reason | Why medication was stopped |
| source_type | Constant: "Medication" | Identifies source entity type |
| source_identifier | Medication.id | Reference to source medication |

#### Automatically Assigned

| Field | Value |
|-------|-------|
| event_identifier | System-generated unique identifier |
| event_type | Constant: "Medication Stop" |
| recorded_timestamp | Current system timestamp |

#### Timestamp Rules

- event_timestamp equals Medication.end_date.
- Medication.end_date must be on or after Medication.start_date.
- event_timestamp must not be in the future.

#### Validation Expectations

- Medication.end_date is populated and valid.
- Medication.discontinuation_reason is not empty.

---

### 4.5 Contract: Create Event from Psychiatric History Update

**Contract Identifier:** WRITE-EVENT-HISTORY-UPDATE

**Purpose:** Generate a History Update event when a new psychiatric history version is created.

#### Trigger

A new PsychiatricHistory entity is created with version_number ≥ 2.

#### Required Information

| Field | Source | Description |
|-------|--------|-------------|
| clinical_record_identifier | PsychiatricHistory.clinical_record_id | Links event to patient |
| event_timestamp | PsychiatricHistory.created_at (date portion) | When update was made |
| title | Constant | "Psychiatric history updated" |
| description | Optional | Summary of what changed |
| source_type | Constant: "PsychiatricHistory" | Identifies source entity type |
| source_identifier | PsychiatricHistory.id | Reference to new version |

#### Automatically Assigned

| Field | Value |
|-------|-------|
| event_identifier | System-generated unique identifier |
| event_type | Constant: "History Update" |
| recorded_timestamp | Current system timestamp (equals created_at) |

#### Special Rule

Version 1 (initial psychiatric history created with patient) does NOT generate an event.

#### Validation Expectations

- version_number is correctly incremented from previous version.
- Previous version has is_current=false and superseded_at set.
- New version has is_current=true.

---

### 4.6 Contract: Create Manual Event

**Contract Identifier:** WRITE-EVENT-MANUAL

**Purpose:** Generate an event for occurrences not captured by other entities.

#### Trigger

Direct clinician action to create a Hospitalization, Life Event, or Other event.

#### Required Information

| Field | Source | Description |
|-------|--------|-------------|
| clinical_record_identifier | Clinician input | Links event to patient |
| event_timestamp | Clinician input | When the event occurred |
| event_type | Clinician selection | Hospitalization, Life Event, or Other |
| title | Clinician input | Brief description |
| description | Clinician input (optional) | Detailed description |

#### Automatically Assigned

| Field | Value |
|-------|-------|
| event_identifier | System-generated unique identifier |
| source_type | null |
| source_identifier | null |
| recorded_timestamp | Current system timestamp |

#### Timestamp Rules

- event_timestamp is clinician-specified.
- event_timestamp must not be in the future.
- No constraint on how far in the past event_timestamp may be.

#### Validation Expectations

- event_type is one of: Hospitalization, Life Event, Other.
- title is not empty.
- event_timestamp is a valid date not in the future.

#### Conflict Handling

- Multiple manual events on the same date are permitted.
- Duplicate events are not prevented; duplication is addressed through addenda or additional events.

---

### 4.7 Late Entry Handling

All write contracts support backdated event timestamps.

#### Rules

- event_timestamp may be any date up to and including the current date.
- There is no minimum or maximum gap between event_timestamp and recorded_timestamp.
- Backdated events are inserted at their correct chronological position.
- No warning or flag is applied to backdated entries.

#### Transparency

- recorded_timestamp always reflects actual documentation time.
- The gap between event_timestamp and recorded_timestamp is visible in query outputs.

---

## 5. Immutability and Correction Contracts

### 5.1 Contract: Immutable Event Attributes

**Contract Identifier:** IMMUTABLE-EVENT

The following event attributes are immutable from the moment of creation:

| Attribute | Immutability |
|-----------|--------------|
| event_identifier | Cannot be changed or reassigned |
| event_timestamp | Cannot be modified |
| recorded_timestamp | Cannot be modified |
| event_type | Cannot be changed |
| title | Cannot be modified |
| description | Cannot be modified |
| source_type | Cannot be changed |
| source_identifier | Cannot be changed |

**No exceptions exist.**

Consumers may cache event data indefinitely; it will not change.

---

### 5.2 Contract: Correction via Addendum

**Contract Identifier:** CORRECT-NOTE-ADDENDUM

**Purpose:** Correct information in a finalized Note without modifying the original.

#### Trigger

Clinician creates an Addendum for a finalized Note.

#### Process

1. Original Note remains unchanged.
2. Addendum is created with content and reason.
3. Addendum is linked to the original Note.
4. Addendum is immutable from creation.

#### Output Exposure

When retrieving a Note via READ-EVENT-SOURCE:

- Original Note content is returned.
- All Addenda are returned in chronological order.
- Each Addendum includes its reason, making the correction context explicit.

#### Consumer Expectation

Consumers must always display Addenda with their parent Note. Displaying the Note without its Addenda misrepresents the clinical record.

---

### 5.3 Contract: Correction via New Version

**Contract Identifier:** CORRECT-HISTORY-VERSION

**Purpose:** Correct information in psychiatric history by creating a new version.

#### Trigger

Clinician updates psychiatric history, creating a new version.

#### Process

1. Current version has is_current set to false.
2. Current version has superseded_at set to current timestamp.
3. New version is created with incremented version_number.
4. New version has is_current set to true.
5. History Update event is generated for new version.

#### Output Exposure

When retrieving current state (READ-STATE-CURRENT):

- Only the current version (is_current=true) is returned in the primary response.

When retrieving point-in-time state (READ-STATE-HISTORICAL):

- The version that was current on the target date is returned.

Version history is accessible:

- All versions remain queryable.
- Each version shows created_at and superseded_at.

#### Consumer Expectation

Consumers presenting psychiatric history should indicate when historical versions are available and provide access to version history.

---

### 5.4 Contract: Correction via Discontinuation

**Contract Identifier:** CORRECT-MEDICATION-DISCONTINUE

**Purpose:** Correct an erroneous medication by discontinuing it with explanation.

#### Trigger

Clinician discontinues a Medication with a reason indicating error.

#### Process

1. Medication status is set to Discontinued.
2. Medication end_date is set.
3. Medication discontinuation_reason explains the error (e.g., "Documented in error," "Wrong patient").
4. Medication Stop event is generated.
5. Optionally, a new correct Medication is created.

#### Output Exposure

When retrieving current state:

- The erroneous Medication does not appear in active medications.

When retrieving timeline:

- Both the Medication Start and Medication Stop events appear.
- The Stop event description contains the error explanation.

#### Consumer Expectation

Consumers should display the full medication timeline including corrections. The discontinuation reason provides context for the correction.

---

### 5.5 Contract: Superseded Information Access

**Contract Identifier:** ACCESS-SUPERSEDED

**Purpose:** Define how consumers access information that has been superseded or corrected.

#### Superseded Notes (via Addenda)

- Original Note is always accessible.
- All Addenda are accessible in chronological order.
- There is no concept of "hidden" Note content.

#### Superseded Psychiatric History Versions

- All versions are accessible via version history.
- Each version shows when it was current (created_at to superseded_at).
- The current version is clearly identified.

#### Superseded Medications (Discontinued)

- All discontinued medications remain in the medication history.
- Predecessor chains are traversable.
- Discontinuation reasons explain the medication's end.

#### Consumer Guarantee

No clinical information is ever hidden from consumers. Supersession adds context; it does not remove access.

---

## 6. Error and Edge Case Contracts

### 6.1 Contract: Missing Required Data

**Contract Identifier:** ERROR-MISSING-DATA

#### Behavior

If required data is missing during event creation:

| Missing Data | Engine Response |
|--------------|-----------------|
| event_timestamp | Reject with error: `MISSING_EVENT_TIMESTAMP` |
| event_type | Reject with error: `MISSING_EVENT_TYPE` |
| title | Reject with error: `MISSING_TITLE` |
| clinical_record_identifier | Reject with error: `MISSING_CLINICAL_RECORD` |

Event creation is blocked until all required data is provided.

#### Consumer Expectation

Consumers must provide all required data. The engine does not accept partial events or placeholder values.

---

### 6.2 Contract: Invalid Data

**Contract Identifier:** ERROR-INVALID-DATA

#### Behavior

If provided data is invalid:

| Invalid Data | Engine Response |
|--------------|-----------------|
| event_timestamp in the future | Reject with error: `INVALID_TIMESTAMP_FUTURE` |
| event_type not in enumeration | Reject with error: `INVALID_EVENT_TYPE` |
| Medication end_date before start_date | Reject with error: `INVALID_DATE_RANGE` |
| Source reference to non-existent entity | Reject with error: `INVALID_SOURCE_REFERENCE` |

Event creation is blocked until valid data is provided.

#### Consumer Expectation

Consumers must validate data before submission. The engine provides specific error codes for diagnostic purposes.

---

### 6.3 Contract: Conflict Reporting

**Contract Identifier:** ERROR-CONFLICT

#### Types of Conflicts

The engine detects and reports the following conflicts:

| Conflict Type | Detection | Response |
|---------------|-----------|----------|
| Duplicate event identifier | System-generated identifiers prevent this | N/A |
| Medication end before start | Validated | `INVALID_DATE_RANGE` |
| Future event timestamp | Validated | `INVALID_TIMESTAMP_FUTURE` |

#### Conflicts NOT Detected

The engine does NOT detect or report:

- Clinically illogical event sequences (e.g., medication stop for a medication never started under a different patient).
- Duplicate clinical information (e.g., same hospitalization documented twice).
- Overlapping medication entries for the same drug.

These are clinical judgment matters, not engine concerns.

#### Consumer Expectation

Consumers cannot rely on the engine to detect clinical inconsistencies. Application logic or clinical review must address logical conflicts.

---

### 6.4 Contract: What Consumers Must Never Assume

**Contract Identifier:** ASSUMPTION-PROHIBITION

Consumers must NOT assume the following:

| Prohibited Assumption | Reality |
|-----------------------|---------|
| Events can be deleted | Events are permanent |
| Events can be modified | Events are immutable |
| Ordering may change over time | Ordering is stable and deterministic |
| Empty timeline means no clinical record | Empty timeline is valid for new patients |
| Most recent recorded_timestamp means most recent event | Events are ordered by event_timestamp, not recorded_timestamp |
| Source entities can be updated | Finalized source entities are immutable |
| Duplicate events are prevented | Duplicate prevention is not an engine responsibility |
| Clinical logic is validated | The engine accepts any validly-formed event |
| Future versions will remove data | Data is append-only; nothing is removed |

---

### 6.5 Contract: Edge Case Handling

#### Same-Day Multiple Events

Multiple events on the same date are permitted and ordered by:
1. Recorded timestamp
2. Event type priority
3. Event identifier

#### Events at Date Boundaries

The engine uses dates (not times) for event timestamps. Midnight boundary issues are resolved by clinical judgment in date selection.

#### Backdated Events Older Than Patient Registration

Permitted. The timeline may contain events predating patient registration (e.g., historical hospitalizations).

#### Empty Timeline

A patient with no events has a valid empty timeline. This is not an error condition.

#### Very Long Timelines

The engine does not impose limits on event count. Performance is an implementation concern; the contracts guarantee correctness regardless of volume.

---

## 7. Non-Goals and Explicit Exclusions

### 7.1 Capabilities NOT Provided

The following capabilities are explicitly NOT provided by the Timeline Engine in this MVP:

| Excluded Capability | Rationale |
|--------------------|-----------|
| Event deletion | Violates append-only guarantee |
| Event modification | Violates immutability guarantee |
| Undo/redo operations | Immutability means no reversal; corrections are additive |
| Duplicate detection | Clinical judgment matter, not engine responsibility |
| Clinical validation | Engine records what clinician documents, does not validate appropriateness |
| Natural language processing | Note content is opaque to engine |
| Full-text search | Search is a separate concern |
| Real-time subscriptions | Consumers poll for state; no push mechanism |
| Event relationships | Causal/correlative links are documented in text, not metadata |
| Aggregation | Treatment episodes, medication trials are consumer-derived |
| Analytics | Statistics and reports are not engine functions |

### 7.2 Guarantees NOT Provided

The following guarantees are explicitly NOT provided:

| Non-Guarantee | Implication |
|---------------|-------------|
| Duplicate prevention | Consumers may inadvertently create duplicate events |
| Clinical consistency | Illogical event sequences are accepted |
| Recorded timestamp accuracy | Engine trusts system clock; errors are not corrected |
| Source entity availability | If source is corrupted, event survives but source may be unavailable |
| Performance bounds | Contracts define correctness, not speed |
| Concurrent access handling | Single-user assumption; multi-user conflicts undefined |

### 7.3 Consumer Responsibilities

Consumers are responsible for:

| Responsibility | Description |
|----------------|-------------|
| Data validation before submission | Engine rejects invalid data but consumers should pre-validate |
| Duplicate prevention | Application logic must prevent unintended duplicates |
| Clinical consistency checking | Logical conflicts must be flagged by application or clinical review |
| Displaying corrections properly | Addenda must be shown with notes; superseded info must be accessible |
| Error handling | Consumers must handle all defined error conditions gracefully |
| Caching strategy | Consumers may cache immutable data but must refresh timeline for new events |

---

## Summary

These contracts define the complete interface between the Timeline Engine and all consuming components.

**Core Principles:**

1. **Determinism** — Same input always produces same output.
2. **Immutability** — Created data never changes.
3. **Append-only** — Data is added, never removed.
4. **Transparency** — Corrections are additive and visible.
5. **Stability** — Contracts remain valid throughout MVP lifecycle.

Consumers implementing against these contracts can be confident in timeline behavior without knowledge of engine internals.

---

*Document Version: 1.0*  
*Status: Final*  
*Depends On: 13_timeline_engine.md*
*Consumed By: Backend, UX, QA, AI Agents*


---

## 15_timeline_qa_invariants.md

# Psychiatric Medical Records System — Timeline QA Invariants

## Overview

This document defines the Quality Assurance invariants for the Timeline Engine.

Invariants are properties that must always hold true, regardless of system state, user actions, or operational conditions.

These invariants serve as the foundational verification criteria for all Timeline Engine functionality.

---

## 1. Purpose of QA Invariants

### 1.1 Why Invariants Are Critical in Clinical Timelines

Clinical timelines are the longitudinal source of truth for patient care. Violations of timeline integrity can lead to:

- **Patient harm** from incorrect medication histories or missed clinical events.
- **Legal liability** from altered or missing documentation.
- **Diagnostic errors** from corrupted temporal relationships between events.
- **Treatment failures** from inaccurate reconstruction of past clinical states.

Unlike transactional systems where errors can be corrected, clinical timelines are legally protected records. Once data enters the timeline, it must remain accessible, ordered, and unmodified forever.

Invariants formalize the properties that protect patient safety and legal compliance.

### 1.2 What Kinds of Bugs Invariants Prevent

| Bug Category | Invariant Protection |
|--------------|---------------------|
| **Data loss** | Events that were created must remain retrievable indefinitely. |
| **Silent corruption** | Ordering, timestamps, and content must remain stable after creation. |
| **State inconsistency** | Derived states (active medications, current history) must be deterministically reconstructable. |
| **Retroactive modification** | Finalized data must resist all modification attempts. |
| **Ordering instability** | Timeline order must be deterministic and stable across retrievals. |
| **Phantom events** | Only explicitly created events may exist; no side-effect event generation. |
| **Orphaned references** | Source references must remain valid for the lifetime of the event. |

### 1.3 Invariant Properties

Each invariant in this document is:

- **Testable** — Can be verified through automated or manual inspection.
- **Deterministic** — Produces the same verification result given the same system state.
- **Contract-aligned** — Does not contradict any guarantee in the Timeline Contracts.
- **Implementation-agnostic** — Does not prescribe how the system achieves compliance.

---

## 2. Core Temporal Invariants

These invariants govern the fundamental temporal behavior of the Timeline Engine.

### 2.1 Event Permanence

**INV-TEMP-01: Events are never lost**

For any clinical event E that was successfully created:
- E must be retrievable by its identifier at any future point in time.
- E must appear in the full timeline retrieval for its patient at any future point in time.

**Rationale:** Append-only guarantee (G-HIST-1). Medical records cannot lose documented events.

---

**INV-TEMP-02: Event count is monotonically non-decreasing**

For any patient P with event count C at time T:
- At any time T' > T, the event count for P must be ≥ C.
- Event count may only increase or remain stable; it may never decrease.

**Rationale:** No deletion mechanism exists. The timeline only grows.

---

### 2.2 Ordering Determinism

**INV-TEMP-03: Ordering is deterministic**

For any patient P with events E₁, E₂, ..., Eₙ:
- Multiple retrievals of P's timeline must produce identical event ordering.
- Given the same set of events, the ordering algorithm must always produce the same sequence.

**Rationale:** Contract G-ORD-1. Consumers cache and display based on expected order.

---

**INV-TEMP-04: Ordering follows the four-tier algorithm**

For any two events E₁ and E₂ on the same timeline:
- E₁ precedes E₂ if and only if:
  1. E₁.event_timestamp < E₂.event_timestamp, OR
  2. Timestamps equal AND E₁.recorded_timestamp < E₂.recorded_timestamp, OR
  3. Both timestamps equal AND E₁.event_type_priority < E₂.event_type_priority, OR
  4. All above equal AND E₁.identifier < E₂.identifier

**Rationale:** Contract G-ORD-2. The algorithm is specified and must be followed exactly.

---

**INV-TEMP-05: Adding events does not reorder existing events**

For any timeline T with events [E₁, E₂, ..., Eₙ] in order O:
- After adding event Eₙ₊₁, the relative order of E₁ through Eₙ must be preserved.
- Eₙ₊₁ is inserted at its correct position; existing events do not shift relative to each other.

**Rationale:** Contract G-ORD-3. Stable ordering enables incremental UI updates.

---

### 2.3 Backdating Integrity

**INV-TEMP-06: Backdated events integrate correctly**

For any event E with event_timestamp in the past:
- E must appear at the chronological position determined by its event_timestamp.
- E must not corrupt the position of events with event_timestamps before or after it.
- E's recorded_timestamp must reflect the actual documentation time.

**Rationale:** Contract G-ORD-4. Clinical reality often requires documenting past events.

---

**INV-TEMP-07: Backdating does not enable history rewriting**

For any backdated event E:
- E may not modify, replace, or obscure any previously existing event.
- E is an addition to history, not a modification of history.
- The gap between event_timestamp and recorded_timestamp remains visible.

**Rationale:** Audit transparency. Backdating is permitted but must be transparent.

---

### 2.4 Timestamp Consistency

**INV-TEMP-08: Event timestamps are immutable**

For any event E:
- E.event_timestamp at time T must equal E.event_timestamp at any time T' > T.
- E.recorded_timestamp at time T must equal E.recorded_timestamp at any time T' > T.

**Rationale:** Contract G-PRES-1. Timestamps determine ordering and are immutable.

---

**INV-TEMP-09: Future events are prohibited**

For any event E:
- E.event_timestamp must be ≤ the current date at time of creation.
- No mechanism may create or modify an event to have a future event_timestamp.

**Rationale:** The timeline represents what has occurred, not what is planned.

---

**INV-TEMP-10: Recorded timestamp reflects documentation time**

For any event E created at system time T:
- E.recorded_timestamp must be within a reasonable tolerance of T.
- E.recorded_timestamp must not be manually specified or overridden.

**Rationale:** Recorded timestamp provides audit transparency for documentation timing.

---

## 3. Historical Integrity Invariants

These invariants ensure that the historical record remains complete, accurate, and traceable.

### 3.1 Non-Destructive Operations

**INV-HIST-01: No destructive edits to finalized documentation**

For any finalized Note N:
- N.subjective, N.objective, N.assessment, N.plan must remain unchanged after finalization.
- N.encounter_date and N.encounter_type must remain unchanged after finalization.
- N.finalized_at must remain unchanged after finalization.

**Rationale:** Contract G-PRES-2. Legal and clinical integrity requires immutability.

---

**INV-HIST-02: Discontinued medications are immutable**

For any Medication M with status = Discontinued:
- All fields of M must remain unchanged after discontinuation.
- M.start_date, M.end_date, M.discontinuation_reason must be preserved.

**Rationale:** Medication history must reflect what was documented at discontinuation time.

---

**INV-HIST-03: Psychiatric history versions are immutable**

For any PsychiatricHistory version V:
- V.content must remain unchanged after creation.
- V.created_at must remain unchanged after creation.
- V.superseded_at, once set, must remain unchanged.

**Rationale:** Each version represents a point-in-time snapshot that must be preserved.

---

### 3.2 Correction Transparency

**INV-HIST-04: Corrections preserve original data**

For any correction to clinical information:
- The original information must remain accessible.
- The correction must be additive (addendum, new version, documented discontinuation).
- No correction mechanism may overwrite or hide the original.

**Rationale:** Contract G-PRES-3. Both original and correction must be visible.

---

**INV-HIST-05: Addenda cannot exist without parent notes**

For any Addendum A:
- A.parent_note must reference a valid, finalized Note.
- If A exists, its parent Note must exist and be retrievable.

**Rationale:** Addenda are amendments to existing documentation, not standalone entities.

---

**INV-HIST-06: Addenda are immutable from creation**

For any Addendum A:
- A.content and A.reason must remain unchanged after creation.
- A.created_at must remain unchanged after creation.

**Rationale:** Amendments themselves become part of the permanent record.

---

### 3.3 Traceability

**INV-HIST-07: Version chains are unbroken**

For any PsychiatricHistory with versions V₁, V₂, ..., Vₙ:
- version_number forms a contiguous sequence from 1 to n.
- Each version Vᵢ (i > 1) has a predecessor Vᵢ₋₁.
- No gaps exist in the version sequence.

**Rationale:** Contract G-PRES-4. Version history must be traversable.

---

**INV-HIST-08: Medication predecessor chains are acyclic**

For any Medication M with predecessor_id:
- Following predecessor_id references must eventually terminate (reach null).
- No cycle may exist where M eventually references itself through predecessors.

**Rationale:** Contract G-PRES-4. Medication evolution must be traceable without infinite loops.

---

**INV-HIST-09: Superseded information remains accessible**

For any superseded clinical information (old history versions, discontinued medications, notes with addenda):
- The superseded information must remain queryable.
- Access mechanisms must exist to retrieve superseded data.

**Rationale:** Contract ACCESS-SUPERSEDED. No clinical information is ever hidden.

---

## 4. Clinical State Invariants

These invariants ensure that derived clinical states are consistent with the underlying events.

### 4.1 Medication State Consistency

**INV-STATE-01: Active medications are consistent with lifecycle events**

For any patient P at time T:
- A medication M is active if and only if: M.start_date ≤ T AND (M.end_date IS NULL OR M.end_date > T).
- The set of active medications must be deterministically derivable from the timeline.

**Rationale:** Contract G-STATE-3. Medication state must be accurately reconstructable.

---

**INV-STATE-02: Medication cannot be simultaneously active and stopped**

For any medication M at any point in time:
- M.status = Active implies M.end_date IS NULL OR M.end_date > current_date.
- M.status = Discontinued implies M.end_date IS NOT NULL AND M.end_date ≤ current_date.
- No medication may have contradictory status and date values.

**Rationale:** Logical consistency. Mutually exclusive states must not coexist.

---

**INV-STATE-03: Medication end date is on or after start date**

For any medication M with both start_date and end_date:
- M.end_date ≥ M.start_date.
- Zero-duration medications (same-day start and stop) are permitted.
- Negative-duration medications are prohibited.

**Rationale:** Temporal logic. Medications cannot end before they begin.

---

### 4.2 Psychiatric History State Consistency

**INV-STATE-04: Exactly one current psychiatric history version**

For any patient P with psychiatric history:
- Exactly one version V must have is_current = true.
- All other versions must have is_current = false.
- No state may exist with zero current versions or multiple current versions.

**Rationale:** The "current" history must be unambiguous.

---

**INV-STATE-05: Current version has no superseded_at timestamp**

For any PsychiatricHistory version V where is_current = true:
- V.superseded_at must be NULL.
- A version with superseded_at set cannot be current.

**Rationale:** Supersession marks the end of a version's currency.

---

**INV-STATE-06: Historical version determination is unambiguous**

For any target_date D and patient P:
- At most one psychiatric history version was current on date D.
- The current version on D is the one where: created_at ≤ D AND (superseded_at IS NULL OR superseded_at > D).

**Rationale:** Contract G-STATE-4. Point-in-time reconstruction must be deterministic.

---

### 4.3 Note and Encounter State Consistency

**INV-STATE-07: Finalized notes have exactly one encounter event**

For any Note N with status = Finalized:
- Exactly one Encounter event E must exist with source_identifier = N.id.
- The event must have been created at or after N.finalized_at.

**Rationale:** Contract WRITE-EVENT-ENCOUNTER. Note finalization triggers event creation.

---

**INV-STATE-08: Draft notes have no timeline events**

For any Note N with status = Draft:
- No clinical event may exist with source_identifier = N.id.
- Draft notes are invisible to the timeline.

**Rationale:** Contract G-HIST-4. Only finalized documentation appears on the timeline.

---

**INV-STATE-09: Appointments are excluded from the timeline**

For any Appointment A:
- No clinical event may exist that references A.
- Appointments do not generate timeline events regardless of status.

**Rationale:** Contract G-HIST-4. Appointments are administrative, not clinical events.

---

## 5. Contract Compliance Invariants

These invariants ensure adherence to the formal Timeline Engine contracts.

### 5.1 Read Contract Compliance

**INV-CONTRACT-01: Full timeline reads match contract shape**

For any READ-TIMELINE-FULL response:
- Response must include: patient_identifier, event_count, events array.
- event_count must equal events.length.
- Each event must include all required fields per contract specification.

**Rationale:** Contract READ-TIMELINE-FULL defines the exact output shape.

---

**INV-CONTRACT-02: Current state reads match contract shape**

For any READ-STATE-CURRENT response:
- Response must include: patient_identifier, as_of_date, active_medications, current_psychiatric_history.
- most_recent_note may be null if no finalized notes exist.
- as_of_date must be the current date.

**Rationale:** Contract READ-STATE-CURRENT defines the exact output shape.

---

**INV-CONTRACT-03: Historical state reads match contract shape**

For any READ-STATE-HISTORICAL response:
- Response must include: patient_identifier, as_of_date, events_through_date, active_medications_on_date.
- psychiatric_history_on_date may be null for dates before first version.
- as_of_date must equal the requested target_date.

**Rationale:** Contract READ-STATE-HISTORICAL defines the exact output shape.

---

### 5.2 Write Contract Compliance

**INV-CONTRACT-04: Event creation enforces required fields**

For any event creation attempt:
- Missing event_timestamp must result in MISSING_EVENT_TIMESTAMP error.
- Missing event_type must result in MISSING_EVENT_TYPE error.
- Missing title must result in MISSING_TITLE error.
- Missing clinical_record_identifier must result in MISSING_CLINICAL_RECORD error.

**Rationale:** Contract ERROR-MISSING-DATA. Required fields are mandatory.

---

**INV-CONTRACT-05: Invalid data is rejected deterministically**

For any event creation attempt with invalid data:
- Future event_timestamp must result in INVALID_TIMESTAMP_FUTURE error.
- Invalid event_type must result in INVALID_EVENT_TYPE error.
- Medication end_date before start_date must result in INVALID_DATE_RANGE error.
- Invalid source reference must result in INVALID_SOURCE_REFERENCE error.

**Rationale:** Contract ERROR-INVALID-DATA. Validation is deterministic.

---

**INV-CONTRACT-06: Successful writes are immediately queryable**

For any event E successfully created:
- E must appear in the next READ-TIMELINE-FULL query for the same patient.
- E must be retrievable by READ-EVENT-SINGLE immediately after creation.
- No eventual consistency delay may cause E to be temporarily invisible.

**Rationale:** Contract post-conditions. Created events are immediately queryable.

---

### 5.3 Error Contract Compliance

**INV-CONTRACT-07: Non-existent patients produce PATIENT_NOT_FOUND**

For any timeline read operation on a non-existent patient_identifier:
- The operation must fail with error code PATIENT_NOT_FOUND.
- No empty timeline result may be returned for non-existent patients.

**Rationale:** Contract failure conditions. Non-existence is an error, not an empty result.

---

**INV-CONTRACT-08: Non-existent events produce EVENT_NOT_FOUND**

For any READ-EVENT-SINGLE on a non-existent event_identifier:
- The operation must fail with error code EVENT_NOT_FOUND.
- No null or empty result may be returned.

**Rationale:** Contract failure conditions. Missing events are errors.

---

## 6. UX-Consumption Invariants

These invariants ensure that the UX layer receives consistent, predictable data.

### 6.1 Render Consistency

**INV-UX-01: Timeline renders identically given identical inputs**

For any timeline query with parameters P at time T:
- The result R must be identical for repeated queries with the same P at time T.
- No randomization, caching anomalies, or race conditions may produce different results.

**Rationale:** Determinism guarantee. UX must display consistent data.

---

**INV-UX-02: No hidden reordering at presentation time**

For any timeline data retrieved by the engine:
- UX must receive events in the order determined by the engine.
- No UX-layer sorting may contradict engine ordering.
- If UX applies additional sorting, it must be explicit and reversible.

**Rationale:** Ordering is an engine responsibility. UX displays what engine provides.

---

**INV-UX-03: Empty states are explicit, not null**

For any patient with no timeline events:
- READ-TIMELINE-FULL must return: events = [], event_count = 0.
- The response must not be null, undefined, or an error.
- Empty timeline is a valid state for new patients.

**Rationale:** Contract failure conditions. Empty timeline ≠ non-existent patient.

---

### 6.2 Data Completeness

**INV-UX-04: Source references are resolvable**

For any event E with source_type ≠ null:
- READ-EVENT-SOURCE for E.identifier must return the source entity.
- If the source is corrupted, SOURCE_UNAVAILABLE error must be returned (not silent failure).

**Rationale:** Source links enable navigation from event to full documentation.

---

**INV-UX-05: Addenda are always included with parent notes**

For any Note source retrieval:
- All addenda for the note must be included in the response.
- Addenda must be ordered chronologically.
- No addendum may be omitted or hidden.

**Rationale:** Contract READ-EVENT-SOURCE. Notes and addenda are inseparable.

---

**INV-UX-06: Medication history includes all lifecycle events**

For any patient's medication history view:
- All Medication Start events must be visible.
- All Medication Change events must be visible.
- All Medication Stop events must be visible.
- The complete lifecycle of each medication is traceable.

**Rationale:** Medication evolution is essential for clinical decision-making.

---

## 7. Failure and Regression Scenarios

These scenarios must be tested to prevent regressions. Each scenario corresponds to one or more invariants.

### 7.1 Editing Past Notes

| Scenario | Expected Behavior | Invariants Tested |
|----------|-------------------|-------------------|
| Attempt to modify finalized note content | Operation rejected; content unchanged | INV-HIST-01 |
| Add addendum to finalized note | Addendum created; original unchanged | INV-HIST-04, INV-HIST-06 |
| Attempt to delete finalized note | Operation rejected; note persists | INV-HIST-01 |
| Attempt to change encounter date after finalization | Operation rejected; date unchanged | INV-HIST-01 |

### 7.2 Adding Late Events

| Scenario | Expected Behavior | Invariants Tested |
|----------|-------------------|-------------------|
| Backdate event by one week | Event appears at correct chronological position | INV-TEMP-06 |
| Backdate event by one year | Event appears at correct position; recorded_timestamp reflects today | INV-TEMP-06, INV-TEMP-10 |
| Add backdated event between existing events | Existing event order preserved; new event inserted | INV-TEMP-05, INV-TEMP-06 |
| Attempt to create future-dated event | Operation rejected with INVALID_TIMESTAMP_FUTURE | INV-TEMP-09, INV-CONTRACT-05 |

### 7.3 Concurrent Event Creation

| Scenario | Expected Behavior | Invariants Tested |
|----------|-------------------|-------------------|
| Two events created at same system timestamp | Both events exist; ordering is deterministic | INV-TEMP-02, INV-TEMP-03 |
| Same-day events with different types | Events ordered by type priority | INV-TEMP-04 |
| Same-day, same-type events | Events ordered by identifier | INV-TEMP-04 |
| Rapid sequential event creation | All events persist; none lost | INV-TEMP-01, INV-TEMP-02 |

### 7.4 Partial or Missing Data

| Scenario | Expected Behavior | Invariants Tested |
|----------|-------------------|-------------------|
| Event creation without timestamp | MISSING_EVENT_TIMESTAMP error | INV-CONTRACT-04 |
| Event creation without title | MISSING_TITLE error | INV-CONTRACT-04 |
| Medication creation without start_date | MISSING_EVENT_TIMESTAMP error (via medication validation) | INV-CONTRACT-04 |
| Query for non-existent patient | PATIENT_NOT_FOUND error | INV-CONTRACT-07 |
| Query for non-existent event | EVENT_NOT_FOUND error | INV-CONTRACT-08 |

### 7.5 State Reconstruction

| Scenario | Expected Behavior | Invariants Tested |
|----------|-------------------|-------------------|
| Query current state after medication discontinuation | Medication absent from active list | INV-STATE-01, INV-STATE-02 |
| Query historical state on date before medication start | Medication absent from that date's active list | INV-STATE-01 |
| Query historical state between medication start and stop | Medication present in that date's active list | INV-STATE-01 |
| Query psychiatric history on date between versions | Correct version returned for that date | INV-STATE-06 |

### 7.6 Correction Workflows

| Scenario | Expected Behavior | Invariants Tested |
|----------|-------------------|-------------------|
| Correct note via addendum | Original and addendum both visible | INV-HIST-04, INV-UX-05 |
| Correct psychiatric history via new version | Old version superseded; new version current | INV-HIST-03, INV-STATE-04 |
| Correct medication via discontinuation and restart | Both medications visible with correct events | INV-HIST-02, INV-STATE-01 |
| Attempt to edit addendum after creation | Operation rejected; addendum unchanged | INV-HIST-06 |

### 7.7 Boundary Conditions

| Scenario | Expected Behavior | Invariants Tested |
|----------|-------------------|-------------------|
| Patient with zero events | Empty timeline returned (not error) | INV-UX-03 |
| Patient with single event | Timeline with one event returned | INV-TEMP-01 |
| Medication started and stopped same day | Both events exist; ordered by type priority | INV-STATE-03, INV-TEMP-04 |
| Psychiatric history version 1 (initial) | No History Update event generated | INV-STATE-07 (Note: version 1 exception) |

---

## 8. Non-Goals

### 8.1 What QA Invariants Do NOT Cover

The following concerns are explicitly outside the scope of these QA invariants:

| Exclusion | Rationale |
|-----------|-----------|
| **Performance thresholds** | Invariants define correctness, not speed. Performance testing is a separate concern. |
| **Concurrency under load** | Single-user MVP assumption. Multi-user concurrency is undefined. |
| **Network failure recovery** | Infrastructure resilience is outside timeline engine scope. |
| **Data migration correctness** | Migration from external systems is not addressed in MVP. |
| **UI rendering fidelity** | Visual correctness is a UX testing concern, not a timeline invariant. |
| **Clinical appropriateness** | The engine records what clinicians document; it does not validate clinical decisions. |
| **Duplicate event detection** | Duplicate prevention is application logic, not engine responsibility. |
| **Full-text search accuracy** | Search is a separate concern from timeline integrity. |
| **Export format compliance** | Data export is outside engine scope. |
| **Audit log completeness** | Access logging is not provided in MVP. |

### 8.2 Invariants Deferred to Post-MVP

The following invariants may be defined in future versions:

- Multi-user concurrent access invariants
- Cross-patient data isolation invariants
- Audit trail invariants
- Data retention policy invariants
- Backup and recovery invariants

### 8.3 Relationship to Other QA Activities

These invariants complement but do not replace:

- **Unit testing** — Tests implementation correctness at the code level.
- **Integration testing** — Tests component interactions.
- **End-to-end testing** — Tests complete user workflows.
- **Security testing** — Tests access control and data protection.
- **Performance testing** — Tests system behavior under load.

Invariants define *what must be true*. Tests verify *that it is true*.

---

## Summary

These QA invariants establish the verification criteria for Timeline Engine correctness.

**Core Principles Encoded:**

1. **Permanence** — Events are never lost (INV-TEMP-01, INV-TEMP-02).
2. **Determinism** — Same inputs produce same outputs (INV-TEMP-03, INV-UX-01).
3. **Immutability** — Created data never changes (INV-TEMP-08, INV-HIST-01 through INV-HIST-03).
4. **Transparency** — Corrections are additive and visible (INV-HIST-04 through INV-HIST-09).
5. **Consistency** — Derived states match underlying events (INV-STATE-01 through INV-STATE-09).
6. **Compliance** — Contracts are honored exactly (INV-CONTRACT-01 through INV-CONTRACT-08).

**Verification Approach:**

Each invariant can be verified by:
1. Constructing a system state that exercises the invariant.
2. Performing operations that could violate the invariant.
3. Asserting that the invariant holds before and after operations.

**Maintenance:**

As the Timeline Engine evolves:
- New invariants may be added (no existing invariants may be removed).
- Invariant violations discovered in production must be treated as critical defects.
- Changes to contracts must be reflected in corresponding invariant updates.

---

*Document Version: 1.0*  
*Status: Final*  
*Depends On: 13_timeline_engine.md, 14_timeline_contracts.md*  
*Consumed By: QA, Development, DevOps*


---

# Vistas

## 25_patient_info_timeline_view.md

# Sistema de Historias Clínicas Psiquiátricas — Información del Paciente en Vista de Timeline

## Overview

Este documento define las especificaciones funcionales para la presentación de información del paciente en la vista de timeline clínica.

La información del paciente proporciona contexto clínico permanente y no forma parte de la timeline de eventos.

Este documento especifica **QUÉ** información del paciente debe mostrarse y **CÓMO** debe comportarse, no **CÓMO** se implementa visualmente.

---

## 1. Propósito de la Información del Paciente en la Vista de Timeline

### 1.1 Contextualización Clínica

La información del paciente en la vista de timeline cumple una función de **contexto permanente**.

Permite al clínico:

- **Identificar inequívocamente al paciente** — Confirmar que está revisando la historia clínica correcta
- **Comprender el contexto demográfico** — La edad del paciente informa la interpretación de eventos clínicos
- **Mantener continuidad narrativa** — La identidad del paciente permanece visible mientras se navega por la timeline
- **Reducir errores de identificación** — La información siempre visible previene confusiones entre pacientes

### 1.2 Separación Conceptual de la Timeline

La información del paciente **NO es parte de la timeline**.

| Aspecto | Información del Paciente | Timeline de Eventos |
|---------|-------------------------|---------------------|
| **Naturaleza** | Contexto estático | Narrativa temporal |
| **Origen** | Entidad Patient | Entidades clínicas (Notes, Medications, ClinicalEvents) |
| **Mutabilidad** | Puede cambiar (actualizaciones administrativas) | Inmutable (eventos históricos) |
| **Posición temporal** | Sin fecha de ocurrencia | Anclada a fechas específicas |
| **Generación de eventos** | Nunca genera eventos | Cada evento es un hecho clínico |

**Principio fundamental:** La información del paciente es el **marco** dentro del cual se desarrolla la timeline, no un **evento** dentro de ella.

### 1.3 Rol en la Experiencia Clínica

La información persistente del paciente:

- **Facilita la revisión longitudinal** — El clínico puede desplazarse por años de historia sin perder la identidad del paciente
- **Apoya la toma de decisiones** — La edad y el estado del paciente informan la interpretación de eventos
- **Mejora la seguridad clínica** — La identificación constante reduce el riesgo de errores de identidad
- **Mantiene el contexto durante la documentación** — Al crear nuevos eventos, el clínico siempre tiene visible a quién está documentando

---

## 2. Definición de "Información del Paciente"

### 2.1 Qué Constituye Información del Paciente

La información del paciente comprende **datos de identidad y estado administrativo** que identifican al individuo y su relación operativa con el sistema.

Esta información proviene exclusivamente de la entidad **Patient** y no incluye ningún dato clínico.

### 2.2 Datos de Identidad

Los datos de identidad son aquellos que identifican únicamente al paciente:

| Campo | Propósito | Fuente |
|-------|-----------|--------|
| **Nombre completo** | Identificación primaria del paciente | Patient.fullName |
| **Fecha de nacimiento** | Identificación y cálculo de edad | Patient.dateOfBirth |
| **Edad** | Contexto demográfico derivado | Calculada desde Patient.dateOfBirth |

**Características:**
- Son datos administrativos, no clínicos
- Pueden modificarse (correcciones, cambios legales)
- No generan eventos en la timeline cuando cambian
- Son necesarios para la identificación inequívoca

**Exclusión explícita:** El identificador interno (Patient.id) **NUNCA debe mostrarse** en la vista de timeline. Es un dato técnico del sistema que no es relevante para el contexto clínico.

### 2.3 Datos Administrativos Relevantes

Los datos administrativos relevantes para el contexto clínico:

| Campo | Propósito | Fuente |
|-------|-----------|--------|
| **Estado del paciente** | Indica si el paciente está activo en el sistema | Patient.status |

**Características:**
- El estado (Activo/Inactivo) es relevante para el contexto clínico
- Indica si el paciente está recibiendo atención actualmente
- No afecta la accesibilidad de la historia clínica
- No genera eventos cuando cambia

### 2.4 Estructura de Presentación

La información del paciente se presenta en dos niveles:

**Nivel 1 - Header Principal (siempre visible):**
- Información esencial de identidad: nombre, edad, fecha de nacimiento, estado
- Ubicación: Header fijo en la parte superior de la vista

**Nivel 2 - Panel de Información (acceso rápido):**
- Información administrativa completa: datos de contacto, contacto de emergencia
- Ubicación: Panel en la columna lateral, debajo de los paneles de medicamentos, turnos y notas
- **Exclusión:** El identificador interno nunca se muestra en este panel ni en ningún lugar de la vista

### 2.5 Exclusiones Explícitas

La siguiente información **NO forma parte** de la información del paciente en la vista de timeline:

| Información Excluida | Razón |
|---------------------|-------|
| **Información clínica resumida** | Pertenece a la timeline, no al contexto del paciente |
| **Indicadores de riesgo o alertas** | Son información clínica, no identidad |
| **Historial psiquiátrico** | Es contenido clínico, no información del paciente |
| **Medicamentos actuales** | Son eventos clínicos, no datos del paciente |
| **Última consulta** | Es un evento de timeline, no información del paciente |
| **Fechas de registro o actualización** | Son metadatos del sistema, no identidad |

**Principio de exclusión:** La información clínica pertenece a la timeline. Los metadatos del sistema no se muestran. Los datos administrativos (contacto, emergencia) se muestran en el panel de información.

---

## 3. Ubicación Conceptual en la Vista

### 3.1 Información Persistente

La información del paciente debe estar **siempre visible** en la vista de timeline, independientemente de:

- La posición del scroll en la timeline
- La fecha del evento más reciente o más antiguo visible
- El filtro temporal aplicado (si existe)
- La cantidad de eventos en la timeline

**Garantía funcional:** El clínico siempre puede ver la identidad del paciente sin necesidad de desplazarse o realizar acciones adicionales.

### 3.2 Separación Clara Respecto de la Timeline

La información del paciente debe estar **conceptualmente separada** de la timeline de eventos.

| Característica | Información del Paciente | Timeline de Eventos |
|----------------|-------------------------|---------------------|
| **Posición visual** | Área persistente (header, sidebar, panel fijo) | Área de scroll (contenido principal) |
| **Comportamiento al scroll** | Permanece fija | Se desplaza con el contenido |
| **Ordenamiento** | Sin orden (información estática) | Ordenada cronológicamente |
| **Interacción** | Solo lectura (no editable desde timeline) | Interactiva (navegación, expansión) |

**Principio de separación:** La información del paciente y la timeline deben ser visualmente y funcionalmente distinguibles.

### 3.3 Independencia del Scroll Cronológico

La información del paciente **no depende** del scroll cronológico de la timeline.

| Escenario | Comportamiento Esperado |
|-----------|------------------------|
| **Timeline vacía** | La información del paciente sigue visible |
| **Scroll al inicio** | La información del paciente sigue visible |
| **Scroll al final** | La información del paciente sigue visible |
| **Navegación a fecha específica** | La información del paciente sigue visible |
| **Filtrado de eventos** | La información del paciente sigue visible |

**Garantía:** La visibilidad de la información del paciente es independiente del estado de navegación de la timeline.

---

## 4. Campos Mínimos a Mostrar

### 4.1 Información en el Header Principal

El header principal (siempre visible) muestra la información esencial de identidad:

| Campo | Descripción | Formato | Ubicación |
|-------|-------------|---------|-----------|
| **Nombre completo** | Nombre legal del paciente | Texto completo tal como está registrado | Header principal |
| **Edad** | Edad actual del paciente | Número de años derivado de fecha de nacimiento | Header principal |
| **Fecha de nacimiento** | Fecha de nacimiento del paciente | Formato de fecha legible (ej: "15 de marzo de 1985") | Header principal |
| **Estado del paciente** | Estado operativo en el sistema | "Activo" o "Inactivo" | Header principal |

### 4.2 Información en el Panel de Datos del Paciente

Un panel separado ubicado debajo de los paneles de medicamentos, turnos y notas muestra información administrativa completa:

| Campo | Descripción | Formato | Ubicación |
|-------|-------------|---------|-----------|
| **Datos de contacto** | Teléfono, email, dirección del paciente | Texto según corresponda | Panel de información (opcional) |
| **Contacto de emergencia** | Nombre, teléfono y relación del contacto de emergencia | Texto según corresponda | Panel de información (opcional) |

**Restricción absoluta:** El identificador interno (ID del paciente) **NUNCA debe mostrarse** en ningún lugar de la vista de timeline, ni en el header ni en el panel de información. Es un dato técnico del sistema que no es relevante para el contexto clínico.

### 4.2 Cálculo de Edad

La edad debe calcularse dinámicamente desde la fecha de nacimiento:

- **Cálculo:** Edad = Año actual - Año de nacimiento (ajustado por mes y día)
- **Actualización:** La edad se recalcula automáticamente sin intervención del usuario
- **Precisión:** Debe reflejar la edad exacta del paciente en la fecha actual
- **Formato:** Número entero seguido de "años" (ej: "39 años")

**Regla de cálculo:** Si la fecha de cumpleaños aún no ha ocurrido en el año actual, la edad se reduce en 1 año.

### 4.3 Formato de Fecha de Nacimiento

La fecha de nacimiento debe mostrarse en formato legible:

- **Formato preferido:** "DD de [mes] de YYYY" (ej: "15 de marzo de 1985")
- **Alternativa aceptable:** Formato numérico estándar si el formato completo no es viable
- **Idioma:** Español
- **Consistencia:** El formato debe ser consistente en toda la aplicación

### 4.4 Presentación del Estado

El estado del paciente debe mostrarse claramente:

- **Valores:** "Activo" o "Inactivo"
- **Idioma:** Español
- **Visibilidad:** Debe ser claramente distinguible (puede usar indicadores visuales adicionales)

### 4.3 Ubicación del Panel de Información

El panel de información del paciente debe estar ubicado:

- **Debajo de los paneles de medicamentos, turnos y notas** — En la columna lateral derecha
- **En la misma columna** que los otros paneles de acceso rápido
- **Siempre visible** — No requiere scroll para acceder cuando los otros paneles están visibles

**Estructura visual:**
```
Columna Lateral (1/3 ancho)
├── Panel de Medicamentos
├── Panel de Turnos
├── Panel de Notas
└── Panel de Información del Paciente ← Nueva ubicación
```

### 4.4 Campos Excluidos

Los siguientes campos **NO** se muestran en ningún lugar de la vista de timeline:

- **Identificador interno (ID del paciente)** — Restricción absoluta: nunca debe mostrarse
- Fecha de registro
- Fechas de creación/actualización del registro
- Metadatos del sistema

**Razón:** El identificador interno es un dato técnico del sistema usado internamente para referencias, pero no es relevante para el contexto clínico. Los demás son metadatos técnicos que tampoco aportan al contexto clínico.

---

## 5. Reglas de Comportamiento

### 5.1 No Editable Desde la Timeline

La información del paciente **NO puede editarse** desde la vista de timeline.

| Acción | Comportamiento |
|--------|----------------|
| **Clic en nombre** | No inicia edición |
| **Clic en fecha de nacimiento** | No inicia edición |
| **Clic en estado** | No inicia edición |
| **Hover sobre campos** | No muestra indicadores de edición |

**Razón:** La edición de datos del paciente es una operación administrativa que debe realizarse desde el módulo de gestión de pacientes, no desde la vista clínica.

**Excepción:** No hay excepciones. La información del paciente es de solo lectura en la vista de timeline.

### 5.2 Cambios Administrativos No Impactan la Timeline

Cuando los datos del paciente se actualizan desde el módulo de gestión de pacientes:

| Tipo de Cambio | Impacto en Timeline |
|----------------|---------------------|
| **Cambio de nombre** | La información mostrada se actualiza, pero NO se genera evento |
| **Corrección de fecha de nacimiento** | La edad se recalcula, pero NO se genera evento |
| **Cambio de estado (Activo ↔ Inactivo)** | El estado mostrado se actualiza, pero NO se genera evento |
| **Actualización de contacto** | No afecta la información mostrada (contacto no se muestra) |

**Garantía explícita:** Ninguna actualización de datos del paciente genera eventos en la timeline. Los cambios administrativos son independientes de la narrativa clínica.

### 5.3 Información Siempre Consistente

La información del paciente mostrada en la timeline **DEBE** ser siempre consistente con el registro actual del paciente.

| Escenario | Comportamiento |
|-----------|----------------|
| **Actualización de nombre** | La timeline muestra el nombre actualizado inmediatamente |
| **Corrección de fecha de nacimiento** | La edad se recalcula y muestra el valor correcto |
| **Cambio de estado** | El estado mostrado refleja el estado actual |
| **Paciente desactivado** | El estado muestra "Inactivo" |

**Garantía de consistencia:** La información mostrada siempre refleja el estado actual de la entidad Patient, sin retrasos ni cachés obsoletos.

### 5.4 Actualización en Tiempo Real

Cuando los datos del paciente cambian:

- **Actualización inmediata:** La información visible se actualiza sin requerir recarga de la página
- **Sin eventos:** La actualización no genera eventos ni notificaciones en la timeline
- **Transparente:** El cambio es visible pero no interrumpe la navegación de la timeline

**Comportamiento esperado:** Si el clínico tiene abierta la timeline y actualiza los datos del paciente en otra vista, la información en la timeline se actualiza automáticamente.

---

## 6. Relación con ClinicalRecord y Timeline

### 6.1 La Información Pertenece al Paciente

La información mostrada en la timeline **pertenece a la entidad Patient**, no a ClinicalRecord ni a la Timeline.

| Entidad | Responsabilidad |
|---------|-----------------|
| **Patient** | Almacena y gestiona la información de identidad y estado |
| **ClinicalRecord** | Contiene la timeline y eventos clínicos, pero NO la información del paciente |
| **Timeline** | Presenta eventos clínicos, pero NO incluye información del paciente como evento |

**Principio de propiedad:** La información del paciente es propiedad de Patient. La timeline solo la **muestra** como contexto, no la **posee**.

### 6.2 La Timeline Pertenece al Registro Clínico

La timeline de eventos **pertenece a ClinicalRecord**, que a su vez pertenece a Patient.

| Relación | Descripción |
|----------|-------------|
| **Patient → ClinicalRecord** | Un paciente tiene exactamente un registro clínico |
| **ClinicalRecord → Timeline** | El registro clínico contiene la timeline de eventos |
| **Patient → Información mostrada** | El paciente proporciona la información de contexto |

**Separación de responsabilidades:** Patient proporciona contexto. ClinicalRecord proporciona contenido clínico.

### 6.3 No Mezclar Responsabilidades

Las responsabilidades deben mantenerse estrictamente separadas:

| Responsabilidad | Entidad Responsable | NO Responsable |
|-----------------|---------------------|----------------|
| **Identidad del paciente** | Patient | ClinicalRecord, Timeline |
| **Eventos clínicos** | ClinicalRecord (Timeline) | Patient |
| **Contexto en la vista** | Vista de Timeline (lee de Patient) | Patient (solo almacena) |
| **Narrativa clínica** | Timeline | Patient |

**Principio de separación:** Cada entidad tiene responsabilidades claras y no debe asumir las de otras.

### 6.4 Integración en la Vista

La vista de timeline **integra** información de ambas fuentes:

```
Vista de Timeline
├── Header Principal (fuente: Patient)
│   ├── Nombre completo
│   ├── Edad
│   ├── Fecha de nacimiento
│   └── Estado
│
├── Columna Lateral
│   ├── Panel de Medicamentos
│   ├── Panel de Turnos
│   ├── Panel de Notas
│   └── Panel de Información del Paciente (fuente: Patient)
│       ├── Datos de contacto (opcional)
│       └── Contacto de emergencia (opcional)
│       └── [Identificador interno NUNCA se muestra]
│
└── Timeline de Eventos (fuente: ClinicalRecord)
    ├── Evento 1
    ├── Evento 2
    └── ...
```

**Integración, no fusión:** La vista combina información de Patient y ClinicalRecord, pero mantiene la separación conceptual y funcional.

---

## 7. Impacto en UX Clínico

### 7.1 Reducción de Errores de Identificación

La información persistente del paciente reduce errores de identificación:

| Escenario de Riesgo | Mitigación |
|---------------------|------------|
| **Múltiples pestañas abiertas** | El nombre siempre visible permite confirmar el paciente correcto |
| **Navegación entre pacientes** | La identidad visible previene documentación en el paciente equivocado |
| **Revisión de historias similares** | La edad y nombre permiten distinguir pacientes con nombres similares |
| **Sesiones prolongadas** | La identidad constante previene confusión después de pausas |

**Beneficio:** El clínico siempre sabe con certeza a qué paciente está documentando o revisando.

### 7.2 Mejora de Continuidad Narrativa

La información persistente mejora la continuidad de la narrativa clínica:

| Aspecto | Beneficio |
|---------|-----------|
| **Contexto demográfico constante** | La edad visible informa la interpretación de eventos (ej: medicación en paciente joven vs. mayor) |
| **Identidad estable** | El nombre visible mantiene la conexión emocional y profesional con el paciente |
| **Estado operativo claro** | El estado visible indica si el paciente está en atención activa |

**Beneficio:** El clínico mantiene el contexto completo mientras navega por la historia longitudinal.

### 7.3 Acceso Rápido al Contexto

La información siempre visible proporciona acceso inmediato al contexto esencial:

| Necesidad del Clínico | Solución |
|-----------------------|----------|
| **Confirmar identidad antes de documentar** | Nombre siempre visible |
| **Calcular edad para decisión clínica** | Edad calculada y visible |
| **Verificar estado del paciente** | Estado siempre visible |
| **Contexto para interpretar eventos** | Información demográfica constante |

**Beneficio:** El clínico no necesita navegar a otra vista para obtener información básica del paciente.

### 7.4 Experiencia de Uso Optimizada

La información persistente optimiza el flujo de trabajo clínico:

- **Menos clics:** No es necesario abrir el perfil del paciente para ver información básica
- **Menos cambios de contexto:** El clínico permanece en la vista de timeline
- **Mayor confianza:** La identidad constante genera confianza en la documentación
- **Mejor eficiencia:** Menos interrupciones para verificar información

**Beneficio general:** La experiencia clínica es más fluida y eficiente.

---

## 8. Casos Fuera de Alcance

### 8.1 Edición de Datos del Paciente

La edición de datos del paciente **NO es responsabilidad** de la vista de timeline.

| Operación | Dónde se Realiza |
|-----------|------------------|
| **Actualizar nombre** | Módulo de gestión de pacientes |
| **Corregir fecha de nacimiento** | Módulo de gestión de pacientes |
| **Cambiar estado** | Módulo de gestión de pacientes |
| **Actualizar contacto** | Módulo de gestión de pacientes |

**Razón:** La edición es una operación administrativa que requiere validación y flujos específicos del módulo de pacientes.

### 8.2 Información Clínica Resumida

La información clínica resumida **NO forma parte** de la información del paciente.

| Información Excluida | Razón |
|---------------------|-------|
| **Última consulta** | Es un evento de timeline, no información del paciente |
| **Medicamentos actuales** | Son eventos clínicos, no datos del paciente |
| **Diagnóstico principal** | Es información clínica, no identidad |
| **Próxima cita** | Es información de Appointments, no de Patient |
| **Resumen de síntomas** | Es contenido clínico, no información del paciente |

**Principio:** Solo se muestra información de identidad y estado. Toda información clínica pertenece a la timeline.

### 8.3 Indicadores de Riesgo o Alertas

Los indicadores de riesgo o alertas clínicas **NO forman parte** de la información del paciente.

| Tipo de Indicador | Dónde Pertenece |
|-------------------|-----------------|
| **Alertas de medicación** | Timeline o vista de medicamentos |
| **Indicadores de riesgo** | Timeline o vista de evaluación |
| **Notas importantes** | Timeline o notas clínicas |
| **Alertas del sistema** | Sistema de notificaciones (fuera de timeline) |

**Razón:** Los indicadores de riesgo son información clínica, no información de identidad del paciente.

### 8.4 Información de Contacto

Los datos de contacto **NO se muestran** en la vista de timeline.

| Campo Excluido | Razón |
|----------------|-------|
| **Teléfono** | No es necesario para el contexto clínico en la timeline |
| **Email** | No es necesario para el contexto clínico en la timeline |
| **Dirección** | No es necesario para el contexto clínico en la timeline |
| **Contacto de emergencia** | No es información del paciente, es información administrativa |

**Razón:** La información de contacto no es relevante para la revisión de la timeline clínica. Puede accederse desde el módulo de pacientes si es necesario.

### 8.5 Metadatos del Sistema

Los metadatos del sistema **NO se muestran** en la información del paciente.

| Metadato Excluido | Razón |
|-------------------|-------|
| **Fecha de registro** | Es metadato administrativo, no identidad |
| **Fecha de creación** | Es metadato técnico, no identidad |
| **Fecha de última actualización** | Es metadato técnico, no identidad |
| **Usuario que creó el registro** | Es metadato de auditoría, no identidad |

**Razón:** Los metadatos del sistema no son relevantes para el contexto clínico en la timeline.

---

## 9. Garantías Funcionales

### 9.1 Visibilidad Permanente

**Garantía:** La información del paciente está siempre visible en la vista de timeline, independientemente del estado de navegación.

| Condición | Garantía |
|-----------|----------|
| **Timeline vacía** | Información del paciente visible |
| **Scroll en cualquier posición** | Información del paciente visible |
| **Filtros aplicados** | Información del paciente visible |
| **Navegación a fecha específica** | Información del paciente visible |

### 9.2 Consistencia con Patient

**Garantía:** La información mostrada siempre refleja el estado actual de la entidad Patient.

| Actualización en Patient | Efecto en Vista |
|--------------------------|-----------------|
| **Cambio de nombre** | Nombre actualizado inmediatamente |
| **Corrección de fecha de nacimiento** | Edad recalculada inmediatamente |
| **Cambio de estado** | Estado actualizado inmediatamente |

### 9.3 No Generación de Eventos

**Garantía:** Ninguna actualización de información del paciente genera eventos en la timeline.

| Operación | Garantía |
|-----------|----------|
| **Actualización de nombre** | No genera ClinicalEvent |
| **Corrección de fecha de nacimiento** | No genera ClinicalEvent |
| **Cambio de estado** | No genera ClinicalEvent |

### 9.4 Separación de Responsabilidades

**Garantía:** La información del paciente y la timeline mantienen responsabilidades separadas.

| Responsabilidad | Entidad |
|-----------------|---------|
| **Almacenar información del paciente** | Patient |
| **Mostrar información del paciente** | Vista de Timeline |
| **Gestionar eventos clínicos** | ClinicalRecord (Timeline) |
| **Presentar eventos clínicos** | Vista de Timeline |

---

## 10. Restricciones de Implementación

### 10.1 No Modificar Schema

Este documento **NO especifica** cambios al schema de base de datos.

- La entidad Patient ya existe y contiene los campos necesarios
- No se requieren nuevos campos
- No se requieren nuevas relaciones
- No se requieren nuevas tablas

**Razón:** La especificación define qué información mostrar, no cómo almacenarla.

### 10.2 No Agregar Lógica de Negocio

Este documento **NO especifica** nueva lógica de negocio.

- El cálculo de edad es una operación de presentación, no lógica de negocio
- La actualización de información es responsabilidad del módulo de pacientes
- No se requieren nuevas reglas de validación
- No se requieren nuevos procesos de negocio

**Razón:** La especificación define comportamiento de presentación, no reglas de negocio.

### 10.3 No Definir Layout Visual

Este documento **NO especifica** el layout visual concreto.

- No define posición exacta (header, sidebar, panel)
- No define estilos visuales
- No define componentes específicos
- No define animaciones o transiciones

**Razón:** La especificación es funcional, no de diseño. El layout es responsabilidad de la implementación de UX.

### 10.4 No Duplicar Información Clínica

Este documento **NO permite** duplicar información clínica en la información del paciente.

- No se muestra información de eventos en la sección del paciente
- No se muestra información de medicamentos en la sección del paciente
- No se muestra información de notas en la sección del paciente

**Razón:** La información clínica pertenece a la timeline, no al contexto del paciente.

---

## 11. Resumen

### 11.1 Qué Es

La información del paciente en la vista de timeline es:

- **Contexto permanente** que identifica al paciente y proporciona datos demográficos esenciales
- **Información de solo lectura** que no puede editarse desde la timeline
- **Información siempre visible** independientemente de la navegación en la timeline
- **Información de identidad** que pertenece a la entidad Patient, no a ClinicalRecord

### 11.2 Qué No Es

La información del paciente en la vista de timeline NO es:

- Un evento de timeline
- Información clínica
- Información editable desde la timeline
- Información que genera eventos cuando cambia
- Información de contacto o administrativa detallada

### 11.3 Campos Obligatorios

**En el Header Principal:**
1. Nombre completo
2. Edad (calculada desde fecha de nacimiento)
3. Fecha de nacimiento
4. Estado del paciente (Activo/Inactivo)

**En el Panel de Información:**
5. Datos de contacto (si están disponibles)
6. Contacto de emergencia (si está disponible)

**Restricción:** El identificador interno nunca se muestra en ningún lugar de la vista.

### 11.4 Principios Fundamentales

1. **Separación de responsabilidades:** Patient proporciona contexto, ClinicalRecord proporciona contenido clínico
2. **No generación de eventos:** Los cambios en información del paciente no generan eventos
3. **Visibilidad permanente:** La información siempre está visible
4. **Consistencia:** La información siempre refleja el estado actual de Patient
5. **Solo lectura:** La información no se edita desde la timeline

---

*Versión del Documento: 1.0*  
*Estado: Final*  
*Depende De: 02_domain.md, 03_timeline.md, 18_patient_crud_specs.md*  
*Consumido Por: Implementación de Backend, Implementación de UX, Testing QA*


---

## 25_root_behavior_spec.md

# Sistema de Historias Clínicas Psiquiátricas — Especificación Funcional del Root del Sistema

## Resumen Ejecutivo

Este documento define el comportamiento funcional del punto de entrada raíz del sistema (`/`) y su relación con la lista de pacientes.

El root del sistema actúa como punto de entrada operativo que presenta la lista de pacientes junto con información estadística y operativa de contexto, manteniendo al paciente como eje central del flujo. El root proporciona una vista de situación general del consultorio que facilita decisiones organizativas diarias, sin constituir un dashboard clínico ni mostrar información clínica sensible.

Esta especificación define **QUÉ** debe ocurrir cuando el usuario accede al root, sin describir implementación técnica ni detalles de routing.

**Nota:** Esta especificación actualiza la versión anterior que definía el root como un simple mecanismo de redirección. La actualización incorpora información estadística y operativa manteniendo los principios arquitectónicos fundamentales del sistema.

---

## 1. Propósito del Root del Sistema

### 1.1 Rol como Punto de Entrada

El root del sistema (`/`) es el punto de entrada principal cuando un usuario accede a la aplicación.

El root existe para:

- **Facilitar el acceso inmediato a la lista de pacientes** — Reducir la fricción entre el inicio de sesión y el inicio del trabajo clínico
- **Establecer el contexto clínico** — Orientar al usuario hacia la selección de un paciente como primer paso en cualquier flujo clínico
- **Reflejar la organización del sistema** — Manifestar que el sistema se estructura alrededor del paciente como entidad central
- **Proporcionar contexto operativo** — Ofrecer información estadística y operativa que facilite la orientación diaria del consultorio
- **Facilitar decisiones organizativas** — Presentar información de situación general que apoye la planificación operativa diaria

### 1.2 Propósito Ampliado del Root

El root del sistema cumple un propósito ampliado como:

- **Punto de entrada operativo del sistema** — Primera vista funcional que el usuario encuentra al acceder a la aplicación
- **Vista de situación general del consultorio / práctica** — Presenta información agregada que refleja el estado operativo general
- **Facilitador de decisiones organizativas diarias** — Proporciona contexto que ayuda al clínico a orientarse en su jornada de trabajo

**Principio de Centralidad:** A pesar de su propósito ampliado, el root mantiene al paciente como eje central. Toda la información presentada está orientada a facilitar el acceso y la selección de pacientes, no a proporcionar análisis clínicos o métricas de desempeño.

### 1.3 Relación con el Flujo Clínico Diario

En el flujo clínico diario típico:

1. El clínico inicia la aplicación
2. El clínico necesita acceder a un paciente específico
3. El clínico busca o selecciona el paciente de la lista
4. El clínico accede al registro clínico del paciente

El root del sistema debe optimizar este flujo eliminando pasos intermedios innecesarios y llevando directamente al clínico a la lista de pacientes.

**Principio:** El root no debe interponerse entre el usuario y su objetivo primario (acceder a un paciente).

---

## 2. Definición de la Vista Raíz

### 2.1 Qué Representa `/`

El root (`/`) representa:

- **Un punto de entrada funcional** — Vista operativa que presenta la lista de pacientes junto con información de contexto
- **Una vista de situación general** — Muestra información estadística y operativa que orienta al usuario sobre el estado del consultorio
- **Un facilitador de acceso** — Reduce la distancia entre el inicio de la aplicación y el inicio del trabajo clínico
- **Un organizador de flujo** — Estructura la información de manera que el paciente siga siendo el elemento principal

### 2.2 Qué NO Representa

El root **NO** representa:

- **Un dashboard clínico** — No muestra resúmenes clínicos, evaluaciones, diagnósticos, o interpretaciones de datos clínicos
- **Un análisis de métricas clínicas** — No presenta estadísticas que requieran interpretación clínica o evaluación de desempeño
- **Una pantalla de bienvenida** — No muestra mensajes de bienvenida, instrucciones, o contenido informativo educativo
- **Una vista de configuración** — No expone opciones de sistema, preferencias, o configuraciones
- **Un punto de decisión complejo** — No requiere que el usuario elija entre múltiples rutas o funcionalidades

**Principio de Exclusión:** El root no muestra información clínica sensible, no genera eventos, y no permite acciones que modifiquen el estado clínico de los pacientes.

### 2.3 Estructura Conceptual del Root

El root se organiza conceptualmente en áreas funcionales:

- **Área de Lista de Pacientes** — Contiene el listado completo de pacientes, que sigue siendo el elemento principal de la vista
- **Área de Información Estadística y Operativa** — Contiene métricas operativas y contexto que facilitan la orientación diaria

**Nota:** Esta especificación define las áreas conceptuales y su propósito, no el layout visual concreto ni la implementación técnica de la interfaz.

### 2.4 Estado del Root

El root requiere datos operativos para mostrar información estadística:

- **Requiere datos de pacientes** — Necesita acceso a la entidad Patient para calcular estadísticas
- **Requiere datos de turnos** — Necesita acceso a la entidad Appointment para mostrar turnos próximos
- **No depende de autenticación** — Asume que el acceso al root implica acceso autorizado (la gestión de autenticación está fuera del alcance de esta especificación)
- **No almacena preferencias** — No recuerda elecciones previas del usuario o configuraciones de sesión
- **No tiene lógica condicional compleja** — Su comportamiento es predecible aunque los datos mostrados varíen según el estado del sistema

**Garantía:** El comportamiento del root es determinístico y predecible. La información mostrada refleja el estado actual del sistema en el momento de la carga.

---

## 3. Comportamiento Esperado

### 3.1 Presentación de la Vista del Root

Cuando un usuario accede al root (`/`), el sistema debe presentar una vista que incluye:

1. **Lista de pacientes** — El elemento principal de la vista, accesible y funcional
2. **Información estadística operativa** — Métricas de contexto que facilitan la orientación diaria
3. **Información de turnos próximos** — Recorte temporal de turnos agendados para los próximos 7 días

**Comportamiento específico:**

| Acción del Usuario | Comportamiento del Sistema |
|-------------------|---------------------------|
| Acceso inicial al root (`/`) | Presentación de la vista completa con lista de pacientes y estadísticas |
| Refresh en el root (`/`) | Recarga de la vista completa con datos actualizados |
| Navegación directa por URL al root (`/`) | Presentación de la vista completa |
| Navegación desde otra vista hacia el root (`/`) | Presentación de la vista completa |

**Principio de Consistencia:** El comportamiento del root es idéntico independientemente de cómo se acceda a él.

### 3.2 Características de la Vista

La vista del root debe cumplir con las siguientes características:

| Característica | Requisito |
|---------------|-----------|
| **Inmediatez** | La vista se carga sin demora perceptible |
| **Completitud** | Presenta todos los elementos definidos (lista de pacientes y estadísticas) |
| **Consistencia** | El comportamiento es idéntico en todos los escenarios de acceso |
| **Claridad** | La lista de pacientes es claramente identificable como elemento principal |

### 3.3 Comportamiento en Primera Carga

Cuando el usuario accede al sistema por primera vez en una sesión:

1. El usuario accede al root (`/`)
2. El sistema presenta la vista completa con lista de pacientes y estadísticas
3. El usuario ve la lista de pacientes (que puede estar vacía si no hay pacientes registrados) junto con las estadísticas correspondientes

**La vista es funcional inmediatamente, sin pasos intermedios.**

### 3.4 Comportamiento en Refresh

Cuando el usuario realiza un refresh (recarga de página) mientras está en el root (`/`):

1. El sistema detecta que está en el root
2. El sistema recarga la vista completa con datos actualizados
3. El usuario ve la lista de pacientes actualizada junto con estadísticas actualizadas

**El refresh actualiza todos los datos mostrados en la vista.**

### 3.5 Comportamiento en Navegación Directa por URL

Cuando el usuario navega directamente al root usando la URL (`/`):

1. El sistema procesa la solicitud del root
2. El sistema presenta la vista completa
3. El usuario ve la lista de pacientes junto con las estadísticas

**La URL del root permanece visible en la barra de direcciones, reflejando que es una vista funcional.**

---

## 4. Relación con la Lista de Pacientes

### 4.1 La Lista de Pacientes como Vista Primaria

La lista de pacientes es la vista primaria del sistema después del root.

**Características de la lista de pacientes como vista primaria:**

| Aspecto | Descripción |
|---------|-------------|
| **Accesibilidad** | Es la primera vista funcional que el usuario encuentra |
| **Centralidad** | Es el punto desde el cual se accede a todos los registros clínicos |
| **Completitud** | Contiene toda la información necesaria para seleccionar un paciente |
| **Autosuficiencia** | No requiere contexto previo para ser útil |

### 4.2 Rol en la Selección de Contexto Clínico

La lista de pacientes es el mecanismo principal para establecer el contexto clínico:

1. **El usuario selecciona un paciente** de la lista
2. **El sistema establece el contexto clínico** para ese paciente
3. **El usuario accede al registro clínico** del paciente seleccionado

El root facilita este flujo llevando directamente al usuario a la lista de pacientes, eliminando pasos innecesarios.

### 4.3 Integración con el Flujo Clínico

El root y la lista de pacientes forman parte de un flujo integrado:

```
Root (`/`) 
  → Redirección automática
    → Lista de Pacientes
      → Selección de Paciente
        → Registro Clínico del Paciente
```

**Principio de Flujo:** El root es el punto de partida de un flujo que conduce naturalmente al trabajo clínico.

### 4.4 Estado de la Lista de Pacientes

La lista de pacientes que se muestra en el root debe:

- **Mostrar todos los pacientes disponibles** (según los criterios de búsqueda y filtrado definidos en las especificaciones de Patient CRUD)
- **Mantener el estado de búsqueda por defecto** (si existe un estado por defecto definido)
- **No requerir interacción previa** — La lista está lista para usar inmediatamente

**Nota:** Los detalles específicos de cómo se muestra la lista de pacientes (ordenamiento, filtros, paginación) están definidos en las especificaciones de Patient CRUD y están fuera del alcance de este documento.

---

## 5. Información Estadística y Operativa en el Root

### 5.1 Propósito de las Estadísticas

Las estadísticas mostradas en el root tienen un propósito exclusivamente operativo e informativo:

- **Proporcionar contexto general** — Ofrecer una visión de situación del consultorio
- **Facilitar orientación diaria** — Ayudar al clínico a entender rápidamente el estado operativo
- **Apoyar decisiones organizativas** — Proporcionar información que facilite la planificación diaria

**Principio de No Interpretación:** Las estadísticas son informativas y no requieren interpretación clínica. No generan eventos, no modifican estado clínico, y no permiten acciones sobre pacientes.

### 5.2 Estadística: Cantidad de Pacientes

#### 5.2.1 Qué Representa la Métrica

La métrica de cantidad de pacientes representa el número total de pacientes registrados en el sistema, segmentado por estado operativo.

**Fuente de datos:** Entidad `Patient` del modelo de dominio.

#### 5.2.2 Segmentación de la Métrica

La métrica debe presentar al menos las siguientes segmentaciones:

- **Pacientes activos** — Pacientes con `status = Active`
- **Pacientes inactivos** — Pacientes con `status = Inactive`

**Nota:** La especificación no define el formato visual de presentación, solo el contenido conceptual que debe mostrarse.

#### 5.2.3 Uso Exclusivo de la Métrica

La métrica de cantidad de pacientes tiene uso exclusivo para:

- **Contexto general** — Proporcionar información sobre el volumen de pacientes en el sistema
- **Orientación operativa** — Ayudar al clínico a entender la escala de su práctica

**Restricciones explícitas:**

- **No genera eventos** — La visualización de esta métrica no crea ningún evento en el sistema
- **No es interactiva clínicamente** — No permite acciones que modifiquen el estado clínico de pacientes
- **No permite acciones sobre pacientes** — No proporciona mecanismos para crear, editar, o eliminar pacientes desde la métrica misma
- **No es evaluativa** — No proporciona análisis de desempeño ni métricas de calidad clínica

#### 5.2.4 Actualización de la Métrica

La métrica se actualiza:

- **Al cargar la vista** — Refleja el estado actual del sistema en el momento de la carga
- **Al refrescar la página** — Se recalcula con los datos más recientes
- **No en tiempo real** — No se actualiza automáticamente sin recarga de la vista

### 5.3 Estadística Operativa: Turnos Próximos 7 Días

#### 5.3.1 Qué Representa esta Sección

La sección de turnos próximos representa un recorte temporal de la agenda que muestra los turnos agendados para los próximos 7 días calendario desde la fecha actual.

**Propósito:** Facilitar el acceso rápido a pacientes con turnos programados en el corto plazo, mejorando la orientación diaria del clínico.

#### 5.3.2 Horizonte Temporal

**Horizonte fijo:** Los próximos 7 días calendario desde la fecha actual.

**Criterios de inclusión:**

- Turnos con `scheduledDate` dentro del rango de los próximos 7 días
- Turnos con `status = Scheduled` (turnos programados, no completados ni cancelados)
- Ordenados cronológicamente por fecha y hora

**Nota:** La especificación no define el comportamiento para turnos que cruzan el límite de 7 días, ni el manejo de zonas horarias. Estos detalles quedan para la implementación técnica.

#### 5.3.3 Relación con la Agenda

La información de turnos próximos:

- **No reemplaza la agenda completa** — Es un recorte operativo, no la vista completa de agenda
- **No pertenece a la timeline** — Los turnos futuros no son eventos clínicos y no aparecen en la timeline del paciente
- **No genera eventos** — La visualización de turnos próximos no crea eventos clínicos
- **Es informativa** — Proporciona contexto operativo, no documentación clínica

**Relación con Appointment:** La información proviene de la entidad `Appointment`, pero su presentación en el root es operativa, no clínica.

#### 5.3.4 Contenido Mínimo por Turno

Cada turno mostrado en la sección debe incluir al menos:

- **Fecha** — Fecha programada del turno (`scheduledDate`)
- **Hora** — Hora programada del turno (`scheduledTime`), si está disponible
- **Identificación del paciente** — Información suficiente para identificar al paciente (nombre completo como mínimo)

**Nota:** La especificación no define el formato visual ni los campos adicionales que pueden mostrarse (tipo de turno, duración, etc.). Estos detalles quedan para la implementación.

#### 5.3.5 Regla Clave: Acceso a Historia Clínica desde Turnos

**Regla fundamental:** Desde cada turno mostrado en la sección de turnos próximos, debe ser posible acceder a la historia clínica del paciente correspondiente.

**Características del acceso:**

- **Por navegación** — El acceso se realiza mediante navegación hacia la vista del paciente, no mediante duplicación de datos
- **Desde la identidad del paciente** — El acceso se hace siempre desde la identidad del paciente, nunca desde una métrica agregada
- **No duplica información** — La información del turno en el root es un punto de entrada, no una vista completa de datos del paciente

**Principio de Centralidad:** El acceso a la historia clínica siempre se realiza desde la identidad del paciente, manteniendo el principio arquitectónico de que el sistema se organiza alrededor del paciente.

### 5.4 Relación con Agenda y Timeline

#### 5.4.1 Diferenciación con Timeline

La información de turnos en el root:

- **No pertenece a la timeline** — Los turnos futuros no son eventos clínicos y no aparecen en la timeline del paciente
- **No genera eventos** — La visualización de turnos próximos no crea eventos de tipo `ClinicalEvent`
- **Es operativa, no clínica** — Su propósito es facilitar la organización diaria, no documentar hechos clínicos

**Referencia:** Ver `docs/23_encounter_appointment_spec.md` para la definición de eventos Encounter y su relación con turnos pasados.

#### 5.4.2 Diferenciación con Agenda Completa

El root solo muestra un recorte temporal y operativo:

- **No es la agenda completa** — Muestra solo los próximos 7 días, no toda la agenda
- **No reemplaza la funcionalidad de agenda** — La agenda completa (si existe) sigue siendo la fuente de verdad para gestión de turnos
- **Es un resumen operativo** — Proporciona contexto rápido, no gestión completa de turnos

**Principio:** El root facilita el acceso rápido a información operativa, pero no reemplaza las vistas especializadas de agenda o timeline.

---

## 6. Reglas Explícitas

### 6.1 El Root No Debe Mostrar Información Clínica Sensible

**Regla:** El root nunca debe mostrar información clínica sensible de ningún tipo.

| Tipo de Información | ¿Permitido en Root? |
|---------------------|---------------------|
| Información clínica de pacientes (notas, diagnósticos, evaluaciones) | No |
| Resúmenes clínicos | No |
| Eventos NOTE | No |
| Eventos Encounter (de turnos pasados) | No |
| Contenido de notas clínicas | No |
| Medicamentos o tratamientos | No |
| Historial psiquiátrico | No |
| Cualquier dato clínico sensible | No |

**Justificación:** El root es una vista operativa que facilita el acceso a pacientes, no una vista de documentación clínica. La información clínica solo debe mostrarse en el contexto de la historia clínica del paciente.

### 6.1.1 Información Permitida en el Root

El root puede mostrar:

| Tipo de Información | ¿Permitido en Root? | Justificación |
|---------------------|---------------------|---------------|
| Lista de pacientes (identidad y datos administrativos) | Sí | Es el elemento principal del root |
| Cantidad de pacientes (estadística agregada) | Sí | Es información operativa, no clínica |
| Turnos próximos (fecha, hora, identificación de paciente) | Sí | Es información operativa de agenda |
| Datos administrativos de pacientes (nombre, contacto) | Sí | Son necesarios para identificar y acceder a pacientes |

**Principio:** El root muestra información necesaria para la operación diaria y el acceso a pacientes, pero no información que requiera interpretación clínica.

### 6.2 El Root No Debe Requerir Interacción para Funcionar

**Regla:** El root no debe requerir interacción del usuario para mostrar su contenido básico.

| Tipo de Interacción | ¿Permitida? | Justificación |
|---------------------|-------------|---------------|
| Clic en botón para continuar | No | La vista debe mostrarse automáticamente |
| Selección de opción para ver contenido | No | El contenido debe estar disponible inmediatamente |
| Confirmación de acción para acceder | No | El acceso debe ser directo |
| Introducción de datos para ver información | No | La información debe mostrarse sin requisitos previos |
| Interacción para acceder a pacientes desde la lista | Sí | La selección de pacientes es parte del flujo normal |
| Interacción para acceder a historia clínica desde turnos | Sí | La navegación hacia pacientes es funcionalidad esperada |

**Justificación:** El root debe ser funcional inmediatamente, pero la interacción para acceder a pacientes es parte del flujo esperado.

### 6.3 El Root No Debe Mantener Estado Persistente

**Regla:** El root no mantiene estado persistente de preferencias o configuraciones del usuario.

| Tipo de Estado | ¿Permitido? | Justificación |
|----------------|-------------|---------------|
| Estado de sesión | Sí (asume acceso autorizado) | Necesario para autenticación |
| Estado de preferencias de visualización | No | Las estadísticas no son configurables |
| Estado de navegación previa | No | El root no depende de navegación previa |
| Estado de datos en caché (temporal) | Sí | Puede usar caché para optimización, pero no persistente |
| Estado persistente de configuración | No | No hay configuración de métricas |

**Justificación:** El root debe funcionar de manera consistente. Las estadísticas mostradas no son configurables por el usuario.

### 6.4 El Root No Debe Generar Eventos Clínicos

**Regla:** El root no genera eventos clínicos ni modifica el estado clínico de pacientes.

| Tipo de Acción | ¿Permitida? | Justificación |
|----------------|-------------|---------------|
| Consultas a base de datos para estadísticas | Sí | Necesario para mostrar información |
| Cálculos de métricas agregadas | Sí | Necesario para estadísticas operativas |
| Generación de eventos NOTE | No | El root no documenta encuentros clínicos |
| Generación de eventos Encounter | No | El root no crea eventos de timeline |
| Modificación de estado clínico | No | El root es de solo lectura clínica |
| Acciones destructivas sobre pacientes | No | El root no permite eliminación o modificación desde estadísticas |

**Justificación:** El root es una vista informativa y operativa. Toda la información mostrada es de solo lectura desde la perspectiva clínica.

### 6.5 El Root Debe Ser Consistente

**Regla:** El comportamiento del root debe ser idéntico en todos los escenarios.

| Escenario | Comportamiento Esperado |
|-----------|------------------------|
| Primera carga | Presentación de vista completa con lista de pacientes y estadísticas |
| Refresh | Recarga de vista completa con datos actualizados |
| Navegación directa | Presentación de vista completa |
| Navegación desde otra vista | Presentación de vista completa |
| Con pacientes en el sistema | Vista completa con lista de pacientes y estadísticas pobladas |
| Sin pacientes en el sistema | Vista completa con lista vacía y estadísticas en cero |
| Con turnos próximos | Vista completa con sección de turnos poblada |
| Sin turnos próximos | Vista completa con sección de turnos vacía |

**Justificación:** La consistencia reduce la confusión y mejora la experiencia del usuario.

### 6.6 Reglas Adicionales sobre Estadísticas

**Regla:** Las estadísticas en el root deben cumplir con las siguientes restricciones:

| Restricción | Descripción |
|-------------|-------------|
| **No son configurables** | El usuario no puede configurar qué métricas mostrar ni cómo calcularlas |
| **No son exportables** | Las estadísticas no pueden exportarse como reportes o análisis |
| **No generan eventos** | La visualización de estadísticas no crea eventos en el sistema |
| **No permiten acciones destructivas** | No hay acciones de eliminación o modificación masiva desde las estadísticas |
| **No muestran métricas clínicas** | Solo muestran información operativa, no evaluaciones clínicas |

**Justificación:** Las estadísticas son informativas y operativas, no herramientas de análisis o gestión clínica.

### 6.7 Navegación desde Vistas de Paciente al Root

**Regla:** El usuario debe poder volver al inicio (`/`) desde cualquier vista asociada a un paciente.

#### 6.7.1 Alcance de la Navegación

La navegación a "Inicio" debe estar disponible desde:

- **Vista de timeline del paciente** — La vista principal que muestra la línea de tiempo clínica del paciente
- **Vista de nota clínica** — Tanto en estado draft como finalizada, cuando se accede a una nota individual
- **Vista de medicación** — Cuando se visualiza información de medicamentos del paciente
- **Vista de turnos del paciente** — Cuando se visualiza información de citas programadas del paciente

**Principio de Accesibilidad:** El acceso a "Inicio" debe ser persistente y visible, no dependiendo del scroll ni de la posición en la página.

#### 6.7.2 Reglas de Comportamiento

La navegación a "Inicio" desde vistas de paciente debe cumplir con las siguientes reglas:

| Regla | Descripción |
|-------|-------------|
| **No modifica estado clínico** | La navegación a "Inicio" no altera ningún estado clínico del paciente |
| **No genera eventos** | La navegación no crea eventos de timeline ni eventos clínicos de ningún tipo |
| **No requiere confirmación** | La navegación es inmediata, sin diálogos de confirmación ni advertencias |
| **Navegación simple** | La navegación se realiza mediante un único clic o interacción |

**Principio de No Interferencia:** La navegación a "Inicio" es una acción de navegación pura que no interfiere con el flujo clínico ni modifica datos.

#### 6.7.3 Ubicación y Presentación

**Ubicación del acceso a "Inicio":**

- **Elemento de navegación global** — Debe estar ubicado en el encabezado o área de navegación global de la vista
- **No como parte del contenido clínico** — No debe aparecer como parte del contenido clínico (timeline, notas, medicación, turnos)
- **Persistente y visible** — Debe estar siempre visible, independientemente del scroll o la posición en la página
- **No como evento ni acción clínica** — No debe presentarse como un evento de timeline ni como una acción clínica

**Wording canónico:**

- **Usar "Inicio"** — El texto del enlace o botón debe ser exactamente "Inicio"
- **Prohibido "Dashboard"** — No se debe usar el término "Dashboard"
- **Prohibido "Home"** — No se debe usar el término "Home" ni su traducción

**Principio de Consistencia:** El wording debe ser consistente en todas las vistas y debe alinearse con la terminología del sistema.

#### 6.7.4 Comportamiento Técnico

**Comportamiento de navegación:**

- **Navega al root (`/`)** — La navegación lleva al usuario al punto de entrada raíz del sistema
- **Sin side effects** — No ejecuta acciones adicionales más allá de la navegación
- **Funciona en todos los dispositivos** — Debe funcionar correctamente en desktop, tablet y mobile

**Responsive:**

- **Desktop** — Acceso visible y accesible en el encabezado
- **Tablet** — Acceso visible y accesible, adaptado al layout de tablet
- **Mobile** — Acceso visible y accesible, considerando las restricciones de espacio en mobile

**Principio de Universalidad:** La navegación a "Inicio" debe funcionar de manera idéntica en todos los dispositivos y contextos.

---

## 7. Impacto en UX

### 7.1 Reducción de Fricción

El comportamiento del root reduce la fricción en el flujo del usuario:

| Aspecto | Impacto |
|---------|---------|
| **Acceso inmediato a lista de pacientes** | El usuario accede directamente a la funcionalidad principal |
| **Contexto operativo disponible** | La información estadística facilita la orientación diaria sin navegación adicional |
| **Acceso rápido a pacientes próximos** | Los turnos próximos permiten acceso directo a pacientes relevantes |
| **Claridad de propósito** | El usuario entiende inmediatamente que debe seleccionar un paciente |

### 7.2 Claridad de Flujo

El comportamiento del root proporciona claridad en el flujo de la aplicación:

| Aspecto | Beneficio |
|---------|-----------|
| **Flujo predecible** | El usuario sabe qué esperar al acceder al root |
| **Orientación clara** | El sistema guía al usuario hacia el siguiente paso lógico (selección de paciente) |
| **Eliminación de ambigüedad** | No hay confusión sobre qué hacer después de acceder al root |
| **Coherencia con el modelo mental** | El comportamiento refleja que el sistema se organiza alrededor del paciente |

### 7.3 Mejora de Orientación Diaria

El root ampliado mejora la orientación diaria del clínico:

| Aspecto | Beneficio |
|---------|-----------|
| **Vista de situación general** | El clínico obtiene rápidamente una visión del estado operativo del consultorio |
| **Acceso rápido a pacientes próximos** | Los turnos próximos facilitan la preparación para encuentros inminentes |
| **Reducción de navegación innecesaria** | La información operativa está disponible sin necesidad de navegar a otras vistas |
| **Contexto para decisiones organizativas** | Las estadísticas proporcionan contexto que apoya la planificación diaria |

### 7.4 Evitar Pantallas "Vacías" o Ambiguas

El comportamiento del root evita problemas comunes de UX:

| Problema Evitado | Cómo se Evita |
|------------------|---------------|
| **Pantalla vacía** | La vista presenta contenido funcional inmediatamente (lista de pacientes y estadísticas) |
| **Ambiguidad sobre qué hacer** | La lista de pacientes es claramente el elemento principal y guía la acción |
| **Sensación de "pantalla de carga"** | La vista se carga con contenido funcional, no hay espera perceptible |
| **Confusión sobre el propósito** | El comportamiento es claro: facilitar el acceso a pacientes con contexto operativo |

### 7.5 Experiencia de Primera Impresión

El comportamiento del root contribuye a una experiencia de primera impresión positiva:

| Aspecto | Contribución |
|---------|--------------|
| **Inmediatez** | El usuario accede rápidamente a la funcionalidad principal |
| **Profesionalismo** | El comportamiento pulido transmite calidad |
| **Eficiencia** | El usuario percibe que el sistema está optimizado para su flujo de trabajo |
| **Enfoque** | El sistema se presenta como una herramienta clínica centrada en el paciente |

---

## 8. Casos Fuera de Alcance

### 8.1 Dashboards Clínicos

**Fuera de alcance:** El root no debe mostrar dashboards con análisis clínicos o métricas de desempeño clínico.

| Tipo de Dashboard | ¿Permitido? |
|-------------------|-------------|
| Análisis de diagnósticos | No |
| Métricas de tratamiento | No |
| Estadísticas clínicas interpretativas | No |
| Evaluaciones de resultados clínicos | No |
| Gráficos de evolución clínica | No |

**Justificación:** El root es operativo, no analítico. Las métricas mostradas son informativas y operativas, no interpretativas ni clínicas.

### 8.2 Métricas de Desempeño Clínico

**Fuera de alcance:** El root no debe mostrar métricas que requieran interpretación clínica o evaluación de desempeño.

| Tipo de Métrica | ¿Permitida? |
|-----------------|-------------|
| Tasa de éxito de tratamientos | No |
| Métricas de adherencia | No |
| Estadísticas de diagnósticos | No |
| Análisis de evolución clínica | No |
| Cualquier métrica que requiera interpretación clínica | No |

**Justificación:** Las métricas en el root son operativas (cantidad de pacientes, turnos próximos), no evaluativas ni clínicas.

### 8.3 Análisis Históricos

**Fuera de alcance:** El root no debe mostrar análisis históricos ni tendencias temporales.

| Tipo de Análisis | ¿Permitido? |
|------------------|-------------|
| Tendencias de pacientes a lo largo del tiempo | No |
| Análisis de evolución histórica | No |
| Comparativas temporales | No |
| Reportes históricos | No |

**Justificación:** El root muestra información del estado actual, no análisis históricos ni comparativas temporales.

### 8.4 Métricas Exportables

**Fuera de alcance:** El root no debe proporcionar funcionalidad de exportación de estadísticas.

| Tipo de Exportación | ¿Permitida? |
|---------------------|-------------|
| Exportación de métricas a reportes | No |
| Generación de reportes estadísticos | No |
| Exportación de datos para análisis externo | No |
| Compartir estadísticas | No |

**Justificación:** Las estadísticas en el root son informativas y operativas, no herramientas de reporte o análisis.

### 8.5 Filtros Avanzados

**Fuera de alcance:** El root no debe proporcionar filtros avanzados para las estadísticas.

| Tipo de Filtro | ¿Permitido? |
|----------------|-------------|
| Filtros configurables por el usuario | No |
| Filtros temporales avanzados | No |
| Filtros por criterios clínicos | No |
| Filtros personalizados | No |

**Justificación:** Las estadísticas en el root son fijas y operativas, no configurables ni filtrables por el usuario.

### 8.6 Configuración de Métricas

**Fuera de alcance:** El root no debe permitir configuración de qué métricas mostrar o cómo calcularlas.

| Tipo de Configuración | ¿Permitida? |
|----------------------|-------------|
| Selección de métricas a mostrar | No |
| Configuración de cálculos | No |
| Personalización de estadísticas | No |
| Ajustes de presentación de métricas | No |

**Justificación:** Las estadísticas en el root son fijas y no configurables. Su propósito es proporcionar contexto operativo estándar.

### 8.7 Configuración del Sistema

**Fuera de alcance:** El root no debe proporcionar acceso a configuración del sistema.

| Tipo de Configuración | ¿Permitida? |
|----------------------|-------------|
| Preferencias de usuario | No |
| Configuración de la aplicación | No |
| Ajustes del sistema | No |
| Opciones administrativas | No |

**Justificación:** La configuración no es parte del flujo clínico diario y debe estar en una sección dedicada.

### 8.8 Información de Bienvenida o Tutoriales

**Fuera de alcance:** El root no debe mostrar información de bienvenida o tutoriales.

| Tipo de Contenido | ¿Permitido? |
|-------------------|-------------|
| Mensajes de bienvenida | No |
| Tutoriales interactivos | No |
| Guías de uso | No |
| Información de ayuda | No |

**Justificación:** El root debe ser funcional, no educativo. Los tutoriales deben estar en secciones dedicadas.

### 8.9 Notificaciones o Alertas

**Fuera de alcance:** El root no debe mostrar notificaciones o alertas del sistema.

| Tipo de Notificación | ¿Permitida? |
|---------------------|-------------|
| Alertas clínicas | No |
| Notificaciones del sistema | No |
| Recordatorios | No |
| Mensajes informativos | No |

**Justificación:** Las notificaciones deben estar integradas en las vistas funcionales relevantes, no en el root.

---

## 9. Relación con Otras Especificaciones

### 9.1 Dependencias

Esta especificación depende de:

- **`18_patient_crud_specs.md`** — Define el comportamiento de la lista de pacientes que es el elemento principal del root
- **`01_specs.md`** — Define el propósito general del sistema y el principio de organización alrededor del paciente
- **`02_domain.md`** — Define el modelo de dominio, la centralidad del paciente, y la entidad Appointment
- **`23_encounter_appointment_spec.md`** — Define la relación entre turnos (Appointments) y eventos Encounter, y establece que turnos futuros no aparecen en timeline

### 9.2 Consumidores

Esta especificación es consumida por:

- **Implementación de Frontend** — Define el comportamiento del componente/vista del root
- **Implementación de Routing** — Define cómo debe manejarse la ruta raíz
- **Diseño de UX** — Define las expectativas de experiencia del usuario en el root
- **QA Testing** — Define los casos de prueba para validar el comportamiento del root

### 9.3 Integración con Otras Funcionalidades

El root se integra con:

| Funcionalidad | Punto de Integración |
|---------------|---------------------|
| **Lista de Pacientes** | El root presenta la lista de pacientes como elemento principal |
| **Búsqueda de Pacientes** | La lista de pacientes incluye funcionalidad de búsqueda (definida en Patient CRUD) |
| **Registro Clínico** | El flujo continúa desde la lista de pacientes hacia el registro clínico del paciente seleccionado |
| **Agenda de Turnos** | El root muestra un recorte de turnos próximos, relacionado con la agenda completa (si existe) |
| **Entidad Patient** | El root consulta la entidad Patient para calcular estadísticas de cantidad de pacientes |
| **Entidad Appointment** | El root consulta la entidad Appointment para mostrar turnos próximos |

---

## 10. Garantías Funcionales

### 10.1 Garantías de Comportamiento

El sistema garantiza que:

| Garantía | Descripción |
|----------|-------------|
| **Vista Completa Inmediata** | El acceso al root siempre resulta en presentación inmediata de la vista completa con lista de pacientes y estadísticas |
| **Consistencia** | El comportamiento es idéntico en todos los escenarios de acceso |
| **Previsibilidad** | El usuario siempre sabe qué esperar al acceder al root |
| **Centralidad del Paciente** | La lista de pacientes siempre es el elemento principal de la vista |

### 10.2 Garantías de No Comportamiento

El sistema garantiza que el root:

| Garantía | Descripción |
|----------|-------------|
| **No muestra contenido clínico sensible** | Nunca presenta información clínica de pacientes (notas, diagnósticos, evaluaciones) |
| **No muestra eventos NOTE ni Encounter** | Nunca presenta eventos clínicos en el root |
| **No genera eventos** | Nunca crea eventos clínicos al mostrar estadísticas o turnos |
| **No modifica estado clínico** | Nunca altera el estado clínico de pacientes |
| **No permite acciones destructivas** | Nunca permite eliminación o modificación masiva desde las estadísticas |
| **No es configurable** | Las estadísticas mostradas no son configurables por el usuario |

---

## 11. Resumen

### 11.1 Comportamiento del Root

El root del sistema (`/`) es un punto de entrada operativo que presenta la lista de pacientes junto con información estadística y operativa de contexto.

**Características principales:**

1. **Vista funcional completa** — El acceso al root siempre resulta en presentación inmediata de la vista completa con lista de pacientes y estadísticas
2. **Lista de pacientes como elemento principal** — La lista de pacientes sigue siendo el elemento central de la vista
3. **Información estadística operativa** — Muestra métricas de contexto (cantidad de pacientes, turnos próximos) que facilitan la orientación diaria
4. **Comportamiento consistente** — El comportamiento es idéntico en todos los escenarios
5. **Información de solo lectura clínica** — Las estadísticas son informativas y no permiten acciones que modifiquen el estado clínico

### 11.2 Principio Arquitectónico

El comportamiento del root refleja el principio arquitectónico central del sistema:

**El sistema se organiza alrededor del paciente.**

El root facilita este principio presentando la lista de pacientes como elemento principal, junto con información operativa que apoya el acceso a pacientes. Toda la información mostrada está orientada a facilitar la selección y acceso a pacientes, manteniendo al paciente como eje central del flujo.

### 11.3 Impacto en el Flujo Clínico

El comportamiento del root optimiza el flujo clínico diario:

1. El clínico accede al sistema (root)
2. El sistema presenta la vista completa con lista de pacientes y contexto operativo
3. El clínico obtiene orientación diaria a través de las estadísticas y turnos próximos
4. El clínico selecciona un paciente desde la lista o desde los turnos próximos
5. El clínico accede al registro clínico del paciente seleccionado

**Resultado:** Reducción de fricción, claridad de flujo, acceso inmediato a la funcionalidad principal, y mejora de la orientación diaria del consultorio.

### 11.4 Información Estadística y Operativa

El root presenta dos tipos de información estadística y operativa:

1. **Cantidad de pacientes** — Métrica operativa que muestra el número total de pacientes segmentado por estado (activos/inactivos)
2. **Turnos próximos 7 días** — Recorte temporal de la agenda que muestra turnos programados para facilitar el acceso rápido a pacientes relevantes

**Características de las estadísticas:**

- Son informativas y operativas, no interpretativas ni clínicas
- No generan eventos ni modifican estado clínico
- No son configurables por el usuario
- Facilitan decisiones organizativas diarias
- Mantienen al paciente como eje central del acceso

---

*Versión del Documento: 2.1*  
*Estado: Final*  
*Depende De: 01_specs.md, 02_domain.md, 18_patient_crud_specs.md, 23_encounter_appointment_spec.md*  
*Consumido Por: Implementación de Frontend, Implementación de Routing, Diseño de UX, QA Testing*

---

## Nota de Actualización

Esta especificación actualiza la versión 1.0 que definía el root como un simple mecanismo de redirección. La versión 2.0 incorpora información estadística y operativa (cantidad de pacientes y turnos próximos 7 días) manteniendo los principios arquitectónicos fundamentales:

- El paciente sigue siendo el eje central del flujo
- El root no muestra información clínica sensible
- Las estadísticas son operativas e informativas, no interpretativas ni clínicas
- El acceso a la historia clínica siempre se realiza desde la identidad del paciente

La actualización amplía el propósito del root sin alterar su naturaleza fundamental como punto de entrada operativo centrado en el paciente.

### Actualización 2.1

La versión 2.1 agrega especificaciones explícitas para la navegación desde vistas de paciente al root:

- Navegación persistente y visible desde todas las vistas asociadas a un paciente (timeline, notas, medicación, turnos)
- Reglas claras sobre comportamiento: no modifica estado clínico, no genera eventos, no requiere confirmación
- Wording canónico: usar "Inicio" (prohibido "Dashboard" o "Home")
- Ubicación en navegación global, no como parte del contenido clínico
- Funcionalidad responsive en desktop, tablet y mobile

Esta actualización garantiza que el usuario siempre pueda regresar al punto de entrada operativo del sistema desde cualquier vista de paciente, mejorando la navegación y la experiencia del usuario sin interferir con el flujo clínico.


---

## 26_responsive_behavior_spec.md

# Sistema de Historias Clínicas Psiquiátricas — Especificación Funcional de Comportamiento Responsive

## Resumen Ejecutivo

Este documento define el comportamiento funcional responsive del sistema de Historias Clínicas Psiquiátricas, asegurando usabilidad, claridad clínica y continuidad de flujo en distintos tamaños de pantalla.

El sistema debe adaptarse a diferentes dispositivos manteniendo los principios arquitectónicos fundamentales: el paciente como eje central, la legibilidad clínica como prioridad, y la preservación de toda información clínica y administrativa.

Esta especificación define **QUÉ** debe ocurrir en cada rango de pantalla y cómo se reorganiza la información, sin describir implementación técnica (CSS, breakpoints concretos, componentes).

**Nota:** Esta especificación complementa las especificaciones funcionales existentes del sistema, definiendo el comportamiento adaptativo sin alterar el modelo funcional ni el comportamiento clínico.

---

## 1. Principios Centrales (No Negociables)

### 1.1 Principio de Legibilidad Clínica

**Regla fundamental:** La legibilidad y el orden semántico priman sobre la densidad de información.

| Aspecto | Prioridad |
|---------|-----------|
| **Legibilidad del texto clínico** | Máxima prioridad |
| **Orden semántico de la información** | Máxima prioridad |
| **Densidad de información** | Prioridad secundaria |
| **Diseño estético** | Prioridad terciaria |

**Justificación:** El sistema es clínico. La información debe ser legible y comprensible en cualquier tamaño de pantalla, sin sacrificar claridad por densidad.

### 1.2 Principio de Centralidad del Paciente

**Regla fundamental:** El paciente sigue siendo el eje del flujo, independientemente del tamaño de pantalla.

| Escenario | Comportamiento Esperado |
|-----------|------------------------|
| **Pantalla grande** | El paciente es el elemento principal |
| **Pantalla mediana** | El paciente es el elemento principal |
| **Pantalla pequeña** | El paciente es el elemento principal |

**Justificación:** El sistema se organiza alrededor del paciente. Esta organización no cambia con el tamaño de pantalla.

### 1.3 Principio de Preservación de Información

**Regla fundamental:** La información clínica y administrativa NO debe perderse al reducir espacio.

| Tipo de Información | Regla |
|---------------------|-------|
| **Información clínica** | Nunca se oculta, se reorganiza |
| **Información administrativa** | Nunca se oculta, se reorganiza |
| **Acciones críticas** | Nunca se ocultan, se reorganizan |
| **Contexto del paciente** | Nunca se oculta, se reorganiza |

**Justificación:** La pérdida de información clínica o administrativa compromete la seguridad y continuidad del cuidado.

### 1.4 Principio de Experiencia Móvil

**Regla fundamental:** La experiencia móvil es de consulta, no de carga intensiva.

| Tipo de Operación | Experiencia Móvil |
|-------------------|-------------------|
| **Consulta de información** | Optimizada |
| **Revisión de timeline** | Optimizada |
| **Lectura de notas** | Optimizada |
| **Carga de datos extensos** | Funcional pero no optimizada |
| **Edición compleja** | Funcional pero no optimizada |

**Justificación:** Los dispositivos móviles son adecuados para consulta y revisión, pero la carga intensiva de datos se realiza mejor en pantallas más grandes.

### 1.5 Principio de Consistencia Funcional

**Regla fundamental:** No se redefine el modelo funcional por breakpoint.

| Aspecto | Regla |
|---------|-------|
| **Comportamiento clínico** | Idéntico en todos los tamaños |
| **Reglas de negocio** | Idénticas en todos los tamaños |
| **Validaciones** | Idénticas en todos los tamaños |
| **Flujos de trabajo** | Idénticos en todos los tamaños |
| **Organización de información** | Se reorganiza, no se redefine |

**Justificación:** El modelo funcional es independiente del tamaño de pantalla. Solo cambia la presentación, no la funcionalidad.

---

## 2. Tipos de Dispositivos Considerados

### 2.1 Definición de Rangos Conceptuales

El sistema considera tres rangos conceptuales de tamaño de pantalla:

| Rango | Descripción Conceptual | Características Funcionales |
|-------|------------------------|----------------------------|
| **Pantalla Grande (Desktop)** | Pantallas de escritorio y laptops grandes | Espacio suficiente para múltiples columnas simultáneas, información completa visible |
| **Pantalla Mediana (Tablet / Laptop Chico)** | Tablets y laptops pequeños | Espacio limitado para múltiples columnas, requiere reorganización pero mantiene funcionalidad completa |
| **Pantalla Pequeña (Mobile)** | Teléfonos móviles | Espacio muy limitado, requiere apilado vertical y navegación secuencial |

**Nota:** Esta especificación no define valores de píxeles ni breakpoints técnicos. Los rangos son conceptuales y deben implementarse según las mejores prácticas de diseño responsive.

### 2.2 Características Funcionales por Rango

#### 2.2.1 Pantalla Grande (Desktop)

**Características:**
- Múltiples columnas pueden mostrarse simultáneamente
- Información contextual puede permanecer visible junto al contenido principal
- Paneles laterales pueden coexistir con el contenido principal
- Navegación puede ser horizontal y vertical simultáneamente

**Expectativa funcional:** El usuario puede ver y acceder a toda la información relevante sin necesidad de navegación adicional.

#### 2.2.2 Pantalla Mediana (Tablet / Laptop Chico)

**Características:**
- Algunas columnas pueden mostrarse simultáneamente
- Información contextual puede requerir colapso o reorganización
- Paneles laterales pueden requerir alternancia con contenido principal
- Navegación puede requerir más interacciones que en desktop

**Expectativa funcional:** El usuario puede acceder a toda la información, pero puede requerir más interacciones (colapsar/expandir, alternar vistas) que en desktop.

#### 2.2.3 Pantalla Pequeña (Mobile)

**Características:**
- Una columna principal a la vez
- Información contextual debe reorganizarse o apilarse verticalmente
- Paneles laterales deben colapsarse o apilarse
- Navegación es principalmente vertical y secuencial

**Expectativa funcional:** El usuario puede acceder a toda la información, pero requiere navegación secuencial y apilado vertical. Un elemento a la vez tiene foco principal.

---

## 3. Root (`/`) — Comportamiento Responsive

### 3.1 Estructura Funcional del Root

El root presenta:
- **Lista de pacientes** — Elemento principal
- **Estadísticas operativas** — Cantidad de pacientes (activos/inactivos)
- **Turnos próximos 7 días** — Recorte temporal de agenda

**Referencia:** Ver `25_root_behavior_spec.md` para la definición completa del root.

### 3.2 Comportamiento en Pantalla Grande (Desktop)

#### 3.2.1 Visibilidad de Elementos

| Elemento | Visibilidad | Ubicación |
|----------|-------------|-----------|
| **Lista de pacientes** | Siempre visible | Columna principal (mayor ancho) |
| **Estadísticas operativas** | Siempre visible | Columna secundaria o panel lateral |
| **Turnos próximos** | Siempre visible | Columna secundaria o panel lateral |

**Regla:** Todos los elementos están simultáneamente visibles sin necesidad de scroll horizontal.

#### 3.2.2 Prioridad de Información

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Lista de pacientes | Es el elemento principal del root |
| **2 (Alta)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **3 (Media)** | Estadísticas operativas | Proporciona contexto pero no es acción primaria |

#### 3.2.3 Reglas de Colapso o Apilado

**No aplica:** En pantalla grande, no se requiere colapso ni apilado. Todos los elementos están visibles simultáneamente.

### 3.3 Comportamiento en Pantalla Mediana (Tablet / Laptop Chico)

#### 3.3.1 Visibilidad de Elementos

| Elemento | Visibilidad | Comportamiento |
|----------|-------------|---------------|
| **Lista de pacientes** | Siempre visible | Columna principal, puede ocupar ancho completo o parcial |
| **Estadísticas operativas** | Siempre visible | Puede estar en columna secundaria o apilada debajo |
| **Turnos próximos** | Siempre visible | Puede estar en columna secundaria o apilada debajo |

**Regla:** Todos los elementos están visibles, pero pueden requerir scroll vertical para acceder a todos.

#### 3.3.2 Prioridad de Información

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Lista de pacientes | Es el elemento principal del root |
| **2 (Alta)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **3 (Media)** | Estadísticas operativas | Proporciona contexto pero no es acción primaria |

#### 3.3.3 Reglas de Colapso o Apilado

**Apilado vertical permitido:**
- Las estadísticas operativas pueden apilarse debajo de la lista de pacientes
- Los turnos próximos pueden apilarse debajo de las estadísticas
- El orden de apilado respeta la prioridad: lista primero, luego turnos, luego estadísticas

**Colapso no requerido:** No se requiere colapsar elementos en pantalla mediana, solo reorganizar.

### 3.4 Comportamiento en Pantalla Pequeña (Mobile)

#### 3.4.1 Visibilidad de Elementos

| Elemento | Visibilidad | Comportamiento |
|----------|-------------|---------------|
| **Lista de pacientes** | Siempre visible | Ocupa ancho completo, elemento principal |
| **Estadísticas operativas** | Siempre visible | Apilada debajo de lista, puede requerir scroll |
| **Turnos próximos** | Siempre visible | Apilada debajo de estadísticas, puede requerir scroll |

**Regla:** Todos los elementos están visibles, pero requieren scroll vertical para acceder a todos. La lista de pacientes es lo primero que se ve.

#### 3.4.2 Prioridad de Información

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Lista de pacientes | Es el elemento principal del root |
| **2 (Alta)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **3 (Media)** | Estadísticas operativas | Proporciona contexto pero no es acción primaria |

#### 3.4.3 Reglas de Colapso o Apilado

**Apilado vertical obligatorio:**
- Lista de pacientes en la parte superior
- Turnos próximos debajo de la lista
- Estadísticas operativas debajo de los turnos

**Colapso no permitido:** Ningún elemento se oculta completamente. Todos están accesibles mediante scroll vertical.

#### 3.4.4 Acceso a la Lista de Pacientes

**Regla:** La lista de pacientes es siempre el primer elemento visible y accesible en pantalla pequeña.

**Comportamiento:**
- Al cargar el root en mobile, la lista de pacientes está en la parte superior
- No se requiere scroll para ver el inicio de la lista
- La lista es completamente funcional (búsqueda, selección) en mobile

### 3.5 Reglas Transversales del Root

#### 3.5.1 Qué Nunca Se Oculta

| Elemento | Regla |
|----------|-------|
| **Lista de pacientes** | Nunca se oculta, siempre visible |
| **Acceso a búsqueda de pacientes** | Nunca se oculta, siempre accesible |
| **Acceso a selección de paciente** | Nunca se oculta, siempre accesible |

**Justificación:** La lista de pacientes es el elemento principal del root. Sin ella, el root no cumple su propósito.

#### 3.5.2 Qué Puede Reubicarse

| Elemento | Regla de Reubicación |
|----------|---------------------|
| **Estadísticas operativas** | Puede moverse de columna lateral a apilado vertical |
| **Turnos próximos** | Puede moverse de columna lateral a apilado vertical |
| **Orden de apilado** | Respeta prioridad: lista, turnos, estadísticas |

**Justificación:** La reubicación mantiene la información accesible mientras optimiza el uso del espacio.

#### 3.5.3 Qué No Debe Mostrarse Simultáneamente en Mobile

**Regla:** En pantalla pequeña, la lista de pacientes y las estadísticas/turnos no deben competir por espacio horizontal.

**Comportamiento:**
- La lista de pacientes ocupa el ancho completo
- Las estadísticas y turnos se apilan debajo
- No hay columnas laterales en mobile

**Justificación:** En mobile, el espacio horizontal es limitado. El apilado vertical asegura legibilidad y usabilidad.

---

## 4. Lista de Pacientes — Responsive

### 4.1 Comportamiento en Desktop (Lista Persistente)

#### 4.1.1 Características Funcionales

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Lista siempre visible, puede estar en columna lateral o principal |
| **Persistencia** | La lista permanece visible durante la selección y navegación |
| **Búsqueda** | Campo de búsqueda siempre visible y accesible |
| **Selección** | Selección de paciente mantiene la lista visible |

**Regla:** La lista de pacientes es un elemento persistente que no se oculta al seleccionar un paciente.

#### 4.1.2 Integración con Otras Vistas

**En el root:**
- La lista está visible junto con estadísticas y turnos
- La selección de paciente navega a la vista del paciente, pero la lista permanece en el root

**En la vista del paciente:**
- La lista puede estar visible en una columna lateral
- La lista puede colapsarse pero no desaparece completamente

### 4.2 Comportamiento en Tablet

#### 4.2.1 Características Funcionales

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Lista puede estar en columna lateral o principal según espacio |
| **Persistencia** | La lista puede colapsarse pero permanece accesible |
| **Búsqueda** | Campo de búsqueda siempre visible y accesible |
| **Selección** | Selección de paciente puede ocultar la lista temporalmente si es necesario |

**Regla:** La lista de pacientes es accesible, pero puede requerir una acción (expandir/colapsar) para alternar con el contenido del paciente.

#### 4.2.2 Alternancia de Vistas

**Comportamiento permitido:**
- La lista y la vista del paciente pueden alternarse
- Un botón o acción permite volver a la lista
- La lista no se pierde, solo se oculta temporalmente

### 4.3 Comportamiento en Mobile

#### 4.3.1 Selección de Paciente

**Regla fundamental:** Un paciente a la vez en pantallas pequeñas.

| Acción | Comportamiento |
|--------|----------------|
| **Ver lista de pacientes** | Lista ocupa ancho completo, es el único elemento visible |
| **Seleccionar paciente** | La lista se oculta, se muestra la vista del paciente |
| **Volver a la lista** | Botón "Volver" o "Lista de pacientes" restaura la lista |

**Justificación:** En mobile, el espacio es limitado. Mostrar lista y paciente simultáneamente compromete la legibilidad y usabilidad.

#### 4.3.2 Navegación de Ida y Vuelta

**Flujo de navegación:**

1. **Estado inicial:** Lista de pacientes visible
2. **Selección:** Usuario selecciona un paciente
3. **Transición:** Lista se oculta, vista del paciente se muestra
4. **Navegación de vuelta:** Usuario activa "Volver" o "Lista de pacientes"
5. **Restauración:** Lista de pacientes se restaura, manteniendo estado de búsqueda si aplica

**Reglas:**
- El estado de búsqueda se preserva al navegar al paciente
- El estado de búsqueda se preserva al volver a la lista
- La posición de scroll en la lista se puede preservar (opcional, no requerido)

#### 4.3.3 Regla de Foco

**Regla:** Un paciente a la vez en pantallas pequeñas.

| Escenario | Comportamiento |
|-----------|----------------|
| **Lista visible** | Solo la lista tiene foco, no hay vista de paciente visible |
| **Paciente visible** | Solo la vista del paciente tiene foco, la lista está oculta |
| **Transición** | La transición es clara y no genera confusión sobre qué está visible |

**Justificación:** El foco único reduce la confusión y mejora la legibilidad en pantallas pequeñas.

### 4.4 Reglas Transversales de la Lista de Pacientes

#### 4.4.1 Funcionalidad Preservada

| Funcionalidad | Regla |
|---------------|-------|
| **Búsqueda** | Siempre accesible, independientemente del tamaño de pantalla |
| **Filtrado** | Siempre accesible, independientemente del tamaño de pantalla |
| **Selección** | Siempre funcional, independientemente del tamaño de pantalla |
| **Ordenamiento** | Siempre accesible, independientemente del tamaño de pantalla |

**Justificación:** La funcionalidad de la lista no cambia con el tamaño de pantalla. Solo cambia la presentación.

#### 4.4.2 Información Preservada

| Información | Regla |
|-------------|-------|
| **Nombre del paciente** | Siempre visible en todos los tamaños |
| **Identificador** | Siempre visible en todos los tamaños (puede estar abreviado en mobile) |
| **Estado (Activo/Inactivo)** | Siempre visible en todos los tamaños |
| **Información adicional** | Puede estar abreviada en mobile, pero accesible |

**Justificación:** La información esencial del paciente no se pierde al reducir el tamaño de pantalla.

---

## 5. Timeline Clínica — Responsive

### 5.1 Estructura Funcional de la Timeline

La timeline clínica presenta:
- **Información del paciente** (header) — Contexto permanente
- **Timeline de eventos** — Eventos NOTE y Encounter en orden cronológico
- **Paneles laterales** (opcional) — Medicamentos, turnos, notas, información del paciente

**Referencia:** Ver `25_patient_info_timeline_view.md` para la definición completa de la información del paciente en la timeline.

### 5.2 Orden de Información en Mobile

#### 5.2.1 Prioridad de Presentación

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Información del paciente (header) | Contexto permanente, identificación |
| **2 (Alta)** | Timeline de eventos | Contenido clínico principal |
| **3 (Media)** | Paneles laterales | Información de acceso rápido, puede colapsarse |

**Regla:** El orden de presentación en mobile respeta esta prioridad, apilando verticalmente.

#### 5.2.2 Apilado Vertical

**Orden de apilado en mobile:**

1. **Header del paciente** (siempre visible, fijo o sticky)
   - Nombre completo
   - Edad
   - Fecha de nacimiento
   - Estado

2. **Timeline de eventos** (contenido principal, scrollable)
   - Eventos en orden cronológico
   - Scroll vertical para navegar eventos

3. **Paneles laterales** (acceso rápido, pueden colapsarse)
   - Panel de medicamentos
   - Panel de turnos
   - Panel de notas
   - Panel de información del paciente

**Regla:** El apilado vertical mantiene el orden semántico y la prioridad clínica.

### 5.3 Comportamiento del Bloque de Información del Paciente

#### 5.3.1 En Pantalla Grande

| Característica | Comportamiento |
|----------------|----------------|
| **Ubicación** | Header fijo en la parte superior |
| **Visibilidad** | Siempre visible, no requiere scroll |
| **Panel de información** | Panel lateral siempre visible o accesible |

#### 5.3.2 En Pantalla Mediana

| Característica | Comportamiento |
|----------------|----------------|
| **Ubicación** | Header fijo o sticky en la parte superior |
| **Visibilidad** | Siempre visible, puede requerir scroll mínimo |
| **Panel de información** | Panel lateral puede colapsarse o apilarse debajo |

#### 5.3.3 En Pantalla Pequeña

| Característica | Comportamiento |
|----------------|----------------|
| **Ubicación** | Header sticky en la parte superior |
| **Visibilidad** | Siempre visible al hacer scroll hacia arriba |
| **Panel de información** | Panel apilado debajo de la timeline, puede colapsarse |

**Regla:** La información del paciente siempre está accesible, pero puede requerir scroll en mobile para ver el panel completo.

### 5.4 Visibilidad de Eventos NOTE y Encounter

#### 5.4.1 Regla Fundamental

**Regla:** Todos los eventos NOTE y Encounter son siempre visibles y accesibles, independientemente del tamaño de pantalla.

| Tipo de Evento | Visibilidad | Accesibilidad |
|----------------|-------------|---------------|
| **Eventos NOTE** | Siempre visibles | Siempre accesibles mediante scroll |
| **Eventos Encounter** | Siempre visibles | Siempre accesibles mediante scroll |

**Justificación:** Los eventos clínicos son el contenido principal de la timeline. No se ocultan ni se filtran por tamaño de pantalla.

#### 5.4.2 Presentación en Mobile

**Comportamiento:**
- Los eventos se apilan verticalmente
- Cada evento ocupa el ancho completo disponible
- El scroll vertical permite navegar todos los eventos
- No hay limitación en la cantidad de eventos visibles

**Regla:** La timeline nunca se fragmenta. Todos los eventos están en un solo flujo vertical.

### 5.5 Scroll y Jerarquía Temporal

#### 5.5.1 Dirección de Scroll

| Tamaño de Pantalla | Dirección de Scroll | Justificación |
|---------------------|---------------------|---------------|
| **Desktop** | Vertical (principal) | Orden cronológico vertical es estándar |
| **Tablet** | Vertical (principal) | Orden cronológico vertical es estándar |
| **Mobile** | Vertical (único) | Orden cronológico vertical, sin scroll horizontal |

**Regla:** El scroll es siempre vertical. No se introduce scroll horizontal en ningún tamaño de pantalla.

#### 5.5.2 Jerarquía Temporal

**Regla:** La timeline nunca se fragmenta.

| Aspecto | Regla |
|---------|-------|
| **Orden cronológico** | Se mantiene en todos los tamaños |
| **Fragmentación** | No se permite fragmentar la timeline en múltiples columnas o secciones |
| **Continuidad** | La timeline es un flujo continuo de eventos |

**Justificación:** La fragmentación de la timeline compromete la comprensión del flujo temporal y la narrativa clínica.

#### 5.5.3 Navegación Temporal

| Funcionalidad | Comportamiento Responsive |
|---------------|---------------------------|
| **Navegación a fecha específica** | Siempre accesible, puede requerir menú o botón en mobile |
| **Filtrado por fecha** | Siempre accesible, puede requerir menú o botón en mobile |
| **Ordenamiento** | Siempre accesible, puede requerir menú o botón en mobile |

**Regla:** Las funcionalidades de navegación temporal no se ocultan, pero pueden requerir más interacciones en mobile.

### 5.6 Reglas Transversales de la Timeline

#### 5.6.1 La Timeline Nunca Se Fragmenta

**Regla explícita:** La timeline de eventos es un flujo continuo y único. No se divide en múltiples columnas, secciones separadas, o vistas alternativas.

**Justificación:** La fragmentación compromete la comprensión del orden temporal y la narrativa clínica longitudinal.

#### 5.6.2 Los Eventos Mantienen Orden Cronológico

**Regla explícita:** El orden cronológico de los eventos se mantiene en todos los tamaños de pantalla, independientemente de cómo se reorganice la información circundante.

**Justificación:** El orden cronológico es fundamental para la comprensión clínica. No cambia con el tamaño de pantalla.

---

## 6. Vista de Nota Clínica — Responsive

### 6.1 Estructura Funcional de la Nota Clínica

Una nota clínica contiene:
- **Información del encuentro** — Fecha, tipo de encuentro
- **Contenido estructurado** — Subjetivo, Objetivo, Evaluación, Plan
- **Addenda** (si aplica) — Correcciones o ampliaciones
- **Acciones** — Finalizar (si es borrador), Agregar addendum (si está finalizada), Volver

**Referencia:** Ver `22_nota_clinica_evento_note.md` y `19_clinical_corrections_ux.md` para la definición completa de notas clínicas.

### 6.2 Prioridad del Contenido Textual

#### 6.2.1 Jerarquía de Prioridad

| Prioridad | Elemento | Justificación |
|-----------|----------|---------------|
| **1 (Máxima)** | Contenido de la nota (Subjetivo, Objetivo, Evaluación, Plan) | Es el contenido clínico principal |
| **2 (Alta)** | Información del encuentro (fecha, tipo) | Contexto necesario para interpretar la nota |
| **3 (Media)** | Addenda | Información adicional, importante pero secundaria |
| **4 (Baja)** | Metadatos (fechas de creación, finalización) | Información de soporte, no crítica para lectura |

**Regla:** El orden de presentación en mobile respeta esta prioridad, mostrando primero el contenido clínico.

#### 6.2.2 Apilado Vertical en Mobile

**Orden de apilado:**

1. **Información del encuentro** (header)
   - Fecha de encuentro
   - Tipo de encuentro
   - Estado (Borrador/Finalizada)

2. **Contenido estructurado** (contenido principal)
   - Subjetivo
   - Objetivo
   - Evaluación
   - Plan

3. **Addenda** (si aplica)
   - Cada addendum apilado en orden cronológico

4. **Acciones** (footer o sticky)
   - Botones de acción siempre accesibles

**Regla:** El apilado vertical asegura que el contenido clínico sea lo primero que se ve y lee.

### 6.3 Lectura Cómoda en Mobile

#### 6.3.1 Legibilidad del Texto

| Aspecto | Regla |
|---------|-------|
| **Tamaño de fuente** | Debe ser legible sin zoom en mobile |
| **Ancho de línea** | Debe optimizarse para lectura en mobile (no demasiado ancho ni estrecho) |
| **Espaciado** | Debe haber espaciado adecuado entre secciones |
| **Contraste** | Debe cumplir estándares de accesibilidad |

**Justificación:** La lectura de contenido clínico en mobile debe ser cómoda y sin fricción.

#### 6.3.2 Navegación del Contenido

| Funcionalidad | Comportamiento |
|---------------|----------------|
| **Scroll vertical** | Permite navegar todo el contenido de la nota |
| **Saltos a secciones** | Puede incluir enlaces o navegación a secciones específicas (opcional, no requerido) |
| **Preservación de posición** | La posición de scroll puede preservarse al volver a la nota (opcional, no requerido) |

**Regla:** El contenido completo de la nota es accesible mediante scroll vertical en mobile.

### 6.4 Acciones Visibles (Finalizar, Volver)

#### 6.4.1 Acciones Críticas

| Acción | Visibilidad | Comportamiento |
|--------|-------------|----------------|
| **Finalizar nota** (si es borrador) | Siempre visible y accesible | Puede estar en footer sticky en mobile |
| **Agregar addendum** (si está finalizada) | Siempre visible y accesible | Puede estar en footer sticky en mobile |
| **Volver a timeline** | Siempre visible y accesible | Puede estar en header o footer sticky en mobile |

**Regla:** Las acciones críticas nunca se ocultan. Pueden requerir scroll para acceder, pero están siempre presentes.

#### 6.4.2 Ubicación de Acciones en Mobile

**Comportamiento permitido:**
- Las acciones pueden estar en un footer sticky (siempre visible al hacer scroll hacia abajo)
- Las acciones pueden estar en un header sticky (siempre visible al hacer scroll hacia arriba)
- Las acciones pueden estar al final del contenido (requieren scroll, pero están presentes)

**Regla:** Las acciones están siempre accesibles, aunque puedan requerir scroll en mobile.

### 6.5 Restricciones de Edición en Pantallas Pequeñas

#### 6.5.1 Edición de Notas Borrador

| Aspecto | Regla |
|---------|-------|
| **Funcionalidad de edición** | Completa y funcional en mobile |
| **Optimización** | Puede no estar optimizada para carga extensa de texto, pero es funcional |
| **Validación** | Idéntica a desktop, sin simplificaciones |

**Justificación:** La edición en mobile es funcional, pero puede no ser la experiencia óptima para carga extensa de contenido.

#### 6.5.2 Restricciones No Aplicables

**Regla:** No se introducen restricciones funcionales en mobile que no existan en desktop.

| Funcionalidad | Restricción en Mobile |
|---------------|----------------------|
| **Editar campos** | No restringida |
| **Finalizar nota** | No restringida |
| **Agregar addendum** | No restringida |
| **Validaciones** | No simplificadas |

**Justificación:** El modelo funcional no cambia con el tamaño de pantalla. Solo cambia la presentación.

---

## 7. Estadísticas Operativas — Responsive

### 7.1 Estructura Funcional de las Estadísticas

Las estadísticas operativas en el root incluyen:
- **Gráfico de pacientes** — Cantidad de pacientes activos/inactivos
- **Listado de turnos próximos** — Turnos agendados para los próximos 7 días

**Referencia:** Ver `25_root_behavior_spec.md` para la definición completa de las estadísticas operativas.

### 7.2 Comportamiento del Gráfico de Pacientes

#### 7.2.1 En Pantalla Grande

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible en columna lateral o panel |
| **Tamaño** | Puede ser de tamaño completo sin restricciones |
| **Interactividad** | Puede incluir interactividad si está definida (no requerida) |

#### 7.2.2 En Pantalla Mediana

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, puede estar apilada |
| **Tamaño** | Puede reducirse pero mantiene legibilidad |
| **Interactividad** | Se preserva si existe |

#### 7.2.3 En Pantalla Pequeña

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, apilada debajo de lista y turnos |
| **Tamaño** | Puede reducirse pero mantiene legibilidad esencial |
| **Interactividad** | Se preserva si existe, puede adaptarse a touch |

**Regla:** El gráfico nunca se oculta completamente. Puede reducirse en tamaño pero mantiene la información esencial visible.

### 7.3 Comportamiento del Listado de Turnos Próximos

#### 7.3.1 En Pantalla Grande

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible en columna lateral o panel |
| **Cantidad de turnos** | Puede mostrar todos los turnos sin scroll |
| **Información por turno** | Completa (fecha, hora, paciente) |

#### 7.3.2 En Pantalla Mediana

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, puede estar apilada |
| **Cantidad de turnos** | Puede requerir scroll para ver todos |
| **Información por turno** | Completa (fecha, hora, paciente) |

#### 7.3.3 En Pantalla Pequeña

| Característica | Comportamiento |
|----------------|----------------|
| **Visibilidad** | Siempre visible, apilada debajo de lista |
| **Cantidad de turnos** | Requiere scroll para ver todos |
| **Información por turno** | Completa (fecha, hora, paciente), puede estar en formato más compacto |

**Regla:** El listado de turnos nunca se oculta completamente. Todos los turnos son accesibles mediante scroll.

### 7.4 Qué Métricas Se Muestran Primero

#### 7.4.1 Prioridad de Presentación

| Prioridad | Métrica | Justificación |
|-----------|---------|---------------|
| **1 (Máxima)** | Turnos próximos | Facilita acceso rápido a pacientes relevantes |
| **2 (Alta)** | Cantidad de pacientes (gráfico) | Proporciona contexto operativo |

**Regla:** En mobile, los turnos próximos se muestran antes que el gráfico de pacientes, respetando la prioridad funcional.

### 7.5 Qué Métricas Pueden Resumirse

#### 7.5.1 Resumen Permitido

| Métrica | Resumen Permitido | Formato de Resumen |
|---------|-------------------|-------------------|
| **Cantidad de pacientes** | Sí, puede mostrarse como número en lugar de gráfico | "X activos, Y inactivos" |
| **Turnos próximos** | No, se muestran todos los turnos | Lista completa, scrollable |

**Regla:** Las métricas pueden resumirse visualmente (gráfico → número), pero la información completa sigue accesible.

#### 7.5.2 Resumen No Permitido

**Regla:** No se permite ocultar métricas completamente ni reducir la información mostrada más allá del resumen visual.

| Métrica | Restricción |
|---------|-------------|
| **Cantidad de pacientes** | No se oculta, solo se puede resumir visualmente |
| **Turnos próximos** | No se oculta, todos los turnos son accesibles |

### 7.6 Reglas Transversales de las Estadísticas

#### 7.6.1 No Se Pierden Métricas

**Regla explícita:** Todas las métricas mostradas en desktop están disponibles en mobile. No se ocultan métricas por tamaño de pantalla.

**Justificación:** Las estadísticas operativas proporcionan contexto importante. Perder métricas compromete la orientación diaria.

#### 7.6.2 Se Reorganizan, No Se Eliminan

**Regla explícita:** Las métricas se reorganizan (apilado vertical, resumen visual), pero no se eliminan ni se ocultan permanentemente.

**Justificación:** La reorganización mantiene la información accesible mientras optimiza el uso del espacio.

---

## 8. Reglas Transversales

### 8.1 No Duplicar Información en Distintos Lugares

**Regla:** La información no se duplica en múltiples lugares para compensar limitaciones de espacio.

| Escenario Problemático | Regla |
|------------------------|-------|
| **Mostrar información del paciente en header y panel** | Permitido (son contextos diferentes: header = identidad, panel = detalles) |
| **Duplicar eventos en múltiples secciones** | No permitido |
| **Repetir acciones en múltiples lugares** | No permitido (excepto acciones críticas que pueden estar en header y footer) |

**Justificación:** La duplicación genera confusión y aumenta la complejidad de mantenimiento.

### 8.2 No Esconder Acciones Críticas

**Regla:** Las acciones críticas nunca se ocultan completamente, independientemente del tamaño de pantalla.

| Acción Crítica | Regla de Visibilidad |
|----------------|---------------------|
| **Seleccionar paciente** | Siempre accesible |
| **Finalizar nota** | Siempre accesible |
| **Agregar addendum** | Siempre accesible |
| **Volver a lista** | Siempre accesible |
| **Navegar a timeline** | Siempre accesible |

**Justificación:** Las acciones críticas son esenciales para el flujo de trabajo clínico. Ocultarlas compromete la usabilidad.

### 8.3 No Generar Confusión Entre Contexto y Eventos

**Regla:** La información contextual (información del paciente) y los eventos clínicos (timeline) deben mantenerse claramente diferenciados en todos los tamaños de pantalla.

| Aspecto | Regla |
|---------|-------|
| **Separación visual** | Debe mantenerse en todos los tamaños |
| **Separación funcional** | Debe mantenerse en todos los tamaños |
| **Claridad de propósito** | Debe mantenerse en todos los tamaños |

**Justificación:** La confusión entre contexto y eventos compromete la comprensión clínica y la precisión de la documentación.

### 8.4 Mantener Consistencia Semántica y Clínica

**Regla:** El significado semántico y la organización clínica de la información se mantiene en todos los tamaños de pantalla.

| Aspecto | Regla |
|---------|-------|
| **Orden semántico** | Se mantiene (información del paciente → timeline → paneles) |
| **Jerarquía clínica** | Se mantiene (eventos más recientes primero, orden cronológico) |
| **Agrupación lógica** | Se mantiene (eventos NOTE juntos, eventos Encounter juntos) |

**Justificación:** La consistencia semántica y clínica asegura que el sistema sea predecible y comprensible en todos los contextos de uso.

---

## 9. Impacto en UX Clínico

### 9.1 Reducción de Errores de Navegación

#### 9.1.1 Claridad de Foco

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Reducción de confusión sobre qué está visible** | Foco único en mobile (un elemento a la vez) |
| **Reducción de errores de selección** | Lista de pacientes clara y accesible en todos los tamaños |
| **Reducción de navegación errónea** | Acciones críticas siempre visibles y accesibles |

**Impacto:** El clínico tiene menos probabilidad de cometer errores de navegación cuando el foco es claro y las acciones son accesibles.

#### 9.1.2 Preservación de Contexto

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Información del paciente siempre visible** | Header sticky o fijo en todos los tamaños |
| **Estado de navegación claro** | Transiciones claras entre vistas en mobile |
| **Acceso rápido a información contextual** | Paneles laterales accesibles (colapsables pero no ocultos) |

**Impacto:** El clínico mantiene el contexto del paciente incluso al navegar en mobile, reduciendo errores de identificación.

### 9.2 Continuidad del Trabajo Entre Dispositivos

#### 9.2.1 Consistencia Funcional

| Aspecto | Beneficio |
|---------|----------|
| **Mismo comportamiento clínico** | El clínico puede cambiar de dispositivo sin re-aprender el sistema |
| **Misma información disponible** | Toda la información está disponible en todos los dispositivos |
| **Mismos flujos de trabajo** | Los flujos son idénticos, solo cambia la presentación |

**Impacto:** El clínico puede continuar su trabajo en diferentes dispositivos sin interrupciones o confusiones.

#### 9.2.2 Preservación de Estado

| Aspecto | Beneficio |
|---------|----------|
| **Estado de búsqueda preservado** | Al volver a la lista, la búsqueda se mantiene |
| **Posición en timeline preservable** | El clínico puede retomar donde dejó (opcional, no requerido) |
| **Contexto del paciente preservado** | La información del paciente está siempre disponible |

**Impacto:** El clínico puede retomar su trabajo sin perder contexto o tener que re-navegar.

### 9.3 Claridad de Foco en Cada Tamaño de Pantalla

#### 9.3.1 Foco Único en Mobile

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Reducción de distracciones** | Un elemento a la vez tiene foco principal |
| **Mejora de legibilidad** | Contenido ocupa ancho completo, optimizado para lectura |
| **Claridad de acción** | Acciones críticas claramente visibles y accesibles |

**Impacto:** El clínico puede concentrarse en una tarea a la vez en mobile, mejorando la precisión y eficiencia.

#### 9.3.2 Foco Múltiple en Desktop

| Beneficio | Cómo se Logra |
|-----------|---------------|
| **Vista panorámica** | Múltiples elementos visibles simultáneamente |
| **Acceso rápido a contexto** | Paneles laterales siempre visibles |
| **Eficiencia en navegación** | Menos interacciones necesarias para acceder a información |

**Impacto:** El clínico puede trabajar de manera más eficiente en desktop, aprovechando el espacio disponible.

---

## 10. Casos Fuera de Alcance

### 10.1 Aplicación Móvil Nativa

**Fuera de alcance:** Esta especificación no define el comportamiento de una aplicación móvil nativa.

| Aspecto | Alcance de esta Especificación |
|---------|-------------------------------|
| **Aplicación web responsive** | Dentro del alcance |
| **Aplicación móvil nativa (iOS/Android)** | Fuera del alcance |
| **Progressive Web App (PWA)** | Fuera del alcance (puede considerarse en el futuro) |

**Justificación:** Esta especificación se enfoca en el comportamiento responsive de la aplicación web existente, no en aplicaciones nativas.

### 10.2 Gestos Avanzados

**Fuera de alcance:** Esta especificación no define el uso de gestos avanzados (swipe, pinch, etc.).

| Gestos | Alcance |
|--------|---------|
| **Clic/tap** | Dentro del alcance (interacción estándar) |
| **Scroll** | Dentro del alcance (navegación estándar) |
| **Swipe** | Fuera del alcance |
| **Pinch to zoom** | Fuera del alcance (comportamiento del navegador) |
| **Gestos personalizados** | Fuera del alcance |

**Justificación:** Esta especificación se enfoca en el comportamiento funcional responsive, no en interacciones avanzadas con gestos.

### 10.3 Modo Offline

**Fuera de alcance:** Esta especificación no define el comportamiento del sistema en modo offline.

| Aspecto | Alcance |
|---------|---------|
| **Funcionalidad online** | Dentro del alcance |
| **Funcionalidad offline** | Fuera del alcance |
| **Sincronización** | Fuera del alcance |
| **Caché local** | Fuera del alcance |

**Justificación:** Esta especificación asume conectividad a internet. El modo offline es una funcionalidad futura que requiere especificación separada.

### 10.4 Personalización por Usuario

**Fuera de alcance:** Esta especificación no define personalización de la experiencia responsive por usuario.

| Aspecto | Alcance |
|---------|---------|
| **Comportamiento estándar responsive** | Dentro del alcance |
| **Personalización de layout** | Fuera del alcance |
| **Preferencias de usuario** | Fuera del alcance |
| **Configuración de breakpoints** | Fuera del alcance |

**Justificación:** Esta especificación define el comportamiento responsive estándar del sistema. La personalización es una funcionalidad futura que requiere especificación separada.

---

## 11. Restricciones

### 11.1 No Modificar Modelo de Datos

**Restricción:** Esta especificación no requiere ni permite modificaciones al modelo de datos.

| Aspecto | Regla |
|---------|-------|
| **Entidades existentes** | No se modifican |
| **Relaciones existentes** | No se modifican |
| **Campos existentes** | No se modifican |
| **Nuevas entidades** | No se crean |

**Justificación:** Esta especificación define comportamiento de presentación, no cambios al dominio.

### 11.2 No Alterar Comportamiento Clínico

**Restricción:** Esta especificación no altera el comportamiento clínico del sistema.

| Aspecto | Regla |
|---------|-------|
| **Reglas de negocio** | No se modifican |
| **Validaciones** | No se modifican |
| **Flujos de trabajo clínicos** | No se modifican |
| **Generación de eventos** | No se modifica |

**Justificación:** El comportamiento clínico es independiente del tamaño de pantalla. Solo cambia la presentación.

### 11.3 No Introducir Nuevas Vistas

**Restricción:** Esta especificación no introduce nuevas vistas o pantallas.

| Aspecto | Regla |
|---------|-------|
| **Vistas existentes** | Se adaptan responsive, no se crean nuevas |
| **Nuevas pantallas** | No se crean |
| **Vistas alternativas** | No se crean (solo reorganización de vistas existentes) |

**Justificación:** Esta especificación define la adaptación de vistas existentes, no la creación de nuevas funcionalidades.

### 11.4 No Definir UI Concreta ni Breakpoints Técnicos

**Restricción:** Esta especificación no define implementación técnica concreta.

| Aspecto | Regla |
|---------|-------|
| **Breakpoints en píxeles** | No se definen |
| **Componentes específicos** | No se definen |
| **CSS concreto** | No se define |
| **Framework de UI** | No se especifica |

**Justificación:** Esta especificación es funcional, no técnica. La implementación queda para el equipo de desarrollo.

### 11.5 No Cambiar Stack Tecnológico

**Restricción:** Esta especificación no requiere cambios al stack tecnológico.

| Aspecto | Regla |
|---------|-------|
| **Tecnologías existentes** | Se mantienen |
| **Nuevas tecnologías** | No se introducen |
| **Dependencias** | No se modifican (excepto actualizaciones normales) |

**Justificación:** Esta especificación define comportamiento funcional, no cambios tecnológicos.

---

## 12. Relación con Otras Especificaciones

### 12.1 Dependencias

Esta especificación depende de:

- **`25_root_behavior_spec.md`** — Define el comportamiento funcional del root que se adapta responsive
- **`18_patient_crud_specs.md`** — Define el comportamiento de la lista de pacientes que se adapta responsive
- **`25_patient_info_timeline_view.md`** — Define la información del paciente en la timeline que se adapta responsive
- **`22_nota_clinica_evento_note.md`** — Define las notas clínicas que se adaptan responsive
- **`19_clinical_corrections_ux.md`** — Define el flujo de correcciones que se adapta responsive

### 12.2 Consumidores

Esta especificación es consumida por:

- **Implementación de Frontend** — Define cómo deben adaptarse los componentes a diferentes tamaños
- **Diseño de UX** — Define las expectativas de experiencia responsive
- **QA Testing** — Define los casos de prueba para validar el comportamiento responsive

### 12.3 Integración con Otras Funcionalidades

Esta especificación se integra con todas las vistas del sistema:

| Vista | Punto de Integración |
|-------|---------------------|
| **Root (`/`)** | Adaptación de lista de pacientes, estadísticas y turnos |
| **Lista de Pacientes** | Adaptación de búsqueda, selección y navegación |
| **Timeline Clínica** | Adaptación de información del paciente, eventos y paneles laterales |
| **Vista de Nota Clínica** | Adaptación de contenido, addenda y acciones |
| **Estadísticas Operativas** | Adaptación de gráficos y listados |

---

## 13. Garantías Funcionales

### 13.1 Garantías de Comportamiento Responsive

El sistema garantiza que:

| Garantía | Descripción |
|----------|-------------|
| **Información Completa Accesible** | Toda la información disponible en desktop está accesible en mobile |
| **Funcionalidad Preservada** | Toda la funcionalidad disponible en desktop está disponible en mobile |
| **Orden Semántico Mantenido** | El orden semántico y clínico se mantiene en todos los tamaños |
| **Legibilidad Asegurada** | El contenido clínico es legible en todos los tamaños de pantalla |

### 13.2 Garantías de No Comportamiento

El sistema garantiza que el comportamiento responsive:

| Garantía | Descripción |
|----------|-------------|
| **No oculta información clínica** | Nunca se oculta información clínica por tamaño de pantalla |
| **No oculta acciones críticas** | Nunca se ocultan acciones críticas por tamaño de pantalla |
| **No fragmenta la timeline** | La timeline nunca se fragmenta en múltiples secciones |
| **No altera el modelo funcional** | El modelo funcional no cambia con el tamaño de pantalla |

---

## 14. Resumen

### 14.1 Objetivo de la Especificación

Esta especificación define el comportamiento funcional responsive del sistema de Historias Clínicas Psiquiátricas, asegurando:

1. **Usabilidad** — El sistema es usable en todos los tamaños de pantalla
2. **Claridad clínica** — La información clínica es clara y legible en todos los tamaños
3. **Continuidad de flujo** — El flujo de trabajo clínico se mantiene en todos los tamaños
4. **Preservación de información** — Toda la información clínica y administrativa está accesible

### 14.2 Principios Fundamentales

1. **Legibilidad clínica prima sobre densidad** — El sistema es clínico, la legibilidad es prioritaria
2. **El paciente es el eje central** — Independientemente del tamaño de pantalla
3. **La información no se pierde** — Se reorganiza, no se oculta
4. **Mobile es para consulta** — No para carga intensiva
5. **El modelo funcional no cambia** — Solo cambia la presentación

### 14.3 Comportamiento por Vista

| Vista | Comportamiento Responsive |
|-------|---------------------------|
| **Root (`/`)** | Lista siempre visible, estadísticas y turnos se apilan en mobile |
| **Lista de Pacientes** | Persistente en desktop, alternante en tablet, única en mobile |
| **Timeline Clínica** | Información del paciente sticky, timeline scrollable, paneles apilados en mobile |
| **Vista de Nota Clínica** | Contenido apilado verticalmente, acciones siempre accesibles |
| **Estadísticas Operativas** | Gráficos y listados se apilan, información completa accesible |

### 14.4 Reglas Transversales

1. **No duplicar información** — La información no se duplica en múltiples lugares
2. **No esconder acciones críticas** — Las acciones críticas siempre están accesibles
3. **No generar confusión** — Contexto y eventos se mantienen diferenciados
4. **Mantener consistencia** — Consistencia semántica y clínica en todos los tamaños

---

*Versión del Documento: 1.0*  
*Estado: Final*  
*Depende De: 25_root_behavior_spec.md, 18_patient_crud_specs.md, 25_patient_info_timeline_view.md, 22_nota_clinica_evento_note.md, 19_clinical_corrections_ux.md*  
*Consumido Por: Implementación de Frontend, Diseño de UX, QA Testing*


---

# UX/UI

## 07_stack_ux_constraints.md

# Psychiatric Medical Records System — Stack & UX Constraints

## Overview

This document defines implementation constraints for the MVP.

All constraints are designed to minimize ambiguity during AI-driven development.

Constraints are declarative. Implementation agents must comply without interpretation.

---

## 1. Stack Constraints

### 1.1 Target Runtime

**Runtime Family:** Server-side JavaScript/TypeScript

**Rationale:**
- Single-language stack reduces cognitive switching
- Strong typing with TypeScript reduces implementation ambiguity
- Mature ecosystem for data persistence and validation

**Constraint:** All application logic must execute in a single runtime environment.

### 1.2 Data Storage Approach

**Storage Type:** Embedded relational database with SQL interface

**Rationale:**
- Single-user context eliminates need for client-server database
- Relational model enforces referential integrity natively
- SQL provides deterministic query semantics
- Embedded database simplifies deployment and backup

**Constraints:**
- Data must persist locally on the clinician's device
- All entity relationships must be enforced at the database level
- Schema must define foreign keys for all relationships documented in domain model
- Migrations must be versioned and reversible

### 1.3 Architectural Style

**Style:** Modular monolith

**Rationale:**
- Single-user application does not benefit from distributed architecture
- Monolith reduces operational complexity
- Modular structure enables future decomposition if needed

**Constraints:**
- Application runs as a single process
- Domain entities must be isolated in dedicated modules
- No network calls between internal components
- Clear boundaries between persistence, domain logic, and presentation

### 1.4 Application Delivery

**Delivery Model:** Desktop application with local execution

**Rationale:**
- Clinical data remains on clinician's device
- No external dependencies for core functionality
- Aligns with single-device context assumption

**Constraints:**
- Application must function without network connectivity
- No cloud services required for core features
- Clinician controls data location and backup

### 1.5 Explicit Stack Exclusions

The following must NOT be used:

| Excluded | Reason |
|----------|--------|
| Microservices architecture | Unnecessary complexity for single-user system |
| External database servers | Adds deployment complexity; embedded is sufficient |
| GraphQL | Over-engineered for MVP scope |
| Real-time synchronization | No multi-device or multi-user requirement |
| Server-side rendering frameworks | Not a web application |
| Container orchestration | Single-process application |
| Message queues | No async processing requirements |
| Caching layers | Data volume does not justify caching complexity |
| ORMs with lazy loading | Implicit queries create unpredictable behavior |
| NoSQL document stores | Relational integrity is critical for clinical data |

---

## 2. UX Principles (Clinical)

### 2.1 Cognitive Load Minimization

**Principle:** The interface must never require the clinician to remember information across screens.

**Constraints:**
- Patient context must be visible at all times when within a patient record
- Current medication list must be accessible within one interaction from any patient view
- Active draft notes must be visibly indicated to prevent forgotten documentation
- Confirmation dialogs must only appear for irreversible actions

**Irreversible actions requiring confirmation:**
- Note finalization
- Patient status change to inactive
- Medication discontinuation

### 2.2 Timeline-First Navigation

**Principle:** The clinical timeline is the primary navigation structure for patient records.

**Constraints:**
- Opening a patient record must default to timeline view
- Timeline must display without requiring additional clicks or selections
- Most recent events must be visible immediately (reverse chronological default)
- Navigation to any historical period must require no more than two interactions
- Filtering must not reset scroll position or lose navigation context

### 2.3 Speed of Access to Key Information

**Principle:** Frequently accessed information must be reachable within one interaction from patient context.

**Key information with one-interaction access:**
- Current active medications
- Most recent finalized note
- Next scheduled appointment (if exists)
- Current psychiatric history version
- Patient demographic summary

**Constraints:**
- Key information panels must not require page navigation
- Loading indicators must appear within 100ms if data retrieval exceeds threshold
- Search results must display as-you-type (no submit action required)

### 2.4 Editing Behavior for Clinical Data

**Principle:** The interface must make immutability visible and understandable.

**Constraints:**
- Finalized notes must be visually distinct from draft notes
- Edit controls must not appear on finalized content
- Addendum creation must be the only visible action for finalized notes
- Draft notes must show clear "Finalize" and "Delete" actions
- The finalization action must explain permanence before execution
- Medication discontinuation must require reason entry before completion

### 2.5 Documentation Workflow

**Principle:** Clinical documentation must support both real-time and retrospective entry.

**Constraints:**
- Encounter date must be editable and default to today
- Past encounter dates must be selectable without warnings (backdating is legitimate)
- Draft notes must auto-persist to prevent data loss
- Incomplete required fields must be indicated but not block draft saving
- Finalization must validate all required fields and block if incomplete

### 2.6 Error Prevention

**Principle:** The interface must prevent errors rather than recover from them.

**Constraints:**
- Duplicate patient warning must appear before creation completes
- Future dates must be rejected for encounters and medication starts
- End date before start date must be rejected for medications
- Empty required fields must be highlighted before finalization attempt

---

## 3. Non-Goals

### 3.1 What the Stack Will NOT Optimize For

- **Horizontal scalability** — Single-user system; scaling is not relevant
- **High availability** — Clinician controls when system is available
- **Multi-tenancy** — One clinician, one dataset
- **API consumption** — No external integrations in MVP
- **Cross-platform parity** — Optimize for primary platform only
- **Offline-first sync** — No sync; offline is the only mode
- **Plugin architecture** — Extensibility is not an MVP concern
- **Internationalization** — English language only for MVP

### 3.2 What the UX Will NOT Optimize For

- **First-time user onboarding** — Clinician is assumed competent
- **Discoverability of features** — Clinical workflow is predictable
- **Accessibility compliance** — Not in MVP scope (single known user)
- **Mobile responsiveness** — Desktop-only per specifications
- **Theming or customization** — Functional over aesthetic
- **Keyboard-only navigation** — Not required for MVP
- **Print layouts** — Not in MVP scope
- **Data visualization** — No charts or graphs in MVP
- **Bulk operations** — Single-record workflows only
- **Undo functionality** — Immutability replaces undo

---

## 4. Agent Guardrails

### 4.1 What Implementation Agents Are Allowed to Decide

Agents may make autonomous decisions on:

- [ ] Internal function and variable naming conventions
- [ ] File and folder organization within module boundaries
- [ ] Choice of validation library within runtime constraints
- [ ] Error message wording (non-clinical)
- [ ] Internal data transformation logic
- [ ] Test structure and organization
- [ ] Database index selection for query performance
- [ ] Date/time formatting for display
- [ ] Pagination thresholds for large result sets
- [ ] Debounce timing for search-as-you-type
- [ ] Loading state presentation

### 4.2 What Requires Human Confirmation

Agents must request confirmation before:

- [ ] Adding any dependency not explicitly listed in constraints
- [ ] Changing database schema after initial implementation
- [ ] Modifying entity relationships defined in domain model
- [ ] Altering validation rules defined in use cases
- [ ] Changing event generation logic
- [ ] Adding new event types
- [ ] Modifying timeline ordering algorithm
- [ ] Adding any network-dependent functionality
- [ ] Creating backup or export functionality
- [ ] Implementing any authentication mechanism
- [ ] Adding any logging that includes clinical content

### 4.3 What Must Never Be Assumed

Agents must never assume:

| Assumption | Why Prohibited |
|------------|----------------|
| Users will read documentation | Interface must be self-explanatory |
| Network is available | Core functionality must work offline |
| Multiple users exist | Single-user model is fundamental |
| Data can be deleted | Immutability is a core principle |
| Timestamps are accurate | System clock may be incorrect |
| Patient names are unique | Duplicate names are common |
| Medication names are standardized | Free-text entry is accepted |
| Encounter types will expand | Use enumerated types only |
| Draft notes will be finalized | Drafts may be abandoned |
| Appointments predict notes | No automatic linking |
| Clinical content can be logged | PHI must not appear in logs |
| Future dates are errors | Some fields may legitimately accept them |
| Empty fields are errors | Only required fields must be validated |

### 4.4 Implementation Boundaries

**Agents must stay within these boundaries:**

- Implement only what is defined in specification documents
- Do not add "helpful" features not in specifications
- Do not optimize for scenarios not described in use cases
- Do not add defensive code for multi-user scenarios
- Do not implement "soft delete" beyond patient inactive status
- Do not add audit logging beyond what immutability provides
- Do not create admin interfaces
- Do not implement data export/import
- Do not add reporting capabilities
- Do not implement search beyond specifications

### 4.5 When to Stop and Ask

Agents must pause implementation and request guidance when:

- A use case scenario is not covered by specifications
- Two specification documents appear to conflict
- A required field in the domain model has no validation rule
- An edge case from `05_edge_cases.md` is encountered without resolution
- Implementation requires a third-party service
- A decision would affect timeline integrity
- A decision would affect data immutability guarantees

---

## 5. Constraint Verification

Before considering any component complete, verify:

### 5.1 Stack Compliance

- [ ] All code executes in specified runtime
- [ ] Data persists in embedded relational database
- [ ] No external network dependencies
- [ ] No excluded technologies present
- [ ] Single-process execution model

### 5.2 UX Compliance

- [ ] Timeline is default patient view
- [ ] Key information accessible in one interaction
- [ ] Finalized content is visually immutable
- [ ] Confirmation dialogs for irreversible actions only
- [ ] Patient context visible in all patient views
- [ ] Search operates as-you-type

### 5.3 Guardrail Compliance

- [ ] No unauthorized dependencies added
- [ ] No assumption violations
- [ ] No features beyond specification scope
- [ ] All human confirmation items documented

---

*Document Version: 1.0*
*Status: Final*
*Sources: 01_specs.md, 06_dev_checklist.md*


---

## 19_clinical_corrections_ux.md

# Sistema de Historia Clínica Psiquiátrica — Diseño UX: Flujo de Correcciones Clínicas

## Overview

Este documento define el diseño UX del flujo de **Correcciones Clínicas** del sistema, garantizando que **ninguna corrección implique borrado, sobrescritura o pérdida de información**, y que toda modificación sea **aditiva, trazable y conforme a las invariantes clínicas**.

**Alcance:** Este documento especifica **QUÉ debe permitir el sistema y CÓMO debe presentarse al clínico**, sin introducir nuevas features ni alterar el dominio.

---

## 1. Alcance y Restricciones

### 1.1 Alcance Permitido (Estricto)

El sistema permite correcciones exclusivamente mediante:

1. **Corrección de notas finalizadas** → exclusivamente mediante **Addendum**
2. **Corrección / actualización de Historia Psiquiátrica** → exclusivamente mediante **nueva versión**

**Casos de uso para correcciones:**
- Error factual en nota finalizada
- Omisión relevante en nota finalizada
- Información conocida posteriormente que debe agregarse a nota finalizada
- Corrección de información en Historia Psiquiátrica
- Actualización de Historia Psiquiátrica con nueva información

### 1.2 Alcance Prohibido (Bloqueante)

El sistema **NO permite**:
- ❌ Editar contenido de notas finalizadas
- ❌ Borrar notas, eventos o versiones
- ❌ Modificar timestamps históricos
- ❌ Generar eventos no especificados
- ❌ Introducir nuevas entidades o estados
- ❌ Simplificar flujos a costa de invariantes

---

## 2. Flujo 1: Addendum sobre Nota Finalizada

### 2.1 Punto de Inicio

**Contexto:** El clínico está visualizando una nota finalizada en el timeline o en la vista de detalle de la nota.

**Condición previa:** La nota debe estar en estado `Finalized`.

**Acceso al flujo:**
- Desde la vista de detalle de la nota finalizada
- Botón visible: "Agregar addendum" o "Corregir nota"
- El botón aparece únicamente si `note.status === Finalized`

### 2.2 Flujo Paso a Paso

#### Paso 1: Iniciar Corrección
1. Clínico visualiza nota finalizada
2. Clínico identifica necesidad de corrección o adición de información
3. Clínico hace clic en "Agregar addendum"
4. Sistema valida que la nota está finalizada
5. Sistema muestra formulario de addendum

**Validación en este paso:**
- Si `note.status !== Finalized` → Bloquear con mensaje: "Solo se pueden agregar addenda a notas finalizadas. Esta nota está en estado borrador."

#### Paso 2: Completar Formulario
1. Sistema muestra formulario con dos campos:
   - **Campo 1: Contenido** (textarea, requerido)
     - Label: "Contenido del addendum"
     - Placeholder: "Ingrese la información adicional o corrección..."
     - Validación: No puede estar vacío (después de trim)
   - **Campo 2: Razón** (textarea, requerido)
     - Label: "Razón del addendum"
     - Placeholder: "Explique por qué se agrega este addendum..."
     - Validación: No puede estar vacío (después de trim)
2. Clínico completa ambos campos
3. Clínico puede cancelar (cierra formulario sin guardar)

**Estados del formulario:**
- Campos vacíos → Botón "Guardar addendum" deshabilitado
- Al menos un campo con contenido → Botón "Guardar addendum" habilitado
- Validación en tiempo real: mostrar error si campo queda vacío tras trim

#### Paso 3: Confirmación y Guardado
1. Clínico hace clic en "Guardar addendum"
2. Sistema valida:
   - Contenido no vacío (después de trim)
   - Razón no vacía (después de trim)
   - Nota sigue siendo finalizada (verificación de estado)
3. Si validación falla → Mostrar mensaje de error específico
4. Si validación pasa → Sistema crea addendum
5. Sistema muestra confirmación: "Addendum agregado correctamente"
6. Sistema actualiza vista para mostrar nota con addendum

**Post-condiciones:**
- Addendum creado con `noteId` vinculado a la nota original
- Addendum es inmutable desde su creación
- Nota original permanece inalterada
- Addendum aparece en la vista junto a la nota original

### 2.3 Acciones Permitidas

| Acción | Cuándo | Resultado |
|--------|--------|-----------|
| Ver nota finalizada | Siempre | Muestra contenido original |
| Agregar addendum | Solo si nota está finalizada | Crea nuevo addendum |
| Ver addenda existentes | Siempre | Muestra todos los addenda en orden cronológico |
| Cancelar creación de addendum | Durante formulario | Cierra formulario sin guardar |

### 2.4 Acciones Bloqueadas

| Acción | Cuándo | Mensaje de Bloqueo |
|--------|--------|-------------------|
| Editar contenido de nota finalizada | Siempre | "Las notas finalizadas no son editables. Use un addendum para agregar información o correcciones." |
| Editar addendum existente | Siempre | "Los addenda no son editables una vez creados." |
| Borrar addendum | Siempre | "Los addenda no pueden eliminarse. Son parte del registro clínico permanente." |
| Agregar addendum a nota borrador | Si nota está en Draft | "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente." |

### 2.5 Confirmaciones Explícitas

**No se requiere confirmación explícita para:**
- Abrir formulario de addendum
- Cancelar formulario

**Confirmación implícita:**
- El acto de hacer clic en "Guardar addendum" es la confirmación
- El sistema muestra mensaje de éxito tras guardar: "Addendum agregado correctamente"

### 2.6 Visibilidad y Estados

#### Vista de Nota Finalizada (sin addenda)
- **Campos visibles:**
  - Fecha de encuentro (solo lectura)
  - Tipo de encuentro (solo lectura)
  - Subjetivo (solo lectura)
  - Objetivo (solo lectura)
  - Evaluación (solo lectura)
  - Plan (solo lectura)
  - Fecha de finalización (solo lectura)
- **Acciones visibles:**
  - "Agregar addendum" (habilitado)
  - "Ver timeline" (habilitado)
- **Indicadores:**
  - Badge: "Finalizada"
  - Icono de candado en campos de contenido

#### Vista de Nota Finalizada (con addenda)
- **Mismo contenido que arriba, más:**
  - Sección "Addenda" debajo del contenido original
  - Cada addendum muestra:
    - Fecha de creación (solo lectura)
    - Contenido (solo lectura)
    - Razón (solo lectura)
    - Separador visual entre addenda
  - Addenda ordenados cronológicamente (más antiguo primero)
- **Acciones visibles:**
  - "Agregar addendum" (habilitado)
  - "Ver timeline" (habilitado)
- **Indicadores:**
  - Contador: "X addenda" en la sección de addenda

#### Formulario de Addendum
- **Campos editables:**
  - Contenido (textarea)
  - Razón (textarea)
- **Acciones visibles:**
  - "Guardar addendum" (habilitado si campos válidos)
  - "Cancelar" (siempre habilitado)
- **Indicadores:**
  - Campos requeridos marcados con asterisco (*)
  - Mensajes de validación en tiempo real

---

## 3. Flujo 2: Nueva Versión de PsychiatricHistory

### 3.1 Punto de Inicio

**Contexto:** El clínico está visualizando la Historia Psiquiátrica actual del paciente.

**Condición previa:** Debe existir al menos una versión de PsychiatricHistory (versión 1 creada al registrar paciente).

**Acceso al flujo:**
- Desde la vista de Historia Psiquiátrica
- Botón visible: "Actualizar historia" o "Crear nueva versión"
- El botón aparece siempre (siempre se puede crear una nueva versión)

### 3.2 Flujo Paso a Paso

#### Paso 1: Iniciar Actualización
1. Clínico visualiza Historia Psiquiátrica actual
2. Clínico identifica necesidad de corrección o actualización
3. Clínico hace clic en "Actualizar historia"
4. Sistema carga versión actual (is_current = true)
5. Sistema muestra formulario pre-poblado con valores actuales

**Validación en este paso:**
- Sistema verifica que existe versión actual
- Si no existe versión actual → Error: "No se encontró historia psiquiátrica actual"

#### Paso 2: Editar Contenido
1. Sistema muestra formulario con todos los campos de Historia Psiquiátrica:
   - Motivo de consulta (textarea, opcional)
   - Historia de la enfermedad actual (textarea, opcional)
   - Antecedentes psiquiátricos (textarea, opcional)
   - Hospitalizaciones previas (textarea, opcional)
   - Antecedentes de intentos de suicidio (textarea, opcional)
   - Antecedentes de uso de sustancias (textarea, opcional)
   - Antecedentes psiquiátricos familiares (textarea, opcional)
   - Antecedentes médicos (textarea, opcional)
   - Antecedentes quirúrgicos (textarea, opcional)
   - Alergias (textarea, opcional)
   - Historia social (textarea, opcional)
   - Historia del desarrollo (textarea, opcional)
2. Clínico modifica uno o más campos
3. Clínico puede cancelar (cierra formulario sin guardar)

**Estados del formulario:**
- Todos los campos son opcionales
- Validación: Al menos un campo debe tener contenido diferente a la versión actual
- Si todos los campos son idénticos a la versión actual → Botón "Guardar nueva versión" deshabilitado con mensaje: "No hay cambios para guardar"

#### Paso 3: Confirmación y Guardado
1. Clínico hace clic en "Guardar nueva versión"
2. Sistema valida:
   - Al menos un campo tiene contenido diferente a la versión actual
   - Versión actual sigue existiendo
3. Si validación falla → Mostrar mensaje de error específico
4. Si validación pasa → Sistema crea nueva versión:
   - Marca versión actual con `is_current = false`
   - Establece `superseded_at = now()` en versión anterior
   - Crea nueva versión con `version_number = anterior + 1`
   - Marca nueva versión con `is_current = true`
   - Genera evento "History Update" (solo si version_number >= 2)
5. Sistema muestra confirmación: "Historia psiquiátrica actualizada. Nueva versión creada."
6. Sistema actualiza vista para mostrar nueva versión como actual

**Post-condiciones:**
- Nueva versión creada con número incrementado
- Versión anterior marcada como no actual (is_current = false)
- Versión anterior tiene superseded_at establecido
- Si version_number >= 2 → Evento "History Update" generado
- Versión anterior permanece accesible en historial de versiones
- Nueva versión es inmutable desde su creación

### 3.3 Acciones Permitidas

| Acción | Cuándo | Resultado |
|--------|--------|-----------|
| Ver versión actual | Siempre | Muestra versión con is_current = true |
| Crear nueva versión | Siempre | Crea nueva versión y marca anterior como no actual |
| Ver historial de versiones | Siempre | Muestra todas las versiones con fechas |
| Ver versión histórica específica | Siempre | Muestra versión seleccionada (solo lectura) |
| Cancelar creación de nueva versión | Durante formulario | Cierra formulario sin guardar |

### 3.4 Acciones Bloqueadas

| Acción | Cuándo | Mensaje de Bloqueo |
|--------|--------|-------------------|
| Editar versión existente | Siempre | "Las versiones de historia psiquiátrica no son editables. Cree una nueva versión para actualizar la información." |
| Borrar versión | Siempre | "Las versiones de historia psiquiátrica no pueden eliminarse. Son parte del registro clínico permanente." |
| Modificar número de versión | Siempre | "El número de versión es asignado automáticamente por el sistema." |
| Modificar fecha de creación | Siempre | "La fecha de creación no puede modificarse." |
| Modificar fecha de supersedencia | Siempre | "La fecha de supersedencia es asignada automáticamente por el sistema." |

### 3.5 Confirmaciones Explícitas

**No se requiere confirmación explícita para:**
- Abrir formulario de actualización
- Cancelar formulario

**Confirmación implícita:**
- El acto de hacer clic en "Guardar nueva versión" es la confirmación
- El sistema muestra mensaje de éxito tras guardar: "Historia psiquiátrica actualizada. Nueva versión creada."

**Advertencia visual (opcional pero recomendado):**
- Mostrar mensaje informativo: "Se creará una nueva versión. La versión actual quedará preservada en el historial."

### 3.6 Visibilidad y Estados

#### Vista de Historia Psiquiátrica Actual
- **Campos visibles (todos solo lectura):**
  - Número de versión (badge: "Versión X")
  - Fecha de creación
  - Todos los campos de contenido (motivo de consulta, antecedentes, etc.)
  - Si existe versión anterior → Indicador: "Versión anterior disponible"
- **Acciones visibles:**
  - "Actualizar historia" (habilitado)
  - "Ver historial de versiones" (habilitado si hay más de una versión)
- **Indicadores:**
  - Badge: "Versión actual"
  - Icono de candado en todos los campos

#### Vista de Historial de Versiones
- **Lista de versiones:**
  - Cada versión muestra:
    - Número de versión
    - Fecha de creación
    - Fecha de supersedencia (si aplica)
    - Badge "Actual" o "Histórica"
    - Botón "Ver detalles"
  - Versiones ordenadas por número (más reciente primero)
- **Acciones visibles:**
  - "Ver detalles" para cada versión (habilitado)
  - "Volver a versión actual" (habilitado)

#### Vista de Versión Histórica Específica
- **Mismo formato que versión actual, pero:**
  - Badge: "Versión histórica"
  - Todos los campos solo lectura
  - Fecha de supersedencia visible (si aplica)
- **Acciones visibles:**
  - "Volver a historial" (habilitado)
  - "Ver versión actual" (habilitado)

#### Formulario de Nueva Versión
- **Campos editables:**
  - Todos los campos de Historia Psiquiátrica (pre-poblados con valores actuales)
- **Acciones visibles:**
  - "Guardar nueva versión" (habilitado si hay cambios)
  - "Cancelar" (siempre habilitado)
- **Indicadores:**
  - Mensaje informativo: "Se creará una nueva versión. La versión actual quedará preservada."
  - Campos modificados destacados visualmente (opcional)

---

## 4. Estados y Visibilidad

### 4.1 Estados de Nota

| Estado | Campos Editables | Acciones Disponibles | Indicadores Visuales |
|--------|------------------|---------------------|---------------------|
| **Draft** | Todos (subjetivo, objetivo, evaluación, plan, fecha, tipo) | Editar, Finalizar, Eliminar | Badge "Borrador", campos editables |
| **Finalized** | Ninguno | Agregar addendum, Ver timeline | Badge "Finalizada", icono de candado, campos solo lectura |

### 4.2 Estados de Addendum

| Estado | Campos Editables | Acciones Disponibles | Indicadores Visuales |
|--------|------------------|---------------------|---------------------|
| **Creado** | Ninguno | Ver (solo lectura) | Fecha de creación visible, contenido y razón solo lectura |

### 4.3 Estados de PsychiatricHistory

| Estado | Campos Editables | Acciones Disponibles | Indicadores Visuales |
|--------|------------------|---------------------|---------------------|
| **Versión Actual** | Ninguno (solo lectura) | Crear nueva versión, Ver historial | Badge "Versión actual", icono de candado |
| **Versión Histórica** | Ninguno (solo lectura) | Ver detalles | Badge "Versión histórica", fecha de supersedencia visible |

### 4.4 Campos Solo Lectura (Inmutables)

**Nota Finalizada:**
- Fecha de encuentro
- Tipo de encuentro
- Subjetivo
- Objetivo
- Evaluación
- Plan
- Fecha de finalización

**Addendum:**
- Contenido
- Razón
- Fecha de creación

**PsychiatricHistory (cualquier versión):**
- Todos los campos de contenido
- Número de versión
- Fecha de creación
- Fecha de supersedencia (si aplica)

### 4.5 Acciones que Aparecen / Desaparecen

**En Nota Finalizada:**
- ✅ Aparece: "Agregar addendum"
- ❌ Desaparece: "Editar nota", "Eliminar nota"

**En Nota Borrador:**
- ✅ Aparece: "Editar nota", "Finalizar nota", "Eliminar nota"
- ❌ Desaparece: "Agregar addendum"

**En Addendum:**
- ✅ Aparece: Ninguna acción (solo lectura)
- ❌ Desaparece: Todas las acciones de edición/eliminación

**En Historia Psiquiátrica:**
- ✅ Aparece siempre: "Actualizar historia"
- ✅ Aparece si hay >1 versión: "Ver historial de versiones"
- ❌ Desaparece siempre: "Editar versión", "Eliminar versión"

---

## 5. Microcopy Clínica (Español)

### 5.1 Mensajes de Bloqueo

| Contexto | Mensaje |
|----------|---------|
| Intentar editar nota finalizada | "Las notas finalizadas no son editables. Use un addendum para agregar información o correcciones." |
| Intentar editar addendum | "Los addenda no son editables una vez creados." |
| Intentar borrar addendum | "Los addenda no pueden eliminarse. Son parte del registro clínico permanente." |
| Agregar addendum a nota borrador | "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente." |
| Editar versión de historia | "Las versiones de historia psiquiátrica no son editables. Cree una nueva versión para actualizar la información." |
| Borrar versión de historia | "Las versiones de historia psiquiátrica no pueden eliminarse. Son parte del registro clínico permanente." |

### 5.2 Mensajes de Guía

| Contexto | Mensaje |
|----------|---------|
| Botón agregar addendum | "Agregar addendum" |
| Explicación de addendum | "Los addenda permiten agregar información o correcciones a notas finalizadas sin modificar el contenido original." |
| Botón actualizar historia | "Actualizar historia" |
| Explicación de nueva versión | "Se creará una nueva versión. La versión actual quedará preservada en el historial." |
| Información sobre versiones | "Todas las versiones anteriores permanecen accesibles para consulta histórica." |

### 5.3 Mensajes de Confirmación

| Acción | Mensaje |
|--------|---------|
| Addendum creado exitosamente | "Addendum agregado correctamente" |
| Nueva versión creada exitosamente | "Historia psiquiátrica actualizada. Nueva versión creada." |

### 5.4 Mensajes de Error

| Error | Mensaje |
|-------|---------|
| Contenido de addendum vacío | "El contenido del addendum es requerido." |
| Razón de addendum vacía | "La razón del addendum es requerida." |
| Nota no finalizada al crear addendum | "Solo se pueden agregar addenda a notas finalizadas." |
| No hay cambios en nueva versión | "No hay cambios para guardar. Modifique al menos un campo para crear una nueva versión." |
| Versión actual no encontrada | "No se encontró historia psiquiátrica actual." |

### 5.5 Labels y Placeholders

| Campo | Label | Placeholder |
|--------|-------|-------------|
| Contenido addendum | "Contenido del addendum" | "Ingrese la información adicional o corrección..." |
| Razón addendum | "Razón del addendum" | "Explique por qué se agrega este addendum..." |
| Motivo de consulta | "Motivo de consulta" | "Ingrese el motivo principal de consulta..." |
| Historia enfermedad actual | "Historia de la enfermedad actual" | "Describa la evolución del cuadro actual..." |

### 5.6 Indicadores de Estado

| Estado | Texto del Badge |
|--------|----------------|
| Nota borrador | "Borrador" |
| Nota finalizada | "Finalizada" |
| Versión actual | "Versión actual" |
| Versión histórica | "Versión histórica" |
| Addendum | "Addendum" (con fecha) |

---

## 6. Manejo de Errores

### 6.1 Errores Bloqueantes

| Error | Condición | Mensaje al Usuario | Acción del Sistema |
|-------|-----------|-------------------|-------------------|
| **NOTA_NO_FINALIZADA** | Intentar agregar addendum a nota borrador | "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente." | Bloquear creación de addendum |
| **CONTENIDO_VACIO** | Contenido de addendum vacío tras trim | "El contenido del addendum es requerido." | Bloquear guardado, mostrar error en campo |
| **RAZON_VACIA** | Razón de addendum vacía tras trim | "La razón del addendum es requerida." | Bloquear guardado, mostrar error en campo |
| **NOTA_NO_ENCONTRADA** | Nota no existe al crear addendum | "La nota especificada no existe." | Bloquear creación, mostrar error |
| **SIN_CAMBIOS** | Nueva versión sin cambios respecto a actual | "No hay cambios para guardar. Modifique al menos un campo para crear una nueva versión." | Bloquear guardado, mostrar error |
| **HISTORIA_NO_ENCONTRADA** | Versión actual no existe | "No se encontró historia psiquiátrica actual." | Bloquear actualización, mostrar error |

### 6.2 Mensajes de Error Orientados a Práctica Clínica

**Principios:**
- Mensajes en español, profesional, neutral
- Explican QUÉ está mal y POR QUÉ no se puede proceder
- Sugieren acción alternativa cuando aplica
- Sin mensajes técnicos (códigos de error, stack traces)

**Ejemplos de mensajes correctos:**
- ✅ "Solo se pueden agregar addenda a notas finalizadas. Finalice la nota primero o edítela directamente."
- ✅ "El contenido del addendum es requerido."
- ✅ "No hay cambios para guardar. Modifique al menos un campo para crear una nueva versión."

**Ejemplos de mensajes incorrectos:**
- ❌ "Error 400: Bad Request"
- ❌ "NOTE_NOT_FINALIZED"
- ❌ "Validation failed: content is empty"

### 6.3 Errores No Bloqueantes (Advertencias)

| Advertencia | Condición | Mensaje | Acción del Sistema |
|-------------|-----------|---------|-------------------|
| **Versión anterior disponible** | Existe versión anterior | "Versión anterior disponible en historial" | Mostrar como información, no bloquea |

### 6.4 Errores del Sistema (No Mostrados al Usuario)

| Error Técnico | Manejo |
|---------------|--------|
| Error de base de datos | Registrar en logs, mostrar mensaje genérico: "Ocurrió un error al guardar. Por favor, intente nuevamente." |
| Error de red | Registrar en logs, mostrar mensaje genérico: "Error de conexión. Verifique su conexión e intente nuevamente." |
| Error inesperado | Registrar en logs con detalles técnicos, mostrar mensaje genérico: "Ocurrió un error inesperado. Por favor, contacte al soporte si el problema persiste." |

---

## 7. Checklist de Cumplimiento

### 7.1 Flujo: Addendum sobre Nota Finalizada

#### Inmutabilidad
- [x] Nota original permanece inalterada al crear addendum
- [x] Campos de nota finalizada son solo lectura
- [x] Addendum es inmutable desde su creación
- [x] No se permite editar addendum existente
- [x] No se permite borrar addendum

#### Aditividad
- [x] Addendum se agrega sin modificar nota original
- [x] Múltiples addenda pueden agregarse a la misma nota
- [x] Addenda se muestran junto a nota original (no reemplazan)

#### Trazabilidad
- [x] Cada addendum tiene fecha de creación
- [x] Cada addendum tiene razón explícita
- [x] Addenda se muestran en orden cronológico
- [x] Relación addendum-nota es permanente

#### No Generación Indebida de Eventos
- [x] Crear addendum NO genera evento en timeline
- [x] Addenda no aparecen como eventos separados
- [x] Solo la nota finalizada genera evento Encounter

#### Cumplimiento de Invariantes del Timeline
- [x] Addenda no afectan orden del timeline
- [x] Addenda no modifican fecha de evento de nota
- [x] Addenda no crean nuevos eventos

### 7.2 Flujo: Nueva Versión de PsychiatricHistory

#### Inmutabilidad
- [x] Versión anterior permanece inalterada
- [x] Campos de versión anterior son solo lectura
- [x] Nueva versión es inmutable desde su creación
- [x] No se permite editar versión existente
- [x] No se permite borrar versión

#### Aditividad
- [x] Nueva versión se crea sin modificar versión anterior
- [x] Versión anterior queda marcada como no actual (is_current = false)
- [x] Versión anterior tiene superseded_at establecido
- [x] Todas las versiones permanecen accesibles

#### Trazabilidad
- [x] Cada versión tiene número secuencial
- [x] Cada versión tiene fecha de creación
- [x] Versiones anteriores tienen fecha de supersedencia
- [x] Historial de versiones es completo y accesible
- [x] Versiones forman secuencia contigua (sin gaps)

#### No Generación Indebida de Eventos
- [x] Versión 1 NO genera evento History Update
- [x] Versión 2+ genera exactamente un evento History Update
- [x] Evento se genera solo al crear nueva versión (no al ver)

#### Cumplimiento de Invariantes del Timeline
- [x] Evento History Update aparece en fecha de creación de nueva versión
- [x] Evento no modifica posición de otros eventos
- [x] Versión actual es correcta para fecha actual
- [x] Versión histórica es correcta para fecha histórica

---

## 8. Supuestos Explícitos

### 8.1 Qué NO Hace el Sistema

**Correcciones:**
- ❌ El sistema NO permite editar contenido de notas finalizadas
- ❌ El sistema NO permite borrar notas, addenda o versiones
- ❌ El sistema NO permite modificar timestamps históricos
- ❌ El sistema NO permite "deshacer" correcciones

**Validación Clínica:**
- ❌ El sistema NO valida contenido clínico (solo estructura)
- ❌ El sistema NO valida coherencia médica entre addenda y nota original
- ❌ El sistema NO valida que la razón del addendum sea apropiada

**Gestión de Versiones:**
- ❌ El sistema NO permite fusionar versiones
- ❌ El sistema NO permite reordenar versiones
- ❌ El sistema NO permite modificar números de versión

### 8.2 Decisiones que Quedan Fuera de Alcance

**Responsabilidad del Clínico:**
- Decidir cuándo es apropiado agregar un addendum vs crear nueva nota
- Decidir qué información incluir en el addendum
- Decidir si la razón del addendum es suficiente para contexto legal
- Decidir cuándo actualizar historia psiquiátrica vs dejar versión actual

**Responsabilidad del Sistema:**
- Garantizar inmutabilidad técnica
- Garantizar trazabilidad completa
- Garantizar que correcciones sean aditivas
- Presentar información de forma clara y accesible

### 8.3 Casos No Soportados

**Correcciones Masivas:**
- ❌ No se soporta corrección de múltiples notas simultáneamente
- ❌ No se soporta corrección de múltiples campos de historia simultáneamente con un solo addendum

**Correcciones Retroactivas Complejas:**
- ❌ No se soporta "corregir" un evento del timeline directamente
- ❌ No se soporta modificar fecha de encuentro de nota finalizada

**Gestión de Conflictos:**
- ❌ No se detecta ni resuelve conflictos si dos clínicos crean addenda simultáneamente
- ❌ No se detecta ni resuelve conflictos si dos clínicos crean nuevas versiones simultáneamente

**Exportación/Importación:**
- ❌ No se soporta exportar solo versiones actuales (sin históricas)
- ❌ No se soporta importar correcciones desde sistemas externos

---

## 9. Reglas de Diseño UX

### 9.1 Principios de Diseño

**UX Mínima y Clínica:**
- Interfaz sin ornamentación innecesaria
- Priorizar claridad sobre estética
- Información clínica siempre visible y accesible
- Sin animaciones o transiciones distractoras

**Seguridad sobre Velocidad:**
- Confirmaciones implícitas claras (botones con labels descriptivos)
- Validación en tiempo real para prevenir errores
- Mensajes de error claros y accionables
- No permitir acciones irreversibles sin contexto claro

**Cero Ambigüedad:**
- Labels de botones descriptivos ("Agregar addendum" no "Agregar")
- Mensajes de error explícitos sobre qué está mal y por qué
- Indicadores visuales claros de estado (badges, iconos de candado)
- Diferenciación visual clara entre contenido original y correcciones

### 9.2 Lenguaje

**100% Español:**
- Todos los textos visibles al usuario en español
- Terminología clínica profesional pero accesible
- Sin anglicismos innecesarios
- Sin jerga técnica expuesta al usuario

**Profesional y Neutral:**
- Tono formal pero no distante
- Sin juicios de valor en mensajes
- Sin sugerencias sobre qué debería hacer el clínico (solo qué puede hacer)

### 9.3 Diseño Listo para Implementación

**Especificaciones Completas:**
- Todos los estados definidos
- Todos los mensajes especificados
- Todas las validaciones documentadas
- Todas las acciones permitidas/bloqueadas listadas

**Sin Ambiguidad:**
- Cada flujo tiene pasos numerados
- Cada mensaje tiene texto exacto
- Cada validación tiene condición explícita
- Cada estado tiene indicadores visuales definidos

---

## 10. Resumen de Entregables

### ✅ 1. Flujos UX Clínicos (Paso a Paso)
- **Flujo 1:** Addendum sobre nota finalizada (Sección 2)
- **Flujo 2:** Nueva versión de PsychiatricHistory (Sección 3)
- Cada flujo incluye: punto de inicio, acciones permitidas, acciones bloqueadas, confirmaciones explícitas

### ✅ 2. Estados y Visibilidad
- Estados de Nota, Addendum, PsychiatricHistory (Sección 4)
- Campos solo lectura definidos
- Acciones que aparecen/desaparecen documentadas

### ✅ 3. Microcopy Clínica (Español)
- Mensajes de bloqueo (Sección 5.1)
- Mensajes de guía (Sección 5.2)
- Mensajes de confirmación (Sección 5.3)
- Mensajes de error (Sección 5.4)
- Labels y placeholders (Sección 5.5)
- Indicadores de estado (Sección 5.6)

### ✅ 4. Manejo de Errores
- Errores bloqueantes (Sección 6.1)
- Mensajes orientados a práctica clínica (Sección 6.2)
- Errores no bloqueantes (Sección 6.3)
- Errores del sistema (Sección 6.4)

### ✅ 5. Checklist de Cumplimiento
- Para Addendum (Sección 7.1)
- Para Nueva Versión (Sección 7.2)
- Validación de: inmutabilidad, aditividad, trazabilidad, no generación indebida de eventos, cumplimiento de invariantes

### ✅ 6. Supuestos Explícitos
- Qué NO hace el sistema (Sección 8.1)
- Decisiones fuera de alcance (Sección 8.2)
- Casos no soportados (Sección 8.3)

---

*Document Version: 1.0*  
*Status: Final*  
*Depends On: 02_domain.md, 03_timeline.md, 04_use_cases.md, 14_timeline_contracts.md, 15_timeline_qa_invariants.md*  
*Consumed By: UX Implementation, Backend Implementation, QA Testing*


---

## 20_clinical_corrections_ux_performance.md

# Sistema de Historia Clínica Psiquiátrica — Optimización UX: Correcciones Clínicas

## Overview

Este documento optimiza la **experiencia de uso clínica diaria** para los flujos de correcciones clínicas (addenda y versionado), maximizando velocidad de documentación, foco atencional y reducción de carga cognitiva, **sin modificar reglas clínicas ni invariantes**.

**Alcance:** Optimizaciones sobre flujos ya validados. No introduce nuevas features ni altera el dominio.

---

## 1. Atajos de Teclado

### 1.1 Atajos Globales (Siempre Disponibles)

| Atajo | Acción | Contexto | Prevención de Errores |
|-------|--------|----------|----------------------|
| `Esc` | Cerrar modal/formulario abierto | Cualquier modal o formulario | Si hay cambios sin guardar, muestra confirmación: "¿Descartar cambios?" |
| `Ctrl/Cmd + K` | Búsqueda rápida de paciente | Cualquier vista | N/A |
| `Ctrl/Cmd + /` | Mostrar ayuda de atajos | Cualquier vista | N/A |

### 1.2 Atajos en Vista de Nota Finalizada

| Atajo | Acción | Contexto | Prevención de Errores |
|-------|--------|----------|----------------------|
| `A` | Abrir formulario de addendum | Nota finalizada visible | Solo funciona si nota está finalizada; si no, muestra mensaje |
| `Escape` | Cerrar vista de nota | Vista de detalle abierta | N/A |
| `T` | Volver a timeline | Vista de detalle abierta | N/A |

**Restricciones:**
- Atajo `A` solo funciona cuando nota está finalizada
- Si nota es borrador, atajo `A` no hace nada (no muestra error, simplemente no responde)

### 1.3 Atajos en Formulario de Addendum

| Atajo | Acción | Contexto | Prevención de Errores |
|-------|--------|----------|----------------------|
| `Ctrl/Cmd + Enter` | Guardar addendum | Formulario abierto | Solo guarda si ambos campos tienen contenido válido |
| `Escape` | Cancelar y cerrar | Formulario abierto | Si hay contenido, muestra confirmación: "¿Descartar addendum?" |
| `Tab` | Siguiente campo | Entre campos | Foco automático en primer campo al abrir |
| `Shift + Tab` | Campo anterior | Entre campos | N/A |

**Flujo de foco:**
1. Al abrir formulario → Foco automático en campo "Contenido"
2. `Tab` → Mueve a campo "Razón"
3. `Tab` → Mueve a botón "Guardar addendum"
4. `Shift + Tab` → Retrocede en orden inverso

### 1.4 Atajos en Vista de Historia Psiquiátrica

| Atajo | Acción | Contexto | Prevención de Errores |
|-------|--------|----------|----------------------|
| `U` | Abrir formulario de actualización | Vista de historia actual | N/A |
| `H` | Ver historial de versiones | Vista de historia actual | Solo funciona si hay >1 versión |
| `Escape` | Cerrar vista actual | Vista de historia o historial | N/A |
| `T` | Volver a timeline | Vista de historia abierta | N/A |

**Restricciones:**
- Atajo `H` solo funciona si existe más de una versión
- Si solo hay versión 1, atajo `H` no hace nada

### 1.5 Atajos en Formulario de Nueva Versión

| Atajo | Acción | Contexto | Prevención de Errores |
|-------|--------|----------|----------------------|
| `Ctrl/Cmd + Enter` | Guardar nueva versión | Formulario abierto | Solo guarda si hay cambios detectados |
| `Escape` | Cancelar y cerrar | Formulario abierto | Si hay cambios, muestra confirmación: "¿Descartar cambios?" |
| `Ctrl/Cmd + F` | Buscar en formulario | Formulario abierto | Busca texto dentro de campos del formulario |
| `Tab` | Siguiente campo | Entre campos | Foco automático en primer campo al abrir |

**Flujo de foco:**
1. Al abrir formulario → Foco automático en primer campo (Motivo de consulta)
2. `Tab` → Navega secuencialmente por todos los campos
3. `Ctrl/Cmd + Enter` → Guarda si hay cambios

### 1.6 Atajos en Timeline

| Atajo | Acción | Contexto | Prevención de Errores |
|-------|--------|----------|----------------------|
| `↑` / `↓` | Navegar entre eventos | Timeline visible | N/A |
| `Enter` | Abrir evento seleccionado | Evento seleccionado | N/A |
| `A` | Agregar addendum (si nota finalizada) | Evento de nota seleccionado | Solo funciona si nota está finalizada |
| `Esc` | Cerrar detalle de evento | Vista de detalle abierta | N/A |

**Navegación por teclado en timeline:**
- `↑` → Evento anterior (más antiguo)
- `↓` → Evento siguiente (más reciente)
- `Enter` → Abre detalle del evento seleccionado
- `Esc` → Cierra detalle y vuelve a timeline

### 1.7 Acciones Explícitamente Excluidas de Atajos

**No tienen atajos (requieren clic explícito):**
- ❌ Editar nota finalizada (no permitido)
- ❌ Borrar addendum (no permitido)
- ❌ Borrar versión (no permitido)
- ❌ Editar versión existente (no permitido)
- ❌ Finalizar nota (flujo diferente, no corrección)

**Razón:** Estas acciones están bloqueadas o son parte de otros flujos. No deben tener atajos para prevenir activación accidental.

### 1.8 Prevención de Errores en Atajos

**Confirmaciones requeridas:**
- `Escape` en formulario con cambios → "¿Descartar cambios?"
- `Ctrl/Cmd + Enter` con campos inválidos → No guarda, muestra error en campo

**Validación antes de ejecutar:**
- `A` para addendum → Verifica que nota esté finalizada antes de abrir formulario
- `Ctrl/Cmd + Enter` → Valida campos antes de guardar
- `U` para actualizar historia → Verifica que versión actual exista

**Feedback inmediato:**
- Atajo inválido → No hace nada (sin mensaje de error)
- Atajo válido pero bloqueado → Mensaje contextual: "Esta acción no está disponible"

---

## 2. Gestión de Foco

### 2.1 Foco Inicial en Cada Vista

| Vista | Dónde Inicia el Foco | Razón |
|-------|---------------------|-------|
| **Nota finalizada (sin addenda)** | Botón "Agregar addendum" | Acción más probable |
| **Nota finalizada (con addenda)** | Botón "Agregar addendum" | Acción más probable |
| **Formulario de addendum** | Campo "Contenido" (textarea) | Listo para escribir |
| **Historia psiquiátrica actual** | Botón "Actualizar historia" | Acción más probable |
| **Formulario de nueva versión** | Primer campo (Motivo de consulta) | Listo para editar |
| **Historial de versiones** | Primera versión de la lista | Navegación natural |
| **Timeline** | Primer evento (más reciente) | Escaneo natural |

### 2.2 Movimiento de Foco Entre Secciones

**En formulario de addendum:**
1. Al abrir → Foco en "Contenido"
2. `Tab` → "Razón"
3. `Tab` → "Guardar addendum"
4. `Shift + Tab` → Retrocede

**En formulario de nueva versión:**
1. Al abrir → Foco en primer campo
2. `Tab` → Navega secuencialmente por todos los campos
3. `Shift + Tab` → Retrocede
4. Último campo + `Tab` → Botón "Guardar nueva versión"

**En timeline:**
1. Al cargar → Foco en primer evento (más reciente)
2. `↑` / `↓` → Navega entre eventos
3. `Enter` → Abre detalle, foco en botón de cierre o acción principal

### 2.3 Devolución Automática de Foco

| Acción | Dónde Devuelve el Foco | Razón |
|--------|----------------------|-------|
| **Guardar addendum exitosamente** | Botón "Agregar addendum" (si hay más acciones) o timeline | Continuidad de flujo |
| **Cancelar formulario de addendum** | Botón "Agregar addendum" | Volver a punto de inicio |
| **Guardar nueva versión exitosamente** | Botón "Actualizar historia" | Continuidad de flujo |
| **Cancelar formulario de nueva versión** | Botón "Actualizar historia" | Volver a punto de inicio |
| **Cerrar detalle de nota** | Evento en timeline | Continuidad de navegación |

### 2.4 Estados que Bloquean Interacción

**Bloqueo temporal (durante guardado):**
- Formulario de addendum → Todos los campos y botones deshabilitados durante guardado
- Formulario de nueva versión → Todos los campos y botones deshabilitados durante guardado
- Indicador visual: Spinner en botón de guardado
- Mensaje: "Guardando..." (reemplaza texto del botón)

**Bloqueo permanente (campos inmutables):**
- Campos de nota finalizada → No enfocables (tabindex="-1")
- Campos de addendum existente → No enfocables
- Campos de versión histórica → No enfocables
- Indicador visual: Icono de candado + cursor "not-allowed" al hover

**Bloqueo condicional:**
- Botón "Guardar addendum" → Deshabilitado si campos vacíos
- Botón "Guardar nueva versión" → Deshabilitado si no hay cambios
- Feedback visual: Botón gris + tooltip explicativo

---

## 3. Optimización de Flujos

### 3.1 Flujo: Addendum sobre Nota Finalizada

#### Antes (Flujo Original)
1. Clínico visualiza nota finalizada
2. Clínico hace clic en "Agregar addendum"
3. Sistema muestra formulario
4. Clínico hace clic en campo "Contenido"
5. Clínico escribe contenido
6. Clínico hace clic en campo "Razón"
7. Clínico escribe razón
8. Clínico hace clic en "Guardar addendum"
9. Sistema guarda y muestra confirmación
10. Clínico hace clic para cerrar confirmación

**Total: 10 pasos, 5 clicks**

#### Después (Flujo Optimizado)
1. Clínico visualiza nota finalizada
2. Clínico presiona `A` (atajo) o hace clic en "Agregar addendum"
3. Sistema muestra formulario con foco automático en "Contenido"
4. Clínico escribe contenido
5. Clínico presiona `Tab` → foco en "Razón"
6. Clínico escribe razón
7. Clínico presiona `Ctrl/Cmd + Enter` → guarda
8. Sistema guarda, muestra confirmación breve (2s), devuelve foco a botón

**Total: 8 pasos, 1-2 clicks (o 0 clicks si usa atajos)**

**Mejoras:**
- ✅ Foco automático elimina 1 click
- ✅ Atajo `A` elimina 1 click
- ✅ Atajo `Ctrl/Cmd + Enter` elimina 1 click
- ✅ Confirmación breve (2s) elimina 1 click de cierre
- ✅ Devolución automática de foco elimina 1 click de navegación

### 3.2 Flujo: Nueva Versión de PsychiatricHistory

#### Antes (Flujo Original)
1. Clínico visualiza historia actual
2. Clínico hace clic en "Actualizar historia"
3. Sistema muestra formulario pre-poblado
4. Clínico hace clic en campo a modificar
5. Clínico modifica campo(s)
6. Clínico hace clic en "Guardar nueva versión"
7. Sistema guarda y muestra confirmación
8. Clínico hace clic para cerrar confirmación

**Total: 8 pasos, 4 clicks**

#### Después (Flujo Optimizado)
1. Clínico visualiza historia actual
2. Clínico presiona `U` (atajo) o hace clic en "Actualizar historia"
3. Sistema muestra formulario con foco automático en primer campo
4. Clínico modifica campo(s) (navegación con `Tab`)
5. Clínico presiona `Ctrl/Cmd + Enter` → guarda
6. Sistema guarda, muestra confirmación breve (2s), devuelve foco a botón

**Total: 6 pasos, 1-2 clicks (o 0 clicks si usa atajos)**

**Mejoras:**
- ✅ Foco automático elimina 1 click
- ✅ Atajo `U` elimina 1 click
- ✅ Atajo `Ctrl/Cmd + Enter` elimina 1 click
- ✅ Confirmación breve elimina 1 click de cierre
- ✅ Devolución automática de foco elimina 1 click de navegación

### 3.3 Pasos Eliminados

**En ambos flujos:**
- ❌ Click para enfocar primer campo → Foco automático
- ❌ Click en botón de guardado → Atajo de teclado
- ❌ Click para cerrar confirmación → Auto-cierre después de 2s
- ❌ Click para volver a acción principal → Devolución automática de foco

**Total eliminado: 4-5 clicks por corrección**

### 3.4 Acciones Agrupadas

**En vista de nota finalizada:**
- Botón "Agregar addendum" siempre visible y accesible
- Si hay addenda → Sección expandida por defecto (no requiere click para ver)
- Contador de addenda visible sin expandir

**En vista de historia psiquiátrica:**
- Botón "Actualizar historia" siempre visible
- Si hay versiones anteriores → Link "Ver historial (X versiones)" visible
- No requiere navegación a otra vista para ver historial

### 3.5 Acciones Primarias vs Secundarias

**Jerarquía visual de botones:**

**Vista de nota finalizada:**
- **Primaria:** "Agregar addendum" (botón destacado, color primario)
- **Secundaria:** "Ver timeline" (botón texto, menos prominente)

**Formulario de addendum:**
- **Primaria:** "Guardar addendum" (botón destacado, color primario)
- **Secundaria:** "Cancelar" (botón texto, menos prominente)

**Vista de historia psiquiátrica:**
- **Primaria:** "Actualizar historia" (botón destacado, color primario)
- **Secundaria:** "Ver historial" (link texto, menos prominente)

**Formulario de nueva versión:**
- **Primaria:** "Guardar nueva versión" (botón destacado, color primario)
- **Secundaria:** "Cancelar" (botón texto, menos prominente)

**Indicadores visuales:**
- Botones primarios: Mayor tamaño, color de acento, peso de fuente mayor
- Botones secundarios: Tamaño estándar, color neutro, peso de fuente normal

---

## 4. Optimización de Lectura y Escritura

### 4.1 Optimización de Campos de Texto

**Textareas en formularios:**
- **Altura inicial:** 4 líneas (120px aprox)
- **Expansión automática:** Crece con contenido hasta máximo 12 líneas
- **Scroll:** Aparece solo si contenido excede 12 líneas
- **Fuente:** Monospace opcional para contenido clínico (toggle en preferencias)
- **Tamaño de fuente:** 14px base, ajustable 12-16px

**Placeholders informativos:**
- Campo "Contenido" addendum: "Ejemplo: Corrección de fecha de inicio de síntomas. La fecha correcta es..."
- Campo "Razón" addendum: "Ejemplo: Error factual detectado durante revisión"
- Campos historia: Placeholders con ejemplos específicos por campo

**Autoguardado de borradores (solo en formularios):**
- Formulario de addendum → Auto-guarda borrador cada 30s si hay contenido
- Formulario de nueva versión → Auto-guarda borrador cada 30s si hay cambios
- Indicador: "Borrador guardado" (aparece 1s, desaparece automáticamente)
- Al reabrir formulario → Carga borrador automáticamente

### 4.2 Optimización de Visualización de Contenido

**Nota finalizada:**
- **Secciones colapsables:** Subjetivo, Objetivo, Evaluación, Plan
- **Estado por defecto:** Todas expandidas (máxima información visible)
- **Indicador de longitud:** Contador de palabras/párrafos en cada sección
- **Scroll independiente:** Si contenido excede altura de viewport, scroll solo en sección

**Addenda:**
- **Visualización:** Expandidos por defecto
- **Separación visual:** Borde izquierdo de color distinto (ej. azul claro)
- **Jerarquía:** Fecha + razón visibles siempre, contenido expandible
- **Orden:** Cronológico (más antiguo primero) con fecha destacada

**Historia psiquiátrica:**
- **Campos colapsables:** Cada campo es una sección colapsable
- **Estado por defecto:** Campos con contenido expandidos, vacíos colapsados
- **Indicador de cambios:** En formulario de nueva versión, campos modificados destacados (borde amarillo sutil)
- **Comparación visual:** Opción "Comparar con versión anterior" (muestra diff lado a lado)

### 4.3 Reducción de Carga Cognitiva

**Información contextual siempre visible:**
- En formulario de addendum → Nota original visible en panel lateral (solo lectura)
- En formulario de nueva versión → Versión actual visible en panel lateral (solo lectura)
- En timeline → Tipo de evento siempre visible sin expandir

**Agrupación lógica:**
- Addenda agrupados visualmente bajo nota original
- Versiones agrupadas en historial con fechas claras
- Eventos en timeline agrupados por mes/año (headers colapsables)

**Eliminación de ruido visual:**
- Campos vacíos en historia → No mostrados (colapsados) en vista de solo lectura
- Información administrativa → Ocultable con toggle "Mostrar detalles técnicos"
- Confirmaciones → Breves (2s) y no bloqueantes

---

## 5. UX de Timeline Clínico

### 5.1 Jerarquía Visual de Eventos

**Orden de importancia visual (de más a menos prominente):**

1. **Eventos de Encuentro (Encounter)**
   - Tamaño: Grande
   - Color: Azul primario
   - Icono: Calendario/Consulta
   - Información visible: Fecha, tipo, título

2. **Eventos de Medicación (Medication Start/Change/Stop)**
   - Tamaño: Mediano
   - Color: Verde (Start), Amarillo (Change), Rojo (Stop)
   - Icono: Píldora
   - Información visible: Fecha, medicamento, dosis

3. **Eventos de Historia (History Update)**
   - Tamaño: Mediano
   - Color: Morado
   - Icono: Documento
   - Información visible: Fecha, "Historia actualizada"

4. **Eventos Manuales (Hospitalization, Life Event, Other)**
   - Tamaño: Pequeño
   - Color: Gris
   - Icono: Genérico
   - Información visible: Fecha, título

### 5.2 Escaneo Rápido (Qué se Ve Primero)

**Información visible sin expandir:**
- Fecha del evento (formato: "15 Ene 2024")
- Tipo de evento (badge con color)
- Título/resumen (1 línea, truncado si largo)
- Si es nota → Indicador de addenda: "2 addenda" (si aplica)
- Si es historia → Número de versión: "Versión 3"

**Información oculta hasta expandir:**
- Descripción completa
- Contenido de nota (subjetivo, objetivo, etc.)
- Detalles de medicación
- Addenda completos

**Orden de escaneo natural:**
1. Fecha → Contexto temporal inmediato
2. Tipo → Categorización rápida
3. Título → Contenido resumido
4. Indicadores → Información adicional (addenda, versiones)

### 5.3 Diferenciación Visual Clara

**Entre evento y nota:**
- **Evento:** Badge con tipo, fecha, título
- **Nota (al expandir):** Secciones estructuradas (Subjetivo, Objetivo, Evaluación, Plan)
- **Indicador:** Badge "Nota" en evento de tipo Encounter

**Entre evento y addendum:**
- **Evento:** Línea principal del timeline
- **Addendum:** Indentado bajo nota, borde izquierdo, badge "Addendum"
- **Visual:** Addenda no aparecen como eventos separados, solo como parte de nota expandida

**Entre versión actual e histórica:**
- **Versión actual:** Badge "Actual", color primario
- **Versión histórica:** Badge "Histórica", color neutro, fecha de supersedencia visible
- **En timeline:** Evento "History Update" muestra número de versión, no distingue actual vs histórica (ambas son históricas en timeline)

### 5.4 Optimizaciones de Timeline para Correcciones

**Visualización de addenda en timeline:**
- Nota con addenda → Indicador "X addenda" visible en evento
- Al expandir nota → Addenda visibles inmediatamente (no requiere click adicional)
- Addenda ordenados cronológicamente bajo nota
- Separador visual sutil entre addenda

**Visualización de versiones en timeline:**
- Evento "History Update" → Muestra número de versión: "Historia actualizada (Versión 3)"
- Al hacer clic → Abre vista de historia con versión correspondiente
- No muestra todas las versiones en timeline (solo eventos de actualización)

**Filtrado rápido:**
- Filtro por tipo: Solo encuentros, solo medicaciones, solo actualizaciones de historia
- Filtro por fecha: Rango de fechas
- Filtro por contenido: Buscar texto en notas/eventos
- Filtros aplicados visibles como badges removibles

---

## 6. Microinteracciones Clínicas

### 6.1 Estados Hover / Focus

**Botones:**
- **Hover:** Color más oscuro, cursor pointer
- **Focus:** Outline de 2px, color de acento
- **Active:** Color más oscuro, ligera animación de "press"
- **Disabled:** Opacidad 50%, cursor not-allowed

**Campos de texto:**
- **Hover:** Borde más visible
- **Focus:** Borde de color de acento, outline sutil
- **Error:** Borde rojo, mensaje de error visible
- **Valid:** Borde verde sutil (solo después de validación exitosa)

**Enlaces:**
- **Hover:** Subrayado, color más oscuro
- **Focus:** Outline de 2px
- **Visited:** Color más claro (para links a versiones históricas)

### 6.2 Confirmaciones Mínimas pero Claras

**Confirmación de guardado exitoso:**
- **Tipo:** Toast notification (no modal)
- **Duración:** 2 segundos
- **Posición:** Esquina superior derecha
- **Contenido:** "Addendum agregado correctamente" / "Historia actualizada. Nueva versión creada."
- **Acción:** Auto-cierre, no requiere interacción

**Confirmación de descarte:**
- **Tipo:** Modal pequeño (no full-screen)
- **Trigger:** `Escape` o "Cancelar" con contenido sin guardar
- **Contenido:** "¿Descartar cambios?" + botones "Descartar" / "Continuar editando"
- **Acción:** Requiere decisión explícita

**Confirmación de acción bloqueada:**
- **Tipo:** Tooltip o mensaje inline
- **Duración:** 3 segundos
- **Posición:** Cerca del elemento bloqueado
- **Contenido:** Mensaje específico (ej. "Solo se pueden agregar addenda a notas finalizadas")

### 6.3 Feedback Inmediato sin Ruido

**Validación en tiempo real:**
- **Campos requeridos:** Muestra error solo después de perder foco (blur)
- **Mensaje de error:** Rojo, debajo del campo, desaparece al corregir
- **Indicador visual:** Borde rojo en campo con error
- **Sin spam:** No muestra error mientras usuario está escribiendo

**Indicadores de estado:**
- **Guardando:** Spinner en botón, texto "Guardando..." reemplaza "Guardar"
- **Guardado:** Checkmark verde por 1s, luego vuelve a estado normal
- **Error de guardado:** Mensaje de error en lugar de toast, botón vuelve a "Guardar"

**Carga de datos:**
- **Skeleton loaders:** Para timeline y listas (no spinners genéricos)
- **Carga progresiva:** Muestra contenido disponible mientras carga resto
- **Sin bloqueo:** Interfaz sigue interactiva durante carga (excepto acciones que dependen de datos)

### 6.4 Microinteracciones Específicas

**Al agregar addendum:**
- Formulario aparece con animación suave (fade + slide desde arriba)
- Foco automático en campo "Contenido"
- Panel lateral con nota original aparece simultáneamente

**Al guardar addendum:**
- Botón muestra spinner durante guardado
- Al completar: Checkmark verde por 1s
- Formulario se cierra con animación suave
- Addendum aparece en lista con animación de entrada (fade in)
- Foco devuelto a botón "Agregar addendum"

**Al actualizar historia:**
- Formulario aparece con animación suave
- Foco automático en primer campo
- Panel lateral con versión actual aparece simultáneamente
- Campos modificados destacados con borde amarillo sutil

**Al guardar nueva versión:**
- Botón muestra spinner durante guardado
- Al completar: Checkmark verde por 1s
- Formulario se cierra con animación suave
- Nueva versión aparece en vista con badge "Actual"
- Foco devuelto a botón "Actualizar historia"

**En timeline:**
- Al expandir evento: Animación suave de expansión (no instantáneo)
- Al colapsar: Animación suave de colapso
- Scroll automático: Al expandir evento, scroll suave para mantenerlo visible

---

## 7. Checklist de Seguridad

### 7.1 Atajos de Teclado

- [x] Atajos solo para acciones permitidas
- [x] Atajos bloqueados para acciones prohibidas (no responden)
- [x] Confirmaciones para acciones irreversibles (`Escape` con cambios)
- [x] Validación antes de ejecutar atajo (`Ctrl/Cmd + Enter` valida campos)
- [x] Feedback inmediato para atajos inválidos (no hace nada, sin error)

### 7.2 Gestión de Foco

- [x] Foco automático no interrumpe lectura
- [x] Foco en campos editables (no en campos inmutables)
- [x] Tab order lógico (no salta campos)
- [x] Devolución de foco no pierde contexto
- [x] Foco no bloquea interacción con mouse

### 7.3 Optimización de Flujos

- [x] Reducción de clicks no sacrifica claridad
- [x] Atajos no ocultan información necesaria
- [x] Confirmaciones breves no ocultan errores
- [x] Auto-guardado no interfiere con edición
- [x] Agrupación lógica no confunde jerarquía

### 7.4 Optimización de Lectura/Escritura

- [x] Auto-expansión de textareas no causa scroll inesperado
- [x] Auto-guardado no sobrescribe cambios no guardados
- [x] Placeholders informativos no confunden con contenido
- [x] Colapsado de secciones no oculta información crítica
- [x] Comparación de versiones no modifica originales

### 7.5 UX de Timeline

- [x] Jerarquía visual refleja importancia clínica
- [x] Diferenciación clara entre tipos de eventos
- [x] Addenda visibles pero no confunden con eventos
- [x] Versiones históricas accesibles sin perder contexto
- [x] Filtrado no oculta información relevante

### 7.6 Microinteracciones

- [x] Animaciones no distraen de contenido
- [x] Feedback inmediato no interrumpe flujo
- [x] Confirmaciones no bloquean innecesariamente
- [x] Estados hover/focus claros pero discretos
- [x] Indicadores de carga no bloquean interfaz

### 7.7 Inmutabilidad y Trazabilidad

- [x] Optimizaciones no permiten editar contenido finalizado
- [x] Atajos no bypassan validaciones
- [x] Auto-guardado no modifica registros inmutables
- [x] Visualizaciones no ocultan información histórica
- [x] Comparaciones no sugieren edición de originales

---

## 8. Resumen de Optimizaciones

### 8.1 Reducción de Clicks

**Flujo de addendum:**
- Antes: 5 clicks
- Después: 1-2 clicks (o 0 con atajos)
- **Reducción: 60-80%**

**Flujo de nueva versión:**
- Antes: 4 clicks
- Después: 1-2 clicks (o 0 con atajos)
- **Reducción: 50-75%**

### 8.2 Reducción de Tiempo

**Tiempo estimado por corrección:**
- Antes: ~45 segundos (con clicks y navegación)
- Después: ~20 segundos (con atajos y foco automático)
- **Reducción: ~55%**

### 8.3 Mejoras de Foco Atencional

- ✅ Foco automático elimina búsqueda visual de campo
- ✅ Atajos eliminan necesidad de mover mouse
- ✅ Confirmaciones breves no interrumpen flujo
- ✅ Información contextual siempre visible
- ✅ Ruido visual minimizado

### 8.4 Mejoras de Carga Cognitiva

- ✅ Menos decisiones (foco automático, atajos claros)
- ✅ Menos clicks (menos acciones motoras)
- ✅ Menos navegación (devolución automática de foco)
- ✅ Más contexto visible (paneles laterales, información siempre presente)
- ✅ Feedback inmediato (validación en tiempo real, estados claros)

---

*Document Version: 1.0*  
*Status: Final*  
*Depends On: 19_clinical_corrections_ux.md*  
*Consumed By: UX Implementation, Frontend Development*


---

## 21_event_type_localization_spec.md

# Sistema de Registros Médicos Psiquiátricos — Especificación de Localización de Tipos de Eventos Clínicos

## Resumen Ejecutivo

Este documento define la especificación funcional para la localización de tipos de eventos clínicos en la interfaz de usuario del sistema. Establece un vocabulario clínico canónico en español que garantiza que la UI nunca muestre términos en inglés, manteniendo los identificadores internos sin cambios.

**Versión:** 1.0  
**Estado:** Final  
**Depende de:** `02_domain.md`, `03_timeline.md`, `13_timeline_engine.md`, `14_timeline_contracts.md`, `18_patient_crud_specs.md`  
**Consumido por:** Implementación Backend, Implementación UX, QA Testing

---

## 1. Propósito y Alcance

### 1.1 Objetivo Principal

Definir una especificación de localización de tipos de eventos clínicos para garantizar que la interfaz de usuario del sistema clínico presente exclusivamente términos en español, manteniendo la consistencia lingüística en toda la experiencia del usuario.

### 1.2 Problema que Resuelve

Actualmente, los tipos de eventos clínicos se muestran en la UI utilizando identificadores en inglés (por ejemplo, "Encounter", "Medication Start", "Hospitalization"). Esto viola el principio de idioma único en la UI clínica y genera inconsistencia con el resto de la interfaz, que está completamente en español.

### 1.3 Alcance de la Especificación

Esta especificación cubre:

| Incluido | Excluido |
|----------|----------|
| Traducción de tipos de eventos en timeline | Traducción de otros elementos de UI (fuera de tipos de eventos) |
| Vistas laterales que muestran tipos de eventos | Sistema completo de i18n (internacionalización avanzada) |
| Filtros y búsquedas por tipo de evento | Soporte multi-idioma (solo español) |
| Consistencia textual en toda la UI clínica | Traducción de contenido clínico (notas, descripciones) |
| Vocabulario canónico en español | Cambios a identificadores internos o base de datos |

### 1.4 Principios Fundamentales

1. **Inmutabilidad de Identificadores Internos**: Los identificadores en la base de datos, enums de Prisma, y código interno permanecen en inglés sin cambios.

2. **Separación de Presentación y Datos**: La traducción ocurre exclusivamente en la capa de presentación (UI), no en la capa de datos.

3. **Idioma Único en UI**: Toda la interfaz de usuario debe presentar exclusivamente español, sin excepciones.

4. **Vocabulario Canónico**: Existe un único mapeo autorizado de identificadores internos a términos visibles en español.

---

## 2. Principio de Idioma Único en UI Clínica

### 2.1 Regla Fundamental

**TODA la interfaz de usuario del sistema clínico DEBE presentar texto exclusivamente en español.**

Esta regla aplica a:

- **Etiquetas y rótulos** de tipos de eventos
- **Filtros y opciones** de selección de tipos de eventos
- **Mensajes y notificaciones** relacionadas con eventos
- **Tooltips y ayuda contextual** sobre tipos de eventos
- **Estados vacíos** que mencionen tipos de eventos
- **Mensajes de error** relacionados con tipos de eventos

### 2.2 Excepciones Explícitas

Las siguientes excepciones están permitidas y NO violan el principio:

| Excepción | Justificación |
|-----------|---------------|
| **Identificadores técnicos** (IDs, UUIDs) | No son texto visible para el usuario final |
| **Nombres de campos en base de datos** | No son visibles en la UI |
| **Códigos de error técnicos** (para debugging) | No son visibles para usuarios finales |
| **Comentarios en código fuente** | No son parte de la UI |
| **Logs del sistema** | No son parte de la UI visible |

### 2.3 Casos Prohibidos

Los siguientes casos están **EXPLÍCITAMENTE PROHIBIDOS**:

| Caso Prohibido | Ejemplo Incorrecto | Ejemplo Correcto |
|----------------|-------------------|------------------|
| **Mezcla de idiomas en un mismo componente** | "Encounter - Encuentro" | "Encuentro" |
| **Términos en inglés visibles al usuario** | Mostrar "Medication Start" | Mostrar "Inicio de Medicación" |
| **Tooltips en inglés** | Tooltip: "Clinical encounter" | Tooltip: "Encuentro clínico" |
| **Mensajes de error en inglés** | "Invalid event type" | "Tipo de evento inválido" |
| **Filtros con opciones en inglés** | Filtro: "Encounter" | Filtro: "Encuentro" |

### 2.4 Garantías del Sistema

El sistema debe garantizar:

| Garantía | Descripción |
|----------|-------------|
| **Consistencia absoluta** | Nunca se mostrará un tipo de evento en inglés en ninguna parte de la UI |
| **Traducción completa** | Todos los tipos de eventos tienen traducción canónica |
| **Sin regresión** | Cambios futuros no pueden introducir términos en inglés |
| **Validación automática** | El sistema debe validar que todas las traducciones estén presentes |

---

## 3. Lista Canónica de Tipos de Evento

### 3.1 Mapeo Interno → Visible

La siguiente tabla define el mapeo canónico y autorizado de identificadores internos (en inglés) a términos visibles en español (UI):

| Identificador Interno (Prisma Enum) | Identificador Intermedio (UI Type) | Término Visible en Español (UI) |
|-------------------------------------|-----------------------------------|----------------------------------|
| `Encounter` | `'Encounter'` | **"Encuentro"** |
| `MedicationStart` | `'Medication Start'` | **"Inicio de Medicación"** |
| `MedicationChange` | `'Medication Change'` | **"Cambio de Medicación"** |
| `MedicationStop` | `'Medication Stop'` | **"Suspensión de Medicación"** |
| `Hospitalization` | `'Hospitalization'` | **"Hospitalización"** |
| `LifeEvent` | `'Life Event'` | **"Evento Vital"** |
| `HistoryUpdate` | `'History Update'` | **"Actualización de Historia"** |
| `Other` | `'Other'` | **"Otro"** |

### 3.2 Reglas de Nomenclatura en Español

Los términos visibles deben seguir estas reglas:

| Regla | Aplicación | Ejemplo |
|-------|------------|---------|
| **Capitalización de oración** | Primera letra en mayúscula, resto en minúscula | "Encuentro", no "ENCUENTRO" ni "encuentro" |
| **Sin abreviaciones** | Términos completos, no abreviados | "Inicio de Medicación", no "Inicio Med." |
| **Consistencia terminológica** | Uso consistente de términos médicos estándar | "Medicación" (no "Medicina" ni "Fármaco") |
| **Singular para tipos** | Los tipos se presentan en singular | "Encuentro", no "Encuentros" |
| **Sin artículos** | No incluir artículos determinados | "Encuentro", no "El Encuentro" |

### 3.3 Justificación de Términos

| Término en Español | Justificación Clínica |
|-------------------|----------------------|
| **"Encuentro"** | Término estándar en psiquiatría para interacción clínica directa entre profesional y paciente |
| **"Inicio de Medicación"** | Indica claramente el comienzo de un tratamiento farmacológico |
| **"Cambio de Medicación"** | Refleja modificación de dosis, frecuencia o medicamento |
| **"Suspensión de Medicación"** | Término preciso que indica cese del tratamiento (más específico que "Detención") |
| **"Hospitalización"** | Término médico estándar y reconocido |
| **"Evento Vital"** | Término psiquiátrico estándar para eventos significativos en la vida del paciente |
| **"Actualización de Historia"** | Indica modificación de información histórica psiquiátrica |
| **"Otro"** | Término genérico para eventos no categorizados |

### 3.4 Variantes Prohibidas

Los siguientes términos están **PROHIBIDOS** y no deben usarse:

| Término Prohibido | Término Correcto | Razón |
|------------------|------------------|-------|
| "Encuentro Clínico" | "Encuentro" | Redundante (todos los encuentros son clínicos) |
| "Medicina" | "Medicación" | Término menos preciso en contexto clínico |
| "Fármaco" | "Medicación" | Término menos común en psiquiatría |
| "Detención de Medicación" | "Suspensión de Medicación" | Menos preciso clínicamente |
| "Evento de Vida" | "Evento Vital" | Término menos estándar en psiquiatría |
| "Historia Clínica" | "Historia" (en contexto) | Redundante cuando ya se habla de historia psiquiátrica |
| "Otros" | "Otro" | Debe ser singular para consistencia |

---

## 4. Reglas de Consistencia Textual

### 4.1 Consistencia en Timeline

En la vista de timeline, los tipos de eventos deben:

| Regla | Implementación |
|-------|----------------|
| **Mostrar siempre en español** | El componente `TimelineEvent` debe usar la función de traducción |
| **Mantener formato visual** | El estilo visual (iconos, colores) no cambia, solo el texto |
| **Consistencia tipográfica** | Mismo tamaño, peso y estilo que otros rótulos en timeline |
| **Sin variaciones contextuales** | El mismo tipo de evento siempre muestra el mismo texto |

**Ejemplo de implementación:**
```typescript
// ❌ INCORRECTO: Mostrar directamente el identificador
<span>{event.event_type}</span> // Muestra "Encounter"

// ✅ CORRECTO: Usar función de traducción
<span>{translateEventType(event.event_type)}</span> // Muestra "Encuentro"
```

### 4.2 Consistencia en Vistas Laterales

En paneles laterales, filtros y vistas de detalle:

| Ubicación | Regla |
|----------|-------|
| **Filtros de timeline** | Opciones de filtro deben mostrar términos en español |
| **Paneles de resumen** | Si se mencionan tipos de eventos, deben estar en español |
| **Vistas de detalle de evento** | El tipo de evento debe mostrarse en español |
| **Búsquedas** | Si se permite buscar por tipo, los términos deben estar en español |

### 4.3 Consistencia en Formularios

En formularios que permiten seleccionar o crear eventos:

| Regla | Aplicación |
|-------|------------|
| **Opciones de selección** | Dropdowns, radio buttons, checkboxes muestran términos en español |
| **Etiquetas de campos** | Labels de campos de tipo de evento en español |
| **Mensajes de validación** | Errores relacionados con tipos de eventos en español |
| **Placeholders** | Textos de ayuda en español |

### 4.4 Consistencia en Mensajes del Sistema

| Tipo de Mensaje | Regla |
|-----------------|-------|
| **Mensajes de éxito** | "Evento de tipo 'Encuentro' creado exitosamente" |
| **Mensajes de error** | "Tipo de evento inválido: 'Encounter' no es válido" |
| **Estados vacíos** | "No hay eventos de tipo 'Encuentro' en este período" |
| **Confirmaciones** | "¿Está seguro de crear un evento de tipo 'Hospitalización'?" |

### 4.5 Regla de Inmutabilidad del Mapeo

**El mapeo canónico definido en la Sección 3.1 es INMUTABLE.**

| Restricción | Justificación |
|-------------|---------------|
| **No se pueden agregar variantes** | Evita inconsistencia y confusión |
| **No se pueden modificar términos** | Mantiene consistencia histórica |
| **No se pueden crear alias** | Previene ambigüedad |
| **Cambios requieren actualización de especificación** | Cualquier cambio debe ser documentado y aprobado |

---

## 5. Casos Prohibidos (Mezcla de Idiomas)

### 5.1 Prohibiciones Absolutas

Los siguientes casos están **EXPLÍCITAMENTE PROHIBIDOS** y deben ser detectados y rechazados:

| Caso Prohibido | Ejemplo | Acción Requerida |
|----------------|---------|------------------|
| **Mostrar identificador interno directamente** | Mostrar "Encounter" en UI | Rechazar en code review |
| **Mezcla en mismo componente** | "Encounter (Encuentro)" | Rechazar en code review |
| **Tooltips en inglés** | Tooltip: "Clinical encounter event" | Rechazar en code review |
| **Comentarios en UI** | Comentario visible: "// Encounter type" | Rechazar en code review |
| **Filtros con opciones en inglés** | Filtro: ["Encounter", "Medication Start"] | Rechazar en code review |
| **Mensajes de error en inglés** | "Invalid event type: Encounter" | Rechazar en code review |

### 5.2 Detección de Violaciones

El sistema debe implementar mecanismos para detectar violaciones:

| Mecanismo | Descripción |
|-----------|-------------|
| **Validación en tiempo de desarrollo** | Linter o validación que detecte términos en inglés en componentes UI |
| **Tests automatizados** | Tests que verifiquen que todos los tipos de eventos se muestran en español |
| **Code review checklist** | Checklist que incluya verificación de localización |
| **Validación en runtime (opcional)** | Warnings en consola si se detectan términos no traducidos |

### 5.3 Proceso de Corrección

Si se detecta una violación:

| Paso | Acción |
|------|--------|
| 1. **Identificación** | Identificar el componente y el término en inglés |
| 2. **Mapeo** | Verificar el mapeo canónico en Sección 3.1 |
| 3. **Corrección** | Reemplazar con término en español correcto |
| 4. **Validación** | Verificar que la corrección sigue todas las reglas |
| 5. **Documentación** | Si es necesario, actualizar documentación de implementación |

---

## 6. Impacto en Timeline y Vistas Laterales

### 6.1 Componente Timeline Principal

**Ubicación:** `src/ui/components/Timeline.tsx` y `src/ui/components/TimelineEvent.tsx`

| Cambio Requerido | Descripción |
|-----------------|-------------|
| **Función de traducción** | Crear función `translateEventType()` que mapee identificadores a términos en español |
| **Actualización de renderizado** | Modificar línea 32 de `TimelineEvent.tsx` para usar traducción |
| **Mantenimiento de estilos** | Los estilos visuales (iconos, colores) no cambian |
| **Tests actualizados** | Actualizar tests para verificar términos en español |

**Ejemplo de implementación:**
```typescript
// Nueva función de traducción
function translateEventType(eventType: EventType): string {
  const translations: Record<EventType, string> = {
    'Encounter': 'Encuentro',
    'Medication Start': 'Inicio de Medicación',
    'Medication Change': 'Cambio de Medicación',
    'Medication Stop': 'Suspensión de Medicación',
    'Hospitalization': 'Hospitalización',
    'Life Event': 'Evento Vital',
    'History Update': 'Actualización de Historia',
    'Other': 'Otro',
  };
  return translations[eventType] ?? 'Otro';
}

// Uso en componente
<span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
  {translateEventType(event.event_type)}
</span>
```

### 6.2 Filtros de Timeline

Si existen filtros por tipo de evento:

| Cambio Requerido | Descripción |
|-----------------|-------------|
| **Opciones de filtro** | Todas las opciones deben mostrar términos en español |
| **Valores internos** | Los valores enviados al backend pueden mantener identificadores en inglés |
| **Etiquetas visibles** | Las etiquetas mostradas al usuario deben estar en español |

### 6.3 Paneles Laterales

En paneles que muestran resúmenes o listas de eventos:

| Panel | Cambio Requerido |
|-------|-----------------|
| **Panel de medicaciones activas** | Si menciona "Medication Start", debe mostrar "Inicio de Medicación" |
| **Panel de próximas citas** | Si menciona "Encounter", debe mostrar "Encuentro" |
| **Panel de eventos recientes** | Todos los tipos de eventos deben estar en español |

### 6.4 Vistas de Detalle de Evento

Cuando se muestra el detalle completo de un evento:

| Elemento | Cambio Requerido |
|----------|-----------------|
| **Título del tipo** | Debe mostrar término en español |
| **Metadatos** | Si se muestra "Tipo: Encounter", debe ser "Tipo: Encuentro" |
| **Breadcrumbs** | Si incluyen tipo de evento, deben estar en español |
| **Navegación** | Enlaces relacionados deben usar términos en español |

### 6.5 Formularios de Creación de Eventos

En formularios que permiten crear eventos manuales:

| Elemento | Cambio Requerido |
|----------|-----------------|
| **Campo de selección de tipo** | Dropdown/select debe mostrar opciones en español |
| **Valores internos** | Los valores enviados pueden mantener identificadores en inglés |
| **Validación** | Mensajes de error deben estar en español |
| **Ayuda contextual** | Tooltips y ayuda deben estar en español |

---

## 7. Fuera de Alcance

### 7.1 Explicaciones Explícitas

Los siguientes elementos están **EXPLÍCITAMENTE FUERA DEL ALCANCE** de esta especificación:

| Elemento | Justificación |
|----------|---------------|
| **Sistema completo de i18n (internacionalización)** | Esta especificación solo cubre tipos de eventos, no todo el sistema |
| **Soporte multi-idioma** | El sistema es exclusivamente en español |
| **Traducción de contenido clínico** | Notas, descripciones y contenido clínico no se traducen |
| **Traducción de otros elementos de UI** | Esta especificación solo cubre tipos de eventos |
| **Cambios a base de datos** | Los identificadores en la base de datos permanecen en inglés |
| **Cambios a contratos de API** | Los contratos pueden mantener identificadores en inglés |
| **Traducción de tipos de encuentro** | `EncounterType` (InitialEvaluation, FollowUp, etc.) está fuera de alcance |
| **Traducción de estados** | Estados como "Active", "Finalized" están fuera de alcance |
| **Traducción de tipos de fuente** | `SourceType` (Note, Medication, etc.) está fuera de alcance |

### 7.2 Limitaciones Intencionales

Estas limitaciones son intencionales y no deben interpretarse como omisiones:

| Limitación | Razón |
|-----------|-------|
| **Solo tipos de eventos clínicos** | Mantiene el alcance manejable y específico |
| **No i18n completo** | El sistema no requiere soporte multi-idioma |
| **No traducción de contenido** | El contenido clínico debe permanecer en el idioma original del profesional |

### 7.3 Futuras Expansiones

Si en el futuro se requiere expandir la localización:

| Expansión Futura | Consideración |
|-----------------|---------------|
| **Traducción de tipos de encuentro** | Requeriría nueva especificación similar |
| **Sistema completo de i18n** | Requeriría arquitectura diferente y especificación más amplia |
| **Soporte multi-idioma** | Requeriría cambios arquitectónicos significativos |

---

## 8. Implementación Técnica

### 8.1 Arquitectura de Traducción

La traducción debe implementarse siguiendo este patrón:

```
┌─────────────────────────────────────────────────────────┐
│                    Base de Datos                        │
│  ClinicalEventType enum: Encounter, MedicationStart...  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Capa de Dominio / Backend                   │
│  Mantiene identificadores en inglés (sin cambios)       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Capa de Mapeo (patient-data.ts)              │
│  mapEventType(): Convierte enum → UI type (inglés)      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Capa de Presentación (UI Components)             │
│  translateEventType(): Convierte UI type → Español      │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Ubicación de la Función de Traducción

**Recomendación:** Crear archivo `src/utils/event-type-translations.ts`

```typescript
/**
 * Traducciones canónicas de tipos de eventos clínicos para UI.
 * 
 * Fuente: docs/21_event_type_localization_spec.md
 * 
 * IMPORTANTE: Este mapeo es canónico e inmutable.
 * Cualquier cambio requiere actualización de la especificación.
 */
import type { EventType } from '@/types/ui';

export const EVENT_TYPE_TRANSLATIONS: Record<EventType, string> = {
  'Encounter': 'Encuentro',
  'Medication Start': 'Inicio de Medicación',
  'Medication Change': 'Cambio de Medicación',
  'Medication Stop': 'Suspensión de Medicación',
  'Hospitalization': 'Hospitalización',
  'Life Event': 'Evento Vital',
  'History Update': 'Actualización de Historia',
  'Other': 'Otro',
} as const;

/**
 * Traduce un tipo de evento a su término visible en español.
 * 
 * @param eventType - Tipo de evento (identificador intermedio)
 * @returns Término visible en español
 */
export function translateEventType(eventType: EventType): string {
  return EVENT_TYPE_TRANSLATIONS[eventType] ?? 'Otro';
}
```

### 8.3 Integración en Componentes

**Componente TimelineEvent.tsx:**

```typescript
import { translateEventType } from '@/utils/event-type-translations';

export function TimelineEvent({ event }: TimelineEventProps) {
  // ... código existente ...
  
  return (
    // ... JSX existente ...
    <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {translateEventType(event.event_type)}
    </span>
    // ... resto del JSX ...
  );
}
```

### 8.4 Validación y Tests

**Tests requeridos:**

```typescript
describe('Event Type Translations', () => {
  it('debe traducir todos los tipos de eventos a español', () => {
    const eventTypes: EventType[] = [
      'Encounter',
      'Medication Start',
      'Medication Change',
      'Medication Stop',
      'Hospitalization',
      'Life Event',
      'History Update',
      'Other',
    ];
    
    eventTypes.forEach(type => {
      const translation = translateEventType(type);
      expect(translation).not.toBe(type); // No debe ser el mismo texto
      expect(translation).toMatch(/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]+$/); // Formato correcto
    });
  });
  
  it('debe retornar "Otro" para tipos desconocidos', () => {
    const unknown = 'UnknownType' as EventType;
    expect(translateEventType(unknown)).toBe('Otro');
  });
  
  it('debe mantener consistencia con especificación', () => {
    expect(translateEventType('Encounter')).toBe('Encuentro');
    expect(translateEventType('Medication Start')).toBe('Inicio de Medicación');
    // ... verificar todos los mapeos ...
  });
});
```

### 8.5 Checklist de Implementación

- [ ] Crear archivo `src/utils/event-type-translations.ts` con función de traducción
- [ ] Actualizar `TimelineEvent.tsx` para usar `translateEventType()`
- [ ] Actualizar cualquier filtro que muestre tipos de eventos
- [ ] Actualizar paneles laterales que mencionen tipos de eventos
- [ ] Actualizar formularios que permitan seleccionar tipos de eventos
- [ ] Crear tests para validar traducciones
- [ ] Verificar que no queden términos en inglés en la UI
- [ ] Actualizar documentación de componentes si es necesario

---

## 9. Validación y Cumplimiento

### 9.1 Criterios de Cumplimiento

La implementación cumple con esta especificación si:

| Criterio | Verificación |
|---------|--------------|
| **Todos los tipos de eventos se muestran en español** | Revisión manual de UI + tests automatizados |
| **No hay términos en inglés visibles** | Búsqueda en código de términos prohibidos |
| **El mapeo canónico se respeta** | Comparación con Sección 3.1 |
| **Consistencia en todas las vistas** | Revisión de timeline, filtros, paneles, formularios |
| **Tests pasan** | Suite de tests de traducción completa |

### 9.2 Proceso de Validación

1. **Revisión de código**: Verificar que todos los componentes usen `translateEventType()`
2. **Revisión visual**: Verificar que la UI muestre términos en español
3. **Tests automatizados**: Ejecutar suite de tests de traducción
4. **Búsqueda de términos prohibidos**: Buscar en código términos como "Encounter", "Medication Start" en componentes UI
5. **Revisión de documentación**: Verificar que la documentación refleje los cambios

### 9.3 Mantenimiento Continuo

Para mantener el cumplimiento:

| Actividad | Frecuencia |
|----------|------------|
| **Revisión en code review** | Cada PR que toque componentes de eventos |
| **Ejecución de tests** | En cada build |
| **Búsqueda de términos prohibidos** | En cada release |
| **Actualización de especificación** | Si se agregan nuevos tipos de eventos |

---

## 10. Resumen

### 10.1 Principios Clave

1. **Idioma único en UI**: Toda la interfaz de usuario debe estar exclusivamente en español
2. **Inmutabilidad de identificadores**: Los identificadores internos permanecen en inglés
3. **Vocabulario canónico**: Existe un único mapeo autorizado de identificadores a términos visibles
4. **Separación de capas**: La traducción ocurre solo en la capa de presentación

### 10.2 Mapeo Canónico

| Interno | Visible |
|--------|---------|
| `Encounter` | "Encuentro" |
| `MedicationStart` | "Inicio de Medicación" |
| `MedicationChange` | "Cambio de Medicación" |
| `MedicationStop` | "Suspensión de Medicación" |
| `Hospitalization` | "Hospitalización" |
| `LifeEvent` | "Evento Vital" |
| `HistoryUpdate` | "Actualización de Historia" |
| `Other` | "Otro" |

### 10.3 Impacto

- **Timeline**: Todos los tipos de eventos se muestran en español
- **Filtros**: Opciones de filtro en español
- **Paneles laterales**: Referencias a tipos de eventos en español
- **Formularios**: Opciones de selección en español
- **Mensajes**: Mensajes del sistema en español

### 10.4 Fuera de Alcance

- Sistema completo de i18n
- Soporte multi-idioma
- Traducción de contenido clínico
- Traducción de otros elementos de UI
- Cambios a base de datos o contratos de API

---

*Documento Versión: 1.0*  
*Estado: Final*  
*Última actualización: [Fecha de creación]*  
*Mantenedor: Responsable de Consistencia Lingüística*


---

## 21_localizacion_eventos_clinicos.md

# Sistema de Registros Médicos Psiquiátricos — Especificación de Localización de Tipos de Eventos Clínicos

## Resumen Ejecutivo

Este documento define la especificación funcional para la localización de tipos de eventos clínicos en la interfaz de usuario del Sistema de Registros Médicos Psiquiátricos.

**Objetivo principal:** Garantizar que todos los términos relacionados con tipos de eventos clínicos se muestren exclusivamente en español en la interfaz de usuario, manteniendo los identificadores internos en inglés para la integridad del sistema.

**Alcance:** Esta especificación cubre únicamente la presentación visual de tipos de eventos en la UI. No modifica la estructura de datos, los identificadores internos, ni los contratos de API.

---

## 1. Principio de Idioma Único en UI Clínica

### 1.1 Regla Fundamental

**La interfaz de usuario del sistema clínico debe presentar todos los términos relacionados con tipos de eventos clínicos exclusivamente en español.**

Esta regla aplica a:
- Etiquetas de tipos de eventos en la línea de tiempo (timeline)
- Opciones de filtrado por tipo de evento
- Selectores de tipo de evento en formularios
- Mensajes y descripciones que mencionen tipos de eventos
- Vistas laterales y paneles de detalle
- Cualquier texto visible al usuario relacionado con tipos de eventos

### 1.2 Separación de Responsabilidades

**Identificadores Internos (Backend/Database):**
- Permanecen en inglés (camelCase/PascalCase)
- No se modifican ni traducen
- Ejemplos: `Encounter`, `MedicationStart`, `LifeEvent`

**Presentación Visual (Frontend/UI):**
- Deben mostrarse en español
- Se obtienen mediante mapeo desde identificadores internos
- Ejemplos: "Encuentro", "Inicio de Medicación", "Evento Vital"

### 1.3 Justificación

1. **Consistencia clínica:** Los profesionales de la salud en el contexto de uso trabajan en español
2. **Claridad:** Reduce ambigüedad y mejora la comprensión del contexto clínico
3. **Profesionalismo:** Presenta una interfaz coherente y profesional
4. **Mantenibilidad:** Separa la lógica de negocio (inglés) de la presentación (español)

---

## 2. Lista Canónica de Tipos de Evento

### 2.1 Mapeo Interno → Visible

La siguiente tabla define el mapeo canónico entre identificadores internos (que permanecen inmutables) y las etiquetas visibles en español:

| Identificador Interno | Etiqueta Visible (Español) | Contexto Clínico |
|----------------------|----------------------------|-------------------|
| `Encounter` | **Encuentro** | Interacción clínica directa entre profesional y paciente |
| `MedicationStart` | **Inicio de Medicación** | Inicio de un tratamiento farmacológico |
| `MedicationChange` | **Cambio de Medicación** | Modificación de dosis o frecuencia de medicación |
| `MedicationStop` | **Suspensión de Medicación** | Discontinuación de un tratamiento farmacológico |
| `Hospitalization` | **Hospitalización** | Episodio de atención psiquiátrica hospitalaria |
| `LifeEvent` | **Evento Vital** | Acontecimiento significativo en la vida del paciente |
| `HistoryUpdate` | **Actualización de Historia** | Revisión o corrección de la historia psiquiátrica |
| `Other` | **Otro** | Evento clínicamente significativo fuera de categorías estándar |

### 2.2 Reglas de Capitalización

**En la interfaz de usuario:**
- **Primera letra en mayúscula** para todos los tipos de eventos
- **Resto en minúsculas** (excepto nombres propios si aplican)
- **Sin mayúsculas intermedias** (no "Inicio De Medicación")

**Ejemplos correctos:**
- ✅ "Inicio de Medicación"
- ✅ "Evento Vital"
- ✅ "Actualización de Historia"

**Ejemplos incorrectos:**
- ❌ "INICIO DE MEDICACIÓN" (todo mayúsculas)
- ❌ "inicio de medicación" (todo minúsculas)
- ❌ "Inicio De Medicación" (mayúsculas intermedias)

### 2.3 Uso de Artículos y Preposiciones

Los tipos de eventos se presentan **sin artículos** cuando aparecen como etiquetas o en listas:

- ✅ "Encuentro"
- ✅ "Inicio de Medicación"
- ❌ "El Encuentro"
- ❌ "Un Inicio de Medicación"

En frases descriptivas, se pueden usar artículos según el contexto:
- ✅ "Se registró un Encuentro"
- ✅ "El Encuentro fue documentado"

---

## 3. Reglas de Consistencia Textual

### 3.1 Terminología Clínica Estándar

**Términos preferidos:**
- **"Medicación"** (no "Medicina", "Fármaco", "Droga")
- **"Suspensión"** (no "Detención", "Finalización", "Cese")
- **"Evento Vital"** (no "Evento de Vida", "Acontecimiento Vital")
- **"Actualización de Historia"** (no "Actualización Histórica", "Revisión de Historia")

### 3.2 Pluralización

Cuando se requiere plural, se mantiene la estructura:
- "Encuentros" (plural de "Encuentro")
- "Inicios de Medicación" (plural de "Inicio de Medicación")
- "Cambios de Medicación" (plural de "Cambio de Medicación")
- "Suspensiones de Medicación" (plural de "Suspensión de Medicación")
- "Hospitalizaciones" (plural de "Hospitalización")
- "Eventos Vitales" (plural de "Evento Vital")
- "Actualizaciones de Historia" (plural de "Actualización de Historia")
- "Otros" (plural de "Otro")

### 3.3 Abreviaciones

**No se permiten abreviaciones** de tipos de eventos en la interfaz de usuario:
- ❌ "Enc." por "Encuentro"
- ❌ "Med. Inicio" por "Inicio de Medicación"
- ❌ "Hosp." por "Hospitalización"

**Excepción:** En contextos de espacio extremadamente limitado (por ejemplo, tooltips o etiquetas de iconos), se puede usar el término completo con truncamiento visual controlado por CSS, pero nunca abreviaciones arbitrarias.

---

## 4. Casos Prohibidos (Mezcla de Idiomas)

### 4.1 Prohibiciones Absolutas

**NUNCA se debe mostrar en la UI:**

1. **Identificadores internos en inglés:**
   - ❌ "Encounter"
   - ❌ "MedicationStart"
   - ❌ "LifeEvent"

2. **Mezcla de idiomas:**
   - ❌ "Encuentro (Encounter)"
   - ❌ "Medication Start" (con espacio)
   - ❌ "Evento Life"

3. **Traducciones parciales:**
   - ❌ "Medication Inicio"
   - ❌ "Encuentro Event"
   - ❌ "Hospitalización Event"

4. **Términos técnicos en inglés:**
   - ❌ "Event Type: Encounter"
   - ❌ "Tipo: MedicationStart"
   - ❌ "Filter by Event Type"

### 4.2 Casos Específicos a Evitar

**En la línea de tiempo (Timeline):**
- ❌ Mostrar `event.event_type` directamente sin mapeo
- ❌ Usar identificadores internos como texto visible
- ❌ Mostrar "Type: Encounter" en lugar de "Tipo: Encuentro"

**En filtros:**
- ❌ Opciones de filtro en inglés: "Filter by: Encounter, Medication Start..."
- ❌ Etiquetas de checkbox en inglés: "Show Encounter events"
- ❌ Placeholders en inglés: "Select event type..."

**En formularios:**
- ❌ Selectores con valores en inglés: `<option value="Encounter">Encounter</option>`
- ❌ Labels en inglés: "Event Type:"
- ❌ Mensajes de validación en inglés: "Please select an event type"

**En vistas laterales:**
- ❌ Títulos de sección en inglés: "Event Details"
- ❌ Campos en inglés: "Event Type: Encounter"
- ❌ Botones en inglés: "Close", "Edit Event"

### 4.3 Validación de Consistencia

Cualquier componente que muestre tipos de eventos debe:
1. **Usar el mapeo canónico** definido en la sección 2.1
2. **Nunca acceder directamente** a identificadores internos para presentación
3. **Validar en tiempo de desarrollo** que no hay strings hardcodeados en inglés
4. **Revisar en pruebas** que todos los textos visibles están en español

---

## 5. Impacto en Timeline y Vistas Laterales

### 5.1 Línea de Tiempo (Timeline)

**Componente:** `TimelineEvent.tsx`

**Cambios requeridos:**
1. **Etiqueta de tipo de evento:**
   - **Antes:** `{event.event_type}` (muestra "Encounter", "Medication Start", etc.)
   - **Después:** Usar función de mapeo que retorne "Encuentro", "Inicio de Medicación", etc.

2. **Estilos por tipo:**
   - La función `getEventStyle()` debe recibir el identificador interno pero mostrar el texto en español
   - Los casos del `switch` deben usar identificadores internos para lógica, pero el texto visible debe ser español

3. **Tooltips y ayudas:**
   - Cualquier texto de ayuda debe estar en español
   - Ejemplo: "Este evento representa un encuentro clínico documentado"

### 5.2 Vistas Laterales (Side Panels)

**Componentes afectados:**
- Detalles de evento
- Formularios de creación/edición
- Paneles de información contextual

**Requisitos:**
1. **Títulos de sección:**
   - "Detalles del Evento" (no "Event Details")
   - "Tipo de Evento" (no "Event Type")

2. **Valores mostrados:**
   - "Tipo: Encuentro" (no "Type: Encounter")
   - "Tipo: Inicio de Medicación" (no "Type: Medication Start")

3. **Selectores en formularios:**
   ```html
   <!-- Correcto -->
   <option value="Encounter">Encuentro</option>
   <option value="MedicationStart">Inicio de Medicación</option>
   
   <!-- Incorrecto -->
   <option value="Encounter">Encounter</option>
   <option value="MedicationStart">Medication Start</option>
   ```

### 5.3 Filtros y Búsqueda

**Componentes de filtrado:**
- Dropdowns de tipo de evento
- Checkboxes de filtro
- Etiquetas de filtros activos

**Requisitos:**
1. **Opciones de filtro:**
   - "Todos los eventos" (no "All events")
   - "Solo encuentros" (no "Encounter events only")
   - "Solo medicaciones" (no "Medication events only")

2. **Etiquetas de filtros aplicados:**
   - "Filtrado por: Encuentro" (no "Filtered by: Encounter")
   - "Mostrando: Inicio de Medicación" (no "Showing: Medication Start")

3. **Placeholders:**
   - "Seleccionar tipo de evento..." (no "Select event type...")
   - "Buscar en eventos..." (no "Search events...")

### 5.4 Mensajes y Notificaciones

**Mensajes del sistema:**
- "Evento creado: Encuentro" (no "Event created: Encounter")
- "No se encontraron eventos de tipo: Inicio de Medicación" (no "No events found for type: Medication Start")
- "Filtro aplicado: Hospitalización" (no "Filter applied: Hospitalization")

**Mensajes de error:**
- "Tipo de evento inválido" (no "Invalid event type")
- "Seleccione un tipo de evento" (no "Please select an event type")

---

## 6. Fuera de Alcance

### 6.1 Internacionalización (i18n) Avanzada

Esta especificación **NO cubre:**
- Sistemas de internacionalización multi-idioma
- Cambio dinámico de idioma en tiempo de ejecución
- Soporte para múltiples idiomas simultáneos
- Localización de formatos de fecha/hora (ya cubierto en otros documentos)
- Traducción de contenido clínico (notas, descripciones de eventos)

### 6.2 Modificaciones de Estructura de Datos

Esta especificación **NO requiere:**
- Cambios en el esquema de base de datos
- Modificación de enums en Prisma (`ClinicalEventType`)
- Cambios en identificadores de API
- Modificación de contratos de Timeline Engine

### 6.3 Otros Términos del Sistema

Esta especificación **NO cubre** (pero puede servir como referencia para futuras especificaciones):
- Localización de tipos de encuentro (`EncounterType`)
- Localización de tipos de fuente (`SourceType`)
- Localización de estados de paciente, notas, medicaciones
- Localización de mensajes de error generales
- Localización de etiquetas de formularios no relacionados con eventos

### 6.4 Contenido Clínico

Esta especificación **NO aplica a:**
- Contenido de notas clínicas (subjetivo, objetivo, evaluación, plan)
- Descripciones de eventos ingresadas por el usuario
- Títulos de eventos creados manualmente
- Comentarios y anotaciones clínicas

---

## 7. Implementación Técnica

### 7.1 Punto de Mapeo Central

**Ubicación:** `src/data/patient-data.ts`

**Función existente:** `mapEventType()`

**Modificación requerida:**
```typescript
function mapEventType(eventType: ClinicalEventType): UIEventType {
  const mapping: Record<ClinicalEventType, UIEventType> = {
    Encounter: 'Encuentro',
    MedicationStart: 'Inicio de Medicación',
    MedicationChange: 'Cambio de Medicación',
    MedicationStop: 'Suspensión de Medicación',
    Hospitalization: 'Hospitalización',
    LifeEvent: 'Evento Vital',
    HistoryUpdate: 'Actualización de Historia',
    Other: 'Otro',
  };
  return mapping[eventType];
}
```

### 7.2 Actualización de Tipos UI

**Archivo:** `src/types/ui.ts`

**Modificación requerida:**
```typescript
export type EventType =
  | 'Encuentro'
  | 'Inicio de Medicación'
  | 'Cambio de Medicación'
  | 'Suspensión de Medicación'
  | 'Hospitalización'
  | 'Evento Vital'
  | 'Actualización de Historia'
  | 'Otro';
```

### 7.3 Actualización de Componentes UI

**Archivo:** `src/ui/components/TimelineEvent.tsx`

**Modificación requerida:**
- La función `getEventStyle()` debe actualizar los casos del `switch` para usar los nuevos valores en español
- El componente ya recibe `event.event_type` que será el valor mapeado en español

**Ejemplo:**
```typescript
function getEventStyle(eventType: TimelineEventType['event_type']): {
  icon: React.ReactNode;
  color: string;
} {
  switch (eventType) {
    case 'Encuentro':  // Cambiado de 'Encounter'
      return { /* ... */ };
    case 'Inicio de Medicación':  // Cambiado de 'Medication Start'
      return { /* ... */ };
    // ... resto de casos
  }
}
```

### 7.4 Validación y Testing

**Puntos de validación:**
1. **Linter/TypeScript:** Debe validar que todos los valores de `EventType` coincidan con el mapeo
2. **Tests unitarios:** Verificar que `mapEventType()` retorna valores en español
3. **Tests de integración:** Verificar que la UI muestra textos en español
4. **Revisión manual:** Confirmar que no hay strings hardcodeados en inglés en componentes UI

---

## 8. Checklist de Implementación

### 8.1 Cambios de Código Requeridos

- [ ] Actualizar función `mapEventType()` en `src/data/patient-data.ts`
- [ ] Actualizar tipo `EventType` en `src/types/ui.ts`
- [ ] Actualizar función `getEventStyle()` en `src/ui/components/TimelineEvent.tsx`
- [ ] Revisar y actualizar todos los componentes que muestran tipos de eventos
- [ ] Actualizar cualquier texto hardcodeado relacionado con tipos de eventos

### 8.2 Validación

- [ ] Verificar que la línea de tiempo muestra tipos en español
- [ ] Verificar que los filtros muestran opciones en español
- [ ] Verificar que los formularios muestran selectores en español
- [ ] Verificar que las vistas laterales muestran etiquetas en español
- [ ] Verificar que no hay mezcla de idiomas en ningún componente
- [ ] Ejecutar tests y verificar que pasan

### 8.3 Documentación

- [ ] Actualizar documentación de componentes afectados
- [ ] Documentar el mapeo canónico en comentarios de código
- [ ] Actualizar guías de desarrollo si aplica

---

## 9. Referencias

### 9.1 Documentos Relacionados

- `docs/13_timeline_engine.md` — Definición de tipos de eventos en el motor de timeline
- `docs/14_timeline_contracts.md` — Contratos de API del timeline
- `docs/03_timeline.md` — Especificación funcional del timeline
- `docs/18_patient_crud_specs.md` — Especificaciones de CRUD de pacientes (formato de referencia)

### 9.2 Archivos de Código Clave

- `src/data/patient-data.ts` — Capa de mapeo de datos
- `src/types/ui.ts` — Tipos TypeScript para UI
- `src/ui/components/TimelineEvent.tsx` — Componente de evento en timeline
- `prisma/schema.prisma` — Esquema de base de datos (enum `ClinicalEventType`)

---

## 10. Historial de Versiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2024 | Responsable de Consistencia Lingüística | Especificación inicial |

---

**Fin del Documento**


---

## auditoria_linguistica_ui.md

# Auditoría Lingüística-Clínica: Textos Visibles en UI

**Fecha:** 2024  
**Revisor:** Revisor Lingüístico-Clínico Senior  
**Alcance:** Todos los textos visibles para el usuario en el sistema de Historias Clínicas Psiquiátricas

---

## Resumen Ejecutivo

Se revisaron **todos los componentes de UI** del sistema, identificando textos visibles para el usuario. Se encontraron **3 problemas críticos** y **2 advertencias de ambigüedad** que requieren corrección.

**Estado general:**
- ✅ Coherencia NOTE vs Encounter vs Turno: **CORRECTO** (con excepciones marcadas)
- ✅ Uso de español argentino: **CORRECTO** (con excepciones marcadas)
- ✅ Alineación con specs: **MAYORMENTE CORRECTO** (con excepciones marcadas)

---

## Problemas Críticos Detectados

### ERROR 1: Tipo de evento inconsistente en tipos UI

**Ubicación:** `src/types/ui.ts` línea 12

**Texto actual:**
```typescript
export type EventType =
  | 'Inicio de Historia Clínica'
  | 'Encuentro'  // ← PROBLEMA
  | 'Inicio de Medicación'
  | ...
```

**Problema identificado:**
- El tipo `'Encuentro'` está definido pero **nunca se usa** en el código
- El mapeo real en `src/data/patient-data.ts` línea 40 usa `'Turno'` para eventos Encounter
- Esto crea inconsistencia entre la definición del tipo y su uso real

**Propuesta de corrección:**
```typescript
export type EventType =
  | 'Inicio de Historia Clínica'
  | 'Nota clínica'
  | 'Turno'  // ← CORRECCIÓN
  | 'Inicio de Medicación'
  | ...
```

**Justificación:**
- Según `docs/23_encounter_appointment_spec.md`, los eventos Encounter representan turnos agendados que ya ocurrieron
- El mapeo en `src/data/patient-data.ts` línea 40 ya usa `'Turno'` correctamente
- El componente `TimelineEvent.tsx` línea 18 compara con `'Turno'`
- El término "Encuentro" podría confundirse con el concepto de "encuentro clínico" (que se documenta en Notas)

**Referencia a specs:**
- `docs/23_encounter_appointment_spec.md` - Evento Encounter representa turno agendado
- `src/data/patient-data.ts` línea 40 - Mapeo real usa 'Turno'

---

### ERROR 2: Texto ambiguo en TimelineEvent - "Turno agendado"

**Ubicación:** `src/ui/components/TimelineEvent.tsx` línea 100

**Texto actual:**
```typescript
{isEncounter
  ? 'Turno agendado'  // ← PROBLEMA
  : event.source_type === 'Appointment'
  ? 'Origen: Turno'
  : ...}
```

**Problema identificado:**
- El texto "Turno agendado" es **semánticamente incorrecto** para un evento Encounter
- Según `docs/23_encounter_appointment_spec.md`, los eventos Encounter SOLO aparecen cuando la fecha del turno **ya pasó**
- Un evento Encounter representa un turno que **ya ocurrió**, no uno "agendado" (futuro)
- El término "agendado" sugiere planificación futura, lo cual contradice el modelo

**Propuesta de corrección:**
```typescript
{isEncounter
  ? 'Turno realizado'  // ← CORRECCIÓN
  : event.source_type === 'Appointment'
  ? 'Origen: Turno'
  : ...}
```

**Justificación:**
- Los eventos Encounter solo aparecen en timeline cuando el turno ya ocurrió (specs línea 10-11)
- "Realizado" indica que el hecho ya ocurrió, alineado con el modelo temporal
- Evita confusión con turnos futuros que no aparecen en timeline

**Referencia a specs:**
- `docs/23_encounter_appointment_spec.md` líneas 10-11: "SOLO deben mostrarse en la timeline si la fecha del turno ya pasó"
- `docs/23_encounter_appointment_spec.md` línea 24: "Representa el **hecho** de que ocurrió un turno agendado"

---

### ERROR 3: Uso de "encounter" en nombres de variables y campos (no visible pero afecta claridad)

**Ubicación:** Múltiples archivos (variables internas, no UI visible)

**Observación:**
- Los campos `encounterDate` y `encounterType` en formularios son **correctos** porque se refieren al tipo de encuentro clínico documentado en la Nota
- Estos NO se refieren al evento Encounter de turnos
- Los labels visibles en UI usan "Fecha del Encuentro" y "Tipo de Encuentro", lo cual es correcto

**Estado:** ✅ **CORRECTO** - No requiere corrección

**Justificación:**
- "Encuentro" en contexto de Nota se refiere al encuentro clínico documentado
- "Turno" se refiere al evento Encounter de turnos agendados
- La distinción es clara en el contexto de uso

---

## Advertencias de Ambigüedad

### ADVERTENCIA 1: Término "encuentro" en múltiples contextos

**Ubicación:** `src/ui/components/AddClinicalNoteForm.tsx` líneas 230, 258, 73, 79, 84

**Texto actual:**
- "Fecha del Encuentro"
- "Tipo de Encuentro"
- "La fecha del encuentro es requerida"
- "La fecha del encuentro no puede ser futura"
- "El tipo de encuentro es requerido"

**Análisis:**
- Estos textos son **correctos** porque se refieren al encuentro clínico documentado en la Nota
- No se refieren al evento Encounter de turnos
- El contexto (formulario de Nota) es claro

**Recomendación:**
- ✅ **MANTENER** - Los textos son correctos en su contexto
- Considerar agregar tooltip o ayuda contextual si se detecta confusión en usuarios

---

### ADVERTENCIA 2: Formato de fecha con locale 'es-ES'

**Ubicación:** Múltiples archivos (funciones `formatDate`, `formatDateTime`)

**Texto actual:**
```typescript
date.toLocaleDateString('es-ES', { ... })
```

**Análisis:**
- El locale 'es-ES' es español de España, no de Argentina
- En Argentina se usa 'es-AR' o 'es-419' (Latinoamérica)
- Sin embargo, la diferencia visual es mínima (formato de fecha similar)

**Recomendación:**
- ⚠️ **OPCIONAL** - Cambiar a 'es-AR' o 'es-419' para mayor precisión regional
- No es crítico ya que el formato es similar
- Si se cambia, verificar que todas las funciones de formato usen el mismo locale

**Ubicaciones a revisar:**
- `src/ui/components/TimelineEvent.tsx` línea 216
- `src/ui/components/NotesPanel.tsx` líneas 135, 144
- `src/ui/components/AppointmentsPanel.tsx` líneas 146, 156
- `src/ui/components/MedicationsPanel.tsx` línea 168
- `src/ui/components/PatientDetailView.tsx` líneas 384, 393

---

## Confirmaciones de Correctitud

### ✅ Timeline - Eventos NOTE y Encounter

**Ubicación:** `src/ui/components/TimelineEvent.tsx`

**Textos verificados:**
- Línea 17: `'Nota clínica'` ✅ CORRECTO - Evento NOTE
- Línea 18: `'Turno'` ✅ CORRECTO - Evento Encounter
- Línea 98: `'Nota Clínica asociada'` ✅ CORRECTO - Para eventos NOTE
- Línea 102: `'Origen: Turno'` ✅ CORRECTO - Para source_type Appointment

**Justificación:**
- Coherente con el modelo: NOTE = Nota finalizada, Encounter = Turno realizado
- No confunde documento (Nota) con evento (NOTE/Encounter)

---

### ✅ Formulario de Nota Clínica

**Ubicación:** `src/ui/components/AddClinicalNoteForm.tsx`

**Textos verificados:**
- Línea 218: `"Agregar Nota Clínica"` ✅ CORRECTO
- Línea 230: `"Fecha del Encuentro"` ✅ CORRECTO - Se refiere al encuentro clínico
- Línea 258: `"Tipo de Encuentro"` ✅ CORRECTO - Se refiere al tipo de encuentro clínico
- Línea 419: `"Finalizar inmediatamente (crea evento en la línea de tiempo)"` ✅ CORRECTO
- Línea 455: `"Crear y Finalizar Nota"` ✅ CORRECTO
- Línea 456: `"Crear Borrador"` ✅ CORRECTO

**Justificación:**
- Usa "Nota Clínica" consistentemente
- "Encuentro" se refiere al encuentro clínico documentado, no al evento Encounter
- No sugiere que una Nota finalizada pueda editarse

---

### ✅ Panel de Notas

**Ubicación:** `src/ui/components/NotesPanel.tsx`

**Textos verificados:**
- Línea 40: `"Nota Más Reciente"` ✅ CORRECTO
- Línea 46: `"Agregar nota clínica"` (title) ✅ CORRECTO
- Línea 61: `"Agregar"` ✅ CORRECTO
- Línea 67: `"Sin notas finalizadas"` ✅ CORRECTO
- Línea 104: `"Finalizada {fecha}"` ✅ CORRECTO

**Justificación:**
- Usa "Nota" consistentemente
- Distingue entre "notas finalizadas" y borradores
- No confunde con turnos o eventos Encounter

---

### ✅ Panel de Turnos/Agenda

**Ubicación:** `src/ui/components/AppointmentsPanel.tsx`, `src/ui/components/AddAppointmentForm.tsx`

**Textos verificados:**
- `AppointmentsPanel.tsx` línea 40: `"Próxima Cita"` ✅ CORRECTO
- `AppointmentsPanel.tsx` línea 46: `"Programar cita"` (title) ✅ CORRECTO
- `AppointmentsPanel.tsx` línea 67: `"Sin citas programadas"` ✅ CORRECTO
- `AddAppointmentForm.tsx` línea 211: `"Programar Cita"` ✅ CORRECTO
- `AddAppointmentForm.tsx` línea 222: `"Tipo de Cita"` ✅ CORRECTO
- `AddAppointmentForm.tsx` línea 256: `"Fecha Programada"` ✅ CORRECTO

**Justificación:**
- Usa "Cita" o "Turno" consistentemente para appointments
- No confunde con Notas ni eventos NOTE
- Claramente distingue planificación (turnos) de documentación (notas)

---

### ✅ Panel de Medicación

**Ubicación:** `src/ui/components/MedicationsPanel.tsx`, `src/ui/components/AddMedicationForm.tsx`, `src/ui/components/StopMedicationModal.tsx`, `src/ui/components/ChangeMedicationModal.tsx`

**Textos verificados:**
- `MedicationsPanel.tsx` línea 54: `"Medicamentos Activos"` ✅ CORRECTO
- `MedicationsPanel.tsx` línea 118: `"Ajustar dosis"` ✅ CORRECTO
- `MedicationsPanel.tsx` línea 130: `"Suspender"` ✅ CORRECTO
- `StopMedicationModal.tsx` línea 126: `"Suspender Medicamento"` ✅ CORRECTO
- `ChangeMedicationModal.tsx` línea 147: `"Ajustar Dosis"` ✅ CORRECTO

**Justificación:**
- Léxico clínico correcto en español argentino
- "Suspender" es el término correcto (no "detener" ni "descontinuar")
- "Ajustar dosis" es correcto (no "cambiar dosis" ni "modificar dosis")

---

### ✅ Timeline Component

**Ubicación:** `src/ui/components/Timeline.tsx`

**Textos verificados:**
- Línea 30: `"Sin eventos"` ✅ CORRECTO
- Línea 33: `"La línea de tiempo de este paciente está vacía."` ✅ CORRECTO
- Línea 43: `"Línea de Tiempo Clínica"` ✅ CORRECTO
- Línea 46: `"{n} evento{s}"` ✅ CORRECTO

**Justificación:**
- Usa "Línea de Tiempo" (no "Timeline" ni "Cronología")
- Pluralización correcta en español
- No muestra eventos futuros (correcto según specs)

---

## Textos que NO Requieren Corrección

Los siguientes textos fueron revisados y confirmados como **correctos**:

1. ✅ Todos los botones de acción ("Cancelar", "Guardar", "Agregar", etc.)
2. ✅ Todos los estados ("Borrador", "Finalizada", "Activa", "Suspendida")
3. ✅ Todos los mensajes de error y validación
4. ✅ Todos los labels de formularios
5. ✅ Todos los títulos de secciones y paneles
6. ✅ Todos los placeholders de campos
7. ✅ Todos los tooltips y textos de ayuda

---

## Resumen de Correcciones Requeridas

### Correcciones OBLIGATORIAS ✅ APLICADAS

1. **`src/types/ui.ts` línea 12** ✅
   - Cambiado `'Encuentro'` → `'Turno'` en el tipo `EventType`
   - Agregado `'Nota clínica'` para completitud

2. **`src/ui/components/TimelineEvent.tsx` línea 100** ✅
   - Cambiado `'Turno agendado'` → `'Turno realizado'`

### Correcciones OPCIONALES ✅ APLICADAS

3. **Múltiples archivos - Funciones de formato de fecha** ✅
   - Cambiado `'es-ES'` → `'es-AR'` en todas las funciones `formatDate` y `formatDateTime`
   - Archivos actualizados:
     - `src/ui/components/TimelineEvent.tsx`
     - `src/ui/components/NotesPanel.tsx`
     - `src/ui/components/AppointmentsPanel.tsx`
     - `src/ui/components/MedicationsPanel.tsx`
     - `src/ui/components/PatientDetailView.tsx`
     - `src/ui/components/PatientHeader.tsx`
     - `src/ui/components/UpdatePatientForm.tsx`

---

## Confirmación Final

### Coherencia NOTE vs Encounter vs Turno

✅ **CONFIRMADO** (con correcciones aplicadas):
- NOTE = Evento de timeline que representa Nota finalizada
- Encounter = Evento de timeline que representa Turno realizado
- Turno = Appointment (planificación administrativa)
- Nota = Documento clínico (Borrador/Finalizada)

### Uso Correcto de Español Argentino

✅ **CONFIRMADO**:
- Léxico clínico apropiado
- Formulación profesional
- Sin anglicismos visibles en UI
- Tono adecuado

### Alineación con Specs

✅ **CONFIRMADO** (con correcciones aplicadas):
- No contradice el significado de NOTE, Encounter ni Turno
- Respeta el modelo clínico y administrativo
- Claridad y profesionalismo mantenidos

---

## Notas Finales

- **No se detectaron textos en inglés** visibles para el usuario
- **No se detectaron contradicciones funcionales** que requieran decisión funcional
- **Todas las correcciones son puramente lingüísticas** y no afectan el comportamiento del sistema
- **El sistema está bien estructurado** desde el punto de vista lingüístico, con solo ajustes menores necesarios

---

---

## Estado de Implementación

**Todas las correcciones han sido aplicadas:**
- ✅ Correcciones obligatorias: 2/2 completadas
- ✅ Correcciones opcionales: 1/1 completada
- ✅ Sin errores de linting o TypeScript
- ✅ Consistencia verificada en todos los archivos

**Fecha de aplicación:** 2024

---

**Fin del Informe de Auditoría**


---

# Infraestructura

## 19_vercel_linking.md

# Vercel Project Linking Guide

This document provides step-by-step instructions for linking the Psychiatric Medical Records System repository to Vercel for deployment preparation.

**⚠️ IMPORTANT: This guide covers PROJECT LINKING only. It does NOT deploy the application, run migrations, seed data, or enable production features.**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Project Configuration](#vercel-project-configuration)
3. [Environment Variables](#environment-variables)
4. [Prisma & Serverless Considerations](#prisma--serverless-considerations)
5. [Linking Steps](#linking-steps)
6. [Common Mistakes & Troubleshooting](#common-mistakes--troubleshooting)
7. [Unlinking or Resetting](#unlinking-or-resetting)
8. [What This Does NOT Do](#what-this-does-not-do)

---

## Prerequisites

Before linking to Vercel, ensure:

- ✅ **Repository is pushed to GitHub/GitLab/Bitbucket**
  - The repository must be accessible via a Git provider that Vercel supports
  - All code changes are committed and pushed

- ✅ **Vercel account created**
  - Sign up at [vercel.com](https://vercel.com) if needed
  - Ensure you have access to create new projects

- ✅ **Neon PostgreSQL database exists**
  - Database should be created and accessible
  - Connection string is available (you'll need it for environment variables)
  - **DO NOT** use production database credentials yet if this is a test link

- ✅ **Local build succeeds**
  - Run `npm run build` locally to verify the project builds without errors
  - Fix any build errors before linking

---

## Vercel Project Configuration

### Framework Preset

- **Framework Preset:** `Next.js`
- Vercel will auto-detect Next.js from `package.json`

### Root Directory

- **Root Directory:** `/` (project root)
- No subdirectory configuration needed

### Build Settings

Vercel will auto-detect the following from `package.json`:

- **Build Command:** `next build` (default, no override needed)
- **Output Directory:** `.next` (default, no override needed)
- **Install Command:** `npm install` (default)

### ⚠️ Critical: Prisma Client Generation

**IMPORTANT:** Prisma Client must be generated during the build process. Vercel's default Next.js build does NOT automatically run `prisma generate`.

**Required Build Command Override:**

In the Vercel dashboard, under **Settings → General → Build & Development Settings**, set:

```
Build Command: npm run db:generate && next build
```

**OR** add a `postinstall` script to `package.json` (recommended for consistency):

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build"
  }
}
```

**Note:** If you choose the `postinstall` approach, ensure it's added to `package.json` before linking, as this document focuses on documentation only.

---

## Environment Variables

### Required Variables

The following environment variables **MUST** be configured in the Vercel dashboard before any deployment:

| Variable | Description | Example | Required For |
|----------|-------------|---------|--------------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require` | Database connection |

### Optional Variables

| Variable | Description | When Needed |
|----------|-------------|-------------|
| `NODE_ENV` | Node environment | Auto-set by Vercel to `production` |
| `DEBUG_PRISMA` | Enable Prisma query logging | Debugging only (not recommended in production) |

### ⚠️ Security Requirements

**DO NOT:**
- ❌ Commit `.env` files with secrets
- ❌ Hardcode database credentials in code
- ❌ Share environment variables in documentation or chat
- ❌ Use production database credentials for initial linking/testing

**DO:**
- ✅ Set environment variables only in Vercel dashboard
- ✅ Use separate databases for development, preview, and production
- ✅ Rotate credentials if accidentally exposed
- ✅ Use Vercel's environment variable scoping (Production, Preview, Development)

### Setting Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon PostgreSQL connection string
   - **Environment:** Select appropriate scope:
     - **Production:** For production deployments
     - **Preview:** For pull request previews
     - **Development:** For local development (if using Vercel CLI)
4. Click **Save**

### Environment Variable Scoping

- **Production:** Used for production domain deployments
- **Preview:** Used for branch preview deployments (PRs, branches)
- **Development:** Used when running `vercel dev` locally

**Recommendation:** Set `DATABASE_URL` for all three environments, but use different database instances for each.

---

## Prisma & Serverless Considerations

### ⚠️ CRITICAL: Migrations Must NOT Run Automatically

**DO NOT** configure Vercel to run Prisma migrations during build or deployment.

**Why:**
- Migrations are destructive operations that can modify database schema
- Automatic migrations can cause data loss or schema conflicts
- Migrations should be run manually with proper review and testing
- Multiple deployments could trigger conflicting migration attempts

**What Vercel Should Do:**
- ✅ Generate Prisma Client (`prisma generate`)
- ✅ Build the Next.js application
- ❌ **NOT** run `prisma migrate deploy`
- ❌ **NOT** run `prisma migrate dev`
- ❌ **NOT** run `prisma db push`

### Prisma Client Generation

Prisma Client is generated to a custom location: `src/generated/prisma/`

**During Vercel Build:**
1. `npm install` installs dependencies (including `prisma` CLI)
2. `prisma generate` must run (via `postinstall` or build command)
3. Prisma Client is generated to `src/generated/prisma/`
4. Next.js build uses the generated client

**Verification:**
After linking, check the build logs to confirm:
```
✔ Generated Prisma Client to src/generated/prisma
```

### Serverless Function Considerations

**Connection Pooling:**
- The application uses `pg.Pool` with `@prisma/adapter-pg`
- Each serverless function invocation may create a new connection
- Neon supports connection pooling via connection strings
- Consider using Neon's connection pooler for better performance

**Prisma Client Singleton:**
- The application uses a singleton pattern for Prisma Client
- In serverless environments, each function invocation may create a new instance
- The current implementation handles this via `globalThis` caching
- This is acceptable for Vercel's serverless functions

**Cold Starts:**
- First request to a serverless function may be slower (cold start)
- Prisma Client generation happens at build time, not runtime
- Connection establishment to Neon may add latency on cold starts

---

## Linking Steps

### Step 1: Prepare Repository

1. Ensure all code is committed and pushed:
   ```bash
   git status
   git add .
   git commit -m "Prepare for Vercel linking"
   git push
   ```

2. Verify the repository is accessible on GitHub/GitLab/Bitbucket

### Step 2: Create Vercel Project

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your Git repository:
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Find and select `clinical-story-manager` repository
   - Click **Import**

### Step 3: Configure Project Settings

1. **Framework Preset:**
   - Should auto-detect as **Next.js**
   - If not, manually select **Next.js**

2. **Root Directory:**
   - Leave as **`/`** (default)

3. **Build Command:**
   - **IMPORTANT:** Override to: `npm run db:generate && next build`
   - Or ensure `postinstall` script exists in `package.json`

4. **Output Directory:**
   - Leave as **`.next`** (default)

5. **Install Command:**
   - Leave as **`npm install`** (default)

### Step 4: Configure Environment Variables

**DO NOT** click "Deploy" yet. First configure environment variables:

1. In the project setup page, expand **Environment Variables**
2. Add `DATABASE_URL`:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon PostgreSQL connection string
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Add**

3. Verify the variable appears in the list

### Step 5: Review and Link

1. Review all settings:
   - ✅ Framework: Next.js
   - ✅ Build Command: `npm run db:generate && next build` (or postinstall)
   - ✅ Environment Variables: `DATABASE_URL` configured
   - ✅ Root Directory: `/`

2. Click **Deploy**

3. **DO NOT** expect the deployment to succeed if:
   - Database migrations haven't been run
   - Database doesn't exist or is inaccessible
   - Build errors occur

4. The first deployment will:
   - Install dependencies
   - Generate Prisma Client
   - Build the Next.js application
   - Deploy to a preview URL

### Step 6: Verify Build Logs

After deployment starts, check the build logs:

1. Click on the deployment in Vercel dashboard
2. Review the build logs for:
   - ✅ `✔ Generated Prisma Client`
   - ✅ `✔ Compiled successfully`
   - ❌ Any errors or warnings

3. If Prisma Client generation is missing, the build will fail with:
   ```
   Error: Cannot find module '@/generated/prisma'
   ```

### Step 7: Post-Linking Verification

1. **Project is linked:**
   - Repository appears in Vercel dashboard
   - Settings are configured correctly

2. **Environment variables are set:**
   - Go to **Settings → Environment Variables**
   - Verify `DATABASE_URL` is present

3. **Build configuration is correct:**
   - Go to **Settings → General**
   - Verify build command includes Prisma generation

---

## Common Mistakes & Troubleshooting

### ❌ Mistake 1: Forgetting Prisma Client Generation

**Symptom:**
```
Error: Cannot find module '@/generated/prisma'
Module not found: Can't resolve '@/generated/prisma'
```

**Solution:**
- Ensure build command includes `npm run db:generate &&` before `next build`
- Or add `"postinstall": "prisma generate"` to `package.json`

### ❌ Mistake 2: Running Migrations Automatically

**Symptom:**
- Build includes `prisma migrate deploy` or `prisma migrate dev`
- Database schema changes unexpectedly
- Migration conflicts or errors

**Solution:**
- Remove any migration commands from build scripts
- Run migrations manually: `npm run db:migrate:deploy` (locally or via CI/CD)
- Never add migrations to `postinstall` or build commands

### ❌ Mistake 3: Missing or Incorrect DATABASE_URL

**Symptom:**
```
Error: P1001: Can't reach database server
Error: Environment variable not found: DATABASE_URL
```

**Solution:**
- Verify `DATABASE_URL` is set in Vercel dashboard
- Check that the connection string is correct (includes `?sslmode=require`)
- Verify the database is accessible from Vercel's IP ranges
- Test the connection string locally first

### ❌ Mistake 4: Using Wrong Database for Environment

**Symptom:**
- Preview deployments modify production database
- Development data appears in production

**Solution:**
- Use separate databases for each environment
- Configure `DATABASE_URL` with appropriate scoping in Vercel
- Production: Production database
- Preview: Staging/test database
- Development: Local or test database

### ❌ Mistake 5: Connection Pooling Issues

**Symptom:**
```
Error: Too many connections
Error: Connection timeout
```

**Solution:**
- Use Neon's connection pooler (add `?pgbouncer=true` to connection string)
- Or use Neon's pooled connection string from dashboard
- Reduce connection pool size in `src/lib/prisma.ts` if needed

### ❌ Mistake 6: Build Fails Due to TypeScript Errors

**Symptom:**
```
Type error: ...
Build failed
```

**Solution:**
- Fix TypeScript errors locally first
- Run `npm run build` locally to catch errors
- Ensure all dependencies are in `package.json` (not just `package-lock.json`)

### ❌ Mistake 7: Missing Dependencies

**Symptom:**
```
Error: Cannot find module '@prisma/adapter-pg'
Error: Module not found
```

**Solution:**
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Runtime dependencies must be in `dependencies`
- Re-run `npm install` and commit `package.json` and `package-lock.json`

---

## Unlinking or Resetting

### Unlinking Project from Vercel

If you need to unlink the project:

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings → General**
4. Scroll to **Danger Zone**
5. Click **Delete Project**
6. Confirm deletion

**Note:** This removes the project from Vercel but does NOT:
- Delete your Git repository
- Delete your database
- Delete local files

### Resetting Project Configuration

To reset configuration without unlinking:

1. Go to **Settings → General**
2. Update incorrect settings:
   - Build Command
   - Root Directory
   - Framework Preset
3. Go to **Settings → Environment Variables**
4. Remove or update incorrect variables
5. Trigger a new deployment

### Starting Fresh

If you need to start completely fresh:

1. Delete the project in Vercel (see above)
2. Create a new project
3. Follow linking steps again
4. Configure settings correctly from the start

---

## What This Does NOT Do

This linking process **explicitly does NOT**:

### ❌ Deployment to Production
- Linking creates a preview deployment
- Production deployment requires additional configuration
- Custom domain setup is separate

### ❌ Database Migrations
- Migrations are NOT run automatically
- Database schema is NOT updated
- You must run migrations manually: `npm run db:migrate:deploy`

### ❌ Database Seeding
- No seed data is created
- Database tables may be empty
- Seed scripts (if any) must be run manually

### ❌ Authentication Setup
- No authentication is configured
- No user management is enabled
- Authentication must be implemented separately

### ❌ Backups or Monitoring
- No automatic backups are configured
- No monitoring or alerting is set up
- These must be configured separately

### ❌ CI/CD Pipeline
- No automatic deployments on push
- No branch protection rules
- No deployment approvals
- These can be configured in Vercel settings after linking

### ❌ Environment-Specific Configuration
- All environments may use the same database (if not scoped)
- Environment-specific features are not configured
- These must be set up separately

---

## Next Steps After Linking

Once the project is successfully linked:

1. **Run Database Migrations:**
   ```bash
   # Locally or via CI/CD
   npm run db:migrate:deploy
   ```

2. **Verify Deployment:**
   - Check preview URL works
   - Test API endpoints
   - Verify database connectivity

3. **Configure Production:**
   - Set up custom domain (if needed)
   - Configure production environment variables
   - Set up branch protection

4. **Set Up Monitoring:**
   - Configure Vercel Analytics (if needed)
   - Set up error tracking
   - Configure uptime monitoring

5. **Security Hardening:**
   - Review environment variable security
   - Set up deployment approvals
   - Configure access controls

---

## Summary Checklist

Before considering the project "linked":

- [ ] Repository is pushed to Git provider
- [ ] Vercel project is created and linked to repository
- [ ] Framework preset is set to Next.js
- [ ] Build command includes Prisma Client generation
- [ ] `DATABASE_URL` environment variable is configured
- [ ] Build succeeds (even if runtime fails due to missing migrations)
- [ ] No migration commands in build scripts
- [ ] Project appears in Vercel dashboard
- [ ] Settings are documented and reviewed

**After linking, you must still:**
- [ ] Run database migrations manually
- [ ] Configure production settings
- [ ] Set up monitoring and backups
- [ ] Test the deployed application

---

*Last updated: Vercel linking preparation*
*Status: Documentation only - no code changes required*


---

## 20_vercel_deploy.md

# Vercel Production Deployment Guide

This document records the initial production deployment of the Psychiatric Medical Records System MVP to Vercel.

**⚠️ CRITICAL: This is an MVP deployment with significant limitations. See [Production Limitations](#production-limitations) section.**

---

## Table of Contents

1. [Pre-Deploy Verification](#pre-deploy-verification)
2. [Vercel Environment Configuration](#vercel-environment-configuration)
3. [Deployment Execution](#deployment-execution)
4. [Post-Deploy Validation](#post-deploy-validation)
5. [Production Safety Rules](#production-safety-rules)
6. [Production Limitations](#production-limitations)
7. [Deployment Information](#deployment-information)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deploy Verification

### ✅ Checklist Before Deployment

Complete these checks before triggering the deployment:

- [ ] **Local Build Success**
  ```bash
  npm run build
  ```
  - Build completes without errors
  - No TypeScript compilation errors
  - No missing dependencies

- [ ] **Prisma Client Generation**
  ```bash
  npm run db:generate
  ```
  - Prisma Client generates successfully
  - Output directory `src/generated/prisma` is created
  - No schema errors

- [ ] **No Pending Migrations**
  ```bash
  npx prisma migrate status
  ```
  - All migrations are applied to the production database
  - No pending migrations exist
  - **DO NOT** deploy with pending migrations

- [ ] **No Secrets in Repository**
  - No `.env` files committed (check with `git status`)
  - No hardcoded database credentials
  - No API keys or tokens in code
  - `.gitignore` properly excludes `.env*` files

- [ ] **Database Connectivity**
  - Production database (Neon) is accessible
  - Connection string is ready (not yet added to Vercel)
  - Database has all required migrations applied
  - Test connection locally with production connection string

- [ ] **Code Review**
  - No debug endpoints exposed
  - No test-only routes in production
  - No `console.log` statements with patient data (see note below)
  - Error handling is appropriate

### ⚠️ Known Issues

**Console Error Logging:**
The application uses `console.error()` for error logging in API routes. These logs may appear in Vercel's function logs and could potentially contain:
- Patient IDs
- Error messages that reference patient data
- Stack traces

**Recommendation:** In a future update, implement structured logging that:
- Sanitizes patient-identifiable information
- Uses a proper logging service (e.g., Sentry, LogRocket)
- Implements log redaction for sensitive data

**Current Status:** Acceptable for MVP, but should be addressed before handling real patient data.

---

## Vercel Environment Configuration

### Required Environment Variables

Configure these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Value | Environment Scope | Required |
|----------|-------|-------------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Production, Preview, Development | ✅ Yes |
| `NODE_ENV` | `production` | Production (auto-set by Vercel) | Auto |

### Setting Environment Variables

1. Go to Vercel Dashboard → Your Project
2. Navigate to **Settings → Environment Variables**
3. Add `DATABASE_URL`:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon PostgreSQL production connection string
     - Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - **Environment:** Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
4. Click **Save**

### ⚠️ Security Requirements

- **DO NOT** commit `.env` files
- **DO NOT** hardcode connection strings
- **DO NOT** share connection strings in documentation or chat
- Use different databases for Production, Preview, and Development if possible
- Rotate credentials if accidentally exposed

### Build Command Configuration

**CRITICAL:** Ensure Prisma Client generation is included in the build.

In **Vercel Dashboard → Settings → General → Build & Development Settings**:

**Build Command:**
```
npm run db:generate && next build
```

**OR** (if `postinstall` script exists in `package.json`):
```
next build
```

Verify this is set correctly before deploying.

---

## Deployment Execution

### Step 1: Final Pre-Deploy Check

1. Verify environment variables are set in Vercel dashboard
2. Verify build command includes Prisma generation
3. Ensure all code is committed and pushed:
   ```bash
   git status
   git add .
   git commit -m "chore: prepare for production deployment"
   git push
   ```

### Step 2: Trigger Deployment

**Option A: Via Vercel Dashboard**
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click **Redeploy** on the latest deployment, OR
4. Push to the main branch (if auto-deploy is enabled)

**Option B: Via Git Push**
```bash
git push origin main
```
(If auto-deploy is configured)

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### Step 3: Monitor Build

1. Go to **Deployments** tab in Vercel dashboard
2. Click on the new deployment
3. Monitor build logs for:
   - ✅ `✔ Generated Prisma Client`
   - ✅ `✔ Compiled successfully`
   - ✅ `Build completed`
   - ❌ Any errors or warnings

### Step 4: Verify Deployment Success

- Build status shows **Ready**
- No build errors in logs
- Deployment URL is accessible
- No runtime errors in function logs

---

## Post-Deploy Validation

### Smoke Test Checklist

Perform these manual checks after deployment:

#### 1. Application Loads
- [ ] Navigate to production URL
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools
- [ ] No 500 errors in network tab

#### 2. Patient List View
- [ ] Navigate to patient list (home page)
- [ ] Patient list renders (may be empty)
- [ ] No errors in browser console
- [ ] UI components render correctly

#### 3. Create Patient Flow
- [ ] Click "Create Patient" or navigate to `/patients/new`
- [ ] Form loads without errors
- [ ] Fill out required fields:
  - Full Name
  - Date of Birth
- [ ] Submit the form
- [ ] Patient is created successfully
- [ ] Redirected to patient detail page
- [ ] Patient appears in patient list

#### 4. Patient Detail View
- [ ] Navigate to a patient's detail page
- [ ] Patient information displays correctly
- [ ] Timeline component renders
- [ ] No errors in console

#### 5. API Endpoints
Test key API endpoints directly:

- [ ] `GET /api/patients` - Returns patient list
- [ ] `GET /api/patients/[id]` - Returns patient details
- [ ] `POST /api/patients` - Creates new patient
- [ ] `GET /api/patients/[id]/timeline` - Returns timeline

#### 6. Error Handling
- [ ] Invalid patient ID returns 404
- [ ] Invalid API requests return appropriate error codes
- [ ] Error messages don't expose sensitive information

#### 7. Database Connectivity
- [ ] Database queries succeed
- [ ] No connection timeout errors
- [ ] No "too many connections" errors
- [ ] Data persists between page refreshes

### ⚠️ If Smoke Tests Fail

1. **Check Vercel Function Logs:**
   - Go to **Deployments → [Deployment] → Functions**
   - Review error logs
   - Look for database connection errors

2. **Verify Environment Variables:**
   - Ensure `DATABASE_URL` is set correctly
   - Check that connection string includes `?sslmode=require`

3. **Check Build Logs:**
   - Verify Prisma Client was generated
   - Look for compilation errors

4. **Database Status:**
   - Verify database is accessible
   - Check that migrations are applied
   - Test connection string locally

---

## Production Safety Rules

### ✅ What Was Verified

- [x] **No Automatic Migrations**
  - Build command does NOT include `prisma migrate deploy`
  - No migration scripts in `postinstall` or build hooks
  - Migrations must be run manually

- [x] **No Seed Scripts**
  - No seed data is created automatically
  - Database starts empty (or with manually seeded data)

- [x] **No Test Endpoints**
  - All API routes are production endpoints
  - No `/api/test` or `/api/debug` routes
  - Test files are not included in build

- [x] **No Debug Mode**
  - `NODE_ENV` is set to `production`
  - No debug flags enabled
  - Prisma logging is minimal (errors only)

### ⚠️ Logging Considerations

**Current State:**
- Application uses `console.error()` for error logging
- Logs may contain:
  - Patient IDs
  - Error messages referencing patient data
  - Stack traces

**Vercel Function Logs:**
- Accessible in Vercel dashboard
- May be visible to team members with project access
- Should be reviewed for sensitive data exposure

**Recommendation:**
- Implement structured logging in future update
- Add log redaction for patient-identifiable information
- Consider using a logging service with data sanitization

### 🔒 Security Checklist

- [x] No secrets in code
- [x] Environment variables set in Vercel (not in code)
- [x] `.env` files excluded from git
- [ ] **Authentication:** ⚠️ NOT YET IMPLEMENTED
- [ ] **HTTPS:** ✅ Enabled by default on Vercel
- [ ] **CORS:** ⚠️ Not configured (may need for API access)
- [ ] **Rate Limiting:** ⚠️ NOT YET IMPLEMENTED

---

## Production Limitations

### ⚠️ CRITICAL: What Is NOT Production-Ready

This MVP deployment has **significant limitations** that must be understood before use:

#### 1. No Authentication
- **Status:** ❌ NOT IMPLEMENTED
- **Impact:** Application is publicly accessible
- **Risk:** Anyone with the URL can access patient data
- **Action Required:** Implement authentication before handling real patient data

#### 2. No Authorization
- **Status:** ❌ NOT IMPLEMENTED
- **Impact:** No user roles or permissions
- **Risk:** No access control mechanisms
- **Action Required:** Add user management and role-based access control

#### 3. No Audit Logging
- **Status:** ❌ NOT IMPLEMENTED
- **Impact:** No record of who accessed or modified patient data
- **Risk:** Cannot track data access or changes
- **Action Required:** Implement audit logging for HIPAA compliance

#### 4. No Backups
- **Status:** ❌ NOT CONFIGURED
- **Impact:** No automatic database backups
- **Risk:** Data loss if database fails
- **Action Required:** Configure Neon automatic backups or manual backup schedule

#### 5. No Monitoring
- **Status:** ⚠️ BASIC (Vercel logs only)
- **Impact:** Limited visibility into application health
- **Risk:** Issues may go undetected
- **Action Required:** Implement application monitoring (e.g., Sentry, DataDog)

#### 6. No Error Tracking
- **Status:** ❌ NOT IMPLEMENTED
- **Impact:** Errors may go unnoticed
- **Risk:** Production issues may not be detected
- **Action Required:** Add error tracking service

#### 7. No Data Encryption at Rest
- **Status:** ⚠️ DEPENDS ON NEON
- **Impact:** Database encryption depends on Neon's configuration
- **Risk:** Data may not be encrypted
- **Action Required:** Verify Neon encryption settings

#### 8. No Data Encryption in Transit
- **Status:** ✅ HTTPS ENABLED (Vercel default)
- **Impact:** API calls are encrypted
- **Note:** Database connection uses SSL (`?sslmode=require`)

#### 9. No Rate Limiting
- **Status:** ❌ NOT IMPLEMENTED
- **Impact:** API endpoints can be abused
- **Risk:** DDoS or brute force attacks possible
- **Action Required:** Implement rate limiting

#### 10. No Input Validation Beyond Basic
- **Status:** ⚠️ BASIC VALIDATION ONLY
- **Impact:** Limited protection against malicious input
- **Risk:** Potential injection attacks
- **Action Required:** Enhance input validation and sanitization

#### 11. Console Logging May Contain Patient Data
- **Status:** ⚠️ CURRENT IMPLEMENTATION
- **Impact:** Error logs may contain patient-identifiable information
- **Risk:** Sensitive data in logs
- **Action Required:** Implement log redaction

#### 12. Single-User MVP
- **Status:** ✅ BY DESIGN
- **Impact:** Designed for one clinician
- **Note:** This is acceptable for MVP scope

### 🚨 HIPAA Compliance Status

**⚠️ NOT HIPAA COMPLIANT**

This application is **NOT** ready for HIPAA-compliant use due to:
- No authentication/authorization
- No audit logging
- No Business Associate Agreement (BAA) with Vercel/Neon
- No encryption verification
- No access controls

**DO NOT** use this application with real patient data until:
- Authentication is implemented
- Audit logging is added
- BAAs are in place with all vendors
- Security review is completed
- Compliance assessment is performed

---

## Deployment Information

### Deployment Record

**Deployment Date:** _[To be filled after deployment]_

**Vercel Project Name:** _[To be filled]_

**Production URL:** _[To be filled]_

**Deployment ID:** _[To be filled]_

**Git Commit:** _[To be filled]_

**Deployed By:** _[To be filled]_

### Environment Configuration

**Build Command:**
```
npm run db:generate && next build
```

**Node Version:**
- Auto-detected by Vercel (typically latest LTS)

**Framework:**
- Next.js 16.0.10

**Region:**
- Auto-selected by Vercel (typically closest to database region)

### Database Information

**Database Provider:** Neon PostgreSQL

**Connection:** Via `DATABASE_URL` environment variable

**Migrations Status:** _[To be verified]_
- All migrations applied: ✅ / ❌
- Last migration: `0001_init`

**Database Region:** _[To be filled]_

---

## Troubleshooting

### Build Fails: Prisma Client Not Generated

**Symptom:**
```
Error: Cannot find module '@/generated/prisma'
```

**Solution:**
1. Verify build command includes `npm run db:generate &&`
2. Check Vercel build logs for Prisma generation step
3. Ensure `prisma` is in `dependencies` (not just `devDependencies`)

### Runtime Error: Database Connection Failed

**Symptom:**
```
Error: P1001: Can't reach database server
```

**Solution:**
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Check connection string format (includes `?sslmode=require`)
3. Verify database is accessible from Vercel's IP ranges
4. Test connection string locally

### Runtime Error: Migration Not Applied

**Symptom:**
```
Error: Table 'patients' does not exist
```

**Solution:**
1. Run migrations manually:
   ```bash
   npm run db:migrate:deploy
   ```
2. Verify migrations are applied:
   ```bash
   npx prisma migrate status
   ```

### Application Loads But API Returns 500

**Symptom:**
- Page loads but API calls fail
- Network tab shows 500 errors

**Solution:**
1. Check Vercel function logs for errors
2. Verify database connectivity
3. Check for missing environment variables
4. Review error messages in function logs

### Cold Start Timeout

**Symptom:**
- First request after inactivity times out
- Subsequent requests work

**Solution:**
1. This is normal for serverless functions
2. Consider implementing keep-alive pings
3. Or upgrade to Vercel Pro for better cold start performance

---

## Next Steps After Deployment

1. **Monitor Initial Usage**
   - Watch Vercel function logs
   - Monitor for errors
   - Check database connection stability

2. **Implement Authentication** (Priority 1)
   - Add user authentication
   - Implement session management
   - Secure all API endpoints

3. **Add Audit Logging** (Priority 2)
   - Log all data access
   - Log all data modifications
   - Store audit logs securely

4. **Configure Backups** (Priority 3)
   - Set up Neon automatic backups
   - Test backup restoration
   - Document backup procedures

5. **Implement Monitoring** (Priority 4)
   - Add error tracking (Sentry)
   - Set up uptime monitoring
   - Configure alerts

6. **Security Hardening** (Priority 5)
   - Implement rate limiting
   - Add input validation
   - Security audit
   - Penetration testing

---

## Summary

### ✅ What Was Deployed

- Next.js application
- Prisma ORM with Neon PostgreSQL
- Patient CRUD functionality
- Clinical timeline features
- Basic UI components

### ⚠️ What Is Missing

- Authentication/Authorization
- Audit Logging
- Backups
- Monitoring
- Error Tracking
- Rate Limiting
- HIPAA Compliance

### 🚨 Critical Warnings

1. **DO NOT** use with real patient data until authentication is implemented
2. **DO NOT** assume HIPAA compliance
3. **DO** implement security measures before production use
4. **DO** perform security review before handling sensitive data

---

*Last updated: [Deployment Date]*
*Status: MVP Deployed - Not Production Ready for Real Patient Data*


---

## 24_build_vercel_specs.md

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


---

## DATABASE.md

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


---

# Calidad

## 16_clinical_qa_manual.md

# Manual de Verificación Clínica — Guía para el Psiquiatra

## Propósito

Este manual proporciona una lista de verificación para que el psiquiatra evalúe el funcionamiento del sistema de registros clínicos durante su práctica diaria.

Cada sección contiene pasos concretos para confirmar que las funciones esenciales operan correctamente.

El objetivo es garantizar confianza en los datos, claridad durante la consulta y facilidad de uso.

---

## Cómo Usar Este Manual

1. Realice las verificaciones en orden o seleccione la sección relevante según su necesidad.
2. Para cada paso, observe el resultado y marque si coincide con lo esperado.
3. Anote cualquier comportamiento inesperado en la columna de observaciones.
4. Los problemas identificados deben reportarse para su corrección.

**Columnas de verificación:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|

---

## 1. Creación y Búsqueda de Pacientes

### 1.1 Registrar un Nuevo Paciente

Esta verificación confirma que puede incorporar nuevos pacientes al registro.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Inicie el proceso de crear un nuevo paciente | Aparece un formulario para ingresar datos | | |
| Ingrese el nombre completo del paciente | El campo acepta el texto | | |
| Ingrese la fecha de nacimiento | El campo acepta una fecha válida | | |
| Ingrese información de contacto (teléfono, correo) | Los campos aceptan los datos opcionales | | |
| Ingrese contacto de emergencia (nombre, teléfono, parentesco) | Los campos aceptan los datos | | |
| Confirme la creación | El paciente aparece registrado con estado activo | | |
| Busque al paciente recién creado | El paciente aparece en los resultados de búsqueda | | |

**Verificación adicional — Detección de duplicados:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Intente crear otro paciente con el mismo nombre y fecha de nacimiento | Aparece una advertencia sobre posible duplicado | | |

---

### 1.2 Buscar un Paciente Existente

Esta verificación confirma que puede localizar pacientes para acceder a sus registros.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Ingrese parte del nombre del paciente | Aparecen pacientes que coinciden con el texto | | |
| Ingrese la fecha de nacimiento | El resultado se filtra correctamente | | |
| Ingrese el identificador del paciente | Aparece el paciente exacto | | |
| Seleccione un paciente de los resultados | Accede al registro clínico completo del paciente | | |
| Busque un nombre que no existe | El resultado indica que no hay coincidencias | | |

**Verificación de estados:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Busque pacientes activos e inactivos | Los pacientes activos aparecen primero; los inactivos están claramente diferenciados | | |

---

### 1.3 Editar Información del Paciente

Esta verificación confirma que puede actualizar datos demográficos cuando cambian.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Abra el registro de un paciente existente | Se muestran los datos actuales del paciente | | |
| Modifique el número de teléfono | El cambio se acepta | | |
| Modifique el correo electrónico | El cambio se acepta | | |
| Modifique la dirección | El cambio se acepta | | |
| Guarde los cambios | Los nuevos datos quedan registrados | | |
| Verifique que el identificador no es editable | El identificador permanece fijo | | |
| Verifique que la fecha de registro no es editable | La fecha de registro permanece fija | | |

---

### 1.4 Cambiar Estado del Paciente

Esta verificación confirma el manejo de pacientes que dejan o retoman tratamiento.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Cambie un paciente de activo a inactivo | El estado se actualiza | | |
| Verifique que el registro clínico sigue accesible | Toda la documentación permanece visible | | |
| Cambie el paciente de inactivo a activo | El estado se restaura | | |
| Verifique que puede continuar documentando | Las funciones de documentación están disponibles | | |

---

## 2. Redacción de Notas Clínicas

### 2.1 Crear una Nota de Consulta

Esta verificación confirma el flujo de documentación de encuentros clínicos.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un paciente | Accede a su registro clínico | | |
| Inicie la creación de una nueva nota | Aparece el formulario de nota | | |
| Ingrese la fecha del encuentro | El campo acepta una fecha (no futura) | | |
| Seleccione el tipo de encuentro (Evaluación Inicial, Seguimiento, Intervención en Crisis, Revisión de Medicación, Sesión de Terapia, Consulta Telefónica, Otro) | La selección se registra | | |
| Ingrese observaciones subjetivas | El texto se registra correctamente | | |
| Ingrese hallazgos objetivos | El texto se registra correctamente | | |
| Ingrese la evaluación | El texto se registra correctamente | | |
| Ingrese el plan | El texto se registra correctamente | | |
| Guarde como borrador | La nota queda guardada pero editable | | |

---

### 2.2 Editar y Finalizar una Nota

Esta verificación confirma el ciclo completo de una nota clínica.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Abra una nota en borrador | El contenido es editable | | |
| Modifique cualquier sección | Los cambios se aceptan | | |
| Guarde los cambios en el borrador | Los cambios persisten | | |
| Finalice la nota | La nota cambia a estado finalizado | | |
| Intente modificar la nota finalizada | Los campos de contenido ya no son editables | | |
| Verifique que la nota aparece en la línea de tiempo | Un evento de encuentro aparece en la fecha correspondiente | | |

**Verificación de campos obligatorios:**

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Intente finalizar una nota sin observaciones subjetivas | Se indica que el campo es requerido | | |
| Intente finalizar una nota sin evaluación | Se indica que el campo es requerido | | |
| Intente finalizar una nota sin plan | Se indica que el campo es requerido | | |

---

### 2.3 Agregar Addenda a Notas Finalizadas

Esta verificación confirma el mecanismo de corrección sin alterar el registro original.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Abra una nota finalizada | La nota se muestra en modo lectura | | |
| Inicie la creación de un addendum | Aparece un formulario para el contenido adicional | | |
| Ingrese el contenido del addendum | El texto se acepta | | |
| Ingrese la razón del addendum | La razón se registra | | |
| Confirme el addendum | El addendum queda adjunto a la nota | | |
| Verifique que el addendum es visible junto a la nota original | Ambos textos (original y addendum) se muestran juntos | | |
| Intente modificar el addendum después de crearlo | El addendum no es editable | | |

---

### 2.4 Eliminar Borradores

Esta verificación confirma que los borradores pueden descartarse antes de finalizar.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Cree una nota en borrador | La nota existe como borrador | | |
| Solicite eliminar el borrador | Se pide confirmación | | |
| Confirme la eliminación | El borrador desaparece del registro | | |
| Verifique que la nota no aparece en la línea de tiempo | No hay rastro del borrador eliminado | | |

---

## 3. Gestión de Medicamentos

### 3.1 Registrar un Medicamento Nuevo

Esta verificación confirma el inicio de un tratamiento farmacológico.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un paciente | Accede a su registro clínico | | |
| Inicie el registro de un nuevo medicamento | Aparece el formulario de medicamento | | |
| Ingrese el nombre del fármaco | El campo acepta el texto | | |
| Ingrese la dosis y unidad (ej. 50 mg) | Los campos aceptan los valores | | |
| Ingrese la frecuencia (ej. cada 12 horas) | El campo acepta el texto | | |
| Ingrese la vía de administración (opcional) | El campo acepta el texto | | |
| Ingrese la fecha de inicio | El campo acepta una fecha (no futura) | | |
| Ingrese la razón de prescripción | El campo acepta el texto | | |
| Confirme el registro | El medicamento aparece en la lista de medicamentos activos | | |
| Verifique la línea de tiempo | Aparece un evento de inicio de medicamento | | |

---

### 3.2 Modificar Dosis o Frecuencia

Esta verificación confirma el ajuste de tratamientos existentes.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un medicamento activo | Se muestran los detalles actuales | | |
| Inicie un cambio de dosis | Aparece el formulario de modificación | | |
| Ingrese la nueva dosis | El campo acepta el valor | | |
| Ingrese la fecha efectiva del cambio | El campo acepta la fecha | | |
| Confirme el cambio | El medicamento actualizado aparece como activo | | |
| Verifique que el medicamento anterior aparece como discontinuado | El historial muestra la dosis previa | | |
| Verifique la línea de tiempo | Aparece un evento de cambio de medicamento | | |
| Revise el historial farmacológico completo | Se ve la progresión: dosis original → dosis nueva | | |

---

### 3.3 Discontinuar un Medicamento

Esta verificación confirma el cierre de un tratamiento.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un medicamento activo | Se muestran los detalles | | |
| Inicie la discontinuación | Aparece el formulario correspondiente | | |
| Ingrese la fecha de fin | El campo acepta la fecha | | |
| Ingrese la razón de discontinuación | El campo acepta el texto | | |
| Confirme la discontinuación | El medicamento pasa a la lista histórica | | |
| Verifique que ya no aparece como activo | Solo figura en el historial | | |
| Verifique la línea de tiempo | Aparece un evento de fin de medicamento | | |

---

### 3.4 Visualizar Historial Farmacológico

Esta verificación confirma la trazabilidad completa de tratamientos.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Acceda al historial de medicamentos del paciente | Se muestran todos los medicamentos (activos e históricos) | | |
| Identifique medicamentos activos | Están claramente diferenciados de los históricos | | |
| Revise un medicamento con múltiples cambios de dosis | Se ve toda la evolución cronológica | | |
| Verifique las fechas de inicio y fin de cada medicamento | Las fechas son coherentes y no se superponen incorrectamente | | |
| Verifique las razones de prescripción y discontinuación | Toda la información registrada es accesible | | |

---

## 4. Citas y Seguimiento

### 4.1 Registrar una Próxima Cita

Esta verificación confirma el registro de encuentros futuros.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione un paciente | Accede a su registro | | |
| Inicie el registro de una cita | Aparece el formulario de cita | | |
| Ingrese la fecha programada | El campo acepta una fecha futura | | |
| Ingrese la hora (opcional) | El campo acepta la hora | | |
| Ingrese la duración estimada (opcional) | El campo acepta el valor | | |
| Seleccione el tipo de cita | La selección se registra | | |
| Agregue notas sobre la cita (opcional) | El campo acepta el texto | | |
| Confirme el registro | La cita aparece en el registro del paciente | | |

---

### 4.2 Actualizar o Cancelar Citas

Esta verificación confirma la gestión de cambios en la agenda.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Seleccione una cita existente | Se muestran los detalles actuales | | |
| Modifique la fecha | El cambio se acepta | | |
| Modifique la hora | El cambio se acepta | | |
| Guarde los cambios | La cita actualizada se muestra | | |
| Cambie el estado a cancelada | La cita permanece visible con estado cancelado | | |

---

### 4.3 Marcar Estados de Citas

Esta verificación confirma el seguimiento del cumplimiento de citas.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Marque una cita como completada | El estado cambia a completada | | |
| Marque una cita como ausencia (no-show) | El estado cambia a ausencia | | |
| Verifique que las citas pasadas mantienen su estado | El historial de citas es accesible | | |
| Confirme que las citas no aparecen en la línea de tiempo clínica | Las citas son administrativas, no eventos clínicos | | |

---

## 5. Revisión de Historia Clínica y Línea de Tiempo

### 5.1 Navegar la Línea de Tiempo

Esta verificación confirma la visualización cronológica del historial clínico.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Acceda a la línea de tiempo del paciente | Se muestra la lista de eventos clínicos | | |
| Verifique el orden por defecto | Los eventos más recientes aparecen primero | | |
| Cambie a orden cronológico ascendente | Los eventos más antiguos aparecen primero | | |
| Identifique los diferentes tipos de eventos | Encuentros, medicamentos, hospitalizaciones, eventos vitales están diferenciados | | |
| Seleccione un evento de encuentro | Accede a la nota clínica completa | | |
| Seleccione un evento de medicamento | Accede a los detalles del medicamento | | |

---

### 5.2 Filtrar la Línea de Tiempo

Esta verificación confirma la búsqueda selectiva en el historial.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Filtre solo eventos de encuentros | Solo aparecen las consultas documentadas | | |
| Filtre solo eventos de medicamentos | Solo aparecen inicios, cambios y fines de medicamentos | | |
| Filtre solo hospitalizaciones | Solo aparecen eventos de hospitalización | | |
| Filtre solo eventos vitales | Solo aparecen los eventos de vida registrados | | |
| Filtre por rango de fechas | Solo aparecen eventos dentro del período seleccionado | | |
| Quite todos los filtros | Aparece el historial completo | | |

---

### 5.3 Buscar Dentro del Historial

Esta verificación confirma la localización de información específica.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Ingrese un término de búsqueda (ej. nombre de medicamento) | Aparecen eventos que contienen el término | | |
| Ingrese un término presente en una nota | El evento de encuentro correspondiente aparece | | |
| Navegue directamente al evento encontrado | Accede al contenido completo | | |

---

### 5.4 Verificar Integridad Temporal

Esta verificación confirma que el historial mantiene su coherencia.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Revise eventos de diferentes fechas | Cada evento muestra su fecha de ocurrencia | | |
| Verifique un evento registrado con posterioridad (backdated) | El evento aparece en su fecha clínica correcta, no en la fecha de registro | | |
| Confirme que las notas en borrador no aparecen | Solo las notas finalizadas generan eventos en la línea de tiempo | | |
| Verifique que no hay eventos con fechas futuras | Todos los eventos tienen fechas pasadas o actuales | | |

---

### 5.5 Revisar Historia Psiquiátrica

Esta verificación confirma el acceso a la información de fondo del paciente.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Acceda a la historia psiquiátrica actual | Se muestra la versión vigente | | |
| Revise las secciones disponibles (motivo de consulta, historia de enfermedad actual, antecedentes psiquiátricos, hospitalizaciones, intentos suicidas, consumo de sustancias, antecedentes familiares, historia médica, quirúrgica, alergias, historia social, desarrollo) | Cada sección es legible | | |
| Modifique una sección de la historia | Se crea una nueva versión | | |
| Verifique que la versión anterior es accesible | Puede consultar el contenido previo | | |
| Verifique la línea de tiempo | Aparece un evento de actualización de historia (excepto para la versión inicial) | | |

---

### 5.6 Registrar Eventos Manuales

Esta verificación confirma el registro de acontecimientos significativos externos.

| Paso | Resultado Esperado | ¿Correcto? | Observaciones |
|------|-------------------|------------|---------------|
| Inicie la creación de un evento manual | Aparece el formulario | | |
| Seleccione el tipo (Hospitalización, Evento Vital, Otro) | La selección se registra | | |
| Ingrese la fecha del evento | El campo acepta una fecha (no futura) | | |
| Ingrese el título del evento | El campo acepta el texto | | |
| Ingrese la descripción (opcional) | El campo acepta el texto | | |
| Confirme el evento | El evento aparece en la línea de tiempo | | |
| Verifique que el evento no es editable después de crearlo | El contenido permanece fijo | | |

---

## 6. Verificaciones de Confiabilidad

Estas verificaciones adicionales confirman que puede confiar en la integridad del registro clínico.

### 6.1 Inmutabilidad de Documentación Finalizada

| Verificación | Resultado Esperado | ¿Correcto? | Observaciones |
|--------------|-------------------|------------|---------------|
| Las notas finalizadas no pueden modificarse | Solo es posible agregar addenda | | |
| Los addenda no pueden modificarse después de crearse | El contenido permanece fijo | | |
| Los medicamentos discontinuados no pueden editarse | Los datos históricos están protegidos | | |
| Los eventos clínicos no pueden eliminarse | El historial es permanente | | |
| Las versiones anteriores de la historia psiquiátrica son accesibles | Nada se pierde al actualizar | | |

---

### 6.2 Coherencia Temporal

| Verificación | Resultado Esperado | ¿Correcto? | Observaciones |
|--------------|-------------------|------------|---------------|
| Los eventos aparecen ordenados por fecha de ocurrencia | El orden es consistente en cada consulta | | |
| Los eventos registrados tardíamente se ubican en su fecha clínica | Un evento de hace un mes aparece hace un mes, no hoy | | |
| No existen eventos con fechas futuras | El sistema rechaza fechas futuras para eventos clínicos | | |
| Los medicamentos muestran fechas de inicio y fin coherentes | La fecha de fin nunca es anterior a la de inicio | | |

---

### 6.3 Completitud del Registro

| Verificación | Resultado Esperado | ¿Correcto? | Observaciones |
|--------------|-------------------|------------|---------------|
| Todos los medicamentos (activos e históricos) son visibles | Ningún medicamento desaparece del historial | | |
| Todas las notas finalizadas aparecen en la línea de tiempo | Cada encuentro documentado genera un evento | | |
| Los addenda siempre se muestran junto a su nota original | No hay addenda huérfanos | | |
| La historia psiquiátrica mantiene todas sus versiones | Es posible reconstruir el conocimiento en cualquier momento | | |

---

## 7. Resumen de Verificaciones Críticas

Las siguientes verificaciones son las más importantes para garantizar la confiabilidad clínica:

| Área | Verificación Crítica | Estado |
|------|---------------------|--------|
| Pacientes | Puede crear, buscar y acceder a cualquier paciente | |
| Notas | Las notas finalizadas son inmutables | |
| Notas | Los addenda preservan el registro original | |
| Medicamentos | El historial farmacológico completo es trazable | |
| Medicamentos | Los cambios de dosis crean registros separados (no sobrescriben) | |
| Línea de tiempo | Todos los eventos clínicos aparecen en orden correcto | |
| Línea de tiempo | Los eventos registrados tardíamente se ubican en su fecha clínica | |
| Historia | Las versiones anteriores de la historia psiquiátrica son accesibles | |
| Integridad | Ningún dato clínico puede eliminarse o modificarse retroactivamente | |

---

## Glosario

| Término | Significado |
|---------|-------------|
| Nota | Documentación de un encuentro clínico |
| Borrador | Nota que aún puede editarse antes de finalizarse |
| Finalizada | Nota que ya no puede modificarse, solo recibir addenda |
| Addendum | Texto adicional adjunto a una nota finalizada |
| Línea de tiempo | Vista cronológica de todos los eventos clínicos del paciente |
| Evento clínico | Cualquier acontecimiento significativo registrado (encuentro, medicamento, hospitalización, etc.) |
| Historia psiquiátrica | Información de antecedentes del paciente, versionada |
| Activo | Paciente en tratamiento actual / Medicamento vigente |
| Inactivo | Paciente que no está en tratamiento actualmente |
| Discontinuado | Medicamento que ya no se administra |

---

*Versión del documento: 1.0*  
*Estado: Borrador*  
*Idioma: Español*


---

# Apéndices

## 04_use_cases.md

# Psychiatric Medical Records System — Use Cases

## Overview

This document describes the primary functional flows for the MVP.

Each use case represents a complete interaction between the clinician and the system.

Use cases are written without assumptions about user interface or implementation.

---

## UC-01: Create Patient

### Description

The clinician registers a new patient in the system to begin documenting their psychiatric care.

### Actor

Clinician

### Trigger

The clinician needs to document care for an individual not yet registered in the system.

### Preconditions

- The system is accessible.
- The clinician has the patient's demographic information available.

### Steps

1. The clinician initiates the patient creation process.
2. The clinician provides the patient's full name.
3. The clinician provides the patient's date of birth.
4. The clinician provides contact information (phone, email, address).
5. The clinician provides emergency contact details (name, phone, relationship).
6. The clinician confirms the patient information.
7. The system creates the Patient record.
8. The system creates an associated ClinicalRecord.
9. The system creates an initial empty PsychiatricHistory (version 1).
10. The system assigns a unique identifier to the patient.
11. The system sets the patient status to active.
12. The system records the registration date.
13. The system confirms successful creation.

### Validations

| Field | Rule |
|-------|------|
| Full name | Required. Cannot be empty. |
| Date of birth | Required. Must be a valid date. Cannot be in the future. |
| Contact phone | Optional. If provided, must be a valid phone format. |
| Contact email | Optional. If provided, must be a valid email format. |
| Emergency contact name | Optional. |
| Emergency contact phone | Optional. Required if emergency contact name is provided. |

### Expected Outcome

- A new Patient exists in the system with active status.
- A ClinicalRecord is associated with the Patient.
- An empty PsychiatricHistory (version 1) exists within the ClinicalRecord. All content fields are initially blank and are populated during the initial evaluation encounter.
- The patient is available for search and documentation.
- No clinical events are generated by patient creation.

### Alternative Flows

**AF-01: Duplicate Detection**

If a patient with the same full name and date of birth already exists:

1. The system alerts the clinician to the potential duplicate.
2. The clinician may proceed with creation or cancel to review the existing patient.

### Error Conditions

- Missing required fields: Creation is blocked until required information is provided.
- Invalid date format: The system requests a valid date.

---

## UC-01B: Edit Patient Information

### Description

The clinician updates a patient's demographic or contact information.

### Actor

Clinician

### Trigger

Patient information has changed, or an error in previously entered data is identified.

### Preconditions

- The patient exists in the system.
- The clinician has accessed the patient's record.

### Steps

1. The clinician initiates patient information editing.
2. The system displays the current patient information.
3. The clinician modifies one or more fields.
4. The clinician confirms the changes.
5. The system updates the Patient record.
6. The system records the modification timestamp.

### Editable Fields

- Full name
- Date of birth
- Contact phone
- Contact email
- Address
- Emergency contact name
- Emergency contact phone
- Emergency contact relationship

### Fields That Cannot Be Edited

- Patient identifier (immutable)
- Registration date (immutable)

### Validations

| Field | Rule |
|-------|------|
| Full name | Required. Cannot be empty. |
| Date of birth | Required. Must be a valid date. Cannot be in the future. |
| Contact phone | Optional. If provided, must be a valid phone format. |
| Contact email | Optional. If provided, must be a valid email format. |
| Emergency contact phone | Optional. Required if emergency contact name is provided. |

### Expected Outcome

- The Patient record reflects the updated information.
- The ClinicalRecord and all contained entities are unaffected.
- No clinical event is generated.

### Alternative Flows

**AF-01: Mark Patient as Inactive**

If the patient is no longer receiving care:

1. The clinician changes the patient status to inactive.
2. The system updates the status.
3. The patient's clinical record remains fully accessible.
4. Inactive patients are distinguished in search results.

**AF-02: Reactivate Inactive Patient**

If an inactive patient returns to care:

1. The clinician changes the patient status to active.
2. The system updates the status.
3. Full documentation capabilities are restored.

### Notes

- Patient editing does not affect clinical documentation.
- The ClinicalRecord and its contents are independent of demographic updates.
- No audit trail of demographic changes is maintained in MVP.

---

## UC-02: Search Patient

### Description

The clinician locates an existing patient to access their clinical record.

### Actor

Clinician

### Trigger

The clinician needs to view or document information for a specific patient.

### Preconditions

- At least one patient exists in the system.

### Steps

1. The clinician initiates a patient search.
2. The clinician enters search criteria.
3. The system searches across patient records.
4. The system returns matching patients ordered by relevance.
5. The clinician reviews the results.
6. The clinician selects the desired patient.
7. The system provides access to the selected patient's ClinicalRecord.

### Search Criteria

The search accepts any of the following:

- Full name (partial match supported)
- Date of birth
- Patient identifier
- Any combination of the above

### Validations

| Criterion | Rule |
|-----------|------|
| Search input | At least one character required. |
| Date of birth | If provided, must be a valid date format. |

### Expected Outcome

- Zero or more patients matching the criteria are returned.
- Results include: patient identifier, full name, date of birth, status.
- Active patients appear before inactive patients.
- The clinician can access the full record of a selected patient.

### Alternative Flows

**AF-01: No Results Found**

If no patients match the search criteria:

1. The system indicates no matching patients were found.
2. The clinician may modify the search criteria or initiate patient creation.

**AF-02: Large Result Set**

If the search returns more than a manageable number of results:

1. The system presents results in a paginated or scrollable format.
2. The clinician may refine search criteria to narrow results.

### Notes

- Search includes both active and inactive patients.
- Inactive patients are visually distinguished in results.
- Search text matches against patient name fields.

---

## UC-03: Add Clinical Note

### Description

The clinician documents a patient encounter by creating a clinical note.

### Actor

Clinician

### Trigger

A clinical encounter has occurred or the clinician is documenting a past encounter.

### Preconditions

- The patient exists in the system.
- The clinician has accessed the patient's ClinicalRecord.

### Steps

1. The clinician initiates note creation for the selected patient.
2. The clinician specifies the encounter date.
3. The clinician selects the encounter type.
4. The system creates a new Note in draft status.
5. The clinician enters subjective observations.
6. The clinician enters objective findings.
7. The clinician enters the assessment.
8. The clinician enters the plan.
9. The clinician reviews the complete note.
10. The clinician chooses to finalize or save as draft.

**If saved as draft:**

11. The system saves the Note in draft status.
12. The note remains editable.
13. No clinical event is generated.

**If finalized:**

11. The system validates all required fields.
12. The system changes the Note status to finalized.
13. The system records the finalization date.
14. The system generates an Encounter clinical event.
15. The event appears on the patient's timeline.
16. The note becomes immutable.

### Encounter Types

- Initial Evaluation
- Follow-up
- Crisis Intervention
- Medication Review
- Therapy Session
- Phone Consultation
- Other

### Validations

| Field | Rule |
|-------|------|
| Encounter date | Required. Must be a valid date. Cannot be in the future. |
| Encounter type | Required. Must be a valid type from the enumerated list. |
| Subjective | Required for finalization. May be empty in draft. |
| Objective | Optional. |
| Assessment | Required for finalization. May be empty in draft. |
| Plan | Required for finalization. May be empty in draft. |

### Expected Outcome

**For Draft:**
- The Note exists in draft status within the ClinicalRecord.
- The Note does not appear on the clinical timeline.
- The Note can be edited or deleted.

**For Finalized:**
- The Note exists in finalized status within the ClinicalRecord.
- An Encounter event appears on the clinical timeline at the encounter date.
- The Note content is immutable.
- Addenda can be attached to the Note.

### Alternative Flows

**AF-01: Edit Draft Note**

If the clinician returns to edit an existing draft:

1. The clinician opens the draft note.
2. The clinician modifies any fields.
3. The clinician saves or finalizes.

**AF-02: Abandon Draft**

If the clinician decides not to complete a draft:

1. The clinician requests deletion of the draft note.
2. The system confirms the intention.
3. The draft is removed from the ClinicalRecord.
4. No trace of the draft remains.

**AF-03: Add Addendum to Finalized Note**

If the clinician needs to supplement a finalized note:

1. The clinician opens the finalized note.
2. The clinician initiates addendum creation.
3. The clinician enters the addendum content.
4. The clinician provides a reason for the addendum.
5. The system attaches the addendum to the note.
6. The addendum is immediately immutable.
7. The addendum is displayed with the parent note.

### Error Conditions

- Finalization with missing required fields: The system identifies missing fields and blocks finalization.
- Future encounter date: The system rejects the date and requests a valid past or current date.

---

## UC-04: Add or Update Medication

### Description

The clinician records a new medication or updates an existing medication's status.

### Actor

Clinician

### Trigger

The clinician has prescribed a new medication, changed a dosage, or discontinued a medication.

### Preconditions

- The patient exists in the system.
- The clinician has accessed the patient's ClinicalRecord.

### Steps — Add New Medication

1. The clinician initiates medication addition.
2. The clinician enters the drug name.
3. The clinician enters the dosage and dosage unit.
4. The clinician enters the frequency.
5. The clinician optionally enters the route of administration.
6. The clinician enters the start date.
7. The clinician enters the prescribing reason.
8. The clinician confirms the medication entry.
9. The system creates the Medication record with active status.
10. The system generates a Medication Start clinical event.
11. The event appears on the patient's timeline at the start date.

### Steps — Modify Dosage or Frequency

1. The clinician selects an existing active medication.
2. The clinician initiates a dosage or frequency change.
3. The clinician enters the new dosage, unit, or frequency.
4. The clinician enters the effective date of the change.
5. The clinician confirms the change.
6. The system discontinues the original Medication record (effective date minus one day).
7. The system creates a new Medication record with the updated values.
8. The system links the new record to the original as a continuation.
9. The system generates a Medication Change clinical event.
10. The event appears on the patient's timeline at the effective date.

### Steps — Discontinue Medication

1. The clinician selects an existing active medication.
2. The clinician initiates discontinuation.
3. The clinician enters the end date.
4. The clinician enters the discontinuation reason.
5. The clinician confirms the discontinuation.
6. The system sets the Medication status to discontinued.
7. The system records the end date and discontinuation reason.
8. The system generates a Medication Stop clinical event.
9. The event appears on the patient's timeline at the end date.

### Validations

| Field | Rule |
|-------|------|
| Drug name | Required. Cannot be empty. |
| Dosage | Required. Must be a positive value. |
| Dosage unit | Required. |
| Frequency | Required. |
| Start date | Required. Must be a valid date. Cannot be in the future for new medications. |
| Prescribing reason | Required. |
| Route of administration | Optional. |
| End date | Required for discontinuation. Must be on or after start date. |
| Discontinuation reason | Required for discontinuation. |

### Expected Outcome

**For New Medication:**
- A Medication record exists with active status.
- A Medication Start event appears on the timeline.
- The medication appears in the patient's current medication list.

**For Dosage Change:**
- The original Medication is discontinued.
- A new Medication record exists with active status.
- A Medication Change event appears on the timeline.
- The medication history shows the complete dosage progression.

**For Discontinuation:**
- The Medication status is discontinued.
- A Medication Stop event appears on the timeline.
- The medication moves from current to historical list.

### Alternative Flows

**AF-01: Backdate Medication Start**

If the clinician documents a medication that was started in the past:

1. The clinician enters the historical start date.
2. All steps proceed normally.
3. The Medication Start event appears at the historical date on the timeline.

**AF-02: Reinstate Previously Discontinued Medication**

If the clinician restarts a previously discontinued medication:

1. The clinician creates a new Medication entry (not a continuation).
2. The drug name matches a previously discontinued medication.
3. The system treats this as a separate prescribing episode.
4. A new Medication Start event is generated.

### Error Conditions

- Missing required fields: The system identifies missing fields and blocks the action.
- End date before start date: The system rejects and requests a valid end date.
- Discontinuing an already discontinued medication: The system indicates the medication is already discontinued.

---

## UC-05: Record Next Appointment

### Description

The clinician records the intended date for the patient's next encounter.

### Actor

Clinician

### Trigger

At the conclusion of an encounter, the clinician and patient agree on a follow-up timeframe.

### Preconditions

- The patient exists in the system.
- The clinician has accessed the patient's record.

### Scope Limitation

Full appointment scheduling with calendar management, reminders, and conflict detection is outside MVP scope.

This use case supports minimal recording of intended follow-up timing.

### Steps

1. The clinician initiates appointment recording for the selected patient.
2. The clinician enters the scheduled date.
3. The clinician optionally enters the scheduled time.
4. The clinician optionally enters the expected duration.
5. The clinician selects the appointment type.
6. The clinician optionally enters notes about the appointment.
7. The clinician confirms the entry.
8. The system creates the Appointment record with scheduled status.
9. The system confirms the appointment was recorded.

### Appointment Types

- Initial Evaluation
- Follow-up
- Crisis Intervention
- Medication Review
- Therapy Session
- Phone Consultation
- Other

### Validations

| Field | Rule |
|-------|------|
| Scheduled date | Required. Must be a valid date. Should be in the future or today. |
| Scheduled time | Optional. If provided, must be a valid time format. |
| Duration | Optional. If provided, must be a positive value. |
| Appointment type | Required. |

### Expected Outcome

- An Appointment record exists for the patient.
- The appointment status is scheduled.
- The appointment is visible when viewing the patient record.
- No clinical event is generated.

### Alternative Flows

**AF-01: Update Existing Appointment**

If an appointment already exists for the patient:

1. The clinician selects the existing appointment.
2. The clinician modifies the date, time, or type.
3. The system updates the appointment record.

**AF-02: Cancel Appointment**

If the appointment is no longer needed:

1. The clinician selects the existing appointment.
2. The clinician changes the status to cancelled.
3. The appointment remains in the record with cancelled status.

**AF-03: Mark Appointment Completed**

When the encounter occurs:

1. The clinician may mark the appointment as completed.
2. This is an administrative action separate from clinical note creation.
3. No automatic linking between appointment and note occurs in MVP.

**AF-04: Mark Appointment as No-Show**

If the patient does not attend:

1. The clinician marks the appointment as no-show.
2. The appointment remains in the record with no-show status.
3. No clinical event is generated.

### Notes

- Appointments serve as a simple reminder mechanism.
- The MVP does not include calendar views, scheduling conflicts, or automated reminders.
- Appointment history is retained but not prominently featured.

---

## UC-06: View Full Patient Timeline

### Description

The clinician reviews the complete chronological history of a patient's psychiatric care.

### Actor

Clinician

### Trigger

The clinician needs to understand the patient's treatment history, review past events, or prepare for an encounter.

### Preconditions

- The patient exists in the system.
- The clinician has accessed the patient's ClinicalRecord.

### Steps

1. The clinician requests the timeline view for the selected patient.
2. The system retrieves all clinical events for the patient.
3. The system orders events according to temporal ordering rules.
4. The system presents the timeline in reverse chronological order (most recent first).
5. The clinician views the event list.
6. For each event, the clinician sees: event date, event type, title, brief description.
7. The clinician may select any event to view full details.
8. The clinician may navigate to earlier or later periods.
9. The clinician may switch to forward chronological order.
10. The clinician may filter by event type.
11. The clinician may search within the timeline.

### Event Detail Navigation

When the clinician selects an event:

**For Encounter Events:**
- The system displays the full clinical note.
- All addenda are displayed following the note.
- The note is read-only.

**For Medication Events:**
- The system displays the medication details.
- For change events, both before and after values are shown.
- For stop events, the discontinuation reason is displayed.

**For Other Events:**
- The system displays the event title and full description.
- The recorded date is shown alongside the event date.

### Timeline Ordering

Events are presented according to the temporal ordering rules defined in `03_timeline.md`:

1. Primary: Event occurrence date (clinical date)
2. Secondary: Recorded date (documentation date)
3. Tertiary: Event type priority

### Filter Options

The clinician may filter the timeline to show only:

- All events (default)
- Encounter events only
- Medication events only
- Hospitalization events only
- Life events only
- History Update events only
- Events within a date range

### Search Within Timeline

The clinician may search for specific content:

1. The clinician enters a search term.
2. The system searches across event titles, descriptions, and linked note content.
3. Matching events are highlighted or filtered.
4. The clinician can navigate directly to matching events.

### Validations

None. This is a read-only operation.

### Expected Outcome

- The clinician sees the complete history of clinical events.
- Events are correctly ordered by occurrence date.
- Navigation to full details is available for each event.
- The timeline reflects all finalized documentation.
- Draft notes do not appear on the timeline.
- Backdated events appear at their clinical occurrence date.

### Alternative Flows

**AF-01: Empty Timeline**

If the patient has no clinical events:

1. The system indicates the timeline is empty.
2. The clinician may initiate documentation (create note, add medication, etc.).

**AF-02: Navigate to Specific Date**

If the clinician needs to find events from a specific period:

1. The clinician specifies a target date or date range.
2. The system scrolls or filters to that period.
3. Events from the specified period are displayed.

**AF-03: View Psychiatric History from Timeline**

If the clinician needs to review background information:

1. The clinician requests the psychiatric history.
2. The system displays the current version.
3. The clinician may view previous versions if they exist.
4. History Update events on the timeline link to the corresponding version.

### Notes

- The timeline is the primary navigation structure for understanding patient history.
- Performance should remain acceptable even for patients with extensive histories.
- The timeline displays events, not raw entities; the event layer provides a consistent view.

---

## UC-07: Record Manual Clinical Event

### Description

The clinician documents a clinically significant event that is not captured by other entities.

### Actor

Clinician

### Trigger

A significant occurrence (hospitalization, life event, or other milestone) must be recorded on the patient's timeline.

### Preconditions

- The patient exists in the system.
- The clinician has accessed the patient's ClinicalRecord.

### Steps

1. The clinician initiates manual event creation for the selected patient.
2. The clinician selects the event type (Hospitalization, Life Event, or Other).
3. The clinician enters the event date.
4. The clinician enters the event title.
5. The clinician enters the event description.
6. The clinician confirms the entry.
7. The system creates the ClinicalEvent.
8. The event appears on the patient's timeline at the specified date.

### Event Types for Manual Entry

- Hospitalization
- Life Event
- Other

### Validations

| Field | Rule |
|-------|------|
| Event type | Required. Must be Hospitalization, Life Event, or Other. |
| Event date | Required. Must be a valid date. Cannot be in the future. |
| Title | Required. Cannot be empty. |
| Description | Optional. |

### Expected Outcome

- A ClinicalEvent exists in the ClinicalRecord.
- The event appears on the timeline at the specified event date.
- The event is immutable once created.

### Notes

- Manual events are used for occurrences outside the clinician's direct care (e.g., external hospitalizations).
- Encounter, Medication, and History Update events are generated by their respective entities and should not be entered manually.

---

## UC-08: Update Psychiatric History

### Description

The clinician updates the patient's psychiatric history to reflect new or revised background information.

### Actor

Clinician

### Trigger

New historical information is disclosed, or existing information requires correction or expansion.

### Preconditions

- The patient exists in the system.
- The clinician has accessed the patient's ClinicalRecord.
- At least one PsychiatricHistory version exists (created at patient registration).

### Steps

1. The clinician requests to update the psychiatric history.
2. The system displays the current version of the psychiatric history.
3. The clinician modifies one or more sections.
4. The clinician reviews the updated content.
5. The clinician confirms the update.
6. The system creates a new PsychiatricHistory version with incremented version number.
7. The system marks the previous version with a superseded date.
8. The system generates a History Update clinical event.
9. The event appears on the patient's timeline.

### Sections Available for Update

- Chief complaint
- History of present illness
- Past psychiatric history
- Past hospitalizations
- Suicide attempt history
- Substance use history
- Family psychiatric history
- Medical history
- Surgical history
- Allergies
- Social history
- Developmental history

### Validations

| Field | Rule |
|-------|------|
| Content | At least one section must contain content for the update to proceed. |

### Expected Outcome

- A new PsychiatricHistory version exists with the updated content.
- The previous version is preserved and accessible.
- A History Update event appears on the clinical timeline.
- The new version is marked as current.

### Alternative Flows

**AF-01: View Previous Versions**

If the clinician needs to review historical versions:

1. The clinician requests version history.
2. The system displays all versions with their creation dates.
3. The clinician may select any version to view its content.
4. Previous versions are read-only.

### Notes

- The initial psychiatric history (version 1) created at patient registration does not generate a History Update event.
- Only subsequent versions generate History Update events.
- All versions are retained indefinitely for historical reference.

---

## Use Case Summary

| ID | Name | Generates Events | Modifies Records |
|----|------|------------------|------------------|
| UC-01 | Create Patient | No | Creates Patient, ClinicalRecord, PsychiatricHistory |
| UC-01B | Edit Patient Information | No | Modifies Patient |
| UC-02 | Search Patient | No | None (read-only) |
| UC-03 | Add Clinical Note | Yes (on finalization) | Creates Note, may create Addendum |
| UC-04 | Add or Update Medication | Yes | Creates or modifies Medication |
| UC-05 | Record Next Appointment | No | Creates or modifies Appointment |
| UC-06 | View Full Patient Timeline | No | None (read-only) |
| UC-07 | Record Manual Clinical Event | Yes | Creates ClinicalEvent |
| UC-08 | Update Psychiatric History | Yes | Creates new PsychiatricHistory version |

---

*Document Version: 1.0*  
*Status: Draft*  
*Sources: 01_specs.md, 02_domain.md, 03_timeline.md*



---

## 05_edge_cases.md

# Psychiatric Medical Records System — Edge Cases

## Overview

This document identifies edge cases, consistency risks, implicit rules, and ambiguous scenarios that require explicit decisions.

These cases emerge from the interaction between clinical reality and the system's domain model.

No solutions or technical proposals are presented.

---

## 1. Clinical Edge Cases

### 1.1 Same-Day Multiple Encounters

A patient may have more than one clinical encounter on the same day.

Examples:
- Morning therapy session followed by afternoon medication review
- Crisis intervention followed by a scheduled follow-up
- Phone consultation in the morning and in-person visit later

Questions:
- How are multiple same-day encounters ordered when recorded date is also identical?
- Do same-day encounters appear as separate events or grouped?
- Can the same encounter type occur twice on the same day?

### 1.2 Encounter Date Mismatch with Documentation

The clinician documents an encounter days or weeks after it occurred.

Examples:
- Session on Friday, note written on Monday
- Crisis intervention documented the following week
- Backlog of undocumented sessions from vacation absence

Questions:
- What is the maximum acceptable gap between encounter date and documentation date?
- How does delayed documentation affect timeline ordering among same-day events?
- Should there be visibility into documentation delays?

### 1.3 Encounters Without Clinical Content

A scheduled appointment results in minimal or no clinical interaction.

Examples:
- Patient arrives but leaves immediately
- Brief check-in with no substantive content
- Appointment interrupted by emergency

Questions:
- Must every encounter produce a finalized note?
- What constitutes the minimum content for a valid clinical note?
- Can an encounter event exist without associated documentation?

### 1.4 Patient Provides Contradictory History

New information from the patient contradicts previously documented history.

Examples:
- Patient denies previously reported suicide attempt
- Family history revised to exclude reported conditions
- Substance use history significantly altered

Questions:
- How is the contradiction captured without altering the original record?
- Does the psychiatric history versioning adequately represent disputed information?
- How is clinical judgment about accuracy preserved?

### 1.5 Clinician Error in Finalized Note

The clinician discovers a factual error after note finalization.

Examples:
- Wrong medication dosage recorded
- Incorrect date of a reported event
- Misattributed symptom to wrong family member

Questions:
- What types of errors warrant an addendum versus annotation?
- How is the severity of errors distinguished?
- Can an addendum correct an error in a previous addendum?

### 1.6 Patient Identity Confusion

Information is documented for the wrong patient.

Examples:
- Note finalized under incorrect patient record
- Medication entry added to wrong patient
- Clinical event attributed to wrong patient

Questions:
- How is cross-patient documentation error identified and handled?
- What happens to the erroneous finalized note in the wrong record?
- How is the correct patient's record amended?

---

## 2. Medication Edge Cases

### 2.1 Overlapping Medications with Same Drug

Multiple active entries exist for the same medication.

Examples:
- Dosage change recorded as new medication before previous is discontinued
- Split dosing recorded as separate entries
- Brand and generic recorded as separate medications

Questions:
- Can the same drug name appear in multiple active medication entries?
- How are legitimate split doses distinguished from data entry errors?
- What constitutes "same medication" when formulations differ?

### 2.2 Medication Start and Stop on Same Day

A medication is initiated and discontinued within the same day.

Examples:
- Severe adverse reaction requiring immediate discontinuation
- Error in prescribing corrected same day
- Patient refuses medication after initial dose

Questions:
- How does the timeline represent start and stop events with identical dates?
- Is a zero-duration medication trial clinically meaningful?
- Does this create ordering ambiguity in the timeline?

### 2.3 Retroactive Medication Documentation

Medications are documented long after they were started or stopped.

Examples:
- Patient reveals medication started by another provider months ago
- Clinician documents historical medication trials from prior treatment
- Family reports patient discontinued medication weeks ago without telling clinician

Questions:
- How far in the past can medication dates be set?
- How is externally prescribed medication distinguished from clinician-prescribed?
- What is the relationship between documented date and clinical date for medications?

### 2.4 Medication with Unknown Start Date

Historical medication has no precise start date available.

Examples:
- Patient reports taking medication "for years"
- Prior records unavailable with exact dates
- Medication started before patient's memory of timeline

Questions:
- Can a medication exist without a start date?
- How is approximate timing represented?
- How does an undated medication appear on the timeline?

### 2.5 Medication Dosage Between Changes

The patient independently adjusts dosage between documented changes.

Examples:
- Patient skips doses without reporting
- Patient doubles dosage for acute symptoms
- Patient splits pills differently than prescribed

Questions:
- How is deviation from prescribed dosage captured?
- Does self-adjustment constitute a medication change event?
- What is the relationship between prescribed and actual dosage?

### 2.6 Discontinuation Without Reason

A medication is stopped but the reason is unknown or unstated.

Examples:
- Patient simply stops taking medication
- Prior provider discontinued without documented reason
- Medication stopped during lost-to-follow-up period

Questions:
- Is discontinuation reason strictly required?
- How is "unknown reason" distinguished from "no reason provided"?
- Can the reason be added later via amendment?

---

## 3. Timeline Consistency Risks

### 3.1 Events Documented Out of Chronological Order

Events are recorded in a sequence that does not match their clinical occurrence.

Examples:
- Last week's encounter documented after today's encounter
- Hospitalization from last month entered after subsequent follow-ups
- Medication started last week documented after today's dosage change

Questions:
- Does documentation order affect anything beyond secondary ordering?
- How is timeline integrity verified when events are entered non-sequentially?
- Can backdated entries create logical inconsistencies?

### 3.2 Events with Identical Timestamps

Multiple events share the same occurrence date, recorded date, and event type.

Examples:
- Two medications started at the same moment
- Two life events reported for the same date
- Multiple manual events created simultaneously

Questions:
- What is the ordering when all three ordering principles produce identical results?
- Is this scenario possible in practice?
- Should there be a quaternary ordering principle?

### 3.3 Gap Between Medication Stop and Next Start

A medication is discontinued and the same medication restarted later.

Examples:
- Patient stops medication, restarts after relapse
- Seasonal medication with annual gaps
- Trial interrupted and resumed after washout period

Questions:
- How is the gap period represented on the timeline?
- Are the two medication periods linked or independent?
- How is the restart distinguished from a new trial?

### 3.4 Clinical Events Referencing Non-Existent Entities

An event references a source entity that no longer exists or never existed.

Examples:
- Medication event with no corresponding medication entry
- Encounter event with orphaned or deleted draft note
- History update event with missing version

Questions:
- Can events exist without valid source entity references?
- What happens to events if their source becomes corrupted?
- How is referential integrity maintained over time?

### 3.5 Draft Notes with Past Encounter Dates

A draft note has an encounter date significantly in the past.

Examples:
- Draft created months ago, never finalized
- Draft with encounter date predating system adoption
- Multiple drafts for the same past encounter date

Questions:
- How long can a draft remain open?
- Can multiple drafts exist for the same encounter date?
- What happens to drafts for patients marked inactive?

### 3.6 Psychiatric History Version Date Anomalies

History versions have creation dates that don't align with clinical reality.

Examples:
- Version created with backdated "effective" date
- Multiple versions created on the same day
- Version superseded before it was clinically used

Questions:
- Is the version creation date editable?
- Can a version be created with a past effective date?
- How is the "current" version determined when dates are ambiguous?

---

## 4. Implicit Rules Requiring Enforcement

### 4.1 Note Finalization Permanence

Once a note is finalized, it cannot transition back to draft.

Implications:
- Premature finalization cannot be undone
- Large errors require extensive addenda rather than correction
- No mechanism for "unfinalize" even with proper authorization

### 4.2 Event Deletion Prohibition

Clinical events cannot be removed from the timeline.

Implications:
- Erroneous events remain permanently visible
- Privacy requests cannot remove specific events
- No mechanism for legal hold or litigation support exceptions

### 4.3 Patient Deletion Prohibition

Patients can only be deactivated, not deleted.

Implications:
- Data remains indefinitely even after therapeutic relationship ends
- No mechanism for data destruction requests
- Storage grows without bound

### 4.4 Medication Versioning Through Discontinuation

Dosage changes require discontinuing the original and creating a new entry.

Implications:
- Simple dosage adjustments create discontinuation records
- Continuous medication appears fragmented
- The link between versions must be explicitly maintained

### 4.5 Addenda Cannot Reference Other Addenda

An addendum attaches only to the original finalized note.

Implications:
- Corrections to addenda require additional addenda
- No threading or conversation structure in amendments
- Addendum chains can become difficult to follow

### 4.6 Single Active Psychiatric History Version

Only one version of the psychiatric history is considered current.

Implications:
- No mechanism for partial updates to specific sections
- Complete version required even for minor corrections
- Large history documents create versioning overhead

### 4.7 Event Immutability Includes Metadata

Event title and description are fixed after creation.

Implications:
- Typos in event titles persist permanently
- No mechanism for improving event descriptions
- Summary text quality affects long-term usability

---

## 5. Scenarios Requiring Explicit Decisions

### 5.1 Patient Death

A patient in the registry dies.

Questions:
- Is there a status beyond inactive?
- Can encounters be documented posthumously for final session?
- What is the appropriate final state of the clinical record?
- How is date of death recorded if at all?

### 5.2 Patient Transfers Care

The patient leaves to receive care from another provider.

Questions:
- Is this captured as an event type?
- Does transfer affect patient active/inactive status?
- What if the patient returns months or years later?
- Is there a distinction between temporary and permanent transfer?

### 5.3 Prolonged Patient Inactivity

A patient has no encounters for an extended period.

Questions:
- What constitutes "inactive" from a clinical standpoint?
- Should there be automatic status changes based on time?
- How is re-engagement after a gap handled?
- Is a gap clinically significant enough for an event?

### 5.4 Clinician Documentation Outside Session

The clinician records clinical observations outside of a formal encounter.

Examples:
- Communication from family members
- Review of external records
- Consultation with other providers

Questions:
- What encounter type covers non-session documentation?
- Is an encounter required for every piece of clinical documentation?
- How is informal clinical information captured?

### 5.5 Partial Information from External Sources

Clinical information arrives from outside the practice with incomplete details.

Examples:
- Hospital discharge summary without medication details
- Prior provider notes with ambiguous dates
- Lab results from external facility

Questions:
- How is external information attributed?
- What is the evidentiary status of unverified external data?
- How is uncertainty or incompleteness represented?

### 5.6 Legal or Regulatory Hold

A patient's records are subject to legal action or regulatory review.

Questions:
- Does this affect record editability beyond normal rules?
- Is there a need for snapshot or export functionality?
- How is compliance demonstrated given immutability already exists?

### 5.7 Retroactive Data Entry for Historical Patient

A patient's entire prior treatment history is entered into the system.

Examples:
- Migrating from paper records
- Consolidating records from prior electronic system
- Documenting years of history at intake

Questions:
- How are bulk historical entries distinguished from ongoing documentation?
- What is the recorded date for retrospectively entered information?
- How far back can clinical events be dated?
- Should historical entries be visually distinguished?

### 5.8 Patient Requests Record Amendment

A patient asks for their record to be amended.

Questions:
- What rights does the patient have to request changes?
- How is a patient dispute noted without altering the record?
- What is the relationship between clinical judgment and patient requests?

### 5.9 Concurrent Note Drafts

Multiple draft notes exist for the same patient simultaneously.

Examples:
- Different encounter types being documented in parallel
- Previous session's draft still open when new session occurs
- Clinician forgot about existing draft

Questions:
- Is there a limit to concurrent drafts per patient?
- How are multiple drafts presented to the clinician?
- Can drafts have conflicting or overlapping encounter dates?

### 5.10 System Clock Anomalies

The system clock is incorrect, producing inaccurate recorded dates.

Examples:
- Clock set to wrong timezone
- Clock significantly behind or ahead
- Manual clock adjustment after documentation

Questions:
- Is recorded date trusted without validation?
- How is temporal integrity maintained if system time is unreliable?
- Can recorded dates be corrected after the fact?

---

## 6. Boundary Conditions

### 6.1 First Patient in Empty System

The system contains no patients.

Questions:
- What is the initial identifier assigned?
- How is the empty state presented?
- What is the expected first action?

### 6.2 Patient with No Clinical Events

A patient exists with no finalized notes, medications, or events.

Questions:
- Is a clinical record with zero events valid?
- How is an empty timeline presented?
- What is the minimum expected content after registration?

### 6.3 Maximum Volume Thresholds

The system accumulates significant data over years.

Questions:
- Is there a practical limit to events per patient?
- How does timeline navigation scale with thousands of events?
- Is there a patient count ceiling?

### 6.4 Extremely Long Note Content

A note contains extensive narrative content.

Questions:
- Is there a maximum length for note sections?
- How is very long content displayed on the timeline?
- Does content length affect performance?

### 6.5 Special Characters in Clinical Content

Clinical documentation includes unusual characters.

Examples:
- Non-English patient names
- Medical symbols or notation
- Copy-pasted content from other sources

Questions:
- What character encodings are supported?
- Are there prohibited characters?
- How is content sanitization handled?

---

## 7. Temporal Edge Cases

### 7.1 Encounter Date in the Future

A note is created with an encounter date that has not yet occurred.

Questions:
- Is this prohibited at the domain level?
- What if the date becomes past before finalization?
- Can a draft exist with a future encounter date?

### 7.2 Medication Start Date in the Future

A medication entry has a start date that has not yet occurred.

Questions:
- Does this represent a prescription intention or actual start?
- Should planned medications be distinguished from active?
- When does the medication appear on the timeline?

**Resolution:** Future medication start dates are prohibited per UC-04 validation rules. Planned future prescriptions are documented in the encounter note's Plan section, not as medication entries. A medication entry is created when the prescription becomes active.

### 7.3 Events at Exact Midnight

Events occur exactly at the boundary between dates.

Questions:
- How is midnight assigned—end of previous day or start of next?
- What timezone applies to date interpretation?
- Are times stored or only dates?

### 7.4 Date of Birth Edge Cases

Patient date of birth has special characteristics.

Examples:
- Born on leap day (February 29)
- Future date of birth (data entry error)
- Distant past date (elderly patient or historical record)

Questions:
- Is date of birth validated against reasonable ranges?
- How is age calculated for leap day births?
- Is there a minimum or maximum age?

---

*Document Version: 1.0*  
*Status: Draft*  
*Sources: 01_specs.md, 02_domain.md, 03_timeline.md*


---

## 05_inconsistency_resolution.md

# Psychiatric Medical Records System — Inconsistency Resolution Log

## Overview

This document records inconsistencies identified across specification documents and their resolutions.

All resolutions prioritize MVP simplicity, clinical correctness, and timeline consistency.

No new features or scope expansion has been introduced.

---

## Resolved Inconsistencies

### IR-01: Appointment Scope Conflict

**Conflict:** `01_specs.md` §5.5 states appointment scheduling is out of scope, but `02_domain.md` defines an Appointment entity and `04_use_cases.md` includes UC-05 for recording appointments.

**Resolution:** Clarify that *full appointment scheduling* (calendars, reminders, conflict detection) is out of scope, but *minimal appointment recording* for next encounter tracking is in scope. This aligns with UC-05's stated scope limitation.

**Files Updated:**
- `01_specs.md` — Revised §5.5 to distinguish scheduling from recording

**Rationale:** The domain model and use case already limit appointments to minimal recording. The specs needed clarification, not the other documents.

---

### IR-02: Event Type Enumeration Mismatch

**Conflict:** `02_domain.md` lists event types without "History Update" and uses "Significant Life Event". `03_timeline.md` uses "Life Event" and includes "History Update" in ordering.

**Resolution:** Standardize event types across both documents: Encounter, Medication Start, Medication Change, Medication Stop, Hospitalization, Life Event, History Update, Other.

**Files Updated:**
- `02_domain.md` — Updated ClinicalEvent event types list

**Rationale:** History Update events are generated per §03_timeline.md and must be in the canonical type list.

---

### IR-03: Medication Fields Missing from Specs

**Conflict:** `02_domain.md` includes "Route of administration" and "Dosage unit" for Medication entity, but `01_specs.md` §3.4 does not list them.

**Resolution:** Add these fields to `01_specs.md` §3.4 for consistency.

**Files Updated:**
- `01_specs.md` — Added route and dosage unit to §3.4

**Rationale:** These are standard medication documentation fields, not new features.

---

### IR-04: PsychiatricHistory Cardinality Ambiguity

**Conflict:** `02_domain.md` states ClinicalRecord "contains exactly one PsychiatricHistory" but also describes versioning with multiple retained versions.

**Resolution:** Clarify that ClinicalRecord has exactly one *current* PsychiatricHistory, with previous versions retained for history.

**Files Updated:**
- `02_domain.md` — Clarified ClinicalRecord relationship wording

**Rationale:** The versioning model was already defined; the relationship statement needed precision.

---

### IR-05: Empty Initial Psychiatric History Definition

**Conflict:** `04_use_cases.md` UC-01 creates an "initial empty PsychiatricHistory" but `02_domain.md` lists many content fields.

**Resolution:** Clarify that "empty" means all content fields are initially null/blank; they are populated during or after the initial evaluation encounter.

**Files Updated:**
- `04_use_cases.md` — Added clarification note to UC-01

**Rationale:** Fields are optional at creation; the initial version serves as a placeholder until clinical intake.

---

### IR-06: Medication Event Generation Timing

**Conflict:** Notes have explicit draft/finalized workflow, but Medications appear to generate events immediately with no draft state.

**Resolution:** Explicitly state that Medication entries are finalized immediately upon creation (no draft state) and events are generated at that moment.

**Files Updated:**
- `02_domain.md` — Added business rule clarifying immediate finalization

**Rationale:** Medications represent prescribing actions already taken; drafting is not clinically appropriate.

---

### IR-07: Future Date Validation Rule Confirmation

**Conflict:** `04_use_cases.md` states future dates are prohibited for medications, but `05_edge_cases.md` §7.2 treats this as an open question.

**Resolution:** Mark §7.2 as resolved: future medication start dates are prohibited; planned prescriptions are documented in encounter notes.

**Files Updated:**
- `05_edge_cases.md` — Added resolution note to §7.2

**Rationale:** The validation rule was already defined; the edge case needed to reference it.

---

### IR-08: Manual Event Entry Missing Use Case

**Conflict:** `03_timeline.md` describes manual event entry for hospitalizations and life events, but no use case exists in `04_use_cases.md`.

**Resolution:** Add UC-07 for manual clinical event entry.

**Files Updated:**
- `04_use_cases.md` — Added UC-07

**Rationale:** The capability was defined in timeline doc; a use case is needed for completeness.

---

### IR-09: Cross-Patient Search Scope Clarification

**Conflict:** `01_specs.md` §3.6 mentions "search across all patient records" but use cases only show patient lookup (UC-02) and within-patient timeline search (UC-06).

**Resolution:** Clarify that search locates patients by demographics, and content search operates within a selected patient's record.

**Files Updated:**
- `01_specs.md` — Clarified §3.6 wording

**Rationale:** Cross-patient clinical content search was never intended; wording was ambiguous.

---

### IR-10: Encounter Type vs Appointment Type Alignment

**Conflict:** Appointment types in `04_use_cases.md` UC-05 differ from Note encounter types in `02_domain.md`.

**Resolution:** Align appointment types to match encounter types (add Crisis Intervention, Phone Consultation to appointment types).

**Files Updated:**
- `04_use_cases.md` — Updated UC-05 appointment types list

**Rationale:** Appointment should use the same type vocabulary as the encounter it anticipates.

---

### IR-11: Draft Deletion Exception to Immutability

**Conflict:** `03_timeline.md` describes immutability but draft deletion is an exception not stated alongside the principle.

**Resolution:** Add explicit note that draft notes (pre-finalization) are the exception and may be deleted.

**Files Updated:**
- `03_timeline.md` — Added clarification to §4 immutability section

**Rationale:** The exception existed but wasn't co-located with the principle.

---

### IR-12: ClinicalEvent Entity References Incomplete

**Conflict:** `02_domain.md` ClinicalEvent only defines references to Note and Medication, not Hospitalization or Life Event entities.

**Resolution:** Clarify that some event types (Hospitalization, Life Event, History Update) are standalone events without a separate source entity reference.

**Files Updated:**
- `02_domain.md` — Added clarification to ClinicalEvent relationships

**Rationale:** These events are entered directly; they don't derive from other entities.

---

### IR-13: Addendum Reason Field Naming

**Conflict:** `02_domain.md` uses "Reason for addendum" while `03_timeline.md` uses "stated reason".

**Resolution:** Standardize to "Reason" as the field name.

**Files Updated:**
- `02_domain.md` — Renamed to "Reason"
- `03_timeline.md` — Updated reference to match

**Rationale:** Minor terminology alignment for consistency.

---

### IR-14: Appointment Entity Wording Error

**Conflict:** `02_domain.md` states Appointment "exists only to record the intended date of past encounters" — should be "future encounters".

**Resolution:** Correct "past" to "future".

**Files Updated:**
- `02_domain.md` — Fixed wording in Appointment functional description

**Rationale:** Appointments are for scheduling future visits, not documenting past ones.

---

### IR-15: Hospitalization Event Atomicity Contradiction

**Conflict:** `03_timeline.md` states hospitalizations generate "separate events for admission and discharge" but `02_domain.md` lists "Hospitalization" as a single event type.

**Resolution:** Hospitalizations are recorded as a single event capturing the episode. The atomicity example was misleading.

**Files Updated:**
- `03_timeline.md` — Revised atomicity example

**Rationale:** MVP simplicity; tracking admission/discharge as separate events adds complexity without clear clinical benefit.

---

### IR-16: Route of Administration Required vs Optional

**Conflict:** `04_use_cases.md` UC-04 implies route is required (step 5), but `02_domain.md` business rules don't list it as required.

**Resolution:** Route of administration is optional. Updated UC-04 step and validation table.

**Files Updated:**
- `02_domain.md` — Added explicit rule that route is optional
- `04_use_cases.md` — Changed step 5 to "optionally enters" and added to validation table

**Rationale:** Many psychiatric medications have a default oral route; requiring explicit entry adds friction without clinical value.

---

### IR-17: Dosage Unit Missing from Domain Business Rules

**Conflict:** `04_use_cases.md` UC-04 validation says dosage unit is required, but `02_domain.md` business rules don't include it.

**Resolution:** Add dosage unit to the required fields in domain model.

**Files Updated:**
- `02_domain.md` — Added dosage unit to required medication fields

**Rationale:** Dosage without unit is ambiguous (e.g., "50" could mean 50mg or 50mcg).

---

### IR-18: Missing Use Case for Psychiatric History Updates

**Conflict:** Domain model describes PsychiatricHistory versioning and `03_timeline.md` describes History Update events, but no use case defines this workflow.

**Resolution:** Add UC-08 for updating psychiatric history.

**Files Updated:**
- `04_use_cases.md` — Added UC-08 and updated summary table

**Rationale:** The capability was referenced in domain and timeline docs; a use case is needed for completeness.

---

### IR-19: History Update Filter Missing from Timeline View

**Conflict:** `04_use_cases.md` UC-06 filter options list all event types except History Update.

**Resolution:** Add History Update to filter options.

**Files Updated:**
- `04_use_cases.md` — Added "History Update events only" to filter list

**Rationale:** Filter options should match the complete event type enumeration.

---

### IR-20: Hospitalization Event Examples Contradicted Single-Event Statement

**Conflict:** `03_timeline.md` line 47 states hospitalizations are recorded as "a single event" but lines 79-81 described "admissions and discharges" with examples suggesting separate events.

**Resolution:** Revised the Hospitalization Events section to reinforce single-event model with clearer examples.

**Files Updated:**
- `03_timeline.md` — Updated Hospitalization Events description and examples

**Rationale:** Consistency with atomicity statement; MVP simplicity favors one event per hospitalization episode.

---

### IR-21: Route of Administration Optional Status Not Clear in Specs

**Conflict:** `01_specs.md` §3.4 listed route of administration without clarifying it's optional, while `02_domain.md` and `04_use_cases.md` explicitly state it's optional.

**Resolution:** Added "Route of administration is optional" to `01_specs.md` §3.4.

**Files Updated:**
- `01_specs.md` — Added optional clarification

**Rationale:** Alignment with domain model and use case validations.

---

### IR-22: Psychiatric History Fields List Shorter in Specs

**Conflict:** `01_specs.md` §3.3 listed 6 fields but `02_domain.md` defines 12+ fields for PsychiatricHistory.

**Resolution:** Updated specs to reference "additional clinical background sections as detailed in the domain model."

**Files Updated:**
- `01_specs.md` — Broadened §3.3 field description

**Rationale:** Specs provide overview; domain model provides complete detail.

---

### IR-23: Missing Use Case for Editing Patient Demographics

**Conflict:** `01_specs.md` §3.1 states patients can be "edited" but no use case documented this capability.

**Resolution:** Added UC-01B for editing patient information, including status changes (active/inactive).

**Files Updated:**
- `04_use_cases.md` — Added UC-01B and updated summary table

**Rationale:** Capability was in specs; use case needed for completeness.

---

## Verification Checklist

- [x] All documents are logically consistent
- [x] Clinical timeline concept remains coherent
- [x] MVP scope has not expanded
- [x] No new features introduced (UC-01B documents existing capability)
- [x] No new domain entities added
- [x] Event types match across all documents
- [x] Medication fields match across all documents
- [x] All specs capabilities have corresponding use cases

---

*Document Version: 1.2*
*Status: Final*
*Updated: Third resolution pass (complete cross-reference analysis)*



---

## 06_dev_checklist.md

# Psychiatric Medical Records System — Development Checklist

## Overview

This checklist translates the MVP specifications into implementation-oriented guidance for AI agents.

All items are derived from the specification documents. No new features or scope expansion.

---

## 1. Logical Components to Implement

### 1.1 Core Entities

- [ ] **Patient** — Individual receiving psychiatric care
- [ ] **ClinicalRecord** — Longitudinal container for all patient clinical data
- [ ] **PsychiatricHistory** — Versioned background information with 12+ content fields
- [ ] **Note** — Encounter documentation with draft/finalized states
- [ ] **Addendum** — Immutable supplement to finalized notes
- [ ] **Medication** — Pharmacological record with lifecycle tracking
- [ ] **ClinicalEvent** — Timeline entry representing significant occurrences
- [ ] **Appointment** — Minimal future encounter placeholder

### 1.2 Core Behaviors

- [ ] Patient registration with automatic ClinicalRecord and empty PsychiatricHistory creation
- [ ] Patient search by name, date of birth, or identifier
- [ ] Patient demographic editing (excluding identifier and registration date)
- [ ] Patient status toggling (active/inactive)
- [ ] Note creation in draft status
- [ ] Note editing while in draft status
- [ ] Note finalization with field validation
- [ ] Draft note deletion
- [ ] Addendum attachment to finalized notes
- [ ] Medication creation with immediate event generation
- [ ] Medication dosage change via discontinue-and-create pattern
- [ ] Medication discontinuation with reason
- [ ] PsychiatricHistory versioning on update
- [ ] Manual clinical event creation (Hospitalization, Life Event, Other)
- [ ] Appointment recording with status management
- [ ] Timeline view with chronological ordering
- [ ] Timeline filtering by event type and date range
- [ ] Within-patient content search

### 1.3 Event Generation Rules

- [ ] Note finalization generates exactly one Encounter event
- [ ] New Medication generates Medication Start event
- [ ] Medication dosage/frequency change generates Medication Change event
- [ ] Medication discontinuation generates Medication Stop event
- [ ] PsychiatricHistory update (version 2+) generates History Update event
- [ ] Initial PsychiatricHistory (version 1) generates no event
- [ ] Patient registration generates no event
- [ ] Appointment creation generates no event
- [ ] Addendum creation generates no event

---

## 2. Dependency Order Between Components

### Phase 1: Foundation

1. [ ] Patient entity
2. [ ] ClinicalRecord entity (auto-created with Patient)
3. [ ] PsychiatricHistory entity (version 1 auto-created with ClinicalRecord)

### Phase 2: Timeline Infrastructure

4. [ ] ClinicalEvent entity
5. [ ] Temporal ordering logic (event date → recorded date → event type)

### Phase 3: Clinical Documentation

6. [ ] Note entity with draft/finalized states
7. [ ] Note finalization → ClinicalEvent generation
8. [ ] Addendum entity

### Phase 4: Medication Management

9. [ ] Medication entity
10. [ ] Medication → ClinicalEvent generation (Start, Change, Stop)
11. [ ] Medication versioning via discontinue-and-link pattern

### Phase 5: History Management

12. [ ] PsychiatricHistory versioning logic
13. [ ] PsychiatricHistory update → ClinicalEvent generation

### Phase 6: Supporting Features

14. [ ] Manual ClinicalEvent creation
15. [ ] Appointment entity
16. [ ] Patient search
17. [ ] Timeline search and filtering

---

## 3. Data Consistency and Integrity Risks

### 3.1 Referential Integrity

- [ ] ClinicalRecord must always reference exactly one Patient
- [ ] Patient deletion is prohibited; only status change to inactive allowed
- [ ] ClinicalEvent with entity reference must point to valid source (Note, Medication, or PsychiatricHistory version)
- [ ] Addendum must reference a finalized Note (never a draft)
- [ ] Medication change must link new entry to discontinued predecessor

### 3.2 State Transition Integrity

- [ ] Note: draft → finalized is one-way (no reversal)
- [ ] Finalized Note content is immutable
- [ ] ClinicalEvent is immutable once created
- [ ] Addendum is immutable once created
- [ ] Medication is immutable once discontinued
- [ ] PsychiatricHistory versions are immutable once superseded

### 3.3 Temporal Integrity

- [ ] Encounter date cannot be in the future
- [ ] Medication start date cannot be in the future
- [ ] Medication end date must be on or after start date
- [ ] Patient date of birth cannot be in the future
- [ ] Event occurrence date determines timeline position (not recorded date)
- [ ] Backdated entries must integrate correctly with existing timeline

### 3.4 Cardinality Integrity

- [ ] Patient has exactly one ClinicalRecord
- [ ] ClinicalRecord has exactly one current PsychiatricHistory
- [ ] Finalized Note generates exactly one Encounter event
- [ ] Each PsychiatricHistory version has a unique sequential version number

### 3.5 Duplicate Detection

- [ ] Warn on potential duplicate Patient (same name + date of birth)
- [ ] Same drug name may appear in multiple active Medications (legitimate split dosing)

---

## 4. Timeline-Critical Invariants

### 4.1 Never Break

- [ ] **Finalized content immutability**: Once a Note is finalized, its content fields must never change
- [ ] **Event permanence**: ClinicalEvents cannot be deleted from the timeline
- [ ] **Chronological correctness**: Timeline ordering must follow the three-tier rule (event date → recorded date → event type priority)
- [ ] **Draft invisibility**: Draft Notes must never appear on the clinical timeline
- [ ] **Version chain integrity**: PsychiatricHistory versions must form unbroken sequential chain
- [ ] **Medication lifecycle consistency**: Every active Medication must have a start date; every discontinued Medication must have both end date and discontinuation reason

### 4.2 Event Type Priority Order (for same-date ordering)

1. Encounter
2. Medication Start
3. Medication Change
4. Medication Stop
5. Hospitalization
6. Life Event
7. History Update
8. Other

### 4.3 Timeline Display Rules

- [ ] Default view is reverse chronological (most recent first)
- [ ] Events with future occurrence dates never appear
- [ ] Addenda display with their parent Note, not as separate timeline entries
- [ ] Event occurrence date is displayed (not recorded date)

---

## 5. Areas Requiring Explicit Human Confirmation

### 5.1 Before Implementation

- [ ] Confirm identifier generation strategy for Patient entities
- [ ] Confirm acceptable gap between encounter date and documentation date (if any limit)
- [ ] Confirm handling of cross-patient documentation errors (note finalized under wrong patient)
- [ ] Confirm behavior for patient death status (beyond active/inactive)
- [ ] Confirm behavior for concurrent draft notes per patient (limit or allow multiple)
- [ ] Confirm timezone handling for date/time interpretation

### 5.2 During Implementation

- [ ] Confirm validation rules match use case requirements before finalizing
- [ ] Confirm medication linking mechanism for dosage changes
- [ ] Confirm PsychiatricHistory diff/comparison display (if any)
- [ ] Confirm search result ranking logic

### 5.3 Edge Cases Requiring Decision

- [ ] Medication with unknown historical start date (approximate dates)
- [ ] External medication prescribed by another provider (attribution)
- [ ] Patient request for record amendment
- [ ] System clock anomalies affecting recorded dates
- [ ] Maximum content length for note sections
- [ ] Character encoding for special characters and non-English names

---

## 6. Areas Prone to AI Hallucination or Over-Implementation

### 6.1 Features Explicitly Out of Scope — Do Not Implement

- [ ] User authentication, login systems, or role-based access control
- [ ] Multi-user concurrent access
- [ ] External system integrations (pharmacies, labs, hospitals)
- [ ] Prescription generation or transmission
- [ ] Billing codes, insurance claims, or financial tracking
- [ ] Full appointment scheduling (calendars, reminders, conflict detection)
- [ ] Patient-facing portal or interface
- [ ] HIPAA compliance automation or regulatory enforcement
- [ ] Clinical decision support, alerts, or drug interaction checks
- [ ] Reporting, analytics, or population-level statistics
- [ ] Automated data migration or import from other systems
- [ ] Mobile or tablet interfaces
- [ ] Cloud synchronization or multi-device sharing
- [ ] Audit trail for demographic changes (not in MVP)

### 6.2 Over-Engineering Risks

- [ ] Do not add diagnosis codes or structured diagnostic entities
- [ ] Do not add medication formularies or drug databases
- [ ] Do not add template systems for notes
- [ ] Do not add auto-save with conflict resolution
- [ ] Do not add collaborative editing
- [ ] Do not add notification or messaging systems
- [ ] Do not add patient consent tracking within the system
- [ ] Do not add document attachment or file upload
- [ ] Do not add lab result tracking
- [ ] Do not add vital signs or measurement tracking

### 6.3 Scope Boundaries to Respect

- [ ] Appointment is minimal recording only (date, time, type, notes)
- [ ] Search is patient lookup + within-patient content search only
- [ ] PsychiatricHistory is single-version-current model (not section-level versioning)
- [ ] Medication changes create new entries (not inline edits)
- [ ] Manual events are limited to Hospitalization, Life Event, Other types
- [ ] Single clinician, single device context assumed

### 6.4 Terminology Precision

- [ ] Use "Note" not "Encounter" for the documentation entity
- [ ] Use "ClinicalEvent" not "TimelineEntry" for timeline items
- [ ] Use "finalized" not "signed" or "locked" for note status
- [ ] Use "discontinued" not "stopped" or "ended" for medication status
- [ ] Use "superseded" not "archived" for prior PsychiatricHistory versions

### 6.5 Validation Boundaries

- [ ] Do not validate clinical terminology or medication names
- [ ] Do not enforce documentation structure beyond required fields
- [ ] Do not auto-calculate or derive clinical information
- [ ] Do not enforce minimum content requirements beyond "non-empty" for required fields

---

## 7. Implementation Verification Checklist

### 7.1 Entity Completeness

- [ ] All 8 entities implemented per domain model
- [ ] All entity attributes present per domain model
- [ ] All entity relationships enforced

### 7.2 Use Case Coverage

- [ ] UC-01: Create Patient
- [ ] UC-01B: Edit Patient Information
- [ ] UC-02: Search Patient
- [ ] UC-03: Add Clinical Note
- [ ] UC-04: Add or Update Medication
- [ ] UC-05: Record Next Appointment
- [ ] UC-06: View Full Patient Timeline
- [ ] UC-07: Record Manual Clinical Event
- [ ] UC-08: Update Psychiatric History

### 7.3 Event Type Coverage

- [ ] Encounter (from Note finalization)
- [ ] Medication Start
- [ ] Medication Change
- [ ] Medication Stop
- [ ] Hospitalization (manual)
- [ ] Life Event (manual)
- [ ] History Update (from PsychiatricHistory versioning)
- [ ] Other (manual)

### 7.4 Invariant Enforcement

- [ ] All immutability rules enforced
- [ ] All temporal validation rules enforced
- [ ] All cardinality rules enforced
- [ ] Timeline ordering algorithm correct

---

*Document Version: 1.0*
*Status: Final*
*Sources: 01_specs.md, 02_domain.md, 03_timeline.md, 04_use_cases.md, 05_edge_cases.md, 07_inconsistency_resolution.md*


---

## 07_inconsistency_resolution.md

# Psychiatric Medical Records System — Inconsistency Resolution Log

## Overview

This document records inconsistencies identified across specification documents and their resolutions.

All resolutions prioritize MVP simplicity, clinical correctness, and timeline consistency.

No new features or scope expansion has been introduced.

---

## Resolved Inconsistencies

### IR-01: Appointment Scope Conflict

**Conflict:** `01_specs.md` §5.5 states appointment scheduling is out of scope, but `02_domain.md` defines an Appointment entity and `04_use_cases.md` includes UC-05 for recording appointments.

**Resolution:** Clarify that *full appointment scheduling* (calendars, reminders, conflict detection) is out of scope, but *minimal appointment recording* for next encounter tracking is in scope. This aligns with UC-05's stated scope limitation.

**Files Updated:**
- `01_specs.md` — Revised §5.5 to distinguish scheduling from recording

**Rationale:** The domain model and use case already limit appointments to minimal recording. The specs needed clarification, not the other documents.

---

### IR-02: Event Type Enumeration Mismatch

**Conflict:** `02_domain.md` lists event types without "History Update" and uses "Significant Life Event". `03_timeline.md` uses "Life Event" and includes "History Update" in ordering.

**Resolution:** Standardize event types across both documents: Encounter, Medication Start, Medication Change, Medication Stop, Hospitalization, Life Event, History Update, Other.

**Files Updated:**
- `02_domain.md` — Updated ClinicalEvent event types list

**Rationale:** History Update events are generated per §03_timeline.md and must be in the canonical type list.

---

### IR-03: Medication Fields Missing from Specs

**Conflict:** `02_domain.md` includes "Route of administration" and "Dosage unit" for Medication entity, but `01_specs.md` §3.4 does not list them.

**Resolution:** Add these fields to `01_specs.md` §3.4 for consistency.

**Files Updated:**
- `01_specs.md` — Added route and dosage unit to §3.4

**Rationale:** These are standard medication documentation fields, not new features.

---

### IR-04: PsychiatricHistory Cardinality Ambiguity

**Conflict:** `02_domain.md` states ClinicalRecord "contains exactly one PsychiatricHistory" but also describes versioning with multiple retained versions.

**Resolution:** Clarify that ClinicalRecord has exactly one *current* PsychiatricHistory, with previous versions retained for history.

**Files Updated:**
- `02_domain.md` — Clarified ClinicalRecord relationship wording

**Rationale:** The versioning model was already defined; the relationship statement needed precision.

---

### IR-05: Empty Initial Psychiatric History Definition

**Conflict:** `04_use_cases.md` UC-01 creates an "initial empty PsychiatricHistory" but `02_domain.md` lists many content fields.

**Resolution:** Clarify that "empty" means all content fields are initially null/blank; they are populated during or after the initial evaluation encounter.

**Files Updated:**
- `04_use_cases.md` — Added clarification note to UC-01

**Rationale:** Fields are optional at creation; the initial version serves as a placeholder until clinical intake.

---

### IR-06: Medication Event Generation Timing

**Conflict:** Notes have explicit draft/finalized workflow, but Medications appear to generate events immediately with no draft state.

**Resolution:** Explicitly state that Medication entries are finalized immediately upon creation (no draft state) and events are generated at that moment.

**Files Updated:**
- `02_domain.md` — Added business rule clarifying immediate finalization

**Rationale:** Medications represent prescribing actions already taken; drafting is not clinically appropriate.

---

### IR-07: Future Date Validation Rule Confirmation

**Conflict:** `04_use_cases.md` states future dates are prohibited for medications, but `05_edge_cases.md` §7.2 treats this as an open question.

**Resolution:** Mark §7.2 as resolved: future medication start dates are prohibited; planned prescriptions are documented in encounter notes.

**Files Updated:**
- `05_edge_cases.md` — Added resolution note to §7.2

**Rationale:** The validation rule was already defined; the edge case needed to reference it.

---

### IR-08: Manual Event Entry Missing Use Case

**Conflict:** `03_timeline.md` describes manual event entry for hospitalizations and life events, but no use case exists in `04_use_cases.md`.

**Resolution:** Add UC-07 for manual clinical event entry.

**Files Updated:**
- `04_use_cases.md` — Added UC-07

**Rationale:** The capability was defined in timeline doc; a use case is needed for completeness.

---

### IR-09: Cross-Patient Search Scope Clarification

**Conflict:** `01_specs.md` §3.6 mentions "search across all patient records" but use cases only show patient lookup (UC-02) and within-patient timeline search (UC-06).

**Resolution:** Clarify that search locates patients by demographics, and content search operates within a selected patient's record.

**Files Updated:**
- `01_specs.md` — Clarified §3.6 wording

**Rationale:** Cross-patient clinical content search was never intended; wording was ambiguous.

---

### IR-10: Encounter Type vs Appointment Type Alignment

**Conflict:** Appointment types in `04_use_cases.md` UC-05 differ from Note encounter types in `02_domain.md`.

**Resolution:** Align appointment types to match encounter types (add Crisis Intervention, Phone Consultation to appointment types).

**Files Updated:**
- `04_use_cases.md` — Updated UC-05 appointment types list

**Rationale:** Appointment should use the same type vocabulary as the encounter it anticipates.

---

### IR-11: Draft Deletion Exception to Immutability

**Conflict:** `03_timeline.md` describes immutability but draft deletion is an exception not stated alongside the principle.

**Resolution:** Add explicit note that draft notes (pre-finalization) are the exception and may be deleted.

**Files Updated:**
- `03_timeline.md` — Added clarification to §4 immutability section

**Rationale:** The exception existed but wasn't co-located with the principle.

---

### IR-12: ClinicalEvent Entity References Incomplete

**Conflict:** `02_domain.md` ClinicalEvent only defines references to Note and Medication, not Hospitalization or Life Event entities.

**Resolution:** Clarify that some event types (Hospitalization, Life Event, History Update) are standalone events without a separate source entity reference.

**Files Updated:**
- `02_domain.md` — Added clarification to ClinicalEvent relationships

**Rationale:** These events are entered directly; they don't derive from other entities.

---

### IR-13: Addendum Reason Field Naming

**Conflict:** `02_domain.md` uses "Reason for addendum" while `03_timeline.md` uses "stated reason".

**Resolution:** Standardize to "Reason" as the field name.

**Files Updated:**
- `02_domain.md` — Renamed to "Reason"
- `03_timeline.md` — Updated reference to match

**Rationale:** Minor terminology alignment for consistency.

---

### IR-14: Appointment Entity Wording Error

**Conflict:** `02_domain.md` states Appointment "exists only to record the intended date of past encounters" — should be "future encounters".

**Resolution:** Correct "past" to "future".

**Files Updated:**
- `02_domain.md` — Fixed wording in Appointment functional description

**Rationale:** Appointments are for scheduling future visits, not documenting past ones.

---

### IR-15: Hospitalization Event Atomicity Contradiction

**Conflict:** `03_timeline.md` states hospitalizations generate "separate events for admission and discharge" but `02_domain.md` lists "Hospitalization" as a single event type.

**Resolution:** Hospitalizations are recorded as a single event capturing the episode. The atomicity example was misleading.

**Files Updated:**
- `03_timeline.md` — Revised atomicity example

**Rationale:** MVP simplicity; tracking admission/discharge as separate events adds complexity without clear clinical benefit.

---

### IR-16: Route of Administration Required vs Optional

**Conflict:** `04_use_cases.md` UC-04 implies route is required (step 5), but `02_domain.md` business rules don't list it as required.

**Resolution:** Route of administration is optional. Updated UC-04 step and validation table.

**Files Updated:**
- `02_domain.md` — Added explicit rule that route is optional
- `04_use_cases.md` — Changed step 5 to "optionally enters" and added to validation table

**Rationale:** Many psychiatric medications have a default oral route; requiring explicit entry adds friction without clinical value.

---

### IR-17: Dosage Unit Missing from Domain Business Rules

**Conflict:** `04_use_cases.md` UC-04 validation says dosage unit is required, but `02_domain.md` business rules don't include it.

**Resolution:** Add dosage unit to the required fields in domain model.

**Files Updated:**
- `02_domain.md` — Added dosage unit to required medication fields

**Rationale:** Dosage without unit is ambiguous (e.g., "50" could mean 50mg or 50mcg).

---

### IR-18: Missing Use Case for Psychiatric History Updates

**Conflict:** Domain model describes PsychiatricHistory versioning and `03_timeline.md` describes History Update events, but no use case defines this workflow.

**Resolution:** Add UC-08 for updating psychiatric history.

**Files Updated:**
- `04_use_cases.md` — Added UC-08 and updated summary table

**Rationale:** The capability was referenced in domain and timeline docs; a use case is needed for completeness.

---

### IR-19: History Update Filter Missing from Timeline View

**Conflict:** `04_use_cases.md` UC-06 filter options list all event types except History Update.

**Resolution:** Add History Update to filter options.

**Files Updated:**
- `04_use_cases.md` — Added "History Update events only" to filter list

**Rationale:** Filter options should match the complete event type enumeration.

---

### IR-20: Hospitalization Event Examples Contradicted Single-Event Statement

**Conflict:** `03_timeline.md` line 47 states hospitalizations are recorded as "a single event" but lines 79-81 described "admissions and discharges" with examples suggesting separate events.

**Resolution:** Revised the Hospitalization Events section to reinforce single-event model with clearer examples.

**Files Updated:**
- `03_timeline.md` — Updated Hospitalization Events description and examples

**Rationale:** Consistency with atomicity statement; MVP simplicity favors one event per hospitalization episode.

---

### IR-21: Route of Administration Optional Status Not Clear in Specs

**Conflict:** `01_specs.md` §3.4 listed route of administration without clarifying it's optional, while `02_domain.md` and `04_use_cases.md` explicitly state it's optional.

**Resolution:** Added "Route of administration is optional" to `01_specs.md` §3.4.

**Files Updated:**
- `01_specs.md` — Added optional clarification

**Rationale:** Alignment with domain model and use case validations.

---

### IR-22: Psychiatric History Fields List Shorter in Specs

**Conflict:** `01_specs.md` §3.3 listed 6 fields but `02_domain.md` defines 12+ fields for PsychiatricHistory.

**Resolution:** Updated specs to reference "additional clinical background sections as detailed in the domain model."

**Files Updated:**
- `01_specs.md` — Broadened §3.3 field description

**Rationale:** Specs provide overview; domain model provides complete detail.

---

### IR-23: Missing Use Case for Editing Patient Demographics

**Conflict:** `01_specs.md` §3.1 states patients can be "edited" but no use case documented this capability.

**Resolution:** Added UC-01B for editing patient information, including status changes (active/inactive).

**Files Updated:**
- `04_use_cases.md` — Added UC-01B and updated summary table

**Rationale:** Capability was in specs; use case needed for completeness.

---

## Verification Checklist

- [x] All documents are logically consistent
- [x] Clinical timeline concept remains coherent
- [x] MVP scope has not expanded
- [x] No new features introduced (UC-01B documents existing capability)
- [x] No new domain entities added
- [x] Event types match across all documents
- [x] Medication fields match across all documents
- [x] All specs capabilities have corresponding use cases

---

*Document Version: 1.2*
*Status: Final*
*Updated: Third resolution pass (complete cross-reference analysis)*



---

# Arquitectura de Agentes

# Psychiatric Medical Records System — Agent Architecture

## Overview

This document defines the multi-agent architecture for implementing the MVP.

All agents operate under the constraints defined in `08_agent_policy.md`.

No agent may exceed its defined scope or responsibilities.

---

## 1. Agent Overview

| Agent ID | Agent Name | Responsibility |
|----------|------------|----------------|
| AG-01 | Schema Agent | Defines and manages the database schema for all domain entities |
| AG-02 | Entity Agent | Implements domain entity structures and relationships |
| AG-03 | Validation Agent | Implements all validation rules defined in use cases |
| AG-04 | Timeline Agent | Implements clinical event generation and temporal ordering |
| AG-05 | Patient Agent | Implements patient management use cases (UC-01, UC-01B, UC-02) |
| AG-06 | Note Agent | Implements clinical note use cases (UC-03) |
| AG-07 | Medication Agent | Implements medication management use cases (UC-04) |
| AG-08 | History Agent | Implements psychiatric history use cases (UC-08) |
| AG-09 | Event Agent | Implements manual event creation use cases (UC-07) |
| AG-10 | Appointment Agent | Implements appointment recording use cases (UC-05) |
| AG-11 | View Agent | Implements timeline viewing and search use cases (UC-06) |
| AG-12 | Integration Agent | Integrates all components and verifies end-to-end workflows |

---

## 2. Agent Definitions

### AG-01: Schema Agent

**Single Responsibility:**
Define the complete database schema including tables, columns, constraints, and foreign keys for all domain entities.

**Inputs:**
- `02_domain.md` — Entity definitions and relationships
- `04_use_cases.md` — Validation rules and field requirements
- `07_stack_ux_constraints.md` — Database approach constraints

**Outputs:**
- `src/db/schema.sql` or equivalent schema definition
- `src/db/migrations/` — Initial migration files
- Schema documentation comments

**Non-Responsibilities:**
- Does NOT implement query logic
- Does NOT implement application code
- Does NOT define indexes (deferred to optimization)
- Does NOT create seed data

---

### AG-02: Entity Agent

**Single Responsibility:**
Implement domain entity type definitions and relationship mappings that mirror the database schema.

**Inputs:**
- `02_domain.md` — Entity definitions and attributes
- `src/db/schema.sql` — Database schema (from AG-01)

**Outputs:**
- `src/entities/Patient.ts`
- `src/entities/ClinicalRecord.ts`
- `src/entities/PsychiatricHistory.ts`
- `src/entities/Note.ts`
- `src/entities/Addendum.ts`
- `src/entities/Medication.ts`
- `src/entities/ClinicalEvent.ts`
- `src/entities/Appointment.ts`
- `src/entities/index.ts`

**Non-Responsibilities:**
- Does NOT implement business logic
- Does NOT implement validation
- Does NOT implement database queries
- Does NOT implement event generation

---

### AG-03: Validation Agent

**Single Responsibility:**
Implement all validation rules as reusable validation functions matching use case requirements.

**Inputs:**
- `04_use_cases.md` — Validation tables for each use case
- `05_edge_cases.md` — Edge case validations with resolutions
- `src/entities/` — Entity type definitions (from AG-02)

**Outputs:**
- `src/validation/patient.ts`
- `src/validation/note.ts`
- `src/validation/medication.ts`
- `src/validation/appointment.ts`
- `src/validation/psychiatricHistory.ts`
- `src/validation/clinicalEvent.ts`
- `src/validation/index.ts`

**Non-Responsibilities:**
- Does NOT implement persistence
- Does NOT implement use case flows
- Does NOT define new validation rules
- Does NOT implement UI error display

---

### AG-04: Timeline Agent

**Single Responsibility:**
Implement clinical event generation logic and temporal ordering algorithm for timeline display.

**Inputs:**
- `03_timeline.md` — Event generation rules and ordering principles
- `02_domain.md` — ClinicalEvent entity definition
- `src/entities/ClinicalEvent.ts` — Event type definition (from AG-02)

**Outputs:**
- `src/timeline/eventGenerator.ts` — Event creation from source entities
- `src/timeline/ordering.ts` — Temporal ordering implementation
- `src/timeline/types.ts` — Timeline-specific type definitions
- `src/timeline/index.ts`

**Non-Responsibilities:**
- Does NOT implement entity persistence
- Does NOT implement timeline UI
- Does NOT implement search within timeline
- Does NOT modify source entities

---

### AG-05: Patient Agent

**Single Responsibility:**
Implement patient management workflows including creation, editing, search, and status management.

**Inputs:**
- `04_use_cases.md` — UC-01, UC-01B, UC-02
- `src/entities/Patient.ts` — Patient entity (from AG-02)
- `src/entities/ClinicalRecord.ts` — ClinicalRecord entity (from AG-02)
- `src/entities/PsychiatricHistory.ts` — PsychiatricHistory entity (from AG-02)
- `src/validation/patient.ts` — Patient validation (from AG-03)
- `src/db/schema.sql` — Database schema (from AG-01)

**Outputs:**
- `src/usecases/patient/create.ts` — UC-01 implementation
- `src/usecases/patient/edit.ts` — UC-01B implementation
- `src/usecases/patient/search.ts` — UC-02 implementation
- `src/usecases/patient/index.ts`

**Non-Responsibilities:**
- Does NOT implement note creation
- Does NOT implement medication management
- Does NOT implement timeline generation
- Does NOT implement psychiatric history updates

---

### AG-06: Note Agent

**Single Responsibility:**
Implement clinical note workflows including draft management, finalization, and addendum creation.

**Inputs:**
- `04_use_cases.md` — UC-03
- `03_timeline.md` — Encounter event generation rules
- `src/entities/Note.ts` — Note entity (from AG-02)
- `src/entities/Addendum.ts` — Addendum entity (from AG-02)
- `src/validation/note.ts` — Note validation (from AG-03)
- `src/timeline/eventGenerator.ts` — Event generation (from AG-04)

**Outputs:**
- `src/usecases/note/create.ts` — Draft creation
- `src/usecases/note/edit.ts` — Draft editing
- `src/usecases/note/finalize.ts` — Finalization with event generation
- `src/usecases/note/delete.ts` — Draft deletion
- `src/usecases/note/addendum.ts` — Addendum creation
- `src/usecases/note/index.ts`

**Non-Responsibilities:**
- Does NOT implement timeline display
- Does NOT implement patient management
- Does NOT modify finalized notes
- Does NOT implement search

---

### AG-07: Medication Agent

**Single Responsibility:**
Implement medication workflows including creation, dosage changes, and discontinuation with event generation.

**Inputs:**
- `04_use_cases.md` — UC-04
- `03_timeline.md` — Medication event generation rules
- `src/entities/Medication.ts` — Medication entity (from AG-02)
- `src/validation/medication.ts` — Medication validation (from AG-03)
- `src/timeline/eventGenerator.ts` — Event generation (from AG-04)

**Outputs:**
- `src/usecases/medication/create.ts` — New medication with start event
- `src/usecases/medication/change.ts` — Dosage change with discontinue-and-link
- `src/usecases/medication/discontinue.ts` — Discontinuation with stop event
- `src/usecases/medication/list.ts` — Active and historical medication lists
- `src/usecases/medication/index.ts`

**Non-Responsibilities:**
- Does NOT validate drug names clinically
- Does NOT implement drug interactions
- Does NOT implement prescriptions
- Does NOT modify discontinued medications

---

### AG-08: History Agent

**Single Responsibility:**
Implement psychiatric history versioning and update workflows with event generation.

**Inputs:**
- `04_use_cases.md` — UC-08
- `03_timeline.md` — History Update event generation rules
- `src/entities/PsychiatricHistory.ts` — PsychiatricHistory entity (from AG-02)
- `src/validation/psychiatricHistory.ts` — History validation (from AG-03)
- `src/timeline/eventGenerator.ts` — Event generation (from AG-04)

**Outputs:**
- `src/usecases/history/update.ts` — Version creation with event generation
- `src/usecases/history/view.ts` — Current and historical version viewing
- `src/usecases/history/index.ts`

**Non-Responsibilities:**
- Does NOT implement patient creation (initial version)
- Does NOT implement section-level versioning
- Does NOT modify previous versions
- Does NOT implement history comparison

---

### AG-09: Event Agent

**Single Responsibility:**
Implement manual clinical event creation for hospitalizations, life events, and other occurrences.

**Inputs:**
- `04_use_cases.md` — UC-07
- `02_domain.md` — ClinicalEvent entity definition
- `src/entities/ClinicalEvent.ts` — Event entity (from AG-02)
- `src/validation/clinicalEvent.ts` — Event validation (from AG-03)

**Outputs:**
- `src/usecases/event/create.ts` — Manual event creation
- `src/usecases/event/index.ts`

**Non-Responsibilities:**
- Does NOT create events from other entities (Note, Medication, History)
- Does NOT implement Encounter or Medication event types
- Does NOT modify existing events
- Does NOT implement timeline display

---

### AG-10: Appointment Agent

**Single Responsibility:**
Implement appointment recording and status management for future encounters.

**Inputs:**
- `04_use_cases.md` — UC-05
- `02_domain.md` — Appointment entity definition
- `src/entities/Appointment.ts` — Appointment entity (from AG-02)
- `src/validation/appointment.ts` — Appointment validation (from AG-03)

**Outputs:**
- `src/usecases/appointment/create.ts` — Appointment creation
- `src/usecases/appointment/update.ts` — Date/time/status updates
- `src/usecases/appointment/list.ts` — Patient appointment listing
- `src/usecases/appointment/index.ts`

**Non-Responsibilities:**
- Does NOT implement calendar views
- Does NOT implement reminders
- Does NOT link appointments to notes automatically
- Does NOT generate clinical events

---

### AG-11: View Agent

**Single Responsibility:**
Implement timeline viewing, filtering, and within-patient search functionality.

**Inputs:**
- `04_use_cases.md` — UC-06
- `03_timeline.md` — Timeline display rules
- `src/timeline/ordering.ts` — Ordering logic (from AG-04)
- `src/entities/ClinicalEvent.ts` — Event entity (from AG-02)

**Outputs:**
- `src/usecases/view/timeline.ts` — Timeline retrieval with ordering
- `src/usecases/view/filter.ts` — Event type and date filtering
- `src/usecases/view/search.ts` — Within-patient content search
- `src/usecases/view/index.ts`

**Non-Responsibilities:**
- Does NOT implement UI components
- Does NOT modify events
- Does NOT implement cross-patient search
- Does NOT implement data export

---

### AG-12: Integration Agent

**Single Responsibility:**
Integrate all components, verify end-to-end workflows, and ensure specification compliance.

**Inputs:**
- All specification documents
- All outputs from AG-01 through AG-11
- `06_dev_checklist.md` — Verification checklist

**Outputs:**
- `src/index.ts` — Application entry point
- `src/app.ts` — Application orchestration
- Integration verification report
- End-to-end test scenarios

**Non-Responsibilities:**
- Does NOT implement new features
- Does NOT modify other agents' outputs (except bugs)
- Does NOT implement UI
- Does NOT add dependencies

---

## 3. Dependency Graph

### 3.1 Execution Order

```
Phase 1 (Foundation):
  AG-01: Schema Agent
    ↓
Phase 2 (Structure):
  AG-02: Entity Agent
    ↓
Phase 3 (Rules):
  AG-03: Validation Agent
  AG-04: Timeline Agent       [parallel]
    ↓
Phase 4 (Use Cases):
  AG-05: Patient Agent
  AG-06: Note Agent
  AG-07: Medication Agent     [parallel]
  AG-08: History Agent
  AG-09: Event Agent
  AG-10: Appointment Agent
    ↓
Phase 5 (Query):
  AG-11: View Agent
    ↓
Phase 6 (Integration):
  AG-12: Integration Agent
```

### 3.2 Explicit Dependencies

| Agent | Depends On | Blocking? |
|-------|------------|-----------|
| AG-01 | None | — |
| AG-02 | AG-01 | Yes |
| AG-03 | AG-02 | Yes |
| AG-04 | AG-02 | Yes |
| AG-05 | AG-01, AG-02, AG-03 | Yes |
| AG-06 | AG-02, AG-03, AG-04 | Yes |
| AG-07 | AG-02, AG-03, AG-04 | Yes |
| AG-08 | AG-02, AG-03, AG-04 | Yes |
| AG-09 | AG-02, AG-03 | Yes |
| AG-10 | AG-02, AG-03 | Yes |
| AG-11 | AG-04 | Yes |
| AG-12 | All others | Yes |

### 3.3 Parallelizable Agents

**Phase 3 Parallel Group:**
- AG-03 (Validation Agent)
- AG-04 (Timeline Agent)

**Phase 4 Parallel Group:**
- AG-05 (Patient Agent)
- AG-06 (Note Agent)
- AG-07 (Medication Agent)
- AG-08 (History Agent)
- AG-09 (Event Agent)
- AG-10 (Appointment Agent)

**Cannot Be Parallelized:**
- AG-01 must complete before AG-02
- AG-02 must complete before Phase 3
- Phase 3 must complete before Phase 4
- Phase 4 must complete before AG-11
- AG-11 must complete before AG-12

---

## 4. File Ownership Rules

### 4.1 Exclusive Ownership

| Agent | Owned Files | Others May |
|-------|-------------|------------|
| AG-01 | `src/db/schema.sql`, `src/db/migrations/*` | Read only |
| AG-02 | `src/entities/*` | Read only |
| AG-03 | `src/validation/*` | Read only |
| AG-04 | `src/timeline/*` | Read only |
| AG-05 | `src/usecases/patient/*` | Read only |
| AG-06 | `src/usecases/note/*` | Read only |
| AG-07 | `src/usecases/medication/*` | Read only |
| AG-08 | `src/usecases/history/*` | Read only |
| AG-09 | `src/usecases/event/*` | Read only |
| AG-10 | `src/usecases/appointment/*` | Read only |
| AG-11 | `src/usecases/view/*` | Read only |
| AG-12 | `src/index.ts`, `src/app.ts` | Read only |

### 4.2 Shared Read-Only Files

All agents may READ but not modify:

- `docs/*` — All specification documents
- `package.json` — Dependency list (modification requires confirmation)
- `tsconfig.json` — TypeScript configuration

### 4.3 File Creation Rules

**Agents MUST create files only within their owned directories.**

**Agents MUST NOT:**
- Create files in another agent's directory
- Create files outside `src/` (except AG-12 for root config)
- Create documentation files
- Create files in `docs/`

### 4.4 Cross-Agent File References

**Allowed:**
- Import from another agent's `index.ts` export
- Import type definitions from `src/entities/*`
- Import validation functions from `src/validation/*`
- Import timeline utilities from `src/timeline/*`

**Forbidden:**
- Import internal (non-exported) modules from other agents
- Modify imported modules
- Re-export other agents' modules

---

## 5. Failure & Escalation

### 5.1 When an Agent Must Stop

**Immediate Stop Conditions:**

| Condition | Agent Action |
|-----------|--------------|
| Required input file does not exist | Stop, report missing dependency |
| Input file has syntax errors | Stop, report error location |
| Specification is ambiguous for current task | Stop, document ambiguity |
| Specification conflict detected | Stop, quote conflicting sections |
| Required decision is missing | Stop, list options |
| Edge case without resolution in `05_edge_cases.md` | Stop, describe scenario |
| Validation rule not defined for required field | Stop, request rule |
| Event generation trigger unclear | Stop, request clarification |

### 5.2 When an Agent Must Escalate to Human Review

**Escalation Required:**

| Scenario | What to Report |
|----------|----------------|
| Schema change needed after AG-01 complete | Proposed change and rationale |
| New dependency required | Package name, purpose, alternatives |
| Validation rule appears incorrect | Rule location, observed issue |
| Use case step is impossible as specified | Step reference, blocking issue |
| Performance concern with specified approach | Concern, measured or estimated impact |
| Security concern identified | Nature of concern, affected data |
| Previous agent output appears incorrect | File, line, observed vs expected |

### 5.3 Escalation Protocol

1. **Stop** current task immediately
2. **Document** the issue with specific references
3. **Preserve** current work state (do not delete partial progress)
4. **Report** using this format:

```
ESCALATION REQUIRED

Agent: [Agent ID and Name]
Task: [Current task description]
Blocker: [Category from tables above]

Details:
[Specific description of issue]

References:
[Specification sections, file locations, line numbers]

Options (if known):
[List possible resolutions without recommending]

Awaiting: Human decision
```

### 5.4 Post-Escalation Behavior

**Agent MUST:**
- Wait for human response
- Not proceed with alternative approach
- Not modify files while waiting
- Not escalate to other agents

**Agent MAY:**
- Work on unrelated tasks if available
- Prepare documentation for resolution options
- Read additional specifications for context

---

## 6. Agent Communication Rules

### 6.1 Inter-Agent Communication

**Agents communicate only through files.**

- No direct agent-to-agent messaging
- No shared memory or state
- No runtime coordination

### 6.2 Handoff Protocol

When an agent completes its work:

1. All output files must be syntactically valid
2. All exports must be properly defined
3. Agent must verify outputs match specification
4. Successor agents may then begin

### 6.3 Conflict Resolution

If two agents need to modify the same file:

- This indicates an architecture violation
- Both agents must STOP
- Human must resolve ownership ambiguity

---

## 7. Verification Checkpoints

### 7.1 Per-Agent Completion Criteria

Before an agent declares completion:

- [ ] All output files created
- [ ] All output files syntactically valid
- [ ] All exports match expected interface
- [ ] No unauthorized dependencies added
- [ ] No files modified outside owned directory
- [ ] Implementation matches specification references

### 7.2 Phase Gate Criteria

Before proceeding to next phase:

- [ ] All agents in current phase complete
- [ ] No pending escalations
- [ ] No unresolved conflicts
- [ ] Integration points verified

---

*Document Version: 1.0*
*Status: Final*
*Sources: 06_dev_checklist.md, 07_stack_ux_constraints.md, 08_agent_policy.md*


---



