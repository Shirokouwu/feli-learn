"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Scan, BookOpen, GitBranch } from "lucide-react"
import { motion } from "framer-motion"
import { SectionBackground } from "@/components/section-background"

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=60')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <SectionBackground variant="mesh" />

      {/* Static gradient orbs - removed infinite animations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm backdrop-blur-sm relative overflow-hidden group cursor-pointer hover:scale-105 hover:border-primary/40 transition-all duration-300">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full animate-shimmer" />
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse relative z-10" />
              <span className="relative z-10">Discover 41 Species of Wild Cats</span>
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance"
          >
            Explore the Magnificent World of <span className="text-primary">Felidae</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Jelajahi keluarga kucing liar melalui scanner AI, diagram taksonomi interaktif, dan ensiklopedia lengkap.
            Pelajari dan kenali setiap spesies dengan mudah.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground gap-2 text-base px-8 relative overflow-hidden group hover:scale-105 active:scale-98 transition-transform duration-200"
            >
              <a href="/explore">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                <span className="relative z-10 flex items-center gap-2">
                  Mulai Eksplorasi
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 border-border bg-transparent relative overflow-hidden group hover:scale-105 hover:border-primary/50 active:scale-98 transition-all duration-200"
            >
              <a href="/demo">
                <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Lihat Demo</span>
              </a>
            </Button>
          </motion.div>

          {/* Feature cards with CSS transitions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Scan, title: "AI Scanner", desc: "Identifikasi spesies" },
              { icon: GitBranch, title: "Radial Diagram", desc: "Visualisasi taksonomi" },
              { icon: BookOpen, title: "Encyclopedia", desc: "Database lengkap" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="text-primary" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
