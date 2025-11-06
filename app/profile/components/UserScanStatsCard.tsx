"use client"

import { motion } from "framer-motion"
import { Scan, TrendingUp, Calendar } from "lucide-react"
import { useUserScanStats } from "@/hooks"

export function UserScanStatsCard() {
    const { data: stats, isLoading, isError } = useUserScanStats()

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 border border-gray-100">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-32 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-emerald-100 rounded-lg"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-12 w-24 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse"></div>
                            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse"></div>
                            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !stats) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Statistik Scanner</h3>
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Scan className="h-5 w-5 text-red-600" />
                    </div>
                </div>
                <div className="text-center py-6">
                    <p className="text-sm text-red-600">Gagal memuat statistik</p>
                    <p className="text-xs text-gray-500 mt-1">Silakan refresh halaman</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden relative"
        >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Statistik Scanner Anda</h3>
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <Scan className="h-5 w-5 text-emerald-600" />
                    </div>
                </div>

                {/* Total Scans - Main Stat */}
                <div className="mb-6">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <p className="text-4xl font-bold text-gray-900">
                            {stats.totalScans?.toLocaleString() || 0}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Total scan yang Anda lakukan</p>
                    </motion.div>

                    {stats.totalScans === 0 && (
                        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                            <p className="text-xs text-emerald-700">
                                🎉 Mulai scan pertama Anda untuk melihat statistik!
                            </p>
                        </div>
                    )}
                </div>

                {/* Today's Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="flex items-start gap-3"
                    >
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.todayScans?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-gray-500">Scan hari ini</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="flex items-start gap-3"
                    >
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalScans > 0
                                    ? Math.round((stats.todayScans / stats.totalScans) * 100)
                                    : 0}%
                            </p>
                            <p className="text-xs text-gray-500">Dari total</p>
                        </div>
                    </motion.div>
                </div>

                {/* Motivational Message */}
                {stats.totalScans > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100"
                    >
                        <p className="text-xs text-gray-700">
                            {stats.totalScans >= 100
                                ? "🏆 Luar biasa! Anda sudah menjadi master scanner!"
                                : stats.totalScans >= 50
                                    ? "🌟 Hebat! Terus tingkatkan pengetahuan Anda!"
                                    : stats.totalScans >= 10
                                        ? "👏 Bagus! Anda semakin mahir menggunakan scanner!"
                                        : "🚀 Terus jelajahi dan pelajari spesies baru!"}
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
