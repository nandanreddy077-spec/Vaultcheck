---
slug: check-fraud-prevention-accounts-payable
meta_title: Check Fraud Prevention for Accounts Payable | Vantirs
meta_description: Check fraud affects 63% of firms still using paper payments. Vantirs adds pre-payment verification to reduce AP check fraud across your vendor payments.
---

# Check Fraud Prevention in Accounts Payable: Protecting Paper and Digital Check Payments

Check fraud is not a relic of a pre-digital era. According to the AFP 2026 Payments Fraud Survey, 63% of organizations experienced check fraud in 2025 — making it the most common payment fraud type by volume. Despite the industry's shift toward ACH and wire payments, paper and digital checks remain a significant percentage of business-to-business payments, and they remain a consistently targeted fraud vector.

The form of check fraud has evolved. The losses haven't declined.

## Modern Check Fraud in AP Environments

**Check washing and alteration.** Physical checks intercepted in the mail are chemically washed to remove the payee name and amount, then re-written for fraudulent payees and larger amounts. The altered check clears because the signature and check stock are authentic. PYMNTS reported in early 2026 that physical check fraud has increased significantly as fraudsters exploit the volume of paper checks still in circulation.

**Counterfeit check creation.** Digital scanning and printing capabilities allow fraudsters to create counterfeit check stock that passes casual visual inspection. Account and routing numbers are authentic; everything else is fabricated. Counterfeit checks are used to pay for goods or services before the fraud is detected during bank reconciliation.

**Positive pay bypass.** Many organizations use positive pay — a bank service that matches issued checks against an authorized list — as their primary check fraud control. Fraudsters have adapted: they research organizations' check formats, issue amounts, and payment cycles to create counterfeit checks that match the positive pay database entries.

**Remote deposit capture fraud.** A check is deposited remotely — via mobile or remote deposit capture — and then the physical check is presented again at a branch or via a different RDC channel. Both deposits clear, resulting in a double payment from the issuing organization's account.

**AP system check queue manipulation.** For organizations using AP automation that generates digital check files, attackers who gain access to the check generation queue can modify payee information or redirect check payments before the file is transmitted to the bank.

## The Persistence of Check Fraud

The AFP survey finding — 63% of organizations facing check fraud despite a multi-year shift to electronic payments — reflects a specific structural reality: many B2B payment relationships still use checks as a default, particularly in industries like construction, professional services, and government contracting. As long as checks are in circulation, check fraud will occur.

The organizations most exposed are those that:
- Still send significant payment volumes via check
- Don't systematically verify payee details against vendor records before issuing checks
- Rely on positive pay alone as their primary check fraud control
- Don't reconcile issued checks against received checks frequently enough to catch altered checks quickly

## How Vantirs Reduces AP Check Fraud

While physical check security ultimately relies on bank-level controls, Vantirs reduces check fraud risk at the AP layer by adding verification controls before checks are issued:

- **Pre-issuance payee verification:** Before a check is generated for a vendor, Vantirs verifies the payee details against the verified vendor registry, catching mismatches between approved payee records and the check-generation instruction.
- **Vendor banking detail consistency checks:** For vendors set up for both check and electronic payments, Vantirs monitors for inconsistencies between banking details across payment methods — a signal that vendor master data may have been manipulated.
- **AP queue integrity monitoring:** Changes to the AP check queue — including payee name modifications, amount changes, or routing alterations — are flagged before checks are issued.
- **Accelerate migration to electronic payments:** Vantirs' vendor verification capabilities support transitioning check-paid vendors to ACH or wire, reducing check issuance volume and associated fraud exposure over time.

---

**Reduce AP check fraud with pre-issuance payment verification.**
[Book a demo →](https://vantirs.com/demo) — see how Vantirs adds a verification layer to your check payment workflow.
