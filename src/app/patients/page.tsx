import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { fetchAllPatientsForUI } from '@/data/patient-data';

/**
 * Patients list page - primary view of the system
 * Shows patient list in sidebar and prompts user to select a patient
 */
export default async function PatientsPage() {
  const allPatients = await fetchAllPatientsForUI();

  return (
    <AppShell
      sidebar={<PatientSidebar patients={allPatients} selectedPatientId={null} />}
    >
      <div className="flex min-h-screen items-center justify-center p-4 pt-16 lg:p-6 lg:pt-6">
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
          <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Lista de Pacientes
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Seleccione un paciente de la lista para acceder a su registro clínico.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
