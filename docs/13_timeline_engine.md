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
