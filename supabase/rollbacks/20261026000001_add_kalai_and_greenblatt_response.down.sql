-- Manual, approval-gated rollback. Archives Kalai rather than deleting his
-- record, preserving sources, writings and any later public interactions.
-- Later edits to affected rows require manual review, never blind overwrite.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles, public.profile_sources, public.publications,
  public.profile_concern_tags IN SHARE ROW EXCLUSIVE MODE;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'f0de1026-0001-4000-8000-000000000001'
    AND slug = 'adam-tauman-kalai' AND status = 'published' AND headline_counted
    AND motive_evidence = 'direct' AND updated_at = created_at
    AND reviewer = 'Source review for approved local preview (2026-10-26)') THEN
    RAISE EXCEPTION 'Kalai record changed; review rollback manually';
  END IF;
  IF (SELECT count(*) FROM public.profiles WHERE slug IN ('mikita-balesni', 'tomek-korbak')
    AND status = 'published' AND motive_evidence = 'alleged' AND NOT headline_counted
    AND claim_status = 'contested' AND last_reviewed_at = '2026-10-26'
    AND reviewer = 'Greenblatt response review (2026-10-26)'
    AND departure_context LIKE '%OpenAI denies retaliation. In an October 23 NPR interview,%'
    AND right(departure_context, length(' In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals.')) =
      ' In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals.') <> 2 THEN
    RAISE EXCEPTION 'Dismissal records changed; review rollback manually';
  END IF;
  IF (SELECT count(*) FROM public.profile_sources s JOIN public.profiles p ON p.id=s.profile_id
    WHERE p.slug IN ('mikita-balesni', 'tomek-korbak') AND (
      (s.id IN ('f0de1026-0002-4000-8000-000000000003','f0de1026-0002-4000-8000-000000000004')
       AND s.url = 'https://x.com/RyanGreenblatt/status/2113649836100931761'
       AND s.source_type = 'first_party' AND s.published_date = '2026-10-23'
       AND s.title = 'Ryan Greenblatt — response to reported leak allegations' AND s.platform = 'X')
      OR (s.id IN ('f0de1026-0002-4000-8000-000000000005','f0de1026-0002-4000-8000-000000000006')
       AND s.url = 'https://sfstandard.com/2026/10/24/openai-firings-safety-signal-chats/'
       AND s.source_type = 'reporting' AND s.published_date = '2026-10-24'
       AND s.title = 'OpenAI dismissals — Signal chats, leak allegations, and responses'
       AND s.platform = 'The San Francisco Standard'))) <> 4 THEN
    RAISE EXCEPTION 'Response source rows changed; review rollback manually';
  END IF;
END $$;

UPDATE public.profiles SET status = 'archived', headline_counted = false
WHERE id = 'f0de1026-0001-4000-8000-000000000001';
UPDATE public.profiles SET departure_context = left(departure_context,
    length(departure_context) - length(' In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals.')),
  reviewer = 'NPR interview review (2026-10-25)', last_reviewed_at = '2026-10-25'
WHERE slug IN ('mikita-balesni', 'tomek-korbak');
DELETE FROM public.profile_sources WHERE id IN
  ('f0de1026-0002-4000-8000-000000000003','f0de1026-0002-4000-8000-000000000004',
   'f0de1026-0002-4000-8000-000000000005','f0de1026-0002-4000-8000-000000000006');
UPDATE public.ticker_stats SET
  total_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')),
  ninety_day_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')
    AND (CASE departure_date_precision WHEN 'year' THEN date_trunc('year', departure_date)::date
      WHEN 'month' THEN date_trunc('month', departure_date)::date ELSE departure_date END)
      BETWEEN current_date - 90 AND current_date),
  updated_at = now();
COMMIT;
