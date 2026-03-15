import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("./ProfileEditorForm", () => ({
  ProfileEditorForm: () => <div data-testid="profile-editor-form" />,
}))

import NewProfilePage from "./page"

afterEach(cleanup)

describe("NewProfilePage", () => {
  it("renders heading", () => {
    render(<NewProfilePage />)
    expect(screen.getByRole("heading", { name: /Create New Profile/ })).toBeInTheDocument()
  })

  it("renders profile editor form", () => {
    render(<NewProfilePage />)
    expect(screen.getByTestId("profile-editor-form")).toBeInTheDocument()
  })
})
