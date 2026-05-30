import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { WebPageJsonLd } from '@/components/JsonLd'
import { getSiteUrl } from '@/lib/site-url'

const pageTitle = 'NACHA 2026 ACH Fraud Monitoring Compliance for AP Teams | Vantirs'
const pageDescription =
  'NACHA Phase 2 (June 22, 2026) may apply to firms that originate ACH payments for clients. See what the rule covers and how AP teams can build defensible fraud monitoring controls.'

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: '/nacha-2026-compliance' },
  keywords: [
    'NACHA 2026 ACH fraud monitoring requirements',
    'accounts payable NACHA compliance 2026',
    'vendor bank account verification NACHA rule',
  ],
}

export default function NachaComplianceLandingPage() {
  const url = `${getSiteUrl()}/nacha-2026-compliance`

  return (
    <MarketingSeoShell>
      <WebPageJsonLd title={pageTitle} description={pageDescription} url={url} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">NACHA 2026 compliance</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            NACHA Phase 2 is live June 22, 2026. Build defensible ACH fraud controls now.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            NACHA&apos;s Phase 2 fraud monitoring rule may apply to your firm depending on your ODFI relationship and
            ACH origination volume. Whether or not the rule applies directly, firms processing client AP benefit from
            a risk-based process that verifies payment instructions before ACH release and leaves a defensible audit trail.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-lg font-bold text-[#0b1c30]">What the rule requires</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              A documented, risk-based fraud monitoring process for ACH entries, including procedures to detect and
              respond to suspicious activity.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-lg font-bold text-[#0b1c30]">What it means for AP</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Teams need stronger controls around vendor bank changes, payment-instruction anomalies, and approval
              evidence that can be reviewed later.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-lg font-bold text-[#0b1c30]">How Vantirs helps</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Vantirs automates pre-payment fraud signals in your AP workflow and records why invoices were approved,
              rejected, or escalated.
            </p>
          </article>
        </div>

        <section className="mt-12 rounded-[2rem] bg-[#eff4ff] p-8 ring-1 ring-[#c3c5d9]/15">
          <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Build your ACH fraud controls before June 22</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Assess current ACH fraud controls and identify gaps.</li>
            <li>Implement verification for vendor bank detail changes.</li>
            <li>Track and retain fraud-review evidence for audit readiness.</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Book a demo
            </Link>
            <Link
              href="/blog/nacha-2026-ach-fraud-monitoring-compliance"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#f8f9ff]"
            >
              Read the AP compliance guide
            </Link>
          </div>
        </section>
      </section>
    </MarketingSeoShell>
  )
}
