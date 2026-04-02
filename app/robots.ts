import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Always generate robots against canonical marketing domain.
  const base = getSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
