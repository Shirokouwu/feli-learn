"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Species } from "@/types"

export function useSpeciesSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Species[]>([])

  // Fetch all species for search
  const { data: allSpecies } = useQuery({
    queryKey: ["species"],
    queryFn: async () => {
      const { data, error } = await supabase.from("taksonomi_spesies").select("*").order("nama")

      if (error) throw error

      // Map the data to match the expected format
      return data.map((s) => ({
        id: s.id,
        name: s.nama_umum || s.nama || "",
        scientific_name: s.nama || "",
        description: "", // This would need to come from taksonomi_deskripsi
        genus_id: s.genus_id,
        image_url: s.url_gambar || "",
        habitat: "", // This would need to come from taksonomi_habitat
        distribution: s.distribusi_geografis ? JSON.stringify(s.distribusi_geografis) : "",
        conservation_status: "", // This would need to come from taksonomi_konservasi
        characteristics: {}, // This would need to come from taksonomi_deskripsi
        created_at: s.created_at,
        // Keep original fields for compatibility
        nama: s.nama,
        nama_umum: s.nama_umum,
        kunci: s.kunci,
        distribusi_geografis: s.distribusi_geografis,
        url_gambar: s.url_gambar,
      })) as Species[]
    },
  })

  // Fetch popular species based on click count
  const { data: popularSpecies = [] } = useQuery({
    queryKey: ["popular-species"],
    queryFn: async () => {
      // This still uses the old species_clicks table
      // You might need to update this to a new table if you've renamed it
      const { data, error } = await supabase
        .from("species_clicks")
        .select("*, species:species_id(*)")
        .order("click_count", { ascending: false })
        .limit(5)
        .not("species", "is", null)

      if (error) throw error

      // Transform the data to match the Species type with click_count
      return data.map((item) => ({
        ...item.species,
        image_url: item.species.url_gambar || item.species.image_url || "",
        url_gambar: item.species.url_gambar || "",
        click_count: item.click_count,
      })) as Species[]
    },
  })

  // Find a species by name
  const findSpeciesByName = useCallback(
    (name: string): Species | null => {
      if (!allSpecies) return null

      const normalizedName = name.toLowerCase().trim()
      return (
        allSpecies.find(
          (species) =>
            species.name.toLowerCase() === normalizedName ||
            species.scientific_name.toLowerCase() === normalizedName ||
            (species.nama && species.nama.toLowerCase() === normalizedName) ||
            (species.nama_umum && species.nama_umum.toLowerCase() === normalizedName),
        ) || null
      )
    },
    [allSpecies],
  )

  // Update search results when query changes
  useEffect(() => {
    // Ensure searchQuery is a string and handle the case when it might be undefined
    if (!searchQuery || typeof searchQuery !== "string" || !searchQuery.trim() || !allSpecies) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = allSpecies.filter(
      (species) =>
        species.name.toLowerCase().includes(query) ||
        species.scientific_name.toLowerCase().includes(query) ||
        (species.nama && species.nama.toLowerCase().includes(query)) ||
        (species.nama_umum && species.nama_umum.toLowerCase().includes(query)),
    )

    setSearchResults(results)
  }, [searchQuery, allSpecies])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    popularSpecies,
    findSpeciesByName,
  }
}
