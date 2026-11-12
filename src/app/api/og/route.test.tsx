import { describe, it, expect, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

// Mock next/og since ImageResponse uses browser APIs not available in Node
vi.mock("next/og", () => ({
  ImageResponse: class MockImageResponse {
    body: string
    status: number
    headers: Map<string, string>

    constructor(element: React.ReactElement, options?: { width: number; height: number }) {
      this.body = JSON.stringify({ element: renderToStaticMarkup(element), options })
      this.status = 200
      this.headers = new Map([["content-type", "image/png"]])
    }
  },
}))

import { NextRequest } from "next/server"
import { GET } from "./route"

function makeRequest(params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams(params)
  return new NextRequest(`http://localhost:3700/api/og?${searchParams}`)
}

describe("GET /api/og", () => {
  it("returns 200 for homepage OG image", async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const rendered = JSON.parse((res as unknown as { body: string }).body)
    expect(rendered.options).toEqual({ width: 1200, height: 630 })
    expect(rendered.element).toContain("Who left AI companies")
    expect(rendered.element).toContain("—and why.")
    expect(rendered.element).not.toContain("Whether they were right")
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

  it.each(["summary", "quote"])("does not present an editorial %s as a verbatim quotation", async (parameter) => {
    const copy = "Kim alleges xAI fired him after he raised safety concerns."
    const response = await GET(makeRequest({ type: "profile", name: "Devin Kim", company: "xAI", [parameter]: copy }))
    const html = JSON.parse((response as unknown as { body: string }).body).element
    expect(html).toContain(copy)
    expect(html).not.toMatch(/[“”]|font-style:italic/)
  })

  it("preserves a short summary and marks longer excerpts without cutting a word", async () => {
    const copy = "Kim alleges xAI fired him after he raised concerns about Grok’s discriminatory outputs and inadequate safeguards against weapons-related misuse."
    const short = await GET(makeRequest({ type: "profile", summary: copy }))
    expect(JSON.parse((short as unknown as { body: string }).body).element).toContain(copy)
    const long = await GET(makeRequest({ type: "profile", summary: "Safety concerns were raised repeatedly. ".repeat(10) }))
    const html = JSON.parse((long as unknown as { body: string }).body).element
    expect(html).toContain("…")
    expect(html).not.toContain("repeate…")
  })
})
