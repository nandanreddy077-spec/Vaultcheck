/**
 * Canonical origin for metadata, sitemap, and robots.
 * Set NEXT_PUBLIC_APP_URL in Vercel (e.g. https://www.vantirs.com) so previews match production.
 */
export function getSiteUrl(): string {
  const fallback = 'https://www.vantirs.com'
  const raw = process.env.NEXT_PUBLIC_APP_URL
  if (!raw) return fallback
  try {
    const origin = new URL(raw).origin
    // If env accidentally points to a Vercel preview host, sitemap/robots will break indexing.
    // Force production canonical for SEO.
    if (origin.includes('vercel.app') || origin.includes('vaultcheck-')) {
      return fallback
    }
    return origin
  } catch {
    return fallback
  }
}
