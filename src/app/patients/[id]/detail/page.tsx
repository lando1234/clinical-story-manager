import { notFound } from 'next/navigation';
import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { PatientHeader } from '@/ui/components/PatientHeader';
import { PatientDetailView } from '@/ui/components/PatientDetailView';
import { fetchPatientForUI } from '@/data/patient-data';

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Patient Detail page - Read-only administrative view
 * Displays identifying and administrative fields only
 * Provides navigation to Edit and Timeline views
 */
export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;

  const patient = await fetchPatientForUI(id);

  if (!patient) {
    notFound();
  }

  return (
    <AppShell
      sidebar={<PatientSidebar selectedPatientId={id} />}
    >
      {/* Patient context header - always visible */}
      <PatientHeader patient={patient} />
      <div className="p-4 pt-16 lg:p-6 lg:pt-6">
        <PatientDetailView patientId={id} />
      </div>
    </AppShell>
  );
}
