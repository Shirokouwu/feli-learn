"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Search, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add utility to detect mobile devices
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window) ||
    (window.innerWidth <= 768)
}


interface RadialControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onRotateLeft: () => void
  onRotateRight: () => void
  onReset: () => void
  onZoomChange: (value: number[]) => void
  sensitivity?: number
  onSensitivityChange?: (value: number[]) => void
  searchQuery?: string
  onSearchChange?: (value: string) => void
  onSearch?: (query: string) => void
  isHovered?: boolean
}

export function RadialControls({
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onReset,
  onZoomChange,
  sensitivity = 1.0,
  onSensitivityChange = () => {},
  searchQuery = "",
  onSearchChange = () => {},
  onSearch = () => {},
  isHovered = false,
}: RadialControlsProps) {
  // Calculate zoom percentage for display
  const zoomPercentage = Math.round((zoom || 1) * 100)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  // Check if device is mobile on mount
  useEffect(() => {
    setIsMobileDevice(isMobile())
  }, [])

  // Update local search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // On mobile, always show controls. On desktop, show when hovered
  const shouldShowControls = isMobileDevice || isHovered

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value)
    onSearchChange(e.target.value)
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(localSearchQuery)
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: shouldShowControls ? 1 : 0,
          y: shouldShowControls ? 0 : 20,
          pointerEvents: shouldShowControls ? "auto" : "none"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-2 sm:p-3 shadow-lg border border-teal-100/50 z-10 rounded-lg"
      >
        {/* Mobile gesture hint */}
        {isMobileDevice && shouldShowControls && (
          <div className="mb-2 text-xs text-teal-600 text-center font-medium">
            Geser: Pan • Cubit: Zoom di Titik Tengah
          </div>
        )}

        {/* Desktop gesture hint */}
        {!isMobileDevice && shouldShowControls && (
          <div className="mb-2 text-xs text-teal-600 text-center font-medium">
            Drag: Pan • Ctrl+Scroll: Zoom ke Cursor
          </div>
        )}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white rounded-full border border-teal-200 p-0.5 sm:p-1 w-full justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onZoomOut}
                >
                  <ZoomOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Perkecil</p>
              </TooltipContent>
            </Tooltip>

            <div className="text-xs font-medium text-teal-700 px-0.5 sm:px-1 min-w-[32px] sm:min-w-[40px] text-center flex-1">{zoomPercentage}%</div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onZoomIn}
                >
                  <ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Perbesar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Rotation Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white rounded-full border border-teal-200 p-0.5 sm:p-1 justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onRotateLeft}
                >
                  <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Putar Kiri</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onReset}
                >
                  <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Reset Posisi</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onRotateRight}
                >
                  <RotateCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Putar Kanan</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

      </motion.div>
    </TooltipProvider>
  )
}
