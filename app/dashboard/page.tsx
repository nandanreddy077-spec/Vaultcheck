import { requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardOverview from '@/components/DashboardOverview'

export default async function DashboardPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const firmName = dbUser.firm?.name || 'Your firm'
  return <DashboardOverview firmName={firmName} />
}
