"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRightIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"
import type { TaksonomiSpesies, TaksonomiGenus, TaksonomiKonservasi } from "@/lib/supabase-v2"

interface SpeciesTableProps {
  species: (TaksonomiSpesies & {
    genus: TaksonomiGenus
    konservasi: TaksonomiKonservasi | null
  })[]
  getStatusConfig: (status: string) => any
  getConservationStatus: (konservasi: TaksonomiKonservasi | null) => string | null
}

export function CatalogTable({ species, getStatusConfig, getConservationStatus }: SpeciesTableProps) {
  const getTrendIcon = (trend: string) => {
    if (trend?.toLowerCase().includes("meningkat")) return TrendingUp
    if (trend?.toLowerCase().includes("menurun")) return TrendingDown
    return Minus
  }

  const getTrendColor = (trend: string) => {
    if (trend?.toLowerCase().includes("meningkat")) return "text-emerald-600"
    if (trend?.toLowerCase().includes("menurun")) return "text-red-600"
    return "text-yellow-600"
  }

  return (
    <motion.div
      key="table"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900">Nama Spesies</TableHead>
            <TableHead className="font-semibold text-gray-900">Nama Umum</TableHead>
            <TableHead className="font-semibold text-gray-900">Genus</TableHead>
            <TableHead className="font-semibold text-gray-900">Status Konservasi</TableHead>
            <TableHead className="font-semibold text-gray-900">Populasi</TableHead>
            <TableHead className="font-semibold text-gray-900">Tren</TableHead>
            <TableHead className="text-right font-semibold text-gray-900">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {species.map((species, index) => {
              const conservationStatus = getConservationStatus(species.konservasi)
              const statusConfig = conservationStatus ? getStatusConfig(conservationStatus) : null

              return (
                <motion.tr
                  key={species.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <TableCell className="font-medium text-gray-900">{species.nama}</TableCell>
                  <TableCell className="text-gray-700">{species.nama_umum || "-"}</TableCell>
                  <TableCell className="text-gray-700">{species.genus?.nama || "-"}</TableCell>
                  <TableCell>
                    {statusConfig ? (
                      <Badge
                        variant="outline"
                        className={cn("flex items-center gap-1 w-fit font-medium", statusConfig.filterColor)}
                      >
                        <statusConfig.icon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-700">{species.konservasi?.total_populasi || "-"}</TableCell>
                  <TableCell>
                    {species.konservasi?.tren_populasi ? (
                      <div className="flex items-center gap-1">
                        {React.createElement(getTrendIcon(species.konservasi.tren_populasi), {
                          className: cn("h-4 w-4", getTrendColor(species.konservasi.tren_populasi)),
                        })}
                        <span className={cn("text-sm", getTrendColor(species.konservasi.tren_populasi))}>
                          {species.konservasi.tren_populasi}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/database/${species.kunci}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        Detail
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </motion.tr>
              )
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  )
}
