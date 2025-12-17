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

*Document Version: 1.1*
*Status: Final*
*Scope: All implementation agents*
*Effective: Immediately upon creation*
*Updated: PostgreSQL/Neon decision lock-in added*
