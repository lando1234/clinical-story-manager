'use client';

import type { Patient } from '@/types/ui';

interface PatientInfoPanelProps {
  patient: Patient;
}

/**
 * Patient information panel - shows administrative and emergency contact information
 * Located below medication, appointment, and notes panels
 * Per spec: docs/25_patient_info_timeline_view.md
 */
export function PatientInfoPanel({ patient }: PatientInfoPanelProps) {
  const hasEmergencyContact =
    patient.emergency_contact_name ||
    patient.emergency_contact_phone ||
    patient.emergency_contact_relationship;

  const hasContactInfo =
    patient.contact_phone || patient.contact_email || patient.address;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
        Información del Paciente
      </h3>

      <div className="space-y-4">
        {/* Internal Identifier */}
        <div>
          <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Identificador Interno
          </dt>
          <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-gray-100">
            {patient.id}
          </dd>
        </div>

        {/* Contact Information */}
        {hasContactInfo && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Datos de Contacto
            </h4>
            <dl className="space-y-2">
              {patient.contact_phone && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Teléfono
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">
                    {patient.contact_phone}
                  </dd>
                </div>
              )}
              {patient.contact_email && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">
                    {patient.contact_email}
                  </dd>
                </div>
              )}
              {patient.address && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Dirección
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">
                    {patient.address}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Emergency Contact */}
        {hasEmergencyContact && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Contacto de Emergencia
            </h4>
            <dl className="space-y-2">
              {patient.emergency_contact_name && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Nombre
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">
                    {patient.emergency_contact_name}
                  </dd>
                </div>
              )}
              {patient.emergency_contact_phone && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Teléfono
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">
                    {patient.emergency_contact_phone}
                  </dd>
                </div>
              )}
              {patient.emergency_contact_relationship && (
                <div>
                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Relación
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-900 dark:text-gray-100">
                    {patient.emergency_contact_relationship}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
