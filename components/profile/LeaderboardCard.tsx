"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, TrendingUp, Crown, Loader2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getLeaderboard } from "@/lib/actions/scan-history-actions"

type LeaderboardEntry = {
    user_id: string
    full_name: string | null
    avatar_url: string | null
    total_scans: number
    average_accuracy: number
    rank: number
}

export function LeaderboardCard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchLeaderboard() {
            const { data } = await getLeaderboard(10)
            if (data) {
                setLeaderboard(data)
            }
            setIsLoading(false)
        }
        fetchLeaderboard()
    }, [])

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-5 w-5 text-yellow-500" />
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />
            case 3:
                return <Medal className="h-5 w-5 text-amber-600" />
            default:
                return null
        }
    }

    const getRankBadgeColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-200"
            case 2:
                return "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-200"
            case 3:
                return "bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-200"
            default:
                return "bg-gray-100 text-gray-600"
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Leaderboard</h2>
                </div>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
            </div>
        )
    }

    if (leaderboard.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Leaderboard</h2>
                </div>
                <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Belum ada data leaderboard</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-yellow-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500 rounded-lg shadow-md shadow-yellow-200">
                        <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
                        <p className="text-xs text-gray-600">Top Scanner Teratas</p>
                    </div>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="p-4 space-y-2">
                {leaderboard.map((entry, index) => (
                    <motion.div
                        key={entry.user_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                            flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                            ${entry.rank <= 3
                                ? 'bg-gradient-to-r from-yellow-50/50 to-amber-50/50 border-yellow-200 shadow-sm'
                                : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                            }
                        `}
                    >
                        {/* Rank */}
                        <div className="flex-shrink-0">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                ${getRankBadgeColor(entry.rank)}
                            `}>
                                {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
                            </div>
                        </div>

                        {/* Avatar & Name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage
                                    src={entry.avatar_url || undefined}
                                    alt={entry.full_name || "User"}
                                />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                                    {(entry.full_name || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {entry.full_name || "Anonymous User"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {entry.average_accuracy.toFixed(1)}% akurasi rata-rata
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-shrink-0 text-right">
                            <p className="text-lg font-bold text-emerald-600">
                                {entry.total_scans}
                            </p>
                            <p className="text-xs text-gray-500">scan</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
