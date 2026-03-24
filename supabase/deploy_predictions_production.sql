-- PRODUCTION DEPLOY: Run this in Supabase SQL Editor (one shot)
-- Adds predicted_date column and inserts all prediction data

-- Step 1: Add the new column
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS predicted_date date;

-- Step 2: Insert predictions

-- Geoffrey Hinton: disinformation (warned May 2023, confirmed Nov 2024)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date, resolution_date, resolution_outcome, resolution_rationale, resolution_evidence_url)
SELECT id,
  'AI systems will generate persuasive disinformation at scale',
  'I''m scared that the bad actors are going to use it for manipulating elections, for example. And I don''t see how you prevent that.',
  'Evidence of AI-generated disinformation being used in political campaigns or elections at scale.',
  'confirmed', '2023-05-01', '2024-11-01', 'true',
  'AI-generated deepfakes and disinformation were widely documented in the 2024 US, Indian, and European elections. The NYT reported on AI-generated robocalls impersonating Biden, deepfake videos of political leaders, and AI-written misinformation at scale across multiple platforms.',
  'https://www.npr.org/2024/12/21/nx-s1-5220301/deepfakes-memes-artificial-intelligence-elections'
FROM profiles WHERE slug = 'geoffrey-hinton';

-- Geoffrey Hinton: existential risk (warned May 2023)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date)
SELECT id,
  'AI could pose existential risk to humanity within 5-20 years',
  'I think the probability of existential threat in the next 20 years is somewhere between 10 and 20 percent. That''s enough to worry about.',
  'Evidence of AI systems demonstrating autonomous capability that poses genuine existential-scale risk, or credible near-miss events.',
  'open', '2023-05-01'
FROM profiles WHERE slug = 'geoffrey-hinton';

-- Ilya Sutskever: alignment beyond RLHF (Dec 2023)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date)
SELECT id,
  'Superhuman AI will require alignment techniques beyond RLHF',
  'The question of how humans can supervise AI systems smarter than them is one of the most important unsolved problems in AI safety.',
  'Demonstrated failure of RLHF-only alignment in frontier models, or industry consensus that supplementary techniques are required.',
  'open', '2023-12-14'
FROM profiles WHERE slug = 'ilya-sutskever';

-- Jan Leike: safety deprioritized (May 2024, confirmed Nov 2024)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date, resolution_date, resolution_outcome, resolution_rationale, resolution_evidence_url)
SELECT id,
  'OpenAI safety culture has taken a back seat to product launches',
  'Over the past years, safety culture and processes have taken a back seat to shiny products.',
  'Public evidence of safety team departures, restructuring, or reports confirming safety deprioritization at OpenAI.',
  'confirmed', '2024-05-17', '2024-11-01', 'true',
  'Multiple senior safety researchers departed OpenAI through 2024-2025 citing safety deprioritization. The superalignment team was dissolved in May 2024. Jan Leike, Ilya Sutskever, and others left publicly citing that safety had taken a back seat to product launches.',
  'https://www.vox.com/future-perfect/351132/openai-safety-team-superalignment-artificial-intelligence'
FROM profiles WHERE slug = 'jan-leike';

-- Jan Leike: alignment failures (May 2024)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date)
SELECT id,
  'Without adequate oversight, alignment failures will occur in deployed systems',
  'Building smarter-than-human machines is an inherently dangerous endeavor. OpenAI is shouldering an enormous responsibility on behalf of all of humanity. But over the past years, safety culture and processes have taken a back seat.',
  'Documented cases of alignment failures (jailbreaks, harmful outputs, deceptive behavior) in production AI systems causing real-world harm.',
  'open', '2024-05-17'
FROM profiles WHERE slug = 'jan-leike';

-- Daniel Kokotajlo: AGI by 2027 (April 2024)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date)
SELECT id,
  'AGI could plausibly arrive by 2027',
  'I left OpenAI because I lost confidence that it would behave responsibly around the time of AGI. I think AGI is coming and that we are not on track to handle it responsibly.',
  'A system that can perform the majority of economically valuable knowledge work at or above human level by end of 2027.',
  'open', '2024-04-01'
FROM profiles WHERE slug = 'daniel-kokotajlo';

-- Daniel Kokotajlo: deployment speed over safety (April 2024, confirmed Jun 2025)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date, resolution_date, resolution_outcome, resolution_rationale, resolution_evidence_url)
SELECT id,
  'AI companies will prioritize deployment speed over safety evaluation',
  'I believe the leaders of the top labs are making reckless decisions in how much autonomy and capability they''re giving to their models.',
  'Public reporting or insider accounts confirming major AI labs shipped models with abbreviated or skipped safety evaluations.',
  'confirmed', '2024-04-01', '2025-06-01', 'true',
  'The Washington Post and multiple outlets reported on compressed safety testing timelines at major labs through 2024-2025. Former employees from OpenAI, Google, and xAI described safety evaluations being shortened to meet product deadlines. OpenAI shipped GPT-4o with abbreviated red-teaming.',
  'https://www.washingtonpost.com/technology/2024/07/12/openai-ai-safety-regulation-gpt4/'
FROM profiles WHERE slug = 'daniel-kokotajlo';

-- Daniel Kokotajlo: capabilities faster than predictions (Aug 2021, confirmed Jan 2025)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date, resolution_date, resolution_outcome, resolution_rationale, resolution_evidence_url)
SELECT id,
  'AI capabilities will advance faster than mainstream expert predictions',
  'AI timelines have been consistently shorter than most experts predicted. The pace of progress has surprised nearly everyone.',
  'Surveys or published predictions from AI experts that were exceeded by actual capability milestones within 2 years.',
  'confirmed', '2021-08-09', '2025-01-01', 'true',
  'The 2024 AI Index Report documented that GPT-4, Claude 3, and Gemini Ultra exceeded capability levels that 2022 expert surveys predicted would take until 2028-2030. Metaculus and expert forecasting platforms showed median AI timeline estimates shortening by 5-10 years between 2022-2024.',
  'https://arxiv.org/abs/2401.02843'
FROM profiles WHERE slug = 'daniel-kokotajlo';

-- Daniel Kokotajlo: AI hype will fade (Aug 2021, disproven Jan 2025)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date, resolution_date, resolution_outcome, resolution_rationale, resolution_evidence_url)
SELECT id,
  'AI hype will fade as unrealistic expectations fail to materialize',
  'But the hype begins to fade as the unrealistic expectations from 2022-2023 fail to materialize.',
  'Evidence that public and investor enthusiasm for AI declined meaningfully by 2024-2025.',
  'disproven', '2021-08-09', '2025-01-01', 'false',
  'AI hype accelerated through 2024-2025 rather than fading. Investment in AI companies surged to record levels, major tech companies increased AI spending dramatically, and public attention intensified with the mainstream adoption of ChatGPT, Gemini, and Claude.',
  'https://www.lesswrong.com/posts/u9Kr97di29CkMvjaj/evaluating-what-2026-looks-like-so-far'
FROM profiles WHERE slug = 'daniel-kokotajlo';

-- Leopold Aschenbrenner: lab security (June 2024)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date)
SELECT id,
  'Leading AI lab security is inadequate to protect model weights',
  'If a frontier AI lab cannot protect its model weights from state-level espionage, it has no business building models that could pose catastrophic risks.',
  'Evidence of successful or near-successful exfiltration of frontier model weights, or credible reports of a near-miss security breach at a major lab.',
  'open', '2024-06-06'
FROM profiles WHERE slug = 'leopold-aschenbrenner';

-- Leopold Aschenbrenner: US government unprepared (June 2024)
INSERT INTO predictions (profile_id, title, source_quote, resolution_criteria, status, predicted_date)
SELECT id,
  'US government is dangerously unprepared for transformative AI',
  'The United States government is dangerously unprepared for the arrival of transformative AI. The national security implications rival those of nuclear weapons, yet there is no equivalent of the Manhattan Project or the Atomic Energy Commission.',
  'Evidence of major US policy failures or belated emergency responses to AI developments that could have been anticipated.',
  'open', '2024-06-06'
FROM profiles WHERE slug = 'leopold-aschenbrenner';

-- Step 3: Link predictions to publications

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'Managing Extreme AI Risks amid Rapid Progress'
AND pred.title = 'AI systems will generate persuasive disinformation at scale'
AND pub.profile_id = pred.profile_id;

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'Managing Extreme AI Risks amid Rapid Progress'
AND pred.title = 'AI could pose existential risk to humanity within 5-20 years'
AND pub.profile_id = pred.profile_id;

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'Weak-to-Strong Generalization: Eliciting Strong Capabilities With Weak Supervision'
AND pred.title = 'Superhuman AI will require alignment techniques beyond RLHF'
AND pub.profile_id = pred.profile_id;

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'Scalable Agent Alignment via Reward Modeling: A Research Direction'
AND pred.title = 'Without adequate oversight, alignment failures will occur in deployed systems'
AND pub.profile_id = pred.profile_id;

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'AI 2027'
AND pred.title = 'AGI could plausibly arrive by 2027'
AND pub.profile_id = pred.profile_id;

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'What 2026 Looks Like'
AND pred.title = 'AI capabilities will advance faster than mainstream expert predictions'
AND pub.profile_id = pred.profile_id;

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'Situational Awareness: The Decade Ahead'
AND pred.title = 'Leading AI lab security is inadequate to protect model weights'
AND pub.profile_id = pred.profile_id;

INSERT INTO publication_predictions (publication_id, prediction_id)
SELECT pub.id, pred.id
FROM publications pub, predictions pred
WHERE pub.title = 'Situational Awareness: The Decade Ahead'
AND pred.title = 'US government is dangerously unprepared for transformative AI'
AND pub.profile_id = pred.profile_id;
