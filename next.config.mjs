import { withSentryConfig } from '@sentry/nextjs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Same rules as lib/supabase/normalize-supabase-url.ts — fixes `//project.supabase.co` in Vercel env. */
function normalizePublicUrl(raw) {
  if (!raw || typeof raw !== 'string') return raw
  const t = raw.trim()
  if (t.startsWith('//')) return `https:${t}`
  if (!/^https?:\/\//i.test(t)) return `https://${t.replace(/^\/+/, '')}`
  return t
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const appUrl = process.env.NEXT_PUBLIC_APP_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Only set keys that exist — setting `undefined` can break Next's env inlining vs Vercel's real values.
  env: {
    ...(supabaseUrl && { NEXT_PUBLIC_SUPABASE_URL: normalizePublicUrl(supabaseUrl) }),
    ...(anonKey && { NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey }),
    ...(appUrl && { NEXT_PUBLIC_APP_URL: normalizePublicUrl(appUrl) }),
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // disableLogger removed — use webpack.treeshake.removeDebugLogging (Turbopack handles automatically)
  // automaticVercelMonitors removed — configure in Sentry dashboard instead
})
