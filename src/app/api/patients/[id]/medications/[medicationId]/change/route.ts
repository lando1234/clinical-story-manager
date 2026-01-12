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
 * - effectiveDate: ISO date string (required)
 * - newPrescriptionRenewalPeriod?: number (optional, days until renewal)
 * - changeReason?: string (optional)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { medicationId } = await params;
    const body = await request.json();

    let newPrescriptionRenewalPeriod: number | null | undefined;
    if (body.newPrescriptionRenewalPeriod === null) {
      newPrescriptionRenewalPeriod = null;
    } else if (body.newPrescriptionRenewalPeriod !== undefined) {
      newPrescriptionRenewalPeriod = Number(body.newPrescriptionRenewalPeriod);
    }
    if (newPrescriptionRenewalPeriod !== undefined && newPrescriptionRenewalPeriod !== null && (Number.isNaN(newPrescriptionRenewalPeriod) || !Number.isFinite(newPrescriptionRenewalPeriod))) {
      return NextResponse.json(
        { error: 'Invalid newPrescriptionRenewalPeriod' },
        { status: 400 }
      );
    }

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
      newPrescriptionRenewalPeriod,
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
