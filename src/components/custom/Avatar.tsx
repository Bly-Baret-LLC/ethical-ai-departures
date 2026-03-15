import Image from "next/image"

interface AvatarProps {
  name: string
  photoUrl: string | null
  size?: number
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function Avatar({ name, photoUrl, size = 40 }: AvatarProps) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-surface-secondary text-sm font-medium text-text-secondary"
      style={{ width: size, height: size }}
    >
      {getInitials(name)}
    </div>
  )
}
