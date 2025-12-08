"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, MapPin, Ruler, Weight, AlertTriangle } from "lucide-react"
import Image from "next/image"

export function EncyclopediaPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeSpecies, setActiveSpecies] = useState(0)

  const species = [
    {
      name: "Harimau Sumatera",
      latin: "Panthera tigris sumatrae",
      image: "/placeholder.svg?height=400&width=600",
      habitat: "Hutan hujan Sumatera",
      size: "2.2 - 2.5 m",
      weight: "100 - 140 kg",
      status: "Critically Endangered",
      statusColor: "text-red-500",
      description: "Subspesies harimau terkecil yang hanya ditemukan di pulau Sumatera, Indonesia.",
    },
    {
      name: "Macan Tutul Salju",
      latin: "Panthera uncia",
      image: "/placeholder.svg?height=400&width=600",
      habitat: "Pegunungan Asia Tengah",
      size: "1.8 - 2.3 m",
      weight: "25 - 55 kg",
      status: "Vulnerable",
      statusColor: "text-orange-500",
      description: "Kucing besar yang hidup di ketinggian ekstrem pegunungan Asia Tengah.",
    },
    {
      name: "Cheetah",
      latin: "Acinonyx jubatus",
      image: "/placeholder.svg?height=400&width=600",
      habitat: "Sabana Afrika",
      size: "1.1 - 1.5 m",
      weight: "35 - 65 kg",
      status: "Vulnerable",
      statusColor: "text-orange-500",
      description: "Hewan darat tercepat di dunia, mampu berlari hingga 120 km/jam.",
    },
  ]

  return (
    <section id="encyclopedia" ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Encyclopedia Preview
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Temui Spesies Felidae
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Jelajahi 41 spesies kucing liar dengan informasi lengkap dan foto berkualitas tinggi
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Species list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-3"
          >
            {species.map((s, index) => (
              <button
                key={s.name}
                onClick={() => setActiveSpecies(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeSpecies === index
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={s.image || "/placeholder.svg"}
                      alt={s.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-sm text-muted-foreground italic">{s.latin}</p>
                  </div>
                </div>
              </button>
            ))}
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              Lihat Semua 41 Spesies
              <ChevronRight size={16} />
            </Button>
          </motion.div>

          {/* Species detail */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl overflow-hidden bg-card border border-border">
              <div className="aspect-[16/9] relative">
                <Image
                  src={species[activeSpecies].image || "/placeholder.svg"}
                  alt={species[activeSpecies].name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full bg-background/90 backdrop-blur text-sm font-medium ${species[activeSpecies].statusColor}`}
                  >
                    {species[activeSpecies].status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-1">{species[activeSpecies].name}</h3>
                <p className="text-muted-foreground italic mb-4">{species[activeSpecies].latin}</p>
                <p className="text-muted-foreground mb-6 leading-relaxed">{species[activeSpecies].description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <MapPin className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-muted-foreground">Habitat</p>
                      <p className="text-sm font-medium text-foreground truncate">{species[activeSpecies].habitat}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Ruler className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-muted-foreground">Ukuran</p>
                      <p className="text-sm font-medium text-foreground">{species[activeSpecies].size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Weight className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-muted-foreground">Berat</p>
                      <p className="text-sm font-medium text-foreground">{species[activeSpecies].weight}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <AlertTriangle className="text-primary shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className={`text-sm font-medium ${species[activeSpecies].statusColor}`}>IUCN</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
