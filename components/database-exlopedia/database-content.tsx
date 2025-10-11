"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
  ShieldQuestion,
  Shield,
  Loader2,
} from "lucide-react"
import { fetchAllSpecies, fetchAllGenera } from "@/lib/supabase-v2"
import type { TaksonomiSpesies, TaksonomiGenus, TaksonomiKonservasi } from "@/lib/supabase-v2"
import { SearchFilters } from "./search-filters"
import { CatalogGrid } from "./catalog-grid"
import { CatalogTable } from "./catalog-table"
import { CatalogVisualizations } from "./catalog-visualizations"
import { ViewModeToggle } from "./view-mode-toggle"

export function DatabaseContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [selectedGenera, setSelectedGenera] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "table" | "visualizations">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [species, setSpecies] = useState<
    (TaksonomiSpesies & {
      genus: TaksonomiGenus
      konservasi: TaksonomiKonservasi | null
    })[]
  >([])
  const [genera, setGenera] = useState<TaksonomiGenus[]>([])
  const [conservationStatuses, setConservationStatuses] = useState<string[]>([])
  const itemsPerPage = 9
  const catalogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[v0] Fetching database data...")
        setError(null)

        const [speciesData, generaData] = await Promise.all([fetchAllSpecies(), fetchAllGenera()])

        console.log("[v0] Species data:", speciesData)
        console.log("[v0] Genera data:", generaData)

        setSpecies(speciesData)
        setGenera(generaData)

        // Extract unique conservation statuses from species data
        const uniqueStatuses = Array.from(
          new Set(
            speciesData
              .map((species) => species.konservasi?.status_konservasi_alam)
              .filter((status): status is string => Boolean(status))
              .flat(),
          ),
        ).sort()

        setConservationStatuses(uniqueStatuses)
        console.log("[v0] Data fetched successfully")
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
        setError("Gagal memuat data. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Enhanced filtering logic with better debugging
  const filteredSpecies = species.filter((speciesItem) => {
    // Search term filter - check both nama and nama_umum
    const searchMatch =
      !searchTerm ||
      speciesItem.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (speciesItem.nama_umum && speciesItem.nama_umum.toLowerCase().includes(searchTerm.toLowerCase()))

    // Conservation status filter - improved handling
    const statusMatch =
      filterStatus.length === 0 ||
      (speciesItem.konservasi &&
        speciesItem.konservasi.status_konservasi_alam &&
        (Array.isArray(speciesItem.konservasi.status_konservasi_alam)
          ? speciesItem.konservasi.status_konservasi_alam.some((status) => filterStatus.includes(status))
          : filterStatus.includes(speciesItem.konservasi.status_konservasi_alam)))

    // Genus filter
    const genusMatch = selectedGenera.length === 0 || selectedGenera.includes(speciesItem.genus_id)

    const matches = searchMatch && statusMatch && genusMatch

    // Debug logging
    if (searchTerm && !matches) {
      console.log(`Species ${speciesItem.nama} filtered out:`, {
        searchTerm,
        searchMatch,
        statusMatch,
        genusMatch,
        speciesNama: speciesItem.nama,
        speciesNamaUmum: speciesItem.nama_umum,
      })
    }

    return matches
  })

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus, selectedGenera])

  const pageCount = Math.ceil(filteredSpecies.length / itemsPerPage)
  const currentSpecies = filteredSpecies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Critically Endangered":
        return {
          color: "bg-red-500/90 text-white border-red-600",
          icon: AlertTriangle,
          iconColor: "text-white",
          label: "CR",
          bgColor: "bg-red-50 text-red-800 border-red-200",
          filterColor: "bg-red-100 text-red-900 border-red-300",
        }
      case "Endangered":
        return {
          color: "bg-red-500/90 text-white border-red-600",
          icon: ShieldAlert,
          iconColor: "text-white",
          label: "EN",
          bgColor: "bg-red-50 text-red-800 border-red-200",
          filterColor: "bg-red-100 text-red-900 border-red-300",
        }
      case "Vulnerable":
        return {
          color: "bg-orange-500/90 text-white border-orange-600",
          icon: AlertCircle,
          iconColor: "text-white",
          label: "VU",
          bgColor: "bg-orange-50 text-orange-800 border-orange-200",
          filterColor: "bg-orange-100 text-orange-900 border-orange-300",
        }
      case "Near Threatened":
        return {
          color: "bg-yellow-500/90 text-white border-yellow-600",
          icon: ShieldQuestion,
          iconColor: "text-white",
          label: "NT",
          bgColor: "bg-yellow-50 text-yellow-800 border-yellow-200",
          filterColor: "bg-yellow-100 text-yellow-900 border-yellow-300",
        }
      case "Least Concern":
        return {
          color: "bg-emerald-500/90 text-white border-emerald-600",
          icon: Shield,
          iconColor: "text-white",
          label: "LC",
          bgColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
          filterColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
        }
      default:
        return {
          color: "bg-gray-500/90 text-white border-gray-600",
          icon: ShieldQuestion,
          iconColor: "text-white",
          label: "NA",
          bgColor: "bg-gray-50 text-gray-800 border-gray-200",
          filterColor: "bg-gray-100 text-gray-900 border-gray-300",
        }
    }
  }

  // Helper function to get conservation status (handle both string and array)
  const getConservationStatus = (konservasi: TaksonomiKonservasi | null) => {
    if (!konservasi || !konservasi.status_konservasi_alam) return null

    // Handle if status_konservasi_alam is an array
    if (Array.isArray(konservasi.status_konservasi_alam)) {
      return konservasi.status_konservasi_alam[0] || null
    }

    // Handle if it's a string
    return konservasi.status_konservasi_alam
  }

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("")
    setFilterStatus([])
    setSelectedGenera([])
    setCurrentPage(1)
  }

  // Smooth scroll function
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })
  }

  // Debug info
  useEffect(() => {
    console.log("Filter state:", {
      searchTerm,
      filterStatus,
      selectedGenera,
      totalSpecies: species.length,
      filteredCount: filteredSpecies.length,
    })
  }, [searchTerm, filterStatus, selectedGenera, species.length, filteredSpecies.length])

  if (error) {
    return (
      <div className="space-y-8 relative">
        <div className="bg-white/90 backdrop-blur-sm border border-red-100 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-700">
              Muat Ulang
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* Enhanced Search and Filter Section - Higher z-index */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-50"
      >
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          selectedGenera={selectedGenera}
          setSelectedGenera={setSelectedGenera}
          species={species}
          genera={genera}
          conservationStatuses={conservationStatuses}
          getStatusConfig={getStatusConfig}
        />
      </motion.div>

      {/* Clean Catalog Section - Lower z-index */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10"
      >
        <div
          ref={catalogRef}
          className="bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-emerald-50 bg-emerald-50/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Katalog Spesies Felidae</h2>
                <p className="text-sm text-gray-700 mt-1">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Memuat data...
                    </span>
                  ) : (
                    <>
                      <span className="font-medium text-emerald-600">{filteredSpecies.length}</span> dari{" "}
                      <span className="font-medium">{species.length}</span> spesies ditemukan
                      {(filterStatus.length > 0 || selectedGenera.length > 0 || searchTerm.trim()) && (
                        <span className="text-emerald-600 ml-1">(terfilter)</span>
                      )}
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Clear filters button */}
                {(filterStatus.length > 0 || selectedGenera.length > 0 || searchTerm.trim()) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    Hapus Filter
                  </Button>
                )}
                <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 bg-white">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
                  <p className="text-gray-600">Memuat data spesies...</p>
                </motion.div>
              ) : filteredSpecies.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4"
                  >
                    <Search className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada spesies ditemukan</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? (
                      <>
                        Tidak ada hasil untuk pencarian "<strong>{searchTerm}</strong>"
                      </>
                    ) : (
                      "Tidak ada spesies yang sesuai dengan filter yang dipilih"
                    )}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Coba:</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Periksa ejaan kata kunci</li>
                      <li>• Gunakan kata kunci yang lebih umum</li>
                      <li>• Hapus beberapa filter</li>
                    </ul>
                  </div>
                  {(filterStatus.length > 0 || selectedGenera.length > 0 || searchTerm.trim()) && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="mt-4 border-emerald-100 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                    >
                      Hapus Semua Filter
                    </Button>
                  )}
                </motion.div>
              ) : (
                <>
                  {viewMode === "grid" && (
                    <CatalogGrid
                      species={currentSpecies}
                      getStatusConfig={getStatusConfig}
                      getConservationStatus={getConservationStatus}
                    />
                  )}

                  {viewMode === "table" && (
                    <CatalogTable
                      species={currentSpecies}
                      getStatusConfig={getStatusConfig}
                      getConservationStatus={getConservationStatus}
                    />
                  )}

                  {viewMode === "visualizations" && (
                    <CatalogVisualizations
                      species={species}
                      conservationStatuses={conservationStatuses}
                      getConservationStatus={getConservationStatus}
                    />
                  )}
                </>
              )}
            </AnimatePresence>

            {/* Enhanced Pagination */}
            {pageCount > 1 && !isLoading && filteredSpecies.length > 0 && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 gap-2">
                <Button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                    setTimeout(scrollToCatalog, 100)
                  }}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="flex-shrink-0 border-emerald-100 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 px-3 py-2"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Button>

                <div className="flex flex-col items-center justify-center text-center px-2">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    Halaman {currentPage} dari {pageCount}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredSpecies.length)} dari {filteredSpecies.length})
                  </span>
                </div>

                <Button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                    setTimeout(scrollToCatalog, 100)
                  }}
                  disabled={currentPage === pageCount}
                  variant="outline"
                  className="flex-shrink-0 border-emerald-100 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 px-3 py-2"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
