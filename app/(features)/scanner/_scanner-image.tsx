"use client"

import type React from "react"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { useScannerLogic } from "@/hooks/use-scanner-logic"


import { ScannerHeader } from "@/components/scanner/scanner-header"
import { ScannerUploadArea } from "@/components/scanner/scanner-upload-area"
import { ScannerPreview } from "@/components/scanner/scanner-preview"
import { ScannerResultDisplay } from "@/components/scanner/scanner-result-display"
import { ScannerActionButtons } from "@/components/scanner/scanner-action-buttons"
import { ScannerConfetti } from "@/components/scanner/scanner-confetti"
import { ScanHistory } from "@/components/scanner/scan-history"
import { ScanCounter } from "@/components/scanner/scan-counter"
import { AboutAiScanner } from "@/components/scanner/about-ai-scanner"
import ScanStatusApi from "@/components/scanner/scan-check-api"

export default function ScannerImage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local state for UI interactions
  const [showTips, setShowTips] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)

  // Scanner logic hook
  const scanner = useScannerLogic()

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset URL input when switching tabs
    if (value !== "url") {
      scanner.setImageUrl("")
    }
  }

  // Handle clearing history
  const handleClearHistory = () => {
    toast("Riwayat scan telah dihapus")
  }

  // Handle file drop
  const handleFileDrop = (files: FileList) => {
    const file = files[0]
    if (file && fileInputRef.current) {
      // Set the file to the file input and trigger change event
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInputRef.current.files = dt.files

      // Trigger the existing upload handler
      const syntheticEvent = {
        target: fileInputRef.current
      } as unknown as React.ChangeEvent<HTMLInputElement>

      scanner.handleFileUpload(syntheticEvent)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/50">
      {/* Scanner Header */}
      <ScannerHeader
        isLoggedIn={isLoggedIn}
        onToggleLogin={setIsLoggedIn}
        onShowHistory={() => setShowHistory(true)}
      />

      {/* Confetti effect */}
      <ScannerConfetti isVisible={scanner.showConfetti} />

      <div className="container mx-auto px-4 py-8">
        {/* API Status */}
        <ScanStatusApi
          apiChecking={scanner.apiChecking}
          apiReady={scanner.apiReady}
          response={scanner.apiResponse}
        />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            <div className="p-4 md:p-6">
              {!scanner.previewImage ? (
                <div className="space-y-6">
                  <ScanCounter className="mb-4 pb-4 border-b border-emerald-50" />

                  {/* Upload Area */}
                  <ScannerUploadArea
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    imageUrl={scanner.imageUrl}
                    onImageUrlChange={scanner.setImageUrl}
                    onUrlSubmit={scanner.handleUrlSubmit}
                    onFileInputClick={() => fileInputRef.current?.click()}
                    onFileDrop={handleFileDrop}
                    apiReady={scanner.apiReady}
                    showTips={showTips}
                    onToggleTips={() => setShowTips(!showTips)}
                  />

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={scanner.handleFileUpload}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Preview with loading overlay */}
                  <ScannerPreview
                    previewImage={scanner.previewImage}
                    isScanning={scanner.isScanning}
                    scanStage={scanner.scanStage}
                    scanProgress={scanner.scanProgress}
                    onResetScan={scanner.resetScan}
                  />

                  {/* Results */}
                  <ScannerResultDisplay
                    scanResult={scanner.scanResult}
                    enhancedSpeciesData={scanner.enhancedSpeciesData}
                    scanDuration={scanner.scanDuration}
                  />

                  {/* Action buttons */}
                  <ScannerActionButtons
                    onReset={scanner.resetScan}
                    isScanning={scanner.isScanning}
                  />
                </div>
              )}
            </div>
          </div>

          {/* About AI Scanner */}
          <AboutAiScanner />
        </div>
      </div>

      {/* Scan History Component */}
      <ScanHistory
        isOpen={showHistory && isLoggedIn}
        onOpenChange={setShowHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  )
}
