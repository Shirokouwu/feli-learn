"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, User } from "lucide-react"
import { useScanStats, useUserScanStats } from "@/hooks"

interface ScanCounterProps {
  className?: string
  showUserStats?: boolean
}

export function ScanCounter({ className = "", showUserStats = false }: ScanCounterProps) {
  // Fetch global and user data
  const { data: globalStats } = useScanStats()
  const { data: userStats } = useUserScanStats()

  // Alternating display state for global stats (total/today)
  const [showGlobalToday, setShowGlobalToday] = useState(false)

  // Animated counter values
  const [displayedGlobalTotal, setDisplayedGlobalTotal] = useState(0)
  const [displayedGlobalToday, setDisplayedGlobalToday] = useState(0)
  const [displayedUserTotal, setDisplayedUserTotal] = useState(0)

  // Alternate between total and today every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowGlobalToday(prev => !prev)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Animate global total counter
  useEffect(() => {
    if (!globalStats?.totalScans) return

    let current = 0
    const target = globalStats.totalScans
    const increment = Math.ceil(target / 50)

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayedGlobalTotal(target)
        clearInterval(timer)
      } else {
        setDisplayedGlobalTotal(current)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [globalStats?.totalScans])

  // Animate global today counter
  useEffect(() => {
    if (!globalStats?.todayScans) return

    let current = 0
    const target = globalStats.todayScans
    const increment = Math.ceil(target / 40)

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayedGlobalToday(target)
        clearInterval(timer)
      } else {
        setDisplayedGlobalToday(current)
      }
    }, 15)

    return () => clearInterval(timer)
  }, [globalStats?.todayScans])

  // Animate user total counter
  useEffect(() => {
    if (!userStats?.totalScans) return

    let current = 0
    const target = userStats.totalScans
    const increment = Math.ceil(target / 50)

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplayedUserTotal(target)
        clearInterval(timer)
      } else {
        setDisplayedUserTotal(current)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [userStats?.totalScans])

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Left: Global Stats (alternating total/today) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
      >
        <div className="p-1 bg-emerald-50 rounded-full">
          <Globe className="h-3 w-3 text-emerald-600" />
        </div>

        <AnimatePresence mode="wait">
          {showGlobalToday ? (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <span className="text-base font-bold text-emerald-700 leading-tight">
                +{displayedGlobalToday.toLocaleString()}
              </span>
              <span className="text-[9px] text-emerald-600 font-medium uppercase tracking-wide">hari ini</span>
            </motion.div>
          ) : (
            <motion.div
              key="total"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <span className="text-base font-bold text-emerald-700 leading-tight">
                {displayedGlobalTotal.toLocaleString()}
              </span>
              <span className="text-[9px] text-emerald-600 font-medium uppercase tracking-wide">total global</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right: User Stats (only show if enabled and has data) */}
      {showUserStats && userStats && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="flex flex-col text-right">
            <span className="text-base font-bold text-blue-700 leading-tight">
              {displayedUserTotal.toLocaleString()}
            </span>
            <span className="text-[9px] text-blue-600 font-medium uppercase tracking-wide">scan saya</span>
          </div>

          <div className="p-1 bg-blue-50 rounded-full">
            <User className="h-3 w-3 text-blue-600" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
