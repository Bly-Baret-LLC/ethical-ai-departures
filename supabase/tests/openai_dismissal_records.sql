-- Run after the scoped migration against the LOCAL preview database only.
-- Read-only assertions; does not apply unrelated pending migrations.
DO $$
DECLARE
  person RECORD;
BEGIN
  IF (SELECT count(*) FROM public.profiles WHERE slug IN
    ('tomek-korbak', 'jasmine-wang', 'mikita-balesni')) <> 3 THEN
    RAISE EXCEPTION 'Expected all three profiles';
  END IF;
  FOR person IN SELECT * FROM public.profiles WHERE slug IN
    ('tomek-korbak', 'jasmine-wang', 'mikita-balesni') LOOP
    IF person.company <> 'OpenAI' OR person.status <> 'published'
      OR person.departure_type <> 'fired' OR person.motive_evidence <> 'alleged'
      OR person.headline_counted OR person.claim_status <> 'contested'
      OR person.photo_url IS NOT NULL OR person.motive_quote IS NOT NULL
      OR person.departure_date <> '2026-01-01' OR person.departure_date_precision <> 'year'
      OR person.departure_date_note NOT LIKE '%exact departure dates are not confirmed%'
      OR person.departure_context NOT LIKE '%OpenAI denies retaliation.%'
      OR person.seo_description NOT LIKE '%disputes%' THEN
      RAISE EXCEPTION 'Classification, date, or attribution mismatch for %', person.slug;
    END IF;
    IF (SELECT count(*) FROM public.profile_sources WHERE profile_id = person.id) <> 4
      OR (SELECT count(*) FROM public.profile_sources WHERE profile_id = person.id
        AND source_type = 'first_party' AND platform = 'X') <> 1
      OR (SELECT count(*) FROM public.profile_sources WHERE profile_id = person.id
        AND source_type = 'first_party' AND url = 'https://mikitabalesni.com/letter/letter.pdf') <> 1
      OR (SELECT count(*) FROM public.publications WHERE profile_id = person.id) <> 2
      OR (SELECT count(*) FROM public.publications WHERE profile_id = person.id
        AND publication_type = 'essay' AND url = 'https://mikitabalesni.com/letter/letter.pdf') <> 1
      OR (SELECT count(*) FROM public.publications WHERE profile_id = person.id
        AND publication_type = 'paper' AND url = 'https://arxiv.org/abs/2507.11473'
        AND published_date = '2025-07-15' AND last_updated_at = '2025-12-07') <> 1
      OR EXISTS (SELECT 1 FROM public.predictions WHERE profile_id = person.id)
      OR (SELECT count(*) FROM public.profile_concern_tags WHERE profile_id = person.id) <> 2 THEN
      RAISE EXCEPTION 'Sources, writings, or concerns incomplete for %', person.slug;
    END IF;
  END LOOP;
END $$;
