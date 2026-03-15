import { describe, it, expect, vi, beforeEach } from "vitest"

const mockProfiles = [
  {
    slug: "aisha-patel",
    name: "Aisha Patel",
    company: "OpenAI",
    role: "Head of Alignment",
    departure_date: "2026-02-14",
    created_at: "2026-03-10T12:00:00Z",
  },
  {
    slug: "sarah-okafor",
    name: "Sarah Okafor",
    company: "Anthropic",
    role: "Senior Researcher",
    departure_date: "2026-01-10",
    created_at: "2026-03-08T12:00:00Z",
  },
  {
    slug: "elena-rodriguez",
    name: "Elena Rodriguez",
    company: "OpenAI",
    role: "Safety Lead",
    departure_date: "2025-11-15",
    created_at: "2026-03-05T12:00:00Z",
  },
]

let profilesResponse: { data: unknown[] | null; error: unknown } = {
  data: mockProfiles,
  error: null,
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => profilesResponse,
          }),
        }),
      }),
    }),
  }),
}))

import { getLatestActivity } from "./latestActivity"

beforeEach(() => {
  profilesResponse = { data: mockProfiles, error: null }
})

describe("getLatestActivity", () => {
  it("returns recent profiles ordered by departure date", async () => {
    const items = await getLatestActivity()
    expect(items).toHaveLength(3)
    expect(items[0].name).toBe("Aisha Patel")
    expect(items[0].departureDate).toBe("2026-02-14")
    expect(items[2].name).toBe("Elena Rodriguez")
  })

  it("transforms snake_case to camelCase", async () => {
    const items = await getLatestActivity()
    expect(items[0]).toEqual({
      slug: "aisha-patel",
      name: "Aisha Patel",
      company: "OpenAI",
      role: "Head of Alignment",
      departureDate: "2026-02-14",
      createdAt: "2026-03-10T12:00:00Z",
    })
  })

  it("returns empty array when no profiles exist", async () => {
    profilesResponse = { data: [], error: null }
    const items = await getLatestActivity()
    expect(items).toHaveLength(0)
  })

  it("throws on query error", async () => {
    profilesResponse = {
      data: null,
      error: { message: "connection refused", code: "PGRST000" },
    }
    await expect(getLatestActivity()).rejects.toEqual({
      message: "connection refused",
      code: "PGRST000",
    })
  })
})
