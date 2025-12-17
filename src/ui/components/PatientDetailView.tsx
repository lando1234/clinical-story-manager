'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { PatientOutput } from '@/types/patient';

interface PatientDetailViewProps {
  patientId: string;
}

type LoadingState = 'loading' | 'success' | 'not-found' | 'error';

/**
 * Patient Detail View - Read-only administrative view
 * Displays identifying and administrative fields only
 * Provides navigation to Edit and Timeline views
 */
export function PatientDetailView({ patientId }: PatientDetailViewProps) {
  const [patient, setPatient] = useState<PatientOutput | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoadingState('loading');
        setError(null);

        const response = await fetch(`/api/patients/${patientId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setLoadingState('not-found');
            return;
          }
          throw new Error('Error al cargar los datos del paciente');
        }

        const data: PatientOutput = await response.json();
        setPatient(data);
        setLoadingState('success');
      } catch (err) {
        setLoadingState('error');
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al cargar los datos del paciente'
        );
      }
    };

    fetchPatient();
  }, [patientId]);

  // Loading state
  if (loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Cargando información del paciente...
          </p>
        </div>
      </div>
    );
  }

  // Not found state
  if (loadingState === 'not-found') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Paciente no encontrado
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No se encontró un paciente con el identificador proporcionado.
          </p>
          <Link
            href="/patients"
            className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Volver a la lista de pacientes
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState === 'error') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-400 dark:text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Error al cargar paciente
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {error || 'Ocurrió un error al cargar los datos del paciente.'}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Reintentar
            </button>
            <Link
              href="/patients"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Volver a la lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state - display patient data
  if (!patient) {
    return null;
  }

  const formattedDOB = formatDate(patient.dateOfBirth);
  const formattedRegistrationDate = formatDateTime(patient.registrationDate);
  const formattedCreatedAt = formatDateTime(patient.createdAt);
  const formattedUpdatedAt = formatDateTime(patient.updatedAt);
  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header with navigation actions */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Información del Paciente
        </h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/patients/${patientId}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Editar Paciente
          </Link>
          <Link
            href={`/patients/${patientId}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Ver Línea de Tiempo
          </Link>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="space-y-6">
        {/* Identifying Information Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Información de Identificación
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Identificador
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {patient.id}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nombre Completo
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {patient.fullName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fecha de Nacimiento
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formattedDOB} ({age} años)
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Estado
              </dt>
              <dd className="mt-1">
                <StatusBadge status={patient.status} />
              </dd>
            </div>
          </dl>
        </section>

        {/* Administrative Information Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Información Administrativa
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Teléfono de Contacto
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {patient.contactPhone || (
                  <span className="text-gray-400 dark:text-gray-500">
                    No proporcionado
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Correo Electrónico
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {patient.contactEmail || (
                  <span className="text-gray-400 dark:text-gray-500">
                    No proporcionado
                  </span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Dirección
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {patient.address || (
                  <span className="text-gray-400 dark:text-gray-500">
                    No proporcionado
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Emergency Contact Section */}
        {(patient.emergencyContactName ||
          patient.emergencyContactPhone ||
          patient.emergencyContactRelationship) && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contacto de Emergencia
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {patient.emergencyContactName && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nombre
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {patient.emergencyContactName}
                  </dd>
                </div>
              )}
              {patient.emergencyContactPhone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Teléfono
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {patient.emergencyContactPhone}
                  </dd>
                </div>
              )}
              {patient.emergencyContactRelationship && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Relación
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {patient.emergencyContactRelationship}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {/* System Information Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Información del Sistema
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fecha de Registro
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formattedRegistrationDate}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Creado el
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formattedCreatedAt}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Actualizado el
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {formattedUpdatedAt}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'Active' | 'Inactive' }) {
  if (status === 'Active') {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Activo
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Inactivo
      </span>
    </div>
  );
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(date: Date): string {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
