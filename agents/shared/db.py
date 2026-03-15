"""Shared Supabase client for agent pipeline."""

import os
from supabase import create_client, Client

_client: Client | None = None


def get_supabase() -> Client:
    """Get or create a Supabase client using service role credentials."""
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        _client = create_client(url, key)
    return _client
