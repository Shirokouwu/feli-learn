"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle } from "lucide-react"

export function HelpNotification() {
  const [isVisible, setIsVisible] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Hide after 10 seconds
  useEffect(() => {
    if (isVisible && !hasInteracted) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, hasInteracted])

  // Check if user has seen this before
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem("hasSeenRadialHelp")
    if (hasSeenHelp) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setHasInteracted(true)
    localStorage.setItem("hasSeenRadialHelp", "true")
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-20 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg border border-teal-200 shadow-lg p-3 max-w-xs"
      >
        <div className="flex items-start gap-3">
          <div className="bg-teal-100 p-2 rounded-full">
            <HelpCircle className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h4 className="font-medium text-teal-800 mb-1">Butuh bantuan?</h4>
            <p className="text-sm text-slate-600 mb-2">
              Klik tombol bantuan di pojok kanan bawah untuk melihat panduan diagram.
            </p>
            <button onClick={handleDismiss} className="text-xs text-teal-600 hover:text-teal-800 font-medium">
              Mengerti
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
