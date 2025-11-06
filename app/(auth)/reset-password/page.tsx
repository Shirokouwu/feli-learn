"use client"

import Image from "next/image"
import Link from "next/link"
import { Leaf, Loader2 } from "lucide-react"
import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestPasswordReset } from "./actions"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Call server action untuk kirim reset email
    const result = await requestPasswordReset(email)

    if (result.success) {
      setMessage({ type: "success", text: result.message || "" })
      setEmail("") // Clear input setelah berhasil
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
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Reset Kata Sandi</h2>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi Anda.
          </p>

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
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Tautan Reset"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500">
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

