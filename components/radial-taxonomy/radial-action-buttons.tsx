"use client"

import { Button } from "@/components/ui/button"
import { Search, Sparkles, Info, Camera, List } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RadialActionButtonsProps {
  onSearchClick: () => void
  onStoryClick: () => void
  onTourClick: () => void
  onCaptureClick: () => void
  onTaxonomyListClick: () => void
}

export function RadialActionButtons({
  onSearchClick,
  onStoryClick,
  onTourClick,
  onCaptureClick,
  onTaxonomyListClick,
}: RadialActionButtonsProps) {
  // Make the action buttons more responsive for mobile and tablet
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 max-w-[calc(100%-100px)]">
      {/* Grup tombol pencarian dan daftar taksonomi */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onSearchClick}
          className="search-button bg-white/90 backdrop-blur-sm border-teal-100 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
        >
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Cari</span>
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onTaxonomyListClick}
                className="bg-white/90 backdrop-blur-sm border-teal-100 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
              >
                <List className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Daftar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Daftar Taksonomi</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onStoryClick}
        className="story-button bg-white/90 backdrop-blur-sm border-teal-100 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Sparkles className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Mode Cerita</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onTourClick}
        className="bg-white/90 backdrop-blur-sm border-teal-100 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Info className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Panduan</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onCaptureClick}
        className="bg-white/90 backdrop-blur-sm border-teal-100 text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300"
      >
        <Camera className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Tangkapan</span>
      </Button>
    </div>
  )
}
