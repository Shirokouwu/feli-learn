"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight, ExternalLink } from "lucide-react"
import type { RelatedSpeciesProps } from "./types"

export function SpeciesRelated({ relatedSpecies }: RelatedSpeciesProps) {
  const [hoveredSpecies, setHoveredSpecies] = useState<string | null>(null)

  if (!relatedSpecies || relatedSpecies.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white/50">
        <CardContent className="p-8 text-center">
          <div className="bg-neutral-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="text-neutral-500 text-sm">Tidak ada data spesies terkait</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm bg-white/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-neutral-800">
          <Users className="h-5 w-5 text-emerald-600" />
          Spesies Terkait
          <span className="text-sm font-normal text-neutral-500 ml-auto">{relatedSpecies.length} spesies</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {relatedSpecies.slice(0, 6).map((species, index) => (
            <motion.div
              key={species.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onHoverStart={() => setHoveredSpecies(species.id)}
              onHoverEnd={() => setHoveredSpecies(null)}
            >
              <Link href={`/database-explorer/${species.key}`}>
                <div
                  className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    hoveredSpecies === species.id ? "bg-emerald-50 shadow-sm" : "hover:bg-neutral-50"
                  }`}
                >
                  {/* Species Image */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                    <Image
                      src={species.url_gambar || "/placeholder.svg?height=48&width=48"}
                      alt={species.nama_umum || species.nama}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Species Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-800 group-hover:text-emerald-700 transition-colors duration-200 truncate">
                      {species.nama_umum || species.nama}
                    </h4>
                    <p className="text-sm text-neutral-500 italic truncate">{species.nama}</p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0">
                    <ArrowRight
                      className={`h-4 w-4 transition-all duration-200 ${
                        hoveredSpecies === species.id ? "text-emerald-600 translate-x-1" : "text-neutral-400"
                      }`}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {relatedSpecies.length > 6 && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <span>Lihat {relatedSpecies.length - 6} spesies lainnya</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Quick Action */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Genus yang sama</span>
            <Link href="/database-explorer" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Jelajahi semua →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
