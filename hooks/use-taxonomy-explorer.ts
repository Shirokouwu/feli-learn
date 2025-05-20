"use client"

import { useState, useCallback } from "react"
import { useTaxonomyData } from "./use-taxonomy-data"
import type { Species, Genus } from "@/types"

export function useTaxonomyExplorer() {
  const { data: taxonomy, isLoading } = useTaxonomyData()
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({})
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null)
  const [showFamilyCard, setShowFamilyCard] = useState(false)

  const handleNodePositionsUpdate = useCallback((positions: { [key: string]: { x: number; y: number } }) => {
    setNodePositions(positions)
  }, [])

  const handleSpeciesSelect = useCallback((speciesData: Species | Genus | null) => {
    if (!speciesData) {
      setShowFamilyCard(false)
      setSelectedSpecies(null)
      return
    }

    if (speciesData.name === "Felidae") {
      setShowFamilyCard(true)
      setSelectedSpecies(null)
    } else {
      setSelectedSpecies(speciesData as Species)
      setShowFamilyCard(false)
    }
  }, [])

  return {
    taxonomy,
    isLoading,
    nodePositions,
    selectedSpecies,
    showFamilyCard,
    handleNodePositionsUpdate,
    handleSpeciesSelect,
    setShowFamilyCard,
  }
}
