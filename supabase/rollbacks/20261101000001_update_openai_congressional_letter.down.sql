-- Scoped rollback: removes only this batch's three source rows and appended text.
-- Rejects changes to affected fields/sources; retains unrelated later sources.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
LOCK TABLE public.profiles, public.profile_sources IN SHARE ROW EXCLUSIVE MODE;
DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id IS NOT DISTINCT FROM 'f0de1008-0003-4000-8000-000000000002'
    AND slug IS NOT DISTINCT FROM 'jasmine-wang'
    AND name IS NOT DISTINCT FROM 'Jasmine Wang'
    AND company IS NOT DISTINCT FROM 'OpenAI'
    AND role IS NOT DISTINCT FROM 'Safety cases program co-lead'
    AND status IS NOT DISTINCT FROM 'published'
    AND departure_type IS NOT DISTINCT FROM 'fired'
    AND motive_evidence IS NOT DISTINCT FROM 'alleged'
    AND headline_counted IS NOT DISTINCT FROM false
    AND claim_status IS NOT DISTINCT FROM 'contested'
    AND departure_date IS NOT DISTINCT FROM '2026-01-01'
    AND departure_date_precision IS NOT DISTINCT FROM 'year'
    AND departure_date_note IS NOT DISTINCT FROM 'The dismissals were publicly reported on October 1, 2026. The exact departure dates are not confirmed.'
    AND stated_reason IS NOT DISTINCT FROM 'Wang was fired from OpenAI. She challenged the reason given for her dismissal and warned that staff could be pushed out for raising concerns or working with outside safety groups.'
    AND seo_description IS NOT DISTINCT FROM 'Jasmine Wang disputes her dismissal from OpenAI. Read her account, the company response, and relevant safety research.'
    AND departure_context IS NOT DISTINCT FROM 'The letter says Wang’s access to an executive’s inbox was authorized for recruiting and remained active after she requested its removal. It says she promptly reported opening a sensitive email by mistake. OpenAI says the three mishandled sensitive information in breach of company procedures. OpenAI denies retaliation. In an October 29, 2026 letter, 20 House Democrats led by Rep. Greg Casar asked OpenAI to explain the three dismissals and commit to protecting whistleblowers. They requested a response by November 13.'
    AND last_reviewed_at IS NOT DISTINCT FROM '2026-11-01'
    AND reviewer IS NOT DISTINCT FROM 'Congressional letter source review for local preview (2026-11-01)') THEN RAISE EXCEPTION 'jasmine-wang: editorial baseline changed; review before proceeding'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id IS NOT DISTINCT FROM 'f0de1008-0003-4000-8000-000000000003'
    AND slug IS NOT DISTINCT FROM 'mikita-balesni'
    AND name IS NOT DISTINCT FROM 'Mikita Balesni'
    AND company IS NOT DISTINCT FROM 'OpenAI'
    AND role IS NOT DISTINCT FROM 'Alignment researcher'
    AND status IS NOT DISTINCT FROM 'published'
    AND departure_type IS NOT DISTINCT FROM 'fired'
    AND motive_evidence IS NOT DISTINCT FROM 'alleged'
    AND headline_counted IS NOT DISTINCT FROM false
    AND claim_status IS NOT DISTINCT FROM 'contested'
    AND departure_date IS NOT DISTINCT FROM '2026-01-01'
    AND departure_date_precision IS NOT DISTINCT FROM 'year'
    AND departure_date_note IS NOT DISTINCT FROM 'The dismissals were publicly reported on October 1, 2026. The exact departure dates are not confirmed.'
    AND stated_reason IS NOT DISTINCT FROM 'Balesni was fired from OpenAI. He says he and two safety colleagues were dismissed for putting AI safety ahead of the company’s short-term interests.'
    AND seo_description IS NOT DISTINCT FROM 'Mikita Balesni disputes his dismissal from OpenAI. Read his account, the company response, and relevant safety research.'
    AND departure_context IS NOT DISTINCT FROM 'Balesni worked on alignment evaluations and monitoring AI reasoning. The joint letter says he coordinated external safety work with senior leadership, checked with his managers, and removed sensitive details before sharing materials. OpenAI says the three mishandled sensitive information in breach of company procedures. OpenAI denies retaliation. In an October 23 NPR interview, Balesni said investigators asked to see Signal conversations on the researchers’ personal phones a week before their dismissals, and that they complied. In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals. In an October 29, 2026 letter, 20 House Democrats led by Rep. Greg Casar asked OpenAI to explain the three dismissals and commit to protecting whistleblowers. They requested a response by November 13.'
    AND last_reviewed_at IS NOT DISTINCT FROM '2026-11-01'
    AND reviewer IS NOT DISTINCT FROM 'Congressional letter source review for local preview (2026-11-01)') THEN RAISE EXCEPTION 'mikita-balesni: editorial baseline changed; review before proceeding'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id IS NOT DISTINCT FROM 'f0de1008-0003-4000-8000-000000000001'
    AND slug IS NOT DISTINCT FROM 'tomek-korbak'
    AND name IS NOT DISTINCT FROM 'Tomek Korbak'
    AND company IS NOT DISTINCT FROM 'OpenAI'
    AND role IS NOT DISTINCT FROM 'Safety researcher, chain-of-thought monitorability'
    AND status IS NOT DISTINCT FROM 'published'
    AND departure_type IS NOT DISTINCT FROM 'fired'
    AND motive_evidence IS NOT DISTINCT FROM 'alleged'
    AND headline_counted IS NOT DISTINCT FROM false
    AND claim_status IS NOT DISTINCT FROM 'contested'
    AND departure_date IS NOT DISTINCT FROM '2026-01-01'
    AND departure_date_precision IS NOT DISTINCT FROM 'year'
    AND departure_date_note IS NOT DISTINCT FROM 'The dismissals were publicly reported on October 1, 2026. The exact departure dates are not confirmed.'
    AND stated_reason IS NOT DISTINCT FROM 'Korbak was fired from OpenAI. He believes his warnings about losing the ability to monitor AI reasoning led to his dismissal. He says the company cited his communication with independent evaluator METR, which was part of his job.'
    AND seo_description IS NOT DISTINCT FROM 'Tomek Korbak disputes his dismissal from OpenAI. Read his account, the company response, and relevant safety research.'
    AND departure_context IS NOT DISTINCT FROM 'Korbak was OpenAI’s technical contact for METR’s Hugging Face investigation. In a joint letter with Jasmine Wang and Mikita Balesni, he defended that collaboration and warned that the dismissals could discourage independent safety work. OpenAI says the three mishandled sensitive information in breach of company procedures. OpenAI denies retaliation. In an October 23 NPR interview, Korbak described repeated visits by METR as the investigation expanded. He said OpenAI was broadly acting in good faith, but that the investigation was restricted. In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals. In an October 29, 2026 letter, 20 House Democrats led by Rep. Greg Casar asked OpenAI to explain the three dismissals and commit to protecting whistleblowers. They requested a response by November 13.'
    AND last_reviewed_at IS NOT DISTINCT FROM '2026-11-01'
    AND reviewer IS NOT DISTINCT FROM 'Congressional letter source review for local preview (2026-11-01)') THEN RAISE EXCEPTION 'tomek-korbak: editorial baseline changed; review before proceeding'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1101-0002-4000-8000-000000000001' AND profile_id IS NOT DISTINCT FROM 'f0de1008-0003-4000-8000-000000000002' AND url IS NOT DISTINCT FROM 'https://casar.house.gov/sites/evo-subsites/casar.house.gov/files/evo-media-document/openai-employee-firing_cyber-security-follow-up_0.pdf' AND title IS NOT DISTINCT FROM 'Congressional letter seeking answers about the OpenAI dismissals' AND platform IS NOT DISTINCT FROM 'U.S. House of Representatives' AND source_type IS NOT DISTINCT FROM 'official_document' AND published_date IS NOT DISTINCT FROM '2026-10-29') THEN RAISE EXCEPTION 'Added congressional source missing or changed'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1101-0002-4000-8000-000000000002' AND profile_id IS NOT DISTINCT FROM 'f0de1008-0003-4000-8000-000000000003' AND url IS NOT DISTINCT FROM 'https://casar.house.gov/sites/evo-subsites/casar.house.gov/files/evo-media-document/openai-employee-firing_cyber-security-follow-up_0.pdf' AND title IS NOT DISTINCT FROM 'Congressional letter seeking answers about the OpenAI dismissals' AND platform IS NOT DISTINCT FROM 'U.S. House of Representatives' AND source_type IS NOT DISTINCT FROM 'official_document' AND published_date IS NOT DISTINCT FROM '2026-10-29') THEN RAISE EXCEPTION 'Added congressional source missing or changed'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.profile_sources WHERE id IS NOT DISTINCT FROM 'f0de1101-0002-4000-8000-000000000003' AND profile_id IS NOT DISTINCT FROM 'f0de1008-0003-4000-8000-000000000001' AND url IS NOT DISTINCT FROM 'https://casar.house.gov/sites/evo-subsites/casar.house.gov/files/evo-media-document/openai-employee-firing_cyber-security-follow-up_0.pdf' AND title IS NOT DISTINCT FROM 'Congressional letter seeking answers about the OpenAI dismissals' AND platform IS NOT DISTINCT FROM 'U.S. House of Representatives' AND source_type IS NOT DISTINCT FROM 'official_document' AND published_date IS NOT DISTINCT FROM '2026-10-29') THEN RAISE EXCEPTION 'Added congressional source missing or changed'; END IF;
END $$;
UPDATE public.profiles SET departure_context='The letter says Wang’s access to an executive’s inbox was authorized for recruiting and remained active after she requested its removal. It says she promptly reported opening a sensitive email by mistake. OpenAI says the three mishandled sensitive information in breach of company procedures. OpenAI denies retaliation.', last_reviewed_at='2026-10-08', reviewer='OpenAI dismissal review (2026-10-08)' WHERE id='f0de1008-0003-4000-8000-000000000002';
UPDATE public.profiles SET departure_context='Balesni worked on alignment evaluations and monitoring AI reasoning. The joint letter says he coordinated external safety work with senior leadership, checked with his managers, and removed sensitive details before sharing materials. OpenAI says the three mishandled sensitive information in breach of company procedures. OpenAI denies retaliation. In an October 23 NPR interview, Balesni said investigators asked to see Signal conversations on the researchers’ personal phones a week before their dismissals, and that they complied. In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals.', last_reviewed_at='2026-10-26', reviewer='Greenblatt response review (2026-10-26)' WHERE id='f0de1008-0003-4000-8000-000000000003';
UPDATE public.profiles SET departure_context='Korbak was OpenAI’s technical contact for METR’s Hugging Face investigation. In a joint letter with Jasmine Wang and Mikita Balesni, he defended that collaboration and warned that the dismissals could discourage independent safety work. OpenAI says the three mishandled sensitive information in breach of company procedures. OpenAI denies retaliation. In an October 23 NPR interview, Korbak described repeated visits by METR as the investigation expanded. He said OpenAI was broadly acting in good faith, but that the investigation was restricted. In an October 23 response, external researcher Ryan Greenblatt denied facilitating architecture leaks or receiving proprietary information from the three dismissed researchers. The San Francisco Standard reported that OpenAI said unapproved Signal use was not the only reason for the dismissals.', last_reviewed_at='2026-10-26', reviewer='Greenblatt response review (2026-10-26)' WHERE id='f0de1008-0003-4000-8000-000000000001';
DELETE FROM public.profile_sources WHERE id IN ('f0de1101-0002-4000-8000-000000000001','f0de1101-0002-4000-8000-000000000002','f0de1101-0002-4000-8000-000000000003');
COMMIT;
