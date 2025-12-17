import type { Patient } from '@/types/ui';

interface PatientHeaderProps {
  patient: Patient;
}

/**
 * Patient context header - always visible per UX constraints
 * Shows patient name, DOB, age, and key demographics
 */
export function PatientHeader({ patient }: PatientHeaderProps) {
  const age = calculateAge(patient.date_of_birth);
  const formattedDOB = formatDate(patient.date_of_birth);

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {patient.full_name}
          </h2>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>DOB: {formattedDOB}</span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>{age} years old</span>
            {patient.contact_phone && (
              <>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span>{patient.contact_phone}</span>
              </>
            )}
          </div>
        </div>
        <StatusIndicator status={patient.status} />
      </div>
    </header>
  );
}

function StatusIndicator({ status }: { status: Patient['status'] }) {
  if (status === 'Active') {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Active
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Inactive
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
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
