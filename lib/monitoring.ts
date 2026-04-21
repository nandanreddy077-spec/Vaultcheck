import * as Sentry from '@sentry/nextjs'

type MonitoringContext = {
  tags?: Record<string, string | number | boolean>
  extra?: Record<string, unknown>
}

export function captureException(error: unknown, context?: MonitoringContext) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, String(value))
      })
    }
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value)
      })
    }
    scope.captureException(error instanceof Error ? error : new Error(String(error)))
  })
}

export function captureMessage(
  message: string,
  context?: MonitoringContext & { level?: 'info' | 'warning' | 'error' }
) {
  Sentry.captureMessage(message, {
    level: context?.level || 'warning',
    tags: context?.tags,
    extra: context?.extra,
  })
}
