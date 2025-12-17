import { notFound } from 'next/navigation';
import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { PatientHeader } from '@/ui/components/PatientHeader';
import { Timeline } from '@/ui/components/Timeline';
import { MedicationsPanel } from '@/ui/components/MedicationsPanel';
import { AppointmentsPanel } from '@/ui/components/AppointmentsPanel';
import { NotesPanel } from '@/ui/components/NotesPanel';
import {
  mockPatients,
  getPatientById,
  getTimelineForPatient,
  getMedicationsForPatient,
  getNextAppointment,
  getMostRecentNote,
} from '@/data/mock';

interface PatientPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Patient timeline page - primary view per UX constraints
 * Shows timeline as main content with quick access panels
 */
export default async function PatientPage({ params }: PatientPageProps) {
  const { id } = await params;
  const patient = getPatientById(id);

  if (!patient) {
    notFound();
  }

  // Get all data for this patient
  const events = getTimelineForPatient(id);
  const medications = getMedicationsForPatient(id);
  const nextAppointment = getNextAppointment(id);
  const mostRecentNote = getMostRecentNote(id);

  return (
    <AppShell
      sidebar={
        <PatientSidebar patients={mockPatients} selectedPatientId={id} />
      }
    >
      {/* Patient context header - always visible */}
      <PatientHeader patient={patient} />

      {/* Main content grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Timeline - primary content (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <Timeline events={events} />
          </div>

          {/* Quick access panels (1/3 width on large screens) */}
          <div className="space-y-6">
            <MedicationsPanel medications={medications} />
            <AppointmentsPanel nextAppointment={nextAppointment} />
            <NotesPanel mostRecentNote={mostRecentNote} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
