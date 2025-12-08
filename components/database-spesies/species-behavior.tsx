"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Moon, Users, Target, MapPin, MessageSquare, Heart, BabyIcon } from "lucide-react"
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

export function SpeciesBehavior({ species, details }: SpeciesTabProps) {
  const activityPattern = details.perilaku?.pola_aktivitas?.split(" ")[0] || "Tidak diketahui"
  const socialStructure = details.perilaku?.struktur_sosial?.split(" ")[0] || "Tidak diketahui"
  const huntingStatus = details.perilaku?.perilaku_berburu ? "Pemburu aktif" : "Tidak diketahui"

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-transparent p-6 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Brain className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-800">Perilaku & Ekologi</h2>
            <p className="text-emerald-600">
              Detail tentang bagaimana {species.nama_umum || species.nama} berperilaku di alam
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
              <Moon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pola Aktivitas</p>
              <p className="font-semibold text-neutral-800">{activityPattern}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Struktur Sosial</p>
              <p className="font-semibold text-neutral-800">{socialStructure}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Berburu</p>
              <p className="font-semibold text-neutral-800">{huntingStatus}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Pattern */}
        {details.perilaku?.pola_aktivitas && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <Moon className="h-5 w-5 text-emerald-600" />
                Pola Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-neutral-700 leading-relaxed">{formatValue(details.perilaku.pola_aktivitas)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Structure */}
        {details.perilaku?.struktur_sosial && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Struktur Sosial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-neutral-700 leading-relaxed">{formatValue(details.perilaku.struktur_sosial)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Territoriality */}
        {details.perilaku?.teritorial !== null && details.perilaku?.teritorial !== undefined && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Teritorialitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <Badge
                  variant="secondary"
                  className={`${details.perilaku.teritorial ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-700"}`}
                >
                  {details.perilaku.teritorial ? "Teritorial" : "Non-teritorial"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hunting Behavior */}
        {details.perilaku?.perilaku_berburu && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                Perilaku Berburu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-neutral-700 leading-relaxed">{formatValue(details.perilaku.perilaku_berburu)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Communication Methods */}
        {details.perilaku?.komunikasi && details.perilaku.komunikasi.length > 0 && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                Metode Komunikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {formatArray(details.perilaku.komunikasi).map((method, index) => (
                  <div key={index} className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {method}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mating Behavior */}
        {details.perilaku?.perilaku_kawin && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                Perilaku Kawin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-neutral-700 leading-relaxed">{formatValue(details.perilaku.perilaku_kawin)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Parenting Behavior */}
      {details.perilaku?.perilaku_pengasuhan && (
        <Card className="border-neutral-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
              <BabyIcon className="h-5 w-5 text-emerald-600" />
              Perilaku Pengasuhan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-neutral-700 leading-relaxed">{formatValue(details.perilaku.perilaku_pengasuhan)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
