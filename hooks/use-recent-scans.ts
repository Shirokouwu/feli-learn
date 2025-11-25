import { useQuery } from '@tanstack/react-query'
import {
    getRecentScans,
    getScanStats,
    type ScanHistoryItem as ServerScanHistoryItem,
} from '@/lib/actions/scan-history-actions'

export interface RecentScanItem {
    id: string
    name: string
    scientificName: string
    imageUrl: string
    accuracy: number
    date: Date
    conservationStatus: string
}

// Transform server data to client format
const transformRecentScans = (items: ServerScanHistoryItem[]): RecentScanItem[] => {
    return items.map((item) => ({
        id: item.id,
        name: item.spesies?.nama_umum || item.spesies?.nama || 'Unknown Species',
        scientificName: item.spesies?.nama || 'Unknown',
        imageUrl: item.foto_scan || '/placeholder.svg',
        accuracy: Number(item.akurasi),
        date: new Date(item.tanggal_identifikasi),
        conservationStatus: 'Unknown', // Not available in taksonomi_spesies
    }))
}

// Query keys
export const recentScansQueryKeys = {
    all: ['recentScans'] as const,
}

/**
 * Hook untuk mengambil recent scans (5 terakhir)
 * Digunakan di scanner page untuk menampilkan quick preview
 */
export function useRecentScans() {
    const {
        data: recentScans = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: recentScansQueryKeys.all,
        queryFn: async () => {
            const result = await getRecentScans()
            if (result.error || !result.data) {
                throw new Error(result.error || 'Failed to fetch recent scans')
            }
            return transformRecentScans(result.data)
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        retry: 2,
    })

    return {
        recentScans,
        isLoading,
        error,
        refetch,
    }
}

export interface ScanStats {
    total_scans: number
    average_accuracy: number
    recent_scans_count: number
    unique_species: number
}

// Query keys untuk stats
export const scanStatsQueryKeys = {
    all: ['scanStats'] as const,
}

/**
 * Hook untuk mengambil statistik scan user
 * Digunakan di profile page
 */
export function useScanStats() {
    const {
        data: stats,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: scanStatsQueryKeys.all,
        queryFn: async () => {
            const result = await getScanStats()
            if (result.error || !result.data) {
                throw new Error(result.error || 'Failed to fetch scan stats')
            }
            return result.data
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: 2,
    })

    return {
        stats: stats || {
            total_scans: 0,
            average_accuracy: 0,
            recent_scans_count: 0,
            unique_species: 0,
        },
        isLoading,
        error,
        refetch,
    }
}
