/**
 * Timeline Engine Types
 *
 * Output shapes and input types for Timeline Engine read contracts.
 * See: docs/14_timeline_contracts.md
 */

import {
  ClinicalEventType,
  SourceType,
  EncounterType,
  MedicationStatus,
  Prisma,
} from "@/generated/prisma";

// =============================================================================
// COMMON TYPES
// =============================================================================

/**
 * Direction for timeline ordering.
 * - ascending: oldest first (chronological)
 * - descending: most recent first (reverse chronological, default)
 */
export type TimelineDirection = "ascending" | "descending";

/**
 * Event representation in timeline output.
 * Common shape used across multiple read contracts.
 */
export interface TimelineEvent {
  eventIdentifier: string;
  eventTimestamp: Date;
  recordedTimestamp: Date;
  eventType: ClinicalEventType;
  title: string;
  description: string | null;
  sourceType: SourceType | null;
  sourceIdentifier: string | null;
}

/**
 * Simplified event for historical state output.
 */
export interface TimelineEventSummary {
  eventIdentifier: string;
  eventTimestamp: Date;
  eventType: ClinicalEventType;
  title: string;
}

// =============================================================================
// READ-TIMELINE-FULL (Contract 3.1)
// =============================================================================

/**
 * Output shape for READ-TIMELINE-FULL contract.
 */
export interface FullTimelineResult {
  patientIdentifier: string;
  eventCount: number;
  events: TimelineEvent[];
}

// =============================================================================
// READ-STATE-CURRENT (Contract 3.2)
// =============================================================================

/**
 * Active medication in current state.
 */
export interface ActiveMedication {
  medicationIdentifier: string;
  drugName: string;
  dosage: Prisma.Decimal;
  dosageUnit: string;
  frequency: string;
  prescriptionIssueDate: Date;
  comments: string | null;
}

/**
 * Current psychiatric history version.
 */
export interface CurrentPsychiatricHistory {
  versionIdentifier: string;
  versionNumber: number;
  createdAt: Date;
  content: PsychiatricHistoryContent;
}

/**
 * Psychiatric history content fields.
 */
export interface PsychiatricHistoryContent {
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

/**
 * Most recent note summary.
 */
export interface MostRecentNote {
  noteIdentifier: string;
  encounterDate: Date;
  encounterType: EncounterType;
  finalizedAt: Date;
}

/**
 * Output shape for READ-STATE-CURRENT contract.
 */
export interface CurrentStateResult {
  patientIdentifier: string;
  asOfDate: Date;
  activeMedications: ActiveMedication[];
  currentPsychiatricHistory: CurrentPsychiatricHistory;
  mostRecentNote: MostRecentNote | null;
}

// =============================================================================
// READ-STATE-HISTORICAL (Contract 3.3)
// =============================================================================

/**
 * Medication active on a historical date.
 */
export interface HistoricalActiveMedication {
  medicationIdentifier: string;
  drugName: string;
  dosage: Prisma.Decimal;
  dosageUnit: string;
  frequency: string;
  prescriptionIssueDate: Date;
}

/**
 * Psychiatric history version on a historical date.
 */
export interface HistoricalPsychiatricHistory {
  versionIdentifier: string;
  versionNumber: number;
  createdAt: Date;
  content: PsychiatricHistoryContent;
}

/**
 * Output shape for READ-STATE-HISTORICAL contract.
 */
export interface HistoricalStateResult {
  patientIdentifier: string;
  asOfDate: Date;
  eventsThroughDate: TimelineEventSummary[];
  activeMedicationsOnDate: HistoricalActiveMedication[];
  psychiatricHistoryOnDate: HistoricalPsychiatricHistory | null;
}

// =============================================================================
// READ-TIMELINE-FILTERED (Contract 3.4)
// =============================================================================

/**
 * Filter options for filtered timeline retrieval.
 */
export interface TimelineFilters {
  eventTypes?: ClinicalEventType[];
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  direction?: TimelineDirection;
}

/**
 * Applied filters in output.
 */
export interface AppliedFilters {
  eventTypes: ClinicalEventType[] | null;
  dateRangeStart: Date | null;
  dateRangeEnd: Date | null;
}

/**
 * Output shape for READ-TIMELINE-FILTERED contract.
 */
export interface FilteredTimelineResult {
  patientIdentifier: string;
  filtersApplied: AppliedFilters;
  eventCount: number;
  events: TimelineEvent[];
}

// =============================================================================
// READ-EVENT-SINGLE (Contract 3.5)
// =============================================================================

/**
 * Output shape for READ-EVENT-SINGLE contract.
 */
export interface SingleEventResult {
  eventIdentifier: string;
  patientIdentifier: string;
  eventTimestamp: Date;
  recordedTimestamp: Date;
  eventType: ClinicalEventType;
  title: string;
  description: string | null;
  sourceType: SourceType | null;
  sourceIdentifier: string | null;
}

// =============================================================================
// READ-EVENT-SOURCE (Contract 3.6)
// =============================================================================

/**
 * Addendum attached to a note.
 */
export interface AddendumData {
  addendumIdentifier: string;
  content: string;
  reason: string;
  createdAt: Date;
}

/**
 * Note source data.
 */
export interface NoteSourceData {
  noteIdentifier: string;
  encounterDate: Date;
  encounterType: EncounterType;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  finalizedAt: Date;
  addenda: AddendumData[];
}

/**
 * Medication source data.
 */
export interface MedicationSourceData {
  medicationIdentifier: string;
  drugName: string;
  dosage: Prisma.Decimal;
  dosageUnit: string;
  frequency: string;
  prescriptionIssueDate: Date;
  endDate: Date | null;
  comments: string | null;
  discontinuationReason: string | null;
  status: MedicationStatus;
  predecessorIdentifier: string | null;
}

/**
 * Psychiatric history source data.
 */
export interface PsychiatricHistorySourceData {
  versionIdentifier: string;
  versionNumber: number;
  content: PsychiatricHistoryContent;
  createdAt: Date;
  supersededAt: Date | null;
}

/**
 * Appointment source data.
 */
export interface AppointmentSourceData {
  appointmentIdentifier: string;
  scheduledDate: Date;
  scheduledTime: Date | null;
  durationMinutes: number | null;
  appointmentType: string;
  status: string;
  notes: string | null;
}

/**
 * Event source result - discriminated union based on sourceType.
 */
export type EventSourceResult =
  | {
      sourceType: "Note";
      note: NoteSourceData;
    }
  | {
      sourceType: "Appointment";
      appointment: AppointmentSourceData;
    }
  | {
      sourceType: "Medication";
      medication: MedicationSourceData;
    }
  | {
      sourceType: "PsychiatricHistory";
      psychiatricHistory: PsychiatricHistorySourceData;
    }
  | {
      sourceType: null;
      message: "This event has no source entity";
    };
