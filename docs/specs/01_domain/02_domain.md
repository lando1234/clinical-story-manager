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
- A ClinicalEvent may reference zero or one Note (for NOTE events).
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

> **Note:** This Medication entity definition reflects updates specified in [`22_cambios_medicacion_actualizacion.md`](../02_events/22_cambios_medicacion_actualizacion.md). Key changes include: elimination of `route` field, semantic renaming of `startDate` to `prescriptionIssueDate`, renaming of `prescribingReason` to `comments` (optional), and introduction of the `MedicationPrescriptionIssued` event type. See the update document for complete rationale and impact analysis.

A Medication represents a pharmaceutical agent prescribed to the patient.

The Medication entity tracks the complete lifecycle from initiation through discontinuation.

All medications, current and historical, remain visible in the patient's record.

### Core Attributes

- Identifier
- Drug name
- Dosage
- Dosage unit
- Frequency
- Prescription issue date
- End date
- Comments (optional)
- Discontinuation reason
- Status (active or discontinued)

### Relationships

- A Medication belongs to exactly one ClinicalRecord.
- A Medication generates one or more ClinicalEvents (start, changes, discontinuation).

### Business Rules

**Required Fields:**
- A Medication must have the following required fields:
  - Drug name (drug_name): Cannot be empty
  - Dosage (dosage): Must be a positive value
  - Dosage unit (dosage_unit): Cannot be empty
  - Frequency (frequency): Cannot be empty
  - Prescription issue date (prescription_issue_date): Must be a valid date, cannot be in the future

**Optional Fields:**
- Comments (comments): Optional field for additional notes about the prescription
- End date (end_date): Optional, required only when discontinuing medication
- Discontinuation reason (discontinuation_reason): Optional, required only when discontinuing medication
- Predecessor ID (predecessor_id): Optional, used for linking dosage changes

**Status and Lifecycle:**
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

