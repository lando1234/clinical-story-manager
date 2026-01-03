import { prisma } from "@/lib/prisma";
import { Medication, MedicationStatus, ClinicalEvent, Prisma } from "@/generated/prisma";
import {
  StartMedicationInput,
  ChangeMedicationInput,
  StopMedicationInput,
  IssuePrescriptionInput,
  validateStartMedicationInput,
  validateStopMedicationInput,
  getMedicationStartTitle,
  getMedicationChangeTitle,
  getMedicationStopTitle,
  getMedicationPrescriptionIssuedTitle,
} from "@/types/medications";
import { DomainError, Result, ok, err } from "@/types/errors";
import {
  emitMedicationStartEvent,
  emitMedicationChangeEvent,
  emitMedicationStopEvent,
  emitMedicationPrescriptionIssuedEvent,
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
 * - Validates: drugName not empty, dosage > 0, prescriptionIssueDate not in future.
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
      dosage: new Prisma.Decimal(input.dosage),
      dosageUnit: input.dosageUnit,
      frequency: input.frequency,
      prescriptionIssueDate: input.prescriptionIssueDate,
      comments: input.comments,
      status: MedicationStatus.Active,
      // endDate, discontinuationReason, predecessorId remain null
      // createdAt is set automatically via @default(now())
    },
  });

  // Emit the Medication Start event
  const eventResult = await emitMedicationStartEvent({
    clinicalRecordId: input.clinicalRecordId,
    medicationId: medication.id,
    prescriptionIssueDate: input.prescriptionIssueDate,
    title: getMedicationStartTitle(
      input.drugName,
      input.dosage,
      input.dosageUnit
    ),
    description: input.comments,
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

  if (input.effectiveDate < currentMedication.prescriptionIssueDate) {
    return err(
      new DomainError(
        "INVALID_DATE_RANGE",
        "Effective date cannot be before the original prescription issue date"
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
    // Per spec: changeReason is optional
    const reason = input.changeReason?.trim() || 'Ajuste de dosis';
    
    await tx.medication.update({
      where: { id: input.medicationId },
      data: {
        status: MedicationStatus.Discontinued,
        endDate: endDate,
        discontinuationReason: reason,
      },
    });

    // Create the new medication with predecessor link
    const newMedication = await tx.medication.create({
      data: {
        clinicalRecordId: currentMedication.clinicalRecordId,
        drugName: currentMedication.drugName,
        dosage: new Prisma.Decimal(input.newDosage),
        dosageUnit: input.newDosageUnit ?? currentMedication.dosageUnit,
        frequency: input.newFrequency ?? currentMedication.frequency,
        prescriptionIssueDate: input.effectiveDate,
        comments: currentMedication.comments,
        status: MedicationStatus.Active,
        predecessorId: currentMedication.id,
      },
    });

    return newMedication;
  });

  // Emit the Medication Change event
  // Per spec: changeReason is optional
  const reason = input.changeReason?.trim() || 'Ajuste de dosis';
  
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
    description: reason,
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
 * - Validates: endDate >= prescriptionIssueDate, discontinuationReason not empty.
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
    prescriptionIssueDate: medication.prescriptionIssueDate,
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
  // Per spec: discontinuationReason is optional, use default if not provided
  const reason = input.discontinuationReason?.trim() || 'Suspensión de medicamento';
  
  const discontinuedMedication = await prisma.medication.update({
    where: { id: input.medicationId },
    data: {
      status: MedicationStatus.Discontinued,
      endDate: input.endDate,
      discontinuationReason: reason,
    },
  });

  // Emit the Medication Stop event
  const eventResult = await emitMedicationStopEvent({
    clinicalRecordId: medication.clinicalRecordId,
    medicationId: medication.id,
    endDate: input.endDate,
    title: getMedicationStopTitle(medication.drugName),
    description: reason,
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
        orderBy: { prescriptionIssueDate: "asc" },
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
    orderBy: { prescriptionIssueDate: "desc" },
  });

  return ok(medications);
}

/**
 * Issues a new prescription for an active medication.
 *
 * Per WRITE-EVENT-MEDICATION-PRESCRIPTION-ISSUED contract:
 * - Trigger: A new prescription is issued for an active medication without modifying parameters.
 * - Validates: medication is active, prescriptionIssueDate is after original prescriptionIssueDate, not in future.
 * - Creates MedicationPrescriptionIssued event.
 * - Does NOT modify the Medication entity.
 */
export async function issuePrescription(
  input: IssuePrescriptionInput
): Promise<Result<ClinicalEvent>> {
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
        "MEDICATION_NOT_ACTIVE_CANNOT_ISSUE_PRESCRIPTION",
        "Cannot issue prescription for a discontinued medication"
      )
    );
  }

  // Validate prescription issue date
  if (input.prescriptionIssueDate > new Date()) {
    return err(
      new DomainError(
        "INVALID_TIMESTAMP_FUTURE",
        "Prescription issue date cannot be in the future"
      )
    );
  }

  // Validate that new prescription date is after original prescription issue date
  if (input.prescriptionIssueDate <= medication.prescriptionIssueDate) {
    return err(
      new DomainError(
        "INVALID_PRESCRIPTION_DATE_MUST_BE_AFTER_FIRST",
        "New prescription date must be after the original prescription issue date"
      )
    );
  }

  // Emit the Medication Prescription Issued event
  const eventResult = await emitMedicationPrescriptionIssuedEvent({
    clinicalRecordId: medication.clinicalRecordId,
    medicationId: medication.id,
    prescriptionIssueDate: input.prescriptionIssueDate,
    title: getMedicationPrescriptionIssuedTitle(
      medication.drugName,
      medication.dosage,
      medication.dosageUnit
    ),
    description: input.comments,
  });

  if (!eventResult.success) {
    return err(eventResult.error);
  }

  return ok(eventResult.data);
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
