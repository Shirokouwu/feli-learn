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
      className="mt-8 bg-card p-6 rounded-xl border border-border shadow-md"
    >
      <h3 className="text-lg font-bold text-foreground mb-4">Tentang AI Scanner Pro</h3>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="bg-primary/15 p-3 rounded-lg inline-block">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-medium text-foreground">Teknologi Canggih</h4>
          <p className="text-sm text-muted-foreground">
            Menggunakan Convolutional Neural Network (CNN) dengan akurasi hingga 98.5% dalam mengidentifikasi 41
            spesies Felidae.
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-primary/15 p-3 rounded-lg inline-block">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-medium text-foreground">Detail Taksonomi</h4>
          <p className="text-sm text-muted-foreground">
            Menampilkan hierarki taksonomi dari Kingdom hingga Spesies Felidae, lengkap dengan informasi ilmiah akurat.
          </p>
        </div>

        <div className="space-y-2">
          <div className="bg-primary/15 p-3 rounded-lg inline-block">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-medium text-foreground">Edukasi & Pelestarian</h4>
          <p className="text-sm text-muted-foreground">
            Bukan hanya mengenali, AI ini juga mengajak Anda memahami dan menghargai keanekaragaman spesies dalam keluarga Felidae.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border sm:flex justify-between items-center">
        <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
          Pelajari lebih lanjut tentang keluarga Felidae melalui diagram taksonomi interaktif kami.
        </p>
        <Button
          variant="outline"
          className="text-primary border-border hover:bg-primary/10 hover:text-primary group"
          onClick={() => router.push("/taxonomy")}
        >
          Jelajahi Taksonomi
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  )
}
