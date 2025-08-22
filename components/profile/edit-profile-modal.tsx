"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ProfileData {
    full_name?: string
    bio?: string
    location?: string
    website?: string
}

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    profile: ProfileData
    onSave: (data: ProfileData) => Promise<void>
    isUpdating: boolean
}

export function EditProfileModal({
    isOpen,
    onClose,
    profile,
    onSave,
    isUpdating
}: EditProfileModalProps) {
    const [formData, setFormData] = useState<ProfileData>({
        full_name: "",
        bio: "",
        location: "",
        website: "",
    })

    // Update form data when profile changes or modal opens
    useEffect(() => {
        if (profile && isOpen) {
            setFormData({
                full_name: profile.full_name || "",
                bio: profile.bio || "",
                location: profile.location || "",
                website: profile.website || "",
            })
        }
    }, [profile, isOpen])

    const handleSave = async () => {
        try {
            await onSave(formData)
            onClose()
            toast.success("Profil berhasil diperbarui!")
        } catch (error) {
            console.error('Failed to save profile:', error)
            toast.error("Gagal memperbarui profil")
        }
    }

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            full_name: profile.full_name || "",
            bio: profile.bio || "",
            location: profile.location || "",
            website: profile.website || "",
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-w-[calc(100vw-32px)] w-full max-h-[calc(100vh-40px)] sm:max-h-[90vh] overflow-hidden p-0 flex flex-col">
                <DialogHeader className="space-y-1 sm:space-y-3 pb-2 sm:pb-4 px-4 sm:px-6 pt-3 sm:pt-6 flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-sm sm:text-lg">
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                        Edit Profil
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-gray-600">
                        Perbarui informasi profil Anda. Klik simpan setelah selesai mengedit.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                    <div className="space-y-2 sm:space-y-4 py-1 sm:py-2">
                        <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                                Nama Lengkap
                            </Label>
                            <Input
                                id="name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="focus:ring-emerald-500 focus:border-emerald-500 h-9 sm:h-11 text-sm"
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="bio" className="text-xs sm:text-sm font-medium">
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={2}
                                className="resize-none focus:ring-emerald-500 focus:border-emerald-500 min-h-[50px] sm:min-h-[80px] text-sm"
                                placeholder="Ceritakan sedikit tentang diri Anda..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="location" className="text-xs sm:text-sm font-medium">
                                    Lokasi
                                </Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="focus:ring-emerald-500 focus:border-emerald-500 h-9 sm:h-11 text-sm"
                                    placeholder="Kota, Negara"
                                />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="website" className="text-xs sm:text-sm font-medium">
                                    Website
                                </Label>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="focus:ring-emerald-500 focus:border-emerald-500 h-9 sm:h-11 text-sm"
                                    placeholder="yourwebsite.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-6 border-t px-4 sm:px-6 pb-3 sm:pb-6 flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="text-gray-600 hover:text-gray-800 order-2 sm:order-1 text-xs sm:text-sm cursor-pointer"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="bg-emerald-600 hover:bg-emerald-700 order-1 sm:order-2 text-xs sm:text-sm cursor-pointer"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                                <span className="hidden sm:inline">Menyimpan...</span>
                                <span className="sm:hidden">Simpan...</span>
                            </>
                        ) : (
                            <>
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Simpan Perubahan</span>
                                <span className="sm:hidden">Simpan</span>
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
