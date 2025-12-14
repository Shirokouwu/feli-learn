"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Layers, TreeDeciduous, Tag, Network, Quote, BookOpen, Lightbulb, HelpCircle } from "lucide-react"
import { useScrollAnimation, staggerContainer, staggerItem } from "@/hooks/use-scroll-animation"
import { SectionBackground } from "@/components/section-background"
import Image from "next/image"

export function WhatIsTaxonomy() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.1 })

  const taxonomyLevels = [
    { name: "Kingdom", example: "Animalia", color: "bg-chart-1" },
    { name: "Phylum", example: "Chordata", color: "bg-chart-2" },
    { name: "Class", example: "Mammalia", color: "bg-chart-3" },
    { name: "Order", example: "Carnivora", color: "bg-chart-4" },
    { name: "Family", example: "Felidae", color: "bg-primary" },
    { name: "Genus", example: "Panthera", color: "bg-accent" },
    { name: "Species", example: "P. tigris", color: "bg-chart-5" },
  ]

  const featureCards = [
    { icon: Layers, title: "Hierarki Terstruktur", desc: "7 tingkat klasifikasi dari umum ke spesifik" },
    { icon: TreeDeciduous, title: "Hubungan Evolusi", desc: "Melihat koneksi kekerabatan antar spesies" },
    { icon: Tag, title: "Nama Ilmiah", desc: "Identifikasi universal di seluruh dunia" },
    { icon: Network, title: "Sistem Binomial", desc: "Penamaan Genus + Spesies" },
  ]

  return (
    <section id="taxonomy" className="py-16 lg:py-20 xl:py-24 bg-card overflow-hidden relative">
      <SectionBackground variant="grid" />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 lg:mb-16 xl:mb-20"
        >
          {/* Header dengan visual yang menarik */}
          <div className="text-center mb-10 lg:mb-14 xl:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Fundamental Knowledge
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 lg:mb-8 text-balance">
              Apa itu Taksonomi?
            </h2>
          </div>

          {/* Definisi dan penjelasan taksonomi - visual card */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-10 lg:mb-14 xl:mb-16">
            {/* Card definisi utama */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/5 border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl font-bold text-foreground">Definisi Sederhana</h3>
              </div>
              <p className="text-lg lg:text-xl text-foreground leading-relaxed mb-3 lg:mb-4">
                <strong className="text-primary">Taksonomi</strong> adalah ilmu yang mempelajari cara{" "}
                <em>mengklasifikasikan</em>, <em>menamai</em>, dan <em>mengelompokkan</em> semua makhluk hidup di Bumi.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Bayangkan seperti sistem perpustakaan raksasa — tapi bukan untuk buku, melainkan untuk{" "}
                <strong className="text-foreground">jutaan spesies</strong> yang ada di planet kita. Dari bakteri
                terkecil hingga paus terbesar, semuanya punya "alamat" di sistem ini.
              </p>
            </motion.div>

            {/* Card analogi sehari-hari */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 lg:p-8 rounded-2xl bg-secondary/50 border border-border"
            >
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl font-bold text-foreground">Kenapa Penting?</h3>
              </div>
              <p className="text-foreground leading-relaxed mb-4">
                Tanpa taksonomi, dunia ilmiah akan kacau. Bayangkan kalau setiap negara punya nama berbeda untuk hewan
                yang sama:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Indonesia: <strong className="text-foreground">"Harimau"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Inggris: <strong className="text-foreground">"Tiger"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Jepang: <strong className="text-foreground">"Tora" (虎)</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Ilmuwan semua negara: <strong className="text-primary">"Panthera tigris"</strong>
                  </span>
                </li>
              </ul>
              <p className="text-foreground mt-4 text-sm bg-primary/5 p-3 rounded-lg">
                Dengan taksonomi, ilmuwan dari Jepang hingga Brasil bicara bahasa yang sama!
              </p>
            </motion.div>
          </div>

          {/* Feature cards - kegunaan taksonomi */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-12 lg:mb-16 xl:mb-20"
          >
            {featureCards.map((item) => (
              <motion.div
                key={item.title}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-5 rounded-xl bg-background border border-border hover:border-primary/30 transition-all"
              >
                <item.icon className="text-primary mb-3" size={28} />
                <p className="font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 lg:mb-16 xl:mb-20"
        >
          {/* Divider dengan pertanyaan transisi */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center gap-4 text-muted-foreground text-sm mb-4 lg:mb-6">
              <span className="h-px w-12 bg-border" />
              <span>Tapi siapa yang menciptakan sistem jenius ini?</span>
              <span className="h-px w-12 bg-border" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Kisah Sang <span className="text-primary">Bapak Taksonomi</span>
            </h3>
          </div>

          {/* Story Linnaeus dengan layout yang lebih engaging */}
          <div className="grid lg:grid-cols-[1fr,280px] xl:grid-cols-[1fr,320px] gap-6 lg:gap-8 xl:gap-10 items-start">
            <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
              <p className="text-base lg:text-lg text-foreground leading-relaxed">
                Tahun 1735, Eropa masih dalam kebingungan ilmiah. Para naturalis dari berbagai negara tidak bisa
                berkomunikasi dengan baik karena setiap daerah punya nama sendiri untuk hewan dan tumbuhan yang sama.
                Penelitian jadi terhambat, publikasi ilmiah penuh kesalahpahaman.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Di tengah kekacauan ini, seorang naturalis muda berusia{" "}
                <strong className="text-foreground">28 tahun</strong> dari Swedia menerbitkan sebuah buku yang akan
                mengubah segalanya. Namanya <strong className="text-primary">Carl Linnaeus</strong>, dan bukunya
                berjudul <em className="text-accent">"Systema Naturae"</em>.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Ide Linnaeus sederhana tapi revolusioner: gunakan{" "}
                <strong className="text-foreground">dua kata Latin</strong> untuk menamai setiap spesies. Kata pertama
                untuk <em>Genus</em> (kelompok), kata kedua untuk <em>Species</em> (jenis spesifik). Sistem ini kemudian
                dikenal sebagai <strong className="text-primary">Nomenklatur Binomial</strong>.
              </p>

              <div className="p-5 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <Quote className="w-8 h-8 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-foreground italic text-lg leading-relaxed mb-2">
                      "Nomina si nescis, perit et cognitio rerum"
                    </p>
                    <p className="text-muted-foreground text-sm">
                      "Jika kamu tidak tahu namanya, pengetahuan tentang hal itu pun hilang"
                    </p>
                    <p className="text-accent text-sm font-medium mt-1">— Carl Linnaeus</p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                Berkat Linnaeus, harimau di seluruh dunia kini dikenal sebagai{" "}
                <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">Panthera tigris</span>, singa
                sebagai <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">Panthera leo</span>.
                Sistem yang ia ciptakan hampir 300 tahun lalu masih kita gunakan hingga hari ini.
              </p>
            </div>

            {/* Linnaeus portrait card - lebih menonjol */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="order-1 lg:order-2 lg:sticky lg:top-24"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border">
                <div className="relative w-full aspect-[3/4] mb-4 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/6/68/Carl_von_Linn%C3%A9.jpg"
                    alt="Carl Linnaeus - Bapak Taksonomi Modern"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h4 className="font-serif text-2xl font-bold text-foreground">Carl Linnaeus</h4>
                    <p className="text-primary font-medium">Bapak Taksonomi Modern</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-2xl font-bold text-foreground">1707</p>
                    <p className="text-xs text-muted-foreground">Tahun Lahir</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-2xl font-bold text-foreground">1778</p>
                    <p className="text-xs text-muted-foreground">Tahun Wafat</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-accent/10 text-center">
                  <p className="text-sm text-muted-foreground">Karya Fenomenal</p>
                  <p className="text-accent font-semibold italic">Systema Naturae (1735)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
              7 Tingkatan Taksonomi Linnaeus
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sistem hierarki yang digunakan hingga saat ini untuk mengklasifikasikan seluruh makhluk hidup
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl mx-auto bg-background rounded-2xl p-8 border border-border"
          >
            <div className="space-y-3">
              {taxonomyLevels.map((level, index) => (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="flex items-center gap-4"
                  style={{ paddingLeft: `${index * 16}px` }}
                >
                  <div className={`w-4 h-4 rounded-full ${level.color} shadow-lg`} />
                  <div className="flex-1 flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all">
                    <span className="font-semibold text-foreground">{level.name}</span>
                    <span className="text-muted-foreground italic">{level.example}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <p className="text-sm text-muted-foreground">
                Contoh lengkap klasifikasi <strong className="text-foreground">Harimau</strong>
              </p>
              <p className="text-primary font-semibold mt-1">Panthera tigris</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
