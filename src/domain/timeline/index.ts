/**
 * Timeline Engine Module
 *
 * The Timeline Engine is the authoritative source for longitudinal clinical data.
 * It provides deterministic ordering, immutability guarantees, and state reconstruction.
 *
 * This module exports:
 * - Event ingestion functions (write operations)
 * - Timeline reading functions (read operations)
 * - State resolution functions (current and historical state)
 * - Types for all operations
 *
 * See:
 * - docs/13_timeline_engine.md
 * - docs/14_timeline_contracts.md
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  // Direction
  TimelineDirection,
  // Event types
  TimelineEvent,
  TimelineEventSummary,
  // Read contracts output types
  FullTimelineResult,
  CurrentStateResult,
  HistoricalStateResult,
  FilteredTimelineResult,
  SingleEventResult,
  EventSourceResult,
  // Filter types
  TimelineFilters,
  AppliedFilters,
  // State types
  ActiveMedication,
  HistoricalActiveMedication,
  CurrentPsychiatricHistory,
  HistoricalPsychiatricHistory,
  MostRecentNote,
  PsychiatricHistoryContent,
  // Source data types
  NoteSourceData,
  MedicationSourceData,
  PsychiatricHistorySourceData,
  AddendumData,
} from "./timeline-types";

// =============================================================================
// EVENT INGESTION (Write Operations)
// =============================================================================

export {
  // Core event creation
  createTimelineEvent,
  // Specific event emitters per write contracts
  emitNoteEvent,
  emitMedicationStartEvent,
  emitMedicationChangeEvent,
  emitMedicationStopEvent,
  emitHistoryUpdateEvent,
  emitManualEvent,
} from "./event-emitter";

// =============================================================================
// TIMELINE READING (Read Operations)
// =============================================================================

export {
  // READ-TIMELINE-FULL
  getFullTimeline,
  // READ-TIMELINE-FILTERED
  getFilteredTimeline,
  // READ-EVENT-SINGLE
  getSingleEvent,
  // READ-EVENT-SOURCE
  getEventSource,
} from "./timeline-reader";

// =============================================================================
// STATE RESOLUTION
// =============================================================================

export {
  // READ-STATE-CURRENT
  getCurrentState,
  // READ-STATE-HISTORICAL
  getHistoricalState,
} from "./state-resolver";
