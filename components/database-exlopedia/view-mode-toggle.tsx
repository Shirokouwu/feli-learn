"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Grid2X2, Table2, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewModeToggleProps {
  viewMode: "grid" | "table" | "visualizations"
  setViewMode: (mode: "grid" | "table" | "visualizations") => void
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-9 w-9 p-0",
                viewMode === "grid"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-gray-200 hover:bg-emerald-50 hover:text-emerald-600",
              )}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tampilan Grid</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={cn(
                "h-9 w-9 p-0",
                viewMode === "table"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-gray-200 hover:bg-emerald-50 hover:text-emerald-600",
              )}
            >
              <Table2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tampilan Tabel</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "visualizations" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("visualizations")}
              className={cn(
                "h-9 w-9 p-0",
                viewMode === "visualizations"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-gray-200 hover:bg-emerald-50 hover:text-emerald-600",
              )}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tampilan Statistik</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
