import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "The Warning Collective",
  description:
    "Tracking safety-motivated departures from AI companies. A public accountability resource for journalists, researchers, and the concerned public.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
