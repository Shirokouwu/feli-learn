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
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-card border border-border/60">
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
                  ? "border-primary/50 cursor-pointer hover:bg-primary/5"
                  : "border-border/70 cursor-not-allowed opacity-70"
                  } bg-card/60 rounded-xl flex flex-col items-center justify-center transition-colors duration-300 group`}
              >
                <div className="p-4 bg-primary/15 rounded-full mb-4 group-hover:bg-primary/25 transition-colors duration-300">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg text-center font-medium text-foreground mb-2">
                  <span className="hidden sm:inline">Tarik & Lepas atau </span>
                  <span>Klik untuk Unggah</span>
                </h3>
                <p className="text-muted-foreground text-sm max-w-md text-center">
                  Unggah foto family Felidae (kucing, singa, harimau, dll) untuk diidentifikasi
                </p>
                <div className="text-center mt-2">
                  <p className="text-primary text-xs">
                    Format: JPG, PNG, WEBP (Maks. 10MB)
                  </p>

                </div>
                {!apiReady && (
                  <div className="mt-3 px-4 py-2 bg-destructive/10 border border-destructive/40 rounded-lg">
                    <p className="text-xs text-destructive-foreground">API model tidak tersedia. Coba lagi nanti.</p>
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2 w-full sm:w-fit sm:mt-0"
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

                <div className="bg-muted/40 border border-border p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Tips URL Gambar</h4>
                      <p className="text-sm text-muted-foreground">
                        Pastikan URL berakhiran dengan format gambar (.jpg, .png, .webp) dan berasal dari
                        sumber yang dapat diakses publik.
                      </p>
                      <p className="text-xs text-primary mt-2">
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

      <div className="border-t border-border pt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleTips}
          className="text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-300"
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
                    icon: <Eye className="h-5 w-5 text-primary" />,
                    title: "Fokus pada Hewan",
                    desc: "Pastikan anggota Felidae terlihat jelas untuk hasil identifikasi terbaik",
                  },
                  {
                    icon: <Leaf className="h-5 w-5 text-primary" />,
                    title: "Hindari Oklusi",
                    desc: "Pastikan tidak ada objek yang menghalangi tampilan hewan",
                  },
                  {
                    icon: <Zap className="h-5 w-5 text-primary" />,
                    title: "Pencahayaan Baik",
                    desc: "Gunakan pencahayaan yang cukup untuk detail yang lebih baik",
                  },
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card p-3 rounded-lg border border-border shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-md">{tip.icon}</div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.desc}</p>
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
