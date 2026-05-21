import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  canonicalPaymentProfile,
  canonicalXeroBankDetails,
} from '../lib/vendor-payment-profile'

describe('canonicalPaymentProfile', () => {
  it('builds stable canonical string from bank parts', () => {
    const c = canonicalPaymentProfile({
      bankAccount: '123456789',
      routingNumber: '021000021',
      acctNum: 'V-99',
    })
    assert.equal(c, 'bank:123456789|routing:021000021|acct:V-99')
  })

  it('returns undefined when no payment data', () => {
    assert.equal(canonicalPaymentProfile({}), undefined)
  })
})

describe('canonicalXeroBankDetails', () => {
  it('stringifies object bank details deterministically', () => {
    const a = canonicalXeroBankDetails({ accountNumber: '99', sortCode: '12' })
    const b = canonicalXeroBankDetails({ sortCode: '12', accountNumber: '99' })
    assert.equal(a, b)
    assert.ok(a?.includes('accountNumber'))
  })
})
