import { describe, it, expect, vi, beforeEach } from "vitest"

const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()
const mockEq = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      insert: (...args: unknown[]) => {
        mockInsert(...args)
        return {
          select: (...sArgs: unknown[]) => {
            mockSelect(...sArgs)
            return {
              single: (...siArgs: unknown[]) => {
                mockSingle(...siArgs)
                return singleResponse
              },
            }
          },
        }
      },
      update: (...args: unknown[]) => {
        mockUpdate(...args)
        return {
          eq: (...eqArgs: unknown[]) => {
            mockEq(...eqArgs)
            return updateResponse
          },
        }
      },
    }),
  }),
}))

let singleResponse = { data: { id: "abc-123" }, error: null }
let updateResponse = { error: null }

import { createProfile, updateProfileStatus } from "./profiles"

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) {
    fd.set(k, v)
  }
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
  singleResponse = { data: { id: "abc-123" }, error: null }
  updateResponse = { error: null }
})

describe("createProfile", () => {
  const validData = {
    name: "Jane Smith",
    company: "Acme Corp",
    role: "Lead Engineer",
    departureDate: "2025-06-15",
  }

  it("creates profile with valid data", async () => {
    const result = await createProfile(makeFormData(validData))
    expect(result.success).toBe(true)
    expect(result.message).toBe("Profile created successfully")
    expect(result.id).toBe("abc-123")
  })

  it("inserts with correct snake_case fields", async () => {
    await createProfile(makeFormData(validData))
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "jane-smith",
        name: "Jane Smith",
        company: "Acme Corp",
        role: "Lead Engineer",
        departure_date: "2025-06-15",
        status: "draft",
      })
    )
  })

  it("generates correct slug", async () => {
    await createProfile(makeFormData({ ...validData, name: "Dr. Alice O'Brien-Jones" }))
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "dr-alice-o-brien-jones" })
    )
  })

  it("returns validation error for missing name", async () => {
    const result = await createProfile(makeFormData({ ...validData, name: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Name is required")
  })

  it("returns validation error for missing company", async () => {
    const result = await createProfile(makeFormData({ ...validData, company: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Company is required")
  })

  it("returns validation error for missing role", async () => {
    const result = await createProfile(makeFormData({ ...validData, role: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Role is required")
  })

  it("returns validation error for missing departure date", async () => {
    const result = await createProfile(makeFormData({ ...validData, departureDate: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Departure date is required")
  })

  it("accepts optional photo URL", async () => {
    await createProfile(makeFormData({ ...validData, photoUrl: "https://example.com/photo.jpg" }))
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ photo_url: "https://example.com/photo.jpg" })
    )
  })

  it("handles empty photo URL as null", async () => {
    await createProfile(makeFormData({ ...validData, photoUrl: "" }))
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ photo_url: null })
    )
  })

  it("defaults status to draft", async () => {
    await createProfile(makeFormData(validData))
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ status: "draft" })
    )
  })

  it("returns error on database failure", async () => {
    singleResponse = { data: null, error: { message: "DB error" } } as never
    const result = await createProfile(makeFormData(validData))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Failed to create profile. Please try again.")
  })
})

describe("updateProfileStatus", () => {
  it("updates to published", async () => {
    const result = await updateProfileStatus("abc-123", "published")
    expect(result.success).toBe(true)
    expect(result.message).toContain("published")
  })

  it("updates to draft", async () => {
    const result = await updateProfileStatus("abc-123", "draft")
    expect(result.success).toBe(true)
    expect(result.message).toContain("updated")
  })

  it("calls update with correct parameters", async () => {
    await updateProfileStatus("abc-123", "published")
    expect(mockUpdate).toHaveBeenCalledWith({ status: "published" })
    expect(mockEq).toHaveBeenCalledWith("id", "abc-123")
  })

  it("returns error on database failure", async () => {
    updateResponse = { error: { message: "DB error" } } as never
    const result = await updateProfileStatus("abc-123", "published")
    expect(result.success).toBe(false)
    expect(result.message).toBe("Failed to update profile status.")
  })
})
