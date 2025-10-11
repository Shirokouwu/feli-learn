"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ruler, Weight, Palette, Sparkles, Zap, Target, PawPrintIcon as Paw } from "lucide-react"
import type { SpeciesTabProps } from "./types"

export function SpeciesCharacteristics({ species, details }: SpeciesTabProps) {
  const deskripsi = details.deskripsi

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return null
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  const formatArray = (value: any) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === "string") {
      // Try to parse as JSON array first
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) return parsed
      } catch {
        // If not JSON, split by common separators
        return value
          .split(/[,;|]/)
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }
    return [String(value)]
  }

  // Function to create pattern tags from pola data
  const createPatternTags = (pola: any) => {
    if (!pola) return []

    const patterns = formatArray(pola)
    const patternTags: string[] = []

    patterns.forEach((pattern: string) => {
      const lowerPattern = pattern.toLowerCase()

      // Common pattern keywords to detect
      const patternKeywords = [
        "belang",
        "stripe",
        "striped",
        "garis",
        "bintik",
        "spot",
        "spotted",
        "titik",
        "solid",
        "polos",
        "uniform",
        "tabby",
        "classic",
        "mackerel",
        "calico",
        "tortoiseshell",
        "tricolor",
        "bicolor",
        "dua warna",
        "two-color",
        "tuxedo",
        "smoking",
        "pointed",
        "colorpoint",
        "marbled",
        "marble",
        "marbel",
        "rosette",
        "roset",
        "agouti",
        "ticked",
      ]

      // Check if pattern contains any keywords
      const foundKeywords = patternKeywords.filter((keyword) => lowerPattern.includes(keyword))

      if (foundKeywords.length > 0) {
        // Add the original pattern as a tag
        patternTags.push(pattern)
      } else {
        // If no keywords found, split by common separators and add as individual tags
        const splitPatterns = pattern.split(/[,;.\-\s]+/).filter(Boolean)
        patternTags.push(...splitPatterns)
      }
    })

    // Remove duplicates and limit to 6 tags
    return [...new Set(patternTags)].slice(0, 6)
  }

  const patternTags = createPatternTags(deskripsi?.pola)

  const physicalStats = [
    {
      label: "Panjang Tubuh",
      value: deskripsi?.panjang_tubuh_cm ? `${deskripsi.panjang_tubuh_cm} cm` : null,
      icon: Ruler,
      color: "blue",
    },
    {
      label: "Tinggi Bahu",
      value: deskripsi?.tinggi_bahu_cm ? `${deskripsi.tinggi_bahu_cm} cm` : null,
      icon: Ruler,
      color: "green",
    },
    {
      label: "Berat",
      value: deskripsi?.berat_kg ? `${deskripsi.berat_kg} kg` : null,
      icon: Weight,
      color: "purple",
    },
    {
      label: "Kecepatan Lari",
      value: formatValue(deskripsi?.kecepatan_lari),
      icon: Zap,
      color: "orange",
    },
  ]

  const characteristics = [
    {
      title: "Morfologi",
      content: formatValue(deskripsi?.morfologi),
      icon: Paw,
    },
    {
      title: "Warna",
      content: formatValue(deskripsi?.warna),
      icon: Palette,
    },
    {
      title: "Dimorfisme Seksual",
      content: formatValue(deskripsi?.dimorfisme_seksual),
      icon: Target,
    },
    {
      title: "Adaptasi Fisik",
      content: formatValue(deskripsi?.adaptasi_fisik),
      icon: Sparkles,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <Paw className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Karakteristik Fisik</h2>
        </div>
        <p className="text-emerald-100">Ciri-ciri fisik dan morfologi {species.nama_umum || species.nama}</p>
      </motion.div>

      {/* Physical Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {physicalStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Card className="border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div
                  className={`bg-${stat.color}-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <h3 className="font-semibold text-neutral-800 mb-1 text-sm">{stat.label}</h3>
                <p className={`text-lg font-bold ${stat.value ? "text-emerald-600" : "text-neutral-400"}`}>
                  {stat.value || "Tidak ada data"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pola Bulu Section with Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-emerald-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Palette className="h-5 w-5" />
              Pola Bulu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patternTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patternTags.map((pattern, index) => (
                  <motion.div
                    key={`${pattern}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors duration-200 px-3 py-1 text-sm font-medium"
                    >
                      {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600 italic">Tidak ada data pola bulu</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Characteristics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {characteristics.map((char, index) => (
          <motion.div
            key={char.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Card className="border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-emerald-800 text-lg">
                  <char.icon className="h-5 w-5" />
                  {char.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700 leading-relaxed">
                  {char.content || (
                    <span className="text-neutral-400 italic">Tidak ada data {char.title.toLowerCase()}</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Fitur Unik */}
      {deskripsi?.fitur_unik && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Sparkles className="h-5 w-5" />
                Fitur Unik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formatArray(deskripsi.fitur_unik).map((fitur: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="bg-emerald-100 rounded-full p-1 mt-1 flex-shrink-0">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{fitur}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Deskripsi Umum */}
      {deskripsi?.deskripsi_umum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Paw className="h-5 w-5" />
                Deskripsi Umum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700 leading-relaxed">{deskripsi.deskripsi_umum}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
