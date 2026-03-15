import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetSignalCounts = vi.fn()

vi.mock("@/lib/actions/signals", () => ({
  getSignalCounts: (...args: unknown[]) => mockGetSignalCounts(...args),
  submitSignal: vi.fn(),
}))

vi.mock("./SignalForm", () => ({
  SignalForm: () => <div data-testid="signal-form" />,
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import SignalPage from "./page"

afterEach(cleanup)

describe("SignalPage", () => {
  it("renders heading", async () => {
    mockGetSignalCounts.mockResolvedValue({ total: 0, byCategory: [] })
    const jsx = await SignalPage()
    render(jsx)
    expect(screen.getByRole("heading", { name: /Anonymous Signal/ })).toBeInTheDocument()
  })

  it("shows privacy disclosure", async () => {
    mockGetSignalCounts.mockResolvedValue({ total: 0, byCategory: [] })
    const jsx = await SignalPage()
    render(jsx)
    expect(screen.getByText(/What we collect/)).toBeInTheDocument()
    expect(screen.getByText(/IP addresses/)).toBeInTheDocument()
  })

  it("shows signal count when available", async () => {
    mockGetSignalCounts.mockResolvedValue({
      total: 47,
      byCategory: [{ category: "Safety culture", count: 25 }],
    })
    const jsx = await SignalPage()
    render(jsx)
    expect(screen.getByText("47")).toBeInTheDocument()
    expect(screen.getByText(/Safety culture/)).toBeInTheDocument()
  })

  it("renders signal form", async () => {
    mockGetSignalCounts.mockResolvedValue({ total: 0, byCategory: [] })
    const jsx = await SignalPage()
    render(jsx)
    expect(screen.getByTestId("signal-form")).toBeInTheDocument()
  })
})
