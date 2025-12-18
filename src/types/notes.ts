import { EncounterType, NoteStatus } from "@/generated/prisma";

/**
 * Input for creating a draft clinical note.
 */
export interface CreateDraftNoteInput {
  clinicalRecordId: string;
  encounterDate: Date;
  encounterType: EncounterType;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

/**
 * Input for updating an existing draft note.
 */
export interface UpdateDraftNoteInput {
  encounterDate?: Date;
  encounterType?: EncounterType;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

/**
 * Input for creating an addendum to a finalized note.
 */
export interface CreateAddendumInput {
  noteId: string;
  content: string;
  reason: string;
}

/**
 * Validation result for note finalization.
 * Contains all required fields that must be present.
 */
export interface NoteFinalizationRequirements {
  hasSubjective: boolean;
  hasAssessment: boolean;
  hasPlan: boolean;
  encounterDateValid: boolean;
  encounterTypeValid: boolean;
}

/**
 * Maps EncounterType to human-readable title for timeline events.
 * Per spec: docs/22_nota_clinica_evento_note.md - Section 6.2
 */
export function getEncounterTitle(encounterType: EncounterType): string {
  const titles: Record<EncounterType, string> = {
    InitialEvaluation: "Evaluación Inicial",
    FollowUp: "Seguimiento",
    CrisisIntervention: "Intervención en Crisis",
    MedicationReview: "Revisión de Medicación",
    TherapySession: "Sesión de Terapia",
    PhoneConsultation: "Consulta Telefónica",
    Other: "Encuentro Clínico",
  };
  return titles[encounterType];
}

/**
 * Type guard to check if a note can be finalized.
 */
export function canFinalizeNote(note: {
  status: NoteStatus;
  subjective: string | null;
  assessment: string | null;
  plan: string | null;
  encounterDate: Date;
}): { valid: true } | { valid: false; reasons: string[] } {
  const reasons: string[] = [];

  if (note.status !== "Draft") {
    reasons.push("Note is not in Draft status");
  }
  if (!note.subjective || note.subjective.trim() === "") {
    reasons.push("Subjective field is required");
  }
  if (!note.assessment || note.assessment.trim() === "") {
    reasons.push("Assessment field is required");
  }
  if (!note.plan || note.plan.trim() === "") {
    reasons.push("Plan field is required");
  }
  if (note.encounterDate > new Date()) {
    reasons.push("Encounter date cannot be in the future");
  }

  if (reasons.length === 0) {
    return { valid: true };
  }
  return { valid: false, reasons };
}
