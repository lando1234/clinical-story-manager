-- Add optional prescription_renewal_period column to medications
ALTER TABLE "medications"
ADD COLUMN "prescription_renewal_period" INTEGER NULL;

