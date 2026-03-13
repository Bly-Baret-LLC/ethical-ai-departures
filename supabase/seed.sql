-- Seed data for Warning Collective development
-- 8 profiles, 7 concern tags, associated sources and tags

-- Concern Tags (8 categories)
INSERT INTO concern_tags (id, name, slug, description) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Safety Deprioritization', 'safety-deprioritization', 'Company deprioritized safety research in favor of capabilities or revenue.'),
  ('a0000000-0000-4000-8000-000000000002', 'Rushed Deployment', 'rushed-deployment', 'Models deployed to production without adequate safety testing.'),
  ('a0000000-0000-4000-8000-000000000003', 'Inadequate Oversight', 'inadequate-oversight', 'Insufficient internal governance or review processes for high-risk systems.'),
  ('a0000000-0000-4000-8000-000000000004', 'Alignment Research Gaps', 'alignment-research-gaps', 'Insufficient investment in alignment or interpretability research.'),
  ('a0000000-0000-4000-8000-000000000005', 'Lack of Transparency', 'lack-of-transparency', 'Company withheld information about model capabilities or risks from the public.'),
  ('a0000000-0000-4000-8000-000000000006', 'Military Applications', 'military-applications', 'AI systems developed or deployed for military or surveillance purposes.'),
  ('a0000000-0000-4000-8000-000000000007', 'Workforce Displacement', 'workforce-displacement', 'Concerns about accelerating automation without adequate worker transition support.'),
  ('a0000000-0000-4000-8000-000000000008', 'AGI Risk Underestimation', 'agi-risk-underestimation', 'Leadership dismisses or underestimates risks from advanced AI systems.');

-- Profiles (6 published, 2 draft)
INSERT INTO profiles (id, slug, name, photo_url, company, role, departure_date, stated_reason, status) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'elena-rodriguez', 'Elena Rodriguez', NULL, 'OpenAI', 'Safety Lead', '2025-11-15', 'Safety concerns consistently deprioritized in favor of shipping timelines. Internal safety review processes bypassed for major releases.', 'published'),
  ('b0000000-0000-4000-8000-000000000002', 'marcus-chen', 'Marcus Chen', NULL, 'Google DeepMind', 'Research Director', '2025-09-22', 'Alignment research team dissolved and merged into capabilities. Budget redirected away from safety-critical interpretability work.', 'published'),
  ('b0000000-0000-4000-8000-000000000003', 'sarah-okafor', 'Sarah Okafor', NULL, 'Anthropic', 'Senior Researcher', '2026-01-10', 'Disagreement over deployment timeline for frontier model. Felt safety evaluations were insufficient given capability level.', 'published'),
  ('b0000000-0000-4000-8000-000000000004', 'james-whitfield', 'James Whitfield', NULL, 'Meta FAIR', 'Principal Engineer', '2025-06-30', 'Open-source release of large model without adequate safety filtering. Raised concerns internally but was overruled.', 'published'),
  ('b0000000-0000-4000-8000-000000000005', 'aisha-patel', 'Aisha Patel', NULL, 'OpenAI', 'Head of Alignment', '2026-02-14', 'Fundamental disagreement on AGI timeline risk assessment. Felt company was accelerating without proportional safety investment.', 'published'),
  ('b0000000-0000-4000-8000-000000000006', 'david-nakamura', 'David Nakamura', NULL, 'Google DeepMind', 'Research Scientist', '2025-08-05', 'Military contract work conflicted with personal ethics around AI use in autonomous weapons systems.', 'published'),
  ('b0000000-0000-4000-8000-000000000007', 'li-wei-zhang', 'Li Wei Zhang', NULL, 'xAI', 'Senior Researcher', '2026-03-01', 'Draft profile pending editorial review — transparency concerns around capability evaluations.', 'draft'),
  ('b0000000-0000-4000-8000-000000000008', 'anna-kowalski', 'Anna Kowalski', NULL, 'Microsoft AI', 'Safety Lead', '2025-12-20', 'Draft profile pending editorial review — workforce displacement acceleration concerns.', 'draft');

-- Profile Sources (1-2 per profile)
INSERT INTO profile_sources (id, profile_id, url, title, platform, published_date) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'https://example.com/rodriguez-departure-interview', 'Why I Left OpenAI: A Safety Researcher Speaks Out', 'Substack', '2025-11-18'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'https://example.com/techcrunch-rodriguez', 'OpenAI Safety Lead Departs Citing Deprioritization', 'TechCrunch', '2025-11-20'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'https://example.com/chen-alignment-gaps', 'DeepMind Alignment Team Dismantled, Director Resigns', 'The Verge', '2025-09-25'),
  ('c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000003', 'https://example.com/okafor-anthropic-exit', 'Anthropic Researcher Leaves Over Deployment Concerns', 'Wired', '2026-01-15'),
  ('c0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000004', 'https://example.com/whitfield-meta-open-source', 'Meta Engineer Warns of Open-Source Safety Gaps', 'Ars Technica', '2025-07-05'),
  ('c0000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000004', 'https://example.com/whitfield-interview-podcast', 'Interview: James Whitfield on Responsible AI Release', 'AI Safety Podcast', '2025-07-12'),
  ('c0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000005', 'https://example.com/patel-agi-timeline', 'Former OpenAI Alignment Head: We Are Not Ready', 'New York Times', '2026-02-18'),
  ('c0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000006', 'https://example.com/nakamura-military-ai', 'DeepMind Scientist Quits Over Military Contract', 'The Guardian', '2025-08-10');

-- Profile Concern Tags (many-to-many associations)
INSERT INTO profile_concern_tags (profile_id, concern_tag_id) VALUES
  -- Elena Rodriguez: Safety Deprioritization, Rushed Deployment
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002'),
  -- Marcus Chen: Alignment Research Gaps, Safety Deprioritization
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000004'),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001'),
  -- Sarah Okafor: Rushed Deployment, Inadequate Oversight
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002'),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000003'),
  -- James Whitfield: Lack of Transparency, Inadequate Oversight
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000005'),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000003'),
  -- Aisha Patel: AGI Risk Underestimation, Safety Deprioritization, Alignment Research Gaps
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000008'),
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000004'),
  -- David Nakamura: Military Applications
  ('b0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000006');

-- Ticker Stats (aggregate counts — 6 published profiles)
INSERT INTO ticker_stats (id, total_count, ninety_day_count, seniority_breakdown) VALUES
  ('d0000000-0000-4000-8000-000000000001', 6, 2, '{"Safety Lead": 1, "Research Director": 1, "Senior Researcher": 1, "Principal Engineer": 1, "Head of Alignment": 1, "Research Scientist": 1}');
