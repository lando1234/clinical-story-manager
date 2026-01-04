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

> **Note:** This Medication data model reflects updates specified in [`22_cambios_medicacion_actualizacion.md`](../02_events/22_cambios_medicacion_actualizacion.md). See the update document for complete field changes and migration considerations.

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
| prescription_issue_date | Date | When prescription was issued |
| end_date | Date (nullable) | When medication was discontinued |
| comments | Text (nullable) | Optional comments about the prescription |
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
- Note (for NOTE events)
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
- Clinical dates (encounter_date, prescription_issue_date, event_date): Date only, no time component
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
0. Foundational (priority 0 - highest)
1. Encounter (priority 2)
2. Medication Start (priority 3)
3. Medication Change (priority 4)
4. Medication Prescription Issued (priority 5)
5. Medication Stop (priority 6)
6. Hospitalization (priority 7)
7. Life Event (priority 8)
8. History Update (priority 9)
9. Other (priority 10)

**Special Case: NOTE Events**

NOTE events do not have a fixed priority. They are ordered chronologically by event timestamp, then recorded timestamp, then identifier, without priority-based positioning.

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
- Note finalization MUST create exactly one NOTE event
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
- prescription_issue_date must not be in the future (for medications)

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
- id, clinical_record_id, drug_name, dosage, dosage_unit, frequency, prescription_issue_date, comments, status
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
