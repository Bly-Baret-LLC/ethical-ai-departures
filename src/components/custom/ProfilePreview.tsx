import { getPublishedProfiles } from "@/lib/queries/profiles"
import { ProfileCard } from "./ProfileCard"

const PREVIEW_LIMIT = 9

export async function ProfilePreview() {
  let profiles
  try {
    profiles = await getPublishedProfiles()
  } catch (error) {
    console.error("Failed to load profile preview:", error)
    return null
  }

  if (profiles.length === 0) return null

  const preview = profiles.slice(0, PREVIEW_LIMIT)

  return (
    <section id="profiles" aria-label="Departures" className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl font-semibold text-text-primary">
          Departures
        </h2>
        <p className="text-sm text-text-secondary">
          {profiles.length} profile{profiles.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {preview.map((profile) => (
          <ProfileCard
            key={profile.slug}
            slug={profile.slug}
            name={profile.name}
            role={profile.role}
            company={profile.company}
            departureDate={profile.departureDate}
            photoUrl={profile.photoUrl}
            statedReason={profile.statedReason}
            createdAt={profile.createdAt}
            concernTags={profile.concernTags}
          />
        ))}
      </div>
    </section>
  )
}
