import { NextRequest, NextResponse } from 'next/server';
import { appointmentService } from '@/domain/appointments/service';
import type { AppointmentType } from '@/domain/appointments/types';

interface RouteParams {
  params: Promise<{ id: string; appointmentId: string }>;
}

/**
 * PATCH /api/patients/:id/appointments/:appointmentId
 * Update an existing appointment.
 *
 * Request body (all fields optional):
 * - scheduledDate?: ISO date string
 * - scheduledTime?: ISO date-time string | null
 * - durationMinutes?: number | null
 * - appointmentType?: AppointmentType enum value
 * - notes?: string | null
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { appointmentId } = await params;
    const body = await request.json();

    // Parse scheduled date if provided
    let scheduledDate: Date | undefined;
    if (body.scheduledDate) {
      scheduledDate = new Date(body.scheduledDate);
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid scheduledDate format' },
          { status: 400 }
        );
      }
    }

    // Parse scheduled time if provided (can be null to clear it)
    let scheduledTime: Date | null | undefined;
    if (body.scheduledTime !== undefined) {
      if (body.scheduledTime === null) {
        scheduledTime = null;
      } else {
        scheduledTime = new Date(body.scheduledTime);
        if (isNaN(scheduledTime.getTime())) {
          return NextResponse.json(
            { error: 'Invalid scheduledTime format' },
            { status: 400 }
          );
        }
      }
    }

    const result = await appointmentService.updateAppointment(appointmentId, {
      scheduledDate,
      scheduledTime,
      durationMinutes: body.durationMinutes,
      appointmentType: body.appointmentType as AppointmentType | undefined,
      notes: body.notes,
    });

    if (!result.success) {
      const status = result.error.code === 'APPOINTMENT_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
