/**
 * State Resolver - State derivation operations for the Timeline Engine.
 *
 * Implements:
 * - READ-STATE-CURRENT (getCurrentState)
 * - READ-STATE-HISTORICAL (getHistoricalState)
 *
 * See: docs/14_timeline_contracts.md
 */

import { prisma } from "@/lib/prisma";
import { MedicationStatus, NoteStatus } from "@/generated/prisma";
import { DomainError, Result, ok, err } from "@/types/errors";
import { EVENT_TYPE_PRIORITY } from "@/types/timeline";
import {
  CurrentStateResult,
  HistoricalStateResult,
  ActiveMedication,
  HistoricalActiveMedication,
  CurrentPsychiatricHistory,
  HistoricalPsychiatricHistory,
  MostRecentNote,
  TimelineEventSummary,
  PsychiatricHistoryContent,
} from "./timeline-types";

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/**
 * Gets the clinical record ID for a patient.
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
 * Gets the end of day for a date (23:59:59.999).
 */
function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Checks if a date is in the future (after today).
 */
function isDateInFuture(date: Date): boolean {
  const today = endOfDay(new Date());
  return date > today;
}

// =============================================================================
// READ-STATE-CURRENT (Contract 3.2)
// =============================================================================

/**
 * Retrieves the patient's current clinical state as of this moment.
 *
 * Per contract READ-STATE-CURRENT:
 * - Current active medications (status = Active)
 * - Current psychiatric history version (isCurrent = true)
 * - Most recent finalized note
 *
 * @param patientId - Unique identifier of the patient
 */
export async function getCurrentState(
  patientId: string
): Promise<Result<CurrentStateResult>> {
  // Get clinical record for patient
  const record = await getClinicalRecordIdForPatient(patientId);
  if (!record) {
    return err(
      new DomainError("PATIENT_NOT_FOUND", `Patient ${patientId} not found`)
    );
  }

  // Fetch active medications
  const activeMedications = await prisma.medication.findMany({
    where: {
      clinicalRecordId: record.clinicalRecordId,
      status: MedicationStatus.Active,
    },
    orderBy: { prescriptionIssueDate: "desc" },
  });

  // Fetch current psychiatric history (isCurrent = true)
  const currentHistory = await prisma.psychiatricHistory.findFirst({
    where: {
      clinicalRecordId: record.clinicalRecordId,
      isCurrent: true,
    },
  });

  // Per contract: Patient should always have psychiatric history
  // (history is created with patient). If not, return error.
  if (!currentHistory) {
    return err(
      new DomainError(
        "INVALID_STATE",
        "Patient has no current psychiatric history. This should not occur.",
        { patientId }
      )
    );
  }

  // Fetch most recent finalized note
  const mostRecentNote = await prisma.note.findFirst({
    where: {
      clinicalRecordId: record.clinicalRecordId,
      status: NoteStatus.Finalized,
    },
    orderBy: { finalizedAt: "desc" },
  });

  // Build response
  const activeMedsData: ActiveMedication[] = activeMedications.map((med) => ({
    medicationIdentifier: med.id,
    drugName: med.drugName,
    dosage: med.dosage,
    dosageUnit: med.dosageUnit,
    frequency: med.frequency,
    prescriptionIssueDate: med.prescriptionIssueDate,
    prescriptionRenewalPeriod: med.prescriptionRenewalPeriod,
    comments: med.comments,
  }));

  const currentHistoryData: CurrentPsychiatricHistory = {
    versionIdentifier: currentHistory.id,
    versionNumber: currentHistory.versionNumber,
    createdAt: currentHistory.createdAt,
    content: extractPsychiatricHistoryContent(currentHistory),
  };

  const mostRecentNoteData: MostRecentNote | null = mostRecentNote
    ? {
        noteIdentifier: mostRecentNote.id,
        encounterDate: mostRecentNote.encounterDate,
        encounterType: mostRecentNote.encounterType,
        finalizedAt: mostRecentNote.finalizedAt!,
      }
    : null;

  return ok({
    patientIdentifier: patientId,
    asOfDate: new Date(),
    activeMedications: activeMedsData,
    currentPsychiatricHistory: currentHistoryData,
    mostRecentNote: mostRecentNoteData,
  });
}

// =============================================================================
// READ-STATE-HISTORICAL (Contract 3.3)
// =============================================================================

/**
 * Retrieves the patient's clinical state as it existed on a specific historical date.
 *
 * Per contract READ-STATE-HISTORICAL:
 * - Events: eventDate <= targetDate
 * - Medications: prescriptionIssueDate <= targetDate AND (endDate IS NULL OR endDate > targetDate)
 * - Psychiatric history: createdAt <= targetDate AND (supersededAt IS NULL OR supersededAt > targetDate)
 *
 * @param patientId - Unique identifier of the patient
 * @param targetDate - The date for which to reconstruct state
 */
export async function getHistoricalState(
  patientId: string,
  targetDate: Date
): Promise<Result<HistoricalStateResult>> {
  // Validate target date is not in the future
  if (isDateInFuture(targetDate)) {
    return err(
      new DomainError(
        "INVALID_TIMESTAMP_FUTURE",
        "Target date cannot be in the future"
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

  // Use end of target date for comparisons
  const targetDateEnd = endOfDay(targetDate);

  // Fetch events through target date
  const events = await prisma.clinicalEvent.findMany({
    where: {
      clinicalRecordId: record.clinicalRecordId,
      eventDate: { lte: targetDateEnd },
    },
    orderBy: [
      { eventDate: "asc" },
      { recordedAt: "asc" },
      { id: "asc" },
    ],
  });

  // Apply four-tier ordering
  const orderedEvents = [...events].sort((a, b) => {
    const dateCompare = a.eventDate.getTime() - b.eventDate.getTime();
    if (dateCompare !== 0) return dateCompare;

    const recordedCompare = a.recordedAt.getTime() - b.recordedAt.getTime();
    if (recordedCompare !== 0) return recordedCompare;

    const priorityA = EVENT_TYPE_PRIORITY[a.eventType];
    const priorityB = EVENT_TYPE_PRIORITY[b.eventType];
    const priorityCompare = priorityA - priorityB;
    if (priorityCompare !== 0) return priorityCompare;

    return a.id.localeCompare(b.id);
  });

  // Fetch medications active on target date
  // Per contract: prescriptionIssueDate <= targetDate AND (endDate IS NULL OR endDate > targetDate)
  const activeMedications = await prisma.medication.findMany({
    where: {
      clinicalRecordId: record.clinicalRecordId,
      prescriptionIssueDate: { lte: targetDateEnd },
      OR: [
        { endDate: null },
        { endDate: { gt: targetDateEnd } },
      ],
    },
    orderBy: { prescriptionIssueDate: "desc" },
  });

  // Fetch psychiatric history version that was current on target date
  // Per contract: createdAt <= targetDate AND (supersededAt IS NULL OR supersededAt > targetDate)
  const historicalHistory = await prisma.psychiatricHistory.findFirst({
    where: {
      clinicalRecordId: record.clinicalRecordId,
      createdAt: { lte: targetDateEnd },
      OR: [
        { supersededAt: null },
        { supersededAt: { gt: targetDateEnd } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  // Build response
  const eventSummaries: TimelineEventSummary[] = orderedEvents.map((event) => ({
    eventIdentifier: event.id,
    eventTimestamp: event.eventDate,
    eventType: event.eventType,
    title: event.title,
  }));

  const activeMedsData: HistoricalActiveMedication[] = activeMedications.map((med) => ({
    medicationIdentifier: med.id,
    drugName: med.drugName,
    dosage: med.dosage,
    dosageUnit: med.dosageUnit,
    frequency: med.frequency,
    prescriptionIssueDate: med.prescriptionIssueDate,
    prescriptionRenewalPeriod: med.prescriptionRenewalPeriod,
  }));

  const historicalHistoryData: HistoricalPsychiatricHistory | null = historicalHistory
    ? {
        versionIdentifier: historicalHistory.id,
        versionNumber: historicalHistory.versionNumber,
        createdAt: historicalHistory.createdAt,
        content: extractPsychiatricHistoryContent(historicalHistory),
      }
    : null;

  return ok({
    patientIdentifier: patientId,
    asOfDate: targetDate,
    eventsThroughDate: eventSummaries,
    activeMedicationsOnDate: activeMedsData,
    psychiatricHistoryOnDate: historicalHistoryData,
  });
}
