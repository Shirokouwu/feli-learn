"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MapPin, Calendar, Globe, Ruler, Weight, Palette, Info } from "lucide-react"
import type { SpeciesOverviewProps } from "./types"

export function SpeciesOverview({ species, details }: SpeciesOverviewProps) {
  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return null
    return String(value)
  }

  const formatArray = (arr: any[] | null) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return null
    return arr.filter(Boolean).join(", ")
  }

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
          <Sparkles className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Ringkasan Spesies</h2>
        </div>
        <p className="text-emerald-100">Informasi umum dan karakteristik dasar {species.nama_umum || species.nama}</p>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {/* Body Length */}
        {details.deskripsi?.panjang_tubuh_cm && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-neutral-600">Panjang Tubuh</span>
            </div>
            <p className="text-lg font-bold text-neutral-800">{details.deskripsi.panjang_tubuh_cm} cm</p>
          </motion.div>
        )}

        {/* Weight */}
        {details.deskripsi?.berat_kg && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Weight className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-neutral-600">Berat</span>
            </div>
            <p className="text-lg font-bold text-neutral-800">{details.deskripsi.berat_kg} kg</p>
          </motion.div>
        )}

        {/* Height */}
        {details.deskripsi?.tinggi_bahu_cm && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-neutral-600">Tinggi Bahu</span>
            </div>
            <p className="text-lg font-bold text-neutral-800">{details.deskripsi.tinggi_bahu_cm} cm</p>
          </motion.div>
        )}

        {/* Discovery Year */}
        {species.tahun_penemuan && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-neutral-600">Ditemukan</span>
            </div>
            <p className="text-lg font-bold text-neutral-800">{species.tahun_penemuan}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Main Description */}
      {details.deskripsi?.deskripsi_umum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Info className="h-5 w-5" />
                Deskripsi Umum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700 leading-relaxed">{details.deskripsi.deskripsi_umum}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Physical Characteristics */}
      {(details.deskripsi?.morfologi || details.deskripsi?.warna || details.deskripsi?.pola) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Palette className="h-5 w-5" />
                Karakteristik Fisik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {details.deskripsi?.morfologi && (
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Morfologi</h4>
                  <p className="text-neutral-700 leading-relaxed">{details.deskripsi.morfologi}</p>
                </div>
              )}

              {details.deskripsi?.warna && (
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Warna</h4>
                  <p className="text-neutral-700 leading-relaxed">{details.deskripsi.warna}</p>
                </div>
              )}

              {formatArray(details.deskripsi?.pola) && (
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">Pola</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.deskripsi.pola?.map((pattern, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Geographic Distribution */}
      {formatArray(species.distribusi_geografis) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Globe className="h-5 w-5" />
                Distribusi Geografis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Add contextual description */}
                <p className="text-sm text-neutral-600 mb-3">Spesies ini ditemukan di berbagai wilayah berikut:</p>

                {/* Organized distribution with better hierarchy */}
                <div className="flex flex-wrap gap-2">
                  {species.distribusi_geografis
                    ?.sort((a, b) => {
                      // Sort by hierarchy: continents first, then regions, then countries
                      const hierarchy = {
                        Asia: 1,
                        "Asia Tenggara": 2,
                        Indonesia: 3,
                        India: 4,
                        China: 4,
                        Rusia: 4,
                        Myanmar: 4,
                        Thailand: 4,
                        Malaysia: 4,
                        Vietnam: 4,
                        Laos: 4,
                        Kamboja: 4,
                      }
                      return (hierarchy[a] || 999) - (hierarchy[b] || 999)
                    })
                    .map((location, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-colors duration-200 hover:border-emerald-300"
                        title={`Klik untuk informasi lebih lanjut tentang distribusi di ${location}`}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Additional Features */}
      {formatArray(details.deskripsi?.fitur_unik) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Sparkles className="h-5 w-5" />
                Fitur Unik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.deskripsi.fitur_unik?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-emerald-800">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
