import { getSiteUrl } from '@/lib/site-url'

const siteUrl = getSiteUrl()

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vantirs',
    url: siteUrl,
    logo: `${siteUrl}/vantirs-logo-wordmark.png`,
    description:
      'Vantirs connects to QuickBooks Online, builds vendor fingerprints, and flags suspicious invoices before your clients pay.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@vantirs.com',
      contactType: 'sales',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function SoftwareApplicationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vantirs',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description:
      'Vendor payment verification and invoice fraud detection for accounting firms on QuickBooks Online.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '79',
      highPrice: '299',
      offerCount: '3',
    },
    featureList: [
      'Vendor fingerprinting',
      'Bank account mismatch detection',
      'Email domain spoofing alerts',
      'QuickBooks Online integration',
      'Real-time fraud alerts via Slack and email',
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebPageJsonLd({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Vantirs',
      url: siteUrl,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
