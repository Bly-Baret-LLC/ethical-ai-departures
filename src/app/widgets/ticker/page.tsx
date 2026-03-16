import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

export default async function TickerWidget({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>
}) {
  const params = await searchParams
  const isDark = params.theme === "dark"

  let total = 0
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")

    total = count ?? 0
  } catch {
    // Graceful fallback
  }

  const bg = isDark ? "bg-[#1a1a2e]" : "bg-white"
  const text = isDark ? "text-white" : "text-[#1a1a2e]"
  const sub = isDark ? "text-gray-400" : "text-gray-500"

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
        `}</style>
      </head>
      <body>
        <div className={`flex items-center gap-3 rounded-lg ${bg} px-4 py-3`}>
          <div>
            <p className={`text-3xl font-bold ${text}`}>{total}</p>
            <p className={`text-xs ${sub}`}>safety departures tracked</p>
          </div>
          <a
            href="https://ethicalaidepartures.fyi"
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-auto text-xs ${sub} hover:underline`}
          >
            Ethical AI Departures
          </a>
        </div>
      </body>
    </html>
  )
}
