/**
 * Appointment Repository
 *
 * Data access layer for appointments.
 * All database operations for appointments go through this repository.
 * The service layer should not use Prisma directly.
 */

import { prisma } from "../../lib/prisma";
import { Prisma } from "@/generated/prisma";
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  GetAppointmentsOptions,
  ScheduleAppointmentInput,
  UpdateAppointmentInput,
} from "./types";

/**
 * Map Prisma appointment to domain Appointment type.
 */
function mapToAppointment(prismaAppointment: {
  id: string;
  patientId: string;
  scheduledDate: Date;
  scheduledTime: Date | null;
  durationMinutes: number | null;
  appointmentType: string;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Appointment {
  return {
    id: prismaAppointment.id,
    patientId: prismaAppointment.patientId,
    scheduledDate: prismaAppointment.scheduledDate,
    scheduledTime: prismaAppointment.scheduledTime,
    durationMinutes: prismaAppointment.durationMinutes,
    appointmentType: prismaAppointment.appointmentType as AppointmentType,
    status: prismaAppointment.status as AppointmentStatus,
    notes: prismaAppointment.notes,
    createdAt: prismaAppointment.createdAt,
    updatedAt: prismaAppointment.updatedAt,
  };
}

/**
 * Appointment Repository class.
 * Provides data access operations for appointments.
 */
export class AppointmentRepository {
  /**
   * Find an appointment by ID.
   *
   * @param id - The appointment ID
   * @returns The appointment if found, null otherwise
   */
  async findById(id: string): Promise<Appointment | null> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return null;
    }

    return mapToAppointment(appointment);
  }

  /**
   * Find appointments matching the given criteria.
   *
   * @param options - Query options
   * @returns Array of matching appointments
   */
  async findMany(options: GetAppointmentsOptions = {}): Promise<Appointment[]> {
    const { patientId, status, fromDate, toDate, limit, offset } = options;

    const where: Prisma.AppointmentWhereInput = {};

    if (patientId) {
      where.patientId = patientId;
    }

    if (status) {
      if (Array.isArray(status)) {
        where.status = { in: status as AppointmentStatus[] };
      } else {
        where.status = status as AppointmentStatus;
      }
    }

    if (fromDate || toDate) {
      where.scheduledDate = {};
      if (fromDate) {
        where.scheduledDate.gte = fromDate;
      }
      if (toDate) {
        where.scheduledDate.lte = toDate;
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [{ scheduledDate: "asc" }, { scheduledTime: "asc" }],
      take: limit,
      skip: offset,
    });

    return appointments.map(mapToAppointment);
  }

  /**
   * Find all appointments for a patient.
   *
   * @param patientId - The patient ID
   * @returns Array of appointments
   */
  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.findMany({ patientId });
  }

  /**
   * Find upcoming appointments for a patient.
   *
   * @param patientId - The patient ID
   * @returns Array of scheduled appointments from today onwards
   */
  async findUpcomingByPatientId(patientId: string): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.findMany({
      patientId,
      status: AppointmentStatus.Scheduled,
      fromDate: today,
    });
  }

  /**
   * Create a new appointment.
   *
   * @param input - The appointment data
   * @returns The created appointment
   */
  async create(input: ScheduleAppointmentInput): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: input.patientId,
        scheduledDate: input.scheduledDate,
        scheduledTime: input.scheduledTime ?? null,
        durationMinutes: input.durationMinutes ?? null,
        appointmentType: input.appointmentType,
        status: AppointmentStatus.Scheduled,
        notes: input.notes ?? null,
      },
    });

    return mapToAppointment(appointment);
  }

  /**
   * Update an existing appointment.
   *
   * @param id - The appointment ID
   * @param input - The fields to update
   * @returns The updated appointment
   */
  async update(id: string, input: UpdateAppointmentInput): Promise<Appointment> {
    const data: Prisma.AppointmentUpdateInput = {};

    if (input.scheduledDate !== undefined) {
      data.scheduledDate = input.scheduledDate;
    }
    if (input.scheduledTime !== undefined) {
      data.scheduledTime = input.scheduledTime;
    }
    if (input.durationMinutes !== undefined) {
      data.durationMinutes = input.durationMinutes;
    }
    if (input.appointmentType !== undefined) {
      data.appointmentType = input.appointmentType;
    }
    if (input.notes !== undefined) {
      data.notes = input.notes;
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data,
    });

    return mapToAppointment(appointment);
  }

  /**
   * Cancel an appointment.
   *
   * @param id - The appointment ID
   * @param reason - Optional cancellation reason (stored in notes)
   * @returns The cancelled appointment
   */
  async cancel(id: string, reason?: string): Promise<Appointment> {
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      select: { notes: true },
    });

    const currentNotes = existingAppointment?.notes ?? "";
    const cancellationNote = reason
      ? `[CANCELLED: ${reason}]`
      : "[CANCELLED]";
    const updatedNotes = currentNotes
      ? `${currentNotes}\n${cancellationNote}`
      : cancellationNote;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.Cancelled,
        notes: updatedNotes,
      },
    });

    return mapToAppointment(appointment);
  }

  /**
   * Check if a patient exists.
   *
   * @param patientId - The patient ID to check
   * @returns True if patient exists, false otherwise
   */
  async patientExists(patientId: string): Promise<boolean> {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    });

    return patient !== null;
  }
}

/**
 * Singleton instance of the appointment repository.
 */
export const appointmentRepository = new AppointmentRepository();
