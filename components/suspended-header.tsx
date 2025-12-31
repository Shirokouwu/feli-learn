"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { LayoutHeader } from "@/components/layout-header"
import { useUserProfile } from "@/hooks/use-user-profile"

// Client Component wrapper for LayoutHeader
function HeaderWithUser() {
    const pathname = usePathname()
    const { profile } = useUserProfile()
    
    // Hide header on auth routes
    const isAuthRoute = pathname.startsWith("/login") || 
                       pathname.startsWith("/register") || 
                       pathname.startsWith("/confirm-email") ||
                       pathname.startsWith("/reset-password") ||
                       pathname.startsWith("/new-password")
    
    if (isAuthRoute) {
        return null
    }
    
    return <LayoutHeader user={profile} />
}

// Loading fallback for header
function HeaderSkeleton() {
    return (
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                </div>
            </div>
        </header>
    )
}

export function SuspendedHeader() {
    return (
        <Suspense fallback={<HeaderSkeleton />}>
            <HeaderWithUser />
        </Suspense>
    )
}
