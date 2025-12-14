"use client"

import { Header } from "@/components/header"
import { usePathname } from "next/navigation"

interface LayoutHeaderProps {
    user?: {
        id: string
        email?: string
        profile?: {
            full_name?: string
            avatar_url?: string
        }
    } | null
}

export function LayoutHeader({ user }: LayoutHeaderProps) {
    const pathname = usePathname()

    // Hide header on profile page
    if (pathname === "/profile") {
        return null
    }

    // Hide header on species detail page (database-explorer/[species])
    if (pathname.startsWith("/database-explorer/") && pathname !== "/database-explorer/") {
        return null
    }

    // Show header on all other pages
    return <Header user={user} />
}
