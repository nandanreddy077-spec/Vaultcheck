'use client'

import { useState, useEffect } from 'react'
import { Shield, Building2, Link2, Search, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    number: 1,
    title: 'Add your first client',
    description: 'Create a client record for one of your accounting firm\'s businesses.',
    action: '/dashboard/clients/new',
    actionLabel: 'Add client',
    icon: Building2,
  },
  {
    number: 2,
    title: 'Connect QuickBooks',
    description: 'Link your client\'s QuickBooks Online account so we can sync vendor and invoice data.',
    action: null, // dynamic — depends on client
    actionLabel: 'Connect QBO',
    icon: Link2,
  },
  {
    number: 3,
    title: 'Review your first scan',
    description: 'Once synced, Vantirs builds vendor fingerprints and scans invoices for anomalies. Check the alert queue for any flags.',
    action: '/dashboard/alerts',
    actionLabel: 'View alerts',
    icon: Search,
  },
]

export default function OnboardingPage() {
  const [clientCount, setClientCount] = useState(0)
  const [hasQbo, setHasQbo] = useState(false)
  const [hasAlerts, setHasAlerts] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => {
        const clients = data.clients || []
        setClientCount(clients.length)
        setHasQbo(clients.some((c: { qboRealmId: string | null }) => c.qboRealmId))
        return fetch('/api/alerts?status=open')
      })
      .then(r => r.json())
      .then(data => {
        setHasAlerts((data.alerts || []).length > 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const completed = [clientCount > 0, hasQbo, hasAlerts]
  const allDone = completed.every(Boolean)

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Vantirs</h1>
        <p className="text-gray-500">
          Let&apos;s get your first client set up. This takes about 5 minutes.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 animate-pulse">Loading...</div>
      ) : allDone ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You&apos;re all set!</h2>
          <p className="text-gray-500 mb-6">
            Vantirs is now monitoring your client&apos;s invoices. We&apos;ll flag anything suspicious.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Go to dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, i) => {
            const done = completed[i]
            const isCurrent = !done && completed.slice(0, i).every(Boolean)
            const Icon = step.icon

            return (
              <div
                key={step.number}
                className={`rounded-lg border p-5 transition-all ${
                  done
                    ? 'border-green-200 bg-green-50'
                    : isCurrent
                    ? 'border-blue-200 bg-white shadow-sm'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    done ? 'bg-green-100' : isCurrent ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    {done ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${done ? 'text-green-700' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                    {isCurrent && step.action && (
                      <Link
                        href={step.action}
                        className="inline-flex items-center gap-1 mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                      >
                        {step.actionLabel}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                    {isCurrent && !step.action && clientCount > 0 && (
                      <p className="text-sm text-blue-600 mt-3">
                        Go to a client page and click &quot;Connect QuickBooks&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          <div className="text-center pt-4">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
              Skip for now
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
