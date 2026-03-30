/**
 * Canonical origin for metadata, sitemap, and robots.
 * Set NEXT_PUBLIC_APP_URL in Vercel (e.g. https://www.vantirs.com) so previews match production.
 */
export function getSiteUrl(): string {
  const fallback = 'https://www.vantirs.com'
  const raw = process.env.NEXT_PUBLIC_APP_URL
  if (!raw) return fallback
  try {
    return new URL(raw).origin
  } catch {
    return fallback
  }
}
