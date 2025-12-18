import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { PatientStats } from '@/ui/components/PatientStats';
import { UpcomingAppointments } from '@/ui/components/UpcomingAppointments';
import { fetchAllPatientsForUI } from '@/data/patient-data';

/**
 * Root page - shows patient list in sidebar and operational statistics in main area
 * Per spec: docs/25_root_behavior_spec.md
 */
export default async function Home() {
  const allPatients = await fetchAllPatientsForUI();

  return (
    <AppShell
      sidebar={<PatientSidebar patients={allPatients} selectedPatientId={null} />}
    >
      <div className="p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Vista General
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Información operativa y estadísticas del consultorio
            </p>
          </div>

          {/* Patient Statistics */}
          <PatientStats />

          {/* Upcoming Appointments */}
          <UpcomingAppointments />
        </div>
      </div>
    </AppShell>
  );
}
