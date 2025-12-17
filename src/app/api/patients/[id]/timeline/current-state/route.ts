import { NextRequest, NextResponse } from 'next/server';
import { getCurrentState } from '@/domain/timeline';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/patients/:id/timeline/current-state
 * Retrieve the patient's current derived state (active medications, etc.).
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: patientId } = await params;

    const result = await getCurrentState(patientId);

    if (!result.success) {
      const status = result.error.code === 'PATIENT_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching current state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
