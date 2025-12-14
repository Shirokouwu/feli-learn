"use client"

import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useScrollAnimation, staggerContainer, staggerItem } from "@/hooks/use-scroll-animation"
import { SectionBackground } from "@/components/section-background"
import { Cat, Eye, Moon, Target } from "lucide-react"

export function WhatIsFelidae() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.1 })

  const felids = [
    {
      name: "Harimau",
      latin: "Panthera tigris",
      image: "https://www.rekoforest.org/wp-content/uploads/2021/07/rer-sumatran-tiger.png",
    },
    {
      name: "Singa",
      latin: "Panthera leo",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNantoDdnl9CtdcNEinc5Rv6CjozLqivQ1oA&s",
    },
    {
      name: "Macan Tutul",
      latin: "Panthera pardus",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Panthera_pardus_japonensis_JdP.jpg",
    },
    {
      name: "Kucing Hutan",
      latin: "Felis silvestris",
      image: "https://www.wiesbaden.de/leben-in-wiesbaden/freizeit/natur-erleben/fasanerie/Europaeische-Wildkatze.php.media/302435/Fasanerie-Wildkatze_2018-Kordesch-aF-13-_2.jpg.scaled/a75ed65886262b06a1399250280e2c1c.jpg",
    },
  ]

  const characteristics = [
    {
      icon: Cat,
      title: "Cakar Retraktil",
      desc: "Dapat menarik cakar ke dalam telapak untuk melindungi ketajaman saat berjalan",
    },
    {
      icon: Target,
      title: "Karnivora Obligat",
      desc: "Membutuhkan daging sebagai sumber nutrisi utama untuk bertahan hidup",
    },
    {
      icon: Eye,
      title: "Penglihatan Nokturnal",
      desc: "Mata khusus dengan tapetum lucidum untuk berburu di malam hari",
    },
    {
      icon: Moon,
      title: "Pemburu Soliter",
      desc: "Sebagian besar berburu sendiri dengan teknik mengendap (kecuali singa)",
    },
  ]

  const stats = [
    { value: "41", label: "Spesies", color: "text-primary" },
    { value: "14", label: "Genus", color: "text-accent" },
    { value: "2", label: "Subfamili", color: "text-primary" },
    { value: "5", label: "Benua", color: "text-accent" },
  ]

  return (
    <section className="py-14 lg:py-20 xl:py-28 bg-muted/30 overflow-hidden relative">
      <SectionBackground variant="gradient" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-primary/10 rounded-full opacity-40" />
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-accent/10 rounded-full opacity-30" />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 lg:mb-14 xl:mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            <div className="lg:max-w-2xl">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-5"
              >
                <Cat size={14} />
                The Cat Family
              </motion.span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 lg:mb-6 text-balance leading-tight">
                Apa itu <span className="text-primary">Felidae</span>?
              </h2>
            </div>
            <div className="lg:max-w-md lg:pt-10 xl:pt-16">
              <p className="text-muted-foreground text-base lg:text-lg xl:text-xl leading-relaxed">
                <strong className="text-foreground">Felidae</strong> adalah famili taksonomi yang mencakup semua spesies
                kucing di dunia — dari kucing rumah hingga harimau besar. Famili ini terdiri dari{" "}
                <span className="text-primary font-semibold">41 spesies</span> yang tersebar di seluruh benua kecuali
                Antartika dan Australia.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 lg:mb-14 xl:mb-16"
        >
          <div className="grid grid-cols-4 gap-2 lg:gap-3 xl:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + index * 0.05 }}
                className="group text-center p-3 sm:p-5 lg:p-6 xl:p-8 rounded-xl lg:rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300"
              >
                <p
                  className={`text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold ${stat.color} mb-1 lg:mb-2 group-hover:scale-105 transition-transform duration-300`}
                >
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 xl:gap-8">
          {/* Characteristics - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-5 flex items-center gap-3">
              <span className="w-10 h-1 bg-primary rounded-full" />
              Karakteristik Unik Felidae
            </h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
            >
              {characteristics.map((item) => (
                <motion.div
                  key={item.title}
                  variants={staggerItem}
                  className="group flex items-start gap-4 p-4 lg:p-5 rounded-xl bg-card/50 border border-border hover:border-primary/30 hover:bg-card transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg mb-1">{item.title}</p>
                    <p className="text-muted-foreground text-base leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Felid Cards - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-5 flex items-center gap-3">
              <span className="w-10 h-1 bg-accent rounded-full" />
              Spesies Ikonik
            </h3>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {felids.map((felid, index) => (
                <motion.div
                  key={felid.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.06 }}
                  className="group relative overflow-hidden rounded-xl lg:rounded-2xl bg-transparent border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="aspect-[3/4] relative">
                    <img
                      src={felid.image || "/placeholder.svg"}
                      alt={felid.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)",
                      }}
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                    <div className="rounded-xl bg-black/45 backdrop-blur-sm border border-white/12 px-3 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                        <p className="font-semibold text-white text-base lg:text-lg">{felid.name}</p>
                      </div>
                      <p className="text-sm text-white/80 italic">{felid.latin}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-14 flex justify-center">
          <div className="flex items-center gap-3">
            <span className="w-16 h-0.5 bg-linear-to-r from-transparent to-primary/50 rounded-full" />
            <Cat className="text-primary/50" size={18} />
            <span className="w-16 h-0.5 bg-linear-to-l from-transparent to-primary/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
