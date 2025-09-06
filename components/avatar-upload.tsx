"use client"

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Upload, Trash2, Loader2, Edit } from 'lucide-react'
import { validateImageFile } from '@/lib/upload/validation'
import { compressImage } from '@/lib/upload/client'
import { toast } from 'sonner'
import { SimpleImageEditor } from '@/components/image-editor'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AvatarUploadProps {
   currentAvatar?: string
   userName: string
   onUpload: (file: File) => Promise<boolean>
   onRemove: () => Promise<boolean>
   uploading?: boolean
   size?: 'sm' | 'md' | 'lg'
   className?: string
}

export function AvatarUpload({
   currentAvatar,
   userName,
   onUpload,
   onRemove,
   uploading = false,
   size = 'lg',
   className = ''
}: AvatarUploadProps) {
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [dragOver, setDragOver] = useState(false)
   const [selectedImage, setSelectedImage] = useState<string>('')
   const [showImageEditor, setShowImageEditor] = useState(false)

   const sizeClasses = {
      sm: 'h-16 w-16',
      md: 'h-20 w-20',
      lg: 'h-24 w-24'
   }

   const buttonSizeClasses = {
      sm: 'h-5 w-5',
      md: 'h-6 w-6',
      lg: 'h-7 w-7'
   }

   const handleFileSelect = async (file: File) => {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
         toast.error(validation.error)
         return
      }

      // Skip crop editor for GIF files and upload directly
      if (file.type === 'image/gif') {
         toast.info('File GIF akan diupload langsung tanpa crop', {
            description: 'File animasi akan ditampilkan apa adanya'
         })
         try {
            const success = await onUpload(file)
            if (success) {
               toast.success('Foto profil GIF berhasil diperbarui!')
            }
         } catch (error) {
            console.error('Error uploading GIF:', error)
            toast.error('Gagal mengupload foto profil')
         }
         return
      }

      // For other image types, open crop editor
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
      setShowImageEditor(true)
   }

   const handleCropComplete = async (croppedImageBlob: Blob) => {
      try {
         // Convert blob to file
         const croppedFile = new File([croppedImageBlob], 'avatar.jpg', {
            type: 'image/jpeg',
         })

         // Upload the cropped image
         const success = await onUpload(croppedFile)
         if (success) {
            toast.success('Foto profil berhasil diperbarui!')
         }
      } catch (error) {
         console.error('Error uploading cropped image:', error)
         toast.error('Gagal mengupload foto profil')
      } finally {
         // Clean up object URL
         if (selectedImage) {
            URL.revokeObjectURL(selectedImage)
            setSelectedImage('')
         }
      }
   }

   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         handleFileSelect(file)
      }
      // Reset input value to allow selecting the same file again
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
      // Reset input value before opening to ensure onChange fires even for same file
      if (fileInputRef.current) {
         fileInputRef.current.value = ''
         fileInputRef.current.click()
      }
   }

   const handleRemove = () => {
      if (window.confirm('Apakah Anda yakin ingin menghapus foto profil?')) {
         onRemove()
      }
   }

   return (
      <div className={`relative ${className}`}>
         <div
            className={`relative ${sizeClasses[size]} rounded-full ${dragOver ? 'ring-4 ring-emerald-300' : ''
               }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
         >
            <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-md ${uploading ? 'opacity-50' : ''}`}>
               <AvatarImage src={currentAvatar || "/placeholder.svg"} alt={userName} className='object-cover' />
               <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xl">
                  {userName
                     ? userName.split(" ").map((n) => n[0]).join("").toUpperCase()
                     : "U"}
               </AvatarFallback>
            </Avatar>

            {uploading && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
               </div>
            )}

            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     size="icon"
                     variant="secondary"
                     disabled={uploading}
                     className={`absolute bottom-1 right-1 rounded-full ${buttonSizeClasses[size]} shadow-sm bg-white hover:bg-gray-100 cursor-pointer`}
                  >
                     <Camera className="h-3 w-3 text-gray-700" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={openFileDialog} className="cursor-pointer">
                     <Upload className="h-4 w-4 mr-2" />
                     Upload Foto Baru
                  </DropdownMenuItem>
                  {currentAvatar && (
                     <>
                        {/* Only show edit option for non-GIF images */}
                        {!currentAvatar.toLowerCase().includes('.gif') && (
                           <DropdownMenuItem
                              onClick={() => {
                                 if (currentAvatar) {
                                    setSelectedImage(currentAvatar)
                                    setShowImageEditor(true)
                                 }
                              }}
                              className="cursor-pointer"
                           >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Foto
                           </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleRemove} className="cursor-pointer text-red-600">
                           <Trash2 className="h-4 w-4 mr-2" />
                           Hapus Foto
                        </DropdownMenuItem>
                     </>
                  )}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
         />

         {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-100/80 rounded-full border-2 border-dashed border-emerald-400">
               <p className="text-xs text-emerald-700 font-medium">Drop foto di sini</p>
            </div>
         )}

         {/* Simple Image Editor Dialog */}
         <SimpleImageEditor
            open={showImageEditor}
            onOpenChange={(open: boolean) => {
               setShowImageEditor(open)
               if (!open && selectedImage && selectedImage.startsWith('blob:')) {
                  URL.revokeObjectURL(selectedImage)
                  setSelectedImage('')
               }
            }}
            imageSrc={selectedImage}
            onCropComplete={handleCropComplete}
            aspectRatio={1}
            cropShape="round"
         />
      </div>
   )
}
