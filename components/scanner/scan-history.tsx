"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  History,
  SearchX,
  Trash2,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  Download,
  SortDesc,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getConservationStatusColor } from "@/lib/conservation-utils"

// Define the history item type
export type ScanHistoryItem = {
  id: string
  name: string
  scientificName: string
  imageUrl: string
  accuracy: number
  date: Date
  conservationStatus?: string
  family?: string
  genus?: string
}

// Sample hardcoded data
const SAMPLE_HISTORY_DATA: ScanHistoryItem[] = [
  {
    id: "hist-001",
    name: "Harimau Sumatera",
    scientificName: "Panthera tigris sumatrae",
    imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2940&auto=format&fit=crop",
    accuracy: 98.7,
    date: new Date(2023, 10, 15, 14, 30),
    conservationStatus: "Critically Endangered",
    family: "Felidae",
    genus: "Panthera",
  },
  {
    id: "hist-002",
    name: "Singa Afrika",
    scientificName: "Panthera leo",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=2940&auto=format&fit=crop",
    accuracy: 97.3,
    date: new Date(2023, 10, 14, 9, 45),
    conservationStatus: "Vulnerable",
    family: "Felidae",
    genus: "Panthera",
  },
  {
    id: "hist-003",
    name: "Macan Tutul",
    scientificName: "Panthera pardus",
    imageUrl: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=2940&auto=format&fit=crop",
    accuracy: 95.8,
    date: new Date(2023, 10, 12, 16, 20),
    conservationStatus: "Vulnerable",
    family: "Felidae",
    genus: "Panthera",
  },
  {
    id: "hist-004",
    name: "Kucing Domestik",
    scientificName: "Felis catus",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2943&auto=format&fit=crop",
    accuracy: 99.2,
    date: new Date(2023, 10, 10, 11, 15),
    conservationStatus: "Least Concern",
    family: "Felidae",
    genus: "Felis",
  },
  {
    id: "hist-005",
    name: "Cheetah",
    scientificName: "Acinonyx jubatus",
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?q=80&w=2940&auto=format&fit=crop",
    accuracy: 96.5,
    date: new Date(2023, 10, 8, 13, 50),
    conservationStatus: "Vulnerable",
    family: "Felidae",
    genus: "Acinonyx",
  },
  {
    id: "hist-006",
    name: "Lynx",
    scientificName: "Lynx lynx",
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?q=80&w=2940&auto=format&fit=crop",
    accuracy: 93.1,
    date: new Date(2023, 10, 5, 10, 30),
    conservationStatus: "Least Concern",
    family: "Felidae",
    genus: "Lynx",
  },
]

interface ScanHistoryProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onClearHistory?: () => void
}

export function ScanHistory({ isOpen, onOpenChange, onClearHistory }: ScanHistoryProps) {
  const [historyData, setHistoryData] = useState<ScanHistoryItem[]>(SAMPLE_HISTORY_DATA)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "accuracy">("newest")
  const [filterText, setFilterText] = useState("")
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  // Sort and filter history data
  const processedHistory = historyData
    .filter(
      (item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(filterText.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") return b.date.getTime() - a.date.getTime()
      if (sortOrder === "oldest") return a.date.getTime() - b.date.getTime()
      return b.accuracy - a.accuracy
    })

  // Handle clearing history
  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat scan?")) {
      setHistoryData([])
      if (onClearHistory) onClearHistory()
      toast("Riwayat scan telah dihapus")
    }
  }

  // Handle deleting a single history item
  const handleDeleteItem = (id: string) => {
    setHistoryData((prev) => prev.filter((item) => item.id !== id))
    toast("Item riwayat telah dihapus")
  }

  // Handle viewing details of an item
  const handleViewDetails = (item: ScanHistoryItem) => {
    setSelectedItem(item)
    setShowDetailDialog(true)
  }

  // // Handle exporting history (mock function)
  // const handleExportHistory = () => {
  //   toast({
  //     title: "Ekspor Riwayat",
  //     description: "Fitur ekspor riwayat akan segera tersedia",
  //   })
  // }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              Riwayat Scan
            </DialogTitle>
            <DialogDescription>Daftar spesies yang telah diidentifikasi sebelumnya</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Cari berdasarkan nama..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-9"
              />
              <SearchX className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              {filterText && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setFilterText("")}
                >
                  <X className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
                </button>
              )}
            </div>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="accuracy">Akurasi Tertinggi</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Semua Spesies</DropdownMenuItem>
                <DropdownMenuItem>Genus Panthera</DropdownMenuItem>
                <DropdownMenuItem>Genus Felis</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Critically Endangered</DropdownMenuItem>
                <DropdownMenuItem>Vulnerable</DropdownMenuItem>
                <DropdownMenuItem>Least Concern</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <Button variant="outline" size="icon" onClick={handleExportHistory}>
              <Download className="h-4 w-4" />
            </Button> */}
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {processedHistory.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <SearchX className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                <p className="text-lg font-medium mb-2">Tidak Ada Riwayat</p>
                <p className="text-sm text-neutral-400">
                  {filterText ? "Tidak ada hasil yang cocok dengan pencarian Anda" : "Belum ada riwayat scan"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {processedHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="border border-emerald-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="relative h-40">
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-lg drop-shadow-sm">{item.name}</h4>
                            <Badge className="bg-emerald-500 text-white border-emerald-600">
                              {item.accuracy.toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-white/90 italic drop-shadow-sm">{item.scientificName}</p>
                        </div>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div className="flex items-center text-xs text-neutral-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(item.date, "d MMM yyyy", { locale: id })}
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          {format(item.date, "HH:mm", { locale: id })}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="h-3.5 w-3.5 text-emerald-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="text-xs text-neutral-500">
              {processedHistory.length} item{processedHistory.length !== 1 ? "" : ""} ditampilkan
              {filterText && ` (filter: "${filterText}")`}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Tutup
              </Button>
              {historyData.length > 0 && (
                <Button variant="destructive" onClick={handleClearHistory} className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Semua
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        {selectedItem && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Hasil Scan</DialogTitle>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-emerald-100">
                <Image
                  src={selectedItem.imageUrl || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-800">{selectedItem.name}</h3>
                  <p className="text-emerald-600 italic">{selectedItem.scientificName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-xs text-emerald-700 mb-1">Akurasi</p>
                    <p className="text-lg font-semibold text-emerald-800">{selectedItem.accuracy.toFixed(1)}%</p>
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-xs text-emerald-700 mb-1">Status Konservasi</p>
                    <Badge
                      className={`${getConservationStatusColor(selectedItem.conservationStatus || "Unknown")} text-xs px-2 py-1`}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {selectedItem.conservationStatus || "Unknown"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-sm font-medium text-neutral-700">Famili</span>
                    <span className="text-sm text-emerald-700">{selectedItem.family || "Felidae"}</span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-sm font-medium text-neutral-700">Genus</span>
                    <span className="text-sm text-emerald-700">{selectedItem.genus || "-"}</span>
                  </div>

                  <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-sm font-medium text-neutral-700">Tanggal Scan</span>
                    <span className="text-sm text-emerald-700">
                      {format(selectedItem.date, "d MMMM yyyy, HH:mm", { locale: id })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Tutup
              </Button>
              <Button
                onClick={() => {
                  setShowDetailDialog(false)
                  // Navigate to taxonomy page with this species
                  // This would be implemented in the actual app
                  toast("Navigating to taxonomy page...")
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Lihat di Taksonomi
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
