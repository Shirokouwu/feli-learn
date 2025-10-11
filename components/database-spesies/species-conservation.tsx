"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  ArrowUpDown,
  AlertOctagon,
  X,
  ShieldCheck,
  Check,
  Leaf,
  MapPin,
} from "lucide-react"
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

export function SpeciesConservation({ species, details }: SpeciesTabProps) {
  const conservationStatus = details.konservasi?.status_konservasi_alam?.split(" ")[0] || "Tidak diketahui"
  const population = formatValue(details.konservasi?.total_populasi)
  const trend = details.konservasi?.tren_populasi?.split(" ")[0] || "Tidak diketahui"

  const getStatusColor = (status: string) => {
    if (status.includes("Endangered")) return "red"
    if (status.includes("Vulnerable")) return "orange"
    if (status.includes("Threatened")) return "yellow"
    return "emerald"
  }

  const statusColor = getStatusColor(details.konservasi?.status_konservasi_alam || "")

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-transparent p-6 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <ShieldAlert className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-800">Status Konservasi</h2>
            <p className="text-emerald-600">
              Status konservasi dan upaya perlindungan {species.nama_umum || species.nama}
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
            <div className={`bg-${statusColor}-100 p-2 rounded-lg`}>
              <AlertTriangle className={`h-5 w-5 text-${statusColor}-600`} />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Status</p>
              <p className={`font-semibold text-${statusColor}-600`}>{conservationStatus}</p>
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
              <p className="text-sm text-neutral-500">Populasi</p>
              <p className="font-semibold text-neutral-800">{population}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <ArrowUpDown className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Tren</p>
              <p className="font-semibold text-neutral-800">{trend}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conservation Status */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 text-${statusColor}-600`} />
              Status Konservasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <Badge variant="secondary" className={`bg-${statusColor}-100 text-${statusColor}-700`}>
                  {formatValue(details.konservasi?.status_konservasi_alam)}
                </Badge>
                {details.konservasi?.tahun_penilaian && (
                  <p className="text-sm text-neutral-600 mt-2">
                    Tahun penilaian:{" "}
                    <span className="font-medium">{formatValue(details.konservasi.tahun_penilaian)}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Population Data */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Data Populasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700 mb-2">{population}</div>
                {details.konservasi?.tren_populasi && (
                  <div className="flex items-center gap-2">
                    <ArrowUpDown
                      className={`h-4 w-4 ${
                        details.konservasi.tren_populasi.toLowerCase().includes("meningkat")
                          ? "text-emerald-600 rotate-45"
                          : details.konservasi.tren_populasi.toLowerCase().includes("menurun")
                            ? "text-red-600 rotate-135"
                            : "text-yellow-600"
                      }`}
                    />
                    <span className="text-neutral-700">{formatValue(details.konservasi.tren_populasi)}</span>
                  </div>
                )}
                {details.konservasi?.detail_tren && (
                  <p className="text-sm text-neutral-600 mt-2">{formatValue(details.konservasi.detail_tren)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Threats */}
        {details.konservasi?.ancaman && details.konservasi.ancaman.length > 0 && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-red-600" />
                Ancaman Utama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formatArray(details.konservasi.ancaman).map((threat, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="bg-red-100 p-1 rounded-full mt-1">
                      <X className="h-3 w-3 text-red-600" />
                    </div>
                    <span className="text-neutral-700 text-sm leading-relaxed">{threat}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conservation Efforts */}
        {details.konservasi?.upaya_konservasi && details.konservasi.upaya_konservasi.length > 0 && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Upaya Konservasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formatArray(details.konservasi.upaya_konservasi).map((effort, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                  >
                    <div className="bg-emerald-100 p-1 rounded-full mt-1">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-neutral-700 text-sm leading-relaxed">{effort}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Conservation Recommendations and Protected Areas - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conservation Recommendations */}
        {details.konservasi?.rekomendasi_konservasi && details.konservasi.rekomendasi_konservasi.length > 0 && (
          <Card className="border-neutral-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-600" />
                Rekomendasi Konservasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formatArray(details.konservasi.rekomendasi_konservasi).map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                  >
                    <div className="bg-emerald-100 p-1 rounded-full mt-1">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-neutral-700 text-sm leading-relaxed">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Protected Areas */}
        <Card className="border-neutral-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-neutral-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Area Perlindungan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {details.konservasi?.perlindungan_area_konservasi &&
            details.konservasi.perlindungan_area_konservasi.length > 0 ? (
              <div className="space-y-3">
                {formatArray(details.konservasi.perlindungan_area_konservasi).map((area, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                  >
                    <div className="bg-emerald-100 p-1 rounded-full mt-1">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-neutral-700 text-sm leading-relaxed">{area}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-neutral-600 leading-relaxed">
                  {details.konservasi?.status_konservasi_alam?.includes("Least Concern")
                    ? "Spesies ini memiliki status konservasi Least Concern, sehingga tidak memerlukan area perlindungan khusus."
                    : details.konservasi?.status_konservasi_alam
                      ? "Tidak ada data area perlindungan khusus untuk spesies ini meskipun statusnya terancam."
                      : "Tidak ada data area perlindungan untuk spesies ini. Kemungkinan spesies ini tidak termasuk dalam kategori langka atau terancam punah."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
