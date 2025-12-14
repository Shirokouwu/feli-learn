"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Heart, Leaf } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function ConservationBridge() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.25 })

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-14 lg:py-16 xl:py-20 bg-background relative overflow-hidden">
      {/* Decorative elements - Animasi lebih subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-accent/5 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center gap-2 lg:gap-3 mb-4 lg:mb-6"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Leaf className="text-accent" size={20} />
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart className="text-red-500" size={20} />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 lg:mb-4 text-balance"
          >
            Tapi, Ada Hal yang Lebih Penting...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Di balik keindahan dan keajaiban keluarga Felidae, ada{" "}
            <span className="text-red-400 font-medium">kenyataan pahit</span> yang harus kita hadapi. Banyak dari mereka
            yang <span className="text-red-400 font-medium">terancam punah</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Ini saatnya kita berbicara tentang konservasi
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
