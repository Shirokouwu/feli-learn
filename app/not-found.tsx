import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"

export default async function NotFound() {

  const headersList = await headers()
  const referer = headersList.get("referer")


  let previousPath = "/"
  if (referer) {
    try {
      const url = new URL(referer)
      previousPath = url.pathname
    } catch (error) {
      // If referrer is invalid, fallback to home
      previousPath = "/"
    }
  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="https://images.unsplash.com/photo-1517213849290-bbbfffdc6da3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Confused cat"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Oops! Sepertinya halaman yang Anda cari telah berpindah atau tidak ada. Jangan khawatir, mari kembali ke
          halaman utama!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {previousPath !== "/" && (
            <Button asChild variant="default">
              <Link href={previousPath}>Kembali ke Halaman Sebelumnya</Link>
            </Button>
          )}
          <Button asChild variant={previousPath !== "/" ? "outline" : "default"}>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-800">
            "Bahkan kucing pun kadang tersesat, tapi mereka selalu menemukan jalan pulang! 🐱"
          </p>
        </div>
      </div>
    </div>
  )
}

