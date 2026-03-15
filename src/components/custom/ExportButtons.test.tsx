import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { ExportButtons } from "./ExportButtons"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import type { FilterState } from "@/hooks/useProfileFilters"

const mockDownloadFile = vi.fn()

vi.mock("@/lib/utils/export", async () => {
  const actual = await vi.importActual<typeof import("@/lib/utils/export")>("@/lib/utils/export")
  return {
    ...actual,
    downloadFile: (...args: unknown[]) => mockDownloadFile(...args),
  }
})

const mockProfiles: ProfileWithTags[] = [
  {
    id: "b0000000-0000-4000-8000-000000000001",
    slug: "elena-rodriguez",
    name: "Elena Rodriguez",
    photoUrl: null,
    company: "OpenAI",
    role: "Safety Lead",
    departureDate: "2025-11-15",
    statedReason: "Safety concerns deprioritized.",
    status: "published",
    createdAt: "2025-11-20T00:00:00Z",
    updatedAt: "2025-11-20T00:00:00Z",
    concernTags: [
      { id: "c1", name: "Safety Deprioritization", slug: "safety-deprioritization" },
    ],
  },
]

const defaultFilters: FilterState = {
  company: [],
  year: [],
  concern: [],
  sort: "date",
  view: "card",
  q: "",
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("ExportButtons", () => {
  it("renders CSV and JSON export buttons", () => {
    render(<ExportButtons profiles={mockProfiles} filters={defaultFilters} />)

    expect(screen.getByRole("button", { name: "Export CSV" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Export JSON" })).toBeInTheDocument()
  })

  it("renders nothing when profiles are empty", () => {
    const { container } = render(<ExportButtons profiles={[]} filters={defaultFilters} />)
    expect(container.innerHTML).toBe("")
  })

  it("calls downloadFile with CSV content on CSV button click", () => {
    render(<ExportButtons profiles={mockProfiles} filters={defaultFilters} />)

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }))

    expect(mockDownloadFile).toHaveBeenCalledTimes(1)
    const [content, filename, mime] = mockDownloadFile.mock.calls[0]
    expect(content).toContain("Name,Company")
    expect(content).toContain("Elena Rodriguez")
    expect(filename).toBe("warning-collective.csv")
    expect(mime).toContain("text/csv")
  })

  it("calls downloadFile with JSON content on JSON button click", () => {
    render(<ExportButtons profiles={mockProfiles} filters={defaultFilters} />)

    fireEvent.click(screen.getByRole("button", { name: "Export JSON" }))

    expect(mockDownloadFile).toHaveBeenCalledTimes(1)
    const [content, filename, mime] = mockDownloadFile.mock.calls[0]
    const parsed = JSON.parse(content)
    expect(parsed[0].name).toBe("Elena Rodriguez")
    expect(filename).toBe("warning-collective.json")
    expect(mime).toContain("application/json")
  })

  it("includes filter in filename when single company selected", () => {
    const filters = { ...defaultFilters, company: ["OpenAI"] }
    render(<ExportButtons profiles={mockProfiles} filters={filters} />)

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }))

    const [, filename] = mockDownloadFile.mock.calls[0]
    expect(filename).toBe("warning-collective-openai.csv")
  })

  it("has accessible group role", () => {
    render(<ExportButtons profiles={mockProfiles} filters={defaultFilters} />)

    expect(screen.getByRole("group", { name: "Export data" })).toBeInTheDocument()
  })
})
