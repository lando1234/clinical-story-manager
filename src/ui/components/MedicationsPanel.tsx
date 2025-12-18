'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import type { ActiveMedication } from '@/types/ui';
import { AddMedicationForm } from './AddMedicationForm';
import { StopMedicationModal } from './StopMedicationModal';
import { ChangeMedicationModal } from './ChangeMedicationModal';

interface MedicationsPanelProps {
  medications: ActiveMedication[];
}

/**
 * Quick access panel showing active medications
 * UX: Accessible within one interaction from patient view
 * Per spec: docs/21_ajuste_dosis_medicamentos.md
 */
export function MedicationsPanel({ medications }: MedicationsPanelProps) {
  const params = useParams();
  const patientId = params.id as string;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [stopModalMedication, setStopModalMedication] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [changeModalMedication, setChangeModalMedication] = useState<{
    id: string;
    name: string;
    dosage: number;
    dosageUnit: string;
    frequency: string;
  } | null>(null);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
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
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Medicamentos Activos
            </h3>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-600"
            title="Agregar medicamento"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar
          </button>
        </div>

        {medications.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Sin medicamentos activos
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {medications.map((med) => (
              <li
                key={med.medication_identifier}
                className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {med.drug_name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {med.dosage} {med.dosage_unit}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {med.frequency}
                </div>
                <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Inicio {formatDate(med.start_date)}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      setChangeModalMedication({
                        id: med.medication_identifier,
                        name: med.drug_name,
                        dosage: med.dosage,
                        dosageUnit: med.dosage_unit,
                        frequency: med.frequency,
                      })
                    }
                    className="flex-1 rounded-md border border-yellow-300 bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
                    title="Ajustar dosis"
                  >
                    Ajustar dosis
                  </button>
                  <button
                    onClick={() =>
                      setStopModalMedication({
                        id: med.medication_identifier,
                        name: med.drug_name,
                      })
                    }
                    className="flex-1 rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                    title="Suspender"
                  >
                    Suspender
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <AddMedicationForm
        patientId={patientId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
      {stopModalMedication && (
        <StopMedicationModal
          patientId={patientId}
          medicationId={stopModalMedication.id}
          drugName={stopModalMedication.name}
          isOpen={true}
          onClose={() => setStopModalMedication(null)}
        />
      )}
      {changeModalMedication && (
        <ChangeMedicationModal
          patientId={patientId}
          medicationId={changeModalMedication.id}
          drugName={changeModalMedication.name}
          currentDosage={changeModalMedication.dosage}
          currentDosageUnit={changeModalMedication.dosageUnit}
          currentFrequency={changeModalMedication.frequency}
          isOpen={true}
          onClose={() => setChangeModalMedication(null)}
        />
      )}
    </>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
