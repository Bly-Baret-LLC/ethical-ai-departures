import type { Metadata } from "next"
import { OrganizationEventCard } from "@/components/custom/OrganizationEventCard"
import { organizationEvents } from "@/data/organization-events"

export const metadata: Metadata = {
  title: "AI Safety Team Dissolutions and Organizational Events",
  description:
    "A sourced record of dissolutions, reorganizations, and integrations affecting AI safety, ethics, governance, and responsible-innovation teams.",
}

export default function OrganizationalEventsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Organizational Events
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
        A sourced record of dissolutions, reorganizations, and integrations
        affecting teams responsible for AI safety, ethics, governance, and
        accountability.
      </p>

      <section aria-label="Documented organizational events" className="mt-10 space-y-6">
        {organizationEvents.map((event) => (
          <OrganizationEventCard key={event.slug} event={event} showCompany />
        ))}
      </section>
    </main>
  )
}
