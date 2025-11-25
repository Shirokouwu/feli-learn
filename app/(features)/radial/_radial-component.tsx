"use client"

import { useState, useRef } from "react"
import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
  Compass,
  Sparkles,
  Dna,
  Zap,
  Info,
  AlertTriangle,
  Shield,
  Leaf,
} from "lucide-react"
import { RadialOnboarding } from "@/components/radial-taxonomy/radial-onboarding"
import { RadialExplorer } from "@/components/radial-taxonomy"
import { RadialDiagramGuide } from "@/components/radial-taxonomy/radial-diagram-guide"
import { TaxonomyLoading } from "@/components/radial-taxonomy/radial-loading"
import { GlassNavigation } from "@/components/glass-navigation"
import { useScrollDetection } from "@/hooks/use-scroll-detection"

export default function RadialTaxonomy({ fullName, profilePicture }: { fullName: string, profilePicture: string }) {
  const [showInfo, setShowInfo] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const isScrolled = useScrollDetection({ threshold: 80 })
  const diagramRef = useRef<HTMLDivElement>(null)

  const scrollToDiagram = () => {
    diagramRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    // Show onboarding modal after scrolling to diagram
    setShowOnboarding(true)
  }


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-50/50 via-white to-teal-50/50">
      {/* Onboarding modal - now controlled by button click */}
      <AnimatePresence>
        {showOnboarding && <RadialOnboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      {/* Navigation bar with glass effect */}
      <GlassNavigation
        isScrolled={isScrolled}
        fullName={fullName}
        backHref="/"
        backLabel="Kembali"
        showUserInfo={true}
        profilePicture={profilePicture}
      />


      {/* Header section - always shown */}
      <div className={`container mx-auto px-4 transition-all duration-500 ${isScrolled ? 'pt-20 pb-8' : 'pt-20 pb-8'
        }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <div className="relative mb-12">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>

            <Badge
              variant="secondary"
              className="mb-6 text-sm bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 hover:from-teal-200 hover:to-blue-200 border-teal-300 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-teal-600" />
              Visualisasi Interaktif
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-6 drop-shadow-sm">
              Eksplorasi Radial Felidae
            </h1>

            <div className="max-w-2xl mx-auto">
              <p className="text-neutral-600 text-lg md:text-xl leading-relaxed mb-4">
                Jelajahi{" "}
                <span className="bg-gradient-to-r from-teal-100/70 to-blue-100/70 px-2 py-0.5 rounded-md font-medium text-teal-800">
                  hierarki taksonomi
                </span>{" "}
                keluarga Felidae melalui{" "}
                <span className="bg-gradient-to-r from-amber-100/70 to-orange-100/70 px-2 py-0.5 rounded-md font-medium text-orange-800">
                  visualisasi radial yang inovatif
                </span>{" "}
                . Lihat node hierarki dari Famili ke Genus hingga Spesies untuk memahami struktur klasifikasi.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse mr-2"></div>
                  38 Spesies
                </Badge>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse mr-2"></div>
                  14 Genus
                </Badge>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse mr-2"></div>
                  Status Konservasi
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all duration-300 group shadow-sm"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Dna className="h-4 w-4 text-teal-600 group-hover:rotate-12 transition-transform duration-300" />
              <span>Tentang Visualisasi</span>
            </Button>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
              onClick={scrollToDiagram}
            >
              <Zap className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span>Mulai Eksplorasi</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all duration-300 shadow-sm group"
              onClick={() => setShowLegend(!showLegend)}
            >
              <Info className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Status Konservasi
            </Button>
          </div>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8 bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100 text-left shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-xl">
                    <Compass className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-teal-800 text-lg mb-4">Visualisasi Radial & Storytelling</h3>
                    <p className="text-neutral-600 mb-4">
                      Visualisasi radial menampilkan taksonomi dalam bentuk lingkaran konsentris, dengan keluarga
                      Felidae di tengah, dikelilingi oleh genus, dan spesies di lingkaran terluar. Pendekatan ini
                      memudahkan pemahaman hubungan antar spesies.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          title: "Visualisasi Interaktif 360°",
                          desc: "Tampilan radial memungkinkan eksplorasi taksonomi dari berbagai sudut pandang, memberikan pemahaman yang lebih komprehensif dan mendalam.",
                          icon: <Compass className="h-4 w-4 text-teal-600" />,
                          highlight: "from-teal-50 to-cyan-50 border-teal-200",
                        },
                        {
                          title: "Mode Cerita Imersif",
                          desc: "Jelajahi taksonomi melalui narasi yang menarik dan informatif, dengan fakta-fakta eksklusif tentang keluarga Felidae.",
                          icon: <Sparkles className="h-4 w-4 text-purple-600" />,
                          highlight: "from-purple-50 to-indigo-50 border-purple-200",
                        },
                        {
                          title: "Status Konservasi Visual",
                          desc: "Efek cahaya khusus menunjukkan status konservasi spesies, dari hijau (aman) hingga merah (terancam punah).",
                          icon: <Shield className="h-4 w-4 text-green-600" />,
                          highlight: "from-green-50 to-emerald-50 border-green-200",
                        },
                        {
                          title: "Interaksi Dinamis",
                          desc: "Berinteraksi langsung dengan diagram, zoom, putar, dan klik untuk melihat detail setiap spesies dengan animasi responsif.",
                          icon: <Zap className="h-4 w-4 text-amber-600" />,
                          highlight: "from-amber-50 to-yellow-50 border-amber-200",
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className={`bg-gradient-to-br ${item.highlight} p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                        >
                          <div className={`bg-white/80 p-2 rounded-lg shadow-inner mb-2`}>{item.icon}</div>
                          <div>
                            <h4 className="font-medium text-teal-700 mb-1">{item.title}</h4>
                            <p className="text-sm text-neutral-600">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {showLegend && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8 bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-100 text-left shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 p-3 rounded-xl">
                    <Shield className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="w-full">
                    <h3 className="font-medium text-teal-800 text-lg mb-4">Status Konservasi & Efek Visual</h3>
                    <p className="text-neutral-600 mb-4">
                      Warna glow effect pada diagram menunjukkan status konservasi setiap spesies. Berikut adalah
                      panduan warna yang digunakan:
                    </p>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          status: "Punah (Extinct)",
                          desc: "Spesies yang tidak ada lagi di alam liar maupun penangkaran",
                          color: "bg-slate-500",
                          textColor: "text-white",
                          borderColor: "border-slate-600",
                          icon: <AlertTriangle className="h-4 w-4" />,
                        },
                        {
                          status: "Kritis (Critically Endangered)",
                          desc: "Menghadapi risiko kepunahan yang sangat tinggi",
                          color: "bg-rose-400",
                          textColor: "text-white",
                          borderColor: "border-rose-500",
                          icon: <AlertTriangle className="h-4 w-4" />,
                        },
                        {
                          status: "Terancam (Endangered)",
                          desc: "Menghadapi risiko kepunahan yang tinggi",
                          color: "bg-red-400",
                          textColor: "text-white",
                          borderColor: "border-red-500",
                          icon: <AlertTriangle className="h-4 w-4" />,
                        },
                        {
                          status: "Rentan (Vulnerable)",
                          desc: "Menghadapi risiko kepunahan di alam liar",
                          color: "bg-orange-400",
                          textColor: "text-white",
                          borderColor: "border-orange-500",
                          icon: <AlertTriangle className="h-4 w-4" />,
                        },
                        {
                          status: "Hampir Terancam (Near Threatened)",
                          desc: "Kemungkinan terancam dalam waktu dekat",
                          color: "bg-amber-400",
                          textColor: "text-amber-900",
                          borderColor: "border-amber-500",
                          icon: <AlertTriangle className="h-4 w-4" />,
                        },
                        {
                          status: "Risiko Rendah (Least Concern)",
                          desc: "Populasi stabil dan tidak terancam",
                          color: "bg-emerald-400",
                          textColor: "text-white",
                          borderColor: "border-emerald-500",
                          icon: <Leaf className="h-4 w-4" />,
                        },
                        {
                          status: "Data Kurang (Data Deficient)",
                          desc: "Informasi tidak cukup untuk menilai risiko kepunahan",
                          color: "bg-gray-400",
                          textColor: "text-white",
                          borderColor: "border-gray-500",
                          icon: <Info className="h-4 w-4" />,
                        },
                        {
                          status: "Tidak Dievaluasi (Not Evaluated)",
                          desc: "Belum dievaluasi berdasarkan kriteria IUCN",
                          color: "bg-gray-300",
                          textColor: "text-gray-800",
                          borderColor: "border-gray-400",
                          icon: <Info className="h-4 w-4" />,
                        },
                        {
                          status: "Default",
                          desc: "Status konservasi tidak diketahui",
                          color: "bg-blue-400",
                          textColor: "text-white",
                          borderColor: "border-blue-600",
                          icon: <Info className="h-4 w-4" />,
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className={`${item.color} ${item.textColor} ${item.borderColor} border rounded-lg p-3 shadow-sm`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {item.icon}
                            <h4 className="font-medium">{item.status}</h4>
                          </div>
                          <p className="text-xs opacity-90">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-700">
                        <Info className="h-4 w-4 inline mr-2" />
                        Efek glow pada diagram akan menyala sesuai dengan status konservasi spesies ketika Anda memilih
                        spesies tersebut.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Diagram container */}
      <div
        ref={diagramRef}
        className="flex-1 bg-gradient-to-br from-white to-teal-50/30 border-y border-teal-100 touch-none relative overflow-hidden"
      >

        <div className="absolute inset-0 pointer-events-none z-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwBU9WjSyXmPsow25o9WWPQCrXY2geDoNehw&s')] bg-no-repeat bg-left-top"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwBU9WjSyXmPsow25o9WWPQCrXY2geDoNehw&s')] bg-no-repeat bg-right-bottom"></div>
        </div>

        {/* Add the RadialDiagramGuide component */}
        <RadialDiagramGuide />

        <div className="h-[600px] md:h-[calc(100vh-4rem)] relative w-full">
          <Suspense fallback={<TaxonomyLoading />}>
            <RadialExplorer />
          </Suspense>
        </div>
      </div>

      {/* Footer info */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-teal-50/80 to-blue-50/80 backdrop-blur-sm p-4 rounded-xl border border-teal-100 mb-4 shadow-sm">
            <h3 className="text-sm font-medium text-teal-800 mb-2">Tentang Visualisasi Radial</h3>
            <p className="text-neutral-600 text-sm">
              Visualisasi radial ini menampilkan hubungan taksonomi dalam bentuk lingkaran konsentris, memberikan
              <span className="bg-gradient-to-r from-teal-100/70 to-blue-100/70 px-1.5 mx-1 rounded-md font-medium text-teal-800">
                cara yang lebih intuitif
              </span>
              untuk memahami keterkaitan antar spesies.
              <span className="bg-gradient-to-r from-amber-100/70 to-orange-100/70 px-1.5 mx-1 rounded-md font-medium text-orange-800">
                Efek cahaya dinamis
              </span>
              menunjukkan status konservasi spesies, dari hijau (aman) hingga merah (terancam punah).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-teal-600">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span>Klik dan tahan untuk navigasi</span>
            </div>
            <div className="flex items-center gap-2 text-teal-600">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span>Gunakan kontrol untuk zoom dan rotasi</span>
            </div>
            <div className="flex items-center gap-2 text-teal-600">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span>Klik pada node untuk melihat detail</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
