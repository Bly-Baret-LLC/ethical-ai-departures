-- Add David Robinson after his first-party resignation essay explicitly
-- connected leaving OpenAI to concerns about its safety culture and launch pace.

BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE slug = 'david-robinson') THEN
    RAISE EXCEPTION 'Profile david-robinson already exists';
  END IF;
END $$;

INSERT INTO profiles (
  slug, name, photo_url, company, role, departure_date,
  departure_date_precision, effective_departure_date, departure_date_note,
  seo_description, stated_reason, departure_context, status, departure_type,
  motive_evidence, headline_counted, motive_quote, claim_status,
  last_reviewed_at, reviewer
)
VALUES (
  'david-robinson',
  'David Robinson',
  NULL,
  'OpenAI',
  'Safety Transparency Lead, Safety Systems',
  '2026-09-01',
  'month',
  NULL,
  'OpenAI confirmed that Robinson left in the week before October 3, 2026. Robinson described the timing as “this week” in an essay published October 3. This establishes a late-September or early-October departure, but the exact day is not publicly documented; September follows the company-confirmed reporting.',
  'David Robinson resigned from OpenAI in 2026, warning that its launch-driven culture and trial-and-error safety approach were inadequate for increasingly capable AI systems.',
  'Safety-transparency leader who resigned from OpenAI in late September 2026. Robinson said the company''s sprint from one launch to the next prevented it from achieving the care needed for increasingly capable systems. He argued that OpenAI''s trial-and-error approach guarantees periodic failures, called for safety practices modeled on nuclear power and aviation, and said he could strengthen incentives for safety more effectively from outside the company.',
  'Robinson spent three and a half years at OpenAI, first in public policy and later in Safety Systems. He led the drafting of the current Preparedness Framework and oversaw safety reports for 12 frontier launches. He said he valued his colleagues and believed AI could be useful, but concluded that the company''s culture, pace, and reliance on iterative deployment were inadequate for systems that might become more capable than humans. OpenAI said it was strengthening security, third-party evaluation, and real-time monitoring, and would pause training or hold back models when necessary.',
  'published',
  'resigned',
  'direct',
  true,
  'As the company sprints from one launch to the next, it is failing to achieve the level of care that I believe is needed.',
  'uncontested',
  '2026-10-03',
  'editorial review (2026-10-03)'
);

INSERT INTO profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, v.url, v.title, v.platform, v.source_type, v.published_date::date
FROM profiles p
JOIN (VALUES
  (
    'david-robinson',
    'https://www.theatlantic.com/technology/2026/10/openai-safety-team-resignation/688881/',
    'I Quit OpenAI Because Its Culture Is Broken',
    'The Atlantic',
    'first_party',
    '2026-10-03'
  ),
  (
    'david-robinson',
    'https://www.businessinsider.com/safety-leader-david-robinson-resigns-from-openai-2026-10',
    'OpenAI safety leader David Robinson resigns as the team''s upheaval mounts',
    'Business Insider',
    'reporting',
    '2026-10-02'
  ),
  (
    'david-robinson',
    'https://techcrunch.com/2026/10/03/openai-safety-employee-resigns-claiming-the-companys-culture-is-broken/',
    'OpenAI safety employee resigns, claiming the company''s “culture is broken”',
    'TechCrunch',
    'reporting',
    '2026-10-03'
  ),
  (
    'david-robinson',
    'https://www.theguardian.com/technology/2026/oct/03/openai-safety-leader-quits-warning-ai-companys-culture-is-broken',
    'OpenAI safety leader quits, warning AI company''s culture is “broken”',
    'The Guardian',
    'reporting',
    '2026-10-03'
  ),
  (
    'david-robinson',
    'https://www.linkedin.com/in/dgrobinson',
    'David Robinson — LinkedIn profile',
    'LinkedIn',
    'first_party',
    NULL
  )
) AS v(slug, url, title, platform, source_type, published_date)
  ON p.slug = v.slug;

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p
JOIN concern_tags ct ON ct.slug IN (
  'safety-deprioritization', 'rushed-deployment',
  'inadequate-oversight', 'alignment-research-gaps'
)
WHERE p.slug = 'david-robinson'
ON CONFLICT DO NOTHING;

INSERT INTO publications (
  profile_id, title, url, publication_type, publisher, published_date,
  published_date_precision, last_updated_at, abstract
)
SELECT p.id, v.title, v.url, v.publication_type, v.publisher,
  v.published_date::date, v.published_date_precision, v.last_updated_at::date,
  v.abstract
FROM profiles p
JOIN (VALUES
  (
    'david-robinson',
    'I Quit OpenAI Because Its Culture Is Broken',
    'https://www.theatlantic.com/technology/2026/10/openai-safety-team-resignation/688881/',
    'resignation_letter',
    'The Atlantic',
    '2026-10-03',
    'day',
    NULL,
    'Robinson explains why he resigned from OpenAI. He argues that the company''s launch-driven culture and reliance on iterative deployment cannot provide the care required for increasingly capable systems, and calls for operational safety practices drawn from aviation and nuclear power as well as new alignment science.'
  ),
  (
    'david-robinson',
    'Our updated Preparedness Framework',
    'https://openai.com/index/updating-our-preparedness-framework/',
    'report',
    'OpenAI',
    '2025-04-15',
    'day',
    NULL,
    'OpenAI''s framework for tracking frontier capabilities that could create severe harm, defining capability thresholds, safeguards, evaluations, governance, and disclosure commitments. Robinson said he served as lead drafter for this version.'
  ),
  (
    'david-robinson',
    'OpenAI o1 System Card',
    'https://arxiv.org/abs/2412.16720',
    'report',
    'OpenAI',
    '2024-12-21',
    'day',
    '2026-04-30',
    'A safety assessment of OpenAI o1 covering model behavior, evaluations, external testing, and Preparedness Framework risk categories. Robinson is listed among the authors.'
  )
) AS v(slug, title, url, publication_type, publisher, published_date, published_date_precision, last_updated_at, abstract)
  ON p.slug = v.slug;

INSERT INTO predictions (
  profile_id, title, description, source_quote, resolution_criteria, status,
  predicted_date, reviewed_by, review_notes, record_kind, under_review,
  event_date, is_verbatim_quote, source_url
)
SELECT
  p.id,
  'Trial-and-error deployment will produce larger safety failures',
  'Robinson warned that failures are inherent to iterative deployment and will grow in scale as AI systems become more capable. The statement is recorded as a warning rather than a scored forecast because it does not define a time horizon or measurable threshold for failure scale.',
  'But this approach, by its very nature, guarantees periodic failures—and the scale of those failures is growing as systems get more capable.',
  'Not scored: the statement gives no time horizon and does not define an objective threshold for the frequency or scale of failures.',
  'not_applicable',
  '2026-10-03',
  'editorial review (2026-10-03)',
  'Added as a warning because it is forward-looking and specific in direction, but lacks the date and measurable outcome needed for resolution.',
  'warning',
  false,
  '2026-10-03',
  true,
  'https://www.theatlantic.com/technology/2026/10/openai-safety-team-resignation/688881/'
FROM profiles p
WHERE p.slug = 'david-robinson';

UPDATE ticker_stats
SET total_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND headline_counted = true
        AND motive_evidence IN ('direct', 'reported')
    ),
    ninety_day_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND headline_counted = true
        AND motive_evidence IN ('direct', 'reported')
        AND departure_date >= current_date - interval '90 days'
    ),
    updated_at = now();

COMMIT;
