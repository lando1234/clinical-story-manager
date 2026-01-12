import { NextRequest, NextResponse } from 'next/server';
import { updateDraftNote, deleteDraftNote } from '@/domain/notes/note-service';
import type { EncounterType } from '@/generated/prisma';

interface RouteParams {
  params: Promise<{ id: string; noteId: string }>;
}

/**
 * PATCH /api/patients/:id/notes/:noteId
 * Update an existing draft note.
 *
 * Request body (all fields optional):
 * - encounterDate?: ISO date string
 * - encounterType?: EncounterType enum value
 * - content?: string (serialized structured note)
 * - subjective?: string
 * - objective?: string
 * - assessment?: string
 * - plan?: string
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { noteId } = await params;
    const body = await request.json();

    // Parse encounter date if provided
    let encounterDate: Date | undefined;
    if (body.encounterDate) {
      encounterDate = new Date(body.encounterDate);
      if (isNaN(encounterDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid encounterDate format' },
          { status: 400 }
        );
      }
    }

    const result = await updateDraftNote(noteId, {
      encounterDate,
      encounterType: body.encounterType as EncounterType | undefined,
      content: typeof body.content === "string" ? body.content : undefined,
      subjective: body.subjective,
      objective: body.objective,
      assessment: body.assessment,
      plan: body.plan,
    });

    if (!result.success) {
      const status = result.error.code === 'NOTE_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/patients/:id/notes/:noteId
 * Delete a draft note. Only draft notes can be deleted.
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { noteId } = await params;

    const result = await deleteDraftNote(noteId);

    if (!result.success) {
      const status = result.error.code === 'NOTE_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
