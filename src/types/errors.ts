/**
 * Domain error codes matching Timeline Engine contract error codes.
 * See: docs/14_timeline_contracts.md
 */

export type DomainErrorCode =
  // Missing data errors (ERROR-MISSING-DATA)
  | "MISSING_EVENT_TIMESTAMP"
  | "MISSING_EVENT_TYPE"
  | "MISSING_TITLE"
  | "MISSING_CLINICAL_RECORD"
  // Invalid data errors (ERROR-INVALID-DATA)
  | "INVALID_TIMESTAMP_FUTURE"
  | "INVALID_EVENT_TYPE"
  | "INVALID_DATE_RANGE"
  | "INVALID_SOURCE_REFERENCE"
  // Entity not found errors
  | "PATIENT_NOT_FOUND"
  | "CLINICAL_RECORD_NOT_FOUND"
  | "NOTE_NOT_FOUND"
  | "MEDICATION_NOT_FOUND"
  | "EVENT_NOT_FOUND"
  // Source errors
  | "SOURCE_UNAVAILABLE"
  // State errors
  | "NOTE_ALREADY_FINALIZED"
  | "NOTE_NOT_FINALIZED"
  | "MEDICATION_ALREADY_DISCONTINUED"
  | "MEDICATION_NOT_ACTIVE"
  | "MEDICATION_NOT_ACTIVE_CANNOT_ISSUE_PRESCRIPTION"
  // Validation errors
  | "MISSING_REQUIRED_FIELDS"
  | "INVALID_PREDECESSOR"
  | "INVALID_PARAMETER"
  | "INVALID_PRESCRIPTION_DATE_MUST_BE_AFTER_FIRST"
  // State reconstruction errors
  | "INVALID_STATE";

/**
 * Domain error class for structured error handling.
 */
export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "DomainError";
  }
}

/**
 * Result type for domain operations.
 * Provides explicit success/failure handling without exceptions.
 */
export type Result<T, E = DomainError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper to create a success result.
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Helper to create a failure result.
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}
