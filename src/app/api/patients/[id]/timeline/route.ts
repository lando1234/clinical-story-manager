import { NextRequest, NextResponse } from 'next/server';
import { getFullTimeline } from '@/domain/timeline';
import type { TimelineDirection } from '@/domain/timeline';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/patients/:id/timeline
 * Retrieve the full patient timeline.
 *
 * Query params:
 * - direction: 'ascending' | 'descending' (default: 'descending')
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: patientId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const direction = (searchParams.get('direction') || 'descending') as TimelineDirection;

    const result = await getFullTimeline(patientId, direction);

    if (!result.success) {
      const status = result.error.code === 'PATIENT_NOT_FOUND' ? 404 : 400;
      return NextResponse.json(
        { error: result.error.message },
        { status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
