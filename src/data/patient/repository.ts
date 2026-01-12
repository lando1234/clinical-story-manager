import { prisma } from '../../lib/prisma';
import type { Patient, Prisma } from '../../generated/prisma';
import type { CreatePatientInput, PatientSearchInput } from '../../types/patient';

/**
 * Repository for patient data access.
 * Thin Prisma wrapper - no business logic.
 */
export const PatientRepository = {
  /**
   * Create a new patient record.
   */
  async create(data: CreatePatientInput): Promise<Patient> {
    return prisma.patient.create({
      data: {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        appointmentFrequency: data.appointmentFrequency,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        address: data.address,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelationship: data.emergencyContactRelationship,
      },
    });
  },

  /**
   * Find a patient by their unique ID.
   */
  async findById(id: string): Promise<Patient | null> {
    return prisma.patient.findUnique({
      where: { id },
    });
  },

  /**
   * Search patients by name, ID, or date of birth.
   * - Name search uses case-insensitive contains (substring match)
   * - ID search uses exact match
   * - Date of birth search uses exact match
   * 
   * Sorting (per specs):
   * 1. Status (Active before Inactive)
   * 2. Full name (alphabetical, case-insensitive)
   * 3. Registration date (most recently registered first)
   */
  async search(criteria: PatientSearchInput): Promise<Patient[]> {
    const where: Prisma.PatientWhereInput = {};

    if (criteria.id) {
      where.id = criteria.id;
    }

    if (criteria.name) {
      where.fullName = {
        contains: criteria.name,
        mode: 'insensitive',
      };
    }

    if (criteria.dateOfBirth) {
      where.dateOfBirth = criteria.dateOfBirth;
    }

    return prisma.patient.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // Active comes before Inactive in enum order
        { fullName: 'asc' },
        { registrationDate: 'desc' }, // Most recent first
      ],
    });
  },

  /**
   * List all patients (with optional pagination).
   * 
   * Sorting (per specs):
   * 1. Status (Active before Inactive)
   * 2. Full name (alphabetical, case-insensitive)
   * 3. Registration date (most recently registered first)
   */
  async findAll(options?: { take?: number; skip?: number }): Promise<Patient[]> {
    return prisma.patient.findMany({
      take: options?.take,
      skip: options?.skip,
      orderBy: [
        { status: 'asc' }, // Active comes before Inactive in enum order
        { fullName: 'asc' },
        { registrationDate: 'desc' }, // Most recent first
      ],
    });
  },

  /**
   * Update a patient by their unique ID.
   */
  async update(id: string, data: Prisma.PatientUpdateInput): Promise<Patient> {
    return prisma.patient.update({
      where: { id },
      data,
    });
  },
};
