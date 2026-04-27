# CFO's Payment Fraud Risk Checklist: 20 Controls You Should Have in Place

Last year, a mid-sized manufacturing company discovered it had been paying a ghost vendor for 14 months. The fraud wasn't detected by an auditor or an AP manager — it was caught by accident, when a departing employee's replacement noticed a vendor name that matched no active contract. By then, more than $400,000 had left the account. The CFO had signed off on every quarterly compliance report. No one had reviewed vendor master data for changes.

This isn't an edge case. According to the Association of Certified Fraud Examiners (ACFE), organizations lose an estimated 5% of their annual revenue to fraud, and a significant portion runs directly through accounts payable. More importantly: the CFO is increasingly liable for it.

The shift in accountability has been happening gradually and then all at once. Boards, external auditors, and cyber insurers now expect CFOs to demonstrate proactive fraud controls — not just reactive detection after the damage is done. Regulatory frameworks, insurance underwriting questionnaires, and SOX compliance audits increasingly ask for documented evidence of specific controls. "We have an AP team we trust" is not an answer that holds up under scrutiny.

This payment fraud risk checklist gives CFOs a structured tool to audit current controls, identify gaps, and prioritize remediation before the next payment goes out the door.

---

## The Payment Fraud Risk Checklist Every CFO Should Review

The 20 controls below are organized across five critical domains: vendor onboarding, invoice validation, payment authorization, exception handling, and audit trail maintenance. For each control, ask your team whether the process is documented, enforced consistently, and verifiable.

Score yourself 1 point for each control that is fully implemented with documented evidence. A score below 14 indicates critical gaps that require immediate remediation.

---

### Section 1: Vendor Onboarding Controls (Controls 1–4)

**Control 1: Formal vendor onboarding with documented approval**

Every new vendor should pass through a defined onboarding workflow that requires at minimum a W-9 (or equivalent), proof of business entity, and sign-off from a manager outside the AP function. Verbal approvals or email-only approvals are not sufficient. The onboarding record should be retrievable during an audit without manual reconstruction.

**Control 2: Independent verification of vendor banking details**

Before a new vendor is paid for the first time, someone outside of the person who received the banking information should independently verify those details via a callback to a number sourced from official records — not from the email or document that provided the bank info. This is the single most frequently exploited gap in vendor onboarding, and the mechanism behind most successful vendor impersonation attacks. [LINK: /blog/vendor-bank-account-change-fraud]

**Control 3: Vendor master data change authorization**

Any change to an existing vendor record — particularly banking details — should require dual approval from two individuals who cannot both be in the same reporting line. The change request should be logged with timestamps and approver identity preserved. A vendor bank account change that flows through on a single approval, based solely on an emailed request, is not a control. It is a vulnerability.

**Control 4: Periodic vendor master data review**

At least quarterly, someone with authority to remove vendors should review the full vendor master list for dormant vendors, duplicate vendor names, and recently changed banking information. Ghost vendors — fictional entities created by insiders or fraudsters — frequently survive indefinitely in AP systems because no one audits the list after initial setup.

---

### Section 2: Invoice Validation Controls (Controls 5–10)

**Control 5: Three-way match enforcement (PO, receipt, invoice)**

Every invoice above a materiality threshold should be matched against a corresponding purchase order and a goods receipt or service confirmation before it is approved for payment. Invoices processed without a matching PO are the single most exploitable gap in most AP workflows. Exceptions should be logged and reviewed, not quietly waved through.

**Control 6: Duplicate invoice detection**

Your AP system should be configured to flag duplicate invoice numbers from the same vendor and near-duplicate invoices — same amount, slightly different number — before they enter the approval queue. Industry research consistently identifies duplicate invoices as one of the most common and easily preventable fraud mechanisms. Manual detection by AP staff is unreliable at volume.

**Control 7: Vendor legitimacy checks for invoices above threshold**

For invoices above a defined dollar threshold, a secondary reviewer should confirm that the vendor is active, the invoice references a real engagement, and the bank account on file matches the vendor's verified record — not just what appears on the invoice itself. An invoice can reference a legitimate vendor name while routing payment to a fraudster's account.

**Control 8: AI-generated document scrutiny protocol**

This control is increasingly critical in 2026. AI tools have made it straightforward to generate convincing fake invoices that pass visual inspection. Your team should not rely on visual review as a primary detection method for high-value invoices. Behavioral signals matter more than aesthetics: Is this vendor suddenly increasing invoice frequency? Is the invoice format subtly different from prior submissions? Is the amount just below an approval threshold? [LINK: /blog/ai-generated-fake-invoice-detection]

**Control 9: Invoice submission channel control**

Invoices should only be accepted through a controlled channel — a dedicated AP email address, a vendor portal, or a defined submission form. Invoices submitted via personal emails, chat messages, or verbal requests should be rejected and re-submitted through the approved channel. Channel discipline eliminates a significant attack surface.

**Control 10: Segregation of invoice receipt and payment approval**

The person who receives and enters an invoice into the system should not be the same person who approves it for payment. This segregation of duties is foundational and frequently skipped by smaller finance teams for convenience. It is also one of the first controls an external auditor will ask to verify.

---

### Section 3: Payment Authorization Controls (Controls 11–15)

**Control 11: Dual authorization for wire transfers above a defined threshold**

Set a dollar threshold above which every payment — including routine vendor payments — requires sign-off from two authorized approvers. For most companies, this threshold should sit between $10,000 and $25,000. Business email compromise attacks frequently target large wire transfers that proceed on single approval, because the fraudster only needs to compromise or impersonate one decision-maker.

**Control 12: Out-of-band verification for payment instruction changes**

If a vendor requests a change to payment method or banking details, the person acting on that change must verify it through a separate communication channel from the one that delivered the request. Calling the vendor at a known, independently sourced phone number is the minimum acceptable standard. Replying to the email that delivered the change request is not verification — it is how the fraud succeeds.

**Control 13: Positive pay or ACH pre-screening**

For companies still processing checks, positive pay with your bank adds a layer that prevents unauthorized check cashing. For ACH payments, a pre-payment screening step that validates bank account ownership substantially reduces account hijacking risk. Your bank can confirm what tools are available; many finance teams do not use them.

**Control 14: Time-restricted payment windows**

Payment runs should occur on a defined schedule, not on demand. Urgent payment requests that arrive outside normal business hours or outside normal payment cycles are a statistically significant fraud indicator. Standing policy should require additional authorization for any out-of-cycle payment, regardless of how urgently the request is framed.

**Control 15: CEO/CFO impersonation alert protocol**

Business email compromise attacks frequently impersonate the CEO or CFO with urgent wire transfer requests directed at AP or treasury staff. Your team needs a standing, written, acknowledged protocol: no wire transfer is processed based solely on an email request from an executive, regardless of how the request is framed or how urgent it appears. A documented protocol removes both the ambiguity and the authority pressure that make these attacks effective.

---

### Section 4: Exception Handling Controls (Controls 16–18)

**Control 16: Formal exception logging**

Every payment that bypasses a standard control — an invoice processed without a PO, an urgent payment approved outside normal workflow, a vendor paid from a new bank account before verification was completed — must be logged formally with the reason, the approving authority, and the date. Exceptions that are not logged cannot be audited, and patterns of abuse in exception handling are invisible without a log.

**Control 17: Exception trend review at the CFO level**

Someone at the CFO level or their direct delegate should review exception logs monthly. A sudden increase in exceptions — particularly around a specific vendor, a specific AP staff member, or a specific transaction type — is a warning signal that warrants investigation. Exception volume trending upward is frequently the earliest detectable sign of insider fraud or a systematic process being exploited.

**Control 18: Non-punitive escalation path for suspicious requests**

Your AP team needs a clear, safe escalation path for flagging suspicious payment requests. If the organizational culture discourages raising concerns about urgent executive requests — or treats escalations as a friction problem rather than a control — those concerns will be suppressed. The fraud will proceed because no one wanted to slow things down or question a senior leader.

---

### Section 5: Audit Trail and Monitoring Controls (Controls 19–20)

**Control 19: Immutable payment approval audit trail**

Your AP system should log every action taken on a payment — who created it, who approved it, any changes made after creation, and the timestamp for each event. This log should not be editable by users with standard AP access. It exists for audit purposes and for forensic investigation if fraud is discovered after the fact. A system without a protected audit trail cannot support a credible investigation.

**Control 20: Pre-payment automated fraud screening**

Manual controls are necessary but not sufficient. At volume, human review introduces fatigue, inconsistency, and exploitable gaps that compound over time. A pre-payment fraud detection layer that screens every payment against known fraud signals — vendor bank account changes, behavioral anomalies, BEC indicators, duplicate patterns, first-time payee risk — catches what manual review misses, without adding headcount or slowing payment cycles. This is where the payment fraud risk checklist transitions from process documentation to operational fraud prevention.

---

## Score Interpretation: Where You Stand and What to Fix First

**Score 18–20:** Strong control environment. Confirm that controls are enforced consistently across all payment types and all AP staff — not just documented in policy.

**Score 14–17:** Adequate foundation with specific gaps. Prioritize remediation in the sections with the lowest scores. Gap in Section 1 or 3 carries higher immediate risk than a gap in Section 5.

**Score below 14:** Critical gaps present. You are exposed to preventable fraud that manual controls will not catch reliably. Prioritize vendor onboarding controls and payment authorization controls immediately.

---

## The 3 Controls Most Companies Miss

Working through this payment fraud risk checklist, three controls are most consistently absent in mid-market finance teams — and each maps directly to a common fraud vector.

**Out-of-band verification for banking changes (Control 12).** Most companies know they should do this. Most do not. When a spoofed vendor email arrives with new banking information and a plausible invoice attached, AP teams frequently process it without a phone callback because the change "looked legitimate." This is the mechanism behind most successful vendor impersonation attacks.

**CEO/CFO impersonation alert protocol (Control 15).** A written policy that staff have signed is materially different from a general awareness that urgent wire requests should be handled carefully. BEC attacks exploit ambiguity and authority pressure in the moment. A documented, acknowledged protocol removes both.

**Pre-payment automated fraud screening (Control 20).** Most organizations have controls that apply after a payment is flagged or after money leaves the account. Recovery is rare and expensive — according to FBI IC3 data, recovered funds represent a small fraction of BEC losses reported annually. Pre-payment screening that checks every transaction against fraud signals before the final approval is the control that converts detection into prevention.

---

## See How Vantirs Catches Payment Fraud in Real Time

Working through this checklist tells you where the gaps are. Closing them requires the right processes — and increasingly, the right technology to enforce those processes at the speed and volume that modern AP teams operate.

See how Vantirs catches vendor impersonation, BEC attacks, and fake invoice fraud before a single dollar leaves your account → Book a free payment audit at vantirs.com

---

SEO METADATA
Meta Title (60 chars max): CFO's Payment Fraud Risk Checklist: 20 Controls You Need
Meta Description (155 chars max): A 20-point payment fraud risk checklist for CFOs covering vendor onboarding, invoice validation, wire transfer controls, and pre-payment screening. Score your gaps now.
Primary Keyword: payment fraud risk checklist CFO
Secondary Keywords: accounts payable fraud controls, CFO payment fraud prevention, payment fraud internal controls
Suggested URL Slug: /blog/cfo-payment-fraud-risk-checklist
Estimated Reading Time: 8 min
---

---
LINKEDIN POST (copy this to LinkedIn after publishing the blog)
---
A CFO at a mid-market manufacturer signed off on every quarterly compliance report. The fraud ran right through accounts payable for 14 months.

No one audited the vendor master list. No one called to verify when a vendor changed their banking details. No dual authorization on wire transfers above $50K. No exception log.

By the time anyone noticed, $400,000 was gone.

Here's what I see consistently: most finance teams have *some* fraud controls. Very few have *all* the controls they need, enforced consistently, with documentation that would hold up under audit or insurance review.

The accountability has shifted. CFOs are now expected to demonstrate proactive fraud controls to boards, external auditors, and cyber insurers — not just respond after the wire clears.

So I put together a 20-point payment fraud risk checklist covering every critical domain: vendor onboarding, invoice validation, payment authorization, exception handling, and audit trail requirements.

Score yourself. If you're below 14, you have gaps that are actively exploitable today.

The 3 controls most companies miss — and each one maps to a real, recurring fraud attack — are worth reading on their own.

Full breakdown at the link below ↓

#PaymentFraud #CFO #AccountsPayable
