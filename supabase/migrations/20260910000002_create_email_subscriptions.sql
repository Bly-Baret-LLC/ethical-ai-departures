-- Private double-opt-in mailing list. No public policies are created: only
-- server-side service-role actions may read or mutate subscriber addresses.

CREATE TABLE IF NOT EXISTS email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  confirmation_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE email_subscriptions
  ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_status
  ON email_subscriptions(status);

ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE email_subscriptions IS
  'Private double-opt-in subscriber records; accessible only through server-side service-role actions.';
