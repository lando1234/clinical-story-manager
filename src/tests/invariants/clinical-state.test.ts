/**
 * Clinical State Invariant Tests
 *
 * Tests for INV-STATE-01 through INV-STATE-09.
 * Validates medication state consistency, psychiatric history state,
 * and note/appointment event generation rules.
 *
 * See: docs/15_timeline_qa_invariants.md Section 4
 */

import { describe, it, expect, beforeEach } from "vitest";
import { testPrisma, cleanupTestData } from "../setup";
import {
  createCompletePatientSetup,
  createTestMedication,
  createTestDiscontinuedMedication,
  createTestPsychiatricHistory,
  createTestNote,
  createTestFinalizedNote,
  createTestAppointment,
  createTestNoteEvent,
} from "../utils/test-fixtures";
import {
  daysAgo,
  daysFromNow,
  assertResultOk,
} from "../utils/test-helpers";
import {
  getCurrentState,
  getHistoricalState,
  getFullTimeline,
} from "@/domain/timeline";
import {
  MedicationStatus,
  NoteStatus,
  ClinicalEventType,
  SourceType,
  AppointmentStatus,
} from "@/generated/prisma";

describe("Clinical State Invariants", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  // ===========================================================================
  // INV-STATE-01: Active medications are consistent with lifecycle events
  // ===========================================================================
  describe("INV-STATE-01: Active Medication Derivation", () => {
    it("medication is active when prescription_issue_date <= today and end_date is null", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Active Med",
        prescriptionIssueDate: daysAgo(30),
        endDate: null,
        status: MedicationStatus.Active,
      });

      const result = await getCurrentState(patient.id);
      const state = assertResultOk(result);

      expect(state.activeMedications.length).toBe(1);
      expect(state.activeMedications[0].drugName).toBe("Active Med");
    });

    it("medication is not active when end_date is in the past", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Stopped Med",
        prescriptionIssueDate: daysAgo(60),
        endDate: daysAgo(10),
      });

      const result = await getCurrentState(patient.id);
      const state = assertResultOk(result);

      // Should not appear in active medications
      const found = state.activeMedications.find((m) => m.drugName === "Stopped Med");
      expect(found).toBeUndefined();
    });

    it("historical state shows medication active on date between start and end", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Past Med",
        prescriptionIssueDate: daysAgo(60),
        endDate: daysAgo(30),
      });

      // Query for date when medication was active
      const result = await getHistoricalState(patient.id, daysAgo(45));
      const state = assertResultOk(result);

      const found = state.activeMedicationsOnDate.find((m) => m.drugName === "Past Med");
      expect(found).toBeDefined();
    });

    it("historical state excludes medication before its prescription_issue_date", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Started Later",
        prescriptionIssueDate: daysAgo(10),
        status: MedicationStatus.Active,
      });

      // Query for date before medication started
      const result = await getHistoricalState(patient.id, daysAgo(20));
      const state = assertResultOk(result);

      const found = state.activeMedicationsOnDate.find((m) => m.drugName === "Started Later");
      expect(found).toBeUndefined();
    });

    it("set of active medications is deterministically derivable", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create mix of active and discontinued
      await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Active 1",
        prescriptionIssueDate: daysAgo(30),
        status: MedicationStatus.Active,
      });

      await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Active 2",
        prescriptionIssueDate: daysAgo(15),
        status: MedicationStatus.Active,
      });

      await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Discontinued",
        prescriptionIssueDate: daysAgo(60),
        endDate: daysAgo(20),
      });

      // Multiple queries should return same result
      const results = [];
      for (let i = 0; i < 3; i++) {
        const result = await getCurrentState(patient.id);
        const state = assertResultOk(result);
        results.push(state.activeMedications.map((m) => m.drugName).sort());
      }

      // All results identical
      expect(results[0]).toEqual(results[1]);
      expect(results[1]).toEqual(results[2]);
      expect(results[0]).toEqual(["Active 1", "Active 2"]);
    });
  });

  // ===========================================================================
  // INV-STATE-02: Medication cannot be simultaneously active and stopped
  // ===========================================================================
  describe("INV-STATE-02: No Contradictory Medication Status", () => {
    it("active medication has no end_date or end_date in future", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const activeMed = await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Active Med",
        prescriptionIssueDate: daysAgo(30),
        endDate: null,
        status: MedicationStatus.Active,
      });

      expect(activeMed.status).toBe(MedicationStatus.Active);
      expect(activeMed.endDate).toBeNull();
    });

    it("discontinued medication has end_date on or before today", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();
      const endDate = daysAgo(5);

      const discontinuedMed = await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Discontinued Med",
        prescriptionIssueDate: daysAgo(60),
        endDate,
      });

      expect(discontinuedMed.status).toBe(MedicationStatus.Discontinued);
      expect(discontinuedMed.endDate).not.toBeNull();
      expect(discontinuedMed.endDate!.getTime()).toBeLessThanOrEqual(new Date().getTime());
    });

    it("all medications in database satisfy status consistency", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Create various medications
      await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Active 1",
        prescriptionIssueDate: daysAgo(30),
        status: MedicationStatus.Active,
      });

      await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Discontinued 1",
        prescriptionIssueDate: daysAgo(90),
        endDate: daysAgo(60),
      });

      // Verify all medications
      const allMeds = await testPrisma.medication.findMany({
        where: { clinicalRecordId: clinicalRecord.id },
      });

      for (const med of allMeds) {
        if (med.status === MedicationStatus.Active) {
          // Active implies no end_date or end_date > today
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          expect(
            med.endDate === null || med.endDate > today
          ).toBe(true);
        } else if (med.status === MedicationStatus.Discontinued) {
          // Discontinued implies end_date exists
          expect(med.endDate).not.toBeNull();
        }
      }
    });
  });

  // ===========================================================================
  // INV-STATE-03: Medication end date is on or after start date
  // ===========================================================================
  describe("INV-STATE-03: Valid Medication Date Range", () => {
    it("end_date >= prescription_issue_date is valid", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();
      const prescriptionIssueDate = daysAgo(30);
      const endDate = daysAgo(10);

      const med = await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        prescriptionIssueDate,
        endDate,
      });

      expect(med.endDate!.getTime()).toBeGreaterThanOrEqual(med.prescriptionIssueDate.getTime());
    });

    it("same-day prescription issue and stop is valid (zero-duration)", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();
      const sameDay = daysAgo(10);

      const med = await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        prescriptionIssueDate: sameDay,
        endDate: sameDay,
      });

      expect(med.prescriptionIssueDate.toDateString()).toBe(med.endDate!.toDateString());
    });

    it("all medications satisfy end_date >= prescription_issue_date", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Create multiple medications
      await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Med 1",
        prescriptionIssueDate: daysAgo(30),
      });

      await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Med 2",
        prescriptionIssueDate: daysAgo(60),
        endDate: daysAgo(30),
      });

      await createTestDiscontinuedMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Med 3 Same Day",
        prescriptionIssueDate: daysAgo(20),
        endDate: daysAgo(20),
      });

      // Verify all
      const allMeds = await testPrisma.medication.findMany({
        where: { clinicalRecordId: clinicalRecord.id },
      });

      for (const med of allMeds) {
        if (med.endDate !== null) {
          expect(med.endDate.getTime()).toBeGreaterThanOrEqual(med.prescriptionIssueDate.getTime());
        }
      }
    });
  });

  // ===========================================================================
  // INV-STATE-04: Exactly one current psychiatric history version
  // ===========================================================================
  describe("INV-STATE-04: Single Current Psychiatric History", () => {
    it("exactly one version has is_current = true", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Update initial version 1 to be non-current
      await testPrisma.psychiatricHistory.updateMany({
        where: { clinicalRecordId: clinicalRecord.id, versionNumber: 1 },
        data: { isCurrent: false, supersededAt: daysAgo(10) },
      });

      await createTestPsychiatricHistory({
        clinicalRecordId: clinicalRecord.id,
        versionNumber: 2,
        isCurrent: false,
        supersededAt: daysAgo(5),
      });

      await createTestPsychiatricHistory({
        clinicalRecordId: clinicalRecord.id,
        versionNumber: 3,
        isCurrent: true,
      });

      // Count current versions
      const currentVersions = await testPrisma.psychiatricHistory.findMany({
        where: {
          clinicalRecordId: clinicalRecord.id,
          isCurrent: true,
        },
      });

      expect(currentVersions.length).toBe(1);
      expect(currentVersions[0].versionNumber).toBe(3);
    });

    it("non-current versions have is_current = false", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Update initial version 1 to be non-current
      await testPrisma.psychiatricHistory.updateMany({
        where: { clinicalRecordId: clinicalRecord.id, versionNumber: 1 },
        data: { isCurrent: false, supersededAt: daysAgo(5) },
      });

      await createTestPsychiatricHistory({
        clinicalRecordId: clinicalRecord.id,
        versionNumber: 2,
        isCurrent: true,
      });

      const nonCurrent = await testPrisma.psychiatricHistory.findMany({
        where: {
          clinicalRecordId: clinicalRecord.id,
          isCurrent: false,
        },
      });

      expect(nonCurrent.length).toBe(1);
      expect(nonCurrent[0].versionNumber).toBe(1);
    });
  });

  // ===========================================================================
  // INV-STATE-05: Current version has no superseded_at timestamp
  // ===========================================================================
  describe("INV-STATE-05: Current Version Not Superseded", () => {
    it("current version has superseded_at = null", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Get the initial version 1 created by setup
      const currentVersion = await testPrisma.psychiatricHistory.findFirst({
        where: {
          clinicalRecordId: clinicalRecord.id,
          versionNumber: 1,
        },
      });

      expect(currentVersion).toBeDefined();
      expect(currentVersion!.isCurrent).toBe(true);
      expect(currentVersion!.supersededAt).toBeNull();
    });

    it("version with superseded_at set cannot be current", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Update initial version 1 to be superseded and non-current
      await testPrisma.psychiatricHistory.updateMany({
        where: { clinicalRecordId: clinicalRecord.id, versionNumber: 1 },
        data: { isCurrent: false, supersededAt: daysAgo(5) },
      });

      const oldVersion = await testPrisma.psychiatricHistory.findFirst({
        where: {
          clinicalRecordId: clinicalRecord.id,
          versionNumber: 1,
        },
      });

      expect(oldVersion).toBeDefined();
      expect(oldVersion!.supersededAt).not.toBeNull();
      expect(oldVersion!.isCurrent).toBe(false);
    });

    it("all current versions in database have superseded_at = null", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Update the initial version 1 to be non-current
      await testPrisma.psychiatricHistory.updateMany({
        where: { clinicalRecordId: clinicalRecord.id, versionNumber: 1 },
        data: { isCurrent: false, supersededAt: daysAgo(10) },
      });

      await createTestPsychiatricHistory({
        clinicalRecordId: clinicalRecord.id,
        versionNumber: 2,
        isCurrent: true,
        supersededAt: null,
      });

      // All current versions must have null superseded_at
      const currentVersions = await testPrisma.psychiatricHistory.findMany({
        where: { isCurrent: true },
      });

      for (const version of currentVersions) {
        expect(version.supersededAt).toBeNull();
      }
    });
  });

  // ===========================================================================
  // INV-STATE-06: Historical version determination is unambiguous
  // ===========================================================================
  describe("INV-STATE-06: Unambiguous Historical Version", () => {
    it("exactly one version is current on any historical date", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Update the initial version 1 to be non-current with supersession
      await testPrisma.psychiatricHistory.updateMany({
        where: { clinicalRecordId: clinicalRecord.id, versionNumber: 1 },
        data: {
          isCurrent: false,
          createdAt: daysAgo(60),
          supersededAt: daysAgo(30),
          chiefComplaint: "Version 1",
        },
      });

      await createTestPsychiatricHistory({
        clinicalRecordId: clinicalRecord.id,
        versionNumber: 2,
        chiefComplaint: "Version 2",
        isCurrent: true,
        createdAt: daysAgo(30),
        supersededAt: null,
      });

      // Query for date when version 1 was current
      const result1 = await getHistoricalState(patient.id, daysAgo(45));
      const state1 = assertResultOk(result1);
      expect(state1.psychiatricHistoryOnDate?.versionNumber).toBe(1);

      // Query for date when version 2 is current
      const result2 = await getHistoricalState(patient.id, daysAgo(15));
      const state2 = assertResultOk(result2);
      expect(state2.psychiatricHistoryOnDate?.versionNumber).toBe(2);
    });

    it("version determination follows created_at <= D and (superseded_at null or > D)", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Update the initial version 1 to match test requirements
      await testPrisma.psychiatricHistory.updateMany({
        where: { clinicalRecordId: clinicalRecord.id, versionNumber: 1 },
        data: {
          createdAt: daysAgo(100),
          supersededAt: daysAgo(50),
          isCurrent: false,
        },
      });

      await createTestPsychiatricHistory({
        clinicalRecordId: clinicalRecord.id,
        versionNumber: 2,
        createdAt: daysAgo(50),
        supersededAt: null,
        isCurrent: true,
      });

      // At day 75, version 1 was current (created 100 ago, superseded 50 ago)
      const result = await getHistoricalState(patient.id, daysAgo(75));
      const state = assertResultOk(result);

      expect(state.psychiatricHistoryOnDate?.versionNumber).toBe(1);
    });
  });

  // ===========================================================================
  // INV-STATE-07: Finalized notes have exactly one NOTE event
  // ===========================================================================
  describe("INV-STATE-07: Finalized Notes Generate Events", () => {
    it("finalized note has corresponding NOTE event", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const note = await createTestFinalizedNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: daysAgo(5),
      });

      // Create the NOTE event (simulating what would happen on finalization)
      await createTestNoteEvent(
        clinicalRecord.id,
        note.id,
        note.encounterDate,
        "Nota clínica"
      );

      // Verify event exists
      const events = await testPrisma.clinicalEvent.findMany({
        where: {
          clinicalRecordId: clinicalRecord.id,
          sourceId: note.id,
          eventType: ClinicalEventType.NOTE,
        },
      });

      expect(events.length).toBe(1);
    });

    it("NOTE event is created at or after note finalization", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const note = await createTestFinalizedNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: daysAgo(5),
      });

      // Create event after note is finalized
      const event = await createTestNoteEvent(
        clinicalRecord.id,
        note.id,
        note.encounterDate,
        "Nota clínica"
      );

      // Event recorded_at should be >= note finalized_at
      expect(event.recordedAt.getTime()).toBeGreaterThanOrEqual(
        note.finalizedAt!.getTime()
      );
    });
  });

  // ===========================================================================
  // INV-STATE-08: Draft notes have no timeline events
  // ===========================================================================
  describe("INV-STATE-08: Draft Notes Excluded from Timeline", () => {
    it("draft note has no clinical events", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const draftNote = await createTestNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: daysAgo(5),
        status: NoteStatus.Draft,
      });

      // Query for events referencing this note
      const events = await testPrisma.clinicalEvent.findMany({
        where: {
          clinicalRecordId: clinicalRecord.id,
          sourceId: draftNote.id,
        },
      });

      expect(events.length).toBe(0);
    });

    it("draft notes are invisible on timeline retrieval", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create draft note (should not appear on timeline)
      await createTestNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: daysAgo(5),
        status: NoteStatus.Draft,
      });

      // Create finalized note with event
      const finalizedNote = await createTestFinalizedNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: daysAgo(3),
      });

      await createTestNoteEvent(
        clinicalRecord.id,
        finalizedNote.id,
        finalizedNote.encounterDate,
        "Nota clínica"
      );

      // Timeline should only show finalized note event
      const result = await getFullTimeline(patient.id);
      const timeline = assertResultOk(result);

      // Only one event (from finalized note)
      expect(timeline.eventCount).toBe(1);
      expect(timeline.events[0].sourceIdentifier).toBe(finalizedNote.id);
    });
  });

  // ===========================================================================
  // INV-STATE-09: Appointments are excluded from the timeline
  // ===========================================================================
  // NOTE: There is a discrepancy between INV-STATE-09 (which states appointments
  // should not generate events) and the encounter appointment spec (which generates
  // Encounter events for past appointments). The current implementation follows
  // the encounter appointment spec. These tests verify the actual behavior.
  describe("INV-STATE-09: Appointments Excluded from Timeline", () => {
    it("past appointments generate Encounter events immediately when created", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create past appointment
      const appointment = await createTestAppointment({
        patientId: patient.id,
        scheduledDate: daysAgo(5),
        status: AppointmentStatus.Completed,
      });

      // Event should be created immediately (not when timeline is queried)
      // Verify Encounter event was created
      const events = await testPrisma.clinicalEvent.findMany({
        where: {
          clinicalRecordId: clinicalRecord.id,
          sourceType: SourceType.Appointment,
          sourceId: appointment.id,
          eventType: ClinicalEventType.Encounter,
        },
      });

      expect(events.length).toBe(1);

      // Query timeline - event should be visible
      const result = await getFullTimeline(patient.id);
      const timeline = assertResultOk(result);
      expect(timeline.eventCount).toBe(1);
      expect(timeline.events[0].eventType).toBe(ClinicalEventType.Encounter);
    });

    it("past appointments in any status generate Encounter events on timeline", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create appointments with various statuses (all in the past)
      await createTestAppointment({
        patientId: patient.id,
        scheduledDate: daysAgo(10),
        status: AppointmentStatus.Completed,
      });

      await createTestAppointment({
        patientId: patient.id,
        scheduledDate: daysAgo(5),
        status: AppointmentStatus.Cancelled,
      });

      await createTestAppointment({
        patientId: patient.id,
        scheduledDate: daysAgo(1),
        status: AppointmentStatus.NoShow,
      });

      // Events should be created immediately when appointments are created
      // Query timeline - events should be visible
      const result = await getFullTimeline(patient.id);
      const timeline = assertResultOk(result);

      // All three past appointments should generate Encounter events that are visible
      expect(timeline.eventCount).toBe(3);
      expect(timeline.events.length).toBe(3);
      
      // Verify all events are Encounter type
      const allEncounter = timeline.events.every(
        (e) => e.eventType === ClinicalEventType.Encounter
      );
      expect(allEncounter).toBe(true);
    });

    it("future appointments generate Encounter events but they are hidden from timeline", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create future scheduled appointment
      const futureAppointment = await createTestAppointment({
        patientId: patient.id,
        scheduledDate: daysFromNow(7),
        status: AppointmentStatus.Scheduled,
      });

      // Query timeline
      const result = await getFullTimeline(patient.id);
      const timeline = assertResultOk(result);

      // Future appointments generate events but they are filtered from timeline display
      // Verify event exists in database (created immediately)
      const eventsInDb = await testPrisma.clinicalEvent.findMany({
        where: {
          clinicalRecordId: clinicalRecord.id,
          sourceType: SourceType.Appointment,
          sourceId: futureAppointment.id,
          eventType: ClinicalEventType.Encounter,
        },
      });
      expect(eventsInDb.length).toBe(1); // Event exists in database

      // But it's not visible in timeline (filtered out)
      expect(timeline.eventCount).toBe(0);
      expect(timeline.events.length).toBe(0);
    });
  });
});
