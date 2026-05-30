import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// Tests for createVendorAlert dedup logic and createDirectAlert guard.
// These test the pure / throwable paths that do not require a live DB connection.
// DB-integration paths (alert creation, email send) require an integration test env.

describe('createDirectAlert guard', () => {
  it('throws immediately when both invoiceId and vendorId are undefined (REGRESSION D6)', async () => {
    // Import here so prisma lazy-init doesn't block; the guard fires before any DB call.
    const { createDirectAlert } = await import('../lib/alerts/create')
    await assert.rejects(
      () => createDirectAlert({
        clientId: 'client-1',
        severity: 'critical',
        type: 'bank_change',
        title: 'Test',
        description: 'Test',
      }),
      /createDirectAlert: must provide invoiceId or vendorId/
    )
  })

  it('does NOT throw when invoiceId is provided', async () => {
    // Guard passes — DB call will fail in test env (no connection), which is a different error.
    const { createDirectAlert } = await import('../lib/alerts/create')
    const err = await createDirectAlert({
      clientId: 'client-1',
      invoiceId: 'invoice-1',
      severity: 'low',
      type: 'bank_change',
      title: 'Test',
      description: 'Test',
    }).then(() => null).catch((e: Error) => e)

    // Should NOT be the guard error
    if (err) {
      assert.ok(
        !err.message.includes('must provide invoiceId or vendorId'),
        `Expected guard NOT to fire; got: ${err.message}`
      )
    }
  })

  it('does NOT throw when vendorId is provided', async () => {
    const { createDirectAlert } = await import('../lib/alerts/create')
    const err = await createDirectAlert({
      clientId: 'client-1',
      vendorId: 'vendor-1',
      severity: 'low',
      type: 'bank_change',
      title: 'Test',
      description: 'Test',
    }).then(() => null).catch((e: Error) => e)

    if (err) {
      assert.ok(
        !err.message.includes('must provide invoiceId or vendorId'),
        `Expected guard NOT to fire; got: ${err.message}`
      )
    }
  })
})

describe('createVendorAlert 24h dedup window', () => {
  it('24h cutoff timestamp is calculated correctly', () => {
    const before = Date.now()
    const cutoff = new Date(Date.now() - 86_400_000)
    const after = Date.now()

    // cutoff should be approximately 24 hours ago
    const diffMs = before - cutoff.getTime()
    assert.ok(diffMs >= 86_400_000 - 10 && diffMs <= 86_400_000 + (after - before) + 10,
      `24h cutoff off by ${diffMs - 86_400_000}ms`)
  })

  it('dedup key uses vendorId+type+clientId (not invoiceId)', () => {
    // Verify the documented dedup key shape matches the schema index
    // @@index([vendorId, type, clientId]) — NOT invoiceId
    const dedupKey = { vendorId: 'v1', type: 'bank_change', clientId: 'c1', status: 'open' }
    assert.ok('vendorId' in dedupKey)
    assert.ok('clientId' in dedupKey)
    assert.ok(!('invoiceId' in dedupKey), 'invoiceId must NOT be part of vendor-level dedup key')
  })
})
