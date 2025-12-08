"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Clock, Star, Cat, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TaksonomiSpesies, TaksonomiGenus } from "@/lib/supabase-v2"

interface SearchSuggestionsProps {
  searchTerm: string
  showSuggestions: boolean
  selectedSuggestion: number
  species: (TaksonomiSpesies & { genus: TaksonomiGenus })[]
  genera: TaksonomiGenus[]
  onSuggestionClick: (suggestion: any) => void
  popularSearches: string[]
  recentSearches: string[]
}

export function SearchSuggestions({
  searchTerm,
  showSuggestions,
  selectedSuggestion,
  species,
  genera,
  onSuggestionClick,
  popularSearches,
  recentSearches,
}: SearchSuggestionsProps) {
  if (!showSuggestions) return null

  // Filter species based on search term
  const filteredSpecies = species
    .filter((s) => {
      if (!searchTerm) return false
      const term = searchTerm.toLowerCase()
      return s.nama.toLowerCase().includes(term) || (s.nama_umum && s.nama_umum.toLowerCase().includes(term))
    })
    .slice(0, 5)

  // Filter genera based on search term
  const filteredGenera = genera
    .filter((g) => {
      if (!searchTerm) return false
      return g.nama.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .slice(0, 3)

  // Show popular/recent searches when no search term
  const showPopular = !searchTerm && popularSearches.length > 0
  const showRecent = !searchTerm && recentSearches.length > 0

  // Create all suggestions array for keyboard navigation
  const allSuggestions = [
    ...filteredSpecies.map((s) => ({ type: "species", name: s.nama_umum || s.nama, data: s })),
    ...filteredGenera.map((g) => ({ type: "genus", name: g.nama, data: g })),
    ...(showRecent ? recentSearches.map((s) => ({ type: "recent", name: s })) : []),
    ...(showPopular ? popularSearches.map((s) => ({ type: "popular", name: s })) : []),
  ]

  if (allSuggestions.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white border border-emerald-200/50 rounded-xl shadow-xl z-[100] overflow-hidden backdrop-blur-sm"
      >
        <div className="max-h-96 overflow-y-auto">
          {/* Species Results */}
          {filteredSpecies.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Cat className="h-3 w-3" />
                Spesies
              </div>
              {filteredSpecies.map((speciesItem, index) => {
                const suggestionIndex = index
                return (
                  <motion.button
                    key={speciesItem.id}
                    onClick={() =>
                      onSuggestionClick({
                        type: "species",
                        name: speciesItem.nama_umum || speciesItem.nama,
                        data: speciesItem,
                      })
                    }
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 flex items-center gap-3 hover:bg-emerald-50",
                      selectedSuggestion === suggestionIndex && "bg-emerald-50 ring-1 ring-emerald-200",
                    )}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Cat className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {speciesItem.nama_umum || speciesItem.nama}
                      </div>
                      <div className="text-sm text-gray-500 italic truncate">{speciesItem.nama}</div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                      {speciesItem.genus.nama}
                    </Badge>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Genera Results */}
          {filteredGenera.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Genus
              </div>
              {filteredGenera.map((genus, index) => {
                const suggestionIndex = filteredSpecies.length + index
                return (
                  <motion.button
                    key={genus.id}
                    onClick={() => onSuggestionClick({ type: "genus", name: genus.nama, data: genus })}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 flex items-center gap-3 hover:bg-blue-50",
                      selectedSuggestion === suggestionIndex && "bg-blue-50 ring-1 ring-blue-200",
                    )}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{genus.nama}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {genus.jumlah_spesies ? `${genus.jumlah_spesies} spesies` : "Genus"}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      Genus
                    </Badge>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Recent Searches */}
          {showRecent && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Pencarian Terbaru
              </div>
              {recentSearches.map((search, index) => {
                const suggestionIndex = filteredSpecies.length + filteredGenera.length + index
                return (
                  <motion.button
                    key={search}
                    onClick={() => onSuggestionClick({ type: "recent", name: search })}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center gap-3 hover:bg-gray-50",
                      selectedSuggestion === suggestionIndex && "bg-gray-50 ring-1 ring-gray-200",
                    )}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{search}</span>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Popular Searches */}
          {showPopular && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <Star className="h-3 w-3" />
                Pencarian Populer
              </div>
              {popularSearches.map((search, index) => {
                const suggestionIndex = filteredSpecies.length + filteredGenera.length + recentSearches.length + index
                return (
                  <motion.button
                    key={search}
                    onClick={() => onSuggestionClick({ type: "popular", name: search })}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 flex items-center gap-3 hover:bg-yellow-50",
                      selectedSuggestion === suggestionIndex && "bg-yellow-50 ring-1 ring-yellow-200",
                    )}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{search}</span>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span>Gunakan ↑↓ untuk navigasi, Enter untuk pilih</span>
            <span>{allSuggestions.length} hasil</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
