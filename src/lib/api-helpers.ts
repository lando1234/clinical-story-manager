import { prisma } from './prisma';

/**
 * Resolves the clinical record ID for a patient.
 * Returns null if the patient doesn't exist or has no clinical record.
 *
 * @param patientId - The patient's unique identifier
 * @returns The clinical record ID or null
 */
export async function getClinicalRecordForPatient(
  patientId: string
): Promise<string | null> {
  const record = await prisma.clinicalRecord.findUnique({
    where: { patientId },
    select: { id: true },
  });
  return record?.id ?? null;
}
