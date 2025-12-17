'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PatientOutput } from '@/types/patient';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  status: 'Active' | 'Inactive';
}

interface FieldErrors {
  fullName?: string;
  dateOfBirth?: string;
  contactPhone?: string;
  contactEmail?: string;
  emergencyContactPhone?: string;
  [key: string]: string | undefined;
}

interface UpdatePatientFormProps {
  patientId: string;
}

/**
 * Form for updating an existing patient
 * Pre-fills with current patient data
 * Shows immutable fields as read-only
 * Validates client-side before submission
 */
export function UpdatePatientForm({ patientId }: UpdatePatientFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [originalPatient, setOriginalPatient] = useState<PatientOutput | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    status: 'Active',
  });

  // Load patient data on mount
  useEffect(() => {
    const loadPatient = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/patients');
            return;
          }
          throw new Error('Error al cargar los datos del paciente');
        }
        const patient: PatientOutput = await response.json();
        setOriginalPatient(patient);

        // Pre-fill form with current patient data
        // Date comes as ISO string from API, convert to YYYY-MM-DD format
        const dobDate = patient.dateOfBirth 
          ? (typeof patient.dateOfBirth === 'string' 
              ? patient.dateOfBirth 
              : new Date(patient.dateOfBirth).toISOString()).split('T')[0]
          : '';

        setFormData({
          fullName: patient.fullName,
          dateOfBirth: dobDate,
          contactPhone: patient.contactPhone || '',
          contactEmail: patient.contactEmail || '',
          address: patient.address || '',
          emergencyContactName: patient.emergencyContactName || '',
          emergencyContactPhone: patient.emergencyContactPhone || '',
          emergencyContactRelationship: patient.emergencyContactRelationship || '',
          status: patient.status,
        });
      } catch (error) {
        setSubmitError('Error al cargar los datos del paciente. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPatient();
  }, [patientId, router]);

  // Validation functions matching backend rules
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d+$/.test(cleaned) && cleaned.length >= 7 && cleaned.length <= 15;
  };

  // Translate backend error messages to Spanish
  const translateError = (error: string): string => {
    const translations: Record<string, string> = {
      'Full name is required': 'El nombre completo es requerido',
      'Date of birth must be a valid date': 'La fecha de nacimiento debe ser una fecha válida',
      'Date of birth cannot be in the future': 'La fecha de nacimiento no puede ser futura',
      'Invalid email format': 'El formato del correo electrónico no es válido',
      'Invalid phone format': 'El formato del teléfono no es válido',
      'Emergency contact phone is required when emergency contact name is provided':
        'El teléfono de contacto de emergencia es requerido cuando se proporciona un nombre',
      'Patient not found': 'Paciente no encontrado',
    };
    return translations[error] || error;
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    // Full name: required, non-empty after trim
    if (!formData.fullName || formData.fullName.trim().length === 0) {
      errors.fullName = 'El nombre completo es requerido';
    }

    // Date of birth: required, valid date, not in future
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'La fecha de nacimiento es requerida';
    } else {
      const dob = new Date(formData.dateOfBirth);
      if (isNaN(dob.getTime())) {
        errors.dateOfBirth = 'La fecha de nacimiento debe ser una fecha válida';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dobDate = new Date(dob);
        dobDate.setHours(0, 0, 0, 0);
        if (dobDate > today) {
          errors.dateOfBirth = 'La fecha de nacimiento no puede ser futura';
        }
      }
    }

    // Contact email: optional, but if provided must be valid
    if (formData.contactEmail && formData.contactEmail.trim().length > 0) {
      if (!isValidEmail(formData.contactEmail)) {
        errors.contactEmail = 'El formato del correo electrónico no es válido';
      }
    }

    // Contact phone: optional, but if provided must be valid
    if (formData.contactPhone && formData.contactPhone.trim().length > 0) {
      if (!isValidPhone(formData.contactPhone)) {
        errors.contactPhone = 'El formato del teléfono no es válido';
      }
    }

    // Emergency contact: if name provided, phone is required
    if (formData.emergencyContactName && formData.emergencyContactName.trim().length > 0) {
      if (!formData.emergencyContactPhone || formData.emergencyContactPhone.trim().length === 0) {
        errors.emergencyContactPhone = 'El teléfono de contacto de emergencia es requerido cuando se proporciona un nombre';
      } else if (!isValidPhone(formData.emergencyContactPhone)) {
        errors.emergencyContactPhone = 'El formato del teléfono de contacto de emergencia no es válido';
      }
    } else if (formData.emergencyContactPhone && formData.emergencyContactPhone.trim().length > 0) {
      // If phone is provided but name is not, validate phone format
      if (!isValidPhone(formData.emergencyContactPhone)) {
        errors.emergencyContactPhone = 'El formato del teléfono de contacto de emergencia no es válido';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasChanges = (): boolean => {
    if (!originalPatient) return false;
    
    // Normalize date for comparison
    const originalDob = originalPatient.dateOfBirth
      ? (typeof originalPatient.dateOfBirth === 'string'
          ? originalPatient.dateOfBirth
          : new Date(originalPatient.dateOfBirth).toISOString()).split('T')[0]
      : '';
    
    return (
      formData.fullName.trim() !== originalPatient.fullName ||
      formData.dateOfBirth !== originalDob ||
      (formData.contactPhone || '') !== (originalPatient.contactPhone || '') ||
      (formData.contactEmail || '') !== (originalPatient.contactEmail || '') ||
      (formData.address || '') !== (originalPatient.address || '') ||
      (formData.emergencyContactName || '') !== (originalPatient.emergencyContactName || '') ||
      (formData.emergencyContactPhone || '') !== (originalPatient.emergencyContactPhone || '') ||
      (formData.emergencyContactRelationship || '') !== (originalPatient.emergencyContactRelationship || '') ||
      formData.status !== originalPatient.status
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    // Check if there are any changes
    if (!hasChanges()) {
      setSubmitError('No hay cambios para guardar');
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare request body - only send changed fields
      const requestBody: any = {};

      if (originalPatient) {
        // Normalize date for comparison
        const originalDob = originalPatient.dateOfBirth
          ? (typeof originalPatient.dateOfBirth === 'string'
              ? originalPatient.dateOfBirth
              : new Date(originalPatient.dateOfBirth).toISOString()).split('T')[0]
          : '';

        if (formData.fullName.trim() !== originalPatient.fullName) {
          requestBody.fullName = formData.fullName.trim();
        }
        if (formData.dateOfBirth !== originalDob) {
          requestBody.dateOfBirth = formData.dateOfBirth;
        }
        if ((formData.contactPhone || '') !== (originalPatient.contactPhone || '')) {
          requestBody.contactPhone = formData.contactPhone.trim() || null;
        }
        if ((formData.contactEmail || '') !== (originalPatient.contactEmail || '')) {
          requestBody.contactEmail = formData.contactEmail.trim() || null;
        }
        if ((formData.address || '') !== (originalPatient.address || '')) {
          requestBody.address = formData.address.trim() || null;
        }
        if ((formData.emergencyContactName || '') !== (originalPatient.emergencyContactName || '')) {
          requestBody.emergencyContactName = formData.emergencyContactName.trim() || null;
        }
        if ((formData.emergencyContactPhone || '') !== (originalPatient.emergencyContactPhone || '')) {
          requestBody.emergencyContactPhone = formData.emergencyContactPhone.trim() || null;
        }
        if ((formData.emergencyContactRelationship || '') !== (originalPatient.emergencyContactRelationship || '')) {
          requestBody.emergencyContactRelationship = formData.emergencyContactRelationship.trim() || null;
        }
        if (formData.status !== originalPatient.status) {
          requestBody.status = formData.status;
        }
      }

      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Error al actualizar el paciente';
        setSubmitError(translateError(errorMessage));
        setIsSubmitting(false);
        return;
      }

      // Success: redirect to patient page
      router.push(`/patients/${patientId}`);
      router.refresh();
    } catch (error) {
      setSubmitError('Error de conexión. Por favor, intente nuevamente.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | 'Active' | 'Inactive') => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando datos del paciente...</p>
      </div>
    );
  }

  if (!originalPatient) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
        <p className="text-sm text-red-800 dark:text-red-200">
          No se pudo cargar la información del paciente.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Immutable Fields Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Información del Sistema (No Editable)
          </h2>

          {/* Identifier */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Identificador
            </label>
            <input
              type="text"
              value={originalPatient.id}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Este campo no puede ser modificado
            </p>
          </div>

          {/* Registration Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de Registro
            </label>
            <input
              type="text"
              value={new Date(originalPatient.registrationDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Este campo no puede ser modificado
            </p>
          </div>

          {/* Created At */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de Creación
            </label>
            <input
              type="text"
              value={new Date(originalPatient.createdAt).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Este campo no puede ser modificado
            </p>
          </div>

          {/* Updated At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Última Actualización
            </label>
            <input
              type="text"
              value={new Date(originalPatient.updatedAt).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Este campo se actualiza automáticamente
            </p>
          </div>
        </div>

        {/* Required Fields Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Información Requerida
          </h2>

          {/* Full Name */}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                fieldErrors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700'
              } bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`}
              placeholder="Ej: María García López"
              disabled={isSubmitting}
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Fecha de nacimiento <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                fieldErrors.dateOfBirth
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700'
              } bg-white text-gray-900 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100`}
              disabled={isSubmitting}
            />
            {fieldErrors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.dateOfBirth}
              </p>
            )}
          </div>
        </div>

        {/* Optional Contact Information Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Información de Contacto (Opcional)
          </h2>

          {/* Contact Phone */}
          <div className="mb-4">
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Teléfono de contacto
            </label>
            <input
              type="tel"
              id="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                fieldErrors.contactPhone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700'
              } bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`}
              placeholder="Ej: +34 600 123 456"
              disabled={isSubmitting}
            />
            {fieldErrors.contactPhone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.contactPhone}
              </p>
            )}
          </div>

          {/* Contact Email */}
          <div className="mb-4">
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Correo electrónico de contacto
            </label>
            <input
              type="email"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                fieldErrors.contactEmail
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700'
              } bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`}
              placeholder="Ej: maria.garcia@example.com"
              disabled={isSubmitting}
            />
            {fieldErrors.contactEmail && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.contactEmail}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Dirección
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Ej: Calle Mayor 123, 28001 Madrid, España"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Contacto de Emergencia (Opcional)
          </h2>

          {/* Emergency Contact Name */}
          <div className="mb-4">
            <label
              htmlFor="emergencyContactName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre del contacto de emergencia
            </label>
            <input
              type="text"
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(e) => handleChange('emergencyContactName', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Ej: Juan García"
              disabled={isSubmitting}
            />
          </div>

          {/* Emergency Contact Phone */}
          <div className="mb-4">
            <label
              htmlFor="emergencyContactPhone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Teléfono del contacto de emergencia
              {formData.emergencyContactName.trim() && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <input
              type="tel"
              id="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                fieldErrors.emergencyContactPhone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700'
              } bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400`}
              placeholder="Ej: +34 600 123 456"
              disabled={isSubmitting}
            />
            {fieldErrors.emergencyContactPhone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.emergencyContactPhone}
              </p>
            )}
          </div>

          {/* Emergency Contact Relationship */}
          <div>
            <label
              htmlFor="emergencyContactRelationship"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Relación con el paciente
            </label>
            <input
              type="text"
              id="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={(e) => handleChange('emergencyContactRelationship', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Ej: Cónyuge, Padre, Hermano/a"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Status Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Estado del Paciente
          </h2>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Estado
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'Active' | 'Inactive')}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              disabled={isSubmitting}
            >
              <option value="Active">Activo</option>
              <option value="Inactive">Inactivo</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Los pacientes inactivos permanecen en el sistema con todos sus datos accesibles
            </p>
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-sm text-red-800 dark:text-red-200">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => !isSubmitting && setShowConfirmDialog(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Confirmar Cambios
            </h2>

            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Está seguro de que desea guardar los cambios realizados en la información del paciente?
              </p>

              <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Nota:
                </p>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  Los cambios en la información del paciente no afectarán los datos clínicos existentes.
                </p>
              </div>

              {submitError && (
                <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                  <p className="text-sm text-red-800 dark:text-red-200">{submitError}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSubmitting}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isSubmitting ? 'Guardando...' : 'Confirmar y Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
