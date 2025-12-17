import type { Note } from '@/types/ui';

interface NotesPanelProps {
  mostRecentNote: Note | null;
}

/**
 * Quick access panel showing most recent finalized note
 * UX: Accessible within one interaction from patient view
 */
export function NotesPanel({ mostRecentNote }: NotesPanelProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Nota Más Reciente
        </h3>
      </div>

      {!mostRecentNote ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Sin notas finalizadas
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {mostRecentNote.encounter_type}
            </span>
            <StatusBadge status={mostRecentNote.status} />
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(mostRecentNote.encounter_date)}
          </div>

          {/* Note preview - assessment section */}
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Evaluación
            </div>
            <p className="mt-1 line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
              {mostRecentNote.assessment}
            </p>
          </div>

          {/* Plan preview */}
          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Plan
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
              {mostRecentNote.plan}
            </p>
          </div>

          {mostRecentNote.finalized_at && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Finalizada {formatDateTime(mostRecentNote.finalized_at)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Note['status'] }) {
  if (status === 'Finalized') {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
        Finalizada
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
      Borrador
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
