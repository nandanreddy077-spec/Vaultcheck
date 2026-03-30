import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

const paths = ['/', '/login', '/signup', '/privacy', '/terms'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const now = new Date()
  return paths.map(path => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: path === '/' ? 1 : 0.6,
  }))
}
