-- Manual rollback for 20260910000003_replace_context_profiles_with_events.sql.
-- Run only after reviewing the target database. This file is deliberately
-- outside supabase/migrations so it is never applied automatically.

BEGIN;

UPDATE profiles
SET status = 'published'
WHERE slug IN (
  'andrea-vallone',
  'barret-zoph',
  'behnam-neyshabur',
  'bob-mcgrew',
  'chris-olah',
  'christian-szegedy',
  'collin-burns',
  'cullen-o-keefe',
  'harsh-mehta',
  'igor-babuschkin',
  'jack-clark',
  'jan-hendrik-kirchner',
  'jared-kaplan',
  'jimmy-ba',
  'john-schulman',
  'jonathan-uesato',
  'lilian-weng',
  'mira-murati',
  'paul-christiano',
  'pavel-izmailov',
  'ryan-lowe',
  'sam-mccandlish',
  'steven-bills',
  'toby-pohlen',
  'tony-wu',
  'zvika-krieger'
);

UPDATE profiles
SET status = 'published',
    claim_status = NULL,
    last_reviewed_at = '2026-07-22',
    reviewer = 'editorial remediation (brief 2026-07-22)',
    correction_note = NULL
WHERE slug = 'tom-brown';

UPDATE profiles
SET motive_evidence = 'contextual',
    headline_counted = false,
    claim_status = NULL,
    stated_reason = 'Departed with Dario Amodei to co-found Anthropic.',
    departure_context = NULL,
    last_reviewed_at = '2026-07-22',
    reviewer = 'editorial remediation (brief 2026-07-22)',
    correction_note = NULL
WHERE slug = 'daniela-amodei';

UPDATE profiles
SET motive_evidence = 'contextual',
    headline_counted = false,
    claim_status = NULL,
    stated_reason = 'Departed after the Superalignment team was dissolved.',
    departure_context = NULL,
    last_reviewed_at = '2026-07-22',
    reviewer = 'editorial remediation (brief 2026-07-22)',
    correction_note = '2026-07-22 review: signed the April 2025 ex-employee amicus brief opposing OpenAI''s for-profit conversion (documented as a source); no statement connecting his own departure to a concern has been located, so the record remains contextual.'
WHERE slug = 'jeffrey-wu';

UPDATE profiles
SET motive_evidence = 'contextual',
    headline_counted = false,
    claim_status = NULL,
    stated_reason = 'Departed after the Superalignment team was dissolved.',
    departure_context = NULL,
    last_reviewed_at = '2026-07-22',
    reviewer = 'editorial remediation (brief 2026-07-22)',
    correction_note = NULL
WHERE slug = 'yuri-burda';

DELETE FROM profile_sources source
USING profiles profile
WHERE source.profile_id = profile.id
  AND (
    (profile.slug = 'daniela-amodei' AND source.url IN (
      'https://www.gsb.stanford.edu/insights/daniela-amodei-says-curiosity-underrated',
      'https://time.com/6295523/claude-2-anthropic-chatgpt/'
    ))
    OR
    (profile.slug IN ('jeffrey-wu', 'yuri-burda') AND source.url =
      'https://www.theinformation.com/articles/openai-removes-ai-safety-leader-m-dry-a-onetime-ally-of-ceo-altman')
  );

UPDATE ticker_stats
SET total_count = (
      SELECT count(*) FROM profiles WHERE status = 'published'
    ),
    ninety_day_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND departure_date >= current_date - interval '90 days'
    ),
    updated_at = now();

COMMIT;
