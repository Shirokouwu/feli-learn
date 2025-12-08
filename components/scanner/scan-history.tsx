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
  Filter,
  SortDesc,
  Eye,
  X,
  AlertTriangle,
  ChevronRight,
  Loader2,
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
import { useScanHistory } from "@/hooks/use-scan-history"
import { ScanHistoryCard } from "./scan-history-card"

interface ScanHistoryProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ScanHistory({ isOpen, onOpenChange }: ScanHistoryProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "accuracy">("newest")
  const [filterText, setFilterText] = useState("")
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  // Gunakan hook untuk fetch real data
  const { historyData, loading, deleteItem, clearAll, clearingAll, deletingItem } = useScanHistory({
    search: filterText,
    sortBy: sortOrder,
  })

  // Handle viewing details of an item
  const handleViewDetails = (item: any) => {
    setSelectedItem(item)
    setShowDetailDialog(true)
  }

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="ml-3 text-gray-500">Memuat riwayat...</p>
              </div>
            ) : historyData.length === 0 ? (
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
                  {historyData.map((item) => (
                    <ScanHistoryCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      scientificName={item.scientificName}
                      imageUrl={item.imageUrl}
                      accuracy={item.accuracy}
                      date={item.date}
                      conservationStatus={item.conservationStatus}
                      onView={() => handleViewDetails(item)}
                      onDelete={() => deleteItem(item.id)}
                      showActions={true}
                      compact={false}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="text-xs text-neutral-500">
              {historyData.length} item ditampilkan
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
                <Button
                  variant="destructive"
                  onClick={clearAll}
                  disabled={clearingAll}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {clearingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus Semua
                    </>
                  )}
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
