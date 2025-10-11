"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Menu, 
  Sparkles, 
  Database, 
  Brain, 
  Users, 
  BookOpen, 
  User, 
  LogOut,
  Settings
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUserClient } from "@/lib/auth-client"
import { signOut } from "@/app/(auth)/_action"

const components: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "AI Scanner Pro",
    href: "/scanner",
    description: "Identifikasi spesies Felidae dengan akurasi hingga 98.5% menggunakan AI canggih.",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    title: "Pembelajaran Interaktif",
    href: "/learn",
    description: "Sistem pembelajaran cerdas dengan visualisasi AI dan evaluasi yang disesuaikan kemampuan Anda.",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Database Global",
    href: "/database",
    description: "Akses 2,400+ data spesies Felidae dengan update berkala dari peneliti global.",
    icon: <Database className="h-4 w-4" />,
  },
  {
    title: "Komunitas Peneliti",
    href: "/community",
    description: "Bergabung dengan 10,000+ peneliti dan pengamat Felidae dari seluruh dunia.",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Pembelajaran",
    href: "/learning/taxonomy",
    description: "Pelajari tentang taksonomi Felidae.",
    icon: <BookOpen className="h-4 w-4" />,
  },
]

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserClient()
        setUser(userData)
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      // Refresh page to clear state
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const getDisplayName = (user: any) => {
    if (!user) return null
    return user.profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  }

  const getAvatarUrl = (user: any) => {
    if (!user) return null
    return user.profile?.avatar_url || user.user_metadata?.avatar_url || null
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full bg-transparent"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-3">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-gray-200/60 bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 px-3 sm:px-4 md:px-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group ml-2">
            <div className="relative">
              <div className="bg-emerald-500 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="font-bold text-xl text-gray-900">Felidae</span>
          </Link>

          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium">
                    Fitur
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white border border-gray-200 shadow-lg">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          icon={component.icon}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/about"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium",
                      )}
                    >
                      Tentang
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={getAvatarUrl(user) || undefined} alt={getDisplayName(user) || 'User'} />
                    <AvatarFallback className="bg-emerald-500 text-white text-sm">
                      {getDisplayName(user)?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-700">{getDisplayName(user)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/scans" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Riwayat Scan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200 font-medium"
                asChild
              >
                <Link href="/auth/login">Masuk</Link>
              </Button>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg font-medium px-6"
                asChild
              >
                <Link href="/auth/register">Mulai Gratis</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 border border-gray-200">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white border-l border-gray-200">
              <SheetHeader>
                <SheetTitle className="text-gray-900">Menu</SheetTitle>
                <SheetDescription>Jelajahi fitur dan layanan Felidae</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {components.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="mt-0.5 p-1.5 bg-gray-100 rounded-md text-emerald-600">{item.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600 leading-relaxed">{item.description}</div>
                    </div>
                  </Link>
                ))}
                <div className="pt-6 space-y-3 border-t border-gray-200">
                  {loading ? (
                    <div className="space-y-3">
                      <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={getAvatarUrl(user) || undefined} alt={getDisplayName(user) || 'User'} />
                          <AvatarFallback className="bg-emerald-500 text-white">
                            {getDisplayName(user)?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{getDisplayName(user)}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        asChild
                      >
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Keluar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        asChild
                      >
                        <Link href="/auth/login">Masuk</Link>
                      </Button>
                      <Button 
                        className="w-full bg-emerald-500 hover:bg-emerald-600" 
                        variant="default"
                        asChild
                      >
                        <Link href="/auth/register">Daftar</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </motion.div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex items-start gap-3 select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50 border border-transparent hover:border-gray-200",
            className,
          )}
          {...props}
        >
          <div className="mt-0.5 p-1.5 bg-gray-100 rounded-md text-emerald-600">{icon}</div>
          <div>
            <div className="text-sm font-semibold leading-none text-gray-900">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">{children}</p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = "ListItem"
