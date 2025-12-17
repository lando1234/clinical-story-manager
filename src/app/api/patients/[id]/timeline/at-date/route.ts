import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalState } from '@/domain/timeline';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/patients/:id/timeline/at-date
 * Retrieve the patient's clinical state as it existed on a specific date.
 *
 * Query params:
 * - date: ISO date string (e.g., '2024-01-15') - required
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: patientId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json(
        { error: 'Missing required query parameter: date' },
        { status: 400 }
      );
    }

    const targetDate = new Date(dateParam);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use ISO date format (e.g., 2024-01-15)' },
        { status: 400 }
      );
    }

    const result = await getHistoricalState(patientId, targetDate);

    if (!result.success) {
      const status = result.error.code === 'PATIENT_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching historical state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
