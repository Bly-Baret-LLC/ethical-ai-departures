-- Approved local preview only; production publication requires separate approval.
-- Update an existing alleged record. No new people, writings, events or counts.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles, public.profile_sources IN SHARE ROW EXCLUSIVE MODE;

DO $$ BEGIN
  IF (SELECT count(*) FROM public.profiles WHERE slug = 'devin-kim') <> 1
    OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'devin-kim'
      AND name = 'Devin Kim' AND company = 'xAI' AND status = 'published'
      AND departure_type = 'fired' AND motive_evidence = 'alleged'
      AND NOT headline_counted AND claim_status = 'contested'
      AND departure_date = '2025-09-30' AND departure_date_precision = 'day'
      AND effective_departure_date IS NULL AND departure_date_note IS NULL
      AND seo_description IS NULL
      AND stated_reason = $old_reason$Early member of xAI's post-training team who led post-training and research infrastructure for the Grok models, and became an internal advocate for AI safety — warning that Grok lacked adequate safeguards against discrimination, weapons-related outputs, and political bias. According to his June 2026 wrongful-termination lawsuit, xAI fired him in September 2025, days before he was due to present his safety findings, with co-founder Jimmy Ba telling him they should "go their separate ways."$old_reason$
      AND departure_context = $old_context$The account of his firing is drawn from Kim's lawsuit against xAI and SpaceX (California state court, June 2026); the allegations have not been tested in court, and xAI did not respond to requests for comment. In June 2026 Kim was named president of the Center for AI Safety.$old_context$
      AND correction_note = 'Reclassified to alleged on 2026-07-22: retaliation link is asserted by the individual and disputed or unresolved; attribution-first wording applied.'
      AND last_reviewed_at = '2026-07-22'
      AND reviewer = 'editorial remediation (brief 2026-07-22)') THEN
    RAISE EXCEPTION 'Kim baseline changed or update already applied; review before applying';
  END IF;
  IF EXISTS (SELECT 1 FROM public.profile_sources WHERE
    id IN ('f0de1108-0002-4000-8000-000000000001', 'f0de1108-0002-4000-8000-000000000002', 'f0de1108-0002-4000-8000-000000000003')
    OR (profile_id = (SELECT id FROM public.profiles WHERE slug = 'devin-kim') AND url IN (
      'https://sanfordheisler.com/wp-content/uploads/2026/06/2026-06-09-Complaint-Kim-v.-xAI-and-SpaceX.pdf',
      'https://council.nyc.gov/press/2026/10/16/3301/',
      'https://www.amny.com/politics/menin-spacexai-grok-sexualized-image/'))) THEN
    RAISE EXCEPTION 'Kim testimony sources already exist or IDs collide';
  END IF;
END $$;

UPDATE public.profiles SET
  stated_reason = 'Kim alleges xAI fired him after he raised concerns about Grok’s discriminatory outputs and inadequate safeguards against weapons-related misuse.',
  departure_context = 'His June 2026 lawsuit dates his dismissal to September 15, 2025, the week he was due to present safety findings to leadership. In testimony before the New York City Council on October 16, 2026, Kim said most of the safety team resigned after his dismissal. He said he could not speak to the company’s current safety practices. SpaceXAI representative Gabriela Castillo Madrid told the Council she was unfamiliar with his case. His retaliation claim remains unresolved.',
  departure_date = '2025-09-15',
  departure_date_note = 'Kim’s complaint dates his dismissal to September 15, 2025 (paragraph 66).',
  seo_description = 'Devin Kim alleges xAI fired him after he raised concerns about Grok safety. Read his lawsuit, October 2026 testimony and the company representative’s response.',
  correction_note = correction_note || ' November 8, 2026: Corrected the stored departure date from September 30 to September 15, 2025, as stated in paragraph 66 of Kim’s complaint. The retaliation allegation remains unresolved.',
  last_reviewed_at = '2026-11-08',
  reviewer = 'Complaint and Council testimony source review for local preview (2026-11-08)'
WHERE slug = 'devin-kim';

INSERT INTO public.profile_sources (id, profile_id, url, title, platform, source_type, published_date)
SELECT s.id::uuid, p.id, s.url, s.title, s.platform, s.source_type, s.published_date::date
FROM public.profiles p CROSS JOIN (VALUES
  ('f0de1108-0002-4000-8000-000000000001', 'https://sanfordheisler.com/wp-content/uploads/2026/06/2026-06-09-Complaint-Kim-v.-xAI-and-SpaceX.pdf', 'Kim v. xAI and SpaceX — complaint (paragraphs 66–71)', 'Sanford Heisler Sharp McKnight', 'legal_filing', '2026-06-09'),
  ('f0de1108-0002-4000-8000-000000000002', 'https://council.nyc.gov/press/2026/10/16/3301/', 'AI safety hearing — Kim’s account and SpaceXAI’s response', 'New York City Council', 'official_document', '2026-10-16'),
  ('f0de1108-0002-4000-8000-000000000003', 'https://www.amny.com/politics/menin-spacexai-grok-sexualized-image/', 'Council testimony — Kim describes subsequent safety-team departures', 'amNewYork', 'reporting', '2026-10-16')
) AS s(id, url, title, platform, source_type, published_date)
WHERE p.slug = 'devin-kim';
COMMIT;
