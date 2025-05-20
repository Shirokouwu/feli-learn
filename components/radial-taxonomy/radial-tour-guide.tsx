"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Lightbulb,
  Sparkles,
  Compass,
  MousePointer,
  Hand,
  Move,
  ZoomIn,
  Maximize,
  Search,
  PanelLeft,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface TourStep {
  title: string
  description: string
  target: string
  icon?: React.ReactNode
  tip?: string
  position?: "top" | "bottom" | "left" | "right" | "center"
}

interface RadialTourGuideProps {
  tourSteps: TourStep[]
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  onComplete?: () => void
}

export function RadialTourGuide({ tourSteps, currentStep, onNext, onPrev, onClose, onComplete }: RadialTourGuideProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [tooltipPlacement, setTooltipPlacement] = useState<"top" | "bottom" | "left" | "right" | "center">("bottom")
  const spotlightRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const isMobile = useMobile()

  // Get the appropriate icon for the current step
  const getStepIcon = (step: TourStep) => {
    if (step.icon) return step.icon

    const title = step.title.toLowerCase()

    if (title.includes("zoom")) return <ZoomIn className="h-5 w-5" />
    if (title.includes("pilih") || title.includes("klik")) return <MousePointer className="h-5 w-5" />
    if (title.includes("navigasi")) return <Compass className="h-5 w-5" />
    if (title.includes("cari")) return <Search className="h-5 w-5" />
    if (title.includes("geser") || title.includes("drag")) return <Move className="h-5 w-5" />
    if (title.includes("sentuh") || title.includes("touch")) return <Hand className="h-5 w-5" />
    if (title.includes("perbesar") || title.includes("perkecil")) return <Maximize className="h-5 w-5" />
    if (title.includes("panel") || title.includes("sidebar")) return <PanelLeft className="h-5 w-5" />

    return <Sparkles className="h-5 w-5" />
  }

  // Calculate the best position for the tooltip
  const calculateTooltipPosition = (
    rect: DOMRect,
    placement: "top" | "bottom" | "left" | "right" | "center" = "bottom",
  ) => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const tooltipHeight = 180 // Approximate height
    const tooltipWidth = Math.min(450, windowWidth - 40) // Approximate width with max constraint
    const padding = 20

    let position = { top: 0, left: 0 }
    let finalPlacement = placement

    // Override placement based on screen position if not explicitly set
    if (placement === "center") {
      // Center placement
      position = {
        top: windowHeight / 2 - tooltipHeight / 2,
        left: windowWidth / 2 - tooltipWidth / 2,
      }
    } else if (placement === "bottom" || !placement) {
      // Check if there's enough space below
      if (rect.bottom + tooltipHeight + padding > windowHeight) {
        // Not enough space below, try above
        if (rect.top - tooltipHeight - padding > 0) {
          finalPlacement = "top"
        } else {
          // Not enough space above either, place it in the center
          finalPlacement = "center"
        }
      }
    } else if (placement === "top") {
      // Check if there's enough space above
      if (rect.top - tooltipHeight - padding < 0) {
        // Not enough space above, try below
        if (rect.bottom + tooltipHeight + padding < windowHeight) {
          finalPlacement = "bottom"
        } else {
          // Not enough space below either, place it in the center
          finalPlacement = "center"
        }
      }
    }

    // Calculate final position based on placement
    switch (finalPlacement) {
      case "top":
        position = {
          top: rect.top - tooltipHeight - padding,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        }
        break
      case "bottom":
        position = {
          top: rect.bottom + padding,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        }
        break
      case "left":
        position = {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.left - tooltipWidth - padding,
        }
        break
      case "right":
        position = {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.right + padding,
        }
        break
      case "center":
        position = {
          top: windowHeight / 2 - tooltipHeight / 2,
          left: windowWidth / 2 - tooltipWidth / 2,
        }
        break
    }

    // Ensure tooltip stays within viewport bounds
    position.left = Math.max(padding, Math.min(windowWidth - tooltipWidth - padding, position.left))
    position.top = Math.max(padding, Math.min(windowHeight - tooltipHeight - padding, position.top))

    setTooltipPlacement(finalPlacement)
    return position
  }

  // Find and scroll to the target element when the step changes
  useEffect(() => {
    if (!tourSteps || currentStep <= 0 || currentStep > tourSteps.length) return

    const currentTourStep = tourSteps[currentStep - 1]
    if (!currentTourStep) return

    const targetSelector = currentTourStep.target
    if (!targetSelector) {
      // If no target, center the tooltip
      setTargetElement(null)
      setTargetRect(null)
      setTooltipPosition(
        calculateTooltipPosition(
          {
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            right: window.innerWidth / 2,
            bottom: window.innerHeight / 2,
            width: 0,
            height: 0,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            toJSON: () => ({}),
          },
          "center",
        ),
      )
      return
    }

    const element = document.querySelector(targetSelector) as HTMLElement
    if (element) {
      setTargetElement(element)

      // Get the element's position
      const rect = element.getBoundingClientRect()
      setTargetRect(rect)

      // Calculate tooltip position
      const position = calculateTooltipPosition(rect, currentTourStep.position)
      setTooltipPosition(position)

      // Scroll the element into view with some padding
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "center",
      }

      element.scrollIntoView(scrollOptions)

      // Add a highlight class to the target element
      element.classList.add("tour-highlight")

      // Add a pulse animation to draw attention
      element.classList.add("tour-pulse")

      return () => {
        // Remove the highlight class when the effect is cleaned up
        element.classList.remove("tour-highlight")
        element.classList.remove("tour-pulse")
      }
    }
  }, [currentStep, tourSteps])

  // Update the target rect on window resize
  useEffect(() => {
    const handleResize = () => {
      if (targetElement) {
        const newRect = targetElement.getBoundingClientRect()
        setTargetRect(newRect)

        // Recalculate tooltip position
        const currentTourStep = tourSteps[currentStep - 1]
        const position = calculateTooltipPosition(newRect, currentTourStep?.position)
        setTooltipPosition(position)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [targetElement, currentStep, tourSteps])

  // Handle step transition animation
  const handleStepTransition = (direction: "next" | "prev") => {
    setIsAnimating(true)

    if (direction === "next") {
      onNext()
    } else {
      onPrev()
    }

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  // Handle completion of the tour
  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
    onClose()
  }

  // Get progress percentage
  const progressPercentage = (currentStep / tourSteps.length) * 100

  return (
    <>
      {/* Spotlight overlay */}
      <AnimatePresence>
        {targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
            ref={spotlightRef}
          >
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Spotlight cutout */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={targetRect.left - 12}
                    y={targetRect.top - 12}
                    width={targetRect.width + 24}
                    height={targetRect.height + 24}
                    rx="16"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="transparent" mask="url(#spotlight-mask)" />
            </svg>

            {/* Highlight border around the target */}
            <div
              className="absolute border-2 border-emerald-400 rounded-xl shadow-[0_0_0_4px_rgba(52,211,153,0.3)] animate-pulse"
              style={{
                left: targetRect.left - 12,
                top: targetRect.top - 12,
                width: targetRect.width + 24,
                height: targetRect.height + 24,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour guide tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tooltip-${currentStep}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed z-50 w-full sm:w-auto pointer-events-auto"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth: "450px",
            width: isMobile ? "calc(100% - 40px)" : "450px",
          }}
          ref={tooltipRef}
        >
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-emerald-100 w-full relative overflow-hidden">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 h-1 bg-emerald-100 w-full">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Tooltip content */}
            <div className="pt-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    {tourSteps[currentStep - 1] && getStepIcon(tourSteps[currentStep - 1])}
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-800">
                    {tourSteps[currentStep - 1] && tourSteps[currentStep - 1].title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: isAnimating ? (currentStep > 1 ? 20 : -20) : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: currentStep > 1 ? -20 : 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-emerald-50 p-4 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-700 select-text leading-relaxed">
                          {tourSteps[currentStep - 1] && tourSteps[currentStep - 1].description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Pro tip section */}
                {tourSteps[currentStep - 1]?.tip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-amber-50 p-3 rounded-lg border border-amber-100"
                  >
                    <div className="flex items-start gap-2">
                      <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-amber-800 mb-1">Pro Tip</h4>
                        <p className="text-xs text-amber-700 select-text leading-relaxed">
                          {tourSteps[currentStep - 1].tip}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-medium">
                    {currentStep} dari {tourSteps.length}
                  </span>
                  <div className="flex gap-1 items-center">
                    {tourSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-colors duration-300 ${
                          i < currentStep
                            ? "bg-emerald-500 w-4"
                            : i === currentStep - 1
                              ? "bg-emerald-300 w-6"
                              : "bg-emerald-100 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStepTransition("prev")}
                      className="flex items-center gap-1 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors duration-300"
                      disabled={isAnimating}
                    >
                      <ChevronLeft className="h-4 w-4" /> Sebelumnya
                    </Button>
                  )}
                  {currentStep < tourSteps.length ? (
                    <Button
                      size="sm"
                      onClick={() => handleStepTransition("next")}
                      className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 transition-colors duration-300"
                      disabled={isAnimating}
                    >
                      Selanjutnya <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleComplete}
                      className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
                    >
                      Selesai
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tooltip arrow based on placement */}
            {targetRect && tooltipPlacement !== "center" && (
              <div
                className={`absolute w-4 h-4 bg-white rotate-45 ${
                  tooltipPlacement === "top"
                    ? "bottom-[-8px]"
                    : tooltipPlacement === "bottom"
                      ? "top-[-8px]"
                      : tooltipPlacement === "left"
                        ? "right-[-8px]"
                        : "left-[-8px]"
                }`}
                style={{
                  left:
                    tooltipPlacement === "top" || tooltipPlacement === "bottom"
                      ? "calc(50% - 8px)"
                      : tooltipPlacement === "left"
                        ? "auto"
                        : "-8px",
                  top:
                    tooltipPlacement === "left" || tooltipPlacement === "right"
                      ? "calc(50% - 8px)"
                      : tooltipPlacement === "top"
                        ? "auto"
                        : "-8px",
                }}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add global styles for the tour highlight */}
      <style jsx global>{`
        .tour-highlight {
          z-index: 45 !important;
          position: relative;
        }
        
        .tour-pulse {
          animation: tour-pulse-animation 2s infinite;
        }
        
        @keyframes tour-pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(52, 211, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
          }
        }
      `}</style>
    </>
  )
}
