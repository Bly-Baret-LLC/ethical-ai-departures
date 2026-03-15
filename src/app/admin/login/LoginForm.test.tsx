import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { LoginForm } from "./LoginForm"

vi.mock("@/lib/actions/auth", () => ({
  signIn: vi.fn(),
}))

afterEach(cleanup)

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
  })

  it("renders sign in button", () => {
    render(<LoginForm />)
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
  })

  it("has autocomplete attributes", () => {
    render(<LoginForm />)
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email")
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password")
  })
})
