"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ForceLightDatabaseTheme() {
    const { theme, setTheme, systemTheme } = useTheme()

    useEffect(() => {
        // Force light on mount and whenever theme changes while on this page
        const current = theme === "system" ? systemTheme : theme
        if (current !== "light") {
            setTheme("light")
        }
    }, [theme, systemTheme, setTheme])

    return null
}
