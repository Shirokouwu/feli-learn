"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Shield, Microscope, GraduationCap, Globe2 } from "lucide-react"
import { useScrollAnimation, staggerContainer, staggerItem } from "@/hooks/use-scroll-animation"
import { SectionBackground } from "@/components/section-background"

export function WhyTaxonomyMatters() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 })

  const reasons = [
    {
      icon: Shield,
      title: "Konservasi Spesies",
      description:
        "Memahami taksonomi membantu mengidentifikasi spesies yang terancam punah dan memprioritaskan upaya konservasi.",
    },
    {
      icon: Microscope,
      title: "Penelitian Ilmiah",
      description: "Sistem klasifikasi yang baik memungkinkan komunikasi yang jelas antar ilmuwan di seluruh dunia.",
    },
    {
      icon: GraduationCap,
      title: "Pendidikan & Kesadaran",
      description:
        "Mengenal taksonomi meningkatkan apresiasi terhadap keanekaragaman hayati dan pentingnya pelestarian alam.",
    },
    {
      icon: Globe2,
      title: "Pemahaman Evolusi",
      description:
        "Taksonomi mengungkap hubungan evolusioner antar spesies dan bagaimana mereka beradaptasi selama jutaan tahun.",
    },
  ]

  return (
    <section className="py-16 lg:py-20 xl:py-24 bg-card overflow-hidden relative">
      <SectionBackground variant="gradient" />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 lg:mb-14 xl:mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3 lg:mb-4">
            Why It Matters
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 lg:mb-6 text-balance">
            Kenapa Harus Paham Taksonomi?
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            Memahami taksonomi bukan hanya untuk ilmuwan. Pengetahuan ini memberikan perspektif baru tentang bagaimana
            semua makhluk hidup saling terhubung.
          </p>
        </motion.div>

        {/* Reason Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              className="group p-6 lg:p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-primary/20 transition-colors"
              >
                <reason.icon className="text-primary" size={24} />
              </motion.div>
              <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2 lg:mb-3">{reason.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 lg:mt-14 xl:mt-16 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6 text-center md:text-left">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-2xl lg:text-3xl">🐯</span>
            </div>
            <div>
              <p className="text-base lg:text-lg text-foreground font-medium mb-2">
                &ldquo;Dengan memahami taksonomi, kita bisa lebih menghargai setiap spesies dan peran mereka dalam
                ekosistem.&rdquo;
              </p>
              <p className="text-muted-foreground text-sm">
                — Misi Felidae dalam mengedukasi masyarakat tentang keluarga kucing liar
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
