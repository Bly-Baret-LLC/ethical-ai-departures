import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockCompanyDetail = {
  company: "OpenAI",
  slug: "openai",
  profiles: [
    {
      id: "b1",
      slug: "elena-rodriguez",
      name: "Elena Rodriguez",
      photoUrl: null,
      company: "OpenAI",
      role: "Safety Lead",
      departureDate: "2025-11-15",
      statedReason: "Safety concerns deprioritized.",
      status: "published" as const,
      createdAt: "2025-11-20T00:00:00Z",
      updatedAt: "2025-11-20T00:00:00Z",
      concernTags: [
        { id: "c1", name: "Safety Deprioritization", slug: "safety-deprioritization" },
      ],
    },
  ],
  concernBreakdown: [
    { name: "Safety Deprioritization", slug: "safety-deprioritization", count: 1 },
  ],
}

const mockGetCompanyBySlug = vi.fn()
const mockNotFound = vi.fn()

vi.mock("@/lib/queries/companies", () => ({
  getCompanyBySlug: (...args: unknown[]) => mockGetCompanyBySlug(...args),
}))

vi.mock("next/navigation", () => ({
  notFound: (...args: unknown[]) => {
    mockNotFound(...args)
    throw new Error("NEXT_NOT_FOUND")
  },
}))

vi.mock("@/components/custom/Avatar", () => ({
  Avatar: ({ name }: { name: string }) => <div data-testid="avatar">{name}</div>,
}))

import CompanyDetailPage, { generateMetadata } from "./page"

beforeEach(() => {
  mockGetCompanyBySlug.mockResolvedValue(mockCompanyDetail)
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("CompanyDetailPage", () => {
  const params = Promise.resolve({ slug: "openai" })

  it("renders company name and count", async () => {
    const jsx = await CompanyDetailPage({ params })
    render(jsx)
    expect(screen.getByRole("heading", { name: "OpenAI" })).toBeInTheDocument()
    expect(screen.getByText(/1 safety-motivated departure tracked/)).toBeInTheDocument()
  })

  it("renders concern breakdown", async () => {
    const jsx = await CompanyDetailPage({ params })
    render(jsx)
    expect(screen.getByRole("heading", { name: "Concern Breakdown" })).toBeInTheDocument()
    expect(screen.getByText(/Safety Deprioritization/)).toBeInTheDocument()
  })

  it("renders departure timeline with profile links", async () => {
    const jsx = await CompanyDetailPage({ params })
    render(jsx)
    expect(screen.getByRole("heading", { name: "Departure Timeline" })).toBeInTheDocument()
    const profileLink = screen.getByRole("link", { name: /Elena Rodriguez/ })
    expect(profileLink).toHaveAttribute("href", "/profiles/elena-rodriguez")
  })

  it("calls notFound when company not found", async () => {
    mockGetCompanyBySlug.mockResolvedValueOnce(null)
    await expect(CompanyDetailPage({ params })).rejects.toThrow("NEXT_NOT_FOUND")
    expect(mockNotFound).toHaveBeenCalled()
  })

  it("renders back link", async () => {
    const jsx = await CompanyDetailPage({ params })
    render(jsx)
    expect(screen.getByRole("link", { name: /All companies/ })).toHaveAttribute("href", "/companies")
  })
})

describe("generateMetadata", () => {
  const params = Promise.resolve({ slug: "openai" })

  it("returns company metadata", async () => {
    const metadata = await generateMetadata({ params })
    expect(metadata.title).toContain("OpenAI")
  })

  it("returns not found metadata for missing company", async () => {
    mockGetCompanyBySlug.mockResolvedValueOnce(null)
    const metadata = await generateMetadata({ params })
    expect(metadata.title).toContain("Not Found")
  })
})
