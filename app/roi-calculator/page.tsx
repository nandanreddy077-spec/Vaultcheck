import type { Metadata } from 'next'
import MarketingSeoShell from '@/components/MarketingSeoShell'
import RoiCalculatorWidget from '@/components/RoiCalculatorWidget'

export const metadata: Metadata = {
  title: 'AP Fraud Prevention ROI Calculator | Vantirs',
  description:
    'Estimate your AP fraud exposure and potential annual savings. Get an ROI report and see how vendor verification in QuickBooks Online reduces avoidable losses.',
}

export default function RoiCalculatorPage() {
  return (
    <MarketingSeoShell>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003ec7]">ROI & exposure</p>
          <h1 className="mt-4 font-manrope text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0b1c30] md:text-5xl">
            Estimate your vendor fraud ROI
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Use the calculator to estimate exposure based on your monthly payment volume and vendor count. Then request a tailored ROI report for your firm.
          </p>
        </div>
        <RoiCalculatorWidget />
      </section>
    </MarketingSeoShell>
  )
}

