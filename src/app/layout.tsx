import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "../styles/globals.css"
import { Bebas_Neue, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AnalyticsProvider } from "@modules/layout/components/analytics"

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      data-mode="light"
      className={`${bebasNeue.variable} ${openSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white">
        <main className="relative">{props.children}</main>
        <Analytics />
        <SpeedInsights />
        <AnalyticsProvider />
      </body>
    </html>
  )
}
