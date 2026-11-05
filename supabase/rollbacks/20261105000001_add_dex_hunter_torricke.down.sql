-- Manual rollback: hide the profile without deleting sources, writings or interactions.
-- Revert the separate organizational-event code to remove it from the app.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
DO $$
BEGIN
  UPDATE public.profiles
  SET status = 'archived', headline_counted = false
  WHERE id = 'f0de1105-0001-4000-8000-000000000001'
    AND slug = 'dex-hunter-torricke' AND status = 'published'
    AND headline_counted AND motive_evidence = 'direct'
    AND updated_at = created_at
    AND reviewer = 'Source review for approved local preview (2026-11-05)';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Hunter-Torricke profile missing or edited; review rollback manually';
  END IF;
END $$;
COMMIT;
