"use client"

import { useActionState, useOptimistic } from "react"
import { useState } from "react"
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
import { updateProfileAction } from "../actions"

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
    onOptimisticUpdate: (updates: Partial<ProfileData>) => void
}

export default function EditProfileModal({
    isOpen,
    onClose,
    profile,
    onOptimisticUpdate,
}: EditProfileModalProps) {
    const [state, formAction, isPending] = useActionState(updateProfileAction, null)

    const [localProfile, setLocalProfile] = useState({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5 text-emerald-600" />
                        Edit Profil
                    </DialogTitle>
                    <DialogDescription>
                        Perbarui informasi profil Anda. Klik simpan setelah selesai mengedit.
                    </DialogDescription>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        // Optimistic update
                        const updates = {
                            full_name: localProfile.full_name,
                            bio: localProfile.bio,
                            location: localProfile.location,
                            website: localProfile.website,
                        }
                        onOptimisticUpdate(updates)

                        // Submit dan tutup modal
                        await formAction(formData)
                        onClose()
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Nama Lengkap *</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            value={localProfile.full_name}
                            onChange={(e) => setLocalProfile(prev => ({ ...prev, full_name: e.target.value }))}
                            placeholder="Masukkan nama lengkap"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={localProfile.bio}
                            onChange={(e) => setLocalProfile(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            placeholder="Ceritakan sedikit tentang diri Anda..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Lokasi</Label>
                            <Input
                                id="location"
                                name="location"
                                value={localProfile.location}
                                onChange={(e) => setLocalProfile(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Kota, Negara"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                value={localProfile.website}
                                onChange={(e) => setLocalProfile(prev => ({ ...prev, website: e.target.value }))}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>

                    {state?.message && (
                        <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
                            {state.message}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
