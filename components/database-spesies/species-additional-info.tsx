"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Baby, Target, Clock, Heart, Users, Calendar, Dna, Scale, Hourglass, PawPrint, Timer } from "lucide-react"
import type { SpeciesTabProps } from "./types"

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

export function SpeciesAdditionalInfo({ species, details }: SpeciesTabProps) {
  if (!details.diet && !details.reproduksi) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-50 to-transparent p-6 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-800">Informasi Tambahan</h2>
              <p className="text-emerald-600">Informasi diet dan reproduksi {species.nama_umum || species.nama}</p>
            </div>
          </div>
        </div>

        <Card className="border-neutral-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-neutral-400 mb-4">
              <Leaf className="h-12 w-12" />
            </div>
            <p className="text-neutral-500 text-center">Informasi tambahan belum tersedia untuk spesies ini</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-transparent p-6 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Leaf className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-800">Informasi Tambahan</h2>
            <p className="text-emerald-600">Informasi diet dan reproduksi {species.nama_umum || species.nama}</p>
          </div>
        </div>
      </div>

      <Card className="border-neutral-200">
        <CardContent className="p-0">
          <Tabs defaultValue={details.diet ? "diet" : "reproduction"} className="w-full">
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto border-b border-neutral-200 rounded-none px-6">
              {details.diet && (
                <TabsTrigger
                  value="diet"
                  className="flex items-center gap-2 px-0 py-4 mr-8 border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 text-neutral-400 bg-transparent rounded-none shadow-none"
                >
                  <Leaf className="h-4 w-4" />
                  Diet & Makanan
                </TabsTrigger>
              )}
              {details.reproduksi && (
                <TabsTrigger
                  value="reproduction"
                  className="flex items-center gap-2 px-0 py-4 mr-8 border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 text-neutral-400 bg-transparent rounded-none shadow-none"
                >
                  <Baby className="h-4 w-4" />
                  Reproduksi
                </TabsTrigger>
              )}
            </TabsList>

            {details.diet && (
              <TabsContent value="diet" className="px-6 py-8 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Diet Overview */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-emerald-600" />
                      Ringkasan Diet
                    </h3>

                    {details.diet.tipe_diet && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Leaf className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Tipe Diet</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.diet.tipe_diet)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.diet.frekuensi_makan && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Clock className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Frekuensi Makan</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.diet.frekuensi_makan)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.diet.tingkat_keberhasilan_berburu && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Target className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Tingkat Keberhasilan Berburu</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.diet.tingkat_keberhasilan_berburu)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.diet.teknik_berburu && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <PawPrint className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Teknik Berburu</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.diet.teknik_berburu)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Prey & Adaptations */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      Mangsa & Adaptasi
                    </h3>

                    {details.diet.mangsa_utama && details.diet.mangsa_utama.length > 0 && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Target className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-2">Mangsa Utama</h4>
                              <div className="space-y-1">
                                {formatArray(details.diet.mangsa_utama)
                                  .slice(0, 4)
                                  .map((prey, index) => (
                                    <p key={index} className="text-neutral-600 text-sm">
                                      • {prey}
                                    </p>
                                  ))}
                                {details.diet.mangsa_utama.length > 4 && (
                                  <p className="text-neutral-500 text-sm italic">
                                    +{details.diet.mangsa_utama.length - 4} spesies lainnya
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.diet.adaptasi_diet && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Dna className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Adaptasi Diet</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.diet.adaptasi_diet)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}

            {details.reproduksi && (
              <TabsContent value="reproduction" className="px-6 py-8 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Breeding Cycle */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                      <Baby className="h-5 w-5 text-emerald-600" />
                      Siklus Reproduksi
                    </h3>

                    {details.reproduksi.sistem_reproduksi && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Dna className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Sistem Reproduksi</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.reproduksi.sistem_reproduksi)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.reproduksi.musim_kawin && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Calendar className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Musim Kawin</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.reproduksi.musim_kawin)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.reproduksi.durasi_kehamilan && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Timer className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Periode Kehamilan</h4>
                              <p className="text-neutral-600 text-sm font-medium">
                                {formatValue(details.reproduksi.durasi_kehamilan)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.reproduksi.ukuran_kelahiran && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <PawPrint className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Ukuran Kelahiran</h4>
                              <p className="text-neutral-600 text-sm font-medium">
                                {formatValue(details.reproduksi.ukuran_kelahiran)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Development & Lifespan */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-emerald-600" />
                      Perkembangan & Umur
                    </h3>

                    {details.reproduksi.usia_matang_seksual && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Users className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Kematangan Seksual</h4>
                              <p className="text-neutral-600 text-sm font-medium">
                                {formatValue(details.reproduksi.usia_matang_seksual)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.reproduksi.interval_kelahiran && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Hourglass className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Interval Kelahiran</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.reproduksi.interval_kelahiran)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.reproduksi.harapan_hidup && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Heart className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Harapan Hidup</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.reproduksi.harapan_hidup)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {details.reproduksi.rasio_jenis_kelamin && (
                      <Card className="border-neutral-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg mt-1">
                              <Scale className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-neutral-800 mb-1">Rasio Jenis Kelamin</h4>
                              <p className="text-neutral-600 text-sm leading-relaxed">
                                {formatValue(details.reproduksi.rasio_jenis_kelamin)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
