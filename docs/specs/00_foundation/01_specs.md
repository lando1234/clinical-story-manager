# Psychiatric Medical Records System — Functional Specifications (MVP)

## 1. System Purpose

This system serves as a longitudinal clinical record management tool for a single psychiatrist in private practice.

The primary function is to capture, organize, and retrieve patient clinical information across time.

The system preserves the narrative continuity of each patient's psychiatric history.

It enables the clinician to document encounters, track treatment evolution, and maintain a structured clinical timeline.

---

## 2. Clinical Problems Solved

### 2.1 Fragmented Patient History

Psychiatric treatment spans months or years. Clinical notes become scattered across files, formats, and time periods. This system consolidates all patient information into a single, chronologically organized record.

### 2.2 Loss of Narrative Continuity

Mental health treatment relies on understanding patterns, triggers, and responses over time. The system preserves the patient's story as a continuous thread rather than isolated snapshots.

### 2.3 Difficulty Tracking Treatment Evolution

Medication changes, dosage adjustments, and therapeutic interventions accumulate. The system provides clear visibility into what was tried, when, and with what outcome.

### 2.4 Time-Consuming Information Retrieval

Locating specific past events, medications, or clinical observations requires manual search through extensive records. The system enables rapid access to relevant historical data.

### 2.5 Inconsistent Documentation Structure

Without a defined format, clinical notes vary in completeness and organization. The system provides consistent structure while preserving clinical flexibility.

---

## 3. MVP Scope

### 3.1 Patient Registry

The system maintains a registry of patients with basic demographic and contact information.

Each patient record contains: full name, date of birth, contact information, and emergency contact.

Patients can be added, edited, and marked as inactive.

### 3.2 Clinical Encounters

Each patient visit is recorded as a discrete clinical encounter.

An encounter includes: date, encounter type, subjective observations, objective findings, assessment, and plan.

Encounters are immutable once finalized. Amendments are recorded as separate addendum entries.

### 3.3 Psychiatric History

The system captures a structured initial psychiatric history for each patient.

This includes: chief complaint, history of present illness, past psychiatric history, substance use history, family psychiatric history, medical history, and additional clinical background sections as detailed in the domain model.

The psychiatric history can be updated but all versions are retained.

### 3.4 Medication Record

The system tracks current and past psychiatric medications.

Each medication entry includes: drug name, dosage, dosage unit, frequency, start date, end date, prescribing reason, and discontinuation reason. Route of administration is optional.

The medication list reflects the complete pharmacological timeline.

### 3.5 Clinical Timeline

All clinical events are presented in chronological order.

The timeline includes encounters, medication changes, and significant clinical events.

The clinician can navigate the timeline to any point in the patient's history.

### 3.6 Search and Retrieval

The system supports patient lookup by name, date of birth, or identifier.

Within a selected patient's record, text-based search is available across all clinical content.

Search results display relevant excerpts with temporal context.

---

## 4. Explicit Assumptions

### 4.1 Single User

The system is designed for one clinician. There is no concurrent access by multiple users.

### 4.2 Single Device Context

The clinician accesses the system from a single workstation or device at a time.

### 4.3 Manual Data Entry

All clinical data is entered manually by the clinician. There is no automated data capture.

### 4.4 Local Data Persistence

Patient data is stored locally. The clinician is responsible for data backup procedures.

### 4.5 Clinical Competence

The system assumes the user is a licensed psychiatrist who understands clinical documentation standards.

### 4.6 Patient Consent

The clinician has obtained appropriate consent for maintaining electronic records. Consent management is outside the system.

### 4.7 Stable Terminology

Medication names and clinical terms follow standard psychiatric nomenclature. The system does not validate clinical terminology.

---

## 5. Explicit Limitations (Out of Scope)

### 5.1 User Authentication and Roles

The MVP does not include login systems, user accounts, or role-based access control.

### 5.2 External Integrations

There is no integration with pharmacies, laboratories, hospitals, or other clinical systems.

### 5.3 Prescription Generation

The system does not generate, transmit, or manage prescriptions. It only documents medications.

### 5.4 Billing and Insurance

There are no billing codes, insurance claims, or financial tracking features.

### 5.5 Appointment Scheduling

Full appointment scheduling with calendar management, conflict detection, and automated reminders is outside MVP scope.

The system supports minimal recording of intended next encounter dates (see UC-05).

### 5.6 Patient Portal

Patients do not have access to the system. There is no patient-facing interface.

### 5.7 Regulatory Compliance Automation

The system does not automatically enforce HIPAA, state regulations, or documentation requirements. Compliance is the clinician's responsibility.

### 5.8 Clinical Decision Support

There are no alerts, drug interaction checks, or diagnostic suggestions.

### 5.9 Reporting and Analytics

The MVP does not include statistical reports, outcome tracking, or population-level analytics.

### 5.10 Data Migration

There is no automated import from other systems. Historical records must be entered manually.

### 5.11 Mobile Access

The system is not designed for mobile devices or tablets.

### 5.12 Offline Synchronization

There is no cloud synchronization or multi-device data sharing.

---

*Document Version: 1.0*  
*Status: Draft*  
*Scope: Minimum Viable Product*

