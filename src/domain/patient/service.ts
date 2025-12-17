import { PatientRepository } from '../../data/patient/repository';
import { prisma } from '../../lib/prisma';
import type {
  CreatePatientInput,
  PatientOutput,
  PatientSearchInput,
  UpdatePatientInput,
  ValidationResult,
} from '../../types/patient';
import type { Patient } from '../../generated/prisma';

/**
 * Validation errors for patient operations.
 */
export class PatientValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PatientValidationError';
  }
}

/**
 * Error when patient is not found.
 */
export class PatientNotFoundError extends Error {
  constructor(id: string) {
    super(`Patient not found: ${id}`);
    this.name = 'PatientNotFoundError';
  }
}

/**
 * Convert a Prisma Patient entity to PatientOutput DTO.
 * Excludes clinical relationships per integration rules.
 */
function toPatientOutput(patient: Patient): PatientOutput {
  return {
    id: patient.id,
    fullName: patient.fullName,
    dateOfBirth: patient.dateOfBirth,
    contactPhone: patient.contactPhone,
    contactEmail: patient.contactEmail,
    address: patient.address,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,
    emergencyContactRelationship: patient.emergencyContactRelationship,
    status: patient.status,
    registrationDate: patient.registrationDate,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
}

/**
 * Validate email format.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (basic validation - allows digits, spaces, dashes, parentheses, plus).
 */
function isValidPhone(phone: string): boolean {
  // Remove common formatting characters and check if remaining are digits
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return /^\d+$/.test(cleaned) && cleaned.length >= 7 && cleaned.length <= 15;
}

/**
 * Validate input for creating a patient.
 */
function validateCreateInput(input: CreatePatientInput): ValidationResult {
  // fullName must be non-empty
  if (!input.fullName || input.fullName.trim().length === 0) {
    return { success: false, error: 'Full name is required' };
  }

  // dateOfBirth must be a valid date
  if (!input.dateOfBirth || !(input.dateOfBirth instanceof Date) || isNaN(input.dateOfBirth.getTime())) {
    return { success: false, error: 'Date of birth must be a valid date' };
  }

  // dateOfBirth must not be in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dob = new Date(input.dateOfBirth);
  dob.setHours(0, 0, 0, 0);
  
  if (dob > today) {
    return { success: false, error: 'Date of birth cannot be in the future' };
  }

  // Contact email validation
  if (input.contactEmail !== undefined && input.contactEmail !== null && input.contactEmail.trim().length > 0) {
    if (!isValidEmail(input.contactEmail)) {
      return { success: false, error: 'Invalid email format' };
    }
  }

  // Contact phone validation
  if (input.contactPhone !== undefined && input.contactPhone !== null && input.contactPhone.trim().length > 0) {
    if (!isValidPhone(input.contactPhone)) {
      return { success: false, error: 'Invalid phone format' };
    }
  }

  // Emergency contact validation: if name is provided, phone is required
  if (input.emergencyContactName !== undefined && input.emergencyContactName !== null && input.emergencyContactName.trim().length > 0) {
    if (!input.emergencyContactPhone || input.emergencyContactPhone.trim().length === 0) {
      return { success: false, error: 'Emergency contact phone is required when emergency contact name is provided' };
    }
  }

  // Emergency contact phone validation
  if (input.emergencyContactPhone !== undefined && input.emergencyContactPhone !== null && input.emergencyContactPhone.trim().length > 0) {
    if (!isValidPhone(input.emergencyContactPhone)) {
      return { success: false, error: 'Invalid phone format' };
    }
  }

  return { success: true };
}

/**
 * Validate input for updating a patient.
 */
function validateUpdateInput(input: UpdatePatientInput): ValidationResult {
  // If fullName is being updated, it must be non-empty
  if (input.fullName !== undefined && (!input.fullName || input.fullName.trim().length === 0)) {
    return { success: false, error: 'Full name cannot be empty' };
  }

  // If dateOfBirth is being updated, it must be valid
  if (input.dateOfBirth !== undefined) {
    if (!(input.dateOfBirth instanceof Date) || isNaN(input.dateOfBirth.getTime())) {
      return { success: false, error: 'Date of birth must be a valid date' };
    }

    // dateOfBirth must not be in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dob = new Date(input.dateOfBirth);
    dob.setHours(0, 0, 0, 0);
    
    if (dob > today) {
      return { success: false, error: 'Date of birth cannot be in the future' };
    }
  }

  // Contact email validation
  if (input.contactEmail !== undefined && input.contactEmail !== null && input.contactEmail.trim().length > 0) {
    if (!isValidEmail(input.contactEmail)) {
      return { success: false, error: 'Invalid email format' };
    }
  }

  // Contact phone validation
  if (input.contactPhone !== undefined && input.contactPhone !== null && input.contactPhone.trim().length > 0) {
    if (!isValidPhone(input.contactPhone)) {
      return { success: false, error: 'Invalid phone format' };
    }
  }

  // Emergency contact validation: if name is provided, phone is required
  if (input.emergencyContactName !== undefined && input.emergencyContactName !== null && input.emergencyContactName.trim().length > 0) {
    if (!input.emergencyContactPhone || input.emergencyContactPhone.trim().length === 0) {
      return { success: false, error: 'Emergency contact phone is required when emergency contact name is provided' };
    }
  }

  // Emergency contact phone validation
  if (input.emergencyContactPhone !== undefined && input.emergencyContactPhone !== null && input.emergencyContactPhone.trim().length > 0) {
    if (!isValidPhone(input.emergencyContactPhone)) {
      return { success: false, error: 'Invalid phone format' };
    }
  }

  return { success: true };
}

/**
 * Service for patient management.
 * Contains business logic and validation.
 */
export const PatientService = {
  /**
   * Create a new patient.
   * Validates required fields before creation.
   * Automatically creates ClinicalRecord and initial PsychiatricHistory (version 1).
   * 
   * @throws {PatientValidationError} If validation fails
   */
  async createPatient(input: CreatePatientInput): Promise<PatientOutput> {
    const validation = validateCreateInput(input);
    if (!validation.success) {
      throw new PatientValidationError(validation.error);
    }

    // Create patient, ClinicalRecord, and initial PsychiatricHistory in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create patient
      const patient = await tx.patient.create({
        data: {
          fullName: input.fullName.trim(),
          dateOfBirth: input.dateOfBirth,
          contactPhone: input.contactPhone?.trim() || null,
          contactEmail: input.contactEmail?.trim() || null,
          address: input.address?.trim() || null,
          emergencyContactName: input.emergencyContactName?.trim() || null,
          emergencyContactPhone: input.emergencyContactPhone?.trim() || null,
          emergencyContactRelationship: input.emergencyContactRelationship?.trim() || null,
          status: 'Active',
        },
      });

      // Create ClinicalRecord (1:1 relationship)
      const clinicalRecord = await tx.clinicalRecord.create({
        data: {
          patientId: patient.id,
        },
      });

      // Create initial PsychiatricHistory (version 1) with all fields empty
      await tx.psychiatricHistory.create({
        data: {
          clinicalRecordId: clinicalRecord.id,
          versionNumber: 1,
          chiefComplaint: null,
          historyOfPresentIllness: null,
          pastPsychiatricHistory: null,
          pastHospitalizations: null,
          suicideAttemptHistory: null,
          substanceUseHistory: null,
          familyPsychiatricHistory: null,
          medicalHistory: null,
          surgicalHistory: null,
          allergies: null,
          socialHistory: null,
          developmentalHistory: null,
          isCurrent: true,
        },
      });

      return patient;
    });

    return toPatientOutput(result);
  },

  /**
   * Get a patient by their unique ID.
   * 
   * @throws {PatientNotFoundError} If patient does not exist
   */
  async getPatientById(id: string): Promise<PatientOutput> {
    const patient = await PatientRepository.findById(id);
    
    if (!patient) {
      throw new PatientNotFoundError(id);
    }

    return toPatientOutput(patient);
  },

  /**
   * Search patients by name, ID, or date of birth.
   * Returns empty array if no criteria provided or no matches found.
   */
  async searchPatients(criteria: PatientSearchInput): Promise<PatientOutput[]> {
    // If no search criteria provided, return empty array
    if (!criteria.name && !criteria.id && !criteria.dateOfBirth) {
      return [];
    }

    const patients = await PatientRepository.search(criteria);
    return patients.map(toPatientOutput);
  },

  /**
   * List all patients.
   */
  async listPatients(options?: { take?: number; skip?: number }): Promise<PatientOutput[]> {
    const patients = await PatientRepository.findAll(options);
    return patients.map(toPatientOutput);
  },

  /**
   * Update a patient by their unique ID.
   * Validates input before updating.
   * Protects immutable fields (id, registrationDate, createdAt, updatedAt).
   * 
   * @throws {PatientValidationError} If validation fails
   * @throws {PatientNotFoundError} If patient does not exist
   */
  async updatePatient(id: string, input: UpdatePatientInput): Promise<PatientOutput> {
    // Check if patient exists
    const existingPatient = await PatientRepository.findById(id);
    if (!existingPatient) {
      throw new PatientNotFoundError(id);
    }

    // Validate input
    const validation = validateUpdateInput(input);
    if (!validation.success) {
      throw new PatientValidationError(validation.error);
    }

    // Prepare update data - only mutable fields allowed
    // Immutable fields: id, registrationDate, createdAt, updatedAt (auto-managed)
    const updateData: Parameters<typeof PatientRepository.update>[1] = {};

    if (input.fullName !== undefined) {
      updateData.fullName = input.fullName.trim();
    }
    if (input.dateOfBirth !== undefined) {
      updateData.dateOfBirth = input.dateOfBirth;
    }
    if (input.contactPhone !== undefined) {
      updateData.contactPhone = input.contactPhone?.trim() || null;
    }
    if (input.contactEmail !== undefined) {
      updateData.contactEmail = input.contactEmail?.trim() || null;
    }
    if (input.address !== undefined) {
      updateData.address = input.address?.trim() || null;
    }
    if (input.emergencyContactName !== undefined) {
      updateData.emergencyContactName = input.emergencyContactName?.trim() || null;
    }
    if (input.emergencyContactPhone !== undefined) {
      updateData.emergencyContactPhone = input.emergencyContactPhone?.trim() || null;
    }
    if (input.emergencyContactRelationship !== undefined) {
      updateData.emergencyContactRelationship = input.emergencyContactRelationship?.trim() || null;
    }
    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    const patient = await PatientRepository.update(id, updateData);
    return toPatientOutput(patient);
  },
};
