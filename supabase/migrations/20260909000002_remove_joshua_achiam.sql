-- Editorial removal: Achiam's departure statement gave no specific reason and
-- did not connect his exit to safety, ethics, governance, or accountability.
-- The contextual case relied too heavily on his prior role rather than motive.

DELETE FROM profiles WHERE slug = 'joshua-achiam';

-- Keep the legacy realtime row aligned with the remaining published records.
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
