-- Manual, scoped rollback. Never apply automatically or after later edits.
-- Refuse to delete profiles that have changed or acquired community activity.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;
DO $$
DECLARE
  person RECORD;
  dependent_table TEXT;
  dependent_count INTEGER;
BEGIN
  IF (SELECT count(*) FROM public.profiles WHERE id IN
    ('f0de1008-0003-4000-8000-000000000001', 'f0de1008-0003-4000-8000-000000000002',
     'f0de1008-0003-4000-8000-000000000003')
    AND slug IN ('tomek-korbak', 'jasmine-wang', 'mikita-balesni')
    AND reviewer = 'OpenAI dismissal review (2026-10-08)'
    AND status = 'published' AND motive_evidence = 'alleged'
    AND NOT headline_counted AND claim_status = 'contested'
    AND updated_at = created_at) <> 3 THEN
    RAISE EXCEPTION 'Dismissal records changed or missing; manual review required';
  END IF;
  FOR person IN SELECT id FROM public.profiles WHERE id IN
    ('f0de1008-0003-4000-8000-000000000001', 'f0de1008-0003-4000-8000-000000000002',
     'f0de1008-0003-4000-8000-000000000003') LOOP
    IF (SELECT count(*) FROM public.profile_sources WHERE profile_id = person.id) <> 4
      OR EXISTS (SELECT 1 FROM public.profile_sources WHERE profile_id = person.id
        AND (url, title, platform, source_type, published_date) NOT IN (
          ('https://mikitabalesni.com/letter/letter.pdf', 'OpenAI cannot make AI safe on its own',
           'Joint letter — Korbak, Wang, and Balesni', 'first_party', '2026-10-08'::date),
          ('https://economictimes.indiatimes.com/openai-fires-3-researchers-amid-ai-safety-debate/articleshow/134629969.cms',
           'OpenAI’s explanation for the dismissals', 'AFP / The Economic Times', 'reporting', '2026-10-02'::date),
          ('https://techcrunch.com/2026/10/08/fired-openai-safety-researchers-dispute-misconduct-claims-warn-of-chilling-effect/',
           'OpenAI’s response to the letter', 'TechCrunch', 'reporting', '2026-10-08'::date),
          ('https://x.com/tomekkorbak/status/2108266859397283953',
           'Tomek Korbak — account of dismissal', 'X', 'first_party', '2026-10-08'::date),
          ('https://x.com/j_asminewang/status/2108263312291180680',
           'Jasmine Wang — account of dismissal', 'X', 'first_party', '2026-10-08'::date),
          ('https://x.com/balesni/status/2108262814003687745',
           'Mikita Balesni — account of dismissal', 'X', 'first_party', '2026-10-08'::date)))
      OR EXISTS (SELECT 1 FROM public.profile_sources WHERE profile_id = person.id
        AND (title IS NULL OR platform IS NULL OR source_type IS NULL OR published_date IS NULL))
      OR (SELECT count(*) FROM public.publications WHERE profile_id = person.id) <> 2
      OR EXISTS (SELECT 1 FROM public.publications WHERE profile_id = person.id
        AND updated_at <> created_at)
      OR EXISTS (SELECT 1 FROM public.publication_predictions pp
        JOIN public.publications pub ON pub.id = pp.publication_id WHERE pub.profile_id = person.id)
      OR (SELECT array_agg(t.slug ORDER BY t.slug)
        FROM public.profile_concern_tags pt JOIN public.concern_tags t ON t.id = pt.concern_tag_id
        WHERE pt.profile_id = person.id) IS DISTINCT FROM
          ARRAY['inadequate-oversight', 'lack-of-transparency']::text[] THEN
      RAISE EXCEPTION 'Linked editorial records changed; manual review required';
    END IF;
    FOREACH dependent_table IN ARRAY ARRAY['predictions', 'fan_letters', 'kudos', 'discussions'] LOOP
      EXECUTE format('SELECT count(*) FROM public.%I WHERE profile_id = $1', dependent_table)
        INTO dependent_count USING person.id;
      IF dependent_count <> 0 THEN
        RAISE EXCEPTION 'New % records exist; preserve them and review manually', dependent_table;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Sources, tags and publications cascade from these three exact identities.
DELETE FROM public.profiles WHERE id IN
  ('f0de1008-0003-4000-8000-000000000001', 'f0de1008-0003-4000-8000-000000000002',
   'f0de1008-0003-4000-8000-000000000003');
COMMIT;
