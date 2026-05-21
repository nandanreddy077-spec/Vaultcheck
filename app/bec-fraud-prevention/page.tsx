import type { Metadata } from 'next'
import Link from 'next/link'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import { FaqJsonLd } from '@/components/JsonLd'

const FAQ_ITEMS = [
  {
    q: 'What is business email compromise (BEC)?',
    a: 'Business email compromise is an attack where a fraudster impersonates a trusted party — a CEO, vendor, or finance contact — via email to trick your AP team into sending money or changing payment details. The FBI tracked over $2.9 billion in BEC losses in 2024 alone.',
  },
  {
    q: 'What is vendor email compromise (VEC) and how is it different from BEC?',
    a: 'Vendor email compromise is a specific BEC variant where the attacker compromises or impersonates an actual vendor inbox — not an internal executive. Because the email comes from a real, trusted vendor address, standard domain checks fail. VEC now accounts for 61% of all BEC attacks in 2026.',
  },
  {
    q: 'How does Vantirs stop BEC attacks in QuickBooks Online?',
    a: 'Vantirs builds a behavioral fingerprint for each vendor from your QBO payment history. When a BEC or VEC attack attempts to reroute a payment — changing the bank account, sender domain, or invoice amount — Vantirs flags the specific anomaly before your AP team approves, giving them the context to pause and verify.',
  },
  {
    q: 'Can BEC attacks get past DMARC and email security filters?',
    a: 'Yes. Vendor email compromise attacks originate from real, compromised vendor inboxes, so they pass DMARC, DKIM, and standard email authentication. The only reliable control at that point is detecting that the payment destination has changed — which is exactly what Vantirs checks.',
  },
]

const HOW_BEC_WORKS = [
  {
    step: '1',
    title: 'Reconnaissance',
    body: 'The attacker researches your vendor relationships via LinkedIn, public contracts, or a prior phishing attempt. They identify which vendors receive regular large payments and when those payments are expected.',
  },
  {
    step: '2',
    title: 'Impersonation or compromise',
    body: 'Classic BEC spoofs a lookalike domain (acme-corp.com vs acmecorp.com). Vendor email compromise goes further — the attacker breaches the real vendor inbox and sends from the legitimate address.',
  },
  {
    step: '3',
    title: 'The payment-change request',
    body: 'Right before a known payment window, the attacker sends a routine-looking update: "We\'ve changed banks — please route your next payment to the new account below." The context is real. The invoice is expected. Only the destination is fraudulent.',
  },
  {
    step: '4',
    title: 'The wire leaves',
    body: 'Without a pre-payment check on the beneficiary, your AP team approves a legitimate-looking request. Funds move through multiple accounts within hours. Average recovery rate: near zero.',
  },
]

export const metadata: Metadata = {
  title: 'BEC Fraud Prevention Software for Finance Teams | Vantirs',
  description:
    'Stop business email compromise and vendor email compromise before AP approves the payment. Vantirs flags bank account changes, spoofed domains, and payment anomalies in QuickBooks Online.',
  alternates: { canonical: '/bec-fraud-prevention' },
  keywords: [
    'BEC fraud prevention software',
    'business email compromise prevention',
    'vendor email compromise detection',
    'BEC fraud prevention accounting firms',
    'stop BEC attacks accounts payable',
  ],
}

export default function BecFraudPreventionPage() {
  return (
    <MarketingSeoShell>
      <FaqJsonLd items={FAQ_ITEMS} />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">BEC fraud prevention</p>
            <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
              Stop business email compromise before AP pays the scam
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              BEC attacks don't hack your systems — they manipulate your AP process. Vantirs detects the payment-destination
              changes, spoofed sender identities, and behavioral anomalies that signal a BEC or VEC attack before your team
              approves the invoice.
            </p>
            <div className="mt-5 rounded-xl border border-[#c3c5d9]/30 bg-[#eff4ff] px-5 py-4">
              <p className="text-sm font-semibold text-[#0b1c30]">
                BEC attacks surged 26% in March 2026. 10.7 million incidents in Q1 alone — the highest quarterly total on record.
              </p>
              <p className="mt-1 text-xs text-slate-500">Microsoft Q1 2026 Email Threat Landscape Report</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/demo" className="btn-primary-gradient px-8 py-4 text-base font-semibold">
                See how Vantirs stops BEC
              </Link>
              <Link
                href="/blog/bec-vs-vec-accounting-firms"
                className="inline-flex items-center justify-center rounded-xl bg-[#dce9ff]/80 px-8 py-4 text-base font-semibold text-[#003ec7] transition-colors hover:bg-[#d3e4fe]"
              >
                BEC vs. VEC explained
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(11,28,48,0.08)] ring-1 ring-[#c3c5d9]/15">
            <h2 className="font-manrope text-lg font-bold text-[#0b1c30]">What Vantirs catches that email security misses</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <div>
                  <strong className="text-[#0b1c30]">New beneficiary bank account</strong>
                  <p className="mt-0.5 text-slate-600">Payment going to an account that has never received money from your organization — regardless of how legitimate the sender looks.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <div>
                  <strong className="text-[#0b1c30]">Lookalike sender domain</strong>
                  <p className="mt-0.5 text-slate-600">Domain differs from the vendor's verified identity in your QBO — one character swap, hyphen, or TLD change caught automatically.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <div>
                  <strong className="text-[#0b1c30]">Vendor email compromise (VEC)</strong>
                  <p className="mt-0.5 text-slate-600">Even when the attacker sends from the real vendor inbox, Vantirs catches the payment-destination change that email authentication can't see.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 text-emerald-600">✓</span>
                <div>
                  <strong className="text-[#0b1c30]">Invoice amount anomalies</strong>
                  <p className="mt-0.5 text-slate-600">Amounts outside the statistical range for this vendor, flagged with the specific variance so reviewers can decide in context.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How BEC works */}
      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
            How a BEC attack unfolds in your AP workflow
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Understanding the attack pattern is the first step to stopping it. BEC isn't random — it's a deliberate,
            multi-stage process designed to exploit your vendor trust.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {HOW_BEC_WORKS.map((s) => (
              <div key={s.step} className="rounded-2xl bg-white p-6 ring-1 ring-[#c3c5d9]/20">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#003ec7] font-manrope text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-4 font-manrope text-base font-bold text-[#0b1c30]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-600">
            The most dangerous variant — vendor email compromise — now makes up{' '}
            <strong className="text-[#0b1c30]">61% of all BEC attacks</strong>. Read the full breakdown:{' '}
            <Link
              href="/blog/bec-vs-vec-accounting-firms"
              className="font-semibold text-[#003ec7] underline-offset-2 hover:underline"
            >
              BEC vs. VEC: What Finance Teams Need to Know in 2026
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Why standard controls fail */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <h2 className="font-manrope text-3xl font-bold text-[#0b1c30] md:text-4xl">
          Why your existing controls don't stop VEC
        </h2>
        <p className="mt-4 max-w-2xl text-slate-600">
          Classic BEC defenses focus on sender identity. Vendor email compromise bypasses every one of them.
        </p>
        <div className="mt-10 overflow-x-auto rounded-2xl ring-1 ring-[#c3c5d9]/25">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[#eff4ff] text-left text-[#0b1c30]">
              <tr>
                <th className="px-5 py-4 font-semibold">Control</th>
                <th className="px-5 py-4 font-semibold">Stops classic BEC?</th>
                <th className="px-5 py-4 font-semibold">Stops VEC?</th>
                <th className="px-5 py-4 font-semibold">Why it fails against VEC</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4">DMARC / email authentication</td>
                <td className="px-5 py-4 text-emerald-600 font-medium">Often yes</td>
                <td className="px-5 py-4 text-red-500 font-medium">No</td>
                <td className="px-5 py-4">VEC uses a legitimate, authenticated vendor inbox</td>
              </tr>
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4">Dual-approval policy</td>
                <td className="px-5 py-4 text-emerald-600 font-medium">Often yes</td>
                <td className="px-5 py-4 text-red-500 font-medium">No</td>
                <td className="px-5 py-4">Both approvers see a legitimate invoice from a known vendor</td>
              </tr>
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4">Sender domain verification</td>
                <td className="px-5 py-4 text-emerald-600 font-medium">Yes</td>
                <td className="px-5 py-4 text-red-500 font-medium">No</td>
                <td className="px-5 py-4">Domain is real — no lookalike to catch</td>
              </tr>
              <tr className="border-t border-[#c3c5d9]/20">
                <td className="px-5 py-4 font-medium text-[#003ec7]">Vantirs payment-destination check</td>
                <td className="px-5 py-4 text-emerald-600 font-medium">Yes</td>
                <td className="px-5 py-4 text-emerald-600 font-medium">Yes</td>
                <td className="px-5 py-4 text-slate-500 italic">Catches both — checks the beneficiary, not just the sender</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#eff4ff]">
        <div className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
          <h2 className="font-manrope text-3xl font-bold text-[#0b1c30]">Common questions</h2>
          <div className="mt-8 divide-y divide-[#c3c5d9]/25">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="py-6">
                <p className="font-manrope font-bold text-[#0b1c30]">{item.q}</p>
                <p className="mt-3 text-slate-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <div className="rounded-[2rem] bg-[#0b1c30] p-10 text-center">
          <h2 className="font-manrope text-3xl font-bold text-white">
            Stop the next BEC attack before it costs you
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Vantirs connects to QuickBooks Online and flags BEC and VEC payment anomalies before your AP team approves.
            Live fraud signals within one business day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/demo" className="btn-primary-gradient px-10 py-4 text-base font-semibold">
              Book a live demo
            </Link>
            <Link
              href="/vendor-fraud-detection-software"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-10 py-4 text-base font-semibold text-white hover:bg-white/10"
            >
              Vendor fraud detection software
            </Link>
          </div>
        </div>
      </section>
    </MarketingSeoShell>
  )
}
