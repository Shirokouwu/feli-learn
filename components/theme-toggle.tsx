"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeToggleProps = {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, systemTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const resolvedTheme = theme === "system" ? systemTheme : theme
    const isDark = resolvedTheme === "dark"

    const handleToggle = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={handleToggle}
            className={cn(
                "h-9 w-9 rounded-full border border-border bg-background/80 shadow-sm backdrop-blur hover:bg-accent",
                className,
            )}
        >
            {mounted && isDark ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    )
}
