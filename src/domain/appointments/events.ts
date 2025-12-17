/**
 * Appointment Domain Events
 *
 * These events are emitted when appointment actions occur.
 * They are in-memory domain events, NOT ClinicalEvents (which are for the clinical timeline).
 */

import {
  DomainEvent,
  createDomainEvent,
  domainEventEmitter,
} from "../events/domain-event";
import {
  Appointment,
  AppointmentType,
  UpdateAppointmentInput,
} from "./types";

// ============================================================================
// Event Type Constants
// ============================================================================

export const APPOINTMENT_SCHEDULED = "AppointmentScheduled" as const;
export const APPOINTMENT_UPDATED = "AppointmentUpdated" as const;
export const APPOINTMENT_CANCELLED = "AppointmentCancelled" as const;

// ============================================================================
// Event Payloads
// ============================================================================

/**
 * Payload for AppointmentScheduled event.
 */
export interface AppointmentScheduledPayload {
  appointment: Appointment;
  scheduledBy?: string; // Future: user/clinician ID
}

/**
 * Payload for AppointmentUpdated event.
 */
export interface AppointmentUpdatedPayload {
  appointment: Appointment;
  previousValues: {
    scheduledDate?: Date;
    scheduledTime?: Date | null;
    durationMinutes?: number | null;
    appointmentType?: AppointmentType;
    notes?: string | null;
  };
  changes: UpdateAppointmentInput;
  updatedBy?: string; // Future: user/clinician ID
}

/**
 * Payload for AppointmentCancelled event.
 */
export interface AppointmentCancelledPayload {
  appointment: Appointment;
  reason?: string;
  cancelledBy?: string; // Future: user/clinician ID
}

// ============================================================================
// Event Types
// ============================================================================

export type AppointmentScheduledEvent = DomainEvent<AppointmentScheduledPayload>;
export type AppointmentUpdatedEvent = DomainEvent<AppointmentUpdatedPayload>;
export type AppointmentCancelledEvent = DomainEvent<AppointmentCancelledPayload>;

// ============================================================================
// Event Factories
// ============================================================================

/**
 * Create an AppointmentScheduled event.
 */
export function createAppointmentScheduledEvent(
  payload: AppointmentScheduledPayload,
  correlationId?: string
): AppointmentScheduledEvent {
  return createDomainEvent(APPOINTMENT_SCHEDULED, payload, correlationId);
}

/**
 * Create an AppointmentUpdated event.
 */
export function createAppointmentUpdatedEvent(
  payload: AppointmentUpdatedPayload,
  correlationId?: string
): AppointmentUpdatedEvent {
  return createDomainEvent(APPOINTMENT_UPDATED, payload, correlationId);
}

/**
 * Create an AppointmentCancelled event.
 */
export function createAppointmentCancelledEvent(
  payload: AppointmentCancelledPayload,
  correlationId?: string
): AppointmentCancelledEvent {
  return createDomainEvent(APPOINTMENT_CANCELLED, payload, correlationId);
}

// ============================================================================
// Event Emitters (convenience functions)
// ============================================================================

/**
 * Emit an AppointmentScheduled event.
 */
export function emitAppointmentScheduled(
  appointment: Appointment,
  correlationId?: string
): void {
  const event = createAppointmentScheduledEvent({ appointment }, correlationId);
  domainEventEmitter.emit(event);
}

/**
 * Emit an AppointmentUpdated event.
 */
export function emitAppointmentUpdated(
  appointment: Appointment,
  previousValues: AppointmentUpdatedPayload["previousValues"],
  changes: UpdateAppointmentInput,
  correlationId?: string
): void {
  const event = createAppointmentUpdatedEvent(
    { appointment, previousValues, changes },
    correlationId
  );
  domainEventEmitter.emit(event);
}

/**
 * Emit an AppointmentCancelled event.
 */
export function emitAppointmentCancelled(
  appointment: Appointment,
  reason?: string,
  correlationId?: string
): void {
  const event = createAppointmentCancelledEvent(
    { appointment, reason },
    correlationId
  );
  domainEventEmitter.emit(event);
}

// ============================================================================
// Event Subscription Helpers
// ============================================================================

/**
 * Subscribe to AppointmentScheduled events.
 */
export function onAppointmentScheduled(
  handler: (event: AppointmentScheduledEvent) => void | Promise<void>
): () => void {
  return domainEventEmitter.on(APPOINTMENT_SCHEDULED, handler);
}

/**
 * Subscribe to AppointmentUpdated events.
 */
export function onAppointmentUpdated(
  handler: (event: AppointmentUpdatedEvent) => void | Promise<void>
): () => void {
  return domainEventEmitter.on(APPOINTMENT_UPDATED, handler);
}

/**
 * Subscribe to AppointmentCancelled events.
 */
export function onAppointmentCancelled(
  handler: (event: AppointmentCancelledEvent) => void | Promise<void>
): () => void {
  return domainEventEmitter.on(APPOINTMENT_CANCELLED, handler);
}
