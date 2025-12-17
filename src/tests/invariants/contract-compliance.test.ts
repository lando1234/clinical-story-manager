/**
 * Contract Compliance Invariant Tests
 *
 * Tests for INV-CONTRACT-04 through INV-CONTRACT-08.
 * Validates required field enforcement, invalid data rejection,
 * immediate queryability, and proper error codes for non-existent entities.
 *
 * See: docs/15_timeline_qa_invariants.md Section 5
 */

import { describe, it, expect, beforeEach } from "vitest";
import { testPrisma, cleanupTestData } from "../setup";
import {
  createCompletePatientSetup,
  createTestEvent,
  createTestMedication,
} from "../utils/test-fixtures";
import {
  daysAgo,
  tomorrow,
  assertResultOk,
  assertResultErr,
  assertResultErrCode,
} from "../utils/test-helpers";
import {
  createTimelineEvent,
  getFullTimeline,
  getSingleEvent,
  getCurrentState,
  getHistoricalState,
} from "@/domain/timeline";
import { ClinicalEventType, SourceType } from "@/generated/prisma";

describe("Contract Compliance Invariants", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  // ===========================================================================
  // INV-CONTRACT-04: Event creation enforces required fields
  // ===========================================================================
  describe("INV-CONTRACT-04: Required Field Enforcement", () => {
    it("missing event_timestamp results in error", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const result = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: undefined as unknown as Date,
        eventType: ClinicalEventType.Other,
        title: "Test Event",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.code).toBe("MISSING_REQUIRED_FIELDS");
      expect(error.message).toContain("required");
    });

    it("missing event_type results in error", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const result = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        eventType: undefined as unknown as ClinicalEventType,
        title: "Test Event",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.code).toBe("MISSING_REQUIRED_FIELDS");
    });

    it("missing title results in error", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const result = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        eventType: ClinicalEventType.Other,
        title: "",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.code).toBe("MISSING_REQUIRED_FIELDS");
      expect(error.message).toContain("Title");
    });

    it("missing clinical_record_identifier results in error", async () => {
      await createCompletePatientSetup();

      const result = await createTimelineEvent({
        clinicalRecordId: "",
        eventDate: daysAgo(1),
        eventType: ClinicalEventType.Other,
        title: "Test Event",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.code).toBe("MISSING_REQUIRED_FIELDS");
    });

    it("whitespace-only title is rejected", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const result = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        eventType: ClinicalEventType.Other,
        title: "   ",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.code).toBe("MISSING_REQUIRED_FIELDS");
    });
  });

  // ===========================================================================
  // INV-CONTRACT-05: Invalid data is rejected deterministically
  // ===========================================================================
  describe("INV-CONTRACT-05: Invalid Data Rejection", () => {
    it("future event_timestamp is rejected", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const result = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: tomorrow(),
        eventType: ClinicalEventType.Other,
        title: "Future Event",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      // The error contains "future" in the message
      expect(error.message.toLowerCase()).toContain("future");
    });

    it("far future event_timestamp is rejected", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const farFuture = new Date();
      farFuture.setFullYear(farFuture.getFullYear() + 5);

      const result = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: farFuture,
        eventType: ClinicalEventType.Other,
        title: "Far Future Event",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.message.toLowerCase()).toContain("future");
    });

    it("invalid clinical_record reference is rejected", async () => {
      await createCompletePatientSetup();

      const result = await createTimelineEvent({
        clinicalRecordId: "non-existent-id-12345",
        eventDate: daysAgo(1),
        eventType: ClinicalEventType.Other,
        title: "Test Event",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.code).toBe("CLINICAL_RECORD_NOT_FOUND");
    });

    it("rejection is deterministic across multiple attempts", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Same invalid request multiple times
      const results = [];
      for (let i = 0; i < 3; i++) {
        const result = await createTimelineEvent({
          clinicalRecordId: clinicalRecord.id,
          eventDate: tomorrow(),
          eventType: ClinicalEventType.Other,
          title: "Future Event",
          sourceType: null,
          sourceId: null,
        });
        results.push(result);
      }

      // All should fail with same error
      for (const result of results) {
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.message.toLowerCase()).toContain("future");
        }
      }
    });
  });

  // ===========================================================================
  // INV-CONTRACT-06: Successful writes are immediately queryable
  // ===========================================================================
  describe("INV-CONTRACT-06: Immediate Queryability", () => {
    it("created event appears in next timeline query", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create event
      const createResult = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        eventType: ClinicalEventType.Other,
        title: "Immediately Queryable Event",
        sourceType: null,
        sourceId: null,
      });

      const created = assertResultOk(createResult);

      // Immediately query timeline
      const timelineResult = await getFullTimeline(patient.id);
      const timeline = assertResultOk(timelineResult);

      const found = timeline.events.find(
        (e) => e.eventIdentifier === created.id
      );
      expect(found).toBeDefined();
      expect(found?.title).toBe("Immediately Queryable Event");
    });

    it("created event is retrievable by single event query immediately", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const createResult = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        eventType: ClinicalEventType.Other,
        title: "Single Query Event",
        sourceType: null,
        sourceId: null,
      });

      const created = assertResultOk(createResult);

      // Immediately query by ID
      const singleResult = await getSingleEvent(created.id);
      const retrieved = assertResultOk(singleResult);

      expect(retrieved.eventIdentifier).toBe(created.id);
      expect(retrieved.title).toBe("Single Query Event");
    });

    it("no eventual consistency delay - event visible immediately", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create multiple events rapidly
      const eventIds: string[] = [];
      for (let i = 0; i < 5; i++) {
        const result = await createTimelineEvent({
          clinicalRecordId: clinicalRecord.id,
          eventDate: daysAgo(i + 1),
          eventType: ClinicalEventType.Other,
          title: `Rapid Event ${i}`,
          sourceType: null,
          sourceId: null,
        });
        const event = assertResultOk(result);
        eventIds.push(event.id);
      }

      // All should be immediately visible
      const timelineResult = await getFullTimeline(patient.id);
      const timeline = assertResultOk(timelineResult);

      for (const eventId of eventIds) {
        const found = timeline.events.find((e) => e.eventIdentifier === eventId);
        expect(found).toBeDefined();
      }
    });

    it("medication is immediately visible in current state", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create medication
      const medication = await createTestMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Immediate Visibility Med",
        startDate: daysAgo(5),
      });

      // Immediately query current state
      const stateResult = await getCurrentState(patient.id);
      const state = assertResultOk(stateResult);

      const found = state.activeMedications.find(
        (m) => m.medicationIdentifier === medication.id
      );
      expect(found).toBeDefined();
      expect(found?.drugName).toBe("Immediate Visibility Med");
    });
  });

  // ===========================================================================
  // INV-CONTRACT-07: Non-existent patients produce PATIENT_NOT_FOUND
  // ===========================================================================
  describe("INV-CONTRACT-07: PATIENT_NOT_FOUND Error", () => {
    it("timeline read for non-existent patient returns error", async () => {
      const result = await getFullTimeline("non-existent-patient-id");

      assertResultErrCode(result, "PATIENT_NOT_FOUND");
    });

    it("current state read for non-existent patient returns error", async () => {
      const result = await getCurrentState("non-existent-patient-id");

      assertResultErrCode(result, "PATIENT_NOT_FOUND");
    });

    it("historical state read for non-existent patient returns error", async () => {
      const result = await getHistoricalState("non-existent-patient-id", daysAgo(30));

      assertResultErrCode(result, "PATIENT_NOT_FOUND");
    });

    it("does not return empty timeline for non-existent patient", async () => {
      const result = await getFullTimeline("non-existent-patient-id");

      // Should be error, not success with empty data
      expect(result.success).toBe(false);
    });

    it("error message includes patient identifier", async () => {
      const patientId = "test-patient-xyz-123";
      const result = await getFullTimeline(patientId);

      const error = assertResultErr(result);
      expect(error.message).toContain(patientId);
    });
  });

  // ===========================================================================
  // INV-CONTRACT-08: Non-existent events produce EVENT_NOT_FOUND
  // ===========================================================================
  describe("INV-CONTRACT-08: EVENT_NOT_FOUND Error", () => {
    it("single event read for non-existent event returns error", async () => {
      const result = await getSingleEvent("non-existent-event-id");

      assertResultErrCode(result, "EVENT_NOT_FOUND");
    });

    it("does not return null for non-existent event", async () => {
      const result = await getSingleEvent("non-existent-event-id");

      expect(result.success).toBe(false);
    });

    it("error message includes event identifier", async () => {
      const eventId = "test-event-abc-456";
      const result = await getSingleEvent(eventId);

      const error = assertResultErr(result);
      expect(error.message).toContain(eventId);
    });

    it("valid UUID format but non-existent still returns error", async () => {
      const validUuidFormat = "00000000-0000-0000-0000-000000000000";
      const result = await getSingleEvent(validUuidFormat);

      assertResultErrCode(result, "EVENT_NOT_FOUND");
    });

    it("deleted event returns EVENT_NOT_FOUND (if deletion were possible)", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Create and then "delete" an event (simulated - in reality events are permanent)
      const event = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "To Be Deleted",
      });

      const eventId = event.id;

      // In reality, events cannot be deleted, but we test the error path
      // by querying for an ID that will return EVENT_NOT_FOUND
      // For this test, we query for a non-existent ID
      const result = await getSingleEvent("definitely-not-exists-" + eventId);

      assertResultErrCode(result, "EVENT_NOT_FOUND");
    });
  });

  // ===========================================================================
  // Additional Contract Tests: Response Shape Validation
  // ===========================================================================
  describe("Response Shape Validation", () => {
    it("full timeline response includes required fields", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Test Event",
      });

      const result = await getFullTimeline(patient.id);
      const timeline = assertResultOk(result);

      // Required fields per contract
      expect(timeline.patientIdentifier).toBeDefined();
      expect(timeline.eventCount).toBeDefined();
      expect(timeline.events).toBeDefined();
      expect(Array.isArray(timeline.events)).toBe(true);
      expect(timeline.eventCount).toBe(timeline.events.length);
    });

    it("current state response includes required fields", async () => {
      const { patient } = await createCompletePatientSetup();

      const result = await getCurrentState(patient.id);
      const state = assertResultOk(result);

      // Required fields per contract
      expect(state.patientIdentifier).toBeDefined();
      expect(state.asOfDate).toBeDefined();
      expect(state.activeMedications).toBeDefined();
      expect(state.currentPsychiatricHistory).toBeDefined();
      // mostRecentNote may be null if no finalized notes
      expect("mostRecentNote" in state).toBe(true);
    });

    it("historical state response includes required fields", async () => {
      const { patient } = await createCompletePatientSetup();
      const targetDate = daysAgo(30);

      const result = await getHistoricalState(patient.id, targetDate);
      const state = assertResultOk(result);

      // Required fields per contract
      expect(state.patientIdentifier).toBeDefined();
      expect(state.asOfDate).toBeDefined();
      expect(state.eventsThroughDate).toBeDefined();
      expect(state.activeMedicationsOnDate).toBeDefined();
      // psychiatricHistoryOnDate may be null for dates before first version
      expect("psychiatricHistoryOnDate" in state).toBe(true);
    });

    it("single event response includes all event fields", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const event = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Complete Event",
        description: "Test description",
        eventType: ClinicalEventType.Other,
      });

      const result = await getSingleEvent(event.id);
      const retrieved = assertResultOk(result);

      // All required fields
      expect(retrieved.eventIdentifier).toBeDefined();
      expect(retrieved.patientIdentifier).toBeDefined();
      expect(retrieved.eventTimestamp).toBeDefined();
      expect(retrieved.recordedTimestamp).toBeDefined();
      expect(retrieved.eventType).toBeDefined();
      expect(retrieved.title).toBeDefined();
      // description, sourceType, sourceIdentifier may be null
      expect("description" in retrieved).toBe(true);
      expect("sourceType" in retrieved).toBe(true);
      expect("sourceIdentifier" in retrieved).toBe(true);
    });
  });

  // ===========================================================================
  // Empty State Tests (Boundary Conditions)
  // ===========================================================================
  describe("Empty State Handling (INV-UX-03)", () => {
    it("patient with zero events returns empty array, not error", async () => {
      const { patient } = await createCompletePatientSetup();

      const result = await getFullTimeline(patient.id);
      const timeline = assertResultOk(result);

      expect(timeline.events).toEqual([]);
      expect(timeline.eventCount).toBe(0);
    });

    it("empty timeline is valid state for new patients", async () => {
      const { patient } = await createCompletePatientSetup();

      const result = await getFullTimeline(patient.id);

      // Should be success, not error
      expect(result.success).toBe(true);
    });

    it("response is not null or undefined for empty timeline", async () => {
      const { patient } = await createCompletePatientSetup();

      const result = await getFullTimeline(patient.id);
      const timeline = assertResultOk(result);

      expect(timeline).not.toBeNull();
      expect(timeline).not.toBeUndefined();
      expect(timeline.events).not.toBeNull();
      expect(timeline.events).not.toBeUndefined();
    });
  });
});
