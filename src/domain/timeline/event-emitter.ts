import { prisma } from "@/lib/prisma";
import {
  ClinicalEventType,
  SourceType,
  ClinicalEvent,
} from "@/generated/prisma";
import {
  CreateTimelineEventInput,
  validateTimelineEventInput,
} from "@/types/timeline";
import { DomainError, Result, ok, err } from "@/types/errors";

/**
 * TimelineEventEmitter - Creates ClinicalEvent records per write contracts.
 *
 * Implements:
 * - WRITE-EVENT-ENCOUNTER
 * - WRITE-EVENT-MEDICATION-START
 * - WRITE-EVENT-MEDICATION-CHANGE
 * - WRITE-EVENT-MEDICATION-STOP
 * - WRITE-EVENT-HISTORY-UPDATE
 * - WRITE-EVENT-MANUAL
 *
 * See: docs/14_timeline_contracts.md
 */

/**
 * Creates a clinical event on the timeline.
 * This is the core function that all specific event creators use.
 *
 * Per contract:
 * - event_identifier: System-generated unique identifier
 * - recorded_timestamp: Current system timestamp (assigned automatically)
 * - All events are immutable once created
 */
export async function createTimelineEvent(
  input: CreateTimelineEventInput
): Promise<Result<ClinicalEvent>> {
  // Validate input per ERROR-MISSING-DATA and ERROR-INVALID-DATA contracts
  const validation = validateTimelineEventInput(input);
  if (!validation.valid) {
    return err(
      new DomainError("MISSING_REQUIRED_FIELDS", validation.reasons.join("; "), {
        reasons: validation.reasons,
      })
    );
  }

  // Verify clinical record exists
  const clinicalRecord = await prisma.clinicalRecord.findUnique({
    where: { id: input.clinicalRecordId },
  });

  if (!clinicalRecord) {
    return err(
      new DomainError(
        "CLINICAL_RECORD_NOT_FOUND",
        `Clinical record ${input.clinicalRecordId} not found`
      )
    );
  }

  // Create the event with proper source references based on sourceType
  const event = await prisma.clinicalEvent.create({
    data: {
      clinicalRecordId: input.clinicalRecordId,
      eventDate: input.eventDate,
      eventType: input.eventType,
      title: input.title,
      description: input.description,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      // Set the appropriate polymorphic reference
      noteId: input.noteId,
      medicationId: input.medicationId,
      psychiatricHistoryId: input.psychiatricHistoryId,
      // recordedAt is set automatically via @default(now())
    },
  });

  return ok(event);
}

/**
 * WRITE-EVENT-ENCOUNTER
 *
 * Generate an Encounter event when a Note is finalized.
 *
 * Trigger: A Note entity transitions from status=Draft to status=Finalized.
 */
export async function emitEncounterEvent(params: {
  clinicalRecordId: string;
  noteId: string;
  encounterDate: Date;
  title: string;
  description?: string;
}): Promise<Result<ClinicalEvent>> {
  return createTimelineEvent({
    clinicalRecordId: params.clinicalRecordId,
    eventDate: params.encounterDate,
    eventType: ClinicalEventType.Encounter,
    title: params.title,
    description: params.description,
    sourceType: SourceType.Note,
    sourceId: params.noteId,
    noteId: params.noteId,
  });
}

/**
 * WRITE-EVENT-MEDICATION-START
 *
 * Generate a Medication Start event when a Medication is created.
 *
 * Trigger: A new Medication entity is created with status=Active.
 */
export async function emitMedicationStartEvent(params: {
  clinicalRecordId: string;
  medicationId: string;
  startDate: Date;
  title: string;
  description: string;
}): Promise<Result<ClinicalEvent>> {
  return createTimelineEvent({
    clinicalRecordId: params.clinicalRecordId,
    eventDate: params.startDate,
    eventType: ClinicalEventType.MedicationStart,
    title: params.title,
    description: params.description,
    sourceType: SourceType.Medication,
    sourceId: params.medicationId,
    medicationId: params.medicationId,
  });
}

/**
 * WRITE-EVENT-MEDICATION-CHANGE
 *
 * Generate a Medication Change event when a medication dosage or frequency is modified.
 *
 * Trigger: A new Medication entity is created with predecessor_id referencing a discontinued Medication.
 */
export async function emitMedicationChangeEvent(params: {
  clinicalRecordId: string;
  medicationId: string;
  effectiveDate: Date;
  title: string;
  description?: string;
}): Promise<Result<ClinicalEvent>> {
  return createTimelineEvent({
    clinicalRecordId: params.clinicalRecordId,
    eventDate: params.effectiveDate,
    eventType: ClinicalEventType.MedicationChange,
    title: params.title,
    description: params.description,
    sourceType: SourceType.Medication,
    sourceId: params.medicationId,
    medicationId: params.medicationId,
  });
}

/**
 * WRITE-EVENT-MEDICATION-STOP
 *
 * Generate a Medication Stop event when a medication is discontinued.
 *
 * Trigger: A Medication entity transitions from status=Active to status=Discontinued.
 */
export async function emitMedicationStopEvent(params: {
  clinicalRecordId: string;
  medicationId: string;
  endDate: Date;
  title: string;
  description: string;
}): Promise<Result<ClinicalEvent>> {
  return createTimelineEvent({
    clinicalRecordId: params.clinicalRecordId,
    eventDate: params.endDate,
    eventType: ClinicalEventType.MedicationStop,
    title: params.title,
    description: params.description,
    sourceType: SourceType.Medication,
    sourceId: params.medicationId,
    medicationId: params.medicationId,
  });
}

/**
 * WRITE-EVENT-HISTORY-UPDATE
 *
 * Generate a History Update event when a new psychiatric history version is created.
 *
 * Trigger: A new PsychiatricHistory entity is created with version_number >= 2.
 *
 * Note: Version 1 (initial psychiatric history created with patient) does NOT generate an event.
 */
export async function emitHistoryUpdateEvent(params: {
  clinicalRecordId: string;
  psychiatricHistoryId: string;
  createdAt: Date;
  description?: string;
}): Promise<Result<ClinicalEvent>> {
  return createTimelineEvent({
    clinicalRecordId: params.clinicalRecordId,
    eventDate: params.createdAt,
    eventType: ClinicalEventType.HistoryUpdate,
    title: "Psychiatric history updated",
    description: params.description,
    sourceType: SourceType.PsychiatricHistory,
    sourceId: params.psychiatricHistoryId,
    psychiatricHistoryId: params.psychiatricHistoryId,
  });
}

/**
 * WRITE-EVENT-MANUAL
 *
 * Generate an event for occurrences not captured by other entities.
 *
 * Trigger: Direct clinician action to create a Hospitalization, Life Event, or Other event.
 */
export async function emitManualEvent(params: {
  clinicalRecordId: string;
  eventDate: Date;
  eventType:
    | ClinicalEventType.Hospitalization
    | ClinicalEventType.LifeEvent
    | ClinicalEventType.Other;
  title: string;
  description?: string;
}): Promise<Result<ClinicalEvent>> {
  return createTimelineEvent({
    clinicalRecordId: params.clinicalRecordId,
    eventDate: params.eventDate,
    eventType: params.eventType,
    title: params.title,
    description: params.description,
    sourceType: null,
    sourceId: null,
  });
}
