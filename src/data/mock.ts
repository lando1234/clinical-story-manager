/**
 * Mock data for UX shell development
 * All shapes match Timeline Engine contract outputs
 */

import type {
  Patient,
  TimelineEvent,
  ActiveMedication,
  Note,
  Appointment,
} from '@/types/ui';

// === Patients ===

export const mockPatients: Patient[] = [
  {
    id: 'patient-001',
    full_name: 'Maria Santos',
    date_of_birth: '1985-03-15',
    contact_phone: '(555) 123-4567',
    contact_email: 'maria.santos@email.com',
    status: 'Active',
    registration_date: '2023-06-01T09:00:00Z',
  },
  {
    id: 'patient-002',
    full_name: 'James Wilson',
    date_of_birth: '1972-11-28',
    contact_phone: '(555) 987-6543',
    contact_email: null,
    status: 'Active',
    registration_date: '2024-01-15T14:30:00Z',
  },
  {
    id: 'patient-003',
    full_name: 'Emily Chen',
    date_of_birth: '1990-07-22',
    contact_phone: null,
    contact_email: 'emily.chen@email.com',
    status: 'Active',
    registration_date: '2024-09-10T11:00:00Z',
  },
];

// === Timeline Events by Patient ===

export const mockTimelineEvents: Record<string, TimelineEvent[]> = {
  'patient-001': [
    {
      event_identifier: 'evt-001-001',
      event_timestamp: '2024-12-10',
      recorded_timestamp: '2024-12-10T16:30:00Z',
      event_type: 'Encounter',
      title: 'Follow-up encounter',
      description: 'Routine medication review. Patient reports improved sleep.',
      source_type: 'Note',
      source_identifier: 'note-001-003',
    },
    {
      event_identifier: 'evt-001-002',
      event_timestamp: '2024-11-15',
      recorded_timestamp: '2024-11-15T10:00:00Z',
      event_type: 'Medication Change',
      title: 'Changed Sertraline from 50mg to 100mg',
      description: 'Dosage increased due to partial response.',
      source_type: 'Medication',
      source_identifier: 'med-001-002',
    },
    {
      event_identifier: 'evt-001-003',
      event_timestamp: '2024-11-15',
      recorded_timestamp: '2024-11-15T10:00:00Z',
      event_type: 'Encounter',
      title: 'Follow-up encounter',
      description: 'Patient reports persistent anxiety symptoms.',
      source_type: 'Note',
      source_identifier: 'note-001-002',
    },
    {
      event_identifier: 'evt-001-004',
      event_timestamp: '2024-10-01',
      recorded_timestamp: '2024-10-01T14:00:00Z',
      event_type: 'Medication Start',
      title: 'Started Sertraline 50mg',
      description: 'For generalized anxiety disorder.',
      source_type: 'Medication',
      source_identifier: 'med-001-001',
    },
    {
      event_identifier: 'evt-001-005',
      event_timestamp: '2024-09-20',
      recorded_timestamp: '2024-09-20T11:30:00Z',
      event_type: 'Life Event',
      title: 'Job loss',
      description: 'Patient laid off from position. Significant stressor.',
      source_type: null,
      source_identifier: null,
    },
    {
      event_identifier: 'evt-001-006',
      event_timestamp: '2023-06-01',
      recorded_timestamp: '2023-06-01T09:30:00Z',
      event_type: 'Encounter',
      title: 'Initial Evaluation',
      description: 'Comprehensive psychiatric evaluation.',
      source_type: 'Note',
      source_identifier: 'note-001-001',
    },
  ],
  'patient-002': [
    {
      event_identifier: 'evt-002-001',
      event_timestamp: '2024-12-05',
      recorded_timestamp: '2024-12-05T15:00:00Z',
      event_type: 'Encounter',
      title: 'Follow-up encounter',
      description: 'Mood stable on current regimen.',
      source_type: 'Note',
      source_identifier: 'note-002-002',
    },
    {
      event_identifier: 'evt-002-002',
      event_timestamp: '2024-08-15',
      recorded_timestamp: '2024-08-15T09:00:00Z',
      event_type: 'Hospitalization',
      title: 'Psychiatric hospitalization',
      description: 'Voluntary admission for severe depression with suicidal ideation.',
      source_type: null,
      source_identifier: null,
    },
    {
      event_identifier: 'evt-002-003',
      event_timestamp: '2024-06-01',
      recorded_timestamp: '2024-06-01T14:00:00Z',
      event_type: 'Medication Start',
      title: 'Started Lithium 300mg',
      description: 'For bipolar disorder maintenance.',
      source_type: 'Medication',
      source_identifier: 'med-002-001',
    },
    {
      event_identifier: 'evt-002-004',
      event_timestamp: '2024-06-01',
      recorded_timestamp: '2024-06-01T14:00:00Z',
      event_type: 'Medication Start',
      title: 'Started Quetiapine 100mg',
      description: 'For mood stabilization and sleep.',
      source_type: 'Medication',
      source_identifier: 'med-002-002',
    },
    {
      event_identifier: 'evt-002-005',
      event_timestamp: '2024-01-15',
      recorded_timestamp: '2024-01-15T15:00:00Z',
      event_type: 'Encounter',
      title: 'Initial Evaluation',
      description: 'Comprehensive evaluation for mood disorder.',
      source_type: 'Note',
      source_identifier: 'note-002-001',
    },
  ],
  'patient-003': [
    {
      event_identifier: 'evt-003-001',
      event_timestamp: '2024-11-20',
      recorded_timestamp: '2024-11-20T10:00:00Z',
      event_type: 'Encounter',
      title: 'Follow-up encounter',
      description: 'First follow-up after initial evaluation.',
      source_type: 'Note',
      source_identifier: 'note-003-002',
    },
    {
      event_identifier: 'evt-003-002',
      event_timestamp: '2024-09-10',
      recorded_timestamp: '2024-09-10T11:30:00Z',
      event_type: 'Encounter',
      title: 'Initial Evaluation',
      description: 'New patient intake for ADHD assessment.',
      source_type: 'Note',
      source_identifier: 'note-003-001',
    },
  ],
};

// === Active Medications by Patient ===

export const mockMedications: Record<string, ActiveMedication[]> = {
  'patient-001': [
    {
      medication_identifier: 'med-001-002',
      drug_name: 'Sertraline',
      dosage: 100,
      dosage_unit: 'mg',
      frequency: 'Once daily',
      start_date: '2024-11-15',
      prescribing_reason: 'Generalized anxiety disorder',
    },
  ],
  'patient-002': [
    {
      medication_identifier: 'med-002-001',
      drug_name: 'Lithium',
      dosage: 300,
      dosage_unit: 'mg',
      frequency: 'Twice daily',
      start_date: '2024-06-01',
      prescribing_reason: 'Bipolar disorder maintenance',
    },
    {
      medication_identifier: 'med-002-002',
      drug_name: 'Quetiapine',
      dosage: 100,
      dosage_unit: 'mg',
      frequency: 'At bedtime',
      start_date: '2024-06-01',
      prescribing_reason: 'Mood stabilization and sleep',
    },
  ],
  'patient-003': [],
};

// === Notes by Patient (most recent) ===

export const mockNotes: Record<string, Note[]> = {
  'patient-001': [
    {
      note_identifier: 'note-001-003',
      encounter_date: '2024-12-10',
      encounter_type: 'Follow-up',
      subjective: 'Patient reports improved sleep and reduced anxiety. Denies side effects from medication.',
      objective: 'Alert and oriented. Mood euthymic, affect congruent. No psychomotor abnormalities.',
      assessment: 'Generalized anxiety disorder - responding well to current treatment.',
      plan: 'Continue Sertraline 100mg daily. Follow up in 4 weeks.',
      status: 'Finalized',
      finalized_at: '2024-12-10T17:00:00Z',
    },
  ],
  'patient-002': [
    {
      note_identifier: 'note-002-002',
      encounter_date: '2024-12-05',
      encounter_type: 'Follow-up',
      subjective: 'Patient reports mood is stable. Sleep is improved with Quetiapine.',
      objective: 'Calm and cooperative. Mood described as "good". No tremor noted.',
      assessment: 'Bipolar I disorder - stable on current regimen.',
      plan: 'Continue current medications. Check lithium level at next visit.',
      status: 'Finalized',
      finalized_at: '2024-12-05T16:00:00Z',
    },
  ],
  'patient-003': [
    {
      note_identifier: 'note-003-002',
      encounter_date: '2024-11-20',
      encounter_type: 'Follow-up',
      subjective: 'Patient describes ongoing difficulty with focus and organization.',
      objective: 'Restless during interview. Multiple interruptions in conversation.',
      assessment: 'ADHD, predominantly inattentive type - evaluation in progress.',
      plan: 'Pending psychological testing results. Follow up after testing complete.',
      status: 'Finalized',
      finalized_at: '2024-11-20T11:00:00Z',
    },
  ],
};

// === Appointments by Patient ===

export const mockAppointments: Record<string, Appointment[]> = {
  'patient-001': [
    {
      id: 'appt-001-001',
      patient_id: 'patient-001',
      scheduled_date: '2025-01-07',
      scheduled_time: '14:00',
      duration_minutes: 30,
      appointment_type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Medication review',
    },
  ],
  'patient-002': [
    {
      id: 'appt-002-001',
      patient_id: 'patient-002',
      scheduled_date: '2024-12-20',
      scheduled_time: '10:30',
      duration_minutes: 30,
      appointment_type: 'Medication Review',
      status: 'Scheduled',
      notes: 'Lithium level check',
    },
  ],
  'patient-003': [],
};

// === Helper functions ===

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id);
}

export function getTimelineForPatient(patientId: string): TimelineEvent[] {
  return mockTimelineEvents[patientId] ?? [];
}

export function getMedicationsForPatient(patientId: string): ActiveMedication[] {
  return mockMedications[patientId] ?? [];
}

export function getNotesForPatient(patientId: string): Note[] {
  return mockNotes[patientId] ?? [];
}

export function getAppointmentsForPatient(patientId: string): Appointment[] {
  return mockAppointments[patientId] ?? [];
}

export function getNextAppointment(patientId: string): Appointment | null {
  const appointments = getAppointmentsForPatient(patientId);
  const scheduled = appointments.filter((a) => a.status === 'Scheduled');
  if (scheduled.length === 0) return null;
  
  // Sort by date and return the earliest
  scheduled.sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
  return scheduled[0];
}

export function getMostRecentNote(patientId: string): Note | null {
  const notes = getNotesForPatient(patientId);
  const finalized = notes.filter((n) => n.status === 'Finalized');
  if (finalized.length === 0) return null;
  
  // Sort by encounter_date descending and return first
  finalized.sort((a, b) => b.encounter_date.localeCompare(a.encounter_date));
  return finalized[0];
}
