"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const signalSchema = z.object({
  concernCategories: z.array(z.string()).min(1, "Select at least one concern category"),
  company: z.string().optional(),
  freeText: z.string().max(500).optional(),
})

export interface SignalActionResult {
  success: boolean
  message: string
}

export async function submitSignal(formData: FormData): Promise<SignalActionResult> {
  const raw = {
    concernCategories: formData.getAll("concernCategories"),
    company: formData.get("company") || undefined,
    freeText: formData.get("freeText") || undefined,
  }

  const parsed = signalSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("anonymous_signals").insert({
      concern_categories: parsed.data.concernCategories,
      company_optional: parsed.data.company ?? null,
      free_text_optional: parsed.data.freeText ?? null,
      status: "approved",
    })

    if (error) throw error
    return { success: true, message: "Thank you for your signal. Your submission is completely anonymous." }
  } catch {
    return { success: false, message: "Failed to submit signal. Please try again." }
  }
}

export interface SignalCounts {
  total: number
  byCategory: Array<{ category: string; count: number }>
}

export async function getSignalCounts(): Promise<SignalCounts> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("anonymous_signals")
    .select("concern_categories")
    .eq("status", "approved")

  if (error || !data) return { total: 0, byCategory: [] }

  const categoryCounts = new Map<string, number>()
  for (const row of data) {
    for (const cat of row.concern_categories) {
      categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1)
    }
  }

  // Only show categories with 10+ signals to prevent de-anonymization
  const byCategory = Array.from(categoryCounts.entries())
    .filter(([, count]) => count >= 10)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  return { total: data.length, byCategory }
}
