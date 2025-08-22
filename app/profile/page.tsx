"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Heart,
  Eye,
  ExternalLink,
  Mail,
  Globe,
  Lock,
  Bell,
  Moon,
  Search,
  AlertTriangle,
  LayoutDashboard,
  FileText,
  Home,
  Menu,
  X,
  History,
  Trash2,
  Clock,
  Filter,
  Download,
  SortDesc,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useMobile } from "@/hooks/use-mobile"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useScanHistory } from "@/hooks/use-scan-history"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { EditProfileModal } from "@/components/profile/edit-profile-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Navigation items for sidebar

export default function ProfilePage() {
  const isMobile = useMobile()
  const { profile, loading, updating, uploadingAvatar, updateProfile, uploadAvatar, removeAvatar } = useUserProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "accuracy">("newest")
  const [filterText, setFilterText] = useState("")

  // Use scan history with filters
  const {
    historyData,
    loading: historyLoading,
    deleteItem,
    clearAll,
    deletingItem,
    clearingAll
  } = useScanHistory({
    search: filterText,
    sortBy: sortOrder
  })

  const handleSaveProfile = async (formData: any) => {
    await updateProfile(formData)
  }

  const handleUploadAvatar = async (file: File) => {
    try {
      await uploadAvatar(file)
      return true
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      return false
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar()
      return true
    } catch (error) {
      console.error('Failed to remove avatar:', error)
      return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Cover Photo Skeleton */}
              <div className="h-32 bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=800')] opacity-10 mix-blend-overlay"></div>
              </div>

              {/* Profile Content Skeleton */}
              <div className="px-6 pb-6 relative">
                {/* Avatar Skeleton */}
                <div className="absolute -top-12 left-6 ring-4 ring-white rounded-full">
                  <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Profile Info Skeleton */}
                <div className="pt-16">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="flex gap-4">
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Skeleton */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Gagal memuat profil</p>
          <Button onClick={() => window.location.reload()}>
            Muat Ulang
          </Button>
        </div>
      </div>
    )
  }

  const handleDeleteItem = (id: string) => {
    deleteItem(id)
  }

  const handleClearHistory = () => {
    clearAll()
  }

  // Navigation items for sidebar
  const navItems = [
    { icon: <User className="h-5 w-5" />, label: "Profil", href: "/profile", active: true },
    { icon: <Search className="h-5 w-5" />, label: "Taksonomi", href: "/taxonomy" },
    { icon: <Camera className="h-5 w-5" />, label: "Scanner", href: "/scanner" },
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Radial View", href: "/radial" },
    { icon: <FileText className="h-5 w-5" />, label: "Tentang", href: "/tentang" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`${isMobile ? "fixed inset-y-0 left-0 z-50" : "sticky top-0 h-screen"
              } w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 p-1.5 rounded-md">
                  <Search className="h-5 w-5 text-emerald-600" />
                </div>
                <h1 className="font-bold text-emerald-800">Felidae Learn</h1>
              </div>
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <span
                    className={`p-1.5 rounded-md ${item.active ? "bg-emerald-100 text-emerald-600" : "text-gray-500"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <AvatarUpload
                  currentAvatar={profile.avatar_url}
                  userName={profile.full_name || profile.email}
                  onUpload={handleUploadAvatar}
                  onRemove={handleRemoveAvatar}
                  uploading={uploadingAvatar}
                  size="sm"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {!sidebarOpen && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="h-8 w-8 sm:h-10 sm:w-10">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
              <h1 className="text-lg sm:text-xl font-bold text-emerald-800 hidden sm:block">Dashboard Profil</h1>
              <h1 className="text-base font-bold text-emerald-800 sm:hidden">Profil</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge
                variant="outline"
                className="hidden md:flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                Online
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 h-8 w-8 sm:h-9 sm:w-9">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 h-8 w-8 sm:h-9 sm:w-9">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Cover Photo */}
              <div className="h-24 sm:h-32 bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=800')] opacity-10 mix-blend-overlay"></div>
              </div>

              {/* Profile Content */}
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 relative">
                {/* Avatar */}
                <div className="absolute -top-8 sm:-top-12 left-4 sm:left-6 ring-2 sm:ring-4 ring-white rounded-full">
                  <AvatarUpload
                    currentAvatar={profile.avatar_url}
                    userName={profile.full_name || profile.email}
                    onUpload={handleUploadAvatar}
                    onRemove={handleRemoveAvatar}
                    uploading={uploadingAvatar}
                    size="lg"
                  />
                </div>

                {/* Profile Info */}
                <div className="pt-10 sm:pt-14 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-bold text-gray-900">{profile.full_name || "User"}</h1>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal bg-emerald-50 text-emerald-700 border-emerald-200 w-fit"
                      >
                        {profile.role === 'admin' ? 'Admin' : 'Pahlawan'}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{profile.email}</p>

                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
                      {profile.location && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1 text-emerald-500 flex-shrink-0" />
                        <span>Bergabung {format(new Date(profile.created_at), "MMM yyyy", { locale: id })}</span>
                      </div>
                      {profile.website && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Globe className="h-3 w-3 mr-1 text-emerald-500 flex-shrink-0" />
                          <a
                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-600 hover:underline transition-colors truncate"
                          >
                            {profile.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>

                    {profile.bio && (
                      <p className="text-gray-600 text-sm mt-3 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">{profile.bio}</p>
                    )}
                  </div>

                  <div className="flex flex-row sm:flex-col lg:flex-row gap-2 mt-2 lg:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 px-3 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex-1 sm:flex-none"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Edit Profil</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 px-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex-1 sm:flex-none"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Keluar</span>
                      <span className="sm:hidden">Logout</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 sm:mb-8 grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4"
          >
            {[
              { value: "24", label: "Disimpan", icon: <BookmarkIcon className="h-4 w-4 text-emerald-500" /> },
              { value: "156", label: "Identifikasi", icon: <Search className="h-4 w-4 text-emerald-500" /> },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">{stat.icon}</div>
                  <p className="text-base sm:text-lg font-semibold text-emerald-600">{stat.value}</p>
                </div>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full mb-4 sm:mb-6 bg-white shadow-sm border border-gray-100 rounded-xl p-1 grid grid-cols-3">
                <TabsTrigger
                  value="profile"
                  className="text-xs rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 transition-all px-2 py-2"
                >
                  <User className="h-3 w-3 mr-1 sm:mr-1.5" />
                  <span className="hidden sm:inline">Profil</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-xs rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 transition-all px-2 py-2"
                >
                  <History className="h-3 w-3 mr-1 sm:mr-1.5" />
                  <span className="hidden sm:inline">Riwayat</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="text-xs rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 transition-all px-2 py-2"
                >
                  <Settings className="h-3 w-3 mr-1 sm:mr-1.5" />
                  <span className="hidden sm:inline">Pengaturan</span>
                  <span className="sm:hidden">Setting</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <h3 className="text-sm font-medium text-gray-900">Informasi Profil</h3>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="p-2 sm:p-2.5 bg-white rounded-lg shadow-sm flex-shrink-0">
                          <Mail className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-0.5">Email</p>
                          <p className="text-sm font-medium truncate">{profile.email}</p>
                        </div>
                      </div>

                      {profile.location && (
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="p-2 sm:p-2.5 bg-white rounded-lg shadow-sm flex-shrink-0">
                            <MapPin className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">Lokasi</p>
                            <p className="text-sm font-medium truncate">{profile.location}</p>
                          </div>
                        </div>
                      )}

                      {profile.website && (
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="p-2 sm:p-2.5 bg-white rounded-lg shadow-sm flex-shrink-0">
                            <ExternalLink className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">Website</p>
                            <a
                              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-emerald-600 hover:underline truncate block"
                            >
                              {profile.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="p-2 sm:p-2.5 bg-white rounded-lg shadow-sm flex-shrink-0">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-0.5">Bergabung</p>
                          <p className="text-sm font-medium">
                            {format(new Date(profile.created_at), "d MMMM yyyy", { locale: id })}
                          </p>
                        </div>
                      </div>

                      {profile.last_sign_in_at && (
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="p-2 sm:p-2.5 bg-white rounded-lg shadow-sm flex-shrink-0">
                            <Clock className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 mb-0.5">Terakhir Online</p>
                            <p className="text-sm font-medium">
                              {format(new Date(profile.last_sign_in_at), "d MMMM yyyy, HH:mm", { locale: id })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-sm font-medium text-gray-900">Riwayat Scan</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200 w-fit"
                      >
                        {historyData.length} Total
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <Input
                          placeholder="Cari berdasarkan nama..."
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          className="pl-9"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        {filterText && (
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setFilterText("")}
                          >
                            <X className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SortDesc className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Urutkan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="oldest">Terlama</SelectItem>
                            <SelectItem value="accuracy">Akurasi Tertinggi</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" className="flex-shrink-0">
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

                          <Button variant="outline" size="icon" className="flex-shrink-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      {historyLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                          <span className="ml-2 text-gray-600">Memuat riwayat...</span>
                        </div>
                      ) : historyData.length === 0 ? (
                        <div className="text-center py-12 text-neutral-500">
                          <Search className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                          <p className="text-lg font-medium mb-2">Tidak Ada Riwayat</p>
                          <p className="text-sm text-neutral-400">
                            {filterText
                              ? "Tidak ada hasil yang cocok dengan pencarian Anda"
                              : "Belum ada riwayat scan"}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          <AnimatePresence>
                            {historyData.map((item) => (
                              <motion.div
                                key={`history-${item.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="border border-emerald-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group"
                              >
                                <div className="flex flex-col sm:flex-row">
                                  <div className="relative h-40 sm:h-32 sm:w-32 flex-shrink-0">
                                    <Avatar className="w-full h-full rounded-none sm:rounded-l-lg">
                                      <AvatarImage
                                        src={item.imageUrl || "/placeholder.svg"}
                                        alt={item.name}
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                      />
                                      <AvatarFallback className="w-full h-full rounded-none bg-gray-200 flex items-center justify-center">
                                        <Camera className="h-8 w-8 text-gray-400" />
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 to-transparent sm:rounded-l-lg" />
                                    <Badge className="absolute top-2 right-2 bg-emerald-500 text-white border-emerald-600">
                                      {item.accuracy.toFixed(1)}%
                                    </Badge>
                                  </div>
                                  <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                                    <div>
                                      <h4 className="font-medium text-base sm:text-lg text-gray-900 mb-1">{item.name}</h4>
                                      <p className="text-sm text-gray-600 italic mb-2 sm:mb-3">
                                        {item.scientificName}
                                      </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-xs text-neutral-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span className="hidden sm:inline">{format(item.date, "d MMM yyyy", { locale: id })}</span>
                                        <span className="sm:hidden">{format(item.date, "d/M/yy", { locale: id })}</span>
                                        <Clock className="h-3 w-3 ml-2 mr-1" />
                                        {format(item.date, "HH:mm", { locale: id })}
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => {
                                            // Navigate to taxonomy page with this species
                                            toast("Navigasi ke halaman taksonomi akan segera tersedia")
                                          }}
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
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {historyData.length > 0 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="text-xs text-neutral-500 text-center sm:text-left">
                          {historyData.length} item ditampilkan
                          {filterText && ` (filter: "${filterText}")`}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleClearHistory}
                          disabled={clearingAll}
                          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                        >
                          {clearingAll ? (
                            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                          )}
                          Hapus Semua
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 space-y-5">
                    <h3 className="text-sm font-medium text-gray-900">Pengaturan Akun</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Moon className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Mode Gelap</p>
                            <p className="text-xs text-gray-500">Aktifkan tampilan gelap</p>
                          </div>
                        </div>
                        <Switch className="data-[state=checked]:bg-emerald-600" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Bell className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Notifikasi Email</p>
                            <p className="text-xs text-gray-500">Terima pembaruan melalui email</p>
                          </div>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Globe className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Profil Publik</p>
                            <p className="text-xs text-gray-500">Izinkan orang lain melihat profil Anda</p>
                          </div>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-emerald-600" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                      >
                        <Lock className="h-3 w-3 mr-1.5" />
                        Ubah Kata Sandi
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        profile={profile}
        onSave={handleSaveProfile}
        isUpdating={updating}
      />
    </div>
  )
}
