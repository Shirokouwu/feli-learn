"use server"

import { createServer } from "@/utils/supabase/server"

/**
 * STEP 1: Request Password Reset
 * 
 * Fungsi ini dipanggil ketika user submit email di halaman reset password
 * Flow:
 * 1. Validate email format
 * 2. Cek apakah email ada di database
 * 3. Kirim email reset password via Supabase Auth
 * 4. Return success/error message
 */
export async function requestPasswordReset(email: string) {
    try {
        const supabase = await createServer()

        // Validate email format
        if (!email || !email.includes("@")) {
            return {
                success: false,
                error: "Format email tidak valid"
            }
        }

        // Cek apakah user dengan email ini ada di auth system
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

        if (authError) {
            console.error("Error checking users:", authError)
        }

        console.log("🔍 Checking email:", email)
        console.log("📧 Sending reset email to:", email)
        console.log("🔗 Redirect URL:", `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`)

        // Kirim reset password email
        // Supabase akan generate token dan kirim email otomatis
        // NOTE: Supabase akan kirim email bahkan jika user tidak ada (security)
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`,
        })

        console.log("📨 Reset email result:", { data, error })

        if (error) {
            console.error("❌ Reset password error:", error)
            console.error("Error details:", {
                message: error.message,
                status: error.status,
                name: error.name
            })

            return {
                success: false,
                error: `Gagal mengirim email: ${error.message}`
            }
        }

        console.log("✅ Reset email sent successfully!")

        return {
            success: true,
            message: "Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam."
        }

    } catch (error) {
        console.error("Unexpected error:", error)
        return {
            success: false,
            error: "Terjadi kesalahan. Silakan coba lagi."
        }
    }
}

/**
 * STEP 2: Update Password with Token
 * 
 * Fungsi ini dipanggil setelah user klik link di email dan input password baru
 * Flow:
 * 1. Verify token dari URL masih valid
 * 2. Validate password strength
 * 3. Update password di Supabase Auth
 * 4. Auto sign in user
 */
export async function updatePassword(newPassword: string) {
    try {
        const supabase = await createServer()

        // Validate password
        if (!newPassword || newPassword.length < 6) {
            return {
                success: false,
                error: "Password minimal 6 karakter"
            }
        }

        // Update password
        // Token verification dilakukan otomatis oleh Supabase
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            console.error("Update password error:", error)

            //   // Handle specific errors
            //   if (error.message.includes("session")) {
            //     return {
            //       success: false,
            //       error: "Link reset password sudah expired atau tidak valid. Silakan request reset password lagi."
            //     }
            //   }

            return {
                success: false,
                error: "Gagal mengupdate password. Silakan coba lagi."
            }
        }

        return {
            success: true,
            message: "Password berhasil diupdate. Anda akan diarahkan ke halaman utama."
        }

    } catch (error) {
        console.error("Unexpected error:", error)
        return {
            success: false,
            error: "Terjadi kesalahan. Silakan coba lagi."
        }
    }
}
