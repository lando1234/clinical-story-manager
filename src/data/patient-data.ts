/**
 * Patient Data Layer for UX Shell
 *
 * Server-side data fetching functions that:
 * - Call Timeline Engine and domain services
 * - Map backend types (camelCase, Date) to UI types (snake_case, ISO strings)
 * - Handle errors and return typed results
 *
 * See: docs/14_timeline_contracts.md
 */

import { PatientService, PatientNotFoundError } from '@/domain/patient/service';
import { getFullTimeline, getCurrentState } from '@/domain/timeline';
import { appointmentService } from '@/domain/appointments/service';
import { prisma } from '@/lib/prisma';
import { NoteStatus } from '@/generated/prisma';
import type { ClinicalEventType, SourceType, EncounterType } from '@/generated/prisma';
import type {
  Patient as UIPatient,
  TimelineEvent as UITimelineEvent,
  ActiveMedication as UIActiveMedication,
  Appointment as UIAppointment,
  Note as UINote,
  EventType as UIEventType,
  EncounterType as UIEncounterType,
} from '@/types/ui';

// =============================================================================
// TYPE MAPPING HELPERS
// =============================================================================

/**
 * Maps backend ClinicalEventType enum to UI EventType string (Spanish).
 * Per spec: docs/21_localizacion_eventos_clinicos.md
 */
function mapEventType(eventType: ClinicalEventType): UIEventType {
  const mapping: Record<ClinicalEventType, UIEventType> = {
    Foundational: 'Inicio de Historia Clínica',
    NOTE: 'Nota clínica',
    Encounter: 'Turno',
    MedicationStart: 'Inicio de Medicación',
    MedicationChange: 'Cambio de Medicación',
    MedicationStop: 'Suspensión de Medicación',
    Hospitalization: 'Hospitalización',
    LifeEvent: 'Evento Vital',
    HistoryUpdate: 'Actualización de Historia',
    Other: 'Otro',
  };
  return mapping[eventType];
}

/**
 * Maps backend SourceType enum to UI SourceType (Spanish labels).
 * Per spec: docs/21_localizacion_eventos_clinicos.md
 */
function mapSourceType(sourceType: SourceType | null): UITimelineEvent['source_type'] {
  if (sourceType === null) return null;
  if (sourceType === 'Manual') return null;
  // SourceType values are kept as-is for internal consistency
  // but displayed labels should be in Spanish in UI components
  return sourceType as UITimelineEvent['source_type'];
}

/**
 * Maps backend EncounterType enum to UI EncounterType string.
 */
function mapEncounterType(encounterType: EncounterType): UIEncounterType {
  const mapping: Record<EncounterType, UIEncounterType> = {
    InitialEvaluation: 'Initial Evaluation',
    FollowUp: 'Follow-up',
    CrisisIntervention: 'Crisis Intervention',
    MedicationReview: 'Medication Review',
    TherapySession: 'Therapy Session',
    PhoneConsultation: 'Phone Consultation',
    Other: 'Other',
  };
  return mapping[encounterType];
}

/**
 * Maps appointment type to UI EncounterType (appointments use same type names).
 */
function mapAppointmentType(appointmentType: string): UIEncounterType {
  const mapping: Record<string, UIEncounterType> = {
    InitialEvaluation: 'Initial Evaluation',
    FollowUp: 'Follow-up',
    CrisisIntervention: 'Crisis Intervention',
    MedicationReview: 'Medication Review',
    TherapySession: 'Therapy Session',
    PhoneConsultation: 'Phone Consultation',
    Other: 'Other',
  };
  return mapping[appointmentType] ?? 'Other';
}

/**
 * Maps appointment status to UI status.
 */
function mapAppointmentStatus(status: string): UIAppointment['status'] {
  const mapping: Record<string, UIAppointment['status']> = {
    Scheduled: 'Scheduled',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
    NoShow: 'No-show',
  };
  return mapping[status] ?? 'Scheduled';
}

/**
 * Formats a Date object to ISO date string (YYYY-MM-DD).
 */
function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a Date object to ISO timestamp string.
 */
function toISOTimestampString(date: Date): string {
  return date.toISOString();
}

/**
 * Extracts time string (HH:MM) from a Date object.
 */
function toTimeString(date: Date | null): string | null {
  if (!date) return null;
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// =============================================================================
// DATA FETCHING FUNCTIONS
// =============================================================================

/**
 * Fetch a patient by ID and map to UI type.
 * Returns null if patient not found.
 */
export async function fetchPatientForUI(patientId: string): Promise<UIPatient | null> {
  try {
    const patient = await PatientService.getPatientById(patientId);
    return {
      id: patient.id,
      full_name: patient.fullName,
      date_of_birth: toISODateString(patient.dateOfBirth),
      contact_phone: patient.contactPhone,
      contact_email: patient.contactEmail,
      address: patient.address,
      emergency_contact_name: patient.emergencyContactName,
      emergency_contact_phone: patient.emergencyContactPhone,
      emergency_contact_relationship: patient.emergencyContactRelationship,
      status: patient.status,
      registration_date: toISOTimestampString(patient.registrationDate),
    };
  } catch (error) {
    if (error instanceof PatientNotFoundError) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch all patients and map to UI type.
 * Used for sidebar patient list.
 */
export async function fetchAllPatientsForUI(): Promise<UIPatient[]> {
  const patients = await PatientService.listPatients();
  return patients.map((patient) => ({
    id: patient.id,
    full_name: patient.fullName,
    date_of_birth: toISODateString(patient.dateOfBirth),
    contact_phone: patient.contactPhone,
    contact_email: patient.contactEmail,
    address: patient.address,
    emergency_contact_name: patient.emergencyContactName,
    emergency_contact_phone: patient.emergencyContactPhone,
    emergency_contact_relationship: patient.emergencyContactRelationship,
    status: patient.status,
    registration_date: toISOTimestampString(patient.registrationDate),
  }));
}

/**
 * Fetch timeline events for a patient and map to UI type.
 * Returns empty array if patient not found or no events.
 *
 * Per contract READ-TIMELINE-FULL:
 * - Events ordered by four-tier ordering
 * - Default direction is descending (most recent first)
 */
export async function fetchTimelineForUI(patientId: string): Promise<UITimelineEvent[]> {
  const result = await getFullTimeline(patientId, 'descending');

  if (!result.success) {
    // Patient not found or other error - return empty array
    // The page will handle the patient-not-found case separately
    return [];
  }

  return result.data.events.map((event) => ({
    event_identifier: event.eventIdentifier,
    event_timestamp: toISODateString(event.eventTimestamp),
    recorded_timestamp: toISOTimestampString(event.recordedTimestamp),
    event_type: mapEventType(event.eventType),
    title: event.title,
    description: event.description,
    source_type: mapSourceType(event.sourceType),
    source_identifier: event.sourceIdentifier,
  }));
}

/**
 * Fetch active medications for a patient and map to UI type.
 * Returns empty array if patient not found or no active medications.
 *
 * Per contract READ-STATE-CURRENT:
 * - Active medications where status = Active
 */
export async function fetchActiveMedicationsForUI(
  patientId: string
): Promise<UIActiveMedication[]> {
  const result = await getCurrentState(patientId);

  if (!result.success) {
    return [];
  }

  return result.data.activeMedications.map((med) => ({
    medication_identifier: med.medicationIdentifier,
    drug_name: med.drugName,
    dosage: Number(med.dosage),
    dosage_unit: med.dosageUnit,
    frequency: med.frequency,
    start_date: toISODateString(med.startDate),
    prescribing_reason: med.prescribingReason,
  }));
}

/**
 * Fetch next scheduled appointment for a patient.
 * Returns null if no upcoming appointments.
 *
 * Appointments are excluded from timeline (G-HIST-4) so we query separately.
 */
export async function fetchNextAppointmentForUI(
  patientId: string
): Promise<UIAppointment | null> {
  const appointments = await appointmentService.getUpcomingAppointments(patientId);

  if (appointments.length === 0) {
    return null;
  }

  // Get the first (earliest) scheduled appointment
  const next = appointments[0];

  return {
    id: next.id,
    patient_id: next.patientId,
    scheduled_date: toISODateString(next.scheduledDate),
    scheduled_time: toTimeString(next.scheduledTime),
    duration_minutes: next.durationMinutes,
    appointment_type: mapAppointmentType(next.appointmentType),
    status: mapAppointmentStatus(next.status),
    notes: next.notes,
  };
}

/**
 * Fetch most recent finalized note for a patient.
 * Returns null if no finalized notes exist.
 *
 * Per contract READ-STATE-CURRENT, we get most_recent_note summary,
 * but UI needs full note content, so we fetch the full note.
 */
export async function fetchMostRecentNoteForUI(patientId: string): Promise<UINote | null> {
  const result = await getCurrentState(patientId);

  if (!result.success || !result.data.mostRecentNote) {
    return null;
  }

  // We have the note identifier, fetch the full note
  const note = await prisma.note.findUnique({
    where: { id: result.data.mostRecentNote.noteIdentifier },
  });

  if (!note || note.status !== NoteStatus.Finalized || !note.finalizedAt) {
    return null;
  }

  return {
    note_identifier: note.id,
    encounter_date: toISODateString(note.encounterDate),
    encounter_type: mapEncounterType(note.encounterType),
    subjective: note.subjective ?? '',
    objective: note.objective,
    assessment: note.assessment ?? '',
    plan: note.plan ?? '',
    status: 'Finalized',
    finalized_at: toISOTimestampString(note.finalizedAt),
  };
}
