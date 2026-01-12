'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface AddMedicationFormProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  drugName: string;
  dosage: string;
  dosageUnit: string;
  frequency: string;
  prescriptionIssueDate: string;
  prescriptionRenewalPeriod: string;
  comments: string;
}

interface FieldErrors {
  drugName?: string;
  dosage?: string;
  dosageUnit?: string;
  frequency?: string;
  prescriptionIssueDate?: string;
  prescriptionRenewalPeriod?: string;
}

/**
 * Form to add a medication event for a patient.
 * Creates a MedicationStart event via timeline engine.
 * All text in Spanish per UX policy.
 */
export function AddMedicationForm({
  patientId,
  isOpen,
  onClose,
}: AddMedicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formData, setFormData] = useState<FormData>({
    drugName: '',
    dosage: '',
    dosageUnit: 'mg',
    frequency: '',
    prescriptionIssueDate: new Date().toISOString().split('T')[0],
    prescriptionRenewalPeriod: '',
    comments: '',
  });

  if (!isOpen) {
    return null;
  }

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.drugName || formData.drugName.trim().length === 0) {
      errors.drugName = 'El nombre del medicamento es requerido';
    }

    const dosageNum = parseFloat(formData.dosage);
    if (!formData.dosage || isNaN(dosageNum) || dosageNum <= 0) {
      errors.dosage = 'La dosis debe ser un valor positivo';
    }

    if (!formData.dosageUnit || formData.dosageUnit.trim().length === 0) {
      errors.dosageUnit = 'La unidad de dosis es requerida';
    }

    if (!formData.frequency || formData.frequency.trim().length === 0) {
      errors.frequency = 'La frecuencia es requerida';
    }

    if (!formData.prescriptionIssueDate) {
      errors.prescriptionIssueDate = 'La fecha de emisión de receta es requerida';
    } else {
      const prescriptionIssueDate = new Date(formData.prescriptionIssueDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (prescriptionIssueDate > today) {
        errors.prescriptionIssueDate = 'La fecha de emisión de receta no puede ser futura';
      }
    }

    if (formData.prescriptionRenewalPeriod) {
      const renewalNum = parseInt(formData.prescriptionRenewalPeriod, 10);
      if (isNaN(renewalNum) || renewalNum <= 0) {
        errors.prescriptionRenewalPeriod = 'Los días de renovación deben ser un entero positivo';
      }
    }

    // comments is optional - no validation needed

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const renewalPeriod = formData.prescriptionRenewalPeriod
        ? parseInt(formData.prescriptionRenewalPeriod, 10)
        : undefined;

      const response = await fetch(`/api/patients/${patientId}/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drugName: formData.drugName.trim(),
          dosage: parseFloat(formData.dosage),
          dosageUnit: formData.dosageUnit.trim(),
          frequency: formData.frequency.trim(),
          prescriptionIssueDate: formData.prescriptionIssueDate,
          prescriptionRenewalPeriod: renewalPeriod,
          comments: formData.comments.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el medicamento');
      }

      // Success - refresh page to show new medication and timeline event
      router.refresh();
      onClose();
      
      // Reset form
      setFormData({
        drugName: '',
        dosage: '',
        dosageUnit: 'mg',
        frequency: '',
        prescriptionIssueDate: new Date().toISOString().split('T')[0],
        prescriptionRenewalPeriod: '',
        comments: '',
      });
      setFieldErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al crear el medicamento'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setSubmitError(null);
      setFieldErrors({});
      setFormData({
        drugName: '',
        dosage: '',
        dosageUnit: 'mg',
        frequency: '',
        prescriptionIssueDate: new Date().toISOString().split('T')[0],
        prescriptionRenewalPeriod: '',
        comments: '',
      });
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Agregar Medicamento
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drug Name */}
          <div>
            <label
              htmlFor="drugName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre del Medicamento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="drugName"
              value={formData.drugName}
              onChange={(e) =>
                setFormData({ ...formData, drugName: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.drugName
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.drugName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.drugName}
              </p>
            )}
          </div>

          {/* Dosage and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dosage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Dosis <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="dosage"
                step="0.01"
                min="0.01"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border ${
                  fieldErrors.dosage
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
                disabled={isSubmitting}
              />
              {fieldErrors.dosage && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.dosage}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="dosageUnit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Unidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dosageUnit"
                value={formData.dosageUnit}
                onChange={(e) =>
                  setFormData({ ...formData, dosageUnit: e.target.value })
                }
                placeholder="mg, ml, etc."
                className={`mt-1 block w-full rounded-md border ${
                  fieldErrors.dosageUnit
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
                disabled={isSubmitting}
              />
              {fieldErrors.dosageUnit && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.dosageUnit}
                </p>
              )}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Frecuencia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="frequency"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              placeholder="ej: una vez al día, cada 12 horas"
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.frequency
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.frequency && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.frequency}
              </p>
            )}
          </div>

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
              value={formData.prescriptionIssueDate}
              onChange={(e) =>
                setFormData({ ...formData, prescriptionIssueDate: e.target.value })
              }
              max={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.prescriptionIssueDate
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.prescriptionIssueDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.prescriptionIssueDate}
              </p>
            )}
          </div>

          {/* Prescription Renewal Period */}
          <div>
            <label
              htmlFor="prescriptionRenewalPeriod"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Días para renovación de receta
            </label>
            <input
              type="number"
              id="prescriptionRenewalPeriod"
              value={formData.prescriptionRenewalPeriod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prescriptionRenewalPeriod: e.target.value,
                })
              }
              min={1}
              step={1}
              placeholder="Ej. 30"
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.prescriptionRenewalPeriod
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Opcional. Ingresa los días de vigencia antes de requerir renovación.
            </p>
            {fieldErrors.prescriptionRenewalPeriod && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.prescriptionRenewalPeriod}
              </p>
            )}
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
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Comentarios opcionales sobre la prescripción"
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
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {isSubmitting ? 'Creando...' : 'Crear Medicamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
