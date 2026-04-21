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

  return (
    <div className="p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-[#0b1c30]">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">Manage firm identity, access, billing, and alert channels.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="surface-panel p-6">
          <h2 className="text-xl font-semibold text-[#0b1c30] mb-5">Firm</h2>
          <div className="space-y-4">
            <InfoBlock label="Name" value={dbUser.firm.name} />
            <InfoBlock label="Email" value={dbUser.firm.email} />
            <InfoBlock label="Plan" value={dbUser.firm.plan} />
            <InfoBlock label="Client limit" value={`${dbUser.firm.maxClients} clients`} />
          </div>
        </div>

        <div className="surface-panel p-6">
          <h2 className="text-xl font-semibold text-[#0b1c30] mb-5">Your account</h2>
          <div className="space-y-4">
            <InfoBlock label="Name" value={dbUser.name} />
            <InfoBlock label="Email" value={dbUser.email} />
            <InfoBlock label="Role" value={dbUser.role} />
          </div>
        </div>

        <div className="surface-panel p-0 overflow-hidden">
          <TeamPanel
            members={teamMembers}
            currentUserId={dbUser.id}
            isAdmin={dbUser.role === 'admin'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="surface-panel p-0 overflow-hidden">
          <BillingPanel currentPlan={dbUser.firm.plan} />
        </div>
        <div className="surface-panel p-0 overflow-hidden">
          <SlackWebhookPanel initialUrl={dbUser.firm.slackWebhookUrl} />
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#eff4ff] px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-[#0b1c30] capitalize">{value}</p>
    </div>
  )
}
