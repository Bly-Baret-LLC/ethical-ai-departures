import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetCompanies = vi.fn()

vi.mock("@/lib/queries/companies", () => ({
  getCompanies: (...args: unknown[]) => mockGetCompanies(...args),
}))

import CompaniesPage from "./page"

const mockCompanies = [
  {
    company: "OpenAI",
    slug: "openai",
    count: 5,
    evidenceLinkedCount: 4,
    contextualCount: 1,
    allegedCount: 0,
    eventCount: 1,
  },
  {
    company: "Anthropic",
    slug: "anthropic",
    count: 2,
    evidenceLinkedCount: 2,
    contextualCount: 0,
    allegedCount: 0,
    eventCount: 0,
  },
]

beforeEach(() => {
  mockGetCompanies.mockResolvedValue(mockCompanies)
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("CompaniesPage", () => {
  it("renders heading", async () => {
    const jsx = await CompaniesPage()
    render(jsx)
    expect(screen.getByRole("heading", { name: "Companies" })).toBeInTheDocument()
  })

  it("renders company list with counts", async () => {
    const jsx = await CompaniesPage()
    render(jsx)
    expect(screen.getByText("OpenAI")).toBeInTheDocument()
    expect(screen.getByText("4 evidence-linked")).toBeInTheDocument()
    expect(screen.getByText("1 organizational event")).toBeInTheDocument()
    expect(screen.getByText("Anthropic")).toBeInTheDocument()
    expect(screen.getByText("2 evidence-linked")).toBeInTheDocument()
  })

  it("links to company detail pages", async () => {
    const jsx = await CompaniesPage()
    render(jsx)
    const link = screen.getByRole("link", { name: /OpenAI/ })
    expect(link).toHaveAttribute("href", "/companies/openai")
  })

  it("shows error on fetch failure", async () => {
    mockGetCompanies.mockRejectedValueOnce(new Error("fail"))
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    const jsx = await CompaniesPage()
    render(jsx)
    expect(screen.getByText(/Unable to load companies/)).toBeInTheDocument()
    spy.mockRestore()
  })
})
