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

