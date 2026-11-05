DO $$
DECLARE
  dex uuid := 'f0de1105-0001-4000-8000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = dex
      AND slug = 'dex-hunter-torricke' AND company = 'Google' AND photo_url IS NULL
      AND status = 'published' AND headline_counted AND motive_evidence = 'direct'
      AND departure_date = '2025-10-01' AND departure_date_precision = 'month') THEN
    RAISE EXCEPTION 'Expected one month-precision, evidence-linked Google profile';
  END IF;
  IF (SELECT count(*) FROM public.profile_sources WHERE profile_id = dex) <> 4
    OR NOT EXISTS (SELECT 1 FROM public.profile_sources WHERE profile_id = dex
      AND source_type = 'first_party' AND published_date = '2026-02-17'
      AND url = 'https://dexhuntertorricke.substack.com/p/another-future-is-possible') THEN
    RAISE EXCEPTION 'Hunter-Torricke source set is incomplete';
  END IF;
  IF (SELECT array_agg(t.slug ORDER BY t.slug) FROM public.profile_concern_tags pt
      JOIN public.concern_tags t ON t.id = pt.concern_tag_id WHERE pt.profile_id = dex)
    IS DISTINCT FROM ARRAY['concentration-of-power', 'inadequate-oversight']::text[] THEN
    RAISE EXCEPTION 'Hunter-Torricke concern tags do not match';
  END IF;
  IF (SELECT count(*) FROM public.publications WHERE profile_id = dex) <> 1
    OR NOT EXISTS (SELECT 1 FROM public.publications WHERE profile_id = dex
      AND publication_type = 'essay' AND listed_in_publications AND published_date = '2026-02-17'
      AND url = 'https://dexhuntertorricke.substack.com/p/another-future-is-possible') THEN
    RAISE EXCEPTION 'Expected one listed, author-linked essay';
  END IF;
END $$;
