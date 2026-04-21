# Production Readiness Checklist

This project now includes in-app protections for rate limiting, backend error capture, and a basic health endpoint, but some items remain operational and must be validated outside the codebase.

## Implemented In App

- Rate limiting on sensitive endpoints:
  - `app/api/qbo/connect/route.ts`
  - `app/api/qbo/callback/route.ts`
  - `app/api/qbo/sync/[clientId]/route.ts`
  - `app/api/scan/[invoiceId]/route.ts`
  - `app/api/paddle/checkout/route.ts`
  - `app/api/invitations/route.ts`
  - `app/api/webhooks/qbo/route.ts`
  - `app/api/webhooks/paddle/route.ts`
- Backend Sentry capture for key API failure paths
- Resend and Slack failures captured without breaking core workflows
- Health endpoint:
  - `GET /api/health`

## Required Environment Variables

### App + Security

- `DATABASE_URL`
- `DIRECT_URL`
- `ENCRYPTION_KEY`
- `NEXT_PUBLIC_APP_URL`

### Monitoring

- `NEXT_PUBLIC_SENTRY_DSN`

### QBO

- `QBO_CLIENT_ID`
- `QBO_CLIENT_SECRET`
- `QBO_REDIRECT_URI`
- `QBO_WEBHOOK_VERIFIER_TOKEN`

### Paddle

- `PADDLE_API_KEY`
- `PADDLE_ENVIRONMENT`
- `PADDLE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `NEXT_PUBLIC_PADDLE_ENVIRONMENT`
- `PADDLE_PRICE_SOLO`
- `PADDLE_PRICE_PILOT`
- `PADDLE_PRICE_STARTER`
- `PADDLE_PRICE_GROWTH`
- `PADDLE_PRICE_SCALE`
- `PADDLE_PRICE_ENTERPRISE`

### Upstash Rate Limiting

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Notifications

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SLACK_WEBHOOK_URL` (optional global fallback)

## Operational Checks Still Required

### Backups and Restore

- Confirm Supabase automated backups are enabled
- Record backup retention window
- Perform a restore drill in a non-production environment
- Document RPO and RTO

### Monitoring and Alerting

- Create Sentry alerts for:
  - new unhandled exceptions
  - elevated error rate
  - failed QBO callback / Paddle checkout spikes
- Monitor `GET /api/health`
- Add uptime monitoring for:
  - site root
  - dashboard login
  - `/api/health`

### Performance Validation

- Measure invoice scan latency under realistic tenant data
- Measure dashboard overview latency with production-like row counts
- Add indexes through a reviewed Prisma migration before high-volume launch

### Compliance Review

- Review Privacy Policy, Terms of Service, and Refund Policy with counsel
- Validate GDPR/CCPA workflows for access, deletion, and retention requests
- Keep legal business name consistent across site and billing providers
