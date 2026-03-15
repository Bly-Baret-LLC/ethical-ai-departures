import { NextRequest, NextResponse } from "next/server"

export interface OgPreviewData {
  title: string | null
  description: string | null
  image: string | null
  domain: string
  path: string
}

const ogCache = new Map<string, { data: OgPreviewData; expiresAt: number }>()
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

function extractOgTags(html: string): { title: string | null; description: string | null; image: string | null } {
  const getMetaContent = (property: string): string | null => {
    const regex = new RegExp(
      `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
      "i"
    )
    const match = html.match(regex)
    return match?.[1] ?? match?.[2] ?? null
  }

  const title = getMetaContent("og:title")
    ?? getMetaContent("twitter:title")
    ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim()
    ?? null

  const description = getMetaContent("og:description")
    ?? getMetaContent("twitter:description")
    ?? getMetaContent("description")
    ?? null

  const image = getMetaContent("og:image")
    ?? getMetaContent("twitter:image")
    ?? null

  return { title, description, image }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  // Check cache
  const cached = ogCache.get(url)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: { "Cache-Control": "public, max-age=600" },
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "TheWarningCollective/1.0 (OG Preview)" },
      redirect: "follow",
    })
    clearTimeout(timeout)

    if (!response.ok) {
      const fallback: OgPreviewData = {
        title: null,
        description: null,
        image: null,
        domain: parsed.hostname,
        path: parsed.pathname,
      }
      return NextResponse.json(fallback)
    }

    const html = await response.text()
    const og = extractOgTags(html.slice(0, 50000)) // Only parse first 50KB

    const data: OgPreviewData = {
      title: og.title,
      description: og.description ? og.description.slice(0, 200) : null,
      image: og.image,
      domain: parsed.hostname,
      path: parsed.pathname,
    }

    ogCache.set(url, { data, expiresAt: Date.now() + CACHE_TTL_MS })

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=600" },
    })
  } catch {
    const fallback: OgPreviewData = {
      title: null,
      description: null,
      image: null,
      domain: parsed.hostname,
      path: parsed.pathname,
    }
    return NextResponse.json(fallback)
  }
}
