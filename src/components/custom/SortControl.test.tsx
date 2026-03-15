import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { SortControl } from "./SortControl"

afterEach(() => {
  cleanup()
})

describe("SortControl", () => {
  it("renders Date and Name options", () => {
    render(
      <SortControl activeSort="date" basePath="/profiles" />
    )

    expect(screen.getByText("Date")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
  })

  it("highlights active sort option with aria-current", () => {
    render(
      <SortControl activeSort="date" basePath="/profiles" />
    )

    const dateOption = screen.getByText("Date")
    expect(dateOption).toHaveAttribute("aria-current", "true")
    expect(dateOption.tagName).toBe("SPAN")
  })

  it("renders inactive option as link", () => {
    render(
      <SortControl activeSort="date" basePath="/profiles" />
    )

    const nameOption = screen.getByText("Name")
    expect(nameOption.tagName).toBe("A")
    expect(nameOption).toHaveAttribute("href", "/profiles?sort=name")
  })

  it("omits sort param for date (default)", () => {
    render(
      <SortControl activeSort="name" basePath="/profiles" />
    )

    const dateOption = screen.getByText("Date")
    expect(dateOption).toHaveAttribute("href", "/profiles")
  })

  it("resets page when changing sort", () => {
    render(
      <SortControl
        activeSort="date"
        basePath="/profiles"
        searchParams={{ page: "3" }}
      />
    )

    const nameOption = screen.getByText("Name")
    // page should be removed from URL
    expect(nameOption).toHaveAttribute("href", "/profiles?sort=name")
  })

  it("has sort group aria-label", () => {
    render(
      <SortControl activeSort="date" basePath="/profiles" />
    )

    expect(screen.getByRole("group", { name: "Sort profiles" })).toBeInTheDocument()
  })
})
