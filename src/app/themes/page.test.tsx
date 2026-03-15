import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetThemeData = vi.fn()

vi.mock("@/lib/queries/themes", () => ({
  getThemeData: (...args: unknown[]) => mockGetThemeData(...args),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import ThemesPage from "./page"

afterEach(cleanup)

describe("ThemesPage", () => {
  it("renders heading", async () => {
    mockGetThemeData.mockResolvedValue([])
    const jsx = await ThemesPage()
    render(jsx)
    expect(screen.getByRole("heading", { name: /Theme Map/ })).toBeInTheDocument()
  })

  it("shows empty state", async () => {
    mockGetThemeData.mockResolvedValue([])
    const jsx = await ThemesPage()
    render(jsx)
    expect(screen.getByText(/Theme data will appear/)).toBeInTheDocument()
  })

  it("renders themes with counts", async () => {
    mockGetThemeData.mockResolvedValue([
      { slug: "safety", name: "Safety Culture", count: 5, recentCount: 2, trend: "up", companies: [{ company: "OpenAI", count: 3 }] },
    ])
    const jsx = await ThemesPage()
    render(jsx)
    // "Safety Culture" appears in both theme map and breakdown
    expect(screen.getAllByText("Safety Culture").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/5 profiles/)).toBeInTheDocument()
  })
})
