"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation";
import { Leaf, CheckCircle2, Mail, Clock, Heart, PawPrintIcon as Paw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { createClient } from "@/utils/supabase/client"

// Paw print emotes that will appear randomly
const pawEmotes = ["🐾", "😺", "😸", "😹", "😻", "😽", "🐱"]

export default function ConfirmEmailPage() {
  const [timeLeft, setTimeLeft] = useState(300) // 5 menit dalam detik
  const [isVerified, setIsVerified] = useState(false)
  const [showResendMessage, setShowResendMessage] = useState(false)
  const [pawEmote, setPawEmote] = useState<{ id: number; emote: string; x: number; y: number }[]>([])


  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // misal URL: ?email=foo@bar.com

  // Function to create confetti effect
  const throwConfetti = useCallback(() => {
    const duration = 3 * 1000
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(() => {
      const particleCount = 50
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    setTimeout(() => clearInterval(interval), duration)
  }, [])

  // Function to play cat sound
  const playCatSound = useCallback(() => {
    const audio = new Audio("/meow.mp3") // You'll need to add this sound file to your public folder
    audio.volume = 0.5
    audio.play()
  }, [])

  // Function to add random paw emotes
  const addPawEmote = useCallback(() => {
    const id = Date.now()
    const emote = pawEmotes[Math.floor(Math.random() * pawEmotes.length)]
    const x = Math.random() * 100 // Random x position (0-100%)
    const y = Math.random() * 100 // Random y position (0-100%)

    setPawEmote((prev) => [...prev, { id, emote, x, y }])
    setTimeout(() => {
      setPawEmote((prev) => prev.filter((p) => p.id !== id))
    }, 2000)
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isVerified])

  // Add random paw emotes periodically
  useEffect(() => {
    if (!isVerified) {
      const interval = setInterval(addPawEmote, 3000)
      return () => clearInterval(interval)
    }
  }, [isVerified, addPawEmote])

  // Check verification status from Supabase
  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(async () => {
      const supabase = createClient()

      // Ganti 'users' jika nama tabel berbeda
      const { data } = await supabase
        .from('users')
        .select('is_active')
        .eq('email', email)
        .single();

      if (data && data.is_active) {
        setIsVerified((prev) => {
          if (!prev) {
            throwConfetti()
            playCatSound()
          }
          return true
        })
      } else {
        setIsVerified(false)
      }
    }, 2000) // request setiap 2 detik

    return () => clearInterval(interval)
  }, [email, throwConfetti, playCatSound])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Saat resend, reset timer ke 5 menit
  const handleResend = () => {
    setTimeLeft(300)
    setShowResendMessage(true)
    setTimeout(() => setShowResendMessage(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-4 py-16 overflow-hidden">
      {/* Floating Paw Emotes */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence>
          {pawEmote.map(({ id, emote, x, y }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute text-2xl"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {emote}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-md mx-auto relative">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <Link href="/" className="text-2xl font-bold text-emerald-600">
              Felidae Learn
            </Link>
          </div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!isVerified ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <motion.div
                      className="w-32 h-32 mx-auto relative rounded-full overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3"
                        alt="Cute cat waiting"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute -right-2 -top-2 bg-emerald-100 rounded-full p-2 shadow-lg"
                    >
                      <Mail className="h-4 w-4 text-emerald-600" />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Meow! Tunggu Sebentar...</h2>
                    <p className="text-gray-600 mb-4">
                      Kami sedang memverifikasi email kamu. Sambil menunggu, coba cek kotak masuk email kamu ya!
                      <span className="text-emerald-600 ml-1">✨</span>
                    </p>
                  </div>
                  <motion.div
                    className="flex items-center justify-center gap-2 text-emerald-600"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Clock className="h-5 w-5 animate-pulse" />
                    <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key="verified" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="relative">
                    <motion.div
                      className="w-32 h-32 mx-auto relative rounded-full overflow-hidden"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, -5, 0],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3"
                        alt="Happy cat"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                      className="absolute -right-2 -top-2 bg-emerald-100 rounded-full p-2 shadow-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Purrfect! Email Terverifikasi</h2>
                    <p className="text-gray-600">
                      Selamat datang di keluarga Felidae Learn!
                      <span className="text-emerald-600 ml-1">🎉</span>
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button variant="outline" className="w-full group hover:bg-emerald-600 transition-all duration-300" asChild>
              <Link href="/login">
                <span className="group-hover:text-white transition-colors">Kembali ke Halaman Login</span>
                <Paw className="ml-2 h-4 w-4 group-hover:text-white transition-colors" />
              </Link>
            </Button>

            {!isVerified && (
              <div className="relative">
                <motion.button
                  onClick={handleResend}
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 mx-auto group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Kirim Ulang Email</span>
                  <Heart className="h-4 w-4 group-hover:text-pink-500 transition-colors duration-300" />
                </motion.button>
                <AnimatePresence>
                  {showResendMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm shadow-lg"
                    >
                      Email baru telah dikirim! 🌟
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 rounded-xl bg-emerald-50 p-6 text-left relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <span>Tips Menarik</span>
                <span className="text-lg">🐱</span>
              </h3>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span>Cek folder spam jika email tidak ditemukan di kotak masuk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span>Pastikan alamat email yang didaftarkan sudah benar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span>Sambil menunggu, kamu bisa siapkan makanan untuk kucing kesayanganmu!</span>
                </li>
              </ul>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 to-transparent"
              animate={{
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

