"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TreesIcon as TreeIcon, Globe, Droplet, Check, Heart, MapPin } from "lucide-react"
import type { SpeciesTabProps } from "./types"
import { motion } from "framer-motion"

// Helper function to safely format values
const formatValue = (value: any): string => {
  if (value === null || value === undefined) return "Tidak diketahui"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

// Helper function to safely format arrays
const formatArray = (arr: any): string[] => {
  if (!Array.isArray(arr)) return []
  return arr.map((item) => formatValue(item))
}

export function SpeciesHabitat({ species, details }: SpeciesTabProps) {
  const primaryHabitat = details.habitat?.tipe?.[0] || "Tidak diketahui"
  const distribution = species.distribusi_geografis?.[0]?.split(" ")[0] || "Tidak diketahui"
  const characteristics = details.habitat?.karakteristik?.length || 0

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-transparent p-6 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <TreeIcon className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-800">Habitat & Distribusi</h2>
            <p className="text-emerald-600">
              Informasi tentang tempat hidup dan sebaran geografis {species.nama_umum || species.nama}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <TreeIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Habitat Utama</p>
              <p className="font-semibold text-neutral-800">{primaryHabitat}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Globe className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Distribusi</p>
              <p className="font-semibold text-neutral-800">{distribution}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Droplet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Karakteristik</p>
              <p className="font-semibold text-neutral-800">{characteristics} ciri</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habitat Types */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
              <TreeIcon className="h-5 w-5 text-emerald-600" />
              Tipe Habitat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {details.habitat?.tipe && details.habitat.tipe.length > 0 ? (
              <div className="space-y-3">
                {formatArray(details.habitat.tipe).map((habitat, index) => (
                  <div key={index} className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {habitat}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-lg text-center">
                <p className="text-neutral-500">Informasi tipe habitat tidak tersedia</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-600" />
              Distribusi Geografis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {species.distribusi_geografis && species.distribusi_geografis.length > 0 ? (
              <div className="space-y-3">
                {formatArray(species.distribusi_geografis).map((region, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-neutral-700">{region}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-lg text-center">
                <p className="text-neutral-500">Informasi distribusi tidak tersedia</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habitat Characteristics */}
        {details.habitat?.karakteristik && details.habitat.karakteristik.length > 0 && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <Droplet className="h-5 w-5 text-emerald-600" />
                Karakteristik Habitat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formatArray(details.habitat.karakteristik).map((characteristic, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="bg-emerald-100 p-1 rounded-full mt-1">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-neutral-700 text-sm leading-relaxed">{characteristic}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habitat Preferences */}
        {details.habitat?.preferensi && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                Preferensi Habitat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-neutral-700 leading-relaxed">{formatValue(details.habitat.preferensi)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Habitat Image */}
      <Card className="border-neutral-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
            <TreeIcon className="h-5 w-5 text-emerald-600" />
            Habitat Alami
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
            <Image
              src={
                species.url_gambar ||
                (details.gambar?.length > 0
                  ? details.gambar[0].url
                  : "/placeholder.svg?height=400&width=800&query=natural habitat")
              }
              alt={`Habitat alami ${species.nama_umum || species.nama}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-4 left-4">
                <p className="text-white/80 text-sm mb-1">{primaryHabitat}</p>
                <p className="text-white font-medium">Habitat alami {species.nama_umum || species.nama}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conservation Areas */}
      <Card className="border-neutral-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Area Konservasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {details.konservasi?.perlindungan_area_konservasi &&
          details.konservasi.perlindungan_area_konservasi.length > 0 ? (
            <div className="space-y-3">
              {formatArray(details.konservasi.perlindungan_area_konservasi).map((area, index) => (
                <div key={index} className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200">
                    {area}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-neutral-600 leading-relaxed">
                {details.konservasi?.status_konservasi_alam?.includes("Least Concern")
                  ? "Spesies ini memiliki status konservasi Least Concern, sehingga tidak memerlukan area perlindungan khusus."
                  : "Tidak ada data area perlindungan khusus untuk spesies ini."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
