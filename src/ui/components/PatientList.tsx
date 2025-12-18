'use client';

import Link from 'next/link';
import type { Patient } from '@/types/ui';
import { useSidebar } from './AppShell';

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
}

/**
 * List of patients with selection state
 * Shows patient name, age, and status
 * Handles edge cases: missing data, inactive patients, no selection
 */
export function PatientList({ patients, selectedPatientId }: PatientListProps) {
  const { setIsOpen } = useSidebar();

  if (patients.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No se encontraron pacientes
      </div>
    );
  }

  const handlePatientClick = () => {
    // Close sidebar on mobile when patient is selected
    setIsOpen(false);
  };

  return (
    <nav className="flex-1 overflow-y-auto">
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {patients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : null;
          const isInactive = patient.status === 'Inactive';
          
          return (
            <li key={patient.id}>
              <Link
                href={`/patients/${patient.id}`}
                onClick={handlePatientClick}
                className={`block px-4 py-3 transition-colors ${
                  isSelected
                    ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : isInactive
                    ? 'border-l-4 border-transparent hover:bg-gray-50/50 dark:hover:bg-gray-800/50 opacity-75'
                    : 'border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${
                      isSelected
                        ? 'text-gray-900 dark:text-gray-100'
                        : isInactive
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {patient.full_name || 'Sin nombre'}
                  </span>
                  <StatusBadge status={patient.status} />
                </div>
                {age !== null && (
                  <div
                    className={`mt-1 text-sm ${
                      isInactive
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {age} años
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function StatusBadge({ status }: { status: Patient['status'] }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
        Activo
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      Inactivo
    </span>
  );
}

/**
 * Calculate age from date of birth
 * Returns null if date is invalid
 */
function calculateAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) {
    return null;
  }

  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    // Validate date
    if (isNaN(birthDate.getTime())) {
      return null;
    }
    
    // Check if birth date is in the future
    if (birthDate > today) {
      return null;
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Ensure age is non-negative
    return age >= 0 ? age : null;
  } catch {
    return null;
  }
}
