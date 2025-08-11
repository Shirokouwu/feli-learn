"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Zap, CheckCircle, Leaf, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutAiScanner() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 bg-white p-6 rounded-xl border border-emerald-100 shadow-md"
    >
      <h3 className="text-lg font-bold text-emerald-800 mb-4">Tentang AI Scanner Pro</h3>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="bg-emerald-100 p-3 rounded-lg inline-block">
            <Zap className="h-5 w-5 text-emerald-600" />
          </div>
          <h4 className="font-medium text-emerald-700">Teknologi Canggih</h4>
          <p className="text-sm text-neutral-600">
            Menggunakan Convolutional Neural Network (CNN) dengan akurasi hingga 98.5% dalam mengidentifikasi 41
            spesies Felidae.
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-emerald-100 p-3 rounded-lg inline-block">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <h4 className="font-medium text-emerald-700">Detail Taksonomi</h4>
          <p className="text-sm text-neutral-600">
            Menampilkan hierarki taksonomi dari Kingdom hingga Spesies Felidae, lengkap dengan informasi ilmiah akurat.
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-emerald-100 p-3 rounded-lg inline-block">
            <Leaf className="h-5 w-5 text-emerald-600" />
          </div>
          <h4 className="font-medium text-emerald-700">Edukasi & Pelestarian</h4>
          <p className="text-sm text-neutral-600">
            Bukan hanya mengenali, AI ini juga mengajak Anda memahami dan menghargai keanekaragaman spesies dalam keluarga Felidae.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 sm:flex justify-between items-center">
        <p className="text-sm text-neutral-600 mb-2 sm:mb-0">
          Pelajari lebih lanjut tentang keluarga Felidae melalui diagram taksonomi interaktif kami.
        </p>
        <Button
          variant="outline"
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 group"
          onClick={() => router.push("/taxonomy")}
        >
          Jelajahi Taksonomi
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  )
}
