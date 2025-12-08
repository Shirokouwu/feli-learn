"use server"

import { createServer } from "@/utils/supabase/server"

/**
 * Test function untuk debug reset password email
 * Call ini dari browser console atau page untuk test
 */
export async function testResetPasswordEmail(email: string) {
    try {
        const supabase = await createServer()

        console.log("\n=== 🧪 TESTING RESET PASSWORD EMAIL ===")
        console.log("1️⃣ Testing with email:", email)
        console.log("2️⃣ Site URL:", process.env.NEXT_PUBLIC_SITE_URL)
        console.log("3️⃣ Redirect URL:", `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`)

        // Test 1: Cek koneksi Supabase
        console.log("\n=== TEST 1: Checking Supabase Connection ===")
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log("Session check:", sessionError ? "❌ Error" : "✅ OK")
        if (sessionError) {
            console.error("Session error:", sessionError)
        }

        // Test 2: Cek apakah user ada di auth.users
        console.log("\n=== TEST 2: Checking if User Exists ===")
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, email, created_at")
            .eq("email", email)
            .single()

        if (userError) {
            console.log("❌ User not found in users table:", userError.message)
        } else {
            console.log("✅ User found:", userData)
        }

        // Test 3: Kirim reset password email
        console.log("\n=== TEST 3: Sending Reset Password Email ===")
        const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`,
        })

        if (resetError) {
            console.error("❌ FAILED TO SEND EMAIL")
            console.error("Error Message:", resetError.message)
            console.error("Error Status:", resetError.status)
            console.error("Error Name:", resetError.name)
            console.error("Full Error:", resetError)

            return {
                success: false,
                error: resetError.message,
                details: {
                    message: resetError.message,
                    status: resetError.status,
                    name: resetError.name
                }
            }
        }

        console.log("✅ EMAIL SENT SUCCESSFULLY!")
        console.log("Response data:", resetData)
        console.log("\n=== ✨ CHECK YOUR EMAIL INBOX ===")
        console.log("📧 Email should arrive in 1-5 minutes")
        console.log("📁 Check spam folder if not in inbox")
        console.log("⏰ Rate limit: Max 4 emails/hour in development")

        return {
            success: true,
            message: "Email sent! Check console for details.",
            data: resetData
        }

    } catch (error: any) {
        console.error("\n=== ❌ UNEXPECTED ERROR ===")
        console.error("Error:", error)
        console.error("Message:", error?.message)
        console.error("Stack:", error?.stack)

        return {
            success: false,
            error: error?.message || "Unknown error",
            details: error
        }
    }
}
