import { describe, it, expect } from "vitest"
import {
  EVIDENCE_LABELS,
  DEPARTURE_TYPE_LABELS,
  isHeadlineCounted,
  headlineCount,
  contextualCount,
  allegedCount,
  profileTitle,
  type MotiveEvidence,
} from "./evidence"

const p = (motiveEvidence: MotiveEvidence, headlineCounted: boolean) => ({
  motiveEvidence,
  headlineCounted,
})

describe("evidence model (remediation brief QA §8.1)", () => {
  it("contextual records are never headline-counted, even when flagged", () => {
    expect(isHeadlineCounted(p("contextual", true))).toBe(false)
    expect(isHeadlineCounted(p("contextual", false))).toBe(false)
  })

  it("alleged records are never headline-counted, even when flagged", () => {
    expect(isHeadlineCounted(p("alleged", true))).toBe(false)
  })

  it("direct and reported records count only when flagged", () => {
    expect(isHeadlineCounted(p("direct", true))).toBe(true)
    expect(isHeadlineCounted(p("reported", true))).toBe(true)
    expect(isHeadlineCounted(p("direct", false))).toBe(false)
    expect(isHeadlineCounted(p("reported", false))).toBe(false)
  })

  it("all public counts reconcile with the canonical selector", () => {
    const profiles = [
      p("direct", true),
      p("direct", true),
      p("reported", true),
      p("alleged", false),
      p("contextual", false),
      p("contextual", true), // invalid combination must still not count
    ]
    expect(headlineCount(profiles)).toBe(3)
    expect(allegedCount(profiles)).toBe(1)
    expect(contextualCount(profiles)).toBe(2)
    // Every record is exactly one of: headline, alleged, contextual, or
    // direct/reported-but-unflagged (excluded pending review).
    const unflagged = profiles.filter(
      (x) =>
        (x.motiveEvidence === "direct" || x.motiveEvidence === "reported") &&
        !isHeadlineCounted(x)
    ).length
    expect(
      headlineCount(profiles) +
        allegedCount(profiles) +
        contextualCount(profiles) +
        unflagged
    ).toBe(profiles.length)
  })

  it("exposes the four public evidence labels from the brief", () => {
    expect(EVIDENCE_LABELS.direct).toBe("Explicitly stated")
    expect(EVIDENCE_LABELS.reported).toBe("Reported connection")
    expect(EVIDENCE_LABELS.alleged).toBe("Alleged retaliation")
    expect(EVIDENCE_LABELS.contextual).toBe("Context only")
  })
})

describe("neutral profile titles (SITE-06)", () => {
  it("uses the neutral departure format", () => {
    expect(profileTitle("Timnit Gebru", "Google", 2020)).toBe(
      "Timnit Gebru — Departure from Google (2020)"
    )
  })

  it("never uses 'quit' for any departure type", () => {
    // The title function is departure-type independent by design; fired and
    // laid-off records get the same neutral wording.
    const title = profileTitle("Ryan Beiermeister", "OpenAI", 2026)
    expect(title.toLowerCase()).not.toContain("quit")
    expect(title.toLowerCase()).not.toContain("why they left")
  })

  it("labels every departure type without 'quit' language", () => {
    for (const label of Object.values(DEPARTURE_TYPE_LABELS)) {
      expect(label.toLowerCase()).not.toContain("quit")
    }
  })
})
