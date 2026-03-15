import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react"
import { SearchInput } from "./SearchInput"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("SearchInput", () => {
  it("renders with placeholder", () => {
    render(<SearchInput value="" onChange={vi.fn()} />)

    expect(
      screen.getByPlaceholderText("Search profiles...")
    ).toBeInTheDocument()
  })

  it("renders with initial value", () => {
    render(<SearchInput value="openai" onChange={vi.fn()} />)

    const input = screen.getByRole("searchbox")
    expect(input).toHaveValue("openai")
  })

  it("calls onChange after debounce", () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} debounceMs={200} />)

    const input = screen.getByRole("searchbox")
    fireEvent.change(input, { target: { value: "safety" } })

    // Not called immediately
    expect(onChange).not.toHaveBeenCalled()

    // Called after debounce
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(onChange).toHaveBeenCalledWith("safety")
  })

  it("shows clear button when value exists", () => {
    render(<SearchInput value="test" onChange={vi.fn()} />)

    expect(screen.getByLabelText("Clear search")).toBeInTheDocument()
  })

  it("hides clear button when value is empty", () => {
    render(<SearchInput value="" onChange={vi.fn()} />)

    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument()
  })

  it("clears immediately on clear button click", () => {
    const onChange = vi.fn()
    render(<SearchInput value="test" onChange={onChange} />)

    fireEvent.click(screen.getByLabelText("Clear search"))

    expect(onChange).toHaveBeenCalledWith("")
  })

  it("has search aria-label", () => {
    render(<SearchInput value="" onChange={vi.fn()} />)

    expect(
      screen.getByRole("searchbox", { name: "Search profiles" })
    ).toBeInTheDocument()
  })
})
