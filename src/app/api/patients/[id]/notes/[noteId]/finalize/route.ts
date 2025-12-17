import { NextRequest, NextResponse } from 'next/server';
import { finalizeNote } from '@/domain/notes/note-service';

interface RouteParams {
  params: Promise<{ id: string; noteId: string }>;
}

/**
 * POST /api/patients/:id/notes/:noteId/finalize
 * Finalize a draft note, making it immutable.
 * This emits an Encounter event on the timeline.
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { noteId } = await params;

    const result = await finalizeNote(noteId);

    if (!result.success) {
      const status = result.error.code === 'NOTE_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error finalizing note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
