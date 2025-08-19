import { NextResponse } from "next/server"
import { createServer } from "@/utils/supabase/server"
import { validateImageFile, generateFileName } from "@/lib/upload/validation"


export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "5mb",
    }
}

export async function POST(request: Request) {
    try {
        const { data: { user } } = await (await createServer()).auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            )
        }

        // Validate file using utility function
        const validation = validateImageFile(file)
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            )
        }

        const supabase = await createServer()

        // Generate unique filename using utility
        const fileName = generateFileName(user.id, file.name)
        const filePath = `users/${fileName}` // Menggunakan folder 'users'

        // Determine content type - fallback to common image types
        let contentType = file.type
        if (!contentType || contentType === 'application/octet-stream') {
            const ext = fileName.split('.').pop()?.toLowerCase()
            switch (ext) {
                case 'jpg':
                case 'jpeg':
                    contentType = 'image/jpeg'
                    break
                case 'png':
                    contentType = 'image/png'
                    break
                case 'gif':
                    contentType = 'image/gif'
                    break
                case 'webp':
                    contentType = 'image/webp'
                    break
                default:
                    contentType = 'image/jpeg' // fallback
            }
        }

        // Create a new file with correct content type
        const fileWithCorrectType = new File([file], fileName, {
            type: contentType,
            lastModified: file.lastModified
        })

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, fileWithCorrectType, {
                cacheControl: '3600',
                upsert: false,
                contentType: contentType
            })

        if (uploadError) {
            console.error("Upload error:", uploadError)
            return NextResponse.json(
                { error: "Failed to upload file" },
                { status: 500 }
            )
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        // Update user profile in users table
        const { data: userData, error: updateError } = await supabase
            .from("users")
            .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id)
            .select()
            .single()

        if (updateError) {
            console.error("Update error:", updateError)
            // Try to delete the uploaded file if profile update fails
            await supabase.storage
                .from('avatars')
                .remove([filePath])

            return NextResponse.json(
                { error: "Failed to update profile" },
                { status: 500 }
            )
        }

        // Also update auth.users metadata for consistency
        try {
            const { error: authUpdateError } = await supabase.auth.updateUser({
                data: {
                    avatar_url: publicUrl
                }
            })

            if (authUpdateError) {
                console.warn("Failed to update auth metadata:", authUpdateError)
                // Don't fail the request if auth metadata update fails
            }
        } catch (authError) {
            console.warn("Auth metadata update failed:", authError)
            // Continue without failing
        }

        return NextResponse.json({
            avatar_url: publicUrl,
            message: "Avatar updated successfully"
        })

    } catch (error) {
        console.error("Error uploading avatar:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { data: { user } } = await (await createServer()).auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            )
        }

        const supabase = await createServer()

        // Get current avatar URL to extract file path
        const { data: profile } = await supabase
            .from("users")
            .select("avatar_url")
            .eq("id", user.id)
            .single()

        // Remove avatar URL from profile
        const { error: updateError } = await supabase
            .from("users")
            .update({
                avatar_url: null,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id)

        if (updateError) {
            console.error("Update error:", updateError)
            return NextResponse.json(
                { error: "Failed to remove avatar" },
                { status: 500 }
            )
        }

        // Also remove from auth metadata
        try {
            const currentMetadata = user.user_metadata || {}
            const { error: authUpdateError } = await supabase.auth.updateUser({
                data: {
                    ...currentMetadata,
                    avatar_url: null
                }
            })

            if (authUpdateError) {
                console.warn("Failed to update auth metadata:", authUpdateError)
                // Don't fail the request if auth metadata update fails
            }
        } catch (authError) {
            console.warn("Auth metadata update failed:", authError)
            // Continue without failing
        }

        // Try to delete the file from storage if it exists
        if (profile?.avatar_url && profile.avatar_url.includes('avatars')) {
            // Extract path from URL (users/filename.ext)
            const urlParts = profile.avatar_url.split('/')
            const fileName = urlParts[urlParts.length - 1]
            const filePath = `users/${fileName}`

            await supabase.storage
                .from('avatars')
                .remove([filePath])
        }

        return NextResponse.json({
            message: "Avatar removed successfully"
        })

    } catch (error) {
        console.error("Error removing avatar:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
