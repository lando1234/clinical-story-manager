/**
 * Timeline Reader - Read operations for the Timeline Engine.
 *
 * Implements:
 * - READ-TIMELINE-FULL (getFullTimeline)
 * - READ-TIMELINE-FILTERED (getFilteredTimeline)
 * - READ-EVENT-SINGLE (getSingleEvent)
 * - READ-EVENT-SOURCE (getEventSource)
 *
 * See: docs/14_timeline_contracts.md
 */

import { prisma } from "@/lib/prisma";
import {
  ClinicalEvent,
  ClinicalEventType,
  SourceType,
  NoteStatus,
} from "@/generated/prisma";
import { DomainError, Result, ok, err } from "@/types/errors";
import { EVENT_TYPE_PRIORITY } from "@/types/timeline";
import { ensureEncounterEventsForPatient } from "@/domain/appointments/encounter-event-generator";
import {
  TimelineDirection,
  TimelineEvent,
  FullTimelineResult,
  FilteredTimelineResult,
  TimelineFilters,
  SingleEventResult,
  EventSourceResult,
  NoteSourceData,
  AppointmentSourceData,
  MedicationSourceData,
  PsychiatricHistorySourceData,
  PsychiatricHistoryContent,
  AddendumData,
} from "./timeline-types";

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/**
 * Converts a Prisma ClinicalEvent to the contract TimelineEvent shape.
 */
function toTimelineEvent(event: ClinicalEvent): TimelineEvent {
  return {
    eventIdentifier: event.id,
    eventTimestamp: event.eventDate,
    recordedTimestamp: event.recordedAt,
    eventType: event.eventType,
    title: event.title,
    description: event.description,
    sourceType: event.sourceType,
    sourceIdentifier: event.sourceId,
  };
}

/**
 * Applies four-tier ordering per G-ORD-2.
 *
 * ORDER BY:
 * 1. event_timestamp ASC
 * 2. recorded_timestamp ASC
 * 3. event_type_priority ASC
 * 4. event_identifier ASC
 *
 * Since Prisma cannot order by enum priority in the database,
 * we apply a stable sort on the result set.
 */
function applyFourTierOrdering(events: ClinicalEvent[]): ClinicalEvent[] {
  return [...events].sort((a, b) => {
    // 1. Event timestamp (already sorted by DB, but ensure stability)
    const dateCompare = a.eventDate.getTime() - b.eventDate.getTime();
    if (dateCompare !== 0) return dateCompare;

    // 2. Recorded timestamp
    const recordedCompare = a.recordedAt.getTime() - b.recordedAt.getTime();
    if (recordedCompare !== 0) return recordedCompare;

    // 3. Event type priority
    const priorityA = EVENT_TYPE_PRIORITY[a.eventType];
    const priorityB = EVENT_TYPE_PRIORITY[b.eventType];
    const priorityCompare = priorityA - priorityB;
    if (priorityCompare !== 0) return priorityCompare;

    // 4. Event identifier (string comparison)
    return a.id.localeCompare(b.id);
  });
}

/**
 * Gets the clinical record ID for a patient.
 * Returns null if patient doesn't exist or has no clinical record.
 */
async function getClinicalRecordIdForPatient(
  patientId: string
): Promise<{ clinicalRecordId: string; patientId: string } | null> {
  const clinicalRecord = await prisma.clinicalRecord.findUnique({
    where: { patientId },
    select: { id: true, patientId: true },
  });
  return clinicalRecord
    ? { clinicalRecordId: clinicalRecord.id, patientId: clinicalRecord.patientId }
    : null;
}

/**
 * Validates timeline direction parameter.
 */
function isValidDirection(direction: unknown): direction is TimelineDirection {
  return direction === "ascending" || direction === "descending";
}

/**
 * Validates event type is in the enum.
 */
function isValidEventType(eventType: unknown): eventType is ClinicalEventType {
  return Object.values(ClinicalEventType).includes(eventType as ClinicalEventType);
}

// =============================================================================
// READ-TIMELINE-FULL (Contract 3.1)
// =============================================================================

/**
 * Retrieves the complete chronological history of clinical events for a patient.
 *
 * Per contract READ-TIMELINE-FULL:
 * - Returns all events ordered by four-tier ordering (G-ORD-2)
 * - Default direction is descending (most recent first)
 * - Excludes drafts and appointments (handled by data model - only finalized notes generate events)
 *
 * @param patientId - Unique identifier of the patient
 * @param direction - Ordering direction: 'ascending' or 'descending' (default: 'descending')
 */
export async function getFullTimeline(
  patientId: string,
  direction: TimelineDirection = "descending"
): Promise<Result<FullTimelineResult>> {
  // Validate direction parameter
  if (!isValidDirection(direction)) {
    return err(
      new DomainError(
        "INVALID_PARAMETER",
        `Invalid direction: ${direction}. Must be 'ascending' or 'descending'.`
      )
    );
  }

  // Get clinical record for patient
  const record = await getClinicalRecordIdForPatient(patientId);
  if (!record) {
    return err(
      new DomainError("PATIENT_NOT_FOUND", `Patient ${patientId} not found`)
    );
  }

  // Ensure Encounter events exist for past appointments
  await ensureEncounterEventsForPatient(patientId);

  // Get current date for filtering future Encounter events
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  // Fetch all events with basic DB ordering (will refine with stable sort)
  // Filter: Exclude Encounter events with future dates
  const events = await prisma.clinicalEvent.findMany({
    where: {
      clinicalRecordId: record.clinicalRecordId,
      OR: [
        { eventType: { not: ClinicalEventType.Encounter } },
        {
          eventType: ClinicalEventType.Encounter,
          eventDate: { lte: today },
        },
      ],
    },
    orderBy: [
      { eventDate: "asc" },
      { recordedAt: "asc" },
      { id: "asc" },
    ],
  });

  // Apply four-tier ordering
  let orderedEvents = applyFourTierOrdering(events);

  // Reverse if descending
  if (direction === "descending") {
    orderedEvents = orderedEvents.reverse();
  }

  return ok({
    patientIdentifier: patientId,
    eventCount: orderedEvents.length,
    events: orderedEvents.map(toTimelineEvent),
  });
}

// =============================================================================
// READ-TIMELINE-FILTERED (Contract 3.4)
// =============================================================================

/**
 * Retrieves a subset of timeline events matching specific criteria.
 *
 * Per contract READ-TIMELINE-FILTERED:
 * - Filter by event types, date range, or both
 * - Returns events ordered by four-tier ordering (G-ORD-2)
 * - Validates date range (end >= start)
 *
 * @param patientId - Unique identifier of the patient
 * @param filters - Filter options (eventTypes, dateRangeStart, dateRangeEnd, direction)
 */
export async function getFilteredTimeline(
  patientId: string,
  filters: TimelineFilters = {}
): Promise<Result<FilteredTimelineResult>> {
  const { eventTypes, dateRangeStart, dateRangeEnd, direction = "descending" } = filters;

  // Validate direction
  if (!isValidDirection(direction)) {
    return err(
      new DomainError(
        "INVALID_PARAMETER",
        `Invalid direction: ${direction}. Must be 'ascending' or 'descending'.`
      )
    );
  }

  // Validate event types if provided
  if (eventTypes && eventTypes.length > 0) {
    for (const eventType of eventTypes) {
      if (!isValidEventType(eventType)) {
        return err(
          new DomainError(
            "INVALID_EVENT_TYPE",
            `Invalid event type: ${eventType}`
          )
        );
      }
    }
  }

  // Validate date range
  if (dateRangeStart && dateRangeEnd && dateRangeEnd < dateRangeStart) {
    return err(
      new DomainError(
        "INVALID_DATE_RANGE",
        "date_range_end cannot be before date_range_start"
      )
    );
  }

  // Get clinical record for patient
  const record = await getClinicalRecordIdForPatient(patientId);
  if (!record) {
    return err(
      new DomainError("PATIENT_NOT_FOUND", `Patient ${patientId} not found`)
    );
  }

  // Ensure Encounter events exist for past appointments
  await ensureEncounterEventsForPatient(patientId);

  // Get current date for filtering future Encounter events
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  // Build base where clause
  const baseConditions: any[] = [
    // Include all non-Encounter events
    { eventType: { not: ClinicalEventType.Encounter } },
    // Include Encounter events only if date has passed
    {
      eventType: ClinicalEventType.Encounter,
      eventDate: { lte: today },
    },
  ];

  // Apply event type filter if provided
  if (eventTypes && eventTypes.length > 0) {
    const hasEncounter = eventTypes.includes(ClinicalEventType.Encounter);
    const otherTypes = eventTypes.filter((t) => t !== ClinicalEventType.Encounter);

    if (hasEncounter && otherTypes.length > 0) {
      // Filter: Include other types OR Encounter (past only)
      baseConditions[0] = { eventType: { in: otherTypes } };
      baseConditions[1] = {
        eventType: ClinicalEventType.Encounter,
        eventDate: { lte: today },
      };
    } else if (hasEncounter) {
      // Only Encounter events (past only)
      baseConditions[0] = {
        eventType: ClinicalEventType.Encounter,
        eventDate: { lte: today },
      };
      baseConditions.pop(); // Remove second condition
    } else {
      // Only other types
      baseConditions[0] = { eventType: { in: otherTypes } };
      baseConditions.pop(); // Remove Encounter condition
    }
  }

  // Build where clause
  const whereClause: any = {
    clinicalRecordId: record.clinicalRecordId,
    OR: baseConditions,
  };

  // Apply date range filter - need to combine with Encounter date filter
  if (dateRangeStart || dateRangeEnd) {
    // For Encounter events, we need to ensure they're not in the future
    // and also respect the date range filter
    const encounterDateFilter: any = { lte: today };
    if (dateRangeStart) {
      encounterDateFilter.gte = dateRangeStart;
    }
    if (dateRangeEnd) {
      encounterDateFilter.lte = dateRangeEnd < today ? dateRangeEnd : today;
    }

    // For other events, apply date range normally
    const otherDateFilter: any = {};
    if (dateRangeStart) {
      otherDateFilter.gte = dateRangeStart;
    }
    if (dateRangeEnd) {
      otherDateFilter.lte = dateRangeEnd;
    }

    // Update base conditions to include date filters
    baseConditions.forEach((condition, index) => {
      if (condition.eventType === ClinicalEventType.Encounter) {
        baseConditions[index] = {
          ...condition,
          eventDate: encounterDateFilter,
        };
      } else if (Object.keys(otherDateFilter).length > 0) {
        baseConditions[index] = {
          ...condition,
          eventDate: otherDateFilter,
        };
      }
    });
  }

  // Fetch filtered events
  const events = await prisma.clinicalEvent.findMany({
    where: whereClause,
    orderBy: [
      { eventDate: "asc" },
      { recordedAt: "asc" },
      { id: "asc" },
    ],
  });

  // Apply four-tier ordering
  let orderedEvents = applyFourTierOrdering(events);

  // Reverse if descending
  if (direction === "descending") {
    orderedEvents = orderedEvents.reverse();
  }

  return ok({
    patientIdentifier: patientId,
    filtersApplied: {
      eventTypes: eventTypes ?? null,
      dateRangeStart: dateRangeStart ?? null,
      dateRangeEnd: dateRangeEnd ?? null,
    },
    eventCount: orderedEvents.length,
    events: orderedEvents.map(toTimelineEvent),
  });
}

// =============================================================================
// READ-EVENT-SINGLE (Contract 3.5)
// =============================================================================

/**
 * Retrieves a specific event by its identifier.
 *
 * Per contract READ-EVENT-SINGLE:
 * - Returns the event if it exists
 * - Event attributes are immutable (G-PRES-1)
 *
 * @param eventId - Unique identifier of the event
 */
export async function getSingleEvent(
  eventId: string
): Promise<Result<SingleEventResult>> {
  const event = await prisma.clinicalEvent.findUnique({
    where: { id: eventId },
    include: {
      clinicalRecord: {
        select: { patientId: true },
      },
    },
  });

  if (!event) {
    return err(
      new DomainError("EVENT_NOT_FOUND", `Event ${eventId} not found`)
    );
  }

  return ok({
    eventIdentifier: event.id,
    patientIdentifier: event.clinicalRecord.patientId,
    eventTimestamp: event.eventDate,
    recordedTimestamp: event.recordedAt,
    eventType: event.eventType,
    title: event.title,
    description: event.description,
    sourceType: event.sourceType,
    sourceIdentifier: event.sourceId,
  });
}

// =============================================================================
// READ-EVENT-SOURCE (Contract 3.6)
// =============================================================================

/**
 * Extracts psychiatric history content from the model.
 */
function extractPsychiatricHistoryContent(
  history: {
    chiefComplaint: string | null;
    historyOfPresentIllness: string | null;
    pastPsychiatricHistory: string | null;
    pastHospitalizations: string | null;
    suicideAttemptHistory: string | null;
    substanceUseHistory: string | null;
    familyPsychiatricHistory: string | null;
    medicalHistory: string | null;
    surgicalHistory: string | null;
    allergies: string | null;
    socialHistory: string | null;
    developmentalHistory: string | null;
  }
): PsychiatricHistoryContent {
  return {
    chiefComplaint: history.chiefComplaint,
    historyOfPresentIllness: history.historyOfPresentIllness,
    pastPsychiatricHistory: history.pastPsychiatricHistory,
    pastHospitalizations: history.pastHospitalizations,
    suicideAttemptHistory: history.suicideAttemptHistory,
    substanceUseHistory: history.substanceUseHistory,
    familyPsychiatricHistory: history.familyPsychiatricHistory,
    medicalHistory: history.medicalHistory,
    surgicalHistory: history.surgicalHistory,
    allergies: history.allergies,
    socialHistory: history.socialHistory,
    developmentalHistory: history.developmentalHistory,
  };
}

/**
 * Retrieves the full source entity for a source-generated event.
 *
 * Per contract READ-EVENT-SOURCE:
 * - Returns the source entity based on sourceType
 * - For manual events (sourceType = null), returns a message
 * - If source is unavailable, returns SOURCE_UNAVAILABLE error
 *
 * @param eventId - Unique identifier of the event
 */
export async function getEventSource(
  eventId: string
): Promise<Result<EventSourceResult>> {
  const event = await prisma.clinicalEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return err(
      new DomainError("EVENT_NOT_FOUND", `Event ${eventId} not found`)
    );
  }

  // Manual events have no source
  if (event.sourceType === null || event.sourceType === SourceType.Manual) {
    return ok({
      sourceType: null,
      message: "This event has no source entity",
    });
  }

  // Handle Appointment source
  if (event.sourceType === SourceType.Appointment) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: event.appointmentId! },
    });

    if (!appointment) {
      return err(
        new DomainError(
          "SOURCE_UNAVAILABLE",
          `Source appointment ${event.appointmentId} is unavailable`,
          { eventId, sourceType: "Appointment", sourceId: event.appointmentId }
        )
      );
    }

    const appointmentData: AppointmentSourceData = {
      appointmentIdentifier: appointment.id,
      scheduledDate: appointment.scheduledDate,
      scheduledTime: appointment.scheduledTime,
      durationMinutes: appointment.durationMinutes,
      appointmentType: appointment.appointmentType,
      status: appointment.status,
      notes: appointment.notes,
    };

    return ok({
      sourceType: "Appointment",
      appointment: appointmentData,
    });
  }

  // Handle Note source
  if (event.sourceType === SourceType.Note) {
    const note = await prisma.note.findUnique({
      where: { id: event.noteId! },
      include: {
        addenda: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!note) {
      return err(
        new DomainError(
          "SOURCE_UNAVAILABLE",
          `Source note ${event.noteId} is unavailable`,
          { eventId, sourceType: "Note", sourceId: event.noteId }
        )
      );
    }

    // Note must be finalized (per contract, only finalized notes generate events)
    if (note.status !== NoteStatus.Finalized || !note.finalizedAt) {
      return err(
        new DomainError(
          "SOURCE_UNAVAILABLE",
          `Source note ${event.noteId} is not finalized`,
          { eventId, sourceType: "Note", sourceId: event.noteId }
        )
      );
    }

    const noteData: NoteSourceData = {
      noteIdentifier: note.id,
      encounterDate: note.encounterDate,
      encounterType: note.encounterType,
      subjective: note.subjective,
      objective: note.objective,
      assessment: note.assessment,
      plan: note.plan,
      finalizedAt: note.finalizedAt,
      addenda: note.addenda.map((a): AddendumData => ({
        addendumIdentifier: a.id,
        content: a.content,
        reason: a.reason,
        createdAt: a.createdAt,
      })),
    };

    return ok({
      sourceType: "Note",
      note: noteData,
    });
  }

  // Handle Medication source
  if (event.sourceType === SourceType.Medication) {
    const medication = await prisma.medication.findUnique({
      where: { id: event.medicationId! },
    });

    if (!medication) {
      return err(
        new DomainError(
          "SOURCE_UNAVAILABLE",
          `Source medication ${event.medicationId} is unavailable`,
          { eventId, sourceType: "Medication", sourceId: event.medicationId }
        )
      );
    }

    const medicationData: MedicationSourceData = {
      medicationIdentifier: medication.id,
      drugName: medication.drugName,
      dosage: medication.dosage,
      dosageUnit: medication.dosageUnit,
      frequency: medication.frequency,
      route: medication.route,
      startDate: medication.startDate,
      endDate: medication.endDate,
      prescribingReason: medication.prescribingReason,
      discontinuationReason: medication.discontinuationReason,
      status: medication.status,
      predecessorIdentifier: medication.predecessorId,
    };

    return ok({
      sourceType: "Medication",
      medication: medicationData,
    });
  }

  // Handle PsychiatricHistory source
  if (event.sourceType === SourceType.PsychiatricHistory) {
    const history = await prisma.psychiatricHistory.findUnique({
      where: { id: event.psychiatricHistoryId! },
    });

    if (!history) {
      return err(
        new DomainError(
          "SOURCE_UNAVAILABLE",
          `Source psychiatric history ${event.psychiatricHistoryId} is unavailable`,
          {
            eventId,
            sourceType: "PsychiatricHistory",
            sourceId: event.psychiatricHistoryId,
          }
        )
      );
    }

    const historyData: PsychiatricHistorySourceData = {
      versionIdentifier: history.id,
      versionNumber: history.versionNumber,
      content: extractPsychiatricHistoryContent(history),
      createdAt: history.createdAt,
      supersededAt: history.supersededAt,
    };

    return ok({
      sourceType: "PsychiatricHistory",
      psychiatricHistory: historyData,
    });
  }

  // Unknown source type - should not happen with valid enum
  return err(
    new DomainError(
      "SOURCE_UNAVAILABLE",
      `Unknown source type: ${event.sourceType}`,
      { eventId, sourceType: event.sourceType }
    )
  );
}
