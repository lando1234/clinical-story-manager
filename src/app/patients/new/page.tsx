import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { CreatePatientForm } from '@/ui/components/CreatePatientForm';
import { fetchAllPatientsForUI } from '@/data/patient-data';

/**
 * Create Patient page
 * Allows creating a new patient with all required and optional fields
 */
export default async function CreatePatientPage() {
  const allPatients = await fetchAllPatientsForUI();

  return (
    <AppShell
      sidebar={<PatientSidebar selectedPatientId={null} />}
    >
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Crear Nuevo Paciente
          </h1>
          <CreatePatientForm />
        </div>
      </div>
    </AppShell>
  );
}
