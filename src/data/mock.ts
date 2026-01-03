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
    full_name: 'María Santos',
    date_of_birth: '1985-03-15',
    contact_phone: '(555) 123-4567',
    contact_email: 'maria.santos@email.com',
    address: 'Av. Corrientes 1234, CABA',
    emergency_contact_name: 'Carlos Santos',
    emergency_contact_phone: '(555) 123-4568',
    emergency_contact_relationship: 'Esposo',
    status: 'Active',
    registration_date: '2023-06-01T09:00:00Z',
  },
  {
    id: 'patient-002',
    full_name: 'Jaime Wilson',
    date_of_birth: '1972-11-28',
    contact_phone: '(555) 987-6543',
    contact_email: null,
    address: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    emergency_contact_relationship: null,
    status: 'Active',
    registration_date: '2024-01-15T14:30:00Z',
  },
  {
    id: 'patient-003',
    full_name: 'Emilia Chen',
    date_of_birth: '1990-07-22',
    contact_phone: null,
    contact_email: 'emilia.chen@email.com',
    address: 'Calle Falsa 456, CABA',
    emergency_contact_name: 'Ana Chen',
    emergency_contact_phone: '(555) 234-5678',
    emergency_contact_relationship: 'Hermana',
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
      event_type: 'Nota clínica',
      title: 'Consulta de seguimiento',
      description: 'Revisión de medicación de rutina. Paciente refiere mejoría del sueño.',
      source_type: 'Note',
      source_identifier: 'note-001-003',
    },
    {
      event_identifier: 'evt-001-002',
      event_timestamp: '2024-11-15',
      recorded_timestamp: '2024-11-15T10:00:00Z',
      event_type: 'Cambio de Medicación',
      title: 'Cambio de Sertralina de 50mg a 100mg',
      description: 'Aumento de dosis por respuesta parcial.',
      source_type: 'Medication',
      source_identifier: 'med-001-002',
    },
    {
      event_identifier: 'evt-001-003',
      event_timestamp: '2024-11-15',
      recorded_timestamp: '2024-11-15T10:00:00Z',
      event_type: 'Nota clínica',
      title: 'Consulta de seguimiento',
      description: 'Paciente refiere síntomas de ansiedad persistentes.',
      source_type: 'Note',
      source_identifier: 'note-001-002',
    },
    {
      event_identifier: 'evt-001-004',
      event_timestamp: '2024-10-01',
      recorded_timestamp: '2024-10-01T14:00:00Z',
      event_type: 'Inicio de Medicación',
      title: 'Inicio Sertralina 50mg',
      description: 'Para trastorno de ansiedad generalizada.',
      source_type: 'Medication',
      source_identifier: 'med-001-001',
    },
    {
      event_identifier: 'evt-001-005',
      event_timestamp: '2024-09-20',
      recorded_timestamp: '2024-09-20T11:30:00Z',
      event_type: 'Evento Vital',
      title: 'Pérdida de empleo',
      description: 'Paciente despedida de su puesto. Estresor significativo.',
      source_type: null,
      source_identifier: null,
    },
    {
      event_identifier: 'evt-001-006',
      event_timestamp: '2023-06-01',
      recorded_timestamp: '2023-06-01T09:30:00Z',
      event_type: 'Nota clínica',
      title: 'Evaluación inicial',
      description: 'Evaluación psiquiátrica integral.',
      source_type: 'Note',
      source_identifier: 'note-001-001',
    },
  ],
  'patient-002': [
    {
      event_identifier: 'evt-002-001',
      event_timestamp: '2024-12-05',
      recorded_timestamp: '2024-12-05T15:00:00Z',
      event_type: 'Nota clínica',
      title: 'Consulta de seguimiento',
      description: 'Ánimo estable con régimen actual.',
      source_type: 'Note',
      source_identifier: 'note-002-002',
    },
    {
      event_identifier: 'evt-002-002',
      event_timestamp: '2024-08-15',
      recorded_timestamp: '2024-08-15T09:00:00Z',
      event_type: 'Hospitalización',
      title: 'Hospitalización psiquiátrica',
      description: 'Ingreso voluntario por depresión severa con ideación suicida.',
      source_type: null,
      source_identifier: null,
    },
    {
      event_identifier: 'evt-002-003',
      event_timestamp: '2024-06-01',
      recorded_timestamp: '2024-06-01T14:00:00Z',
      event_type: 'Inicio de Medicación',
      title: 'Inicio Litio 300mg',
      description: 'Para mantenimiento de trastorno bipolar.',
      source_type: 'Medication',
      source_identifier: 'med-002-001',
    },
    {
      event_identifier: 'evt-002-004',
      event_timestamp: '2024-06-01',
      recorded_timestamp: '2024-06-01T14:00:00Z',
      event_type: 'Inicio de Medicación',
      title: 'Inicio Quetiapina 100mg',
      description: 'Para estabilización del ánimo y sueño.',
      source_type: 'Medication',
      source_identifier: 'med-002-002',
    },
    {
      event_identifier: 'evt-002-005',
      event_timestamp: '2024-01-15',
      recorded_timestamp: '2024-01-15T15:00:00Z',
      event_type: 'Nota clínica',
      title: 'Evaluación inicial',
      description: 'Evaluación integral por trastorno del ánimo.',
      source_type: 'Note',
      source_identifier: 'note-002-001',
    },
  ],
  'patient-003': [
    {
      event_identifier: 'evt-003-001',
      event_timestamp: '2024-11-20',
      recorded_timestamp: '2024-11-20T10:00:00Z',
      event_type: 'Nota clínica',
      title: 'Consulta de seguimiento',
      description: 'Primera consulta de seguimiento tras evaluación inicial.',
      source_type: 'Note',
      source_identifier: 'note-003-002',
    },
    {
      event_identifier: 'evt-003-002',
      event_timestamp: '2024-09-10',
      recorded_timestamp: '2024-09-10T11:30:00Z',
      event_type: 'Nota clínica',
      title: 'Evaluación inicial',
      description: 'Ingreso de nuevo paciente para evaluación de TDAH.',
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
      drug_name: 'Sertralina',
      dosage: 100,
      dosage_unit: 'mg',
      frequency: 'Una vez al día',
      prescription_issue_date: '2024-11-15',
      comments: 'Trastorno de ansiedad generalizada',
    },
  ],
  'patient-002': [
    {
      medication_identifier: 'med-002-001',
      drug_name: 'Litio',
      dosage: 300,
      dosage_unit: 'mg',
      frequency: 'Dos veces al día',
      prescription_issue_date: '2024-06-01',
      comments: 'Mantenimiento de trastorno bipolar',
    },
    {
      medication_identifier: 'med-002-002',
      drug_name: 'Quetiapina',
      dosage: 100,
      dosage_unit: 'mg',
      frequency: 'Al acostarse',
      prescription_issue_date: '2024-06-01',
      comments: 'Estabilización del ánimo y sueño',
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
      subjective: 'Paciente refiere mejoría del sueño y reducción de la ansiedad. Niega efectos secundarios de la medicación.',
      objective: 'Alerta y orientada. Ánimo eutímico, afecto congruente. Sin alteraciones psicomotoras.',
      assessment: 'Trastorno de ansiedad generalizada - respondiendo bien al tratamiento actual.',
      plan: 'Continuar Sertralina 100mg diarios. Seguimiento en 4 semanas.',
      status: 'Finalized',
      finalized_at: '2024-12-10T17:00:00Z',
    },
  ],
  'patient-002': [
    {
      note_identifier: 'note-002-002',
      encounter_date: '2024-12-05',
      encounter_type: 'Follow-up',
      subjective: 'Paciente refiere ánimo estable. Sueño mejorado con Quetiapina.',
      objective: 'Tranquilo y colaborador. Ánimo descrito como "bien". Sin temblor observado.',
      assessment: 'Trastorno bipolar I - estable con régimen actual.',
      plan: 'Continuar medicación actual. Control de litemia en próxima visita.',
      status: 'Finalized',
      finalized_at: '2024-12-05T16:00:00Z',
    },
  ],
  'patient-003': [
    {
      note_identifier: 'note-003-002',
      encounter_date: '2024-11-20',
      encounter_type: 'Follow-up',
      subjective: 'Paciente describe dificultad persistente para concentrarse y organizarse.',
      objective: 'Inquieta durante la entrevista. Múltiples interrupciones en la conversación.',
      assessment: 'TDAH, predominantemente inatento - evaluación en curso.',
      plan: 'Pendiente resultados de pruebas psicológicas. Seguimiento tras completar evaluación.',
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
      notes: 'Revisión de medicación',
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
      notes: 'Control de litemia',
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
