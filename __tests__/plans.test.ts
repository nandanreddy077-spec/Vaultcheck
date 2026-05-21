import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { planFromPaddlePriceId, PLAN_LIMITS } from '../lib/plans'

describe('planFromPaddlePriceId', () => {
  it('maps configured price IDs to plan limits', () => {
    process.env.PADDLE_PRICE_STARTER = 'pri_starter_test'
    const mapped = planFromPaddlePriceId('pri_starter_test')
    assert.equal(mapped?.plan, 'starter')
    assert.equal(mapped?.maxClients, PLAN_LIMITS.starter.maxClients)
  })

  it('returns undefined for unknown price', () => {
    assert.equal(planFromPaddlePriceId('pri_unknown'), undefined)
  })
})
