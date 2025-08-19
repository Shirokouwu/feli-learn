/**
 * Universal utility functions for file upload validation
 * Safe to use on both server and client side
 */

export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif'
]

export const ALLOWED_IMAGE_EXTENSIONS = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'avif'
]

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check if file type starts with 'image/'
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'File harus berupa gambar' }
    }

    // Get file extension from filename as fallback
    const fileExtension = getFileExtension(file.name)

    // Check MIME type OR file extension (more flexible validation)
    const isValidMimeType = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isValidExtension = ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension)

    if (!isValidMimeType && !isValidExtension) {
        return {
            valid: false,
            error: `Format gambar tidak didukung. Gunakan: ${ALLOWED_IMAGE_EXTENSIONS.join(', ').toUpperCase()}`
        }
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'Ukuran file terlalu besar. Maksimal 5MB' }
    }

    // Log for debugging (works on both server and client)
    console.log('File validation:', {
        name: file.name,
        type: file.type,
        size: file.size,
        extension: fileExtension,
        isValidMimeType,
        isValidExtension
    })

    return { valid: true }
}

export function generateFileName(userId: string, originalName: string): string {
    const extension = originalName.split('.').pop()?.toLowerCase()
    const timestamp = Date.now()
    return `${userId}-${timestamp}.${extension}`
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
}

export function isValidImageExtension(filename: string): boolean {
    const ext = getFileExtension(filename)
    return ALLOWED_IMAGE_EXTENSIONS.includes(ext)
}
