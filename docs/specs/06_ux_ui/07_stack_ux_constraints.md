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
