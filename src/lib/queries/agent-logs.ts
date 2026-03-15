import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const agentLogRowSchema = z.object({
  id: z.string().uuid(),
  agent_name: z.string(),
  action_type: z.string(),
  status: z.enum(["running", "success", "error"]),
  input_summary: z.string().nullable(),
  output_summary: z.string().nullable(),
  confidence_score: z.number().nullable(),
  error_detail: z.string().nullable(),
  duration_ms: z.number().nullable(),
  created_at: z.string(),
})

const agentLogSchema = agentLogRowSchema.transform((row) => ({
  id: row.id,
  agentName: row.agent_name,
  actionType: row.action_type,
  status: row.status,
  inputSummary: row.input_summary,
  outputSummary: row.output_summary,
  confidenceScore: row.confidence_score,
  errorDetail: row.error_detail,
  durationMs: row.duration_ms,
  createdAt: row.created_at,
}))

export type AgentLog = z.output<typeof agentLogSchema>

export async function getAgentLogs(filters?: {
  agent?: string
  status?: string
  limit?: number
}): Promise<AgentLog[]> {
  const supabase = await createClient()

  let query = supabase
    .from("agent_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filters?.limit ?? 100)

  if (filters?.agent) {
    query = query.eq("agent_name", filters.agent)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) throw error

  return (data ?? []).map((row) => agentLogSchema.parse(row))
}

export interface AgentMetrics {
  agentName: string
  totalRuns: number
  successRate: number
  avgConfidence: number
  avgDurationMs: number
  errorCount: number
}

export async function getAgentMetrics(): Promise<AgentMetrics[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agent_logs")
    .select("agent_name, status, confidence_score, duration_ms")

  if (error) throw error
  if (!data?.length) return []

  const byAgent = new Map<string, {
    total: number
    success: number
    errors: number
    confidenceSum: number
    confidenceCount: number
    durationSum: number
    durationCount: number
  }>()

  for (const row of data) {
    if (!byAgent.has(row.agent_name)) {
      byAgent.set(row.agent_name, {
        total: 0,
        success: 0,
        errors: 0,
        confidenceSum: 0,
        confidenceCount: 0,
        durationSum: 0,
        durationCount: 0,
      })
    }

    const m = byAgent.get(row.agent_name)!
    m.total++
    if (row.status === "success") m.success++
    if (row.status === "error") m.errors++
    if (row.confidence_score != null) {
      m.confidenceSum += row.confidence_score
      m.confidenceCount++
    }
    if (row.duration_ms != null) {
      m.durationSum += row.duration_ms
      m.durationCount++
    }
  }

  return Array.from(byAgent.entries()).map(([name, m]) => ({
    agentName: name,
    totalRuns: m.total,
    successRate: m.total > 0 ? Math.round((m.success / m.total) * 100) : 0,
    avgConfidence: m.confidenceCount > 0 ? Math.round((m.confidenceSum / m.confidenceCount) * 100) / 100 : 0,
    avgDurationMs: m.durationCount > 0 ? Math.round(m.durationSum / m.durationCount) : 0,
    errorCount: m.errors,
  }))
}
