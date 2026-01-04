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
- NOTE event with orphaned or deleted draft note
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

**Resolution:** Future medication start dates are prohibited for new medications (MedicationStart events) per UC-04 validation rules. However, future dates are allowed for dose adjustments (MedicationChange) and new prescription issuances (MedicationPrescriptionIssued). Events with future dates are created but filtered from timeline display until their date passes (similar to Encounter events). Planned future prescriptions that are not yet active are documented in the encounter note's Plan section, not as medication entries. A medication entry is created when the prescription becomes active.

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
