import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Anonymous client for public, read-only data.
 *
 * Unlike the session-aware server client, this client does not read request
 * cookies. Public pages can therefore be statically generated and revalidated
 * instead of forcing a fresh server render for every visitor.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}
