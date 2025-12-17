'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import type { Note } from '@/types/ui';
import { AddClinicalNoteForm } from './AddClinicalNoteForm';

interface NotesPanelProps {
  mostRecentNote: Note | null;
}

/**
 * Quick access panel showing most recent finalized note
 * UX: Accessible within one interaction from patient view
 */
export function NotesPanel({ mostRecentNote }: NotesPanelProps) {
  const params = useParams();
  const patientId = params.id as string;
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between gap-2">
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
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-600"
            title="Agregar nota clínica"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar
          </button>
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
      <AddClinicalNoteForm
        patientId={patientId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
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
