import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react"
import { InsiderVoteBar } from "./InsiderVoteBar"

vi.mock("@/lib/actions/votes", () => ({
  castVote: vi.fn(),
  generateFingerprint: vi.fn().mockReturnValue("abc123"),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, "localStorage", { value: localStorageMock })

afterEach(cleanup)

beforeEach(() => {
  localStorageMock.clear()
  vi.clearAllMocks()
})

describe("InsiderVoteBar", () => {
  it("renders vote bar", () => {
    render(<InsiderVoteBar predictionId="p1" initialAgree={5} initialDisagree={3} />)
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("shows vote counts", () => {
    render(<InsiderVoteBar predictionId="p1" initialAgree={7} initialDisagree={3} />)
    expect(screen.getByText(/70% agree/)).toBeInTheDocument()
    expect(screen.getByText(/10 votes/)).toBeInTheDocument()
  })

  it("shows no votes message when empty", () => {
    render(<InsiderVoteBar predictionId="p1" initialAgree={0} initialDisagree={0} />)
    expect(screen.getByText("No votes yet")).toBeInTheDocument()
  })

  it("renders vote buttons", () => {
    render(<InsiderVoteBar predictionId="p1" initialAgree={0} initialDisagree={0} />)
    expect(screen.getByRole("button", { name: "Likely true" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Unlikely true" })).toBeInTheDocument()
  })

  it("shows insider gate when voting without verification", async () => {
    render(<InsiderVoteBar predictionId="p1" initialAgree={0} initialDisagree={0} />)
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Likely true" }))
    })
    expect(screen.getByText(/Insider Voting/)).toBeInTheDocument()
    expect(screen.getByText(/AI industry professionals/)).toBeInTheDocument()
  })

  it("shows dismiss button on insider gate", async () => {
    render(<InsiderVoteBar predictionId="p1" initialAgree={0} initialDisagree={0} />)
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Likely true" }))
    })
    expect(screen.getByText("Dismiss")).toBeInTheDocument()
  })

  it("shows correct percentage with accessibility attributes", () => {
    render(<InsiderVoteBar predictionId="p1" initialAgree={3} initialDisagree={7} />)
    const bar = screen.getByRole("progressbar")
    expect(bar).toHaveAttribute("aria-valuenow", "30")
    expect(bar).toHaveAttribute("aria-label", "30% agree")
  })
})
