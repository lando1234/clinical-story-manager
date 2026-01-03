import { NextResponse } from 'next/server';
import { appointmentService } from '@/domain/appointments/service';
import { AppointmentStatus } from '@/domain/appointments/types';
import { PatientService } from '@/domain/patient/service';

/**
 * GET /api/appointments/upcoming
 * Get appointments scheduled for the next 7 days.
 * Returns appointments with status "Scheduled" only.
 */
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999);

    const appointments = await appointmentService.getAppointments({
      status: AppointmentStatus.Scheduled,
      fromDate: today,
      toDate: sevenDaysLater,
    });

    // Get unique patient IDs
    const patientIds = [...new Set(appointments.map(a => a.patientId))];
    
    // Fetch all patients in one batch
    const allPatients = await PatientService.listPatients();
    const patientMap = new Map(
      allPatients
        .filter(p => patientIds.includes(p.id))
        .map(p => [p.id, p.fullName])
    );

    // Map to include patient information for display
    const appointmentsWithPatient = appointments.map((appointment) => {
      return {
        id: appointment.id,
        patientId: appointment.patientId,
        patientName: patientMap.get(appointment.patientId) || 'Paciente desconocido',
        scheduledDate: appointment.scheduledDate.toISOString().split('T')[0],
        scheduledTime: appointment.scheduledTime
          ? appointment.scheduledTime.toISOString().split('T')[1].substring(0, 5)
          : null,
        appointmentType: appointment.appointmentType,
      };
    });

    // Sort by date and time (already sorted by repository, but ensure consistency)
    appointmentsWithPatient.sort((a, b) => {
      const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
      if (dateCompare !== 0) return dateCompare;
      const timeA = a.scheduledTime || '00:00';
      const timeB = b.scheduledTime || '00:00';
      return timeA.localeCompare(timeB);
    });

    return NextResponse.json(appointmentsWithPatient);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




