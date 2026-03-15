import { describe, it, expect, vi, beforeEach } from "vitest"

const mockInsert = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockUpsert = vi.fn()
const mockGte = vi.fn()

let insertResponse = { data: { id: "prof-1" }, error: null }
let bulkInsertResponse = { error: null }
let tagResponse = { data: { id: "tag-1" }, error: null }
let countResponse = { count: 5, error: null }

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn((table: string) => {
      if (table === "profiles") {
        return {
          insert: (...args: unknown[]) => {
            mockInsert(...args)
            return {
              select: (...sArgs: unknown[]) => {
                mockSelect(...sArgs)
                return {
                  single: () => insertResponse,
                }
              },
            }
          },
          select: () => ({
            count: "exact",
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs)
              return {
                gte: (...gteArgs: unknown[]) => {
                  mockGte(...gteArgs)
                  return countResponse
                },
                ...countResponse,
              }
            },
          }),
        }
      }
      if (table === "profile_sources") {
        return {
          insert: (...args: unknown[]) => {
            mockInsert(...args)
            return bulkInsertResponse
          },
        }
      }
      if (table === "concern_tags") {
        return {
          select: () => ({
            eq: (...eqArgs: unknown[]) => {
              mockEq(...eqArgs)
              return {
                single: () => tagResponse,
              }
            },
          }),
        }
      }
      if (table === "profile_concern_tags") {
        return {
          insert: (...args: unknown[]) => {
            mockInsert(...args)
            return { error: null }
          },
        }
      }
      if (table === "ticker_stats") {
        return {
          upsert: (...args: unknown[]) => {
            mockUpsert(...args)
            return { error: null }
          },
        }
      }
      return {}
    }),
  }),
}))

import { validateSeedData, importSeedData } from "./seed"

beforeEach(() => {
  vi.clearAllMocks()
  insertResponse = { data: { id: "prof-1" }, error: null }
  bulkInsertResponse = { error: null }
  tagResponse = { data: { id: "tag-1" }, error: null }
  countResponse = { count: 5, error: null }
})

const validProfile = {
  name: "Jane Smith",
  company: "OpenAI",
  role: "Safety Lead",
  departureDate: "2025-03-15",
  statedReason: "Safety concerns",
  status: "published",
  sources: [
    { url: "https://example.com/article", title: "Interview", platform: "NYT" },
  ],
  concernTags: ["safety-culture"],
}

describe("validateSeedData", () => {
  it("validates valid input", async () => {
    const result = await validateSeedData(JSON.stringify([validProfile]))
    expect(result.valid).toBe(true)
    expect(result.profileCount).toBe(1)
    expect(result.sourceCount).toBe(1)
    expect(result.tagCount).toBe(1)
  })

  it("returns error for invalid JSON", async () => {
    const result = await validateSeedData("not json")
    expect(result.valid).toBe(false)
    expect(result.errors[0].message).toBe("Invalid JSON format")
  })

  it("returns error for empty array", async () => {
    const result = await validateSeedData("[]")
    expect(result.valid).toBe(false)
  })

  it("returns error for missing required fields", async () => {
    const result = await validateSeedData(JSON.stringify([{ name: "Test" }]))
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it("counts multiple profiles and sources", async () => {
    const data = [
      validProfile,
      {
        ...validProfile,
        name: "Bob Torres",
        sources: [
          { url: "https://example.com/1", title: "A" },
          { url: "https://example.com/2", title: "B" },
        ],
      },
    ]
    const result = await validateSeedData(JSON.stringify(data))
    expect(result.valid).toBe(true)
    expect(result.profileCount).toBe(2)
    expect(result.sourceCount).toBe(3)
  })
})

describe("importSeedData", () => {
  it("imports valid data successfully", async () => {
    const result = await importSeedData(JSON.stringify([validProfile]))
    expect(result.success).toBe(true)
    expect(result.importedCount).toBe(1)
  })

  it("returns error for invalid data", async () => {
    const result = await importSeedData("not json")
    expect(result.success).toBe(false)
  })

  it("returns error when profile insert fails", async () => {
    insertResponse = { data: null, error: { message: "duplicate slug" } } as never
    const result = await importSeedData(JSON.stringify([validProfile]))
    expect(result.success).toBe(false)
    expect(result.message).toContain("Jane Smith")
  })
})
