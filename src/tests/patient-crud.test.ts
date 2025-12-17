/**
 * Patient CRUD Tests
 *
 * Comprehensive test suite for Patient CRUD operations covering:
 * - CREATE: Success cases, validation failures, no timeline events
 * - READ: Existing patient, non-existing patient, field validation
 * - SEARCH/LIST: Filtering, ordering, no fuzzy matching
 * - UPDATE: Mutable fields, immutable fields, validation
 * - DELETE/ARCHIVE: Deletion forbidden, deactivation allowed
 *
 * See: docs/18_patient_crud_specs.md
 */

import { describe, it, expect, beforeEach } from "vitest";
import { testPrisma, cleanupTestData } from "./setup";
import { PatientService, PatientValidationError, PatientNotFoundError } from "@/domain/patient";
import type { CreatePatientInput, UpdatePatientInput } from "@/types/patient";
import { PatientStatus, EncounterType, NoteStatus } from "@/generated/prisma";
import { yearsAgo, today, tomorrow, daysAgo } from "./utils/test-helpers";

describe("Patient CRUD Tests", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  // ============================================================================
  // CREATE PATIENT TESTS
  // ============================================================================

  describe("CREATE Patient", () => {
    it("should create a patient with required fields only", async () => {
      const input: CreatePatientInput = {
        fullName: "María García",
        dateOfBirth: yearsAgo(30),
      };

      const patient = await PatientService.createPatient(input);

      expect(patient).toBeDefined();
      expect(patient.id).toBeDefined();
      expect(patient.fullName).toBe("María García");
      expect(patient.dateOfBirth).toEqual(yearsAgo(30));
      expect(patient.status).toBe(PatientStatus.Active);
      expect(patient.registrationDate).toBeDefined();
      expect(patient.createdAt).toBeDefined();
      expect(patient.updatedAt).toBeDefined();
      expect(patient.contactPhone).toBeNull();
      expect(patient.contactEmail).toBeNull();
      expect(patient.address).toBeNull();
      expect(patient.emergencyContactName).toBeNull();
      expect(patient.emergencyContactPhone).toBeNull();
      expect(patient.emergencyContactRelationship).toBeNull();
    });

    it("should create a patient with all optional fields", async () => {
      const input: CreatePatientInput = {
        fullName: "Juan Pérez",
        dateOfBirth: yearsAgo(25),
        contactPhone: "+1-555-123-4567",
        contactEmail: "juan.perez@example.com",
        address: "123 Main St, City, State 12345",
        emergencyContactName: "María Pérez",
        emergencyContactPhone: "+1-555-987-6543",
        emergencyContactRelationship: "Mother",
      };

      const patient = await PatientService.createPatient(input);

      expect(patient.fullName).toBe("Juan Pérez");
      expect(patient.contactPhone).toBe("+1-555-123-4567");
      expect(patient.contactEmail).toBe("juan.perez@example.com");
      expect(patient.address).toBe("123 Main St, City, State 12345");
      expect(patient.emergencyContactName).toBe("María Pérez");
      expect(patient.emergencyContactPhone).toBe("+1-555-987-6543");
      expect(patient.emergencyContactRelationship).toBe("Mother");
    });

    it("should trim whitespace from string fields", async () => {
      const input: CreatePatientInput = {
        fullName: "  José Martínez  ",
        dateOfBirth: yearsAgo(40),
        contactPhone: "  555-123-4567  ",
        contactEmail: "  jose@example.com  ",
        address: "  456 Oak Ave  ",
      };

      const patient = await PatientService.createPatient(input);

      expect(patient.fullName).toBe("José Martínez");
      expect(patient.contactPhone).toBe("555-123-4567");
      expect(patient.contactEmail).toBe("jose@example.com");
      expect(patient.address).toBe("456 Oak Ave");
    });

    it("should automatically create ClinicalRecord and initial PsychiatricHistory", async () => {
      const input: CreatePatientInput = {
        fullName: "Ana López",
        dateOfBirth: yearsAgo(35),
      };

      const patient = await PatientService.createPatient(input);

      // Verify ClinicalRecord was created
      const clinicalRecord = await testPrisma.clinicalRecord.findUnique({
        where: { patientId: patient.id },
      });
      expect(clinicalRecord).toBeDefined();
      expect(clinicalRecord?.patientId).toBe(patient.id);

      // Verify initial PsychiatricHistory (version 1) was created
      const psychiatricHistory = await testPrisma.psychiatricHistory.findFirst({
        where: {
          clinicalRecordId: clinicalRecord!.id,
          versionNumber: 1,
          isCurrent: true,
        },
      });
      expect(psychiatricHistory).toBeDefined();
      expect(psychiatricHistory?.versionNumber).toBe(1);
      expect(psychiatricHistory?.isCurrent).toBe(true);
    });

    it("should NOT create timeline events when creating a patient", async () => {
      const input: CreatePatientInput = {
        fullName: "Carlos Rodríguez",
        dateOfBirth: yearsAgo(28),
      };

      const patient = await PatientService.createPatient(input);

      // Get the clinical record
      const clinicalRecord = await testPrisma.clinicalRecord.findUnique({
        where: { patientId: patient.id },
      });

      // Verify NO clinical events were created
      const events = await testPrisma.clinicalEvent.findMany({
        where: { clinicalRecordId: clinicalRecord!.id },
      });
      expect(events).toHaveLength(0);
    });

    it("should fail when fullName is missing", async () => {
      const input: CreatePatientInput = {
        fullName: "",
        dateOfBirth: yearsAgo(30),
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Full name is required"
      );
    });

    it("should fail when fullName is only whitespace", async () => {
      const input: CreatePatientInput = {
        fullName: "   ",
        dateOfBirth: yearsAgo(30),
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Full name is required"
      );
    });

    it("should fail when dateOfBirth is missing", async () => {
      const input = {
        fullName: "Test Patient",
        dateOfBirth: undefined as unknown as Date,
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Date of birth must be a valid date"
      );
    });

    it("should fail when dateOfBirth is invalid", async () => {
      const input = {
        fullName: "Test Patient",
        dateOfBirth: new Date("invalid-date") as Date,
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Date of birth must be a valid date"
      );
    });

    it("should fail when dateOfBirth is in the future", async () => {
      const input: CreatePatientInput = {
        fullName: "Test Patient",
        dateOfBirth: tomorrow(),
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Date of birth cannot be in the future"
      );
    });

    it("should fail when contactEmail has invalid format", async () => {
      const input: CreatePatientInput = {
        fullName: "Test Patient",
        dateOfBirth: yearsAgo(30),
        contactEmail: "invalid-email",
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("should fail when contactPhone has invalid format", async () => {
      const input: CreatePatientInput = {
        fullName: "Test Patient",
        dateOfBirth: yearsAgo(30),
        contactPhone: "123", // Too short
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Invalid phone format"
      );
    });

    it("should fail when emergencyContactName is provided without emergencyContactPhone", async () => {
      const input: CreatePatientInput = {
        fullName: "Test Patient",
        dateOfBirth: yearsAgo(30),
        emergencyContactName: "Emergency Contact",
        // emergencyContactPhone is missing
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Emergency contact phone is required when emergency contact name is provided"
      );
    });

    it("should fail when emergencyContactPhone has invalid format", async () => {
      const input: CreatePatientInput = {
        fullName: "Test Patient",
        dateOfBirth: yearsAgo(30),
        emergencyContactName: "Emergency Contact",
        emergencyContactPhone: "invalid",
      };

      await expect(PatientService.createPatient(input)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.createPatient(input)).rejects.toThrow(
        "Invalid phone format"
      );
    });

    it("should accept valid phone formats", async () => {
      const validPhones = [
        "5551234567",
        "555-123-4567",
        "(555) 123-4567",
        "+1-555-123-4567",
        "555 123 4567",
      ];

      for (const phone of validPhones) {
        const input: CreatePatientInput = {
          fullName: "Test Patient",
          dateOfBirth: yearsAgo(30),
          contactPhone: phone,
        };

        const patient = await PatientService.createPatient(input);
        expect(patient.contactPhone).toBe(phone.trim());
        await cleanupTestData();
      }
    });

    it("should accept valid email formats", async () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.co.uk",
        "user+tag@example.com",
      ];

      for (const email of validEmails) {
        const input: CreatePatientInput = {
          fullName: "Test Patient",
          dateOfBirth: yearsAgo(30),
          contactEmail: email,
        };

        const patient = await PatientService.createPatient(input);
        expect(patient.contactEmail).toBe(email.trim());
        await cleanupTestData();
      }
    });
  });

  // ============================================================================
  // READ PATIENT TESTS
  // ============================================================================

  describe("READ Patient", () => {
    it("should retrieve an existing patient by ID", async () => {
      // Create a patient first
      const createInput: CreatePatientInput = {
        fullName: "María García",
        dateOfBirth: yearsAgo(30),
        contactPhone: "555-123-4567",
        contactEmail: "maria@example.com",
      };

      const createdPatient = await PatientService.createPatient(createInput);

      // Retrieve the patient
      const retrievedPatient = await PatientService.getPatientById(createdPatient.id);

      expect(retrievedPatient).toBeDefined();
      expect(retrievedPatient.id).toBe(createdPatient.id);
      expect(retrievedPatient.fullName).toBe("María García");
      expect(retrievedPatient.dateOfBirth).toEqual(yearsAgo(30));
      expect(retrievedPatient.contactPhone).toBe("555-123-4567");
      expect(retrievedPatient.contactEmail).toBe("maria@example.com");
    });

    it("should return all required fields in patient output", async () => {
      const createInput: CreatePatientInput = {
        fullName: "Juan Pérez",
        dateOfBirth: yearsAgo(25),
        contactPhone: "555-111-2222",
        contactEmail: "juan@example.com",
        address: "123 Main St",
        emergencyContactName: "María Pérez",
        emergencyContactPhone: "555-999-8888",
        emergencyContactRelationship: "Mother",
      };

      const createdPatient = await PatientService.createPatient(createInput);
      const retrievedPatient = await PatientService.getPatientById(createdPatient.id);

      // Verify all fields are present
      expect(retrievedPatient).toHaveProperty("id");
      expect(retrievedPatient).toHaveProperty("fullName");
      expect(retrievedPatient).toHaveProperty("dateOfBirth");
      expect(retrievedPatient).toHaveProperty("contactPhone");
      expect(retrievedPatient).toHaveProperty("contactEmail");
      expect(retrievedPatient).toHaveProperty("address");
      expect(retrievedPatient).toHaveProperty("emergencyContactName");
      expect(retrievedPatient).toHaveProperty("emergencyContactPhone");
      expect(retrievedPatient).toHaveProperty("emergencyContactRelationship");
      expect(retrievedPatient).toHaveProperty("status");
      expect(retrievedPatient).toHaveProperty("registrationDate");
      expect(retrievedPatient).toHaveProperty("createdAt");
      expect(retrievedPatient).toHaveProperty("updatedAt");
    });

    it("should NOT include clinical data in patient output", async () => {
      const createInput: CreatePatientInput = {
        fullName: "Test Patient",
        dateOfBirth: yearsAgo(30),
      };

      const createdPatient = await PatientService.createPatient(createInput);

      // Verify patient output does not include clinical relationships
      const retrievedPatient = await PatientService.getPatientById(createdPatient.id);

      // TypeScript should prevent these, but we verify at runtime
      expect(retrievedPatient).not.toHaveProperty("clinicalRecord");
      expect(retrievedPatient).not.toHaveProperty("appointments");
      expect(retrievedPatient).not.toHaveProperty("notes");
      expect(retrievedPatient).not.toHaveProperty("medications");
      expect(retrievedPatient).not.toHaveProperty("events");
    });

    it("should throw PatientNotFoundError for non-existing patient", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      await expect(PatientService.getPatientById(nonExistentId)).rejects.toThrow(
        PatientNotFoundError
      );
      await expect(PatientService.getPatientById(nonExistentId)).rejects.toThrow(
        `Patient not found: ${nonExistentId}`
      );
    });

    it("should return consistent data on multiple reads", async () => {
      const createInput: CreatePatientInput = {
        fullName: "Consistency Test",
        dateOfBirth: yearsAgo(30),
      };

      const createdPatient = await PatientService.createPatient(createInput);

      const read1 = await PatientService.getPatientById(createdPatient.id);
      const read2 = await PatientService.getPatientById(createdPatient.id);

      expect(read1).toEqual(read2);
    });
  });

  // ============================================================================
  // SEARCH / LIST PATIENTS TESTS
  // ============================================================================

  describe("SEARCH / LIST Patients", () => {
    beforeEach(async () => {
      // Create test patients with different characteristics
      const patient1 = await PatientService.createPatient({
        fullName: "María García",
        dateOfBirth: yearsAgo(30),
      });
      // Keep as Active (default)

      const patient2 = await PatientService.createPatient({
        fullName: "Juan Pérez",
        dateOfBirth: yearsAgo(25),
      });
      // Keep as Active (default)

      const patient3 = await PatientService.createPatient({
        fullName: "Ana López",
        dateOfBirth: yearsAgo(35),
      });
      // Set to Inactive
      await PatientService.updatePatient(patient3.id, {
        status: PatientStatus.Inactive,
      });

      await PatientService.createPatient({
        fullName: "Carlos Martínez",
        dateOfBirth: yearsAgo(28),
      });
      // Keep as Active (default)
    });

    it("should list all patients when no search criteria provided", async () => {
      const patients = await PatientService.listPatients();

      expect(patients.length).toBeGreaterThanOrEqual(4);
    });

    it("should return empty array when search has no criteria", async () => {
      const patients = await PatientService.searchPatients({});

      expect(patients).toEqual([]);
    });

    it("should search by name with partial match (case-insensitive)", async () => {
      const patients = await PatientService.searchPatients({ name: "maría" });

      expect(patients.length).toBeGreaterThanOrEqual(1);
      expect(patients.some((p) => p.fullName.includes("María"))).toBe(true);
    });

    it("should search by name with partial match (case variation)", async () => {
      const patients = await PatientService.searchPatients({ name: "MARIA" });

      expect(patients.length).toBeGreaterThanOrEqual(1);
      expect(patients.some((p) => p.fullName.toLowerCase().includes("maría"))).toBe(true);
    });

    it("should search by name with substring match", async () => {
      const patients = await PatientService.searchPatients({ name: "Mart" });

      expect(patients.length).toBeGreaterThanOrEqual(1);
      expect(patients.some((p) => p.fullName.includes("Martínez"))).toBe(true);
    });

    it("should search by exact patient ID", async () => {
      const allPatients = await PatientService.listPatients();
      const targetPatient = allPatients[0];

      const patients = await PatientService.searchPatients({ id: targetPatient.id });

      expect(patients).toHaveLength(1);
      expect(patients[0].id).toBe(targetPatient.id);
    });

    it("should search by exact date of birth", async () => {
      const targetDob = yearsAgo(30);
      const patients = await PatientService.searchPatients({ dateOfBirth: targetDob });

      expect(patients.length).toBeGreaterThanOrEqual(1);
      expect(patients.every((p) => {
        const pDob = new Date(p.dateOfBirth);
        const targetDobDate = new Date(targetDob);
        return (
          pDob.getFullYear() === targetDobDate.getFullYear() &&
          pDob.getMonth() === targetDobDate.getMonth() &&
          pDob.getDate() === targetDobDate.getDate()
        );
      })).toBe(true);
    });

    it("should combine multiple search criteria (AND logic)", async () => {
      const targetDob = yearsAgo(30);
      const patients = await PatientService.searchPatients({
        name: "María",
        dateOfBirth: targetDob,
      });

      // Should only return patients matching BOTH criteria
      expect(patients.every((p) => {
        const pDob = new Date(p.dateOfBirth);
        const targetDobDate = new Date(targetDob);
        return (
          p.fullName.toLowerCase().includes("maría") &&
          pDob.getFullYear() === targetDobDate.getFullYear() &&
          pDob.getMonth() === targetDobDate.getMonth() &&
          pDob.getDate() === targetDobDate.getDate()
        );
      })).toBe(true);
    });

    it("should return empty array when no matches found", async () => {
      const patients = await PatientService.searchPatients({ name: "NonExistentPatient" });

      expect(patients).toEqual([]);
    });

    it("should order results by status (Active before Inactive)", async () => {
      const patients = await PatientService.listPatients();

      // Find first Inactive patient
      const firstInactiveIndex = patients.findIndex((p) => p.status === PatientStatus.Inactive);

      if (firstInactiveIndex > 0) {
        // All patients before the first inactive should be Active
        const beforeInactive = patients.slice(0, firstInactiveIndex);
        expect(beforeInactive.every((p) => p.status === PatientStatus.Active)).toBe(true);
      }
    });

    it("should order results by full name (alphabetical) as secondary sort", async () => {
      const patients = await PatientService.listPatients();

      // Group by status and check alphabetical order within each group
      const activePatients = patients.filter((p) => p.status === PatientStatus.Active);
      for (let i = 1; i < activePatients.length; i++) {
        const prev = activePatients[i - 1].fullName.toLowerCase();
        const curr = activePatients[i].fullName.toLowerCase();
        expect(prev <= curr).toBe(true);
      }
    });

    it("should order results by registration date (most recent first) as tertiary sort", async () => {
      const patients = await PatientService.listPatients();

      // Group by status and name, check registration date order
      const grouped = new Map<string, typeof patients>();
      for (const patient of patients) {
        const key = `${patient.status}-${patient.fullName.toLowerCase()}`;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)!.push(patient);
      }

      for (const group of grouped.values()) {
        if (group.length > 1) {
          for (let i = 1; i < group.length; i++) {
            const prev = new Date(group[i - 1].registrationDate).getTime();
            const curr = new Date(group[i].registrationDate).getTime();
            expect(prev).toBeGreaterThanOrEqual(curr);
          }
        }
      }
    });

    it("should NOT perform fuzzy matching", async () => {
      // Create a patient with a specific name
      await PatientService.createPatient({
        fullName: "María García",
        dateOfBirth: yearsAgo(30),
      });

      // Search with a typo - should NOT match
      const patients = await PatientService.searchPatients({ name: "Mari Garcia" });

      // Should not find "María García" with typo "Mari"
      expect(patients.some((p) => p.fullName === "María García")).toBe(false);
    });

    it("should NOT perform phonetic matching", async () => {
      // Create a patient
      await PatientService.createPatient({
        fullName: "José Martínez",
        dateOfBirth: yearsAgo(30),
      });

      // Search with different spelling - should NOT match
      const patients = await PatientService.searchPatients({ name: "Jose Martinez" });

      // Should not find "José Martínez" with "Jose Martinez" (no accent)
      // Note: This depends on database collation, but we verify no fuzzy matching
      expect(patients.length).toBe(0);
    });
  });

  // ============================================================================
  // UPDATE PATIENT TESTS
  // ============================================================================

  describe("UPDATE Patient", () => {
    let patientId: string;

    beforeEach(async () => {
      const created = await PatientService.createPatient({
        fullName: "Original Name",
        dateOfBirth: yearsAgo(30),
        contactPhone: "555-111-1111",
        contactEmail: "original@example.com",
        address: "Original Address",
        emergencyContactName: "Original Emergency",
        emergencyContactPhone: "555-222-2222",
        emergencyContactRelationship: "Original Relationship",
      });
      patientId = created.id;
    });

    it("should update fullName", async () => {
      const update: UpdatePatientInput = {
        fullName: "Updated Name",
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.fullName).toBe("Updated Name");
      expect(updated.dateOfBirth).toEqual(yearsAgo(30)); // Unchanged
    });

    it("should update dateOfBirth", async () => {
      const newDob = yearsAgo(25);
      const update: UpdatePatientInput = {
        dateOfBirth: newDob,
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.dateOfBirth).toEqual(newDob);
    });

    it("should update contactPhone", async () => {
      const update: UpdatePatientInput = {
        contactPhone: "555-999-9999",
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.contactPhone).toBe("555-999-9999");
    });

    it("should update contactEmail", async () => {
      const update: UpdatePatientInput = {
        contactEmail: "updated@example.com",
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.contactEmail).toBe("updated@example.com");
    });

    it("should update address", async () => {
      const update: UpdatePatientInput = {
        address: "Updated Address",
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.address).toBe("Updated Address");
    });

    it("should update emergency contact fields", async () => {
      const update: UpdatePatientInput = {
        emergencyContactName: "Updated Emergency",
        emergencyContactPhone: "555-888-8888",
        emergencyContactRelationship: "Updated Relationship",
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.emergencyContactName).toBe("Updated Emergency");
      expect(updated.emergencyContactPhone).toBe("555-888-8888");
      expect(updated.emergencyContactRelationship).toBe("Updated Relationship");
    });

    it("should update status to Inactive", async () => {
      const update: UpdatePatientInput = {
        status: PatientStatus.Inactive,
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.status).toBe(PatientStatus.Inactive);
    });

    it("should update status from Inactive to Active", async () => {
      // First set to Inactive
      await PatientService.updatePatient(patientId, { status: PatientStatus.Inactive });

      // Then set back to Active
      const updated = await PatientService.updatePatient(patientId, {
        status: PatientStatus.Active,
      });

      expect(updated.status).toBe(PatientStatus.Active);
    });

    it("should update multiple fields at once", async () => {
      const update: UpdatePatientInput = {
        fullName: "Multi Updated",
        contactPhone: "555-777-7777",
        address: "Multi Address",
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.fullName).toBe("Multi Updated");
      expect(updated.contactPhone).toBe("555-777-7777");
      expect(updated.address).toBe("Multi Address");
    });

    it("should trim whitespace from updated string fields", async () => {
      const update: UpdatePatientInput = {
        fullName: "  Trimmed Name  ",
        contactPhone: "  555-666-6666  ",
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.fullName).toBe("Trimmed Name");
      expect(updated.contactPhone).toBe("555-666-6666");
    });

    it("should set optional fields to null", async () => {
      const update: UpdatePatientInput = {
        contactPhone: null,
        contactEmail: null,
        address: null,
      };

      const updated = await PatientService.updatePatient(patientId, update);

      expect(updated.contactPhone).toBeNull();
      expect(updated.contactEmail).toBeNull();
      expect(updated.address).toBeNull();
    });

    it("should NOT update immutable field: id", async () => {
      const original = await PatientService.getPatientById(patientId);
      const originalId = original.id;

      // Attempt to update (though the API doesn't allow this, we verify it doesn't change)
      const updated = await PatientService.updatePatient(patientId, {
        fullName: "New Name",
      });

      expect(updated.id).toBe(originalId);
    });

    it("should NOT update immutable field: registrationDate", async () => {
      const original = await PatientService.getPatientById(patientId);
      const originalRegistrationDate = original.registrationDate;

      const updated = await PatientService.updatePatient(patientId, {
        fullName: "New Name",
      });

      expect(updated.registrationDate).toEqual(originalRegistrationDate);
    });

    it("should NOT update immutable field: createdAt", async () => {
      const original = await PatientService.getPatientById(patientId);
      const originalCreatedAt = original.createdAt;

      const updated = await PatientService.updatePatient(patientId, {
        fullName: "New Name",
      });

      expect(updated.createdAt).toEqual(originalCreatedAt);
    });

    it("should auto-update updatedAt timestamp", async () => {
      const original = await PatientService.getPatientById(patientId);
      const originalUpdatedAt = original.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await PatientService.updatePatient(patientId, {
        fullName: "New Name",
      });

      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      );
    });

    it("should NOT create timeline events when updating patient", async () => {
      const clinicalRecord = await testPrisma.clinicalRecord.findUnique({
        where: { patientId },
      });

      const eventsBefore = await testPrisma.clinicalEvent.findMany({
        where: { clinicalRecordId: clinicalRecord!.id },
      });

      await PatientService.updatePatient(patientId, {
        fullName: "Updated Name",
      });

      const eventsAfter = await testPrisma.clinicalEvent.findMany({
        where: { clinicalRecordId: clinicalRecord!.id },
      });

      expect(eventsAfter.length).toBe(eventsBefore.length);
    });

    it("should NOT affect clinical data when updating patient", async () => {
      // Create some clinical data
      const clinicalRecord = await testPrisma.clinicalRecord.findUnique({
        where: { patientId },
      });

      const note = await testPrisma.note.create({
        data: {
          clinicalRecordId: clinicalRecord!.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          status: NoteStatus.Draft,
          subjective: "Test subjective",
          objective: "Test objective",
          assessment: "Test assessment",
          plan: "Test plan",
        },
      });

      // Update patient
      await PatientService.updatePatient(patientId, {
        fullName: "Updated Name",
      });

      // Verify clinical data is unchanged
      const noteAfter = await testPrisma.note.findUnique({
        where: { id: note.id },
      });
      expect(noteAfter).toBeDefined();
      expect(noteAfter?.subjective).toBe("Test subjective");
    });

    it("should fail when updating non-existing patient", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const update: UpdatePatientInput = {
        fullName: "New Name",
      };

      await expect(
        PatientService.updatePatient(nonExistentId, update)
      ).rejects.toThrow(PatientNotFoundError);
    });

    it("should fail when fullName becomes empty", async () => {
      const update: UpdatePatientInput = {
        fullName: "",
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        "Full name cannot be empty"
      );
    });

    it("should fail when fullName becomes only whitespace", async () => {
      const update: UpdatePatientInput = {
        fullName: "   ",
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
    });

    it("should fail when dateOfBirth becomes invalid", async () => {
      const update = {
        dateOfBirth: new Date("invalid-date") as Date,
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
    });

    it("should fail when dateOfBirth becomes future date", async () => {
      const update: UpdatePatientInput = {
        dateOfBirth: tomorrow(),
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        "Date of birth cannot be in the future"
      );
    });

    it("should fail when contactEmail has invalid format", async () => {
      const update: UpdatePatientInput = {
        contactEmail: "invalid-email",
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("should fail when contactPhone has invalid format", async () => {
      const update: UpdatePatientInput = {
        contactPhone: "123",
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        "Invalid phone format"
      );
    });

    it("should fail when emergencyContactName is provided without emergencyContactPhone", async () => {
      const update: UpdatePatientInput = {
        emergencyContactName: "New Emergency",
        // emergencyContactPhone is missing
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        "Emergency contact phone is required when emergency contact name is provided"
      );
    });

    it("should fail when emergencyContactPhone has invalid format", async () => {
      const update: UpdatePatientInput = {
        emergencyContactName: "New Emergency",
        emergencyContactPhone: "invalid",
      };

      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        PatientValidationError
      );
      await expect(PatientService.updatePatient(patientId, update)).rejects.toThrow(
        "Invalid phone format"
      );
    });
  });

  // ============================================================================
  // DELETE / ARCHIVE PATIENT TESTS
  // ============================================================================

  describe("DELETE / ARCHIVE Patient", () => {
    it("should NOT have a delete method in PatientService", () => {
      // Verify that PatientService does not expose a delete method
      expect(PatientService).not.toHaveProperty("deletePatient");
    });

    it("should allow deactivation via status update", async () => {
      const created = await PatientService.createPatient({
        fullName: "Patient to Deactivate",
        dateOfBirth: yearsAgo(30),
      });

      const deactivated = await PatientService.updatePatient(created.id, {
        status: PatientStatus.Inactive,
      });

      expect(deactivated.status).toBe(PatientStatus.Inactive);
    });

    it("should preserve all clinical data when deactivating", async () => {
      const created = await PatientService.createPatient({
        fullName: "Patient with Data",
        dateOfBirth: yearsAgo(30),
      });

      const clinicalRecord = await testPrisma.clinicalRecord.findUnique({
        where: { patientId: created.id },
      });

      // Create some clinical data
      const note = await testPrisma.note.create({
        data: {
          clinicalRecordId: clinicalRecord!.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          status: NoteStatus.Draft,
          subjective: "Test",
          objective: "Test",
          assessment: "Test",
          plan: "Test",
        },
      });

      // Deactivate patient
      await PatientService.updatePatient(created.id, {
        status: PatientStatus.Inactive,
      });

      // Verify clinical data is still accessible
      const noteAfter = await testPrisma.note.findUnique({
        where: { id: note.id },
      });
      expect(noteAfter).toBeDefined();
      expect(noteAfter?.subjective).toBe("Test");

      // Verify clinical record still exists
      const clinicalRecordAfter = await testPrisma.clinicalRecord.findUnique({
        where: { patientId: created.id },
      });
      expect(clinicalRecordAfter).toBeDefined();
    });

    it("should allow reactivation of deactivated patient", async () => {
      const created = await PatientService.createPatient({
        fullName: "Patient to Reactivate",
        dateOfBirth: yearsAgo(30),
      });

      // Deactivate
      await PatientService.updatePatient(created.id, {
        status: PatientStatus.Inactive,
      });

      // Reactivate
      const reactivated = await PatientService.updatePatient(created.id, {
        status: PatientStatus.Active,
      });

      expect(reactivated.status).toBe(PatientStatus.Active);
    });

    it("should NOT create timeline events when deactivating", async () => {
      const created = await PatientService.createPatient({
        fullName: "Patient to Deactivate",
        dateOfBirth: yearsAgo(30),
      });

      const clinicalRecord = await testPrisma.clinicalRecord.findUnique({
        where: { patientId: created.id },
      });

      const eventsBefore = await testPrisma.clinicalEvent.findMany({
        where: { clinicalRecordId: clinicalRecord!.id },
      });

      await PatientService.updatePatient(created.id, {
        status: PatientStatus.Inactive,
      });

      const eventsAfter = await testPrisma.clinicalEvent.findMany({
        where: { clinicalRecordId: clinicalRecord!.id },
      });

      expect(eventsAfter.length).toBe(eventsBefore.length);
    });

    it("should allow inactive patients to be retrieved", async () => {
      const created = await PatientService.createPatient({
        fullName: "Inactive Patient",
        dateOfBirth: yearsAgo(30),
      });

      await PatientService.updatePatient(created.id, {
        status: PatientStatus.Inactive,
      });

      const retrieved = await PatientService.getPatientById(created.id);
      expect(retrieved.status).toBe(PatientStatus.Inactive);
    });

    it("should include inactive patients in search results", async () => {
      const created = await PatientService.createPatient({
        fullName: "Inactive Search Test",
        dateOfBirth: yearsAgo(30),
      });

      await PatientService.updatePatient(created.id, {
        status: PatientStatus.Inactive,
      });

      const results = await PatientService.searchPatients({
        name: "Inactive Search Test",
      });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some((p) => p.id === created.id)).toBe(true);
    });
  });
});
