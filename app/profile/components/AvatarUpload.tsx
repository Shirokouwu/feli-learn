"use client"

import { useRef, useState, useActionState, useEffect, startTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { uploadAvatarAction } from '../actions'
import { SimpleImageEditor } from '@/components/image-editor'

import { Upload, Trash2, Camera } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AvatarUploadProps {
    currentAvatar?: string | null
    userName: string
    onOptimisticUpdate?: (avatarUrl: string | null) => void
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function AvatarUpload({
    currentAvatar,
    userName,
    onOptimisticUpdate,
    size = 'lg',
    className = ''
}: AvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)
    const [uploadState, uploadAction, uploading] = useActionState(uploadAvatarAction, null)

    // State untuk image editor
    const [showImageEditor, setShowImageEditor] = useState(false)
    const [imageToEdit, setImageToEdit] = useState<string>('')

    const sizeClasses = {
        sm: 'h-16 w-16',
        md: 'h-20 w-20',
        lg: 'h-24 w-24'
    }

    // Generate initials from userName
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const validateImageFile = (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        const maxSize = 5 * 1024 * 1024 // 5MB

        if (!allowedTypes.includes(file.type)) {
            console.error('Invalid file type:', file.type)
            return false
        }

        if (file.size > maxSize) {
            console.error('File too large:', file.size)
            return false
        }

        return true
    }

    const handleFileSelect = async (file: File) => {
        if (!validateImageFile(file)) return

        // Buat URL untuk preview dan buka image editor
        const imageUrl = URL.createObjectURL(file)
        setImageToEdit(imageUrl)
        setShowImageEditor(true)
    }

    const handleCropComplete = async (croppedImageBlob: Blob) => {
        // Create FormData dengan cropped image
        const formData = new FormData()
        formData.append('avatar', croppedImageBlob, 'avatar.jpg')

        // Create preview URL untuk optimistic update
        const previewUrl = URL.createObjectURL(croppedImageBlob)

        // Use startTransition untuk both optimistic update dan action call
        startTransition(() => {
            // Optimistic update dengan persistent URL
            onOptimisticUpdate?.(previewUrl)

            // Trigger the action inside startTransition
            uploadAction(formData)
        })

        // Cleanup
        URL.revokeObjectURL(imageToEdit)
        setShowImageEditor(false)
        setImageToEdit('')
    }

    // Handle upload state changes
    useEffect(() => {
        if (uploadState && !uploading) {
            if (uploadState.error) {
                // Revert optimistic update on error using startTransition
                startTransition(() => {
                    onOptimisticUpdate?.(currentAvatar || null)
                })
            }
        }
    }, [uploadState, uploading, currentAvatar, onOptimisticUpdate])

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
        // Reset input value
        e.target.value = ''
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)

        const file = e.dataTransfer.files[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
            fileInputRef.current.click()
        }
    }

    const handleRemove = async () => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus foto profil?')) return

        try {
            // Create FormData with special flag for remove
            const formData = new FormData()
            formData.append('action', 'remove')

            // Use startTransition for both optimistic update and action call
            startTransition(() => {
                // Optimistic update
                onOptimisticUpdate?.(null)

                // Trigger the action inside startTransition
                uploadAction(formData)
            })

        } catch (error) {
            console.error('Remove avatar error:', error)
            // Revert optimistic update on error using startTransition
            startTransition(() => {
                onOptimisticUpdate?.(currentAvatar || null)
            })
        }
    }

    return (
        <div className={`relative ${className}`}>
            <div
                className={`relative ${sizeClasses[size]} cursor-pointer group ${dragOver ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {/* Action button */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="cursor-pointer relative">
                            <Avatar className={`${sizeClasses[size]} shadow-lg hover:shadow-xl transition-shadow border-2 border-white`}>
                                <AvatarImage src={currentAvatar || undefined} alt={userName} />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                                    {getInitials(userName)}
                                </AvatarFallback>
                            </Avatar>
                            {/* Camera icon */}
                            <div className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-1 shadow-lg border-2 border-white">
                                <Camera className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuItem onClick={openFileDialog}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Foto
                        </DropdownMenuItem>
                        {currentAvatar && (
                            <DropdownMenuItem
                                onClick={handleRemove}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus Foto
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Overlay saat drag */}
                {dragOver && (
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full flex items-center justify-center pointer-events-none">
                        <Upload className="h-6 w-6 text-emerald-600" />
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Image Editor Modal */}
            <SimpleImageEditor
                open={showImageEditor}
                onOpenChange={(open) => {
                    setShowImageEditor(open)
                    if (!open) {
                        URL.revokeObjectURL(imageToEdit)
                        setImageToEdit('')
                    }
                }}
                imageSrc={imageToEdit}
                onCropComplete={handleCropComplete}
                aspectRatio={1}
                cropShape="round"
            />
        </div>
    )
}
