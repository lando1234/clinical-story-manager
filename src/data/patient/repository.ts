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
   * Search patients by name or ID.
   * - Name search uses case-insensitive contains (substring match)
   * - ID search uses exact match
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

    return prisma.patient.findMany({
      where,
      orderBy: { fullName: 'asc' },
    });
  },

  /**
   * List all patients (with optional pagination).
   */
  async findAll(options?: { take?: number; skip?: number }): Promise<Patient[]> {
    return prisma.patient.findMany({
      take: options?.take,
      skip: options?.skip,
      orderBy: { fullName: 'asc' },
    });
  },
};
