/**
 * Encounter Event Generator
 *
 * Generates Encounter events immediately when appointments are created/scheduled.
 * Per spec: docs/23_encounter_appointment_spec.md
 *
 * This service ensures that:
 * - Each appointment generates exactly one Encounter event immediately upon creation
 * - Events are created regardless of whether the appointment date is in the future or past
 * - Future events exist in the database but are filtered from timeline display
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
    Psicoterapia: "Turno - Psicoterapia",
    OrientacionFamiliar: "Turno - Orientación Familiar",
    LlamadoProgramado: "Turno - Llamado Programado",
    LlamadoEnCrisis: "Turno - Llamado en Crisis",
    SesionGrupal: "Turno - Sesión Grupal",
    Taller: "Turno - Taller",
    EntrevistaAdmision: "Turno - Entrevista de Admisión",
    Evaluacion: "Turno - Evaluación",
    LlamadoColegio: "Turno - Llamado al Colegio",
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
 * Ensures Encounter event exists for a specific appointment.
 * Creates the event immediately, regardless of whether the appointment date is in the future or past.
 * 
 * @param appointmentId - The appointment ID
 * @returns true if event was created or already exists
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

  // Check if Encounter event already exists for this appointment
  const existingEvent = await prisma.clinicalEvent.findFirst({
    where: {
      sourceType: SourceType.Appointment,
      sourceId: appointmentId,
      eventType: ClinicalEventType.Encounter,
    },
  });

  // If event exists, check if its date matches the appointment date
  // If not, delete it so we can create a new one with the correct date
  if (existingEvent) {
    // Normalize dates to compare only date part (ignore time component)
    const eventDate = new Date(existingEvent.eventDate);
    eventDate.setUTCHours(0, 0, 0, 0);
    const appointmentDate = new Date(appointment.scheduledDate);
    appointmentDate.setUTCHours(0, 0, 0, 0);
    
    // If dates match, return existing event
    if (eventDate.getTime() === appointmentDate.getTime()) {
      return { created: false, eventId: existingEvent.id };
    }
    
    // Dates don't match - delete the old event so we can create a new one
    await prisma.clinicalEvent.delete({
      where: { id: existingEvent.id },
    });
  }

  // Get clinical record for patient
  const clinicalRecordId = await getClinicalRecordForPatient(appointment.patientId);
  if (!clinicalRecordId) {
    throw new Error(`Clinical record not found for patient ${appointment.patientId}`);
  }

  // Generate event (regardless of whether date is in future or past)
  // Normalize the event date to midnight to ensure consistent date-only comparison
  const eventDate = new Date(appointment.scheduledDate);
  eventDate.setUTCHours(0, 0, 0, 0);
  
  const title = getAppointmentTypeTitle(appointment.appointmentType);
  const description = getEncounterDescription(
    appointment.appointmentType,
    appointment.status,
    appointment.notes
  );

  const result = await emitEncounterEvent({
    clinicalRecordId,
    appointmentId: appointment.id,
    eventDate: eventDate,
    title,
    description,
  });

  if (!result.success) {
    throw new Error(`Failed to create Encounter event: ${result.error.message}`);
  }

  return { created: true, eventId: result.data.id };
}

/**
 * Ensures Encounter events exist for all appointments of a patient.
 * 
 * This function is called when querying the timeline to ensure all appointments
 * (both past and future) have their corresponding Encounter events.
 * 
 * @param patientId - The patient ID
 */
export async function ensureEncounterEventsForPatient(
  patientId: string
): Promise<void> {
  // Find all appointments without Encounter events (both past and future)
  const appointments = await prisma.appointment.findMany({
    where: {
      patientId,
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
      sourceId: { in: appointments.map((a) => a.id) },
    },
    select: { sourceId: true },
  });

  const existingAppointmentIds = new Set(
    existingEvents.map((e) => e.sourceId).filter((id): id is string => id !== null)
  );

  // Create events for appointments that don't have them (both past and future)
  for (const appointment of appointments) {
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

/**
 * Deletes Encounter event for a future appointment when it is cancelled or rescheduled.
 * 
 * This function should be called when:
 * - A future appointment is cancelled
 * - A future appointment is rescheduled (before its original date)
 * 
 * @param appointmentId - The appointment ID
 * @returns true if event was deleted, false if no event existed or appointment date has passed
 */
export async function deleteEncounterEventForFutureAppointment(
  appointmentId: string
): Promise<{ deleted: boolean }> {
  // Get appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error(`Appointment ${appointmentId} not found`);
  }

  // Check if appointment date is in the future
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const appointmentDate = new Date(appointment.scheduledDate);
  appointmentDate.setUTCHours(0, 0, 0, 0);

  // Only delete if appointment date is in the future
  // Past appointments' events are immutable
  if (appointmentDate <= today) {
    return { deleted: false };
  }

  // Find and delete Encounter event
  const deleted = await prisma.clinicalEvent.deleteMany({
    where: {
      sourceType: SourceType.Appointment,
      sourceId: appointmentId,
      eventType: ClinicalEventType.Encounter,
    },
  });

  return { deleted: deleted.count > 0 };
}
