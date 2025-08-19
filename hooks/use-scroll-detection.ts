"use client";
import { useState, useEffect } from 'react'

interface UseScrollDetectionOptions {
  threshold?: number
}

export function useScrollDetection({ threshold = 100 }: UseScrollDetectionOptions = {}) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}
