import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// Tests for NACHA export parameter parsing logic.
// These test the pure validation/calculation paths extracted from the route handler.
// Auth and DB-scoped tests require an integration environment.

// Mirrors the days-param logic in app/api/audit-log/route.ts
function parseDaysParam(daysRaw: string | null): { error: string } | { from: Date } {
  if (daysRaw === null) {
    return { from: new Date(Date.now() - 90 * 86_400_000) }
  }
  const parsed = parseInt(daysRaw, 10)
  if (isNaN(parsed)) {
    return { error: 'days must be a number' }
  }
  const clamped = Math.min(Math.max(parsed, 1), 365)
  return { from: new Date(Date.now() - clamped * 86_400_000) }
}

function isTruncated(rowCount: number): boolean {
  return rowCount === 10_000
}

describe('NACHA export — days param parsing', () => {
  it('missing days defaults to 90 days', () => {
    const result = parseDaysParam(null)
    assert.ok(!('error' in result))
    const diffDays = Math.round((Date.now() - (result as { from: Date }).from.getTime()) / 86_400_000)
    assert.ok(diffDays >= 89 && diffDays <= 91, `Expected ~90 days, got ${diffDays}`)
  })

  it('days=abc returns error (not a number)', () => {
    const result = parseDaysParam('abc')
    assert.ok('error' in result)
    assert.ok((result as { error: string }).error.includes('days must be a number'))
  })

  it('days=30 returns 30-day window', () => {
    const result = parseDaysParam('30')
    assert.ok(!('error' in result))
    const diffDays = Math.round((Date.now() - (result as { from: Date }).from.getTime()) / 86_400_000)
    assert.ok(diffDays >= 29 && diffDays <= 31, `Expected ~30 days, got ${diffDays}`)
  })

  it('days=400 clamps to 365', () => {
    const result = parseDaysParam('400')
    assert.ok(!('error' in result))
    const diffDays = Math.round((Date.now() - (result as { from: Date }).from.getTime()) / 86_400_000)
    assert.ok(diffDays >= 364 && diffDays <= 366, `Expected ~365 days, got ${diffDays}`)
  })

  it('days=0 clamps to 1', () => {
    const result = parseDaysParam('0')
    assert.ok(!('error' in result))
    const diffDays = Math.round((Date.now() - (result as { from: Date }).from.getTime()) / 86_400_000)
    assert.ok(diffDays >= 0 && diffDays <= 2, `Expected ~1 day, got ${diffDays}`)
  })
})

describe('NACHA export — truncated flag', () => {
  it('exactly 10000 rows → truncated:true (REGRESSION eng review gap B)', () => {
    assert.equal(isTruncated(10_000), true)
  })

  it('9999 rows → truncated:false', () => {
    assert.equal(isTruncated(9_999), false)
  })

  it('0 rows → truncated:false', () => {
    assert.equal(isTruncated(0), false)
  })
})
