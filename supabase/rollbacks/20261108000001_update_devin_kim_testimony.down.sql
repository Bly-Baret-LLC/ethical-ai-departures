-- Restore only this batch's fields and sources. Refuse subsequent editorial drift.
-- Revert the matching company overview/corrections-log code separately if deployed.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles, public.profile_sources IN SHARE ROW EXCLUSIVE MODE;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE slug = 'devin-kim'
    AND name = 'Devin Kim' AND company = 'xAI' AND status = 'published'
    AND departure_type = 'fired' AND motive_evidence = 'alleged'
    AND NOT headline_counted AND claim_status = 'contested'
    AND departure_date = '2025-09-15' AND departure_date_precision = 'day'
    AND effective_departure_date IS NULL
    AND departure_date_note = 'Kim’s complaint dates his dismissal to September 15, 2025 (paragraph 66).'
    AND stated_reason = 'Kim alleges xAI fired him after he raised concerns about Grok’s discriminatory outputs and inadequate safeguards against weapons-related misuse.'
    AND departure_context = 'His June 2026 lawsuit dates his dismissal to September 15, 2025, the week he was due to present safety findings to leadership. In testimony before the New York City Council on October 16, 2026, Kim said most of the safety team resigned after his dismissal. He said he could not speak to the company’s current safety practices. SpaceXAI representative Gabriela Castillo Madrid told the Council she was unfamiliar with his case. His retaliation claim remains unresolved.'
    AND seo_description = 'Devin Kim alleges xAI fired him after he raised concerns about Grok safety. Read his lawsuit, October 2026 testimony and the company representative’s response.'
    AND correction_note = 'Reclassified to alleged on 2026-07-22: retaliation link is asserted by the individual and disputed or unresolved; attribution-first wording applied. November 8, 2026: Corrected the stored departure date from September 30 to September 15, 2025, as stated in paragraph 66 of Kim’s complaint. The retaliation allegation remains unresolved.'
    AND last_reviewed_at = '2026-11-08'
    AND reviewer = 'Complaint and Council testimony source review for local preview (2026-11-08)') THEN
    RAISE EXCEPTION 'Kim changed after update; review rollback manually';
  END IF;
  IF (SELECT count(*) FROM public.profile_sources s JOIN public.profiles p ON p.id = s.profile_id
    JOIN (VALUES
      ('f0de1108-0002-4000-8000-000000000001', 'https://sanfordheisler.com/wp-content/uploads/2026/06/2026-06-09-Complaint-Kim-v.-xAI-and-SpaceX.pdf', 'Kim v. xAI and SpaceX — complaint (paragraphs 66–71)', 'Sanford Heisler Sharp McKnight', 'legal_filing', '2026-06-09'),
      ('f0de1108-0002-4000-8000-000000000002', 'https://council.nyc.gov/press/2026/10/16/3301/', 'AI safety hearing — Kim’s account and SpaceXAI’s response', 'New York City Council', 'official_document', '2026-10-16'),
      ('f0de1108-0002-4000-8000-000000000003', 'https://www.amny.com/politics/menin-spacexai-grok-sexualized-image/', 'Council testimony — Kim describes subsequent safety-team departures', 'amNewYork', 'reporting', '2026-10-16')
    ) AS expected(id, url, title, platform, source_type, published_date)
    ON s.id = expected.id::uuid AND s.url = expected.url AND s.title = expected.title
      AND s.platform = expected.platform AND s.source_type = expected.source_type
      AND s.published_date = expected.published_date::date
    WHERE p.slug = 'devin-kim') <> 3 THEN
    RAISE EXCEPTION 'Kim added sources changed; review rollback manually';
  END IF;
END $$;
UPDATE public.profiles SET
  stated_reason = $old_reason$Early member of xAI's post-training team who led post-training and research infrastructure for the Grok models, and became an internal advocate for AI safety — warning that Grok lacked adequate safeguards against discrimination, weapons-related outputs, and political bias. According to his June 2026 wrongful-termination lawsuit, xAI fired him in September 2025, days before he was due to present his safety findings, with co-founder Jimmy Ba telling him they should "go their separate ways."$old_reason$,
  departure_context = $old_context$The account of his firing is drawn from Kim's lawsuit against xAI and SpaceX (California state court, June 2026); the allegations have not been tested in court, and xAI did not respond to requests for comment. In June 2026 Kim was named president of the Center for AI Safety.$old_context$,
  departure_date = '2025-09-30', departure_date_note = NULL, seo_description = NULL,
  correction_note = 'Reclassified to alleged on 2026-07-22: retaliation link is asserted by the individual and disputed or unresolved; attribution-first wording applied.',
  last_reviewed_at = '2026-07-22', reviewer = 'editorial remediation (brief 2026-07-22)'
WHERE slug = 'devin-kim';
DELETE FROM public.profile_sources WHERE id IN (
  'f0de1108-0002-4000-8000-000000000001', 'f0de1108-0002-4000-8000-000000000002', 'f0de1108-0002-4000-8000-000000000003');
COMMIT;
