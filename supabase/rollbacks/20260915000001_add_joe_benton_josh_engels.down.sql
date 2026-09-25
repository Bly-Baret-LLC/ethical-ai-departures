-- Manual rollback for 20260915000001_add_joe_benton_josh_engels.sql.
-- Run only after reviewing the target database. This file is deliberately
-- outside supabase/migrations so it is never applied automatically.

BEGIN;

DELETE FROM predictions
WHERE profile_id IN (
  SELECT id FROM profiles WHERE slug IN ('joe-benton', 'josh-engels')
);

DELETE FROM publications
WHERE profile_id IN (
  SELECT id FROM profiles WHERE slug IN ('joe-benton', 'josh-engels')
);

DELETE FROM profile_sources
WHERE profile_id IN (
  SELECT id FROM profiles WHERE slug IN ('joe-benton', 'josh-engels')
);

DELETE FROM profile_concern_tags
WHERE profile_id IN (
  SELECT id FROM profiles WHERE slug IN ('joe-benton', 'josh-engels')
);

DELETE FROM profiles
WHERE slug IN ('joe-benton', 'josh-engels');

UPDATE ticker_stats
SET total_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND headline_counted = true
        AND motive_evidence IN ('direct', 'reported')
    ),
    ninety_day_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND headline_counted = true
        AND motive_evidence IN ('direct', 'reported')
        AND departure_date >= current_date - interval '90 days'
    ),
    updated_at = now();

COMMIT;
