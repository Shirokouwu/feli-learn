"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ScanCounterProps {
  className?: string
}

export function ScanCounter({ className = "" }: ScanCounterProps) {
  // Hardcoded data for now - would be fetched from API in production
  const [stats, setStats] = useState({
    totalScans: 12487,
    todayScans: 143,
    weeklyGrowth: 12.4, // percentage
    uniqueUsers: 5231,
  })

  // Simulate counter animation on load
  const [displayedTotal, setDisplayedTotal] = useState(0)
  const [displayedToday, setDisplayedToday] = useState(0)

  useEffect(() => {
    // Animate total count
    const totalDuration = 1500 // ms
    const totalInterval = 30 // ms
    const totalIncrement = Math.ceil(stats.totalScans / (totalDuration / totalInterval))

    const totalTimer = setInterval(() => {
      setDisplayedTotal((prev) => {
        const next = prev + totalIncrement
        if (next >= stats.totalScans) {
          clearInterval(totalTimer)
          return stats.totalScans
        }
        return next
      })
    }, totalInterval)

    // Animate today count
    const todayDuration = 1000 // ms
    const todayInterval = 20 // ms
    const todayIncrement = Math.ceil(stats.todayScans / (todayDuration / todayInterval))

    const todayTimer = setInterval(() => {
      setDisplayedToday((prev) => {
        const next = prev + todayIncrement
        if (next >= stats.todayScans) {
          clearInterval(todayTimer)
          return stats.todayScans
        }
        return next
      })
    }, todayInterval)

    return () => {
      clearInterval(totalTimer)
      clearInterval(todayTimer)
    }
  }, [stats.totalScans, stats.todayScans])

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
        <Badge variant="outline" className="text-xs bg-white text-emerald-700 px-1.5 py-0">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1"></span>
          Live
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-800">{displayedTotal.toLocaleString()}</span>
          <span className="text-xs text-emerald-600 font-medium">total scans</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-emerald-700">+{displayedToday}</span>
            <span className="text-xs text-emerald-600 ml-1">hari ini</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
