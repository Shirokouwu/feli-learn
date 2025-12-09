"use client";

import { X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScannerActionButtonsProps {
  onReset: () => void
  isScanning: boolean
}

export const ScannerActionButtons: React.FC<ScannerActionButtonsProps> = ({
  onReset,
  isScanning
}) => {
  return !isScanning ? (
    <div className="flex gap-4">
      <Button
        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={onReset}
      >
        <X className="h-4 w-4 mr-2" />
        Coba Lagi
      </Button>
    </div>
  ) : null
}

