-- Local test only. All schema changes and fixtures are rolled back.
\set ON_ERROR_STOP on
BEGIN;
INSERT INTO public.email_subscriptions(email, status) VALUES
  ('pending-single-opt-in@example.com', 'pending'),
  ('unsubscribed-single-opt-in@example.com', 'unsubscribed');
\ir ../migrations/20261008000003_single_opt_in.sql
DO $$
DECLARE saved_token uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.email_subscriptions WHERE email = 'pending-single-opt-in@example.com' AND status = 'subscribed' AND confirmed_at IS NULL) THEN
    RAISE EXCEPTION 'Pending subscriber migration failed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.email_subscriptions WHERE email = 'unsubscribed-single-opt-in@example.com' AND status = 'unsubscribed') THEN
    RAISE EXCEPTION 'Migration changed unsubscribe choice';
  END IF;
  PERFORM public.subscribe_email('new-single-opt-in@example.com');
  SELECT confirmation_token INTO saved_token FROM public.email_subscriptions WHERE email = 'new-single-opt-in@example.com' AND status = 'subscribed' AND confirmed_at IS NULL;
  IF saved_token IS NULL THEN RAISE EXCEPTION 'Immediate signup failed'; END IF;
  PERFORM public.subscribe_email('new-single-opt-in@example.com');
  IF NOT EXISTS (SELECT 1 FROM public.email_subscriptions WHERE email = 'new-single-opt-in@example.com' AND confirmation_token = saved_token) THEN
    RAISE EXCEPTION 'Duplicate signup changed active record';
  END IF;
  PERFORM public.subscribe_email('unsubscribed-single-opt-in@example.com');
  IF NOT EXISTS (SELECT 1 FROM public.email_subscriptions WHERE email = 'unsubscribed-single-opt-in@example.com' AND status = 'subscribed' AND unsubscribed_at IS NULL) THEN
    RAISE EXCEPTION 'Explicit resubscribe failed';
  END IF;
  IF has_function_privilege('anon', 'public.subscribe_email(text)', 'EXECUTE') OR has_function_privilege('authenticated', 'public.subscribe_email(text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'Public RPC access';
  END IF;
END;
$$;
ROLLBACK;
