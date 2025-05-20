"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Search, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

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
}: RadialControlsProps) {
  // Calculate zoom percentage for display
  const zoomPercentage = Math.round((zoom || 1) * 100)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [isExpanded, setIsExpanded] = useState(false)

  // Update local search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

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
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="control-panel fixed sm:absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-teal-100/50 z-10"
      >
        {/* Search Input */}
        <motion.form
          className={`relative overflow-hidden transition-all duration-300 ease-in-out mb-3 ${isExpanded ? "w-64" : "w-0"}`}
          onSubmit={handleSearchSubmit}
        >
          <Input
            type="text"
            placeholder="Cari spesies..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="h-9 pl-3 pr-8 rounded-full border-teal-200 focus:border-teal-400 focus:ring-teal-400"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full"
          >
            <Search className="h-4 w-4 text-teal-600" />
          </Button>
        </motion.form>

        <div className="flex flex-col gap-2">
          {/* Top row controls */}
          <div className="flex items-center justify-between gap-2">
            {/* Search Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white hover:bg-teal-50 border-teal-200 text-teal-700"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Cari Spesies</p>
              </TooltipContent>
            </Tooltip>

            {/* Reset Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onReset}
                  className="h-9 w-9 rounded-full bg-white hover:bg-teal-50 border-teal-200 text-teal-700"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Reset Tampilan</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white rounded-full border border-teal-200 p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onZoomOut}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Perkecil</p>
              </TooltipContent>
            </Tooltip>

            <div className="text-xs font-medium text-teal-700 px-1 min-w-[40px] text-center">{zoomPercentage}%</div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onZoomIn}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Perbesar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Rotation Controls */}
          <div className="flex items-center gap-1 bg-white rounded-full border border-teal-200 p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onRotateLeft}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
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
                  className="h-7 w-7 rounded-full hover:bg-teal-50 text-teal-700"
                  onClick={onRotateRight}
                >
                  <RotateCw className="h-3.5 w-3.5" />
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
