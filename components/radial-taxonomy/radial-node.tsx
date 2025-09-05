"use client"

import type React from "react"

import { memo } from "react"
import { getConservationStatusHexColor } from "@/lib/conservation-utils"

interface RadialNodeProps {
  node: any
  isSelected: boolean
  onClick: (node: any) => void
}

export const RadialNode = memo(function RadialNode({ node, isSelected, onClick }: RadialNodeProps) {
  // Add null check
  if (!node || !node.level) {
    return null
  }

  const gradientId =
    node.level === "family"
      ? "url(#familyGradient)"
      : node.level === "genus"
        ? "url(#genusGradient)"
        : "url(#speciesGradient)"

  const patternId =
    node.level === "family"
      ? "url(#familyPattern)"
      : node.level === "genus"
        ? "url(#genusPattern)"
        : "url(#speciesPattern)"

  // Determine if this is the Felidae node
  const isFelidae = node.id === "felidae"

  // Tambahkan handler untuk memastikan onClick dipanggil dan tracking klik
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling

    // Track click in database (non-blocking, don't wait for response)
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

    // Call the onClick handler immediately without waiting for tracking
    onClick(node)
  }

  // Determine if this is a species node
  const isSpecies = node.level === "species"

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-500 ${isFelidae ? "felidae-node" : ""} ${isSelected ? "node-selected" : ""
        } node-transition`}
    >
      {/* Special pulsing effect for Felidae node */}
      {isFelidae && !isSelected && (
        <circle
          r={node.radius + 15}
          fill="none"
          stroke="#0891b2"
          strokeWidth="1"
          strokeOpacity="0.3"
          className="animate-pulse"
        />
      )}

      {/* Highlight effect for selected node with improved animation */}
      {isSelected && (
        <>
          <circle
            r={node.radius + 10}
            fill="none"
            stroke={
              node.level === "species" && node.conservation_status
                ? getConservationStatusHexColor(node.conservation_status)
                : node.level === "family"
                  ? "#22d3ee"
                  : node.level === "genus"
                    ? "#818cf8"
                    : "#fb923c"
            }
            strokeWidth="3"
            strokeOpacity="0.8"
            filter={
              node.level === "family"
                ? "url(#electricGlow)"
                : node.level === "genus"
                  ? "url(#strongElectricGlow)"
                  : "url(#glow)"
            }
            className="node-transition"
          >
            <animate
              attributeName="r"
              values={`${node.radius + 10};${node.radius + 15};${node.radius + 10}`}
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate attributeName="stroke-opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Add a second pulsing circle for more dramatic effect */}
          <circle
            r={node.radius + 5}
            fill="none"
            stroke={
              node.level === "species" && node.conservation_status
                ? getConservationStatusHexColor(node.conservation_status)
                : node.level === "family"
                  ? "#22d3ee"
                  : node.level === "genus"
                    ? "#818cf8"
                    : "#fb923c"
            }
            strokeWidth="2"
            strokeOpacity="0.6"
            strokeDasharray="3,3"
            className="node-transition"
          >
            <animate
              attributeName="r"
              values={`${node.radius + 5};${node.radius + 8};${node.radius + 5}`}
              dur="2s"
              repeatCount="indefinite"
            />
            <animate attributeName="stroke-dasharray" values="3,3;5,5;3,3" dur="3s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Main node circle with improved transition */}
      <circle
        r={node.level === "species" ? node.radius * 1.05 : node.radius}
        fill={node.image_url ? "white" : patternId}
        stroke={node.level === "family" ? "#0891b2" : node.level === "genus" ? "#4f46e5" : "#ea580c"}
        strokeWidth={isSelected ? 4 : 2}
        className="transition-all duration-500"
      />

      {/* Node image with improved transition - Removed filter effects for better clarity */}
      {node.image_url && (
        <image
          href={node.image_url}
          x={node.level === "species" ? -node.radius * 1.05 : -node.radius}
          y={node.level === "species" ? -node.radius * 1.05 : -node.radius}
          width={node.level === "species" ? node.radius * 2.1 : node.radius * 2}
          height={node.level === "species" ? node.radius * 2.1 : node.radius * 2}
          clipPath={`url(#clip-${node.id})`}
          preserveAspectRatio="xMidYMid slice"
          className="transition-all duration-700"
          style={{
            filter: isSelected ? "contrast(1.1) brightness(1.1)" : "none",
            transform: isSelected ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            imageRendering: "auto", // Changed from crisp-edges to auto for better quality
          }}
        />
      )}

      {/* Enhanced label for Felidae node with improved transition */}
      {isFelidae ? (
        <>
          <text
            dy={node.radius + 20}
            textAnchor="middle"
            className="text-base font-bold fill-teal-900 transition-all duration-500"
            style={{
              textShadow: isSelected ? "0 0 3px rgba(255,255,255,0.8)" : "none",
              opacity: isSelected ? 1 : 0.9,
              transform: isSelected ? "translateY(0)" : "translateY(0)",
              transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {node.name}
          </text>
          <text
            dy={node.radius + 40}
            textAnchor="middle"
            className="text-xs italic fill-teal-600 transition-all duration-500"
            style={{
              textShadow: isSelected ? "0 0 3px rgba(255,255,255,0.8)" : "none",
              opacity: isSelected ? 1 : 0.9,
              transform: isSelected ? "translateY(0)" : "translateY(0)",
              transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Felidae (Keluarga Kucing)
          </text>
          <text
            dy={node.radius + 60}
            textAnchor="middle"
            className="text-xs fill-teal-500 transition-all duration-500"
            style={{
              textShadow: isSelected ? "0 0 3px rgba(255,255,255,0.8)" : "none",
              opacity: isSelected ? 1 : 0.9,
              transform: isSelected ? "translateY(0)" : "translateY(0)",
              transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            41 spesies • 14 genus
          </text>
        </>
      ) : (
        <>
          {/* Glassmorphism background for better text readability on species nodes */}
          {isSpecies && (
            <g>
              {/* Glass background with blur effect */}
              <rect
                x={-node.radius * 1.5}
                y={node.radius * 1.05 + 5}
                width={node.radius * 3}
                height={node.scientific_name && node.scientific_name !== node.name ? 45 : 30}
                fill="rgba(255, 255, 255, 0.25)"
                rx="8"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1"
                className="transition-all duration-500"
                style={{
                  backdropFilter: "blur(10px)",
                  filter: isSelected
                    ? "drop-shadow(0 8px 32px rgba(31, 38, 135, 0.15)) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.1))"
                    : "drop-shadow(0 4px 16px rgba(31, 38, 135, 0.1)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.05))",
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)",
                }}
              />
              {/* Inner glass highlight */}
              <rect
                x={-node.radius * 1.5 + 1}
                y={node.radius * 1.05 + 6}
                width={node.radius * 3 - 2}
                height="1"
                fill="rgba(255, 255, 255, 0.4)"
                rx="0.5"
                className="transition-all duration-500"
              />
              {/* Side glass highlight */}
              <rect
                x={-node.radius * 1.5 + 1}
                y={node.radius * 1.05 + 6}
                width="1"
                height={(node.scientific_name && node.scientific_name !== node.name ? 45 : 30) - 2}
                fill="rgba(255, 255, 255, 0.3)"
                rx="0.5"
                className="transition-all duration-500"
              />
            </g>
          )}

          {/* Standard node label with improved transition */}
          <text
            dy={node.radius + (isSpecies ? 25 : 20)}
            textAnchor="middle"
            className={`${isSpecies ? "text-sm" : "text-sm"} font-medium transition-all duration-500 node-label`}
            fill={isSpecies ? "#0f172a" : "#334155"}
            style={{
              fontWeight: isSelected ? "bold" : "medium",
              textShadow: isSpecies
                ? isSelected
                  ? "0 2px 4px rgba(0,0,0,0.25), 0 0 8px rgba(255,255,255,0.8)"
                  : "0 1px 2px rgba(0,0,0,0.2), 0 0 4px rgba(255,255,255,0.6)"
                : isSelected
                  ? "0 0 3px rgba(255,255,255,0.8)"
                  : "none",
              opacity: isSelected ? 1 : 0.95,
              transform: isSelected ? "translateY(0)" : "translateY(0)",
              transition:
                "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), font-weight 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {node.name}
          </text>

          {/* Scientific name with improved transition */}
          {node.scientific_name && node.scientific_name !== node.name && (
            <text
              dy={node.radius + (isSpecies ? 45 : 40)}
              textAnchor="middle"
              className={`${isSpecies ? "text-xs" : "text-xs"} italic transition-all duration-500 node-scientific`}
              fill={isSpecies ? "#334155" : "#64748b"}
              style={{
                textShadow: isSpecies
                  ? isSelected
                    ? "0 1px 3px rgba(0,0,0,0.2), 0 0 6px rgba(255,255,255,0.7)"
                    : "0 1px 2px rgba(0,0,0,0.15), 0 0 3px rgba(255,255,255,0.5)"
                  : isSelected
                    ? "0 0 3px rgba(255,255,255,0.8)"
                    : "none",
                opacity: isSelected ? 1 : 0.9,
                transform: isSelected ? "translateY(0)" : "translateY(0)",
                transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {node.scientific_name}
            </text>
          )}
        </>
      )}

      {/* Level badge with improved transition */}
      {node.level && (
        <g
          transform={`translate(0, ${-node.radius - 15})`}
          onClick={handleClick}
          className="transition-all duration-500"
          style={{
            transform: isSelected ? `translate(0, ${-node.radius - 18}px)` : `translate(0, ${-node.radius - 15}px)`,
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <rect
            x={node.level === "genus" ? "-25" : "-30"}
            y="-10"
            width={node.level === "genus" ? "50" : "60"}
            height="20"
            rx="10"
            fill={
              node.level === "species" && node.conservation_status
                ? getConservationStatusHexColor(node.conservation_status)
                : node.level === "family"
                  ? "#0891b2"
                  : node.level === "genus"
                    ? "#4f46e5"
                    : "#ea580c"
            }
            className="transition-all duration-500"
            filter={isSelected ? "url(#glow)" : "none"}
            style={{
              opacity: isSelected ? 1 : 0.9,
              transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-white transition-all duration-500"
            style={{
              opacity: isSelected ? 1 : 0.9,
              transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {node.level === "family" ? "Felidae" : node.level === "genus" ? "Genus" : "Spesies"}
          </text>
        </g>
      )}
    </g>
  )
})
