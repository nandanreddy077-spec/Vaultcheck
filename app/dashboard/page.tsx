import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardOverview from '@/components/DashboardOverview'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return <DashboardOverview />
}
