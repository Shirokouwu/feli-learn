"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { extractVideoId, getVideoThumbnail } from "@/lib/youtube"
import type { TaksonomiVideoYoutube } from "@/lib/supabase-v2"

interface SpeciesVideoProps {
  videos: TaksonomiVideoYoutube[]
  speciesName: string
}

interface VideoCardProps {
  video: TaksonomiVideoYoutube
  isPlaying: boolean
  onPlay: () => void
  onSwap?: () => void
  isPrimary?: boolean
}

function VideoCard({ video, isPlaying, onPlay, onSwap, isPrimary = false }: VideoCardProps) {
  const videoId = extractVideoId(video.url)
  //@ts-ignore
  const thumbnailUrl = getVideoThumbnail(videoId)

  const handleClick = () => {
    if (isPrimary) {
      onPlay()
    } else if (onSwap) {
      onSwap()
    }
  }

  return (
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gray-100">
          <img
            src={thumbnailUrl || "/placeholder.svg"}
            alt={`Video thumbnail for ${videoId}`}
            className="w-full h-full object-cover"
          />

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
              {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-1" />}
            </div>
          </div>

          {/* Primary badge */}
          {isPrimary && <Badge className="absolute top-2 left-2 bg-red-600 text-white">Video Utama</Badge>}
        </div>

        <div className="p-4">
          <h4 className="font-medium text-sm text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            Video ID: {videoId}
          </h4>

          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              className="text-xs bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                window.open(video.url, "_blank")
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              YouTube
            </Button>

            {/* Spacer to maintain layout */}
            <div className="w-24"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SpeciesVideo({ videos, speciesName }: SpeciesVideoProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [primaryVideoId, setPrimaryVideoId] = useState<string>("")
  const primaryVideoRef = useRef<HTMLDivElement>(null)

  // Set initial primary video
  useEffect(() => {
    if (videos.length > 0) {
      const primaryVideo = videos.find((v) => v.is_utama) || videos[0]
      setPrimaryVideoId(primaryVideo.id)
    }
  }, [videos])

  // Scroll to primary video when it changes
  useEffect(() => {
    if (primaryVideoRef.current) {
      primaryVideoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [primaryVideoId])

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Play className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Video</h3>
        <p className="text-gray-600">Video untuk spesies ini belum tersedia.</p>
      </div>
    )
  }

  const primaryVideo = videos.find((v) => v.id === primaryVideoId) || videos[0]
  const otherVideos = videos.filter((v) => v.id !== primaryVideoId)
  const primaryVideoId_extracted = extractVideoId(primaryVideo.url)

  const handleVideoPlay = (videoId: string) => {
    setActiveVideo(activeVideo === videoId ? null : videoId)
  }

  const handleVideoSwap = (videoId: string) => {
    setPrimaryVideoId(videoId)
    setActiveVideo(videoId)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Koleksi Video</h2>
        <p className="text-gray-600">
          Jelajahi berbagai video menarik tentang <span className="font-medium">{speciesName}</span>
        </p>
      </div>

      {/* Primary Video Section */}
      <div ref={primaryVideoRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Video Utama</h3>
          <Badge variant="secondary" className="text-xs">
            Video pilihan untuk spesies ini
          </Badge>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="aspect-video bg-gray-100">
            {activeVideo === primaryVideo.id ? (
              <iframe
                src={`https://www.youtube.com/embed/${primaryVideoId_extracted}?autoplay=1`}
                title={`Video ${speciesName}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="relative w-full h-full cursor-pointer group"
                onClick={() => handleVideoPlay(primaryVideo.id)}
              >
                <img
                // @ts-ignore
                  src={getVideoThumbnail(primaryVideoId_extracted) || "/placeholder.svg"}
                  alt={`Video thumbnail for ${speciesName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Other Videos Section */}
      {otherVideos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Video Lainnya</h3>
            <Badge variant="outline" className="text-xs">
              Koleksi video tambahan ({otherVideos.length} video)
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {otherVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isPlaying={activeVideo === video.id}
                onPlay={() => handleVideoPlay(video.id)}
                onSwap={() => handleVideoSwap(video.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
