/** Sourced institutional context, separate from profiles and organizational events. */
interface CompanyContext {
  title: string
  paragraphs: Array<{
    text: string
    source: { label: string; url: string; date: string }
  }>
  note?: string
}

const companyContext: Record<string, CompanyContext> = {
  xai: {
    title: "Safety-team departures",
    paragraphs: [
      {
        text: "In January 2026, CNN reported that three members of xAI’s safety team had announced they were leaving. They did not give reasons for their departures.",
        source: {
          label: "CNN, January 8, 2026 (via WRAL)",
          url: "https://www.wral.com/archive/22297674",
          date: "2026-01-08",
        },
      },
      {
        text: "Business Insider reported in February that three people had left a safety team of roughly six in December 2025. It also reported that safety staff remained and that xAI had been recruiting additional safety staff in January.",
        source: {
          label: "Business Insider, February 20, 2026 (via AOL)",
          url: "https://www.aol.com/articles/war-rooms-group-chats-video-100801506.html",
          date: "2026-02-20",
        },
      },
    ],
    note: "The reports may describe overlapping departures.",
  },
}

export function getCompanyContext(slug: string): CompanyContext | null {
  return companyContext[slug] ?? null
}
