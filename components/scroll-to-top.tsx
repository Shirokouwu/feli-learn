"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`
        fixed bottom-6 right-6 z-50 
        h-12 w-12 rounded-full 
        bg-primary hover:bg-primary/90 
        text-primary-foreground
        shadow-lg shadow-primary/25
        transition-all duration-300 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"}
        hover:scale-110 hover:shadow-xl hover:shadow-primary/30
        active:scale-95
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
