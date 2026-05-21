import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { verifyCronAuthorization } from '../lib/cron-auth'

describe('verifyCronAuthorization', () => {
  it('returns misconfigured when CRON_SECRET missing', () => {
    const prev = process.env.CRON_SECRET
    delete process.env.CRON_SECRET
    try {
      const req = new Request('http://localhost/api/cron/rescan')
      assert.equal(verifyCronAuthorization(req), 'misconfigured')
    } finally {
      if (prev) process.env.CRON_SECRET = prev
    }
  })

  it('returns ok for matching bearer token', () => {
    process.env.CRON_SECRET = 'test-secret'
    const req = new Request('http://localhost/api/cron/rescan', {
      headers: { Authorization: 'Bearer test-secret' },
    })
    assert.equal(verifyCronAuthorization(req), 'ok')
  })

  it('returns unauthorized for wrong token', () => {
    process.env.CRON_SECRET = 'test-secret'
    const req = new Request('http://localhost/api/cron/rescan', {
      headers: { Authorization: 'Bearer wrong' },
    })
    assert.equal(verifyCronAuthorization(req), 'unauthorized')
  })
})
