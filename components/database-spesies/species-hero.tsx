"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause, MapPin, Ruler, Weight, Shield, Info } from "lucide-react"
import { SpeciesBreadcrumb } from "./species-breadcrumb"
import type { TaksonomiSpesies, TaksonomiGenus } from "@/lib/supabase-v2"

interface SpeciesHeroProps {
  species: (TaksonomiSpesies & { genus?: TaksonomiGenus }) | null
  images: string[]
  activeImage: number
  setActiveImage: (index: number) => void
  autoSlideshow: boolean
  setAutoSlideshow: (auto: boolean) => void
  details: any
  isLoggedIn?: boolean
  userInfo?: {
    name: string
    email: string
    avatar?: string | null
  }
  onToggleLogin?: () => void
}

export function SpeciesHero({
  species,
  images,
  activeImage,
  setActiveImage,
  autoSlideshow,
  setAutoSlideshow,
  details,
  isLoggedIn,
  userInfo,
  onToggleLogin,
}: SpeciesHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    setImageLoaded(false)
  }, [activeImage])

  if (!species) return null

  const nextImage = () => {
    setDirection(1)
    setActiveImage(activeImage < images.length - 1 ? activeImage + 1 : 0)
  }

  const prevImage = () => {
    setDirection(-1)
    setActiveImage(activeImage > 0 ? activeImage - 1 : images.length - 1)
  }

  const goToImage = (index: number) => {
    setDirection(index > activeImage ? 1 : -1)
    setActiveImage(index)
  }

  const getConservationColor = (status: string | null | undefined) => {
    if (!status) return "bg-neutral-500"

    const statusLower = status.toLowerCase()
    if (statusLower.includes("critically endangered")) return "bg-red-600"
    if (statusLower.includes("endangered")) return "bg-red-500"
    if (statusLower.includes("vulnerable")) return "bg-orange-500"
    if (statusLower.includes("near threatened")) return "bg-yellow-500"
    if (statusLower.includes("least concern")) return "bg-green-500"
    return "bg-neutral-500"
  }

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Floating Breadcrumb */}
      <SpeciesBreadcrumb
        speciesName={species.nama_umum || species.nama}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        onToggleLogin={onToggleLogin}
      />

      {/* Background Image with Smooth Slide Effect */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeImage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0"
          >
            <img
              src={images[activeImage] || "/placeholder.svg"}
              alt={species.nama_umum || species.nama}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            onClick={prevImage}
            size="icon"
            variant="ghost"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={nextImage}
            size="icon"
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === activeImage ? "bg-white w-8" : "bg-white/50 hover:bg-white/80 w-2"
              }`}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="absolute inset-0 flex items-end z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            {/* Species Names */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                {species.nama_umum || species.nama}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 italic font-light">{species.nama}</p>
              {species.author_nama_ilmiah && (
                <p className="text-sm sm:text-base text-white/70 mt-1">
                  {species.author_nama_ilmiah}
                  {species.tahun_penemuan && `, ${species.tahun_penemuan}`}
                </p>
              )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Conservation Status */}
              {details.konservasi?.status_konservasi_alam && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-white/80" />
                    <span className="text-xs text-white/70">Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getConservationColor(
                        details.konservasi.status_konservasi_alam,
                      )}`}
                    />
                    <span className="text-sm font-medium text-white truncate">
                      {details.konservasi.status_konservasi_alam}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Body Length */}
              {details.deskripsi?.panjang_tubuh_cm && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-4 w-4 text-white/80" />
                    <span className="text-xs text-white/70">Panjang</span>
                  </div>
                  <span className="text-sm font-medium text-white">{details.deskripsi.panjang_tubuh_cm} cm</span>
                </motion.div>
              )}

              {/* Weight */}
              {details.deskripsi?.berat_kg && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="h-4 w-4 text-white/80" />
                    <span className="text-xs text-white/70">Berat</span>
                  </div>
                  <span className="text-sm font-medium text-white">{details.deskripsi.berat_kg} kg</span>
                </motion.div>
              )}

              {/* Genus */}
              {species.genus && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-white/80" />
                    <span className="text-xs text-white/70">Genus</span>
                  </div>
                  <span className="text-sm font-medium text-white truncate">{species.genus.nama}</span>
                </motion.div>
              )}

              {/* Distribution */}
              {species.distribusi_geografis && species.distribusi_geografis.length > 0 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-white/80" />
                    <span className="text-xs text-white/70">Distribusi</span>
                  </div>
                  <span className="text-sm font-medium text-white truncate">
                    {species.distribusi_geografis[0]}
                    {species.distribusi_geografis.length > 1 && ` +${species.distribusi_geografis.length - 1}`}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Description Preview */}
            {details.deskripsi?.deskripsi_umum && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20 max-w-3xl transition-all duration-200"
              >
                <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {details.deskripsi.deskripsi_umum}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Slideshow Controls */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20">
          <Button
            onClick={() => setAutoSlideshow(!autoSlideshow)}
            size="sm"
            variant="ghost"
            className="bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            {autoSlideshow ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            <span className="hidden sm:inline">{autoSlideshow ? "Pause" : "Play"}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
