import { notFound } from 'next/navigation';
import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { PatientHeader } from '@/ui/components/PatientHeader';
import { Timeline } from '@/ui/components/Timeline';
import { MedicationsPanel } from '@/ui/components/MedicationsPanel';
import { AppointmentsPanel } from '@/ui/components/AppointmentsPanel';
import { NotesPanel } from '@/ui/components/NotesPanel';
import { PatientInfoPanel } from '@/ui/components/PatientInfoPanel';
import {
  fetchPatientForUI,
  fetchAllPatientsForUI,
  fetchTimelineForUI,
  fetchActiveMedicationsForUI,
  fetchNextAppointmentForUI,
  fetchMostRecentNoteForUI,
} from '@/data/patient-data';

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Patient timeline page - primary view per UX constraints
 * Shows timeline as main content with quick access panels
 */
export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;

  // Fetch all data in parallel for better performance
  const [patient, allPatients, events, medications, nextAppointment, mostRecentNote] =
    await Promise.all([
      fetchPatientForUI(id),
      fetchAllPatientsForUI(),
      fetchTimelineForUI(id),
      fetchActiveMedicationsForUI(id),
      fetchNextAppointmentForUI(id),
      fetchMostRecentNoteForUI(id),
    ]);

  if (!patient) {
    notFound();
  }

  return (
    <AppShell
      sidebar={
        <PatientSidebar patients={allPatients} selectedPatientId={id} />
      }
    >
      {/* Patient context header - always visible */}
      <PatientHeader patient={patient} />

      {/* Main content grid */}
      <div className="p-4 pt-16 lg:p-6 lg:pt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Timeline - primary content (2/3 width on large screens) */}
          <div className="order-1 lg:col-span-2 lg:order-1">
            <Timeline events={events} />
          </div>

          {/* Quick access panels (1/3 width on large screens, stacked on mobile) */}
          <div className="order-2 space-y-6 lg:order-2">
            <MedicationsPanel medications={medications} />
            <AppointmentsPanel nextAppointment={nextAppointment} />
            <NotesPanel mostRecentNote={mostRecentNote} />
            <PatientInfoPanel patient={patient} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
