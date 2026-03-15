import type { Metadata } from "next"
import Link from "next/link"
import { getAgentLogs, getAgentMetrics, type AgentLog, type AgentMetrics } from "@/lib/queries/agent-logs"

export const metadata: Metadata = {
  title: "Agent Pipeline · Editorial Dashboard",
}

const statusBadge: Record<string, string> = {
  running: "bg-accent-info/10 text-accent-info",
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
}

const agentLabel: Record<string, string> = {
  scout: "Scout",
  verification: "Verification",
  synthesis: "Synthesis",
  predictions_tracker: "Predictions Tracker",
  orchestrator: "Orchestrator",
}

export default async function AgentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string; status?: string }>
}) {
  const params = await searchParams
  let logs: AgentLog[] = []
  let metrics: AgentMetrics[] = []

  try {
    ;[logs, metrics] = await Promise.all([
      getAgentLogs({ agent: params.agent, status: params.status, limit: 50 }),
      getAgentMetrics(),
    ])
  } catch {
    // Graceful fallback — table may not exist yet
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          Agent Pipeline
        </h1>
        <Link
          href="/admin/dashboard"
          className="text-sm text-text-secondary hover:text-accent-amber"
        >
          &larr; Dashboard
        </Link>
      </div>

      {/* Metrics cards */}
      {metrics.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <div
              key={m.agentName}
              className="rounded-lg border border-border-light bg-surface-card p-4"
            >
              <h3 className="text-sm font-medium text-text-secondary">
                {agentLabel[m.agentName] ?? m.agentName}
              </h3>
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {m.successRate}%
              </p>
              <p className="text-xs text-text-secondary">success rate</p>
              <div className="mt-2 flex gap-4 text-xs text-text-secondary">
                <span>{m.totalRuns} runs</span>
                <span>avg {m.avgConfidence} confidence</span>
                {m.avgDurationMs > 0 && <span>{(m.avgDurationMs / 1000).toFixed(1)}s avg</span>}
              </div>
              {m.errorCount > 0 && (
                <p className="mt-1 text-xs text-red-600">
                  {m.errorCount} error{m.errorCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <FilterLink href="/admin/agents" label="All" active={!params.agent && !params.status} />
        <FilterLink
          href="/admin/agents?agent=scout"
          label="Scout"
          active={params.agent === "scout"}
        />
        <FilterLink
          href="/admin/agents?agent=verification"
          label="Verification"
          active={params.agent === "verification"}
        />
        <FilterLink
          href="/admin/agents?agent=synthesis"
          label="Synthesis"
          active={params.agent === "synthesis"}
        />
        <FilterLink
          href="/admin/agents?status=error"
          label="Errors"
          active={params.status === "error"}
        />
      </div>

      {/* Activity log */}
      <h2 className="mt-8 text-lg font-semibold text-text-primary">
        Recent Activity
      </h2>

      {logs.length === 0 ? (
        <div className="mt-4 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
          <p className="text-text-secondary">
            No agent activity yet. The pipeline will log activity here once configured.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {logs.map((log) => (
            <li
              key={log.id}
              className="rounded-lg border border-border-light bg-surface-card px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[log.status]}`}
                  >
                    {log.status}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {agentLabel[log.agentName] ?? log.agentName}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {log.actionType}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  {log.confidenceScore != null && (
                    <span>{Math.round(log.confidenceScore * 100)}% conf</span>
                  )}
                  {log.durationMs != null && (
                    <span>{(log.durationMs / 1000).toFixed(1)}s</span>
                  )}
                  <time>{new Date(log.createdAt).toLocaleString()}</time>
                </div>
              </div>
              {log.outputSummary && (
                <p className="mt-1 text-sm text-text-secondary">{log.outputSummary}</p>
              )}
              {log.errorDetail && (
                <p className="mt-1 text-sm text-red-600">{log.errorDetail}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-accent-amber text-white"
          : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
      }`}
    >
      {label}
    </Link>
  )
}
