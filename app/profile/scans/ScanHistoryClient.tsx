"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    History,
    SearchX,
    Trash2,
    Filter,
    SortDesc,
    X,
    AlertTriangle,
    ChevronRight,
    Loader2,
    ArrowLeft,
    TrendingUp,
    Target,
    Calendar as CalendarIcon,
    Award,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getConservationStatusColor } from "@/lib/conservation-utils"
import { useScanHistory } from "@/hooks/use-scan-history"
import { useScanStats } from "@/hooks/use-recent-scans"
import { ScanHistoryCard } from "@/components/scanner/scan-history-card"

export default function ScanHistoryClient() {
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "accuracy">("newest")
    const [filterText, setFilterText] = useState("")
    const [selectedItem, setSelectedItem] = useState<any | null>(null)
    const [showDetailDialog, setShowDetailDialog] = useState(false)

    // Fetch data
    const { historyData, loading, deleteItem, clearAll, clearingAll } = useScanHistory({
        search: filterText,
        sortBy: sortOrder,
    })

    const { stats, isLoading: statsLoading } = useScanStats()

    // Handle viewing details
    const handleViewDetails = (item: any) => {
        setSelectedItem(item)
        setShowDetailDialog(true)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <History className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Riwayat Scan</h1>
                                <p className="text-sm text-gray-600">Semua identifikasi yang telah dilakukan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {statsLoading ? (
                        <div className="col-span-4 flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                        </div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Target className="h-5 w-5 text-emerald-600" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_scans}</p>
                                <p className="text-sm text-gray-600">Total Scan</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stats.average_accuracy}%</p>
                                <p className="text-sm text-gray-600">Rata-rata Akurasi</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Award className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stats.unique_species}</p>
                                <p className="text-sm text-gray-600">Spesies Unik</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <CalendarIcon className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stats.recent_scans_count}</p>
                                <p className="text-sm text-gray-600">7 Hari Terakhir</p>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Cari berdasarkan nama spesies..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                className="pl-9"
                            />
                            <SearchX className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            {filterText && (
                                <button
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setFilterText("")}
                                >
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                            <SelectTrigger className="w-[200px]">
                                <SortDesc className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="oldest">Terlama</SelectItem>
                                <SelectItem value="accuracy">Akurasi Tertinggi</SelectItem>
                            </SelectContent>
                        </Select>

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
                </div>

                {/* History Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        <p className="ml-3 text-gray-500">Memuat riwayat...</p>
                    </div>
                ) : historyData.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <SearchX className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2 text-gray-900">Tidak Ada Riwayat</p>
                        <p className="text-sm text-gray-500 mb-6">
                            {filterText
                                ? "Tidak ada hasil yang cocok dengan pencarian Anda"
                                : "Belum ada riwayat scan. Mulai scan spesies untuk melihat riwayat di sini!"}
                        </p>
                        <Link href="/scanner">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                Mulai Scan
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {historyData.map((item: any) => (
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

                        <div className="mt-6 text-center text-sm text-gray-500">
                            Menampilkan {historyData.length} dari {stats.total_scans} riwayat scan
                            {filterText && ` (filter: "${filterText}")`}
                        </div>
                    </>
                )}
            </div>

            {/* Detail Dialog */}
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
                                        <span className="text-sm font-medium text-gray-700">Famili</span>
                                        <span className="text-sm text-emerald-700">{selectedItem.family || "-"}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100">
                                        <span className="text-sm font-medium text-gray-700">Genus</span>
                                        <span className="text-sm text-emerald-700">{selectedItem.genus || "-"}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100">
                                        <span className="text-sm font-medium text-gray-700">Tanggal Scan</span>
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
                            <Link href="/radial">
                                <Button
                                    onClick={() => setShowDetailDialog(false)}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    Lihat di Taksonomi
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
