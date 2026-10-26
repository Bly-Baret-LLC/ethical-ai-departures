-- Read-only batch assertions. Baseline/delta and rollback checks are separate.
DO $$
DECLARE p public.profiles;
BEGIN
  SELECT * INTO STRICT p FROM public.profiles WHERE slug='adam-tauman-kalai';
  IF p.id <> 'f0de1026-0001-4000-8000-000000000001' OR p.company <> 'OpenAI'
    OR p.name <> 'Adam Tauman Kalai' OR p.status <> 'published' OR NOT p.headline_counted
    OR p.motive_evidence <> 'direct' OR p.departure_type <> 'resigned'
    OR p.claim_status <> 'uncontested' OR p.photo_url IS NOT NULL
    OR p.departure_date <> '2026-01-01' OR p.departure_date_precision <> 'year'
    OR p.effective_departure_date IS NOT NULL OR p.last_reviewed_at <> '2026-10-26'
    OR p.departure_date_note NOT LIKE '%September 16, 2026%' OR p.seo_description IS NULL
    OR p.stated_reason NOT LIKE '%linking his decision%' THEN
    RAISE EXCEPTION 'Kalai identity, evidence or precision mismatch';
  END IF;
  IF (SELECT count(*) FROM public.profile_sources WHERE profile_id=p.id) <> 2
    OR (SELECT count(*) FROM public.profile_concern_tags pt JOIN public.concern_tags t
      ON t.id=pt.concern_tag_id WHERE pt.profile_id=p.id AND t.slug='alignment-research-gaps') <> 1
    OR (SELECT count(*) FROM public.profile_concern_tags WHERE profile_id=p.id) <> 1
    OR (SELECT count(*) FROM public.publications WHERE profile_id=p.id) <> 1
    OR NOT EXISTS (SELECT 1 FROM public.publications WHERE profile_id=p.id
      AND publication_type='essay' AND published_date='2026-09-16' AND published_date_precision='day'
      AND url='https://www.lesswrong.com/posts/BZHEczCfkD7ntC76t/launching-resi-the-institute-for-responsible')
    OR EXISTS (SELECT 1 FROM public.predictions WHERE profile_id=p.id) THEN
    RAISE EXCEPTION 'Kalai sources, tags, writings or predictions mismatch';
  END IF;
  FOR p IN SELECT * FROM public.profiles WHERE slug IN ('mikita-balesni','tomek-korbak') LOOP
    IF p.motive_evidence <> 'alleged' OR p.headline_counted OR p.claim_status <> 'contested'
      OR p.departure_date_precision <> 'year' OR p.last_reviewed_at <> '2026-10-26'
      OR p.departure_context NOT LIKE '%OpenAI denies retaliation.%'
      OR p.departure_context NOT LIKE '%October 23 NPR interview%'
      OR p.departure_context NOT LIKE '%Greenblatt denied%'
      OR (SELECT count(*) FROM public.publications WHERE profile_id=p.id) <> 2
      OR (SELECT count(*) FROM public.profile_sources WHERE profile_id=p.id AND url IN
        ('https://x.com/RyanGreenblatt/status/2113649836100931761',
         'https://sfstandard.com/2026/10/24/openai-firings-safety-signal-chats/')) <> 2 THEN
      RAISE EXCEPTION 'Dismissal evidence update mismatch: %', p.slug;
    END IF;
  END LOOP;
  IF (SELECT count(*) FROM public.profiles WHERE slug IN ('mikita-balesni','tomek-korbak')) <> 2 THEN
    RAISE EXCEPTION 'Missing existing profile';
  END IF;
  IF EXISTS (SELECT 1 FROM public.ticker_stats WHERE total_count <>
    (SELECT count(*) FROM public.profiles WHERE status='published' AND headline_counted
      AND motive_evidence IN ('direct','reported'))) THEN
    RAISE EXCEPTION 'Legacy tally mismatch';
  END IF;
END $$;
