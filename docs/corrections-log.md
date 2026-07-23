# Corrections Log

A dated record of material profile, count, and methodology changes, per the
editorial remediation brief (2026-07-22).

## 2026-07-22 — Evidence-model remediation

Implemented from `Ethical_AI_Departures_Implementation_Brief.md` (prepared
2026-07-22). Baseline before changes: 66 published profiles, 29 publications,
13 predictions (5 confirmed / 7 open / 1 disproven), homepage headline count 66.

### Methodology

- Introduced a four-tier evidence model (Direct / Reported / Alleged /
  Contextual) with public labels, plus `departure_type`, `claim_status`,
  review metadata, and correction notes on every profile.
- Changed the counting rule: only Direct and Reported records count in the
  primary headline. Alleged records are shown separately and excluded while
  unresolved. Contextual records are never counted (enforced by a database
  CHECK constraint and by the canonical selector in `src/lib/evidence.ts`).
- All aggregate counts (homepage hero, metadata, exports) now derive from the
  same canonical selectors; the manually maintained `ticker_stats` row is no
  longer the source of truth.

### Profile corrections (applied 2026-07-22)

- **Harsh Mehta, Behnam Neyshabur** — removed unsupported claims that they
  expressed safety concerns; their own posts announced new ventures and,
  in Mehta's case, praised Anthropic. Reclassified Contextual.
- **Mira Murati, Bob McGrew, Barret Zoph** — removed "coordinated senior
  leadership exodus" characterization; OpenAI described the decisions as
  independent and amicable. Reclassified Contextual.
- **Lilian Weng, Andrea Vallone, John Schulman, Chris Olah, Paul Christiano,
  Jack Clark, Tom Brown, Jared Kaplan, Daniela Amodei, Sam McCandlish** —
  reclassified Contextual: current sourcing does not establish an
  ethics/safety motive for the individual. Motive-implying phrases removed
  (e.g., "outside the constraints of a capabilities lab," "over safety
  direction concerns").
- **Superalignment/2024 OpenAI group (Burda, Markov, Kirchner, J. Wu, Uesato,
  Bills, Lowe, Wainwright, Burns, Izmailov, O'Keefe)** — reclassified
  Contextual; team dissolution establishes context, not individual motive.
  Copy now states explicitly that no individual statement is on record.
- **xAI cofounders (Pohlen, T. Wu, Ba, Babuschkin, Szegedy)** — replaced stale
  "9 of 11" founder count with dated, sourced language (Reuters, Feb. 11,
  2026); removed motive inferred from the broader exodus and anonymous
  accounts. Reclassified Contextual.
- **Suchir Balaji** — removed unsupported "Whistleblower Retaliation" tag;
  moved death details out of the departure summary. Copyright classification
  retained; remains Direct (his own statements).
- **Frances Haugen** — removed unsupported "Whistleblower Retaliation" tag;
  whistleblowing itself is documented and retained.
- **Geoffrey Hinton** — dated the 10–20% extinction estimate to post-departure
  interviews (December 2024), separated from his 2023 departure rationale.
- **Ryan Beiermeister, Devin Kim, Leopold Aschenbrenner** — reclassified
  Alleged (contested): attribution-first wording, company's stated rationale
  given comparable prominence, excluded from the headline count while
  unresolved.

### Predictions

- Public confirmation score hidden while the tracker is re-adjudicated; all
  records labeled "Under review."
- "OpenAI safety culture has taken a back seat…" reclassified as a
  contemporaneous **claim** (excluded from the prediction denominator).
- "AI capabilities will advance faster than mainstream expert predictions" and
  "AI systems will generate persuasive disinformation at scale" re-opened;
  prior adjudications preserved in review notes pending stronger criteria.
- "AI companies will prioritize deployment speed over safety evaluation"
  marked Partial (evidence currently OpenAI-focused; claim is industry-wide).

### Publications

- *Weak-to-Strong Generalization* — re-credited to Collin Burns et al.
  (12 authors); summary rewritten to mirror the abstract (naive fine-tuning
  remains far from recovering full strong-model capability); unsupported
  deception-exploitation claim removed.
- *On the Dangers of Stochastic Parrots* — removed unsupported "water" cost
  claim; kept the paper's energy/carbon framing.
- *AI Index Report 2024* — credited Nestor Maslej et al. / Stanford HAI.
- *Managing Extreme AI Risks* — credited Bengio, Hinton, and 20+ co-authors.
- Content types corrected (resignation letters, essays, legal analysis,
  forecast essay, testimony) via the widened type constraint.
- Publications intro: "every major AI laboratory" → "several major AI
  organizations"; "tracking the pivot" → "coinciding with the pivot."

### Site copy and technical

- Stale "59" meta description replaced with count-free, evidence-labeled copy.
- Hero replaced: "Documented departures and removals linked to AI safety,
  ethics, governance, and accountability," with dynamic evidence-linked /
  contextual metrics.
- Profile titles neutralized: "[Name] — Departure from [Company] ([Year])"
  (works for resignations, firings, and layoffs); press citation format
  updated to match.
- Press source-claims corrected: sources include first-party statements,
  documents, legal filings, and reporting — not solely "original reporting."
- Sitemap: removed nonexistent `/profiles` entry; all `<loc>` values
  normalized against whitespace.

## 2026-07-22 — Prediction Tracker Review (adjudication addendum)

Implemented from `Ethical_AI_Departures_Prediction_Tracker_Review.md`.
Adjudicated the seven records on the Hinton, Sutskever, Leike, and
Aschenbrenner profiles; the six other records (Kokotajlo ×4, Saunders,
Hitzig) remain under review pending the next batch.

- **Zero predictions are now reported as confirmed.** Both prior Leike
  confirmations were removed: "safety culture has taken a back seat" is a
  contemporaneous claim, not a forecast; "alignment failures will occur in
  deployed systems" is an editorial synthesis whose confirmation grouped
  evidence that supported only part of the claim.
- Reclassified as warnings/claims (excluded from all scoring):
  Leike ×2, Aschenbrenner ×2 (lab security; government preparedness).
- Retained as open forecasts with dated, prospective resolution criteria:
  Hinton (disinformation), Sutskever & Leike (RLHF will not scale —
  attribution corrected to joint), and Hinton's extinction estimate —
  corrected from a conflated "5–20 year" framing to the reported 10–20% /
  30-year probabilistic forecast (Guardian, Dec. 27, 2024), typed so it can
  never enter a binary accuracy percentage.
- **Quotation repairs:** five displayed quotes could not be located verbatim
  in their sources; each was replaced with an exact excerpt or an explicitly
  labeled paraphrase. Every tracker quote now carries a verbatim flag and a
  direct source link.
- Retracted the prior PRED-04 rationale that implied Ilya Sutskever publicly
  cited safety deprioritization; his departure statement did not say that.
- New public summary: "3 open forecasts · 4 warnings and contemporaneous
  claims · 6 records under review." No confirmation percentage is shown, and
  none will be until a forecast reaches a valid resolution point.
- **Technical:** fixed share URLs that embedded an encoded newline (%0A) —
  root cause was a trailing newline stored in the NEXT_PUBLIC_SITE_URL
  environment variable; the variable was replaced and all site-URL reads and
  the ShareButtons component now strip whitespace, with a regression test.
  Share text also neutralized ("departure from" rather than "left over
  safety concerns") to match the evidence model.
