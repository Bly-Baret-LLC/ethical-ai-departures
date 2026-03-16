import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { SkipLinks } from "@/components/shared/SkipLinks"
import { SiteHeader } from "@/components/shared/SiteHeader"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ethical AI Departures",
  description:
    "Tracking safety-motivated departures from AI companies. A public accountability resource for journalists, researchers, and the concerned public.",
  openGraph: {
    type: "website",
    siteName: "Ethical AI Departures",
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
      <body className={`${playfairDisplay.variable} antialiased`}>
        <SkipLinks />
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
