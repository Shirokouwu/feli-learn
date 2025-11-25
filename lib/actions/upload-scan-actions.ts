"use server"

import { createServer } from "@/utils/supabase/server"
import { getCurrentUser } from "@/lib/auth"

/**
 * Upload scan image to Supabase storage bucket
 * @param imageData - Base64 encoded image with data URL prefix (e.g., data:image/jpeg;base64,...)
 * @param fileName - Custom file name (optional)
 * @returns Public URL of uploaded image
 */
export async function uploadScanImage(
    imageData: string,
    fileName?: string
): Promise<{ url: string | null; error: string | null }> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { url: null, error: "Unauthorized" }
        }

        // Don't upload if it's already a URL from our storage or external URL
        if (imageData.startsWith('http') || imageData.startsWith('https')) {
            return { url: imageData, error: null }
        }

        // Don't upload blob URLs (they're temporary client-side)
        if (imageData.startsWith('blob:')) {
            console.log("Skipping blob URL upload - need base64 data")
            return { url: null, error: "Blob URL cannot be uploaded" }
        }

        const supabase = await createServer()

        // Extract base64 data and mime type
        let base64String = imageData
        let mimeType = "image/jpeg" // Default

        if (imageData.includes(",")) {
            // Parse data URL: data:image/jpeg;base64,/9j/4AAQ...
            const parts = imageData.split(",")
            base64String = parts[1]

            // Extract mime type
            const header = parts[0]
            const mimeMatch = header.match(/data:(.*?);/)
            if (mimeMatch) {
                mimeType = mimeMatch[1]
            }
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(base64String, "base64")

        // Validate buffer size
        if (buffer.length === 0) {
            return { url: null, error: "Invalid image data" }
        }

        // Generate unique file name with user folder structure
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const fileExtension = mimeType.split("/")[1] || "jpg"
        const uploadFileName = fileName || `${user.id}/scan_${timestamp}_${randomString}.${fileExtension}`

        // Upload to bucket
        const { data, error } = await supabase.storage
            .from("upload-scanner-user")
            .upload(uploadFileName, buffer, {
                contentType: mimeType,
                upsert: false,
            })

        if (error) {
            console.error("Error uploading to storage:", error)
            return { url: null, error: error.message }
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("upload-scanner-user").getPublicUrl(data.path)

        return { url: publicUrl, error: null }
    } catch (error) {
        console.error("Unexpected error uploading scan image:", error)
        return { url: null, error: "Failed to upload image" }
    }
}

/**
 * Delete scan image from storage
 * @param imageUrl - Full public URL of the image
 */
export async function deleteScanImage(
    imageUrl: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { success: false, error: "Unauthorized" }
        }

        // Extract file path from URL
        const bucketName = "upload-scanner-user"
        const urlParts = imageUrl.split(`${bucketName}/`)
        if (urlParts.length < 2) {
            return { success: false, error: "Invalid image URL" }
        }

        const filePath = urlParts[1]

        const supabase = await createServer()

        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath])

        if (error) {
            console.error("Error deleting from storage:", error)
            return { success: false, error: error.message }
        }

        return { success: true, error: null }
    } catch (error) {
        console.error("Unexpected error deleting scan image:", error)
        return { success: false, error: "Failed to delete image" }
    }
}
