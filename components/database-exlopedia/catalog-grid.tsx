"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Cat, ChevronRightIcon, Users, MapPin, TrendingUp, TrendingDown, Minus, Eye, Heart, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"
import type { TaksonomiSpesies, TaksonomiGenus, TaksonomiKonservasi } from "@/lib/supabase-v2"

interface SpeciesGridProps {
  species: (TaksonomiSpesies & {
    genus: TaksonomiGenus
    konservasi: TaksonomiKonservasi | null
  })[]
  getStatusConfig: (status: string) => any
  getConservationStatus: (konservasi: TaksonomiKonservasi | null) => string | null
}

interface ImageWithBlurProps {
  src: string
  alt: string
  className?: string
}

function ImageWithBlur({ src, alt, className }: ImageWithBlurProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Blur placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-50 to-neutral-100 transition-opacity duration-500",
          isLoading ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>

      {/* Actual image */}
      <img
        src={src || "/placeholder.svg?height=300&width=400"}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-700",
          className,
          isLoading ? "scale-110 blur-sm opacity-0" : "scale-100 blur-0 opacity-100",
          hasError && "opacity-50",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
          <div className="text-center text-neutral-500">
            <Cat className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Gambar tidak tersedia</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function CatalogGrid({ species, getStatusConfig, getConservationStatus }: SpeciesGridProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const getTrendIcon = (trend: string) => {
    if (trend?.toLowerCase().includes("meningkat")) return TrendingUp
    if (trend?.toLowerCase().includes("menurun")) return TrendingDown
    return Minus
  }

  const getTrendColor = (trend: string) => {
    if (trend?.toLowerCase().includes("meningkat")) return "text-emerald-400"
    if (trend?.toLowerCase().includes("menurun")) return "text-red-400"
    return "text-yellow-400"
  }

  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <AnimatePresence>
        {species.map((species, index) => {
          const conservationStatus = getConservationStatus(species.konservasi)
          const statusConfig = conservationStatus ? getStatusConfig(conservationStatus) : null
          const isHovered = hoveredCard === species.id

          return (
            <motion.div
              key={species.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                layout: { duration: 0.3 },
              }}
              onHoverStart={() => setHoveredCard(species.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group"
            >
              <Link href={`/database/${species.kunci}`} className="block">
                <motion.div
                  className="relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Enhanced Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithBlur
                      src={species.url_gambar || "/placeholder.svg"}
                      alt={species.nama_umum || species.nama}
                      className="group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Floating Action Buttons */}
                    <motion.div
                      className="absolute top-4 right-4 flex flex-col gap-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 rounded-full"
                        onClick={(e) => {
                          e.preventDefault()
                          // Add to favorites logic
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/20 rounded-full"
                        onClick={(e) => {
                          e.preventDefault()
                          // Share logic
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </motion.div>

                    {/* Enhanced Conservation Status Badge */}
                    {statusConfig && (
                      <motion.div
                        className="absolute top-4 left-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "flex items-center gap-1.5 text-xs font-medium backdrop-blur-md border-white/30 shadow-lg",
                                  statusConfig.color,
                                )}
                              >
                                <statusConfig.icon className="h-3 w-3" />
                                {statusConfig.label}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-black/90 text-white border-white/20">
                              <p className="font-medium">{conservationStatus}</p>
                              {species.konservasi?.detail_tren && (
                                <p className="text-xs text-white/80 mt-1 max-w-xs">
                                  {species.konservasi.detail_tren.slice(0, 100)}...
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    )}

                    {/* Enhanced Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {/* Title Section */}
                        <div className="space-y-2">
                          <motion.h3
                            className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-emerald-300 transition-colors duration-300"
                            whileHover={{ scale: 1.02 }}
                          >
                            {species.nama_umum || species.nama}
                          </motion.h3>
                          <p className="text-sm text-white/90 italic line-clamp-1 font-medium">{species.nama}</p>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-white/80">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                              <Cat className="h-4 w-4" />
                              <span className="font-medium">{species.genus?.nama || "Genus"}</span>
                            </div>
                          </div>

                          {species.konservasi?.tren_populasi && (
                            <motion.div
                              className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1"
                              whileHover={{ scale: 1.05 }}
                            >
                              {React.createElement(getTrendIcon(species.konservasi.tren_populasi), {
                                className: cn("h-4 w-4", getTrendColor(species.konservasi.tren_populasi)),
                              })}
                              <span
                                className={cn("text-xs font-medium", getTrendColor(species.konservasi.tren_populasi))}
                              >
                                {species.konservasi.tren_populasi.split(" ")[0]}
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {/* Enhanced Stats Row */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/20">
                          <div className="flex items-center gap-4 text-xs text-white/70">
                            {species.konservasi?.total_populasi && (
                              <motion.div
                                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                              >
                                <Users className="h-3 w-3" />
                                <span className="font-medium">{species.konservasi.total_populasi}</span>
                              </motion.div>
                            )}
                            {species.distribusi_geografis && species.distribusi_geografis.length > 0 && (
                              <motion.div
                                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                              >
                                <MapPin className="h-3 w-3" />
                                <span className="font-medium">{species.distribusi_geografis[0]}</span>
                                {species.distribusi_geografis.length > 1 && (
                                  <span className="text-emerald-300">+{species.distribusi_geografis.length - 1}</span>
                                )}
                              </motion.div>
                            )}
                          </div>

                          <motion.div whileHover={{ scale: 1.1, x: 5 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20 hover:text-emerald-300 transition-all duration-300 p-2 h-auto rounded-full"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Lihat Detail</span>
                              <ChevronRightIcon className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </div>

                  {/* Enhanced Card Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.1), transparent)",
                      filter: "blur(1px)",
                    }}
                    initial={false}
                  />
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
