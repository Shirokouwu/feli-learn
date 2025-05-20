"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HelpCircle, X, ChevronUp, ChevronDown } from "lucide-react"
import { HelpNotification } from "./help-notification"

export function RadialDiagramGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showNotification, setShowNotification] = useState(true)

  // Check if user has opened the guide before
  useEffect(() => {
    const hasOpenedGuide = localStorage.getItem("hasOpenedRadialGuide")
    if (hasOpenedGuide) {
      setShowNotification(false)
    }
  }, [])

  const handleOpen = () => {
    setIsOpen(true)
    setShowNotification(false)
    localStorage.setItem("hasOpenedRadialGuide", "true")
  }

  return (
    <div className="absolute bottom-4 right-4 z-20">
      {/* Help notification */}
      {showNotification && <HelpNotification />}

      {/* Toggle button */}
      {!isOpen && (
        <Button
          onClick={handleOpen}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all duration-300 shadow-md rounded-full h-10 w-10 p-0"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      )}

      {/* Guide panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white/95 backdrop-blur-md rounded-lg border border-teal-200 shadow-lg w-72 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-teal-600" />
                <h3 className="font-medium text-teal-800">Panduan Diagram</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-teal-100/50 text-teal-700"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-red-100/50 text-red-700"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <div className="space-y-4">
                {/* Node Types */}
                <div>
                  <h4 className="text-xs font-medium text-teal-800 mb-2">Jenis Node</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-xs font-medium text-slate-700">Keluarga</p>
                        <p className="text-xs text-slate-500">Node pusat (Felidae)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-xs font-medium text-slate-700">Genus</p>
                        <p className="text-xs text-slate-500">Lingkaran tengah</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-xs font-medium text-slate-700">Spesies</p>
                        <p className="text-xs text-slate-500">Lingkaran terluar</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conservation Status */}
                <div>
                  <h4 className="text-xs font-medium text-teal-800 mb-2">Status Konservasi</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                      <p className="text-xs text-slate-700">Risiko Rendah</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                      <p className="text-xs text-slate-700">Hampir Terancam</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                      <p className="text-xs text-slate-700">Rentan</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                      <p className="text-xs text-slate-700">Terancam</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-600 flex-shrink-0"></div>
                      <p className="text-xs text-slate-700">Kritis</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-black flex-shrink-0"></div>
                      <p className="text-xs text-slate-700">Punah</p>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {/* Interactions */}
                      <div>
                        <h4 className="text-xs font-medium text-teal-800 mb-2">Interaksi</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-blue-700">1</span>
                            </div>
                            <p className="text-xs text-slate-700">Klik node untuk melihat detail</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-blue-700">2</span>
                            </div>
                            <p className="text-xs text-slate-700">Klik dan tahan untuk menggeser diagram</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-blue-700">3</span>
                            </div>
                            <p className="text-xs text-slate-700">Gunakan kontrol di kiri untuk zoom dan rotasi</p>
                          </div>
                        </div>
                      </div>

                      {/* Visual Elements */}
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-teal-800 mb-2">Elemen Visual</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-blue-400 flex-shrink-0"></div>
                            <p className="text-xs text-slate-700">Garis koneksi</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-blue-400 flex-shrink-0 animate-pulse"></div>
                            <p className="text-xs text-slate-700">Jalur terpilih</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border-2 border-teal-500 flex-shrink-0"></div>
                            <p className="text-xs text-slate-700">Node terpilih</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50 text-center">
              <p className="text-xs text-teal-700">
                {isExpanded ? "Klik untuk menyembunyikan detail" : "Klik untuk melihat lebih banyak detail"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
