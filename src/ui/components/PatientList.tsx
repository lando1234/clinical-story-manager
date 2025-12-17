'use client';

import Link from 'next/link';
import type { Patient } from '@/types/ui';

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
}

/**
 * List of patients with selection state
 * Shows patient name, DOB, and status
 */
export function PatientList({ patients, selectedPatientId }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No patients found
      </div>
    );
  }

  return (
    <nav className="flex-1 overflow-y-auto">
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {patients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          const age = calculateAge(patient.date_of_birth);
          
          return (
            <li key={patient.id}>
              <Link
                href={`/patients/${patient.id}`}
                className={`block px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  isSelected
                    ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {patient.full_name}
                  </span>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {age} years old
                </div>
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
        Active
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      Inactive
    </span>
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
