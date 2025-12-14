"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Scan, BookOpen, GitBranch } from "lucide-react"
import { motion } from "framer-motion"
import { SectionBackground } from "@/components/section-background"
import Image from "next/image"
import Link from "next/link"

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
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-14 lg:pt-16 overflow-hidden">
      <SectionBackground variant="mesh" />

      {/* Static gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 xl:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm backdrop-blur-sm relative overflow-hidden group cursor-pointer hover:scale-105 hover:border-primary/40 transition-all duration-300">
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent -translate-x-full animate-shimmer" />
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse relative z-10" />
                <span className="relative z-10">Temukan 41 Spesies Kucing Liar</span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6 leading-tight text-balance"
            >
              Jelajahi Dunia Menakjubkan <span className="text-primary">Felidae</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg xl:text-xl text-muted-foreground mb-8 lg:mb-10 leading-relaxed"
            >
              Jelajahi keluarga kucing liar melalui scanner AI, diagram taksonomi interaktif, dan ensiklopedia lengkap.
              Pelajari dan kenali setiap spesies dengan mudah.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4 mb-12"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground gap-2 text-base px-8 relative overflow-hidden group hover:scale-105 active:scale-98 transition-transform duration-200"
              >
                <Link href="/scanner">
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    Mulai Eksplorasi
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 border-border bg-transparent relative overflow-hidden group hover:scale-105 hover:border-primary/50 active:scale-98 transition-all duration-200 hover:text-white"
              >
                <Link href="/radial">
                  <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-white" />
                  <span className="relative z-10">Lihat Diagram</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-4/5 lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
              {/* Main image */}
              <Image
                src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=800&q=80"
                alt="Majestic wild cat"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-transparent" />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-md rounded-2xl p-4 border border-border/50 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🐆</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">41 Spesies Kucing Liar</p>
                    <p className="text-sm text-muted-foreground">Dari harimau hingga kucing rumahan</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Feature Badges */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -10, 0]
              }}
              transition={{
                opacity: { duration: 0.6, delay: 1 },
                x: { duration: 0.6, delay: 1 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="absolute -top-4 -left-4 bg-card/95 backdrop-blur-md rounded-2xl p-4 border border-border/60 shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Scan className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">AI Scanner</p>
                  <p className="text-xs text-muted-foreground">Identifikasi spesies</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -15, 0]
              }}
              transition={{
                opacity: { duration: 0.6, delay: 1.2 },
                x: { duration: 0.6, delay: 1.2 },
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }}
              className="absolute top-1/4 -right-6 bg-card/95 backdrop-blur-md rounded-2xl p-4 border border-border/60 shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <GitBranch className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Radial Diagram</p>
                  <p className="text-xs text-muted-foreground">Visualisasi taksonomi</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -12, 0]
              }}
              transition={{
                opacity: { duration: 0.6, delay: 1.4 },
                x: { duration: 0.6, delay: 1.4 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              className="absolute bottom-1/4 -left-6 bg-card/95 backdrop-blur-md rounded-2xl p-4 border border-border/60 shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Encyclopedia</p>
                  <p className="text-xs text-muted-foreground">Database lengkap</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  )
}
