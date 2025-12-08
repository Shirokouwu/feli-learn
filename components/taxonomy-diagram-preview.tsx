"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ZoomIn } from "lucide-react"

type TaxonomyNode = {
  id: string
  label: string
  level: "family" | "genus" | "species"
  parent?: string
  angle?: number
  description?: string
}

const taxonomyData: TaxonomyNode[] = [
  // Family (center)
  { id: "Felidae", label: "Felidae", level: "family", description: "Keluarga kucing" },
  // Genus (middle ring)
  { id: "Panthera", label: "Panthera", level: "genus", parent: "Felidae", description: "Kucing besar" },
  { id: "Felis", label: "Felis", level: "genus", parent: "Felidae", description: "Kucing kecil" },
  { id: "Puma", label: "Puma", level: "genus", parent: "Felidae", description: "Puma & Cougar" },
  { id: "Acinonyx", label: "Acinonyx", level: "genus", parent: "Felidae", description: "Cheetah" },
  { id: "Neofelis", label: "Neofelis", level: "genus", parent: "Felidae", description: "Macan dahan" },
  { id: "Lynx", label: "Lynx", level: "genus", parent: "Felidae", description: "Kucing liar" },
  // Species (outer ring)
  { id: "P.leo", label: "P. leo", level: "species", parent: "Panthera", description: "Singa" },
  { id: "P.tigris", label: "P. tigris", level: "species", parent: "Panthera", description: "Harimau" },
  { id: "P.pardus", label: "P. pardus", level: "species", parent: "Panthera", description: "Macan tutul" },
  { id: "P.onca", label: "P. onca", level: "species", parent: "Panthera", description: "Jaguar" },
  { id: "F.catus", label: "F. catus", level: "species", parent: "Felis", description: "Kucing rumah" },
  { id: "F.silvestris", label: "F. silvestris", level: "species", parent: "Felis", description: "Kucing hutan" },
  { id: "P.concolor", label: "P. concolor", level: "species", parent: "Puma", description: "Puma" },
  { id: "A.jubatus", label: "A. jubatus", level: "species", parent: "Acinonyx", description: "Cheetah" },
  { id: "N.nebulosa", label: "N. nebulosa", level: "species", parent: "Neofelis", description: "Macan dahan" },
  { id: "L.lynx", label: "L. lynx", level: "species", parent: "Lynx", description: "Lynx Eurasia" },
]

export function TaxonomyDiagramPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeNode, setActiveNode] = useState<TaxonomyNode | null>(taxonomyData[0])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const centerX = 200
  const centerY = 200
  const familyRadius = 45
  const genusRadius = 100
  const speciesRadius = 160

  // Get genera and species
  const genera = taxonomyData.filter((n) => n.level === "genus")
  const species = taxonomyData.filter((n) => n.level === "species")

  // Calculate positions for genera (evenly distributed)
  const getGenusPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2
    return {
      x: centerX + genusRadius * Math.cos(angle),
      y: centerY + genusRadius * Math.sin(angle),
      angle,
    }
  }

  // Calculate positions for species (grouped by parent genus)
  const getSpeciesPositions = () => {
    const positions: { [key: string]: { x: number; y: number; angle: number } } = {}

    genera.forEach((genus, genusIndex) => {
      const genusAngle = (genusIndex * 2 * Math.PI) / genera.length - Math.PI / 2
      const childSpecies = species.filter((s) => s.parent === genus.id)

      childSpecies.forEach((sp, spIndex) => {
        // Spread species around their parent genus
        const spreadAngle = 0.3 // How much species spread from parent
        const offsetAngle =
          childSpecies.length > 1
            ? ((spIndex - (childSpecies.length - 1) / 2) * spreadAngle) / (childSpecies.length - 1 || 1)
            : 0
        const angle = genusAngle + offsetAngle

        positions[sp.id] = {
          x: centerX + speciesRadius * Math.cos(angle),
          y: centerY + speciesRadius * Math.sin(angle),
          angle,
        }
      })
    })

    return positions
  }

  const speciesPositions = getSpeciesPositions()

  // Check if node is related to active/hovered node
  const isRelated = (nodeId: string) => {
    if (!activeNode) return false
    if (activeNode.id === nodeId) return true
    if (activeNode.parent === nodeId) return true
    const node = taxonomyData.find((n) => n.id === nodeId)
    if (node?.parent === activeNode.id) return true
    // Check if same parent
    if (node?.parent && activeNode.parent && node.parent === activeNode.parent) return true
    return false
  }

  const getLevelColor = (level: string, isActive: boolean, isHovered: boolean) => {
    if (isActive) return "fill-primary stroke-primary"
    if (isHovered) return "fill-primary/30 stroke-primary"
    switch (level) {
      case "family":
        return "fill-amber-500/20 stroke-amber-500"
      case "genus":
        return "fill-emerald-500/20 stroke-emerald-500"
      case "species":
        return "fill-sky-500/20 stroke-sky-500"
      default:
        return "fill-secondary stroke-border"
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "family":
        return "Family"
      case "genus":
        return "Genus"
      case "species":
        return "Species"
      default:
        return ""
    }
  }

  return (
    <section ref={ref} className="py-24 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Visualisasi Interaktif
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Diagram Taksonomi Radial
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Klik pada node untuk melihat detail. Struktur radial: Family di pusat, Genus di ring tengah, Species di ring
            luar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500" />
              <span className="text-sm text-muted-foreground">Family</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500" />
              <span className="text-sm text-muted-foreground">Genus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-sky-500/20 border-2 border-sky-500" />
              <span className="text-sm text-muted-foreground">Species</span>
            </div>
          </div>

          <div className="aspect-square max-w-2xl mx-auto rounded-2xl bg-background border border-border overflow-hidden p-4">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              {/* Background rings */}
              <circle
                cx={centerX}
                cy={centerY}
                r={speciesRadius + 20}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.05"
                strokeWidth="1"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={genusRadius}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={speciesRadius}
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Connection lines from Family to Genus */}
              {genera.map((genus, index) => {
                const pos = getGenusPosition(index, genera.length)
                const isActive = activeNode?.id === genus.id || activeNode?.id === "Felidae"
                return (
                  <motion.line
                    key={`line-family-${genus.id}`}
                    x1={centerX}
                    y1={centerY}
                    x2={pos.x}
                    y2={pos.y}
                    stroke="currentColor"
                    strokeOpacity={isActive ? 0.4 : 0.1}
                    strokeWidth={isActive ? 2 : 1}
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                  />
                )
              })}

              {/* Connection lines from Genus to Species */}
              {species.map((sp) => {
                const parentGenus = genera.find((g) => g.id === sp.parent)
                if (!parentGenus) return null
                const genusIndex = genera.indexOf(parentGenus)
                const genusPos = getGenusPosition(genusIndex, genera.length)
                const spPos = speciesPositions[sp.id]
                if (!spPos) return null

                const isActive = activeNode?.id === sp.id || activeNode?.id === sp.parent
                return (
                  <motion.line
                    key={`line-genus-${sp.id}`}
                    x1={genusPos.x}
                    y1={genusPos.y}
                    x2={spPos.x}
                    y2={spPos.y}
                    stroke="currentColor"
                    strokeOpacity={isActive ? 0.4 : 0.1}
                    strokeWidth={isActive ? 2 : 1}
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                )
              })}

              {/* Species nodes (outer ring) */}
              {species.map((sp, index) => {
                const pos = speciesPositions[sp.id]
                if (!pos) return null
                const isActive = activeNode?.id === sp.id
                const isHovered = hoveredNode === sp.id
                const isNodeRelated = isRelated(sp.id)

                return (
                  <motion.g
                    key={sp.id}
                    className="cursor-pointer"
                    onClick={() => setActiveNode(sp)}
                    onMouseEnter={() => setHoveredNode(sp.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: isNodeRelated || !activeNode ? 1 : 0.4, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.03 }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 22 : isHovered ? 20 : 18}
                      className={`transition-all duration-300 ${getLevelColor(sp.level, isActive, isHovered)}`}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[8px] font-medium transition-colors duration-300 ${
                        isActive ? "fill-primary-foreground" : "fill-foreground"
                      }`}
                      style={{ pointerEvents: "none" }}
                    >
                      {sp.label}
                    </text>
                  </motion.g>
                )
              })}

              {/* Genus nodes (middle ring) */}
              {genera.map((genus, index) => {
                const pos = getGenusPosition(index, genera.length)
                const isActive = activeNode?.id === genus.id
                const isHovered = hoveredNode === genus.id
                const isNodeRelated = isRelated(genus.id)

                return (
                  <motion.g
                    key={genus.id}
                    className="cursor-pointer"
                    onClick={() => setActiveNode(genus)}
                    onMouseEnter={() => setHoveredNode(genus.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: isNodeRelated || !activeNode ? 1 : 0.5, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 28 : isHovered ? 26 : 24}
                      className={`transition-all duration-300 ${getLevelColor(genus.level, isActive, isHovered)}`}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[10px] font-semibold transition-colors duration-300 ${
                        isActive ? "fill-primary-foreground" : "fill-foreground"
                      }`}
                      style={{ pointerEvents: "none" }}
                    >
                      {genus.label}
                    </text>
                  </motion.g>
                )
              })}

              {/* Family node (center) */}
              <motion.g
                className="cursor-pointer"
                onClick={() => setActiveNode(taxonomyData[0])}
                onMouseEnter={() => setHoveredNode("Felidae")}
                onMouseLeave={() => setHoveredNode(null)}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={
                    activeNode?.id === "Felidae"
                      ? familyRadius + 5
                      : hoveredNode === "Felidae"
                        ? familyRadius + 3
                        : familyRadius
                  }
                  className={`transition-all duration-300 ${getLevelColor(
                    "family",
                    activeNode?.id === "Felidae",
                    hoveredNode === "Felidae",
                  )}`}
                  strokeWidth="3"
                />
                <text
                  x={centerX}
                  y={centerY - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[14px] font-bold transition-colors duration-300 ${
                    activeNode?.id === "Felidae" ? "fill-primary-foreground" : "fill-foreground"
                  }`}
                  style={{ pointerEvents: "none" }}
                >
                  Felidae
                </text>
                <text
                  x={centerX}
                  y={centerY + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[9px] transition-colors duration-300 ${
                    activeNode?.id === "Felidae" ? "fill-primary-foreground/70" : "fill-muted-foreground"
                  }`}
                  style={{ pointerEvents: "none" }}
                >
                  (Family)
                </text>
              </motion.g>
            </svg>
          </div>

          {/* Info panel */}
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 rounded-xl bg-card border border-border max-w-md mx-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        activeNode.level === "family"
                          ? "bg-amber-500/20 text-amber-600"
                          : activeNode.level === "genus"
                            ? "bg-emerald-500/20 text-emerald-600"
                            : "bg-sky-500/20 text-sky-600"
                      }`}
                    >
                      {getLevelLabel(activeNode.level)}
                    </span>
                  </div>
                  <p className="text-xl font-serif font-bold text-foreground italic">{activeNode.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{activeNode.description}</p>
                  {activeNode.parent && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Parent: <span className="font-medium text-foreground">{activeNode.parent}</span>
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent shrink-0">
                  <ZoomIn size={16} />
                  Detail
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            Buka Diagram Lengkap
            <ChevronRight size={18} />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
