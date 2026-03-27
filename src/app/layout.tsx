import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import Script from "next/script"
import { Suspense } from "react"
import { PlausiblePageViewTracker } from "@/components/custom/PlausiblePageViewTracker"
import { VisitTracker } from "@/components/custom/VisitTracker"
import { SkipLinks } from "@/components/shared/SkipLinks"
import { SiteHeader } from "@/components/shared/SiteHeader"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "optional",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ethical AI Departures — Who Quit OpenAI, Google, Anthropic Over Safety Concerns",
    template: "%s · Ethical AI Departures",
  },
  description:
    "59 researchers and executives who quit or were fired from OpenAI, Google DeepMind, Anthropic, Meta, and xAI over AI safety concerns. Sourced departures, writings, and prediction tracking.",
  keywords: [
    "AI safety departures",
    "who quit OpenAI",
    "OpenAI resignations",
    "AI ethics whistleblower",
    "AI safety researcher quit",
    "Google DeepMind departures",
    "Anthropic safety concerns",
    "AI company resignations",
    "AI whistleblower tracker",
    "AI predictions tracker",
  ],
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
        <Script
          async
          src="https://plausible.io/js/pa-UvYovQn6Tzl2_07hOUOBB.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};window.plausible.init=window.plausible.init||function(i){window.plausible.o=i||{}};window.plausible.init();`}
        </Script>
        <TooltipProvider>
          <SkipLinks />
          <Suspense fallback={null}>
            <PlausiblePageViewTracker />
          </Suspense>
          <VisitTracker />
          <SiteHeader />
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
