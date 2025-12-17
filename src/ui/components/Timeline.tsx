import type { TimelineEvent as TimelineEventType } from '@/types/ui';
import { TimelineEvent } from './TimelineEvent';

interface TimelineProps {
  events: TimelineEventType[];
}

/**
 * Timeline view - primary navigation structure for patient records
 * Displays events in reverse chronological order (most recent first)
 */
export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="h-12 w-12 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          No events yet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          This patient&apos;s timeline is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Clinical Timeline
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="relative">
        {events.map((event) => (
          <TimelineEvent key={event.event_identifier} event={event} />
        ))}
      </div>
    </div>
  );
}
