import type React from "react"

export default function SpeciesDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Layout tanpa navbar untuk halaman detail spesies
  return <>{children}</>
}
