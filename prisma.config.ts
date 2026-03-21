// Prisma 7 config — connection URLs live here, NOT in schema.prisma
// dotenv loads .env locally; on Vercel env vars are injected natively
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DATABASE_URL must be set in Vercel dashboard (or .env locally)
    // Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
    url: process.env["DATABASE_URL"] ?? "",
  },
});
