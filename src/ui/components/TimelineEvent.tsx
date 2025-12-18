import type { TimelineEvent as TimelineEventType } from '@/types/ui';

interface TimelineEventProps {
  event: TimelineEventType;
}

/**
 * Individual event card in the timeline
 * Visual styling varies by event type
 */
export function TimelineEvent({ event }: TimelineEventProps) {
  const { icon, color } = getEventStyle(event.event_type);
  const formattedDate = formatDate(event.event_timestamp);

  // Estilo diferenciado para evento fundacional (neutro, sin acciones)
  const isFoundational = event.event_type === 'Inicio de Historia Clínica';
  const isNote = event.event_type === 'Nota clínica';
  const isEncounter = event.event_type === 'Turno';

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline connector line */}
      <div className="absolute left-[15px] top-8 h-full w-0.5 bg-gray-200 last:hidden dark:bg-gray-700" />
      
      {/* Event icon */}
      <div
        className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${color} ${
          isFoundational ? 'opacity-75' : ''
        }`}
      >
        {icon}
      </div>

      {/* Event content */}
      <div
        className={`flex-1 rounded-lg border p-4 shadow-sm ${
          isFoundational
            ? 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50'
            : isNote
            ? 'border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/10'
            : isEncounter
            ? 'border-purple-200 bg-purple-50/30 dark:border-purple-800 dark:bg-purple-900/10'
            : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className={`text-xs font-medium uppercase tracking-wide ${
                isFoundational
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {event.event_type}
            </span>
            <h4
              className={`mt-1 font-medium ${
                isFoundational
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {event.title}
            </h4>
          </div>
          <time
            className={`flex-shrink-0 text-sm ${
              isFoundational
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {formattedDate}
          </time>
        </div>
        
        {event.description && (
          <p
            className={`mt-2 text-sm ${
              isFoundational
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {event.description}
          </p>
        )}

        {/* Mostrar origen solo para eventos clínicos (no fundacional) */}
        {event.source_type && !isFoundational && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>
              {isNote
                ? 'Nota Clínica asociada'
                : isEncounter
                ? 'Turno realizado'
                : event.source_type === 'Appointment'
                ? 'Origen: Turno'
                : event.source_type === 'Medication'
                ? 'Origen: Medicación'
                : event.source_type === 'PsychiatricHistory'
                ? 'Origen: Historia Psiquiátrica'
                : `Origen: ${event.source_type}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function getEventStyle(eventType: TimelineEventType['event_type']): {
  icon: React.ReactNode;
  color: string;
} {
  switch (eventType) {
    case 'Inicio de Historia Clínica':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: 'bg-slate-500',
      };
    case 'Nota clínica':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: 'bg-blue-500',
      };
    case 'Turno':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        color: 'bg-purple-500',
      };
    case 'Inicio de Medicación':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        color: 'bg-green-500',
      };
    case 'Cambio de Medicación':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
        color: 'bg-yellow-500',
      };
    case 'Suspensión de Medicación':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        ),
        color: 'bg-red-500',
      };
    case 'Hospitalización':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        color: 'bg-purple-500',
      };
    case 'Evento Vital':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ),
        color: 'bg-orange-500',
      };
    case 'Actualización de Historia':
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: 'bg-indigo-500',
      };
    default:
      return {
        icon: (
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: 'bg-gray-500',
      };
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
