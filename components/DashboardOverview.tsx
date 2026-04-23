import Link from 'next/link'
import { Users, AlertTriangle, FileText, TrendingUp, Plus } from 'lucide-react'

type OverviewData = {
  firmName?: string
  clients: {
    total: number
    active: number
    syncErrors: number
  }
  vendors: {
    total: number
  }
  invoices: {
    thisMonth: number
    lastMonth: number
    trendPercent: number | null
    highRiskThisMonth: number
  }
  alerts: {
    open: number
    critical: number
    resolvedThisMonth: number
  }
  recentAlerts: Array<{
    id: string
    title: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    client: { id: string; name: string }
    invoice?: {
      vendor?: { displayName?: string | null } | null
      amount?: number | null
    } | null
  }>
}

export default function DashboardOverview({ data }: { data: OverviewData }) {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-semibold text-[#0b1c30]">Security Operations</h1>
          <p className="text-sm text-slate-500 mt-2">
            {data.firmName ?? '…'} · Real-time invoice analysis and threat detection
          </p>
        </div>
        <Link href="/dashboard/clients/new" className="btn-primary-gradient gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 mb-10">
        <StatCard
          title="Active Clients"
          value={data.clients.active}
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Invoices This Month"
          value={data.invoices.thisMonth}
          icon={<FileText className="w-5 h-5 text-gray-500" />}
        />
        <StatCard
          title="Open Alerts"
          value={data.alerts.open}
          icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
          highlight={data.alerts.open > 0}
        />
        <StatCard
          title="High Risk This Month"
          value={data.invoices.highRiskThisMonth}
          icon={<TrendingUp className="w-5 h-5 text-red-500" />}
          highlight={data.invoices.highRiskThisMonth > 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="surface-panel xl:col-span-2">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-semibold text-[#0b1c30] text-xl">Critical & High Alerts</h2>
            <Link href="/dashboard/alerts" className="text-sm text-[#003ec7] hover:text-[#0052ff]">
              View all
            </Link>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {data.recentAlerts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-400 text-center">No open critical alerts</p>
            ) : (
              data.recentAlerts.map(alert => (
                <div key={alert.id} className="px-4 py-4 rounded-xl bg-[#eff4ff] flex items-start gap-3">
                  <div className={`mt-1 severity-dot-${alert.severity}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0b1c30] truncate">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {alert.client.name} · {alert.invoice?.vendor?.displayName || 'Unknown vendor'}
                      {' · '}
                      {typeof alert.invoice?.amount === 'number'
                        ? `$${alert.invoice.amount.toLocaleString()}`
                        : 'Invoice unavailable'}
                    </p>
                  </div>
                  <span
                    className={`risk-badge-${alert.severity === 'critical' ? 'critical' : 'high'}`}
                  >
                    {alert.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface-panel">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="font-semibold text-[#0b1c30] text-xl">Client Health</h2>
            <Link
              href="/dashboard/clients"
              className="text-sm text-[#003ec7] hover:text-[#0052ff]"
            >
              Manage
            </Link>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {data.clients.active === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-slate-400 mb-3">No clients yet</p>
                <Link
                  href="/dashboard/clients/new"
                  className="text-sm text-[#003ec7] hover:text-[#0052ff]"
                >
                  Add your first client →
                </Link>
              </div>
            ) : (
              <>
                <MetricRow label="Active clients" value={`${data.clients.active}`} />
                <MetricRow label="Sync errors" value={`${data.clients.syncErrors}`} />
                <MetricRow label="Vendors tracked" value={`${data.vendors.total}`} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  highlight = false,
}: {
  title: string
  value: number
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className={`surface-panel p-6 ${highlight ? 'bg-orange-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{title}</p>
        {icon}
      </div>
      <p className={`text-4xl font-semibold ${highlight ? 'text-orange-700' : 'text-[#0b1c30]'}`}>
        {value}
      </p>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4 rounded-xl bg-[#eff4ff] flex items-center justify-between">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        {value}
      </span>
    </div>
  )
}
