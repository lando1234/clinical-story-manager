import { NextRequest, NextResponse } from 'next/server';
import { appointmentService } from '@/domain/appointments/service';

interface RouteParams {
  params: Promise<{ id: string; appointmentId: string }>;
}

/**
 * POST /api/patients/:id/appointments/:appointmentId/cancel
 * Cancel an existing appointment.
 *
 * Request body (optional):
 * - reason?: string
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { appointmentId } = await params;
    
    let body: { reason?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional, ignore parse errors
    }

    const result = await appointmentService.cancelAppointment(appointmentId, {
      reason: body.reason,
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
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
