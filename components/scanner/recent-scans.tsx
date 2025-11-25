"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, Loader2, X } from "lucide-react"
import { useRecentScans } from "@/hooks/use-recent-scans"
import { ScanHistoryCard } from "./scan-history-card"
import { ScanHistory } from "./scan-history"

export function RecentScans() {
    const { recentScans, isLoading } = useRecentScans()
    const [showQuickView, setShowQuickView] = useState(false)
    const [showFullHistory, setShowFullHistory] = useState(false)

    if (isLoading) {
        return null // Tidak tampilkan loading di FAB
    }

    if (recentScans.length === 0) {
        return null // Tidak tampilkan FAB jika belum ada scan
    }

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => setShowQuickView(true)}
                className="fixed bottom-6 right-6 z-40 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Badge untuk jumlah scan */}
                {recentScans.length > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg border-2 border-white"
                    >
                        {recentScans.length}
                    </motion.div>
                )}

                {/* Button utama */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                    <History className="h-6 w-6" />
                </div>

                {/* Tooltip */}
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Riwayat Scan Terbaru
                </span>
            </motion.button>

            {/* Quick View Modal - Pop up sederhana */}
            <AnimatePresence>
                {showQuickView && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQuickView(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-6 right-6 z-50 w-full max-w-md max-h-[80vh] overflow-hidden"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                            <History className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Riwayat Terbaru</h3>
                                            <p className="text-sm text-gray-600">
                                                {recentScans.length} identifikasi terakhir
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowQuickView(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="p-4 space-y-3 max-h-[calc(80vh-180px)] overflow-y-auto">
                                    <AnimatePresence>
                                        {recentScans.map((scan, index) => (
                                            <motion.div
                                                key={scan.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <ScanHistoryCard
                                                    id={scan.id}
                                                    name={scan.name}
                                                    scientificName={scan.scientificName}
                                                    imageUrl={scan.imageUrl}
                                                    accuracy={scan.accuracy}
                                                    date={scan.date}
                                                    conservationStatus={scan.conservationStatus}
                                                    compact={true}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setShowQuickView(false)
                                            setShowFullHistory(true)
                                        }}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors"
                                    >
                                        Lihat Semua Riwayat
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Full History Dialog */}
            <ScanHistory isOpen={showFullHistory} onOpenChange={setShowFullHistory} />
        </>
    )
}
