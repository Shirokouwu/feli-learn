import React from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface ScannerLoadingOverlayProps {
  isVisible: boolean
  scanStage: string
  scanProgress: number
}

export const ScannerLoadingOverlay: React.FC<ScannerLoadingOverlayProps> = ({
  isVisible,
  scanStage,
  scanProgress
}) => {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6"
    >
      <div className="text-white text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto" />
        <p className="text-lg font-medium mb-2">{scanStage}</p>
        <Progress value={scanProgress} className="h-2 mb-2" />
        <p className="text-sm text-white/80">{scanProgress}% Selesai</p>
      </div>
    </motion.div>
  )
}
