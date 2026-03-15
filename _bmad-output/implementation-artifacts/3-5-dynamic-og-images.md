# Story 3.5: Dynamic OG Images

Status: done

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### File List
- src/app/api/og/route.tsx (new — Edge runtime OG image generation for home + profile)
- src/app/api/og/route.test.tsx (new — 4 tests)
- src/app/layout.tsx (updated — openGraph + twitter card meta)
- src/app/profiles/[slug]/page.tsx (updated — profile-specific OG image in generateMetadata)
