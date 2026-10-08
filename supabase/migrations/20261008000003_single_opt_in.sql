-- Active subscriptions do not imply verified mailbox ownership.
ALTER TABLE public.email_subscriptions DROP CONSTRAINT email_subscriptions_status_check;
ALTER TABLE public.email_subscriptions ADD CONSTRAINT email_subscriptions_status_check
  CHECK (status IN ('pending', 'subscribed', 'confirmed', 'unsubscribed'));
ALTER TABLE public.email_subscriptions ALTER COLUMN status SET DEFAULT 'subscribed';
UPDATE public.email_subscriptions SET status = 'subscribed', updated_at = now()
WHERE status = 'pending';
COMMENT ON TABLE public.email_subscriptions IS
  'Private single-opt-in list. subscribed and legacy confirmed statuses are active; only confirmed establishes historical mailbox confirmation.';

CREATE FUNCTION public.subscribe_email(p_email text) RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN
  IF p_email IS NULL OR p_email = '' OR p_email <> lower(btrim(p_email)) THEN
    RAISE EXCEPTION 'Normalized email required';
  END IF;
  INSERT INTO public.email_subscriptions (email, status) VALUES (p_email, 'subscribed')
  ON CONFLICT (email) DO UPDATE SET
    status = 'subscribed',
    confirmation_token = gen_random_uuid(),
    confirmation_sent_at = NULL,
    unsubscribed_at = NULL,
    updated_at = now()
  WHERE email_subscriptions.status IN ('pending', 'unsubscribed');
END;
$$;
REVOKE ALL ON FUNCTION public.subscribe_email(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.subscribe_email(text) TO service_role;
