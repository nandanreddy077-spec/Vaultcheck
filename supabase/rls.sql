-- VaultCheck RLS policies
--
-- Assumes Prisma created tables with the following column names:
-- Firm(id, email, ...)
-- User(id, supabaseUid, firmId, ...)
-- Client(id, firmId, ...)
-- Vendor(id, clientId, ...)
-- VendorFingerprint(id, vendorId, ...)
-- Invoice(id, clientId, vendorId, ...)
-- Alert(id, clientId, invoiceId, ...)
-- AuditLog(id, firmId, clientId, userId, ...)
--
-- IMPORTANT:
-- 1) Run this in Supabase SQL Editor.
-- 2) Verify with the Supabase client using RLS before forcing enforcement.

-- Helpful helper expressions (kept inline for compatibility).

-- ─────────────────────────────────────────────────────────────────────────────
-- Firm
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Firm" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Firm_select_own_firm" ON "Firm";
CREATE POLICY "Firm_select_own_firm"
  ON "Firm"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "User" u
      WHERE u."firmId" = "Firm"."id"
        AND u."supabaseUid" = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Firm_update_own_firm" ON "Firm";
CREATE POLICY "Firm_update_own_firm"
  ON "Firm"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM "User" u
      WHERE u."firmId" = "Firm"."id"
        AND u."supabaseUid" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "User" u
      WHERE u."firmId" = "Firm"."id"
        AND u."supabaseUid" = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- User
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User_select_own_firm" ON "User";
CREATE POLICY "User_select_own_firm"
  ON "User"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "User" me
      WHERE me."supabaseUid" = auth.uid()
        AND me."firmId" = "User"."firmId"
    )
  );

DROP POLICY IF EXISTS "User_update_own_firm" ON "User";
CREATE POLICY "User_update_own_firm"
  ON "User"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM "User" me
      WHERE me."supabaseUid" = auth.uid()
        AND me."firmId" = "User"."firmId"
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "User" me
      WHERE me."supabaseUid" = auth.uid()
        AND me."firmId" = "User"."firmId"
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Client
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Client_select_own_firm" ON "Client";
CREATE POLICY "Client_select_own_firm"
  ON "Client"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "User" u
      WHERE u."firmId" = "Client"."firmId"
        AND u."supabaseUid" = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Client_update_own_firm" ON "Client";
CREATE POLICY "Client_update_own_firm"
  ON "Client"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM "User" u
      WHERE u."firmId" = "Client"."firmId"
        AND u."supabaseUid" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "User" u
      WHERE u."firmId" = "Client"."firmId"
        AND u."supabaseUid" = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Vendor
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Vendor" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vendor_select_own_firm" ON "Vendor";
CREATE POLICY "Vendor_select_own_firm"
  ON "Vendor"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "Client" c
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE c."id" = "Vendor"."clientId"
        AND u."supabaseUid" = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Vendor_update_own_firm" ON "Vendor";
CREATE POLICY "Vendor_update_own_firm"
  ON "Vendor"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM "Client" c
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE c."id" = "Vendor"."clientId"
        AND u."supabaseUid" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "Client" c
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE c."id" = "Vendor"."clientId"
        AND u."supabaseUid" = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- VendorFingerprint
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "VendorFingerprint" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "VendorFingerprint_select_own_firm" ON "VendorFingerprint";
CREATE POLICY "VendorFingerprint_select_own_firm"
  ON "VendorFingerprint"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "Vendor" v
      JOIN "Client" c
        ON c."id" = v."clientId"
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE v."id" = "VendorFingerprint"."vendorId"
        AND u."supabaseUid" = auth.uid()
    )
  );

-- (Optional) Updates are not created via Supabase client in this repo;
-- keep UPDATE policies out until you need them.

-- ─────────────────────────────────────────────────────────────────────────────
-- Invoice
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Invoice_select_own_firm" ON "Invoice";
CREATE POLICY "Invoice_select_own_firm"
  ON "Invoice"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "Client" c
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE c."id" = "Invoice"."clientId"
        AND u."supabaseUid" = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Alert
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Alert" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Alert_select_own_firm" ON "Alert";
CREATE POLICY "Alert_select_own_firm"
  ON "Alert"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "Client" c
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE c."id" = "Alert"."clientId"
        AND u."supabaseUid" = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Alert_update_own_firm" ON "Alert";
CREATE POLICY "Alert_update_own_firm"
  ON "Alert"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM "Client" c
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE c."id" = "Alert"."clientId"
        AND u."supabaseUid" = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "Client" c
      JOIN "User" u
        ON u."firmId" = c."firmId"
      WHERE c."id" = "Alert"."clientId"
        AND u."supabaseUid" = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- AuditLog
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AuditLog_select_own_firm" ON "AuditLog";
CREATE POLICY "AuditLog_select_own_firm"
  ON "AuditLog"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM "User" u
      WHERE u."firmId" = "AuditLog"."firmId"
        AND u."supabaseUid" = auth.uid()
    )
  );

-- End

