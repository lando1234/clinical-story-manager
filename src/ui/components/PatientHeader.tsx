'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Patient } from '@/types/ui';
import { DeactivatePatientDialog } from './DeactivatePatientDialog';

interface PatientHeaderProps {
  patient: Patient;
}

/**
 * Patient context header - always visible per UX constraints
 * Shows patient identity information as persistent context (not part of timeline)
 * Per spec: docs/25_patient_info_timeline_view.md
 * 
 * Displays:
 * - Full name
 * - Age (calculated from date of birth)
 * - Date of birth
 * - Status (Active/Inactive)
 * - Internal identifier
 * 
 * Note: Contact information is excluded per spec (not relevant for clinical context)
 */
export function PatientHeader({ patient }: PatientHeaderProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const age = calculateAge(patient.date_of_birth);
  const formattedDOB = formatDate(patient.date_of_birth);

  const handleDeactivate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Inactive',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || 'No se pudo desactivar el paciente'
        );
      }

      setSuccessMessage('Paciente desactivado exitosamente');
      setIsDialogOpen(false);

      // Redirect away from archived patient page after a brief delay
      // This ensures the user sees the success message before redirect
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al desactivar el paciente'
      );
      throw err; // Re-throw so dialog can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Active',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || 'No se pudo reactivar el paciente'
        );
      }

      setSuccessMessage('Paciente reactivado exitosamente');

      // Refresh the page to show updated status
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al reactivar el paciente'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 lg:text-xl">
              {patient.full_name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 lg:gap-4 lg:text-sm">
              <span>Fecha nac.: {formattedDOB}</span>
              <span className="hidden text-gray-300 dark:text-gray-700 lg:inline">|</span>
              <span>{age} años</span>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <StatusIndicator status={patient.status} />
            {patient.status === 'Active' ? (
              <button
                onClick={() => setIsDialogOpen(true)}
                disabled={isLoading}
                className="rounded-md bg-red-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600 lg:px-3 lg:text-sm"
              >
                Desactivar
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                disabled={isLoading}
                className="rounded-md bg-green-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600 lg:px-3 lg:text-sm"
              >
                {isLoading ? 'Reactivando...' : 'Reactivar'}
              </button>
            )}
          </div>
        </div>

        {/* Success/Error messages */}
        {successMessage && (
          <div className="mt-3 rounded-md bg-green-50 p-2 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              {successMessage}
            </p>
          </div>
        )}
        {error && (
          <div className="mt-3 rounded-md bg-red-50 p-2 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </header>

      <DeactivatePatientDialog
        patient={patient}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeactivate}
      />
    </>
  );
}

function StatusIndicator({ status }: { status: Patient['status'] }) {
  if (status === 'Active') {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Activo
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Inactivo
      </span>
    </div>
  );
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // Format: "DD de [mes] de YYYY" per spec 25_patient_info_timeline_view.md
  const day = date.getDate();
  const month = date.toLocaleDateString('es-AR', { month: 'long' });
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}
