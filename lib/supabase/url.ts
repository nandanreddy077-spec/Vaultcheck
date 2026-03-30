import { normalizeSupabaseUrl } from '@/lib/supabase/normalize-supabase-url'

/**
 * Runtime URL for Supabase clients. Prefer next.config env normalization at build time;
 * this covers tests and any code that bypasses Next's env injection.
 */
export function getSupabaseUrl(): string {
  return normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
}
