-- Manual rollback for 20260910000005_add_schwarz_photo.sql.

UPDATE profiles
SET photo_url = NULL
WHERE slug = 'jonathan-richard-schwarz';
