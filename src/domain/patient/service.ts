import { PatientRepository } from '../../data/patient/repository';
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

  /**
   * Update a patient by their unique ID.
   * Validates input before updating.
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

    // Prepare update data
    const updateData: Parameters<typeof PatientRepository.update>[1] = {};

    if (input.fullName !== undefined) {
      updateData.fullName = input.fullName.trim();
    }
    if (input.dateOfBirth !== undefined) {
      updateData.dateOfBirth = input.dateOfBirth;
    }
    if (input.contactPhone !== undefined) {
      updateData.contactPhone = input.contactPhone;
    }
    if (input.contactEmail !== undefined) {
      updateData.contactEmail = input.contactEmail;
    }
    if (input.address !== undefined) {
      updateData.address = input.address;
    }
    if (input.emergencyContactName !== undefined) {
      updateData.emergencyContactName = input.emergencyContactName;
    }
    if (input.emergencyContactPhone !== undefined) {
      updateData.emergencyContactPhone = input.emergencyContactPhone;
    }
    if (input.emergencyContactRelationship !== undefined) {
      updateData.emergencyContactRelationship = input.emergencyContactRelationship;
    }
    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    const patient = await PatientRepository.update(id, updateData);
    return toPatientOutput(patient);
  },
};
