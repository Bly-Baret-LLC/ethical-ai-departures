import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("./PredictionEditorForm", () => ({
  PredictionEditorForm: ({ profiles }: { profiles: unknown[] }) => (
    <div data-testid="prediction-editor-form" data-profiles={profiles.length} />
  ),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [{ id: "p1", name: "Alice" }],
        }),
      }),
    }),
  }),
}))

import NewPredictionPage from "./page"

afterEach(cleanup)

describe("NewPredictionPage", () => {
  it("renders heading", async () => {
    const jsx = await NewPredictionPage()
    render(jsx)
    expect(screen.getByRole("heading", { name: /Create New Prediction/ })).toBeInTheDocument()
  })

  it("renders prediction editor form", async () => {
    const jsx = await NewPredictionPage()
    render(jsx)
    expect(screen.getByTestId("prediction-editor-form")).toBeInTheDocument()
  })

  it("passes profiles to form", async () => {
    const jsx = await NewPredictionPage()
    render(jsx)
    expect(screen.getByTestId("prediction-editor-form")).toHaveAttribute("data-profiles", "1")
  })
})
