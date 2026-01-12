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
 * - prescriptionIssueDate: ISO date string (required)
 * - prescriptionRenewalPeriod?: number (optional, days until renewal)
 * - comments?: string (optional)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: patientId } = await params;
    const body = await request.json();

    let renewalPeriod: number | null | undefined;
    if (body.prescriptionRenewalPeriod === null) {
      renewalPeriod = null;
    } else if (body.prescriptionRenewalPeriod !== undefined) {
      renewalPeriod = Number(body.prescriptionRenewalPeriod);
    }
    if (renewalPeriod !== undefined && renewalPeriod !== null && (Number.isNaN(renewalPeriod) || !Number.isFinite(renewalPeriod))) {
      return NextResponse.json(
        { error: 'Invalid prescriptionRenewalPeriod' },
        { status: 400 }
      );
    }

    // Resolve clinical record ID
    const clinicalRecordId = await getClinicalRecordForPatient(patientId);
    if (!clinicalRecordId) {
      return NextResponse.json(
        { error: `Patient ${patientId} not found or has no clinical record` },
        { status: 404 }
      );
    }

    // Parse prescription issue date
    const prescriptionIssueDate = body.prescriptionIssueDate ? new Date(body.prescriptionIssueDate) : undefined;
    if (!prescriptionIssueDate || isNaN(prescriptionIssueDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid or missing prescriptionIssueDate' },
        { status: 400 }
      );
    }

    const result = await startMedication({
      clinicalRecordId,
      drugName: body.drugName,
      dosage: body.dosage,
      dosageUnit: body.dosageUnit,
      frequency: body.frequency,
      prescriptionIssueDate,
      prescriptionRenewalPeriod: renewalPeriod,
      comments: body.comments,
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
