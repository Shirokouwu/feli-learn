"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"

interface RadialIntroProps {
  onClose: () => void
}

export function RadialIntro({ onClose }: RadialIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-teal-900/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg text-center"
      >
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Compass className="h-8 w-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-teal-900 mb-2">Jelajahi Taksonomi Felidae</h2>
        <p className="text-neutral-600 mb-6">
          Visualisasi hierarki taksonomi dalam bentuk node radial. Lihat bagaimana spesies kucing dikelompokkan dari
          Famili Felidae ke berbagai Genus, hingga masing-masing Spesies. Klik node untuk menjelajahi setiap tingkat
          klasifikasi dan memahami hubungan evolusi di dalamnya.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-teal-50 p-3 rounded-xl">
            <div className="text-teal-800 font-medium mb-1">38 Spesies</div>
            <div className="text-xs text-teal-600">Dari kucing domestik hingga harimau</div>
          </div>
          <div className="bg-teal-50 p-3 rounded-xl">
            <div className="text-teal-800 font-medium mb-1">14 Genus</div>
            <div className="text-xs text-teal-600">Kelompok taksonomi utama</div>
          </div>
        </div>
        <Button onClick={onClose} className="bg-teal-600 hover:bg-teal-700 text-white w-full">
          Mulai Eksplorasi
        </Button>
      </motion.div>
    </motion.div>
  )
}
