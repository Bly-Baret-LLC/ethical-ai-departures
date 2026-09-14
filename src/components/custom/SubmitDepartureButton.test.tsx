import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { SubmitDepartureButton } from "./SubmitDepartureButton"

vi.mock("@/lib/actions/profiles", () => ({
  submitDeparture: vi.fn(),
}))

afterEach(cleanup)

describe("SubmitDepartureButton", () => {
  it("presents the tip call-to-action and opens its dialog", () => {
    render(<SubmitDepartureButton />)

    const trigger = screen.getByRole("button", {
      name: "Submit a Departure Tip",
    })
    expect(screen.getByText("Submit a Departure Tip")).toBeInTheDocument()

    fireEvent.click(trigger)

    expect(
      screen.getByRole("dialog", { name: "Submit a departure tip" })
    ).toBeInTheDocument()
  })
})
