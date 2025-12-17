import type { PatientStatus } from '../generated/prisma';

/**
 * Input for creating a new patient.
 * Only demographic fields - no clinical data.
 */
export interface CreatePatientInput {
  /** Patient's complete legal name (required) */
  fullName: string;
  /** Patient's birth date (required) */
  dateOfBirth: Date;
  /** Primary phone number */
  contactPhone?: string;
  /** Primary email address */
  contactEmail?: string;
  /** Residential address */
  address?: string;
  /** Emergency contact full name */
  emergencyContactName?: string;
  /** Emergency contact phone */
  emergencyContactPhone?: string;
  /** Relationship to patient */
  emergencyContactRelationship?: string;
}

/**
 * Input for searching patients.
 * All fields optional - at least one should be provided.
 */
export interface PatientSearchInput {
  /** Search by patient name (partial match, case-insensitive) */
  name?: string;
  /** Search by patient ID (exact match) */
  id?: string;
  /** Search by date of birth (exact match) */
  dateOfBirth?: Date;
}

/**
 * Input for updating a patient.
 * All fields optional - only provided fields will be updated.
 */
export interface UpdatePatientInput {
  /** Patient's complete legal name */
  fullName?: string;
  /** Patient's birth date */
  dateOfBirth?: Date;
  /** Primary phone number */
  contactPhone?: string | null;
  /** Primary email address */
  contactEmail?: string | null;
  /** Residential address */
  address?: string | null;
  /** Emergency contact full name */
  emergencyContactName?: string | null;
  /** Emergency contact phone */
  emergencyContactPhone?: string | null;
  /** Relationship to patient */
  emergencyContactRelationship?: string | null;
  /** Patient status (Active or Inactive) */
  status?: PatientStatus;
}

/**
 * Output representation of a patient.
 * Only demographic fields - no clinical relationships.
 */
export interface PatientOutput {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  contactPhone: string | null;
  contactEmail: string | null;
  address: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
  status: PatientStatus;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Result of a validation operation.
 */
export type ValidationResult =
  | { success: true }
  | { success: false; error: string };
