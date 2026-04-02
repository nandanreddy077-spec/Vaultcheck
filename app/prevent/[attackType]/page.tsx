import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

export const ATTACK_TYPES = {
  'vendor-impersonation': {
    name: 'Vendor Impersonation',
    definition:
      'Vendor impersonation is when a fraudster poses as a legitimate supplier—often via email or forged documents—to trick accounts payable into changing payment details or approving a fraudulent invoice. Attacks may use look-alike domains, cloned letterhead, or urgent language to bypass normal scrutiny.',
    detection:
      'Vantirs builds a vendor fingerprint from QuickBooks Online history: known bank accounts, typical payment amounts, and communication patterns. When an incoming request diverges from that fingerprint—new beneficiary, unusual domain, or amount spike—your team gets a clear signal before approval.',
    checklist: [
      'Verify any payment or banking change through a known phone number, not reply-to email.',
      'Compare sender domains to historical vendor email patterns; flag look-alikes.',
      'Require dual control for new vendors and for changes to existing payment instructions.',
      'Cross-check invoice details against prior payments and purchase orders.',
      'Log and review exceptions in a single workflow so nothing slips through informal channels.',
    ],
    faq: [
      {
        q: 'How is vendor impersonation different from a simple typo?',
        a: 'Impersonation is intentional deception: domains, tone, and payment details are crafted to look legitimate. Vantirs compares current requests to established vendor behavior so impersonation stands out even when the invoice “looks fine” at a glance.',
      },
      {
        q: 'Can Vantirs catch impersonation if the fraudster uses the real vendor name?',
        a: 'Yes. Name alone is not trusted. Vantirs correlates bank details, email domains, and payment history so a convincing display name cannot override mismatched financial or domain signals.',
      },
    ],
  },
  'duplicate-invoice-fraud': {
    name: 'Duplicate Invoice Fraud',
    definition:
      'Duplicate invoice fraud occurs when the same expense is submitted twice—intentionally or through sloppy controls—so the organization pays twice for one good or service. Fraudsters may reuse invoice numbers with small tweaks or submit near-copies across different approvers.',
    detection:
      'Vantirs analyzes invoice attributes and payment history to surface duplicates and near-duplicates: similar amounts, vendors, dates, or references that suggest the same underlying obligation. That gives AP a second line of defense beyond manual spot-checks.',
    checklist: [
      'Implement three-way match (PO, receipt, invoice) for material spend.',
      'Use sequential controls so duplicate invoice numbers or amounts trigger review.',
      'Centralize invoice intake so the same bill cannot be routed through two paths.',
      'Reconcile paid invoices periodically against vendor statements.',
      'Train staff to escalate “urgent” re-sends of the same invoice.',
    ],
    faq: [
      {
        q: 'Why do duplicate invoices get paid?',
        a: 'Often because different people process similar-looking requests, or because systems lack cross-checks across time and channels. Vantirs adds pattern-based detection tied to QuickBooks data so duplicates are harder to miss.',
      },
      {
        q: 'Does Vantirs only flag exact duplicates?',
        a: 'No. Near-duplicates—same vendor and amount with small changes to dates or references—are also risky. Vantirs is designed to highlight those anomalies for human review.',
      },
    ],
  },
  'bank-change-fraud': {
    name: 'Bank Change Fraud',
    definition:
      'Bank change fraud is the class of schemes where an attacker convinces AP to send future payments to a fraudulent account—often by email claiming an “updated” wire or ACH destination. It is one of the highest-loss vectors for mid-market finance teams.',
    detection:
      'Vantirs compares requested bank and routing details against each vendor’s historical payment footprint in QuickBooks Online. A change from established beneficiaries triggers review, with context so approvers can validate out-of-band before funds move.',
    checklist: [
      'Never accept bank changes from email alone; call the vendor on a known number.',
      'Maintain a vendor master with validated banking info and change procedures.',
      'Use positive pay or ACH blocks where your bank supports them.',
      'Document who approved each change and when.',
      'Alert the team when a “change” coincides with a new email domain.',
    ],
    faq: [
      {
        q: 'What should we do when a vendor says their bank account changed?',
        a: 'Treat it as high risk until verified through an independent channel. Vantirs flags the mismatch against historical payments so the request is reviewed with full context, not just forwarded.',
      },
      {
        q: 'How quickly can Vantirs detect a bad bank account?',
        a: 'At invoice review time, Vantirs evaluates the requested destination against fingerprinted history so fraudulent changes surface before approval—not after the wire.',
      },
    ],
  },
  'ghost-vendor-schemes': {
    name: 'Ghost Vendor Schemes',
    definition:
      'A ghost vendor is a fake or shell supplier set up in your books to receive payments with no legitimate good or service behind them. Insiders or external fraudsters create vendors that look plausible on the surface but exist only to extract cash.',
    detection:
      'Vantirs emphasizes vendors with thin or no legitimate payment history: new profiles, weak matches to real counterparties, and anomalies relative to peer vendors. That helps teams prioritize review before ghost vendors become recurring payees.',
    checklist: [
      'Require formal onboarding for every new vendor with tax ID and bank verification.',
      'Segregate duties so the same person cannot create a vendor and approve payment.',
      'Periodically sample inactive or rarely used vendors for legitimacy.',
      'Match new vendors to contracts and authorized procurement.',
      'Monitor for round-dollar or repetitive payments to new entities.',
    ],
    faq: [
      {
        q: 'How do ghost vendors get into QuickBooks?',
        a: 'Often through weak onboarding, compromised credentials, or collusion. Vantirs focuses on behavioral signals—lack of history, odd timing, and mismatched details—so fake suppliers are harder to hide in plain sight.',
      },
      {
        q: 'Can Vantirs help if we already have thousands of vendors?',
        a: 'Yes. Fingerprinting and anomaly detection scale across your vendor base; new and unusual profiles get attention without manual review of every legacy supplier.',
      },
    ],
  },
  'payment-diversion': {
    name: 'Payment Diversion',
    definition:
      'Payment diversion is any scheme that redirects legitimate outgoing payments to the wrong account—whether through altered invoices, man-in-the-middle messaging, or compromised portals. The business believes it is paying a real supplier while funds go to a criminal.',
    detection:
      'Vantirs ties each payment request to verified vendor behavior: expected rails, typical counterparties, and historical alignment between invoice channel and bank details. Divergent paths—new account, new domain, or inconsistent metadata—surface before release.',
    checklist: [
      'Validate payment instructions through a second channel for large wires.',
      'Use vendor portals or encrypted channels for sensitive updates.',
      'Monitor for last-minute changes close to payment run dates.',
      'Educate AP on phishing and executive impersonation tied to payment runs.',
      'Reconcile bank confirmations against expected beneficiaries.',
    ],
    faq: [
      {
        q: 'Is payment diversion the same as BEC?',
        a: 'Often related: BEC frequently causes diversion via spoofed instructions. Vantirs addresses both by combining email/domain signals with bank and vendor history in QuickBooks.',
      },
      {
        q: 'What if the diversion uses a slightly wrong account number?',
        a: 'Any material change to payment destination should be verified. Vantirs highlights deviations from established vendor payment fingerprints, not just all-or-nothing matches.',
      },
    ],
  },
  'email-spoofing': {
    name: 'Email Spoofing',
    definition:
      'Email spoofing forges or misrepresents sender identity so a message appears to come from a trusted vendor, executive, or domain. Fraudsters use spoofing and look-alike domains to request payments, share fake invoices, or escalate urgency.',
    detection:
      'Vantirs correlates sender domains and communication patterns with each vendor’s established profile. When an invoice-related message comes from an unfamiliar or look-alike domain, it is flagged alongside bank and amount checks for a unified review.',
    checklist: [
      'Deploy SPF, DKIM, and DMARC; monitor DMARC reports for abuse.',
      'Train users to inspect full headers and domains on financial emails.',
      'Maintain allowlists for vendor billing addresses and domains.',
      'Use a dedicated AP inbox with rules for invoice submission.',
      'Never authorize wires based solely on email content.',
    ],
    faq: [
      {
        q: 'Can spoofing be detected if the email looks identical to past threads?',
        a: 'Visual similarity is not enough. Vantirs checks whether the domain and behavior match how the vendor actually transacts in QuickBooks, reducing reliance on appearance alone.',
      },
      {
        q: 'Does Vantirs replace DMARC?',
        a: 'No. DMARC is essential at the mail layer; Vantirs adds financial-context checks so spoofed requests still fail reconciliation against vendor fingerprints.',
      },
    ],
  },
  overbilling: {
    name: 'Overbilling',
    definition:
      'Overbilling is the practice of charging more than contractually owed—inflated quantities, padded hours, duplicate line items, or “accidental” extras. It may be criminal or simply opportunistic, but the effect is the same: excess outflow.',
    detection:
      'Vantirs compares current invoice lines and totals to each vendor’s historical distribution of amounts and frequencies. Statistical outliers and repeated spikes trigger review so overbilling does not become normalized.',
    checklist: [
      'Anchor invoices to contracts and rate cards.',
      'Require manager sign-off on variances above a threshold.',
      'Perform periodic vendor statement reconciliations.',
      'Track cumulative spend against budgets by vendor and category.',
      'Investigate vendors with frequent “corrected” or replacement invoices.',
    ],
    faq: [
      {
        q: 'How is overbilling different from duplicate invoices?',
        a: 'Overbilling may be a single invoice with inflated amounts, while duplicates are multiple submissions for the same obligation. Vantirs uses amount and pattern analysis to surface both classes of risk.',
      },
      {
        q: 'Can small overcharges add up?',
        a: 'Yes—especially across many vendors and months. Systematic anomaly detection helps catch drift that manual sampling misses.',
      },
    ],
  },
  'check-fraud': {
    name: 'Check Fraud',
    definition:
      'Check fraud includes forged, altered, or stolen checks, as well as deposit fraud where criminals intercept or duplicate paper payments. Even firms moving to ACH still face check exposure for refunds, exceptions, or legacy processes.',
    detection:
      'Where check and ACH data appear in QuickBooks workflows, Vantirs helps ensure payee and amount integrity against vendor history and expected payment methods. Unusual payment rails or payee changes are highlighted before release.',
    checklist: [
      'Shift high-value vendors to ACH with positive pay where possible.',
      'Secure check stock and reconcile cleared checks promptly.',
      'Use dual signatures and limits for paper checks.',
      'Monitor for unexpected check numbers or payees on statements.',
      'Train staff on mail theft and mobile deposit fraud schemes.',
    ],
    faq: [
      {
        q: 'Does Vantirs replace positive pay with our bank?',
        a: 'No. Positive pay is a strong bank control. Vantirs complements it by aligning QuickBooks payment intent with vendor history and flagging inconsistencies upstream.',
      },
      {
        q: 'We barely write checks—do we still need monitoring?',
        a: 'If any check volume remains, fraud risk is non-zero. Vantirs still helps with vendor-level integrity and anomaly detection across all payment types recorded in QuickBooks.',
      },
    ],
  },
} as const

export type AttackSlug = keyof typeof ATTACK_TYPES

const SLUGS = Object.keys(ATTACK_TYPES) as AttackSlug[]

export function generateStaticParams(): { attackType: string }[] {
  return SLUGS.map(attackType => ({ attackType }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ attackType: string }>
}): Promise<Metadata> {
  const { attackType } = await params
  const data = ATTACK_TYPES[attackType as AttackSlug]
  if (!data) {
    return { title: 'Fraud prevention | Vantirs' }
  }
  const title = `Prevent ${data.name} | Vantirs`
  const description = `Learn how accounting teams prevent ${data.name.toLowerCase()}: what it is, how Vantirs detects it in QuickBooks Online, and a practical prevention checklist.`
  return {
    title,
    description,
    alternates: { canonical: `/prevent/${attackType}` },
  }
}

export default async function PreventAttackPage({
  params,
}: {
  params: Promise<{ attackType: string }>
}) {
  const { attackType } = await params
  const data = ATTACK_TYPES[attackType as AttackSlug]
  if (!data) notFound()

  return (
    <MarketingSeoShell>
      <FaqJsonLd items={[...data.faq]} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <nav className="text-sm text-slate-500">
          <Link href="/prevent" className="font-medium text-[#003ec7] hover:text-[#0032a3]">
            Fraud prevention
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-600">{data.name}</span>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">Prevent {data.name}</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Prevent {data.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{data.definition}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link
                href="/invoice-fraud-detection"
                className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                Invoice fraud detection
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">How Vantirs detects this attack type</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{data.detection}</p>
            <div className="mt-6 border-t border-[#c3c5d9]/20 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Related</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/bec-fraud-prevention" className="font-semibold text-[#003ec7] hover:text-[#0032a3]">
                    BEC fraud prevention →
                  </Link>
                </li>
                <li>
                  <Link href="/vendor-verification-software" className="font-semibold text-[#003ec7] hover:text-[#0032a3]">
                    Vendor verification software →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">Prevention checklist</h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Use this list alongside Vantirs to tighten controls and make reviews consistent across clients and bookkeepers.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {data.checklist.map(item => (
              <li
                key={item}
                className="rounded-[2rem] bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-[0_8px_24px_rgba(11,28,48,0.06)] ring-1 ring-[#c3c5d9]/15"
              >
                <span className="font-semibold text-[#003ec7]">✓</span> {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="font-manrope text-2xl font-bold text-[#0b1c30]">Stop {data.name.toLowerCase()} before payment leaves QuickBooks</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Vantirs fingerprints vendors and flags mismatches so your team approves payments with confidence—without slowing down legitimate work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link
                href="/vendor-verification-software"
                className="inline-flex items-center justify-center rounded-xl bg-[#eff4ff] px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#e4edff]"
              >
                Vendor verification
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
