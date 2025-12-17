-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('Draft', 'Finalized');

-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('Active', 'Discontinued');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('Scheduled', 'Completed', 'Cancelled', 'NoShow');

-- CreateEnum
CREATE TYPE "EncounterType" AS ENUM ('InitialEvaluation', 'FollowUp', 'CrisisIntervention', 'MedicationReview', 'TherapySession', 'PhoneConsultation', 'Other');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('InitialEvaluation', 'FollowUp', 'CrisisIntervention', 'MedicationReview', 'TherapySession', 'PhoneConsultation', 'Other');

-- CreateEnum
CREATE TYPE "ClinicalEventType" AS ENUM ('Encounter', 'MedicationStart', 'MedicationChange', 'MedicationStop', 'Hospitalization', 'LifeEvent', 'HistoryUpdate', 'Other');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('Note', 'Medication', 'PsychiatricHistory', 'Manual');

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "address" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "emergency_contact_relationship" TEXT,
    "status" "PatientStatus" NOT NULL DEFAULT 'Active',
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_records" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psychiatric_histories" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "chief_complaint" TEXT,
    "history_of_present_illness" TEXT,
    "past_psychiatric_history" TEXT,
    "past_hospitalizations" TEXT,
    "suicide_attempt_history" TEXT,
    "substance_use_history" TEXT,
    "family_psychiatric_history" TEXT,
    "medical_history" TEXT,
    "surgical_history" TEXT,
    "allergies" TEXT,
    "social_history" TEXT,
    "developmental_history" TEXT,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "superseded_at" TIMESTAMP(3),

    CONSTRAINT "psychiatric_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "encounter_date" DATE NOT NULL,
    "encounter_type" "EncounterType" NOT NULL,
    "status" "NoteStatus" NOT NULL DEFAULT 'Draft',
    "subjective" TEXT,
    "objective" TEXT,
    "assessment" TEXT,
    "plan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalized_at" TIMESTAMP(3),

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addenda" (
    "id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "drug_name" TEXT NOT NULL,
    "dosage" DECIMAL(10,2) NOT NULL,
    "dosage_unit" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "route" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "prescribing_reason" TEXT NOT NULL,
    "discontinuation_reason" TEXT,
    "status" "MedicationStatus" NOT NULL DEFAULT 'Active',
    "predecessor_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_events" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "event_date" DATE NOT NULL,
    "event_type" "ClinicalEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source_type" "SourceType",
    "source_id" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note_id" TEXT,
    "medication_id" TEXT,
    "psychiatric_history_id" TEXT,

    CONSTRAINT "clinical_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "scheduled_date" DATE NOT NULL,
    "scheduled_time" TIME,
    "duration_minutes" INTEGER,
    "appointment_type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'Scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinical_records_patient_id_key" ON "clinical_records"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "psychiatric_histories_clinical_record_id_version_number_key" ON "psychiatric_histories"("clinical_record_id", "version_number");

-- AddForeignKey
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psychiatric_histories" ADD CONSTRAINT "psychiatric_histories_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addenda" ADD CONSTRAINT "addenda_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_predecessor_id_fkey" FOREIGN KEY ("predecessor_id") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_events" ADD CONSTRAINT "clinical_events_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_events" ADD CONSTRAINT "clinical_events_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_events" ADD CONSTRAINT "clinical_events_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_events" ADD CONSTRAINT "clinical_events_psychiatric_history_id_fkey" FOREIGN KEY ("psychiatric_history_id") REFERENCES "psychiatric_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

