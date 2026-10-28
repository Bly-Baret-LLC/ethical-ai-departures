-- Approval-gated rollback: archive Irving, retaining sources/writings/interactions.
-- Restore only fields changed by this batch; refuse subsequent editorial drift.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
LOCK TABLE public.profiles, public.profile_sources, public.publications, public.profile_concern_tags IN SHARE ROW EXCLUSIVE MODE;

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
    AND reviewer IS NOT DISTINCT FROM 'Source review for approved local preview (2026-10-28)' AND updated_at=created_at) THEN RAISE EXCEPTION 'Irving changed; review rollback manually'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE slug='steven-adler' AND company='OpenAI' AND status='published' AND motive_evidence='direct' AND headline_counted AND departure_type='resigned' AND departure_date='2024-11-15' AND stated_reason IS NOT DISTINCT FROM 'Adler said he left OpenAI after losing trust in its approach to safety. His team disbanded after his manager left, and he said staying would mean moving away from safety-oriented work.'
    AND departure_context IS NOT DISTINCT FROM 'In October 2026 parliamentary testimony, Adler described pressure to soften public discussion of AI risks. He said his account concerned his experience before leaving in late 2024. In the following panel, OpenAI defended its safety processes and cited decisions to pause training and hold back a model release.'
    AND departure_date_precision IS NOT DISTINCT FROM 'year'
    AND departure_date_note IS NOT DISTINCT FROM 'Adler described leaving in late 2024. The sources reviewed do not establish an exact departure day.'
    AND seo_description IS NOT DISTINCT FROM 'Steven Adler left OpenAI in 2024, citing lost trust in its safety approach and the disbanding of his team. Read his firsthand account and sources.'
    AND correction_note IS NOT DISTINCT FROM 'October 28, 2026: Changed the departure date from an unsupported exact day to year precision. Adler described leaving in late 2024.'
    AND last_reviewed_at IS NOT DISTINCT FROM '2026-10-28'
    AND reviewer IS NOT DISTINCT FROM 'Parliamentary source review for local preview (2026-10-28)') THEN RAISE EXCEPTION 'Adler changed; review rollback manually'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000006'
    AND url IS NOT DISTINCT FROM 'https://committees.parliament.uk/oralevidence/18133/html'
    AND title IS NOT DISTINCT FROM 'Steven Adler — parliamentary testimony (Q3–5)'
    AND platform IS NOT DISTINCT FROM 'UK Parliament'
    AND source_type IS NOT DISTINCT FROM 'first_party'
    AND published_date IS NOT DISTINCT FROM '2026-10-19' AND profile_id=(SELECT id FROM public.profiles WHERE slug='steven-adler')) THEN RAISE EXCEPTION 'Adler added source changed; review rollback manually'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1028-0002-4000-8000-000000000007'
    AND url IS NOT DISTINCT FROM 'https://committees.parliament.uk/oralevidence/18134/html'
    AND title IS NOT DISTINCT FROM 'OpenAI — safety processes testimony (Q36–37)'
    AND platform IS NOT DISTINCT FROM 'UK Parliament'
    AND source_type IS NOT DISTINCT FROM 'organization'
    AND published_date IS NOT DISTINCT FROM '2026-10-19' AND profile_id=(SELECT id FROM public.profiles WHERE slug='steven-adler')) THEN RAISE EXCEPTION 'Adler added source changed; review rollback manually'; END IF;
END $$;
UPDATE public.profiles SET status='archived',headline_counted=false WHERE id='f0de1028-0001-4000-8000-000000000001';
UPDATE public.profiles SET stated_reason = 'Said he''s ''pretty terrified'' by the pace of AI development. Called the pursuit of AGI a ''very risky gamble with the future of humanity.''',
  departure_context = NULL,
  departure_date_precision = 'day',
  departure_date_note = NULL,
  seo_description = NULL,
  correction_note = NULL,
  last_reviewed_at = '2026-07-22',
  reviewer = 'editorial remediation (brief 2026-07-22)' WHERE slug='steven-adler';
DELETE FROM public.profile_sources WHERE id IN ('f0de1028-0002-4000-8000-000000000006','f0de1028-0002-4000-8000-000000000007');
UPDATE public.ticker_stats SET total_count=(SELECT count(*) FROM public.profiles WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported')), ninety_day_count=(SELECT count(*) FROM public.profiles WHERE status='published' AND headline_counted AND motive_evidence IN ('direct','reported') AND (CASE departure_date_precision WHEN 'year' THEN date_trunc('year',departure_date)::date WHEN 'month' THEN date_trunc('month',departure_date)::date ELSE departure_date END) BETWEEN current_date-90 AND current_date), updated_at=now();
-- If application code was also published, revert this batch's correction-log item.
COMMIT;
