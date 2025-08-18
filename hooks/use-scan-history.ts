import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface ScanHistoryItem {
    id: string
    name: string
    scientificName: string
    imageUrl: string
    accuracy: number
    date: Date
    conservationStatus: string
    family: string
    genus: string
    userId: string
    created_at: string
}

// API functions
const fetchScanHistory = async (): Promise<ScanHistoryItem[]> => {
    const response = await fetch('/api/scan-history')
    if (!response.ok) {
        throw new Error('Failed to fetch scan history')
    }
    return response.json()
}

const deleteScanHistoryItem = async (id: string): Promise<void> => {
    const response = await fetch(`/api/scan-history/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to delete scan history item')
    }
}

const clearAllScanHistory = async (): Promise<void> => {
    const response = await fetch('/api/scan-history', {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to clear scan history')
    }
}

// Query keys
export const scanHistoryQueryKeys = {
    all: ['scanHistory'] as const,
    lists: () => [...scanHistoryQueryKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...scanHistoryQueryKeys.lists(), { filters }] as const,
}

export function useScanHistory(filters: { search?: string; sortBy?: string } = {}) {
    const queryClient = useQueryClient()

    // Query untuk fetch scan history
    const {
        data: historyData = [],
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: scanHistoryQueryKeys.list(filters),
        queryFn: fetchScanHistory,
        staleTime: 2 * 60 * 1000, // 2 minutes
        retry: 2,
    })

    // Mutation untuk delete single item
    const deleteItemMutation = useMutation({
        mutationFn: deleteScanHistoryItem,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(
                scanHistoryQueryKeys.list(filters),
                (oldData: ScanHistoryItem[] | undefined) =>
                    oldData ? oldData.filter(item => item.id !== deletedId) : []
            )
            toast.success('Item riwayat telah dihapus')
        },
        onError: (error) => {
            console.error('Error deleting scan history item:', error)
            toast.error('Gagal menghapus item riwayat')
        },
    })

    // Mutation untuk clear all history
    const clearAllMutation = useMutation({
        mutationFn: clearAllScanHistory,
        onSuccess: () => {
            queryClient.setQueryData(scanHistoryQueryKeys.list(filters), [])
            toast.success('Semua riwayat scan telah dihapus')
        },
        onError: (error) => {
            console.error('Error clearing scan history:', error)
            toast.error('Gagal menghapus semua riwayat')
        },
    })

    // Process data with filters and sorting
    const processedHistory = historyData
        .filter((item) => {
            if (!filters.search) return true
            const searchLower = filters.search.toLowerCase()
            return (
                item.name.toLowerCase().includes(searchLower) ||
                item.scientificName.toLowerCase().includes(searchLower)
            )
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'oldest':
                    return new Date(a.date).getTime() - new Date(b.date).getTime()
                case 'accuracy':
                    return b.accuracy - a.accuracy
                case 'newest':
                default:
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
            }
        })

    return {
        // Data
        historyData: processedHistory,
        rawHistoryData: historyData,
        loading,
        error,

        // States
        deletingItem: deleteItemMutation.isPending,
        clearingAll: clearAllMutation.isPending,

        // Actions
        deleteItem: (id: string) => {
            if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
                deleteItemMutation.mutate(id)
            }
        },
        clearAll: () => {
            if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat scan?')) {
                clearAllMutation.mutate()
            }
        },
        refetch,

        // Utility
        invalidate: () => {
            queryClient.invalidateQueries({ queryKey: scanHistoryQueryKeys.all })
        },
    }
}
