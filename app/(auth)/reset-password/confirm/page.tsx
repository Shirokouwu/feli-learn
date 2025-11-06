"use client"

import Image from "next/image"
import Link from "next/link"
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "../actions"
import { createClient } from "@/utils/supabase/client"

export default function ConfirmResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isVerifying, setIsVerifying] = useState(true)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    // Verify token dari URL saat component mount
    useEffect(() => {
        const verifyResetToken = async () => {
            const supabase = createClient()

            // First, check if user is already authenticated (from email link auto-login)
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                console.log("✅ User already authenticated via reset link")
                setMessage({
                    type: "success",
                    text: "Link verified! Silakan masukkan password baru Anda."
                })
                setIsVerifying(false)
                return
            }

            console.log("=== 🔍 DEBUG RESET PASSWORD TOKEN ===")
            console.log("Full URL:", window.location.href)
            console.log("URL Hash:", window.location.hash)
            console.log("URL Search:", window.location.search)

            // Check hash params (Supabase default)
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const hashAccessToken = hashParams.get('access_token')
            const hashType = hashParams.get('type')

            // Check query params (alternative)
            const queryParams = new URLSearchParams(window.location.search)
            const queryAccessToken = queryParams.get('access_token')
            const queryType = queryParams.get('type')
            const queryToken = queryParams.get('token') // Some configs use 'token'

            console.log("Hash Params:", {
                accessToken: hashAccessToken ? `✓ ${hashAccessToken.substring(0, 20)}...` : '✗ Missing',
                type: hashType || '✗ Missing'
            })

            console.log("Query Params:", {
                accessToken: queryAccessToken ? `✓ ${queryAccessToken.substring(0, 20)}...` : '✗ Missing',
                type: queryType || '✗ Missing',
                token: queryToken ? `✓ ${queryToken.substring(0, 20)}...` : '✗ Missing'
            })

            // Check for errors in URL (expired/invalid links)
            const errorParam = queryParams.get('error')
            const errorCode = queryParams.get('error_code')
            const errorDescription = queryParams.get('error_description')

            if (errorParam || errorCode) {
                console.error("❌ Error in URL:", {
                    error: errorParam,
                    code: errorCode,
                    description: errorDescription
                })

                let errorMessage = "Link reset password tidak valid."

                if (errorCode === 'otp_expired') {
                    errorMessage = "Link reset password sudah expired atau sudah digunakan. Silakan request reset password baru."
                } else if (errorParam === 'access_denied') {
                    errorMessage = "Link tidak valid atau akses ditolak. Silakan request reset password baru."
                }

                setMessage({
                    type: "error",
                    text: errorMessage
                })
                setIsVerifying(false)
                return
            }

            // Determine which token to use
            const accessToken = hashAccessToken || queryAccessToken
            const type = hashType || queryType

            if ((type === 'recovery' || queryToken) && accessToken) {
                console.log("✅ Valid recovery token found, exchanging for session...")

                // Exchange the token for a session
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: hashParams.get('refresh_token') || queryParams.get('refresh_token') || ''
                })

                if (error) {
                    console.error("❌ Failed to set session:", error)
                    setMessage({
                        type: "error",
                        text: "Link reset password tidak valid atau sudah expired. Silakan request reset password lagi."
                    })
                } else {
                    console.log("✅ Session established successfully!")
                    setMessage({
                        type: "success",
                        text: "Link verified! Silakan masukkan password baru Anda."
                    })
                }
            } else {
                console.error("❌ No valid recovery token found")
                console.error("Expected: URL with #access_token=... or ?access_token=...")
                console.error("Received URL:", window.location.href)
                setMessage({
                    type: "error",
                    text: "Link reset password tidak valid. Silakan request reset password lagi."
                })
            }

            setIsVerifying(false)
        }

        verifyResetToken()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        // Validasi password match
        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Password tidak cocok" })
            setIsLoading(false)
            return
        }

        // Validasi password strength
        if (password.length < 6) {
            setMessage({ type: "error", text: "Password minimal 6 karakter" })
            setIsLoading(false)
            return
        }

        // Call server action untuk update password
        const result = await updatePassword(password)

        if (result.success) {
            setMessage({ type: "success", text: result.message || "" })

            // Redirect ke home setelah 2 detik
            setTimeout(() => {
                router.push("/")
            }, 2000)
        } else {
            setMessage({ type: "error", text: result.error || "" })
        }

        setIsLoading(false)
    }

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex items-center gap-2">
                        <Leaf className="h-8 w-8 text-emerald-600" />
                        <Link href="/" className="text-2xl font-bold text-emerald-600">
                            Felidae Learn
                        </Link>
                    </div>
                    <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Buat Kata Sandi Baru
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Masukkan kata sandi baru Anda. Pastikan kata sandi minimal 6 karakter.
                    </p>

                    {/* Loading state saat verify token */}
                    {isVerifying ? (
                        <div className="mt-8 flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                            <p className="mt-4 text-sm text-gray-600">Memverifikasi link reset password...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            {/* Success/Error Message */}
                            {message && (
                                <div
                                    className={`rounded-md p-4 ${message.type === "success"
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                        : "bg-red-50 text-red-800 border border-red-200"
                                        }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="password">Kata Sandi Baru</Label>
                                <div className="relative mt-2">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                                <div className="relative mt-2">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memperbarui...
                                        </>
                                    ) : (
                                        "Reset Kata Sandi"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center space-y-2">
                        {message?.type === "error" && (
                            <div className="mb-4">
                                <Link
                                    href="/reset-password"
                                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                                >
                                    Request Reset Password Baru
                                </Link>
                            </div>
                        )}
                        <Link href="/login" className="block text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                            Kembali ke halaman login
                        </Link>
                    </div>
                </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://res.cloudinary.com/dan5wstbj/image/upload/v1738862644/felidae_ptwlnx.png"
                    alt="Felidae background"
                    fill
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 flex items-center justify-center p-6">
                    <div className="max-w-md text-center">
                        <p className="text-white text-2xl font-bold mb-4">
                            &ldquo;Taxonomy is the science of naming, describing and classifying organisms&rdquo;
                        </p>
                        <p className="text-emerald-400 text-xl">- Carl Linnaeus</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
