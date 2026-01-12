import { NextRequest, NextResponse } from 'next/server';
import {
  PatientService,
  PatientNotFoundError,
  PatientValidationError,
} from '../../../../domain/patient/service';
import type { UpdatePatientInput } from '../../../../types/patient';

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

/**
 * PATCH /api/patients/:id
 * Update a patient's information.
 * 
 * Request body (all fields optional):
 * - fullName?: string
 * - dateOfBirth?: ISO date string
 * - contactPhone?: string | null
 * - contactEmail?: string | null
 * - address?: string | null
 * - emergencyContactName?: string | null
 * - emergencyContactPhone?: string | null
 * - emergencyContactRelationship?: string | null
 * - status?: 'Active' | 'Inactive'
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Parse the date of birth from ISO string if provided
    const input: UpdatePatientInput = {};
    
    if (body.fullName !== undefined) {
      input.fullName = body.fullName;
    }
    if (body.dateOfBirth !== undefined) {
      input.dateOfBirth = new Date(body.dateOfBirth);
    }
    if (body.appointmentFrequency !== undefined) {
      input.appointmentFrequency = body.appointmentFrequency;
    }
    if (body.contactPhone !== undefined) {
      input.contactPhone = body.contactPhone;
    }
    if (body.contactEmail !== undefined) {
      input.contactEmail = body.contactEmail;
    }
    if (body.address !== undefined) {
      input.address = body.address;
    }
    if (body.emergencyContactName !== undefined) {
      input.emergencyContactName = body.emergencyContactName;
    }
    if (body.emergencyContactPhone !== undefined) {
      input.emergencyContactPhone = body.emergencyContactPhone;
    }
    if (body.emergencyContactRelationship !== undefined) {
      input.emergencyContactRelationship = body.emergencyContactRelationship;
    }
    if (body.status !== undefined) {
      input.status = body.status;
    }

    const patient = await PatientService.updatePatient(id, input);

    return NextResponse.json(patient);
  } catch (error) {
    if (error instanceof PatientNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error instanceof PatientValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
