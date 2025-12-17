import { NextRequest, NextResponse } from 'next/server';
import { stopMedication } from '@/domain/medications/medication-service';

interface RouteParams {
  params: Promise<{ id: string; medicationId: string }>;
}

/**
 * POST /api/patients/:id/medications/:medicationId/stop
 * Stop a medication.
 * This emits a MedicationStop event on the timeline.
 *
 * Request body:
 * - endDate: ISO date string (required)
 * - discontinuationReason: string (required)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { medicationId } = await params;
    const body = await request.json();

    // Parse end date
    const endDate = body.endDate ? new Date(body.endDate) : undefined;
    if (!endDate || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid or missing endDate' },
        { status: 400 }
      );
    }

    if (!body.discontinuationReason || typeof body.discontinuationReason !== 'string') {
      return NextResponse.json(
        { error: 'discontinuationReason is required' },
        { status: 400 }
      );
    }

    const result = await stopMedication({
      medicationId,
      endDate,
      discontinuationReason: body.discontinuationReason,
    });

    if (!result.success) {
      const status = result.error.code === 'MEDICATION_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error stopping medication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
