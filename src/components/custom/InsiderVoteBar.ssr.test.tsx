// @vitest-environment node
import { describe, expect, it, vi } from "vitest"
import { renderToString } from "react-dom/server"
import { InsiderVoteBar } from "./InsiderVoteBar"
import { generateFingerprint } from "@/lib/fingerprint"

vi.mock("@/lib/actions/votes", () => ({ castVote: vi.fn() }))
vi.mock("@/lib/fingerprint", () => ({ generateFingerprint: vi.fn() }))

describe("InsiderVoteBar server render", () => {
  it("does not access browser screen dimensions when Node exposes navigator", () => {
    vi.stubGlobal("navigator", { userAgent: "Node.js", language: "en-US" })
    try {
      expect(renderToString(<InsiderVoteBar predictionId="test" initialAgree={0} initialDisagree={0} />)).toContain("No votes yet")
      expect(generateFingerprint).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
