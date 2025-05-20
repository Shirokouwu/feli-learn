import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Felidae Learn - Platform Pembelajaran Taksonomi Modern",
  description: "Pelajari taksonomi Felidae dengan cara yang menyenangkan menggunakan teknologi AI",
  // Add proper viewport meta tags
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        <main>
          <QueryProvider>{children}</QueryProvider>
        </main>
        <Toaster />
      </body>
    </html>
  )
}
