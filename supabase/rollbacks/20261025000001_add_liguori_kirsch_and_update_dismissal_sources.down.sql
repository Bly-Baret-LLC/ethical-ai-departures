-- Manual rollback only. Take a backup and review the target first.
-- Archives the new profiles (retains their sources, writings and any activity).
-- Removes only this release's NPR links and appended paragraphs.
-- Does not permit overwriting later editorial reviews; revert app copy too.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;
DO $$
BEGIN
  IF (SELECT count(*) FROM public.profiles WHERE id IN
    ('f0de1025-0001-4000-8000-000000000001', 'f0de1025-0001-4000-8000-000000000002')
    AND slug IN ('sofia-liguori', 'andreas-kirsch')
    AND reviewer = 'DeepMind departure review (2026-10-25)'
    AND updated_at = created_at AND status = 'published') <> 2 THEN
    RAISE EXCEPTION 'New profiles changed; manual review required';
  END IF;
  IF (SELECT count(*) FROM public.profiles WHERE slug IN ('tomek-korbak', 'mikita-balesni')
    AND reviewer = 'NPR interview review (2026-10-25)' AND last_reviewed_at = '2026-10-25'
    AND motive_evidence = 'alleged' AND NOT headline_counted AND claim_status = 'contested'
    AND departure_context LIKE '%OpenAI denies retaliation. In an October 23 NPR interview,%') <> 2 THEN
    RAISE EXCEPTION 'Dismissal records changed; manual review required';
  END IF;
  IF (SELECT count(*) FROM public.profile_sources WHERE id IN
    ('f0de1025-0002-4000-8000-000000000001', 'f0de1025-0002-4000-8000-000000000002')
    AND url = 'https://news.wjct.org/tech/2026-10-23/fired-openai-researchers-say-independent-safety-audits-arent-going-well'
    AND source_type = 'first_party' AND published_date = '2026-10-23') <> 2 THEN
    RAISE EXCEPTION 'Interview source links changed; manual review required';
  END IF;
END $$;
UPDATE public.profiles SET status = 'archived', headline_counted = false
WHERE id IN ('f0de1025-0001-4000-8000-000000000001', 'f0de1025-0001-4000-8000-000000000002');

UPDATE public.profiles
SET departure_context = split_part(departure_context, ' In an October 23 NPR interview,', 1),
    reviewer = 'OpenAI dismissal review (2026-10-08)', last_reviewed_at = '2026-10-08'
WHERE slug IN ('tomek-korbak', 'mikita-balesni');
DELETE FROM public.profile_sources WHERE id IN
  ('f0de1025-0002-4000-8000-000000000001', 'f0de1025-0002-4000-8000-000000000002');
UPDATE public.ticker_stats SET
  total_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')),
  ninety_day_count = (SELECT count(*) FROM public.profiles WHERE status = 'published'
    AND headline_counted AND motive_evidence IN ('direct', 'reported')
    AND departure_date >= current_date - interval '90 days' AND departure_date <= current_date),
  updated_at = now();
COMMIT;
