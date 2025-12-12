"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Lightbulb, Puzzle, BookOpen, Sparkles } from "lucide-react"
import { useScrollAnimation, staggerContainer, staggerItem } from "@/hooks/use-scroll-animation"
import { SectionBackground } from "@/components/section-background"

const steps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Kenali Konsep Dasar",
    description:
      "Taksonomi seperti sistem folder di komputer. Setiap makhluk hidup punya 'alamat' unik berdasarkan ciri-ciri fisik dan genetiknya.",
  },
  {
    number: "02",
    icon: Puzzle,
    title: "Pahami Hierarki",
    description:
      "Dari Kingdom hingga Species, setiap tingkatan semakin spesifik. Seperti: Negara → Provinsi → Kota → Alamat Rumah.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Pelajari Nama Ilmiah",
    description:
      "Nama ilmiah terdiri dari Genus + Species. Contoh: Panthera tigris (Harimau). Ini adalah bahasa universal para ilmuwan.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Praktik dengan Felidae",
    description:
      "Gunakan aplikasi kami untuk mempraktikkan. Scan foto kucing, jelajahi diagram interaktif, dan baca ensiklopedia lengkap.",
  },
]

const analogy = {
  title: "Analogi Sederhana",
  items: [
    { taxonomy: "Kingdom", analogy: "Planet", example: "Animalia (Hewan)" },
    { taxonomy: "Phylum", analogy: "Benua", example: "Chordata" },
    { taxonomy: "Class", analogy: "Negara", example: "Mammalia" },
    { taxonomy: "Order", analogy: "Provinsi", example: "Carnivora" },
    { taxonomy: "Family", analogy: "Kota", example: "Felidae" },
    { taxonomy: "Genus", analogy: "Jalan", example: "Panthera" },
    { taxonomy: "Species", analogy: "Rumah", example: "P. tigris" },
  ],
}

export function TaxonomyEasy() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 })

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <SectionBackground variant="waves" />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Panduan Pemula
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Memahami Taksonomi dengan Mudah
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Jangan khawatir jika istilah taksonomi terdengar rumit. Kami akan memandu Anda langkah demi langkah untuk
            memahami sistem klasifikasi makhluk hidup dengan cara yang menyenangkan.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={staggerItem} whileHover={{ y: -4 }} className="relative group">
              <div className="relative p-6 rounded-2xl bg-card border border-border group-hover:border-primary/30 transition-all duration-300 h-full">
                <span className="text-5xl font-bold text-primary/20 font-mono">{step.number}</span>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center my-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Analogy Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border bg-primary/5">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
              <Lightbulb className="text-primary" size={24} />
              {analogy.title}: Taksonomi = Alamat Rumah
            </h3>
            <p className="text-muted-foreground mt-2">
              Bayangkan taksonomi seperti sistem alamat. Semakin spesifik, semakin tepat lokasinya!
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tingkat Taksonomi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Analoginya</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contoh (Harimau)</th>
                </tr>
              </thead>
              <tbody>
                {analogy.items.map((item, index) => (
                  <motion.tr
                    key={item.taxonomy}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + index * 0.03,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="border-b border-border/50 last:border-0 hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{item.taxonomy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{item.analogy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary font-mono text-sm">{item.example}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Tips Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="text-primary" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Tips Mengingat Urutan Taksonomi</h4>
              <p className="text-muted-foreground leading-relaxed">
                Gunakan akronim:{" "}
                <span className="text-primary font-medium">&quot;King Philip Came Over For Good Soup&quot;</span>
                untuk mengingat Kingdom, Phylum, Class, Order, Family, Genus, Species.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
