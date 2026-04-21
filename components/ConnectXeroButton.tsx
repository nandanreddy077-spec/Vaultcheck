'use client'

import { ExternalLink } from 'lucide-react'

export default function ConnectXeroButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="btn-primary-gradient gap-2 text-sm"
    >
      <ExternalLink className="w-4 h-4" />
      Connect Xero
    </a>
  )
}
