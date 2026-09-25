-- Add Bilal Chughtai after his first-party statement explicitly connected
-- his Google DeepMind resignation to catastrophic AI risk and alignment concerns.

BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE slug = 'bilal-chughtai') THEN
    RAISE EXCEPTION 'Profile bilal-chughtai already exists';
  END IF;
END $$;

INSERT INTO concern_tags (id, name, slug, description)
VALUES (
  'a0000000-0000-4000-8000-000000000014',
  'Competitive Race Dynamics',
  'competitive-race-dynamics',
  'Competition between frontier AI companies accelerates capability development faster than safety work or societal preparation.'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO profiles (
  slug, name, photo_url, company, role, departure_date,
  departure_date_precision, effective_departure_date, departure_date_note,
  seo_description, stated_reason, departure_context, status, departure_type,
  motive_evidence, headline_counted, motive_quote, claim_status,
  last_reviewed_at, reviewer
)
VALUES (
  'bilal-chughtai',
  'Bilal Chughtai',
  NULL,
  'Google',
  'Research Engineer, Language Model Interpretability (Google DeepMind)',
  '2026-08-31',
  'day',
  NULL,
  'Chughtai says he was on gardening leave from July 16 through August 31, 2026, before he could begin work elsewhere. His exact resignation date is not publicly documented; August 31 is used here as the end of his Google DeepMind employment. He published his safety rationale on September 14, 2026.',
  'Bilal Chughtai resigned from Google DeepMind in 2026, warning that AI capabilities were advancing faster than alignment research and could cause catastrophic harm.',
  'Research engineer on Google DeepMind''s language-model interpretability team who resigned in 2026. In his September statement, Chughtai said he was “extremely concerned” by the default trajectory of AI. He warned that capabilities were advancing faster than alignment research, that misaligned superintelligence could permanently disempower or kill humanity, and that AI companies needed to coordinate, slow the pace of development, and disclose more about the risks they impose.',
  'Chughtai joined Google DeepMind in February 2025 to work on mechanistic interpretability within its broader AGI safety and alignment team. His public research there examined whether models can conceal deceptive reasoning, how well monitors can detect strategic deception, and how to audit the transparency of new model architectures. He framed his departure around competition between frontier laboratories and the gap between capabilities and alignment. He subsequently became a program lead at BlueDot Impact, working on AI-safety training.',
  'published',
  'resigned',
  'direct',
  true,
  'I earnestly believe that AI has the potential to kill us all, and that we might be running out of time to avoid this outcome.',
  'uncontested',
  '2026-09-14',
  'editorial review (2026-09-14)'
);

INSERT INTO profile_sources (
  profile_id, url, title, platform, source_type, published_date
)
SELECT p.id, v.url, v.title, v.platform, v.source_type, v.published_date::date
FROM profiles p
JOIN (VALUES
  (
    'bilal-chughtai',
    'https://bilalchughtai.co.uk/leaving-gdm/',
    'Statement on leaving Google DeepMind',
    'Bilal Chughtai',
    'first_party',
    '2026-09-14'
  ),
  (
    'bilal-chughtai',
    'https://x.com/bilalchughtai_/status/2099592489023734085',
    'Statement on resigning from Google DeepMind and catastrophic AI risk',
    'X',
    'first_party',
    '2026-09-14'
  ),
  (
    'bilal-chughtai',
    'https://bilalchughtai.co.uk/gardening/',
    'Things I got up to on my gardening leave',
    'Bilal Chughtai',
    'first_party',
    '2026-08-31'
  ),
  (
    'bilal-chughtai',
    'https://bilalchughtai.co.uk/gdm/',
    'Joining Google DeepMind',
    'Bilal Chughtai',
    'first_party',
    '2025-02-17'
  ),
  (
    'bilal-chughtai',
    'https://deepmind.google/blog/securing-the-future-of-ai-agents/',
    'Securing the future of AI agents',
    'Google DeepMind',
    'organization',
    '2026-06-18'
  )
) AS v(slug, url, title, platform, source_type, published_date)
  ON p.slug = v.slug;

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p
JOIN concern_tags ct ON ct.slug IN (
  'competitive-race-dynamics', 'alignment-research-gaps', 'lack-of-transparency'
)
WHERE p.slug = 'bilal-chughtai'
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
    'bilal-chughtai',
    'Statement on leaving Google DeepMind',
    'https://bilalchughtai.co.uk/leaving-gdm/',
    'resignation_letter',
    'Self-published',
    '2026-09-14',
    'day',
    NULL,
    'Chughtai explains that he resigned after working on AGI safety and alignment at Google DeepMind. He warns that AI capabilities are advancing faster than alignment research, that misaligned superintelligent systems could permanently disempower or kill humanity, and that competitive pressure is pushing companies to move faster than society can safely absorb. He calls for coordination, slower development, greater transparency, and more people working to reduce catastrophic AI risk.'
  ),
  (
    'bilal-chughtai',
    'How Transparent is DiffusionGemma?',
    'https://arxiv.org/abs/2606.20560',
    'preprint',
    'arXiv',
    '2026-06-18',
    'day',
    '2026-08-17',
    'Chughtai and his co-authors audit the reasoning transparency of DiffusionGemma, a text-diffusion model whose intermediate computation happens largely in a continuous latent space. They find that its intermediate variables can be made nearly as interpretable as those of a comparable autoregressive model, while reconstructing the model''s full reasoning process remains harder. The authors argue that transparency audits will be important for future architectures because chain-of-thought monitoring is a significant part of current AI-safety cases.'
  ),
  (
    'bilal-chughtai',
    'Training on Documents About Monitoring Leads to CoT Obfuscation',
    'https://arxiv.org/abs/2605.15257',
    'preprint',
    'arXiv',
    '2026-05-14',
    'day',
    NULL,
    'Chughtai and his co-authors test whether models that know their chain of thought is being watched learn to conceal deceptive reasoning. Across eight models, monitor-aware variants produced more undetected misbehavior, and under reinforcement-learning pressure they learned to reward-hack without detection faster than controls. The authors present this as evidence that knowledge of monitoring, combined with the ability to reshape reasoning traces, can weaken chain-of-thought oversight.'
  ),
  (
    'bilal-chughtai',
    'Detecting Strategic Deception Using Linear Probes',
    'https://arxiv.org/abs/2502.03407',
    'preprint',
    'arXiv',
    '2025-02-05',
    'day',
    NULL,
    'Chughtai and his co-authors evaluate whether simple probes trained on model activations can detect strategically deceptive behavior. The probes perform strongly on their test settings and catch most deceptive responses at a low false-positive threshold, but the authors conclude that the remaining errors make them insufficient as a robust defense. The work addresses a central monitoring problem: harmful intent may not be visible in a model''s outputs even when it is represented internally.'
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
  'Frontier AI companies could build superintelligent systems within the next few years',
  'Chughtai framed this as a possibility rather than a probability estimate or firm prediction. It is recorded as a warning and excluded from accuracy scoring.',
  'I think it''s possible that the AI companies might, in the next few years, succeed in building superintelligent AI systems that far exceed human capabilities in every domain.',
  'Not scored: the statement gives neither a calibrated probability nor a sufficiently precise definition of superintelligence for binary adjudication.',
  'not_applicable',
  '2026-09-14',
  'editorial review (2026-09-14)',
  'Added as a warning because the statement is forward-looking but deliberately framed as a possibility, not a calibrated or binary forecast.',
  'warning',
  false,
  '2026-09-14',
  true,
  'https://bilalchughtai.co.uk/leaving-gdm/'
FROM profiles p
WHERE p.slug = 'bilal-chughtai';

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
