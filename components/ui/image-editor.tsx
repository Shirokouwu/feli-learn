"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
    RotateCcw,
    ZoomIn,
    ZoomOut,
    Crop,
    Check,
    X,
    Move,
    Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Area {
    x: number
    y: number
    width: number
    height: number
}

interface CroppedAreaPixels extends Area {}

interface ImageEditorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    imageSrc: string
    onCropComplete: (croppedImage: Blob) => void
    aspectRatio?: number
    cropShape?: 'rect' | 'round'
    maxWidth?: number
    maxHeight?: number
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
    pixelCrop: CroppedAreaPixels,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2D context')
    }

    const rotRad = (rotation * Math.PI) / 180

    // Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // Translate canvas context to the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // Draw rotated image
    ctx.drawImage(image, 0, 0)

    const croppedCanvas = document.createElement('canvas')
    const croppedCtx = croppedCanvas.getContext('2d')

    if (!croppedCtx) {
        throw new Error('No 2D context')
    }

    // Set the size of the cropped canvas
    croppedCanvas.width = pixelCrop.width
    croppedCanvas.height = pixelCrop.height

    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    return new Promise((resolve) => {
        croppedCanvas.toBlob((blob) => {
            resolve(blob as Blob)
        }, 'image/jpeg', 0.9)
    })
}

const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

export function ImageEditor({
    open,
    onOpenChange,
    imageSrc,
    onCropComplete,
    aspectRatio = 1,
    cropShape = 'round',
    maxWidth = 800,
    maxHeight = 600
}: ImageEditorProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const onCropCompleteHandler = useCallback(
        (croppedArea: Area, croppedAreaPixels: CroppedAreaPixels) => {
            setCroppedAreaPixels(croppedAreaPixels)
        },
        []
    )

    const handleCropConfirm = useCallback(async () => {
        if (!croppedAreaPixels) return

        try {
            setIsProcessing(true)
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            onCropComplete(croppedImage)
            onOpenChange(false)
        } catch (e) {
            console.error('Error creating cropped image:', e)
        } finally {
            setIsProcessing(false)
        }
    }, [croppedAreaPixels, imageSrc, rotation, onCropComplete, onOpenChange])

    const handleRotateLeft = () => {
        setRotation((prev) => prev - 90)
    }

    const handleRotateRight = () => {
        setRotation((prev) => prev + 90)
    }

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 3))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 1))
    }

    const handleReset = () => {
        setCrop({ x: 0, y: 0 })
        setRotation(0)
        setZoom(1)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Crop className="h-5 w-5 text-emerald-600" />
                        Edit Gambar Profil
                    </DialogTitle>
                    <DialogDescription>
                        Sesuaikan posisi dan ukuran gambar profil Anda
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row gap-6 p-6 pt-0">
                    {/* Cropper Area */}
                    <div className="flex-1">
                        <Card className="border-2 border-dashed border-emerald-200 bg-emerald-50/50">
                            <CardContent className="p-0">
                                <div
                                    className="relative w-full bg-gray-900 rounded-lg overflow-hidden"
                                    style={{ height: maxHeight }}
                                >
                                    <Cropper
                                        image={imageSrc}
                                        crop={crop}
                                        rotation={rotation}
                                        zoom={zoom}
                                        aspect={aspectRatio}
                                        onCropChange={setCrop}
                                        onRotationChange={setRotation}
                                        onCropComplete={onCropCompleteHandler}
                                        onZoomChange={setZoom}
                                        cropShape={cropShape}
                                        showGrid={true}
                                        style={{
                                            containerStyle: {
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: '#111827'
                                            },
                                            cropAreaStyle: {
                                                border: '2px solid #10b981',
                                                color: '#10b981'
                                            }
                                        }}
                                    />

                                    {/* Overlay Instructions */}
                                    <div className="absolute top-4 left-4 right-4">
                                        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                            <div className="flex items-center gap-2 text-white text-xs">
                                                <Move className="h-3 w-3" />
                                                <span>Drag untuk memindahkan • Scroll untuk zoom</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Controls Panel */}
                    <div className="lg:w-80 space-y-4">
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <ZoomIn className="h-4 w-4 text-emerald-600" />
                                        Zoom ({Math.round(zoom * 100)}%)
                                    </h4>
                                    <Slider
                                        value={[zoom]}
                                        onValueChange={(value: number[]) => setZoom(value[0])}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleZoomOut}
                                            disabled={zoom <= 1}
                                            className="h-8 px-3"
                                        >
                                            <ZoomOut className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleZoomIn}
                                            disabled={zoom >= 3}
                                            className="h-8 px-3"
                                        >
                                            <ZoomIn className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <RotateCw className="h-4 w-4 text-emerald-600" />
                                        Rotasi ({rotation}°)
                                    </h4>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRotateLeft}
                                            className="flex-1 h-9"
                                        >
                                            <RotateCcw className="h-4 w-4 mr-1" />
                                            Kiri
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRotateRight}
                                            className="flex-1 h-9"
                                        >
                                            <RotateCw className="h-4 w-4 mr-1" />
                                            Kanan
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-2 border-t">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleReset}
                                        className="w-full text-gray-600 hover:text-gray-800"
                                    >
                                        <Maximize2 className="h-4 w-4 mr-2" />
                                        Reset ke Default
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                            <CardContent className="p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
                                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full border-2 border-emerald-200 overflow-hidden">
                                    {cropShape === 'round' && (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs">
                                            Preview akan muncul setelah crop
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessing}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Batal
                    </Button>
                    <Button
                        onClick={handleCropConfirm}
                        disabled={isProcessing || !croppedAreaPixels}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Memproses...
                            </div>
                        ) : (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Terapkan Perubahan
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
