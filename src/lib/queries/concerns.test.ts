import { beforeEach, describe, expect, it, vi } from "vitest"
import { profileWithTagsSchema } from "@/lib/schemas/profile"
import { concernHref } from "@/data/concern-guides"

const mockGetPublishedProfiles = vi.hoisted(() => vi.fn())
vi.mock("./profiles", () => ({ getPublishedProfiles: mockGetPublishedProfiles }))

import { getConcernBySlug, selectConcernProfiles } from "./concerns"

export function concernProfile(overrides: Record<string, unknown> = {}) {
  return profileWithTagsSchema.parse({
    id: "00000000-0000-4000-8000-000000000001",
    slug: "example-person",
    name: "Example Person",
    photo_url: null,
    company: "Example Lab",
    role: "Researcher",
    departure_date: "2024-05-01",
    stated_reason: null,
    status: "published",
    motive_evidence: "direct",
    headline_counted: true,
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    profile_concern_tags: [{ concern_tags: {
      id: "00000000-0000-4000-8000-000000000002",
      slug: "safety-deprioritization",
      name: "Safety Deprioritization",
    } }],
    ...overrides,
  })
}

beforeEach(() => vi.clearAllMocks())

describe("concern discovery", () => {
  it("keeps allegations separate and excludes draft, contextual and uncounted records", () => {
    const result = selectConcernProfiles([
      concernProfile({ slug: "direct" }),
      concernProfile({ slug: "reported", motive_evidence: "reported" }),
      concernProfile({ slug: "alleged", motive_evidence: "alleged" }),
      concernProfile({ slug: "contextual", motive_evidence: "contextual" }),
      concernProfile({ slug: "uncounted", headline_counted: false }),
      concernProfile({ slug: "draft", status: "draft" }),
      concernProfile({ slug: "other-topic", profile_concern_tags: [] }),
    ], "safety-deprioritization")
    expect(result.evidenceLinked.map((p) => p.slug)).toEqual(["direct", "reported"])
    expect(result.alleged.map((p) => p.slug)).toEqual(["alleged"])
  })

  it("does not fetch data for unknown guide URLs", async () => {
    expect(await getConcernBySlug("not-a-concern")).toBeNull()
    expect(mockGetPublishedProfiles).not.toHaveBeenCalled()
  })

  it("propagates data errors instead of presenting a false zero", async () => {
    mockGetPublishedProfiles.mockRejectedValue(new Error("database unavailable"))
    await expect(getConcernBySlug("safety-deprioritization")).rejects.toThrow("database unavailable")
  })

  it("preserves the allegations view and keeps unimplemented topics in the directory", () => {
    expect(concernHref("safety-deprioritization", "&evidence=alleged"))
      .toBe("/concerns/safety-deprioritization#allegations")
    expect(concernHref("military-applications", "&evidence=alleged"))
      .toBe("/?concern=military-applications&evidence=alleged")
  })
})
