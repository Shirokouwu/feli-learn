"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Lightbulb, ArrowDown } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { SectionBackground } from "@/components/section-background"

export function SolutionBridge() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.25 })

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-14 lg:py-16 xl:py-20 bg-background relative overflow-hidden">
      <SectionBackground variant="mesh" />

      {/* Connecting line from previous section */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 lg:h-20 bg-gradient-to-b from-border to-primary/50 origin-top z-10"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-primary/10 border-2 border-primary/30 mb-4 lg:mb-6"
          >
            <Lightbulb className="text-primary" size={24} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-3 lg:mb-4 text-balance"
          >
            Nah, Untuk Itu Kami Membuat Solusinya
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-6 lg:mb-8"
          >
            Kami memahami bahwa mempelajari taksonomi bisa terasa rumit. Karena itu, kami menciptakan aplikasi yang
            mengubah pengalaman belajar menjadi <span className="text-primary font-medium">interaktif</span>,
            <span className="text-primary font-medium"> menyenangkan</span>, dan{" "}
            <span className="text-primary font-medium">mudah dipahami</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {["AI Scanner", "Diagram Interaktif", "Ensiklopedia"].map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  whileHover={{ scale: 1.05, borderColor: "rgba(var(--primary), 0.5)" }}
                  className="px-3 py-1 rounded-full bg-card border border-border hover:border-primary/30 transition-colors cursor-default"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="mt-4"
            >
              <ArrowDown className="text-primary/60" size={24} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
