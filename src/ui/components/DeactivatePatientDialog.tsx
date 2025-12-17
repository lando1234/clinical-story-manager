'use client';

import { useState } from 'react';
import type { Patient } from '@/types/ui';

interface DeactivatePatientDialogProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/**
 * Confirmation dialog for deactivating a patient.
 * Per specs: explicit confirmation, clear explanation of consequences, Spanish only.
 */
export function DeactivatePatientDialog({
  patient,
  isOpen,
  onClose,
  onConfirm,
}: DeactivatePatientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
      // Dialog will be closed by parent component after successful deactivation
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al desactivar el paciente'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-lg rounded-lg border-2 border-red-200 bg-white p-6 shadow-2xl dark:border-red-900/50 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Danger indicator header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Desactivar Paciente
          </h2>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-base text-gray-700 dark:text-gray-300">
            Está a punto de desactivar a{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {patient.full_name}
            </span>
            . Esta es una acción administrativa que marcará al paciente como inactivo.
          </p>

          {/* Critical information box with strong visual distinction */}
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
            <p className="mb-3 text-sm font-semibold text-red-900 dark:text-red-200">
              ⚠️ Garantía de Preservación de Datos Clínicos:
            </p>
            <p className="mb-2 text-sm leading-relaxed text-red-800 dark:text-red-300">
              <strong>Todos los datos clínicos permanecerán completamente accesibles e intactos.</strong> Esto incluye:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-1 text-sm text-red-800 dark:text-red-300">
              <li>Historial clínico completo</li>
              <li>Todas las notas y documentación de encuentros</li>
              <li>Registros de medicamentos</li>
              <li>Eventos clínicos y línea de tiempo</li>
              <li>Historial psiquiátrico</li>
            </ul>
            <p className="mt-3 text-sm font-medium text-red-900 dark:text-red-200">
              ✓ Esta acción es reversible. El paciente puede ser reactivado en cualquier momento.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
          >
            {isLoading ? 'Desactivando...' : 'Confirmar Desactivación'}
          </button>
        </div>
      </div>
    </div>
  );
}
