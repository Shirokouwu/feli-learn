"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    RotateCw,
    ZoomIn,
    ZoomOut,
    Crop,
    Check,
    X
} from "lucide-react"

interface CropArea {
    x: number
    y: number
    width: number
    height: number
}

interface CropAreaInPixels extends CropArea {}

interface SimpleImageEditorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    imageSrc: string
    onCropComplete: (croppedImage: Blob) => void
    aspectRatio?: number
    cropShape?: 'rect' | 'round'
}

// Utility function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

const getCroppedImg = async (
    imageSrc: string,
    cropAreaPixels: CropAreaInPixels,
    rotation = 0
): Promise<Blob> => {
    const originalImage = await createImage(imageSrc)
    const canvasElement = document.createElement('canvas')
    const canvasContext = canvasElement.getContext('2d')

    if (!canvasContext) {
        throw new Error('No 2D context')
    }

    // Strict bounds checking - ensure crop never goes outside image
    const imageWidth = originalImage.width
    const imageHeight = originalImage.height

    // Constrain crop coordinates to image boundaries
    const cropX = Math.max(0, Math.min(cropAreaPixels.x, imageWidth))
    const cropY = Math.max(0, Math.min(cropAreaPixels.y, imageHeight))

    // Constrain crop dimensions to not exceed image boundaries
    const maxCropWidth = imageWidth - cropX
    const maxCropHeight = imageHeight - cropY
    const cropWidth = Math.min(cropAreaPixels.width, maxCropWidth)
    const cropHeight = Math.min(cropAreaPixels.height, maxCropHeight)

    // Ensure we have positive dimensions
    const finalCropArea = {
        x: cropX,
        y: cropY,
        width: Math.max(1, cropWidth),
        height: Math.max(1, cropHeight)
    }

    // Set canvas size to match the final crop area
    canvasElement.width = finalCropArea.width
    canvasElement.height = finalCropArea.height

    // Draw only the part that's within image boundaries
    canvasContext.drawImage(
        originalImage,
        finalCropArea.x,
        finalCropArea.y,
        finalCropArea.width,
        finalCropArea.height,
        0,
        0,
        finalCropArea.width,
        finalCropArea.height
    )

    return new Promise((resolve) => {
        canvasElement.toBlob((blob) => {
            resolve(blob as Blob)
        }, 'image/jpeg', 0.9)
    })
}

export function SimpleImageEditor({
    open,
    onOpenChange,
    imageSrc,
    onCropComplete,
    aspectRatio = 1,
    cropShape = 'round'
}: SimpleImageEditorProps) {
    const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
    const [zoomLevel, setZoomLevel] = useState(1)
    const [selectedCropAreaPixels, setSelectedCropAreaPixels] = useState<CropAreaInPixels | null>(null)
    const [isProcessingCrop, setIsProcessingCrop] = useState(false)

    const onCropCompleteHandler = useCallback(
        (cropAreaPercentage: CropArea, cropAreaPixels: CropAreaInPixels) => {
            setSelectedCropAreaPixels(cropAreaPixels)
        },
        []
    )

    const handleCropConfirm = useCallback(async () => {
        if (!selectedCropAreaPixels) return

        try {
            setIsProcessingCrop(true)
            const croppedImageBlob = await getCroppedImg(imageSrc, selectedCropAreaPixels)
            onCropComplete(croppedImageBlob)
            onOpenChange(false)
        } catch (error) {
            console.error('Error creating cropped image:', error)
        } finally {
            setIsProcessingCrop(false)
        }
    }, [selectedCropAreaPixels, imageSrc, onCropComplete, onOpenChange])

    const handleResetCrop = () => {
        setCropPosition({ x: 0, y: 0 })
        setZoomLevel(1)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] p-0 sm:max-w-lg w-[95vw] sm:w-auto">
                <DialogHeader className="p-3 pb-2 sm:p-4">
                    <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
                        <Crop className="h-4 w-4 text-emerald-600" />
                        Crop Foto Profil
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Geser dan zoom untuk mengatur foto Anda
                    </DialogDescription>
                </DialogHeader>

                <div className="p-3 space-y-3 sm:p-4 sm:space-y-4">
                    {/* Simple Cropper Area */}
                    <div className="w-full flex justify-center">
                        <div
                            className="relative bg-gray-900 rounded-lg overflow-hidden"
                            style={{
                                width: 'min(400px, calc(100vw - 48px))',
                                height: 'min(400px, calc(100vw - 48px))'
                            }}
                        >
                            <Cropper
                                image={imageSrc}
                                crop={cropPosition}
                                zoom={zoomLevel}
                                aspect={aspectRatio}
                                onCropChange={setCropPosition}
                                onCropComplete={onCropCompleteHandler}
                                onZoomChange={setZoomLevel}
                                cropShape={cropShape}
                                showGrid={true}
                                restrictPosition={true}
                                zoomWithScroll={true}
                                minZoom={0.5}
                                maxZoom={3}
                                style={{
                                    containerStyle: {
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#111827',
                                        touchAction: 'none'
                                    },
                                    cropAreaStyle: {
                                        border: '2px solid #10b981',
                                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                                    },
                                    mediaStyle: {
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }
                                }}
                            />

                            {/* Simple Instructions */}
                            <div className="absolute bottom-1 left-1 right-1 sm:bottom-2 sm:left-2 sm:right-2">
                                <div className="bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                                    <p className="text-white text-[10px] sm:text-xs text-center leading-tight">
                                        <span className="hidden sm:inline">Drag untuk pindah • Scroll untuk zoom</span>
                                        <span className="sm:hidden">Sentuh & geser untuk pindah • Pinch untuk zoom</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Zoom Control */}
                    <div className="bg-gray-50 rounded-lg p-2 space-y-2 sm:p-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Zoom</span>
                            <span className="text-gray-800 font-medium">{Math.round(zoomLevel * 100)}%</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                            <Slider
                                value={[zoomLevel]}
                                onValueChange={(value: number[]) => setZoomLevel(value[0])}
                                min={0.5}
                                max={3}
                                step={0.1}
                                className="flex-1"
                            />
                            <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                        </div>
                    </div>

                    {/* Quick Reset */}
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetCrop}
                            className="text-xs text-gray-600 hover:text-gray-800 h-8 px-3 sm:h-9 sm:px-4"
                        >
                            Reset Posisi
                        </Button>
                    </div>
                </div>

                <DialogFooter className="p-3 pt-0 gap-2 sm:p-4 flex-col sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessingCrop}
                        className="flex-1 h-10 text-sm sm:h-9"
                    >
                        <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Batal
                    </Button>
                    <Button
                        onClick={handleCropConfirm}
                        disabled={isProcessingCrop || !selectedCropAreaPixels}
                        className="bg-emerald-600 hover:bg-emerald-700 flex-1 h-10 text-sm sm:h-9"
                    >
                        {isProcessingCrop ? (
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Proses...
                            </div>
                        ) : (
                            <>
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                Selesai
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
