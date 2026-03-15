import { describe, it, expect, vi } from "vitest"

// Mock next/og since ImageResponse uses browser APIs not available in Node
vi.mock("next/og", () => ({
  ImageResponse: class MockImageResponse {
    body: string
    status: number
    headers: Map<string, string>

    constructor(element: React.ReactElement, options?: { width: number; height: number }) {
      this.body = JSON.stringify({ element: String(element), options })
      this.status = 200
      this.headers = new Map([["content-type", "image/png"]])
    }
  },
}))

import { NextRequest } from "next/server"
import { GET } from "./route"

function makeRequest(params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams(params)
  return new NextRequest(`http://localhost:3000/api/og?${searchParams}`)
}

describe("GET /api/og", () => {
  it("returns 200 for homepage OG image", async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
  })

  it("returns 200 for homepage with count", async () => {
    const res = await GET(makeRequest({ count: "42" }))
    expect(res.status).toBe(200)
  })

  it("returns 200 for profile OG image", async () => {
    const res = await GET(
      makeRequest({
        type: "profile",
        name: "Elena Rodriguez",
        company: "OpenAI",
        quote: "Safety concerns were deprioritized.",
      })
    )
    expect(res.status).toBe(200)
  })

  it("returns 200 for profile without quote", async () => {
    const res = await GET(
      makeRequest({
        type: "profile",
        name: "James Chen",
        company: "Anthropic",
      })
    )
    expect(res.status).toBe(200)
  })
})
