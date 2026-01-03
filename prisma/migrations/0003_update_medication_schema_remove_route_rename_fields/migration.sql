-- AlterTable: Remove route column, rename start_date to prescription_issue_date, rename prescribing_reason to comments (nullable)
-- This migration updates the Medication model according to spec: docs/specs/02_events/22_cambios_medicacion_actualizacion.md

-- Step 1: Rename start_date to prescription_issue_date
ALTER TABLE "medications" RENAME COLUMN "start_date" TO "prescription_issue_date";

-- Step 2: Rename prescribing_reason to comments and make it nullable
ALTER TABLE "medications" RENAME COLUMN "prescribing_reason" TO "comments";
ALTER TABLE "medications" ALTER COLUMN "comments" DROP NOT NULL;

-- Step 3: Remove route column
ALTER TABLE "medications" DROP COLUMN IF EXISTS "route";

-- Step 4: Add MedicationPrescriptionIssued to ClinicalEventType enum
-- Note: This enum change requires special handling in PostgreSQL
-- We'll add the new value to the existing enum
DO $$ BEGIN
    ALTER TYPE "ClinicalEventType" ADD VALUE IF NOT EXISTS 'MedicationPrescriptionIssued';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

