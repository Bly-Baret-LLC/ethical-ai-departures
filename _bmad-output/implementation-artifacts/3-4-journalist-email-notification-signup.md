# Story 3.4: Journalist Email Notification Signup

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### File List
- src/lib/schemas/subscription.ts (new — Zod schema for email subscriptions)
- src/lib/actions/subscribe.ts (new — server action with Zod validation, duplicate check)
- src/components/custom/EmailSignup.tsx (new — form with GDPR consent text)
- src/components/custom/EmailSignup.test.tsx (new — 6 tests)
- src/app/press/page.tsx (updated — added EmailSignup)
- src/app/profiles/page.tsx (updated — added EmailSignup in footer)
- src/app/profiles/page.test.tsx (updated — mock EmailSignup)
- src/app/press/page.test.tsx (updated — mock EmailSignup)
