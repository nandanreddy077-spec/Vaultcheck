'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg border border-red-200 p-8 max-w-lg mx-auto mt-12 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">
          An error occurred while loading this page. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
