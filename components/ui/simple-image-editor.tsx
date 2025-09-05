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
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-4 pb-3 border-b">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Crop className="h-4 w-4 text-emerald-600" />
                        Edit Foto Profil
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                       <span className="hidden lg:flex"> Geser dan zoom untuk mengatur foto</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    {/* Simple Cropper */}
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
                                showGrid={false}
                                restrictPosition={true}
                                zoomWithScroll={true}
                                zoomSpeed={0.2}
                                minZoom={1}
                                maxZoom={2}
                                objectFit="contain"
                                style={{
                                    containerStyle: {
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#111827'
                                    },
                                    cropAreaStyle: {
                                        border: '2px solid #10b981',
                                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                                    },
                                    mediaStyle: {
                                        objectFit: 'contain'
                                    }
                                }}
                            />

                            {/* Simple hint */}
                            <div className="absolute bottom-2 left-2 right-2">
                                <div className="bg-black/70 rounded px-2 py-1">
                                    <p className="text-white text-xs text-center">
                                        Drag • Scroll zoom
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Zoom */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Zoom</span>
                            <span className="text-emerald-600 font-medium">{Math.round(zoomLevel * 100)}%</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.1))}
                                className="p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <ZoomOut className="h-4 w-4 text-gray-600" />
                            </button>

                            <Slider
                                value={[zoomLevel]}
                                onValueChange={(value: number[]) => setZoomLevel(value[0])}
                                min={1}
                                max={3}
                                step={0.05}
                                className="flex-1 cursor-pointer"
                            />

                            <button
                                onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
                                className="p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <ZoomIn className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleResetCrop}
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                                Reset posisi
                            </button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 pt-0 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessingCrop}
                        className="flex-1 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleCropConfirm}
                        disabled={isProcessingCrop || !selectedCropAreaPixels}
                        className="bg-emerald-600 hover:bg-emerald-700 flex-1 transition-colors cursor-pointer"
                    >
                        {isProcessingCrop ? (
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Proses...
                            </div>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-1 " />
                                Selesai
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
