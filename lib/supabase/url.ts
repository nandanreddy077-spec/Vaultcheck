/**
 * @supabase/ssr resolves the project URL with `new URL()`, which requires a scheme.
 * Env values like `//xxx.supabase.co` (missing `https:`) must be normalized.
 */
export function getSupabaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!raw) return ''
  if (raw.startsWith('//')) return `https:${raw}`
  if (!/^https?:\/\//i.test(raw)) return `https://${raw.replace(/^\/+/, '')}`
  return raw
}
