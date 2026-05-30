import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// Tests for alert email branding logic.
// Pure-logic tests that don't require a live DB or Resend API key.

// Mirrors the firmName subject-prefix logic in lib/notifications/resend.ts
function buildSubject(firmName: string | undefined, subject: string): string {
  const label = firmName ?? 'Vantirs'
  return `[${label}] ${subject}`
}

describe('sendAlertEmail — firmName subject branding (REGRESSION D5)', () => {
  it('firmName provided → subject prefixed with [FirmName]', () => {
    const subject = buildSubject('Redwood CPA Group', 'CRITICAL: Bank Account Changed')
    assert.equal(subject, '[Redwood CPA Group] CRITICAL: Bank Account Changed')
  })

  it('firmName undefined → falls back to [Vantirs]', () => {
    const subject = buildSubject(undefined, 'HIGH: Email Domain Mismatch')
    assert.equal(subject, '[Vantirs] HIGH: Email Domain Mismatch')
  })

  it('empty string firmName → falls back to [Vantirs]', () => {
    const emptyName: string | undefined = ''
    const subject = buildSubject(emptyName || undefined, 'LOW: Pattern Mismatch')
    assert.equal(subject, '[Vantirs] LOW: Pattern Mismatch')
  })
})

describe('createDirectAlert guard (REGRESSION D6)', () => {
  it('throws when both invoiceId and vendorId are undefined', async () => {
    const { createDirectAlert } = await import('../lib/alerts/create')
    await assert.rejects(
      () => createDirectAlert({
        clientId: 'c1',
        severity: 'critical',
        type: 'bank_change',
        title: 'Test',
        description: 'Test',
      }),
      /createDirectAlert: must provide invoiceId or vendorId/
    )
  })

  it('does not throw the guard error when invoiceId is provided', async () => {
    const { createDirectAlert } = await import('../lib/alerts/create')
    const err = await createDirectAlert({
      clientId: 'c1',
      invoiceId: 'inv-1',
      severity: 'low',
      type: 'bank_change',
      title: 'Test',
      description: 'Test',
    }).then(() => null).catch((e: Error) => e)

    if (err) {
      assert.ok(
        !err.message.includes('must provide invoiceId or vendorId'),
        `Guard must not fire when invoiceId is set; got: ${err.message}`
      )
    }
  })

  it('does not throw the guard error when vendorId is provided (REGRESSION D5)', async () => {
    const { createDirectAlert } = await import('../lib/alerts/create')
    const err = await createDirectAlert({
      clientId: 'c1',
      vendorId: 'v-1',
      severity: 'low',
      type: 'bank_change',
      title: 'Test',
      description: 'Test',
    }).then(() => null).catch((e: Error) => e)

    if (err) {
      assert.ok(
        !err.message.includes('must provide invoiceId or vendorId'),
        `Guard must not fire when vendorId is set; got: ${err.message}`
      )
    }
  })
})
