import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, within } from "@testing-library/react"
import PressPage from "./page"

vi.mock("@/components/custom/ContactButton", () => ({
  ContactButton: () => <button>Media Inquiries</button>,
}))

afterEach(cleanup)

function renderExpandedCitations() {
  render(<PressPage />)
  const details = screen.getByText("Where our work is cited").closest("details")!
  details.open = true
  return details
}

describe("Press citations", () => {
  it("starts collapsed below the referencing guidelines and above media inquiries", () => {
    render(<PressPage />)
    const summary = screen.getByText("Where our work is cited")
    expect(summary).toHaveClass("text-base", "font-medium", "text-text-primary")
    const details = summary.closest("details")!
    expect(details).not.toHaveAttribute("open")
    expect(details.previousElementSibling).toHaveTextContent("Embedding & Referencing")
    expect(details.nextElementSibling).toHaveTextContent("Media Inquiries")
  })

  it("groups the verified citations into three dated entries", () => {
    const section = renderExpandedCitations()
    expect(within(section).getAllByRole("listitem")).toHaveLength(3)
    expect(within(section).getAllByText("October 14, 2026")).toHaveLength(2)
    expect(within(section).getByText("September 9, 2026")).toBeInTheDocument()
    expect(section.querySelectorAll('time[datetime="2026-10-14"]')).toHaveLength(2)
  })

  it("links all seven complaints directly to citation pages", () => {
    renderExpandedCitations()
    const links = screen.getAllByRole("link", { name: /complaint \(PDF\)/ })
    expect(links).toHaveLength(7)
    for (const link of links) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\/www.justsecurity.org\/wp-content\/uploads\/2026\/10\/.+\.pdf#page=\d+$/)
    }
    expect(screen.getByRole("link", { name: /West Virginia complaint/ })).toHaveAttribute("href", "https://www.justsecurity.org/wp-content/uploads/2026/10/West-Virginia.pdf#page=59")
  })

  it("links to the original essay and reporting without repeating historical counts", () => {
    const section = renderExpandedCitations()
    expect(screen.getByRole("link", { name: /Zvi Mowshowitz/ })).toHaveAttribute("href", "https://thezvi.substack.com/p/the-safety-culture-at-the-labs-is")
    expect(screen.getByRole("link", { name: /ThePrint/ })).toHaveAttribute("href", "https://theprint.in/tech/this-isnt-a-marketing-stunt-ai-could-kill-all-humans-anthropic-researcher-quits-sounds-alarm/3038001/")
    expect(section).not.toHaveTextContent(/46|68|endorsed|trusted by/i)
  })
})
