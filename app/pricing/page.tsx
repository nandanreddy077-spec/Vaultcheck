import type { Metadata } from 'next'
import PricingSection from '@/components/PricingSection'

export const metadata: Metadata = {
  title: 'Pricing | Vantirs',
  description:
    'Transparent, simple pricing for accounting firms using Vantirs to prevent vendor fraud and BEC-style invoice scams in QuickBooks Online.',
}

export default function PricingPage() {
  // Pricing UI is a client component, but it still renders the pricing content in the initial HTML.
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <PricingSection />
    </div>
  )
}

