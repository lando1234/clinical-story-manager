import { redirect } from 'next/navigation';
import { fetchAllPatientsForUI } from '@/data/patient-data';

/**
 * Home page - redirects to first patient per timeline-first UX
 * If no patients exist, shows patient selection prompt
 */
export default async function Home() {
  // Fetch all patients from the database
  const patients = await fetchAllPatientsForUI();

  // If there are patients, redirect to the first one (timeline-first UX)
  if (patients.length > 0) {
    redirect(`/patients/${patients[0].id}`);
  }

  // No patients - show empty state with patient selection
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <main className="text-center">
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
        <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Historiales Psiquiátricos
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          No hay pacientes registrados. Agregue un paciente para comenzar.
        </p>
      </main>
    </div>
  );
}
