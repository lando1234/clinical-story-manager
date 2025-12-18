import { NextRequest, NextResponse } from 'next/server';
import { changeMedication } from '@/domain/medications/medication-service';

interface RouteParams {
  params: Promise<{ id: string; medicationId: string }>;
}

/**
 * POST /api/patients/:id/medications/:medicationId/change
 * Change an existing medication (dosage/frequency adjustment).
 * This emits a MedicationChange event on the timeline.
 *
 * Request body:
 * - newDosage: number (required, positive)
 * - newDosageUnit?: string
 * - newFrequency?: string
 * - newRoute?: string
 * - effectiveDate: ISO date string (required)
 * - changeReason?: string (optional)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { medicationId } = await params;
    const body = await request.json();

    // Parse effective date
    const effectiveDate = body.effectiveDate ? new Date(body.effectiveDate) : undefined;
    if (!effectiveDate || isNaN(effectiveDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid or missing effectiveDate' },
        { status: 400 }
      );
    }

    const result = await changeMedication({
      medicationId,
      newDosage: body.newDosage,
      newDosageUnit: body.newDosageUnit,
      newFrequency: body.newFrequency,
      newRoute: body.newRoute,
      effectiveDate,
      changeReason: body.changeReason,
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
    console.error('Error changing medication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
