"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useTaxonomyExplorer } from "@/hooks/use-taxonomy-explorer"


// Import radial taxonomy components
import { RadialControls } from "./radial-controls"
import { RadialSearch } from "./radial-search"
import { RadialStoryMode } from "./radial-story-mode"
import { RadialTourGuide } from "./radial-tour-guide"
import { RadialDiagram } from "./radial-diagram"
import { RadialIntro } from "./radial-intro"
import { RadialActionButtons } from "./radial-action-buttons"
import { SpeciesCard } from "./radial-species-card"

// Tambahkan import useQuery
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

// Tambahkan import untuk TaxonomyList
import { TaxonomyList } from "./taxonomy-list"

interface Point {
  x: number
  y: number
}

interface Transform {
  x: number
  y: number
  scale: number
  rotation: number
}

// Define velocity interface for inertia
interface Velocity {
  x: number
  y: number
  timestamp: number
}

export function RadialExplorer() {
  const {
    taxonomy,
    isLoading,
    selectedSpecies,
    handleSpeciesSelect: originalHandleSpeciesSelect,
  } = useTaxonomyExplorer()

  // State management
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1, rotation: 0 })
  const [showOverlay, setShowOverlay] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentStory, setCurrentStory] = useState(0)
  const [showStoryMode, setShowStoryMode] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [tourStep, setTourStep] = useState(1)
  const [captureMode, setCaptureMode] = useState(false)

  // Tambahkan state untuk mengelola visibilitas daftar taksonomi
  // Tambahkan state ini di bagian state management (sekitar baris 40-50):

  const [showTaxonomyList, setShowTaxonomyList] = useState(false)

  // Refs
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastMousePosRef = useRef<Point>({ x: 0, y: 0 })
  const isGrabbingRef = useRef(false)
  const animationRef = useRef<number | null>(null) // Untuk menyimpan referensi animasi

  // Add these new refs at the top of the component with the other refs
  const dragTransformRef = useRef({ x: 0, y: 0, scale: 1, rotation: 0 })
  const rafIdRef = useRef<number | null>(null)
  const diagramElementRef = useRef<HTMLElement | null>(null)
  const velocityRef = useRef<Velocity>({ x: 0, y: 0, timestamp: 0 })
  const velocityHistoryRef = useRef<Velocity[]>([])
  const inertiaAnimationRef = useRef<number | null>(null)

  // Tambahkan fungsi cubic bezier untuk easing yang lebih halus
  const cubicBezier = useCallback((x1: number, y1: number, x2: number, y2: number, t: number): number => {
    // Implementasi fungsi cubic bezier untuk easing yang lebih halus
    const cx = 3 * x1
    const bx = 3 * (x2 - x1) - cx
    const ax = 1 - cx - bx
    const cy = 3 * y1
    const by = 3 * (y2 - y1) - cy
    const ay = 1 - cy - by

    const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t
    const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t
    const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
    const solveX = (x: number) => {
      let t0 = 0
      let t1 = 1
      let t2 = x
      let x2: number

      // Use Newton-Raphson iteration to get better approximation
      for (let i = 0; i < 8; i++) {
        x2 = sampleCurveX(t2) - x
        if (Math.abs(x2) < 1e-6) return t2
        const d2 = sampleCurveDerivativeX(t2)
        if (Math.abs(d2) < 1e-6) break
        t2 = t2 - x2 / d2
      }

      // Fall back to bisection if Newton-Raphson fails
      while (t0 < t1) {
        x2 = sampleCurveX(t2)
        if (Math.abs(x2 - x) < 1e-6) return t2
        if (x > x2) t0 = t2
        else t1 = t2
        t2 = (t1 - t0) * 0.5 + t0
      }

      return t2 // Last resort
    }

    return sampleCurveY(solveX(t))
  }, [])

  // Prepare data for radial visualization
  const prepareRadialData = useCallback(() => {
    if (!taxonomy) return []

    const centerRadius = 80
    const genusLevelRadius = 400 // Further increased from 350 to 400
    const speciesLevelRadius = 800 // Further increased from 650 to 800
    const genusCount = taxonomy.children?.length || 0
    const genusAngleStep = (2 * Math.PI) / genusCount

    const nodes: any[] = [
      // Center node (Felidae family)
      {
        id: "felidae",
        name: "Felidae",
        scientific_name: "Felidae",
        x: 0,
        y: 0,
        radius: centerRadius,
        level: "family",
        color: "#0891b2", // cyan-600
        image_url: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9",
      },
    ]

    // Improved collision detection function with larger safety margin
    const detectCollision = (node1: any, node2: any) => {
      const dx = node1.x - node2.x
      const dy = node1.y - node2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const minDistance = node1.radius + node2.radius + 60 // Increased margin from 40px to 60px
      return distance < minDistance
    }

    // Enhanced position adjustment function with more aggressive repositioning
    const adjustPosition = (node: any, existingNodes: any[]) => {
      let attempts = 0
      const maxAttempts = 20 // Increased from 15 to 20 for more attempts

      while (attempts < maxAttempts) {
        let hasCollision = false

        for (const existingNode of existingNodes) {
          if (detectCollision(node, existingNode)) {
            hasCollision = true

            // Calculate vector from existing node to node being placed
            const dx = node.x - existingNode.x
            const dy = node.y - existingNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Normalize vector and add more distance to avoid overlap
            // Use a stronger push factor that increases with each attempt
            const pushFactor = (existingNode.radius + node.radius + 70 + attempts * 5) / distance
            node.x = existingNode.x + dx * pushFactor
            node.y = existingNode.y + dy * pushFactor

            break // Exit this loop to recheck all nodes
          }
        }

        if (!hasCollision) {
          return // No collisions found, position is good
        }

        attempts++
      }
    }

    // Add genus nodes with better distribution
    taxonomy.children?.forEach((genus: any, genusIndex: number) => {
      const angle = genusIndex * genusAngleStep
      const x = Math.cos(angle) * genusLevelRadius
      const y = Math.sin(angle) * genusLevelRadius

      const genusNode = {
        ...genus,
        x,
        y,
        radius: 60,
        level: "genus",
        color: "#4f46e5", // indigo-600
        angle,
      }

      nodes.push(genusNode)

      // Improved species distribution with adaptive spacing
      const speciesCount = genus.children?.length || 0

      // Dynamically adjust species radius based on genus size
      // Larger genera get placed further out
      const speciesRadius = speciesLevelRadius + speciesCount * 15

      // Adjust angle spread based on species count
      // More species = wider spread, but capped to avoid overlap with other genera
      const maxSpread = Math.min(genusAngleStep * 0.85, Math.PI / 3)
      const speciesAngleSpread = Math.min(maxSpread, Math.PI / 8 + speciesCount * 0.02)

      const speciesAngleStep = speciesCount > 1 ? speciesAngleSpread / (speciesCount - 1) : 0
      const speciesStartAngle = angle - speciesAngleSpread / 2

      // Collect all species nodes for this genus
      const speciesNodes: any[] = []

      genus.children?.forEach((species: any, speciesIndex: number) => {
        // Enhanced spiral pattern with more variation
        const spiralFactor = 1 + speciesIndex * 0.15
        const speciesAngle = speciesStartAngle + speciesIndex * speciesAngleStep

        // Add more variation to radius based on index to create a better spiral effect
        // Use modulo to create rings of species
        const ringIndex = Math.floor(speciesIndex / 5)
        const radiusOffset = (speciesIndex % 5) * 80 + ringIndex * 120

        const speciesX = Math.cos(speciesAngle) * (speciesRadius + radiusOffset) * spiralFactor
        const speciesY = Math.sin(speciesAngle) * (speciesRadius + radiusOffset) * spiralFactor

        const speciesNode = {
          ...species,
          x: speciesX,
          y: speciesY,
          radius: 40,
          level: "species",
          color: "#ea580c", // orange-600
          angle: speciesAngle,
          genusId: genus.id,
        }

        speciesNodes.push(speciesNode)
      })

      // Adjust positions to avoid overlaps with more aggressive collision avoidance
      for (let i = 0; i < speciesNodes.length; i++) {
        const existingNodes = [...nodes, ...speciesNodes.slice(0, i)]
        adjustPosition(speciesNodes[i], existingNodes)
      }

      // Add all species nodes to the main array
      nodes.push(...speciesNodes)
    })

    return nodes
  }, [taxonomy])

  const radialNodes = prepareRadialData()

  // Add zoom functions
  const handleZoomIn = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: prev.scale * 1.2 }))
  }, [])

  const handleZoomOut = useCallback(() => {
    setTransform((prev) => ({ ...prev, scale: prev.scale / 1.2 }))
  }, [])

  const handleReset = useCallback(() => {
    // Cancel any ongoing animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    if (inertiaAnimationRef.current) {
      cancelAnimationFrame(inertiaAnimationRef.current)
      inertiaAnimationRef.current = null
    }

    // Reset transform state
    setTransform({ x: 0, y: 0, scale: 1, rotation: 0 })

    // Also update the dragTransformRef to match
    dragTransformRef.current = { x: 0, y: 0, scale: 1, rotation: 0 }

    // Clear any selected species
    originalHandleSpeciesSelect(null)
  }, [originalHandleSpeciesSelect])

  const handleRotateLeft = useCallback(() => {
    setTransform((prev) => ({ ...prev, rotation: prev.rotation - 15 }))
  }, [])

  const handleRotateRight = useCallback(() => {
    setTransform((prev) => ({ ...prev, rotation: prev.rotation + 15 }))
  }, [])

  // Enhanced smooth animation function for node transitions
  const animateToNode = useCallback(
    (node: any, options: { duration?: number; showCard?: boolean; scale?: number } = {}) => {
      if (!containerRef.current) return

      // Default options
      const { duration = 2000, showCard = true, scale = 1.0 } = options

      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Cancel any inertia animation
      if (inertiaAnimationRef.current) {
        cancelAnimationFrame(inertiaAnimationRef.current)
        inertiaAnimationRef.current = null
      }

      // Set overlay to true to prevent interaction during animation
      setShowOverlay(true)

      // Calculate the target position to center the node
      const targetX = -node.x
      const targetY = -node.y

      // Store initial transform values
      const startX = transform.x
      const startY = transform.y
      const startScale = transform.scale
      const startRotation = transform.rotation

      // Get reference to the diagram container element for direct manipulation
      if (!diagramElementRef.current && svgRef.current) {
        diagramElementRef.current = svgRef.current.querySelector(".diagram-container") as HTMLElement
      }

      const startTime = performance.now()

      // Use requestAnimationFrame for smoother animation
      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Use a smoother easing function - custom spring-like easing
        const eased = cubicBezier(0.34, 1.56, 0.64, 1, progress)

        // Calculate current interpolated values
        const currentX = startX + (targetX - startX) * eased
        const currentY = startY + (targetY - startY) * eased
        const currentScale = startScale + (scale - startScale) * eased
        const currentRotation = startRotation * (1 - eased) // Smoothly reset rotation to 0

        // Update transform with interpolated values
        if (diagramElementRef.current) {
          // Directly manipulate DOM for smoother animation
          const containerWidth = containerRef.current?.clientWidth || 0
          const containerHeight = containerRef.current?.clientHeight || 0

          diagramElementRef.current.style.transform = `
            translate(${containerWidth / 2}px, ${containerHeight / 2}px) 
            translate(${currentX}px, ${currentY}px) 
            scale(${currentScale}) 
            rotate(${currentRotation}deg)
          `
        }

        // Continue animation if not complete
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Animation complete - update React state and show card if needed
          setTransform({
            x: targetX,
            y: targetY,
            scale: scale,
            rotation: 0,
          })

          // Wait a moment before showing the card
          setTimeout(() => {
            if (showCard) {
              originalHandleSpeciesSelect(node)
            }
            setShowOverlay(false)
            animationRef.current = null
          }, 100) // Short delay before showing the card
        }
      }

      // Start the animation
      animationRef.current = requestAnimationFrame(animate)
    },
    [originalHandleSpeciesSelect, transform, cubicBezier],
  )

  // Add this function to reset zoom and center on node - OPTIMIZED FOR SMOOTH NAVIGATION
  const resetAndCenterNode = useCallback(
    (node: any) => {
      // First clear any selected species
      originalHandleSpeciesSelect(null)

      // Use the enhanced animation function
      animateToNode(node, { duration: 2000, showCard: true, scale: 1.0 })
    },
    [originalHandleSpeciesSelect, animateToNode],
  )

  // Dalam komponen RadialExplorer, tambahkan fungsi untuk menangani pemilihan node dari daftar
  const handleListNodeSelect = useCallback(
    (nodeId: string) => {
      // Find the node in radialNodes
      const node = radialNodes.find((n) => n.id === nodeId)
      if (node) {
        // Reset and center on the node
        resetAndCenterNode(node)
      }
    },
    [radialNodes, resetAndCenterNode],
  )

  // Navigate to a node (for search functionality) - OPTIMIZED FOR INSTANT NAVIGATION
  const navigateToNode = useCallback(
    (node: any) => {
      if (!containerRef.current) return

      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Set overlay to true to prevent interaction during animation
      setShowOverlay(true)

      // Calculate the target transform
      const targetX = -node.x * transform.scale
      const targetY = -node.y * transform.scale

      // Store initial transform values
      const startX = transform.x
      const startY = transform.y
      const startScale = transform.scale
      const startRotation = transform.rotation

      // Adjust duration for smoother animation
      const duration = 1500 // Balanced duration for smooth transition
      const startTime = performance.now()

      // Use requestAnimationFrame for smoother animation
      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Use a smoother easing function
        const cubicBezier = (p1x: number, p1y: number, p2x: number, p2y: number, t: number) => {
          const cx = 3 * (p1x - 0)
          const bx = 3 * (p2x - p1x) - cx
          const ax = 1 - cx - bx
          const cy = 3 * (p1y - 0)
          const by = 3 * (p2y - p1y) - cy
          const ay = 1 - cy - by

          const solve = (x: number) => {
            let t = x
            for (let i = 0; i < 4; i++) {
              const currentX = ((ax * t + bx) * t + cx) * t
              if (Math.abs(x - currentX) < 0.0001) break
              const derivativeX = (3 * ax * t + 2 * bx) * t + cx
              if (derivativeX === 0) break
              t -= (currentX - x) / derivativeX
            }
            return t
          }

          const tt = solve(t)
          return ((ay * tt + by) * tt + cy) * tt
        }

        // Use a smoother easing function
        const eased = cubicBezier(0.16, 1, 0.3, 1, progress)

        // Update transform with interpolated values
        setTransform({
          x: startX + (targetX - startX) * eased,
          y: startY + (targetY - startY) * eased,
          scale: startScale, // Maintain the current scale
          rotation: startRotation, // Maintain the current rotation
        })

        // Continue animation if not complete
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          // Animation complete - wait a moment before showing the card
          setTimeout(() => {
            originalHandleSpeciesSelect(node)
            setShowOverlay(false)
            animationRef.current = null
          }, 300) // Add a small delay before showing the card
        }
      }

      // Start the animation
      animationRef.current = requestAnimationFrame(animate)
    },
    [originalHandleSpeciesSelect, transform],
  )

  // Perbaiki fungsi untuk menangani pencarian dengan navigasi instan
  const handleSearchResultNavigation = useCallback(
    (node: any) => {
      // First clear any selected species
      originalHandleSpeciesSelect(null)

      // Close search immediately for better UX
      setShowSearch(false)
      setSearchQuery("")

      // Always reset and center with 100% zoom when searching
      resetAndCenterNode(node)
    },
    [originalHandleSpeciesSelect, resetAndCenterNode],
  )

  // Search functionality
  const filteredNodes = searchQuery
    ? radialNodes.filter(
      (node) =>
        node.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : []

  // Fetch story content from database
  const { data: storyContentData, isLoading: isLoadingStoryContent } = useQuery({
    queryKey: ["story-content"],
    queryFn: async () => {
      // First try to get family info
      const { data: familyData, error: familyError } = await supabase
        .from("taksonomi_genus")
        .select("*")
        .eq("nama", "Felidae")
        .single()

      if (familyError && familyError.code !== "PGRST116") {
        console.error("Error fetching family data:", familyError)
      }

      // Get some representative genera
      const { data: generaData, error: generaError } = await supabase.from("taksonomi_genus").select("*").limit(3)

      if (generaError) {
        console.error("Error fetching genera data:", generaError)
      }

      // Get some interesting species - removed click_count ordering
      const { data: speciesData, error: speciesError } = await supabase
        .from("taksonomi_spesies")
        .select("*, taksonomi_deskripsi(*), taksonomi_konservasi(*)")
        .limit(5)

      if (speciesError) {
        console.error("Error fetching species data:", speciesError)
      }

      // Build story content
      const storyContent = []

      // Add family story
      storyContent.push({
        title: "Keluarga Felidae",
        description:
          familyData?.deskripsi ||
          "Felidae adalah keluarga mamalia karnivora yang mencakup kucing-kucing liar dan domestik. Keluarga ini merupakan salah satu kelompok karnivora paling sukses secara evolusi.",
        image: familyData?.url_gambar || "https://images.unsplash.com/photo-1589652717521-10c0d092dea9",
        focusNodeId: "felidae",
      })

      // Add genus stories
      if (generaData && generaData.length > 0) {
        generaData.forEach((genus) => {
          if (genus.nama !== "Felidae") {
            // Skip if it's the family again
            storyContent.push({
              title: `Genus ${genus.nama}`,
              description:
                genus.deskripsi ||
                `${genus.nama} adalah genus dalam keluarga Felidae yang mencakup beberapa spesies kucing dengan karakteristik serupa.`,
              image: genus.url_gambar || "/placeholder.svg?height=400&width=600&text=Genus",
              focusNodeId: genus.id,
            })
          }
        })
      }

      // Add species stories
      if (speciesData && speciesData.length > 0) {
        speciesData.forEach((species) => {
          // Get conservation status if available
          const conservationStatus = species.taksonomi_konservasi?.status_konservasi_alam || "Unknown"

          // Get population info if available
          const population = species.taksonomi_konservasi?.total_populasi || "Unknown"

          // Create rich description
          let description = species.deskripsi || ""
          if (conservationStatus !== "Unknown") {
            description += ` Status konservasi: ${conservationStatus}.`
          }
          if (population !== "Unknown") {
            description += ` Populasi: ${population}.`
          }

          storyContent.push({
            title: species.nama_umum || species.nama,
            description: description,
            image: species.url_gambar || "/placeholder.svg?height=400&width=600&text=Species",
            focusNodeId: species.id,
          })
        })
      }

      // Ensure we have at least some default content if database is empty
      if (storyContent.length < 2) {
        storyContent.push({
          title: "Harimau Sumatera",
          description:
            "Harimau Sumatera (Panthera tigris sumatrae) adalah subspesies harimau yang hanya ditemukan di Pulau Sumatera, Indonesia. Mereka terancam punah dengan populasi kurang dari 400 individu di alam liar.",
          image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5",
          focusNodeId: "panthera-tigris-sumatrae",
        })

        storyContent.push({
          title: "Kucing Domestik",
          description:
            "Kucing domestik (Felis catus) adalah salah satu hewan peliharaan paling populer di dunia. Meskipun telah didomestikasi, mereka masih mempertahankan banyak insting berburu dari leluhur liar mereka.",
          image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
          focusNodeId: "felis-catus",
        })
      }

      return storyContent
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  // Fetch interesting facts about Felidae
  const { data: interestingFacts, isLoading: isLoadingFacts } = useQuery({
    queryKey: ["interesting-facts"],
    queryFn: async () => {
      // Mengambil fakta menarik dari tabel taksonomi_deskripsi
      const { data: descriptionsData, error: descriptionsError } = await supabase
        .from("taksonomi_deskripsi")
        .select("*, taksonomi_spesies(nama, nama_umum)")
        .not("fitur_unik", "is", null)
        .limit(10)

      if (descriptionsError) {
        console.error("Error fetching descriptions:", descriptionsError)
      }

      // Mengambil fakta menarik dari tabel taksonomi_perilaku
      const { data: behaviorData, error: behaviorError } = await supabase
        .from("taksonomi_perilaku")
        .select("*, taksonomi_spesies(nama, nama_umum)")
        .limit(10)

      if (behaviorError) {
        console.error("Error fetching behavior data:", behaviorError)
      }

      // Mengambil fakta menarik dari tabel taksonomi_konservasi
      const { data: conservationData, error: conservationError } = await supabase
        .from("taksonomi_konservasi")
        .select("*, taksonomi_spesies(nama, nama_umum)")
        .limit(10)

      if (conservationError) {
        console.error("Error fetching conservation data:", conservationError)
      }

      // Kumpulkan semua fakta menarik
      const facts: { content: any; species: any; category: string }[] = []

      // Tambahkan fakta dari fitur unik
      if (descriptionsData) {
        descriptionsData.forEach((desc) => {
          if (desc.fitur_unik && Array.isArray(desc.fitur_unik)) {
            desc.fitur_unik.forEach((feature: any) => {
              facts.push({
                content: feature,
                species: desc.taksonomi_spesies?.nama_umum || desc.taksonomi_spesies?.nama || "Felidae",
                category: "Fitur Unik",
              })
            })
          }
        })
      }

      // Tambahkan fakta dari perilaku
      if (behaviorData) {
        behaviorData.forEach((behavior) => {
          if (behavior.perilaku_berburu) {
            facts.push({
              content: `${behavior.taksonomi_spesies?.nama_umum || behavior.taksonomi_spesies?.nama || "Felidae"} memiliki teknik berburu: ${behavior.perilaku_berburu}`,
              species: behavior.taksonomi_spesies?.nama_umum || behavior.taksonomi_spesies?.nama || "Felidae",
              category: "Perilaku Berburu",
            })
          }
          if (behavior.pola_aktivitas) {
            facts.push({
              content: `${behavior.taksonomi_spesies?.nama_umum || behavior.taksonomi_spesies?.nama || "Felidae"} aktif pada: ${behavior.pola_aktivitas}`,
              species: behavior.taksonomi_spesies?.nama_umum || behavior.taksonomi_spesies?.nama || "Felidae",
              category: "Pola Aktivitas",
            })
          }
        })
      }

      // Tambahkan fakta dari konservasi
      if (conservationData) {
        conservationData.forEach((conservation) => {
          if (conservation.status_konservasi_alam) {
            facts.push({
              content: `${conservation.taksonomi_spesies?.nama_umum || conservation.taksonomi_spesies?.nama || "Felidae"} memiliki status konservasi: ${conservation.status_konservasi_alam}`,
              species: conservation.taksonomi_spesies?.nama_umum || conservation.taksonomi_spesies?.nama || "Felidae",
              category: "Status Konservasi",
            })
          }
        })
      }

      // Acak urutan fakta
      return facts.sort(() => Math.random() - 0.5).slice(0, 10)
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  })

  // Use the dynamic story content or fallback to static content
  const storyContent = storyContentData || [
    {
      title: "Keluarga Felidae",
      description:
        "Felidae adalah keluarga mamalia karnivora yang mencakup kucing-kucing liar dan domestik. Keluarga ini merupakan salah satu kelompok karnivora paling sukses secara evolusi.",
      image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9",
      focusNodeId: "felidae",
    },
    {
      title: "Genus Panthera",
      description:
        "Panthera adalah genus yang mencakup kucing-kucing besar seperti singa, harimau, jaguar, dan macan tutul. Mereka memiliki kemampuan mengaum yang khas.",
      image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
      focusNodeId: "panthera",
    },
    {
      title: "Harimau Sumatera",
      description:
        "Harimau Sumatera (Panthera tigris sumatrae) adalah subspesies harimau yang hanya ditemukan di Pulau Sumatera, Indonesia. Mereka terancam punah dengan populasi kurang dari 400 individu di alam liar.",
      image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5",
      focusNodeId: "panthera-tigris-sumatrae",
    },
    {
      title: "Kucing Domestik",
      description:
        "Kucing domestik (Felis catus) adalah salah satu hewan peliharaan paling populer di dunia. Meskipun telah didomestikasi, mereka masih mempertahankan banyak insting berburu dari leluhur liar mereka.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      focusNodeId: "felis-catus",
    },
  ]

  // Handle story navigation
  const nextStory = useCallback(() => {
    if (currentStory < storyContent.length - 1) {
      setCurrentStory((prev) => prev + 1)

      // Focus on the relevant node
      const nodeId = storyContent[currentStory + 1].focusNodeId
      const node = radialNodes.find((n) => n.id === nodeId)
      if (node) {
        // First clear any selected species
        originalHandleSpeciesSelect(null)
        // Always reset zoom and center for story mode
        resetAndCenterNode(node)
      }
    } else {
      setShowStoryMode(false)
    }
  }, [currentStory, storyContent, radialNodes, resetAndCenterNode, originalHandleSpeciesSelect])

  const prevStory = useCallback(() => {
    if (currentStory > 0) {
      setCurrentStory((prev) => prev - 1)

      // Focus on the relevant node
      const nodeId = storyContent[currentStory - 1].focusNodeId
      const node = radialNodes.find((n) => n.id === nodeId)
      if (node) {
        // First clear any selected species
        originalHandleSpeciesSelect(null)
        // Always reset zoom and center for story mode
        resetAndCenterNode(node)
      }
    }
  }, [currentStory, storyContent, radialNodes, resetAndCenterNode, originalHandleSpeciesSelect])

  // Tour guide steps
  const tourSteps = [
    {
      title: "Visualisasi Radial",
      description:
        "Diagram ini menampilkan taksonomi Felidae dalam bentuk radial. Node pusat adalah keluarga Felidae, dikelilingi oleh genus, dan spesies di lingkaran terluar.",
      target: ".radial-diagram",
    },
    {
      title: "Navigasi Diagram",
      description: "Gunakan kontrol di kiri untuk zoom in/out dan rotasi. Klik dan tahan untuk menggeser diagram.",
      target: ".control-panel",
    },
    {
      title: "Mode Cerita",
      description:
        "Aktifkan mode cerita untuk menjelajahi taksonomi Felidae melalui narasi yang menarik dan informatif.",
      target: ".story-button",
    },
    {
      title: "Pencarian Spesies",
      description: "Gunakan fitur pencarian untuk menemukan spesies tertentu dengan cepat.",
      target: ".search-button",
    },
  ]

  // Handle tour navigation
  const nextTourStep = useCallback(() => {
    if (tourStep < tourSteps.length) {
      setTourStep((prev) => prev + 1)
    } else {
      setShowTour(false)
    }
  }, [tourStep, tourSteps.length])

  const prevTourStep = useCallback(() => {
    if (tourStep > 1) {
      setTourStep((prev) => prev - 1)
    }
  }, [tourStep])

  // Handle screenshot capture
  const captureScreenshot = useCallback(() => {
    if (!svgRef.current) return

    setCaptureMode(true)

    // Use setTimeout to ensure the UI updates before capture
    setTimeout(() => {
      if (!svgRef.current) {
        setCaptureMode(false)
        return
      }

      // Create a clone of the SVG for manipulation
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement

      // Set a white background
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      rect.setAttribute("width", "100%")
      rect.setAttribute("height", "100%")
      rect.setAttribute("fill", "white")
      svgClone.insertBefore(rect, svgClone.firstChild)

      // Convert SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(svgClone)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)

      // Create an image from the SVG
      const img = new Image()
      img.onload = () => {
        // Create a canvas to draw the image
        const canvas = document.createElement("canvas")
        canvas.width = svgRef.current?.clientWidth || 800
        canvas.height = svgRef.current?.clientHeight || 600

        // Draw the image on the canvas
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)

          // Convert canvas to PNG and trigger download
          const pngUrl = canvas.toDataURL("image/png")
          const downloadLink = document.createElement("a")
          downloadLink.href = pngUrl
          downloadLink.download = "felidae-taxonomy.png"
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)

          // Clean up
          URL.revokeObjectURL(url)
          setCaptureMode(false)
        }
      }
      img.src = url
    }, 100)
  }, [])

  // Tambahkan fakta menarik ke story mode
  // Modifikasi fungsi handleStoryModeActivation

  const handleStoryModeActivation = useCallback(() => {
    setShowStoryMode(true)
    setCurrentStory(0)

    // Clear any selected species first
    originalHandleSpeciesSelect(null)

    // Create a structured story flow with proper levels
    const structuredStoryContent = [
      // Start with Felidae family
      {
        title: "Keluarga Felidae",
        description:
          "Felidae adalah keluarga mamalia karnivora yang mencakup kucing-kucing liar dan domestik. Keluarga ini merupakan salah satu kelompok karnivora paling sukses secara evolusi, dengan berbagai spesies yang tersebar di seluruh dunia.",
        image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9",
        focusNodeId: "felidae",
        level: "family",
      },
    ]

    // Add genus stories
    const genusStories = [
      {
        title: "Genus Panthera",
        description:
          "Panthera adalah genus yang mencakup kucing-kucing besar seperti singa, harimau, jaguar, dan macan tutul. Mereka memiliki kemampuan mengaum yang khas berkat struktur tulang hyoid yang unik.",
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d",
        focusNodeId: "panthera",
        level: "genus",
      },
      {
        title: "Genus Felis",
        description:
          "Felis adalah genus kucing kecil yang mencakup kucing domestik dan beberapa spesies kucing liar kecil. Genus ini dikenal dengan kemampuan adaptasi yang luar biasa di berbagai habitat.",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
        focusNodeId: "felis",
        level: "genus",
      },
    ]

    // Add species stories
    const speciesStories = [
      {
        title: "Harimau Sumatera",
        description:
          "Harimau Sumatera (Panthera tigris sumatrae) adalah subspesies harimau yang hanya ditemukan di Pulau Sumatera, Indonesia. Mereka terancam punah dengan populasi kurang dari 400 individu di alam liar.",
        image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5",
        focusNodeId: "panthera-tigris-sumatrae",
        level: "species",
      },
      {
        title: "Kucing Domestik",
        description:
          "Kucing domestik (Felis catus) adalah salah satu hewan peliharaan paling populer di dunia. Meskipun telah didomestikasi, mereka masih mempertahankan banyak insting berburu dari leluhur liar mereka.",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
        focusNodeId: "felis-catus",
        level: "species",
      },
    ]

    // Combine all stories in logical order
    const combinedStories = [...structuredStoryContent, ...genusStories, ...speciesStories]

    // If there are interesting facts, add them at the end
    if (interestingFacts && interestingFacts.length > 0) {
      const factStory = {
        title: "Fakta Menarik Felidae",
        description: interestingFacts.map((fact) => `• ${fact.content}`).join("\n\n"),
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=2015&auto=format&fit=crop",
        focusNodeId: "felidae",
      }
      // @ts-ignore
      combinedStories.push(factStory)
    }

    // Replace the storyContent with our structured version if storyContent is an array
    if (Array.isArray(storyContent) && storyContent.length > 0) {
      storyContent.splice(0, storyContent.length, ...combinedStories)
    }

    // Focus on the first story node (Felidae) with a small delay for smoother transition
    setTimeout(() => {
      const node = radialNodes.find((n) => n && n.id === "felidae")
      if (node) {
        // Always reset zoom and center for story mode
        resetAndCenterNode(node)
      }
    }, 100)
  }, [resetAndCenterNode, originalHandleSpeciesSelect, radialNodes, storyContent, interestingFacts])

  // Perbaiki fungsi untuk menangani pencarian dengan transisi yang lebih halus
  const handleNodeSearchNavigation = useCallback(
    (node: any) => {
      // First clear any selected species
      originalHandleSpeciesSelect(null)

      // Close search immediately for better UX
      setShowSearch(false)
      setSearchQuery("")

      // Use enhanced smooth animation for search navigation
      animateToNode(node, { duration: 2200, showCard: true, scale: 1.0 })
    },
    [originalHandleSpeciesSelect, animateToNode],
  )

  // Add dragging functionality with direct DOM manipulation for maximum smoothness
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      // Cancel any inertia animation and update state immediately
      if (inertiaAnimationRef.current) {
        cancelAnimationFrame(inertiaAnimationRef.current)
        inertiaAnimationRef.current = null

        // Update React state with the last position from inertia
        setTransform(dragTransformRef.current)
      }

      // Store current transform values in ref for direct manipulation
      // Use the latest values (either from React state or from dragTransformRef)
      dragTransformRef.current = {
        x: dragTransformRef.current.x !== transform.x ? dragTransformRef.current.x : transform.x,
        y: dragTransformRef.current.y !== transform.y ? dragTransformRef.current.y : transform.y,
        scale: transform.scale,
        rotation: transform.rotation,
      }

      // Get reference to the diagram container element
      if (!diagramElementRef.current && svgRef.current) {
        diagramElementRef.current = svgRef.current.querySelector(".diagram-container") as HTMLElement
      }

      isGrabbingRef.current = true
      lastMousePosRef.current = { x: event.clientX, y: event.clientY }
      velocityRef.current = { x: 0, y: 0, timestamp: performance.now() }
      velocityHistoryRef.current = []

      // Change cursor
      if (svgRef.current) {
        svgRef.current.style.cursor = "grabbing"
      }

      // Prevent default to avoid text selection
      event.preventDefault()
    },
    [transform],
  )

  const applyInertia = useCallback(() => {
    if (!diagramElementRef.current) return

    // Calculate average velocity from history with more weight to recent samples
    let avgVelocityX = 0
    let avgVelocityY = 0
    let totalWeight = 0

    if (velocityHistoryRef.current.length > 0) {
      // Gunakan weighted average - sample terbaru memiliki bobot lebih tinggi
      velocityHistoryRef.current.forEach((v, index) => {
        const weight = index + 1 // Sample terbaru memiliki bobot lebih tinggi
        avgVelocityX += v.x * weight
        avgVelocityY += v.y * weight
        totalWeight += weight
      })

      avgVelocityX /= totalWeight
      avgVelocityY /= totalWeight
    }

    // Apply decay factor to make movement more natural
    const friction = 0.94 // Sedikit lebih halus
    let currentVelocityX = avgVelocityX
    let currentVelocityY = avgVelocityY
    let lastTimestamp = performance.now()

    // Don't apply inertia if velocity is too low
    if (Math.abs(currentVelocityX) < 0.5 && Math.abs(currentVelocityY) < 0.5) {
      // PENTING: Update React state dengan posisi terakhir
      setTransform(dragTransformRef.current)
      return
    }

    const containerWidth = containerRef.current?.clientWidth || 0
    const containerHeight = containerRef.current?.clientHeight || 0

    const inertiaStep = (timestamp: number) => {
      // Calculate time delta for frame-rate independent physics
      const deltaTime = timestamp - lastTimestamp
      lastTimestamp = timestamp

      // Normalize time delta to target 60fps
      const timeScale = deltaTime / 16.67

      // Apply friction with time scaling
      const scaledFriction = Math.pow(friction, timeScale)
      currentVelocityX *= scaledFriction
      currentVelocityY *= scaledFriction

      // Update position
      dragTransformRef.current.x += currentVelocityX
      dragTransformRef.current.y += currentVelocityY

      // Apply transform with hardware acceleration
      if (diagramElementRef.current) {
        diagramElementRef.current.style.transform = `
        translate3d(${containerWidth / 2}px, ${containerHeight / 2}px, 0) 
        translate3d(${dragTransformRef.current.x}px, ${dragTransformRef.current.y}px, 0) 
        scale(${dragTransformRef.current.scale}) 
        rotate(${dragTransformRef.current.rotation}deg)
      `
      }

      // Continue animation if velocity is still significant
      if (Math.abs(currentVelocityX) > 0.05 || Math.abs(currentVelocityY) > 0.05) {
        inertiaAnimationRef.current = requestAnimationFrame(inertiaStep)
      } else {
        // PENTING: Update React state dengan posisi terakhir
        setTransform(dragTransformRef.current)
        inertiaAnimationRef.current = null
      }
    }

    // Start inertia animation
    inertiaAnimationRef.current = requestAnimationFrame(inertiaStep)
  }, [])

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!isGrabbingRef.current || !diagramElementRef.current) return

    // Calculate delta
    const dx = event.clientX - lastMousePosRef.current.x
    const dy = event.clientY - lastMousePosRef.current.y
    const now = performance.now()
    const elapsed = now - velocityRef.current.timestamp

    // Update velocity tracking
    if (elapsed > 0) {
      const newVelocity = {
        x: (dx / elapsed) * 16.67, // Normalize to pixels per frame (assuming 60fps)
        y: (dy / elapsed) * 16.67,
        timestamp: now,
      }

      // Keep last 8 velocity samples for smoother inertia (increased from 5)
      velocityHistoryRef.current.push(newVelocity)
      if (velocityHistoryRef.current.length > 8) {
        velocityHistoryRef.current.shift()
      }

      velocityRef.current = newVelocity
    }

    // Update the transform ref (not state, for performance)
    dragTransformRef.current = {
      ...dragTransformRef.current,
      x: dragTransformRef.current.x + dx,
      y: dragTransformRef.current.y + dy,
    }

    // Directly apply transform to the DOM element for maximum smoothness
    // Use translate3d for hardware acceleration
    const containerWidth = containerRef.current?.clientWidth || 0
    const containerHeight = containerRef.current?.clientHeight || 0

    diagramElementRef.current.style.transform = `
    translate3d(${containerWidth / 2}px, ${containerHeight / 2}px, 0) 
    translate3d(${dragTransformRef.current.x}px, ${dragTransformRef.current.y}px, 0) 
    scale(${dragTransformRef.current.scale}) 
    rotate(${dragTransformRef.current.rotation}deg)
  `

    // Update last position
    lastMousePosRef.current = { x: event.clientX, y: event.clientY }

    // Prevent default to avoid text selection and other browser behaviors
    event.preventDefault()
  }, [])

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<SVGSVGElement>) => {
      if (event.touches.length === 1) {
        // Cancel any ongoing animation
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }

        // Cancel any inertia animation and update state immediately
        if (inertiaAnimationRef.current) {
          cancelAnimationFrame(inertiaAnimationRef.current)
          inertiaAnimationRef.current = null

          // PENTING: Update React state dengan posisi terakhir dari inertia
          setTransform(dragTransformRef.current)
        }

        // Store current transform values in ref for direct manipulation
        // Gunakan nilai terbaru (baik dari state React atau dari dragTransformRef)
        dragTransformRef.current = {
          x: dragTransformRef.current.x !== transform.x ? dragTransformRef.current.x : transform.x,
          y: dragTransformRef.current.y !== transform.y ? dragTransformRef.current.y : transform.y,
          scale: transform.scale,
          rotation: transform.rotation,
        }

        // Get reference to the diagram container element
        if (!diagramElementRef.current && svgRef.current) {
          diagramElementRef.current = svgRef.current.querySelector(".diagram-container") as HTMLElement
        }

        isGrabbingRef.current = true
        lastMousePosRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
        velocityRef.current = { x: 0, y: 0, timestamp: performance.now() }
        velocityHistoryRef.current = []

        // JANGAN GUNAKAN preventDefault() di sini untuk memungkinkan interaksi touchscreen
      }
    },
    [transform],
  )

  const handleTouchMove = useCallback((event: React.TouchEvent<SVGSVGElement>) => {
    if (!isGrabbingRef.current || !diagramElementRef.current || event.touches.length !== 1) return

    // Calculate delta
    const dx = event.touches[0].clientX - lastMousePosRef.current.x
    const dy = event.touches[0].clientY - lastMousePosRef.current.y
    const now = performance.now()
    const elapsed = now - velocityRef.current.timestamp

    // Update velocity tracking
    if (elapsed > 0) {
      const newVelocity = {
        x: (dx / elapsed) * 16.67, // Normalize to pixels per frame (assuming 60fps)
        y: (dy / elapsed) * 16.67,
        timestamp: now,
      }

      // Keep last 8 velocity samples for smoother inertia (increased from 5)
      velocityHistoryRef.current.push(newVelocity)
      if (velocityHistoryRef.current.length > 8) {
        velocityHistoryRef.current.shift()
      }

      velocityRef.current = newVelocity
    }

    // Update the transform ref (not state, for performance)
    dragTransformRef.current = {
      ...dragTransformRef.current,
      x: dragTransformRef.current.x + dx,
      y: dragTransformRef.current.y + dy,
    }

    // Directly apply transform to the DOM element for maximum smoothness
    // Use translate3d for hardware acceleration
    const containerWidth = containerRef.current?.clientWidth || 0
    const containerHeight = containerRef.current?.clientHeight || 0

    diagramElementRef.current.style.transform = `
      translate3d(${containerWidth / 2}px, ${containerHeight / 2}px, 0) 
      translate3d(${dragTransformRef.current.x}px, ${dragTransformRef.current.y}px, 0) 
      scale(${dragTransformRef.current.scale}) 
      rotate(${dragTransformRef.current.rotation}deg)
    `

    // Update last position
    lastMousePosRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }

    // Gunakan stopPropagation sebagai gantinya untuk mencegah scroll halaman
    // tapi tetap memungkinkan interaksi touch pada diagram
    event.stopPropagation()
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isGrabbingRef.current) return

    isGrabbingRef.current = false

    // Apply inertia effect
    applyInertia()
  }, [applyInertia])

  // Optimize the handleNodeClick function for immediate response
  const handleNodeClick = useCallback(
    (node: any) => {
      // First clear any selected species
      originalHandleSpeciesSelect(null)

      // Immediately select the node without animation
      if (node) {
        // Set transform directly without animation
        setTransform({
          x: -node.x,
          y: -node.y,
          scale: 1,
          rotation: 0,
        })

        // Update dragTransformRef to match the new position
        dragTransformRef.current = {
          x: -node.x,
          y: -node.y,
          scale: 1,
          rotation: 0,
        }

        // Show the species info immediately
        setTimeout(() => {
          originalHandleSpeciesSelect(node)
        }, 50) // Very short timeout just to ensure the transform is applied first
      }
    },
    [originalHandleSpeciesSelect],
  )

  const handleMouseUp = useCallback(() => {
    if (!isGrabbingRef.current) return

    isGrabbingRef.current = false

    // Apply inertia effect
    applyInertia()

    // Restore cursor
    if (svgRef.current) {
      svgRef.current.style.cursor = "default"
    }
  }, [applyInertia])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center p-8 max-w-md">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-teal-800 mb-2">Memuat Diagram Taksonomi</h3>
          <p className="text-neutral-600">Menyiapkan visualisasi interaktif keluarga Felidae...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="radial-explorer-container h-full relative bg-gradient-to-br from-teal-50 to-white overflow-hidden touch-pan-y mobile-touch-fix"
      style={{ touchAction: "manipulation" }}
    >
      {/* Intro overlay */}
      <AnimatePresence>{showIntro && <RadialIntro onClose={() => setShowIntro(false)} />}</AnimatePresence>

      {/* Control panel */}
      <RadialControls
        zoom={transform.scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onZoomChange={(values) => {
          setTransform((prev) => ({
            ...prev,
            scale: values[0],
          }))

          // Update dragTransformRef scale to match
          dragTransformRef.current.scale = values[0]
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={(query) => {
          // Find matching node
          const matchingNode = radialNodes.find(
            (node) =>
              node.name?.toLowerCase().includes(query.toLowerCase()) ||
              node.scientific_name?.toLowerCase().includes(query.toLowerCase()),
          )

          if (matchingNode) {
            // First clear any selected species
            originalHandleSpeciesSelect(null)

            // Reset and center on the node with smooth animation
            handleNodeSearchNavigation(matchingNode)

            // Update search query display
            setSearchQuery(matchingNode.name || matchingNode.scientific_name || query)
          }
        }}
      />

      {/* Action buttons */}
      <RadialActionButtons
        onSearchClick={() => setShowSearch(true)}
        onStoryClick={handleStoryModeActivation}
        onTourClick={() => setShowTour(true)}
        onCaptureClick={captureScreenshot}
        onTaxonomyListClick={() => setShowTaxonomyList(!showTaxonomyList)} // Tambahkan handler untuk toggle daftar
      />

      {/* Search panel */}
      <AnimatePresence>
        {showSearch && (
          <RadialSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredNodes={filteredNodes}
            radialNodes={radialNodes}
            onNodeSelect={handleNodeSearchNavigation}
            onClose={() => setShowSearch(false)}
          />
        )}
      </AnimatePresence>

      {/* Story mode panel */}
      <AnimatePresence>
        {showStoryMode && (
          <RadialStoryMode
            storyContent={storyContent}
            currentStory={currentStory}
            onNext={nextStory}
            onPrev={prevStory}
            onClose={() => setShowStoryMode(false)}
            isLoading={isLoadingStoryContent || isLoadingFacts}
          />
        )}
      </AnimatePresence>

      {/* Tour guide */}
      <AnimatePresence>
        {showTour && (
          <RadialTourGuide
            tourSteps={tourSteps}
            currentStep={tourStep}
            onNext={nextTourStep}
            onPrev={prevTourStep}
            onClose={() => setShowTour(false)}
          />
        )}
      </AnimatePresence>

      {/* Main SVG diagram */}
      <RadialDiagram
        ref={svgRef}
        radialNodes={radialNodes}
        selectedSpecies={selectedSpecies}
        transform={transform}
        containerWidth={containerRef.current?.clientWidth || 0}
        containerHeight={containerRef.current?.clientHeight || 0}
        showOverlay={showOverlay}
        onNodeClick={handleNodeClick}
        // @ts-ignore
        onMouseDown={handleMouseDown}
        // @ts-ignore
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        // @ts-ignore
        onMouseLeave={handleMouseUp}
        // @ts-ignore
        onTouchStart={handleTouchStart}
        // @ts-ignore
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      />

      {/* Species detail card */}
      <AnimatePresence>
        {selectedSpecies && !captureMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-14 inset-x-4 sm:inset-x-auto sm:right-4 sm:w-96 max-h-[calc(100vh-6rem)] overflow-y-auto z-30 custom-scrollbar"
          >
            <SpeciesCard data={selectedSpecies} onClose={() => originalHandleSpeciesSelect(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taxonomy List - Gunakan state untuk mengontrol visibilitas */}
      <TaxonomyList
        onSelectNode={handleListNodeSelect}
        isOpen={showTaxonomyList}
        onToggle={() => setShowTaxonomyList(!showTaxonomyList)}
      />
    </div>
  )
}
