"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  Search,
  ArrowRight,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  X,
  ChevronRight,
  Sparkles,
  Leaf,
  Eye,
  MapPin,
  History,
  Link,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Navbar } from "@/components/navbar"
import type { Species } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { ScanHistory } from "@/components/scanner/scan-history"
import { ScanCounter } from "@/components/scanner/scan-counter"
import { toast } from "sonner"
import axios from 'axios';
import ScanStatusApi from "@/components/scanner/scan-check-api"

export default function ScannerImages() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResult, setScanResult] = useState<Species | null>(null)
  const [showTips, setShowTips] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [scanStage, setScanStage] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)

  const [imageUrl, setImageUrl] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)
  const [scanHistory, setScanHistory] = useState<
    Array<{
      name: string
      scientificName: string
      imageUrl: string
      accuracy: number
      date: string
    }>
  >([])

  const API_MODEL_URL = process.env.NEXT_PUBLIC_API_MODEL_URL || "";
  const API_MODEL_HEALTH_URL = process.env.NEXT_PUBLIC_API_MODEL_HEALTH_URL || "";

  // API health check state
  const [apiChecking, setApiChecking] = useState<boolean>(true);
  const [apiReady, setApiReady] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<{ data: { status: string } }>({
    data: { status: "unknown" }
  });

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      setApiChecking(true);
      try {
        const response = await axios.get(API_MODEL_HEALTH_URL);
        setApiResponse(response);
        setApiReady(response.data.status === "ok");
      } catch (error) {
        setApiReady(false);
        setApiResponse({ data: { status: "error" } });
      } finally {
        setApiChecking(false);
      }
    };

    checkApiHealth();
    // Check API health every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, [API_MODEL_HEALTH_URL]);  
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!apiReady) {
      toast("API model tidak tersedia. Silakan coba lagi nanti.");
      return;
    }

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        handlePrediction(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handlePrediction = async (imageSource: string) => {
    // Check if API is ready before making the request
    if (!apiReady) {
      toast("API model tidak tersedia. Silakan coba lagi nanti.");
      return;
    }

    setIsScanning(true)
    setScanProgress(0)
    setScanStage("Memulai analisis gambar...")
    setScanResult(null)

    try {
      // Set up progress simulation
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 5;

          // Update scan stage based on progress
          if (newProgress === 20) {
            setScanStage("Mendeteksi fitur morfologi...");
          } else if (newProgress === 40) {
            setScanStage("Menganalisis pola warna dan tekstur...");
          } else if (newProgress === 60) {
            setScanStage("Membandingkan dengan database spesies...");
          } else if (newProgress === 80) {
            setScanStage("Memverifikasi hasil identifikasi...");
          }

          return newProgress < 90 ? newProgress : 90; // Stop at 90% until API returns
        });
      }, 100);

      // Call the API model URL used in the scanner
      const response = await axios.post(API_MODEL_URL, {
        url: imageSource
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = response.data

      setScanProgress(100)
      clearInterval(progressInterval)

      setIsScanning(false)
      setScanStage("Identifikasi selesai!")
      setShowConfetti(true)

      // Hide confetti after a few seconds
      setTimeout(() => {
        setShowConfetti(false)
      }, 3000)


      // Set the scan result
      setScanResult({
        id: data.id || "unknown-species",
        name: data.predicted_class || "Spesies Tidak Diketahui",
        scientific_name: data.confidence || "Unknown species",
        description: data.is_felidae || "Tidak ada deskripsi yang tersedia untuk spesies ini.",
        characteristics: {
          Berat: "100-140 kg",
          Panjang: "2.2-2.5 m",
          Tinggi: "75-90 cm",
          Umur: "15-20 tahun",
          Makanan: "Karnivora (rusa, babi hutan)",
          Status: "Critically Endangered",
        },
        habitat: "Hutan hujan tropis dataran rendah dan pegunungan",
        distribution: "Endemik di Pulau Sumatera, Indonesia",
        conservation_status: "Critically Endangered",
        image_url: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2940&auto=format&fit=crop",
        genus_id: "panthera",
        created_at: new Date().toISOString(),

        // Add these new detailed properties
        population: "Kurang dari 400 individu di alam liar",
        behavior: "Soliter, teritorial, dan aktif terutama pada malam hari (nokturnal)",
        distinctive_features:
          "Garis-garis hitam yang lebih rapat, rambut lebih gelap, dan janggut yang lebih panjang dibanding subspesies lain",
        threats: "Perburuan liar, hilangnya habitat akibat deforestasi, dan konflik dengan manusia",
        conservation_efforts: "Program pembiakan di penangkaran, perlindungan habitat, dan upaya anti-perburuan",
        evolutionary_history:
          "Berevolusi secara terpisah selama sekitar 12.000-6.000 tahun yang lalu ketika Sumatera terpisah dari daratan Asia",
        cultural_significance: "Simbol kebanggaan dan kekuatan dalam budaya Indonesia, terutama di Sumatera",
        // Enhanced distribution information
        detailed_distribution: {
          regions: [
            "Taman Nasional Gunung Leuser (Aceh dan Sumatera Utara)",
            "Taman Nasional Kerinci Seblat (Sumatera Barat, Jambi, Sumatera Selatan, dan Bengkulu)",
            "Taman Nasional Bukit Barisan Selatan (Lampung dan Bengkulu)",
            "Hutan Harapan (Jambi dan Sumatera Selatan)",
            "Taman Nasional Way Kambas (Lampung)",
          ],
          habitat_types: [
            "Hutan hujan dataran rendah (0-600m)",
            "Hutan pegunungan (600-2000m)",
            "Hutan rawa gambut",
            "Hutan sekunder",
          ],
          historical_range:
            "Sebelumnya tersebar di seluruh Pulau Sumatera, namun kini terbatas pada kantong-kantong hutan yang terlindungi",
          map_image: "/placeholder.svg?height=200&width=300&text=Peta+Distribusi+Harimau+Sumatera",
        },

        // Additional information for enhanced display
        diet_details:
          "Terutama memangsa rusa sambar, babi hutan, kijang, dan kadang-kadang primata. Dapat mengkonsumsi 18-40 kg daging dalam sekali makan.",
        reproduction: {
          gestation: "103-105 hari",
          litter_size: "2-4 anak",
          sexual_maturity: "3-4 tahun",
          breeding_season: "Dapat berkembang biak sepanjang tahun",
        },
        fun_facts: [
          "Harimau Sumatera adalah subspesies harimau terkecil yang masih hidup",
          "Memiliki selaput antara jari kaki yang membuatnya menjadi perenang yang baik",
          "Dapat melompat sejauh 10 meter dalam sekali lompatan",
          "Memiliki penglihatan malam 6 kali lebih baik dari manusia",
        ],
      })
    } catch (error) {
      // Handle API errors
      console.error("Error during image prediction:", error);
      setIsScanning(false);
      setScanProgress(0);
      setScanStage("");
      toast("Terjadi kesalahan saat analisis gambar. Silakan coba lagi.");
    }
  }



  // Navigate to taxonomy page with result
  const navigateToTaxonomy = () => {
    if (scanResult) {
      // Navigate to taxonomy page with both search params and search value
      router.push(`/taxonomy?species=${scanResult.id}&highlight=true&search=${encodeURIComponent(scanResult.name)}`)
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Reset URL input when switching tabs
    if (value !== "url") {
      setImageUrl("")
    }
  }

  // Handle URL submission
  const handleUrlSubmit = () => {
    if (!imageUrl) return

    // Set the preview image from URL
    setPreviewImage(imageUrl)

    // Start scanning
    // simulateScan()
    handlePrediction(imageUrl)
  }

  // Handle clearing history
  const handleClearHistory = () => {
    toast("Riwayat scan telah dihapus")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/50">
      {/* <Navbar /> */}

      <div className="container mx-auto px-4 py-2 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch
              id="login-mode"
              checked={isLoggedIn}
              onCheckedChange={setIsLoggedIn}
              className="data-[state=checked]:bg-emerald-600"
            />
            <Label htmlFor="login-mode" className="text-sm text-emerald-800">
              {isLoggedIn ? "Login Aktif" : "Login Nonaktif"}
            </Label>
          </div>

          {isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
              onClick={() => setShowHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              Riwayat Scan
            </Button>
          )}
        </div>
      </div>

      {/* Add the ScanCounter component here */}

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`} // Add unique key with index
                initial={{
                  top: "-10%",
                  left: `${Math.random() * 100}%`,
                  rotate: 0,
                  scale: 0,
                }}
                animate={{
                  top: "110%",
                  rotate: 360,
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
                className={`absolute w-3 h-3 rounded-full bg-${["emerald", "green", "teal", "yellow"][Math.floor(Math.random() * 4)]
                  }-${Math.floor(Math.random() * 3 + 3) * 100}`}
              />
            ))}
          </div>
        </div>
      )}      <div className="container mx-auto px-4 py-8">

        <ScanStatusApi apiChecking={apiChecking} apiReady={apiReady} response={apiResponse} />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            <div className="p-6">
              {!previewImage ? (
                <div className="space-y-6">
                  <ScanCounter className="mb-4 pb-4 border-b border-emerald-50" />
                  <AnimatePresence mode="wait">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="upload" className="text-base">
                          <Upload className="h-4 w-4 mr-2" />
                          Unggah Gambar
                        </TabsTrigger>
                        <TabsTrigger value="url" className="text-base" disabled={!apiReady}>
                          <Link className="h-4 w-4 mr-2" />
                          Gunakan URL
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload" className="space-y-4" asChild>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div
                            onClick={() => apiReady && fileInputRef.current?.click()}
                            className={`h-64 border-2 border-dashed ${apiReady
                              ? "border-emerald-200 cursor-pointer hover:bg-emerald-50"
                              : "border-gray-200 cursor-not-allowed opacity-70"
                              } rounded-xl flex flex-col items-center justify-center transition-colors duration-300 group`}
                          >
                            <div className="p-4 bg-emerald-100 rounded-full mb-4 group-hover:bg-emerald-200 transition-colors duration-300">
                              <Upload className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-medium text-emerald-800 mb-2">
                              Tarik & Lepas atau Klik untuk Unggah
                            </h3>
                            <p className="text-neutral-500 text-sm max-w-md text-center">
                              Unggah foto kucing liar atau kucing peliharaan untuk diidentifikasi
                            </p>
                            <p className="text-emerald-600 text-xs mt-2">
                              Format yang didukung: JPG, PNG, WEBP (Maks. 10MB)
                            </p>
                            {!apiReady && (
                              <div className="mt-3 px-4 py-2 bg-red-50 rounded-lg">
                                <p className="text-xs text-red-600">API model tidak tersedia. Coba lagi nanti.</p>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                          />
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="url" className="space-y-4" asChild>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Masukkan URL gambar (https://...)"
                                className="flex-1"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                disabled={!apiReady}
                              />
                              <Button
                                onClick={handleUrlSubmit}
                                disabled={!imageUrl || !apiReady}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Search className="h-4 w-4 mr-2" />
                                Scan
                              </Button>
                            </div>

                            {imageUrl && (
                              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                                <img
                                  src={imageUrl || "/placeholder.svg"}
                                  alt="Preview dari URL"
                                  // fill
                                  className="object-cover"
                                  onError={() => {
                                    toast("URL tidak valid atau gambar tidak dapat dimuat")
                                    setImageUrl("")
                                  }}
                                />
                              </div>
                            )}

                            <div className="bg-emerald-50 p-4 rounded-lg">
                              <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-emerald-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-emerald-800 mb-1">Tips URL Gambar</h4>
                                  <p className="text-sm text-emerald-700">
                                    Pastikan URL berakhiran dengan format gambar (.jpg, .png, .webp) dan berasal dari
                                    sumber yang dapat diakses publik.
                                  </p>
                                  <p className="text-xs text-emerald-600 mt-2">
                                    Contoh: https://example.com/gambar-kucing.jpg
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                  </AnimatePresence>

                  <div className="border-t border-neutral-100 pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTips(!showTips)}
                      className="text-neutral-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-300"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      {showTips ? "Sembunyikan Tips" : "Tampilkan Tips Penggunaan"}
                    </Button>

                    <AnimatePresence>
                      {showTips && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid md:grid-cols-3 gap-4 mt-4">
                            {[
                              {
                                icon: <Eye className="h-5 w-5 text-emerald-600" />,
                                title: "Fokus pada Wajah",
                                desc: "Pastikan wajah kucing terlihat jelas untuk hasil identifikasi terbaik",
                              },
                              {
                                icon: <Leaf className="h-5 w-5 text-emerald-600" />,
                                title: "Hindari Oklusi",
                                desc: "Pastikan tidak ada objek yang menghalangi tampilan kucing",
                              },
                              {
                                icon: <Zap className="h-5 w-5 text-emerald-600" />,
                                title: "Pencahayaan Baik",
                                desc: "Gunakan pencahayaan yang cukup untuk detail yang lebih baik",
                              },
                            ].map((tip, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="bg-emerald-50 p-2 rounded-md">{tip.icon}</div>
                                  <div>
                                    <h4 className="font-medium text-emerald-800 text-sm">{tip.title}</h4>
                                    <p className="text-xs text-neutral-600">{tip.desc}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img src={previewImage || "/placeholder.svg"} alt="Preview" className="object-cover" />

                    {isScanning && (
                      <div className={`${isScanning ? "absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6" : ""}`}>
                        <div className="text-white text-center max-w-md">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto" />
                          <p className="text-lg font-medium mb-2">{scanStage}</p>
                          <Progress value={scanProgress} className="h-2 mb-2" />
                          <p className="text-sm text-white/80">{scanProgress}% Selesai</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {scanResult && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-200 shadow-md"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-emerald-100 p-3 rounded-full">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-emerald-800">Hasil Identifikasi</h3>
                            <p className="text-emerald-600">Teridentifikasi dengan akurasi 98.7%</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-xl font-medium text-emerald-800 mb-1">{scanResult.name}</p>
                          <p className="text-sm text-emerald-700 italic mb-3">{scanResult.scientific_name}</p>

                          <div className="space-y-2 mb-4">
                            <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-colors duration-300">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {scanResult.conservation_status}
                            </Badge>
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 ml-2 hover:bg-emerald-200 transition-colors duration-300">
                              <Leaf className="h-3 w-3 mr-1" />
                              Endemik Indonesia
                            </Badge>
                          </div>

                          <p className="text-sm text-neutral-600 mb-4">{scanResult.description}</p>
                        </div>

                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                            <TabsTrigger value="distribution">Distribusi</TabsTrigger>
                            <TabsTrigger value="conservation">Konservasi</TabsTrigger>
                          </TabsList>

                          <AnimatePresence mode="wait">
                            <TabsContent value="overview" className="space-y-4" asChild>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-emerald-700 mb-2 text-sm">Karakteristik Utama</h4>
                                    <div className="space-y-2">
                                      {Object.entries(scanResult.characteristics as Record<string, string>)
                                        .slice(0, 4) // Only show first 4 characteristics
                                        .map(([key, value], index) => ( // Add index to ensure unique keys
                                          <div
                                            key={`char-${key}-${index}`} // Use both key and index for uniqueness
                                            className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100"
                                          >
                                            <span className="text-sm font-medium text-neutral-700">{key}</span>
                                            <span className="text-sm text-emerald-700">{value}</span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                                      <h4 className="font-medium text-emerald-700 mb-2 text-sm">Ciri Khas</h4>
                                      <p className="text-xs text-neutral-600">{scanResult.distinctive_features}</p>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg border border-emerald-100">
                                      <h4 className="font-medium text-emerald-700 mb-2 text-sm">Perilaku</h4>
                                      <p className="text-xs text-neutral-600">{scanResult.behavior}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </TabsContent>

                            <TabsContent value="distribution" className="space-y-4" asChild>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-emerald-700 mb-3 text-sm">Peta Distribusi</h4>
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-emerald-100">
                                      <img
                                        src={scanResult.detailed_distribution.map_image || "/placeholder.svg"}
                                        alt="Peta Distribusi Harimau Sumatera"
                                        // fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h4 className="font-medium text-emerald-700 mb-2 text-sm">Wilayah Utama</h4>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                      {scanResult.detailed_distribution.regions.slice(0, 3).map((region, index) => (
                                        <div
                                          key={index}
                                          className="bg-white p-2 rounded-lg border border-emerald-100 flex items-center gap-2"
                                        >
                                          <div className="bg-emerald-50 p-1 rounded-full">
                                            <MapPin className="h-3 w-3 text-emerald-600" />
                                          </div>
                                          <span className="text-xs text-neutral-700">{region}</span>
                                        </div>
                                      ))}
                                      {scanResult.detailed_distribution.regions.length > 3 && (
                                        <div className="text-xs text-emerald-600 text-center">
                                          +{scanResult.detailed_distribution.regions.length - 3} wilayah lainnya
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </TabsContent>

                            <TabsContent value="conservation" className="space-y-4" asChild>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                                  <h4 className="font-medium text-emerald-700 mb-2 text-sm">Status Populasi</h4>
                                  <div className="flex items-center gap-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                      <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-red-700">
                                        {scanResult.conservation_status}
                                      </p>
                                      <p className="text-xs text-neutral-600">{scanResult.population}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                                    <h4 className="font-medium text-emerald-700 mb-2 text-sm">Ancaman Utama</h4>
                                    <p className="text-xs text-neutral-600">{scanResult.threats}</p>
                                  </div>

                                  <div className="bg-white p-3 rounded-lg border border-emerald-100">
                                    <h4 className="font-medium text-emerald-700 mb-2 text-sm">Upaya Konservasi</h4>
                                    <p className="text-xs text-neutral-600">{scanResult.conservation_efforts}</p>
                                  </div>
                                </div>
                              </motion.div>
                            </TabsContent>
                          </AnimatePresence>
                        </Tabs>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={navigateToTaxonomy}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 group"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Lihat di Diagram Taksonomi
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>

                          <Button
                            variant="outline"
                            className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => router.push("/database")}
                          >
                            <Info className="h-4 w-4 mr-2" />
                            Informasi Lengkap di Database
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all duration-300"
                      onClick={() => {
                        setPreviewImage(null)
                        setScanResult(null)
                        setScanProgress(0)
                        setScanStage("")
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Coba Lagi
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      // onClick={simulateScan}
                      disabled={isScanning}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
                      Scan Ulang
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white p-6 rounded-xl border border-emerald-100 shadow-md"
          >
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Tentang AI Scanner Pro</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="bg-emerald-100 p-3 rounded-lg inline-block">
                  <Zap className="h-5 w-5 text-emerald-600" />
                </div>
                <h4 className="font-medium text-emerald-700">Teknologi Canggih</h4>
                <p className="text-sm text-neutral-600">
                  Menggunakan Convolutional Neural Network (CNN) dengan akurasi hingga 98.5% dalam mengidentifikasi 41
                  spesies Felidae.
                </p>
              </div>

              <div className="space-y-2">
                <div className="bg-emerald-100 p-3 rounded-lg inline-block">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <h4 className="font-medium text-emerald-700">Hasil Terverifikasi</h4>
                <p className="text-sm text-neutral-600">
                  Hasil identifikasi diverifikasi dengan database komprehensif yang terus diperbarui oleh ahli
                  taksonomi.
                </p>
              </div>

              <div className="space-y-2">
                <div className="bg-emerald-100 p-3 rounded-lg inline-block">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                </div>
                <h4 className="font-medium text-emerald-700">Mendukung Konservasi</h4>
                <p className="text-sm text-neutral-600">
                  Setiap identifikasi membantu memperkaya data untuk penelitian dan upaya konservasi spesies Felidae.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-between items-center">
              <p className="text-sm text-neutral-600">
                Pelajari lebih lanjut tentang keluarga Felidae melalui diagram taksonomi interaktif kami.
              </p>
              <Button
                variant="outline"
                className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 group"
                onClick={() => router.push("/taxonomy")}
              >
                Jelajahi Taksonomi
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scan History Component */}
      <ScanHistory
        isOpen={showHistory && isLoggedIn}
        onOpenChange={setShowHistory}
        onClearHistory={handleClearHistory}
      />
    </div>
  )
}
