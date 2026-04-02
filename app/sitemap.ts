import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

const paths = [
  '/',
  '/blog',
  // Core SEO landing pages (marketing surface)
  '/vendor-verification-software',
  '/invoice-fraud-detection',
  '/quickbooks-fraud-prevention',
  '/for-accounting-firms',
  '/accounts-payable-fraud-prevention',
  '/bec-fraud-prevention',
  '/vendor-verification-vs-manual',
  '/pricing',
  '/roi-calculator',
  '/vs-trustpair',
  '/how-it-works',
  // Blog posts (first batch)
  '/blog/vendor-fraud-cost-accounting-firms',
  '/blog/how-to-detect-fake-invoices',
  '/blog/bec-attacks-accounting-firms',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always generate sitemap against canonical marketing domain.
  const base = getSiteUrl()
  const nowIso = new Date().toISOString()
  return paths.map(path => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified: nowIso,
    changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: path === '/' ? 1 : 0.6,
  }))
}
