# Vantirs — On-Page SEO Optimization Playbook
**Input:** vantirs-gsc-query-mapping.csv (simulated GSC data based on SEO strategy keyword targets)
**Date:** April 27, 2026
**Scope:** 5 published blog posts
**Method:** URL → query cluster → intent classification → slug / H1 / title / meta rewrite

---

## Data Confirmation

CSV columns processed: URL | Query | Impressions | Clicks | Avg Position | Notes

Total URLs: 5 | Total query rows: 44 | Average queries per URL: 8.8

> **Note on data source:** This file uses projected/simulated GSC data modelled from the Vantirs SEO keyword strategy (vantirs_seo_cro_strategy.md), not live GSC exports. The impression volumes represent realistic early-stage traffic potential, not confirmed rankings. Once the domain is indexed and Search Console begins returning real data (expect meaningful volume after 60–90 days of indexation), re-run this playbook against live exports to validate and refine.

---

## Keyword Clustering Summary

| URL | Primary KW (highest impressions + intent) | Secondary KWs | Intent |
|---|---|---|---|
| /blog/bec-scam-accounts-payable-case-study | BEC scam accounts payable | business email compromise AP, BEC wire transfer fraud, vendor email compromise | Informational (case study) |
| /blog/accounts-payable-fraud-schemes-2026 | accounts payable fraud schemes 2026 | AP fraud examples, types of AP fraud, synthetic vendor fraud | Informational (listicle) |
| /blog/vendor-bank-account-change-fraud | vendor bank account change fraud | bank account change request scam, vendor payment diversion, AP bank account verification | Informational / Commercial investigation |
| /blog/ai-generated-fake-invoice-detection | AI generated fake invoice detection | fake invoice AI detection, AI invoice fraud prevention, FraudGPT fake invoice | Informational |
| /blog/cfo-payment-fraud-risk-checklist | payment fraud risk checklist CFO | CFO payment fraud checklist, AP fraud controls checklist, payment fraud prevention checklist | Informational / Commercial (gated asset) |

---

## Optimization Table

> **Key:** ✅ Keep as-is | ⚠️ Minor fix | 🔴 Rewrite needed

---

### URL 1: /blog/bec-scam-accounts-payable-case-study

**Primary KW:** `BEC scam accounts payable` | **Intent:** Informational — case study

| Element | Current | Assessment | Recommended | Char Count |
|---|---|---|---|---|
| **Slug** | `bec-scam-accounts-payable-case-study` | ✅ Keep — keyword-exact, human-readable, no bloat | Keep | 36 chars |
| **H1** | "The $500K Wire Transfer That Didn't Come Back: A BEC Case Study for Finance Teams" | ⚠️ Primary KW buried after narrative hook. "Didn't Come Back" is weak for SEO. BEC appears 60+ chars in. | "BEC Scam in Accounts Payable: How a $496K Wire Transfer Was Lost for Good" | 73 chars |
| **Title** | "BEC Scam AP Case Study: The $500K Wire That Vanished" | ✅ Keep — primary KW front-loaded, strong curiosity hook, 53 chars | Keep | 53 chars |
| **Meta** | "A real BEC scam accounts payable case study: $496K wired to fraudsters. Learn exactly how it happened, why controls failed, and how to prevent it." | ⚠️ "A real" opener is weak. Lead with the hook. | "$496K wired to fraudsters via a single AP email. This BEC scam accounts payable case study shows how it happened — and the one control that stops it." | 150 chars |

**Notes:**
- Title and H1 are correctly differentiated ✅
- Primary KW (`BEC scam accounts payable`) appears in slug, title, and rewritten meta ✅
- The new H1 brings the primary keyword to position 1 while keeping the dollar-figure specificity that drives click engagement on social and email
- "Didn't Come Back" in current H1 sounds like a blog personal narrative rather than an authoritative resource signal

---

### URL 2: /blog/accounts-payable-fraud-schemes-2026

**Primary KW:** `accounts payable fraud schemes 2026` | **Intent:** Informational — listicle

| Element | Current | Assessment | Recommended | Char Count |
|---|---|---|---|---|
| **Slug** | `accounts-payable-fraud-schemes-2026` | ⚠️ Year in slug will age. Flag for refresh or redirect in 2027. Acceptable for now — year is part of target keyword | Keep with flag (see below) | 36 chars |
| **H1** | "Accounts Payable Fraud in 2026: 7 Schemes Your Team Hasn't Prepared For" | ⚠️ Good structure. "Hasn't Prepared For" implies the reader is already failing — slightly alienating. Minor rewrite. | "Accounts Payable Fraud in 2026: 7 Schemes Finance Teams Need to Know" | 69 chars |
| **Title** | "Accounts Payable Fraud in 2026: 7 Schemes to Know" | ⚠️ "to Know" is a weak modifier. Sharpen. | "Accounts Payable Fraud Schemes 2026: 7 Targeting AP Teams" | 58 chars |
| **Meta** | "Discover 7 advanced accounts payable fraud schemes targeting finance teams in 2026 — and what effective controls actually look like before money leaves." | 🔴 "Discover" opener is generic/weak. Restructure to lead with value. 151 chars — just under limit but opener kills CTR. | "In 2026, AP fraud has evolved past what standard controls catch. These 7 schemes show how each attack works — and what stops them before payment clears." | 152 chars |

**Notes:**
- **Year-in-slug flag:** The slug `accounts-payable-fraud-schemes-2026` will need a content refresh + date update in 2027, or a 301 redirect to a dateless slug (`/accounts-payable-fraud-schemes`) once the 2026-specific content is superseded. Do not change it now — the target keyword includes the year and the post has ranking equity to protect.
- Title changed to front-load the exact keyword phrase `accounts payable fraud schemes 2026` before the number modifier
- Secondary KW `AI invoice fraud 2026` triggers on this page AND on the AI detection post — see cannibalization flags section

---

### URL 3: /blog/vendor-bank-account-change-fraud

**Primary KW:** `vendor bank account change fraud` | **Intent:** Informational / Commercial investigation

| Element | Current | Assessment | Recommended | Char Count |
|---|---|---|---|---|
| **Slug** | `vendor-bank-account-change-fraud` | ✅ Keep — best slug in the set. Keyword-exact, no stopwords, 32 chars | Keep | 32 chars |
| **H1** | "Vendor Bank Account Change Requests: The Fraud Vector Nobody Talks About" | ⚠️ "Nobody Talks About" is a curiosity hook but soft on keyword signal. Primary KW phrase is split across the colon. | "Vendor Bank Account Change Fraud: The AP Attack Most Controls Miss" | 66 chars |
| **Title** | "Vendor Bank Account Change Fraud: How to Stop It" | ✅ Keep — primary KW front-loaded, "How to Stop It" is a strong action modifier matching commercial-investigation intent. 49 chars | Keep | 49 chars |
| **Meta** | "Vendor bank account change fraud is draining AP departments. Learn how attacks work, where controls fail, and what stops it before money moves." | ⚠️ Solid structure but "is draining AP departments" is passive/generic. Stronger hook available. 143 chars | "Most AP controls miss vendor bank account change fraud entirely. Learn how the three attack patterns work — and the verification step that stops them." | 149 chars |

**Notes:**
- This URL has the strongest estimated query volume in the set (620 impressions on primary KW at position 9.8) — it's on the cusp of page 1 for the exact keyword. On-page optimization has highest ROI here.
- The new H1 keeps "The AP Attack Most Controls Miss" as a curiosity hook but replaces "Nobody Talks About" with a more credible, outcome-specific phrase
- This post is internally linked from the CFO Checklist post — that internal link equity supports the ranking signal; ensure the anchor text uses the target keyword phrase

---

### URL 4: /blog/ai-generated-fake-invoice-detection

**Primary KW:** `AI generated fake invoice detection` | **Intent:** Informational

| Element | Current | Assessment | Recommended | Char Count |
|---|---|---|---|---|
| **Slug** | `ai-generated-fake-invoice-detection` | ✅ Keep — keyword-exact, clean, 35 chars | Keep | 35 chars |
| **H1** | "AI-Generated Fake Invoices: How to Detect What Your AP Team Can't See" | ⚠️ "What Your AP Team Can't See" is slightly awkward. Detection keyword appears after the colon. | "AI-Generated Fake Invoice Detection: What Your AP Team Is Missing" | 66 chars |
| **Title** | "AI-Generated Fake Invoice Detection: What AP Teams Miss" | ✅ Keep — primary KW front-loaded, curiosity gap hook, 55 chars | Keep | 55 chars |
| **Meta** | "AI tools create perfect fake invoices your AP team can't detect visually. Learn the behavioral signals that catch what the eye misses — before payment clears." | 🔴 158 chars — 3 over the 155-char limit. Must trim. | "AI tools create perfect fake invoices your AP team can't detect by eye. Learn the behavioral signals that catch what humans consistently miss." | 142 chars |

**Notes:**
- Title and new H1 are correctly differentiated: title ends with "What AP Teams Miss" (curiosity gap), H1 ends with "What Your AP Team Is Missing" (slightly expanded phrasing = no verbatim duplication) ✅
- Meta fix is mandatory — 3 chars over limit means Google will truncate the description mid-sentence, likely cutting off after "—" which looks broken in SERP
- `FraudGPT fake invoice` (112 impressions) is a rising query in the cluster — if a paragraph about FraudGPT doesn't already exist in the post, add one. This keyword will grow significantly as FraudGPT awareness increases.

---

### URL 5: /blog/cfo-payment-fraud-risk-checklist

**Primary KW:** `payment fraud risk checklist CFO` | **Intent:** Informational / Commercial (gated asset)

| Element | Current | Assessment | Recommended | Char Count |
|---|---|---|---|---|
| **Slug** | `cfo-payment-fraud-risk-checklist` | ✅ Keep — clean, keyword-rich, internally linked from post 3. Changing it would break the internal link. | Keep | 33 chars |
| **H1** | "CFO's Payment Fraud Risk Checklist: 20 Controls You Should Have in Place" | 🔴 H1 and title both open with "CFO's Payment Fraud Risk Checklist" — near-verbatim duplication. H1 must differentiate. | "20 Payment Fraud Controls Every CFO Should Audit Right Now" | 58 chars |
| **Title** | "CFO's Payment Fraud Risk Checklist: 20 Controls You Need" | ✅ Keep — primary KW front-loaded, "20 Controls" is specific and credible, 57 chars | Keep | 57 chars |
| **Meta** | "A 20-point payment fraud risk checklist for CFOs covering vendor onboarding, invoice validation, wire transfer controls, and pre-payment screening. Score your gaps now." | 🔴 168 chars — 13 over the 155-char limit. Major trim required. | "Score your payment fraud controls with this 20-point CFO checklist — vendor onboarding, invoice validation, wire transfers, and pre-payment screening." | 150 chars |

**Notes:**
- H1 rewrite is the highest-priority fix on this page. Google may use the H1 as the displayed title in SERPs when it considers it more relevant than the title tag — having both start identically wastes that opportunity and signals low on-page quality
- New H1 leads with "20" (specific number = credibility signal) and uses "Audit Right Now" (urgency without clickbait)
- The new meta front-loads "Score your payment fraud controls" — matching the intent of someone searching for a checklist (they want to evaluate themselves, not read about controls in the abstract)
- "Score your gaps now" moved from the end of meta to the opening concept — it's the most action-oriented phrase in the current meta, should lead

---

## Complete Recommended Changes (Summary Table)

| URL | New Slug | New H1 | New Title | New Meta |
|---|---|---|---|---|
| /blog/bec-scam-accounts-payable-case-study | **keep** | BEC Scam in Accounts Payable: How a $496K Wire Transfer Was Lost for Good | **keep** | $496K wired to fraudsters via a single AP email. This BEC scam accounts payable case study shows how it happened — and the one control that stops it. |
| /blog/accounts-payable-fraud-schemes-2026 | **keep (flagged)** | Accounts Payable Fraud in 2026: 7 Schemes Finance Teams Need to Know | Accounts Payable Fraud Schemes 2026: 7 Targeting AP Teams | In 2026, AP fraud has evolved past what standard controls catch. These 7 schemes show how each attack works — and what stops them before payment clears. |
| /blog/vendor-bank-account-change-fraud | **keep** | Vendor Bank Account Change Fraud: The AP Attack Most Controls Miss | **keep** | Most AP controls miss vendor bank account change fraud entirely. Learn how the three attack patterns work — and the verification step that stops them. |
| /blog/ai-generated-fake-invoice-detection | **keep** | AI-Generated Fake Invoice Detection: What Your AP Team Is Missing | **keep** | AI tools create perfect fake invoices your AP team can't detect by eye. Learn the behavioral signals that catch what humans consistently miss. |
| /blog/cfo-payment-fraud-risk-checklist | **keep** | 20 Payment Fraud Controls Every CFO Should Audit Right Now | **keep** | Score your payment fraud controls with this 20-point CFO checklist — vendor onboarding, invoice validation, wire transfers, and pre-payment screening. |

---

## Flags

### 1. Cannibalization Risk — Medium Priority

**AI invoice fraud overlap between URL 2 and URL 4**

The query `AI invoice fraud 2026` (175 estimated impressions) appears in the query cluster for `/blog/accounts-payable-fraud-schemes-2026`, because scheme #2 in that post is "AI-Generated Invoice Spoofing." This means two URLs are competing for the same secondary keyword.

**Recommendation:** In the AP fraud schemes post, shorten the "AI-Generated Invoice Spoofing" section to 2–3 paragraphs with a clear internal link to `/blog/ai-generated-fake-invoice-detection` using anchor text "AI-generated fake invoice detection." This signals to Google which URL should rank for AI invoice queries while keeping the schemes post as an overview hub.

**Ghost vendor / synthetic vendor overlap** — minor. `Ghost vendor fraud detection` appears in the query cluster for the AP schemes post. Since there is no dedicated ghost vendor page (it's in the programmatic SEO plan but not yet built), this is acceptable for now. When the `/ghost-vendor-fraud-detection` page is built, add internal link from the schemes post.

---

### 2. Year-in-Slug Flag — Low Priority (Action Required in 2027)

**URL:** `/blog/accounts-payable-fraud-schemes-2026`

The year is baked into the slug. This post will lose relevance signal as 2027 approaches and searchers shift to "accounts payable fraud schemes 2027." 

**Options when this becomes relevant (Q4 2026 at earliest):**
- Option A: Refresh all content with 2027 data and update the year in the meta/H1 only — leave slug unchanged. Acceptable if ranking equity is strong.
- Option B: Create a new dateless canonical URL (`/accounts-payable-fraud-schemes`) and 301 redirect the dated slug to it. Best long-term but only worth it if the page has accumulated meaningful backlinks.

**Decision trigger:** If the page has 3+ external backlinks by Q4 2026, do Option B. If zero backlinks, Option A is sufficient.

---

### 3. Title / H1 Duplication — High Priority (Fix Now)

**URL:** `/blog/cfo-payment-fraud-risk-checklist`

Current H1 ("CFO's Payment Fraud Risk Checklist: 20 Controls You Should Have in Place") and current title ("CFO's Payment Fraud Risk Checklist: 20 Controls You Need") open with identical phrasing for 35 characters. This is the most impactful fix in the set — Google's ability to choose the better SERP title is hampered when title and H1 are near-identical.

**Fix:** Implement new H1 as specified in the table above. This is a 5-minute change.

---

### 4. Meta Overlength — High Priority (Fix Now)

Two metas exceed the 155-character guideline and will be truncated in SERPs:

- `/blog/ai-generated-fake-invoice-detection`: 158 chars → truncated at "— before payment" (mid-sentence break)
- `/blog/cfo-payment-fraud-risk-checklist`: 168 chars → truncated at "pre-payment screening." (loses the "Score your gaps now" CTA entirely)

Both fixes are in the recommendation table above.

---

### 5. Thin Query Data — Informational Note

All URLs in this set have simulated/projected data, not confirmed GSC impressions. Two posts have narrow secondary query clusters based on available keyword research:

- `/blog/bec-scam-accounts-payable-case-study` — secondary queries thin below ~150 impressions. Wait 60 days after indexation for real GSC data before making H2 or body copy changes based on secondary keywords.
- `/blog/ai-generated-fake-invoice-detection` — `FraudGPT fake invoice` (112 impressions) is a rising query that the current post body may not explicitly address. Consider adding a 200-word FraudGPT-specific section to capture this emerging query cluster.

---

### 6. Internal Linking Structure — Quick Win

Current state: The CFO Checklist post links to the Vendor Bank Account Change Fraud post via `[LINK: /blog/vendor-bank-account-change-fraud]`. This is the only confirmed internal link between posts.

**Recommended internal link structure to build immediately:**

| From | To | Suggested anchor text |
|---|---|---|
| /blog/accounts-payable-fraud-schemes-2026 | /blog/ai-generated-fake-invoice-detection | "AI-generated fake invoice detection" |
| /blog/accounts-payable-fraud-schemes-2026 | /blog/vendor-bank-account-change-fraud | "vendor bank account change fraud" |
| /blog/accounts-payable-fraud-schemes-2026 | /blog/bec-scam-accounts-payable-case-study | "BEC scam case study" |
| /blog/bec-scam-accounts-payable-case-study | /blog/vendor-bank-account-change-fraud | "vendor email compromise bank change" |
| /blog/bec-scam-accounts-payable-case-study | /blog/cfo-payment-fraud-risk-checklist | "payment fraud risk checklist" |
| /blog/ai-generated-fake-invoice-detection | /blog/accounts-payable-fraud-schemes-2026 | "accounts payable fraud schemes" |
| /blog/cfo-payment-fraud-risk-checklist | /blog/accounts-payable-fraud-schemes-2026 | "common AP fraud schemes in 2026" |

Adding these 7 links will distribute crawl equity across all five posts and signal topical clustering to Google — treating these posts as a coherent content hub rather than isolated pages. This takes under 30 minutes in the CMS and is one of the highest-ROI actions available before any new content is published.

---

*This playbook was generated using keyword strategy from vantirs_seo_cro_strategy.md and simulated GSC query data in vantirs-gsc-query-mapping.csv. Re-run against real GSC data after 60–90 days of confirmed indexation.*
