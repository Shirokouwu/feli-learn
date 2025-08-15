"use client";
import { useState, useEffect } from "react"
import { toast } from "sonner"
import axios from 'axios'
import { matchAndFetchSpeciesData, type ApiClassificationResponse, type EnhancedSpeciesData } from "@/lib/species-matcher"
import type { Species } from "@/types"
import { useIncrementScan } from "./use-scan-stats"

export interface ScannerHook {
  previewImage: string | null
  setPreviewImage: (image: string | null) => void
  isScanning: boolean
  scanProgress: number
  scanResult: Species | null
  enhancedSpeciesData: EnhancedSpeciesData | null
  scanStage: string
  showConfetti: boolean
  imageUrl: string
  scanDuration: number
  setImageUrl: (url: string) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleUrlSubmit: () => void
  resetScan: () => void
  rescan: () => void
  apiReady: boolean
  apiChecking: boolean
  apiResponse: { data: { status: string } }
  clearFileInput: () => void
}

export const useScannerLogic = (): ScannerHook => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResult, setScanResult] = useState<Species | null>(null)
  const [enhancedSpeciesData, setEnhancedSpeciesData] = useState<EnhancedSpeciesData | null>(null)
  const [scanStage, setScanStage] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [scanStartTime, setScanStartTime] = useState<number>(0)
  const [scanDuration, setScanDuration] = useState<number>(0)

  // Scan stats mutation
  const incrementScanMutation = useIncrementScan()

  // API health check state
  const [apiChecking, setApiChecking] = useState<boolean>(true)
  const [apiReady, setApiReady] = useState<boolean>(false)
  const [apiResponse, setApiResponse] = useState<{ data: { status: string } }>({
    data: { status: "unknown" }
  })

  const API_MODEL_URL = process.env.NEXT_PUBLIC_API_MODEL_URL || ""
  const API_MODEL_HEALTH_URL = process.env.NEXT_PUBLIC_API_MODEL_HEALTH_URL || ""

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      if (!API_MODEL_HEALTH_URL) {
        console.log("❌ API_MODEL_HEALTH_URL is empty or undefined")
        setApiChecking(false)
        setApiReady(false)
        setApiResponse({ data: { status: "error - no URL" } })
        return
      }

      setApiChecking(true)

      try {
        const fetchResponse = await fetch(API_MODEL_HEALTH_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        })

        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`)
        }

        const data = await fetchResponse.json()

        const mockResponse = { data: data, status: fetchResponse.status }
        setApiResponse(mockResponse)
        setApiReady(data.status === "ok")

        if (data.status === "ok") {
          console.log("✅ API is ready!")
        } else {
          console.log("⚠️ API status is not ok:", data.status)
        }

      } catch (error) {
        console.error("❌ API Health Check Error:", error)

        let errorMessage = "Unknown error"
        if (error instanceof Error) {
          errorMessage = error.message
        }

        // If it's a CORS error, we assume the API is available but blocked by browser
        if (error instanceof TypeError && (errorMessage.includes('CORS') || errorMessage.includes('fetch'))) {
          console.log("🔄 CORS error detected, but assuming API is available for direct calls")
          setApiReady(true) // Assume API is available despite CORS
          setApiResponse({ data: { status: "cors-blocked-but-available" } })
        } else {
          setApiReady(false)
          setApiResponse({ data: { status: "error" } })
          toast.error("API Model tidak dapat diakses. Silakan hubungi developer untuk bantuan.")
        }
      } finally {
        setApiChecking(false)
      }
    }

    checkApiHealth()
    // Check API health only once on component mount

    return () => {
      // No cleanup needed since we're not using setInterval
    }
  }, [API_MODEL_HEALTH_URL])

  const resetScan = () => {
    setPreviewImage(null)
    setScanResult(null)
    setEnhancedSpeciesData(null)
    setScanProgress(0)
    setScanStage("")
    setShowConfetti(false)
    setScanDuration(0)
    setScanStartTime(0) // Reset start time
  }

  const processScanResult = (apiData: ApiClassificationResponse, enhancedData: EnhancedSpeciesData | null, imageSource: string, scannerDuration: number, fetchDuration: number) => {
    const totalDuration = scannerDuration + fetchDuration

    console.log("Timing breakdown:", {
      scannerDuration,
      fetchDuration,
      totalDuration
    })

    setScanDuration(totalDuration)

    setScanProgress(100)
    setIsScanning(false)
    setScanStage("Identifikasi selesai!")
    setShowConfetti(true)    // Increment scan counter in Redis
    
    incrementScanMutation.mutate(undefined, {
      onSuccess: () => {
        // Scan count incremented successfully
      },
      onError: (error) => {
        // Failed to increment scan count - non-critical error
      }
    })

    // Hide confetti after a few seconds
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)

    if (enhancedData) {
      // Set enhanced species data
      setEnhancedSpeciesData(enhancedData)

      // Also set the basic scan result for backward compatibility
      setScanResult({
        id: apiData.species_key || "unknown-species",
        name: enhancedData.identifikasi.nama_umum || apiData.predicted_class,
        scientific_name: enhancedData.identifikasi.nama_ilmiah || "Unknown species",
        description: enhancedData.ringkasan.deskripsi_umum || "Tidak ada deskripsi yang tersedia untuk spesies ini.",
        characteristics: {
          Berat: enhancedData.ringkasan.karakteristik.berat || "Unknown",
          Panjang: enhancedData.ringkasan.karakteristik.panjang || "Unknown",
          Tinggi: enhancedData.ringkasan.karakteristik.tinggi || "Unknown",
          Umur: enhancedData.ringkasan.karakteristik.umur || "Unknown",
        },
        habitat: "Beragam habitat alami",
        distribution: enhancedData.distribusi.negara.join(", "),
        conservation_status: enhancedData.identifikasi.status.konservasi,
        image_url: enhancedData.gambar.utama || imageSource,
        genus_id: "felidae",
        created_at: new Date().toISOString(),
        lifespan: enhancedData.ringkasan.karakteristik.umur || "Unknown",
        genus: "Felidae"
      } as Species)
    } else {
      // Fallback to basic data if database enhancement fails
      setScanResult({
        id: apiData.species_key || "unknown-species",
        name: apiData.predicted_class || "Spesies Tidak Diketahui",
        scientific_name: "Unknown species",
        description: "Identifikasi berhasil, namun data lengkap tidak tersedia di database.",
        characteristics: {
          Berat: "Unknown",
          Panjang: "Unknown",
          Tinggi: "Unknown",
          Umur: "Unknown",
        },
        habitat: "Unknown",
        distribution: "Unknown",
        conservation_status: "Unknown",
        image_url: imageSource,
        genus_id: "felidae",
        created_at: new Date().toISOString(),
        lifespan: "Unknown",
        genus: "Felidae"
      } as Species)

      toast("Spesies berhasil diidentifikasi, namun data lengkap tidak tersedia.")
    }
  }

  const startScanProgress = () => {
    return setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 3 // Slower progress for more granular control

        // Update scan stage based on progress - Scanner phase (0-50%)
        if (newProgress === 15) {
          setScanStage("Mendeteksi fitur morfologi...")
        } else if (newProgress === 30) {
          setScanStage("Menganalisis pola warna dan tekstur...")
        } else if (newProgress === 45) {
          setScanStage("Memproses dengan AI model...")
        }

        return newProgress < 50 ? newProgress : 50 // Stop at 50% for scanner phase
      })
    }, 150) // Slower interval
  }

  const startFetchProgress = () => {
    return setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 5

        // Update scan stage based on progress - Fetch phase (60-95%)
        if (newProgress === 70) {
          setScanStage("Mencocokkan dengan database taksonomi...")
        } else if (newProgress === 85) {
          setScanStage("Menyusun informasi lengkap spesies...")
        }

        return newProgress < 95 ? newProgress : 95 // Stop at 95% until complete
      })
    }, 200)
  }

  const handleFilePrediction = async (file: File) => {
    if (!apiReady) {
      toast.error("API model tidak tersedia. Silakan hubungi developer untuk bantuan.")
      return
    }

    setIsScanning(true)
    setScanProgress(0)
    setScanStage("Memulai analisis gambar...")
    setScanResult(null)
    setEnhancedSpeciesData(null)

    try {
      const progressInterval = startScanProgress()

      // Step 1: Scanner Phase - Call the API for classification
      const scannerStartTime = Date.now()
      setScanStage("Menganalisis gambar dengan AI...")

      const formData = new FormData()
      formData.append('image', file)
      formData.append('threshold', '0.7')

      const response = await fetch(`${API_MODEL_URL}/predict/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const apiData: ApiClassificationResponse = await response.json()
      const scannerEndTime = Date.now()
      const scannerDuration = Math.round((scannerEndTime - scannerStartTime) / 1000)

      // Stop the scanner progress interval
      clearInterval(progressInterval)

      // Check if it's a Felidae species
      if (!apiData.is_felidae) {
        setIsScanning(false)
        setScanProgress(0)
        setScanStage("")
        toast("Gambar ini bukan termasuk keluarga Felidae (kucing). Silakan coba gambar kucing lain.")
        return
      }


      setScanProgress(55)
      setScanStage("Menghubungkan ke database...")


      await new Promise(resolve => setTimeout(resolve, 100))

      // Fetch Phase - Get enhanced data from database
      const fetchStartTime = Date.now()
      setScanStage("Mengambil data lengkap dari database...")
      setScanProgress(60)

      const fetchProgressInterval = startFetchProgress()

      const enhancedData = await matchAndFetchSpeciesData(apiData)
      const fetchEndTime = Date.now()
      const fetchDuration = Math.round((fetchEndTime - fetchStartTime) / 1000)

      clearInterval(fetchProgressInterval)
      processScanResult(apiData, enhancedData, URL.createObjectURL(file), scannerDuration, fetchDuration)

    } catch (error) {
      console.error("Error during image prediction:", error)
      setIsScanning(false)
      setScanProgress(0)
      setScanStage("")
      toast("Terjadi kesalahan saat analisis gambar. Silakan coba lagi.")
    }
  }

  const handleUrlPrediction = async (imageSource: string) => {
    if (!apiReady) {
      toast.error("API model tidak tersedia. Silakan hubungi developer untuk bantuan.")
      return
    }

    setIsScanning(true)
    setScanProgress(0)
    setScanStage("Memulai analisis gambar...")
    setScanResult(null)
    setEnhancedSpeciesData(null)

    try {
      const progressInterval = startScanProgress()

      // Step 1: Scanner Phase - Call the API for classification
      const scannerStartTime = Date.now()
      setScanStage("Menganalisis gambar dengan AI...")

      const response = await axios.post(`${API_MODEL_URL}/predict/url`, {
        url: imageSource,
        threshold: 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const apiData: ApiClassificationResponse = response.data
      const scannerEndTime = Date.now()
      const scannerDuration = Math.round((scannerEndTime - scannerStartTime) / 1000)

      // Stop the scanner progress interval
      clearInterval(progressInterval)

      // Step 2: Check if it's a Felidae species
      if (!apiData.is_felidae) {
        setIsScanning(false)
        setScanProgress(0)
        setScanStage("")
        toast("Gambar ini bukan termasuk keluarga Felidae (kucing). Silakan coba gambar kucing lain.")
        return
      }

      // Step 2.5: Transition phase - Show that we got the species and connecting to database
      setScanProgress(55)
      setScanStage("Menghubungkan ke database...")

      // Small delay to show the transition
      await new Promise(resolve => setTimeout(resolve, 100))

      // Step 3: Fetch Phase - Get enhanced data from database
      const fetchStartTime = Date.now()
      setScanStage("Mengambil data lengkap dari database...")
      setScanProgress(60) // Update progress to show we're in fetch phase

      const fetchProgressInterval = startFetchProgress()

      const enhancedData = await matchAndFetchSpeciesData(apiData)
      const fetchEndTime = Date.now()
      const fetchDuration = Math.round((fetchEndTime - fetchStartTime) / 1000)

      clearInterval(fetchProgressInterval)
      processScanResult(apiData, enhancedData, imageSource, scannerDuration, fetchDuration)

    } catch (error) {
      console.error("Error during image prediction:", error)
      setIsScanning(false)
      setScanProgress(0)
      setScanStage("")
      toast("Terjadi kesalahan saat analisis gambar. Silakan coba lagi.")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!apiReady) {
      toast.error("API model tidak tersedia. Silakan hubungi developer untuk bantuan.")
      return
    }

    if (file) {
      // Validasi ukuran file (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast("Ukuran file terlalu besar. Maksimal 10MB.")
        // Clear the file input
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.")
        // Clear the file input
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      // Validasi nama file (opsional: cek ekstensi)
      const fileName = file.name.toLowerCase()
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))

      if (!hasValidExtension) {
        toast("Ekstensi file tidak valid. Gunakan .jpg, .jpeg, .png, atau .webp")
        // Clear the file input
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      // Validasi dimensi gambar minimum (opsional)
      const img = new Image()
      img.onload = () => {
        // Cleanup object URL
        URL.revokeObjectURL(img.src)

        // Cek dimensi minimum untuk kualitas yang baik
        if (img.width < 100 || img.height < 100) {
          toast("Resolusi gambar terlalu kecil. Minimal 100x100 piksel untuk hasil terbaik.")
          // Clear the file input
          if (event.target) {
            event.target.value = ""
          }
          return
        }

        // Jika semua validasi lolos, proses file
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImage(reader.result as string)
          handleFilePrediction(file)
        }
        reader.readAsDataURL(file)
      }

      img.onerror = () => {
        // Cleanup object URL
        URL.revokeObjectURL(img.src)

        toast("File gambar tidak valid atau rusak.")
        // Clear the file input
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      // Buat URL untuk validasi dimensi
      img.src = URL.createObjectURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast("Masukkan URL gambar terlebih dahulu.")
      return
    }

    // Validasi format URL
    try {
      const url = new URL(imageUrl)

      // Validasi protokol
      if (!['http:', 'https:'].includes(url.protocol)) {
        toast("URL harus menggunakan protokol HTTP atau HTTPS.")
        return
      }

      // Validasi ekstensi file dari URL
      const pathname = url.pathname.toLowerCase()
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
      const hasValidExtension = allowedExtensions.some(ext => pathname.endsWith(ext))

      if (!hasValidExtension) {
        toast("URL harus mengarah ke file gambar dengan ekstensi .jpg, .jpeg, .png, atau .webp")
        return
      }

    } catch (error) {
      toast("Format URL tidak valid. Pastikan URL lengkap dan benar.")
      return
    }

    if (!apiReady) {
      toast.error("API model tidak tersedia. Silakan hubungi developer untuk bantuan.")
      return
    }

    setPreviewImage(imageUrl)
    handleUrlPrediction(imageUrl)
  }

  const rescan = () => {
    if (previewImage) {
      // TODO: Implement rescan logic based on current image type
      toast("Fitur scan ulang akan segera tersedia")
    }
  }

  const clearFileInput = () => {
    // Function to clear file input if accessible
    // This will be called from parent component when needed
  }

  return {
    previewImage,
    setPreviewImage,
    isScanning,
    scanProgress,
    scanResult,
    enhancedSpeciesData,
    scanStage,
    showConfetti,
    imageUrl,
    scanDuration,
    setImageUrl,
    handleFileUpload,
    handleUrlSubmit,
    resetScan,
    rescan,
    apiReady,
    apiChecking,
    apiResponse,
    clearFileInput
  }
}
