import type { Metadata } from "next"
import { SkipLinks } from "@/components/shared/SkipLinks"
import { SiteHeader } from "@/components/shared/SiteHeader"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewarningcollective.org"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Warning Collective",
  description:
    "Tracking safety-motivated departures from AI companies. A public accountability resource for journalists, researchers, and the concerned public.",
  openGraph: {
    type: "website",
    siteName: "The Warning Collective",
    images: [`${siteUrl}/api/og`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteUrl}/api/og`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SkipLinks />
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
