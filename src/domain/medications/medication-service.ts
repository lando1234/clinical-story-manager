import { prisma } from "@/lib/prisma";
import { Medication, MedicationStatus } from "@/generated/prisma";
import { Decimal } from "@/generated/prisma/runtime/library";
import {
  StartMedicationInput,
  ChangeMedicationInput,
  StopMedicationInput,
  validateStartMedicationInput,
  validateStopMedicationInput,
  getMedicationStartTitle,
  getMedicationChangeTitle,
  getMedicationStopTitle,
} from "@/types/medications";
import { DomainError, Result, ok, err } from "@/types/errors";
import {
  emitMedicationStartEvent,
  emitMedicationChangeEvent,
  emitMedicationStopEvent,
} from "@/domain/timeline/event-emitter";

/**
 * MedicationService - Manages medication lifecycle and timeline events.
 *
 * Implements:
 * - WRITE-EVENT-MEDICATION-START
 * - WRITE-EVENT-MEDICATION-CHANGE
 * - WRITE-EVENT-MEDICATION-STOP
 * - CORRECT-MEDICATION-DISCONTINUE
 *
 * Key principle: Medication changes are expressed as events.
 * Current state is NOT computed directly but derived from timeline.
 *
 * See: docs/14_timeline_contracts.md
 */

/**
 * Starts a new medication for a patient.
 *
 * Per WRITE-EVENT-MEDICATION-START contract:
 * - Trigger: A new Medication entity is created with status=Active.
 * - Validates: drugName not empty, dosage > 0, startDate not in future, prescribingReason not empty.
 * - Creates Medication Start event with proper title and description.
 */
export async function startMedication(
  input: StartMedicationInput
): Promise<Result<Medication>> {
  // Validate input
  const validation = validateStartMedicationInput(input);
  if (!validation.valid) {
    return err(
      new DomainError(
        "MISSING_REQUIRED_FIELDS",
        `Cannot start medication: ${validation.reasons.join("; ")}`,
        { reasons: validation.reasons }
      )
    );
  }

  // Verify clinical record exists
  const clinicalRecord = await prisma.clinicalRecord.findUnique({
    where: { id: input.clinicalRecordId },
  });

  if (!clinicalRecord) {
    return err(
      new DomainError(
        "CLINICAL_RECORD_NOT_FOUND",
        `Clinical record ${input.clinicalRecordId} not found`
      )
    );
  }

  // Create the medication
  const medication = await prisma.medication.create({
    data: {
      clinicalRecordId: input.clinicalRecordId,
      drugName: input.drugName,
      dosage: new Decimal(input.dosage),
      dosageUnit: input.dosageUnit,
      frequency: input.frequency,
      route: input.route,
      startDate: input.startDate,
      prescribingReason: input.prescribingReason,
      status: MedicationStatus.Active,
      // endDate, discontinuationReason, predecessorId remain null
      // createdAt is set automatically via @default(now())
    },
  });

  // Emit the Medication Start event
  const eventResult = await emitMedicationStartEvent({
    clinicalRecordId: input.clinicalRecordId,
    medicationId: medication.id,
    startDate: input.startDate,
    title: getMedicationStartTitle(
      input.drugName,
      input.dosage,
      input.dosageUnit
    ),
    description: input.prescribingReason,
  });

  if (!eventResult.success) {
    console.error("Failed to emit medication start event:", eventResult.error);
  }

  return ok(medication);
}

/**
 * Changes an existing medication (dosage/frequency adjustment).
 *
 * Per WRITE-EVENT-MEDICATION-CHANGE contract:
 * - Trigger: A new Medication entity is created with predecessor_id referencing a discontinued Medication.
 * - Validates: predecessor exists, belongs to same clinical record, newDosage valid.
 * - Discontinues predecessor with end_date = day before effective date.
 * - Creates new Medication with predecessor link.
 * - Emits Medication Change event for the new medication.
 */
export async function changeMedication(
  input: ChangeMedicationInput
): Promise<Result<Medication>> {
  // Find the current medication
  const currentMedication = await prisma.medication.findUnique({
    where: { id: input.medicationId },
  });

  if (!currentMedication) {
    return err(
      new DomainError(
        "MEDICATION_NOT_FOUND",
        `Medication ${input.medicationId} not found`
      )
    );
  }

  // Verify medication is active
  if (currentMedication.status !== MedicationStatus.Active) {
    return err(
      new DomainError(
        "MEDICATION_NOT_ACTIVE",
        "Cannot change a discontinued medication"
      )
    );
  }

  // Validate effective date
  if (input.effectiveDate > new Date()) {
    return err(
      new DomainError(
        "INVALID_TIMESTAMP_FUTURE",
        "Effective date cannot be in the future"
      )
    );
  }

  if (input.effectiveDate < currentMedication.startDate) {
    return err(
      new DomainError(
        "INVALID_DATE_RANGE",
        "Effective date cannot be before the original start date"
      )
    );
  }

  // Validate new dosage
  if (input.newDosage <= 0) {
    return err(
      new DomainError(
        "MISSING_REQUIRED_FIELDS",
        "New dosage must be a positive value"
      )
    );
  }

  // Calculate the end date for the current medication (day before effective date)
  const endDate = new Date(input.effectiveDate);
  endDate.setDate(endDate.getDate() - 1);

  // Use transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx) => {
    // Discontinue the current medication
    await tx.medication.update({
      where: { id: input.medicationId },
      data: {
        status: MedicationStatus.Discontinued,
        endDate: endDate,
        discontinuationReason: input.changeReason || "Dosage changed",
      },
    });

    // Create the new medication with predecessor link
    const newMedication = await tx.medication.create({
      data: {
        clinicalRecordId: currentMedication.clinicalRecordId,
        drugName: currentMedication.drugName,
        dosage: new Decimal(input.newDosage),
        dosageUnit: input.newDosageUnit ?? currentMedication.dosageUnit,
        frequency: input.newFrequency ?? currentMedication.frequency,
        route: input.newRoute ?? currentMedication.route,
        startDate: input.effectiveDate,
        prescribingReason: currentMedication.prescribingReason,
        status: MedicationStatus.Active,
        predecessorId: currentMedication.id,
      },
    });

    return newMedication;
  });

  // Emit the Medication Change event
  const eventResult = await emitMedicationChangeEvent({
    clinicalRecordId: currentMedication.clinicalRecordId,
    medicationId: result.id,
    effectiveDate: input.effectiveDate,
    title: getMedicationChangeTitle(
      currentMedication.drugName,
      currentMedication.dosage,
      currentMedication.dosageUnit,
      input.newDosage,
      input.newDosageUnit ?? currentMedication.dosageUnit
    ),
    description: input.changeReason,
  });

  if (!eventResult.success) {
    console.error("Failed to emit medication change event:", eventResult.error);
  }

  return ok(result);
}

/**
 * Stops a medication.
 *
 * Per WRITE-EVENT-MEDICATION-STOP contract:
 * - Trigger: A Medication entity transitions from status=Active to status=Discontinued.
 * - Validates: endDate >= startDate, discontinuationReason not empty.
 * - Sets status = Discontinued, endDate, discontinuationReason.
 * - Emits Medication Stop event.
 */
export async function stopMedication(
  input: StopMedicationInput
): Promise<Result<Medication>> {
  // Find the medication
  const medication = await prisma.medication.findUnique({
    where: { id: input.medicationId },
  });

  if (!medication) {
    return err(
      new DomainError(
        "MEDICATION_NOT_FOUND",
        `Medication ${input.medicationId} not found`
      )
    );
  }

  // Verify medication is active
  if (medication.status !== MedicationStatus.Active) {
    return err(
      new DomainError(
        "MEDICATION_ALREADY_DISCONTINUED",
        "Medication is already discontinued"
      )
    );
  }

  // Validate stop input
  const validation = validateStopMedicationInput(input, {
    startDate: medication.startDate,
  });
  if (!validation.valid) {
    return err(
      new DomainError(
        "MISSING_REQUIRED_FIELDS",
        `Cannot stop medication: ${validation.reasons.join("; ")}`,
        { reasons: validation.reasons }
      )
    );
  }

  // Discontinue the medication
  const discontinuedMedication = await prisma.medication.update({
    where: { id: input.medicationId },
    data: {
      status: MedicationStatus.Discontinued,
      endDate: input.endDate,
      discontinuationReason: input.discontinuationReason,
    },
  });

  // Emit the Medication Stop event
  const eventResult = await emitMedicationStopEvent({
    clinicalRecordId: medication.clinicalRecordId,
    medicationId: medication.id,
    endDate: input.endDate,
    title: getMedicationStopTitle(medication.drugName),
    description: input.discontinuationReason,
  });

  if (!eventResult.success) {
    console.error("Failed to emit medication stop event:", eventResult.error);
  }

  return ok(discontinuedMedication);
}

/**
 * Retrieves a medication by ID with its predecessor chain.
 */
export async function getMedicationWithHistory(medicationId: string): Promise<
  Result<
    Medication & {
      predecessor: Medication | null;
      successors: Medication[];
    }
  >
> {
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
    include: {
      predecessor: true,
      successors: {
        orderBy: { startDate: "asc" },
      },
    },
  });

  if (!medication) {
    return err(
      new DomainError(
        "MEDICATION_NOT_FOUND",
        `Medication ${medicationId} not found`
      )
    );
  }

  return ok(medication);
}

/**
 * Retrieves all medications for a clinical record.
 * Returns both active and discontinued medications.
 */
export async function getMedicationsForClinicalRecord(
  clinicalRecordId: string
): Promise<Result<Medication[]>> {
  // Verify clinical record exists
  const clinicalRecord = await prisma.clinicalRecord.findUnique({
    where: { id: clinicalRecordId },
  });

  if (!clinicalRecord) {
    return err(
      new DomainError(
        "CLINICAL_RECORD_NOT_FOUND",
        `Clinical record ${clinicalRecordId} not found`
      )
    );
  }

  const medications = await prisma.medication.findMany({
    where: { clinicalRecordId },
    orderBy: { startDate: "desc" },
  });

  return ok(medications);
}

/**
 * Corrects an erroneous medication by discontinuing it with explanation.
 *
 * Per CORRECT-MEDICATION-DISCONTINUE contract:
 * - Discontinues medication with reason indicating error.
 * - Emits Medication Stop event with error explanation.
 *
 * This is used when a medication was documented in error.
 */
export async function correctMedicationError(
  medicationId: string,
  errorReason: string
): Promise<Result<Medication>> {
  return stopMedication({
    medicationId,
    endDate: new Date(),
    discontinuationReason: `Documented in error: ${errorReason}`,
  });
}
