'use client';

import { useState, useMemo } from 'react';
import type { Patient } from '@/types/ui';
import { PatientSearch } from './PatientSearch';
import { PatientList } from './PatientList';

interface PatientSidebarProps {
  patients: Patient[];
  selectedPatientId: string | null;
}

/**
 * Sidebar containing patient search and list
 * Handles search filtering internally
 */
export function PatientSidebar({ patients, selectedPatientId }: PatientSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) {
      return patients;
    }
    
    const query = searchQuery.toLowerCase();
    return patients.filter((patient) =>
      patient.full_name.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Patients
        </h1>
      </div>

      {/* Search */}
      <PatientSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Patient list */}
      <PatientList patients={filteredPatients} selectedPatientId={selectedPatientId} />

      {/* Footer with count */}
      <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        {filteredPatients.length} of {patients.length} patients
      </div>
    </div>
  );
}
