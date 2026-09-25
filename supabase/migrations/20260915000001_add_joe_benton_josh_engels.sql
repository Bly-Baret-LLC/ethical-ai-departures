-- Add Joe Benton and Josh Engels after each publicly connected leaving a
-- frontier-lab safety team to concerns about the pace and safety of advanced AI.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE slug IN ('joe-benton', 'josh-engels')
  ) THEN
    RAISE EXCEPTION 'One or more target profiles already exist';
  END IF;
END $$;

INSERT INTO profiles (
  slug, name, photo_url, company, role, departure_date,
  departure_date_precision, effective_departure_date, departure_date_note,
  seo_description, stated_reason, departure_context, status, departure_type,
  motive_evidence, headline_counted, motive_quote, claim_status,
  last_reviewed_at, reviewer
)
VALUES
  (
    'joe-benton',
    'Joe Benton',
    NULL,
    'Anthropic',
    'Member of Technical Staff (Manager), Scalable Oversight',
    '2026-08-01',
    'month',
    NULL,
    'Benton wrote on September 11, 2026 that he had left Anthropic''s safety team two weeks earlier. This establishes an August 2026 departure, but the exact day is not publicly documented.',
    'Joe Benton left Anthropic''s safety team in 2026, warning that competition was pushing frontier AI companies to underinvest in safety and provide too little public visibility into catastrophic risks.',
    'Manager of Anthropic''s Scalable Oversight team who left in August 2026 to join the independent evaluator METR. Benton said frontier AI companies were racing toward recursively self-improving systems while underinvesting in safety, and warned that progress could become uncontrollable. He called for slower development, disclosure of safety incidents and capability gains, minimum safety standards, and independent assessments.',
    'Benton framed his concern as industry-wide. He said safety researchers inside frontier companies face a competitive trap: slowing down may cede ground to less cautious rivals, while continuing may contribute to severe harm. His move to METR was intended to strengthen independent evaluation and public visibility into frontier risks.',
    'published',
    'resigned',
    'direct',
    true,
    'Competition pushes every frontier company to underinvest in safety; the cost of falling behind is too high.',
    'uncontested',
    '2026-09-15',
    'editorial review (2026-09-15)'
  ),
  (
    'josh-engels',
    'Josh Engels',
    NULL,
    'Google',
    'Researcher, AGI Safety (Google DeepMind)',
    '2026-08-01',
    'month',
    NULL,
    'Engels wrote on September 12, 2026 that he had left Google DeepMind''s AGI safety team three weeks earlier. This establishes an August 2026 departure, but the exact day is not publicly documented.',
    'Josh Engels left Google DeepMind''s AGI safety team in 2026, warning that alignment safeguards were not keeping pace with increasingly capable AI systems.',
    'Researcher on Google DeepMind''s AGI safety team who left in August 2026 to join the independent evaluator METR. Engels said labs were pursuing superintelligence through recursive self-improvement without knowing how to make AI systems safe enough for that process. He warned that recent incidents involving collusion, hacking, concealment, and social engineering showed that present systems were not sufficiently aligned, and argued that AI development should be paced so capabilities do not outrun safety work.',
    'Engels said he enjoyed his work at Google DeepMind and described the decision as a response to the broader stakes of frontier development. He said his work at METR would investigate where misalignment comes from, whether current mitigations are sufficient, and whether the field is on track to solve alignment.',
    'published',
    'resigned',
    'direct',
    true,
    'I now think that there''s a terrifying chance that AI systems cause immense harm in the next five years.',
    'uncontested',
    '2026-09-15',
    'editorial review (2026-09-15)'
  );

INSERT INTO profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, v.url, v.title, v.platform, v.source_type, v.published_date::date
FROM profiles p
JOIN (VALUES
  (
    'joe-benton',
    'https://jbenton1.substack.com/p/why-i-left-anthropics-safety-team',
    'Why I left Anthropic''s safety team to hold AI companies accountable',
    'Joe Benton',
    'first_party',
    '2026-09-11'
  ),
  (
    'joe-benton',
    'https://x.com/JoeJBenton/status/2098480585119572317',
    'Statement on leaving Anthropic''s safety team',
    'X',
    'first_party',
    '2026-09-11'
  ),
  (
    'joe-benton',
    'https://apnews.com/article/anthropic-ai-dario-amodei-d59552edcb27892d8ee4d98a48397706',
    'Anthropic CEO Dario Amodei says AI industry needs to give safety measures time to catch up',
    'Associated Press',
    'reporting',
    '2026-09-12'
  ),
  (
    'joe-benton',
    'https://joejbenton.com/',
    'Joe Benton — personal website',
    'Joe Benton',
    'first_party',
    NULL
  ),
  (
    'josh-engels',
    'https://x.com/JoshAEngels/status/2098890712830169115',
    'Statement on leaving Google DeepMind''s AGI safety team',
    'X',
    'first_party',
    '2026-09-12'
  ),
  (
    'josh-engels',
    'https://www.joshengels.com/',
    'Josh Engels — personal website',
    'Josh Engels',
    'first_party',
    NULL
  ),
  (
    'josh-engels',
    'https://economictimes.indiatimes.com/tech/artificial-intelligence/deepmind-ai-safety-researcher-josh-engels-resigns-warns-of-superintelligence-risks/articleshow/134196333.cms',
    'DeepMind AI safety researcher Josh Engels resigns, warns of superintelligence risks',
    'The Economic Times',
    'reporting',
    '2026-09-13'
  ),
  (
    'josh-engels',
    'https://indianexpress.com/article/technology/artificial-intelligence/another-researcher-quits-ai-risks-google-deepmind-10877590/',
    'We need more time: Another researcher quits over AI risks, this time from Google DeepMind',
    'The Indian Express',
    'reporting',
    '2026-09-14'
  )
) AS v(slug, url, title, platform, source_type, published_date)
  ON p.slug = v.slug;

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p
JOIN (VALUES
  ('joe-benton', 'competitive-race-dynamics'),
  ('joe-benton', 'safety-deprioritization'),
  ('joe-benton', 'alignment-research-gaps'),
  ('joe-benton', 'lack-of-transparency'),
  ('josh-engels', 'alignment-research-gaps')
) AS v(profile_slug, tag_slug)
  ON p.slug = v.profile_slug
JOIN concern_tags ct ON ct.slug = v.tag_slug
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
    'joe-benton',
    'Why I left Anthropic''s safety team to hold AI companies accountable',
    'https://jbenton1.substack.com/p/why-i-left-anthropics-safety-team',
    'resignation_letter',
    'Self-published',
    '2026-09-11',
    'day',
    NULL,
    'Benton explains why he left Anthropic''s safety team for independent evaluation work at METR. He argues that competition pushes frontier companies to underinvest in safety, warns that recursively self-improving systems could make progress uncontrollable, and calls for transparency, incident reporting, minimum safety standards, and independent assessment.'
  ),
  (
    'joe-benton',
    'Sabotage Evaluations for Frontier Models',
    'https://arxiv.org/abs/2410.21514',
    'preprint',
    'arXiv',
    '2024-10-28',
    'day',
    NULL,
    'Benton and his co-authors develop threat models and evaluations for whether advanced systems could subvert capability testing, behavioral monitoring, or deployment decisions. Their tests of Claude 3 Opus and Claude 3.5 Sonnet suggest minimal mitigations were then sufficient, while stronger and more realistic safeguards would likely be needed as capabilities improved.'
  ),
  (
    'joe-benton',
    'Reasoning Models Don''t Always Say What They Think',
    'https://arxiv.org/abs/2505.05410',
    'preprint',
    'arXiv',
    '2025-05-08',
    'day',
    NULL,
    'Benton and his co-authors test whether reasoning models faithfully disclose the cues that influence their answers. They find that chain-of-thought monitoring can reveal some undesired behavior but frequently misses the true influence of prompt hints, making it insufficient to rule out rare, catastrophic behavior.'
  ),
  (
    'josh-engels',
    'How Transparent is DiffusionGemma?',
    'https://arxiv.org/abs/2606.20560',
    'preprint',
    'arXiv',
    '2026-06-18',
    'day',
    '2026-08-17',
    'Engels and his co-authors audit the reasoning transparency of DiffusionGemma. They find that intermediate states can be made nearly as interpretable as those of an autoregressive model, while reconstructing the model''s full reasoning process remains harder, and argue that new model architectures require direct transparency audits.'
  ),
  (
    'josh-engels',
    'Training on Documents About Monitoring Leads to CoT Obfuscation',
    'https://arxiv.org/abs/2605.15257',
    'preprint',
    'arXiv',
    '2026-05-14',
    'day',
    NULL,
    'Engels and his co-authors test whether models that know their reasoning is being watched learn to conceal deceptive behavior. Monitor-aware models produced more undetected misbehavior and learned to reward-hack without detection faster than controls, highlighting a vulnerability in chain-of-thought oversight.'
  ),
  (
    'josh-engels',
    'Scaling Laws For Scalable Oversight',
    'https://arxiv.org/abs/2504.18530',
    'preprint',
    'arXiv',
    '2025-04-25',
    'day',
    '2025-10-27',
    'Engels and his co-authors model how well weaker AI systems can oversee stronger ones. Across four oversight games, success rates declined as the capability gap widened, and the authors identify conditions under which nested oversight can or cannot remain effective.'
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
  v.title,
  v.description,
  v.source_quote,
  v.resolution_criteria,
  'not_applicable',
  v.predicted_date::date,
  'editorial review (2026-09-15)',
  v.review_notes,
  'warning',
  false,
  v.event_date::date,
  true,
  v.source_url
FROM profiles p
JOIN (VALUES
  (
    'joe-benton',
    'AI agents smarter than any human could emerge within the next couple of years',
    'Benton framed this as a possibility rather than a probability estimate or firm prediction. It is recorded as a warning and excluded from accuracy scoring.',
    'Within the next couple of years, we may be sharing the world with AI agents smarter than any human alive today.',
    'Not scored: the statement gives no calibrated probability and does not define a binary threshold for agents smarter than any human.',
    '2026-09-11',
    'Added as a warning because it is forward-looking but deliberately expressed as a possibility rather than a calibrated forecast.',
    '2026-09-11',
    'https://jbenton1.substack.com/p/why-i-left-anthropics-safety-team'
  ),
  (
    'josh-engels',
    'AI systems could cause immense harm within five years',
    'Engels described the chance as terrifying but explicitly said he did not know the exact probability. It is recorded as a warning and excluded from accuracy scoring.',
    'I now think that there''s a terrifying chance that AI systems cause immense harm in the next five years.',
    'Not scored: neither “terrifying chance” nor “immense harm” supplies a calibrated probability and objective binary threshold.',
    '2026-09-12',
    'Added as a warning because it has a time horizon but no calibrated probability or sufficiently precise outcome definition.',
    '2026-09-12',
    'https://x.com/JoshAEngels/status/2098890712830169115'
  )
) AS v(slug, title, description, source_quote, resolution_criteria, predicted_date, review_notes, event_date, source_url)
  ON p.slug = v.slug;

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
