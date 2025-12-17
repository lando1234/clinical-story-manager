import { NextRequest, NextResponse } from 'next/server';
import { startMedication } from '@/domain/medications/medication-service';
import { getClinicalRecordForPatient } from '@/lib/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/patients/:id/medications
 * Start a new medication for a patient.
 * This emits a MedicationStart event on the timeline.
 *
 * Request body:
 * - drugName: string (required)
 * - dosage: number (required, positive)
 * - dosageUnit: string (required)
 * - frequency: string (required)
 * - route?: string
 * - startDate: ISO date string (required)
 * - prescribingReason: string (required)
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

    // Parse start date
    const startDate = body.startDate ? new Date(body.startDate) : undefined;
    if (!startDate || isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid or missing startDate' },
        { status: 400 }
      );
    }

    const result = await startMedication({
      clinicalRecordId,
      drugName: body.drugName,
      dosage: body.dosage,
      dosageUnit: body.dosageUnit,
      frequency: body.frequency,
      route: body.route,
      startDate,
      prescribingReason: body.prescribingReason,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error starting medication:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
