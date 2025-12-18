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
