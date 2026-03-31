import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, AlertTriangle, FileText, Settings, LogOut, FileSpreadsheet } from 'lucide-react'
import Link from 'next/link'
import VantirsLogo from '@/components/VantirsLogo'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user: { email?: string } | null = null
  try {
    const supabase = await createClient()
    const { data: userData, error } = await supabase.auth.getUser()
    if (!error && userData?.user) {
      user = userData.user
    } else {
      const { data: sessionData } = await supabase.auth.getSession()
      user = sessionData?.session?.user ?? null
    }
  } catch {
    // Network/transient auth failures should not hard fail the dashboard shell.
    // Let the normal unauthenticated redirect handle truly missing sessions.
    user = null
  }

  if (!user) redirect('/login')

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#eff4ff] flex flex-col">
        <div className="flex items-center gap-3 px-7 py-7">
          <VantirsLogo href="/" className="shrink-0" imageClassName="h-10 w-auto" width={172} height={60} />
          <div>
            <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-slate-500">Enterprise tier</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />
          <NavItem href="/dashboard/clients" icon={<Users className="w-4 h-4" />} label="Clients" />
          <NavItem href="/dashboard/alerts" icon={<AlertTriangle className="w-4 h-4" />} label="Alert Queue" />
          <NavItem href="/dashboard/vendors" icon={<FileText className="w-4 h-4" />} label="Vendors" />
          <NavItem href="/dashboard/reports" icon={<FileSpreadsheet className="w-4 h-4" />} label="Reports" />
          <NavItem href="/dashboard/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>

        <div className="px-4 py-5 mt-2">
          <div className="surface-panel px-4 py-4 bg-white/80 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">Signed in as</p>
            <p className="text-sm text-slate-700 truncate mt-1">{user.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white/80 hover:bg-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:text-[#003ec7] hover:bg-white rounded-lg transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
