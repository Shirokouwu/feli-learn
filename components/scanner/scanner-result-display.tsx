"use client";
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  AlertTriangle,
  Leaf,
  Search,
  ArrowRight,
  Info,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Species } from "@/types"
import type { EnhancedSpeciesData } from "@/lib/species-matcher"

interface ScannerResultDisplayProps {
  scanResult: Species | null
  enhancedSpeciesData: EnhancedSpeciesData | null
}

export const ScannerResultDisplay: React.FC<ScannerResultDisplayProps> = ({
  scanResult,
  enhancedSpeciesData
}) => {
  const router = useRouter()

  const navigateToTaxonomy = () => {
    if (scanResult) {
      router.push(`/taxonomy?species=${scanResult.id}&highlight=true&search=${encodeURIComponent(scanResult.name)}`)
    }
  }

  if (!scanResult) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-200 shadow-md"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-800">Hasil Identifikasi</h3>
            <p className="text-emerald-600">
              Teridentifikasi dengan akurasi {enhancedSpeciesData?.identifikasi.akurasi.toFixed(1) || '98.7'}%
            </p>
          </div>
        </div>

        {enhancedSpeciesData ? (
          // Enhanced display with database data
          <div className="mb-6">
            <p className="text-xl font-medium text-emerald-800 mb-1">
              {enhancedSpeciesData.identifikasi.nama_umum}
            </p>
            <p className="text-sm text-emerald-700 italic mb-3">
              {enhancedSpeciesData.identifikasi.nama_ilmiah}
            </p>

            <div className="space-y-2 mb-4">
              <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-colors duration-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {enhancedSpeciesData.identifikasi.status.konservasi}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 ml-2 hover:bg-emerald-200 transition-colors duration-300">
                <Leaf className="h-3 w-3 mr-1" />
                Endemik {enhancedSpeciesData.identifikasi.status.endemik}
              </Badge>
            </div>

            <p className="text-sm text-neutral-600 mb-4">
              {enhancedSpeciesData.ringkasan.deskripsi_umum}
            </p>
          </div>
        ) : (
          // Fallback display with basic scan result
          <div className="mb-6">
            <p className="text-xl font-medium text-emerald-800 mb-1">{scanResult.name}</p>
            <p className="text-sm text-emerald-700 italic mb-3">{scanResult.scientific_name}</p>

            <div className="space-y-2 mb-4">
              <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-colors duration-300">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {scanResult.conservation_status}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 ml-2 hover:bg-emerald-200 transition-colors duration-300">
                <Leaf className="h-3 w-3 mr-1" />
                Data terbatas
              </Badge>
            </div>

            <p className="text-sm text-neutral-600 mb-4">{scanResult.description}</p>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="distribution">Distribusi</TabsTrigger>
            <TabsTrigger value="conservation">Konservasi</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-4" asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {enhancedSpeciesData ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-emerald-700 mb-2 text-sm">Karakteristik Fisik</h4>
                      <div className="space-y-2">
                        {Object.entries(enhancedSpeciesData.ringkasan.karakteristik).map((key, value) =>
                          value ? (
                            <div
                              key={`char-${key}`}
                              className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100"
                            >
                              <span className="text-sm font-medium text-neutral-700 capitalize">{key}</span>
                              <span className="text-sm text-emerald-700">{value}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {enhancedSpeciesData.ringkasan.ciri_khas && (
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                          <h4 className="font-medium text-emerald-700 mb-2 text-sm">Ciri Khas</h4>
                          <p className="text-xs text-neutral-600">{enhancedSpeciesData.ringkasan.ciri_khas}</p>
                        </div>
                      )}

                      {enhancedSpeciesData.ringkasan.perilaku && (
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                          <h4 className="font-medium text-emerald-700 mb-2 text-sm">Perilaku</h4>
                          <p className="text-xs text-neutral-600">{enhancedSpeciesData.ringkasan.perilaku}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-emerald-700 mb-2 text-sm">Karakteristik Utama</h4>
                      <div className="space-y-2">
                        {Object.entries(scanResult.characteristics as Record<string, string>)
                          .slice(0, 4)
                          .map((key, value) => (
                            <div
                              key={`char-${key}`}
                              className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100"
                            >
                              <span className="text-sm font-medium text-neutral-700">{key}</span>
                              <span className="text-sm text-emerald-700">{value}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <h4 className="font-medium text-emerald-700 mb-2 text-sm">Informasi</h4>
                        <p className="text-xs text-neutral-600">Data detail tidak tersedia dari database.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4" asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {enhancedSpeciesData ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-emerald-700 mb-3 text-sm">Benua</h4>
                      <div className="space-y-2">
                        {enhancedSpeciesData.distribusi.benua.map((continent, index) => (
                          <div
                            key={index}
                            className="bg-white p-2 rounded-lg border border-emerald-100 flex items-center gap-2"
                          >
                            <div className="bg-emerald-50 p-1 rounded-full">
                              <MapPin className="h-3 w-3 text-emerald-600" />
                            </div>
                            <span className="text-xs text-neutral-700">{continent}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-emerald-700 mb-2 text-sm">Negara</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {enhancedSpeciesData.distribusi.negara.map((country, index) => (
                          <div
                            key={index}
                            className="bg-white p-2 rounded-lg border border-emerald-100 flex items-center gap-2"
                          >
                            <div className="bg-blue-50 p-1 rounded-full">
                              <MapPin className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-xs text-neutral-700">{country}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-neutral-500">Data distribusi tidak tersedia</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="conservation" className="space-y-4" asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {enhancedSpeciesData ? (
                  <div className="space-y-4">
                    {enhancedSpeciesData.konservasi.status_populasi && (
                      <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <h4 className="font-medium text-emerald-700 mb-2 text-sm">Status Populasi</h4>
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-700">
                              {enhancedSpeciesData.identifikasi.status.konservasi}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {enhancedSpeciesData.konservasi.status_populasi}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      {enhancedSpeciesData.konservasi.ancaman.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                          <h4 className="font-medium text-emerald-700 mb-2 text-sm">Ancaman Utama</h4>
                          <ul className="text-xs text-neutral-600 space-y-1">
                            {enhancedSpeciesData.konservasi.ancaman.slice(0, 3).map((threat, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-red-500 mt-0.5">•</span>
                                {threat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {enhancedSpeciesData.konservasi.upaya.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                          <h4 className="font-medium text-emerald-700 mb-2 text-sm">Upaya Konservasi</h4>
                          <ul className="text-xs text-neutral-600 space-y-1">
                            {enhancedSpeciesData.konservasi.upaya.slice(0, 3).map((effort, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-green-500 mt-0.5">•</span>
                                {effort}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {enhancedSpeciesData.konservasi.rekomendasi.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-700 mb-2 text-sm">Rekomendasi</h4>
                        <ul className="text-xs text-blue-600 space-y-1">
                          {enhancedSpeciesData.konservasi.rekomendasi.slice(0, 2).map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-blue-500 mt-0.5">•</span>
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-neutral-500">Data konservasi tidak tersedia</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={navigateToTaxonomy}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 group"
          >
            <Search className="h-4 w-4 mr-2" />
            Lihat di Diagram Taksonomi
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={() => router.push("/database")}
          >
            <Info className="h-4 w-4 mr-2" />
            Informasi Lengkap di Database
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
