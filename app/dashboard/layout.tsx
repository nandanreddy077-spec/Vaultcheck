import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Shield, LayoutDashboard, Users, AlertTriangle, FileText, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
          <Shield className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-gray-900 text-lg">VaultCheck</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />
          <NavItem href="/dashboard/clients" icon={<Users className="w-4 h-4" />} label="Clients" />
          <NavItem href="/dashboard/alerts" icon={<AlertTriangle className="w-4 h-4" />} label="Alert Queue" />
          <NavItem href="/dashboard/vendors" icon={<FileText className="w-4 h-4" />} label="Vendors" />
          <NavItem href="/dashboard/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>

        <div className="px-3 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 px-3 mb-2 truncate">{user.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
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
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
    >
      {icon}
      {label}
    </Link>
  )
}
