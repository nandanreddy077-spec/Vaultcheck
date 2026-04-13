import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-static'

export function GET() {
  const siteUrl = getSiteUrl()
  const content = [
    '# Vantirs',
    '',
    'Vantirs is payment fraud prevention software for accounting firms and AP teams using QuickBooks Online.',
    '',
    '## Core capabilities',
    '- Vendor bank account verification before payment release',
    '- Invoice fraud detection using vendor history and anomaly signals',
    '- BEC and vendor impersonation risk detection at approval time',
    '- Defensible pre-payment review workflows for controllers and CFOs',
    '',
    '## Primary audience',
    '- Accounting firms managing client payments',
    '- AP managers, controllers, and CFOs at SMB and mid-market companies',
    '',
    '## Canonical URLs',
    `- ${siteUrl}/`,
    `- ${siteUrl}/vendor-fraud-detection-software`,
    `- ${siteUrl}/accounts-payable-fraud-prevention`,
    `- ${siteUrl}/invoice-fraud-detection`,
    `- ${siteUrl}/bec-fraud-prevention`,
    `- ${siteUrl}/nacha-2026-compliance`,
    `- ${siteUrl}/what-is-vantirs`,
    `- ${siteUrl}/blog`,
    '',
    '## Key educational resources',
    `- ${siteUrl}/blog/vendor-bank-account-change-fraud`,
    `- ${siteUrl}/blog/ai-generated-fake-invoices`,
    `- ${siteUrl}/blog/nacha-2026-ach-fraud-monitoring-compliance`,
  ].join('\n')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
