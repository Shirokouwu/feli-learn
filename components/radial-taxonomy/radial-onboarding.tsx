"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, Search, Compass, Zap, Shield, Sparkles } from "lucide-react"
import Image from "next/image"

interface RadialOnboardingProps {
  isOpen: boolean
  onClose: () => void
}

export function RadialOnboarding({ isOpen, onClose }: RadialOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Auto-hide after 60 seconds if user doesn't interact
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 60000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  const steps = [
    {
      title: "Visualisasi Radial Taksonomi Felidae",
      description:
        "Selamat datang di visualisasi radial taksonomi Felidae. Visualisasi ini menampilkan hubungan taksonomi keluarga kucing dalam bentuk diagram radial yang interaktif.",
      image: "/placeholder.svg?height=300&width=500&text=Diagram+Radial+Felidae",
      features: [
        {
          icon: <Compass className="h-4 w-4 text-teal-600" />,
          title: "Navigasi Intuitif",
          description: "Jelajahi taksonomi dengan mudah melalui tampilan radial yang intuitif",
        },
        {
          icon: <Search className="h-4 w-4 text-teal-600" />,
          title: "Pencarian Spesies",
          description: "Temukan spesies dengan cepat menggunakan fitur pencarian",
        },
        {
          icon: <Shield className="h-4 w-4 text-teal-600" />,
          title: "Status Konservasi",
          description: "Lihat status konservasi setiap spesies melalui warna glow effect",
        },
      ],
    },
    {
      title: "Struktur Taksonomi",
      description:
        "Diagram radial menampilkan struktur taksonomi dengan Keluarga Felidae di tengah, dikelilingi oleh Genus, dan Spesies di lingkaran terluar.",
      image: "/placeholder.svg?height=300&width=500&text=Struktur+Taksonomi",
      features: [
        {
          icon: <div className="w-4 h-4 rounded-full bg-teal-500"></div>,
          title: "Keluarga (Pusat)",
          description: "Node pusat mewakili keluarga Felidae",
        },
        {
          icon: <div className="w-4 h-4 rounded-full bg-indigo-500"></div>,
          title: "Genus (Tengah)",
          description: "Lingkaran tengah menampilkan berbagai genus dalam keluarga Felidae",
        },
        {
          icon: <div className="w-4 h-4 rounded-full bg-orange-500"></div>,
          title: "Spesies (Luar)",
          description: "Lingkaran terluar menampilkan spesies dari setiap genus",
        },
      ],
    },
    {
      title: "Status Konservasi",
      description:
        "Warna glow effect pada diagram menunjukkan status konservasi setiap spesies, membantu Anda memahami tingkat ancaman kepunahan.",
      image: "/placeholder.svg?height=300&width=500&text=Status+Konservasi",
      features: [
        {
          icon: <div className="w-4 h-4 rounded-full bg-green-500"></div>,
          title: "Risiko Rendah",
          description: "Spesies dengan populasi stabil dan tidak terancam",
        },
        {
          icon: <div className="w-4 h-4 rounded-full bg-yellow-500"></div>,
          title: "Hampir Terancam",
          description: "Spesies yang mungkin terancam dalam waktu dekat",
        },
        {
          icon: <div className="w-4 h-4 rounded-full bg-red-500"></div>,
          title: "Terancam",
          description: "Spesies yang menghadapi risiko kepunahan tinggi",
        },
      ],
    },
    {
      title: "Fitur Interaktif",
      description:
        "Visualisasi ini dilengkapi dengan berbagai fitur interaktif untuk membantu Anda menjelajahi taksonomi Felidae.",
      image: "/placeholder.svg?height=300&width=500&text=Fitur+Interaktif",
      features: [
        {
          icon: <Zap className="h-4 w-4 text-teal-600" />,
          title: "Zoom & Rotasi",
          description: "Perbesar, perkecil, dan putar diagram untuk melihat detail",
        },
        {
          icon: <Sparkles className="h-4 w-4 text-teal-600" />,
          title: "Mode Cerita",
          description: "Jelajahi taksonomi melalui narasi yang informatif",
        },
        {
          icon: <Search className="h-4 w-4 text-teal-600" />,
          title: "Pencarian",
          description: "Temukan spesies tertentu dengan cepat",
        },
      ],
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden"
      >
        {/* Close button */}
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Image */}
                <div className="md:w-1/2">
                  <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-slate-100">
                    <Image
                      src={steps[currentStep].image || "/placeholder.svg"}
                      alt={steps[currentStep].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-teal-700 mb-3">{steps[currentStep].title}</h2>
                  <p className="text-slate-600 mb-6">{steps[currentStep].description}</p>

                  {/* Features */}
                  <div className="space-y-4">
                    {steps[currentStep].features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1 bg-teal-50 p-1.5 rounded-md">{feature.icon}</div>
                        <div>
                          <h3 className="font-medium text-slate-800">{feature.title}</h3>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentStep === index ? "bg-teal-500" : "bg-slate-300"
                } transition-colors`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Lewati
            </Button>
            <Button
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1)
                } else {
                  onClose()
                }
              }}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Lanjut <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                "Mulai Eksplorasi"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
