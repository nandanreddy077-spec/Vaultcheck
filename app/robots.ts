import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

const FALLBACK_SITE_URL = 'https://www.vantirs.com'

export default function robots(): MetadataRoute.Robots {
  // Keep robots fail-safe so crawlers can always find sitemap.
  const base = getSiteUrl() || FALLBACK_SITE_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
