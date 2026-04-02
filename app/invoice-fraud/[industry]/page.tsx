import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

type IndustryEntry = {
  name: string
  description: string
  stats: string
  faq: { q: string; a: string }[]
}

export const INDUSTRIES: Record<string, IndustryEntry> = {
  healthcare: {
    name: 'Healthcare',
    description:
      'Hospitals, clinics, and medical groups process huge volumes of vendor invoices—from supplies to IT—making them prime targets for payment diversion and BEC scams.',
    stats:
      'Healthcare payment fraud often spikes around vendor onboarding and wire changes: industry surveys consistently rank supplier impersonation among the fastest-growing finance risks as attackers exploit urgent procurement and fragmented AP workflows.',
    faq: [
      {
        q: 'Why are healthcare organizations targeted for invoice fraud?',
        a: 'High invoice volume, many one-off vendors, and frequent bank updates for medical suppliers create openings for spoofed payment instructions and look-alike vendor emails.',
      },
      {
        q: 'How does Vantirs help healthcare AP teams?',
        a: 'Vantirs fingerprints vendors in QuickBooks Online and flags invoices when bank details, email domains, or amounts diverge from established payment history—before funds leave the account.',
      },
    ],
  },
  construction: {
    name: 'Construction',
    description:
      'GCs and subcontractors juggle progress billing, change orders, and material suppliers—exactly the kind of fast-moving payables environment fraudsters exploit.',
    stats:
      'Construction firms report elevated losses from fake subcontractor invoices and altered remittance details, often timed to project milestones when approvals move quickly and controls are stretched across job sites.',
    faq: [
      {
        q: 'What makes construction invoice fraud common?',
        a: 'Multiple entities per project, last-minute vendor adds, and email-only change requests let attackers slip in fraudulent wires if bank and domain signals are not verified against history.',
      },
      {
        q: 'Can Vantirs catch bogus subcontractor payment changes?',
        a: 'Yes. When someone requests a new bank account or sends an invoice from a suspicious domain, Vantirs compares those signals to each vendor fingerprint built from past QuickBooks payments.',
      },
    ],
  },
  'real-estate': {
    name: 'Real Estate',
    description:
      'Property managers and real estate firms coordinate vendors for maintenance, capital projects, and closings—workflows where a single bad wire can be catastrophic.',
    stats:
      'Real estate-related wire fraud often involves impersonation of title companies, contractors, or property managers; firms that lack systematic vendor verification see repeat attempts at invoice and closing instruction manipulation.',
    faq: [
      {
        q: 'How does invoice fraud show up in real estate operations?',
        a: 'Attackers may spoof vendors for recurring maintenance or attempt last-minute payment detail changes that mimic legitimate property-related invoices.',
      },
      {
        q: 'Does Vantirs work for firms with many small vendors?',
        a: 'Yes. New or infrequent vendors get explicit scrutiny, and repeat vendors are compared against historical payment patterns for anomalies.',
      },
    ],
  },
  'legal-services': {
    name: 'Legal Services',
    description:
      'Law firms and legal departments handle sensitive matters and third-party payments—making vendor trust and payment integrity non-negotiable.',
    stats:
      'Professional services firms are frequent BEC targets because invoice approvals often rely on email and partner judgment; industry guidance emphasizes verifying bank details outside of email for any change request.',
    faq: [
      {
        q: 'Why verify legal vendor invoices beyond standard approval?',
        a: 'Court reporters, experts, and specialty vendors may be paid infrequently, which weakens intuitive fraud detection—systematic fingerprinting fills that gap.',
      },
      {
        q: 'How does Vantirs reduce risk for legal AP?',
        a: 'It flags domain spoofing, bank mismatches, and amount outliers using QuickBooks payment history so reviews focus on concrete signals, not guesswork.',
      },
    ],
  },
  nonprofit: {
    name: 'Nonprofit',
    description:
      'Nonprofits balance mission delivery with lean finance teams—often processing grants, events, and program expenses through the same AP queue.',
    stats:
      'Charities and NGOs are targeted because attackers assume weaker segregation of duties; fraud attempts spike around large disbursements and disaster-response giving when invoice volume jumps.',
    faq: [
      {
        q: 'Are nonprofits at higher risk for vendor impersonation?',
        a: 'Lean teams and volunteer involvement can slow formal verification, which attackers exploit with urgent fake invoices and fraudulent wire instructions.',
      },
      {
        q: 'Is Vantirs appropriate for smaller nonprofit finance teams?',
        a: 'Yes. Automated vendor fingerprinting and alerts reduce manual workload while surfacing high-risk invoices before payment.',
      },
    ],
  },
  manufacturing: {
    name: 'Manufacturing',
    description:
      'Manufacturers manage raw materials, tooling, and logistics invoices at scale—often across plants and currencies—with complex vendor master data.',
    stats:
      'Supply chain disruption has increased invoice fraud attempts impersonating suppliers; manufacturing CFOs cite vendor payment fraud as a growing operational risk tied to email-based payment workflows.',
    faq: [
      {
        q: 'What fraud patterns are common in manufacturing AP?',
        a: 'Fake invoices referencing real PO numbers, supplier bank detail changes sent via compromised or spoofed email, and anomalous invoice amounts versus historical spend.',
      },
      {
        q: 'How does Vantirs support multi-entity manufacturing?',
        a: 'Vantirs works with QuickBooks Online vendor and payment data to flag inconsistencies per vendor, helping teams prioritize review on the riskiest invoices.',
      },
    ],
  },
  'professional-services': {
    name: 'Professional Services',
    description:
      'Consulting, accounting, and advisory firms pay a wide mix of contractors and software vendors—often with decentralized approval paths.',
    stats:
      'BEC and invoice fraud losses continue to climb across professional services as attackers exploit trusted brands and fast invoice turnaround expectations.',
    faq: [
      {
        q: 'Why do professional services firms need invoice fraud prevention?',
        a: 'High email reliance and diverse vendor bases make domain spoofing and payment diversion especially effective without automated vendor fingerprinting.',
      },
      {
        q: 'What does Vantirs check on each invoice?',
        a: 'Bank account consistency, email domain signals, statistical amount anomalies, and new-vendor risk—all grounded in QuickBooks Online history.',
      },
    ],
  },
  'government-contracting': {
    name: 'Government Contracting',
    description:
      'GovCon vendors meet strict compliance requirements—but payment fraud can still slip through if subcontractor and supplier identities are not continuously verified.',
    stats:
      'Defense and federal contractors face persistent phishing and vendor impersonation attempts; even compliant firms remain exposed when payment instructions change outside controlled procurement channels.',
    faq: [
      {
        q: 'How does invoice fraud affect government contractors?',
        a: 'Subcontractor payment diversion and spoofed invoices can disrupt programs and trigger investigations; proactive vendor verification reduces exposure.',
      },
      {
        q: 'Can Vantirs complement existing GovCon controls?',
        a: 'Yes. It adds continuous payment-pattern verification in QuickBooks Online, catching spoofing and anomaly signals that manual reviews miss at scale.',
      },
    ],
  },
  retail: {
    name: 'Retail',
    description:
      'Retailers coordinate inventory, store operations, and e-commerce fulfillment—driving high invoice velocity and seasonal vendor churn.',
    stats:
      'Retail AP teams report increased fake invoice and rebate fraud attempts, especially when vendor onboarding is accelerated to meet peak demand.',
    faq: [
      {
        q: 'What makes retail susceptible to invoice fraud?',
        a: 'Seasonal hiring, temporary vendors, and promotional spend spikes create windows where fraudulent invoices mimic legitimate vendor activity.',
      },
      {
        q: 'How can Vantirs help retail finance teams?',
        a: 'By comparing each invoice to established vendor fingerprints—flagging bank changes, domain spoofing, and unusual amounts before approval.',
      },
    ],
  },
  logistics: {
    name: 'Logistics',
    description:
      'Freight, warehousing, and 3PL providers process constant carrier and fuel invoices—often with thin margins and tight payment deadlines.',
    stats:
      'Transportation and logistics firms see frequent attempts to redirect payments to fraudulent accounts, exploiting the industry’s reliance on email confirmations and rapid invoice turnaround.',
    faq: [
      {
        q: 'Why is logistics a high-risk sector for payment fraud?',
        a: 'Time-sensitive loads and many one-off carriers mean invoices are approved quickly; attackers exploit that speed with spoofed requests and fake remittance details.',
      },
      {
        q: 'Does Vantirs integrate with QuickBooks Online for logistics AP?',
        a: 'Yes. Vantirs reads vendor and payment history in QuickBooks Online to fingerprint carriers and suppliers and flag suspicious invoices early.',
      },
    ],
  },
}

export function generateStaticParams(): { industry: string }[] {
  return Object.keys(INDUSTRIES).map(industry => ({ industry }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>
}): Promise<Metadata> {
  const { industry } = await params
  const data = INDUSTRIES[industry]
  if (!data) return {}

  const title = `Invoice Fraud Prevention for ${data.name} | Vantirs`
  const raw = `${data.description} ${data.stats}`
  const description = raw.length > 160 ? `${raw.slice(0, 157)}…` : raw

  return {
    title,
    description,
    alternates: { canonical: `/invoice-fraud/${industry}` },
  }
}

export default async function InvoiceFraudIndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry } = await params
  const data = INDUSTRIES[industry]
  if (!data) notFound()

  return (
    <MarketingSeoShell>
      <FaqJsonLd items={data.faq} />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">
              <Link href="/invoice-fraud-detection" className="hover:underline">
                Invoice fraud detection
              </Link>
              <span className="text-slate-400"> · </span>
              <Link href="/invoice-fraud" className="hover:underline">
                By industry
              </Link>
            </p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Invoice fraud prevention for {data.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{data.description}</p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{data.stats}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                Start free trial
              </Link>
              <Link
                href="/quickbooks-fraud-prevention"
                className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                QuickBooks fraud prevention
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Related:{' '}
              <Link href="/invoice-fraud-detection" className="font-medium text-[#003ec7] hover:underline">
                Invoice fraud detection
              </Link>
              {' · '}
              <Link href="/vendor-verification-software" className="font-medium text-[#003ec7] hover:underline">
                Vendor verification
              </Link>
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="text-xl font-bold text-[#0b1c30]">What Vantirs detects</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Bank mismatches</p>
                <p className="mt-1 text-sm text-slate-600">
                  Invoices that ask for a different beneficiary or account than past payments to the same vendor.
                </p>
              </div>
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Email spoofing</p>
                <p className="mt-1 text-sm text-slate-600">
                  Sender domains that don&apos;t match known vendor patterns—including look-alike domains used in BEC.
                </p>
              </div>
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">Amount anomalies</p>
                <p className="mt-1 text-sm text-slate-600">Statistical outliers versus each vendor&apos;s payment history in QuickBooks Online.</p>
              </div>
              <div className="rounded-2xl bg-[#eff4ff] p-4">
                <p className="text-sm font-semibold text-[#0b1c30]">New vendor review</p>
                <p className="mt-1 text-sm text-slate-600">
                  First-time or thin-history vendors are surfaced for explicit review before approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">Protect {data.name.toLowerCase()} payables with Vantirs</h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Pair automated vendor fingerprinting with clear fraud signals so your team approves payments with confidence—not guesswork.
          </p>

          <div className="mt-10 flex flex-col flex-wrap gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
              Start free trial
            </Link>
            <Link
              href="/vendor-verification-software"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#eff4ff]"
            >
              Vendor verification software
            </Link>
            <Link
              href="/quickbooks-fraud-prevention"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#eff4ff]"
            >
              QuickBooks fraud prevention
            </Link>
            <Link
              href="/invoice-fraud-detection"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#003ec7] ring-1 ring-[#c3c5d9]/20 hover:bg-[#eff4ff]"
            >
              Invoice fraud detection
            </Link>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
