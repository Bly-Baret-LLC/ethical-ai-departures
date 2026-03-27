# Ethical AI Departures

**Who left. Why they left. What they predicted. Whether they were right.**

A tracker of safety-motivated departures from leading AI companies. Built to document the patterns of researchers, engineers, and executives who left over ethical concerns — and to hold their predictions accountable over time.

Live at [ethicalaidepartures.fyi](https://ethicalaidepartures.fyi)

## What this tracks

- **59 departures** across OpenAI, Google, Anthropic, Meta, xAI, Twitter, and Stability AI
- **11 predictions** with resolution tracking (confirmed, disproven, or open)
- Sources linked to primary reporting for every claim
- Editorial fact-checking against primary sources — no database timestamps as proxies for real-world dates

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui
- Supabase (Postgres + Auth + API)
- Vercel

## Data accuracy

All dates, claims, and factual assertions are verified against primary sources before being committed. If a date cannot be verified, it is omitted rather than guessed. Corrections are welcome — open an issue or PR with a source.

## Local development

```bash
npm install
npx supabase start    # requires Docker
npm run dev           # runs on port 3700
```

## Analytics

This site uses [Plausible](https://plausible.io/) for privacy-friendly analytics. No cookies, no personal data collected.

## Contributing

If you spot an inaccuracy, please open an issue with:
- The profile or claim in question
- The correction
- A primary source (news article, official statement, etc.)

## License

MIT
