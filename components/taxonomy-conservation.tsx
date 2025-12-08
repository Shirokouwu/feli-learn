"use client"

import type React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Leaf, Heart, AlertTriangle, TreePine, Users, Target } from "lucide-react"
import { useScrollAnimation, staggerContainer, staggerItem } from "@/hooks/use-scroll-animation"

const conservationPoints = [
  {
    icon: AlertTriangle,
    title: "Identifikasi Spesies Terancam",
    description:
      "Dengan taksonomi, kita bisa mengidentifikasi spesies mana yang terancam punah dan membutuhkan perlindungan segera.",
    stat: "7 dari 41",
    statLabel: "spesies Felidae terancam punah",
  },
  {
    icon: TreePine,
    title: "Pelestarian Habitat",
    description:
      "Memahami klasifikasi membantu menentukan habitat kritis yang harus dilindungi untuk kelangsungan spesies.",
    stat: "50%",
    statLabel: "habitat kucing liar telah hilang",
  },
  {
    icon: Users,
    title: "Program Breeding",
    description: "Data taksonomi penting untuk program penangkaran dan mencegah inbreeding pada spesies langka.",
    stat: "4.000",
    statLabel: "harimau tersisa di alam liar",
  },
  {
    icon: Target,
    title: "Kebijakan Perlindungan",
    description: "Klasifikasi ilmiah menjadi dasar hukum untuk membuat regulasi perlindungan satwa liar internasional.",
    stat: "CITES",
    statLabel: "melindungi semua Felidae",
  },
]

const endangeredFelidae = [
  {
    name: "Harimau",
    scientific: "Panthera tigris",
    status: "Endangered",
    population: "~4,500",
    color: "bg-red-500",
  },
  {
    name: "Macan Tutul Salju",
    scientific: "Panthera uncia",
    status: "Vulnerable",
    population: "~4,000",
    color: "bg-orange-500",
  },
  {
    name: "Kucing Pasir",
    scientific: "Felis margarita",
    status: "Near Threatened",
    population: "Unknown",
    color: "bg-yellow-500",
  },
  {
    name: "Singa Asia",
    scientific: "Panthera leo persica",
    status: "Endangered",
    population: "~700",
    color: "bg-red-500",
  },
]

export function TaxonomyConservation() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.25 })
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const yCta = useTransform(scrollYProgress, [0, 1], [30, -20])

  return (
    <section ref={sectionRef} className="py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.05 } : {}}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary blur-3xl" />
      </motion.div>

      <div ref={ref as React.RefObject<HTMLDivElement>} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Hapus blur effect */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
          >
            <Leaf size={16} />
            Konservasi
          </motion.span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Memahami Taksonomi: Langkah Awal Melindungi Alam
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Taksonomi bukan sekadar ilmu klasifikasi. Ini adalah fondasi penting dalam upaya konservasi global untuk
            melindungi spesies yang terancam punah dan menjaga keseimbangan ekosistem.
          </p>
        </motion.div>

        {/* Conservation Points */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          {conservationPoints.map((point, index) => (
            <motion.div
              key={point.title}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                  className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors"
                >
                  <point.icon className="text-accent" size={28} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{point.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-accent">{point.stat}</span>
                    <span className="text-sm text-muted-foreground">{point.statLabel}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Endangered Species Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-background rounded-2xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border bg-red-500/5">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={24} />
              Spesies Felidae yang Terancam
            </h3>
            <p className="text-muted-foreground mt-2">
              Beberapa anggota keluarga Felidae membutuhkan perhatian konservasi segera.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {endangeredFelidae.map((species, index) => (
              <motion.div
                key={species.name}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${species.color}`} />
                  <span className="text-xs font-medium text-muted-foreground">{species.status}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{species.name}</h4>
                <p className="text-xs text-primary font-mono mb-2">{species.scientific}</p>
                <p className="text-sm text-muted-foreground">
                  Populasi: <span className="text-foreground font-medium">{species.population}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          style={{ y: yCta }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 border border-accent/20">
            <Heart className="text-red-500" size={32} />
            <div className="text-left">
              <p className="font-semibold text-foreground">Jadilah Bagian dari Solusi</p>
              <p className="text-sm text-muted-foreground">
                Dengan mempelajari taksonomi, Anda berkontribusi pada kesadaran konservasi global.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
