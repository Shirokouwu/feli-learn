"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Layers, Tag, Crown, BookOpen, ChevronDown, ChevronUp, Triangle, Sparkles, CircleDot } from "lucide-react"
import type { TaksonomiSpesies, TaksonomiGenus } from "@/lib/supabase-v2"

interface SpeciesTaxonomySidebarProps {
  species: (TaksonomiSpesies & { genus?: TaksonomiGenus }) | null
}

export function SpeciesTaxonomySidebar({ species }: SpeciesTaxonomySidebarProps) {
  const [isTaxonomyOpen, setIsTaxonomyOpen] = useState(true)
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set())

  if (!species) return null

  const taxonomyLevels = [
    {
      label: "Kerajaan",
      value: species.kerajaan,
      icon: Crown,
      color: "bg-purple-100 text-purple-600",
      description: "Kelompok organisme hidup terbesar",
    },
    {
      label: "Filum",
      value: species.filum,
      icon: Triangle,
      color: "bg-green-100 text-green-600",
      description: "Pembagian berdasarkan struktur tubuh dasar",
    },
    {
      label: "Kelas",
      value: species.kelas,
      icon: Layers,
      color: "bg-blue-100 text-blue-600",
      description: "Kelompok berdasarkan karakteristik umum",
    },
    {
      label: "Ordo",
      value: species.ordo,
      icon: Sparkles,
      color: "bg-yellow-100 text-yellow-600",
      description: "Pengelompokan berdasarkan gaya hidup",
    },
    {
      label: "Famili",
      value: species.famili,
      icon: CircleDot,
      color: "bg-orange-100 text-orange-600",
      description: "Kelompok keluarga dengan ciri serupa",
    },
    {
      label: "Genus",
      value: species.genus?.nama || "Tidak tersedia",
      icon: Tag,
      color: "bg-teal-100 text-teal-600",
      description: "Kelompok spesies yang berkerabat dekat",
    },
    {
      label: "Spesies",
      value: species.nama,
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
      description: "Unit dasar klasifikasi makhluk hidup",
    },
  ]

  const toggleLevel = (label: string) => {
    const newExpanded = new Set(expandedLevels)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedLevels(newExpanded)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <Card className="border-emerald-100 shadow-lg">
          <CardHeader
            className="pb-4 cursor-pointer hover:bg-emerald-50/50 transition-colors rounded-t-lg"
            onClick={() => setIsTaxonomyOpen(!isTaxonomyOpen)}
          >
            <CardTitle className="flex items-center justify-between text-emerald-700">
              <div className="flex items-center gap-2">
                <Triangle className="h-5 w-5" />
                Klasifikasi Taksonomi
              </div>
              {isTaxonomyOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>

          {isTaxonomyOpen && (
            <CardContent className="space-y-0 pt-0">
              {taxonomyLevels.map((level, index) => (
                <div key={level.label} className="border-b border-gray-100 last:border-b-0">
                  <div
                    className="flex items-center justify-between py-4 px-2 hover:bg-gray-50/50 cursor-pointer transition-colors rounded-lg"
                    onClick={() => toggleLevel(level.label)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${level.color}`}>
                        <level.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600">{level.label}</p>
                        <p className={`text-gray-800 truncate ${level.label === "Spesies" ? "italic" : ""}`}>
                          {level.value}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                        expandedLevels.has(level.label) ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {expandedLevels.has(level.label) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-2 pb-3"
                    >
                      <div className="ml-12 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Quick Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="border-emerald-100 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <BookOpen className="h-5 w-5" />
              Informasi Singkat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Nama Umum</p>
              <p className="text-neutral-800">{species.nama_umum || "Tidak tersedia"}</p>
            </div>

            <Separator className="bg-neutral-100" />

            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Nama Ilmiah</p>
              <p className="text-neutral-800 italic">{species.nama}</p>
            </div>

            {species.author_nama_ilmiah && (
              <>
                <Separator className="bg-neutral-100" />
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-1">Penulis</p>
                  <p className="text-neutral-800 text-sm">
                    {species.author_nama_ilmiah}
                    {species.tahun_penemuan && `, ${species.tahun_penemuan}`}
                  </p>
                </div>
              </>
            )}

            {species.distribusi_geografis && species.distribusi_geografis.length > 0 && (
              <>
                <Separator className="bg-neutral-100" />
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-2">Distribusi</p>
                  <div className="flex flex-wrap gap-1">
                    {species.distribusi_geografis.slice(0, 3).map((location, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        {location}
                      </Badge>
                    ))}
                    {species.distribusi_geografis.length > 3 && (
                      <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                        +{species.distribusi_geografis.length - 3} lainnya
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Genus Information */}
      {species.genus && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Tag className="h-5 w-5" />
                Tentang Genus {species.genus.nama}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {species.genus.deskripsi && (
                <p className="text-sm text-neutral-700 leading-relaxed">{species.genus.deskripsi}</p>
              )}

              {species.genus.jumlah_spesies && (
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-sm font-medium text-neutral-600">Jumlah Spesies</span>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {species.genus.jumlah_spesies} spesies
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
