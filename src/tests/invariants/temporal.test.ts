/**
 * Temporal Invariant Tests
 *
 * Tests for INV-TEMP-01 through INV-TEMP-10.
 * Validates event permanence, ordering determinism, backdating integrity,
 * and timestamp consistency.
 *
 * See: docs/15_timeline_qa_invariants.md Section 2
 */

import { describe, it, expect, beforeEach } from "vitest";
import { testPrisma, cleanupTestData } from "../setup";
import {
  createCompletePatientSetup,
  createTestEvent,
  createTestMedication,
  createTestMedicationStartEvent,
} from "../utils/test-fixtures";
import {
  daysAgo,
  weeksAgo,
  yearsAgo,
  tomorrow,
  assertResultOk,
  assertResultErr,
  assertSortedAscending,
  waitForTimestampDifference,
} from "../utils/test-helpers";
import {
  getFullTimeline,
  getSingleEvent,
  createTimelineEvent,
} from "@/domain/timeline";
import { ClinicalEventType, SourceType } from "@/generated/prisma";

describe("Temporal Invariants", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  // ===========================================================================
  // INV-TEMP-01: Events are never lost
  // ===========================================================================
  describe("INV-TEMP-01: Event Permanence", () => {
    it("events are retrievable by identifier after creation", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Create an event
      const event = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "Test Event",
        eventType: ClinicalEventType.Other,
      });

      // Retrieve by ID using getSingleEvent
      const result = await getSingleEvent(event.id);
      const retrieved = assertResultOk(result);

      expect(retrieved.eventIdentifier).toBe(event.id);
      expect(retrieved.title).toBe("Test Event");
    });

    it("events appear in full timeline retrieval", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create multiple events
      const event1 = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(3),
        title: "Event 1",
      });
      const event2 = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(2),
        title: "Event 2",
      });
      const event3 = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "Event 3",
      });

      // Retrieve full timeline
      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      // All events must be present
      const eventIds = timeline.events.map((e) => e.eventIdentifier);
      expect(eventIds).toContain(event1.id);
      expect(eventIds).toContain(event2.id);
      expect(eventIds).toContain(event3.id);
      expect(timeline.eventCount).toBe(3);
    });

    it("events remain retrievable after adding more events", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create initial event
      const originalEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Original Event",
      });

      // Add more events
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(3),
        title: "New Event 1",
      });
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "New Event 2",
      });

      // Original event must still be retrievable
      const singleResult = await getSingleEvent(originalEvent.id);
      const retrieved = assertResultOk(singleResult);
      expect(retrieved.eventIdentifier).toBe(originalEvent.id);

      // And in timeline
      const timelineResult = await getFullTimeline(patient.id);
      const timeline = assertResultOk(timelineResult);
      const eventIds = timeline.events.map((e) => e.eventIdentifier);
      expect(eventIds).toContain(originalEvent.id);
    });
  });

  // ===========================================================================
  // INV-TEMP-02: Event count is monotonically non-decreasing
  // ===========================================================================
  describe("INV-TEMP-02: Monotonic Event Count", () => {
    it("event count increases after adding events", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Initial count
      const result1 = await getFullTimeline(patient.id);
      const timeline1 = assertResultOk(result1);
      const initialCount = timeline1.eventCount;

      // Add an event
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "New Event",
      });

      // Count should increase
      const result2 = await getFullTimeline(patient.id);
      const timeline2 = assertResultOk(result2);
      expect(timeline2.eventCount).toBe(initialCount + 1);
    });

    it("event count never decreases", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();
      const counts: number[] = [];

      // Add multiple events and track count
      for (let i = 0; i < 5; i++) {
        await createTestEvent({
          clinicalRecordId: clinicalRecord.id,
          eventDate: daysAgo(i),
          title: `Event ${i}`,
        });
        const result = await getFullTimeline(patient.id);
        const timeline = assertResultOk(result);
        counts.push(timeline.eventCount);
      }

      // Each count should be >= previous
      for (let i = 1; i < counts.length; i++) {
        expect(counts[i]).toBeGreaterThanOrEqual(counts[i - 1]);
      }
    });
  });

  // ===========================================================================
  // INV-TEMP-03: Ordering is deterministic
  // ===========================================================================
  describe("INV-TEMP-03: Deterministic Ordering", () => {
    it("multiple retrievals return identical event ordering", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create events with various dates
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Event A",
      });
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(3),
        title: "Event B",
      });
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "Event C",
      });

      // Multiple retrievals
      const orders: string[][] = [];
      for (let i = 0; i < 5; i++) {
        const result = await getFullTimeline(patient.id, "ascending");
        const timeline = assertResultOk(result);
        orders.push(timeline.events.map((e) => e.eventIdentifier));
      }

      // All retrievals must produce identical ordering
      for (let i = 1; i < orders.length; i++) {
        expect(orders[i]).toEqual(orders[0]);
      }
    });
  });

  // ===========================================================================
  // INV-TEMP-04: Ordering follows the four-tier algorithm
  // ===========================================================================
  describe("INV-TEMP-04: Four-Tier Ordering Algorithm", () => {
    it("orders by event_timestamp first (tier 1)", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Events with different dates
      const eventOld = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(10),
        title: "Old Event",
      });
      const eventNew = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "New Event",
      });

      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      expect(timeline.events[0].eventIdentifier).toBe(eventOld.id);
      expect(timeline.events[1].eventIdentifier).toBe(eventNew.id);
    });

    it("uses recorded_timestamp as tiebreaker (tier 2)", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();
      const sameDate = daysAgo(5);

      // Create events with same event_date but different recorded_at
      const eventFirst = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: sameDate,
        title: "First Recorded",
        recordedAt: new Date("2024-01-01T10:00:00Z"),
      });

      const eventSecond = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: sameDate,
        title: "Second Recorded",
        recordedAt: new Date("2024-01-01T11:00:00Z"),
      });

      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      // First recorded should come first
      const ids = timeline.events.map((e) => e.eventIdentifier);
      expect(ids.indexOf(eventFirst.id)).toBeLessThan(ids.indexOf(eventSecond.id));
    });

    it("uses event_type priority as tiebreaker (tier 3)", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();
      const sameDate = daysAgo(5);
      const sameRecordedAt = new Date("2024-01-01T10:00:00Z");

      // NOTE has priority 1, MedicationStart has priority 2
      const medicationEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: sameDate,
        eventType: ClinicalEventType.MedicationStart,
        title: "Medication Event",
        recordedAt: sameRecordedAt,
      });

      const noteEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: sameDate,
        eventType: ClinicalEventType.NOTE,
        title: "Nota clínica",
        recordedAt: sameRecordedAt,
      });

      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      const ids = timeline.events.map((e) => e.eventIdentifier);
      // NOTE (priority 1) should come before MedicationStart (priority 2)
      expect(ids.indexOf(noteEvent.id)).toBeLessThan(ids.indexOf(medicationEvent.id));
    });

    it("uses event_identifier as final tiebreaker (tier 4)", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();
      const sameDate = daysAgo(5);
      const sameRecordedAt = new Date("2024-01-01T10:00:00Z");

      // Same everything except ID - create with specific IDs to test
      const eventA = await createTestEvent({
        id: "00000000-0000-0000-0000-000000000aaa",
        clinicalRecordId: clinicalRecord.id,
        eventDate: sameDate,
        eventType: ClinicalEventType.Other,
        title: "Event A",
        recordedAt: sameRecordedAt,
      });

      const eventB = await createTestEvent({
        id: "00000000-0000-0000-0000-000000000bbb",
        clinicalRecordId: clinicalRecord.id,
        eventDate: sameDate,
        eventType: ClinicalEventType.Other,
        title: "Event B",
        recordedAt: sameRecordedAt,
      });

      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      const ids = timeline.events.map((e) => e.eventIdentifier);
      // "aaa" should come before "bbb" alphabetically
      expect(ids.indexOf(eventA.id)).toBeLessThan(ids.indexOf(eventB.id));
    });
  });

  // ===========================================================================
  // INV-TEMP-05: Adding events does not reorder existing events
  // ===========================================================================
  describe("INV-TEMP-05: Stable Insertion", () => {
    it("adding new events preserves relative order of existing events", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create initial events
      const event1 = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(10),
        title: "Event 1",
      });
      const event2 = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Event 2",
      });
      const event3 = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "Event 3",
      });

      // Get initial order
      const result1 = await getFullTimeline(patient.id, "ascending");
      const timeline1 = assertResultOk(result1);
      const initialOrder = timeline1.events.map((e) => e.eventIdentifier);

      // Add a new event in the middle
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(7),
        title: "New Middle Event",
      });

      // Get new order
      const result2 = await getFullTimeline(patient.id, "ascending");
      const timeline2 = assertResultOk(result2);

      // Original events should maintain their relative order
      const newIds = timeline2.events.map((e) => e.eventIdentifier);
      const event1Pos = newIds.indexOf(event1.id);
      const event2Pos = newIds.indexOf(event2.id);
      const event3Pos = newIds.indexOf(event3.id);

      expect(event1Pos).toBeLessThan(event2Pos);
      expect(event2Pos).toBeLessThan(event3Pos);
    });
  });

  // ===========================================================================
  // INV-TEMP-06: Backdated events integrate correctly
  // ===========================================================================
  describe("INV-TEMP-06: Backdating Integrity", () => {
    it("backdated event by one week appears at correct chronological position", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create recent event
      const recentEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "Recent Event",
      });

      // Backdate an event by one week
      const backdatedEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: weeksAgo(1),
        title: "Backdated Event (1 week)",
      });

      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      const ids = timeline.events.map((e) => e.eventIdentifier);
      expect(ids.indexOf(backdatedEvent.id)).toBeLessThan(ids.indexOf(recentEvent.id));
    });

    it("backdated event by one year appears at correct chronological position", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create recent event
      const recentEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(1),
        title: "Recent Event",
      });

      // Backdate an event by one year
      const backdatedEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: yearsAgo(1),
        title: "Backdated Event (1 year)",
      });

      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      const ids = timeline.events.map((e) => e.eventIdentifier);
      expect(ids.indexOf(backdatedEvent.id)).toBeLessThan(ids.indexOf(recentEvent.id));

      // Verify recordedAt reflects today (recent)
      const backdatedInTimeline = timeline.events.find(
        (e) => e.eventIdentifier === backdatedEvent.id
      );
      const today = new Date();
      const recordedDate = backdatedInTimeline!.recordedTimestamp;
      expect(recordedDate.getFullYear()).toBe(today.getFullYear());
    });

    it("backdated event between existing events inserts correctly", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create events at days 10 and 2
      const oldEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(10),
        title: "Old Event",
      });
      const newEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(2),
        title: "New Event",
      });

      // Backdate to day 5 (between the two)
      const backdatedEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Backdated Middle Event",
      });

      const result = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(result);

      const ids = timeline.events.map((e) => e.eventIdentifier);
      const oldPos = ids.indexOf(oldEvent.id);
      const middlePos = ids.indexOf(backdatedEvent.id);
      const newPos = ids.indexOf(newEvent.id);

      expect(oldPos).toBeLessThan(middlePos);
      expect(middlePos).toBeLessThan(newPos);
    });
  });

  // ===========================================================================
  // INV-TEMP-07: Backdating does not enable history rewriting
  // ===========================================================================
  describe("INV-TEMP-07: No History Rewriting via Backdating", () => {
    it("backdated event does not modify existing events", async () => {
      const { patient, clinicalRecord } = await createCompletePatientSetup();

      // Create existing event
      const existingEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Existing Event",
        description: "Original description",
      });

      // Store original data
      const originalResult = await getSingleEvent(existingEvent.id);
      const originalData = assertResultOk(originalResult);

      // Add backdated event at same date
      await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Backdated Event",
      });

      // Existing event should be unchanged
      const afterResult = await getSingleEvent(existingEvent.id);
      const afterData = assertResultOk(afterResult);

      expect(afterData.title).toBe(originalData.title);
      expect(afterData.description).toBe(originalData.description);
      expect(afterData.eventTimestamp.getTime()).toBe(originalData.eventTimestamp.getTime());
    });

    it("backdated events show gap between event_timestamp and recorded_timestamp", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      // Create event dated one year ago
      const backdatedEvent = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: yearsAgo(1),
        title: "Year Old Event",
      });

      const result = await getSingleEvent(backdatedEvent.id);
      const event = assertResultOk(result);

      // recordedTimestamp should be much more recent than eventTimestamp
      const eventTime = event.eventTimestamp.getTime();
      const recordedTime = event.recordedTimestamp.getTime();

      // Gap should be approximately 1 year (365 days in milliseconds)
      const gapMs = recordedTime - eventTime;
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      expect(gapMs).toBeGreaterThan(oneYearMs * 0.9); // Allow 10% tolerance
    });
  });

  // ===========================================================================
  // INV-TEMP-08: Event timestamps are immutable
  // ===========================================================================
  describe("INV-TEMP-08: Timestamp Immutability", () => {
    it("event_timestamp remains unchanged on re-read", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const event = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Test Event",
      });

      // Read multiple times
      const reads: Date[] = [];
      for (let i = 0; i < 5; i++) {
        const result = await getSingleEvent(event.id);
        const data = assertResultOk(result);
        reads.push(data.eventTimestamp);
        await waitForTimestampDifference(5);
      }

      // All reads should have same timestamp
      for (const timestamp of reads) {
        expect(timestamp.getTime()).toBe(reads[0].getTime());
      }
    });

    it("recorded_timestamp remains unchanged on re-read", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const event = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Test Event",
      });

      // Read multiple times
      const reads: Date[] = [];
      for (let i = 0; i < 5; i++) {
        const result = await getSingleEvent(event.id);
        const data = assertResultOk(result);
        reads.push(data.recordedTimestamp);
        await waitForTimestampDifference(5);
      }

      // All reads should have same timestamp
      for (const timestamp of reads) {
        expect(timestamp.getTime()).toBe(reads[0].getTime());
      }
    });
  });

  // ===========================================================================
  // INV-TEMP-09: Future events are prohibited
  // ===========================================================================
  describe("INV-TEMP-09: Future Event Prohibition", () => {
    it("rejects event with future event_timestamp", async () => {
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
      expect(error.code).toBe("MISSING_REQUIRED_FIELDS");
      expect(error.message).toContain("future");
    });

    it("rejects event dated far in the future", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10);

      const result = await createTimelineEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: futureDate,
        eventType: ClinicalEventType.Other,
        title: "Far Future Event",
        sourceType: null,
        sourceId: null,
      });

      const error = assertResultErr(result);
      expect(error.code).toBe("MISSING_REQUIRED_FIELDS");
    });
  });

  // ===========================================================================
  // INV-TEMP-10: Recorded timestamp reflects documentation time
  // ===========================================================================
  describe("INV-TEMP-10: Recorded Timestamp Accuracy", () => {
    it("recorded_timestamp is close to creation time", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const beforeCreation = new Date();

      const event = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: daysAgo(5),
        title: "Test Event",
      });

      const afterCreation = new Date();

      const result = await getSingleEvent(event.id);
      const retrieved = assertResultOk(result);

      const recordedTime = retrieved.recordedTimestamp.getTime();

      // recorded_timestamp should be between before and after creation
      expect(recordedTime).toBeGreaterThanOrEqual(beforeCreation.getTime() - 1000);
      expect(recordedTime).toBeLessThanOrEqual(afterCreation.getTime() + 1000);
    });

    it("recorded_timestamp differs from event_timestamp for backdated events", async () => {
      const { clinicalRecord } = await createCompletePatientSetup();

      const eventDate = daysAgo(30);

      const event = await createTestEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate,
        title: "Backdated Event",
      });

      const result = await getSingleEvent(event.id);
      const retrieved = assertResultOk(result);

      // Recorded should be much more recent than event date
      expect(retrieved.recordedTimestamp.getTime()).toBeGreaterThan(
        retrieved.eventTimestamp.getTime()
      );

      // Difference should be approximately 30 days
      const diffMs =
        retrieved.recordedTimestamp.getTime() - retrieved.eventTimestamp.getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      expect(diffMs).toBeGreaterThan(thirtyDaysMs * 0.9);
    });
  });
});
