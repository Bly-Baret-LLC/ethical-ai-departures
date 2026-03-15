import { describe, it, expect, vi, beforeEach } from "vitest"

const mockProfiles = [
  { company: "OpenAI", role: "Safety Lead" },
  { company: "OpenAI", role: "Head of Alignment" },
  { company: "Google DeepMind", role: "Research Director" },
  { company: "Google DeepMind", role: "Research Scientist" },
  { company: "Anthropic", role: "Senior Researcher" },
  { company: "Meta FAIR", role: "Principal Engineer" },
]

const mockConcerns = [
  {
    concern_tag: { name: "Safety Deprioritization" },
    profile: { status: "published" },
  },
  {
    concern_tag: { name: "Safety Deprioritization" },
    profile: { status: "published" },
  },
  {
    concern_tag: { name: "Safety Deprioritization" },
    profile: { status: "published" },
  },
  {
    concern_tag: { name: "Rushed Deployment" },
    profile: { status: "published" },
  },
  {
    concern_tag: { name: "Rushed Deployment" },
    profile: { status: "published" },
  },
  {
    concern_tag: { name: "Military Applications" },
    profile: { status: "published" },
  },
]

let profilesResponse: { data: unknown[] | null; error: unknown } = {
  data: mockProfiles,
  error: null,
}

let concernsResponse: { data: unknown[] | null; error: unknown } = {
  data: mockConcerns,
  error: null,
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => profilesResponse,
          }),
        }
      }
      if (table === "profile_concern_tags") {
        return {
          select: () => ({
            eq: () => concernsResponse,
          }),
        }
      }
      return { select: () => ({ eq: () => ({ data: [], error: null }) }) }
    },
  }),
}))

import { getStatsBridgeData } from "./stats"

beforeEach(() => {
  profilesResponse = { data: mockProfiles, error: null }
  concernsResponse = { data: mockConcerns, error: null }
})

describe("getStatsBridgeData", () => {
  it("returns correct company count", async () => {
    const stats = await getStatsBridgeData()
    expect(stats.companyCount).toBe(4)
  })

  it("returns correct top concern", async () => {
    const stats = await getStatsBridgeData()
    expect(stats.topConcern).toBe("Safety Deprioritization")
  })

  it("returns correct senior role percentage", async () => {
    const stats = await getStatsBridgeData()
    // All 6 profiles have senior keywords: Safety Lead, Head of Alignment,
    // Research Director, Research Scientist (no keyword!), Senior Researcher, Principal Engineer
    // 5 out of 6 = 83%
    expect(stats.seniorPct).toBe(83)
  })

  it("handles zero profiles", async () => {
    profilesResponse = { data: [], error: null }
    concernsResponse = { data: [], error: null }

    const stats = await getStatsBridgeData()
    expect(stats.companyCount).toBe(0)
    expect(stats.topConcern).toBeNull()
    expect(stats.seniorPct).toBe(0)
  })

  it("throws on profiles query error", async () => {
    profilesResponse = {
      data: null,
      error: { message: "connection refused", code: "PGRST000" },
    }

    await expect(getStatsBridgeData()).rejects.toEqual({
      message: "connection refused",
      code: "PGRST000",
    })
  })

  it("throws on concerns query error", async () => {
    concernsResponse = {
      data: null,
      error: { message: "timeout", code: "PGRST000" },
    }

    await expect(getStatsBridgeData()).rejects.toEqual({
      message: "timeout",
      code: "PGRST000",
    })
  })
})
