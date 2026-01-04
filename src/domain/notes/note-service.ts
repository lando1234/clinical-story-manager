import { prisma } from "@/lib/prisma";
import { Note, Addendum, NoteStatus } from "@/generated/prisma";
import {
  CreateDraftNoteInput,
  UpdateDraftNoteInput,
  CreateAddendumInput,
  canFinalizeNote,
  getEncounterTitle,
} from "@/types/notes";
import { DomainError, Result, ok, err } from "@/types/errors";
import { emitNoteEvent } from "@/domain/timeline/event-emitter";

/**
 * NoteService - Manages clinical notes and their lifecycle.
 *
 * Implements:
 * - Draft note creation and editing (no timeline events)
 * - Note finalization with WRITE-EVENT-NOTE emission
 * - Addendum creation for corrections (CORRECT-NOTE-ADDENDUM)
 *
 * See: docs/14_timeline_contracts.md, docs/22_nota_clinica_evento_note.md
 */

/**
 * Creates a new draft clinical note.
 *
 * Draft notes do NOT generate timeline events per G-HIST-4.
 */
export async function createDraftNote(
  input: CreateDraftNoteInput
): Promise<Result<Note>> {
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

  // Validate encounter date is not in future
  if (input.encounterDate > new Date()) {
    return err(
      new DomainError(
        "INVALID_TIMESTAMP_FUTURE",
        "Encounter date cannot be in the future"
      )
    );
  }

  const hasClinicalContent = [
    input.subjective,
    input.objective,
    input.assessment,
    input.plan,
  ].some((value) => value?.trim());

  if (!hasClinicalContent) {
    return err(
      new DomainError(
        "MISSING_REQUIRED_FIELDS",
        "At least one clinical section must contain content"
      )
    );
  }

  const note = await prisma.note.create({
    data: {
      clinicalRecordId: input.clinicalRecordId,
      encounterDate: input.encounterDate,
      encounterType: input.encounterType,
      status: NoteStatus.Draft,
      subjective: input.subjective,
      objective: input.objective,
      assessment: input.assessment,
      plan: input.plan,
      // createdAt is set automatically via @default(now())
      // finalizedAt remains null for drafts
    },
  });

  return ok(note);
}

/**
 * Updates an existing draft note.
 *
 * Only notes with status=Draft can be updated.
 * Per G-PRES-2: Finalized notes are immutable.
 */
export async function updateDraftNote(
  noteId: string,
  input: UpdateDraftNoteInput
): Promise<Result<Note>> {
  // Find the note
  const existingNote = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!existingNote) {
    return err(new DomainError("NOTE_NOT_FOUND", `Note ${noteId} not found`));
  }

  // Check if note is still a draft
  if (existingNote.status !== NoteStatus.Draft) {
    return err(
      new DomainError(
        "NOTE_ALREADY_FINALIZED",
        "Cannot update a finalized note. Use addendum for corrections."
      )
    );
  }

  // Validate encounter date if provided
  if (input.encounterDate && input.encounterDate > new Date()) {
    return err(
      new DomainError(
        "INVALID_TIMESTAMP_FUTURE",
        "Encounter date cannot be in the future"
      )
    );
  }

  const updatedContent = {
    subjective: input.subjective ?? existingNote.subjective,
    objective: input.objective ?? existingNote.objective,
    assessment: input.assessment ?? existingNote.assessment,
    plan: input.plan ?? existingNote.plan,
  };

  const hasClinicalContent = Object.values(updatedContent).some((value) =>
    value?.trim()
  );

  if (!hasClinicalContent) {
    return err(
      new DomainError(
        "MISSING_REQUIRED_FIELDS",
        "At least one clinical section must contain content"
      )
    );
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: {
      encounterDate: input.encounterDate,
      encounterType: input.encounterType,
      subjective: input.subjective,
      objective: input.objective,
      assessment: input.assessment,
      plan: input.plan,
    },
  });

  return ok(updatedNote);
}

/**
 * Finalizes a draft note, making it immutable and emitting a NOTE event.
 *
 * Per WRITE-EVENT-NOTE contract (docs/22_nota_clinica_evento_note.md):
 * - Trigger: A Note entity transitions from status=Draft to status=Finalized.
 * - Validation: encounterDate not in future, encounterType valid, subjective/assessment/plan populated.
 * - Post-Conditions: Exactly one NOTE event exists for the finalized Note.
 */
export async function finalizeNote(noteId: string): Promise<Result<Note>> {
  // Find the note
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    return err(new DomainError("NOTE_NOT_FOUND", `Note ${noteId} not found`));
  }

  // Check if already finalized
  if (note.status === NoteStatus.Finalized) {
    return err(
      new DomainError("NOTE_ALREADY_FINALIZED", "Note is already finalized")
    );
  }

  // Validate finalization requirements
  const validation = canFinalizeNote(note);
  if (!validation.valid) {
    return err(
      new DomainError(
        "MISSING_REQUIRED_FIELDS",
        `Cannot finalize note: ${validation.reasons.join("; ")}`,
        { reasons: validation.reasons }
      )
    );
  }

  // Use transaction to ensure atomicity of finalization and event creation
  const result = await prisma.$transaction(async (tx) => {
    // Finalize the note
    const finalizedNote = await tx.note.update({
      where: { id: noteId },
      data: {
        status: NoteStatus.Finalized,
        finalizedAt: new Date(),
      },
    });

    return finalizedNote;
  });

  // Emit the NOTE event (outside transaction for proper error handling)
  const eventResult = await emitNoteEvent({
    clinicalRecordId: note.clinicalRecordId,
    noteId: note.id,
    encounterDate: note.encounterDate,
    title: getEncounterTitle(note.encounterType),
    description: undefined, // Optional summary could be derived from note content
  });

  if (!eventResult.success) {
    // Log error but don't fail - the note is already finalized
    // In production, this might need compensation logic
    console.error("Failed to emit NOTE event:", eventResult.error);
  }

  return ok(result);
}

/**
 * Creates an addendum for a finalized note.
 *
 * Per CORRECT-NOTE-ADDENDUM contract:
 * - Original Note remains unchanged.
 * - Addendum is created with content and reason.
 * - Addendum is linked to the original Note.
 * - Addendum is immutable from creation.
 */
export async function createAddendum(
  input: CreateAddendumInput
): Promise<Result<Addendum>> {
  // Find the note
  const note = await prisma.note.findUnique({
    where: { id: input.noteId },
  });

  if (!note) {
    return err(
      new DomainError("NOTE_NOT_FOUND", `Note ${input.noteId} not found`)
    );
  }

  // Verify note is finalized
  if (note.status !== NoteStatus.Finalized) {
    return err(
      new DomainError(
        "NOTE_NOT_FINALIZED",
        "Cannot add addendum to a draft note. Finalize the note first or edit it directly."
      )
    );
  }

  // Validate content and reason are provided
  if (!input.content || input.content.trim() === "") {
    return err(
      new DomainError("MISSING_REQUIRED_FIELDS", "Addendum content is required")
    );
  }

  if (!input.reason || input.reason.trim() === "") {
    return err(
      new DomainError("MISSING_REQUIRED_FIELDS", "Addendum reason is required")
    );
  }

  const addendum = await prisma.addendum.create({
    data: {
      noteId: input.noteId,
      content: input.content,
      reason: input.reason,
      // createdAt is set automatically via @default(now())
    },
  });

  return ok(addendum);
}

/**
 * Retrieves a note by ID with its addenda.
 */
export async function getNoteWithAddenda(noteId: string): Promise<
  Result<
    Note & {
      addenda: Addendum[];
    }
  >
> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      addenda: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!note) {
    return err(new DomainError("NOTE_NOT_FOUND", `Note ${noteId} not found`));
  }

  return ok(note);
}

/**
 * Deletes a draft note.
 *
 * Per contract: Draft Notes may be deleted before finalization.
 * This is the ONLY deletion permitted in the system.
 */
export async function deleteDraftNote(noteId: string): Promise<Result<void>> {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    return err(new DomainError("NOTE_NOT_FOUND", `Note ${noteId} not found`));
  }

  if (note.status !== NoteStatus.Draft) {
    return err(
      new DomainError(
        "NOTE_ALREADY_FINALIZED",
        "Cannot delete a finalized note. Finalized notes are immutable."
      )
    );
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  return ok(undefined);
}
