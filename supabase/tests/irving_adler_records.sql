DO $$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id IS NOT DISTINCT FROM 'f0de1028-0001-4000-8000-000000000001'
    AND slug IS NOT DISTINCT FROM 'geoffrey-irving'
    AND name IS NOT DISTINCT FROM 'Geoffrey Irving'
    AND photo_url IS NOT DISTINCT FROM NULL
    AND company IS NOT DISTINCT FROM 'Google'
    AND role IS NOT DISTINCT FROM 'Lead, Scalable Alignment Team (Google DeepMind)'
    AND departure_date IS NOT DISTINCT FROM '2023-12-01'
    AND departure_date_precision IS NOT DISTINCT FROM 'month'
    AND departure_date_note IS NOT DISTINCT FROM 'Irving said he left DeepMind in December 2023 and started at the UK AI Safety Institute in April 2024. The exact departure day is not established.'
    AND seo_description IS NOT DISTINCT FROM 'Geoffrey Irving left Google DeepMind in December 2023, saying AI capabilities were advancing faster than safety. Read his account and relevant essays.'
    AND stated_reason IS NOT DISTINCT FROM 'Irving left Google DeepMind for government work on AI safety, saying advances in AI capabilities were outpacing safety research and calling for stronger governance and coordination.'
    AND departure_context IS NOT DISTINCT FROM 'He led DeepMind’s Scalable Alignment Team before joining the UK AI Safety Institute. His essays and October 2026 parliamentary testimony explain the move. At the same hearing, Google DeepMind described its safety framework, testing and mitigations; it did not address his departure specifically.'
    AND status IS NOT DISTINCT FROM 'published'
    AND departure_type IS NOT DISTINCT FROM 'resigned'
    AND motive_evidence IS NOT DISTINCT FROM 'direct'
    AND headline_counted IS NOT DISTINCT FROM true
    AND claim_status IS NOT DISTINCT FROM 'uncontested'
    AND last_reviewed_at IS NOT DISTINCT FROM '2026-10-28'
    AND reviewer IS NOT DISTINCT FROM 'Source review for approved local preview (2026-10-28)') THEN RAISE EXCEPTION 'Irving profile mismatch'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE slug='steven-adler' AND company='OpenAI' AND status='published' AND motive_evidence='direct' AND headline_counted AND departure_type='resigned' AND departure_date='2024-11-15' AND stated_reason IS NOT DISTINCT FROM 'Adler said he left OpenAI after losing trust in its approach to safety. His team disbanded after his manager left, and he said staying would mean moving away from safety-oriented work.'
    AND departure_context IS NOT DISTINCT FROM 'In October 2026 parliamentary testimony, Adler described pressure to soften public discussion of AI risks. He said his account concerned his experience before leaving in late 2024. In the following panel, OpenAI defended its safety processes and cited decisions to pause training and hold back a model release.'
    AND departure_date_precision IS NOT DISTINCT FROM 'year'
    AND departure_date_note IS NOT DISTINCT FROM 'Adler described leaving in late 2024. The sources reviewed do not establish an exact departure day.'
    AND seo_description IS NOT DISTINCT FROM 'Steven Adler left OpenAI in 2024, citing lost trust in its safety approach and the disbanding of his team. Read his firsthand account and sources.'
    AND correction_note IS NOT DISTINCT FROM 'October 28, 2026: Changed the departure date from an unsupported exact day to year precision. Adler described leaving in late 2024.'
    AND last_reviewed_at IS NOT DISTINCT FROM '2026-10-28'
    AND reviewer IS NOT DISTINCT FROM 'Parliamentary source review for local preview (2026-10-28)') THEN RAISE EXCEPTION 'Adler update mismatch'; END IF;
 IF (SELECT count(*) FROM public.profiles WHERE slug='geoffrey-irving' OR lower(name)='geoffrey irving')<>1 THEN RAISE EXCEPTION 'Duplicate Irving'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000001'
    AND url IS NOT DISTINCT FROM 'https://committees.parliament.uk/oralevidence/18133/html'
    AND title IS NOT DISTINCT FROM 'Geoffrey Irving — parliamentary testimony (Q7)'
    AND platform IS NOT DISTINCT FROM 'UK Parliament'
    AND source_type IS NOT DISTINCT FROM 'first_party'
    AND published_date IS NOT DISTINCT FROM '2026-10-19' AND profile_id=(SELECT id FROM public.profiles WHERE slug='geoffrey-irving')) THEN RAISE EXCEPTION 'Source mismatch: f0de1028-0002-4000-8000-000000000001'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000002'
    AND url IS NOT DISTINCT FROM 'https://naml.us/post/reflections-on-aisi/'
    AND title IS NOT DISTINCT FROM 'Reflections on AISI'
    AND platform IS NOT DISTINCT FROM 'Geoffrey Irving'
    AND source_type IS NOT DISTINCT FROM 'first_party'
    AND published_date IS NOT DISTINCT FROM '2026-05-15' AND profile_id=(SELECT id FROM public.profiles WHERE slug='geoffrey-irving')) THEN RAISE EXCEPTION 'Source mismatch: f0de1028-0002-4000-8000-000000000002'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000003'
    AND url IS NOT DISTINCT FROM 'https://www.aisi.gov.uk/blog/why-i-joined-aisi---geoffrey-irving'
    AND title IS NOT DISTINCT FROM 'Why I joined AISI'
    AND platform IS NOT DISTINCT FROM 'UK AI Safety Institute — Geoffrey Irving'
    AND source_type IS NOT DISTINCT FROM 'first_party'
    AND published_date IS NOT DISTINCT FROM NULL AND profile_id=(SELECT id FROM public.profiles WHERE slug='geoffrey-irving')) THEN RAISE EXCEPTION 'Source mismatch: f0de1028-0002-4000-8000-000000000003'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000004'
    AND url IS NOT DISTINCT FROM 'https://naml.us/'
    AND title IS NOT DISTINCT FROM 'Geoffrey Irving — professional biography'
    AND platform IS NOT DISTINCT FROM 'Geoffrey Irving'
    AND source_type IS NOT DISTINCT FROM 'first_party'
    AND published_date IS NOT DISTINCT FROM NULL AND profile_id=(SELECT id FROM public.profiles WHERE slug='geoffrey-irving')) THEN RAISE EXCEPTION 'Source mismatch: f0de1028-0002-4000-8000-000000000004'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000005'
    AND url IS NOT DISTINCT FROM 'https://committees.parliament.uk/oralevidence/18134/html'
    AND title IS NOT DISTINCT FROM 'Google DeepMind — safety framework testimony (Q44–48)'
    AND platform IS NOT DISTINCT FROM 'UK Parliament'
    AND source_type IS NOT DISTINCT FROM 'organization'
    AND published_date IS NOT DISTINCT FROM '2026-10-19' AND profile_id=(SELECT id FROM public.profiles WHERE slug='geoffrey-irving')) THEN RAISE EXCEPTION 'Source mismatch: f0de1028-0002-4000-8000-000000000005'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000006'
    AND url IS NOT DISTINCT FROM 'https://committees.parliament.uk/oralevidence/18133/html'
    AND title IS NOT DISTINCT FROM 'Steven Adler — parliamentary testimony (Q3–5)'
    AND platform IS NOT DISTINCT FROM 'UK Parliament'
    AND source_type IS NOT DISTINCT FROM 'first_party'
    AND published_date IS NOT DISTINCT FROM '2026-10-19' AND profile_id=(SELECT id FROM public.profiles WHERE slug='steven-adler')) THEN RAISE EXCEPTION 'Source mismatch: f0de1028-0002-4000-8000-000000000006'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000007'
    AND url IS NOT DISTINCT FROM 'https://committees.parliament.uk/oralevidence/18134/html'
    AND title IS NOT DISTINCT FROM 'OpenAI — safety processes testimony (Q36–37)'
    AND platform IS NOT DISTINCT FROM 'UK Parliament'
    AND source_type IS NOT DISTINCT FROM 'organization'
    AND published_date IS NOT DISTINCT FROM '2026-10-19' AND profile_id=(SELECT id FROM public.profiles WHERE slug='steven-adler')) THEN RAISE EXCEPTION 'Source mismatch: f0de1028-0002-4000-8000-000000000007'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.publications WHERE id IS NOT DISTINCT FROM 'f0de1028-0003-4000-8000-000000000001'
    AND profile_id IS NOT DISTINCT FROM 'f0de1028-0001-4000-8000-000000000001'
    AND title IS NOT DISTINCT FROM 'Why I joined AISI'
    AND url IS NOT DISTINCT FROM 'https://www.aisi.gov.uk/blog/why-i-joined-aisi---geoffrey-irving'
    AND publication_type IS NOT DISTINCT FROM 'essay'
    AND publisher IS NOT DISTINCT FROM 'UK AI Safety Institute'
    AND published_date IS NOT DISTINCT FROM NULL
    AND published_date_precision IS NOT DISTINCT FROM 'day'
    AND listed_in_publications IS NOT DISTINCT FROM true
    AND abstract IS NOT DISTINCT FROM 'Irving argues that safety research is advancing too slowly relative to AI capabilities and that coordination is under-resourced. He explains the role governments can play in helping society make informed decisions about AI risk.') THEN RAISE EXCEPTION 'Publication mismatch'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.publications WHERE id IS NOT DISTINCT FROM 'f0de1028-0003-4000-8000-000000000002'
    AND profile_id IS NOT DISTINCT FROM 'f0de1028-0001-4000-8000-000000000001'
    AND title IS NOT DISTINCT FROM 'Reflections on AISI'
    AND url IS NOT DISTINCT FROM 'https://naml.us/post/reflections-on-aisi/'
    AND publication_type IS NOT DISTINCT FROM 'essay'
    AND publisher IS NOT DISTINCT FROM 'Geoffrey Irving'
    AND published_date IS NOT DISTINCT FROM '2026-05-15'
    AND published_date_precision IS NOT DISTINCT FROM 'day'
    AND listed_in_publications IS NOT DISTINCT FROM false
    AND abstract IS NOT DISTINCT FROM 'Irving reflects on his move from DeepMind to government and the value of independent safety research. He also explains his later, family-related decision to leave AISI.') THEN RAISE EXCEPTION 'Publication mismatch'; END IF;
 IF (SELECT array_agg(t.slug ORDER BY t.slug) FROM public.profile_concern_tags pt JOIN public.concern_tags t ON t.id=pt.concern_tag_id WHERE pt.profile_id='f0de1028-0001-4000-8000-000000000001') <> ARRAY['alignment-research-gaps','competitive-race-dynamics'] THEN RAISE EXCEPTION 'Irving tags mismatch'; END IF;
 IF EXISTS(SELECT 1 FROM public.predictions WHERE profile_id='f0de1028-0001-4000-8000-000000000001') THEN RAISE EXCEPTION 'Unapproved Irving prediction'; END IF;
END $$;
