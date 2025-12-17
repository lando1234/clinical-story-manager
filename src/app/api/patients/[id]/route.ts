import { NextRequest, NextResponse } from 'next/server';
import {
  PatientService,
  PatientNotFoundError,
} from '../../../../domain/patient/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/patients/:id
 * Get a patient by their unique ID.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const patient = await PatientService.getPatientById(id);

    return NextResponse.json(patient);
  } catch (error) {
    if (error instanceof PatientNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
