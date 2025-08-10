"use client";
import { motion } from "framer-motion"
import { Upload, Link, Info, Eye, Leaf, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatePresence } from "framer-motion"

interface ScannerUploadAreaProps {
  activeTab: string
  onTabChange: (value: string) => void
  imageUrl: string
  onImageUrlChange: (url: string) => void
  onUrlSubmit: () => void
  onFileInputClick: () => void
  onFileDrop: (files: FileList) => void
  apiReady: boolean
  showTips: boolean
  onToggleTips: () => void
}

export const ScannerUploadArea: React.FC<ScannerUploadAreaProps> = ({
  activeTab,
  onTabChange,
  imageUrl,
  onImageUrlChange,
  onUrlSubmit,
  onFileInputClick,
  onFileDrop,
  apiReady,
  showTips,
  onToggleTips
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!apiReady) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onFileDrop(files)
    }
  }
  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload" className="text-sm md:text-base">
              <Upload className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Unggah </span>
              <span>Gambar</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="text-sm md:text-base" disabled={!apiReady}>
              <Link className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Gunakan </span>
              <span>URL</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4" asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                onClick={() => apiReady && onFileInputClick()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`h-64 border-2 border-dashed ${apiReady
                  ? "border-emerald-200 cursor-pointer hover:bg-emerald-50"
                  : "border-gray-200 cursor-not-allowed opacity-70"
                  } rounded-xl flex flex-col items-center justify-center transition-colors duration-300 group`}
              >
                <div className="p-4 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-200 transition-colors duration-300">
                  <Upload className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg text-center font-medium text-emerald-800 mb-2">
                  <span className="hidden sm:inline">Tarik & Lepas atau </span>
                  <span>Klik untuk Unggah</span>
                </h3>
                <p className="text-neutral-500 text-sm max-w-md text-center">
                  Unggah foto family Felidae (kucing, singa, harimau, dll) untuk diidentifikasi
                </p>
                <div className="text-center mt-2">
                  <p className="text-emerald-600 text-xs">
                    Format: JPG, PNG, WEBP (Maks. 10MB)
                  </p>

                </div>
                {!apiReady && (
                  <div className="mt-3 px-4 py-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">API model tidak tersedia. Coba lagi nanti.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4" asChild>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="space-y-4">
                <div className="sm:flex gap-2 ">
                  <Input
                    placeholder="Masukkan URL gambar (https://...)"
                    className="flex-1"
                    value={imageUrl}
                    onChange={(e) => onImageUrlChange(e.target.value)}
                    disabled={!apiReady}
                  />
                  <Button
                    onClick={onUrlSubmit}
                    disabled={!imageUrl || !apiReady}
                    className="bg-emerald-600 hover:bg-emerald-700 mt-2 w-full sm:w-fit sm:mt-0"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Scan
                  </Button>
                </div>

                {imageUrl && (
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Preview dari URL"
                      className="object-cover w-full h-full"
                      onError={() => {
                        onImageUrlChange("")
                      }}
                    />
                  </div>
                )}

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-emerald-800 mb-1">Tips URL Gambar</h4>
                      <p className="text-sm text-emerald-700">
                        Pastikan URL berakhiran dengan format gambar (.jpg, .png, .webp) dan berasal dari
                        sumber yang dapat diakses publik.
                      </p>
                      <p className="text-xs text-emerald-600 mt-2">
                        Contoh: https://example.com/foto-felidae.jpg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </AnimatePresence>

      <div className="border-t border-neutral-100 pt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleTips}
          className="text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-300"
        >
          <Info className="h-4 w-4 mr-2" />
          {showTips ? "Sembunyikan Tips" : "Tampilkan Tips Penggunaan"}
        </Button>

        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {[
                  {
                    icon: <Eye className="h-5 w-5 text-emerald-600" />,
                    title: "Fokus pada Hewan",
                    desc: "Pastikan anggota Felidae terlihat jelas untuk hasil identifikasi terbaik",
                  },
                  {
                    icon: <Leaf className="h-5 w-5 text-emerald-600" />,
                    title: "Hindari Oklusi",
                    desc: "Pastikan tidak ada objek yang menghalangi tampilan hewan",
                  },
                  {
                    icon: <Zap className="h-5 w-5 text-emerald-600" />,
                    title: "Pencahayaan Baik",
                    desc: "Gunakan pencahayaan yang cukup untuk detail yang lebih baik",
                  },
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-50 p-2 rounded-md">{tip.icon}</div>
                      <div>
                        <h4 className="font-medium text-emerald-800 text-sm">{tip.title}</h4>
                        <p className="text-xs text-neutral-600">{tip.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
