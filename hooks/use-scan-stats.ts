"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface ScanStats {
    todayScans: number
    totalScans: number
    userId?: string
}

const fetchScanStats = async (): Promise<ScanStats> => {
    const response = await axios.get("/api/scan-stats")
    return response.data
}

const fetchUserScanStats = async (): Promise<ScanStats> => {
    const response = await axios.get("/api/scan-stats/user")
    return response.data
}

const incrementScanCount = async (): Promise<{ message: string; userId: string | null }> => {
    const response = await axios.post("/api/scan-stats", {}, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

// Hook untuk fetch global stats (semua user)
export function useScanStats() {
    return useQuery({
        queryKey: ["scan-stats"],
        queryFn: fetchScanStats,
        refetchInterval: 120000, // Refetch every 2 minutes (optimized from 1 minute)
        refetchIntervalInBackground: false, // Stop refetching when tab is not active (saves resources)
        staleTime: 30000, // Cache data for 30 seconds to reduce unnecessary fetches
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnMount: true, // Refetch when component mounts
    })
}

// Hook untuk fetch per-user stats (user yang login)
export function useUserScanStats() {
    return useQuery({
        queryKey: ["user-scan-stats"],
        queryFn: fetchUserScanStats,
        refetchInterval: 120000, // Refetch every 2 minutes
        refetchIntervalInBackground: false,
        staleTime: 30000, // Cache data for 30 seconds
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        retry: 1, // Only retry once if unauthorized
    })
}

export function useIncrementScan() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: incrementScanCount,
        onSuccess: () => {
            // Invalidate and refetch both global and user stats after successful increment
            queryClient.invalidateQueries({ queryKey: ["scan-stats"] })
            queryClient.refetchQueries({ queryKey: ["scan-stats"] })
            queryClient.invalidateQueries({ queryKey: ["user-scan-stats"] })
            queryClient.refetchQueries({ queryKey: ["user-scan-stats"] })
        },
    })
}
