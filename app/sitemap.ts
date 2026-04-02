import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

const paths = [
  '/',
  '/blog',
  // Core SEO landing pages
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
  // Blog posts
  '/blog/vendor-fraud-cost-accounting-firms',
  '/blog/how-to-detect-fake-invoices',
  '/blog/bec-attacks-accounting-firms',
  '/blog/quickbooks-security-gaps',
  '/blog/vendor-verification-checklist',
  '/blog/types-of-ap-fraud',
  '/blog/vendor-fraud-insurance',
  '/blog/ap-automation-vs-fraud-prevention',
  '/blog/spoofed-email-cost',
  '/blog/vendor-bank-verification-guide',
  // Competitor alternative + CFO + integrations pages
  '/eftsure-alternative',
  '/trustpair-alternative',
  '/cfo-payment-fraud-prevention',
  '/integrations',
  // Hub pages (programmatic SEO)
  '/invoice-fraud',
  '/prevent',
  '/quickbooks',
  '/for',
  // Invoice fraud by industry
  '/invoice-fraud/healthcare',
  '/invoice-fraud/construction',
  '/invoice-fraud/real-estate',
  '/invoice-fraud/legal-services',
  '/invoice-fraud/nonprofit',
  '/invoice-fraud/manufacturing',
  '/invoice-fraud/professional-services',
  '/invoice-fraud/government-contracting',
  '/invoice-fraud/retail',
  '/invoice-fraud/logistics',
  // Fraud prevention by attack type
  '/prevent/vendor-impersonation',
  '/prevent/duplicate-invoice-fraud',
  '/prevent/bank-change-fraud',
  '/prevent/ghost-vendor-schemes',
  '/prevent/payment-diversion',
  '/prevent/email-spoofing',
  '/prevent/overbilling',
  '/prevent/check-fraud',
  // QuickBooks-specific problems
  '/quickbooks/vendor-fraud-prevention',
  '/quickbooks/duplicate-payment-detection',
  '/quickbooks/bank-verification',
  '/quickbooks/invoice-validation',
  '/quickbooks/payment-security',
  '/quickbooks/vendor-management',
  // Fraud prevention by role
  '/for/cfos',
  '/for/accountants',
  '/for/bookkeepers',
  '/for/ap-managers',
  '/for/controllers',
  '/for/outsourced-cfo-firms',
  '/for/cpa-firms',
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
