"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronDown,
  ChevronRight,
  Search,
  X,
  List,
  Eye,
  Info,
  ChevronsUp,
  ChevronsDown,
  Layers,
  Cat,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface TaxonomyListProps {
  onSelectNode: (nodeId: string) => void
  isOpen?: boolean
  onToggle?: () => void
}

interface GenusItem {
  id: string
  nama: string
  deskripsi?: string
  url_gambar?: string
  expanded?: boolean
  species?: SpeciesItem[]
}

interface SpeciesItem {
  id: string
  nama: string
  nama_umum?: string
  genus_id: string
  url_gambar?: string
}

export function TaxonomyList({ onSelectNode, isOpen: externalIsOpen, onToggle }: TaxonomyListProps) {
  // Gunakan state internal jika tidak ada external control
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [genera, setGenera] = useState<GenusItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedGenera, setExpandedGenera] = useState<Record<string, boolean>>({})
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [totalSpecies, setTotalSpecies] = useState(0)

  // Tentukan apakah komponen dikontrol secara eksternal atau internal
  const isControlled = externalIsOpen !== undefined
  const isOpenControlled = isControlled ? externalIsOpen : internalIsOpen

  // Fungsi untuk toggle panel
  const togglePanel = () => {
    if (isControlled && onToggle) {
      onToggle()
    } else {
      setInternalIsOpen(!internalIsOpen)
    }
  }

  // Fokus pada input pencarian saat panel dibuka
  useEffect(() => {
    if (isOpenControlled && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    }
  }, [isOpenControlled])

  // Fetch taxonomy data
  useEffect(() => {
    async function fetchTaxonomyData() {
      setIsLoading(true)
      try {
        // Fetch genera
        const { data: generaData, error: generaError } = await supabase
          .from("taksonomi_genus")
          .select("*")
          .order("nama")

        if (generaError) {
          console.error("Error fetching genera:", generaError)
          return
        }

        // Fetch all species
        const { data: speciesData, error: speciesError } = await supabase
          .from("taksonomi_spesies")
          .select("*")
          .order("nama")

        if (speciesError) {
          console.error("Error fetching species:", speciesError)
          return
        }

        // Group species by genus
        const generaWithSpecies = generaData.map((genus) => {
          const genusSpecies = speciesData.filter((species) => species.genus_id === genus.id)
          return {
            ...genus,
            species: genusSpecies,
          }
        })

        setGenera(generaWithSpecies)

        // Calculate total species
        const total = speciesData.length
        setTotalSpecies(total)
      } catch (error) {
        console.error("Error fetching taxonomy data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpenControlled) {
      fetchTaxonomyData()
    }
  }, [isOpenControlled])

  // Auto-expand genera containing search results
  useEffect(() => {
    if (searchQuery) {
      const newExpandedGenera: Record<string, boolean> = {}

      // Find genera with matching species
      genera.forEach((genus) => {
        const hasMatchingSpecies = genus.species?.some(
          (species) =>
            species.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (species.nama_umum && species.nama_umum.toLowerCase().includes(searchQuery.toLowerCase())),
        )

        // Expand genus if it matches search or contains matching species
        if (genus.nama.toLowerCase().includes(searchQuery.toLowerCase()) || hasMatchingSpecies) {
          newExpandedGenera[genus.id] = true
        }
      })

      // Update expanded genera state
      setExpandedGenera((prev) => ({
        ...prev,
        ...newExpandedGenera,
      }))
    }
  }, [searchQuery, genera])

  // Toggle genus expansion
  const toggleGenus = (genusId: string) => {
    setExpandedGenera((prev) => ({
      ...prev,
      [genusId]: !prev[genusId],
    }))
  }

  // Expand all genera
  const expandAllGenera = () => {
    const allExpanded: Record<string, boolean> = {}
    genera.forEach((genus) => {
      allExpanded[genus.id] = true
    })
    setExpandedGenera(allExpanded)
  }

  // Collapse all genera
  const collapseAllGenera = () => {
    setExpandedGenera({})
  }

  // Filter genera and species based on search query
  const filteredGenera = genera
    .map((genus) => {
      // Filter species within this genus
      const filteredSpecies = genus.species?.filter(
        (species) =>
          !searchQuery ||
          species.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (species.nama_umum && species.nama_umum.toLowerCase().includes(searchQuery.toLowerCase())),
      )

      // Include genus if its name matches or if it has matching species
      if (
        !searchQuery ||
        genus.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (filteredSpecies && filteredSpecies.length > 0)
      ) {
        return {
          ...genus,
          species: filteredSpecies,
        }
      }
      return null
    })
    .filter(Boolean) as GenusItem[]

  // Handle node selection
  const handleNodeSelect = (nodeId: string) => {
    onSelectNode(nodeId)
    // Don't close the list so users can make multiple selections
  }

  return (
    <AnimatePresence>
      {isOpenControlled && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute top-16 right-4 bottom-16 z-20 w-72 bg-white rounded-xl shadow-lg border border-teal-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-3 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-teal-100">
            <h3 className="font-medium text-teal-800 flex items-center gap-2">
              <List className="h-4 w-4" />
              Daftar Taksonomi
            </h3>
            <Button variant="ghost" size="icon" onClick={togglePanel} className="h-8 w-8 rounded-full hover:bg-teal-50">
              <X className="h-4 w-4 text-neutral-500" />
            </Button>
          </div>

          {/* Search input */}
          <div className="p-3 border-b border-teal-100 bg-teal-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Cari genus atau spesies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                className="pl-9 h-9 text-sm bg-white border border-teal-200 focus-visible:ring-1 focus-visible:ring-teal-500"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-neutral-200"
                >
                  <X className="h-3.5 w-3.5 text-neutral-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Taxonomy Stats */}
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-teal-50 to-indigo-50 border-b border-teal-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <div className="flex flex-col items-center justify-center bg-white rounded-lg p-1 sm:p-1.5 shadow-sm border border-teal-200 min-w-[50px] sm:min-w-auto">
                  <Layers className="h-3 sm:h-4 w-3 sm:w-4 text-indigo-600" />
                  <span className="text-sm sm:text-lg font-semibold text-indigo-700">{genera.length}</span>
                  <span className="text-[9px] sm:text-[10px] text-indigo-600 font-medium -mt-0.5 sm:-mt-1">Genus</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white rounded-lg p-1 sm:p-1.5 shadow-sm border border-orange-200 min-w-[50px] sm:min-w-auto">
                  <Cat className="h-3 sm:h-4 w-3 sm:w-4 text-orange-600" />
                  <span className="text-sm sm:text-lg font-semibold text-orange-700">{totalSpecies}</span>
                  <span className="text-[9px] sm:text-[10px] text-orange-600 font-medium -mt-0.5 sm:-mt-1">Spesies</span>
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-1 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAllGenera}
                  className="h-6 sm:h-7 px-1.5 sm:px-2 text-[10px] sm:text-xs bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100 hover:text-teal-800 flex-1 sm:flex-initial"
                >
                  <ChevronsDown className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden xs:inline">Buka</span>
                  <span className="xs:hidden">↓</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAllGenera}
                  className="h-6 sm:h-7 px-1.5 sm:px-2 text-[10px] sm:text-xs bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-800 flex-1 sm:flex-initial"
                >
                  <ChevronsUp className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden xs:inline">Tutup</span>
                  <span className="xs:hidden">↑</span>
                </Button>
              </div>
            </div>
          </div>

          {/* List content */}
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <ScrollArea className="flex-1 h-[calc(100%-200px)]">
              <div className="p-2">
                {/* Family Felidae */}
                <div className="mb-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 h-auto text-left hover:bg-teal-50 rounded-lg border border-teal-100"
                    onClick={() => handleNodeSelect("felidae")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Felidae</Badge>
                        <span className="font-medium">Keluarga Kucing</span>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Genera and species */}
                {filteredGenera.length > 0 ? (
                  filteredGenera.map((genus) => (
                    <div key={genus.id} className="mb-1">
                      {/* Genus item */}
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-teal-50 rounded-md"
                          onClick={() => toggleGenus(genus.id)}
                        >
                          {expandedGenera[genus.id] ? (
                            <ChevronDown className="h-4 w-4 text-teal-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-teal-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`flex-1 justify-start px-2 py-1.5 h-auto text-left rounded-lg ${searchQuery && genus.nama.toLowerCase().includes(searchQuery.toLowerCase())
                              ? "bg-amber-50 hover:bg-amber-100 border border-amber-200"
                              : "hover:bg-teal-50 border border-indigo-100"
                            }`}
                          onClick={() => handleNodeSelect(genus.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Genus</Badge>
                              <span className="font-medium">{genus.nama}</span>
                            </div>
                            <div className="flex items-center justify-center min-w-[32px] h-5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-700">
                              {genus.species?.length || 0}
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-teal-50 rounded-md"
                          onClick={() => handleNodeSelect(genus.id)}
                        >
                          <Eye className="h-3.5 w-3.5 text-teal-600" />
                        </Button>
                      </div>

                      {/* Species list */}
                      <AnimatePresence>
                        {expandedGenera[genus.id] && genus.species && genus.species.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-6 mt-1 space-y-1 overflow-hidden"
                          >
                            {genus.species.map((species) => {
                              // Check if this species matches the search query
                              const matchesSearch =
                                searchQuery &&
                                (species.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (species.nama_umum &&
                                    species.nama_umum.toLowerCase().includes(searchQuery.toLowerCase())))

                              return (
                                <div key={species.id} className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    className={`flex-1 justify-start px-2 py-1.5 h-auto text-left rounded-lg text-sm
                                    ${matchesSearch ? "bg-amber-50 hover:bg-amber-100 border border-amber-200" : "hover:bg-teal-50 border border-orange-100"}`}
                                    onClick={() => handleNodeSelect(species.id)}
                                  >
                                    <div className="flex flex-col items-start w-full">
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs">
                                            Spesies
                                          </Badge>
                                          <span
                                            className={`font-medium italic ${matchesSearch ? "text-amber-800" : ""}`}
                                          >
                                            {species.nama}
                                          </span>
                                        </div>
                                      </div>
                                      {species.nama_umum && (
                                        <span
                                          className={`text-xs mt-0.5 ml-12 ${matchesSearch ? "text-amber-700 font-medium" : "text-neutral-600"}`}
                                        >
                                          {species.nama_umum}
                                        </span>
                                      )}
                                    </div>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-6 w-6 p-0 rounded-md ${matchesSearch ? "text-amber-600 hover:bg-amber-100" : "text-teal-600 hover:bg-teal-50"}`}
                                    onClick={() => handleNodeSelect(species.id)}
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-neutral-500">
                    {searchQuery ? "Tidak ada hasil ditemukan" : "Tidak ada data taksonomi"}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Help text */}
          <div className="p-2 border-t border-teal-100 bg-teal-50/50">
            <div className="flex items-start gap-2 text-xs text-teal-700">
              <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <p>
                Klik pada nama untuk melihat di diagram. Gunakan pencarian untuk menemukan spesies tertentu dengan
                cepat.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
