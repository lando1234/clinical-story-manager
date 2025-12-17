import type { Appointment } from '@/types/ui';

interface AppointmentsPanelProps {
  nextAppointment: Appointment | null;
}

/**
 * Quick access panel showing next scheduled appointment
 * UX: Accessible within one interaction from patient view
 */
export function AppointmentsPanel({ nextAppointment }: AppointmentsPanelProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Next Appointment
        </h3>
      </div>

      {!nextAppointment ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          No upcoming appointments
        </p>
      ) : (
        <div className="mt-3 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {nextAppointment.appointment_type}
            </span>
            <StatusBadge status={nextAppointment.status} />
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(nextAppointment.scheduled_date)}</span>
            {nextAppointment.scheduled_time && (
              <>
                <span className="text-gray-300 dark:text-gray-600">at</span>
                <span>{formatTime(nextAppointment.scheduled_time)}</span>
              </>
            )}
          </div>
          {nextAppointment.duration_minutes && (
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{nextAppointment.duration_minutes} minutes</span>
            </div>
          )}
          {nextAppointment.notes && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {nextAppointment.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const styles: Record<Appointment['status'], string> = {
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    'No-show': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
