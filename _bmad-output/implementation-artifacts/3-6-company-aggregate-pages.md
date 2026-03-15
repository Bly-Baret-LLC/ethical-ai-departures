# Story 3.6: Company Aggregate Pages

Status: done

## Dev Agent Record
### Agent Model Used
Claude Opus 4.6

### File List
- src/lib/queries/companies.ts (new — getCompanies, getCompanyBySlug)
- src/app/companies/page.tsx (new — company index sorted by count)
- src/app/companies/page.test.tsx (new — 4 tests)
- src/app/companies/[slug]/page.tsx (new — company detail with timeline + concern breakdown)
- src/app/companies/[slug]/page.test.tsx (new — 7 tests)
- src/app/companies/[slug]/not-found.tsx (new)
- src/components/shared/SiteHeader.tsx (updated — added Companies nav link)
