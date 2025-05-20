"use client"
import { motion } from "framer-motion"
import type React from "react"

import { Search, X, ArrowLeft, Loader2, TrendingUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RadialSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredNodes: any[]
  radialNodes: any[]
  onNodeSelect: (node: any) => void
  onClose: () => void
}

export function RadialSearch({
  searchQuery,
  setSearchQuery,
  filteredNodes,
  radialNodes,
  onNodeSelect,
  onClose,
}: RadialSearchProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus the search input when the component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }

    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  // Save a search term to recent searches
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return

    const newSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5) // Keep only the 5 most recent searches

    setRecentSearches(newSearches)
    localStorage.setItem("recentSearches", JSON.stringify(newSearches))
  }

  // Filter nodes based on active filter
  const getFilteredResults = () => {
    if (activeFilter === "all") {
      return filteredNodes
    } else if (activeFilter === "genus") {
      return filteredNodes.filter((node) => node.level === "genus")
    } else if (activeFilter === "species") {
      return filteredNodes.filter((node) => node.level === "species")
    }
    return filteredNodes
  }

  const filteredResults = getFilteredResults()

  // Get unique genera from radial nodes
  const genera = radialNodes
    .filter((node) => node.level === "genus")
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))

  // Fetch popular species
  const { data: popularSpeciesData, isLoading: isLoadingPopular } = useQuery({
    queryKey: ["popular-species-radial"],
    queryFn: async () => {
      // Fetch the most clicked species
      const { data: clickData, error: clickError } = await supabase
        .from("species_clicks")
        .select("*, species_id, genus_id")
        .is("genus_id", null) // Only get species, not genera
        .order("click_count", { ascending: false })
        .limit(5) // Get top 5 most popular species

      if (clickError) {
        console.error("Error fetching popular species:", clickError)
        return []
      }

      // For each species_id, fetch the actual species data
      const speciesPromises = clickData.map(async (item) => {
        if (!item.species_id) return null

        const { data: speciesData, error: speciesError } = await supabase
          .from("taksonomi_spesies")
          .select("*")
          .eq("id", item.species_id)
          .single()

        if (speciesError) {
          console.error("Error fetching species data:", speciesError)
          return null
        }

        return {
          id: speciesData.id,
          name: speciesData.nama_umum || speciesData.nama,
          scientific_name: speciesData.nama,
          color: "#ea580c", // Orange color for species
          image_url: speciesData.url_gambar || "/placeholder.svg",
          click_count: item.click_count,
          level: "species", // Tambahkan level untuk tracking yang benar
        }
      })

      const speciesResults = await Promise.all(speciesPromises)
      return speciesResults.filter(Boolean) // Remove any null results
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  // Fetch popular genera
  const { data: popularGeneraData, isLoading: isLoadingGenera } = useQuery({
    queryKey: ["popular-genera-radial"],
    queryFn: async () => {
      // Fetch the most clicked genera
      const { data: clickData, error: clickError } = await supabase
        .from("species_clicks")
        .select("*, genus_id")
        .not("genus_id", "is", null) // Only get genera
        .order("click_count", { ascending: false })
        .limit(5) // Get top 5 most popular genera

      if (clickError) {
        console.error("Error fetching popular genera:", clickError)
        return []
      }

      // For each genus_id, fetch the actual genus data
      const generaPromises = clickData.map(async (item) => {
        if (!item.genus_id) return null

        const { data: genusData, error: genusError } = await supabase
          .from("taksonomi_genus")
          .select("*")
          .eq("id", item.genus_id)
          .single()

        if (genusError) {
          console.error("Error fetching genus data:", genusError)
          return null
        }

        return {
          id: genusData.id,
          name: genusData.nama,
          scientific_name: genusData.nama,
          color: "#6366f1", // Indigo color for genus
          image_url: genusData.url_gambar || "/placeholder.svg",
          click_count: item.click_count,
          level: "genus",
        }
      })

      const generaResults = await Promise.all(generaPromises)
      return generaResults.filter(Boolean) // Remove any null results
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  // Perbaiki fungsi handleNodeClick untuk navigasi instan tanpa delay
  const handleNodeClick = (node: any) => {
    // Save the search term
    saveRecentSearch(node.name || node.scientific_name)

    // Find the actual node from radialNodes first
    const actualNode = radialNodes.find((n) => n.id === node.id)

    // PENTING: Navigasi ke node SEBELUM menutup panel pencarian
    // Ini memastikan navigasi terjadi secara instan
    if (actualNode) {
      onNodeSelect(actualNode)
    }

    // Tutup panel pencarian setelah navigasi dimulai
    onClose()
    setSearchQuery("")

    // Track the click in the database (non-blocking, tidak menunggu respons)
    if (node.id) {
      const type = node.level || "species" // Default to species if level is not specified

      fetch("/api/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: node.id,
          type: type,
        }),
      }).catch((error) => {
        console.error("Error tracking click:", error)
      })
    }
  }

  const handleRecentSearchClick = (term: string) => {
    // If there's an exact match in the nodes, select it directly
    const matchedNode = radialNodes.find(
      (node) =>
        (node.name && node.name.toLowerCase() === term.toLowerCase()) ||
        (node.scientific_name && node.scientific_name.toLowerCase() === term.toLowerCase()),
    )

    if (matchedNode) {
      // Immediately handle the node click
      handleNodeClick(matchedNode)
    } else {
      // Just set the search query if no exact match
      setSearchQuery(term)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const results = searchQuery ? filteredResults : popularSpeciesData || []

    if (results.length === 0) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    }

    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    }

    // Enter key
    else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleNodeClick(results[selectedIndex])
      }
    }

    // Escape key
    else if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-teal-100 dark:border-teal-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          </Button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500 dark:text-teal-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Cari spesies atau genus Felidae..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 h-10 w-full bg-teal-50/50 dark:bg-teal-900/20 border-0 rounded-full focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <X className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        {searchQuery && (
          <div className="px-4 pt-2 pb-0">
            <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="w-full">
              <TabsList className="grid grid-cols-3 h-9 bg-teal-50 dark:bg-teal-900/20 p-0.5 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="rounded-md text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-teal-800 data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-100 data-[state=active]:shadow-sm"
                >
                  Semua
                </TabsTrigger>
                <TabsTrigger
                  value="genus"
                  className="rounded-md text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-teal-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-100 data-[state=active]:shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></div>
                  Genus
                </TabsTrigger>
                <TabsTrigger
                  value="species"
                  className="rounded-md text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-teal-800 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-100 data-[state=active]:shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-orange-400 mr-1.5"></div>
                  Spesies
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Search Content */}
        <div className="relative">
          <ScrollArea className="h-[60vh] max-h-[500px]">
            {searchQuery ? (
              // Search Results
              <div className="p-2">
                {filteredResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {filteredResults.length} hasil ditemukan{" "}
                      {activeFilter !== "all" && `(filter: ${activeFilter === "genus" ? "genus" : "spesies"})`}
                    </div>
                    <div className="space-y-1">
                      {filteredResults.map((node, index) => (
                        <motion.button
                          key={node.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`w-full px-4 py-3 text-left transition-colors rounded-xl flex items-center gap-3 ${
                            index === selectedIndex
                              ? "bg-teal-50 dark:bg-teal-900/20"
                              : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                          }`}
                          onClick={() => handleNodeClick(node)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-900/60 flex-shrink-0 border border-teal-200 dark:border-teal-800 shadow-sm">
                            {node.image_url ? (
                              <Image
                                src={node.image_url || "/placeholder.svg"}
                                alt={node.name || "Node"}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-teal-600 dark:text-teal-400 text-xs font-medium">
                                {node.name?.substring(0, 2) || "?"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                              {node.name || node.scientific_name || "Unknown"}
                            </div>
                            <div className="text-sm text-teal-600 dark:text-teal-400 italic truncate">
                              {node.scientific_name}
                            </div>
                            {node.level && (
                              <div className="flex items-center gap-1 mt-1">
                                <Badge
                                  className={`px-1.5 py-0 text-[10px] ${
                                    node.level === "family"
                                      ? "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300"
                                      : node.level === "genus"
                                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
                                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                                  }`}
                                >
                                  {node.level === "family" ? "Felidae" : node.level === "genus" ? "Genus" : "Spesies"}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      Tidak ada hasil ditemukan
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
                      Tidak dapat menemukan "{searchQuery}" dalam taksonomi Felidae. Coba kata kunci lain atau jelajahi
                      spesies populer.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Default Content (Popular Species & Recent Searches)
              <div className="p-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="px-4 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Pencarian Terbaru
                    </div>
                    <div className="flex flex-wrap gap-2 px-4">
                      {recentSearches.map((term, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-300"
                          onClick={() => handleRecentSearchClick(term)}
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabs for Popular Content */}
                <Tabs defaultValue="species" className="w-full px-4">
                  <TabsList className="grid grid-cols-2 h-9 bg-teal-50 dark:bg-teal-900/20 p-0.5 rounded-lg mb-3">
                    <TabsTrigger
                      value="species"
                      className="rounded-md text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-teal-800 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-100 data-[state=active]:shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-400 mr-1.5"></div>
                      Spesies Populer
                    </TabsTrigger>
                    <TabsTrigger
                      value="genus"
                      className="rounded-md text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-teal-800 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-100 data-[state=active]:shadow-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></div>
                      Genus Populer
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="species" className="mt-0">
                    {/* Popular Species */}
                    {isLoadingPopular ? (
                      <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-2" />
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Memuat spesies populer...</p>
                        </div>
                      </div>
                    ) : popularSpeciesData && popularSpeciesData.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                        {popularSpeciesData.map((node, index) => (
                          <motion.button
                            key={node.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`w-full px-3 py-2 text-left transition-colors rounded-xl flex items-center gap-3 ${
                              index === selectedIndex
                                ? "bg-teal-50 dark:bg-teal-900/20"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                            }`}
                            onClick={() => handleNodeClick(node)}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xs flex items-center justify-center font-bold shadow-sm ring-2 ring-teal-100 dark:ring-teal-900/50">
                                {index + 1}
                              </div>
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-teal-100 dark:bg-teal-900/50 flex-shrink-0 border border-teal-200 dark:border-teal-800">
                                {node.image_url ? (
                                  <Image
                                    src={node.image_url || "/placeholder.svg"}
                                    alt={node.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-teal-600 dark:text-teal-400 text-xs font-medium">
                                    {node.name?.substring(0, 2) || "?"}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                {node.name}
                              </div>
                              <div className="text-xs text-teal-600 dark:text-teal-400 italic truncate">
                                {node.scientific_name}
                              </div>
                              {node.click_count && (
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-teal-400 dark:bg-teal-500 rounded-full"></div>
                                  {node.click_count} kali dilihat
                                </div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                        Belum ada data spesies populer
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="genus" className="mt-0">
                    {/* Popular Genera */}
                    {isLoadingGenera ? (
                      <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Memuat genus populer...</p>
                        </div>
                      </div>
                    ) : popularGeneraData && popularGeneraData.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                        {popularGeneraData.map((node, index) => (
                          <motion.button
                            key={node.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`w-full px-3 py-2 text-left transition-colors rounded-xl flex items-center gap-3 ${
                              index === selectedIndex
                                ? "bg-teal-50 dark:bg-teal-900/20"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                            }`}
                            onClick={() => handleNodeClick(node)}
                            onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xs flex items-center justify-center font-bold shadow-sm ring-2 ring-indigo-100 dark:ring-indigo-900/50">
                                {index + 1}
                              </div>
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-indigo-100 dark:bg-indigo-900/50 flex-shrink-0 border border-indigo-200 dark:border-indigo-800">
                                {node.image_url ? (
                                  <Image
                                    src={node.image_url || "/placeholder.svg"}
                                    alt={node.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                                    {node.name?.substring(0, 2) || "?"}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                {node.name}
                              </div>
                              <div className="text-xs text-indigo-600 dark:text-indigo-400 italic truncate">
                                Genus {node.scientific_name}
                              </div>
                              {node.click_count && (
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-500 rounded-full"></div>
                                  {node.click_count} kali dilihat
                                </div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                        Belum ada data genus populer
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Genus Quick Access */}
                <div className="mt-4 px-4">
                  <div className="px-0 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Akses Cepat Genus
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genera.slice(0, 8).map((genus, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-300"
                        onClick={() => handleNodeClick(genus)}
                      >
                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></div>
                        {genus.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Keyboard Navigation Help */}
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-500 dark:text-neutral-400">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-500 dark:text-neutral-400">
                    ↓
                  </kbd>
                  <span className="ml-1">untuk navigasi</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-500 dark:text-neutral-400">
                    Enter
                  </kbd>
                  <span className="ml-1">untuk memilih</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-500 dark:text-neutral-400">
                    Esc
                  </kbd>
                  <span className="ml-1">untuk menutup</span>
                </div>
              </div>
              <div>{filteredResults.length > 0 && searchQuery && <span>{filteredResults.length} hasil</span>}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
