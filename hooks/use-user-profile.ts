import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

export interface UserProfile {
    id: string
    email: string
    full_name: string
    avatar_url: string
    bio?: string
    location?: string
    website?: string
    role: string
    created_at: string
    updated_at: string
    last_sign_in_at?: string
}

// API functions
const fetchUserProfile = async (): Promise<UserProfile> => {
    const response = await axios.get('/api/profile')
    if (response.status !== 200) {
        throw new Error('Failed to fetch profile')
    }
    return response.data
}

const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axios.put('/api/profile', updates)
    if (response.status !== 200) {
        throw new Error('Failed to update profile')
    }
    return response.data
}

const uploadAvatar = async (file: File): Promise<{ avatar_url: string; message: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post('/api/profile/avatar', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    })

    if (response.status !== 200) {
        const error = response.data
        throw new Error(error.error || 'Failed to upload avatar')
    }

    return response.data
}

const removeAvatar = async (): Promise<{ message: string }> => {
    const response = await axios.delete('/api/profile/avatar')

    if (response.status !== 200) {
        throw new Error('Failed to remove avatar')
    }

    return response.data
}



// Query keys
export const profileQueryKeys = {
    all: ['profile'] as const,
    detail: () => [...profileQueryKeys.all, 'detail'] as const,
}

export function useUserProfile() {
    const queryClient = useQueryClient()

    // Query untuk fetch profile dengan optimasi
    const {
        data: profile,
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: profileQueryKeys.detail(),
        queryFn: fetchUserProfile,
        staleTime: 10 * 60 * 1000, // 10 minutes - longer cache
        gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
        retry: 2,
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: 'always', // Always refetch on mount for fresh data
    })

    // Mutation untuk update profile
    const updateMutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(profileQueryKeys.detail(), updatedProfile)
            toast.success('Profil berhasil diperbarui')
        },
        onError: (error) => {
            console.error('Error updating profile:', error)
            toast.error('Gagal memperbarui profil')
        },
    })

    // Mutation untuk upload avatar
    const uploadAvatarMutation = useMutation({
        mutationFn: uploadAvatar,
        onSuccess: (result) => {
            queryClient.setQueryData(profileQueryKeys.detail(), (oldProfile: UserProfile | undefined) =>
                oldProfile ? { ...oldProfile, avatar_url: result.avatar_url } : undefined
            )
            toast.success('Foto profil berhasil diperbarui')
        },
        onError: (error) => {
            console.error('Error uploading avatar:', error)
            toast.error(error instanceof Error ? error.message : 'Gagal mengunggah foto profil')
        },
    })

    // Mutation untuk remove avatar
    const removeAvatarMutation = useMutation({
        mutationFn: removeAvatar,
        onSuccess: () => {
            queryClient.setQueryData(profileQueryKeys.detail(), (oldProfile: UserProfile | undefined) =>
                oldProfile ? { ...oldProfile, avatar_url: '' } : undefined
            )
            toast.success('Foto profil berhasil dihapus')
        },
        onError: (error) => {
            console.error('Error removing avatar:', error)
            toast.error('Gagal menghapus foto profil')
        },
    })

    return {
        // Data
        profile,
        loading,
        error,

        // States
        updating: updateMutation.isPending,
        uploadingAvatar: uploadAvatarMutation.isPending,
        removingAvatar: removeAvatarMutation.isPending,

        // Actions
        updateProfile: updateMutation.mutateAsync,
        uploadAvatar: uploadAvatarMutation.mutateAsync,
        removeAvatar: removeAvatarMutation.mutateAsync,
        refetch,

        // Reset functions
        reset: () => {
            updateMutation.reset()
            uploadAvatarMutation.reset()
            removeAvatarMutation.reset()
        },

        // Invalidate queries
        invalidate: () => {
            queryClient.invalidateQueries({ queryKey: profileQueryKeys.all })
        },
    }
}
