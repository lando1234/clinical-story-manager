/**
 * Encounter Event Generator
 *
 * Generates Encounter events automatically for appointments whose scheduled date has passed.
 * Per spec: docs/23_encounter_appointment_spec.md
 *
 * This service ensures that:
 * - Each past appointment generates exactly one Encounter event
 * - Events are created only when the appointment date has passed
 * - No duplicate events are created
 */

import { prisma } from "@/lib/prisma";
import { ClinicalEventType, SourceType } from "@/generated/prisma";
import { emitEncounterEvent } from "@/domain/timeline/event-emitter";
import { getClinicalRecordForPatient } from "@/lib/api-helpers";

/**
 * Maps appointment type to a descriptive title for the Encounter event.
 */
function getAppointmentTypeTitle(appointmentType: string): string {
  const mapping: Record<string, string> = {
    InitialEvaluation: "Turno - Evaluación Inicial",
    FollowUp: "Turno - Seguimiento",
    CrisisIntervention: "Turno - Intervención en Crisis",
    MedicationReview: "Turno - Revisión de Medicación",
    TherapySession: "Turno - Sesión de Terapia",
    PhoneConsultation: "Turno - Consulta Telefónica",
    Other: "Turno",
  };
  return mapping[appointmentType] || "Turno";
}

/**
 * Generates description for Encounter event based on appointment status.
 */
function getEncounterDescription(
  appointmentType: string,
  status: string,
  notes?: string | null
): string | undefined {
  const parts: string[] = [];
  
  if (status === "NoShow") {
    parts.push("Inasistencia");
  } else if (status === "Completed") {
    parts.push("Completado");
  } else if (status === "Cancelled") {
    parts.push("Cancelado");
  }
  
  if (notes && notes.trim()) {
    parts.push(`Notas: ${notes.trim()}`);
  }
  
  return parts.length > 0 ? parts.join(". ") : undefined;
}

/**
 * Ensures Encounter event exists for a specific appointment if its date has passed.
 * 
 * @param appointmentId - The appointment ID
 * @returns true if event was created or already exists, false if appointment date is in the future
 */
export async function ensureEncounterEventForAppointment(
  appointmentId: string
): Promise<{ created: boolean; eventId?: string }> {
  // Get appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error(`Appointment ${appointmentId} not found`);
  }

  // Check if appointment date has passed
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(appointment.scheduledDate);
  appointmentDate.setHours(0, 0, 0, 0);

  // Only create event if appointment date has passed
  if (appointmentDate > today) {
    return { created: false };
  }

  // Check if Encounter event already exists for this appointment
  const existingEvent = await prisma.clinicalEvent.findFirst({
    where: {
      sourceType: SourceType.Appointment,
      sourceId: appointmentId,
      eventType: ClinicalEventType.Encounter,
    },
  });

  if (existingEvent) {
    return { created: false, eventId: existingEvent.id };
  }

  // Get clinical record for patient
  const clinicalRecordId = await getClinicalRecordForPatient(appointment.patientId);
  if (!clinicalRecordId) {
    throw new Error(`Clinical record not found for patient ${appointment.patientId}`);
  }

  // Generate event
  const title = getAppointmentTypeTitle(appointment.appointmentType);
  const description = getEncounterDescription(
    appointment.appointmentType,
    appointment.status,
    appointment.notes
  );

  const result = await emitEncounterEvent({
    clinicalRecordId,
    appointmentId: appointment.id,
    eventDate: appointment.scheduledDate,
    title,
    description,
  });

  if (!result.success) {
    throw new Error(`Failed to create Encounter event: ${result.error.message}`);
  }

  return { created: true, eventId: result.data.id };
}

/**
 * Ensures Encounter events exist for all past appointments of a patient.
 * 
 * This function is called when querying the timeline to ensure all past appointments
 * have their corresponding Encounter events.
 * 
 * @param patientId - The patient ID
 */
export async function ensureEncounterEventsForPatient(
  patientId: string
): Promise<void> {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  // Find all past appointments without Encounter events
  const pastAppointments = await prisma.appointment.findMany({
    where: {
      patientId,
      scheduledDate: { lte: today },
    },
  });

  // Get clinical record for patient
  const clinicalRecordId = await getClinicalRecordForPatient(patientId);
  if (!clinicalRecordId) {
    // Patient may not have clinical record yet, skip
    return;
  }

  // Get existing Encounter events for these appointments
  const existingEvents = await prisma.clinicalEvent.findMany({
    where: {
      clinicalRecordId,
      sourceType: SourceType.Appointment,
      eventType: ClinicalEventType.Encounter,
      sourceId: { in: pastAppointments.map((a) => a.id) },
    },
    select: { sourceId: true },
  });

  const existingAppointmentIds = new Set(
    existingEvents.map((e) => e.sourceId).filter((id): id is string => id !== null)
  );

  // Create events for appointments that don't have them
  for (const appointment of pastAppointments) {
    if (existingAppointmentIds.has(appointment.id)) {
      continue;
    }

    const title = getAppointmentTypeTitle(appointment.appointmentType);
    const description = getEncounterDescription(
      appointment.appointmentType,
      appointment.status,
      appointment.notes
    );

    await emitEncounterEvent({
      clinicalRecordId,
      appointmentId: appointment.id,
      eventDate: appointment.scheduledDate,
      title,
      description,
    });
  }
}
