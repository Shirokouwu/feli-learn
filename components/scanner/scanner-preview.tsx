import React from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface ScannerPreviewProps {
  previewImage: string
  isScanning: boolean
  scanStage: string
  scanProgress: number
}

export const ScannerPreview: React.FC<ScannerPreviewProps> = ({
  previewImage,
  isScanning,
  scanStage,
  scanProgress
}) => {
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <img
        src={previewImage || "/placeholder.svg"}
        alt="Preview"
        className="object-cover w-full h-full"
      />

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
