-- Read-only checks after the October 25 migration, against LOCAL preview only.
DO $$
DECLARE person RECORD;
BEGIN
  IF (SELECT count(*) FROM public.profiles WHERE slug IN ('sofia-liguori', 'andreas-kirsch')) <> 2 THEN
    RAISE EXCEPTION 'Both new profiles must exist';
  END IF;
  FOR person IN SELECT * FROM public.profiles WHERE slug IN ('sofia-liguori', 'andreas-kirsch') LOOP
    IF person.company <> 'Google' OR person.status <> 'published'
      OR person.departure_type <> 'resigned' OR person.motive_evidence <> 'direct'
      OR NOT person.headline_counted OR person.claim_status <> 'uncontested'
      OR person.photo_url IS NOT NULL OR person.last_reviewed_at <> '2026-10-25'
      OR person.departure_context NOT LIKE '%Google told the BBC%'
      OR person.seo_description IS NULL THEN
      RAISE EXCEPTION 'Profile classification or completeness failed: %', person.slug;
    END IF;
    IF (SELECT count(*) FROM public.profile_concern_tags WHERE profile_id = person.id) <> 3
      OR (SELECT count(*) FROM public.publications WHERE profile_id = person.id) <> 1
      OR EXISTS (SELECT 1 FROM public.predictions WHERE profile_id = person.id)
      OR (SELECT count(*) FROM public.profile_sources WHERE profile_id = person.id AND source_type = 'reporting') <> 1
      OR (SELECT count(*) FROM public.profile_sources WHERE profile_id = person.id) < 2 THEN
      RAISE EXCEPTION 'Sources, tags, or writings incomplete: %', person.slug;
    END IF;
  END LOOP;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'sofia-liguori'
      AND departure_date = '2026-10-20' AND departure_date_precision = 'day')
    OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'andreas-kirsch'
      AND departure_date = '2026-09-01' AND departure_date_precision = 'month'
      AND effective_departure_date IS NULL AND departure_date_note LIKE '%October 1, 2026%') THEN
    RAISE EXCEPTION 'Departure date precision mismatch';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.publications w JOIN public.profiles p ON p.id = w.profile_id
      WHERE p.slug = 'andreas-kirsch' AND w.published_date = '2026-06-30' AND w.publication_type = 'essay')
    OR NOT EXISTS (SELECT 1 FROM public.publications w JOIN public.profiles p ON p.id = w.profile_id
      WHERE p.slug = 'sofia-liguori' AND w.published_date = '2026-10-20' AND w.publication_type = 'resignation_letter') THEN
    RAISE EXCEPTION 'Publication dates or types mismatch';
  END IF;
  FOR person IN SELECT * FROM public.profiles WHERE slug IN ('tomek-korbak', 'mikita-balesni') LOOP
    IF person.motive_evidence <> 'alleged' OR person.headline_counted
      OR person.claim_status <> 'contested' OR person.departure_date_precision <> 'year'
      OR person.last_reviewed_at <> '2026-10-25'
      OR person.departure_context NOT LIKE '%OpenAI denies retaliation.%'
      OR person.departure_context NOT LIKE '%October 23 NPR interview%'
      OR (SELECT count(*) FROM public.profile_sources WHERE profile_id = person.id
        AND platform = 'NPR / WJCT' AND source_type = 'first_party' AND published_date = '2026-10-23') <> 1
      OR (SELECT count(*) FROM public.publications WHERE profile_id = person.id) <> 2 THEN
      RAISE EXCEPTION 'Dismissal evidence update or classification mismatch: %', person.slug;
    END IF;
  END LOOP;
  IF EXISTS (SELECT 1 FROM public.ticker_stats WHERE total_count <>
    (SELECT count(*) FROM public.profiles WHERE status = 'published'
      AND headline_counted AND motive_evidence IN ('direct', 'reported'))) THEN
    RAISE EXCEPTION 'Legacy headline counter is out of sync';
  END IF;
END $$;
