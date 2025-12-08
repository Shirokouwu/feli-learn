"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground">Felidae</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={isHomePage ? "#taxonomy" : "/#taxonomy"}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Taxonomy
            </Link>
            <Link
              href={isHomePage ? "#features" : "/#features"}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Features
            </Link>
            <Link
              href={isHomePage ? "#encyclopedia" : "/#encyclopedia"}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Encyclopedia
            </Link>
            <Link
              href="/about"
              className={`hover:text-foreground transition-colors text-sm ${
                pathname === "/about" ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href={isHomePage ? "#taxonomy" : "/#taxonomy"}
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Taxonomy
              </Link>
              <Link
                href={isHomePage ? "#features" : "/#features"}
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href={isHomePage ? "#encyclopedia" : "/#encyclopedia"}
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Encyclopedia
              </Link>
              <Link
                href="/about"
                className={`hover:text-foreground transition-colors ${
                  pathname === "/about" ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="justify-start">
                  Log in
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
