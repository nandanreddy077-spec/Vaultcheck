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
    return <div className="mt-3 h-6 w-28 bg-slate-200/70 rounded-lg animate-pulse" />
  }

  if (!firmName) return null

  return (
    <div className="mt-3 flex items-center gap-2 bg-[#003ec7]/10 border border-[#003ec7]/15 px-3 py-1.5 rounded-lg w-fit max-w-[200px]">
      <Building2 className="w-3.5 h-3.5 text-[#003ec7] shrink-0" />
      <span className="text-[11.5px] font-semibold text-[#003ec7] tracking-[0.04em] truncate leading-none">
        {firmName}
      </span>
    </div>
  )
}
