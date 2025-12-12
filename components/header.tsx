"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

interface HeaderProps {
  user?: {
    id: string
    email?: string
    profile?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
}

export function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            {/* <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div> */}
            <span className="font-serif text-xl font-bold text-foreground">Felilearn</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/scanner"
              className={`hover:text-foreground transition-colors text-sm ${pathname === "/scanner" ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
            >
              Scanner
            </Link>
            <Link
              href="/database-explorer"
              className={`hover:text-foreground transition-colors text-sm ${pathname === "/database-explorer" ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
            >
              Database
            </Link>
            <Link
              href="/radial"
              className={`hover:text-foreground transition-colors text-sm ${pathname === "/radial" ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
            >
              Radial
            </Link>
            <Link
              href="/about"
              className={`hover:text-foreground transition-colors text-sm ${pathname === "/about" ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {user.profile?.avatar_url ? (
                  <Image
                    src={user.profile.avatar_url}
                    alt={user.profile?.full_name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground">
                  {user.profile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm font-medium text-foreground">Tema</span>
              <ThemeToggle />
            </div>
            <nav className="flex flex-col gap-4">
              <Link
                href="/scanner"
                className={`hover:text-foreground transition-colors ${pathname === "/scanner" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Scanner
              </Link>
              <Link
                href="/database-explorer"
                className={`hover:text-foreground transition-colors ${pathname === "/database-explorer" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Database
              </Link>
              <Link
                href="/radial"
                className={`hover:text-foreground transition-colors ${pathname === "/radial" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Radial
              </Link>
              <Link
                href="/about"
                className={`hover:text-foreground transition-colors ${pathname === "/about" ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.profile?.avatar_url ? (
                      <Image
                        src={user.profile.avatar_url}
                        alt={user.profile?.full_name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {user.profile?.full_name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
