# Vantirs — Week 1 Marketing Launch Plan
## Starting Monday, April 6, 2026

**Status of Assets:** ✅ 100 Personalized Emails Written · ✅ 100 ICP Targets Ready · ✅ SEO Strategy Complete
**Channels:** Cold Email + Content/SEO
**Primary Goal:** Book demo calls

---

# MONDAY MORNING — Hour by Hour

## 8:00 AM — Email Infrastructure Setup (DO THIS FIRST, nothing else works without it)

You have 100 personalized emails written and 100 leads. The only thing standing between you and your first reply is a proper sending setup. Here's what breaks first-time senders: they send from their main inbox without warmup, get flagged as spam by Day 3, and wonder why nobody's responding.

**Do this before sending a single email:**

### Option A: Gmail Manual Send (Simplest for Week 1)
If you're sending 15–20/day manually, this works fine and keeps costs at zero.

1. Log into `nandan@vantirs.com`
2. Check your sending reputation: go to [mail-tester.com](https://mail-tester.com), send a test email to the address they give you, get your score. You want 8/10 or higher before sending to leads.
3. If score is below 8, fix the issues flagged (usually SPF, DKIM, or DMARC records). Your email host or IT person can set these — takes 15 minutes.
4. Set a daily sending limit: 15 emails/day max in Week 1. Gmail flags accounts that suddenly blast 50+ cold emails.
5. Stagger sends: send 5 emails, wait 30 minutes, send 5 more. Never send a batch all at once.

### Option B: Instantly.co (Recommended if you want to scale past Week 1)
- Sign up at Instantly.co ($47/month Hypergrowth plan)
- Connect `nandan@vantirs.com` via SMTP/IMAP
- Enable email warmup (takes 2 weeks to fully warm, but you can start sending low volume immediately)
- Set campaign limit: 15 emails/day, stagger by 90-second intervals
- Upload your lead list from `VaultCheck-100-ICP-Targets.xlsx`
- Import email copy from `VaultCheck-100-Personalized-Emails.xlsx`

**SPF/DKIM/DMARC Check (5 minutes):**
Go to [mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx) and test your domain. If any of these are missing, fix before Monday sends.

---

## 9:00 AM — Load Your Lead Queue (20 minutes)

Open `VaultCheck-100-Personalized-Emails.xlsx` and `VaultCheck-Outreach-Tracker.xlsx` side by side.

**Priority order for Week 1 sending:**
1. Start with Priority 1 (Hot) leads from `VaultCheck-100-ICP-Targets.xlsx`
2. These are your highest-fit prospects — construction, healthcare, real estate accounting firms
3. Send to the first 15 Priority 1 contacts today
4. Log each send in the Outreach Tracker: Date Sent, Name, Firm, Email, Subject Line, Variant

**Monday's send list:** Rows 3–17 in the personalized emails sheet (the first 15 Priority 1 leads)

---

## 10:00 AM — Send Your First 5 Emails (Batch 1)

1. Open email #1 in the spreadsheet
2. Check the [FIRST LINE] — personalize it if the owner name is unknown
3. Copy subject line exactly as written (these are already A/B tested in the sheet)
4. Copy email body — double-check: does the city, firm name, and industry reference look correct?
5. Send. Log in tracker.
6. Repeat for emails 2–5.
7. Stop. Set a timer for 30 minutes before Batch 2.

**What a good send looks like:**
- Subject line references their city + industry (not generic)
- Opening line shows you know their niche
- The "free payment audit" CTA is the offer — this is lower friction than "book a demo"
- Sign off is personal: Nandan, Founder, VaultCheck

---

## 10:30 AM — Send Batch 2 (5 more emails)

Same process. Emails 6–10.

---

## 11:00 AM — SEO Foundation: 2-Hour Block

While emails are staggering out, start on the Week 1 SEO priority. The strategy is already written. Now execute.

### Task 1: Google Search Console (30 minutes)

Your domain currently has zero indexed pages. This is the most important fix in Week 1 — without it, every blog post and landing page you publish is invisible to Google.

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add `vantirs.com` as a property
3. Verify ownership (use the HTML tag method — paste it in your site's `<head>`)
4. Go to Sitemaps → Submit your sitemap URL (usually `vantirs.com/sitemap.xml`)
5. Check Coverage report — it will show if pages are excluded, blocked by robots.txt, or just not yet crawled

### Task 2: Check robots.txt (10 minutes)

Go to `vantirs.com/robots.txt` in your browser. It should say something like:
```
User-agent: *
Disallow:
```

If it says `Disallow: /` — that's why Google can't index you. Fix immediately by removing or correcting that line.

### Task 3: Run a Technical Check (20 minutes)

Go to [ahrefs.com/free-tools](https://ahrefs.com/free-tools) → Free Website Checker. Enter your domain. This shows:
- How many pages are indexed
- Any crawl errors
- Missing meta descriptions or titles
- Broken links

Note everything flagged and add fixes to your task list for Tuesday.

---

## 1:00 PM — Send Batch 3 (5 emails — final batch for today)

Emails 11–15. You've now sent your Monday quota.

---

## 2:00 PM — Homepage Messaging (2-hour block)

This is the most impactful CRO action of the week. The SEO strategy has already written the exact copy — you just need to implement it.

**Target headline (copy from strategy, already written):**
> "Stop Fraudulent Payments Before the Money Leaves."

**Target subheadline:**
> "Vantirs verifies every vendor payment request against fraud signals before your team approves it — stopping BEC scams, fake invoices, and account takeovers before a single dollar moves."

**Target CTA (replace whatever you have now):**
> Primary: "Get a Live Demo →"
> Secondary: "Watch 3-Min Walkthrough"

**Trust bar to add under the headline:**
> ✓ SOC 2 Type II Certified   ✓ No IT setup required   ✓ 14-day pilot available

If your site is on Webflow, WordPress, Framer, or similar — these changes take 30 minutes to implement. Do them now. Every day your homepage has weak messaging is a day your demos page is converting at <1%.

---

## 4:00 PM — Monday Wrap-Up (30 minutes)

1. Check your email opens: if using Gmail, install [Mailtrack](https://mailtrack.io) (free) to see who opened your emails
2. Update the Outreach Tracker: mark each email as Sent with timestamp
3. Look at replies — if anyone replied today, respond within 60 minutes (do not let a reply sit overnight)
4. Log your metrics for the day:
   - Emails sent: target 15
   - Opens: track this
   - Replies: track this
   - Meetings booked: track this

---

# TUESDAY — Day 2

## Morning (2 hours): Publish Blog Post #1

You have a fully detailed content brief already written. Write and publish the first blog post.

**Post to write Tuesday:**
> "Vendor Bank Account Change Requests: The Fraud Vector Nobody Talks About"

**Why this one first?** It's highly specific, targets a keyword with commercial intent (`vendor bank account change fraud`), and speaks directly to your ICP's #1 anxious moment. It's also more narrow than the BEC post — easier to write fast without needing extensive research.

**Outline (already in your SEO strategy):**
1. Why bank account change requests are the highest-risk AP event (300 words)
2. Real examples: how fraudsters intercept legitimate change requests (300 words)
3. The verification gap in most AP processes (200 words)
4. Step-by-step verification protocol for your team (300 words)
5. How automated pre-payment verification closes this gap (200 words)
6. CTA: See how Vantirs catches this in real time (100 words)

**Target length:** 1,400–1,600 words
**Target keyword:** `vendor bank account change fraud` in H1, H2, and naturally 3–4x in body
**Publish at:** `/blog/vendor-bank-account-change-fraud`
**Meta title:** "Vendor Bank Account Change Fraud: How AP Teams Get Targeted (and How to Stop It)"

After publishing: Go to Google Search Console → URL Inspection → paste the URL → Request Indexing.

## Afternoon: Send Tuesday's 15 Emails

Continue through the Priority 1 list. You should be on leads 16–30 today.

---

# WEDNESDAY — Day 3

## Morning: Publish Blog Post #2

> "AI-Generated Fake Invoices: How to Detect What Your AP Team Can't See"

This one is topically hot in 2026 (AI-generated documents are a real fear for finance teams). Gets attention on LinkedIn too — share it there.

**Post to LinkedIn after publishing:**
> "We're seeing a new wave of invoice fraud that your AP team can't spot visually. AI-generated fake invoices are now indistinguishable from real ones. Here's what that means for your payment approval process — and the 3 behavioral signals that still catch them: [link]"

## Afternoon: Send 15 emails (leads 31–45)

---

# THURSDAY — Day 4

## Morning: Build Your First Landing Page

Priority landing page from the strategy: `/vendor-fraud-detection-software`

**This page should have:**
- H1: "Vendor Fraud Detection Software: Stop Fraudulent Payments Before They Clear"
- 2-paragraph intro addressing the buyer's nightmare scenario
- How it works (3 steps: Connect → Detect → Prevent)
- Key features (fraud types caught: BEC, fake invoices, bank account swaps, duplicate invoices)
- Integration logos (QuickBooks, Xero, NetSuite, BILL.com)
- Trust signals (SOC 2, data security, pilot offer)
- CTA: "Get a Live Demo" + Calendly embed (or link to /demo)
- 1 case study or scenario (anonymized is fine at this stage)

After publishing: Google Search Console → Request Indexing.

## Afternoon: Send 15 emails (leads 46–60)

---

# FRIDAY — Day 5

## Morning: LinkedIn Distribution Push

Now that you have 2 blog posts and a landing page live, it's time to push traffic to them.

**LinkedIn Post 1 (for Tuesday's blog post):**
> "The riskiest moment in accounts payable isn't an invoice — it's a vendor bank account change request.
>
> Here's why: your team has been working with Acme Supplies for 3 years. They know the contact. They trust the relationship. Then one day, a convincing email arrives: 'We've updated our banking details for payments.'
>
> That email came from a fraudster who hijacked the vendor's domain 2 weeks ago.
>
> Your team processes it. $87,000 leaves. It doesn't come back.
>
> I wrote about how this happens and exactly what to do about it: [link]"

**LinkedIn Post 2 (for Wednesday's blog post):**
> "AI-generated fake invoices have broken the visual detection method.
>
> In 2023, your AP team could spot a fake by the logo quality, the font, the layout. In 2026, a $15 AI tool produces a replica indistinguishable from the real invoice.
>
> The good news: while documents got smarter, fraudsters' behavior didn't. Here are 3 behavioral signals that still catch AI-generated fakes — even when the document looks perfect: [link]"

**Target: 20+ LinkedIn connections this week** (manually) — connect with CFOs and AP Directors in your ICP who match the leads you're emailing.

## Afternoon: Send 15 emails (leads 61–75)

---

# WEEK 1 — METRICS DASHBOARD

Track these numbers daily. By Friday you should have:

| Metric | Day 1 Target | End of Week 1 Target |
|--------|-------------|---------------------|
| Emails sent | 15 | 75 |
| Open rate | — | 35%+ (good cold email) |
| Reply rate | — | 5%+ (good cold email) |
| Positive replies | — | 3–5 |
| Demo calls booked | — | 1–3 |
| Blog posts published | 0 | 2 |
| Landing pages live | 0 | 1 |
| Pages indexed in GSC | 0 | 5+ |
| LinkedIn posts published | 0 | 2 |

---

# REPLY HANDLING — WHAT TO DO WHEN SOMEONE RESPONDS

**The most important rule:** Reply within 60 minutes during business hours. Reply rate to reply is the #1 conversion driver.

### Response Templates by Reply Type

**Reply Type: "Interested, tell me more"**
> Hi [Name],
>
> Great to hear from you. Happy to give you a quick walkthrough — it's a 20-minute call where I connect to a client's QuickBooks account live and show you exactly what Vantirs flags in their invoice history.
>
> A few times that work this week: [3 specific slots]
>
> Or grab whatever works best here: [Calendly link]
>
> Nandan

**Reply Type: "Not right now / timing isn't right"**
> Completely understand — timing is everything with these decisions.
>
> One thing I'll mention: the free payment audit I offered doesn't require any commitment. I connect to one QuickBooks account, run the analysis, and send you a report showing every vendor anomaly in the last 12 months. Takes you 10 minutes to set up, nothing else required.
>
> Would that be useful to have even just as a benchmark — to know what you're looking at?
>
> Nandan

**Reply Type: "We already have something for this"**
> What are you using? I ask because a lot of firms tell me they use QuickBooks's built-in flags or a manual review process — both of which miss the behavioral signals that BEC and bank account swap fraud rely on.
>
> If you have a tool specifically built for pre-payment fraud detection (not just monitoring), I'd be curious what your experience has been. And if there's any gap in coverage, that's exactly where Vantirs fits.
>
> Happy to show you side by side if it's worth 20 minutes.
>
> Nandan

**Reply Type: "Remove me from your list"**
> Done — apologies for the interruption. I've removed you from all future outreach.

(Then mark as unsubscribed in your tracker. Do not contact again.)

---

# SEO — WEEK 1 CHECKLIST

## Must-Do (Non-Negotiable for Indexation)

- [ ] Google Search Console set up and domain verified
- [ ] Sitemap submitted (`/sitemap.xml`)
- [ ] `robots.txt` confirmed — Googlebot NOT blocked
- [ ] Request indexing for every new URL published this week
- [ ] SPF, DKIM, DMARC records confirmed for `vantirs.com`

## Should-Do (High Impact)

- [ ] Homepage headline and subheadline updated to new copy
- [ ] Primary CTA changed to "Get a Live Demo →"
- [ ] Trust bar added (SOC 2, no IT setup, 14-day pilot)
- [ ] Blog post #1 published and indexed
- [ ] Blog post #2 published and indexed
- [ ] Landing page `/vendor-fraud-detection-software` live and indexed
- [ ] GA4 connected with conversion events tracking demo form submissions
- [ ] Mailtrack or equivalent installed for email open tracking

## Nice-to-Have (Do if time allows)

- [ ] Submit to G2 and Capterra (free listings — drives backlinks + discovery)
- [ ] Submit to Product Hunt (schedule for end of Week 2)
- [ ] Hotjar or Microsoft Clarity installed for heatmaps

---

# WHAT SUCCESS LOOKS LIKE BY FRIDAY

By end of Week 1, you should have:

**In your inbox:** 3–7 positive email replies. At least 1 person who asked about the free payment audit or a call. This is normal — cold email at 5% reply rate on 75 sends = 3–4 replies.

**In your calendar:** 1–2 demos booked for the following week.

**On your website:** 2 live blog posts, 1 new landing page, a better homepage headline, and Google Search Console showing your first indexed pages.

**Your north star metric for Week 1:** One booked demo. Everything else is a leading indicator. If you send 75 personalized emails and publish 2 strong blog posts and you don't get a single reply, the problem is the emails (subject line or offer) — not the market. But you won't know that until you send.

---

# WEEK 2 PREVIEW — What's Next

Once Week 1 is done:

1. **Increase email volume to 20/day** (add Priority 2 leads — 25 more firms)
2. **Publish blog post #3:** "The $500K Wire Transfer That Didn't Come Back" — your highest-stakes narrative post
3. **Build landing page #2:** `/accounts-payable-fraud-prevention` (AP team audience)
4. **Start directory submissions:** G2, Capterra, GetApp (all free, all generate backlinks)
5. **Follow up on Week 1 non-responders:** Day 5 of the email sequence triggers for all leads sent Monday/Tuesday

---

*Vantirs Marketing Launch Plan — Week 1 | April 6, 2026*
