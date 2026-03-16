import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600

export default async function StatsWidget({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; theme?: string }>
}) {
  const params = await searchParams
  const isDark = params.theme === "dark"
  const statType = params.type ?? "company"

  const bg = isDark ? "bg-[#1a1a2e]" : "bg-white"
  const text = isDark ? "text-white" : "text-[#1a1a2e]"
  const sub = isDark ? "text-gray-400" : "text-gray-500"
  const bar = isDark ? "bg-amber-500" : "bg-amber-500"
  const barBg = isDark ? "bg-gray-700" : "bg-gray-100"

  let items: Array<{ label: string; count: number }> = []

  try {
    const supabase = await createClient()

    if (statType === "company") {
      const { data } = await supabase
        .from("profiles")
        .select("company")
        .eq("status", "published")

      if (data) {
        const counts = new Map<string, number>()
        for (const row of data) {
          counts.set(row.company, (counts.get(row.company) ?? 0) + 1)
        }
        items = Array.from(counts.entries())
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }
    } else if (statType === "concern") {
      const { data } = await supabase
        .from("profile_concern_tags")
        .select("concern_tags(name)")

      if (data) {
        const counts = new Map<string, number>()
        for (const row of data) {
          const tag = row.concern_tags as unknown as { name: string } | null
          if (tag) {
            counts.set(tag.name, (counts.get(tag.name) ?? 0) + 1)
          }
        }
        items = Array.from(counts.entries())
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      }
    }
  } catch {
    // Graceful fallback
  }

  const maxCount = Math.max(...items.map((i) => i.count), 1)
  const title = statType === "company" ? "Departures by Company" : "Departures by Concern"

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
        `}</style>
      </head>
      <body>
        <div className={`rounded-lg ${bg} p-4`}>
          <h2 className={`text-sm font-semibold ${text}`}>{title}</h2>
          {items.length === 0 ? (
            <p className={`mt-4 text-sm ${sub}`}>No data available.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item.label}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${text}`}>{item.label}</span>
                    <span className={`text-xs font-medium ${text}`}>{item.count}</span>
                  </div>
                  <div className={`mt-0.5 h-1.5 overflow-hidden rounded-full ${barBg}`}>
                    <div
                      className={`h-full rounded-full ${bar}`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <a
            href="https://ethicalaidepartures.fyi"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 block text-right text-[10px] ${sub} hover:underline`}
          >
            Ethical AI Departures
          </a>
        </div>
      </body>
    </html>
  )
}
