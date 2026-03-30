import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { getSiteUrl } from '@/lib/site-url'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const title = 'Vantirs — Payment Verification for Accounting Firms'
const description =
  'Vantirs connects to QuickBooks Online, builds vendor fingerprints, and flags suspicious invoices before your clients pay—so accounting firms can stop BEC and vendor fraud before money leaves the account.'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Vantirs',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased bg-[#f8f9ff] text-[#0b1c30]`}>
        {children}
      </body>
    </html>
  )
}
