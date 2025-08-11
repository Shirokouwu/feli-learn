"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useScanStats } from "@/hooks"

interface ScanCounterProps {
  className?: string
}

export function ScanCounter({ className = "" }: ScanCounterProps) {
  // Fetch real data from Redis using TanStack Query
  const { data: stats, isLoading, isError, refetch } = useScanStats()

  // Fallback data while loading or on error
  const fallbackStats = {
    totalScans: 0,
    todayScans: 0,
  }

  const currentStats = stats || fallbackStats

  // Simulate counter animation on load
  const [displayedTotal, setDisplayedTotal] = useState(0)
  const [displayedToday, setDisplayedToday] = useState(0)

  useEffect(() => {
    // Only animate when we have data and it's not loading
    if (!currentStats || isLoading) return

    // Reset counters when new data comes in
    setDisplayedTotal(0)
    setDisplayedToday(0)

    // Animate total count
    const totalDuration = 1500 // ms
    const totalInterval = 30 // ms
    const totalIncrement = Math.ceil(currentStats.totalScans / (totalDuration / totalInterval))

    const totalTimer = setInterval(() => {
      setDisplayedTotal((prev) => {
        const next = prev + totalIncrement
        if (next >= currentStats.totalScans) {
          clearInterval(totalTimer)
          return currentStats.totalScans
        }
        return next
      })
    }, totalInterval)

    // Animate today count
    const todayDuration = 1000 // ms
    const todayInterval = 20 // ms
    const todayIncrement = Math.ceil(currentStats.todayScans / (todayDuration / todayInterval))

    const todayTimer = setInterval(() => {
      setDisplayedToday((prev) => {
        const next = prev + todayIncrement
        if (next >= currentStats.todayScans) {
          clearInterval(todayTimer)
          return currentStats.todayScans
        }
        return next
      })
    }, todayInterval)

    return () => {
      clearInterval(totalTimer)
      clearInterval(todayTimer)
    }
  }, [currentStats.totalScans, currentStats.todayScans, isLoading])

  const handleRefresh = () => {
    refetch()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-800">Statistik Scanner</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <RefreshCw className="h-3 w-3 text-emerald-600 animate-spin" />
          )}
          <Badge
            variant="outline"
            className={`text-xs bg-white px-1.5 py-0 cursor-pointer transition-colors ${isError
                ? 'text-red-700 hover:bg-red-50'
                : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            onClick={isError ? handleRefresh : undefined}
            title={isError ? 'Click to retry' : undefined}
          >
            <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1  animate-ping  ${isError ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}></span>
            {isError ? 'Error' : isLoading ? 'Loading' : 'Live'}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          {isLoading && !stats ? (
            <div className="flex items-baseline gap-1.5">
              <div className="h-8 w-20 bg-emerald-100 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-emerald-100 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <span className="text-2xl font-bold text-emerald-800">{displayedTotal.toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-medium">total scans</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isLoading && !stats ? (
            <div className="flex items-baseline gap-1.5">
              <div className="h-6 w-8 bg-emerald-100 rounded animate-pulse"></div>
              <div className="h-3 w-12 bg-emerald-100 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-emerald-700">+{displayedToday}</span>
              <span className="text-xs text-emerald-600 ml-1">hari ini</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
