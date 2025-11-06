"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Database, User, LogIn } from "lucide-react"

interface SpeciesBreadcrumbProps {
  speciesName: string
  isLoggedIn?: boolean
  userInfo?: {
    name: string
    email: string
    avatar?: string | null
  }
}

export function SpeciesBreadcrumb({
  speciesName,
  isLoggedIn = false,
  userInfo = { name: "Guest", email: "", avatar: null },
}: SpeciesBreadcrumbProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      // Change appearance when scrolled more than 100px
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[70%] z-50 transition-all duration-300">
      <div
        className={`
          px-4 py-2 rounded-lg border shadow-lg transition-all duration-300
          ${isScrolled ? "bg-white border-neutral-200" : "bg-white/10 backdrop-blur-md border-white/20"}
        `}
      >
        <div className="flex items-center justify-between">
          {/* Breadcrumb Navigation */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className={`
                    flex items-center gap-1 transition-colors
                    ${isScrolled ? "text-neutral-600 hover:text-emerald-600" : "text-white/80 hover:text-white"}
                  `}
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Beranda</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className={isScrolled ? "text-neutral-400" : "text-white/60"} />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/database"
                  className={`
                    flex items-center gap-1 transition-colors
                    ${isScrolled ? "text-neutral-600 hover:text-emerald-600" : "text-white/80 hover:text-white"}
                  `}
                >
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Database</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className={isScrolled ? "text-neutral-400" : "text-white/60"} />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={`
                    font-medium truncate max-w-[120px] sm:max-w-[200px] transition-colors
                    ${isScrolled ? "text-neutral-800" : "text-white"}
                  `}
                >
                  {speciesName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Login Status */}
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {isLoggedIn ? (
              // User sudah login - dengan Avatar
              <div className="flex items-center gap-2">
                <div
                  className={`
                    flex items-center gap-2 text-xs transition-colors
                    ${isScrolled ? "text-neutral-600" : "text-white/80"}
                  `}
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm"></div>
                  <span className="hidden lg:inline">Online</span>
                </div>
                <button
                  onClick={() => router.push('/profile')}
                  className={`
                    flex items-center gap-2 p-1 rounded-full transition-all duration-200
                    ${isScrolled
                      ? "hover:bg-emerald-50"
                      : "hover:bg-white/10"
                    }
                  `}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarImage src={userInfo.avatar || undefined} alt={userInfo.name} />
                    <AvatarFallback className="bg-emerald-500 text-white text-base font-medium">
                      {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            ) : (
              // User belum login
              <div className="flex items-center gap-2">
                <div
                  className={`
                    flex items-center gap-2 text-xs transition-colors
                    ${isScrolled ? "text-neutral-500" : "text-white/60"}
                  `}
                >
                  <div
                    className={`
                      w-2 h-2 rounded-full
                      ${isScrolled ? "bg-neutral-400" : "bg-white/40"}
                    `}
                  ></div>
                  <span className="hidden lg:inline">Guest</span>
                  <span className="lg:hidden">Offline</span>
                </div>
                <button
                  onClick={() => router.push('/login')}
                  className={`
                    flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all duration-200
                    ${isScrolled
                      ? "text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <LogIn className="h-3 w-3" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
