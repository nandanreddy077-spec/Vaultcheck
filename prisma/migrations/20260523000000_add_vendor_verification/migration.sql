-- CreateTable
CREATE TABLE IF NOT EXISTS "VendorVerification" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "firmId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedBy" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "confirmedName" TEXT,
    "confirmedEmail" TEXT,
    "confirmedBankAccount" TEXT,
    "confirmedRoutingNumber" TEXT,
    "confirmedPhone" TEXT,
    "ipAddress" TEXT,
    "notes" TEXT,

    CONSTRAINT "VendorVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "VendorVerification_token_key" ON "VendorVerification"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VendorVerification_token_idx" ON "VendorVerification"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VendorVerification_vendorId_idx" ON "VendorVerification"("vendorId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "VendorVerification_firmId_idx" ON "VendorVerification"("firmId");

-- AddForeignKey
ALTER TABLE "VendorVerification" ADD CONSTRAINT "VendorVerification_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
