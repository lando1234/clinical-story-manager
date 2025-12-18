/**
 * TypeScript types for UX shell components
 * These are standalone types matching Timeline Engine contracts
 * Used by UI components before Prisma types are generated
 * Source: docs/14_timeline_contracts.md
 */

// === Enumerations ===

export type EventType =
  | 'Inicio de Historia Clínica'
  | 'Encuentro'
  | 'Inicio de Medicación'
  | 'Cambio de Medicación'
  | 'Suspensión de Medicación'
  | 'Hospitalización'
  | 'Evento Vital'
  | 'Actualización de Historia'
  | 'Otro';

export type SourceType = 'Note' | 'Medication' | 'PsychiatricHistory' | null;

export type EncounterType =
  | 'Initial Evaluation'
  | 'Follow-up'
  | 'Crisis Intervention'
  | 'Medication Review'
  | 'Therapy Session'
  | 'Phone Consultation'
  | 'Other';

export type PatientStatus = 'Active' | 'Inactive';

export type NoteStatus = 'Draft' | 'Finalized';

export type MedicationStatus = 'Active' | 'Discontinued';

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';

// === Timeline Event (from READ-TIMELINE-FULL contract) ===

export interface TimelineEvent {
  event_identifier: string;
  event_timestamp: string; // Date as ISO string
  recorded_timestamp: string; // Timestamp as ISO string
  event_type: EventType;
  title: string;
  description: string | null;
  source_type: SourceType;
  source_identifier: string | null;
}

// === Patient ===

export interface Patient {
  id: string;
  full_name: string;
  date_of_birth: string; // Date as ISO string
  contact_phone: string | null;
  contact_email: string | null;
  status: PatientStatus;
  registration_date: string; // Timestamp as ISO string
}

// === Medication (from READ-STATE-CURRENT contract) ===

export interface ActiveMedication {
  medication_identifier: string;
  drug_name: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string; // Date as ISO string
  prescribing_reason: string;
}

// === Note (from READ-EVENT-SOURCE contract) ===

export interface Note {
  note_identifier: string;
  encounter_date: string; // Date as ISO string
  encounter_type: EncounterType;
  subjective: string;
  objective: string | null;
  assessment: string;
  plan: string;
  status: NoteStatus;
  finalized_at: string | null; // Timestamp as ISO string
}

export interface Addendum {
  addendum_identifier: string;
  content: string;
  reason: string;
  created_at: string; // Timestamp as ISO string
}

// === Appointment ===

export interface Appointment {
  id: string;
  patient_id: string;
  scheduled_date: string; // Date as ISO string
  scheduled_time: string | null; // Time as HH:MM string
  duration_minutes: number | null;
  appointment_type: EncounterType;
  status: AppointmentStatus;
  notes: string | null;
}

// === Current State (from READ-STATE-CURRENT contract) ===

export interface CurrentState {
  patient_identifier: string;
  as_of_date: string; // Date as ISO string
  active_medications: ActiveMedication[];
  most_recent_note: {
    note_identifier: string;
    encounter_date: string;
    encounter_type: EncounterType;
    finalized_at: string;
  } | null;
}

// === Full Timeline Response (from READ-TIMELINE-FULL contract) ===

export interface TimelineResponse {
  patient_identifier: string;
  event_count: number;
  events: TimelineEvent[];
}
