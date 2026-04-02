import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

type ProblemSlug =
  | 'vendor-fraud-prevention'
  | 'duplicate-payment-detection'
  | 'bank-verification'
  | 'invoice-validation'
  | 'payment-security'
  | 'vendor-management'

export const PROBLEMS: Record<
  ProblemSlug,
  { name: string; description: string; solution: string; faq: { q: string; a: string }[] }
> = {
  'vendor-fraud-prevention': {
    name: 'Vendor fraud prevention',
    description:
      'Stop fake vendors and BEC-style payment requests before they leave your QuickBooks Online books. Compare new payment details to how each vendor actually paid in the past.',
    solution:
      'Vantirs fingerprints vendors from QBO payment history and surfaces mismatches in bank details, email domains, and invoice patterns—so your team reviews the exceptions that matter.',
    faq: [
      {
        q: 'How does vendor fraud show up in QuickBooks Online?',
        a: 'Attackers often impersonate real vendors with new bank instructions or spoofed email domains. Without history-based checks, those changes can look routine until money is gone.',
      },
      {
        q: 'How does Vantirs reduce vendor fraud risk in QBO?',
        a: 'We anchor alerts to each vendor’s established payment fingerprint in QuickBooks, so new or inconsistent requests are flagged with context—not generic scores.',
      },
    ],
  },
  'duplicate-payment-detection': {
    name: 'Duplicate payment detection',
    description:
      'Catch duplicate bills and repeat payouts that slip through during close or busy season—especially when invoice numbers or amounts look slightly different.',
    solution:
      'Vantirs compares incoming invoices and payment requests against vendor history and recent activity in QuickBooks Online to highlight likely duplicates before you approve.',
    faq: [
      {
        q: 'Why do duplicate payments happen in QuickBooks?',
        a: 'Teams may receive the same invoice by email twice, or a vendor resubmits with small edits. Manual review alone often misses near-duplicates across weeks.',
      },
      {
        q: 'Can Vantirs help spot duplicates without blocking every payment?',
        a: 'Yes. Signals are tied to vendor-specific patterns in QBO so you focus on overlaps and anomalies that resemble real duplicate-payment cases.',
      },
    ],
  },
  'bank-verification': {
    name: 'Bank verification',
    description:
      'Verify that bank account and routing details on file match how you have actually paid each vendor—before you release wires or ACH from QuickBooks Online.',
    solution:
      'Vantirs cross-checks new or changed banking information against historical payment data in QuickBooks so unauthorized account switches are visible early.',
    faq: [
      {
        q: 'What is the risk of skipping bank verification on vendor updates?',
        a: 'Fraudsters rely on one-time changes to destination accounts. Verifying against prior successful payments is one of the strongest controls you can add.',
      },
      {
        q: 'Does Vantirs replace bank callbacks?',
        a: 'Vantirs adds continuous, data-backed signals inside QBO. Many firms still use callbacks for large changes; together they reduce both fraud and operational drag.',
      },
    ],
  },
  'invoice-validation': {
    name: 'Invoice validation',
    description:
      'Validate invoices against vendor norms—amounts, timing, and metadata—so outliers are caught before they are coded and paid in QuickBooks Online.',
    solution:
      'Vantirs uses vendor fingerprints built from QuickBooks history to flag invoices that break from established patterns, including suspicious timing and amount spikes.',
    faq: [
      {
        q: 'What does invoice validation mean for QBO users?',
        a: 'It means each bill is assessed in context: does this look like how this vendor usually bills you, based on data already in your books?',
      },
      {
        q: 'How is this different from basic duplicate checks?',
        a: 'Validation focuses on whether the invoice is plausible for that vendor, not only whether the same PDF was seen twice.',
      },
    ],
  },
  'payment-security': {
    name: 'Payment security',
    description:
      'Strengthen payment security for AP teams using QuickBooks Online with continuous monitoring, alerts, and audit-friendly signals when something looks wrong.',
    solution:
      'Vantirs connects to QuickBooks Online and monitors vendor and invoice activity for fraud-relevant signals, delivered through workflows your firm already uses.',
    faq: [
      {
        q: 'What payment security gaps do small and mid-sized teams face?',
        a: 'Limited staff and high invoice volume mean controls are often periodic. Attackers time changes when teams are stretched thin.',
      },
      {
        q: 'How does Vantirs improve payment security without a full SOC?',
        a: 'You get automated, vendor-contextual alerts inside QBO so security is embedded in the payment path—not a separate manual checklist.',
      },
    ],
  },
  'vendor-management': {
    name: 'Vendor management',
    description:
      'Keep vendor records trustworthy in QuickBooks Online: know when profiles change, when new vendors appear, and when activity diverges from history.',
    solution:
      'Vantirs tracks vendor-level signals over time so changes and new relationships get the right level of review before payments go out.',
    faq: [
      {
        q: 'Why is vendor management tied to fraud risk?',
        a: 'Many schemes start with a new vendor record or a quiet edit to an existing one. Strong vendor hygiene reduces the attack surface in AP.',
      },
      {
        q: 'Can Vantirs scale across many QBO clients?',
        a: 'Yes. Connect each client company and apply consistent vendor intelligence per client without merging their data.',
      },
    ],
  },
}

const PROBLEM_SLUGS = Object.keys(PROBLEMS) as ProblemSlug[]

export function generateStaticParams() {
  return PROBLEM_SLUGS.map(problem => ({ problem }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ problem: string }>
}): Promise<Metadata> {
  const { problem } = await params
  const entry = PROBLEMS[problem as ProblemSlug]
  if (!entry) {
    return { title: 'QuickBooks solutions | Vantirs' }
  }
  const title = `${entry.name} for QuickBooks Online | Vantirs`
  const description =
    entry.description.length > 155 ? `${entry.description.slice(0, 152)}…` : entry.description
  return {
    title,
    description,
    alternates: { canonical: `/quickbooks/${problem}` },
  }
}

export default async function QuickbooksProblemPage({
  params,
}: {
  params: Promise<{ problem: string }>
}) {
  const { problem } = await params
  const data = PROBLEMS[problem as ProblemSlug]
  if (!data) {
    notFound()
  }

  return (
    <MarketingSeoShell>
      <FaqJsonLd items={data.faq} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">QuickBooks Online</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              {data.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{data.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link
                href="/quickbooks-fraud-prevention"
                className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                Platform overview
              </Link>
            </div>

            <div className="mt-8 rounded-[2rem] bg-[#eff4ff] p-6 text-[#003ec7]">
              <p className="font-manrope text-sm font-bold uppercase tracking-wider">How Vantirs helps</p>
              <p className="mt-2 text-sm leading-relaxed text-[#0b1c30]">{data.solution}</p>
            </div>

            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Related</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                <li>
                  <Link href="/quickbooks-fraud-prevention" className="text-[#003ec7] hover:text-[#0032a3]">
                    QuickBooks fraud prevention →
                  </Link>
                </li>
                <li>
                  <Link href="/vendor-verification-software" className="text-[#003ec7] hover:text-[#0032a3]">
                    Vendor verification software →
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
            <h2 className="font-manrope text-xl font-bold text-[#0b1c30]">Why teams use Vantirs with QBO</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#0b1c30]">
              <li>• Vendor fingerprinting from real payment history</li>
              <li>• Alerts for bank and email-domain inconsistencies</li>
              <li>• Built for accounting firms managing multiple clients</li>
              <li>• Slack and email notifications for fast review</li>
            </ul>
            <div className="mt-6">
              <Link
                href="/quickbooks"
                className="text-sm font-semibold text-[#003ec7] underline-offset-4 hover:underline"
              >
                Browse all QuickBooks topics →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
