"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Cat, Check, ChevronDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SearchSuggestions } from "./search-suggestions"
import type { TaksonomiSpesies, TaksonomiGenus } from "@/lib/supabase-v2"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterStatus: string[]
  setFilterStatus: (status: string[]) => void
  selectedGenera: string[]
  setSelectedGenera: (genera: string[]) => void
  species: (TaksonomiSpesies & { genus: TaksonomiGenus })[]
  genera: TaksonomiGenus[]
  conservationStatuses: string[]
  getStatusConfig: (status: string) => any
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  selectedGenera,
  setSelectedGenera,
  species,
  genera,
  conservationStatuses,
  getStatusConfig,
}: SearchFiltersProps) {
  const [openStatus, setOpenStatus] = useState(false)
  const [openGenus, setOpenGenus] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearchTerm(localSearchTerm)
    }, 1000)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [localSearchTerm, setSearchTerm])

  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // console.log("Search term changed:", value)
    setLocalSearchTerm(value)
    setShowSuggestions(true)
    setSelectedSuggestion(-1)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    const allSuggestions = [
      ...species.slice(0, 5).map((s) => ({ type: "species", name: s.nama_umum || s.nama })),
      ...genera.slice(0, 3).map((g) => ({ type: "genus", name: g.nama })),
      ...["Harimau", "Singa", "Kucing", "Cheetah"].map((s) => ({ type: "recent", name: s })),
      ...["Panthera leo", "Felis catus", "Panthera tigris", "Lynx lynx", "Puma concolor", "Acinonyx jubatus"].map(
        (s) => ({ type: "popular", name: s }),
      ),
    ]

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev < allSuggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedSuggestion >= 0 && allSuggestions[selectedSuggestion]) {
          const suggestion = allSuggestions[selectedSuggestion]
          setLocalSearchTerm(suggestion.name)
          setSearchTerm(suggestion.name)
          setShowSuggestions(false)
          setSelectedSuggestion(-1)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedSuggestion(-1)
        searchInputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    // console.log("Suggestion clicked:", suggestion)
    setLocalSearchTerm(suggestion)
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    searchInputRef.current?.blur()
  }

  const clearSearch = () => {
    // console.log("Clearing search")
    setLocalSearchTerm("")
    setSearchTerm("")
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    searchInputRef.current?.focus()
  }

  const toggleStatus = (status: string) => {
    // console.log("Toggling status:", status)
    setFilterStatus(
      filterStatus.includes(status) ? filterStatus.filter((s) => s !== status) : [...filterStatus, status],
    )
  }

  const toggleGenus = (genus: string) => {
    // console.log("Toggling genus:", genus)
    setSelectedGenera(
      selectedGenera.includes(genus) ? selectedGenera.filter((g) => g !== genus) : [...selectedGenera, genus],
    )
  }

  const removeFilter = (type: "genus" | "status", value: string) => {
    // console.log("Removing filter:", type, value)
    if (type === "genus") {
      setSelectedGenera(selectedGenera.filter((g) => g !== value))
    } else {
      setFilterStatus(filterStatus.filter((s) => s !== value))
    }
  }

  const clearAllFilters = () => {
    // console.log("Clearing all filters")
    setFilterStatus([])
    setSelectedGenera([])
    setLocalSearchTerm("")
    setSearchTerm("")
  }

  const hasActiveFilters = filterStatus.length > 0 || selectedGenera.length > 0 || (searchTerm && typeof searchTerm === 'string' && searchTerm.trim())

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Search Input - takes most space */}
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
            <Input
              ref={searchInputRef}
              placeholder="Cari spesies felidae..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              onFocus={() => {
                setShowSuggestions(true)
                setIsSearchFocused(true)
              }}
              onBlur={() => {
                setIsSearchFocused(false)
                setTimeout(() => setShowSuggestions(false), 200)
              }}
              onKeyDown={handleSearchKeyDown}
              className="pl-10 pr-10 h-10 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20 bg-white text-sm rounded-lg"
            />

            {/* Clear Search Button */}
            <AnimatePresence>
              {localSearchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <X className="h-3 w-3 text-gray-600" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Search Suggestions */}
          <div className="relative z-100">
            <SearchSuggestions
              searchTerm={localSearchTerm}
              showSuggestions={showSuggestions}
              selectedSuggestion={selectedSuggestion}
              species={species}
              genera={genera}
              onSuggestionClick={handleSuggestionClick}
              popularSearches={[
                "Panthera leo",
                "Felis catus",
                "Panthera tigris",
                "Lynx lynx",
                "Puma concolor",
                "Acinonyx jubatus",
              ]}
              recentSearches={["Harimau", "Singa", "Kucing", "Cheetah"]}
            />
          </div>
        </div>

        {/* Status Filter - Compact */}
        <Popover open={openStatus} onOpenChange={setOpenStatus}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-10 px-3 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors rounded-lg",
                filterStatus.length > 0 && "border-emerald-400 bg-emerald-50 text-emerald-700",
              )}
            >
              <Filter className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">Status</span>
              {filterStatus.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-xs bg-emerald-100 text-emerald-700">
                  {filterStatus.length}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 border-gray-200 shadow-lg rounded-lg" align="end">
            <Command>
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-900">Status Konservasi</span>
              </div>
              <CommandInput placeholder="Cari status..." className="border-none h-9" />
              <CommandList className="max-h-60">
                <CommandEmpty className="py-4 text-center text-sm text-gray-500">Status tidak ditemukan.</CommandEmpty>
                <CommandGroup className="p-1">
                  {conservationStatuses.map((status) => {
                    const config = getStatusConfig(status)
                    const isSelected = filterStatus.includes(status)
                    return (
                      <CommandItem
                        key={status}
                        value={status}
                        onSelect={() => toggleStatus(status)}
                        className={cn("cursor-pointer py-2 px-2 rounded-md mb-0.5", isSelected && "bg-emerald-50")}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <config.icon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{config.label}</span>
                        </div>
                        <Check className={cn("h-4 w-4 text-emerald-600", isSelected ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Genus Filter - Compact */}
        <Popover open={openGenus} onOpenChange={setOpenGenus}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-10 px-3 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors rounded-lg",
                selectedGenera.length > 0 && "border-emerald-400 bg-emerald-50 text-emerald-700",
              )}
            >
              <Cat className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">Genus</span>
              {selectedGenera.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-xs bg-emerald-100 text-emerald-700">
                  {selectedGenera.length}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 border-gray-200 shadow-xl rounded-xl" align="end">
            <Command>
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <span className="text-sm font-semibold text-gray-900">Pilih Genus</span>
                <p className="text-xs text-gray-600 mt-0.5">Cari dan pilih genus yang diinginkan</p>
              </div>
              <div className="p-2">
                <CommandInput
                  placeholder="Cari genus..."
                  className="border-none h-10 bg-gray-50/50 rounded-lg text-sm placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <CommandList className="max-h-64 px-2 pb-2">
                <CommandEmpty className="py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Cat className="h-8 w-8 text-gray-300" />
                    <span className="text-sm text-gray-500 font-medium">Genus tidak ditemukan</span>
                    <span className="text-xs text-gray-400">Coba kata kunci lain</span>
                  </div>
                </CommandEmpty>
                <CommandGroup className="space-y-1">
                  {genera.map((genus) => {
                    const isSelected = selectedGenera.includes(genus.id)
                    const speciesCount = species.filter((s) => s.genus_id === genus.id).length
                    return (
                      <CommandItem
                        key={genus.id}
                        value={genus.nama}
                        onSelect={() => toggleGenus(genus.id)}
                        className={cn(
                          "cursor-pointer py-3 px-3 rounded-lg transition-all duration-300 group",
                          "hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-sm hover:scale-[1.02] border border-transparent",
                          "hover:ring-2 hover:ring-emerald-100/50",
                          isSelected && "bg-emerald-500 text-white border-emerald-500 shadow-sm",
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                              isSelected
                                ? "bg-emerald-400 text-white"
                                : "bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 group-hover:shadow-sm group-hover:scale-105",
                            )}
                          >
                            <Cat className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div
                              className={cn(
                                "font-medium text-sm transition-colors duration-300",
                                isSelected ? "text-white" : "text-gray-900 group-hover:text-emerald-700",
                              )}
                            >
                              {genus.nama}
                            </div>
                            <div
                              className={cn(
                                "text-xs mt-0.5 transition-colors duration-300",
                                isSelected ? "text-emerald-100" : "text-gray-500 group-hover:text-emerald-600",
                              )}
                            >
                              {speciesCount} spesies
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                            isSelected
                              ? "bg-emerald-400 text-white"
                              : "border-2 border-gray-300 group-hover:border-emerald-400 group-hover:bg-emerald-50 group-hover:scale-110 group-hover:shadow-sm",
                          )}
                        >
                          <Check
                            className={cn(
                              "h-3 w-3 transition-all duration-300",
                              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-30",
                            )}
                          />
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-10 px-2 text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters - Compact display */}
      <AnimatePresence>
        {(filterStatus.length > 0 || selectedGenera.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <div className="flex flex-wrap gap-1.5">
              {filterStatus.map((status) => {
                const config = getStatusConfig(status)
                return (
                  <Badge
                    key={status}
                    variant="outline"
                    className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    {config.label}
                    <button
                      onClick={() => removeFilter("status", status)}
                      className="ml-1 hover:bg-emerald-200 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                )
              })}
              {selectedGenera.map((genusId) => {
                const genus = genera.find((g) => g.id === genusId)
                return genus ? (
                  <Badge
                    key={genusId}
                    variant="outline"
                    className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    {genus.nama}
                    <button
                      onClick={() => removeFilter("genus", genusId)}
                      className="ml-1 hover:bg-emerald-200 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ) : null
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
