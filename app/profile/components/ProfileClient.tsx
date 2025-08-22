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
    LogOut,
    MapPin,
    Calendar,
    ExternalLink,
    Mail,
    Globe,
    Lock,
    Bell,
    Search,
    FileText,
    LayoutDashboard,
    History,
    Menu,
    X,
} from "lucide-react"
import EditProfileModal from "./EditProfileModal"
import { AvatarUpload } from "./AvatarUpload"
import { useMobile } from "@/hooks/use-mobile"

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
        { icon: <User className="h-4 w-4" />, label: "Profile", href: "/profile", active: true },
        { icon: <Settings className="h-4 w-4" />, label: "Pengaturan", href: "/profile/settings" },
        { icon: <BookmarkIcon className="h-4 w-4" />, label: "Bookmark", href: "/profile/bookmarks" },
        { icon: <Camera className="h-4 w-4" />, label: "Scan History", href: "/profile/scans" },
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
                                w-70 bg-white border-r border-gray-200 flex flex-col
                            `}
                        >
                            {/* Close button for mobile */}
                            {isMobile && (
                                <div className="flex justify-end p-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            )}

                            {/* Navigation */}
                            <nav className="flex-1 px-4 space-y-2">
                                {sidebarItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                            ${item.active
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* User Section */}
                            <div className="p-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 p-2 rounded-lg">
                                    <AvatarUpload
                                        currentAvatar={optimisticProfile.avatar_url}
                                        userName={optimisticProfile.full_name || optimisticProfile.email}
                                        onOptimisticUpdate={handleAvatarUpdate}
                                        size="sm"
                                        userId={optimisticProfile.id}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {optimisticProfile.full_name || "User"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{optimisticProfile.email}</p>
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
                <main className="flex-1 overflow-hidden">
                    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                        {/* Profile Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Cover Image */}
                            <div className="h-32 sm:h-48 bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
                                {/* Avatar */}
                                <div className="absolute -bottom-8 sm:-bottom-12 left-4 sm:left-6">
                                    <AvatarUpload
                                        currentAvatar={optimisticProfile.avatar_url}
                                        userName={optimisticProfile.full_name || optimisticProfile.email}
                                        onOptimisticUpdate={handleAvatarUpdate}
                                        size="lg"
                                        userId={optimisticProfile.id}
                                    />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="pt-10 sm:pt-14 px-4 sm:px-6 pb-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <h1 className="text-xl font-bold text-gray-900">
                                                {optimisticProfile.full_name || "User"}
                                            </h1>
                                            <Badge variant="outline" className="w-fit">
                                                {optimisticProfile.role}
                                            </Badge>
                                        </div>

                                        <p className="text-gray-500 text-sm mt-1">{optimisticProfile.email}</p>

                                        <div className="flex flex-wrap gap-4 mt-3">
                                            {optimisticProfile.location && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4 mr-1 text-emerald-500" />
                                                    <span>{optimisticProfile.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1 text-emerald-500" />
                                                <span>Bergabung {format(new Date(optimisticProfile.created_at), "MMM yyyy", { locale: id })}</span>
                                            </div>
                                            {optimisticProfile.website && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Globe className="h-4 w-4 mr-1 text-emerald-500" />
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
                                            <p className="text-gray-600 text-sm mt-3 max-w-2xl leading-relaxed">
                                                {optimisticProfile.bio}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </div>
                                </div>
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
