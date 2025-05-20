import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
})

export const registerSchema = z
    .object({
        fullName: z.string().min(2, { message: "Nama minimal 2 karakter" }),
        email: z.string().min(1, { message: "Email wajib diisi" }).email({ message: "Email tidak valid" }),
        password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
        confirmPassword: z.string().min(6, { message: "Konfirmasi kata sandi minimal 6 karakter" }),
        terms: z.literal(true, {
            errorMap: () => ({ message: "Anda harus menyetujui syarat dan ketentuan" }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Kata sandi tidak cocok",
        path: ["confirmPassword"],
    })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
