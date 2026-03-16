import Link from "next/link"
import { Avatar } from "./Avatar"
import { NewBadge } from "./NewBadge"

interface ConcernTagInfo {
  id: string
  name: string
  slug: string
}

export interface ProfileCardProps {
  slug: string
  name: string
  role: string
  company: string
  departureDate: string
  photoUrl: string | null
  statedReason: string | null
  createdAt: string
  concernTags: ConcernTagInfo[]
}

export function ProfileCard({
  slug,
  name,
  role,
  company,
  departureDate,
  photoUrl,
  statedReason,
  createdAt,
  concernTags,
}: ProfileCardProps) {
  const year = new Date(departureDate + "T00:00:00").getFullYear()
  const primaryTag = concernTags[0] ?? null

  return (
    <article className="relative">
      <Link
        href={`/profiles/${slug}`}
        aria-label={`${name}, ${role} at ${company}, ${year}`}
        className="group flex h-[192px] flex-col rounded-lg border border-border-light bg-surface-card p-5 transition-shadow duration-150 hover:shadow-md"
      >
        {/* Top zone — pinned to top */}
        <div className="flex items-start gap-3">
          <Avatar name={name} photoUrl={photoUrl} size={40} />
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 font-serif text-lg font-semibold leading-snug text-text-primary group-hover:text-accent-amber">
              {name}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-sm leading-snug text-text-secondary">
              {role} · {company} · {year}
            </p>
          </div>
        </div>

        {/* Bottom zone — pinned to bottom via mt-auto */}
        <div className="mt-auto">
          {statedReason && (
            <blockquote className="mb-3 line-clamp-2 border-l-[3px] border-accent-amber pl-3 text-sm italic leading-relaxed text-text-secondary">
              {statedReason}
            </blockquote>
          )}
          {primaryTag && (
            <span className="rounded-full bg-accent-amber/10 px-2.5 py-0.5 text-xs font-medium text-accent-amber">
              {primaryTag.name}
            </span>
          )}
        </div>
      </Link>
      <NewBadge createdAt={createdAt} />
    </article>
  )
}
