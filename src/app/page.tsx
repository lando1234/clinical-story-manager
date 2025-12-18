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
      <div className="p-4 pt-16 lg:p-6 lg:pt-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">
              Vista General
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Información operativa y estadísticas del consultorio
            </p>
          </div>

          {/* Responsive layout: stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
            {/* Upcoming Appointments - Priority 2 (shown first on mobile per spec) */}
            <div className="order-1 lg:order-2">
              <UpcomingAppointments />
            </div>

            {/* Patient Statistics - Priority 3 (shown second on mobile per spec) */}
            <div className="order-2 lg:order-1">
              <PatientStats />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
