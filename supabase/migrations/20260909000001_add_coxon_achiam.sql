-- Add Jacob Coxon and Joshua Achiam with the evidence distinctions used by
-- the public tracker. Coxon's first-party statement directly links his
-- resignation to AI-safety concerns. Achiam explicitly said there was no
-- specific reason for his departure, so his record is contextual only.

INSERT INTO profiles (
  slug, name, company, role, departure_date, departure_date_precision,
  effective_departure_date, departure_date_note, seo_description, stated_reason,
  departure_context, status, departure_type, motive_evidence,
  headline_counted, motive_quote, claim_status, last_reviewed_at, reviewer
)
VALUES
  (
    'jacob-coxon',
    'Jacob Coxon',
    'Anthropic',
    'Researcher (Pre-training)',
    '2026-09-08',
    'day',
    NULL,
    'Coxon announced his resignation on September 8, 2026. Some embeds display September 9 because the post was published after midnight UTC.',
    'Jacob Coxon resigned from Anthropic in 2026, warning that leading AI labs were racing toward self-improving systems without adequate safeguards.',
    'Researcher focused on pre-training who resigned from Anthropic after working on frontier-model development at both OpenAI and Anthropic. Coxon said neither company was acting responsibly and argued that the race toward self-improving superintelligence was proceeding without adequate guarantees that increasingly capable systems could be controlled. He called the race a gamble with human lives and urged laboratory researchers to demand stronger coordination, potentially including a temporary pause in further capability improvements.',
    'Before joining Anthropic, Coxon worked at OpenAI, where he contributed to GPT-4o and co-authored research on making neural-network computations easier to interpret. In his September 8 resignation statement and an interview with The Wall Street Journal, he distinguished between the two laboratories: he said many people at OpenAI had not fully internalized the stakes, while Anthropic understood them but remained constrained by competition. He described Anthropic''s safety work as sincere, but argued that competitive pressure still produced unacceptable trade-offs. Anthropic had not publicly responded to his claims when this record was reviewed.',
    'published',
    'resigned',
    'direct',
    true,
    'Neither company is acting responsibly. They are racing straight to self-improving superintelligence and gambling with our lives.',
    'uncontested',
    '2026-09-09',
    'editorial review (2026-09-09)'
  ),
  (
    'joshua-achiam',
    'Joshua Achiam',
    'OpenAI',
    'Chief Futurist; former Head of Mission Alignment',
    '2026-07-07',
    'day',
    '2026-07-24',
    'Achiam announced his departure on July 7, 2026, and identified July 24, 2026, as his last day.',
    'Joshua Achiam left OpenAI in July 2026 after nearly nine years, explicitly saying there was no specific reason for his departure.',
    'OpenAI''s chief futurist and former head of Mission Alignment who left after nearly nine years at the company. In his public departure note, Achiam said there was no specific reason for leaving and that it felt possible to continue working on OpenAI''s mission from outside a frontier laboratory. His departure is included as context because his recent roles centered on OpenAI''s mission, AI safety, and the societal effects of advanced AI; he did not describe the exit as a protest or criticize the company.',
    'Achiam joined OpenAI as an intern in 2017 and went on to work in AI-safety research and operations. He led the Mission Alignment team from 2024 until OpenAI disbanded it in February 2026, when he became chief futurist. That role focused on how AI and AGI could affect society and on helping policymakers and other institutions prepare. Achiam''s July 7 announcement was warm and optimistic, and he said he intended to keep working with former colleagues toward the company''s mission. This record documents the departure of a long-serving mission and safety figure during repeated organizational changes; it does not assert that those changes caused him to leave.',
    'published',
    'resigned',
    'contextual',
    false,
    NULL,
    'uncontested',
    '2026-09-09',
    'editorial review (2026-09-09)'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  role = EXCLUDED.role,
  departure_date = EXCLUDED.departure_date,
  departure_date_precision = EXCLUDED.departure_date_precision,
  effective_departure_date = EXCLUDED.effective_departure_date,
  departure_date_note = EXCLUDED.departure_date_note,
  seo_description = EXCLUDED.seo_description,
  stated_reason = EXCLUDED.stated_reason,
  departure_context = EXCLUDED.departure_context,
  status = EXCLUDED.status,
  departure_type = EXCLUDED.departure_type,
  motive_evidence = EXCLUDED.motive_evidence,
  headline_counted = EXCLUDED.headline_counted,
  motive_quote = EXCLUDED.motive_quote,
  claim_status = EXCLUDED.claim_status,
  last_reviewed_at = EXCLUDED.last_reviewed_at,
  reviewer = EXCLUDED.reviewer;

INSERT INTO profile_sources (profile_id, url, title, platform, source_type, published_date)
SELECT p.id, v.url, v.title, v.platform, v.source_type, v.published_date::date
FROM profiles p
JOIN (VALUES
  (
    'jacob-coxon',
    'https://x.com/hilbertspaess/status/2097476196791709843',
    'Resignation statement on Anthropic and the race toward self-improving superintelligence',
    'X',
    'first_party',
    '2026-09-08'
  ),
  (
    'jacob-coxon',
    'https://www.wsj.com/tech/ai/anthropic-researcher-quits-over-out-of-control-ai-fears-707b7628',
    'Anthropic Researcher Quits Over ‘Out-of-Control’ AI Fears',
    'The Wall Street Journal',
    'reporting',
    '2026-09-08'
  ),
  (
    'jacob-coxon',
    'https://techcrunch.com/2026/09/09/gambling-with-our-lives-anthropic-researcher-quits-warns-against-self-improving-ai/',
    '‘Gambling with our lives’: Anthropic researcher quits, warns against self-improving AI',
    'TechCrunch',
    'reporting',
    '2026-09-09'
  ),
  (
    'jacob-coxon',
    'https://apnews.com/article/anthropic-ai-safety-jacob-coxon-2ed549e07f2f941600a135070487d83d',
    'Anthropic researcher resigns with warning about the dangers of AI development',
    'Associated Press',
    'reporting',
    '2026-09-09'
  ),
  (
    'jacob-coxon',
    'https://cdn.openai.com/gpt-4o-system-card.pdf',
    'GPT-4o System Card',
    'OpenAI',
    'official_document',
    '2024-08-08'
  ),
  (
    'joshua-achiam',
    'https://www.linkedin.com/feed/update/urn:li:activity:7480394740824289280/',
    'Departure announcement',
    'LinkedIn',
    'first_party',
    '2026-07-07'
  ),
  (
    'joshua-achiam',
    'https://www.wired.com/story/openai-chief-futurist-joshua-achiam-is-leaving-the-company/',
    'OpenAI’s Chief Futurist Is Leaving the Company',
    'WIRED',
    'reporting',
    '2026-07-07'
  ),
  (
    'joshua-achiam',
    'https://openaiglobalaffairs.substack.com/p/introducing-our-chief-futurist',
    'Introducing Our Chief Futurist',
    'OpenAI Global Affairs',
    'organization',
    '2026-02-11'
  ),
  (
    'joshua-achiam',
    'https://techcrunch.com/2026/02/11/openai-disbands-mission-alignment-team-which-focused-on-safe-and-trustworthy-ai-development/',
    'OpenAI disbands mission alignment team',
    'TechCrunch',
    'reporting',
    '2026-02-11'
  )
) AS v(slug, url, title, platform, source_type, published_date)
  ON p.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1 FROM profile_sources ps
  WHERE ps.profile_id = p.id AND ps.url = v.url
);

INSERT INTO profile_concern_tags (profile_id, concern_tag_id)
SELECT p.id, ct.id
FROM profiles p
JOIN (VALUES
  ('jacob-coxon', 'safety-deprioritization'),
  ('jacob-coxon', 'inadequate-oversight'),
  ('joshua-achiam', 'team-dissolution')
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
    'jacob-coxon',
    'Understanding neural networks through sparse circuits',
    'https://openai.com/index/understanding-neural-networks-through-sparse-circuits/',
    'paper',
    'OpenAI',
    '2025-11-13',
    'day',
    NULL,
    'Coxon and his co-authors investigate whether neural networks can be trained so that their internal computations are easier for people to understand. Instead of beginning with a dense model and trying to untangle it afterward, they constrain most of the model''s weights to zero and examine the smaller circuits that remain. On several controlled tasks, the researchers isolate compact groups of neurons and connections that are both necessary and sufficient for the model''s behavior. The work offers an early approach to mechanistic interpretability: building systems whose operations may be more traceable, auditable, and useful for detecting unsafe or strategically misaligned behavior. The authors caution that the experiments use models much smaller than frontier systems and do not establish that the method will scale.'
  ),
  (
    'joshua-achiam',
    'AI and International Security: Pathways of Impact and Key Uncertainties',
    'https://cdn.openai.com/pdf/international-security.pdf',
    'report',
    'OpenAI',
    '2026-02-06',
    'day',
    NULL,
    'Achiam and his co-authors examine how advanced AI could alter international security through changes in deterrence, national power, scientific progress, and governments'' ability to understand a rapidly changing strategic environment. Drawing on interviews with national-security leaders, the report emphasizes that uncertainty about future AI capabilities is itself a source of risk: governments may face compressed decision timelines, destabilizing shifts in military advantage, new cyber and biological threats, and systems that remove human judgment from consequential decisions. Rather than make a single forecast, the authors identify technical questions that AI developers and policymakers need to investigate so institutions can prepare before capability changes produce strategic surprise.'
  ),
  (
    'joshua-achiam',
    'Rule Based Rewards for Language Model Safety',
    'https://arxiv.org/abs/2411.01111',
    'preprint',
    'arXiv',
    '2024-11-02',
    'day',
    NULL,
    'This paper presents a method for translating detailed behavioral rules into rewards used during language-model training. The authors argue that human-feedback data can be costly to update and may produce models that are either insufficiently safe or unnecessarily judgmental and restrictive. Their rule-based reward approach uses explicit descriptions of desired and undesired behavior together with an AI grader, allowing safety policies to be adjusted without relabeling a large human dataset. In the reported evaluations, the method improved the accuracy of safety behavior while preserving usefulness. The work illustrates Achiam''s technical contribution to making model behavior more controllable and safety requirements more explicit.'
  ),
  (
    'joshua-achiam',
    'Constrained Policy Optimization',
    'https://proceedings.mlr.press/v70/achiam17a.html',
    'paper',
    'Proceedings of Machine Learning Research',
    '2017-01-01',
    'year',
    NULL,
    'Achiam and his co-authors introduce a reinforcement-learning algorithm designed to improve performance while satisfying explicit behavioral constraints. Standard reinforcement learning typically optimizes a reward and may violate safety requirements while learning; Constrained Policy Optimization instead incorporates those requirements directly and provides guarantees of near-constraint satisfaction during successive updates. The paper evaluates the method on simulated control tasks and frames constrained optimization as a practical way to separate what a system should accomplish from limits on how it may act. It became a foundational contribution to safe reinforcement learning and reflects Achiam''s long-running focus on building safety conditions into learning systems rather than treating them only as post-training checks.'
  )
) AS v(slug, title, url, publication_type, publisher, published_date, published_date_precision, last_updated_at, abstract)
  ON p.slug = v.slug
WHERE NOT EXISTS (
  SELECT 1 FROM publications pub
  WHERE pub.profile_id = p.id AND pub.url = v.url
);

-- Keep the legacy realtime row aligned for clients that receive an update
-- between server renders. Values are derived from the canonical profile rows.
UPDATE ticker_stats
SET total_count = (
      SELECT count(*) FROM profiles WHERE status = 'published'
    ),
    ninety_day_count = (
      SELECT count(*)
      FROM profiles
      WHERE status = 'published'
        AND departure_date >= current_date - interval '90 days'
    ),
    updated_at = now();
