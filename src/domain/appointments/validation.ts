/**
 * Appointment Validation
 *
 * Date/time constraint validation for appointments.
 * All validation functions return either null (valid) or an error object.
 */

import {
  AppointmentErrorCode,
  AppointmentType,
  AppointmentStatus,
  Appointment,
  ScheduleAppointmentInput,
  UpdateAppointmentInput,
} from "./types";

/**
 * Validation error structure.
 */
export interface ValidationError {
  code: AppointmentErrorCode;
  message: string;
  field?: string;
}

/**
 * Validation result type.
 */
export type ValidationResult = ValidationError | null;

// ============================================================================
// Date Validation
// ============================================================================

/**
 * Get the start of today (midnight).
 */
function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Validate that a scheduled date is a valid date.
 *
 * @param scheduledDate - The date to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateScheduledDate(scheduledDate: Date): ValidationResult {
  if (!(scheduledDate instanceof Date) || isNaN(scheduledDate.getTime())) {
    return {
      code: AppointmentErrorCode.INVALID_SCHEDULED_DATE,
      message: "Scheduled date must be a valid date",
      field: "scheduledDate",
    };
  }

  return null;
}

/**
 * Validate scheduled time if provided.
 *
 * @param scheduledTime - The time to validate (optional)
 * @returns ValidationError if invalid, null if valid
 */
export function validateScheduledTime(
  scheduledTime: Date | undefined | null
): ValidationResult {
  if (scheduledTime === undefined || scheduledTime === null) {
    return null; // Time is optional
  }

  if (!(scheduledTime instanceof Date) || isNaN(scheduledTime.getTime())) {
    return {
      code: AppointmentErrorCode.INVALID_SCHEDULED_TIME,
      message: "Scheduled time must be a valid time",
      field: "scheduledTime",
    };
  }

  return null;
}

// ============================================================================
// Duration Validation
// ============================================================================

/**
 * Validate duration in minutes if provided.
 *
 * @param durationMinutes - The duration to validate (optional)
 * @returns ValidationError if invalid, null if valid
 */
export function validateDuration(
  durationMinutes: number | undefined | null
): ValidationResult {
  if (durationMinutes === undefined || durationMinutes === null) {
    return null; // Duration is optional
  }

  if (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes)) {
    return {
      code: AppointmentErrorCode.INVALID_DURATION,
      message: "Duration must be a whole number of minutes",
      field: "durationMinutes",
    };
  }

  if (durationMinutes <= 0) {
    return {
      code: AppointmentErrorCode.INVALID_DURATION,
      message: "Duration must be a positive number of minutes",
      field: "durationMinutes",
    };
  }

  // Reasonable maximum: 8 hours (480 minutes)
  if (durationMinutes > 480) {
    return {
      code: AppointmentErrorCode.INVALID_DURATION,
      message: "Duration cannot exceed 480 minutes (8 hours)",
      field: "durationMinutes",
    };
  }

  return null;
}

// ============================================================================
// Type Validation
// ============================================================================

/**
 * Validate appointment type.
 *
 * @param appointmentType - The type to validate
 * @returns ValidationError if invalid, null if valid
 */
export function validateAppointmentType(
  appointmentType: string
): ValidationResult {
  const validTypes = Object.values(AppointmentType);

  if (!validTypes.includes(appointmentType as AppointmentType)) {
    return {
      code: AppointmentErrorCode.INVALID_APPOINTMENT_TYPE,
      message: `Invalid appointment type. Must be one of: ${validTypes.join(", ")}`,
      field: "appointmentType",
    };
  }

  return null;
}

// ============================================================================
// Status Validation
// ============================================================================

/**
 * Validate that an appointment can be modified based on its current status.
 *
 * @param appointment - The appointment to check
 * @returns ValidationError if cannot modify, null if can modify
 */
export function validateCanModify(appointment: Appointment): ValidationResult {
  if (appointment.status === AppointmentStatus.Completed) {
    return {
      code: AppointmentErrorCode.CANNOT_MODIFY_COMPLETED,
      message: "Cannot modify a completed appointment",
    };
  }

  if (appointment.status === AppointmentStatus.NoShow) {
    return {
      code: AppointmentErrorCode.CANNOT_MODIFY_NO_SHOW,
      message: "Cannot modify a no-show appointment",
    };
  }

  if (appointment.status === AppointmentStatus.Cancelled) {
    return {
      code: AppointmentErrorCode.ALREADY_CANCELLED,
      message: "Cannot modify a cancelled appointment",
    };
  }

  return null;
}

/**
 * Validate that an appointment can be cancelled based on its current status.
 *
 * @param appointment - The appointment to check
 * @returns ValidationError if cannot cancel, null if can cancel
 */
export function validateCanCancel(appointment: Appointment): ValidationResult {
  if (appointment.status === AppointmentStatus.Completed) {
    return {
      code: AppointmentErrorCode.CANNOT_CANCEL_COMPLETED,
      message: "Cannot cancel a completed appointment",
    };
  }

  if (appointment.status === AppointmentStatus.NoShow) {
    return {
      code: AppointmentErrorCode.CANNOT_CANCEL_NO_SHOW,
      message: "Cannot cancel a no-show appointment",
    };
  }

  if (appointment.status === AppointmentStatus.Cancelled) {
    return {
      code: AppointmentErrorCode.ALREADY_CANCELLED,
      message: "Appointment is already cancelled",
    };
  }

  return null;
}

// ============================================================================
// Composite Validation
// ============================================================================

/**
 * Validate all fields for scheduling a new appointment.
 *
 * @param input - The schedule appointment input
 * @returns First validation error found, or null if all valid
 */
export function validateScheduleAppointmentInput(
  input: ScheduleAppointmentInput
): ValidationResult {
  // Validate scheduled date
  const dateError = validateScheduledDate(input.scheduledDate);
  if (dateError) return dateError;

  // Validate scheduled time (optional)
  const timeError = validateScheduledTime(input.scheduledTime);
  if (timeError) return timeError;

  // Validate duration (optional)
  const durationError = validateDuration(input.durationMinutes);
  if (durationError) return durationError;

  // Validate appointment type
  const typeError = validateAppointmentType(input.appointmentType);
  if (typeError) return typeError;

  return null;
}

/**
 * Validate all fields for updating an appointment.
 *
 * @param appointment - The existing appointment
 * @param input - The update input
 * @returns First validation error found, or null if all valid
 */
export function validateUpdateAppointmentInput(
  appointment: Appointment,
  input: UpdateAppointmentInput
): ValidationResult {
  // Check if appointment can be modified
  const statusError = validateCanModify(appointment);
  if (statusError) return statusError;

  // Validate scheduled date if provided
  if (input.scheduledDate !== undefined) {
    const dateError = validateScheduledDate(input.scheduledDate);
    if (dateError) return dateError;
  }

  // Validate scheduled time if provided (can be null to clear)
  if (input.scheduledTime !== undefined) {
    const timeError = validateScheduledTime(input.scheduledTime);
    if (timeError) return timeError;
  }

  // Validate duration if provided (can be null to clear)
  if (input.durationMinutes !== undefined) {
    const durationError = validateDuration(input.durationMinutes);
    if (durationError) return durationError;
  }

  // Validate appointment type if provided
  if (input.appointmentType !== undefined) {
    const typeError = validateAppointmentType(input.appointmentType);
    if (typeError) return typeError;
  }

  return null;
}
