"use client"

import { motion } from "framer-motion"
import { History, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRecentScans } from "@/hooks/use-recent-scans"
import { Badge } from "@/components/ui/badge"

export function RecentScansPreview() {
    const { recentScans, isLoading } = useRecentScans()

    // Feature flag for scan history
    const showScanHistory = process.env.NEXT_PUBLIC_FEATURE_SCAN_HISTORY === 'true'

    // Only show 3 most recent
    const previewScans = recentScans.slice(0, 3)

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <History className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Scan Terbaru</h2>
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
            </div>
        )
    }

    if (previewScans.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <History className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Scan Terbaru</h2>
                </div>
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <History className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Belum ada scan</p>
                    <p className="text-gray-400 text-xs mt-1">Mulai scan untuk melihat riwayat</p>
                    <Link
                        href="/scanner"
                        className="inline-flex items-center gap-2 mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium hover:underline"
                    >
                        Mulai Scan
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        )
    }

    const getConservationColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case "critically endangered":
            case "cr":
                return "bg-red-100 text-red-700 border-red-200"
            case "endangered":
            case "en":
                return "bg-orange-100 text-orange-700 border-orange-200"
            case "vulnerable":
            case "vu":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            case "near threatened":
            case "nt":
                return "bg-blue-100 text-blue-700 border-blue-200"
            case "least concern":
            case "lc":
                return "bg-green-100 text-green-700 border-green-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-lg shadow-md shadow-emerald-200">
                            <History className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Scan Terbaru</h2>
                            <p className="text-xs text-gray-600">3 identifikasi terakhir</p>
                        </div>
                    </div>
                    {showScanHistory && (
                        <Link
                            href="/profile/scans"
                            className="text-sm text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline"
                        >
                            Lihat Semua
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Scans List */}
            <div className="p-4 space-y-3">
                {previewScans.map((scan, index) => (
                    <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-200 group"
                    >
                        {/* Image */}
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                            {scan.imageUrl ? (
                                <Image
                                    src={scan.imageUrl}
                                    alt={scan.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <History className="h-6 w-6 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                                {scan.name}
                            </h3>
                            <p className="text-xs text-gray-500 italic truncate">
                                {scan.scientificName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">
                                    {format(new Date(scan.date), "dd MMM yyyy", { locale: id })}
                                </span>
                                {scan.conservationStatus && (
                                    <Badge variant="outline" className={`text-xs px-2 py-0 ${getConservationColor(scan.conservationStatus)}`}>
                                        {scan.conservationStatus}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Accuracy */}
                        <div className="flex-shrink-0 text-right">
                            <div className="text-lg font-bold text-emerald-600">
                                {scan.accuracy.toFixed(1)}%
                            </div>
                            <p className="text-xs text-gray-500">akurasi</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            {showScanHistory && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center">
                    <Link
                        href="/profile/scans"
                        className="text-sm text-gray-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 hover:underline"
                    >
                        Lihat semua {recentScans.length} scan
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    )
}
