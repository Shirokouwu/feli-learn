"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
  X,
  ExternalLink,
  Heart,
  Share2,
  Info,
  MapPin,
  Globe2,
  AlertTriangle,
  PawPrintIcon as Paw,
  Scale,
  Ruler,
  Leaf,
  Camera,
  ChevronRight,
  Clock,
  BookOpen,
  Lightbulb,
  Dna,
  Award,
  Sparkles,
  Zap,
  Bookmark,
  TelescopeIcon as Binoculars,
  Footprints,
  Mountain,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Genus, Species } from "@/types"
import { useEffect, useState } from "react"

interface SpeciesCardProps {
  data: Species | Genus
  onClose: () => void
}

export function SpeciesCard({ data, onClose }: SpeciesCardProps) {
  const isGenus = !("genus_id" in data)
  const [hasTrackedView, setHasTrackedView] = useState(false)
  const [isTracking, setIsTracking] = useState(false) // Add a state to control the tracking
  const [activeTab, setActiveTab] = useState("overview")

  // Update the getConservationStatusColor function for better contrast and more pleasant colors
  const getConservationStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower.includes("extinct") || statusLower.includes("punah")) {
      return "bg-black text-white border-gray-700" // Black for extinct
    } else if (
      statusLower.includes("critically") ||
      statusLower.includes("kritis") ||
      statusLower.includes("sangat terancam")
    ) {
      return "bg-red-600 text-white border-red-700" // Bright red for critically endangered
    } else if (statusLower.includes("endangered") || statusLower.includes("terancam")) {
      return "bg-red-500 text-white border-red-600" // Red for endangered
    } else if (statusLower.includes("vulnerable") || statusLower.includes("rentan")) {
      return "bg-orange-500 text-white border-orange-600" // Orange for vulnerable
    } else if (statusLower.includes("near") || statusLower.includes("hampir")) {
      return "bg-yellow-500 text-yellow-900 border-yellow-600" // Yellow for near threatened
    } else if (statusLower.includes("least") || statusLower.includes("rendah") || statusLower.includes("lc")) {
      return "bg-green-500 text-white border-green-600" // Green for least concern
    } else if (statusLower.includes("data") || statusLower.includes("kurang")) {
      return "bg-gray-400 text-white border-gray-500" // Gray for data deficient
    } else if (statusLower.includes("not") || statusLower.includes("tidak")) {
      return "bg-gray-300 text-gray-800 border-gray-400" // Light gray for not evaluated
    } else {
      return "bg-blue-500 text-white border-blue-600" // Default blue
    }
  }

  const getConservationStatusDescription = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower.includes("extinct") && !statusLower.includes("wild")) {
      return "Spesies yang tidak lagi diketahui ada di dunia."
    } else if (statusLower.includes("extinct in the wild") || statusLower.includes("punah di alam")) {
      return "Spesies yang hanya diketahui hidup dalam penangkaran atau budidaya, dan tidak lagi ada di alam liar."
    } else if (
      statusLower.includes("critically") ||
      statusLower.includes("kritis") ||
      statusLower.includes("sangat terancam")
    ) {
      return "Spesies yang menghadapi risiko kepunahan yang sangat tinggi di alam liar."
    } else if (statusLower.includes("endangered") || statusLower.includes("terancam")) {
      return "Spesies yang menghadapi risiko kepunahan yang tinggi di alam liar."
    } else if (statusLower.includes("vulnerable") || statusLower.includes("rentan")) {
      return "Spesies yang menghadapi risiko kepunahan yang cukup tinggi di alam liar."
    } else if (statusLower.includes("near") || statusLower.includes("hampir")) {
      return "Spesies yang berada dekat dengan kategori terancam atau rentan."
    } else if (statusLower.includes("least") || statusLower.includes("rendah") || statusLower.includes("lc")) {
      return "Spesies yang tidak memenuhi kriteria untuk kategori terancam dan jumlahnya masih banyak di alam liar."
    } else if (statusLower.includes("data") || statusLower.includes("kurang")) {
      return "Spesies yang tidak cukup informasi tersedia untuk menilai status konservasinya."
    } else if (statusLower.includes("not") || statusLower.includes("tidak")) {
      return "Spesies yang belum dievaluasi oleh IUCN."
    } else {
      return "Status konservasi spesies ini belum diketahui dengan pasti."
    }
  }

  // Get a fun fact about the species
  const getFunFact = () => {
    const facts = [
      "Kucing dapat melompat hingga 6 kali panjang tubuhnya.",
      "Harimau memiliki pola garis yang unik seperti sidik jari manusia.",
      "Singa betina melakukan sebagian besar perburuan untuk kelompoknya.",
      "Cheetah dapat mencapai kecepatan 112 km/jam dalam waktu singkat.",
      "Macan tutul salju memiliki ekor yang hampir sama panjang dengan tubuhnya.",
      "Kucing domestik menghabiskan 70% hidupnya untuk tidur.",
      "Lynx memiliki pendengaran yang sangat tajam berkat ujung telinganya yang berbulu.",
      "Jaguar adalah satu-satunya kucing besar yang suka berenang.",
    ]
    return facts[Math.floor(Math.random() * facts.length)]
  }

  // Access the new data structure
  const species = data as Species
  const physical = species.physical || {}
  const conservation = species.conservation || {}
  const behavior = species.behavior || {}
  const diet = species.diet || {}

  // Get conservation status
  const conservationStatus = conservation.status || species.conservation_status || "Least Concern (LC)"

  // Track species view when card is opened
  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    if (!data || isGenus) return

    const trackSpeciesView = async () => {
      try {
        const response = await fetch("/api/track-click/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.id,
            type: "species",
          }),
        })

        if (!response.ok) {
          console.error("Failed to track species view")
        } else {
          if (isMounted) {
            setHasTrackedView(true)
            setIsTracking(true)
          }
        }
      } catch (error) {
        console.error("Error tracking species view:", error)
      }
    }

    if (!hasTrackedView && !isGenus && data) {
      trackSpeciesView()
    }

    return () => {
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [data, isGenus, hasTrackedView])

  // Get the appropriate icon for the species based on its characteristics
  const getSpeciesIcon = () => {
    const name = (data.nama || data.name || "").toLowerCase()

    if (name.includes("cheetah")) return Zap
    if (name.includes("lion") || name.includes("singa")) return Award
    if (name.includes("tiger") || name.includes("harimau")) return Flame
    if (name.includes("leopard") || name.includes("macan tutul")) return Sparkles
    if (name.includes("lynx")) return Binoculars
    if (name.includes("puma") || name.includes("cougar")) return Mountain
    if (name.includes("jaguar")) return Footprints

    return Paw
  }

  const SpeciesIcon = getSpeciesIcon()

  return (
    <motion.div
      className="species-card-container bg-white rounded-xl shadow-xl border border-emerald-200 overflow-hidden w-full max-w-[calc(100vw-2rem)] backdrop-blur-lg"
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ zIndex: 50 }}
    >
      <div className="relative h-64 sm:h-56 w-full overflow-hidden">
        <Image
          src={
            isGenus
              ? data.url_gambar || "/placeholder.svg"
              : species.url_gambar || species.image_url || "/placeholder.svg"
          }
          alt={data.nama || data.name || ""}
          fill
          className="object-cover hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-2 right-2"
          >
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div className="flex items-center gap-2 mb-1">
              {!isGenus && (
                <Badge variant="outline" className="bg-white/10 text-emerald-200 backdrop-blur-sm border-white/20">
                  <Paw className="w-3 h-3 mr-1" />
                  {species.famili || "Felidae"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <SpeciesIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl sm:text-xl font-bold text-white mb-1 select-text cursor-text">
                {data.nama || data.name || ""}
              </h3>
            </div>
            <p className="text-emerald-200 text-lg sm:text-base italic font-medium select-text cursor-text">
              {data.nama || data.scientific_name || ""}
            </p>
            {!isGenus && conservationStatus && (
              <Badge className={`mt-2 ${getConservationStatusColor(conservationStatus)}`} variant="secondary">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {conservationStatus}
              </Badge>
            )}
          </motion.div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="p-3 sm:p-4" onValueChange={(value) => setActiveTab(value)}>
        {/* Update the TabsList with icons */}
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <BookOpen className={`h-4 w-4 ${activeTab === "overview" ? "text-emerald-600" : ""}`} />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="facts" className="flex items-center gap-1.5">
            <Lightbulb className={`h-4 w-4 ${activeTab === "facts" ? "text-emerald-600" : ""}`} />
            <span>Informasi</span>
          </TabsTrigger>
          <TabsTrigger value="habitat" className="flex items-center gap-1.5">
            <Globe2 className={`h-4 w-4 ${activeTab === "habitat" ? "text-emerald-600" : ""}`} />
            <span>Habitat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {/* Fun fact card */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 mb-4 flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-1 select-text cursor-text">Tahukah Anda?</h4>
                <p className="text-xs text-amber-700 leading-relaxed select-text cursor-text">{getFunFact()}</p>
              </div>
            </div>

            {/* Description card with improved styling */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 p-4 rounded-xl border border-emerald-200 mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg shrink-0">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-emerald-800 mb-1 select-text cursor-text">Deskripsi</h4>
                  <p className="text-sm text-emerald-800 leading-relaxed select-text cursor-text">
                    {isGenus ? data.deskripsi || data.description : species.description}
                  </p>
                </div>
              </div>
            </div>

            {!isGenus && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                  <Scale className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-medium text-emerald-800 select-text cursor-text">Berat</span>
                  <p className="text-sm font-bold text-emerald-700 select-text cursor-text">
                    {physical.weight ? `${physical.weight} kg` : "120 kg"}
                  </p>
                </div>

                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                  <Ruler className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-medium text-emerald-800 select-text cursor-text">Panjang</span>
                  <p className="text-sm font-bold text-emerald-700 select-text cursor-text">
                    {physical.length ? `${physical.length} cm` : "2.5 m"}
                  </p>
                </div>

                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center justify-center text-center">
                  <Clock className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-medium text-emerald-800 select-text cursor-text">Umur</span>
                  <p className="text-sm font-bold text-emerald-700 select-text cursor-text">
                    {species.lifespan || "12-15 thn"}
                  </p>
                </div>
              </div>
            )}

            {/* Taxonomy quick view */}
            {!isGenus && (
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 mt-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                    <Dna className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 select-text cursor-text">Taksonomi</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-xs pl-12">
                  {species.kerajaan && (
                    <>
                      <span className="text-blue-700 select-text cursor-text">Kerajaan:</span>
                      <span className="font-medium select-text cursor-text">{species.kerajaan}</span>
                    </>
                  )}
                  {species.famili && (
                    <>
                      <span className="text-blue-700 select-text cursor-text">Famili:</span>
                      <span className="font-medium select-text cursor-text">{species.famili}</span>
                    </>
                  )}
                  {species.genus && (
                    <>
                      <span className="text-blue-700 select-text cursor-text">Genus:</span>
                      <span className="font-medium select-text cursor-text">{species.genus}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-1 sm:gap-1"
          >
            <Button
              size="sm"
              variant="outline"
              className="gap-2 flex-1 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
            >
              <Heart className="h-4 w-4" />
              Simpan
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 flex-1 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
            >
              <Share2 className="h-4 w-4" />
              Bagikan
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 flex-1 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
            >
              <ExternalLink className="h-4 w-4" />
              Detail
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="facts" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {/* Diet & Behavior - Improved UI/UX */}
            {/* Update the Diet section with smaller prey list and highlighted diet type */}
            <div className="bg-emerald-50/50 backdrop-blur-sm p-4 rounded-xl border border-emerald-100">
              <h4 className="text-base font-medium text-emerald-800 mb-3 flex items-center">
                <div className="bg-emerald-100 p-1.5 rounded-lg mr-2">
                  <Bookmark className="h-4 w-4 text-emerald-600" />
                </div>
                Pola Makan
              </h4>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-emerald-700 w-24 select-text cursor-text">
                    Klasifikasi:
                  </span>
                  <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-medium select-text cursor-text">
                    {diet.type || "Karnivora"}
                  </span>
                </div>

                <div>
                  <div className="flex mb-1">
                    <span className="text-sm font-medium text-emerald-700 w-full select-text cursor-text">
                      Teknik Berburu:
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 select-text cursor-text">
                    {diet.technique || (behavior && (behavior as any).hunting_method) || "Tidak ada informasi"}
                  </p>
                </div>

                <div>
                  <div className="flex mb-1">
                    <span className="text-sm font-medium text-emerald-700 w-full select-text cursor-text">
                      Frekuensi Makan:
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 select-text cursor-text">
                    {diet.frequency || "Tidak ada informasi"}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-emerald-700 block mb-2 select-text cursor-text">
                    Mangsa Utama:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      // Handle different data types for prey
                      let preyList = []

                      if (diet.prey) {
                        if (Array.isArray(diet.prey)) {
                          preyList = diet.prey
                        } else if (typeof diet.prey === "object") {
                          preyList = Object.values(diet.prey)
                        } else if (typeof diet.prey === "string") {
                          try {
                            const parsed = JSON.parse(diet.prey)
                            preyList = Array.isArray(parsed) ? parsed : Object.values(parsed)
                          } catch {
                            preyList = (diet.prey as string).split(",")
                          }
                        }
                      } else {
                        preyList = ["Rusa", "Wapiti", "Domba Gunung", "Binatang pengerat"]
                      }

                      return preyList.map((prey: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 select-text cursor-text"
                        >
                          {typeof prey === "string" ? prey.trim() : String(prey)}
                        </span>
                      ))
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Conservation Status - Enhanced with better colors and modern design */}
            {/* Update the Conservation Status section with better UI and indicator */}
            {!isGenus && conservationStatus && (
              <div className="bg-white backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-base font-medium text-slate-800 mb-3 flex items-center">
                  <div className="bg-amber-100 p-1.5 rounded-lg mr-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  Status Konservasi
                </h4>

                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-center">
                    <Badge
                      className={`px-4 py-1.5 text-sm ${getConservationStatusColor(conservationStatus)} select-text cursor-text`}
                    >
                      {conservationStatus}
                    </Badge>
                  </div>

                  <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-700 leading-relaxed select-text cursor-text">
                      {getConservationStatusDescription(conservationStatus)}
                    </p>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-red-600 select-text cursor-text">Kritis</span>
                      <span className="text-xs font-medium text-green-600 select-text cursor-text">Aman</span>
                    </div>

                    {/* Conservation status bar with gradient */}
                    <div className="relative h-3 w-full rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                          background:
                            "linear-gradient(to right, black, #dc2626, #ef4444, #f97316, #eab308, #22c55e, #a3a3a3)",
                        }}
                      ></div>

                      {/* Current position indicator */}
                      {(() => {
                        const getPositionPercentage = (status: string) => {
                          const statusLower = status.toLowerCase()
                          if (statusLower.includes("extinct") || statusLower.includes("punah")) {
                            return "7%"
                          } else if (statusLower.includes("critically") || statusLower.includes("kritis")) {
                            return "21%"
                          } else if (statusLower.includes("endangered") || statusLower.includes("terancam")) {
                            return "35%"
                          } else if (statusLower.includes("vulnerable") || statusLower.includes("rentan")) {
                            return "50%"
                          } else if (statusLower.includes("near") || statusLower.includes("hampir")) {
                            return "64%"
                          } else if (statusLower.includes("least") || statusLower.includes("rendah")) {
                            return "78%"
                          } else {
                            return "92%" // Data deficient or not evaluated
                          }
                        }

                        return (
                          <div
                            className="absolute top-0 w-0 h-0"
                            style={{
                              left: getPositionPercentage(conservationStatus),
                              borderLeft: "6px solid transparent",
                              borderRight: "6px solid transparent",
                              borderBottom: "10px solid white",
                              transform: "translateX(-6px)",
                              filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.3))",
                              zIndex: 10,
                            }}
                          />
                        )
                      })()}
                    </div>

                    {/* Status labels */}
                    <div className="grid grid-cols-7 text-[9px] mt-1 text-center">
                      <div className="text-white bg-black px-1 rounded-l-sm select-text cursor-text">EX</div>
                      <div className="text-white bg-red-600 px-1 select-text cursor-text">CR</div>
                      <div className="text-white bg-red-500 px-1 select-text cursor-text">EN</div>
                      <div className="text-white bg-orange-500 px-1 select-text cursor-text">VU</div>
                      <div className="text-yellow-900 bg-yellow-500 px-1 select-text cursor-text">NT</div>
                      <div className="text-white bg-green-500 px-1 rounded-r-sm select-text cursor-text">LC</div>
                      <div className="text-white bg-gray-400 px-1 rounded-sm ml-1 select-text cursor-text">DD</div>
                    </div>

                    <div className="flex justify-center mt-3">
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white border border-slate-200 shadow-sm">
                        <div
                          className={`w-2 h-2 rounded-full mr-1.5 ${getConservationStatusColor(conservationStatus).split(" ")[0]}`}
                        ></div>
                        <span className="font-medium text-slate-700 select-text cursor-text">Status saat ini</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="habitat" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {/* Habitat & Distribution - Simplified */}
            <div className="bg-emerald-50/50 backdrop-blur-sm p-3 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-medium text-emerald-800 select-text cursor-text">Habitat & Distribusi</h4>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {(() => {
                  // Handle different data types safely
                  let habitatList = [] as (string)[];
                  if (species.habitat) {
                    if (Array.isArray(species.habitat)) {
                      habitatList = species.habitat
                    } else if (typeof species.habitat === "string") {
                      habitatList = species.habitat.split(",")
                    }
                  } else {
                    habitatList = "Hutan,Savana,Pegunungan".split(",")
                  }

                  return habitatList.map((habitat, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 select-text cursor-text"
                    >
                      <Leaf className="w-3 h-3 mr-1.5" />
                      {typeof habitat === "string" ? habitat.trim() : habitat}
                    </span>
                  ))
                })()}
              </div>

              <div className="flex flex-wrap gap-2">
                {(() => {
                  // Handle different data types safely
                  let locationList = [] as (string)[];
                  if (species.distribution) {
                    if (Array.isArray(species.distribution)) {
                      locationList = species.distribution
                    } else if (typeof species.distribution === "string") {
                      locationList = species.distribution.split(",")
                    }
                  } else {
                    locationList = "Asia Tenggara,Sumatera,Jawa".split(",")
                  }

                  return locationList.map((location, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 select-text cursor-text"
                    >
                      <Globe2 className="w-3 h-3 mr-1.5" />
                      {typeof location === "string" ? location.trim() : location}
                    </span>
                  ))
                })()}
              </div>
            </div>

            {/* Image gallery preview */}
            <div className="bg-emerald-50/50 backdrop-blur-sm p-3 rounded-xl border border-emerald-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 p-1.5 rounded-lg">
                    <Camera className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-medium text-emerald-800 select-text cursor-text">Galeri</h4>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700">
                  Lihat Semua <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden relative group">
                    <Image
                      src={`/placeholder.svg?text=Photo${i}`}
                      alt={`Gambar ${i}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple taxonomy */}
            {!isGenus && (
              <div className="bg-emerald-50/50 backdrop-blur-sm p-3 rounded-xl border border-emerald-100">
                <h4 className="text-sm font-medium text-emerald-800 mb-2 flex items-center">
                  <div className="bg-emerald-100 p-1.5 rounded-lg mr-2">
                    <Dna className="w-4 h-4 text-emerald-600" />
                  </div>
                  Taksonomi
                </h4>
                <div className="grid grid-cols-2 gap-y-1 text-xs">
                  {species.kerajaan && (
                    <>
                      <span className="text-emerald-700 select-text cursor-text">Kerajaan:</span>
                      <span className="font-medium select-text cursor-text">{species.kerajaan}</span>
                    </>
                  )}
                  {species.kelas && (
                    <>
                      <span className="text-emerald-700 select-text cursor-text">Kelas:</span>
                      <span className="font-medium select-text cursor-text">{species.kelas}</span>
                    </>
                  )}
                  {species.ordo && (
                    <>
                      <span className="text-emerald-700 select-text cursor-text">Ordo:</span>
                      <span className="font-medium select-text cursor-text">{species.ordo}</span>
                    </>
                  )}
                  {species.famili && (
                    <>
                      <span className="text-emerald-700 select-text cursor-text">Famili:</span>
                      <span className="font-medium select-text cursor-text">{species.famili}</span>
                    </>
                  )}
                  {species.genus && (
                    <>
                      <span className="text-emerald-700 select-text cursor-text">Genus:</span>
                      <span className="font-medium select-text cursor-text">{species.genus}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* View Complete Info Button */}
      <div className="px-4 pb-4">
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 group" size="sm">
          <span>Lihat Informasi Lengkap</span>
          <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-3 bg-emerald-50/50 backdrop-blur-sm border-t border-emerald-100"
      >
        <div className="flex items-center text-xs text-emerald-800 select-text cursor-text">
          <Info className="h-3 w-3 mr-2" />
          <span className="select-text cursor-text">Klik pada node lain untuk melihat informasi lebih lanjut</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
