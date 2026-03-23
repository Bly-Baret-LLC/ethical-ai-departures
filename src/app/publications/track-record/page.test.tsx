import { describe, it, expect, vi } from "vitest"

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))

import TrackRecordRedirect from "./page"
import { redirect } from "next/navigation"

describe("TrackRecordRedirect", () => {
  it("redirects to /publications?tab=predictions", () => {
    TrackRecordRedirect()
    expect(redirect).toHaveBeenCalledWith("/publications?tab=predictions")
  })
})
