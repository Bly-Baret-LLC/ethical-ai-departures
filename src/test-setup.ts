import "@testing-library/jest-dom/vitest"

// Provide harmless defaults so modules that instantiate external clients at
// import time (Resend, Supabase) don't throw when real credentials are absent
// in the test environment. Tests mock the actual network calls.
process.env.RESEND_API_KEY ||= "re_test_dummy"
process.env.NOTIFICATION_EMAIL ||= "test@example.com"
process.env.NEXT_PUBLIC_SUPABASE_URL ||= "http://127.0.0.1:54721"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= "test-anon-key"
