import { NextRequest, NextResponse } from 'next/server';
import { createAddendum } from '@/domain/notes/note-service';

interface RouteParams {
  params: Promise<{ id: string; noteId: string }>;
}

/**
 * POST /api/patients/:id/notes/:noteId/addenda
 * Create an addendum for a finalized note.
 *
 * Request body:
 * - content: string (required)
 * - reason: string (required)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { noteId } = await params;
    const body = await request.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Addendum content is required' },
        { status: 400 }
      );
    }

    if (!body.reason || typeof body.reason !== 'string') {
      return NextResponse.json(
        { error: 'Addendum reason is required' },
        { status: 400 }
      );
    }

    const result = await createAddendum({
      noteId,
      content: body.content,
      reason: body.reason,
    });

    if (!result.success) {
      const status = result.error.code === 'NOTE_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error creating addendum:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
