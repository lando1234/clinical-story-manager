import { AppShell } from '@/ui/components/AppShell';
import { PatientSidebar } from '@/ui/components/PatientSidebar';
import { PatientDetailView } from '@/ui/components/PatientDetailView';

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

  return (
    <AppShell
      sidebar={<PatientSidebar selectedPatientId={id} />}
    >
      <div className="p-6">
        <PatientDetailView patientId={id} />
      </div>
    </AppShell>
  );
}
