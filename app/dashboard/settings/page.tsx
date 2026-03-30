import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import BillingPanel from '@/components/BillingPanel'
import SlackWebhookPanel from '@/components/SlackWebhookPanel'
import TeamPanel from '@/components/TeamPanel'

export default async function SettingsPage() {
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) redirect('/login')

  const teamMembers = await prisma.user.findMany({
    where: { firmId: dbUser.firmId },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: 'asc' },
  })

  const pilotCount = await prisma.firm.count({ where: { plan: 'pilot' } })
  const pilotAvailable = pilotCount < 10

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Firm</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Name</label>
              <p className="text-sm text-gray-900 mt-0.5">{dbUser.firm.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
              <p className="text-sm text-gray-900 mt-0.5">{dbUser.firm.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Plan</label>
              <p className="text-sm text-gray-900 mt-0.5 capitalize">{dbUser.firm.plan}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Client limit</label>
              <p className="text-sm text-gray-900 mt-0.5">{dbUser.firm.maxClients} clients</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Your account</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Name</label>
              <p className="text-sm text-gray-900 mt-0.5">{dbUser.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
              <p className="text-sm text-gray-900 mt-0.5">{dbUser.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Role</label>
              <p className="text-sm text-gray-900 mt-0.5 capitalize">{dbUser.role}</p>
            </div>
          </div>
        </div>

        <TeamPanel
          members={teamMembers}
          currentUserId={dbUser.id}
          isAdmin={dbUser.role === 'admin'}
        />

        <BillingPanel currentPlan={dbUser.firm.plan} pilotAvailable={pilotAvailable} />
        <SlackWebhookPanel initialUrl={dbUser.firm.slackWebhookUrl} />
      </div>
    </div>
  )
}
