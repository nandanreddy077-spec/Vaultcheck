-- Make invoiceId nullable (idempotent: skip if already nullable)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Alert' AND column_name = 'invoiceId' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE "Alert" ALTER COLUMN "invoiceId" DROP NOT NULL;
  END IF;
END $$;

-- Add vendorId column for vendor-level bank-change alerts
ALTER TABLE "Alert" ADD COLUMN IF NOT EXISTS "vendorId" TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS "Alert_vendorId_type_clientId_idx" ON "Alert"("vendorId", "type", "clientId");
CREATE INDEX IF NOT EXISTS "Alert_clientId_status_idx" ON "Alert"("clientId", "status");
CREATE INDEX IF NOT EXISTS "Alert_severity_idx" ON "Alert"("severity");

-- Foreign key Alert.vendorId -> Vendor.id (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'Alert' AND constraint_name = 'Alert_vendorId_fkey'
  ) THEN
    ALTER TABLE "Alert" ADD CONSTRAINT "Alert_vendorId_fkey"
      FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
