import { notFound } from 'next/navigation';
import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { UpdatePatientForm } from '@/ui/components/UpdatePatientForm';
import { fetchAllPatientsForUI, fetchPatientForUI } from '@/data/patient-data';

interface EditPatientPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Edit Patient page
 * Allows updating patient demographic and administrative information
 * Shows immutable fields as read-only
 */
export default async function EditPatientPage({ params }: EditPatientPageProps) {
  const { id } = await params;

  // Fetch patient and all patients in parallel
  const [patient, allPatients] = await Promise.all([
    fetchPatientForUI(id),
    fetchAllPatientsForUI(),
  ]);

  if (!patient) {
    notFound();
  }

  return (
    <AppShell
      sidebar={<PatientSidebar patients={allPatients} selectedPatientId={id} />}
    >
      <div className="p-4 pt-16 lg:p-6 lg:pt-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Editar Información del Paciente
          </h1>
          <UpdatePatientForm patientId={id} />
        </div>
      </div>
    </AppShell>
  );
}
