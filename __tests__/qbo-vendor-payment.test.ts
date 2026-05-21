import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { extractQboVendorPayment } from '../lib/qbo/vendor-payment'

describe('extractQboVendorPayment', () => {
  it('prefers VendorPaymentBankDetail over AcctNum', () => {
    const p = extractQboVendorPayment({
      Id: '1',
      AcctNum: 'legacy-acct',
      VendorPaymentBankDetail: {
        BankAccountNumber: '987654321',
        RoutingNumber: '111000025',
        BankAccountName: 'Acme LLC',
      },
    })
    assert.ok(p.bankAccount?.includes('987654321'))
    assert.equal(p.routingNumber, '111000025')
  })

  it('falls back to AcctNum when no bank detail', () => {
    const p = extractQboVendorPayment({
      Id: '2',
      AcctNum: 'VENDOR-42',
    })
    assert.ok(p.bankAccount?.includes('VENDOR-42'))
  })
})
