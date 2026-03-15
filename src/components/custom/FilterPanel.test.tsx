import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { FilterPanel } from "./FilterPanel"
import type { FilterOption, FilterState } from "@/hooks/useProfileFilters"

afterEach(() => {
  cleanup()
})

const defaultCompanies: FilterOption[] = [
  { value: "openai", label: "OpenAI", count: 5 },
  { value: "google", label: "Google", count: 3 },
]

const defaultYears: FilterOption[] = [
  { value: "2026", label: "2026", count: 4 },
  { value: "2025", label: "2025", count: 6 },
]

const defaultConcerns: FilterOption[] = [
  { value: "safety", label: "Safety", count: 7 },
]

const defaultFilters: FilterState = {
  company: [],
  year: [],
  concern: [],
  sort: "date",
  view: "card",
  q: "",
}

describe("FilterPanel", () => {
  it("renders filter sections", () => {
    render(
      <FilterPanel
        companies={defaultCompanies}
        years={defaultYears}
        concerns={defaultConcerns}
        filters={defaultFilters}
        onToggleFilter={vi.fn()}
        onClearAll={vi.fn()}
        hasActiveFilters={false}
      />
    )

    expect(screen.getByText("Company")).toBeInTheDocument()
    expect(screen.getByText("Year")).toBeInTheDocument()
    expect(screen.getByText("Concern")).toBeInTheDocument()
  })

  it("renders filter options with counts", () => {
    render(
      <FilterPanel
        companies={defaultCompanies}
        years={defaultYears}
        concerns={defaultConcerns}
        filters={defaultFilters}
        onToggleFilter={vi.fn()}
        onClearAll={vi.fn()}
        hasActiveFilters={false}
      />
    )

    // Desktop sidebar renders all options
    expect(screen.getByText("OpenAI")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
    expect(screen.getByText("Google")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("calls onToggleFilter when option clicked", () => {
    const onToggle = vi.fn()
    render(
      <FilterPanel
        companies={defaultCompanies}
        years={defaultYears}
        concerns={defaultConcerns}
        filters={defaultFilters}
        onToggleFilter={onToggle}
        onClearAll={vi.fn()}
        hasActiveFilters={false}
      />
    )

    // Click the desktop sidebar version (there are two instances - mobile + desktop)
    const openaiButtons = screen.getAllByText("OpenAI")
    fireEvent.click(openaiButtons[openaiButtons.length - 1])

    expect(onToggle).toHaveBeenCalledWith("company", "openai")
  })

  it("shows Clear all button when filters are active", () => {
    render(
      <FilterPanel
        companies={defaultCompanies}
        years={defaultYears}
        concerns={defaultConcerns}
        filters={{ ...defaultFilters, company: ["openai"] }}
        onToggleFilter={vi.fn()}
        onClearAll={vi.fn()}
        hasActiveFilters={true}
      />
    )

    expect(screen.getAllByText("Clear all filters").length).toBeGreaterThan(0)
  })

  it("does not show Clear all when no active filters", () => {
    render(
      <FilterPanel
        companies={defaultCompanies}
        years={defaultYears}
        concerns={defaultConcerns}
        filters={defaultFilters}
        onToggleFilter={vi.fn()}
        onClearAll={vi.fn()}
        hasActiveFilters={false}
      />
    )

    expect(screen.queryByText("Clear all filters")).not.toBeInTheDocument()
  })

  it("highlights selected filter with aria-pressed", () => {
    render(
      <FilterPanel
        companies={defaultCompanies}
        years={defaultYears}
        concerns={defaultConcerns}
        filters={{ ...defaultFilters, company: ["openai"] }}
        onToggleFilter={vi.fn()}
        onClearAll={vi.fn()}
        hasActiveFilters={true}
      />
    )

    const pressedButtons = screen.getAllByRole("button", { pressed: true })
    expect(pressedButtons.length).toBeGreaterThan(0)
    expect(pressedButtons[0]).toHaveTextContent("OpenAI")
  })
})
