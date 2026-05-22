import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Returns an HTML report (print-to-PDF) showing what Vantirs monitored for a
// client this month — designed to be sent to the CPA's client as proof of service.
export async function GET(_req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const { dbUser, error } = await requireAuth()
  if (error || !dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const client = await prisma.client.findFirst({
    where: { id: clientId, firmId: dbUser.firmId },
    select: { id: true, name: true, lastSyncAt: true },
  })
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const firm = dbUser.firm as { name: string } | undefined
  const firmName = firm?.name ?? 'Your Accounting Firm'

  const [vendors, invoicesThisMonth, alertsThisMonth, openAlerts, verifications] = await Promise.all([
    prisma.vendor.count({ where: { clientId, isActive: true } }),
    prisma.invoice.findMany({
      where: { clientId, createdAt: { gte: monthStart } },
      select: { id: true, amount: true, riskScore: true, status: true, vendor: { select: { displayName: true } } },
    }),
    prisma.alert.findMany({
      where: { clientId, createdAt: { gte: monthStart } },
      include: { invoice: { select: { amount: true, vendor: { select: { displayName: true } } } } },
      orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.alert.count({ where: { clientId, status: 'open' } }),
    prisma.vendorVerification.findMany({
      where: { clientId, requestedAt: { gte: monthStart } },
      include: { vendor: { select: { displayName: true } } },
    }),
  ])

  const critical = alertsThisMonth.filter(a => a.severity === 'critical')
  const high = alertsThisMonth.filter(a => a.severity === 'high')
  const resolved = alertsThisMonth.filter(a => a.status === 'resolved')
  const totalScanned = invoicesThisMonth.length
  const highRisk = invoicesThisMonth.filter(i => i.riskScore >= 36)
  const totalValue = invoicesThisMonth.reduce((s, i) => s + i.amount, 0)

  const insiderTypes = ['duplicate_invoice', 'new_vendor_large_payment', 'round_dollar_anomaly', 'velocity_spike']
  const insiderAlerts = alertsThisMonth.filter(a => insiderTypes.includes(a.type))
  const externalAlerts = alertsThisMonth.filter(a => !insiderTypes.includes(a.type))

  function severityColor(s: string) {
    if (s === 'critical') return '#dc2626'
    if (s === 'high') return '#ea580c'
    if (s === 'medium') return '#ca8a04'
    return '#64748b'
  }

  function alertTypeLabel(t: string) {
    const map: Record<string, string> = {
      bank_change: 'Bank account change',
      amount_anomaly: 'Amount anomaly',
      new_vendor: 'New vendor',
      email_mismatch: 'Email domain mismatch',
      pattern_mismatch: 'Payment pattern mismatch',
      duplicate_invoice: 'Duplicate invoice',
      new_vendor_large_payment: 'New vendor large payment',
      round_dollar_anomaly: 'Round-dollar anomaly',
      velocity_spike: 'Payment velocity spike',
    }
    return map[t] ?? t.replace(/_/g, ' ')
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AP Protection Report — ${client.name} — ${monthLabel}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0b1c30; background: #fff; font-size: 14px; line-height: 1.5; }
  .page { max-width: 780px; margin: 0 auto; padding: 48px 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #003ec7; margin-bottom: 32px; }
  .header-left h1 { font-size: 22px; font-weight: 700; color: #0b1c30; }
  .header-left p { font-size: 13px; color: #64748b; margin-top: 4px; }
  .badge { display: inline-flex; align-items: center; gap: 6px; background: #003ec7; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card { background: #f8f9ff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; }
  .stat-card .number { font-size: 28px; font-weight: 700; color: #003ec7; }
  .stat-card .label { font-size: 12px; color: #64748b; margin-top: 2px; }
  .stat-card.alert-card .number { color: ${critical.length > 0 ? '#dc2626' : high.length > 0 ? '#ea580c' : '#16a34a'}; }
  section { margin-bottom: 28px; }
  section h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
  .alert-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
  .alert-row:last-child { border-bottom: none; }
  .severity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
  .alert-body strong { font-weight: 600; font-size: 13px; }
  .alert-body p { font-size: 12px; color: #64748b; margin-top: 2px; }
  .alert-meta { font-size: 11px; color: #94a3b8; margin-top: 4px; }
  .status-pill { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  .status-resolved { background: #dcfce7; color: #16a34a; }
  .status-open { background: #fef9c3; color: #854d0e; }
  .verify-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  .verify-status { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
  .verify-completed { background: #dcfce7; color: #16a34a; }
  .verify-pending { background: #fef9c3; color: #854d0e; }
  .empty-state { color: #94a3b8; font-size: 13px; font-style: italic; padding: 8px 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
  .footer p { font-size: 11px; color: #94a3b8; }
  .disclaimer { margin-top: 16px; background: #f8f9ff; border-radius: 8px; padding: 12px 16px; font-size: 11px; color: #64748b; line-height: 1.6; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <h1>AP Protection Report</h1>
      <p>${client.name} &nbsp;·&nbsp; ${monthLabel} &nbsp;·&nbsp; Prepared by ${firmName}</p>
    </div>
    <div class="badge">🛡️ Vantirs Protected</div>
  </div>

  <!-- Summary stats -->
  <div class="summary-grid">
    <div class="stat-card">
      <div class="number">${vendors}</div>
      <div class="label">Vendors monitored</div>
    </div>
    <div class="stat-card">
      <div class="number">${totalScanned}</div>
      <div class="label">Invoices reviewed this month</div>
    </div>
    <div class="stat-card alert-card">
      <div class="number">${alertsThisMonth.length}</div>
      <div class="label">Risk alerts generated${resolved.length > 0 ? ` (${resolved.length} resolved)` : ''}</div>
    </div>
    <div class="stat-card">
      <div class="number">$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
      <div class="label">Total invoice value reviewed</div>
    </div>
    <div class="stat-card">
      <div class="number">${highRisk.length}</div>
      <div class="label">High-risk invoices flagged</div>
    </div>
    <div class="stat-card">
      <div class="number">${verifications.length}</div>
      <div class="label">Vendor verifications sent</div>
    </div>
  </div>

  <!-- External fraud alerts -->
  <section>
    <h2>External Fraud Alerts (${externalAlerts.length})</h2>
    ${externalAlerts.length === 0
      ? '<p class="empty-state">No external fraud alerts this month — all monitored invoices passed external checks.</p>'
      : externalAlerts.map(a => `
        <div class="alert-row">
          <div class="severity-dot" style="background:${severityColor(a.severity)}"></div>
          <div class="alert-body" style="flex:1">
            <strong>${a.title}</strong>
            <span class="status-pill ${a.status === 'resolved' ? 'status-resolved' : 'status-open'}" style="margin-left:8px">
              ${a.status === 'resolved' ? 'Resolved' : 'Open'}
            </span>
            <p>${a.description}</p>
            <div class="alert-meta">${alertTypeLabel(a.type)} &nbsp;·&nbsp; ${a.invoice?.vendor?.displayName ?? 'Unknown vendor'} &nbsp;·&nbsp; $${(a.invoice?.amount ?? 0).toLocaleString()}</div>
          </div>
        </div>`).join('')}
  </section>

  <!-- Insider risk alerts -->
  <section>
    <h2>Insider Risk Alerts (${insiderAlerts.length})</h2>
    ${insiderAlerts.length === 0
      ? '<p class="empty-state">No insider risk patterns detected this month.</p>'
      : insiderAlerts.map(a => `
        <div class="alert-row">
          <div class="severity-dot" style="background:${severityColor(a.severity)}"></div>
          <div class="alert-body" style="flex:1">
            <strong>${a.title}</strong>
            <span class="status-pill ${a.status === 'resolved' ? 'status-resolved' : 'status-open'}" style="margin-left:8px">
              ${a.status === 'resolved' ? 'Resolved' : 'Open'}
            </span>
            <p>${a.description}</p>
            <div class="alert-meta">${alertTypeLabel(a.type)} &nbsp;·&nbsp; ${a.invoice?.vendor?.displayName ?? 'Unknown vendor'}</div>
          </div>
        </div>`).join('')}
  </section>

  <!-- Vendor verifications -->
  <section>
    <h2>Bank Detail Verifications (${verifications.length})</h2>
    ${verifications.length === 0
      ? '<p class="empty-state">No vendor verifications initiated this month.</p>'
      : verifications.map(v => `
        <div class="verify-row">
          <span>${v.vendor.displayName}</span>
          <span class="verify-status ${v.status === 'completed' ? 'verify-completed' : 'verify-pending'}">
            ${v.status === 'completed' ? '✓ Verified ' + (v.completedAt ? new Date(v.completedAt).toLocaleDateString() : '') : 'Pending'}
          </span>
        </div>`).join('')}
  </section>

  <!-- Footer -->
  <div class="footer">
    <p>Generated ${now.toLocaleDateString('en-US', { dateStyle: 'long' })} &nbsp;·&nbsp; ${firmName} &nbsp;·&nbsp; Powered by Vantirs</p>
    <p>Open alerts: <strong>${openAlerts}</strong></p>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This report reflects monitoring activity and risk alerts generated by Vantirs during the period shown. It documents alerts reviewed and actions taken — it is not a guarantee that no fraud occurred or will occur. All alerts require human review before any payment decision. ${firmName} and Vantirs are not liable for losses arising from fraud not detected by automated monitoring.
  </div>

</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="protection-report-${client.name.replace(/\s+/g, '-')}-${monthLabel.replace(' ', '-')}.html"`,
    },
  })
}
