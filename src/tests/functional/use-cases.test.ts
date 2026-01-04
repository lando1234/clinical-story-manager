/**
 * Functional Use Case Tests
 *
 * Implements functional tests derived from updated use cases and test matrix.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { cleanupTestData, testPrisma } from "../setup";
import { PatientService } from "@/domain/patient";
import {
  createDraftNote,
  finalizeNote,
  createAddendum,
  deleteDraftNote,
} from "@/domain/notes/note-service";
import {
  startMedication,
  changeMedication,
  stopMedication,
  issuePrescription,
} from "@/domain/medications/medication-service";
import { appointmentService } from "@/domain/appointments";
import {
  emitManualEvent,
  emitHistoryUpdateEvent,
  getFullTimeline,
  getFilteredTimeline,
} from "@/domain/timeline";
import {
  AppointmentErrorCode,
  AppointmentType,
  isAppointmentSuccess,
} from "@/domain/appointments/types";
import {
  ClinicalEventType,
  EncounterType,
  NoteStatus,
  MedicationStatus,
} from "@/generated/prisma";
import {
  daysAgo,
  daysFromNow,
  today,
  tomorrow,
  assertResultOk,
  assertResultErrCode,
  isSameDay,
} from "../utils/test-helpers";
import { DomainError, err, ok, Result } from "@/types/errors";
import type { PsychiatricHistory } from "@/generated/prisma";

async function createPatientWithRecord() {
  const patient = await PatientService.createPatient({
    fullName: "Paciente de Prueba",
    dateOfBirth: daysAgo(365 * 30),
  });

  const clinicalRecord = await testPrisma.clinicalRecord.findUnique({
    where: { patientId: patient.id },
  });

  if (!clinicalRecord) {
    throw new Error("Clinical record not created for patient");
  }

  return { patient, clinicalRecord };
}

async function updatePsychiatricHistoryForTest(
  clinicalRecordId: string,
  updates: Partial<PsychiatricHistory>
): Promise<Result<PsychiatricHistory>> {
  const current = await testPrisma.psychiatricHistory.findFirst({
    where: { clinicalRecordId, isCurrent: true },
  });

  if (!current) {
    return err(
      new DomainError(
        "INVALID_STATE",
        "No current psychiatric history version exists"
      )
    );
  }

  const updatedContent = {
    chiefComplaint: updates.chiefComplaint ?? current.chiefComplaint,
    historyOfPresentIllness:
      updates.historyOfPresentIllness ?? current.historyOfPresentIllness,
    pastPsychiatricHistory:
      updates.pastPsychiatricHistory ?? current.pastPsychiatricHistory,
    pastHospitalizations:
      updates.pastHospitalizations ?? current.pastHospitalizations,
    suicideAttemptHistory:
      updates.suicideAttemptHistory ?? current.suicideAttemptHistory,
    substanceUseHistory:
      updates.substanceUseHistory ?? current.substanceUseHistory,
    familyPsychiatricHistory:
      updates.familyPsychiatricHistory ?? current.familyPsychiatricHistory,
    medicalHistory: updates.medicalHistory ?? current.medicalHistory,
    surgicalHistory: updates.surgicalHistory ?? current.surgicalHistory,
    allergies: updates.allergies ?? current.allergies,
    socialHistory: updates.socialHistory ?? current.socialHistory,
    developmentalHistory:
      updates.developmentalHistory ?? current.developmentalHistory,
  };

  const hasChanges = Object.entries(updatedContent).some(
    ([key, value]) => value !== current[key as keyof PsychiatricHistory]
  );

  if (!hasChanges) {
    return err(
      new DomainError(
        "MISSING_REQUIRED_FIELDS",
        "At least one psychiatric history section must change"
      )
    );
  }

  const newVersionNumber = current.versionNumber + 1;
  const now = new Date();

  await testPrisma.$transaction(async (tx) => {
    await tx.psychiatricHistory.update({
      where: { id: current.id },
      data: {
        isCurrent: false,
        supersededAt: now,
      },
    });

    await tx.psychiatricHistory.create({
      data: {
        clinicalRecordId,
        versionNumber: newVersionNumber,
        isCurrent: true,
        chiefComplaint: updatedContent.chiefComplaint,
        historyOfPresentIllness: updatedContent.historyOfPresentIllness,
        pastPsychiatricHistory: updatedContent.pastPsychiatricHistory,
        pastHospitalizations: updatedContent.pastHospitalizations,
        suicideAttemptHistory: updatedContent.suicideAttemptHistory,
        substanceUseHistory: updatedContent.substanceUseHistory,
        familyPsychiatricHistory: updatedContent.familyPsychiatricHistory,
        medicalHistory: updatedContent.medicalHistory,
        surgicalHistory: updatedContent.surgicalHistory,
        allergies: updatedContent.allergies,
        socialHistory: updatedContent.socialHistory,
        developmentalHistory: updatedContent.developmentalHistory,
      },
    });
  });

  const created = await testPrisma.psychiatricHistory.findFirst({
    where: { clinicalRecordId, versionNumber: newVersionNumber },
  });

  if (!created) {
    return err(
      new DomainError(
        "INVALID_STATE",
        "Psychiatric history update failed to persist"
      )
    );
  }

  if (newVersionNumber >= 2) {
    await emitHistoryUpdateEvent({
      clinicalRecordId,
      psychiatricHistoryId: created.id,
      createdAt: created.createdAt,
    });
  }

  return ok(created);
}

describe("Functional Use Case Tests", () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  describe("UC-03: Crear o editar nota clínica en borrador", () => {
    it("UC-03-T01 guarda nota Draft válida sin evento NOTE", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await createDraftNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: today(),
        encounterType: EncounterType.FollowUp,
        subjective: "Paciente estable",
      });

      const note = assertResultOk(result);
      expect(note.status).toBe(NoteStatus.Draft);

      const noteEvents = await testPrisma.clinicalEvent.findMany({
        where: { clinicalRecordId: clinicalRecord.id, eventType: ClinicalEventType.NOTE },
      });
      expect(noteEvents).toHaveLength(0);
    });

    it("UC-03-T02 rechaza encounterDate futura", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await createDraftNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: tomorrow(),
        encounterType: EncounterType.FollowUp,
        subjective: "Paciente estable",
      });

      assertResultErrCode(result, "INVALID_TIMESTAMP_FUTURE");
    });

    it("UC-03-T03 rechaza borrador sin contenido clínico", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await createDraftNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: today(),
        encounterType: EncounterType.FollowUp,
      });

      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });
  });

  describe("UC-03B: Finalizar nota clínica", () => {
    it("UC-03B-T01 finaliza nota Draft y genera evento NOTE", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.InitialEvaluation,
          subjective: "Motivo de consulta",
          assessment: "Evaluación inicial",
          plan: "Plan terapéutico",
        })
      );

      const result = await finalizeNote(draft.id);
      const note = assertResultOk(result);
      expect(note.status).toBe(NoteStatus.Finalized);

      const noteEvents = await testPrisma.clinicalEvent.findMany({
        where: { clinicalRecordId: clinicalRecord.id, eventType: ClinicalEventType.NOTE },
      });
      expect(noteEvents).toHaveLength(1);
      expect(noteEvents[0].noteId).toBe(note.id);
    });

    it("UC-03B-T02 rechaza finalización sin subjective", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          assessment: "Evaluación",
          plan: "Plan",
        })
      );

      const result = await finalizeNote(draft.id);
      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });

    it("UC-03B-T03 rechaza finalización sin assessment", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
          plan: "Plan",
        })
      );

      const result = await finalizeNote(draft.id);
      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });

    it("UC-03B-T04 rechaza finalización sin plan", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
          assessment: "Evaluación",
        })
      );

      const result = await finalizeNote(draft.id);
      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });

    it("UC-03B-T05 rechaza finalización con fecha futura", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = await testPrisma.note.create({
        data: {
          clinicalRecordId: clinicalRecord.id,
          encounterDate: tomorrow(),
          encounterType: EncounterType.FollowUp,
          status: NoteStatus.Draft,
          subjective: "Subjetivo",
          assessment: "Evaluación",
          plan: "Plan",
        },
      });

      const result = await finalizeNote(draft.id);
      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });
  });

  describe("UC-03C: Agregar addendum a nota finalizada", () => {
    it("UC-03C-T01 crea addendum válido", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
          assessment: "Evaluación",
          plan: "Plan",
        })
      );

      assertResultOk(await finalizeNote(draft.id));

      const result = await createAddendum({
        noteId: draft.id,
        content: "Contenido adicional",
        reason: "Corrección clínica",
      });

      const addendum = assertResultOk(result);
      expect(addendum.noteId).toBe(draft.id);

      const addenda = await testPrisma.addendum.findMany({
        where: { noteId: draft.id },
      });
      expect(addenda).toHaveLength(1);
    });

    it("UC-03C-T02 rechaza addendum en nota Draft", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
        })
      );

      const result = await createAddendum({
        noteId: draft.id,
        content: "Contenido",
        reason: "Razón",
      });

      assertResultErrCode(result, "NOTE_NOT_FINALIZED");
    });

    it("UC-03C-T03 rechaza addendum con campos vacíos", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
          assessment: "Evaluación",
          plan: "Plan",
        })
      );

      assertResultOk(await finalizeNote(draft.id));

      const missingContent = await createAddendum({
        noteId: draft.id,
        content: " ",
        reason: "Razón",
      });
      assertResultErrCode(missingContent, "MISSING_REQUIRED_FIELDS");

      const missingReason = await createAddendum({
        noteId: draft.id,
        content: "Contenido",
        reason: " ",
      });
      assertResultErrCode(missingReason, "MISSING_REQUIRED_FIELDS");
    });
  });

  describe("UC-03D: Eliminar nota en borrador", () => {
    it("UC-03D-T01 elimina nota Draft", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
        })
      );

      const result = await deleteDraftNote(draft.id);
      assertResultOk(result);

      const deleted = await testPrisma.note.findUnique({ where: { id: draft.id } });
      expect(deleted).toBeNull();
    });

    it("UC-03D-T02 rechaza eliminación de nota Finalized", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: today(),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
          assessment: "Evaluación",
          plan: "Plan",
        })
      );

      assertResultOk(await finalizeNote(draft.id));

      const result = await deleteDraftNote(draft.id);
      assertResultErrCode(result, "NOTE_ALREADY_FINALIZED");
    });
  });

  describe("UC-04: Registrar medicación (Medication Start)", () => {
    it("UC-04-T01 crea medicación activa y evento Medication Start", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await startMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Sertralina",
        dosage: 50,
        dosageUnit: "mg",
        frequency: "diaria",
        prescriptionIssueDate: today(),
        comments: "Inicio de tratamiento",
      });

      const medication = assertResultOk(result);
      expect(medication.status).toBe(MedicationStatus.Active);

      const events = await testPrisma.clinicalEvent.findMany({
        where: { medicationId: medication.id, eventType: ClinicalEventType.MedicationStart },
      });
      expect(events).toHaveLength(1);
    });

    it("UC-04-T02 rechaza prescriptionIssueDate futura", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await startMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Sertralina",
        dosage: 50,
        dosageUnit: "mg",
        frequency: "diaria",
        prescriptionIssueDate: tomorrow(),
      });

      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });

    it("UC-04-T03 rechaza dosis no positiva", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await startMedication({
        clinicalRecordId: clinicalRecord.id,
        drugName: "Sertralina",
        dosage: 0,
        dosageUnit: "mg",
        frequency: "diaria",
        prescriptionIssueDate: today(),
      });

      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });
  });

  describe("UC-04B: Ajustar dosis o frecuencia", () => {
    it("UC-04B-T01 ajusta dosis y crea nueva versión", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(10),
        })
      );

      const result = await changeMedication({
        medicationId: medication.id,
        newDosage: 75,
        effectiveDate: today(),
        changeReason: "Ajuste clínico",
      });

      const updated = assertResultOk(result);
      const original = await testPrisma.medication.findUnique({ where: { id: medication.id } });

      expect(original?.status).toBe(MedicationStatus.Discontinued);
      expect(updated.status).toBe(MedicationStatus.Active);
      expect(updated.predecessorId).toBe(medication.id);

      const events = await testPrisma.clinicalEvent.findMany({
        where: { medicationId: updated.id, eventType: ClinicalEventType.MedicationChange },
      });
      expect(events).toHaveLength(1);
    });

    it("UC-04B-T02 permite fecha futura y oculta evento", async () => {
      const { patient, clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(5),
        })
      );

      const result = await changeMedication({
        medicationId: medication.id,
        newDosage: 75,
        effectiveDate: tomorrow(),
      });

      const updated = assertResultOk(result);

      const timelineResult = await getFullTimeline(patient.id, "descending");
      const timeline = assertResultOk(timelineResult);
      const hasChange = timeline.events.some(
        (event) => event.eventType === ClinicalEventType.MedicationChange
      );
      expect(hasChange).toBe(false);

      const events = await testPrisma.clinicalEvent.findMany({
        where: { medicationId: updated.id, eventType: ClinicalEventType.MedicationChange },
      });
      expect(events).toHaveLength(1);
    });

    it("UC-04B-T03 rechaza fecha efectiva anterior", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(5),
        })
      );

      const result = await changeMedication({
        medicationId: medication.id,
        newDosage: 75,
        effectiveDate: daysAgo(10),
      });

      assertResultErrCode(result, "INVALID_DATE_RANGE");
    });

    it("UC-04B-T04 rechaza ajuste sobre medicación inactiva", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(5),
        })
      );

      assertResultOk(
        await stopMedication({
          medicationId: medication.id,
          endDate: today(),
          discontinuationReason: "Suspensión",
        })
      );

      const result = await changeMedication({
        medicationId: medication.id,
        newDosage: 75,
        effectiveDate: today(),
      });

      assertResultErrCode(result, "MEDICATION_NOT_ACTIVE");
    });
  });

  describe("UC-04C: Discontinuar medicación", () => {
    it("UC-04C-T01 discontinúa medicación activa y genera evento", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(10),
        })
      );

      const result = await stopMedication({
        medicationId: medication.id,
        endDate: today(),
        discontinuationReason: "Suspensión clínica",
      });

      const stopped = assertResultOk(result);
      expect(stopped.status).toBe(MedicationStatus.Discontinued);

      const events = await testPrisma.clinicalEvent.findMany({
        where: { medicationId: medication.id, eventType: ClinicalEventType.MedicationStop },
      });
      expect(events).toHaveLength(1);
    });

    it("UC-04C-T02 rechaza endDate anterior a prescriptionIssueDate", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(5),
        })
      );

      const result = await stopMedication({
        medicationId: medication.id,
        endDate: daysAgo(10),
        discontinuationReason: "Suspensión",
      });

      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });

    it("UC-04C-T03 rechaza endDate futura", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(5),
        })
      );

      const result = await stopMedication({
        medicationId: medication.id,
        endDate: tomorrow(),
        discontinuationReason: "Suspensión",
      });

      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });
  });

  describe("UC-04D: Registrar nueva emisión de receta", () => {
    it("UC-04D-T01 registra emisión y mantiene medicación activa", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(10),
        })
      );

      const result = await issuePrescription({
        medicationId: medication.id,
        prescriptionIssueDate: daysAgo(5),
      });

      const event = assertResultOk(result);
      expect(event.eventType).toBe(ClinicalEventType.MedicationPrescriptionIssued);

      const medicationAfter = await testPrisma.medication.findUnique({
        where: { id: medication.id },
      });
      expect(medicationAfter?.status).toBe(MedicationStatus.Active);
    });

    it("UC-04D-T02 permite fecha futura y oculta evento", async () => {
      const { patient, clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(10),
        })
      );

      assertResultOk(
        await issuePrescription({
          medicationId: medication.id,
          prescriptionIssueDate: tomorrow(),
        })
      );

      const timelineResult = await getFullTimeline(patient.id, "descending");
      const timeline = assertResultOk(timelineResult);
      const hasIssued = timeline.events.some(
        (event) => event.eventType === ClinicalEventType.MedicationPrescriptionIssued
      );
      expect(hasIssued).toBe(false);
    });

    it("UC-04D-T03 rechaza fecha igual o anterior a la inicial", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(10),
        })
      );

      const result = await issuePrescription({
        medicationId: medication.id,
        prescriptionIssueDate: daysAgo(10),
      });

      assertResultErrCode(result, "INVALID_PRESCRIPTION_DATE_MUST_BE_AFTER_FIRST");
    });

    it("UC-04D-T04 rechaza emisión para medicación inactiva", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(10),
        })
      );

      assertResultOk(
        await stopMedication({
          medicationId: medication.id,
          endDate: today(),
          discontinuationReason: "Suspensión",
        })
      );

      const result = await issuePrescription({
        medicationId: medication.id,
        prescriptionIssueDate: daysAgo(5),
      });

      assertResultErrCode(result, "MEDICATION_NOT_ACTIVE_CANNOT_ISSUE_PRESCRIPTION");
    });
  });

  describe("UC-05: Registrar turno agendado", () => {
    it("UC-05-T01 registra turno futuro y Encounter queda oculto", async () => {
      const { patient } = await createPatientWithRecord();

      const result = await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: daysFromNow(5),
        appointmentType: AppointmentType.FollowUp,
        notes: "Control",
      });

      expect(isAppointmentSuccess(result)).toBe(true);
      if (!isAppointmentSuccess(result)) return;

      const event = await testPrisma.clinicalEvent.findFirst({
        where: { sourceId: result.appointment.id, eventType: ClinicalEventType.Encounter },
      });
      expect(event).toBeDefined();

      const timelineResult = await getFullTimeline(patient.id, "descending");
      const timeline = assertResultOk(timelineResult);
      const hasEncounter = timeline.events.some(
        (timelineEvent) => timelineEvent.eventType === ClinicalEventType.Encounter
      );
      expect(hasEncounter).toBe(false);
    });

    it("UC-05-T02 registra turno pasado y Encounter aparece", async () => {
      const { patient } = await createPatientWithRecord();

      const result = await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: daysAgo(3),
        appointmentType: AppointmentType.FollowUp,
      });

      expect(isAppointmentSuccess(result)).toBe(true);
      if (!isAppointmentSuccess(result)) return;

      const timelineResult = await getFullTimeline(patient.id, "descending");
      const timeline = assertResultOk(timelineResult);
      const hasEncounter = timeline.events.some(
        (timelineEvent) => timelineEvent.eventType === ClinicalEventType.Encounter
      );
      expect(hasEncounter).toBe(true);
    });

    it("UC-05-T03 rechaza fecha inválida", async () => {
      const { patient } = await createPatientWithRecord();

      const result = await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: new Date("invalid"),
        appointmentType: AppointmentType.FollowUp,
      });

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.code).toBe(AppointmentErrorCode.INVALID_SCHEDULED_DATE);
    });
  });

  describe("UC-05B: Actualizar turno agendado", () => {
    it("UC-05B-T01 reprograma turno futuro y reemplaza Encounter", async () => {
      const { patient } = await createPatientWithRecord();

      const scheduled = await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: daysFromNow(5),
        appointmentType: AppointmentType.FollowUp,
      });

      if (!isAppointmentSuccess(scheduled)) {
        throw new Error("No se pudo crear el turno inicial");
      }

      const updated = await appointmentService.updateAppointment(
        scheduled.appointment.id,
        { scheduledDate: daysFromNow(10) }
      );

      expect(isAppointmentSuccess(updated)).toBe(true);
      if (!isAppointmentSuccess(updated)) return;

      const events = await testPrisma.clinicalEvent.findMany({
        where: { sourceId: scheduled.appointment.id, eventType: ClinicalEventType.Encounter },
      });

      expect(events).toHaveLength(1);
      expect(isSameDay(events[0].eventDate, daysFromNow(10))).toBe(true);
    });

    it("UC-05B-T02 cancela turno futuro y elimina Encounter", async () => {
      const { patient } = await createPatientWithRecord();

      const scheduled = await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: daysFromNow(5),
        appointmentType: AppointmentType.FollowUp,
      });

      if (!isAppointmentSuccess(scheduled)) {
        throw new Error("No se pudo crear el turno inicial");
      }

      const cancelled = await appointmentService.cancelAppointment(
        scheduled.appointment.id
      );

      expect(isAppointmentSuccess(cancelled)).toBe(true);

      const event = await testPrisma.clinicalEvent.findFirst({
        where: { sourceId: scheduled.appointment.id, eventType: ClinicalEventType.Encounter },
      });
      expect(event).toBeNull();
    });

    it("UC-05B-T03 mantiene Encounter cuando el turno pasado cambia a NoShow", async () => {
      const { patient } = await createPatientWithRecord();

      const scheduled = await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: daysAgo(2),
        appointmentType: AppointmentType.FollowUp,
      });

      if (!isAppointmentSuccess(scheduled)) {
        throw new Error("No se pudo crear el turno inicial");
      }

      await testPrisma.appointment.update({
        where: { id: scheduled.appointment.id },
        data: { status: "NoShow" },
      });

      const timelineResult = await getFullTimeline(patient.id, "descending");
      const timeline = assertResultOk(timelineResult);
      const hasEncounter = timeline.events.some(
        (event) => event.eventType === ClinicalEventType.Encounter
      );
      expect(hasEncounter).toBe(true);
    });

    it("UC-05B-T04 rechaza fecha o estado inválido", async () => {
      const { patient } = await createPatientWithRecord();

      const scheduled = await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: daysFromNow(5),
        appointmentType: AppointmentType.FollowUp,
      });

      if (!isAppointmentSuccess(scheduled)) {
        throw new Error("No se pudo crear el turno inicial");
      }

      await testPrisma.appointment.update({
        where: { id: scheduled.appointment.id },
        data: { status: "Completed" },
      });

      const invalidUpdate = await appointmentService.updateAppointment(
        scheduled.appointment.id,
        { scheduledDate: new Date("invalid") }
      );

      expect(invalidUpdate.success).toBe(false);
      if (invalidUpdate.success) return;
      expect(invalidUpdate.error.code).toBe(AppointmentErrorCode.CANNOT_MODIFY_COMPLETED);
    });
  });

  describe("UC-06: Ver timeline clínica del paciente", () => {
    it("UC-06-T01 ordena eventos por fecha y prioridad", async () => {
      const { patient, clinicalRecord } = await createPatientWithRecord();

      const eventDate = daysAgo(10);
      const recordedAt = daysAgo(9);

      await testPrisma.clinicalEvent.createMany({
        data: [
          {
            clinicalRecordId: clinicalRecord.id,
            eventDate,
            eventType: ClinicalEventType.Other,
            title: "Otro",
            recordedAt,
          },
          {
            clinicalRecordId: clinicalRecord.id,
            eventDate,
            eventType: ClinicalEventType.MedicationStart,
            title: "Inicio",
            recordedAt,
          },
          {
            clinicalRecordId: clinicalRecord.id,
            eventDate,
            eventType: ClinicalEventType.MedicationStop,
            title: "Suspensión",
            recordedAt,
          },
        ],
      });

      const timelineResult = await getFullTimeline(patient.id, "ascending");
      const timeline = assertResultOk(timelineResult);

      const sameDateEvents = timeline.events.filter((event) =>
        isSameDay(event.eventDate, eventDate)
      );

      expect(sameDateEvents.map((event) => event.eventType)).toEqual([
        ClinicalEventType.MedicationStart,
        ClinicalEventType.MedicationStop,
        ClinicalEventType.Other,
      ]);
    });

    it("UC-06-T02 excluye drafts y eventos futuros", async () => {
      const { patient, clinicalRecord } = await createPatientWithRecord();

      await createDraftNote({
        clinicalRecordId: clinicalRecord.id,
        encounterDate: today(),
        encounterType: EncounterType.FollowUp,
        subjective: "Subjetivo",
      });

      const medication = assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(5),
        })
      );

      assertResultOk(
        await changeMedication({
          medicationId: medication.id,
          newDosage: 75,
          effectiveDate: tomorrow(),
        })
      );

      await appointmentService.scheduleAppointment({
        patientId: patient.id,
        scheduledDate: daysFromNow(5),
        appointmentType: AppointmentType.FollowUp,
      });

      const timelineResult = await getFullTimeline(patient.id, "descending");
      const timeline = assertResultOk(timelineResult);

      const eventTypes = timeline.events.map((event) => event.eventType);
      expect(eventTypes).not.toContain(ClinicalEventType.MedicationChange);
      expect(eventTypes).not.toContain(ClinicalEventType.Encounter);
      expect(eventTypes).not.toContain(ClinicalEventType.NOTE);
    });

    it("UC-06-T03 filtra por tipo y rango de fechas", async () => {
      const { patient, clinicalRecord } = await createPatientWithRecord();

      assertResultOk(
        await startMedication({
          clinicalRecordId: clinicalRecord.id,
          drugName: "Sertralina",
          dosage: 50,
          dosageUnit: "mg",
          frequency: "diaria",
          prescriptionIssueDate: daysAgo(5),
        })
      );

      assertResultOk(
        await emitManualEvent({
          clinicalRecordId: clinicalRecord.id,
          eventDate: daysAgo(12),
          eventType: "Hospitalization",
          title: "Hospitalización",
        })
      );

      const draft = assertResultOk(
        await createDraftNote({
          clinicalRecordId: clinicalRecord.id,
          encounterDate: daysAgo(3),
          encounterType: EncounterType.FollowUp,
          subjective: "Subjetivo",
          assessment: "Evaluación",
          plan: "Plan",
        })
      );

      assertResultOk(await finalizeNote(draft.id));

      const filteredResult = await getFilteredTimeline(patient.id, {
        eventTypes: [ClinicalEventType.MedicationStart],
        dateRangeStart: daysAgo(6),
        dateRangeEnd: daysAgo(4),
      });

      const filtered = assertResultOk(filteredResult);
      expect(filtered.events).toHaveLength(1);
      expect(filtered.events[0].eventType).toBe(ClinicalEventType.MedicationStart);
    });

    it("UC-06-T04 rechaza rango de fechas inválido", async () => {
      const { patient } = await createPatientWithRecord();

      const result = await getFilteredTimeline(patient.id, {
        dateRangeStart: today(),
        dateRangeEnd: daysAgo(1),
      });

      assertResultErrCode(result, "INVALID_DATE_RANGE");
    });
  });

  describe("UC-07: Registrar evento clínico manual", () => {
    it("UC-07-T01 crea eventos manuales válidos", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      for (const eventType of [
        ClinicalEventType.Hospitalization,
        ClinicalEventType.LifeEvent,
        ClinicalEventType.Other,
      ]) {
        const result = await emitManualEvent({
          clinicalRecordId: clinicalRecord.id,
          eventDate: daysAgo(3),
          eventType:
            eventType === ClinicalEventType.LifeEvent
              ? "LifeEvent"
              : eventType === ClinicalEventType.Hospitalization
                ? "Hospitalization"
                : "Other",
          title: "Evento manual",
        });

        const event = assertResultOk(result);
        expect(event.eventType).toBe(eventType);
      }
    });

    it("UC-07-T02 rechaza fecha futura", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await emitManualEvent({
        clinicalRecordId: clinicalRecord.id,
        eventDate: tomorrow(),
        eventType: "Other",
        title: "Evento manual",
      });

      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });

    it("UC-07-T03 rechaza tipo inválido", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      await expect(
        emitManualEvent({
          clinicalRecordId: clinicalRecord.id,
          eventDate: daysAgo(2),
          eventType: "InvalidType" as "Other",
          title: "Evento manual",
        })
      ).rejects.toThrow();
    });
  });

  describe("UC-08: Actualizar historia psiquiátrica", () => {
    it("UC-08-T01 crea nueva versión y evento History Update", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await updatePsychiatricHistoryForTest(clinicalRecord.id, {
        chiefComplaint: "Nuevo motivo",
      });

      const newVersion = assertResultOk(result);
      expect(newVersion.versionNumber).toBe(2);
      expect(newVersion.isCurrent).toBe(true);

      const event = await testPrisma.clinicalEvent.findFirst({
        where: { psychiatricHistoryId: newVersion.id, eventType: ClinicalEventType.HistoryUpdate },
      });
      expect(event).toBeDefined();
    });

    it("UC-08-T02 rechaza actualización sin cambios", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      const result = await updatePsychiatricHistoryForTest(clinicalRecord.id, {});
      assertResultErrCode(result, "MISSING_REQUIRED_FIELDS");
    });

    it("UC-08-T03 rechaza actualización sin versión actual", async () => {
      const { clinicalRecord } = await createPatientWithRecord();

      await testPrisma.psychiatricHistory.updateMany({
        where: { clinicalRecordId: clinicalRecord.id },
        data: { isCurrent: false },
      });

      const result = await updatePsychiatricHistoryForTest(clinicalRecord.id, {
        chiefComplaint: "Nuevo motivo",
      });

      assertResultErrCode(result, "INVALID_STATE");
    });
  });
});
