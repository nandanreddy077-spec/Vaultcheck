import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

type RoleSlug =
  | 'cfos'
  | 'accountants'
  | 'bookkeepers'
  | 'ap-managers'
  | 'controllers'
  | 'outsourced-cfo-firms'
  | 'cpa-firms'

export const ROLES: Record<
  RoleSlug,
  { name: string; painPoints: string; features: string[]; faq: { q: string; a: string }[] }
> = {
  cfos: {
    name: 'CFOs',
    painPoints:
      'You own financial integrity and cash-out risk. Vendor fraud and payment errors can erase quarters of work in a single wire—and boards ask what controls existed before the loss.',
    features: [
      'Executive-ready visibility into vendor and payment anomalies',
      'Defensible controls anchored in QuickBooks Online data',
      'Less firefighting from BEC and duplicate-payment incidents',
    ],
    faq: [
      {
        q: 'What should a CFO prioritize for AP fraud risk?',
        a: 'Prioritize controls that compare new payment requests to established vendor behavior—bank details, amounts, and domains—so exceptions are evidence-based.',
      },
      {
        q: 'How does Vantirs support CFO oversight without another dashboard silo?',
        a: 'Vantirs works inside the QuickBooks Online payment path and surfaces alerts where your team already operates, with Slack and email options.',
      },
    ],
  },
  accountants: {
    name: 'Accountants',
    painPoints:
      'You reconcile, classify, and explain every exception. Fraudulent or duplicate invoices create rework, client questions, and professional exposure when something slips through.',
    features: [
      'Vendor-context alerts before bills are paid',
      'Clearer tie-out between invoices and historical vendor behavior',
      'Better documentation when clients ask “how did we miss this?”',
    ],
    faq: [
      {
        q: 'How can accountants reduce fraud risk without reviewing every invoice the same way?',
        a: 'Use vendor fingerprinting so routine vendors flow through while true anomalies surface for review.',
      },
      {
        q: 'Does Vantirs change how I work in QuickBooks?',
        a: 'You keep your QBO workflow; Vantirs adds verification signals and alerts on top of your existing processes.',
      },
    ],
  },
  bookkeepers: {
    name: 'Bookkeepers',
    painPoints:
      'You move fast through high invoice volume. A convincing fake bill or a changed bank account can look like normal work—until it is too late.',
    features: [
      'Flags when vendor details diverge from how you have paid them before',
      'Lightweight review queue instead of second-guessing every bill',
      'Protection during busy season when mistakes are most costly',
    ],
    faq: [
      {
        q: 'Will fraud tools slow down my daily bookkeeping?',
        a: 'Vantirs is designed to reduce manual doubt-checking by highlighting exceptions that break vendor history—not every line item.',
      },
      {
        q: 'What if my client uses multiple banks or entities?',
        a: 'Connect each QuickBooks Online company separately so fingerprints stay accurate per client.',
      },
    ],
  },
  'ap-managers': {
    name: 'AP managers',
    painPoints:
      'You balance speed, vendor relationships, and control. Teams need consistent rules that still let legitimate vendors get paid on time.',
    features: [
      'Standardized fraud signals across staff and clients',
      'Bank and email-domain checks tied to vendor history',
      'Easier coaching: “here is why this invoice was flagged”',
    ],
    faq: [
      {
        q: 'How do AP managers use Vantirs in practice?',
        a: 'Flags appear before release of funds, with context from QuickBooks payment history so approvers can decide quickly.',
      },
      {
        q: 'Can we enforce review for certain vendors only?',
        a: 'Risk surfaces automatically when behavior diverges from the vendor fingerprint—so high-risk changes get attention without blanket holds.',
      },
    ],
  },
  controllers: {
    name: 'Controllers',
    painPoints:
      'You close the books and attest to controls. Payment fraud creates restatement risk, audit pain, and tense conversations with ownership.',
    features: [
      'Stronger preventive controls over outbound payments',
      'Audit-friendly signals: what changed and why it mattered',
      'Consistency across entities on QuickBooks Online',
    ],
    faq: [
      {
        q: 'What control gap do controllers see most often?',
        a: 'One-off email approvals for bank changes without verifying against prior successful payments—a gap Vantirs addresses directly.',
      },
      {
        q: 'Does Vantirs log activity for review?',
        a: 'Alerts are tied to vendor and invoice context in QBO so reviews are traceable and explainable.',
      },
    ],
  },
  'outsourced-cfo-firms': {
    name: 'Outsourced CFO firms',
    painPoints:
      'You advise multiple clients with different AP maturity. You need scalable fraud protection that does not require a custom security program at every client.',
    features: [
      'Repeatable vendor verification across your client portfolio',
      'Position security as part of your fractional CFO value',
      'Per-client QuickBooks Online connections via OAuth',
    ],
    faq: [
      {
        q: 'How do outsourced CFO firms roll out Vantirs?',
        a: 'Connect each client’s QuickBooks Online company; vendor intelligence stays scoped per client.',
      },
      {
        q: 'Is this only for large clients?',
        a: 'Mid-market and growth companies are often targeted precisely because controls are lighter—Vantirs brings proportional protection.',
      },
    ],
  },
  'cpa-firms': {
    name: 'CPA firms',
    painPoints:
      'You are trusted with client money and reputational risk. A single fraud incident can damage the firm brand and trigger professional liability concerns.',
    features: [
      'Fraud prevention aligned with how firms already use QuickBooks Online',
      'Supports advisory and outsourced AP services',
      'Demonstrable diligence for clients who ask about payment security',
    ],
    faq: [
      {
        q: 'Why are CPA firms targeted for payment fraud?',
        a: 'Firms aggregate access to many clients’ finances; one compromised inbox or rushed approval can move significant funds.',
      },
      {
        q: 'Does Vantirs replace professional judgment?',
        a: 'No—it augments your team with data-backed signals so judgment is applied where risk is highest.',
      },
    ],
  },
}

const ROLE_SLUGS = Object.keys(ROLES) as RoleSlug[]

export function generateStaticParams() {
  return ROLE_SLUGS.map(role => ({ role }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>
}): Promise<Metadata> {
  const { role } = await params
  const entry = ROLES[role as RoleSlug]
  if (!entry) {
    return { title: 'Fraud prevention by role | Vantirs' }
  }
  const title = `Fraud Prevention for ${entry.name} | Vantirs`
  const description =
    entry.painPoints.length > 155 ? `${entry.painPoints.slice(0, 152)}…` : entry.painPoints
  return {
    title,
    description,
    alternates: { canonical: `/for/${role}` },
  }
}

export default async function ForRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const data = ROLES[role as RoleSlug]
  if (!data) {
    notFound()
  }

  return (
    <MarketingSeoShell>
      <FaqJsonLd items={data.faq} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">By role</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Fraud prevention for {data.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{data.painPoints}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link
                href="/roi-calculator"
                className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                ROI calculator
              </Link>
            </div>

            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Related</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                <li>
                  <Link href="/for-accounting-firms" className="text-[#003ec7] hover:text-[#0032a3]">
                    For accounting firms →
                  </Link>
                </li>
                <li>
                  <Link href="/quickbooks-fraud-prevention" className="text-[#003ec7] hover:text-[#0032a3]">
                    QuickBooks fraud prevention →
                  </Link>
                </li>
                <li>
                  <Link href="/roi-calculator" className="text-[#003ec7] hover:text-[#0032a3]">
                    ROI calculator →
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-[#003ec7] hover:text-[#0032a3]">
                    Sign up →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#eff4ff] p-6 text-[#003ec7] ring-1 ring-[#c3c5d9]/20">
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">What {data.name} get with Vantirs</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#0b1c30]">
              {data.features.map(line => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/for" className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline">
                Browse all roles →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
