import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { PublicationsTabs } from "./PublicationsTabs"

const navigation = vi.hoisted(() => ({ query: "", push: vi.fn() }))
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(navigation.query),
  useRouter: () => ({ push: navigation.push }),
}))
vi.mock("./WritingsSection", () => ({
  WritingsSection: () => <div>Writings collection</div>,
}))

afterEach(() => {
  cleanup()
  navigation.query = ""
  vi.clearAllMocks()
})

function renderTabs() {
  return render(<PublicationsTabs
    publications={[]}
    concernCounts={[]}
    predictions={[]}
    spotlight={<section aria-label="Prediction spotlight">Featured warning</section>}
  />)
}

describe("PublicationsTabs spotlight placement", () => {
  it("keeps the spotlight out of the default writings view", () => {
    renderTabs()
    expect(screen.getByText("Writings collection")).toBeInTheDocument()
    expect(screen.queryByRole("region", { name: "Prediction spotlight" })).not.toBeInTheDocument()
  })

  it("shows the spotlight only on the forecasts tab", () => {
    navigation.query = "tab=predictions"
    renderTabs()
    expect(screen.getByRole("region", { name: "Prediction spotlight" })).toBeInTheDocument()
    expect(screen.queryByText("Writings collection")).not.toBeInTheDocument()
  })

  it("retains tab navigation", () => {
    renderTabs()
    fireEvent.click(screen.getByRole("button", { name: "Forecasts & Warnings" }))
    expect(navigation.push).toHaveBeenCalledWith("/publications?tab=predictions", { scroll: false })
  })
})
