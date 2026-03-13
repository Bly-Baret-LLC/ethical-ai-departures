import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockFrom = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (...args: unknown[]) => {
      mockFrom(...args)
      return {
        select: (...sArgs: unknown[]) => {
          mockSelect(...sArgs)
          return {
            order: (...oArgs: unknown[]) => {
              mockOrder(...oArgs)
              return { data: mockData, error: null }
            },
            eq: (...eArgs: unknown[]) => {
              mockEq(...eArgs)
              return {
                single: (...siArgs: unknown[]) => {
                  mockSingle(...siArgs)
                  return { data: mockSingleData, error: null }
                },
              }
            },
          }
        },
      }
    },
  }),
}))

const mockData = [
  {
    id: "b0000000-0000-4000-8000-000000000001",
    slug: "elena-rodriguez",
    name: "Elena Rodriguez",
    photo_url: null,
    company: "OpenAI",
    role: "Safety Lead",
    departure_date: "2025-11-15",
    stated_reason: "Safety concerns deprioritized.",
    status: "published",
    created_at: "2025-11-20T00:00:00Z",
    updated_at: "2025-11-20T00:00:00Z",
  },
]

const mockSingleData = mockData[0]

import { getPublishedProfiles, getProfileBySlug } from "./profiles"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getPublishedProfiles", () => {
  it("queries profiles table ordered by departure_date descending", async () => {
    const profiles = await getPublishedProfiles()

    expect(mockFrom).toHaveBeenCalledWith("profiles")
    expect(mockSelect).toHaveBeenCalledWith("*")
    expect(mockOrder).toHaveBeenCalledWith("departure_date", {
      ascending: false,
    })
    expect(profiles).toHaveLength(1)
    expect(profiles[0].name).toBe("Elena Rodriguez")
    expect(profiles[0].departureDate).toBe("2025-11-15")
  })

  it("transforms snake_case to camelCase", async () => {
    const profiles = await getPublishedProfiles()
    const profile = profiles[0]

    expect(profile.photoUrl).toBeNull()
    expect(profile.statedReason).toBe("Safety concerns deprioritized.")
    expect(profile.createdAt).toBe("2025-11-20T00:00:00Z")
    expect(profile.updatedAt).toBe("2025-11-20T00:00:00Z")
  })
})

describe("getProfileBySlug", () => {
  it("queries profiles table by slug", async () => {
    const profile = await getProfileBySlug("elena-rodriguez")

    expect(mockFrom).toHaveBeenCalledWith("profiles")
    expect(mockEq).toHaveBeenCalledWith("slug", "elena-rodriguez")
    expect(mockSingle).toHaveBeenCalled()
    expect(profile.slug).toBe("elena-rodriguez")
    expect(profile.company).toBe("OpenAI")
  })
})
