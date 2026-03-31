'use client'

import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'

export default function FirmBadge() {
  const [firmName, setFirmName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/firm')
      .then(r => r.ok ? r.json() : null)
      .then(data => setFirmName(data?.firmName ?? null))
      .catch(() => setFirmName(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="h-3 w-20 bg-slate-200 rounded animate-pulse mt-1" />
  }

  if (!firmName) return null

  return (
    <div className="flex items-center gap-1 mt-1">
      <Building2 className="w-3 h-3 text-[#003ec7] shrink-0" />
      <p className="text-[11px] font-semibold text-[#003ec7] uppercase tracking-[0.06em] truncate max-w-[120px]">
        {firmName}
      </p>
    </div>
  )
}
