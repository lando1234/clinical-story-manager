import { NextRequest, NextResponse } from 'next/server';
import { createDraftNote } from '@/domain/notes/note-service';
import { getClinicalRecordForPatient } from '@/lib/api-helpers';
import type { EncounterType } from '@/generated/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/patients/:id/notes
 * Create a new draft clinical note.
 *
 * Request body:
 * - encounterDate: ISO date string
 * - encounterType: EncounterType enum value
 * - content?: string (serialized structured note)
 * - subjective?: string
 * - objective?: string
 * - assessment?: string
 * - plan?: string
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: patientId } = await params;
    const body = await request.json();

    // Resolve clinical record ID
    const clinicalRecordId = await getClinicalRecordForPatient(patientId);
    if (!clinicalRecordId) {
      return NextResponse.json(
        { error: `Patient ${patientId} not found or has no clinical record` },
        { status: 404 }
      );
    }

    // Parse encounter date
    const encounterDate = body.encounterDate ? new Date(body.encounterDate) : undefined;
    if (!encounterDate || isNaN(encounterDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid or missing encounterDate' },
        { status: 400 }
      );
    }

    const result = await createDraftNote({
      clinicalRecordId,
      encounterDate,
      encounterType: body.encounterType as EncounterType,
      content: typeof body.content === "string" ? body.content : undefined,
      subjective: body.subjective,
      objective: body.objective,
      assessment: body.assessment,
      plan: body.plan,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
