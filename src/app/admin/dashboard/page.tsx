import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/actions/auth"

export const metadata: Metadata = {
  title: "Editorial Dashboard · The Warning Collective",
}

interface QueueItem {
  id: string
  type: "profile" | "correction" | "contact"
  title: string
  status: string
  submittedAt: string
}

async function getQueueItems(): Promise<QueueItem[]> {
  const supabase = await createClient()
  const items: QueueItem[] = []

  // Draft profiles
  const { data: drafts } = await supabase
    .from("profiles")
    .select("id, name, status, created_at")
    .eq("status", "draft")
    .order("created_at", { ascending: true })

  if (drafts) {
    items.push(
      ...drafts.map((d) => ({
        id: d.id,
        type: "profile" as const,
        title: d.name,
        status: d.status,
        submittedAt: d.created_at,
      }))
    )
  }

  // Contact requests (fetch if table exists)
  try {
    const { data: contacts } = await supabase
      .from("contact_requests")
      .select("id, type, email, created_at")
      .order("created_at", { ascending: true })

    if (contacts) {
      items.push(
        ...contacts.map((c) => ({
          id: c.id,
          type: "contact" as const,
          title: `${c.type}: ${c.email}`,
          status: "pending",
          submittedAt: c.created_at,
        }))
      )
    }
  } catch {
    // Table may not exist yet
  }

  return items.sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  )
}

const typeBadge: Record<string, string> = {
  profile: "bg-accent-amber/10 text-accent-amber",
  correction: "bg-status-error/10 text-status-error",
  contact: "bg-accent-info/10 text-accent-info",
}

export default async function DashboardPage() {
  let items: QueueItem[] = []
  try {
    items = await getQueueItems()
  } catch {
    // Graceful fallback
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          Editorial Dashboard
        </h1>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
          >
            Sign Out
          </button>
        </form>
      </div>

      <nav className="mt-4 flex gap-3">
        <Link
          href="/admin/profiles/new"
          className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
        >
          New Profile
        </Link>
        <Link
          href="/admin/predictions"
          className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
        >
          Predictions
        </Link>
        <Link
          href="/admin/seed"
          className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
        >
          Seed Data
        </Link>
        <Link
          href="/admin/agents"
          className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
        >
          Agent Pipeline
        </Link>
      </nav>

      <p className="mt-6 text-text-secondary">
        {items.length} item{items.length !== 1 ? "s" : ""} pending review
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
          <p className="text-text-secondary">
            No items pending review. All clear!
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border-light bg-surface-card px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadge[item.type] ?? "bg-surface-secondary text-text-secondary"}`}
                >
                  {item.type}
                </span>
                <span className="font-medium text-text-primary">
                  {item.title}
                </span>
              </div>
              <time className="text-sm text-text-secondary">
                {new Date(item.submittedAt).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
