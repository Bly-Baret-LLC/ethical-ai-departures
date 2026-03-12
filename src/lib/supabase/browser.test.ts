import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock @supabase/ssr before importing browser client
vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({
    from: vi.fn(),
    channel: vi.fn(),
  })),
}))

describe("Supabase browser client", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co")
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key")
  })

  it("creates a browser client with environment variables", async () => {
    const { createBrowserClient } = await import("@supabase/ssr")
    const { createClient } = await import("./browser")

    const client = createClient()

    expect(createBrowserClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key"
    )
    expect(client).toBeDefined()
  })
})
