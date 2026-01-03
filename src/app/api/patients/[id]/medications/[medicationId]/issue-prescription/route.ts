import { NextRequest, NextResponse } from 'next/server';
import { issuePrescription } from '@/domain/medications/medication-service';
import { getClinicalRecordForPatient } from '@/lib/api-helpers';

interface RouteParams {
  params: Promise<{ id: string; medicationId: string }>;
}

/**
 * POST /api/patients/:id/medications/:medicationId/issue-prescription
 * Issue a new prescription for an active medication.
 * This emits a MedicationPrescriptionIssued event on the timeline.
 *
 * Request body:
 * - prescriptionIssueDate: ISO date string (required)
 * - comments?: string (optional)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { medicationId } = await params;
    const body = await request.json();

    // Parse prescription issue date
    const prescriptionIssueDate = body.prescriptionIssueDate ? new Date(body.prescriptionIssueDate) : undefined;
    if (!prescriptionIssueDate || isNaN(prescriptionIssueDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid or missing prescriptionIssueDate' },
        { status: 400 }
      );
    }

    const result = await issuePrescription({
      medicationId,
      prescriptionIssueDate,
      comments: body.comments,
    });

    if (!result.success) {
      const status = result.error.code === 'MEDICATION_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error issuing prescription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

