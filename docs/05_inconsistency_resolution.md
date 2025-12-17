# Psychiatric Medical Records System — Inconsistency Resolution Log

## Overview

This document records inconsistencies identified across specification documents and their resolutions.

All resolutions prioritize MVP simplicity, clinical correctness, and timeline consistency.

No new features or scope expansion has been introduced.

---

## Resolved Inconsistencies

### IR-01: Appointment Scope Conflict

**Conflict:** `01_specs.md` §5.5 states appointment scheduling is out of scope, but `02_domain.md` defines an Appointment entity and `04_use_cases.md` includes UC-05 for recording appointments.

**Resolution:** Clarify that *full appointment scheduling* (calendars, reminders, conflict detection) is out of scope, but *minimal appointment recording* for next encounter tracking is in scope. This aligns with UC-05's stated scope limitation.

**Files Updated:**
- `01_specs.md` — Revised §5.5 to distinguish scheduling from recording

**Rationale:** The domain model and use case already limit appointments to minimal recording. The specs needed clarification, not the other documents.

---

### IR-02: Event Type Enumeration Mismatch

**Conflict:** `02_domain.md` lists event types without "History Update" and uses "Significant Life Event". `03_timeline.md` uses "Life Event" and includes "History Update" in ordering.

**Resolution:** Standardize event types across both documents: Encounter, Medication Start, Medication Change, Medication Stop, Hospitalization, Life Event, History Update, Other.

**Files Updated:**
- `02_domain.md` — Updated ClinicalEvent event types list

**Rationale:** History Update events are generated per §03_timeline.md and must be in the canonical type list.

---

### IR-03: Medication Fields Missing from Specs

**Conflict:** `02_domain.md` includes "Route of administration" and "Dosage unit" for Medication entity, but `01_specs.md` §3.4 does not list them.

**Resolution:** Add these fields to `01_specs.md` §3.4 for consistency.

**Files Updated:**
- `01_specs.md` — Added route and dosage unit to §3.4

**Rationale:** These are standard medication documentation fields, not new features.

---

### IR-04: PsychiatricHistory Cardinality Ambiguity

**Conflict:** `02_domain.md` states ClinicalRecord "contains exactly one PsychiatricHistory" but also describes versioning with multiple retained versions.

**Resolution:** Clarify that ClinicalRecord has exactly one *current* PsychiatricHistory, with previous versions retained for history.

**Files Updated:**
- `02_domain.md` — Clarified ClinicalRecord relationship wording

**Rationale:** The versioning model was already defined; the relationship statement needed precision.

---

### IR-05: Empty Initial Psychiatric History Definition

**Conflict:** `04_use_cases.md` UC-01 creates an "initial empty PsychiatricHistory" but `02_domain.md` lists many content fields.

**Resolution:** Clarify that "empty" means all content fields are initially null/blank; they are populated during or after the initial evaluation encounter.

**Files Updated:**
- `04_use_cases.md` — Added clarification note to UC-01

**Rationale:** Fields are optional at creation; the initial version serves as a placeholder until clinical intake.

---

### IR-06: Medication Event Generation Timing

**Conflict:** Notes have explicit draft/finalized workflow, but Medications appear to generate events immediately with no draft state.

**Resolution:** Explicitly state that Medication entries are finalized immediately upon creation (no draft state) and events are generated at that moment.

**Files Updated:**
- `02_domain.md` — Added business rule clarifying immediate finalization

**Rationale:** Medications represent prescribing actions already taken; drafting is not clinically appropriate.

---

### IR-07: Future Date Validation Rule Confirmation

**Conflict:** `04_use_cases.md` states future dates are prohibited for medications, but `05_edge_cases.md` §7.2 treats this as an open question.

**Resolution:** Mark §7.2 as resolved: future medication start dates are prohibited; planned prescriptions are documented in encounter notes.

**Files Updated:**
- `05_edge_cases.md` — Added resolution note to §7.2

**Rationale:** The validation rule was already defined; the edge case needed to reference it.

---

### IR-08: Manual Event Entry Missing Use Case

**Conflict:** `03_timeline.md` describes manual event entry for hospitalizations and life events, but no use case exists in `04_use_cases.md`.

**Resolution:** Add UC-07 for manual clinical event entry.

**Files Updated:**
- `04_use_cases.md` — Added UC-07

**Rationale:** The capability was defined in timeline doc; a use case is needed for completeness.

---

### IR-09: Cross-Patient Search Scope Clarification

**Conflict:** `01_specs.md` §3.6 mentions "search across all patient records" but use cases only show patient lookup (UC-02) and within-patient timeline search (UC-06).

**Resolution:** Clarify that search locates patients by demographics, and content search operates within a selected patient's record.

**Files Updated:**
- `01_specs.md` — Clarified §3.6 wording

**Rationale:** Cross-patient clinical content search was never intended; wording was ambiguous.

---

### IR-10: Encounter Type vs Appointment Type Alignment

**Conflict:** Appointment types in `04_use_cases.md` UC-05 differ from Note encounter types in `02_domain.md`.

**Resolution:** Align appointment types to match encounter types (add Crisis Intervention, Phone Consultation to appointment types).

**Files Updated:**
- `04_use_cases.md` — Updated UC-05 appointment types list

**Rationale:** Appointment should use the same type vocabulary as the encounter it anticipates.

---

### IR-11: Draft Deletion Exception to Immutability

**Conflict:** `03_timeline.md` describes immutability but draft deletion is an exception not stated alongside the principle.

**Resolution:** Add explicit note that draft notes (pre-finalization) are the exception and may be deleted.

**Files Updated:**
- `03_timeline.md` — Added clarification to §4 immutability section

**Rationale:** The exception existed but wasn't co-located with the principle.

---

### IR-12: ClinicalEvent Entity References Incomplete

**Conflict:** `02_domain.md` ClinicalEvent only defines references to Note and Medication, not Hospitalization or Life Event entities.

**Resolution:** Clarify that some event types (Hospitalization, Life Event, History Update) are standalone events without a separate source entity reference.

**Files Updated:**
- `02_domain.md` — Added clarification to ClinicalEvent relationships

**Rationale:** These events are entered directly; they don't derive from other entities.

---

### IR-13: Addendum Reason Field Naming

**Conflict:** `02_domain.md` uses "Reason for addendum" while `03_timeline.md` uses "stated reason".

**Resolution:** Standardize to "Reason" as the field name.

**Files Updated:**
- `02_domain.md` — Renamed to "Reason"
- `03_timeline.md` — Updated reference to match

**Rationale:** Minor terminology alignment for consistency.

---

### IR-14: Appointment Entity Wording Error

**Conflict:** `02_domain.md` states Appointment "exists only to record the intended date of past encounters" — should be "future encounters".

**Resolution:** Correct "past" to "future".

**Files Updated:**
- `02_domain.md` — Fixed wording in Appointment functional description

**Rationale:** Appointments are for scheduling future visits, not documenting past ones.

---

### IR-15: Hospitalization Event Atomicity Contradiction

**Conflict:** `03_timeline.md` states hospitalizations generate "separate events for admission and discharge" but `02_domain.md` lists "Hospitalization" as a single event type.

**Resolution:** Hospitalizations are recorded as a single event capturing the episode. The atomicity example was misleading.

**Files Updated:**
- `03_timeline.md` — Revised atomicity example

**Rationale:** MVP simplicity; tracking admission/discharge as separate events adds complexity without clear clinical benefit.

---

### IR-16: Route of Administration Required vs Optional

**Conflict:** `04_use_cases.md` UC-04 implies route is required (step 5), but `02_domain.md` business rules don't list it as required.

**Resolution:** Route of administration is optional. Updated UC-04 step and validation table.

**Files Updated:**
- `02_domain.md` — Added explicit rule that route is optional
- `04_use_cases.md` — Changed step 5 to "optionally enters" and added to validation table

**Rationale:** Many psychiatric medications have a default oral route; requiring explicit entry adds friction without clinical value.

---

### IR-17: Dosage Unit Missing from Domain Business Rules

**Conflict:** `04_use_cases.md` UC-04 validation says dosage unit is required, but `02_domain.md` business rules don't include it.

**Resolution:** Add dosage unit to the required fields in domain model.

**Files Updated:**
- `02_domain.md` — Added dosage unit to required medication fields

**Rationale:** Dosage without unit is ambiguous (e.g., "50" could mean 50mg or 50mcg).

---

### IR-18: Missing Use Case for Psychiatric History Updates

**Conflict:** Domain model describes PsychiatricHistory versioning and `03_timeline.md` describes History Update events, but no use case defines this workflow.

**Resolution:** Add UC-08 for updating psychiatric history.

**Files Updated:**
- `04_use_cases.md` — Added UC-08 and updated summary table

**Rationale:** The capability was referenced in domain and timeline docs; a use case is needed for completeness.

---

### IR-19: History Update Filter Missing from Timeline View

**Conflict:** `04_use_cases.md` UC-06 filter options list all event types except History Update.

**Resolution:** Add History Update to filter options.

**Files Updated:**
- `04_use_cases.md` — Added "History Update events only" to filter list

**Rationale:** Filter options should match the complete event type enumeration.

---

### IR-20: Hospitalization Event Examples Contradicted Single-Event Statement

**Conflict:** `03_timeline.md` line 47 states hospitalizations are recorded as "a single event" but lines 79-81 described "admissions and discharges" with examples suggesting separate events.

**Resolution:** Revised the Hospitalization Events section to reinforce single-event model with clearer examples.

**Files Updated:**
- `03_timeline.md` — Updated Hospitalization Events description and examples

**Rationale:** Consistency with atomicity statement; MVP simplicity favors one event per hospitalization episode.

---

### IR-21: Route of Administration Optional Status Not Clear in Specs

**Conflict:** `01_specs.md` §3.4 listed route of administration without clarifying it's optional, while `02_domain.md` and `04_use_cases.md` explicitly state it's optional.

**Resolution:** Added "Route of administration is optional" to `01_specs.md` §3.4.

**Files Updated:**
- `01_specs.md` — Added optional clarification

**Rationale:** Alignment with domain model and use case validations.

---

### IR-22: Psychiatric History Fields List Shorter in Specs

**Conflict:** `01_specs.md` §3.3 listed 6 fields but `02_domain.md` defines 12+ fields for PsychiatricHistory.

**Resolution:** Updated specs to reference "additional clinical background sections as detailed in the domain model."

**Files Updated:**
- `01_specs.md` — Broadened §3.3 field description

**Rationale:** Specs provide overview; domain model provides complete detail.

---

### IR-23: Missing Use Case for Editing Patient Demographics

**Conflict:** `01_specs.md` §3.1 states patients can be "edited" but no use case documented this capability.

**Resolution:** Added UC-01B for editing patient information, including status changes (active/inactive).

**Files Updated:**
- `04_use_cases.md` — Added UC-01B and updated summary table

**Rationale:** Capability was in specs; use case needed for completeness.

---

## Verification Checklist

- [x] All documents are logically consistent
- [x] Clinical timeline concept remains coherent
- [x] MVP scope has not expanded
- [x] No new features introduced (UC-01B documents existing capability)
- [x] No new domain entities added
- [x] Event types match across all documents
- [x] Medication fields match across all documents
- [x] All specs capabilities have corresponding use cases

---

*Document Version: 1.2*
*Status: Final*
*Updated: Third resolution pass (complete cross-reference analysis)*

