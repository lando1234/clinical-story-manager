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
  medicationId?: string;
  psychiatricHistoryId?: string;
}

/**
 * Event type priority for ordering (from 14_timeline_contracts.md G-ORD-2).
 * Lower number = higher priority (appears first when dates match).
 */
export const EVENT_TYPE_PRIORITY: Record<ClinicalEventType, number> = {
  Encounter: 1,
  MedicationStart: 2,
  MedicationChange: 3,
  MedicationStop: 4,
  Hospitalization: 5,
  LifeEvent: 6,
  HistoryUpdate: 7,
  Other: 8,
};

/**
 * Validates that an event date is not in the future.
 * Per contract: event_timestamp must not be in the future.
 */
export function validateEventDate(
  eventDate: Date
): { valid: true } | { valid: false; reason: string } {
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

  const dateValidation = validateEventDate(input.eventDate);
  if (!dateValidation.valid) {
    reasons.push(dateValidation.reason);
  }

  if (reasons.length === 0) {
    return { valid: true };
  }
  return { valid: false, reasons };
}
