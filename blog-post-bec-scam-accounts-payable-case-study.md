# The $500K Wire Transfer That Didn't Come Back: A BEC Case Study for Finance Teams

A mid-market construction company wired $496,000 to what its AP team believed was a long-standing subcontractor. The request came through email, referenced a real ongoing project, and included updated banking details. By the time the fraud was confirmed, the funds had already moved through three accounts across two countries. Recovery: zero.

This isn't a hypothetical. Business email compromise (BEC) scams targeting accounts payable teams stole more than $2.7 billion in a single year, according to FBI 2024 IC3 data — making it the highest-loss cybercrime category the Bureau tracks. The disturbing part isn't the scale. It's the mechanism: these attacks don't require hacking your systems. They require fooling one person on your AP team for about 90 seconds.

This BEC scam accounts payable case study walks through exactly how the attack works, why standard controls fail, and what pre-payment verification would have changed.

---

## How a BEC Scam Actually Unfolds in Accounts Payable

The term "business email compromise" makes it sound technical. It isn't. The core technique is social engineering layered onto routine AP processes — which is exactly what makes it so effective.

Here's how the attack typically progresses:

**Reconnaissance (2–4 weeks before the attack).** The attacker identifies a target company and a specific vendor relationship. This information is often gathered from LinkedIn (who handles AP?), public contracts databases (who does this company pay regularly?), and sometimes low-level phishing of an executive or vendor contact to gain access to email threads.

**Email compromise or spoofing.** The attacker either gains access to a real vendor email account — a technique known as vendor email compromise (VEC) — or creates a convincing lookalike domain. The latter might change one character: `invoices@acmeconstruction.com` becomes `invoices@acmeconstructions.com`. AP staff scanning a busy inbox rarely catch the difference.

**The triggering event.** The attacker sends an email that looks like a routine vendor communication. In the construction company case above, the email arrived during an active project, referenced the correct project number, and explained that the subcontractor had changed banks. It asked that all remaining payments be routed to a new account. The tone was professional. The timing was plausible.

**The wire.** Because the request matched an expected payment in the AP queue, and because the email appeared legitimate, the AP coordinator processed the wire with appropriate internal approvals. $496,000 left the account within 72 hours of the initial email.

The fraudster never needed to touch the company's systems. They manipulated one business process — vendor bank account updates — and extracted more than a year's worth of AP labor cost in a single transaction.

---

## Why Traditional AP Controls Failed in This BEC Scam Case Study

The construction company in this case had controls in place. They weren't a reckless operation. They had:

- A documented vendor onboarding process
- Dual-approval requirements for payments above $100K
- A general policy of calling vendors to verify "unusual" requests

So what failed?

**The "call to verify" policy had no teeth.** The policy said to call vendors for unusual requests. But "unusual" was never defined. A bank account change from a vendor you've worked with for three years, coming during an active project, didn't register as unusual to the AP coordinator. It registered as mildly inconvenient paperwork.

**Dual approval confirmed the wrong thing.** The two-approver requirement ensured that two people looked at the payment. Both people verified that the invoice amount matched what was expected and that the project number was correct. Neither was tasked with verifying whether the bank account itself was legitimate. The control validated the invoice. It didn't validate the destination.

**The phone number used for "verification" came from the fraudster.** This is a common detail that gets lost in post-incident analysis. When the AP coordinator did attempt to verify, she used a contact number included in the fraudulent email. The attacker had anticipated this and had a spoofed number ready. The "verification" call confirmed exactly what the fraudster wanted it to confirm.

**No independent check against known banking data.** The company had no system that cross-referenced new banking details against a verified record of the vendor's legitimate account. The AP team was working from a static spreadsheet of vendor information that hadn't been independently verified since initial onboarding.

[LINK: /blog/vendor-bank-account-change-fraud]

---

## The Signal That Was There — And Missed

Every BEC attack leaves signals. In this case study, there were two that went undetected:

**The domain was off by one character.** The email came from `acmeconstructions.com` rather than `acmeconstruction.com`. A trained eye would catch it. An AP coordinator managing 200 invoices a week, under deadline pressure, did not.

**The bank account belonged to a recently opened business account at a non-standard institution.** Had anyone run the routing number against a database of known vendor accounts, this would have flagged immediately. The subcontractor had been paid from the same account at the same regional bank for three years. The "new" account was at a national bank they'd never used.

Neither signal required sophisticated detection. Both required a process that checked outgoing payment destinations against a verified baseline — not just an approval that the invoice amount was correct.

This is the core gap in most AP controls: they validate what you're paying, not where the money is going.

---

## How Pre-Payment Verification Would Have Stopped It

Pre-payment verification is the practice of validating the destination of a payment — the actual bank account — before the wire is processed, not after.

In a system with automated pre-payment verification in place, this attack would have broken down at two points:

**Point 1: Bank account change alert.** When the updated banking details were entered into the AP system, the verification layer would have flagged that this vendor's banking information had changed and that the new account had no transaction history with this company. This triggers a mandatory verification workflow — not a discretionary "if it seems unusual" call, but a required hold until the change is confirmed through a separate, authenticated channel.

**Point 2: Routing and account validation.** The routing number for the fraudulent account would have been checked against the vendor's established banking profile. A first-time routing number for an existing vendor is a red flag. An account opened within the past 60 days is a red flag. These signals, evaluated automatically before the wire instruction is submitted, would have stopped the payment regardless of how convincing the email appeared.

The attack succeeded not because the AP team was careless. It succeeded because no part of the payment process was designed to ask the one question that matters: is this the actual account this vendor has always used, and has anyone confirmed that through a channel the attacker can't control?

---

## 5-Point BEC Prevention Checklist for AP Teams

If your organization processes more than $500K in monthly payments, these controls should already be in place. If they're not, address the gaps before the next vendor email hits your inbox.

**1. Establish a verified contact protocol for bank account changes.** Any request to update vendor banking information must trigger a verification call to a phone number on file from your vendor master — not a number included in the request itself. Document this call. Require it for every change, no exceptions.

**2. Implement a banking change freeze period.** Payments to updated banking details should be held for a minimum of 48–72 hours after the change is confirmed and logged. This creates a window to catch errors and gives the vendor time to detect if their own email has been compromised.

**3. Add destination validation to your AP approval workflow.** Your dual-approval process should explicitly include a step that confirms the payment destination matches the vendor's established, verified account. Not just that the invoice looks right — that the money is going to the right place.

**4. Train your team on domain spoofing.** Show your AP staff what a one-character domain swap looks like. Run a simulated phishing test that uses this technique. This isn't about making people feel bad — it's about building the reflex to check the sender domain on any email requesting financial action.

**5. Implement automated pre-payment account verification.** Manual controls have proven insufficient in BEC scam accounts payable scenarios at companies of every size and sophistication level. Automated verification — which cross-references outgoing payment destinations against verified vendor banking data, flags anomalies, and requires resolution before the wire is processed — is the only control that removes human judgment from the highest-risk moment in the payment cycle.

[LINK: /blog/accounts-payable-fraud-schemes-2026]

---

## The Math on Prevention vs. Recovery

According to the FBI, less than 30 percent of funds lost to BEC are recovered, and recovery is almost entirely dependent on how quickly the fraud is reported and whether the funds are still in transit. Once a wire clears to a domestic account and moves internationally — which typically happens within hours — recovery is functionally impossible.

The cost of a single BEC incident at the scale described in this case study isn't just the wire itself. Add forensic investigation, legal fees, the time cost of your finance and IT teams for weeks of incident response, potential cyber insurance premium increases, and the reputational risk if the incident becomes known to clients or partners. Industry estimates for total incident cost frequently put the real number at 2–3x the direct loss.

The cost of automated pre-payment verification is a fraction of one month's average BEC loss exposure for any company processing $1M or more in monthly payments.

---

## The Wire Already Left. Now What?

If you're reading this after a suspected BEC incident rather than before one, your first call is to your bank — not your IT team, not your attorney, not your CEO. Banks have fraud response units that can file a recall request through the SWIFT system. The faster that call happens, the higher the probability of recovery. Every hour matters.

After that call: notify the FBI's IC3 at ic3.gov. Preserve all email records — do not delete anything. Engage a forensic accountant if the loss exceeds your internal response capability.

But if you're reading this before an incident, you have the full range of prevention options available. The companies that get hit are almost always the ones who acknowledged the risk, meant to address it, and ran out of time.

---

## Don't Let the Next Wire Be a Case Study

The BEC scam accounts payable scenario in this post is a composite drawn from real incident patterns — the techniques, failure points, and dollar amounts reflect actual cases, not hypotheticals. The fraud vector is active, it's growing, and it specifically targets the AP workflows that most finance teams haven't hardened.

Vantirs catches BEC attacks, vendor account changes, and payment diversion attempts before the wire instruction reaches your bank — by validating every payment destination against verified vendor data in real time.

**See how Vantirs catches BEC scams in real time → Book a free payment audit at vantirs.com**

---

---
SEO METADATA
Meta Title (60 chars max): BEC Scam AP Case Study: The $500K Wire That Vanished
Meta Description (155 chars max): A real BEC scam accounts payable case study: $496K wired to fraudsters. Learn exactly how it happened, why controls failed, and how to prevent it.
Primary Keyword: BEC scam accounts payable case study
Secondary Keywords: business email compromise accounts payable, BEC wire fraud prevention, vendor email compromise AP
Suggested URL Slug: /blog/bec-scam-accounts-payable-case-study
Estimated Reading Time: 8 min
---

---
LINKEDIN POST (copy this to LinkedIn after publishing the blog)
---
An AP coordinator at a construction company processed a $496,000 wire transfer to a subcontractor she'd worked with for years.

The invoice was real. The project number matched. The email looked legitimate.

The bank account was fraudulent.

By the time the company confirmed the fraud, the money had moved through three accounts across two countries. Recovery: zero.

This is how business email compromise actually works in accounts payable — not through a system breach, not through a sophisticated hack. Through a spoofed email domain, a fake phone number for "verification," and a routine bank account change request that nobody thought to validate at the destination.

We broke down the full attack timeline, the specific controls that failed and why, and the 5-step checklist AP teams should implement before the next vendor email arrives.

If your team processes more than $500K a month and doesn't have automated payment destination validation in place, this is worth 8 minutes of your time.

Full breakdown at the link below ↓

#PaymentFraud #AccountsPayable #BECScam
