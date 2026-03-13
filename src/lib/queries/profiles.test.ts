import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockFrom = vi.fn()

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

// Configurable responses — tests can override these before calling functions
let listResponse: { data: unknown[] | null; error: unknown } = {
  data: mockData,
  error: null,
}
let singleResponse: { data: unknown | null; error: unknown } = {
  data: mockData[0],
  error: null,
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (...args: unknown[]) => {
      mockFrom(...args)
      return {
        select: (...sArgs: unknown[]) => {
          mockSelect(...sArgs)
          return {
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs)
              return {
                order: (...oArgs: unknown[]) => {
                  mockOrder(...oArgs)
                  return listResponse
                },
                single: (...siArgs: unknown[]) => {
                  mockSingle(...siArgs)
                  return singleResponse
                },
              }
            },
          }
        },
      }
    },
  }),
}))

import { getPublishedProfiles, getProfileBySlug } from "./profiles"

beforeEach(() => {
  vi.clearAllMocks()
  listResponse = { data: mockData, error: null }
  singleResponse = { data: mockData[0], error: null }
})

describe("getPublishedProfiles", () => {
  it("queries profiles with status=published ordered by departure_date", async () => {
    const profiles = await getPublishedProfiles()

    expect(mockFrom).toHaveBeenCalledWith("profiles")
    expect(mockSelect).toHaveBeenCalledWith("*")
    expect(mockEq).toHaveBeenCalledWith("status", "published")
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

  it("throws on Supabase error", async () => {
    listResponse = {
      data: null,
      error: { message: "connection refused", code: "PGRST000" },
    }

    await expect(getPublishedProfiles()).rejects.toEqual({
      message: "connection refused",
      code: "PGRST000",
    })
  })
})

describe("getProfileBySlug", () => {
  it("queries profiles table by slug", async () => {
    const profile = await getProfileBySlug("elena-rodriguez")

    expect(mockFrom).toHaveBeenCalledWith("profiles")
    expect(mockEq).toHaveBeenCalledWith("slug", "elena-rodriguez")
    expect(mockSingle).toHaveBeenCalled()
    expect(profile?.slug).toBe("elena-rodriguez")
    expect(profile?.company).toBe("OpenAI")
  })

  it("returns null when profile not found", async () => {
    singleResponse = {
      data: null,
      error: { message: "Row not found", code: "PGRST116" },
    }

    const result = await getProfileBySlug("nonexistent-slug")
    expect(result).toBeNull()
  })

  it("throws on database error", async () => {
    singleResponse = {
      data: null,
      error: { message: "connection refused", code: "PGRST000" },
    }

    await expect(getProfileBySlug("elena-rodriguez")).rejects.toEqual({
      message: "connection refused",
      code: "PGRST000",
    })
  })
})
