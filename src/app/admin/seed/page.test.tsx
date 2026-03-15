import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("./SeedForm", () => ({
  SeedForm: () => <div data-testid="seed-form" />,
}))

import SeedPage from "./page"

afterEach(cleanup)

describe("SeedPage", () => {
  it("renders heading", () => {
    render(<SeedPage />)
    expect(screen.getByRole("heading", { name: /Content Seeding Tool/ })).toBeInTheDocument()
  })

  it("renders seed form", () => {
    render(<SeedPage />)
    expect(screen.getByTestId("seed-form")).toBeInTheDocument()
  })
})
