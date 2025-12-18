/**
 * Appointment Domain Module
 *
 * Public exports for the appointment domain.
 */

// Types (pure types only)
export type {
  Appointment,
  AppointmentOperationResult,
  AppointmentResult,
  AppointmentError,
  ScheduleAppointmentInput,
  UpdateAppointmentInput,
  CancelAppointmentInput,
  GetAppointmentsOptions,
} from "./types";

// Values (constants and functions - these also export their types)
export {
  AppointmentStatus,
  AppointmentType,
  AppointmentErrorCode,
  isAppointmentSuccess,
  isAppointmentError,
} from "./types";

// Service
export { AppointmentService, appointmentService } from "./service";

// Events - Types
export type {
  AppointmentScheduledEvent,
  AppointmentUpdatedEvent,
  AppointmentCancelledEvent,
  AppointmentScheduledPayload,
  AppointmentUpdatedPayload,
  AppointmentCancelledPayload,
} from "./events";

// Events - Values
export {
  APPOINTMENT_SCHEDULED,
  APPOINTMENT_UPDATED,
  APPOINTMENT_CANCELLED,
  onAppointmentScheduled,
  onAppointmentUpdated,
  onAppointmentCancelled,
} from "./events";

// Validation (exported for testing) - Types
export type {
  ValidationError,
  ValidationResult,
} from "./validation";

// Validation - Values
export {
  validateScheduledDate,
  validateScheduledTime,
  validateDuration,
  validateAppointmentType,
  validateCanModify,
  validateCanCancel,
} from "./validation";

// Repository (exported for testing/DI)
export { AppointmentRepository, appointmentRepository } from "./repository";
