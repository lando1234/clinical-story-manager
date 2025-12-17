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
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Desactivar Paciente
        </h2>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Está seguro de que desea desactivar a{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {patient.full_name}
            </span>
            ?
          </p>

          <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Importante:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <li>El paciente será marcado como inactivo</li>
              <li>Todos los datos clínicos permanecerán accesibles</li>
              <li>El historial completo se conservará</li>
              <li>Esta acción es reversible</li>
            </ul>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
          >
            {isLoading ? 'Desactivando...' : 'Desactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}
