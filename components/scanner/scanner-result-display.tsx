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
import { getConservationStatusColor } from "@/lib/conservation-utils"

interface ScannerResultDisplayProps {
  scanResult: Species | null
  enhancedSpeciesData: EnhancedSpeciesData | null
  scanDuration?: number
}

export const ScannerResultDisplay: React.FC<ScannerResultDisplayProps> = ({
  scanResult,
  enhancedSpeciesData,
  scanDuration = 0
}) => {
  const router = useRouter()

  // const navigateToTaxonomy = () => {
  //   if (scanResult) {
  //     router.push(`/taxonomy?species=${scanResult.id}&highlight=true&search=${encodeURIComponent(scanResult.name)}`)
  //   }
  // }

  if (!scanResult) return null

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-6 rounded-xl border border-emerald-200 shadow-md"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-800">Hasil Identifikasi</h3>
            <p className="text-emerald-600">
              Teridentifikasi dengan akurasi {enhancedSpeciesData?.identifikasi.akurasi.toFixed(1) || '98.7'}%
              {scanDuration > 0 && ` ( ${scanDuration >= 60
                ? `${Math.floor(scanDuration / 60)} menit ${scanDuration % 60} detik`
                : `${scanDuration} detik`} )`}
            </p>
          </div>
        </div>

        {enhancedSpeciesData ? (
          // Enhanced display with database data
          <div className="mb-6 ">
            {/* Scientific Name - Most Prominent */}
            <div className="text-center mb-4 p-3 md:p-4 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 rounded-lg border border-emerald-100 shadow-sm relative overflow-hidden">
              {/* Subtle decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/20 via-transparent to-teal-50/20 opacity-40"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-100/30 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 bg-teal-100/30 rounded-full translate-y-5 -translate-x-5"></div>

              <div className="relative z-10">
                <p className="text-lg md:text-2xl font-bold text-emerald-800 italic mb-2 tracking-wide break-words">
                  {enhancedSpeciesData.identifikasi.nama_ilmiah}
                </p>
                <p className="text-base md:text-lg font-medium text-emerald-600">
                  {enhancedSpeciesData.identifikasi.nama_umum}
                </p>
              </div>
            </div>

            {/* Status Badges - Minimalist */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4">
              <Badge className={`${getConservationStatusColor(enhancedSpeciesData.identifikasi.status.konservasi)} transition-colors duration-200 px-2 md:px-3 py-1 text-xs md:text-sm`}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Status: {enhancedSpeciesData.identifikasi.status.konservasi}
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors duration-200 px-2 md:px-3 py-1 text-xs md:text-sm">
                <Leaf className="h-3 w-3 mr-1" />
                Endemik: {enhancedSpeciesData.identifikasi.status.endemik}
              </Badge>
            </div>

            {/* Description - Clean */}
            <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed text-center">
                {enhancedSpeciesData.ringkasan.deskripsi_umum}
              </p>
            </div>
          </div>
        ) : (
          // Fallback display with basic scan result
          <div className="mb-6">
            {/* Scientific Name - Most Prominent */}
            <div className="text-center mb-4 p-3 md:p-4 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 rounded-lg border border-emerald-100 shadow-sm relative overflow-hidden">
              {/* Subtle decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/20 via-transparent to-teal-50/20 opacity-40"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-100/30 rounded-full -translate-y-6 translate-x-6"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 bg-teal-100/30 rounded-full translate-y-5 -translate-x-5"></div>

              <div className="relative z-10">
                <p className="text-lg md:text-2xl font-bold text-emerald-800 italic mb-2 tracking-wide break-words">
                  {scanResult.scientific_name}
                </p>
                <p className="text-base md:text-lg font-medium text-emerald-600">
                  {scanResult.name}
                </p>
              </div>
            </div>

            {/* Status Badges - Minimalist */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-4">
              <Badge className={`${getConservationStatusColor(scanResult.conservation_status)} transition-colors duration-200 px-2 md:px-3 py-1 text-xs md:text-sm`}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Status: </span>
                {scanResult.conservation_status}
              </Badge>
              <Badge className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors duration-200 px-2 md:px-3 py-1 text-xs md:text-sm">
                <Leaf className="h-3 w-3 mr-1" />
                Data terbatas
              </Badge>
            </div>

            {/* Description - Clean */}
            <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-center">
                {scanResult.description}
              </p>
            </div>
          </div>
        )}

        <Tabs defaultValue="taxonomy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4 h-auto">
            <TabsTrigger value="taxonomy" className="text-xs md:text-sm px-2 py-2 md:px-3">
              <span className="hidden sm:inline">Taksonomi</span>
              <span className="sm:hidden">Klasifikasi</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-xs md:text-sm px-2 py-2 md:px-3">
              <span className="hidden sm:inline">Ringkasan</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="text-xs md:text-sm px-2 py-2 md:px-3">
              <span className="hidden sm:inline">Distribusi</span>
              <span className="sm:hidden">Lokasi</span>
            </TabsTrigger>
            <TabsTrigger value="conservation" className="text-xs md:text-sm px-2 py-2 md:px-3">
              <span className="hidden sm:inline">Konservasi</span>
              <span className="sm:hidden">Status</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="sync">
            <>
              <TabsContent value="taxonomy" className="space-y-4" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="bg-white p-6 rounded-lg border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-4 text-lg text-center">Klasifikasi Taksonomi</h4>

                    {/* Penjelasan Taksonomi */}
                    <div className="bg-emerald-50 p-4 rounded-lg mb-6 border border-emerald-200">
                      <p className="text-sm text-emerald-700 text-center">
                        Taksonomi adalah sistem klasifikasi ilmiah untuk mengelompokkan makhluk hidup berdasarkan kesamaan karakteristik,
                        dari kelompok terbesar hingga paling spesifik.
                      </p>
                    </div>

                    {enhancedSpeciesData ? (
                      <div className="space-y-4">
                        {/* Nama Ilmiah yang Prominent */}
                        <div className="text-center mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                          <p className="text-xl font-bold text-emerald-800 italic mb-1">
                            {enhancedSpeciesData.identifikasi.nama_ilmiah}
                          </p>
                          <p className="text-md text-emerald-600 font-medium">
                            {enhancedSpeciesData.identifikasi.nama_umum}
                          </p>
                        </div>

                        {/* Hirarki Taksonomi */}
                        <div className="space-y-3">
                          {[
                            {
                              level: 'Kingdom',
                              name: 'Animalia',
                              description: 'Kelompok makhluk hidup yang bergerak dan memakan makhluk lain',
                              color: 'bg-purple-50 text-purple-800 border-purple-200'
                            },
                            {
                              level: 'Phylum',
                              name: 'Chordata',
                              description: 'Hewan bertulang belakang',
                              color: 'bg-blue-50 text-blue-800 border-blue-200'
                            },
                            {
                              level: 'Class',
                              name: 'Mammalia',
                              description: 'Hewan menyusui berdarah panas',
                              color: 'bg-green-50 text-green-800 border-green-200'
                            },
                            {
                              level: 'Order',
                              name: 'Carnivora',
                              description: 'Pemakan daging dengan gigi taring tajam',
                              color: 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            },
                            {
                              level: 'Family',
                              name: 'Felidae',
                              description: 'Keluarga kucing dengan cakar yang dapat ditarik',
                              color: 'bg-orange-50 text-orange-800 border-orange-200'
                            },
                            {
                              level: 'Genus',
                              name: enhancedSpeciesData.identifikasi.nama_ilmiah.split(' ')[0],
                              description: enhancedSpeciesData.genus.deskripsi ||
                                'Kelompok spesies yang sangat mirip',
                              color: 'bg-red-50 text-red-800 border-red-200'
                            },
                            {
                              level: 'Species',
                              name: enhancedSpeciesData.identifikasi.nama_ilmiah,
                              description: enhancedSpeciesData.ringkasan.deskripsi_umum ?
                                enhancedSpeciesData.ringkasan.deskripsi_umum.slice(0, 100) + '...' :
                                'Individu yang dapat kawin dan menghasilkan keturunan fertile',
                              color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }
                          ].map((item, index) => (
                            <div
                              key={`taxonomy-${item.level}-${index}`}
                              className={`p-3 rounded-lg border ${item.color} hover:shadow-md transition-all duration-200`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm uppercase tracking-wide">
                                  {item.level}
                                </span>
                                <span className="font-semibold text-md">
                                  {item.name}
                                </span>
                              </div>
                              <p className="text-xs opacity-80 text-right">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Fallback dengan data scan result */}
                        <div className="text-center mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                          <p className="text-xl font-bold text-emerald-800 italic mb-1">
                            {scanResult.scientific_name}
                          </p>
                          <p className="text-md text-emerald-600 font-medium">
                            {scanResult.name}
                          </p>
                        </div>

                        {/* Struktur taksonomi dasar */}
                        <div className="space-y-3">
                          {[
                            {
                              level: 'Kingdom',
                              name: 'Animalia',
                              description: 'Kelompok makhluk hidup yang bergerak dan memakan makhluk lain',
                              color: 'bg-purple-50 text-purple-800 border-purple-200'
                            },
                            {
                              level: 'Phylum',
                              name: 'Chordata',
                              description: 'Hewan bertulang belakang',
                              color: 'bg-blue-50 text-blue-800 border-blue-200'
                            },
                            {
                              level: 'Class',
                              name: 'Mammalia',
                              description: 'Hewan menyusui berdarah panas',
                              color: 'bg-green-50 text-green-800 border-green-200'
                            },
                            {
                              level: 'Order',
                              name: 'Carnivora',
                              description: 'Pemakan daging dengan gigi taring tajam',
                              color: 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            },
                            {
                              level: 'Family',
                              name: 'Felidae',
                              description: 'Keluarga kucing dengan cakar yang dapat ditarik',
                              color: 'bg-orange-50 text-orange-800 border-orange-200'
                            },
                            {
                              level: 'Genus',
                              name: scanResult.scientific_name.split(' ')[0],
                              description: scanResult.description ?
                                scanResult.description.slice(0, 80) + '...' :
                                'Kelompok spesies yang sangat mirip',
                              color: 'bg-red-50 text-red-800 border-red-200'
                            },
                            {
                              level: 'Species',
                              name: scanResult.scientific_name,
                              description: scanResult.description ?
                                scanResult.description.slice(0, 100) + '...' :
                                'Individu yang dapat kawin dan menghasilkan keturunan fertile',
                              color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }
                          ].map((item, index) => (
                            <div
                              key={`taxonomy-fallback-${item.level}-${index}`}
                              className={`p-3 rounded-lg border ${item.color} hover:shadow-md transition-all duration-200`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm uppercase tracking-wide">
                                  {item.level}
                                </span>
                                <span className="font-semibold text-md">
                                  {item.name}
                                </span>
                              </div>
                              <p className="text-xs opacity-80 text-right">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

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
                          {Object.entries(enhancedSpeciesData.ringkasan.karakteristik).map(([key, value], index) =>
                            value ? (
                              <div
                                key={`enhanced-char-${key}-${index}`} // Fixed: More unique key
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
                            .map(([key, value], index) => (
                              <div
                                key={`basic-char-${key}-${index}-${value.slice(0, 5)}`} // Fixed: More unique key
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
                              key={`continent-${continent}-${index}`} // Fixed: More unique key
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
                              key={`country-${country}-${index}`} // Fixed: More unique key
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
                                <li key={`threat-${index}-${threat.slice(0, 10)}`} className="flex items-start gap-1"> {/* Fixed: More unique key */}
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
                                <li key={`effort-${index}-${effort.slice(0, 10)}`} className="flex items-start gap-1"> {/* Fixed: More unique key */}
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
                              <li key={`recommendation-${index}-${recommendation.slice(0, 10)}`} className="flex items-start gap-1"> {/* Fixed: More unique key */}
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
            </>
          </AnimatePresence>
        </Tabs>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {/* <Button
            onClick={navigateToTaxonomy}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 group"
          >
            <Search className="h-4 w-4 mr-2" />
            Lihat di Diagram Taksonomi
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button> */}

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