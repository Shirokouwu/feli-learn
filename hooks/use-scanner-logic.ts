"use client";
import { useState, useEffect } from "react"
import { toast } from "sonner"
import axios from 'axios'
import { matchAndFetchSpeciesData, type ApiClassificationResponse, type EnhancedSpeciesData } from "@/lib/species-matcher"
import type { Species } from "@/types"
import { useIncrementScan } from "./use-scan-stats"
import { saveScanResult } from "@/lib/actions/scan-history-actions"
import { uploadScanImage } from "@/lib/actions/upload-scan-actions"
import { useQueryClient } from "@tanstack/react-query"
import { recentScansQueryKeys } from "./use-recent-scans"
import { scanHistoryQueryKeys } from "./use-scan-history"

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
  notFelidae: boolean
  notFelidaeMessage: string
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
  const [notFelidae, setNotFelidae] = useState<boolean>(false)
  const [notFelidaeMessage, setNotFelidaeMessage] = useState<string>("")
  const [currentBase64Image, setCurrentBase64Image] = useState<string | null>(null) // Store base64 for upload

  // Scan stats mutation
  const incrementScanMutation = useIncrementScan()

  // Query client untuk invalidate cache
  const queryClient = useQueryClient()

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
        // console.log("❌ API_MODEL_HEALTH_URL is empty or undefined")
        setApiChecking(false)
        setApiReady(false)
        setApiResponse({ data: { status: "error - no URL" } })
        return
      }

      setApiChecking(true)

      try {
        const fetchResponse = await axios.get(API_MODEL_HEALTH_URL, {
          timeout: 10000, // 10 seconds timeout
          validateStatus: (status) => status >= 200 && status < 300
        })

        if (!fetchResponse.status || fetchResponse.status < 200 || fetchResponse.status >= 300) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`)
        }

        const data = fetchResponse.data

        const mockResponse = { data: data, status: fetchResponse.status }
        setApiResponse(mockResponse)
        setApiReady(data.status === "ok")

        if (data.status === "ok") {
          // console.log("✅ API is ready!")!")
        } else {
          // console.log("⚠️ API status is not ok:", data.status)
        }

      } catch (error) {
        console.error("❌ API Health Check Error:", error)

        let errorMessage = "Unknown error"
        if (error instanceof Error) {
          errorMessage = error.message
        }

        // If it's a timeout or network error, assume API might be slow but available
        if (error instanceof Error && (errorMessage.includes('timeout') || errorMessage.includes('Network Error'))) {
          // console.log("⏰ API timeout detected, but assuming API is available for direct calls")
          setApiReady(true) // Assume API is available despite timeout
          setApiResponse({ data: { status: "timeout-but-available" } })
        }
        // If it's a CORS error, we assume the API is available but blocked by browser
        else if (error instanceof TypeError && (errorMessage.includes('CORS') || errorMessage.includes('fetch'))) {
          // console.log("🔄 CORS error detected, but assuming API is available for direct calls")
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

    // Only check once on mount, don't re-check constantly
    let mounted = true
    if (mounted) {
      checkApiHealth()
    }

    return () => {
      mounted = false
    }
  }, []) // Removed API_MODEL_HEALTH_URL dependency to prevent re-checking

  const resetScan = () => {
    setPreviewImage(null)
    setScanResult(null)
    setEnhancedSpeciesData(null)
    setScanProgress(0)
    setScanStage("")
    setShowConfetti(false)
    setScanDuration(0)
    setScanStartTime(0) // Reset start time
    setNotFelidae(false)
    setNotFelidaeMessage("")
    setCurrentBase64Image(null) // Clear base64 cache
  }

  const processScanResult = async (apiData: ApiClassificationResponse, enhancedData: EnhancedSpeciesData | null, imageSource: string, scannerDuration: number, fetchDuration: number) => {
    const totalDuration = scannerDuration + fetchDuration

    // console.log("Timing breakdown:", {
    //   scannerDuration,
    //   fetchDuration,
    //   totalDuration
    // })

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

      // Simpan hasil scan ke database
      try {
        // Normalize confidence to 0-100 range
        const normalizedAccuracy = apiData.confidence > 1
          ? Math.min(apiData.confidence, 100) // Already in percentage
          : apiData.confidence * 100 // Convert from 0-1 to percentage

        // Upload image to Supabase storage
        setScanStage("Menyimpan foto scan...")
        const uploadResult = await uploadScanImage(imageSource)

        const imageUrl = uploadResult.url || imageSource // Fallback to original if upload fails

        const result = await saveScanResult({
          spesies_id: enhancedData.identifikasi.id || null,
          akurasi: Number(normalizedAccuracy.toFixed(2)), // Ensure 2 decimal places
          foto_scan: imageUrl, // Use uploaded URL
          catatan: `Teridentifikasi sebagai ${enhancedData.identifikasi.nama_umum} dengan akurasi ${normalizedAccuracy.toFixed(1)}%`
        })

        if (result.success) {
          // Invalidate cache untuk refresh recent scans dan stats
          queryClient.invalidateQueries({ queryKey: recentScansQueryKeys.all })
          queryClient.invalidateQueries({ queryKey: scanHistoryQueryKeys.all })
        }
      } catch (error) {
        console.error("Error saving scan result:", error)
        // Non-critical error, tidak perlu toast
      }
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

      // Simpan hasil scan tanpa spesies_id
      try {
        // Normalize confidence to 0-100 range
        const normalizedAccuracy = apiData.confidence > 1
          ? Math.min(apiData.confidence, 100) // Already in percentage
          : apiData.confidence * 100 // Convert from 0-1 to percentage

        // Upload image to Supabase storage
        setScanStage("Menyimpan foto scan...")
        const uploadResult = await uploadScanImage(imageSource)

        const imageUrl = uploadResult.url || imageSource // Fallback to original if upload fails

        await saveScanResult({
          spesies_id: null,
          akurasi: Number(normalizedAccuracy.toFixed(2)), // Ensure 2 decimal places
          foto_scan: imageUrl, // Use uploaded URL
          catatan: `Teridentifikasi sebagai ${apiData.predicted_class} (data lengkap tidak tersedia)`
        })

        queryClient.invalidateQueries({ queryKey: recentScansQueryKeys.all })
        queryClient.invalidateQueries({ queryKey: scanHistoryQueryKeys.all })
      } catch (error) {
        console.error("Error saving scan result:", error)
      }

      toast("Spesies berhasil diidentifikasi, namun data lengkap tidak tersedia.")
    }
  }

  const startScanProgress = () => {
    return setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 2 // Faster progress for quicker feedback

        // Update scan stage based on progress - Scanner phase (0-50%)
        if (newProgress === 10) {
          setScanStage("Mendeteksi fitur morfologi...")
        } else if (newProgress === 25) {
          setScanStage("Menganalisis pola warna dan tekstur...")
        } else if (newProgress === 40) {
          setScanStage("Memproses dengan AI model...")
        }

        return newProgress < 50 ? newProgress : 50 // Stop at 50% for scanner phase
      })
    }, 50) // Faster interval for better UX
  }

  const startFetchProgress = () => {
    return setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 7 // Faster progress

        // Update scan stage based on progress - Fetch phase (60-95%)
        if (newProgress === 75) {
          setScanStage("Mencocokkan dengan database taksonomi...")
        } else if (newProgress === 90) {
          setScanStage("Menyusun informasi lengkap spesies...")
        }

        return newProgress < 95 ? newProgress : 95 // Stop at 95% until complete
      })
    }, 100) // Faster interval
  }

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
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

      const response = await axios.post(`${API_MODEL_URL}/predict/upload`, formData, {
        timeout: 30000, // 30 seconds timeout for file upload
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 40) // 40% for upload
            setScanProgress(10 + uploadProgress) // Start from 10%, up to 50%
          }
        }
      })

      if (!response.status || response.status < 200 || response.status >= 300) {
        throw new Error('API request failed')
      }

      const apiData: ApiClassificationResponse = response.data
      // console.log("API Response:", apiData)
      const scannerEndTime = Date.now()
      const scannerDuration = Math.round((scannerEndTime - scannerStartTime) / 1000)

      // Stop the scanner progress interval
      clearInterval(progressInterval)

      // Check if it's a Felidae species
      if (!apiData.is_felidae) {
        setIsScanning(false)
        setScanProgress(0)
        setScanStage("")
        setNotFelidae(true)
        setNotFelidaeMessage(
          "Foto tidak terdeteksi sebagai kucing, atau subjek kurang jelas. Coba foto ulang dengan fokus pada kucing (wajah/badan terlihat), pencahayaan cukup, dan latar sederhana."
        )
        toast(
          "Bukan kucing atau gambar kurang jelas. Coba foto ulang dengan subjek yang lebih jelas."
        )
        return
      }


      setScanProgress(55)
      setScanStage("Menghubungkan ke database...")

      // Step 3: Fetch Phase - Get enhanced data from database (no artificial delay)
      const fetchStartTime = Date.now()
      setScanStage("Mengambil data lengkap dari database...")
      setScanProgress(60) // Update progress to show we're in fetch phase

      const fetchProgressInterval = startFetchProgress()

      const enhancedData = await matchAndFetchSpeciesData(apiData)
      const fetchEndTime = Date.now()
      const fetchDuration = Math.round((fetchEndTime - fetchStartTime) / 1000)

      clearInterval(fetchProgressInterval)

      // Use stored base64 image or convert file to base64
      const base64Image = currentBase64Image || await fileToBase64(file)

      processScanResult(apiData, enhancedData, base64Image, scannerDuration, fetchDuration)

    } catch (error) {
      console.error("Error during image prediction:", error)
      setIsScanning(false)
      setScanProgress(0)
      setScanStage("")

      // Better error messaging based on error type
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          toast("Koneksi timeout. Periksa koneksi internet dan coba lagi.")
        } else if (error.message.includes('Network Error')) {
          toast("Tidak dapat terhubung ke server. Periksa koneksi internet.")
        } else if (error.message.includes('413')) {
          toast("File terlalu besar untuk diupload. Coba kompres gambar terlebih dahulu.")
        } else {
          toast("Terjadi kesalahan saat analisis gambar. Silakan coba lagi.")
        }
      } else {
        toast("Terjadi kesalahan saat analisis gambar. Silakan coba lagi.")
      }
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
        timeout: 30000, // 30 seconds timeout
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const downloadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 40) // 40% for download
            setScanProgress(10 + downloadProgress) // Start from 10%, up to 50%
          }
        }
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
        setNotFelidae(true)
        setNotFelidaeMessage(
          "Foto tidak terdeteksi sebagai kucing, atau subjek kurang jelas. Coba foto ulang dengan fokus pada kucing (wajah/badan terlihat), pencahayaan cukup, dan latar sederhana."
        )
        toast(
          "Bukan kucing atau gambar kurang jelas. Coba foto ulang dengan subjek yang lebih jelas."
        )
        return
      }

      // Step 2.5: Transition phase - Show that we got the species and connecting to database
      setScanProgress(55)
      setScanStage("Menghubungkan ke database...")

      // Step 3: Fetch Phase - Get enhanced data from database (no artificial delay)
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

      // Better error messaging based on error type
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          toast("Koneksi timeout. Periksa koneksi internet dan coba lagi.")
        } else if (error.message.includes('Network Error')) {
          toast("Tidak dapat terhubung ke server. Periksa koneksi internet.")
        } else if (error.message.includes('413')) {
          toast("URL gambar terlalu besar untuk diproses.")
        } else {
          toast("Terjadi kesalahan saat analisis gambar. Silakan coba lagi.")
        }
      } else {
        toast("Terjadi kesalahan saat analisis gambar. Silakan coba lagi.")
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!apiReady) {
      toast.error("API model tidak tersedia. Silakan hubungi developer untuk bantuan.")
      return
    }

    if (file) {
      // Quick validations first (no async operations)
      const maxSize = 3 * 1024 * 1024 // 3MB - optimal untuk upload speed
      if (file.size > maxSize) {
        toast("Ukuran file terlalu besar. Maksimal 3MB untuk performa optimal.")
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.")
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      const fileName = file.name.toLowerCase()
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))

      if (!hasValidExtension) {
        toast("Ekstensi file tidak valid. Gunakan .jpg, .jpeg, .png, atau .webp")
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      // Start processing immediately for better UX
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Result = reader.result as string
        setPreviewImage(base64Result)
        setCurrentBase64Image(base64Result) // Store for later upload

        // Start processing without waiting for image dimension validation
        // Most modern cameras produce images > 100x100, so this check is often unnecessary
        handleFilePrediction(file)
      }

      reader.onerror = () => {
        toast("File gambar tidak valid atau rusak.")
        if (event.target) {
          event.target.value = ""
        }
        return
      }

      reader.readAsDataURL(file)
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
    clearFileInput,
    notFelidae,
    notFelidaeMessage
  }
}
