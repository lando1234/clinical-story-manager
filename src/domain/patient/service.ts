import { PatientRepository } from '../../data/patient/repository';
import type {
  CreatePatientInput,
  PatientOutput,
  PatientSearchInput,
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
   * 
   * @throws {PatientValidationError} If validation fails
   */
  async createPatient(input: CreatePatientInput): Promise<PatientOutput> {
    const validation = validateCreateInput(input);
    if (!validation.success) {
      throw new PatientValidationError(validation.error);
    }

    const patient = await PatientRepository.create({
      ...input,
      fullName: input.fullName.trim(),
    });

    return toPatientOutput(patient);
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
   * Search patients by name or ID.
   * Returns empty array if no criteria provided or no matches found.
   */
  async searchPatients(criteria: PatientSearchInput): Promise<PatientOutput[]> {
    // If no search criteria provided, return empty array
    if (!criteria.name && !criteria.id) {
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
};
