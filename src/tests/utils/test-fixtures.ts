/**
 * Test Fixtures - Factory functions for creating test data
 *
 * These functions create entities directly in the test database.
 * Used by invariant tests to set up specific test scenarios.
 */

import { testPrisma } from "../setup";
import {
  Patient,
  ClinicalRecord,
  Note,
  Medication,
  PsychiatricHistory,
  ClinicalEvent,
  Addendum,
  Appointment,
  PatientStatus,
  NoteStatus,
  MedicationStatus,
  EncounterType,
  ClinicalEventType,
  SourceType,
  AppointmentType,
  AppointmentStatus,
  Prisma,
} from "@/generated/prisma";

// =============================================================================
// PATIENT FIXTURES
// =============================================================================

export interface CreatePatientOptions {
  id?: string;
  fullName?: string;
  dateOfBirth?: Date;
  status?: PatientStatus;
}

/**
 * Creates a test patient with optional overrides.
 */
export async function createTestPatient(
  options: CreatePatientOptions = {}
): Promise<Patient> {
  const patient = await testPrisma.patient.create({
    data: {
      id: options.id,
      fullName: options.fullName ?? "Test Patient",
      dateOfBirth: options.dateOfBirth ?? new Date("1990-01-01"),
      status: options.status ?? PatientStatus.Active,
    },
  });
  return patient;
}

// =============================================================================
// CLINICAL RECORD FIXTURES
// =============================================================================

/**
 * Creates a clinical record for a patient.
 * Every patient should have exactly one clinical record.
 */
export async function createTestClinicalRecord(
  patientId: string,
  id?: string
): Promise<ClinicalRecord> {
  const clinicalRecord = await testPrisma.clinicalRecord.create({
    data: {
      id,
      patientId,
    },
  });
  return clinicalRecord;
}

/**
 * Creates a patient with an associated clinical record.
 * This is the typical setup for most tests.
 */
export async function createTestPatientWithRecord(
  options: CreatePatientOptions = {}
): Promise<{ patient: Patient; clinicalRecord: ClinicalRecord }> {
  const patient = await createTestPatient(options);
  const clinicalRecord = await createTestClinicalRecord(patient.id);
  return { patient, clinicalRecord };
}

// =============================================================================
// PSYCHIATRIC HISTORY FIXTURES
// =============================================================================

export interface CreatePsychiatricHistoryOptions {
  id?: string;
  clinicalRecordId: string;
  versionNumber?: number;
  chiefComplaint?: string;
  isCurrent?: boolean;
  createdAt?: Date;
  supersededAt?: Date | null;
}

/**
 * Creates a psychiatric history version.
 */
export async function createTestPsychiatricHistory(
  options: CreatePsychiatricHistoryOptions
): Promise<PsychiatricHistory> {
  const history = await testPrisma.psychiatricHistory.create({
    data: {
      id: options.id,
      clinicalRecordId: options.clinicalRecordId,
      versionNumber: options.versionNumber ?? 1,
      chiefComplaint: options.chiefComplaint ?? "Test chief complaint",
      isCurrent: options.isCurrent ?? true,
      createdAt: options.createdAt,
      supersededAt: options.supersededAt,
    },
  });
  return history;
}

// =============================================================================
// NOTE FIXTURES
// =============================================================================

export interface CreateNoteOptions {
  id?: string;
  clinicalRecordId: string;
  encounterDate?: Date;
  encounterType?: EncounterType;
  status?: NoteStatus;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  createdAt?: Date;
  finalizedAt?: Date | null;
}

/**
 * Creates a clinical note.
 */
export async function createTestNote(
  options: CreateNoteOptions
): Promise<Note> {
  const note = await testPrisma.note.create({
    data: {
      id: options.id,
      clinicalRecordId: options.clinicalRecordId,
      encounterDate: options.encounterDate ?? new Date(),
      encounterType: options.encounterType ?? EncounterType.FollowUp,
      status: options.status ?? NoteStatus.Draft,
      subjective: options.subjective ?? "Test subjective",
      objective: options.objective ?? "Test objective",
      assessment: options.assessment ?? "Test assessment",
      plan: options.plan ?? "Test plan",
      createdAt: options.createdAt,
      finalizedAt: options.finalizedAt,
    },
  });
  return note;
}

/**
 * Creates a finalized note (ready for timeline events).
 */
export async function createTestFinalizedNote(
  options: Omit<CreateNoteOptions, "status" | "finalizedAt">
): Promise<Note> {
  return createTestNote({
    ...options,
    status: NoteStatus.Finalized,
    finalizedAt: new Date(),
  });
}

// =============================================================================
// ADDENDUM FIXTURES
// =============================================================================

export interface CreateAddendumOptions {
  id?: string;
  noteId: string;
  content?: string;
  reason?: string;
  createdAt?: Date;
}

/**
 * Creates an addendum for a note.
 */
export async function createTestAddendum(
  options: CreateAddendumOptions
): Promise<Addendum> {
  const addendum = await testPrisma.addendum.create({
    data: {
      id: options.id,
      noteId: options.noteId,
      content: options.content ?? "Test addendum content",
      reason: options.reason ?? "Correction",
      createdAt: options.createdAt,
    },
  });
  return addendum;
}

// =============================================================================
// MEDICATION FIXTURES
// =============================================================================

export interface CreateMedicationOptions {
  id?: string;
  clinicalRecordId: string;
  drugName?: string;
  dosage?: number | Prisma.Decimal;
  dosageUnit?: string;
  frequency?: string;
  prescriptionIssueDate?: Date;
  endDate?: Date | null;
  comments?: string | null;
  discontinuationReason?: string | null;
  status?: MedicationStatus;
  predecessorId?: string | null;
  createdAt?: Date;
}

/**
 * Creates a medication record.
 */
export async function createTestMedication(
  options: CreateMedicationOptions
): Promise<Medication> {
  const medication = await testPrisma.medication.create({
    data: {
      id: options.id,
      clinicalRecordId: options.clinicalRecordId,
      drugName: options.drugName ?? "Sertraline",
      dosage: options.dosage ?? 50,
      dosageUnit: options.dosageUnit ?? "mg",
      frequency: options.frequency ?? "once daily",
      prescriptionIssueDate: options.prescriptionIssueDate ?? new Date(),
      endDate: options.endDate,
      comments: options.comments ?? "Depression",
      discontinuationReason: options.discontinuationReason,
      status: options.status ?? MedicationStatus.Active,
      predecessorId: options.predecessorId,
      createdAt: options.createdAt,
    },
  });
  return medication;
}

/**
 * Creates a discontinued medication.
 */
export async function createTestDiscontinuedMedication(
  options: Omit<CreateMedicationOptions, "status" | "endDate" | "discontinuationReason"> & {
    endDate: Date;
    discontinuationReason?: string;
  }
): Promise<Medication> {
  return createTestMedication({
    ...options,
    status: MedicationStatus.Discontinued,
    discontinuationReason: options.discontinuationReason ?? "Completed treatment",
  });
}

// =============================================================================
// CLINICAL EVENT FIXTURES
// =============================================================================

export interface CreateEventOptions {
  id?: string;
  clinicalRecordId: string;
  eventDate?: Date;
  eventType?: ClinicalEventType;
  title?: string;
  description?: string | null;
  sourceType?: SourceType | null;
  sourceId?: string | null;
  noteId?: string | null;
  medicationId?: string | null;
  psychiatricHistoryId?: string | null;
  recordedAt?: Date;
}

/**
 * Creates a clinical event on the timeline.
 */
export async function createTestEvent(
  options: CreateEventOptions
): Promise<ClinicalEvent> {
  const event = await testPrisma.clinicalEvent.create({
    data: {
      id: options.id,
      clinicalRecordId: options.clinicalRecordId,
      eventDate: options.eventDate ?? new Date(),
      eventType: options.eventType ?? ClinicalEventType.Other,
      title: options.title ?? "Test Event",
      description: options.description,
      sourceType: options.sourceType,
      sourceId: options.sourceId,
      noteId: options.noteId,
      medicationId: options.medicationId,
      psychiatricHistoryId: options.psychiatricHistoryId,
      recordedAt: options.recordedAt,
    },
  });
  return event;
}

/**
 * Creates a NOTE event linked to a note.
 * Per spec: docs/22_nota_clinica_evento_note.md
 */
export async function createTestNoteEvent(
  clinicalRecordId: string,
  noteId: string,
  encounterDate: Date,
  title?: string
): Promise<ClinicalEvent> {
  return createTestEvent({
    clinicalRecordId,
    eventDate: encounterDate,
    eventType: ClinicalEventType.NOTE,
    title: title ?? "Nota clínica",
    sourceType: SourceType.Note,
    sourceId: noteId,
    noteId,
  });
}

/**
 * @deprecated Use createTestNoteEvent instead. Encounter events no longer exist.
 */
export async function createTestEncounterEvent(
  clinicalRecordId: string,
  noteId: string,
  encounterDate: Date,
  title?: string
): Promise<ClinicalEvent> {
  return createTestNoteEvent(clinicalRecordId, noteId, encounterDate, title);
}

/**
 * Creates a medication start event.
 */
export async function createTestMedicationStartEvent(
  clinicalRecordId: string,
  medicationId: string,
  prescriptionIssueDate: Date,
  drugName: string
): Promise<ClinicalEvent> {
  return createTestEvent({
    clinicalRecordId,
    eventDate: prescriptionIssueDate,
    eventType: ClinicalEventType.MedicationStart,
    title: `Started ${drugName}`,
    sourceType: SourceType.Medication,
    sourceId: medicationId,
    medicationId,
  });
}

/**
 * Creates a medication stop event.
 */
export async function createTestMedicationStopEvent(
  clinicalRecordId: string,
  medicationId: string,
  endDate: Date,
  drugName: string
): Promise<ClinicalEvent> {
  return createTestEvent({
    clinicalRecordId,
    eventDate: endDate,
    eventType: ClinicalEventType.MedicationStop,
    title: `Stopped ${drugName}`,
    sourceType: SourceType.Medication,
    sourceId: medicationId,
    medicationId,
  });
}

// =============================================================================
// APPOINTMENT FIXTURES
// =============================================================================

export interface CreateAppointmentOptions {
  id?: string;
  patientId: string;
  scheduledDate?: Date;
  scheduledTime?: Date | null;
  appointmentType?: AppointmentType;
  status?: AppointmentStatus;
  notes?: string | null;
}

/**
 * Creates an appointment.
 */
export async function createTestAppointment(
  options: CreateAppointmentOptions
): Promise<Appointment> {
  const appointment = await testPrisma.appointment.create({
    data: {
      id: options.id,
      patientId: options.patientId,
      scheduledDate: options.scheduledDate ?? new Date(),
      scheduledTime: options.scheduledTime,
      appointmentType: options.appointmentType ?? AppointmentType.Psicoterapia,
      status: options.status ?? AppointmentStatus.Scheduled,
      notes: options.notes,
    },
  });
  
  // Generate Encounter event immediately (per spec 23_encounter_appointment_spec.md)
  // This matches the behavior of AppointmentService.scheduleAppointment
  try {
    const { ensureEncounterEventForAppointment } = await import("@/domain/appointments/encounter-event-generator");
    await ensureEncounterEventForAppointment(appointment.id);
  } catch (error) {
    // If event generation fails, log but don't fail test setup
    // This can happen if clinical record doesn't exist yet
    console.warn(`Failed to create Encounter event for test appointment ${appointment.id}:`, error);
  }
  
  return appointment;
}

// =============================================================================
// COMPLETE PATIENT SETUP
// =============================================================================

/**
 * Creates a complete patient setup with clinical record and initial psychiatric history.
 * This is the typical initial state for most test scenarios.
 */
export async function createCompletePatientSetup(
  patientOptions: CreatePatientOptions = {}
): Promise<{
  patient: Patient;
  clinicalRecord: ClinicalRecord;
  psychiatricHistory: PsychiatricHistory;
}> {
  const patient = await createTestPatient(patientOptions);
  const clinicalRecord = await createTestClinicalRecord(patient.id);
  const psychiatricHistory = await createTestPsychiatricHistory({
    clinicalRecordId: clinicalRecord.id,
    versionNumber: 1,
    isCurrent: true,
  });
  return { patient, clinicalRecord, psychiatricHistory };
}
