# Psychiatric Medical Records System — Patient CRUD Functional Specifications

## Overview

This document defines the functional specifications for the Patient CRUD (Create, Read, Update, Delete) module in the Psychiatric Medical Records System MVP.

This document specifies **WHAT** the Patient CRUD does, not **HOW** it is implemented.

The Patient CRUD module is responsible exclusively for patient identity and administrative information management. It does not handle clinical data, which is managed by the Timeline Engine and ClinicalRecord entities.

---

## 1. Purpose of the Patient Module

### 1.1 Why the Patient Entity Exists

The Patient entity serves as the primary aggregation root for the entire clinical record system. Every piece of clinical information in the system is associated with a Patient.

The Patient entity exists to:

- **Establish patient identity** — Provide a stable, unique identifier for each individual receiving care
- **Enable clinical data organization** — Serve as the anchor point around which all clinical documentation is structured
- **Support patient lookup** — Allow the clinician to locate and access a specific patient's clinical record
- **Maintain administrative information** — Store contact details and emergency information needed for clinical operations

### 1.2 Role in the Overall System

The Patient module is the entry point to the clinical record system:

1. **Before clinical documentation can begin**, a Patient must exist
2. **All clinical entities** (Notes, Medications, ClinicalEvents, PsychiatricHistory) are associated with a Patient through the ClinicalRecord
3. **Patient search** is the primary mechanism for accessing clinical records
4. **Patient status** (active/inactive) controls visibility but does not affect clinical data accessibility

The Patient module operates independently from clinical data management. Changes to patient demographic information do not affect clinical documentation, and clinical events do not modify patient identity information.

### 1.3 Relationship to the Clinical Timeline

The Patient module has a **strict boundary** with the Timeline Engine:

- **Patient creation does NOT generate timeline events** — Patient registration is an administrative action, not a clinical occurrence
- **Patient updates do NOT generate timeline events** — Demographic changes are not clinically significant events
- **Patient status changes do NOT generate timeline events** — Activating or deactivating a patient is administrative, not clinical
- **The Timeline Engine never modifies Patient data** — Clinical events are read-only with respect to patient identity

The Patient module creates and manages the ClinicalRecord container, but the Timeline Engine owns all content within that container.

---

## 2. Patient Entity Definition (Functional)

### 2.1 What a Patient Represents

A Patient represents an individual receiving psychiatric care from the clinician.

The Patient entity captures:
- **Identity information** — Who the patient is
- **Administrative information** — How to contact the patient and their emergency contact
- **System state** — Whether the patient is currently active in the system

The Patient entity does **NOT** represent:
- Clinical observations or assessments
- Treatment history or medication records
- Encounter documentation
- Psychiatric background information

### 2.2 Identifying Information

Identifying information is data that uniquely identifies the patient:

| Field | Purpose | Immutability |
|-------|---------|--------------|
| **Identifier** | System-assigned unique identifier | Immutable once assigned |
| **Full name** | Legal name of the patient | Mutable (name changes are permitted) |
| **Date of birth** | Birth date of the patient | Mutable (corrections are permitted) |

**Rationale:** The identifier is immutable to maintain referential integrity. Name and date of birth may change due to legal name changes or data entry corrections.

### 2.3 Administrative Information

Administrative information supports clinical operations but is not part of the clinical record:

| Field | Purpose | Required |
|-------|---------|----------|
| **Contact phone** | Primary phone number for patient contact | Optional |
| **Contact email** | Primary email address for patient contact | Optional |
| **Address** | Residential address | Optional |
| **Emergency contact name** | Full name of emergency contact person | Optional |
| **Emergency contact phone** | Phone number of emergency contact | Required if emergency contact name is provided |
| **Emergency contact relationship** | Relationship of emergency contact to patient | Optional |

**Rationale:** Contact information may change frequently and does not affect clinical documentation. Emergency contact information is required only when an emergency contact is specified.

### 2.4 System State Information

System state tracks the patient's operational status:

| Field | Purpose | Values |
|-------|---------|--------|
| **Status** | Whether patient is currently active | Active, Inactive |
| **Registration date** | When patient was first registered | Immutable timestamp |
| **Created at** | System timestamp of record creation | Immutable |
| **Updated at** | System timestamp of last modification | Auto-updated |

**Rationale:** Status allows filtering active patients from inactive ones. Timestamps provide audit information but are not part of clinical history.

### 2.5 What Is Explicitly NOT Part of the Patient Entity

The following information is **explicitly excluded** from the Patient entity:

- **Clinical observations** — Stored in Notes
- **Medication records** — Stored in Medication entities
- **Psychiatric history** — Stored in PsychiatricHistory versions
- **Clinical events** — Stored in ClinicalEvent entities
- **Encounter documentation** — Stored in Note entities
- **Treatment plans** — Stored in Note Plan sections
- **Assessment information** — Stored in Note Assessment sections

**Boundary Principle:** The Patient entity contains only identity and administrative data. All clinical information lives in the ClinicalRecord and its contained entities.

---

## 3. Create Patient

### 3.1 Purpose

Create Patient establishes a new patient identity in the system and initializes their clinical record container.

### 3.2 Required Fields

The following fields must be provided to create a patient:

| Field | Validation Rule |
|-------|----------------|
| **Full name** | Cannot be empty. Must contain at least one non-whitespace character. |
| **Date of birth** | Must be a valid date. Cannot be in the future. |

### 3.3 Optional Fields

The following fields may be provided but are not required:

- Contact phone
- Contact email
- Address
- Emergency contact name
- Emergency contact phone (required if emergency contact name is provided)
- Emergency contact relationship

### 3.4 Validation Rules

| Field | Validation |
|-------|------------|
| **Full name** | Required. Non-empty after trimming whitespace. |
| **Date of birth** | Required. Valid calendar date. Must be ≤ current date. |
| **Contact phone** | Optional. If provided, must be a valid phone number format (format validation is implementation-specific). |
| **Contact email** | Optional. If provided, must be a valid email format. |
| **Emergency contact name** | Optional. |
| **Emergency contact phone** | Conditional. Required if emergency contact name is provided. Must be a valid phone number format if provided. |

### 3.5 Error Conditions

| Condition | System Behavior |
|-----------|----------------|
| Missing full name | Creation is blocked. Error message indicates full name is required. |
| Missing date of birth | Creation is blocked. Error message indicates date of birth is required. |
| Invalid date format | Creation is blocked. Error message requests valid date format. |
| Future date of birth | Creation is blocked. Error message indicates date cannot be in the future. |
| Invalid email format | Creation is blocked. Error message indicates invalid email format. |
| Invalid phone format | Creation is blocked. Error message indicates invalid phone format. |
| Emergency contact name without phone | Creation is blocked. Error message indicates emergency contact phone is required when name is provided. |

### 3.6 What Happens After Creation

Upon successful patient creation:

1. **Patient record is created** with:
   - System-generated unique identifier
   - Status set to Active
   - Registration date set to current timestamp
   - Created at timestamp set to current time
   - Updated at timestamp set to current time

2. **ClinicalRecord is automatically created** and linked to the Patient (1:1 relationship)

3. **Initial PsychiatricHistory (version 1) is automatically created** within the ClinicalRecord with all content fields empty (to be populated during initial evaluation)

4. **Patient becomes searchable** — The patient appears in search results immediately

5. **Patient is available for clinical documentation** — Notes, medications, and other clinical entities can be created

### 3.7 Timeline Event Generation

**Patient creation does NOT generate timeline events.**

**Rationale:** Patient registration is an administrative action, not a clinical occurrence. The Timeline Engine only tracks clinically significant events (encounters, medication changes, hospitalizations, etc.). Administrative actions like patient registration, demographic updates, and status changes are outside the timeline scope.

**Explicit Guarantee:** No ClinicalEvent is created when a Patient is created.

---

## 4. Read / View Patient

### 4.1 Purpose

Read Patient retrieves patient identity and administrative information for display or processing.

### 4.2 How a Patient Can Be Retrieved

A patient can be retrieved by:

1. **Direct identifier lookup** — Using the patient's unique identifier
2. **Search by criteria** — Using name, date of birth, or identifier (see Section 5)
3. **List all patients** — Retrieving all patients in the system

### 4.3 What Information Is Returned

When a patient is retrieved, the following information is returned:

| Field | Included | Rationale |
|-------|----------|-----------|
| Identifier | Yes | Required for all operations |
| Full name | Yes | Primary identifying information |
| Date of birth | Yes | Primary identifying information |
| Contact phone | Yes | Administrative information |
| Contact email | Yes | Administrative information |
| Address | Yes | Administrative information |
| Emergency contact name | Yes | Administrative information |
| Emergency contact phone | Yes | Administrative information |
| Emergency contact relationship | Yes | Administrative information |
| Status | Yes | System state information |
| Registration date | Yes | Audit information |
| Created at | Yes | Audit information |
| Updated at | Yes | Audit information |

### 4.4 What Information Is Excluded

The following information is **explicitly excluded** from patient read operations:

- **ClinicalRecord contents** — Notes, medications, events are not included
- **PsychiatricHistory content** — History versions are not included
- **Timeline events** — Clinical events are not included
- **Appointments** — Appointment records are not included

**Rationale:** Patient read operations return only patient identity and administrative data. Clinical data is accessed through separate ClinicalRecord operations.

### 4.5 Guarantees Provided

| Guarantee | Description |
|-----------|-------------|
| **Consistency** | Multiple reads of the same patient return identical data (unless modified between reads) |
| **Freshness** | Read operations return the current state of patient data as of the read time |
| **Completeness** | All patient fields are included in the response (null values for optional fields) |
| **Existence validation** | Reading a non-existent patient returns an explicit error, not null or empty data |

### 4.6 Error Conditions

| Condition | System Behavior |
|-----------|----------------|
| Patient does not exist | Returns explicit error: Patient not found |
| Invalid identifier format | Returns explicit error: Invalid identifier |

---

## 5. Search / List Patients

### 5.1 Purpose

Search Patient allows the clinician to locate existing patients by various criteria. List Patients provides access to all patients in the system.

### 5.2 Supported Search Criteria (MVP Only)

The MVP supports the following search criteria:

| Criterion | Matching Behavior |
|-----------|------------------|
| **Full name** | Partial match (substring search). Case-insensitive. Matches anywhere within the name. |
| **Date of birth** | Exact match. Must match the complete date. |
| **Patient identifier** | Exact match. Must match the complete identifier. |

**Combination:** Multiple criteria can be combined (e.g., name AND date of birth). All specified criteria must match for a patient to be included in results.

### 5.3 Sorting and Ordering Rules

Search results are ordered as follows:

1. **Primary sort:** Status (Active patients before Inactive patients)
2. **Secondary sort:** Full name (alphabetical, case-insensitive)
3. **Tertiary sort:** Registration date (most recently registered first)

**Rationale:** Active patients are most relevant for daily operations. Alphabetical ordering provides predictable navigation. Recent registrations may be more relevant than older ones.

### 5.4 Expected Behavior with Partial Matches

| Scenario | Behavior |
|----------|----------|
| **Name partial match** | "Mar" matches "María", "Martínez", "Marco" |
| **Name case variation** | "maria" matches "María", "MARIA", "Maria" |
| **No matches found** | Returns empty result set (not an error condition) |
| **Multiple matches** | All matching patients are returned, ordered per sorting rules |

### 5.5 Explicit Non-Goals

The following search capabilities are **explicitly excluded** from the MVP:

- **Fuzzy search** — No typo tolerance or approximate matching
- **Full-text search** — No search across clinical content (Notes, medications, etc.)
- **Phonetic matching** — No soundex or similar phonetic algorithms
- **Advanced filters** — No filtering by registration date range, status combinations, etc.
- **Search history** — No saved searches or recent searches
- **Search suggestions** — No autocomplete or suggestion features

**Rationale:** MVP focuses on basic patient lookup. Advanced search features are deferred to post-MVP.

### 5.6 List All Patients

When no search criteria are provided, the system returns all patients in the system, ordered by the same sorting rules as search results.

**Use case:** The clinician may want to browse all patients or see the complete patient registry.

**Performance consideration:** For large patient registries, pagination may be necessary, but pagination strategy is an implementation detail, not a functional requirement.

---

## 6. Update Patient

### 6.1 Purpose

Update Patient allows modification of patient demographic and administrative information.

### 6.2 What Patient Data Can Be Updated

The following fields can be updated:

| Field | Update Allowed | Notes |
|-------|----------------|-------|
| Full name | Yes | Name changes (legal name changes, corrections) |
| Date of birth | Yes | Corrections to originally entered date |
| Contact phone | Yes | Phone number updates |
| Contact email | Yes | Email address updates |
| Address | Yes | Address changes |
| Emergency contact name | Yes | Emergency contact updates |
| Emergency contact phone | Yes | Emergency contact phone updates |
| Emergency contact relationship | Yes | Relationship updates |
| Status | Yes | Activate or deactivate patient |

### 6.3 What Is Immutable

The following fields **cannot be updated**:

| Field | Immutability Rationale |
|-------|------------------------|
| **Identifier** | Referential integrity. All clinical data references this identifier. |
| **Registration date** | Historical record of when patient entered the system. |
| **Created at** | Audit timestamp. |
| **Updated at** | System-managed. Automatically updated on any modification. |

### 6.4 Validation and Error Scenarios

Update operations use the same validation rules as Create operations:

| Validation | Error Behavior |
|-----------|----------------|
| Full name becomes empty | Update is blocked. Error message indicates full name is required. |
| Date of birth becomes invalid | Update is blocked. Error message indicates invalid date. |
| Date of birth becomes future date | Update is blocked. Error message indicates date cannot be in the future. |
| Invalid email format | Update is blocked. Error message indicates invalid email format. |
| Invalid phone format | Update is blocked. Error message indicates invalid phone format. |
| Emergency contact name without phone | Update is blocked. Error message indicates emergency contact phone is required. |
| Patient does not exist | Update is blocked. Error message indicates patient not found. |

### 6.5 Impact on Clinical Data

**Patient updates do NOT affect clinical data.**

| Aspect | Behavior |
|--------|----------|
| **ClinicalRecord** | Unchanged. All clinical data remains intact. |
| **Timeline events** | No events are generated. Patient updates are not clinical events. |
| **Notes** | Unchanged. All encounter documentation remains intact. |
| **Medications** | Unchanged. All medication records remain intact. |
| **PsychiatricHistory** | Unchanged. All history versions remain intact. |

**Explicit Guarantee:** Updating patient demographic information is completely independent from clinical documentation. The two domains do not interact.

### 6.6 Status Change Behavior

When patient status is changed:

| Change | Behavior |
|--------|----------|
| **Active → Inactive** | Patient is marked inactive. Clinical record remains fully accessible. Patient appears in search results but is visually distinguished as inactive. |
| **Inactive → Active** | Patient is reactivated. Full access to clinical record is restored. Patient appears as active in search results. |

**Rationale:** Status is a visibility and workflow marker, not a data access control. Inactive patients retain full clinical history for legal and clinical reasons.

---

## 7. Delete / Archive Patient

### 7.1 Deletion Policy

**Patient deletion is NOT allowed in the MVP.**

**Rationale:** 
- Medical records must be retained for legal and clinical reasons
- Deleting a patient would require cascading deletion of all clinical data, which violates immutability principles
- Historical clinical data must remain accessible even if a patient is no longer active

### 7.2 Alternative: Deactivation

Instead of deletion, patients are **deactivated**:

1. Patient status is set to Inactive
2. Patient remains in the system
3. All clinical data remains accessible
4. Patient appears in search results but is distinguished as inactive

**Use cases for deactivation:**
- Patient has moved and is no longer receiving care
- Patient has transferred to another provider
- Patient has passed away (clinical record must be retained)
- Patient has requested to discontinue care

### 7.3 Impact on Historical Clinical Data

When a patient is deactivated:

| Clinical Data | Impact |
|---------------|--------|
| **ClinicalRecord** | Remains fully accessible |
| **All Notes** | Remain accessible and immutable |
| **All Medications** | Remain accessible and immutable |
| **All ClinicalEvents** | Remain accessible and immutable |
| **All PsychiatricHistory versions** | Remain accessible and immutable |
| **Timeline** | Remains fully queryable |

**Explicit Guarantee:** Deactivation does not affect any clinical data. All historical documentation remains intact and accessible.

### 7.4 Safety Rules

The following safety rules apply to patient deactivation:

| Rule | Rationale |
|------|-----------|
| **Deactivation is reversible** | Patients can be reactivated if they return to care |
| **No data is hidden** | Inactive patients' clinical records are fully visible |
| **No timeline events are generated** | Status change is administrative, not clinical |
| **No clinical data is modified** | All clinical documentation remains unchanged |

### 7.5 Explicit Non-Goals

The following capabilities are **explicitly excluded**:

- **Hard deletion** — No mechanism to permanently remove patients
- **Data archival** — No separate archival system for inactive patients
- **Data export on deactivation** — No automatic export when patient is deactivated
- **Retention policy enforcement** — No automatic deletion based on time or other criteria

**Rationale:** MVP focuses on deactivation as the sole mechanism for managing patient lifecycle. Advanced data management features are outside scope.

---

## 8. Integration with Timeline Engine

### 8.1 How the Patient Module Interacts with the Timeline Engine

The Patient module and Timeline Engine have a **strict separation of concerns**:

| Operation | Patient Module Responsibility | Timeline Engine Responsibility |
|-----------|------------------------------|-------------------------------|
| **Patient creation** | Creates Patient and ClinicalRecord | No involvement. No events generated. |
| **Patient update** | Updates patient demographic data | No involvement. No events generated. |
| **Patient deactivation** | Updates patient status | No involvement. No events generated. |
| **Clinical documentation** | Provides patient identifier for lookup | Generates and manages all clinical events |
| **Timeline queries** | Provides patient identifier | Returns timeline events for that patient |

**Boundary Principle:** The Patient module manages identity. The Timeline Engine manages clinical history. They interact only through the patient identifier.

### 8.2 What the Patient Module Must NEVER Do

The Patient module must **NEVER**:

- **Generate timeline events** — Patient operations are administrative, not clinical
- **Modify clinical data** — Patient updates do not touch Notes, Medications, or Events
- **Query timeline data** — Patient module does not read clinical events
- **Depend on timeline state** — Patient operations are independent of clinical documentation

### 8.3 Boundaries Between Identity Management and Clinical History

| Domain | Owned By | Contains |
|--------|----------|----------|
| **Patient Identity** | Patient Module | Name, DOB, contact info, status |
| **Clinical History** | Timeline Engine | Events, notes, medications, psychiatric history |
| **Container** | Patient Module (creates) | ClinicalRecord (structure only) |
| **Container Contents** | Timeline Engine (manages) | All clinical entities within ClinicalRecord |

**Integration Point:** The ClinicalRecord is created by the Patient module but immediately becomes the domain of the Timeline Engine. The Patient module never modifies ClinicalRecord contents.

### 8.4 Explicit Guarantees

| Guarantee | Description |
|-----------|-------------|
| **No event generation** | Patient CRUD operations never create ClinicalEvents |
| **No clinical data access** | Patient module does not read or modify clinical entities |
| **Independent operations** | Patient updates succeed regardless of clinical record state |
| **Identifier stability** | Patient identifier never changes, ensuring Timeline Engine references remain valid |

---

## 9. UX & Language Constraints

### 9.1 UX Expectations Related to Patient CRUD (Conceptual)

The following UX expectations apply to patient CRUD operations:

| Operation | UX Expectation |
|-----------|----------------|
| **Create Patient** | Clear form with required fields indicated. Validation errors shown inline. Success confirmation displayed. |
| **Search Patient** | Search input with immediate feedback. Results displayed in list format. Empty state shown when no results. |
| **View Patient** | Patient information displayed in readable format. Clear distinction between identity and administrative information. |
| **Update Patient** | Editable form pre-populated with current values. Changes saved explicitly (not auto-save). Success confirmation displayed. |
| **Deactivate Patient** | Confirmation dialog before deactivation. Clear indication of what deactivation means (data remains accessible). |

**Note:** These are functional expectations, not UI specifications. Implementation details (layout, styling, components) are outside this document's scope.

### 9.2 Spanish Language Requirements

**All user-facing text in Patient CRUD operations MUST be in Spanish.**

This includes:

| Text Type | Examples |
|-----------|----------|
| **Labels** | "Nombre completo", "Fecha de nacimiento", "Teléfono de contacto" |
| **Buttons** | "Crear paciente", "Buscar", "Guardar cambios", "Desactivar" |
| **Messages** | "Paciente creado exitosamente", "Paciente no encontrado" |
| **Validation errors** | "El nombre completo es requerido", "La fecha no puede ser futura" |
| **Empty states** | "No se encontraron pacientes", "No hay pacientes registrados" |
| **Status indicators** | "Activo", "Inactivo" |

**Exceptions:**
- Internal code identifiers may remain in English
- Database field names are not affected
- System-generated identifiers are not translated
- Technical error codes (for debugging) may be in English

### 9.3 Error and Empty-State Expectations (Conceptual)

| Scenario | Expected Behavior |
|----------|------------------|
| **Validation error** | Clear message in Spanish explaining what is wrong and how to fix it |
| **Patient not found** | Explicit message: "Paciente no encontrado" (not a generic error) |
| **Empty search results** | Message: "No se encontraron pacientes que coincidan con la búsqueda" |
| **No patients in system** | Message: "No hay pacientes registrados. Cree su primer paciente." |
| **Network/system error** | Generic error message in Spanish. Technical details logged but not shown to user. |

**Rationale:** Users must understand what went wrong and what they can do about it. Empty states should guide users toward next actions.

---

## 10. Non-Goals & Exclusions

### 10.1 What Patient CRUD Will NOT Handle in MVP

The following capabilities are **explicitly excluded** from the Patient CRUD module in the MVP:

| Excluded Capability | Rationale |
|---------------------|-----------|
| **Duplicate patient detection** | MVP does not prevent or detect duplicate patient registrations. Clinician is responsible for checking before creation. |
| **Patient merge** | No mechanism to merge duplicate patient records. |
| **Bulk patient operations** | No import/export, bulk update, or batch operations. |
| **Patient history/audit trail** | No tracking of who changed what patient data and when (beyond updated_at timestamp). |
| **Patient photos or documents** | No file attachments or image storage. |
| **Patient tags or categories** | No custom labeling or categorization system. |
| **Patient notes/comments** | No free-form administrative notes about patients. |
| **Insurance information** | No insurance details, policy numbers, or coverage information. |
| **Billing information** | No payment methods, billing addresses, or financial data. |
| **Patient preferences** | No storage of patient communication preferences or special instructions. |
| **Advanced search** | No fuzzy matching, phonetic search, or full-text search across clinical content. |
| **Patient relationships** | No tracking of family relationships or guardian information beyond emergency contact. |
| **Patient demographics beyond basics** | No gender, ethnicity, preferred language, or other demographic fields. |
| **Patient consent tracking** | No consent forms, consent dates, or consent management. |
| **Patient portal integration** | No patient-facing access or self-service capabilities. |
| **External system integration** | No import from EHRs, no export to other systems, no API for external access. |
| **Data migration tools** | No utilities to migrate patient data from other systems. |
| **Patient data validation against external sources** | No verification against government databases, insurance records, etc. |
| **Multi-language patient names** | No special handling for names in non-Latin scripts (stored as-is). |
| **Patient data encryption beyond standard** | No field-level encryption or special security beyond standard database security. |

### 10.2 Clinical Data Exclusions

The Patient CRUD module explicitly does NOT handle:

- **Clinical documentation** — Notes, assessments, plans
- **Medication management** — Prescribing, tracking, discontinuing medications
- **Timeline events** — Creating, viewing, or modifying clinical events
- **Psychiatric history** — Creating or updating history versions
- **Encounter documentation** — Creating or finalizing clinical notes
- **Treatment planning** — No treatment plan entities or planning tools

**Boundary:** All clinical data is managed by the Timeline Engine and ClinicalRecord entities, not by the Patient CRUD module.

### 10.3 Post-MVP Considerations

The following capabilities may be considered for post-MVP but are explicitly out of scope:

- Advanced duplicate detection algorithms
- Patient data import/export
- Patient audit trail with change history
- Integration with external patient registries
- Advanced demographic data collection
- Patient portal functionality

---

## Summary

The Patient CRUD module is responsible for:

1. **Creating patient identities** — Registering new patients and initializing their clinical record containers
2. **Retrieving patient information** — Providing access to patient identity and administrative data
3. **Searching patients** — Enabling patient lookup by name, date of birth, or identifier
4. **Updating patient data** — Modifying demographic and contact information
5. **Deactivating patients** — Marking patients as inactive without deleting data

The module operates with **strict boundaries**:

- **No timeline event generation** — Patient operations are administrative, not clinical
- **No clinical data access** — Patient module does not read or modify clinical entities
- **No data deletion** — Patients are deactivated, never deleted
- **Spanish-only UX** — All user-facing text must be in Spanish

The Patient CRUD module can be implemented independently of clinical data management, with integration occurring only through the patient identifier shared between systems.

---

*Document Version: 1.0*  
*Status: Final*  
*Depends On: 01_specs.md, 02_domain.md, 04_use_cases.md, 13_timeline_engine.md, 14_timeline_contracts.md, 15_timeline_qa_invariants.md, 08_agent_policy.md*  
*Consumed By: Backend Implementation, UX Implementation, QA Testing*
