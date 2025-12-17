import type { ActiveMedication } from '@/types/ui';

interface MedicationsPanelProps {
  medications: ActiveMedication[];
}

/**
 * Quick access panel showing active medications
 * UX: Accessible within one interaction from patient view
 */
export function MedicationsPanel({ medications }: MedicationsPanelProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
