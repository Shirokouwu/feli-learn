"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Maximize2, Download, Camera, Calendar, MapPin, User, X } from "lucide-react"
import type { TaksonomiGambar } from "@/lib/supabase-v2"

interface SpeciesImageGalleryProps {
  images: string[]
  speciesName: string
  activeImage: number
  setActiveImage: (index: number) => void
  imageDetails?: TaksonomiGambar[]
}

export function SpeciesImageGallery({
  images,
  speciesName,
  activeImage,
  setActiveImage,
  imageDetails = [],
}: SpeciesImageGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    setImageLoaded(false)
  }, [activeImage])

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

  const currentImageDetail = imageDetails[activeImage]

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return null
    return String(value)
  }

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  if (images.length === 0) {
    return (
      <Card className="border-emerald-100 shadow-lg">
        <CardContent className="flex items-center justify-center h-64 text-neutral-500">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <p>Tidak ada gambar tersedia</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-emerald-100 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Main Image Display */}
          <div className="relative aspect-video bg-neutral-100 overflow-hidden">
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
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x)

                  if (swipe < -swipeConfidenceThreshold) {
                    nextImage()
                  } else if (swipe > swipeConfidenceThreshold) {
                    prevImage()
                  }
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <img
                  src={images[activeImage] || "/placeholder.svg"}
                  alt={`${speciesName} - Image ${activeImage + 1}`}
                  className="w-full h-full object-cover select-none"
                  onLoad={() => setImageLoaded(true)}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  onClick={prevImage}
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  onClick={nextImage}
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Top Controls */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                onClick={() => setIsFullscreen(true)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = images[activeImage]
                  link.download = `${speciesName}-${activeImage + 1}.jpg`
                  link.click()
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-black/20 text-white border-white/20 backdrop-blur-sm">
                  {activeImage + 1} / {images.length}
                </Badge>
              </div>
            )}

            {/* Swipe Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="w-1 h-1 bg-white/60 rounded-full" />
                  <div className="w-1 h-1 bg-white/60 rounded-full" />
                  <div className="w-1 h-1 bg-white/60 rounded-full" />
                  <span className="text-xs text-white/80 ml-2">Swipe atau gunakan arrow</span>
                </div>
              </div>
            )}
          </div>

          {/* Image Information */}
          {currentImageDetail && (
            <div className="p-4 bg-neutral-50 border-t border-neutral-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {formatValue(currentImageDetail.judul) && (
                  <div>
                    <p className="font-medium text-neutral-600">Judul</p>
                    <p className="text-neutral-800">{currentImageDetail.judul}</p>
                  </div>
                )}
                {formatValue(currentImageDetail.fotografer) && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-600">Fotografer</p>
                      <p className="text-neutral-800">{currentImageDetail.fotografer}</p>
                    </div>
                  </div>
                )}
                {formatValue(currentImageDetail.tanggal_diambil) && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-600">Tanggal</p>
                      <p className="text-neutral-800">
                        {new Date(currentImageDetail.tanggal_diambil).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                )}
                {formatValue(currentImageDetail.lokasi) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-600">Lokasi</p>
                      <p className="text-neutral-800">{currentImageDetail.lokasi}</p>
                    </div>
                  </div>
                )}
              </div>
              {formatValue(currentImageDetail.deskripsi) && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <p className="text-neutral-700 text-sm leading-relaxed">{currentImageDetail.deskripsi}</p>
                </div>
              )}
            </div>
          )}

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="p-4 bg-white border-t border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-neutral-800">Galeri Gambar</h4>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      index === activeImage
                        ? "border-emerald-500 ring-2 ring-emerald-200 scale-105"
                        : "border-neutral-200 hover:border-emerald-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${speciesName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === activeImage && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-emerald-500/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative max-w-7xl max-h-full p-4 w-full">
              <Button
                onClick={() => setIsFullscreen(false)}
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-10 h-10 w-10 bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    size="icon"
                    variant="ghost"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={activeImage}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    src={images[activeImage]}
                    alt={`${speciesName} - Fullscreen`}
                    className="absolute inset-0 w-full h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </AnimatePresence>
              </div>

              {/* Fullscreen Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="bg-black/40 text-white border-white/20 backdrop-blur-sm">
                    {activeImage + 1} / {images.length}
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
