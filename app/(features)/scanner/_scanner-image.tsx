"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { useScannerLogic } from "@/hooks/use-scanner-logic"
import { useGuestScanLimit } from "@/hooks/use-guest-scan-limit"
import { getUserClient } from "@/lib/auth-client"

import { ScannerUploadArea } from "@/components/scanner/scanner-upload-area"
import { ScannerPreview } from "@/components/scanner/scanner-preview"
import { ScannerResultDisplay } from "@/components/scanner/scanner-result-display"
import { ScannerActionButtons } from "@/components/scanner/scanner-action-buttons"
import { ScannerConfetti } from "@/components/scanner/scanner-confetti"
import { ScanHistory } from "@/components/scanner/scan-history"
import { RecentScans } from "@/components/scanner/recent-scans"
import { ScanCounter } from "@/components/scanner/scan-counter"
import { AboutAiScanner } from "@/components/scanner/about-ai-scanner"
import { LoginPromptModal } from "@/components/scanner/login-prompt-modal"
import { GuestScanBanner } from "@/components/scanner/guest-scan-banner"
import ScanStatusApi from "@/components/scanner/scan-check-api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function ScannerImage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auth state
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Local state for UI interactions
  const [showTips, setShowTips] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false)

  // Scanner logic hook
  const scanner = useScannerLogic()

  // Guest scan limit hook
  const guestLimit = useGuestScanLimit()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserClient()
        setUser(userData)
        const loggedIn = !!userData
        setIsLoggedIn(loggedIn)
        guestLimit.setIsLoggedIn(loggedIn)
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
        setIsLoggedIn(false)
        guestLimit.setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle login toggle
  const handleToggleLogin = (checked: boolean) => {
    setIsLoggedIn(checked)
    if (!checked) {
      setShowHistory(false)
    }
  }

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
    // Check guest scan limit first
    if (!isLoggedIn && guestLimit.hasReachedLimit) {
      setShowLoginPrompt(true)
      return
    }

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

      // Increment guest scan count after successful upload trigger
      if (!isLoggedIn) {
        guestLimit.incrementScanCount()
      }
    }
  }

  // Handle file input click with guest limit check
  const handleFileInputClick = () => {
    if (!isLoggedIn && guestLimit.hasReachedLimit) {
      setShowLoginPrompt(true)
      return
    }
    fileInputRef.current?.click()
  }

  // Handle file upload with guest limit tracking
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn && guestLimit.hasReachedLimit) {
      setShowLoginPrompt(true)
      event.target.value = "" // Reset file input
      return
    }

    scanner.handleFileUpload(event)

    // Increment guest scan count after successful upload
    if (!isLoggedIn && event.target.files?.[0]) {
      guestLimit.incrementScanCount()
    }
  }

  // Handle URL submit with guest limit check
  const handleUrlSubmit = () => {
    if (!isLoggedIn && guestLimit.hasReachedLimit) {
      setShowLoginPrompt(true)
      return
    }

    scanner.handleUrlSubmit()

    // Increment guest scan count after URL submit
    if (!isLoggedIn && scanner.imageUrl) {
      guestLimit.incrementScanCount()
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 dark:to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-primary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 dark:to-background">
      {/* Confetti effect */}
      <ScannerConfetti isVisible={scanner.showConfetti} />

      <div className="container mx-auto px-4 py-8 pt-24 md:pt-28">{/* API Status */}
        {/* API Status */}
        <ScanStatusApi
          apiChecking={scanner.apiChecking}
          apiReady={scanner.apiReady}
          response={scanner.apiResponse}
        />

        <div className="max-w-3xl mx-auto">
          {/* Guest Scan Banner - Show for non-logged in users */}
          {!isLoggedIn && (
            <GuestScanBanner
              remainingScans={guestLimit.remainingScans}
              maxScans={guestLimit.maxFreeScans}
              hasReachedLimit={guestLimit.hasReachedLimit}
              onLoginClick={() => setShowLoginPrompt(true)}
            />
          )}

          <div className="bg-card text-card-foreground rounded-3xl shadow-xl border border-border/30 overflow-hidden">
            <div className="p-4 md:p-6">
              {!scanner.previewImage ? (
                <div className="space-y-6">
                  <ScanCounter className="mb-3" showUserStats={true} />

                  {/* Upload Area */}
                  <ScannerUploadArea
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    imageUrl={scanner.imageUrl}
                    onImageUrlChange={scanner.setImageUrl}
                    onUrlSubmit={handleUrlSubmit}
                    onFileInputClick={handleFileInputClick}
                    onFileDrop={handleFileDrop}
                    apiReady={scanner.apiReady && (!guestLimit.hasReachedLimit || isLoggedIn)}
                    showTips={showTips}
                    onToggleTips={() => setShowTips(!showTips)}
                  />

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Non-Felidae Alert */}
                  {scanner.notFelidae && (
                    <Alert className="bg-destructive/10 border-destructive/40 text-destructive-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Bukan kucing atau gambar kurang jelas</AlertTitle>
                      <AlertDescription>
                        {scanner.notFelidaeMessage ||
                          "Coba foto ulang dengan fokus pada kucing (wajah/badan terlihat), pencahayaan cukup, dan latar sederhana."}
                      </AlertDescription>
                    </Alert>
                  )}
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

          {/* Recent Scans - Only show for logged in users */}
          {isLoggedIn && <RecentScans />}
        </div>
      </div>

      {/* Scan History Component */}
      <ScanHistory
        isOpen={showHistory && isLoggedIn}
        onOpenChange={setShowHistory}
      />

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        usedScans={guestLimit.guestScanCount}
        maxScans={guestLimit.maxFreeScans}
      />
    </div>
  )
}
