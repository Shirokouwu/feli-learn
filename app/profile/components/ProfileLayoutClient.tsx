"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  User,
  Menu,
  X,
  Scan,
  LayoutGrid,
  Home,
  Info,
  History,
  Database,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface ProfileLayoutClientProps {
  children: React.ReactNode
  userInfo?: {
    full_name?: string | null
    email: string
    role: string
    avatar_url?: string | null
  }
}

export function ProfileLayoutClient({ children, userInfo }: ProfileLayoutClientProps) {
  const isMobile = useMobile()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  // Feature flags from environment variables
  const showScanHistory = process.env.NEXT_PUBLIC_FEATURE_SCAN_HISTORY === 'true'

  const sidebarItems = [
    // Profile Section
    {
      category: "Profile",
      items: [
        { icon: <User className="h-4 w-4" />, label: "Profile Saya", href: "/profile" },
        // Conditional: Only show if feature flag is enabled
        ...(showScanHistory ? [{ icon: <History className="h-4 w-4" />, label: "Riwayat Scan", href: "/profile/scans" }] : []),
      ]
    },
    // Main Navigation
    {
      category: "Utama",
      items: [
        { icon: <Home className="h-4 w-4" />, label: "Beranda", href: "/" },
        { icon: <Scan className="h-4 w-4" />, label: "Scanner", href: "/scanner" },
        { icon: <LayoutGrid className="h-4 w-4" />, label: "Radial Taksonomi", href: "/radial" },
        { icon: <Database className="h-4 w-4" />, label: "Felidae Explorer", href: "/database-explorer" },
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
            <h1 className="font-semibold text-gray-900">
              {pathname === "/profile" ? "Profile" : "Riwayat Scan"}
            </h1>
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
              <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
                {sidebarItems.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            onClick={() => isMobile && setSidebarOpen(false)}
                            className={`
                                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                                            ${isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                                                        `}
                          >
                            <div className={`
                                                            ${isActive
                                ? 'text-emerald-600'
                                : 'text-gray-400 group-hover:text-gray-600'
                              }
                                                        `}>
                              {item.icon}
                            </div>
                            <span>{item.label}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* User Section */}
              {userInfo && (
                <>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm shadow-gray-200/50">
                      {userInfo.avatar_url ? (<>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-green-200">
                          <img src={userInfo.avatar_url} alt="User Avatar" className="object-cover w-full h-full" />
                        </div>
                      </>) : (
                        <>
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm">
                            {(userInfo.full_name || userInfo.email).charAt(0).toUpperCase()}
                          </div>
                        </>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userInfo.full_name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{userInfo.role}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
          {children}
        </main>
      </div>
    </div>
  )
}
