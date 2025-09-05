/**
 * Profile prefetching utility
 * Prefetch user profile data before navigating to profile page
 */

import { profileQueryKeys } from '@/hooks/use-user-profile'
import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const prefetchUserProfile = async (queryClient: QueryClient) => {
    await queryClient.prefetchQuery({
        queryKey: profileQueryKeys.detail(),
        queryFn: async () => {
            const response = await axios.get('/api/profile')
            return response.data
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

// Hook untuk prefetch on hover/focus
export const usePrefetchProfile = () => {
    const prefetchProfile = async () => {
        // Prefetch profile data when user hovers over profile link
        const queryClient = new (await import('@tanstack/react-query')).QueryClient()
        await prefetchUserProfile(queryClient)
    }

    return { prefetchProfile }
}
