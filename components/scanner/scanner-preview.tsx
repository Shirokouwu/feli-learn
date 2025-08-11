import React from "react"
import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface ScannerPreviewProps {
  previewImage: string
  isScanning: boolean
  scanStage: string
  scanProgress: number
  onResetScan?: () => void
}

export const ScannerPreview: React.FC<ScannerPreviewProps> = ({
  previewImage,
  isScanning,
  scanStage,
  scanProgress,
  onResetScan
}) => {
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <img
        src={previewImage || "/placeholder.svg"}
        alt="Preview"
        className="object-cover w-full h-full"
      />

      {/* Reset Button - Floating */}
      {previewImage && onResetScan && !isScanning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-3 right-3 z-10"
        >
          <Button
            onClick={onResetScan}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-0 rounded-full w-10 h-10 p-0 transition-all duration-200 hover:scale-105"
            title="Reset Scan"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {isScanning && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6">
          <div className="text-white text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto" />
            <p className="text-lg font-medium mb-2">{scanStage}</p>
            <Progress value={scanProgress} className="h-2 mb-2" />
            <p className="text-sm text-white/80">{scanProgress}% Selesai</p>
          </div>
        </div>
      )}
    </div>
  )
}
