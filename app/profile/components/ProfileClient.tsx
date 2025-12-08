"use client"

import { useState, useOptimistic, useCallback } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Edit,
    MapPin,
    Calendar,
    Globe,
    Scan,
    LayoutGrid,
    History,
} from "lucide-react"
import EditProfileModal from "./EditProfileModal"
import { AvatarUpload } from "./AvatarUpload"
import { UserScanStatsCard } from "./UserScanStatsCard"
import { LeaderboardCard } from "@/components/profile/LeaderboardCard"
import { RecentScansPreview } from "@/components/profile/RecentScansPreview"

interface ProfileData {
    id: string
    email: string
    full_name?: string
    avatar_url?: string | null
    bio?: string
    location?: string
    website?: string
    role: string
    created_at: string
    updated_at: string
    last_sign_in_at?: string
}

interface ProfileClientProps {
    profile: ProfileData
}

export default function ProfileClient({ profile }: ProfileClientProps) {
    const [isEditing, setIsEditing] = useState(false)

    // Feature flags from environment variables
    const showRecentScans = process.env.NEXT_PUBLIC_FEATURE_RECENT_SCANS === 'true'
    const showLeaderboard = process.env.NEXT_PUBLIC_FEATURE_LEADERBOARD === 'true'

    // Optimistic updates untuk profile
    const [optimisticProfile, updateOptimisticProfile] = useOptimistic(
        profile,
        (currentProfile, updates: Partial<ProfileData>) => ({
            ...currentProfile,
            ...updates,
        })
    )

    // Memoize callback untuk mencegah re-render berlebihan
    const handleAvatarUpdate = useCallback((avatarUrl: string | null) => {
        updateOptimisticProfile({ avatar_url: avatarUrl })
    }, [updateOptimisticProfile])

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
                {/* Cover Image */}
                <div className="h-32 sm:h-48 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 relative">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 bg-black/5">
                        <div className="absolute top-4 right-4 opacity-20">
                            <Scan className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    {/* Avatar */}
                    <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-6">
                        <AvatarUpload
                            currentAvatar={optimisticProfile.avatar_url}
                            userName={optimisticProfile.full_name || optimisticProfile.email}
                            onOptimisticUpdate={handleAvatarUpdate}
                            size="lg"
                        />
                    </div>
                </div>

                {/* Profile Info */}
                <div className="pt-10 sm:pt-14 px-4 sm:px-6 pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {optimisticProfile.full_name || "User"}
                                </h1>
                                <Badge variant="outline" className="w-fit text-emerald-700 border-emerald-200 bg-emerald-50">
                                    {optimisticProfile.role}
                                </Badge>
                            </div>

                            <p className="text-gray-500 text-sm mt-1">{optimisticProfile.email}</p>

                            <div className="flex flex-wrap gap-4 mt-4">
                                {optimisticProfile.location && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                                        <span>{optimisticProfile.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-emerald-500" />
                                    <span>Bergabung {format(new Date(optimisticProfile.created_at), "MMM yyyy", { locale: id })}</span>
                                </div>
                                {optimisticProfile.website && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Globe className="h-4 w-4 mr-2 text-emerald-500" />
                                        <a
                                            href={optimisticProfile.website.startsWith('http') ? optimisticProfile.website : `https://${optimisticProfile.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-emerald-600 hover:underline transition-colors"
                                        >
                                            {optimisticProfile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {optimisticProfile.bio && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {optimisticProfile.bio}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 cursor-pointer"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Detailed Scan Stats Card */}
                <UserScanStatsCard />

                {/* Leaderboard - Conditional */}
                {showLeaderboard && <LeaderboardCard />}
            </div>

            {/* Recent Scans Preview - Conditional */}
            {showRecentScans && (
                <div className="mb-6">
                    <RecentScansPreview />
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/scanner"
                        className="flex items-center gap-4 p-6 rounded-lg border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group shadow-sm shadow-gray-200/40 hover:shadow-md hover:shadow-emerald-200/50"
                    >
                        <div className="p-4 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                            <Scan className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">Mulai Scan</h3>
                            <p className="text-sm text-gray-500">Identifikasi spesies baru</p>
                        </div>
                    </Link>

                    <Link
                        href="/radial"
                        className="flex items-center gap-4 p-6 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group shadow-sm shadow-gray-200/40 hover:shadow-md hover:shadow-blue-200/50"
                    >
                        <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                            <LayoutGrid className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Jelajahi Taksonomi</h3>
                            <p className="text-sm text-gray-500">Eksplorasi keanekaragaman</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                profile={optimisticProfile}
                onOptimisticUpdate={updateOptimisticProfile}
            />
        </div>
    )
}
