"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Eye, ArrowDown } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { SectionBackground } from "@/components/section-background"

export function ExplorationBridge() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.25 })

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 bg-card relative overflow-hidden">
      <SectionBackground variant="grid" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-background border border-border hover:border-primary/30 transition-colors cursor-pointer"
          >
            <Eye className="text-primary" size={20} />
            <span className="text-foreground font-medium">Penasaran seperti apa? Mari kita lihat lebih dekat...</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="mt-6"
          >
            <ArrowDown className="text-primary/40 mx-auto" size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
