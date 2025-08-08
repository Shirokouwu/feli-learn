import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from 'axios'
import { matchAndFetchSpeciesData, type ApiClassificationResponse, type EnhancedSpeciesData } from "@/lib/species-matcher"
import type { Species } from "@/types"

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
  setImageUrl: (url: string) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleUrlSubmit: () => void
  resetScan: () => void
  rescan: () => void
  apiReady: boolean
  apiChecking: boolean
  apiResponse: { data: { status: string } }
}

export const useScannerLogic = (): ScannerHook => {
  const router = useRouter()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResult, setScanResult] = useState<Species | null>(null)
  const [enhancedSpeciesData, setEnhancedSpeciesData] = useState<EnhancedSpeciesData | null>(null)
  const [scanStage, setScanStage] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")

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
        }
      } finally {
        setApiChecking(false)
      }
    }

    checkApiHealth()
    // Check API health every 30 seconds
    const interval = setInterval(checkApiHealth, 30000)

    return () => clearInterval(interval)
  }, [API_MODEL_HEALTH_URL])

  const resetScan = () => {
    setPreviewImage(null)
    setScanResult(null)
    setEnhancedSpeciesData(null)
    setScanProgress(0)
    setScanStage("")
    setShowConfetti(false)
  }

  const processScanResult = (apiData: ApiClassificationResponse, enhancedData: EnhancedSpeciesData | null, imageSource: string) => {
    setScanProgress(100)
    setIsScanning(false)
    setScanStage("Identifikasi selesai!")
    setShowConfetti(true)

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
        const newProgress = prev + 5

        // Update scan stage based on progress
        if (newProgress === 20) {
          setScanStage("Mendeteksi fitur morfologi...")
        } else if (newProgress === 40) {
          setScanStage("Menganalisis pola warna dan tekstur...")
        } else if (newProgress === 60) {
          setScanStage("Membandingkan dengan database spesies...")
        } else if (newProgress === 80) {
          setScanStage("Mencocokkan dengan database taksonomi...")
        } else if (newProgress === 90) {
          setScanStage("Menyusun informasi lengkap spesies...")
        }

        return newProgress < 95 ? newProgress : 95 // Stop at 95% until API returns
      })
    }, 100)
  }

  const handleFilePrediction = async (file: File) => {
    if (!apiReady) {
      toast("API model tidak tersedia. Silakan coba lagi nanti.")
      return
    }

    setIsScanning(true)
    setScanProgress(0)
    setScanStage("Memulai analisis gambar...")
    setScanResult(null)
    setEnhancedSpeciesData(null)

    try {
      const progressInterval = startScanProgress()

      // Step 1: Call the API for classification
      const formData = new FormData()
      formData.append('image', file)
      formData.append('threshold', '0.7')

      const response = await fetch(`${API_MODEL_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const apiData: ApiClassificationResponse = await response.json()

      // Step 2: Check if it's a Felidae species
      if (!apiData.is_felidae) {
        clearInterval(progressInterval)
        setIsScanning(false)
        setScanProgress(0)
        setScanStage("")
        toast("Gambar ini bukan termasuk keluarga Felidae (kucing). Silakan coba gambar kucing lain.")
        return
      }

      setScanStage("Mengambil data lengkap dari database...")

      // Step 3: Fetch enhanced data from database
      const enhancedData = await matchAndFetchSpeciesData(apiData)

      clearInterval(progressInterval)
      processScanResult(apiData, enhancedData, URL.createObjectURL(file))

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
      toast("API model tidak tersedia. Silakan coba lagi nanti.")
      return
    }

    setIsScanning(true)
    setScanProgress(0)
    setScanStage("Memulai analisis gambar...")
    setScanResult(null)
    setEnhancedSpeciesData(null)

    try {
      const progressInterval = startScanProgress()

      // Step 1: Call the API for classification
      const response = await axios.post(`${API_MODEL_URL}/url`, {
        url: imageSource,
        threshold: 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const apiData: ApiClassificationResponse = response.data

      // Step 2: Check if it's a Felidae species
      if (!apiData.is_felidae) {
        clearInterval(progressInterval)
        setIsScanning(false)
        setScanProgress(0)
        setScanStage("")
        toast("Gambar ini bukan termasuk keluarga Felidae (kucing). Silakan coba gambar kucing lain.")
        return
      }

      setScanStage("Mengambil data lengkap dari database...")

      // Step 3: Fetch enhanced data from database
      const enhancedData = await matchAndFetchSpeciesData(apiData)

      clearInterval(progressInterval)
      processScanResult(apiData, enhancedData, imageSource)

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
      toast("API model tidak tersedia. Silakan coba lagi nanti.")
      return
    }

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        handleFilePrediction(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (!imageUrl) return

    setPreviewImage(imageUrl)
    handleUrlPrediction(imageUrl)
  }

  const rescan = () => {
    if (previewImage) {
      // TODO: Implement rescan logic based on current image type
      toast("Fitur scan ulang akan segera tersedia")
    }
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
    setImageUrl,
    handleFileUpload,
    handleUrlSubmit,
    resetScan,
    rescan,
    apiReady,
    apiChecking,
    apiResponse
  }
}
