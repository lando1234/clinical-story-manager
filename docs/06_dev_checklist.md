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
