import { Prisma } from "@/generated/prisma";

/**
 * Input for starting a new medication.
 */
export interface StartMedicationInput {
  clinicalRecordId: string;
  drugName: string;
  dosage: number;
  dosageUnit: string;
  frequency: string;
  prescriptionIssueDate: Date;
  comments?: string;
}

/**
 * Input for changing an existing medication (dosage/frequency adjustment).
 * Per spec: changeReason is optional.
 */
export interface ChangeMedicationInput {
  medicationId: string;
  newDosage: number;
  newDosageUnit?: string;
  newFrequency?: string;
  effectiveDate: Date;
  changeReason?: string;
}

/**
 * Input for stopping a medication.
 * Per spec: discontinuationReason is optional.
 */
export interface StopMedicationInput {
  medicationId: string;
  endDate: Date;
  discontinuationReason?: string;
}

/**
 * Input for issuing a new prescription for an active medication.
 * Per spec: comments is optional.
 */
export interface IssuePrescriptionInput {
  medicationId: string;
  prescriptionIssueDate: Date;
  comments?: string;
}

/**
 * Validates medication start input.
 */
export function validateStartMedicationInput(
  input: StartMedicationInput
): { valid: true } | { valid: false; reasons: string[] } {
  const reasons: string[] = [];

  if (!input.drugName || input.drugName.trim() === "") {
    reasons.push("Drug name is required");
  }
  if (input.dosage <= 0) {
    reasons.push("Dosage must be a positive value");
  }
  if (!input.dosageUnit || input.dosageUnit.trim() === "") {
    reasons.push("Dosage unit is required");
  }
  if (!input.frequency || input.frequency.trim() === "") {
    reasons.push("Frequency is required");
  }
  if (input.prescriptionIssueDate > new Date()) {
    reasons.push("Prescription issue date cannot be in the future");
  }
  // comments is optional per spec - no validation needed

  if (reasons.length === 0) {
    return { valid: true };
  }
  return { valid: false, reasons };
}

/**
 * Validates medication stop input.
 * Per spec: discontinuationReason is optional.
 */
export function validateStopMedicationInput(
  input: StopMedicationInput,
  medication: { prescriptionIssueDate: Date }
): { valid: true } | { valid: false; reasons: string[] } {
  const reasons: string[] = [];

  if (input.endDate > new Date()) {
    reasons.push("End date cannot be in the future");
  }
  if (input.endDate < medication.prescriptionIssueDate) {
    reasons.push("End date cannot be before prescription issue date");
  }
  // discontinuationReason is optional per spec - removed validation

  if (reasons.length === 0) {
    return { valid: true };
  }
  return { valid: false, reasons };
}

/**
 * Generates medication start event title.
 */
export function getMedicationStartTitle(
  drugName: string,
  dosage: number | Prisma.Decimal,
  dosageUnit: string
): string {
  return `Started ${drugName} ${dosage}${dosageUnit}`;
}

/**
 * Generates medication change event title.
 */
export function getMedicationChangeTitle(
  drugName: string,
  oldDosage: number | Prisma.Decimal,
  oldDosageUnit: string,
  newDosage: number | Prisma.Decimal,
  newDosageUnit: string
): string {
  return `Changed ${drugName} from ${oldDosage}${oldDosageUnit} to ${newDosage}${newDosageUnit}`;
}

/**
 * Generates medication stop event title.
 */
export function getMedicationStopTitle(drugName: string): string {
  return `Stopped ${drugName}`;
}

/**
 * Generates medication prescription issued event title.
 */
export function getMedicationPrescriptionIssuedTitle(
  drugName: string,
  dosage: number | Prisma.Decimal,
  dosageUnit: string
): string {
  return `Nueva receta emitida: ${drugName} ${dosage}${dosageUnit}`;
}
