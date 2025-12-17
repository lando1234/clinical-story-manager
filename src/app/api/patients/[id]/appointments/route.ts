import { NextRequest, NextResponse } from 'next/server';
import { appointmentService } from '@/domain/appointments/service';
import type { AppointmentType } from '@/domain/appointments/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/patients/:id/appointments
 * List all appointments for a patient.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: patientId } = await params;

    const appointments = await appointmentService.getPatientAppointments(patientId);

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patients/:id/appointments
 * Schedule a new appointment for a patient.
 *
 * Request body:
 * - scheduledDate: ISO date string (required)
 * - scheduledTime?: ISO date-time string
 * - durationMinutes?: number
 * - appointmentType: AppointmentType enum value (required)
 * - notes?: string
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: patientId } = await params;
    const body = await request.json();

    // Parse scheduled date
    const scheduledDate = body.scheduledDate ? new Date(body.scheduledDate) : undefined;
    if (!scheduledDate || isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid or missing scheduledDate' },
        { status: 400 }
      );
    }

    // Parse scheduled time if provided
    let scheduledTime: Date | undefined;
    if (body.scheduledTime) {
      scheduledTime = new Date(body.scheduledTime);
      if (isNaN(scheduledTime.getTime())) {
        return NextResponse.json(
          { error: 'Invalid scheduledTime format' },
          { status: 400 }
        );
      }
    }

    const result = await appointmentService.scheduleAppointment({
      patientId,
      scheduledDate,
      scheduledTime,
      durationMinutes: body.durationMinutes,
      appointmentType: body.appointmentType as AppointmentType,
      notes: body.notes,
    });

    if (!result.success) {
      const status = result.error.code === 'PATIENT_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.appointment, { status: 201 });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
