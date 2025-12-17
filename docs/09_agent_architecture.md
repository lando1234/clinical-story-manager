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
