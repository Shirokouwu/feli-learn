/**
 * Client-side only utility functions for file upload
 * These functions use browser APIs and should NOT be imported on server side
 */

/**
 * Compress image file before upload
 * ⚠️ BROWSER ONLY - Uses Canvas API
 */
export function compressImage(file: File, maxWidth = 800, quality = 0.8): Promise<File> {
    // Runtime check for browser environment
    if (typeof document === 'undefined') {
        throw new Error('compressImage can only be used in browser environment')
    }

    return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            // Calculate new dimensions
            const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
            const width = img.width * ratio
            const height = img.height * ratio

            canvas.width = width
            canvas.height = height

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height)

            canvas.toBlob((blob) => {
                if (blob) {
                    const compressedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    })
                    resolve(compressedFile)
                } else {
                    resolve(file) // Return original if compression fails
                }
            }, file.type, quality)
        }

        img.onerror = () => {
            console.error('Error loading image for compression')
            resolve(file) // Return original if compression fails
        }

        img.src = URL.createObjectURL(file)
    })
}

/**
 * Create a preview URL for an image file
 * ⚠️ BROWSER ONLY - Uses URL.createObjectURL
 */
export function createImagePreview(file: File): string {
    if (typeof URL === 'undefined') {
        throw new Error('createImagePreview can only be used in browser environment')
    }
    return URL.createObjectURL(file)
}

/**
 * Revoke a preview URL to free up memory
 * ⚠️ BROWSER ONLY - Uses URL.revokeObjectURL
 */
export function revokeImagePreview(url: string): void {
    if (typeof URL === 'undefined') {
        throw new Error('revokeImagePreview can only be used in browser environment')
    }
    URL.revokeObjectURL(url)
}
