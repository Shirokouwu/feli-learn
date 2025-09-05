"use client"

import { useActionState, useEffect, useState, useOptimistic } from "react"
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

import { ActionState } from "@/lib/types/profile"
import { updateProfileAction } from "@/app/profile/actions"



interface ProfileData {
    id: string
    full_name?: string
    bio?: string
    location?: string
    website?: string
}

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    profile: ProfileData
    onOptimisticUpdate?: (updates: Partial<ProfileData>) => void
}

export function EditProfileModal({
    isOpen,
    onClose,
    profile,
    onOptimisticUpdate,
}: EditProfileModalProps) {
    const initialState: ActionState = {}
    const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false)
    const [modalKey, setModalKey] = useState(0)

    // Optimistic updates
    const [optimisticProfile, setOptimisticProfile] = useOptimistic(
        profile,
        (currentProfile, newProfile: ProfileData) => ({
            ...currentProfile,
            ...newProfile,
        })
    )

    // Handle success/error states - hanya untuk background toast
    useEffect(() => {
        if (hasBeenSubmitted && state.success) {
            toast.success(state.success)
        }
        if (hasBeenSubmitted && state.error) {
            toast.error(state.error)
        }
    }, [state, hasBeenSubmitted])

    // Reset state dan increment key saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            setHasBeenSubmitted(false)
            setModalKey(prev => prev + 1)
        }
    }, [isOpen])

    // Handle form submission with optimistic updates
    const handleOptimisticUpdate = (formData: FormData) => {
        const newProfile = {
            full_name: formData.get('full_name') as string,
            bio: formData.get('bio') as string,
            location: formData.get('location') as string,
            website: formData.get('website') as string,
        }

        // Update optimistic state in modal
        setOptimisticProfile({
            ...profile,
            ...newProfile,
        })

        // Update optimistic state in parent component  
        onOptimisticUpdate?.(newProfile)

        // Mark as submitted
        setHasBeenSubmitted(true)

        // Close modal after optimistic update
        onClose()
    }

    return (
        <Dialog key={modalKey} open={isOpen} onOpenChange={onClose}>
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

                <form
                    action={formAction}
                    className="flex flex-col flex-1"
                    onSubmit={(e) => {
                        const formData = new FormData(e.currentTarget)
                        handleOptimisticUpdate(formData)
                    }}
                >
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                        <div className="space-y-2 sm:space-y-4 py-1 sm:py-2">
                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="full_name" className="text-xs sm:text-sm font-medium">
                                    Nama Lengkap *
                                </Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    defaultValue={optimisticProfile.full_name || ""}
                                    className="focus:ring-emerald-500 focus:border-emerald-500 h-9 sm:h-11 text-sm"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                                {state.fieldErrors?.full_name && (
                                    <p className="text-xs text-red-600">{state.fieldErrors.full_name[0]}</p>
                                )}
                            </div>

                            <div className="space-y-1 sm:space-y-2">
                                <Label htmlFor="bio" className="text-xs sm:text-sm font-medium">
                                    Bio
                                </Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={optimisticProfile.bio || ""}
                                    rows={2}
                                    className="resize-none focus:ring-emerald-500 focus:border-emerald-500 min-h-[50px] sm:min-h-[80px] text-sm"
                                    placeholder="Ceritakan sedikit tentang diri Anda..."
                                />
                                {state.fieldErrors?.bio && (
                                    <p className="text-xs text-red-600">{state.fieldErrors.bio[0]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="location" className="text-xs sm:text-sm font-medium">
                                        Lokasi
                                    </Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        defaultValue={optimisticProfile.location || ""}
                                        className="focus:ring-emerald-500 focus:border-emerald-500 h-9 sm:h-11 text-sm"
                                        placeholder="Kota, Negara"
                                    />
                                    {state.fieldErrors?.location && (
                                        <p className="text-xs text-red-600">{state.fieldErrors.location[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="website" className="text-xs sm:text-sm font-medium">
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        type="url"
                                        defaultValue={optimisticProfile.website || ""}
                                        className="focus:ring-emerald-500 focus:border-emerald-500 h-9 sm:h-11 text-sm"
                                        placeholder="https://yourwebsite.com"
                                    />
                                    {state.fieldErrors?.website && (
                                        <p className="text-xs text-red-600">{state.fieldErrors.website[0]}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-6 border-t px-4 sm:px-6 pb-3 sm:pb-6 flex-shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                            className="text-gray-600 hover:text-gray-800 order-2 sm:order-1 text-xs sm:text-sm cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-emerald-600 hover:bg-emerald-700 order-1 sm:order-2 text-xs sm:text-sm cursor-pointer"
                        >
                            {isPending ? (
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
                </form>
            </DialogContent>
        </Dialog>
    )
}
