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
        className="group block rounded-lg border border-border-light bg-surface-card p-6 transition-shadow duration-150 hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <Avatar name={name} photoUrl={photoUrl} size={40} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-lg font-semibold text-text-primary group-hover:text-accent-amber">
              {name}
            </h3>
            <p className="mt-0.5 text-sm text-text-secondary">
              {role} · {company} · {year}
            </p>
          </div>
        </div>
        {statedReason && (
          <blockquote className="mt-3 line-clamp-2 border-l-[3px] border-accent-amber pl-3 text-sm italic text-text-secondary">
            {statedReason}
          </blockquote>
        )}
        <div className="mt-3 flex items-center justify-between">
          {primaryTag ? (
            <span className="rounded-full bg-accent-amber/10 px-2.5 py-0.5 text-xs font-medium text-accent-amber">
              {primaryTag.name}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs text-text-secondary">0 kudos</span>
        </div>
      </Link>
      <NewBadge createdAt={createdAt} />
    </article>
  )
}
