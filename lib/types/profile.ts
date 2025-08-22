import { z } from 'zod'

export const updateProfileSchema = z.object({
    full_name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
    bio: z.string().max(500, 'Bio maksimal 500 karakter').optional(),
    location: z.string().max(100, 'Lokasi maksimal 100 karakter').optional(),
    website: z.string().url('Website harus berupa URL yang valid').optional().or(z.literal('')),
})

export type UpdateProfileData = z.infer<typeof updateProfileSchema>

export type ActionState = {
    error?: string
    success?: string
    fieldErrors?: Record<string, string[]>
}
