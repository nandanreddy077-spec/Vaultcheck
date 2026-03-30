/**
 * Ensures Supabase project URL always has https: — required by `new URL()` and @supabase/supabase-js.
 * Keep in sync with usage in next.config.mjs (build-time env injection).
 */
export function normalizeSupabaseUrl(raw: string | undefined): string {
  if (raw == null || raw === '') return ''
  const t = raw.trim()
  if (t.startsWith('//')) return `https:${t}`
  if (!/^https?:\/\//i.test(t)) return `https://${t.replace(/^\/+/, '')}`
  return t
}
