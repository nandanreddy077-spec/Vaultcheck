/**
 * Runs before other app code so `process.env` is safe for `new URL()` / Supabase.
 * Next may inline NEXT_PUBLIC_* at compile time; mutating env still fixes many server paths.
 */
import { normalizeSupabaseUrl } from '@/lib/supabase/normalize-supabase-url'

function patch() {
  if (typeof process === 'undefined') return
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (u) process.env.NEXT_PUBLIC_SUPABASE_URL = normalizeSupabaseUrl(u)
  const app = process.env.NEXT_PUBLIC_APP_URL
  if (app) process.env.NEXT_PUBLIC_APP_URL = normalizeSupabaseUrl(app)
}

patch()
