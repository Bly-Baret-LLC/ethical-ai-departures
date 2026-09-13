-- Manual rollback for 20260910000001_update_coxon_reporting.sql.
-- Restores the profile copy from 20260909000001_add_coxon_achiam.sql and
-- removes only the three follow-up sources added by the later migration.

BEGIN;

UPDATE profiles
SET departure_context = 'Before joining Anthropic, Coxon worked at OpenAI, where he contributed to GPT-4o and co-authored research on making neural-network computations easier to interpret. In his September 8 resignation statement and an interview with The Wall Street Journal, he distinguished between the two laboratories: he said many people at OpenAI had not fully internalized the stakes, while Anthropic understood them but remained constrained by competition. He described Anthropic''s safety work as sincere, but argued that competitive pressure still produced unacceptable trade-offs. Anthropic had not publicly responded to his claims when this record was reviewed.',
    last_reviewed_at = '2026-09-09',
    reviewer = 'editorial review (2026-09-09)',
    updated_at = now()
WHERE slug = 'jacob-coxon';

DELETE FROM profile_sources source
USING profiles profile
WHERE source.profile_id = profile.id
  AND profile.slug = 'jacob-coxon'
  AND source.url IN (
    'https://www.seattletimes.com/business/anthropic-researcher-resigns-warning-of-reckless-race-toward-superintelligence/',
    'https://www.wired.com/story/anthropic-researcher-quits-jacob-coxon-ai-fears-humanity/',
    'https://www.axios.com/2026/09/09/anthropic-researcher-ai-warning-interview'
  );

COMMIT;
