'use client'

import { ExternalLink } from 'lucide-react'

export default function ConnectQBOButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
    >
      <ExternalLink className="w-4 h-4" />
      Connect QuickBooks
    </a>
  )
}
