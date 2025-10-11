"use client"

import { Navbar } from "@/components/navbar-v2"
import { useEffect, useState } from "react"

const funFacts = [
  "Tahukah kamu? Harimau Sumatra hanya hidup di Pulau Sumatra.",
  "Kucing dapat mendengar suara dengan frekuensi hingga 64.000 Hz!",
  "Macan tutul dapat melompat hingga 6 meter secara horizontal.",
  "Singa betina adalah pemburu utama dalam kelompok mereka.",
  "Cheetah dapat berlari hingga 120 km/jam dalam waktu singkat.",
  "Lynx memiliki pendengaran yang sangat tajam berkat telinga berbulu.",
  "Jaguar memiliki gigitan terkuat di antara semua kucing besar.",
  "Puma dapat hidup di berbagai habitat, dari gurun hingga hutan hujan.",
]

export function SpeciesLoading() {
  const [funFact, setFunFact] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)]
    setFunFact(randomFact)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/50 p-8 max-w-lg w-full text-center border border-green-100/20">
          <div className="relative mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg shadow-green-200/30">
              <div className="h-10 w-10 animate-spin">
                <div className="h-full w-full rounded-full border-4 border-green-200 border-t-[#2ECC71]"></div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 text-[#2ECC71] animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V7C3 8.1 3.9 9 5 9H8V11C8 12.1 8.9 13 10 13H14C15.1 13 16 12.1 16 11V9H21ZM5 22L10 18V22H14V18L19 22H5Z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Sedang menjelajah data spesies...</h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Mohon tunggu sebentar … mengambil informasi lengkap tentang spesies ini.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-100">
            <p className="text-sm text-gray-700 font-medium">{funFact}</p>
          </div>

          <div className="relative">
            <div className="h-3 bg-green-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#2ECC71] to-emerald-500 rounded-full transition-all duration-300 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Mengambil data...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
