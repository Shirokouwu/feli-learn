export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function getVideoThumbnail(
  videoId: string,
  quality: "default" | "medium" | "high" | "standard" | "maxres" = "high",
): string {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    standard: "sddefault",
    maxres: "maxresdefault",
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

// Alias for backward compatibility
export const extractVideoId = extractYouTubeVideoId

export async function getYouTubeMetadata(videoId: string) {
  try {
    // This would typically use YouTube Data API
    // For now, return mock data structure
    return {
      title: `Video ${videoId}`,
      description: `Description for video ${videoId}`,
      thumbnail: getVideoThumbnail(videoId),
      duration: "PT5M30S",
      viewCount: "1000000",
      publishedAt: new Date().toISOString(),
      channelTitle: "Wildlife Channel",
    }
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error)
    return null
  }
}

export function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")
  const seconds = Number.parseInt(match[3] || "0")

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function formatDurationMinutes(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0 min"

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")

  const totalMinutes = hours * 60 + minutes
  return `${totalMinutes} min`
}

export function formatViewCount(count: string): string {
  const num = Number.parseInt(count)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`
  }
  return `${num} views`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "1 day ago"
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}
