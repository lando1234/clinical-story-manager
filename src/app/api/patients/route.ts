import { NextRequest, NextResponse } from 'next/server';
import {
  PatientService,
  PatientValidationError,
} from '../../../domain/patient/service';
import type { CreatePatientInput } from '../../../types/patient';

/**
 * POST /api/patients
 * Create a new patient.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Parse the date of birth from ISO string
    const input: CreatePatientInput = {
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined as unknown as Date,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      address: body.address,
      emergencyContactName: body.emergencyContactName,
      emergencyContactPhone: body.emergencyContactPhone,
      emergencyContactRelationship: body.emergencyContactRelationship,
    };

    const patient = await PatientService.createPatient(input);

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    if (error instanceof PatientValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/patients
 * Search patients by name or id, or list all patients.
 * 
 * Query parameters:
 * - name: Search by patient name (partial match)
 * - id: Search by patient ID (exact match)
 * - If no parameters provided, returns all patients
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const id = searchParams.get('id');

    // If search criteria provided, search
    if (name || id) {
      const patients = await PatientService.searchPatients({
        name: name || undefined,
        id: id || undefined,
      });
      return NextResponse.json(patients);
    }

    // Otherwise, list all patients
    const patients = await PatientService.listPatients();
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error searching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
