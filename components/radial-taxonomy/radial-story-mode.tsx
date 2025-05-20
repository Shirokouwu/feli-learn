"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Info,
  Camera,
  Heart,
  AlertTriangle,
  MapPin,
  Globe2,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"

interface StoryContent {
  title: string
  description: string
  image: string
  focusNodeId: string
  level?: "family" | "genus" | "species"
}

interface GenusData {
  id: string
  nama: string
  url_gambar?: string
  deskripsi?: string
}

interface SpeciesData {
  id: string
  nama: string
  nama_umum?: string
  genus_id: string
  url_gambar?: string
}

interface RadialStoryModeProps {
  storyContent: StoryContent[]
  currentStory: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  isLoading?: boolean
  onSelectNode?: (nodeId: string) => void
}

export function RadialStoryMode({
  storyContent,
  currentStory,
  onNext,
  onPrev,
  onClose,
  isLoading = false,
  onSelectNode,
}: RadialStoryModeProps) {
  const [animateDescription, setAnimateDescription] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedGenus, setSelectedGenus] = useState<string | null>(null)
  const [genera, setGenera] = useState<GenusData[]>([])
  const [species, setSpecies] = useState<SpeciesData[]>([])
  const [loadingGenera, setLoadingGenera] = useState(false)
  const [loadingSpecies, setLoadingSpecies] = useState(false)

  // Reset animation when story changes
  useEffect(() => {
    setAnimateDescription(false)
    setShowDetails(false)
    const timer = setTimeout(() => {
      setAnimateDescription(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentStory])

  // Fetch genera from Supabase
  useEffect(() => {
    async function fetchGenera() {
      setLoadingGenera(true)
      try {
        const { data, error } = await supabase.from("taksonomi_genus").select("*").order("nama")

        if (error) {
          console.error("Error fetching genera:", error)
          return
        }

        setGenera(data || [])
      } catch (err) {
        console.error("Failed to fetch genera:", err)
      } finally {
        setLoadingGenera(false)
      }
    }

    fetchGenera()
  }, [])

  // Fetch species for selected genus
  useEffect(() => {
    if (!selectedGenus) return

    async function fetchSpecies() {
      setLoadingSpecies(true)
      try {
        const { data, error } = await supabase
          .from("taksonomi_spesies")
          .select("*")
          .eq("genus_id", selectedGenus)
          .order("nama")

        if (error) {
          console.error("Error fetching species:", error)
          return
        }

        setSpecies(data || [])
      } catch (err) {
        console.error("Failed to fetch species:", err)
      } finally {
        setLoadingSpecies(false)
      }
    }

    fetchSpecies()
  }, [selectedGenus])

  // Format description with bullet points and highlighting if it contains them
  const formatDescription = (description: string) => {
    if (description.includes("• ")) {
      return description.split("\n\n").map((paragraph, i) => (
        <p key={i} className="mb-2 select-text">
          {paragraph.startsWith("• ") ? (
            <span className="text-teal-600 font-medium">{paragraph}</span>
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: paragraph
                  .replace(
                    /\*\*(.*?)\*\*/g,
                    '<span class="bg-gradient-to-r from-teal-100/70 to-blue-100/70 px-1.5 rounded-md font-medium text-teal-800">$1</span>',
                  )
                  .replace(
                    /\*(.*?)\*/g,
                    '<span class="bg-gradient-to-r from-amber-100/70 to-orange-100/70 px-1.5 rounded-md font-medium text-orange-800">$1</span>',
                  )
                  .replace(
                    /_(.*?)_/g,
                    '<span class="bg-gradient-to-r from-indigo-100/70 to-purple-100/70 px-1.5 rounded-md font-medium text-indigo-800">$1</span>',
                  ),
              }}
            />
          )}
        </p>
      ))
    }

    return (
      <p className="select-text">
        <span
          dangerouslySetInnerHTML={{
            __html: description
              .replace(
                /\*\*(.*?)\*\*/g,
                '<span class="bg-gradient-to-r from-teal-100/70 to-blue-100/70 px-1.5 rounded-md font-medium text-teal-800">$1</span>',
              )
              .replace(
                /\*(.*?)\*/g,
                '<span class="bg-gradient-to-r from-amber-100/70 to-orange-100/70 px-1.5 rounded-md font-medium text-orange-800">$1</span>',
              )
              .replace(
                /_(.*?)_/g,
                '<span class="bg-gradient-to-r from-indigo-100/70 to-purple-100/70 px-1.5 rounded-md font-medium text-indigo-800">$1</span>',
              ),
          }}
        />
      </p>
    )
  }

  // Determine the current level in the taxonomy hierarchy
  const currentLevel =
    storyContent[currentStory]?.level ||
    (storyContent[currentStory]?.title.includes("Felidae")
      ? "family"
      : storyContent[currentStory]?.title.includes("Genus")
        ? "genus"
        : "species")

  // Handle genus selection
  const handleGenusSelect = (genusId: string) => {
    setSelectedGenus(genusId)
    if (onSelectNode) {
      onSelectNode(genusId)
    }
  }

  // Handle species selection
  const handleSpeciesSelect = (speciesId: string) => {
    if (onSelectNode) {
      onSelectNode(speciesId)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-teal-200"
      >
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin mx-auto mb-4" />
              <p className="text-neutral-600 text-lg">Memuat cerita taksonomi...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                <Image
                  src={storyContent[currentStory].image || "/placeholder.svg"}
                  alt={storyContent[currentStory].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute bottom-4 left-4 right-4">
                    {/* Progress indicator showing taxonomy level */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={`${
                          currentLevel === "family" ? "bg-teal-500 shadow-lg shadow-teal-500/30" : "bg-teal-500/50"
                        } hover:bg-teal-600 transition-all duration-300`}
                      >
                        Keluarga
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-white/70" />
                      <Badge
                        className={`${
                          currentLevel === "genus" ? "bg-indigo-500 shadow-lg shadow-indigo-500/30" : "bg-indigo-500/50"
                        } hover:bg-indigo-600 transition-all duration-300`}
                      >
                        Genus
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-white/70" />
                      <Badge
                        className={`${
                          currentLevel === "species"
                            ? "bg-orange-500 shadow-lg shadow-orange-500/30"
                            : "bg-orange-500/50"
                        } hover:bg-orange-600 transition-all duration-300`}
                      >
                        Spesies
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1 select-text drop-shadow-md">
                      {storyContent[currentStory].title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentLevel === "family" && (
                        <Badge
                          variant="outline"
                          className="bg-teal-500/20 text-white border-teal-400 shadow-inner shadow-teal-500/10"
                        >
                          <div className="w-2 h-2 bg-teal-400 rounded-full mr-1.5 animate-pulse"></div>
                          Keluarga
                        </Badge>
                      )}
                      {currentLevel === "genus" && (
                        <Badge
                          variant="outline"
                          className="bg-indigo-500/20 text-white border-indigo-400 shadow-inner shadow-indigo-500/10"
                        >
                          <div className="w-2 h-2 bg-indigo-400 rounded-full mr-1.5 animate-pulse"></div>
                          Genus
                        </Badge>
                      )}
                      {currentLevel === "species" && (
                        <Badge
                          variant="outline"
                          className="bg-orange-500/20 text-white border-orange-400 shadow-inner shadow-orange-500/10"
                        >
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-1.5 animate-pulse"></div>
                          Spesies
                        </Badge>
                      )}
                      {storyContent[currentStory].title.includes("Fakta") && (
                        <Badge
                          variant="outline"
                          className="bg-purple-500/20 text-white border-purple-400 shadow-inner shadow-purple-500/10"
                        >
                          <div className="w-2 h-2 bg-purple-400 rounded-full mr-1.5 animate-pulse"></div>
                          Fakta Menarik
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-6 md:p-8 max-h-96 md:max-h-[600px] overflow-y-auto custom-scrollbar bg-gradient-to-br from-white to-teal-50/30">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animateDescription ? 1 : 0, y: animateDescription ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="prose prose-sm max-w-none text-neutral-600"
                >
                  <div className="mb-6">{formatDescription(storyContent[currentStory].description)}</div>

                  {/* List of Genera (shown when at family level) */}
                  {currentLevel === "family" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4"
                    >
                      <h4 className="text-teal-800 font-medium mb-3">Pilih Genus untuk Dipelajari:</h4>
                      {loadingGenera ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
                        </div>
                      ) : (
                        <ScrollArea className="h-[200px] pr-4">
                          <div className="grid grid-cols-2 gap-2">
                            {genera.map((genus) => (
                              <Button
                                key={genus.id}
                                variant="outline"
                                className={`flex items-center justify-start gap-2 p-2 h-auto border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 ${
                                  selectedGenus === genus.id
                                    ? "bg-indigo-50 border-indigo-300 shadow-md shadow-indigo-200/50"
                                    : ""
                                }`}
                                onClick={() => handleGenusSelect(genus.id)}
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex-shrink-0 shadow-inner">
                                  <Image
                                    src={genus.url_gambar || "/placeholder.svg?height=40&width=40"}
                                    alt={genus.nama}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                                <div className="text-left">
                                  <p className="font-medium text-indigo-800 select-text">{genus.nama}</p>
                                  <p className="text-xs text-indigo-600">Genus</p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </motion.div>
                  )}

                  {/* List of Species (shown when at genus level) */}
                  {currentLevel === "genus" && selectedGenus && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-indigo-800 font-medium">Pilih Spesies untuk Dipelajari:</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                          onClick={() => setSelectedGenus(null)}
                        >
                          Kembali ke Genus
                        </Button>
                      </div>

                      {loadingSpecies ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                        </div>
                      ) : species.length === 0 ? (
                        <div className="text-center py-4 text-neutral-500 bg-neutral-50 rounded-lg">
                          Tidak ada spesies yang tersedia untuk genus ini
                        </div>
                      ) : (
                        <ScrollArea className="h-[200px] pr-4">
                          <div className="grid grid-cols-1 gap-2">
                            {species.map((species) => (
                              <Button
                                key={species.id}
                                variant="outline"
                                className="flex items-center justify-start gap-2 p-2 h-auto border-orange-100 hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 hover:shadow-md"
                                onClick={() => handleSpeciesSelect(species.id)}
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-100 flex-shrink-0 shadow-inner">
                                  <Image
                                    src={species.url_gambar || "/placeholder.svg?height=40&width=40"}
                                    alt={species.nama}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                                <div className="text-left">
                                  <p className="font-medium text-orange-800 select-text italic">{species.nama}</p>
                                  <p className="text-xs text-orange-600">{species.nama_umum || "Spesies"}</p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </motion.div>
                  )}

                  {/* Interactive elements */}
                  {!storyContent[currentStory].title.includes("Fakta") && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                        className="mb-4 w-full justify-between border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <span className="flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          {showDetails ? "Sembunyikan Detail" : "Tampilkan Detail Tambahan"}
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-300 ${showDetails ? "rotate-90" : ""}`}
                        />
                      </Button>

                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-teal-50/50 rounded-xl p-4 border border-teal-100 mb-4"
                        >
                          {currentLevel === "family" && (
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Globe2 className="h-4 w-4 text-teal-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-teal-800">Distribusi Global</p>
                                  <p className="text-xs text-teal-600 select-text">
                                    Tersebar di seluruh dunia kecuali Antartika
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-amber-800">Status Konservasi</p>
                                  <p className="text-xs text-amber-600 select-text">Beberapa spesies terancam punah</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentLevel === "genus" && (
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-indigo-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-indigo-800">Habitat</p>
                                  <p className="text-xs text-indigo-600 select-text">Beragam habitat sesuai spesies</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentLevel === "species" && (
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Heart className="h-4 w-4 text-rose-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-rose-800">Karakteristik</p>
                                  <p className="text-xs text-rose-600 select-text">Memiliki ciri khas yang unik</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Camera className="h-4 w-4 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-blue-800">Galeri</p>
                                  <div className="grid grid-cols-3 gap-1 mt-1">
                                    {[1, 2, 3].map((i) => (
                                      <div
                                        key={i}
                                        className="aspect-square rounded-md overflow-hidden bg-white border border-blue-100"
                                      >
                                        <Image
                                          src={storyContent[currentStory].image || "/placeholder.svg"}
                                          alt="Gallery"
                                          width={60}
                                          height={60}
                                          className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="p-4 border-t border-neutral-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-teal-50/30">
              <div className="flex gap-1">
                {storyContent.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      currentStory === i
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 shadow-md shadow-teal-500/30"
                        : "bg-teal-100"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {currentStory > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onPrev}
                    className="flex items-center gap-1 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-colors duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" /> Sebelumnya
                  </Button>
                )}
                {currentStory < storyContent.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={onNext}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 flex items-center gap-1 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Selanjutnya <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={onClose}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Selesai
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Tombol silang (X) yang lebih menonjol */}
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/30 z-10 rounded-full bg-black/40 backdrop-blur-sm border-white/30 hover:scale-110 transition-all duration-300 shadow-lg"
        >
          <X className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
