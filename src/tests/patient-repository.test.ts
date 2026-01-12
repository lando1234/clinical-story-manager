import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CreatePatientInput } from "@/types/patient";

// Local mock of Prisma to avoid DB calls while exercising repository mapping
const createMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/prisma", () => ({
  prisma: {
    patient: {
      create: createMock,
    },
  },
}));

// The repository under test uses the mocked Prisma above
import { PatientRepository } from "@/data/patient/repository";

describe("PatientRepository", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  // COVE-1: Spec verified - patient creation fields per docs/specs/01_domain/18_patient_crud_specs.md
  // COVE-2: Coverage verified - create mapping lines 14-25 in repository.ts were uncovered
  // COVE-3: Plan - call create with all optional fields and assert prisma.patient.create receives mapped data
  it("create maps all patient fields into Prisma payload", async () => {
    const input: CreatePatientInput = {
      fullName: "Test Patient",
      dateOfBirth: new Date("1990-05-20"),
      appointmentFrequency: "Semanal",
      contactPhone: "+1-555-1234",
      contactEmail: "test@example.com",
      address: "123 Main St",
      emergencyContactName: "Jane Doe",
      emergencyContactPhone: "+1-555-9999",
      emergencyContactRelationship: "Sister",
    };

    const createdPatient = { id: "p-1", ...input };
    createMock.mockResolvedValue(createdPatient);

    const result = await PatientRepository.create(input);

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        fullName: "Test Patient",
        dateOfBirth: new Date("1990-05-20"),
        appointmentFrequency: "Semanal",
        contactPhone: "+1-555-1234",
        contactEmail: "test@example.com",
        address: "123 Main St",
        emergencyContactName: "Jane Doe",
        emergencyContactPhone: "+1-555-9999",
        emergencyContactRelationship: "Sister",
      },
    });
    expect(result).toEqual(createdPatient);
  });
});

