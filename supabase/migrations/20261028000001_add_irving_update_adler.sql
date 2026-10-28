-- Approved local preview only. Production publication requires separate approval.
-- December 1 is a month sorting anchor, never an exact Irving departure date.
-- The AISI essay is intentionally undated; the transcript was published October 19
-- after the October 13 hearing. Keep the later AISI exit distinct from DeepMind.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
LOCK TABLE public.profiles, public.profile_sources, public.publications, public.profile_concern_tags IN SHARE ROW EXCLUSIVE MODE;

DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM public.profiles WHERE slug='geoffrey-irving' OR lower(name)='geoffrey irving') THEN
    RAISE EXCEPTION 'Irving already exists; review all statuses before applying';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE slug='steven-adler' AND company='OpenAI' AND status='published' AND motive_evidence='direct' AND headline_counted AND departure_type='resigned' AND departure_date='2024-11-15' AND stated_reason IS NOT DISTINCT FROM 'Said he''s ''pretty terrified'' by the pace of AI development. Called the pursuit of AGI a ''very risky gamble with the future of humanity.'''
    AND departure_context IS NOT DISTINCT FROM NULL
    AND departure_date_precision IS NOT DISTINCT FROM 'day'
    AND departure_date_note IS NOT DISTINCT FROM NULL
    AND seo_description IS NOT DISTINCT FROM NULL
    AND correction_note IS NOT DISTINCT FROM NULL
    AND last_reviewed_at IS NOT DISTINCT FROM '2026-07-22'
    AND reviewer IS NOT DISTINCT FROM 'editorial remediation (brief 2026-07-22)') THEN
    RAISE EXCEPTION 'Adler baseline changed; review before applying';
  END IF;
  IF (SELECT count(*) FROM public.concern_tags WHERE slug IN ('alignment-research-gaps','competitive-race-dynamics')) <> 2 THEN
    RAISE EXCEPTION 'Required concern tags missing';
  END IF;
  IF EXISTS(SELECT 1 FROM public.profile_sources s JOIN public.profiles p ON p.id=s.profile_id WHERE p.slug='steven-adler' AND s.url IN ('https://committees.parliament.uk/oralevidence/18133/html','https://committees.parliament.uk/oralevidence/18134/html')) THEN
    RAISE EXCEPTION 'Adler testimony already linked';
  END IF;
  IF EXISTS(SELECT 1 FROM public.publications WHERE url IN ('https://www.aisi.gov.uk/blog/why-i-joined-aisi---geoffrey-irving','https://naml.us/post/reflections-on-aisi/')) THEN
    RAISE EXCEPTION 'Irving essay already exists; review authorship';
  END IF;
END $$;
INSERT INTO public.profiles (id, slug, name, photo_url, company, role, departure_date, departure_date_precision, departure_date_note, seo_description, stated_reason, departure_context, status, departure_type, motive_evidence, headline_counted, claim_status, last_reviewed_at, reviewer)
VALUES ('f0de1028-0001-4000-8000-000000000001', 'geoffrey-irving', 'Geoffrey Irving', NULL, 'Google', 'Lead, Scalable Alignment Team (Google DeepMind)', '2023-12-01', 'month', 'Irving said he left DeepMind in December 2023 and started at the UK AI Safety Institute in April 2024. The exact departure day is not established.', 'Geoffrey Irving left Google DeepMind in December 2023, saying AI capabilities were advancing faster than safety. Read his account and relevant essays.', 'Irving left Google DeepMind for government work on AI safety, saying advances in AI capabilities were outpacing safety research and calling for stronger governance and coordination.', 'He led DeepMind’s Scalable Alignment Team before joining the UK AI Safety Institute. His essays and October 2026 parliamentary testimony explain the move. At the same hearing, Google DeepMind described its safety framework, testing and mitigations; it did not address his departure specifically.', 'published', 'resigned', 'direct', true, 'uncontested', '2026-10-28', 'Source review for approved local preview (2026-10-28)');

INSERT INTO public.profile_sources (id, url, title, platform, source_type, published_date, profile_id)
SELECT 'f0de1028-0002-4000-8000-000000000001', 'https://committees.parliament.uk/oralevidence/18133/html', 'Geoffrey Irving — parliamentary testimony (Q7)', 'UK Parliament', 'first_party', '2026-10-19', id FROM public.profiles WHERE slug='geoffrey-irving';
INSERT INTO public.profile_sources (id, url, title, platform, source_type, published_date, profile_id)
SELECT 'f0de1028-0002-4000-8000-000000000002', 'https://naml.us/post/reflections-on-aisi/', 'Reflections on AISI', 'Geoffrey Irving', 'first_party', '2026-05-15', id FROM public.profiles WHERE slug='geoffrey-irving';
INSERT INTO public.profile_sources (id, url, title, platform, source_type, published_date, profile_id)
SELECT 'f0de1028-0002-4000-8000-000000000003', 'https://www.aisi.gov.uk/blog/why-i-joined-aisi---geoffrey-irving', 'Why I joined AISI', 'UK AI Safety Institute — Geoffrey Irving', 'first_party', NULL, id FROM public.profiles WHERE slug='geoffrey-irving';
INSERT INTO public.profile_sources (id, url, title, platform, source_type, published_date, profile_id)
SELECT 'f0de1028-0002-4000-8000-000000000004', 'https://naml.us/', 'Geoffrey Irving — professional biography', 'Geoffrey Irving', 'first_party', NULL, id FROM public.profiles WHERE slug='geoffrey-irving';
INSERT INTO public.profile_sources (id, url, title, platform, source_type, published_date, profile_id)
SELECT 'f0de1028-0002-4000-8000-000000000005', 'https://committees.parliament.uk/oralevidence/18134/html', 'Google DeepMind — safety framework testimony (Q44–48)', 'UK Parliament', 'organization', '2026-10-19', id FROM public.profiles WHERE slug='geoffrey-irving';
INSERT INTO public.profile_sources (id, url, title, platform, source_type, published_date, profile_id)
SELECT 'f0de1028-0002-4000-8000-000000000006', 'https://committees.parliament.uk/oralevidence/18133/html', 'Steven Adler — parliamentary testimony (Q3–5)', 'UK Parliament', 'first_party', '2026-10-19', id FROM public.profiles WHERE slug='steven-adler';
INSERT INTO public.profile_sources (id, url, title, platform, source_type, published_date, profile_id)
SELECT 'f0de1028-0002-4000-8000-000000000007', 'https://committees.parliament.uk/oralevidence/18134/html', 'OpenAI — safety processes testimony (Q36–37)', 'UK Parliament', 'organization', '2026-10-19', id FROM public.profiles WHERE slug='steven-adler';
INSERT INTO public.profile_concern_tags (profile_id,concern_tag_id)
SELECT 'f0de1028-0001-4000-8000-000000000001'::uuid,id FROM public.concern_tags WHERE slug IN ('alignment-research-gaps','competitive-race-dynamics');
INSERT INTO public.publications (id, profile_id, title, url, publication_type, publisher, published_date, published_date_precision, listed_in_publications, abstract)
VALUES ('f0de1028-0003-4000-8000-000000000001', 'f0de1028-0001-4000-8000-000000000001', 'Why I joined AISI', 'https://www.aisi.gov.uk/blog/why-i-joined-aisi---geoffrey-irving', 'essay', 'UK AI Safety Institute', NULL, 'day', true, 'Irving argues that safety research is advancing too slowly relative to AI capabilities and that coordination is under-resourced. He explains the role governments can play in helping society make informed decisions about AI risk.');

INSERT INTO public.publications (id, profile_id, title, url, publication_type, publisher, published_date, published_date_precision, listed_in_publications, abstract)
VALUES ('f0de1028-0003-4000-8000-000000000002', 'f0de1028-0001-4000-8000-000000000001', 'Reflections on AISI', 'https://naml.us/post/reflections-on-aisi/', 'essay', 'Geoffrey Irving', '2026-05-15', 'day', false, 'Irving reflects on his move from DeepMind to government and the value of independent safety research. He also explains his later, family-related decision to leave AISI.');

-- Preserve Adler's ID, stored historical anchor, existing sources/tags/writings.
-- Only display/export precision changes; the old day is not asserted as fact.
UPDATE public.profiles SET stated_reason = 'Adler said he left OpenAI after losing trust in its approach to safety. His team disbanded after his manager left, and he said staying would mean moving away from safety-oriented work.',
  departure_context = 'In October 2026 parliamentary testimony, Adler described pressure to soften public discussion of AI risks. He said his account concerned his experience before leaving in late 2024. In the following panel, OpenAI defended its safety processes and cited decisions to pause training and hold back a model release.',
  departure_date_precision = 'year',
  departure_date_note = 'Adler described leaving in late 2024. The sources reviewed do not establish an exact departure day.',
  seo_description = 'Steven Adler left OpenAI in 2024, citing lost trust in its safety approach and the disbanding of his team. Read his firsthand account and sources.',
  correction_note = 'October 28, 2026: Changed the departure date from an unsupported exact day to year precision. Adler described leaving in late 2024.',
  last_reviewed_at = '2026-10-28',
  reviewer = 'Parliamentary source review for local preview (2026-10-28)' WHERE slug='steven-adler';
UPDATE public.ticker_stats SET total_count=(SELECT count(*) FROM public.profiles WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported')), ninety_day_count=(SELECT count(*) FROM public.profiles WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported') AND (CASE departure_date_precision WHEN 'year' THEN date_trunc('year',departure_date)::date WHEN 'month' THEN date_trunc('month',departure_date)::date ELSE departure_date END) BETWEEN current_date-90 AND current_date), updated_at=now();
COMMIT;
