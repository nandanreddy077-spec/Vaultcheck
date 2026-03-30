# Supabase Row-Level Security (RLS)

This folder contains SQL you can execute in your Supabase project to enable Row-Level Security.

## How to apply
1. In Supabase, open **SQL Editor**.
2. Select your database/schema.
3. Run `supabase/rls.sql`.
4. (Optional) After validating access works via the Supabase client, you can add `FORCE ROW LEVEL SECURITY`
   for stricter enforcement.

## Notes
- Vantirs uses Prisma for data access in this repo. Depending on your database user/role configuration,
  Prisma queries may bypass RLS (e.g., if the role owns tables and RLS isn’t forced).
- The policies below are designed to scope rows to `auth.uid()` via the `User.supabaseUid` column.

