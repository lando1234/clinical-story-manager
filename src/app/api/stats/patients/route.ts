import { NextResponse } from 'next/server';
import { PatientService } from '@/domain/patient/service';

/**
 * GET /api/stats/patients
 * Get patient statistics: total, active, and inactive counts.
 */
export async function GET() {
  try {
    const patients = await PatientService.listPatients();
    
    const total = patients.length;
    const active = patients.filter(p => p.status === 'Active').length;
    const inactive = patients.filter(p => p.status === 'Inactive').length;

    return NextResponse.json({
      total,
      active,
      inactive,
    });
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}






