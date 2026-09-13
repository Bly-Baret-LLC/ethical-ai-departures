-- Remove a redundant source that is no longer available at its published URL.
-- Schwarz's own academic website remains the first-party source for his
-- Google DeepMind role and seven-year tenure.

DELETE FROM profile_sources source
USING profiles profile
WHERE source.profile_id = profile.id
  AND profile.slug = 'jonathan-richard-schwarz'
  AND source.url = 'https://www.cs.cityu.edu.hk/sites/g/files/asqsls6816/files/20221106183903_1.pdf';
