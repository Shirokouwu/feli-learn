"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Heart, Shield } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { SectionBackground } from "@/components/section-background"

export function CTASection() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.25 })

  const features = [
    { icon: Shield, text: "41", label: "Spesies untuk dipelajari", color: "text-primary" },
    { icon: Sparkles, text: "AI", label: "Scanner canggih", color: "text-accent" },
    { icon: Heart, text: "Dukung", label: "Konservasi", color: "text-red-400" },
  ]

  return (
    <section className="py-24 bg-card overflow-hidden relative">
      <SectionBackground variant="gradient" />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-accent/8 to-primary/15 border border-primary/20 p-8 sm:p-12 lg:p-16"
        >
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 w-72 h-72 bg-accent/12 rounded-full blur-[100px]"
          />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6 backdrop-blur-sm"
            >
              <Heart size={16} className="text-red-400" />
              Jadilah Bagian dari Perubahan
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance"
            >
              Mulai Perjalanan Anda Sekarang
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto"
            >
              Dengan memahami Felidae, Anda tidak hanya belajar tentang taksonomi—Anda menjadi bagian dari gerakan
              pelestarian satwa liar global.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <feature.icon className={feature.color} size={18} />
                  <span>
                    <span className="text-foreground font-semibold">{feature.text}</span> {feature.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground gap-2 text-base px-8 relative overflow-hidden group"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Mulai Eksplorasi
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </span>
                </motion.button>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 border-primary/50 bg-transparent relative overflow-hidden group"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Lihat Demo</span>
                </motion.button>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-xs text-muted-foreground"
            >
              Gratis untuk memulai. Tidak perlu kartu kredit.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
