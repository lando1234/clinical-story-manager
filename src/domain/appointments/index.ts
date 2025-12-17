/**
 * Appointment Domain Module
 *
 * Public exports for the appointment domain.
 */

// Types
export {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  AppointmentErrorCode,
  AppointmentOperationResult,
  AppointmentResult,
  AppointmentError,
  ScheduleAppointmentInput,
  UpdateAppointmentInput,
  CancelAppointmentInput,
  GetAppointmentsOptions,
  isAppointmentSuccess,
  isAppointmentError,
} from "./types";

// Service
export { AppointmentService, appointmentService } from "./service";

// Events
export {
  APPOINTMENT_SCHEDULED,
  APPOINTMENT_UPDATED,
  APPOINTMENT_CANCELLED,
  AppointmentScheduledEvent,
  AppointmentUpdatedEvent,
  AppointmentCancelledEvent,
  AppointmentScheduledPayload,
  AppointmentUpdatedPayload,
  AppointmentCancelledPayload,
  onAppointmentScheduled,
  onAppointmentUpdated,
  onAppointmentCancelled,
} from "./events";

// Validation (exported for testing)
export {
  validateScheduledDate,
  validateScheduledTime,
  validateDuration,
  validateAppointmentType,
  validateCanModify,
  validateCanCancel,
  ValidationError,
  ValidationResult,
} from "./validation";

// Repository (exported for testing/DI)
export { AppointmentRepository, appointmentRepository } from "./repository";
