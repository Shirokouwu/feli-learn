/**
 * Upload utilities - Centralized exports
 * 
 * Usage guidelines:
 * - For server-side (API routes): Only import from upload-validation
 * - For client-side (React components): Import from both files as needed
 */

// Universal functions (safe for server + client)
export {
    ALLOWED_IMAGE_TYPES,
    ALLOWED_IMAGE_EXTENSIONS,
    MAX_FILE_SIZE,
    validateImageFile,
    generateFileName,
    formatFileSize,
    getFileExtension,
    isValidImageExtension
} from './validation'

// Client-only functions (browser APIs required)
export {
    compressImage,
    createImagePreview,
    revokeImagePreview
} from './client'

// Type definitions
export interface ValidationResult {
    valid: boolean
    error?: string
}

export interface UploadConfig {
    maxSize?: number
    allowedTypes?: string[]
    quality?: number
    maxWidth?: number
}
