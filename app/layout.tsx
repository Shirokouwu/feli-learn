import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme-provider"
import { SuspendedHeader } from "@/components/suspended-header"

const _inter = Inter({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Felidae Learn - Platform Pembelajaran Taksonomi Modern Keluarga Kucing",
  description:
    "Explore the magnificent Felidae family through AI-powered species scanning, interactive taxonomy diagrams, and comprehensive encyclopedia. Learn about big cats and wild cats.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={_inter.className}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <SuspendedHeader />
            <main>{children}</main>
          </QueryProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
