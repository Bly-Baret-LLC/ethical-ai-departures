import type { Metadata } from "next"
import { Suspense } from "react"
import { getPublishedProfiles } from "@/lib/queries/profiles"
import { ProfileBrowser } from "@/components/custom/ProfileBrowser"
import { VisitTracker } from "@/components/custom/VisitTracker"
import { EmailSignup } from "@/components/custom/EmailSignup"

// ISR: 5-minute revalidation (matches PROFILE_LIST_REVALIDATE_SECONDS)
export const revalidate = 300

export const metadata: Metadata = {
  title: "All Profiles · The Warning Collective",
  description:
    "Browse AI researchers who have departed from major AI companies citing safety concerns.",
}

export default async function ProfilesPage() {
  let profiles
  try {
    profiles = await getPublishedProfiles()
  } catch (error) {
    console.error("Failed to load profiles:", error)
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          All Profiles
        </h1>
        <p className="mt-4 text-text-secondary">
          Unable to load profiles. Please try again later.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <VisitTracker />
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        All Profiles
      </h1>
      <Suspense>
        <ProfileBrowser profiles={profiles} />
      </Suspense>
      <div className="mt-12">
        <EmailSignup />
      </div>
    </main>
  )
}
