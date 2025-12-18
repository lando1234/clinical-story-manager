-- AlterEnum: Add 'Foundational' and 'NOTE' to ClinicalEventType if they don't exist
-- Note: PostgreSQL doesn't support adding enum values in the middle, so we need to check if they exist first
-- If they don't exist, we'll add them at the end
DO $$ 
BEGIN
  -- Add 'Foundational' if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Foundational' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ClinicalEventType')) THEN
    ALTER TYPE "ClinicalEventType" ADD VALUE 'Foundational';
  END IF;
  
  -- Add 'NOTE' if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'NOTE' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ClinicalEventType')) THEN
    ALTER TYPE "ClinicalEventType" ADD VALUE 'NOTE';
  END IF;
END $$;

-- AlterEnum: Add 'Appointment' to SourceType
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Appointment' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'SourceType')) THEN
    ALTER TYPE "SourceType" ADD VALUE 'Appointment';
  END IF;
END $$;

-- AlterTable: Add appointment_id column to clinical_events
ALTER TABLE "clinical_events" ADD COLUMN IF NOT EXISTS "appointment_id" TEXT;

-- AddForeignKey: Add foreign key constraint for appointment_id
ALTER TABLE "clinical_events" ADD CONSTRAINT "clinical_events_appointment_id_fkey" 
  FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
