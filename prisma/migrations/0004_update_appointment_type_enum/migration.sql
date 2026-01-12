-- Update AppointmentType enum to new clinical categories
-- Note: data mapping uses best-effort defaults; adjust if you need different mappings.

ALTER TYPE "AppointmentType" RENAME TO "AppointmentType_old";

CREATE TYPE "AppointmentType" AS ENUM (
  'Psicoterapia',
  'OrientacionFamiliar',
  'LlamadoProgramado',
  'LlamadoEnCrisis',
  'SesionGrupal',
  'Taller',
  'EntrevistaAdmision',
  'Evaluacion',
  'LlamadoColegio'
);

ALTER TABLE "appointments"
  ALTER COLUMN "appointment_type" TYPE "AppointmentType" USING (
    CASE "appointment_type"::text
      WHEN 'InitialEvaluation' THEN 'Evaluacion'
      WHEN 'FollowUp' THEN 'Psicoterapia'
      WHEN 'CrisisIntervention' THEN 'LlamadoEnCrisis'
      WHEN 'MedicationReview' THEN 'Evaluacion'
      WHEN 'TherapySession' THEN 'Psicoterapia'
      WHEN 'PhoneConsultation' THEN 'LlamadoProgramado'
      WHEN 'Other' THEN 'Psicoterapia'
      ELSE 'Psicoterapia'
    END
  )::"AppointmentType";

DROP TYPE "AppointmentType_old";

