"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, notFound } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PawPrintIcon as Paw,
  Trees,
  Brain,
  ShieldAlert,
  ArrowUp,
  Share2,
  Sparkles,
  Heart,
  Eye,
  Leaf,
  Users,
  VideoIcon,
} from "lucide-react"
import {
  getSpeciesByKey,
  getSpeciesDetails,
  getSpeciesImages,
  getRelatedSpecies,
  getSpeciesVideos,
} from "@/lib/supabase-v2"
import { getUserClient } from "@/lib/auth-client"

// Import all the components
import { SpeciesHero } from "@/components/database-spesies/species-hero"
import { SpeciesImageGallery } from "@/components/database-spesies/species-image-gallery"
import { SpeciesOverview } from "@/components/database-spesies/species-overview"
import { SpeciesCharacteristics } from "@/components/database-spesies/species-characteristics"
import { SpeciesHabitat } from "@/components/database-spesies/species-habitat"
import { SpeciesBehavior } from "@/components/database-spesies/species-behavior"
import { SpeciesConservation } from "@/components/database-spesies/species-conservation"
import { SpeciesVideo } from "@/components/database-spesies/species-video"
import { SpeciesAdditionalInfo } from "@/components/database-spesies/species-additional-info"
import { SpeciesRelated } from "@/components/database-spesies/species-related"
import { SpeciesTaxonomySidebar } from "@/components/database-spesies/species-taxonomy-sidebar"
import { SpeciesLoading } from "@/components/database-spesies/species-loading"
import type { SpeciesData } from "@/components/types"

export default function SpeciesDetailPage() {
  const params = useParams<{ species: string }>()

  // ============================================
  // 🔐 REAL AUTH INTEGRATION
  // ============================================
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "Guest User",
    email: "guest@example.com",
    avatar: null as string | null,
  })
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getUserClient()
        if (userData) {
          setIsLoggedIn(true)
          setUserInfo({
            name: userData.profile?.full_name || userData.user_metadata?.full_name || userData.email?.split('@')[0] || 'User',
            email: userData.email || 'user@example.com',
            avatar: userData.profile?.avatar_url || userData.user_metadata?.avatar_url || null,
          })
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsLoggedIn(false)
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkAuth()
  }, [])
  // ============================================

  const [activeHeroImage, setActiveHeroImage] = useState(0)
  const [activeGalleryImage, setActiveGalleryImage] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [viewCount, setViewCount] = useState(1247) // Mock view count
  const [speciesData, setSpeciesData] = useState<SpeciesData>({
    species: null,
    details: {
      habitat: null,
      deskripsi: null,
      sejarahEvolusi: null,
      gambar: [],
      konservasi: null,
      perilaku: null,
      diet: null,
      reproduksi: null,
      referensi: [],
      videos: [],
    },
    relatedSpecies: [],
    images: [],
  })
  // Disable auto slideshow by default
  const [autoSlideshow, setAutoSlideshow] = useState(false)

  // Scroll to top when component mounts or species changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [params.species])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const species = await getSpeciesByKey(params.species)

        if (!species) {
          notFound()
        }

        const [details, imagesData, related, videos] = await Promise.all([
          getSpeciesDetails(species.id),
          getSpeciesImages(species.id),
          getRelatedSpecies(species.genus_id, species.id),
          getSpeciesVideos(species.id),
        ])

        // Get images for the gallery
        const imageUrls =
          imagesData.length > 0
            ? imagesData.map((img: any) => img.url)
            : [species.url_gambar || "/placeholder.svg?height=800&width=1200"]

        setSpeciesData({
          species,
          details: { ...details, gambar: imagesData, videos },
          relatedSpecies: related,
          images: imageUrls,
        })
      } catch (error) {
        console.error("Error fetching species details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.species])

  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 400)
    const winScroll = document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100
    setReadingProgress(scrolled)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Auto slideshow effect - only for hero section
  useEffect(() => {
    let slideshowInterval: NodeJS.Timeout | null = null

    if (autoSlideshow && speciesData.images.length > 1) {
      slideshowInterval = setInterval(() => {
        setActiveHeroImage((prev) => (prev < speciesData.images.length - 1 ? prev + 1 : 0))
      }, 5000)
    }

    return () => {
      if (slideshowInterval) {
        clearInterval(slideshowInterval)
      }
    }
  }, [autoSlideshow, speciesData.images.length])

  if (isLoading) {
    return <SpeciesLoading />
  }

  if (!speciesData.species) {
    return notFound()
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleShare = async () => {
    if (!speciesData.species) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${speciesData.species.nama_umum || speciesData.species.nama} - Felidae Database`,
          text: `Pelajari tentang ${speciesData.species.nama_umum || speciesData.species.nama}`,
          url: window.location.href,
        })
      } catch (error) {
        // console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const tabs = [
    {
      id: "overview",
      label: "Ringkasan",
      shortLabel: "Info",
      icon: Sparkles,
      color: "emerald",
    },
    {
      id: "characteristics",
      label: "Karakteristik",
      shortLabel: "Ciri",
      icon: Paw,
      color: "blue",
    },
    {
      id: "habitat",
      label: "Habitat",
      shortLabel: "Habitat",
      icon: Trees,
      color: "green",
    },
    {
      id: "behavior",
      label: "Perilaku",
      shortLabel: "Perilaku",
      icon: Brain,
      color: "purple",
    },
    {
      id: "conservation",
      label: "Konservasi",
      shortLabel: "Konservasi",
      icon: ShieldAlert,
      color: "orange",
    },
    {
      id: "video",
      label: "Video",
      shortLabel: "Video",
      icon: VideoIcon,
      color: "red",
    },
    {
      id: "additional",
      label: "Info Tambahan",
      shortLabel: "Tambahan",
      icon: Leaf,
      color: "teal",
    },
    {
      id: "related",
      label: "Spesies Terkait",
      shortLabel: "Terkait",
      icon: Users,
      color: "indigo",
    },
  ]

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/20">
        {/* Enhanced Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 z-50 shadow-sm"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* Floating Action Buttons */}
        <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-2">
          <AnimatePresence>
            {showBackToTop && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={scrollToTop}
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleShare}
            size="icon"
            variant="outline"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white border-emerald-200 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
          </Button>

          <Button
            onClick={() => setIsBookmarked(!isBookmarked)}
            size="icon"
            variant="outline"
            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 ${isBookmarked ? "bg-emerald-50 text-emerald-600" : "hover:bg-emerald-50"
              }`}
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? "fill-current text-emerald-600" : "text-emerald-600"}`}
            />
          </Button>
        </div>

        {/* Hero Section */}
        <SpeciesHero
          species={speciesData.species}
          images={speciesData.images}
          activeImage={activeHeroImage}
          setActiveImage={setActiveHeroImage}
          autoSlideshow={autoSlideshow}
          setAutoSlideshow={setAutoSlideshow}
          details={speciesData.details}
          isLoggedIn={isLoggedIn}
          userInfo={userInfo}
        />

        {/* Main Content Container */}
        <div className="container max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Main Content with Tabs */}
            <div className="lg:w-2/3">
              {/* Enhanced Image Gallery */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <SpeciesImageGallery
                  images={speciesData.images}
                  speciesName={speciesData.species.nama_umum || speciesData.species.nama}
                  activeImage={activeGalleryImage}
                  setActiveImage={setActiveGalleryImage}
                  imageDetails={speciesData.details.gambar}
                />
              </motion.div>

              {/* Tab Navigation and Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 sm:mt-8"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Single Responsive Tab Navigation */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-lg border border-emerald-100 mb-4 sm:mb-6">
                    <TabsList className="w-full bg-transparent p-0 h-auto flex flex-wrap sm:grid sm:grid-cols-4 md:grid-cols-8 gap-1 sm:gap-2">
                      {tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className={`
          relative flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 
          data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 
          data-[state=active]:text-white data-[state=active]:shadow-lg
          hover:bg-emerald-50 text-neutral-600 hover:text-emerald-700
          min-w-[60px] sm:min-w-0 min-h-[60px] sm:min-h-[70px] md:min-h-[80px] border-0 flex-shrink-0 sm:flex-shrink
        `}
                        >
                          <tab.icon className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                          <span className="text-xs font-medium text-center leading-tight">
                            <span className="sm:hidden">{tab.shortLabel}</span>
                            <span className="hidden sm:inline md:hidden">{tab.shortLabel}</span>
                            <span className="hidden md:inline">{tab.label}</span>
                          </span>

                          {/* Active indicator */}
                          {activeTab === tab.id && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg sm:rounded-xl -z-10"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {/* Tab Content with Animations */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="overview" className="mt-0">
                        <SpeciesOverview species={speciesData.species} details={speciesData.details} />
                      </TabsContent>

                      <TabsContent value="characteristics" className="mt-0">
                        <SpeciesCharacteristics species={speciesData.species} details={speciesData.details} />
                      </TabsContent>

                      <TabsContent value="habitat" className="mt-0">
                        <SpeciesHabitat species={speciesData.species} details={speciesData.details} />
                      </TabsContent>

                      <TabsContent value="behavior" className="mt-0">
                        <SpeciesBehavior species={speciesData.species} details={speciesData.details} />
                      </TabsContent>

                      <TabsContent value="conservation" className="mt-0">
                        <SpeciesConservation species={speciesData.species} details={speciesData.details} />
                      </TabsContent>

                      <TabsContent value="video" className="mt-0">
                        <SpeciesVideo
                          videos={speciesData.details.videos || []}
                          speciesName={speciesData.species.nama_umum || speciesData.species.nama}
                        />
                      </TabsContent>

                      <TabsContent value="additional" className="mt-0">
                        <SpeciesAdditionalInfo species={speciesData.species} details={speciesData.details} />
                      </TabsContent>

                      <TabsContent value="related" className="mt-0">
                        <SpeciesRelated relatedSpecies={speciesData.relatedSpecies} />
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </motion.div>

              {/* Quick Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 sm:mt-6"
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-emerald-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Eye className="h-4 w-4" />
                        <span className="hidden xs:inline">{viewCount.toLocaleString()} views</span>
                        <span className="xs:hidden">{(viewCount / 1000).toFixed(1)}k</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Heart className={`h-4 w-4 ${isBookmarked ? "fill-current text-emerald-600" : ""}`} />
                        <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-sm text-neutral-600 hidden sm:inline">Hero auto slideshow:</span>
                      <Button
                        onClick={() => setAutoSlideshow(!autoSlideshow)}
                        size="sm"
                        variant={autoSlideshow ? "default" : "outline"}
                        className={`flex items-center gap-2 flex-1 sm:flex-none ${autoSlideshow
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "border-emerald-200 hover:bg-emerald-50"
                          }`}
                      >
                        {autoSlideshow ? "ON" : "OFF"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <motion.div
              className="lg:w-1/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="sticky top-20 sm:top-24">
                <SpeciesTaxonomySidebar species={speciesData.species} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}
