"use client"

import type React from "react"

import { memo, forwardRef, useState, useEffect, useRef } from "react"
import { RadialNode } from "./radial-node"
import { Badge } from "@/components/ui/badge"
import { getConservationStatusHexColor } from "@/lib/conservation-utils"

interface RadialDiagramProps {
  radialNodes: any[]
  selectedSpecies: any
  transform: {
    x: number
    y: number
    scale: number
    rotation: number
  }
  containerWidth: number
  containerHeight: number
  showOverlay: boolean
  onNodeClick: (node: any) => void
  onMouseDown: (event: React.MouseEvent) => void
  onMouseMove: (event: React.MouseEvent) => void
  onMouseUp: (event: React.MouseEvent) => void
  onMouseLeave: (event: React.MouseEvent) => void
  onWheel?: (event: React.WheelEvent) => void
  onTouchStart: (event: React.TouchEvent) => void
  onTouchMove: (event: React.TouchEvent) => void
  onTouchEnd: (event: React.TouchEvent) => void
}

export const RadialDiagram = memo(
  forwardRef<SVGSVGElement, RadialDiagramProps>(function RadialDiagram(
    {
      radialNodes,
      selectedSpecies,
      transform,
      containerWidth,
      containerHeight,
      showOverlay,
      onNodeClick,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      onWheel,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    ref,
  ) {
    // State for zoom percentage display
    const [zoomPercentage, setZoomPercentage] = useState(Math.round(transform.scale * 100))

    // Update zoom percentage when transform changes
    useEffect(() => {
      setZoomPercentage(Math.round(transform.scale * 100))
    }, [transform.scale])

    // Ref to track if the diagram is being dragged
    const isGrabbingRef = useRef(false)

    // Modifikasi fungsi calculateExtendedLine untuk garis penghubung yang lebih baik
    const calculateExtendedLine = (parent: any, node: any, extensionFactor = 1.0) => {
      if (!parent || !node) return { x1: 0, y1: 0, x2: 0, y2: 0 }

      // Calculate direction vector
      const dx = node.x - parent.x
      const dy = node.y - parent.y

      // Calculate distance
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Normalize direction vector
      const nx = dx / distance
      const ny = dy / distance

      // Calculate extended start and end points
      // For family to genus connections, extend the line by moving the start point back
      if (node.level === "genus") {
        // Move start point back by parent radius + 8px for more pronounced connection
        const extendedStartX = parent.x + nx * (parent.radius + 8)
        const extendedStartY = parent.y + ny * (parent.radius + 8)

        // Move end point back by node radius + 8px
        const extendedEndX = node.x - nx * (node.radius + 8)
        const extendedEndY = node.y - ny * (node.radius + 8)

        return {
          x1: extendedStartX,
          y1: extendedStartY,
          x2: extendedEndX,
          y2: extendedEndY,
        }
      }

      // For genus to species connections, use similar approach but with different margins
      // Move start point forward by parent radius + 2px
      const extendedStartX = parent.x + nx * (parent.radius + 2)
      const extendedStartY = parent.y + ny * (parent.radius + 2)

      // Move end point back by node radius + 2px
      const extendedEndX = node.x - nx * (node.radius + 2)
      const extendedEndY = node.y - ny * (node.radius + 2)

      return {
        x1: extendedStartX,
        y1: extendedStartY,
        x2: extendedEndX,
        y2: extendedEndY,
      }
    }

    // Add this helper function after the getConservationStatusHexColor function:
    const getConservationFilterId = (status: string | undefined) => {
      if (!status) return "electricGlow"

      const statusLower = status.toLowerCase()

      if (statusLower.includes("extinct") || statusLower.includes("punah")) {
        return "extinctGlow"
      } else if (
        statusLower.includes("critically") ||
        statusLower.includes("kritis") ||
        statusLower.includes("sangat terancam")
      ) {
        return "criticallyEndangeredGlow"
      } else if (statusLower.includes("endangered") || statusLower.includes("terancam")) {
        return "endangeredGlow"
      } else if (statusLower.includes("vulnerable") || statusLower.includes("rentan")) {
        return "vulnerableGlow"
      } else if (statusLower.includes("near") || statusLower.includes("hampir")) {
        return "nearThreatenedGlow"
      } else if (statusLower.includes("least") || statusLower.includes("rendah") || statusLower.includes("lc")) {
        return "leastConcernGlow"
      } else if (statusLower.includes("data") || statusLower.includes("kurang")) {
        return "dataDeficientGlow"
      } else if (statusLower.includes("not") || statusLower.includes("tidak")) {
        return "dataDeficientGlow"
      } else {
        return "electricGlow"
      }
    }

    return (
      <div className="relative w-full h-full">
        {/* Zoom percentage indicator - keep in top right */}
        <Badge className="absolute top-4 right-4 z-10 bg-white/95 text-teal-700 border border-teal-200 shadow-sm hidden sm:flex items-center gap-1.5 px-3 py-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-teal-500"
          >
            <path
              d="M15.5 14H14.71L14.43 13.73C15.63 12.33 16.25 10.42 15.91 8.39C15.44 5.61 13.12 3.39 10.32 3.05C6.09 2.53 2.53 6.09 3.05 10.32C3.39 13.12 5.61 15.44 8.39 15.91C10.42 16.25 12.33 15.63 13.73 14.43L14 14.71V15.5L19 20.5L20.5 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-medium">{zoomPercentage}%</span>
        </Badge>

        {/* Add a visual indicator when dragging */}
        {isGrabbingRef.current && (
          <div className="absolute inset-0 pointer-events-none border-2 border-teal-400 rounded-lg z-20 opacity-50"></div>
        )}

        <svg
          ref={ref}
          className="radial-diagram w-full h-full"
          style={{
            touchAction: "none", // Prevent default touch behaviors to allow custom touch handling
            cursor: "grab",
            userSelect: "none", // Mencegah seleksi teks
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            // Hapus properties yang bisa menyebabkan blur
            // backfaceVisibility: "hidden", 
            // WebkitBackfaceVisibility: "hidden",
            // transformStyle: "preserve-3d",
            // WebkitTransformStyle: "preserve-3d",
            shapeRendering: "geometricPrecision", // Untuk rendering SVG yang lebih tajam
            textRendering: "geometricPrecision", // Untuk teks yang lebih tajam
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onDragStart={(e) => e.preventDefault()} // Mencegah drag default
          onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
          aria-label="Diagram taksonomi radial Felidae"
          // @ts-ignore
          onTouchStart={onTouchStart}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradient definitions */}
            <linearGradient id="familyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>

            <linearGradient id="genusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <linearGradient id="speciesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>

            {/* Species text background gradient */}
            <linearGradient id="speciesTextBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.9" />
            </linearGradient>

            {/* Pattern for nodes without images */}
            <pattern id="familyPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#0891b2" />
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#22d3ee" strokeWidth="1" />
            </pattern>

            <pattern id="genusPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#4f46e5" />
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#818cf8" strokeWidth="1" />
            </pattern>

            <pattern id="speciesPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#f97316" />
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="#fdba74" strokeWidth="1" />
            </pattern>

            {/* Clip paths for each node */}
            {radialNodes &&
              radialNodes.map((node) =>
                node && node.id ? (
                  <clipPath id={`clip-${node.id}`} key={`clip-${node.id}`}>
                    <circle r={node.radius || 40} />
                  </clipPath>
                ) : null,
              )}

            {/* Electric glow effect filter */}
            <filter id="electricGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feFlood floodColor="#22d3ee" floodOpacity="0.7" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Stronger electric glow for genus lines */}
            <filter id="strongElectricGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#4f46e5" floodOpacity="0.8" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glassmorphism blur filter for species background */}
            <filter id="glassBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feFlood floodColor="white" floodOpacity="0.2" result="highlight" />
              <feComposite in="highlight" in2="blur" operator="over" result="glassEffect" />
            </filter>

            {/* Lightning animation */}
            <pattern id="lightning" patternUnits="userSpaceOnUse" width="60" height="10" patternTransform="rotate(0)">
              <animateTransform
                attributeName="patternTransform"
                type="rotate"
                from="0"
                to="360"
                dur="10s"
                repeatCount="indefinite"
              />
              <path
                d="M0,5 L15,5 L20,0 L25,10 L30,0 L35,10 L40,0 L45,5 L60,5"
                stroke="#a5f3fc"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="3,3"
                strokeLinecap="round"
              >
                <animate attributeName="stroke" values="#a5f3fc;#22d3ee;#a5f3fc" dur="3s" repeatCount="indefinite" />
              </path>
            </pattern>

            {/* Conservation status glow filters */}
            <filter id="extinctGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#000000" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="criticallyEndangeredGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#dc2626" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="endangeredGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="vulnerableGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#f97316" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="nearThreatenedGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#eab308" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="leastConcernGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#22c55e" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="dataDeficientGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#9ca3af" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid */}
          <g className="grid-lines" opacity="0.1">
            {[...Array(10)].map((_, i) => (
              <circle
                key={`grid-${i}`}
                cx="0"
                cy="0"
                r={(i + 1) * 100}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="1"
                strokeDasharray="5,5"
                className="transition-all duration-500"
              />
            ))}

            {[...Array(12)].map((_, i) => {
              const angle = (i * Math.PI) / 6
              const x1 = Math.cos(angle) * 1000
              const y1 = Math.sin(angle) * 1000
              const x2 = Math.cos(angle) * -1000
              const y2 = Math.sin(angle) * -1000

              return (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#14b8a6"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  className="transition-all duration-500"
                />
              )
            })}
          </g>

          {/* Main diagram container */}
          <g
            className="diagram-container"
            style={{
              transform: `translate(${containerWidth / 2 + transform.x}px, ${containerHeight / 2 + transform.y}px) 
    scale(${transform.scale}) 
    rotate(${transform.rotation}deg)`,
              transformOrigin: "0 0",
              transition: showOverlay
                ? "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
              pointerEvents: showOverlay ? "none" : "all",
              // Hapus properties yang bisa menyebabkan blur
              // backfaceVisibility: "hidden",
              // WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Connection lines */}
            {radialNodes &&
              radialNodes.map((node) => {
                if (!node || node.level === "family") return null

                // Connect to parent
                const parentId = node.level === "genus" ? "felidae" : node.genusId
                const parent = radialNodes.find((n) => n && n.id === parentId)

                if (!parent) return null

                // Calculate extended line coordinates
                const lineCoords = calculateExtendedLine(parent, node)

                // Check if this line is part of the selected species path
                const isSelectedPath =
                  selectedSpecies &&
                  // Direct connection to selected species
                  (node.id === selectedSpecies.id ||
                    // Connection from family to genus of selected species only
                    (node.level === "genus" && selectedSpecies && selectedSpecies.genusId === node.id))

                // Determine line styling based on node level and selection state
                const lineColor = node.level === "genus" ? "#818cf8" : "#fdba74"
                const lineWidth = node.level === "genus" ? 3 : 1.5
                const lineOpacity = node.level === "genus" ? 0.7 : 0.8
                // Get conservation status color for species
                const conservationColor =
                  node.level === "species" && node.conservation_status
                    ? getConservationStatusHexColor(node.conservation_status)
                    : node.level === "genus"
                      ? "#818cf8"
                      : "#fdba74"

                // Apply electric effect for selected paths
                const electricEffect = isSelectedPath
                  ? {
                    stroke:
                      node.level === "genus"
                        ? "url(#lightning)"
                        : node.level === "species" && node.conservation_status
                          ? conservationColor
                          : "#a5f3fc",
                    filter:
                      node.level === "genus"
                        ? "url(#strongElectricGlow)"
                        : node.level === "species" && node.conservation_status
                          ? `url(#${getConservationFilterId(node.conservation_status)})`
                          : "url(#electricGlow)",
                    strokeWidth: node.level === "genus" ? 4 : 3,
                    strokeOpacity: 0.9,
                    strokeDasharray: node.level === "genus" ? "5,3" : "2,3",
                    strokeDashoffset: "0",
                    strokeLinecap: "round",
                  }
                  : {
                    stroke: lineColor,
                    strokeWidth: lineWidth,
                    strokeOpacity: lineOpacity,
                    strokeDasharray: node.level === "genus" ? "" : "2,1",
                  }

                // Add animation for electric effect
                const animationProps = isSelectedPath
                  ? {
                    children: (
                      <animate attributeName="strokeDashoffset" from="30" to="0" dur="2s" repeatCount="indefinite" />
                    ),
                  }
                  : {}

                return (
                  // @ts-ignore
                  <line
                    key={`line-${node.id}`}
                    x1={lineCoords.x1}
                    y1={lineCoords.y1}
                    x2={lineCoords.x2}
                    y2={lineCoords.y2}
                    {...electricEffect}
                    className={`transition-all duration-300 ${isSelectedPath ? "electric-path" : ""}`}
                    {...animationProps}
                  />
                )
              })}

            {/* Nodes */}
            {radialNodes &&
              radialNodes.map((node) =>
                node ? (
                  <RadialNode
                    key={node.id || `node-${Math.random()}`}
                    node={node}
                    isSelected={
                      selectedSpecies?.id === node.id ||
                      (node.level === "genus" && selectedSpecies && selectedSpecies.genusId === node.id)
                    }
                    onClick={(n) => {
                      // Ensure the click is tracked and handled properly
                      onNodeClick(n)
                    }}
                  />
                ) : null,
              )}
          </g>
        </svg>
      </div>
    )
  }),
)

RadialDiagram.displayName = "RadialDiagram"
