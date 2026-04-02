import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqJsonLd } from '@/components/JsonLd'
import MarketingSeoShell from '@/components/MarketingSeoShell'

export const metadata: Metadata = {
  title: 'Integrations | Vantirs',
  description:
    'Payment fraud detection integrations: QuickBooks Online, Slack alerts, and email notifications. Connect Vantirs to the tools your firm already uses—more platforms on the roadmap.',
  alternates: { canonical: '/integrations' },
}

const FAQ_ITEMS = [
  {
    q: 'What is the primary integration for Vantirs?',
    a: 'QuickBooks Online is the primary integration. Vantirs reads vendor and payment history via OAuth to build vendor fingerprints and surface anomalies before you approve or pay.',
  },
  {
    q: 'How do Slack and email work with Vantirs?',
    a: 'You can route fraud and anomaly alerts to Slack channels for fast team visibility, and use email for notifications to stakeholders who live in their inbox.',
  },
  {
    q: 'Will Vantirs support Xero or NetSuite?',
    a: 'Xero and NetSuite are on our roadmap. Today we are optimized for QuickBooks Online; join the waitlist or talk to us about your stack.',
  },
]

function IntegrationCard({
  name,
  badge,
  children,
}: {
  name: string
  badge?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15 md:p-8">
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eff4ff] text-xs font-bold uppercase tracking-wider text-[#003ec7] ring-1 ring-[#c3c5d9]/20"
          aria-hidden
        >
          Logo
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">{name}</h2>
            {badge ? (
              <span className="rounded-full bg-[#eff4ff] px-2.5 py-0.5 text-xs font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20">
                {badge}
              </span>
            ) : null}
          </div>
          <div className="mt-3 text-sm leading-relaxed text-slate-600">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Integrations</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Vantirs integrates with the tools your firm already uses
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Payment fraud detection integrations should meet your team where they work—inside QuickBooks Online for data,
            and in Slack or email when something needs review before pay day.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <IntegrationCard name="QuickBooks Online" badge="Primary">
            <p className="font-medium text-[#0b1c30]">Connect once, sync vendor reality.</p>
            <p className="mt-2">
              OAuth into your QuickBooks Online company. Vantirs pulls vendor profiles and payment history to build
              fingerprints—so when a bank account, email domain, or payment pattern drifts, you see it before the wire.
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>Sign in to Vantirs and choose Connect QuickBooks Online.</li>
              <li>Authorize the company (or client) you want to protect.</li>
              <li>We sync vendors and historical payments to establish baselines.</li>
              <li>High-risk invoices and anomalies surface in the dashboard and your alert channels.</li>
            </ol>
          </IntegrationCard>

          <div className="flex flex-col gap-6">
            <IntegrationCard name="Slack">
              Send real-time fraud and anomaly alerts to a channel your AP team monitors. Great for distributed firms and
              fast questions (“Did anyone change this vendor’s bank?”) before approvals finalize.
            </IntegrationCard>
            <IntegrationCard name="Email">
              Notifications for stakeholders who prefer inbox workflows—forwardable, timestamped context for audit trails
              and partner review.
            </IntegrationCard>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/20 md:p-10">
          <h2 className="font-manrope text-xl font-bold text-[#0b1c30] md:text-2xl">On the roadmap</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            We’re expanding integrations based on firm demand. Next up: deeper alignment with additional accounting
            platforms—starting with <span className="font-semibold text-[#003ec7]">Xero</span> and{' '}
            <span className="font-semibold text-[#003ec7]">NetSuite</span> for teams that need the same verification
            philosophy outside QBO.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-[#c3c5d9]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[10px] font-bold text-[#003ec7]">
                Logo
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30]">Xero</p>
                <p className="text-xs text-slate-600">Planned</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-[#c3c5d9]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[10px] font-bold text-[#003ec7]">
                Logo
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30]">NetSuite</p>
                <p className="text-xs text-slate-600">Planned</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/quickbooks-fraud-prevention" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            QuickBooks fraud prevention
          </Link>
          <span className="text-slate-300">·</span>
          <Link href="/how-it-works" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
            How it works
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
            Start free trial
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
          >
            See how it works
          </Link>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
