import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "./route"

const mockFetch = vi.fn()
vi.stubGlobal("fetch", mockFetch)

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function makeRequest(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params)
  return new NextRequest(`http://localhost:3000/api/og-preview?${searchParams}`)
}

describe("GET /api/og-preview", () => {
  it("returns 400 when url param is missing", async () => {
    const res = await GET(makeRequest({}))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe("Missing url parameter")
  })

  it("returns 400 for invalid URL", async () => {
    const res = await GET(makeRequest({ url: "not-a-url" }))
    expect(res.status).toBe(400)
  })

  it("returns 400 for non-http protocol", async () => {
    const res = await GET(makeRequest({ url: "ftp://example.com" }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe("Invalid URL protocol")
  })

  it("extracts OG metadata from HTML", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(`
        <html>
          <head>
            <meta property="og:title" content="Test Article Title" />
            <meta property="og:description" content="A great article" />
            <meta property="og:image" content="https://example.com/image.jpg" />
          </head>
        </html>
      `),
    })

    const res = await GET(makeRequest({ url: "https://example.com/article" }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.title).toBe("Test Article Title")
    expect(body.description).toBe("A great article")
    expect(body.image).toBe("https://example.com/image.jpg")
    expect(body.domain).toBe("example.com")
  })

  it("falls back to <title> tag when no OG title", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(`
        <html><head><title>Page Title</title></head></html>
      `),
    })

    const res = await GET(makeRequest({ url: "https://example.com/page" }))
    const body = await res.json()
    expect(body.title).toBe("Page Title")
  })

  it("returns fallback data on fetch failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const res = await GET(makeRequest({ url: "https://example.com/broken" }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.domain).toBe("example.com")
    expect(body.path).toBe("/broken")
    expect(body.title).toBeNull()
  })

  it("returns fallback data on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 })

    const res = await GET(makeRequest({ url: "https://example.com/missing" }))
    const body = await res.json()
    expect(body.domain).toBe("example.com")
    expect(body.title).toBeNull()
  })

  it("truncates long descriptions to 200 chars", async () => {
    const longDesc = "A".repeat(300)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(`
        <html><head>
          <meta property="og:description" content="${longDesc}" />
        </head></html>
      `),
    })

    const res = await GET(makeRequest({ url: "https://example.com/long" }))
    const body = await res.json()
    expect(body.description?.length).toBe(200)
  })
})
