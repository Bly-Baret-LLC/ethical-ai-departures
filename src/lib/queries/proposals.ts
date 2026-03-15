import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const proposalRowSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  type_tags: z.array(z.string()),
  source_url: z.string().nullable(),
  country_applicability: z.array(z.string()),
  in_legislation: z.boolean(),
  vote_count: z.number(),
  created_at: z.string(),
})

const proposalSchema = proposalRowSchema.transform((row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  typeTags: row.type_tags,
  sourceUrl: row.source_url,
  countryApplicability: row.country_applicability,
  inLegislation: row.in_legislation,
  voteCount: row.vote_count,
  createdAt: row.created_at,
}))

export type Proposal = z.output<typeof proposalSchema>

export async function getProposals(filters?: {
  type?: string
  country?: string
  sort?: string
}): Promise<Proposal[]> {
  const supabase = await createClient()

  let query = supabase
    .from("proposals")
    .select("*")
    .eq("status", "published")

  if (filters?.sort === "votes") {
    query = query.order("vote_count", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) throw error

  let proposals = (data ?? []).map((row) => proposalSchema.parse(row))

  if (filters?.type) {
    proposals = proposals.filter((p) => p.typeTags.includes(filters.type!))
  }
  if (filters?.country) {
    proposals = proposals.filter((p) => p.countryApplicability.includes(filters.country!))
  }

  return proposals
}
