'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface IssuePrescriptionModalProps {
  patientId: string;
  medicationId: string;
  drugName: string;
  dosage: number;
  dosageUnit: string;
  originalPrescriptionIssueDate: Date;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para emitir una nueva receta para un medicamento activo.
 * Per spec: docs/22_cambios_medicacion_actualizacion.md
 */
export function IssuePrescriptionModal({
  patientId,
  medicationId,
  drugName,
  dosage,
  dosageUnit,
  originalPrescriptionIssueDate,
  isOpen,
  onClose,
}: IssuePrescriptionModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [prescriptionIssueDate, setPrescriptionIssueDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [comments, setComments] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!prescriptionIssueDate) {
      setSubmitError('La fecha de emisión de receta es requerida');
      return;
    }

    const prescriptionIssueDateObj = new Date(prescriptionIssueDate);

    // Note: Per INC-14 resolution, future dates are allowed for MedicationPrescriptionIssued events.
    // Events with future dates are created but filtered from timeline until date passes.
    // Only validate that new prescription date is after original prescription issue date
    // Validate that new prescription date is after original prescription issue date
    const originalDate = new Date(originalPrescriptionIssueDate);
    originalDate.setHours(0, 0, 0, 0);
    prescriptionIssueDateObj.setHours(0, 0, 0, 0);

    if (prescriptionIssueDateObj <= originalDate) {
      setSubmitError(
        'La fecha de emisión de la nueva receta debe ser posterior a la fecha de emisión de la primera receta'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/patients/${patientId}/medications/${medicationId}/issue-prescription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prescriptionIssueDate: prescriptionIssueDate,
            comments: comments.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al emitir la receta');
      }

      // Success - refresh page to update timeline
      router.refresh();
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al emitir la receta'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setSubmitError(null);
      setPrescriptionIssueDate(new Date().toISOString().split('T')[0]);
      setComments('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
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
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Nueva Receta Emitida
          </h2>
        </div>

        <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Medicamento:</span> {drugName}{' '}
            {dosage}
            {dosageUnit}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Primera receta emitida:{' '}
            {new Date(originalPrescriptionIssueDate).toLocaleDateString('es-AR')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prescription Issue Date */}
          <div>
            <label
              htmlFor="prescriptionIssueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Fecha de Emisión de Receta <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="prescriptionIssueDate"
              value={prescriptionIssueDate}
              onChange={(e) => setPrescriptionIssueDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min={new Date(originalPrescriptionIssueDate).toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Debe ser posterior a la fecha de emisión de la primera receta
            </p>
          </div>

          {/* Comments */}
          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Comentarios
            </label>
            <textarea
              id="comments"
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Comentarios opcionales sobre la emisión de la receta"
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
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isSubmitting ? 'Emitiendo...' : 'Emitir Receta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

