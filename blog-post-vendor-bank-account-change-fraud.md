# Vendor Bank Account Change Requests: The Fraud Vector Nobody Talks About

A mid-sized manufacturing company receives an email from their longtime steel supplier. The message is professional, references their account number correctly, and includes a signed PDF on company letterhead. The supplier's banking details have changed — could AP please update them before the next invoice run? AP complies. Three weeks and two wire transfers later, the company discovers the supplier never sent that email. The $280,000 is gone.

This is vendor bank account change fraud, and according to the FBI's Internet Crime Complaint Center (IC3), Business Email Compromise schemes — of which this is a primary variant — resulted in over $2.9 billion in losses in 2023 alone. The troubling part isn't the dollar figure. It's how routine the attack vector is, and how confidently most AP teams believe their existing controls would catch it.

They usually don't.

---

## Why Vendor Bank Account Change Fraud Works So Well

The mechanics of vendor bank account change fraud are deceptively simple. An attacker — either through email spoofing, a compromised vendor inbox, or a convincing lookalike domain — contacts your AP team and requests a banking update. Unlike a fake invoice, which introduces a new payable, this attack hijacks an *existing* payment relationship. Your vendor is real. The invoice is real. The amount is real. Only the destination account has changed.

This is precisely why standard AP fraud controls fail to catch it. Three-way matching confirms the invoice against a purchase order and a receipt — it says nothing about whether the bank account on file is legitimate. Vendor master verification processes, if they exist at all, are often a one-time onboarding step rather than an ongoing control. And dual-approval workflows for payment runs don't help if both approvers are looking at a clean invoice going to what appears to be a verified vendor.

The fraud exploits the gap between invoice verification and payment destination verification. Most companies have robust controls on the former and almost none on the latter.

---

## The Three Attack Patterns Your Team Needs to Recognize

Vendor bank account change fraud shows up in three primary configurations, each with a different risk profile.

**1. Spoofed Domain Requests**

The attacker registers a domain that looks nearly identical to your vendor's — swapping a letter, adding a hyphen, or using a different TLD. They send a bank change request from `billing@acme-supplies.co` while your real vendor lives at `acme-supplies.com`. At a glance, in a busy inbox, the difference is invisible. These attacks are low-cost and scalable; attackers run them against hundreds of AP departments simultaneously.

**2. Compromised Vendor Email Accounts**

More sophisticated attacks start with the attacker compromising the actual vendor's email account. The request comes from a legitimate domain, passes SPF/DKIM checks, and may reference real invoice numbers, recent conversations, or the AP contact by name. These are the attacks that get past even security-aware teams. The only reliable signal is the account change itself.

**3. Insider-Assisted Fraud**

A smaller but real percentage of vendor bank account changes are facilitated by someone inside the organization — a disgruntled employee, a contractor with access to vendor management systems, or someone who has been socially engineered into making the change. This variant is particularly difficult to detect because the request may originate from an internal system or an authorized user account. [LINK: /blog/insider-threat-accounts-payable]

---

## What Adequate Controls Actually Look Like

Most AP fraud prevention guidance stops at "call the vendor to confirm." That's necessary but insufficient. Here's what a layered control environment for vendor bank account changes looks like in practice.

**Separate the request from the verification.** The person who receives a bank change request should never be the same person who verifies it. Build a workflow where the request is logged, assigned, and verified by a different team member using contact information pulled from your original onboarding records — not anything included in the request itself.

**Maintain a verified vendor contact registry.** Your vendor master should include a designated finance contact and a verified callback number obtained independently at onboarding. When a bank change request arrives, the verification call goes to that number — not to any phone number in the requesting email.

**Set a mandatory hold period.** New banking details should not be active for payment until at least 48–72 hours after verification. This creates a window to catch fraud before money moves. It also discourages urgency-based social engineering ("we really need this updated before Friday's payment run").

**Flag every bank change in your payment system.** Payments going to a bank account that was updated within the last 30 days should trigger a secondary review flag — regardless of invoice amount. This is a high-signal, low-noise control because legitimate bank changes are relatively rare.

**Monitor for domain similarity.** Email security tools that flag lookalike domains catch a significant portion of spoofed-domain attacks before they reach AP. This is a technical control that operates upstream of human judgment.

The problem is that even well-designed manual controls have failure modes. Teams are busy, procedures get skipped during month-end, and a sufficiently convincing attack will eventually clear a human verification step. The companies that have eliminated this fraud vector almost entirely have moved to automated detection that validates payment destinations against continuously updated risk signals — flagging anomalies before the payment runs rather than investigating after money is gone.

---

## The Lifecycle of a Vendor Bank Account Change Fraud Attack

Understanding the timeline helps finance leaders see where their controls actually need to sit.

The average vendor bank account change fraud attack unfolds over two to four weeks. The attacker identifies a target — typically a company with publicly known vendors, found through supplier directories, press releases, or LinkedIn — and researches the AP contact. The initial request is sent and, in successful attacks, the bank change is made. The attacker then waits. They want the *next scheduled payment*, not an emergency wire that might trigger extra scrutiny.

By the time the fraud is discovered — usually when the real vendor follows up on a past-due invoice — one or two full payment cycles have passed. The money has been moved through multiple accounts and is effectively unrecoverable. The FBI's financial fraud recovery unit reports that recovery rates for BEC-related wire transfers drop sharply after 24 hours, and the majority of funds that aren't recalled within the first business day are never recovered.

This timing dynamic has an important implication: the only effective intervention point is *before the payment runs*. Post-payment investigation is almost always too late.

---

## Why 2026 Makes This Worse

Several trends are amplifying vendor bank account change fraud risk in 2026 specifically.

First, AI-generated correspondence has eliminated the grammar and formatting errors that used to be reliable fraud signals. A bank change request generated by a large language model is indistinguishable from one written by a native English speaker with professional business writing experience. The "this email looks off" instinct is no longer reliable.

Second, the shift to faster payment rails — same-day ACH, real-time payments — compresses the window for fraud detection and recovery. A wire that once settled in 1–2 days now clears in minutes. The practical implication is that controls that were adequate under older payment timelines are no longer fit for purpose.

Third, vendor relationships are increasingly distributed across remote teams, making it harder to maintain the informal relationship awareness that once served as a fraud check. An AP clerk who had lunch with the vendor's rep twice a year had a baseline sense of what "normal" communications looked like. Fully remote, high-turnover AP departments lack that context entirely.

Finance leaders who haven't revisited their vendor change controls in the last two years are operating with a risk posture built for a different threat environment. [LINK: /blog/accounts-payable-fraud-schemes-2026]

---

## Detecting Vendor Bank Account Change Fraud Before the Payment Runs

The fundamental challenge is that vendor bank account change fraud is designed to look like a normal business process. That's why detection has to happen at the payment level — not just at the request level.

Effective detection layers include automated monitoring of changes to vendor banking details, with all modified records flagged for enhanced scrutiny on the next payment cycle. Payment destination validation — checking account numbers against known fraud databases and flagging first-time-use accounts — adds another signal. Behavioral analytics that establish a payment baseline for each vendor relationship and flag deviations (new bank, new routing number, unusual payment timing) catch the cases that slip past document-level controls.

None of this requires replacing your AP team or overhauling your ERP. The most effective implementations layer automated detection on top of existing workflows, surfacing flags at the point in the process where a human can act on them — before approval, not after posting.

The goal isn't to make your AP team paranoid about every payment. It's to give them reliable signals so they can direct their scrutiny to the right transactions at the right time.

---

## What Vantirs Catches That Manual Controls Miss

Vantirs monitors every payment in your AP workflow against a set of continuously updated fraud signals, including vendor bank account changes. When a payment is about to go to an account that was recently updated, doesn't match established payment patterns for that vendor, or shows other anomaly signals, Vantirs flags it before the payment runs — giving your team the chance to verify before money moves, not after.

The system doesn't replace your AP team's judgment. It gives them the right information at the right moment, with enough context to make a confident decision instead of a rushed one.

**See how Vantirs catches vendor bank account change fraud in real time → Book a free payment audit at vantirs.com**

---

SEO METADATA
Meta Title (60 chars max): Vendor Bank Account Change Fraud: How to Stop It
Meta Description (155 chars max): Vendor bank account change fraud is draining AP departments. Learn how attacks work, where controls fail, and what stops it before money moves.
Primary Keyword: vendor bank account change fraud
Secondary Keywords: vendor payment fraud, AP fraud prevention, BEC scam accounts payable
Suggested URL Slug: /blog/vendor-bank-account-change-fraud
Estimated Reading Time: 7 min

---

LINKEDIN POST (copy this to LinkedIn after publishing the blog)
---
Your AP team just got an email from a long-standing vendor. New banking details. Signed PDF on letterhead. References the right account number. Looks completely legitimate.

They update the vendor record. Two payment cycles later, you find out your real vendor never sent that email.

This is vendor bank account change fraud — and it's one of the most effective attacks against finance teams right now. Not because it's technically sophisticated, but because it exploits the one gap almost every AP department has: you verify invoices carefully, but almost nobody verifies where the money is actually going.

The reason it keeps working in 2026:
— AI-generated emails have eliminated the "this looks off" instinct
— Faster payment rails mean less time to catch it before it clears
— Remote AP teams have lost the informal relationship context that used to serve as a check

The only effective intervention point is before the payment runs. Not after.

I wrote a full breakdown of how the attack works, the three variants your team should recognize, and what layered controls actually look like in practice.

Full breakdown at the link below ↓

#PaymentFraud #AccountsPayable #FinanceLeadership
