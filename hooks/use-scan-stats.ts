"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface ScanStats {
    todayScans: number
    totalScans: number
}

const fetchScanStats = async (): Promise<ScanStats> => {
    const response = await axios.get("/api/scan-stats")
    return response.data
}

const incrementScanCount = async (): Promise<{ message: string }> => {
    const response = await axios.post("/api/scan-stats", {}, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

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

export function useIncrementScan() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: incrementScanCount,
        onSuccess: () => {
            // Invalidate and refetch scan stats after successful increment
            queryClient.invalidateQueries({ queryKey: ["scan-stats"] })
            queryClient.refetchQueries({ queryKey: ["scan-stats"] })
        },
    })
}
