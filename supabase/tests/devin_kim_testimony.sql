DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'devin-kim'
    AND status = 'published' AND company = 'xAI' AND motive_evidence = 'alleged'
    AND NOT headline_counted AND departure_type = 'fired' AND claim_status = 'contested'
    AND departure_date = '2025-09-15' AND departure_date_precision = 'day'
    AND departure_date_note LIKE '%paragraph 66%'
    AND stated_reason LIKE 'Kim alleges%'
    AND departure_context LIKE '%Kim said most of the safety team resigned%'
    AND departure_context LIKE '%she was unfamiliar with his case%'
    AND departure_context LIKE '%remains unresolved%'
    AND last_reviewed_at = '2026-11-08') THEN
    RAISE EXCEPTION 'Kim update has incorrect dates, attribution or evidence classification';
  END IF;
  IF (SELECT count(*) FROM public.profile_sources s JOIN public.profiles p ON p.id = s.profile_id
    WHERE p.slug = 'devin-kim' AND s.id IN (
      'f0de1108-0002-4000-8000-000000000001', 'f0de1108-0002-4000-8000-000000000002', 'f0de1108-0002-4000-8000-000000000003')) <> 3 THEN
    RAISE EXCEPTION 'Kim source update is incomplete';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profile_sources WHERE id = 'f0de1108-0002-4000-8000-000000000001'
    AND source_type = 'legal_filing' AND published_date = '2026-06-09')
    OR NOT EXISTS (SELECT 1 FROM public.profile_sources WHERE id = 'f0de1108-0002-4000-8000-000000000002'
    AND source_type = 'official_document' AND published_date = '2026-10-16')
    OR NOT EXISTS (SELECT 1 FROM public.profile_sources WHERE id = 'f0de1108-0002-4000-8000-000000000003'
    AND source_type = 'reporting' AND published_date = '2026-10-16') THEN
    RAISE EXCEPTION 'Kim sources have incorrect evidence types or publication dates';
  END IF;
END $$;
