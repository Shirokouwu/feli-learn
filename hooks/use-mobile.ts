"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQueryList = window.matchMedia(query)
      const listener = () => setMatches(mediaQueryList.matches)

      setMatches(mediaQueryList.matches)

      mediaQueryList.addEventListener("change", listener)
      return () => mediaQueryList.removeEventListener("change", listener)
    }
    return undefined
  }, [query])

  return matches
}

export function useMobile(): boolean {
  return useMediaQuery("(max-width: 768px)")
}
