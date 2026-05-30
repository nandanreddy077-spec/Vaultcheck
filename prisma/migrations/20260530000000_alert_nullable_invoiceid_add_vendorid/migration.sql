-- Make invoiceId nullable on Alert (vendor-sync alerts have no invoice context)
ALTER TABLE "Alert" ALTER COLUMN "invoiceId" DROP NOT NULL;

-- Add vendorId column for vendor-level bank-change alerts
ALTER TABLE "Alert" ADD COLUMN IF NOT EXISTS "vendorId" TEXT;

-- Index for vendor alert dedup queries (createVendorAlert 24h window)
CREATE INDEX IF NOT EXISTS "Alert_vendorId_type_clientId_idx" ON "Alert"("vendorId", "type", "clientId");

-- General query indexes
CREATE INDEX IF NOT EXISTS "Alert_clientId_status_idx" ON "Alert"("clientId", "status");
CREATE INDEX IF NOT EXISTS "Alert_severity_idx" ON "Alert"("severity");

-- Foreign key from Alert.vendorId -> Vendor.id (optional — vendorId may be null)
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_vendorId_fkey"
  FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id")
  ON DELETE SET NULL ON UPDATE CASCADE
  NOT VALID;

VALIDATE CONSTRAINT "Alert_vendorId_fkey";
