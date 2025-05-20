"use client"

import Image from "next/image"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1529&q=80"
            alt="Sad cat"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Ada yang Tidak Beres</h1>
        <p className="text-gray-600 mb-8">
          Sepertinya ada kesalahan teknis. Jangan khawatir, ini bukan karena Anda! Mari kita coba lagi.
        </p>
        <div className="space-y-4">
          <Button onClick={reset} variant="default">
            Coba Lagi
          </Button>
          <Button variant="outline" asChild className="ml-4">
            <a href="/">Kembali ke Beranda</a>
          </Button>
        </div>
        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-800">
            "Kucing pun kadang membuat kesalahan, tapi mereka selalu bangkit kembali dengan anggun! 🐱"
          </p>
        </div>
      </div>
    </div>
  )
}

