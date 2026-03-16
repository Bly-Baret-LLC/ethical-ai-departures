import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockEq = vi.fn()
const mockFrom = vi.fn()

const mockPublicationRow = {
  id: "e0000000-0000-4000-8000-000000000001",
  profile_id: "b0000000-0000-4000-8000-000000000001",
  title: "Concrete Problems in AI Safety",
  url: "https://arxiv.org/abs/1606.06565",
  publication_type: "paper",
  publisher: "arXiv",
  published_date: "2016-06-21",
  abstract: "Identifies five practical research problems.",
  created_at: "2026-03-15T00:00:00Z",
  updated_at: "2026-03-15T00:00:00Z",
}

const mockPublicationWithProfile = {
  ...mockPublicationRow,
  profiles: {
    name: "Dario Amodei",
    slug: "dario-amodei",
    profile_concern_tags: [{ concern_tags: { slug: "safety-deprioritization" } }],
  },
}

// Configurable responses
let listResponse: { data: unknown[] | null; error: unknown } = {
  data: [mockPublicationRow],
  error: null,
}
let listWithProfileResponse: { data: unknown[] | null; error: unknown } = {
  data: [mockPublicationWithProfile],
  error: null,
}
let junctionResponse: { data: unknown[] | null; error: unknown } = {
  data: [{ publications: mockPublicationWithProfile }],
  error: null,
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (...args: unknown[]) => {
      mockFrom(...args)
      const tableName = args[0] as string

      const eqChain: Record<string, unknown> = {
        order: (...oArgs: unknown[]) => {
          mockOrder(...oArgs)
          if (tableName === "publications" && mockSelect.mock.calls.length > 0) {
            const selectArg = mockSelect.mock.calls[mockSelect.mock.calls.length - 1][0] as string
            if (selectArg?.includes("profiles")) {
              return listWithProfileResponse
            }
          }
          return listResponse
        },
      }
      eqChain.eq = (...eqArgs: unknown[]) => {
        mockEq(...eqArgs)
        return tableName === "publication_predictions" ? junctionResponse : eqChain
      }

      return {
        select: (...sArgs: unknown[]) => {
          mockSelect(...sArgs)
          const selectArg = sArgs[0] as string
          if (tableName === "publications" && selectArg?.includes("profiles!inner")) {
            // getPublicationCountsByConcern
            return listWithProfileResponse
          }
          return { eq: eqChain.eq, order: eqChain.order }
        },
      }
    },
  }),
}))

import {
  getPublicationsByProfileId,
  getPublicationsWithProfiles,
  getPublicationsByPredictionId,
} from "./publications"

beforeEach(() => {
  vi.clearAllMocks()
  listResponse = { data: [mockPublicationRow], error: null }
  listWithProfileResponse = { data: [mockPublicationWithProfile], error: null }
  junctionResponse = { data: [{ publications: mockPublicationWithProfile }], error: null }
})

describe("getPublicationsByProfileId", () => {
  it("queries publications by profile_id ordered by published_date", async () => {
    const pubs = await getPublicationsByProfileId("b0000000-0000-4000-8000-000000000001")

    expect(mockFrom).toHaveBeenCalledWith("publications")
    expect(mockSelect).toHaveBeenCalledWith("*")
    expect(mockEq).toHaveBeenCalledWith("profile_id", "b0000000-0000-4000-8000-000000000001")
    expect(mockOrder).toHaveBeenCalledWith("published_date", { ascending: false })
    expect(pubs).toHaveLength(1)
    expect(pubs[0].title).toBe("Concrete Problems in AI Safety")
    expect(pubs[0].profileId).toBe("b0000000-0000-4000-8000-000000000001")
  })

  it("throws on Supabase error", async () => {
    listResponse = { data: null, error: { message: "connection refused", code: "PGRST000" } }
    await expect(
      getPublicationsByProfileId("b0000000-0000-4000-8000-000000000001")
    ).rejects.toEqual({ message: "connection refused", code: "PGRST000" })
  })
})

describe("getPublicationsWithProfiles", () => {
  it("queries all publications with profile joins", async () => {
    const pubs = await getPublicationsWithProfiles()

    expect(mockFrom).toHaveBeenCalledWith("publications")
    expect(mockSelect).toHaveBeenCalledWith("*, profiles(name, slug, profile_concern_tags(concern_tags(slug)))")
    expect(pubs).toHaveLength(1)
    expect(pubs[0].profileName).toBe("Dario Amodei")
    expect(pubs[0].profileSlug).toBe("dario-amodei")
    expect(pubs[0].concernTagSlugs).toEqual(["safety-deprioritization"])
    expect(pubs[0].title).toBe("Concrete Problems in AI Safety")
  })
})

describe("getPublicationsByPredictionId", () => {
  it("queries publication_predictions junction table", async () => {
    const pubs = await getPublicationsByPredictionId("f0000000-0000-4000-8000-000000000001")

    expect(mockFrom).toHaveBeenCalledWith("publication_predictions")
    expect(mockSelect).toHaveBeenCalledWith("publications(*, profiles(name, slug, profile_concern_tags(concern_tags(slug))))")
    expect(mockEq).toHaveBeenCalledWith("prediction_id", "f0000000-0000-4000-8000-000000000001")
    expect(pubs).toHaveLength(1)
    expect(pubs[0].title).toBe("Concrete Problems in AI Safety")
    expect(pubs[0].profileName).toBe("Dario Amodei")
  })
})
