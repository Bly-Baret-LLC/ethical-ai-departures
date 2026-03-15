import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("./LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form" />,
}))

import LoginPage from "./page"

afterEach(cleanup)

describe("LoginPage", () => {
  it("renders heading", async () => {
    const jsx = await LoginPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByRole("heading", { name: /Editor Login/ })).toBeInTheDocument()
  })

  it("renders login form", async () => {
    const jsx = await LoginPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByTestId("login-form")).toBeInTheDocument()
  })
})
