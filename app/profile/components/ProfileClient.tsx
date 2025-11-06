"use client"

import { useState, useOptimistic, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    User,
    Settings,
    BookmarkIcon,
    Camera,
    Edit,
    MapPin,
    Calendar,
    Globe,
    Menu,
    X,
    Scan,
    LayoutGrid,
    Home,
    Info,
    History,
} from "lucide-react"
import EditProfileModal from "./EditProfileModal"
import { AvatarUpload } from "./AvatarUpload"
import { useMobile } from "@/hooks/use-mobile"
import { UserScanStatsCard } from "./UserScanStatsCard"

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
    const isMobile = useMobile()
    const [isEditing, setIsEditing] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

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

    const sidebarItems = [
        // Main Navigation
        {
            category: "Utama",
            items: [
                { icon: <Home className="h-4 w-4" />, label: "Beranda", href: "/" },
                { icon: <Scan className="h-4 w-4" />, label: "Scanner", href: "/scanner" },
                { icon: <LayoutGrid className="h-4 w-4" />, label: "Taksonomi", href: "/radial" },
            ]
        },
        // Profile Section
        {
            category: "Profile",
            items: [
                { icon: <User className="h-4 w-4" />, label: "Profile Saya", href: "/profile", active: true },
                { icon: <History className="h-4 w-4" />, label: "Riwayat Scan", href: "/profile/scans" },
                { icon: <BookmarkIcon className="h-4 w-4" />, label: "Bookmark", href: "/profile/bookmarks" },
                { icon: <Settings className="h-4 w-4" />, label: "Pengaturan", href: "/profile/settings" },
            ]
        },
        // Info Section
        {
            category: "Informasi",
            items: [
                { icon: <Info className="h-4 w-4" />, label: "Tentang", href: "/tentang" },
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            {isMobile && (
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="font-semibold text-gray-900">Profile</h1>
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    {(sidebarOpen || !isMobile) && (
                        <motion.aside
                            initial={isMobile ? { x: -280 } : {}}
                            animate={{ x: 0 }}
                            exit={isMobile ? { x: -280 } : {}}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className={`
                                ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'sticky top-0 h-screen'}
                                w-72 bg-white border-r border-gray-100 flex flex-col shadow-lg shadow-gray-200/30
                            `}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                        <Scan className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-bold text-lg text-gray-900">FeliLearn</span>
                                </div>
                                {isMobile && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 py-4 space-y-6">
                                {sidebarItems.map((section, sectionIndex) => (
                                    <div key={sectionIndex}>
                                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            {section.category}
                                        </h3>
                                        <div className="space-y-1">
                                            {section.items.map((item, itemIndex) => (
                                                <Link
                                                    key={itemIndex}
                                                    href={item.href}
                                                    className={`
                                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                                        ${item.active
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }
                                                    `}
                                                >
                                                    <div className={`
                                                        ${item.active
                                                            ? 'text-emerald-600'
                                                            : 'text-gray-400 group-hover:text-gray-600'
                                                        }
                                                    `}>
                                                        {item.icon}
                                                    </div>
                                                    <span>{item.label}</span>
                                                    {item.active && (
                                                        <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </nav>

                            {/* User Section */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm shadow-gray-200/50">
                                    <AvatarUpload
                                        currentAvatar={optimisticProfile.avatar_url}
                                        userName={optimisticProfile.full_name || optimisticProfile.email}
                                        onOptimisticUpdate={handleAvatarUpdate}
                                        size="sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {optimisticProfile.full_name || "User"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{optimisticProfile.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Overlay for mobile */}
                {isMobile && sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-hidden bg-gray-50">
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
                                            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Detailed Scan Stats Card */}
                            <div className="lg:col-span-2">
                                <UserScanStatsCard />
                            </div>

                            {/* Other Stats */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <BookmarkIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">0</p>
                                            <p className="text-sm text-gray-500">Spesies Disimpan</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-md shadow-gray-200/50 border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <LayoutGrid className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">0</p>
                                            <p className="text-sm text-gray-500">Eksplorasi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href="/scanner"
                                    className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group shadow-sm shadow-gray-200/40 hover:shadow-md hover:shadow-emerald-200/50"
                                >
                                    <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                                        <Scan className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 mt-2">Mulai Scan</span>
                                </Link>

                                <Link
                                    href="/radial"
                                    className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group shadow-sm shadow-gray-200/40 hover:shadow-md hover:shadow-blue-200/50"
                                >
                                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                        <LayoutGrid className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 mt-2">Jelajahi Taksonomi</span>
                                </Link>

                                <Link
                                    href="/profile/scans"
                                    className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group shadow-sm shadow-gray-200/40 hover:shadow-md hover:shadow-purple-200/50"
                                >
                                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                        <History className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 mt-2">Riwayat</span>
                                </Link>

                                <Link
                                    href="/profile/bookmarks"
                                    className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group shadow-sm shadow-gray-200/40 hover:shadow-md hover:shadow-orange-200/50"
                                >
                                    <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                                        <BookmarkIcon className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 mt-2">Bookmark</span>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md shadow-gray-200/50 border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <History className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
                                <p className="text-gray-400 text-xs mt-1">Mulai scan untuk melihat aktivitas Anda</p>
                            </div>
                        </div>
                    </div>
                </main>
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
