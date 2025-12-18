'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface ChangeMedicationModalProps {
  patientId: string;
  medicationId: string;
  drugName: string;
  currentDosage: number;
  currentDosageUnit: string;
  currentFrequency: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para ajustar la dosis de un medicamento activo.
 * Per spec: docs/21_ajuste_dosis_medicamentos.md
 */
export function ChangeMedicationModal({
  patientId,
  medicationId,
  drugName,
  currentDosage,
  currentDosageUnit,
  currentFrequency,
  isOpen,
  onClose,
}: ChangeMedicationModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newDosage, setNewDosage] = useState('');
  const [newDosageUnit, setNewDosageUnit] = useState(currentDosageUnit);
  const [newFrequency, setNewFrequency] = useState(currentFrequency);
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [changeReason, setChangeReason] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const dosageNum = parseFloat(newDosage);
    if (!newDosage || isNaN(dosageNum) || dosageNum <= 0) {
      setSubmitError('La nueva dosis debe ser un valor positivo');
      return;
    }

    if (!effectiveDate) {
      setSubmitError('La fecha efectiva es requerida');
      return;
    }

    const effectiveDateObj = new Date(effectiveDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (effectiveDateObj > today) {
      setSubmitError('La fecha efectiva no puede ser futura');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/patients/${patientId}/medications/${medicationId}/change`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newDosage: dosageNum,
            newDosageUnit: newDosageUnit || undefined,
            newFrequency: newFrequency || undefined,
            effectiveDate: effectiveDate,
            changeReason: changeReason.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al ajustar la dosis');
      }

      // Success - refresh page to update medications and timeline
      router.refresh();
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al ajustar la dosis'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setSubmitError(null);
      setNewDosage('');
      setNewDosageUnit(currentDosageUnit);
      setNewFrequency(currentFrequency);
      setEffectiveDate(new Date().toISOString().split('T')[0]);
      setChangeReason('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <svg
              className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Ajustar Dosis
          </h2>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Ajustar dosis de <span className="font-medium">{drugName}</span>
        </p>

        <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Dosis Actual
          </div>
          <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {currentDosage} {currentDosageUnit} - {currentFrequency}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Dosage and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="newDosage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nueva Dosis <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="newDosage"
                step="0.01"
                min="0.01"
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label
                htmlFor="newDosageUnit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Unidad
              </label>
              <input
                type="text"
                id="newDosageUnit"
                value={newDosageUnit}
                onChange={(e) => setNewDosageUnit(e.target.value)}
                placeholder="mg, ml, etc."
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* New Frequency */}
          <div>
            <label
              htmlFor="newFrequency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nueva Frecuencia (opcional)
            </label>
            <input
              type="text"
              id="newFrequency"
              value={newFrequency}
              onChange={(e) => setNewFrequency(e.target.value)}
              placeholder="ej: una vez al día, cada 12 horas"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSubmitting}
            />
          </div>

          {/* Effective Date */}
          <div>
            <label
              htmlFor="effectiveDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Fecha Efectiva <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="effectiveDate"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Change Reason */}
          <div>
            <label
              htmlFor="changeReason"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Motivo (opcional)
            </label>
            <textarea
              id="changeReason"
              rows={3}
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="Razón del ajuste..."
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
              className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-yellow-700 dark:hover:bg-yellow-600"
            >
              {isSubmitting ? 'Ajustando...' : 'Ajustar Dosis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
