import { EncounterType, NoteStatus } from "@/generated/prisma";

/**
 * Input for creating a draft clinical note.
 */
export interface CreateDraftNoteInput {
  clinicalRecordId: string;
  encounterDate: Date;
  encounterType: EncounterType;
  /**
   * Serialized structured content (compat layer). When provided, it will be
   * stored into legacy text fields for persistence.
   */
  content?: string;
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
  /**
   * Serialized structured content (compat layer). When provided, it will be
   * stored into legacy text fields for persistence.
   */
  content?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

/**
 * Structured clinical note content broken down into clear sections.
 */
export interface StructuredNoteContent {
  evaluacionSemiologica: string;
  datosExtra: string;
  diagnosticos: string;
  diagnosticosEstudio: string;
  planFarmacologico: string;
  indicaciones: string;
  extras: string;
}

const STRUCTURED_LABELS: Record<keyof StructuredNoteContent, string> = {
  evaluacionSemiologica: "Evaluación semiológica",
  datosExtra: "Datos extras de la consulta",
  diagnosticos: "Diagnósticos",
  diagnosticosEstudio: "Diagnósticos en estudio",
  planFarmacologico: "Plan farmacológico",
  indicaciones: "Indicaciones",
  extras: "Extras",
};

/**
 * Returns true if at least one structured section has text.
 */
export function hasStructuredContent(content: StructuredNoteContent): boolean {
  return Object.values(content).some((value) => value?.trim().length > 0);
}

/**
 * Serializes structured sections into a human-friendly string with headers.
 * Only non-empty sections are included.
 */
export function serializeStructuredNote(content: StructuredNoteContent): string {
  const parts = (Object.keys(STRUCTURED_LABELS) as Array<
    keyof StructuredNoteContent
  >)
    .map((key) => {
      const value = content[key]?.trim();
      if (!value) return null;
      return `${STRUCTURED_LABELS[key]}:\n${value}`;
    })
    .filter((section): section is string => Boolean(section));

  return parts.join("\n\n");
}

/**
 * Builds legacy note fields from structured content to keep backward
 * compatibility with existing persistence (SOAP-like fields).
 */
export function mapStructuredToLegacyFields(
  content: StructuredNoteContent,
  options?: { forceFill?: boolean }
): {
  serializedContent: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
} {
  const serializedContent = serializeStructuredNote(content);

  const subjectiveSections = [
    content.evaluacionSemiologica,
    content.datosExtra,
    content.extras,
  ]
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n\n");

  const assessmentSections = [content.diagnosticos, content.diagnosticosEstudio]
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n\n");

  const planSections = [content.planFarmacologico, content.indicaciones]
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n\n");

  // When forceFill is enabled (e.g., for immediate finalization), ensure
  // assessment/plan are not empty by falling back to the full serialized text.
  const ensureValue = (value: string) =>
    value && value.trim().length > 0
      ? value
      : options?.forceFill
        ? serializedContent
        : undefined;

  return {
    serializedContent,
    subjective: ensureValue(subjectiveSections) ?? undefined,
    assessment: ensureValue(assessmentSections),
    plan: ensureValue(planSections),
  };
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
