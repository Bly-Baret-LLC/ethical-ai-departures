import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { Pagination } from "./Pagination"

afterEach(() => {
  cleanup()
})

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} basePath="/profiles" />
    )
    expect(container.innerHTML).toBe("")
  })

  it("renders page numbers and navigation", () => {
    render(
      <Pagination currentPage={2} totalPages={3} basePath="/profiles" />
    )

    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("Prev")).toBeInTheDocument()
    expect(screen.getByText("Next")).toBeInTheDocument()
  })

  it("highlights current page with aria-current", () => {
    render(
      <Pagination currentPage={2} totalPages={3} basePath="/profiles" />
    )

    const currentPage = screen.getByText("2")
    expect(currentPage).toHaveAttribute("aria-current", "page")
    expect(currentPage.tagName).toBe("SPAN")
  })

  it("disables Prev on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={3} basePath="/profiles" />
    )

    const prev = screen.getByText("Prev")
    expect(prev).toHaveAttribute("aria-disabled", "true")
    expect(prev.tagName).toBe("SPAN")
  })

  it("disables Next on last page", () => {
    render(
      <Pagination currentPage={3} totalPages={3} basePath="/profiles" />
    )

    const next = screen.getByText("Next")
    expect(next).toHaveAttribute("aria-disabled", "true")
    expect(next.tagName).toBe("SPAN")
  })

  it("links Prev to previous page", () => {
    render(
      <Pagination currentPage={2} totalPages={3} basePath="/profiles" />
    )

    const prev = screen.getByLabelText("Previous page")
    expect(prev).toHaveAttribute("href", "/profiles")
  })

  it("links Next to next page", () => {
    render(
      <Pagination currentPage={2} totalPages={3} basePath="/profiles" />
    )

    const next = screen.getByLabelText("Next page")
    expect(next).toHaveAttribute("href", "/profiles?page=3")
  })

  it("preserves search params in links", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        basePath="/profiles"
        searchParams={{ sort: "name" }}
      />
    )

    const next = screen.getByLabelText("Next page")
    expect(next).toHaveAttribute("href", "/profiles?sort=name&page=2")
  })

  it("omits page param for page 1", () => {
    render(
      <Pagination currentPage={2} totalPages={3} basePath="/profiles" />
    )

    const page1 = screen.getByText("1")
    expect(page1).toHaveAttribute("href", "/profiles")
  })

  it("has pagination nav landmark", () => {
    render(
      <Pagination currentPage={1} totalPages={3} basePath="/profiles" />
    )

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument()
  })
})
