import { ClinicalEventType, SourceType } from "@/generated/prisma";

/**
 * Input for creating a timeline event.
 * Matches the write contracts in 14_timeline_contracts.md
 */
export interface CreateTimelineEventInput {
  clinicalRecordId: string;
  eventDate: Date;
  eventType: ClinicalEventType;
  title: string;
  description?: string;
  sourceType: SourceType | null;
  sourceId: string | null;
  // Polymorphic source references - only one should be set based on sourceType
  noteId?: string;
  appointmentId?: string;
  medicationId?: string;
  psychiatricHistoryId?: string;
}

/**
 * Event type priority for ordering (from 14_timeline_contracts.md G-ORD-2).
 * Lower number = higher priority (appears first when dates match).
 * Foundational has priority 0 (highest) to always appear first.
 * 
 * NOTE: NOTE events do not use priority-based ordering. They are ordered
 * chronologically by timestamp, then recorded timestamp, then identifier.
 * The value here is kept for type safety but is not used in comparisons.
 */
export const EVENT_TYPE_PRIORITY: Record<ClinicalEventType, number> = {
  Foundational: 0,
  NOTE: Number.MAX_SAFE_INTEGER, // NOTE events don't use priority - handled specially in ordering
  Encounter: 2,
  MedicationStart: 3,
  MedicationChange: 4,
  MedicationPrescriptionIssued: 5,
  MedicationStop: 6,
  Hospitalization: 7,
  LifeEvent: 8,
  HistoryUpdate: 9,
  Other: 10,
};

/**
 * Validates that an event date is not in the future.
 * Per contract: event_timestamp must not be in the future.
 * 
 * Exceptions (per INC-14):
 * - MedicationChange events may have future dates (filtered from timeline until date passes)
 * - MedicationPrescriptionIssued events may have future dates (filtered from timeline until date passes)
 * - Encounter events may have future dates (filtered from timeline until date passes)
 * 
 * For Foundational events, allows dates up to current time (with small buffer for timing differences)
 * since they use ClinicalRecord.createdAt which is "now" when created.
 */
export function validateEventDate(
  eventDate: Date,
  eventType?: ClinicalEventType
): { valid: true } | { valid: false; reason: string } {
  const now = new Date();
  
  // For Foundational events, allow dates up to current time with a small buffer
  // to account for microsecond timing differences between ClinicalRecord creation and event validation
  if (eventType === ClinicalEventType.Foundational) {
    // Add 1 second buffer to handle timing differences
    const buffer = new Date(now.getTime() + 1000);
    if (eventDate > buffer) {
      return { valid: false, reason: "Event date cannot be in the future" };
    }
    return { valid: true };
  }
  
  // Per INC-14: MedicationChange, MedicationPrescriptionIssued, and Encounter events
  // may have future dates. They are created but filtered from timeline display until date passes.
  const futureAllowedTypes = [
    ClinicalEventType.MedicationChange,
    ClinicalEventType.MedicationPrescriptionIssued,
    ClinicalEventType.Encounter,
  ];
  
  if (eventType && futureAllowedTypes.includes(eventType)) {
    // Future dates are allowed for these event types
    return { valid: true };
  }
  
  // For other events, use end of today as the cutoff
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  if (eventDate > today) {
    return { valid: false, reason: "Event date cannot be in the future" };
  }
  return { valid: true };
}

/**
 * Validates required fields for timeline event creation.
 * Per contract ERROR-MISSING-DATA.
 */
export function validateTimelineEventInput(
  input: CreateTimelineEventInput
): { valid: true } | { valid: false; reasons: string[] } {
  const reasons: string[] = [];

  if (!input.clinicalRecordId) {
    reasons.push("Clinical record ID is required");
  }
  if (!input.eventDate) {
    reasons.push("Event date is required");
  }
  if (!input.eventType) {
    reasons.push("Event type is required");
  }
  if (!input.title || input.title.trim() === "") {
    reasons.push("Title is required");
  }

  const dateValidation = validateEventDate(input.eventDate, input.eventType);
  if (!dateValidation.valid) {
    reasons.push(dateValidation.reason);
  }

  if (reasons.length === 0) {
    return { valid: true };
  }
  return { valid: false, reasons };
}
