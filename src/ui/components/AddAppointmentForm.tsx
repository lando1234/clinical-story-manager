'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface AddAppointmentFormProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: string;
  appointmentType: string;
  notes: string;
}

interface FieldErrors {
  scheduledDate?: string;
  scheduledTime?: string;
  durationMinutes?: string;
  appointmentType?: string;
}

const APPOINTMENT_TYPES = [
  { value: 'Psicoterapia', label: 'Psicoterapia' },
  { value: 'OrientacionFamiliar', label: 'Orientación Familiar' },
  { value: 'LlamadoProgramado', label: 'Llamado Programado' },
  { value: 'LlamadoEnCrisis', label: 'Llamado en Crisis' },
  { value: 'SesionGrupal', label: 'Sesión Grupal' },
  { value: 'Taller', label: 'Taller' },
  { value: 'EntrevistaAdmision', label: 'Entrevista de Admisión' },
  { value: 'Evaluacion', label: 'Evaluación' },
  { value: 'LlamadoColegio', label: 'Llamado al Colegio' },
] as const;

/**
 * Form to schedule a future appointment for a patient.
 * All text in Spanish per UX policy.
 */
export function AddAppointmentForm({
  patientId,
  isOpen,
  onClose,
}: AddAppointmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState<FormData>({
    scheduledDate: defaultDate,
    scheduledTime: '',
    durationMinutes: '60',
    appointmentType: 'Psicoterapia',
    notes: '',
  });

  if (!isOpen) {
    return null;
  }

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.scheduledDate) {
      errors.scheduledDate = 'La fecha programada es requerida';
    } else {
      const scheduledDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      scheduledDate.setHours(0, 0, 0, 0);
      if (scheduledDate < today) {
        errors.scheduledDate = 'La fecha programada no puede ser en el pasado';
      }
    }

    if (formData.scheduledTime) {
      // Validate time format if provided
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.scheduledTime)) {
        errors.scheduledTime = 'Formato de hora inválido (use HH:MM)';
      }
    }

    if (formData.durationMinutes) {
      const duration = parseInt(formData.durationMinutes, 10);
      if (isNaN(duration) || duration <= 0) {
        errors.durationMinutes = 'La duración debe ser un número positivo';
      }
    }

    if (!formData.appointmentType) {
      errors.appointmentType = 'El tipo de cita es requerido';
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
      // Build request body
      const requestBody: {
        scheduledDate: string;
        appointmentType: string;
        scheduledTime?: string;
        durationMinutes?: number;
        notes?: string;
      } = {
        scheduledDate: formData.scheduledDate,
        appointmentType: formData.appointmentType,
      };

      // Add optional fields if provided
      if (formData.scheduledTime) {
        // Combine date and time into ISO string
        const dateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
        requestBody.scheduledTime = dateTime.toISOString();
      }

      if (formData.durationMinutes) {
        requestBody.durationMinutes = parseInt(formData.durationMinutes, 10);
      }

      if (formData.notes && formData.notes.trim().length > 0) {
        requestBody.notes = formData.notes.trim();
      }

      const response = await fetch(`/api/patients/${patientId}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al programar la cita');
      }

      // Success - refresh page to show new appointment
      router.refresh();
      onClose();

      // Reset form
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        scheduledDate: tomorrow.toISOString().split('T')[0],
        scheduledTime: '',
        durationMinutes: '60',
        appointmentType: 'Psicoterapia',
        notes: '',
      });
      setFieldErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al programar la cita'
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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Programar Cita
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Appointment Type */}
          <div>
            <label
              htmlFor="appointmentType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tipo de Cita <span className="text-red-500">*</span>
            </label>
            <select
              id="appointmentType"
              value={formData.appointmentType}
              onChange={(e) =>
                setFormData({ ...formData, appointmentType: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.appointmentType
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            >
              {APPOINTMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {fieldErrors.appointmentType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.appointmentType}
              </p>
            )}
          </div>

          {/* Scheduled Date */}
          <div>
            <label
              htmlFor="scheduledDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Fecha Programada <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="scheduledDate"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              min={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.scheduledDate
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.scheduledDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.scheduledDate}
              </p>
            )}
          </div>

          {/* Scheduled Time */}
          <div>
            <label
              htmlFor="scheduledTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Hora Programada
            </label>
            <input
              type="time"
              id="scheduledTime"
              value={formData.scheduledTime}
              onChange={(e) =>
                setFormData({ ...formData, scheduledTime: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.scheduledTime
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.scheduledTime && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.scheduledTime}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="durationMinutes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Duración (minutos)
            </label>
            <input
              type="number"
              id="durationMinutes"
              min="1"
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData({ ...formData, durationMinutes: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors.durationMinutes
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.durationMinutes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.durationMinutes}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notas
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
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
              {isSubmitting ? 'Programando...' : 'Programar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
