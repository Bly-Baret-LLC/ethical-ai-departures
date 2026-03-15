import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { Avatar } from "./Avatar"

afterEach(() => {
  cleanup()
})

describe("Avatar", () => {
  it("renders photo when photoUrl is provided", () => {
    render(<Avatar name="Elena Rodriguez" photoUrl="https://example.com/photo.jpg" />)

    const img = screen.getByRole("img")
    expect(img).toHaveAttribute("alt", "Elena Rodriguez")
    expect(img.getAttribute("src")).toContain("photo.jpg")
  })

  it("renders initials when photoUrl is null", () => {
    render(<Avatar name="Elena Rodriguez" photoUrl={null} />)

    expect(screen.getByText("ER")).toBeInTheDocument()
  })

  it("renders single initial for single name", () => {
    render(<Avatar name="Elena" photoUrl={null} />)

    expect(screen.getByText("E")).toBeInTheDocument()
  })

  it("renders initials fallback as aria-hidden", () => {
    render(<Avatar name="Marcus Chen" photoUrl={null} />)

    const initialsDiv = screen.getByText("MC")
    expect(initialsDiv).toHaveAttribute("aria-hidden", "true")
  })

  it("respects custom size", () => {
    render(<Avatar name="Sarah Okafor" photoUrl={null} size={48} />)

    const initialsDiv = screen.getByText("SO")
    expect(initialsDiv).toHaveStyle({ width: "48px", height: "48px" })
  })
})
