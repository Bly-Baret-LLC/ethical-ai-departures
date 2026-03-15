import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetAgentLogs = vi.fn()
const mockGetAgentMetrics = vi.fn()

vi.mock("@/lib/queries/agent-logs", () => ({
  getAgentLogs: (...args: unknown[]) => mockGetAgentLogs(...args),
  getAgentMetrics: (...args: unknown[]) => mockGetAgentMetrics(...args),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import AgentDashboardPage from "./page"

afterEach(cleanup)

describe("AgentDashboardPage", () => {
  it("renders heading", async () => {
    mockGetAgentLogs.mockResolvedValue([])
    mockGetAgentMetrics.mockResolvedValue([])
    const jsx = await AgentDashboardPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByRole("heading", { name: /Agent Pipeline/ })).toBeInTheDocument()
  })

  it("shows empty state when no logs", async () => {
    mockGetAgentLogs.mockResolvedValue([])
    mockGetAgentMetrics.mockResolvedValue([])
    const jsx = await AgentDashboardPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText(/No agent activity yet/)).toBeInTheDocument()
  })

  it("shows agent logs", async () => {
    mockGetAgentLogs.mockResolvedValue([
      {
        id: "log1",
        agentName: "scout",
        actionType: "crawl",
        status: "success",
        inputSummary: null,
        outputSummary: "Found 3 signals",
        confidenceScore: 0.85,
        errorDetail: null,
        durationMs: 12000,
        createdAt: "2026-01-15T10:00:00Z",
      },
    ])
    mockGetAgentMetrics.mockResolvedValue([])
    const jsx = await AgentDashboardPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    // "Scout" appears both in filter link and log entry
    expect(screen.getAllByText("Scout").length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText("Found 3 signals")).toBeInTheDocument()
    expect(screen.getByText("85% conf")).toBeInTheDocument()
  })

  it("shows metrics cards", async () => {
    mockGetAgentLogs.mockResolvedValue([])
    mockGetAgentMetrics.mockResolvedValue([
      {
        agentName: "scout",
        totalRuns: 50,
        successRate: 92,
        avgConfidence: 0.78,
        avgDurationMs: 15000,
        errorCount: 4,
      },
    ])
    const jsx = await AgentDashboardPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText("92%")).toBeInTheDocument()
    expect(screen.getByText("50 runs")).toBeInTheDocument()
    expect(screen.getByText(/4 errors/)).toBeInTheDocument()
  })

  it("shows filter buttons", async () => {
    mockGetAgentLogs.mockResolvedValue([])
    mockGetAgentMetrics.mockResolvedValue([])
    const jsx = await AgentDashboardPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText("All")).toBeInTheDocument()
    expect(screen.getByText("Errors")).toBeInTheDocument()
  })

  it("renders error logs with error detail", async () => {
    mockGetAgentLogs.mockResolvedValue([
      {
        id: "log2",
        agentName: "verification",
        actionType: "verify",
        status: "error",
        inputSummary: null,
        outputSummary: null,
        confidenceScore: null,
        errorDetail: "API timeout after 30s",
        durationMs: 30000,
        createdAt: "2026-01-15T10:00:00Z",
      },
    ])
    mockGetAgentMetrics.mockResolvedValue([])
    const jsx = await AgentDashboardPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText("API timeout after 30s")).toBeInTheDocument()
    expect(screen.getByText("error")).toBeInTheDocument()
  })
})
