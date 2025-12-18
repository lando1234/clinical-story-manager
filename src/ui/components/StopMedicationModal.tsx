'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface StopMedicationModalProps {
  patientId: string;
  medicationId: string;
  drugName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para suspender un medicamento activo.
 * Per spec: docs/21_ajuste_dosis_medicamentos.md (suspensión)
 */
export function StopMedicationModal({
  patientId,
  medicationId,
  drugName,
  isOpen,
  onClose,
}: StopMedicationModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [discontinuationReason, setDiscontinuationReason] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!endDate) {
      setSubmitError('La fecha de fin es requerida');
      return;
    }

    const endDateObj = new Date(endDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (endDateObj > today) {
      setSubmitError('La fecha de fin no puede ser futura');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/patients/${patientId}/medications/${medicationId}/stop`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endDate: endDate,
            discontinuationReason: discontinuationReason.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al suspender el medicamento');
      }

      // Success - refresh page to update medications and timeline
      router.refresh();
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al suspender el medicamento'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setSubmitError(null);
      setEndDate(new Date().toISOString().split('T')[0]);
      setDiscontinuationReason('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Suspender Medicamento
          </h2>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Suspender <span className="font-medium">{drugName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Fecha de Fin <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Discontinuation Reason */}
          <div>
            <label
              htmlFor="discontinuationReason"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Motivo (opcional)
            </label>
            <textarea
              id="discontinuationReason"
              rows={3}
              value={discontinuationReason}
              onChange={(e) => setDiscontinuationReason(e.target.value)}
              placeholder="Razón de la suspensión..."
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSubmitting}
            />
          </div>

          {submitError && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {submitError}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {isSubmitting ? 'Suspendiendo...' : 'Suspender'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
