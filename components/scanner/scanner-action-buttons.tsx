"use client";

import { X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScannerActionButtonsProps {
  onReset: () => void
  onRescan: () => void
  isScanning: boolean
}

export const ScannerActionButtons: React.FC<ScannerActionButtonsProps> = ({
  onReset,
  onRescan,
  isScanning
}) => {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        className="flex-1 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-300"
        onClick={onReset}
      >
        <X className="h-4 w-4 mr-2" />
        Coba Lagi
      </Button>
      <Button
        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        onClick={onRescan}
        disabled={isScanning}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
        Scan Ulang
      </Button>
    </div>
  )
}
