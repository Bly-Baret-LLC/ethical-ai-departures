import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import OrganizationalEventsPage from "./page"

afterEach(cleanup)

describe("OrganizationalEventsPage", () => {
  it("separates organizational events from individual departure motives", () => {
    render(<OrganizationalEventsPage />)

    expect(
      screen.getByRole("heading", { name: "Organizational Events" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Superalignment team dissolved" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Responsible Innovation team disbanded" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/A sourced record of dissolutions, reorganizations, and integrations/)
    ).toBeInTheDocument()
  })
})
