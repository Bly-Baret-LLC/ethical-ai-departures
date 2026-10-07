import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, within } from "@testing-library/react"
import { getConcernGuide } from "@/data/concern-guides"

const getConcern = vi.hoisted(() => vi.fn())
vi.mock("@/lib/queries/concerns", () => ({ getConcernBySlug: getConcern }))
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND") } }))

import ConcernPage, { generateMetadata } from "./page"

afterEach(() => { cleanup(); vi.clearAllMocks() })
const params = Promise.resolve({ slug: "safety-deprioritization" })

describe("ConcernPage", () => {
  it("renders the main count and allegations in separate, linked sections", async () => {
    const record = {
      name: "Researcher One", slug: "researcher-one", role: "Researcher",
      company: "Example Lab", motiveEvidence: "direct", statedReason: "Safety priorities",
    }
    getConcern.mockResolvedValue({
      guide: getConcernGuide("safety-deprioritization"),
      evidenceLinked: [record],
      alleged: [{ ...record, name: "Researcher Two", slug: "researcher-two", motiveEvidence: "alleged" }],
    })
    render(await ConcernPage({ params }))
    const primary = screen.getByRole("region", { name: "The departures" })
    const allegations = screen.getByRole("region", { name: "Unresolved allegations" })
    expect(within(primary).getByText(/1 documented departure\./)).toBeInTheDocument()
    expect(within(primary).queryByText("Researcher Two")).not.toBeInTheDocument()
    expect(within(allegations).getByRole("link", { name: "Researcher Two" }))
      .toHaveAttribute("href", "/profiles/researcher-two")
    expect(within(primary).getByRole("link", { name: "Profile and sources →" }))
      .toHaveAttribute("href", "/profiles/researcher-one#sources")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("When AI safety becomes a reason to leave")
    expect(screen.getByRole("link", { name: "Safety culture" }))
      .toHaveAttribute("href", "https://x.com/janleike/status/1791498184671605209")
    expect(screen.getByText(/They are not included in the count above/)).toBeInTheDocument()
  })

  it.each([
    {
      slug: "inadequate-oversight",
      title: "Who holds AI companies to account?",
      attribution: "Krueger’s statements, May 22, 2024",
      sourceLabel: "Accountability and policy",
      sourceUrl: "https://x.com/GretchenMarina/status/1793403478158836140",
    },
    {
      slug: "lack-of-transparency",
      title: "AI transparency and the freedom to publish",
      attribution: "Brundage’s account, October 23, 2024",
      sourceLabel: "Why he was leaving OpenAI",
      sourceUrl: "https://milesbrundage.substack.com/p/why-im-leaving-openai-and-what-im",
    },
  ])("gives $slug its own sourced opening and consistent evidence language", async ({ slug, title, attribution, sourceLabel, sourceUrl }) => {
    getConcern.mockResolvedValue({
      guide: getConcernGuide(slug), evidenceLinked: [], alleged: [],
    })
    render(await ConcernPage({ params: Promise.resolve({ slug }) }))
    expect(screen.getByRole("region", { name: "The departures" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title)
    expect(document.getElementById("introduction-sources")).toHaveTextContent(attribution)
    expect(screen.getByRole("link", { name: sourceLabel })).toHaveAttribute("href", sourceUrl)
    expect(screen.getByText(/0 documented departures\./)).toBeInTheDocument()
    expect(screen.getByText(/They are not included in the count above/)).toBeInTheDocument()
    expect(screen.queryByText(/Leike’s statements/)).not.toBeInTheDocument()
  })

  it("uses the revised empty-state copy without inventing departures", async () => {
    getConcern.mockResolvedValue({
      guide: getConcernGuide("safety-deprioritization"), evidenceLinked: [], alleged: [],
    })
    render(await ConcernPage({ params }))
    expect(screen.getByText(/0 documented departures\./)).toBeInTheDocument()
    expect(screen.getByText(/No departures are currently listed here/)).toBeInTheDocument()
    expect(screen.getByText("No unresolved allegations are listed for this topic.")).toBeInTheDocument()
  })

  it("returns a real not-found response for unknown topics", async () => {
    getConcern.mockResolvedValue(null)
    await expect(ConcernPage({ params: Promise.resolve({ slug: "missing" }) }))
      .rejects.toThrow("NEXT_NOT_FOUND")
  })

  it.each(["safety-deprioritization", "inadequate-oversight", "lack-of-transparency"])("gives %s its own canonical destination and editorial title", async (slug) => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug }) })
    expect(metadata.title).toBe(getConcernGuide(slug)?.title)
    expect(metadata.alternates?.canonical).toBe(`https://ethicalaidepartures.fyi/concerns/${slug}`)
    expect(metadata.openGraph).toMatchObject({ url: metadata.alternates?.canonical })
  })
})
