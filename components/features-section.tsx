"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { SectionBackground } from "@/components/section-background"
import { FeaturesSectionDiagram } from "@/components/features-section-diagram"
import { FeaturesSectionEncyclopedia } from "@/components/features-section-encyclopedia"
import { FeaturesSectionHeader } from "@/components/features-section-header"
import { FeaturesSectionScanner } from "@/components/features-section-scanner"

export function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement | null>(null)
  const scannerRef = useRef<HTMLDivElement | null>(null)
  const diagramSectionRef = useRef<HTMLDivElement | null>(null)
  const encyclopediaRef = useRef<HTMLDivElement | null>(null)

  const headerInView = useInView(headerRef, { once: true, margin: "-80px", amount: 0.3 })
  const scannerInView = useInView(scannerRef, { once: true, margin: "-80px", amount: 0.2 })
  const diagramInView = useInView(diagramSectionRef, { once: true, margin: "-80px", amount: 0.2 })
  const encyclopediaInView = useInView(encyclopediaRef, { once: true, margin: "-80px", amount: 0.15 })

  return (
    <section id="features" className="py-16 lg:py-20 xl:py-24 bg-background relative overflow-hidden">
      <SectionBackground variant="mesh" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FeaturesSectionHeader headerRef={headerRef} headerInView={headerInView} />
        <FeaturesSectionScanner scannerRef={scannerRef} scannerInView={scannerInView} />
        <FeaturesSectionDiagram diagramRef={diagramSectionRef} diagramInView={diagramInView} />
        <FeaturesSectionEncyclopedia encyclopediaRef={encyclopediaRef} encyclopediaInView={encyclopediaInView} />
      </div>
    </section>
  )
}
