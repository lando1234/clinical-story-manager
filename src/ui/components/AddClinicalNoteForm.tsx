'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface AddClinicalNoteFormProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  encounterDate: string;
  encounterType: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  finalizeImmediately: boolean;
}

interface FieldErrors {
  encounterDate?: string;
  encounterType?: string;
  subjective?: string;
  assessment?: string;
  plan?: string;
}

const ENCOUNTER_TYPES = [
  { value: 'InitialEvaluation', label: 'Evaluación Inicial' },
  { value: 'FollowUp', label: 'Seguimiento' },
  { value: 'CrisisIntervention', label: 'Intervención en Crisis' },
  { value: 'MedicationReview', label: 'Revisión de Medicación' },
  { value: 'TherapySession', label: 'Sesión de Terapia' },
  { value: 'PhoneConsultation', label: 'Consulta Telefónica' },
  { value: 'Other', label: 'Otro' },
] as const;

/**
 * Form to add a clinical note for a patient.
 * Creates a draft note, optionally finalizes it immediately to create timeline event.
 * All text in Spanish per UX policy.
 */
export function AddClinicalNoteForm({
  patientId,
  isOpen,
  onClose,
}: AddClinicalNoteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formData, setFormData] = useState<FormData>({
    encounterDate: new Date().toISOString().split('T')[0],
    encounterType: 'FollowUp',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    finalizeImmediately: true,
  });

  if (!isOpen) {
    return null;
  }

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.encounterDate) {
      errors.encounterDate = 'La fecha del encuentro es requerida';
    } else {
      const encounterDate = new Date(formData.encounterDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (encounterDate > today) {
        errors.encounterDate = 'La fecha del encuentro no puede ser futura';
      }
    }

    if (!formData.encounterType) {
      errors.encounterType = 'El tipo de encuentro es requerido';
    }

    // If finalizing immediately, these fields are required
    if (formData.finalizeImmediately) {
      if (!formData.subjective || formData.subjective.trim().length === 0) {
        errors.subjective = 'El campo subjetivo es requerido para finalizar';
      }
      if (!formData.assessment || formData.assessment.trim().length === 0) {
        errors.assessment = 'El campo de evaluación es requerido para finalizar';
      }
      if (!formData.plan || formData.plan.trim().length === 0) {
        errors.plan = 'El campo de plan es requerido para finalizar';
      }
    }

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
      // Step 1: Create draft note
      const createResponse = await fetch(`/api/patients/${patientId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encounterDate: formData.encounterDate,
          encounterType: formData.encounterType,
          subjective: formData.subjective.trim() || undefined,
          objective: formData.objective.trim() || undefined,
          assessment: formData.assessment.trim() || undefined,
          plan: formData.plan.trim() || undefined,
        }),
      });

      if (!createResponse.ok) {
        const data = await createResponse.json();
        throw new Error(data.error || 'Error al crear la nota');
      }

      const note = await createResponse.json();

      // Step 2: If finalize immediately, finalize the note to create timeline event
      if (formData.finalizeImmediately) {
        const finalizeResponse = await fetch(
          `/api/patients/${patientId}/notes/${note.id}/finalize`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!finalizeResponse.ok) {
          const data = await finalizeResponse.json();
          throw new Error(
            data.error || 'Error al finalizar la nota. La nota fue creada como borrador.'
          );
        }
      }

      // Success - refresh page to show new note and timeline event (if finalized)
      router.refresh();
      onClose();

      // Reset form
      setFormData({
        encounterDate: new Date().toISOString().split('T')[0],
        encounterType: 'FollowUp',
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        finalizeImmediately: true,
      });
      setFieldErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al crear la nota'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setSubmitError(null);
      setFieldErrors({});
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <svg
              className="h-6 w-6 text-purple-600 dark:text-purple-400"
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
            Agregar Nota Clínica
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Encounter Date and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="encounterDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Fecha del Encuentro <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="encounterDate"
                value={formData.encounterDate}
                onChange={(e) =>
                  setFormData({ ...formData, encounterDate: e.target.value })
                }
                max={new Date().toISOString().split('T')[0]}
                className={`mt-1 block w-full rounded-md border ${
                  fieldErrors.encounterDate
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
                disabled={isSubmitting}
              />
              {fieldErrors.encounterDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.encounterDate}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="encounterType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tipo de Encuentro <span className="text-red-500">*</span>
              </label>
              <select
                id="encounterType"
                value={formData.encounterType}
                onChange={(e) =>
                  setFormData({ ...formData, encounterType: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border ${
                  fieldErrors.encounterType
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
                disabled={isSubmitting}
              >
                {ENCOUNTER_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {fieldErrors.encounterType && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.encounterType}
                </p>
              )}
            </div>
          </div>

          {/* Subjective */}
          <div>
            <label
              htmlFor="subjective"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subjetivo
              {formData.finalizeImmediately && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <textarea
              id="subjective"
              rows={4}
              value={formData.subjective}
              onChange={(e) =>
                setFormData({ ...formData, subjective: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.subjective
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.subjective && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.subjective}
              </p>
            )}
          </div>

          {/* Objective */}
          <div>
            <label
              htmlFor="objective"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Objetivo
            </label>
            <textarea
              id="objective"
              rows={4}
              value={formData.objective}
              onChange={(e) =>
                setFormData({ ...formData, objective: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              disabled={isSubmitting}
            />
          </div>

          {/* Assessment */}
          <div>
            <label
              htmlFor="assessment"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Evaluación
              {formData.finalizeImmediately && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <textarea
              id="assessment"
              rows={4}
              value={formData.assessment}
              onChange={(e) =>
                setFormData({ ...formData, assessment: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.assessment
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.assessment && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.assessment}
              </p>
            )}
          </div>

          {/* Plan */}
          <div>
            <label
              htmlFor="plan"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Plan
              {formData.finalizeImmediately && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <textarea
              id="plan"
              rows={4}
              value={formData.plan}
              onChange={(e) =>
                setFormData({ ...formData, plan: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.plan
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.plan && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.plan}
              </p>
            )}
          </div>

          {/* Finalize Immediately Option */}
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.finalizeImmediately}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    finalizeImmediately: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Finalizar inmediatamente (crea evento en la línea de tiempo)
              </span>
            </label>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Si se desmarca, la nota se guardará como borrador y podrá ser
              finalizada más tarde.
            </p>
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
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-purple-700 dark:hover:bg-purple-600"
            >
              {isSubmitting
                ? formData.finalizeImmediately
                  ? 'Creando y finalizando...'
                  : 'Creando...'
                : formData.finalizeImmediately
                  ? 'Crear y Finalizar Nota'
                  : 'Crear Borrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
