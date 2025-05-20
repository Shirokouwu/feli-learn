"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Mail, ArrowRight, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const handleVerification = async () => {
    setIsVerifying(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000000))
    setIsVerifying(false)
    setVerificationSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-emerald-600">
            <Leaf className="h-8 w-8" />
            <span>Felidae Learn</span>
          </Link>
        </div>

        {/* Notice for Non-registered Users */}
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Jika kamu tidak pernah mendaftar di Felidae Learn, kamu bisa mengabaikan email ini. Mungkin seseorang salah
            memasukkan alamat email.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Illustration */}
          <div className="mb-8 relative h-48">
            <Image
              src="https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3"
              alt="Cute cat waiting for email verification"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-lg">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-white">Menunggu Verifikasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">Verifikasi Email Kamu</h1>
            <p className="text-gray-600">
              Hai Felidae Learner! Hanya beberapa langkah lagi sebelum kamu dapat memulai petualangan pembelajaran
              taksonomi bersama kami.
            </p>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-emerald-800">
                Gunakan tombol dibawah ini untuk memverifikasi email kamu dan mulai menjelajahi dunia Felidae!
              </p>
            </div>

            {/* Verification Button */}
            <div className="pt-4">
              <Button
                onClick={handleVerification}
                disabled={isVerifying || verificationSent}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    <span>Memverifikasi...</span>
                  </div>
                ) : verificationSent ? (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Verifikasi Terkirim!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Verifikasi Email Sekarang</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="pt-6 border-t">
              <p className="text-sm text-gray-500">
                Jika tombol diatas tidak berfungsi, cek folder spam atau klik tautan yang kami kirimkan ke email kamu
              </p>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center space-y-4">
          <Button variant="outline" asChild className="group">
            <Link href="/login">
              <span>Kembali ke halaman login</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="text-sm text-gray-600">
            Butuh bantuan?{" "}
            <Link href="/help" className="text-emerald-600 hover:text-emerald-500 transition-colors">
              Hubungi kami
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

