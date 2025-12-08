"use server"

import { revalidatePath } from 'next/cache'
import { createServer } from '@/utils/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { updateProfileSchema } from '@/lib/types/profile'

export async function updateProfileAction(prevState: any, formData: FormData) {
    console.time('updateProfileAction')
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'User tidak terautentikasi' }
        }

        // Parse and validate form data
        const rawData = {
            full_name: formData.get('full_name') as string,
            bio: formData.get('bio') as string || undefined,
            location: formData.get('location') as string || undefined,
            website: formData.get('website') as string || undefined,
        }

        const result = updateProfileSchema.safeParse(rawData)

        if (!result.success) {
            return {
                error: 'Data tidak valid',
                fieldErrors: result.error.flatten().fieldErrors,
            }
        }

        console.time('database-update')
        const supabase = await createServer()

        // Update profile in database
        const { error } = await supabase
            .from('users')
            .update({
                ...result.data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
        console.timeEnd('database-update')

        if (error) {
            console.error('Profile update error:', error)
            return { error: 'Gagal memperbarui profil' }
        }

        // Update Supabase Auth metadata for consistency (full_name)
        try {
            if (result.data.full_name) {
                const { data: { user: authUser } } = await supabase.auth.getUser()
                if (authUser) {
                    const currentMetadata = authUser.user_metadata || {}
                    await supabase.auth.updateUser({
                        data: {
                            ...currentMetadata,
                            full_name: result.data.full_name
                        }
                    })
                }
            }
        } catch (metadataError) {
            console.warn('Failed to update auth metadata:', metadataError)
            // Don't fail the entire operation for metadata sync issues
        }

        // Revalidate the profile page
        revalidatePath('/profile')
        revalidatePath('/radial') // Revalidate pages that use auth metadata
        revalidatePath('/') // Revalidate home page that uses auth metadata

        console.timeEnd('updateProfileAction')
        return { success: 'Profil berhasil diperbarui' }
    } catch (error) {
        console.timeEnd('updateProfileAction')
        console.error('Profile update action error:', error)
        return { error: 'Terjadi kesalahan saat memperbarui profil' }
    }
}

export async function uploadAvatarAction(prevState: any, formData: FormData) {
    console.time('uploadAvatarAction') // Debug timing
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'User tidak terautentikasi' }
        }

        const action = formData.get('action')
        if (action === 'remove') {
            return await removeAvatarAction()
        }

        const file = formData.get('avatar') as File

        // If no file, return error
        if (!file || file.size === 0) {
            return { error: 'File tidak ditemukan' }
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return { error: 'Format file harus JPG, PNG, atau WebP' }
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return { error: 'Ukuran file maksimal 5MB' }
        }

        console.time('supabase-operations')
        const supabase = await createServer()

        // Prepare new file info with simplified path structure
        const fileExt = file.name.split('.').pop()
        const fileName = `users/${Date.now()}-${user.id}.${fileExt}`

        try {
            console.time('file-upload')
            // Step 1: Upload file immediately (fastest operation first)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file)
            console.timeEnd('file-upload')

            if (uploadError) {
                console.error('Avatar upload error:', uploadError)
                return { error: 'Gagal mengunggah foto profil' }
            }

            // Step 2: Get public URL (very fast, no network call)
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            // Step 3: Update database with new avatar URL (parallel with getting current avatar for cleanup)
            console.time('database-update')
            const [updateResult, avatarResult] = await Promise.all([
                supabase
                    .from('users')
                    .update({
                        avatar_url: publicUrl,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', user.id),

                // Get current avatar for cleanup (parallel)  
                supabase
                    .from('users')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .single()
            ])
            console.timeEnd('database-update')

            if (updateResult.error) {
                console.error('Avatar update error:', updateResult.error)
                // Cleanup uploaded file on database error
                await supabase.storage
                    .from('avatars')
                    .remove([fileName])
                return { error: 'Gagal memperbarui foto profil' }
            }

            // Step 4: Update Supabase Auth metadata for consistency
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser()
                if (authUser) {
                    const currentMetadata = authUser.user_metadata || {}
                    await supabase.auth.updateUser({
                        data: {
                            ...currentMetadata,
                            picture: publicUrl,
                            avatar_url: publicUrl
                        }
                    })
                }
            } catch (metadataError) {
                console.warn('Failed to update auth metadata:', metadataError)
                // Don't fail the entire operation for metadata sync issues
            }

            // Step 5: Cleanup old avatar in background (don't wait for it)
            if (avatarResult.data?.avatar_url) {
                const oldUrl = avatarResult.data.avatar_url
                // Extract filename from URL
                const urlParts = oldUrl.split('/')
                const filename = urlParts[urlParts.length - 1] // Get last part (filename)

                if (filename) {
                    // Path format: users/filename
                    const oldPath = `users/${filename}`
                    // Don't await - let it run in background
                    supabase.storage
                        .from('avatars')
                        .remove([oldPath])
                        .catch(error => console.warn('Failed to cleanup old avatar:', error))
                }
            }

            console.timeEnd('supabase-operations')

            // Step 6: Revalidate cache
            revalidatePath('/profile')
            revalidatePath('/radial') // Revalidate pages that use auth metadata
            revalidatePath('/') // Revalidate home page that uses auth metadata

            console.timeEnd('uploadAvatarAction')
            return { success: 'Foto profil berhasil diperbarui' }

        } catch (error) {
            console.error('Upload process error:', error)
            // Cleanup uploaded file if anything goes wrong
            await supabase.storage
                .from('avatars')
                .remove([fileName])
                .catch(() => {}) // Ignore cleanup errors

            return { error: 'Terjadi kesalahan saat mengunggah foto profil' }
        }

    } catch (error) {
        console.timeEnd('uploadAvatarAction')
        console.error('Avatar upload action error:', error)
        return { error: 'Terjadi kesalahan saat mengunggah foto profil' }
    }
}

export async function removeAvatarAction() {
    console.time('removeAvatarAction')
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'User tidak terautentikasi' }
        }

        const supabase = await createServer()

        // Parallel operations: get current avatar info and update database
        console.time('parallel-operations')
        const [avatarResult, updateResult] = await Promise.all([
            // Get current avatar URL for cleanup
            supabase
                .from('users')
                .select('avatar_url')
                .eq('id', user.id)
                .single(),

            // Update database to remove avatar URL immediately
            supabase
                .from('users')
                .update({
                    avatar_url: null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)
        ])
        console.timeEnd('parallel-operations')

        if (updateResult.error) {
            console.error('Avatar remove error:', updateResult.error)
            return { error: 'Gagal menghapus foto profil' }
        }

        // Update Supabase Auth metadata for consistency
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
                const currentMetadata = authUser.user_metadata || {}
                await supabase.auth.updateUser({
                    data: {
                        ...currentMetadata,
                        avatar_url: null
                    }
                })
            }
        } catch (metadataError) {
            console.warn('Failed to update auth metadata:', metadataError)
            // Don't fail the entire operation for metadata sync issues
        }

        // Remove from storage in background (don't wait for it)
        if (avatarResult.data?.avatar_url) {
            const oldUrl = avatarResult.data.avatar_url
            // Extract filename from URL
            const urlParts = oldUrl.split('/')
            const filename = urlParts[urlParts.length - 1] // Get last part (filename)

            if (filename) {
                // Path format: users/filename
                const oldPath = `users/${filename}`
                // Background cleanup - don't await
                supabase.storage
                    .from('avatars')
                    .remove([oldPath])
                    .catch(error => console.warn('Failed to cleanup avatar file:', error))
            }
        }

        revalidatePath('/profile')
        revalidatePath('/radial') // Revalidate pages that use auth metadata
        revalidatePath('/') // Revalidate home page that uses auth metadata

        console.timeEnd('removeAvatarAction')
        return { success: 'Foto profil berhasil dihapus' }
    } catch (error) {
        console.timeEnd('removeAvatarAction')
        console.error('Avatar remove action error:', error)
        return { error: 'Terjadi kesalahan saat menghapus foto profil' }
    }
}