import { cache } from "react"
import { getConcernGuide } from "@/data/concern-guides"
import { isHeadlineCounted } from "@/lib/evidence"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import { getPublishedProfiles } from "./profiles"

export function selectConcernProfiles(profiles: ProfileWithTags[], slug: string) {
  const matching = profiles.filter((profile) =>
    profile.status === "published" && profile.concernTags.some((tag) => tag.slug === slug)
  )
  return {
    evidenceLinked: matching.filter(isHeadlineCounted),
    alleged: matching.filter((profile) => profile.motiveEvidence === "alleged"),
  }
}

export const getConcernBySlug = cache(async (slug: string) => {
  const guide = getConcernGuide(slug)
  if (!guide) return null

  // Let fetch failures reach the error boundary; an outage is not a zero count.
  const profiles = await getPublishedProfiles()
  return { guide, ...selectConcernProfiles(profiles, slug) }
})
