-- Manual rollback for 20260910000004_add_jonathan_richard_schwarz.sql.
-- Run only after reviewing the target database. This file is deliberately
-- outside supabase/migrations so it is never applied automatically.

BEGIN;

DELETE FROM publications
WHERE profile_id = (
  SELECT id FROM profiles WHERE slug = 'jonathan-richard-schwarz'
);

DELETE FROM profile_sources
WHERE profile_id = (
  SELECT id FROM profiles WHERE slug = 'jonathan-richard-schwarz'
);

DELETE FROM profile_concern_tags
WHERE profile_id = (
  SELECT id FROM profiles WHERE slug = 'jonathan-richard-schwarz'
);

DELETE FROM profiles
WHERE slug = 'jonathan-richard-schwarz';

DELETE FROM concern_tags
WHERE slug = 'concentration-of-power'
  AND NOT EXISTS (
    SELECT 1
    FROM profile_concern_tags
    WHERE concern_tag_id = concern_tags.id
  );

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
