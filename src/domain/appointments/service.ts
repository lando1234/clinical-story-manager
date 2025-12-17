/**
 * Appointment Service
 *
 * Business logic for appointment management.
 * Handles scheduling, updating, and cancelling appointments.
 * Emits domain events for each action.
 *
 * IMPORTANT: This service does NOT:
 * - Create ClinicalEvents (appointments are excluded from clinical timeline)
 * - Infer patient state from appointments
 * - Compute reminders or notifications
 */

import { appointmentRepository, AppointmentRepository } from "./repository";
import {
  Appointment,
  AppointmentErrorCode,
  AppointmentOperationResult,
  CancelAppointmentInput,
  GetAppointmentsOptions,
  ScheduleAppointmentInput,
  UpdateAppointmentInput,
} from "./types";
import {
  validateScheduleAppointmentInput,
  validateUpdateAppointmentInput,
  validateCanCancel,
} from "./validation";
import {
  emitAppointmentScheduled,
  emitAppointmentUpdated,
  emitAppointmentCancelled,
} from "./events";

/**
 * Appointment Service class.
 * Orchestrates appointment operations with validation and event emission.
 */
export class AppointmentService {
  constructor(private readonly repository: AppointmentRepository) {}

  // ==========================================================================
  // SCHEDULING
  // ==========================================================================

  /**
   * Schedule a new appointment for a patient.
   *
   * @param input - The appointment details
   * @returns Result containing the created appointment or an error
   *
   * Emits: AppointmentScheduled event on success
   */
  async scheduleAppointment(
    input: ScheduleAppointmentInput
  ): Promise<AppointmentOperationResult> {
    // Check if patient exists
    const patientExists = await this.repository.patientExists(input.patientId);
    if (!patientExists) {
      return {
        success: false,
        error: {
          code: AppointmentErrorCode.PATIENT_NOT_FOUND,
          message: `Patient with ID ${input.patientId} not found`,
          field: "patientId",
        },
      };
    }

    // Validate input
    const validationError = validateScheduleAppointmentInput(input);
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    // Create the appointment
    const appointment = await this.repository.create(input);

    // Emit domain event
    emitAppointmentScheduled(appointment);

    return {
      success: true,
      appointment,
    };
  }

  // ==========================================================================
  // UPDATING
  // ==========================================================================

  /**
   * Update an existing appointment.
   *
   * @param appointmentId - The ID of the appointment to update
   * @param input - The fields to update
   * @returns Result containing the updated appointment or an error
   *
   * Emits: AppointmentUpdated event on success (if changes were made)
   */
  async updateAppointment(
    appointmentId: string,
    input: UpdateAppointmentInput
  ): Promise<AppointmentOperationResult> {
    // Find the existing appointment
    const existingAppointment = await this.repository.findById(appointmentId);
    if (!existingAppointment) {
      return {
        success: false,
        error: {
          code: AppointmentErrorCode.APPOINTMENT_NOT_FOUND,
          message: `Appointment with ID ${appointmentId} not found`,
        },
      };
    }

    // Validate input against existing appointment
    const validationError = validateUpdateAppointmentInput(
      existingAppointment,
      input
    );
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    // Check if there are any actual changes
    const hasChanges = this.hasChanges(existingAppointment, input);
    if (!hasChanges) {
      // No changes, return existing appointment without event
      return {
        success: true,
        appointment: existingAppointment,
      };
    }

    // Capture previous values for the event
    const previousValues = this.capturePreviousValues(existingAppointment, input);

    // Update the appointment
    const updatedAppointment = await this.repository.update(appointmentId, input);

    // Emit domain event
    emitAppointmentUpdated(updatedAppointment, previousValues, input);

    return {
      success: true,
      appointment: updatedAppointment,
    };
  }

  // ==========================================================================
  // CANCELLING
  // ==========================================================================

  /**
   * Cancel an existing appointment.
   *
   * @param appointmentId - The ID of the appointment to cancel
   * @param input - Optional cancellation details
   * @returns Result containing the cancelled appointment or an error
   *
   * Emits: AppointmentCancelled event on success
   */
  async cancelAppointment(
    appointmentId: string,
    input: CancelAppointmentInput = {}
  ): Promise<AppointmentOperationResult> {
    // Find the existing appointment
    const existingAppointment = await this.repository.findById(appointmentId);
    if (!existingAppointment) {
      return {
        success: false,
        error: {
          code: AppointmentErrorCode.APPOINTMENT_NOT_FOUND,
          message: `Appointment with ID ${appointmentId} not found`,
        },
      };
    }

    // Validate that appointment can be cancelled
    const validationError = validateCanCancel(existingAppointment);
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    // Cancel the appointment
    const cancelledAppointment = await this.repository.cancel(
      appointmentId,
      input.reason
    );

    // Emit domain event
    emitAppointmentCancelled(cancelledAppointment, input.reason);

    return {
      success: true,
      appointment: cancelledAppointment,
    };
  }

  // ==========================================================================
  // QUERIES
  // ==========================================================================

  /**
   * Get an appointment by ID.
   *
   * @param appointmentId - The appointment ID
   * @returns The appointment if found, null otherwise
   */
  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    return this.repository.findById(appointmentId);
  }

  /**
   * Get appointments matching the given criteria.
   *
   * @param options - Query options
   * @returns Array of matching appointments
   */
  async getAppointments(options: GetAppointmentsOptions = {}): Promise<Appointment[]> {
    return this.repository.findMany(options);
  }

  /**
   * Get all appointments for a patient.
   *
   * @param patientId - The patient ID
   * @returns Array of appointments
   */
  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    return this.repository.findByPatientId(patientId);
  }

  /**
   * Get upcoming appointments for a patient.
   *
   * @param patientId - The patient ID
   * @returns Array of scheduled appointments from today onwards
   */
  async getUpcomingAppointments(patientId: string): Promise<Appointment[]> {
    return this.repository.findUpcomingByPatientId(patientId);
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  /**
   * Check if the update input contains any actual changes.
   */
  private hasChanges(
    existing: Appointment,
    input: UpdateAppointmentInput
  ): boolean {
    if (
      input.scheduledDate !== undefined &&
      input.scheduledDate.getTime() !== existing.scheduledDate.getTime()
    ) {
      return true;
    }

    if (input.scheduledTime !== undefined) {
      const existingTime = existing.scheduledTime?.getTime() ?? null;
      const newTime = input.scheduledTime?.getTime() ?? null;
      if (existingTime !== newTime) {
        return true;
      }
    }

    if (
      input.durationMinutes !== undefined &&
      input.durationMinutes !== existing.durationMinutes
    ) {
      return true;
    }

    if (
      input.appointmentType !== undefined &&
      input.appointmentType !== existing.appointmentType
    ) {
      return true;
    }

    if (input.notes !== undefined && input.notes !== existing.notes) {
      return true;
    }

    return false;
  }

  /**
   * Capture the previous values for fields that are being changed.
   */
  private capturePreviousValues(
    existing: Appointment,
    input: UpdateAppointmentInput
  ): {
    scheduledDate?: Date;
    scheduledTime?: Date | null;
    durationMinutes?: number | null;
    appointmentType?: string;
    notes?: string | null;
  } {
    const previousValues: {
      scheduledDate?: Date;
      scheduledTime?: Date | null;
      durationMinutes?: number | null;
      appointmentType?: string;
      notes?: string | null;
    } = {};

    if (input.scheduledDate !== undefined) {
      previousValues.scheduledDate = existing.scheduledDate;
    }

    if (input.scheduledTime !== undefined) {
      previousValues.scheduledTime = existing.scheduledTime;
    }

    if (input.durationMinutes !== undefined) {
      previousValues.durationMinutes = existing.durationMinutes;
    }

    if (input.appointmentType !== undefined) {
      previousValues.appointmentType = existing.appointmentType;
    }

    if (input.notes !== undefined) {
      previousValues.notes = existing.notes;
    }

    return previousValues;
  }
}

/**
 * Singleton instance of the appointment service.
 */
export const appointmentService = new AppointmentService(appointmentRepository);
