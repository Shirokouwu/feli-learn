"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample scan history data
const SAMPLE_HISTORY_DATA = [
  {
    id: "hist-001",
    name: "Harimau Sumatera",
    scientificName: "Panthera tigris sumatrae",
    imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2940&auto=format&fit=crop",
    accuracy: 98.7,
    date: new Date(2023, 10, 15, 14, 30),
    conservationStatus: "Critically Endangered",
    family: "Felidae",
    genus: "Panthera",
  },
  {
    id: "hist-002",
    name: "Singa Afrika",
    scientificName: "Panthera leo",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=2940&auto=format&fit=crop",
    accuracy: 97.3,
    date: new Date(2023, 10, 14, 9, 45),
    conservationStatus: "Vulnerable",
    family: "Felidae",
    genus: "Panthera",
  },
  {
    id: "hist-003",
    name: "Macan Tutul",
    scientificName: "Panthera pardus",
    imageUrl: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=2940&auto=format&fit=crop",
    accuracy: 95.8,
    date: new Date(2023, 10, 12, 16, 20),
    conservationStatus: "Vulnerable",
    family: "Felidae",
    genus: "Panthera",
  },
  {
    id: "hist-004",
    name: "Kucing Domestik",
    scientificName: "Felis catus",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2943&auto=format&fit=crop",
    accuracy: 99.2,
    date: new Date(2023, 10, 10, 11, 15),
    conservationStatus: "Least Concern",
    family: "Felidae",
    genus: "Felis",
  },
  {
    id: "hist-005",
    name: "Cheetah",
    scientificName: "Acinonyx jubatus",
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?q=80&w=2940&auto=format&fit=crop",
    accuracy: 96.5,
    date: new Date(2023, 10, 8, 13, 50),
    conservationStatus: "Vulnerable",
    family: "Felidae",
    genus: "Acinonyx",
  },
  {
    id: "hist-006",
    name: "Lynx",
    scientificName: "Lynx lynx",
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?q=80&w=2940&auto=format&fit=crop",
    accuracy: 93.1,
    date: new Date(2023, 10, 5, 10, 30),
    conservationStatus: "Least Concern",
    family: "Felidae",
    genus: "Lynx",
  },
]

export default function ProfilePage() {
  const isMobile = useMobile()
  const [isEditing, setIsEditing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  const [userData, setUserData] = useState({
    name: "Andi Wijaya",
    username: "andiwijaya",
    email: "andi.wijaya@example.com",
    bio: "Pecinta kucing dan peneliti taksonomi Felidae. Aktif dalam kegiatan konservasi harimau Sumatera sejak 2020.",
    location: "Semarang, Indonesia",
    website: "andiwijaya.com",
    joinDate: "Januari 2023",
    profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
  })
  const [historyData, setHistoryData] = useState(SAMPLE_HISTORY_DATA)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "accuracy">("newest")
  const [filterText, setFilterText] = useState("")

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profil Disimpan",
      description: "Perubahan profil Anda telah berhasil disimpan",
    })
  }

  const handleDeleteItem = (id: string) => {
    setHistoryData((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Item Dihapus",
      description: "Item riwayat telah dihapus",
    })
  }

  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat scan?")) {
      setHistoryData([])
      toast({
        title: "Riwayat Dihapus",
        description: "Semua riwayat scan telah dihapus",
      })
    }
  }

  // Sort and filter history data
  const processedHistory = historyData
    .filter(
      (item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.scientificName.toLowerCase().includes(filterText.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") return b.date.getTime() - a.date.getTime()
      if (sortOrder === "oldest") return a.date.getTime() - b.date.getTime()
      return b.accuracy - a.accuracy
    })

  // Navigation items for sidebar
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Beranda", href: "/" },
    { icon: <Search className="h-5 w-5" />, label: "Taksonomi", href: "/taxonomy" },
    { icon: <Camera className="h-5 w-5" />, label: "Scanner", href: "/scanner" },
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Radial View", href: "/radial" },
    { icon: <User className="h-5 w-5" />, label: "Profil", href: "/profile", active: true },
    { icon: <FileText className="h-5 w-5" />, label: "Tentang", href: "/tentang" },
    { icon: <Settings className="h-5 w-5" />, label: "Pengaturan", href: "/settings" },
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
            className={`${
              isMobile ? "fixed inset-y-0 left-0 z-50" : "sticky top-0 h-screen"
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
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
                <Avatar className="h-10 w-10 border-2 border-emerald-100">
                  <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{userData.name}</p>
                  <p className="text-xs text-gray-500 truncate">@{userData.username}</p>
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
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl font-bold text-emerald-800 hidden sm:block">Dashboard Profil</h1>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                Online
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=800')] opacity-10 mix-blend-overlay"></div>
              </div>

              {/* Profile Content */}
              <div className="px-6 pb-6 relative">
                {/* Avatar */}
                <div className="absolute -top-12 left-6 ring-4 ring-white rounded-full">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 text-2xl">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-1 right-1 rounded-full h-7 w-7 shadow-sm bg-white hover:bg-gray-100"
                  >
                    <Camera className="h-3 w-3 text-gray-700" />
                  </Button>
                </div>

                {/* Profile Info */}
                <div className="pt-14 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-gray-900">{userData.name}</h1>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        Peneliti
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm">@{userData.username}</p>

                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1 text-emerald-500" />
                        {userData.location}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1 text-emerald-500" />
                        Bergabung {userData.joinDate}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Globe className="h-3 w-3 mr-1 text-emerald-500" />
                        <a
                          href={`https://${userData.website}`}
                          className="hover:text-emerald-600 hover:underline transition-colors"
                        >
                          {userData.website}
                        </a>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-3 max-w-2xl leading-relaxed">{userData.bio}</p>
                  </div>

                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 px-3 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Profil
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 px-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Keluar
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
            className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { value: "24", label: "Disimpan", icon: <BookmarkIcon className="h-4 w-4 text-emerald-500" /> },
              { value: "156", label: "Identifikasi", icon: <Search className="h-4 w-4 text-emerald-500" /> },
              { value: "8", label: "Kontribusi", icon: <Heart className="h-4 w-4 text-emerald-500" /> },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-emerald-50 rounded-lg">{stat.icon}</div>
                  <p className="text-lg font-semibold text-emerald-600">{stat.value}</p>
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
              <TabsList className="w-full mb-6 bg-white shadow-sm border border-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="profile"
                  className="text-xs rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 transition-all"
                >
                  <User className="h-3 w-3 mr-1.5" />
                  Profil
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-xs rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 transition-all"
                >
                  <History className="h-3 w-3 mr-1.5" />
                  Riwayat Scan
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="text-xs rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 transition-all"
                >
                  <Settings className="h-3 w-3 mr-1.5" />
                  Pengaturan
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="profile" className="space-y-6 mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {isEditing ? (
                      <div className="p-6 space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">Edit Profil</h3>
                          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-200">
                            <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                            Sedang Mengedit
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs text-gray-500">
                              Nama
                            </Label>
                            <Input
                              id="name"
                              value={userData.name}
                              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                              className="h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username" className="text-xs text-gray-500">
                              Username
                            </Label>
                            <Input
                              id="username"
                              value={userData.username}
                              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                              className="h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs text-gray-500">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            className="h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-xs text-gray-500">
                            Bio
                          </Label>
                          <Textarea
                            id="bio"
                            value={userData.bio}
                            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                            rows={3}
                            className="text-sm resize-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="location" className="text-xs text-gray-500">
                              Lokasi
                            </Label>
                            <Input
                              id="location"
                              value={userData.location}
                              onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                              className="h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website" className="text-xs text-gray-500">
                              Website
                            </Label>
                            <Input
                              id="website"
                              value={userData.website}
                              onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                              className="h-9 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            className="text-xs h-8 text-gray-500 hover:text-gray-700"
                          >
                            Batal
                          </Button>
                          <Button
                            onClick={handleSaveProfile}
                            className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8"
                            size="sm"
                          >
                            Simpan Perubahan
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 space-y-5">
                        <h3 className="text-sm font-medium text-gray-900">Informasi Profil</h3>

                        <div className="space-y-3">
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="p-2.5 bg-white rounded-lg shadow-sm">
                              <Mail className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Email</p>
                              <p className="text-sm font-medium">{userData.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="p-2.5 bg-white rounded-lg shadow-sm">
                              <MapPin className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Lokasi</p>
                              <p className="text-sm font-medium">{userData.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="p-2.5 bg-white rounded-lg shadow-sm">
                              <ExternalLink className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Website</p>
                              <a
                                href={`https://${userData.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-emerald-600 hover:underline"
                              >
                                {userData.website}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <History className="h-5 w-5 text-emerald-600" />
                          <h3 className="text-sm font-medium text-gray-900">Riwayat Scan</h3>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200"
                        >
                          {processedHistory.length} Total
                        </Badge>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
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

                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {processedHistory.length === 0 ? (
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                              {processedHistory.map((item) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="border border-emerald-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group"
                                >
                                  <div className="relative h-40">
                                    <Image
                                      src={item.imageUrl || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-lg drop-shadow-sm">{item.name}</h4>
                                        <Badge className="bg-emerald-500 text-white border-emerald-600">
                                          {item.accuracy.toFixed(1)}%
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-white/90 italic drop-shadow-sm">
                                        {item.scientificName}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="p-3 flex justify-between items-center">
                                    <div className="flex items-center text-xs text-neutral-500">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {format(item.date, "d MMM yyyy", { locale: id })}
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
                                          toast({
                                            title: "Navigasi",
                                            description: "Navigasi ke halaman taksonomi akan segera tersedia",
                                          })
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
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {historyData.length > 0 && (
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="text-xs text-neutral-500">
                            {processedHistory.length} item ditampilkan
                            {filterText && ` (filter: "${filterText}")`}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleClearHistory}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
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
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
