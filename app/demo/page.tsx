import { redirect } from 'next/navigation'

const DEMO_BOOKING_URL = 'https://calendly.com/nandan-vantirs/30min'

export default function DemoRedirectPage() {
  redirect(DEMO_BOOKING_URL)
}
