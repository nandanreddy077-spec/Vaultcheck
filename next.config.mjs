import { withSentryConfig } from '@sentry/nextjs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Explicitly inline NEXT_PUBLIC_ vars so Turbopack always finds them
  // even when it mis-detects the workspace root (caused by a stray package.json
  // at the home directory from another project)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
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
