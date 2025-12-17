/**
 * Appointment Domain Types and DTOs
 *
 * Defines the types used throughout the appointment domain.
 * These are separate from Prisma-generated types to maintain domain isolation.
 */

/**
 * Appointment status enum.
 * Mirrors Prisma's AppointmentStatus.
 */
export const AppointmentStatus = {
  Scheduled: "Scheduled",
  Completed: "Completed",
  Cancelled: "Cancelled",
  NoShow: "NoShow",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

/**
 * Appointment type enum.
 * Mirrors Prisma's AppointmentType.
 */
export const AppointmentType = {
  InitialEvaluation: "InitialEvaluation",
  FollowUp: "FollowUp",
  CrisisIntervention: "CrisisIntervention",
  MedicationReview: "MedicationReview",
  TherapySession: "TherapySession",
  PhoneConsultation: "PhoneConsultation",
  Other: "Other",
} as const;

export type AppointmentType =
  (typeof AppointmentType)[keyof typeof AppointmentType];

/**
 * Core appointment entity.
 */
export interface Appointment {
  id: string;
  patientId: string;
  scheduledDate: Date;
  scheduledTime: Date | null;
  durationMinutes: number | null;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for scheduling a new appointment.
 */
export interface ScheduleAppointmentInput {
  patientId: string;
  scheduledDate: Date;
  scheduledTime?: Date;
  durationMinutes?: number;
  appointmentType: AppointmentType;
  notes?: string;
}

/**
 * Input for updating an existing appointment.
 * All fields are optional except the appointment ID.
 */
export interface UpdateAppointmentInput {
  scheduledDate?: Date;
  scheduledTime?: Date | null;
  durationMinutes?: number | null;
  appointmentType?: AppointmentType;
  notes?: string | null;
}

/**
 * Input for cancelling an appointment.
 */
export interface CancelAppointmentInput {
  reason?: string;
}

/**
 * Result of a successful appointment operation.
 */
export interface AppointmentResult {
  success: true;
  appointment: Appointment;
}

/**
 * Result of a failed appointment operation.
 */
export interface AppointmentError {
  success: false;
  error: {
    code: AppointmentErrorCode;
    message: string;
    field?: string;
  };
}

/**
 * Error codes for appointment operations.
 */
export const AppointmentErrorCode = {
  PATIENT_NOT_FOUND: "PATIENT_NOT_FOUND",
  APPOINTMENT_NOT_FOUND: "APPOINTMENT_NOT_FOUND",
  INVALID_SCHEDULED_DATE: "INVALID_SCHEDULED_DATE",
  INVALID_SCHEDULED_TIME: "INVALID_SCHEDULED_TIME",
  INVALID_DURATION: "INVALID_DURATION",
  INVALID_APPOINTMENT_TYPE: "INVALID_APPOINTMENT_TYPE",
  CANNOT_MODIFY_COMPLETED: "CANNOT_MODIFY_COMPLETED",
  CANNOT_MODIFY_NO_SHOW: "CANNOT_MODIFY_NO_SHOW",
  CANNOT_CANCEL_COMPLETED: "CANNOT_CANCEL_COMPLETED",
  CANNOT_CANCEL_NO_SHOW: "CANNOT_CANCEL_NO_SHOW",
  ALREADY_CANCELLED: "ALREADY_CANCELLED",
} as const;

export type AppointmentErrorCode =
  (typeof AppointmentErrorCode)[keyof typeof AppointmentErrorCode];

/**
 * Union type for appointment operation results.
 */
export type AppointmentOperationResult = AppointmentResult | AppointmentError;

/**
 * Type guard to check if result is successful.
 */
export function isAppointmentSuccess(
  result: AppointmentOperationResult
): result is AppointmentResult {
  return result.success === true;
}

/**
 * Type guard to check if result is an error.
 */
export function isAppointmentError(
  result: AppointmentOperationResult
): result is AppointmentError {
  return result.success === false;
}

/**
 * Query options for fetching appointments.
 */
export interface GetAppointmentsOptions {
  patientId?: string;
  status?: AppointmentStatus | AppointmentStatus[];
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}
