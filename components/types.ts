import type {
  TaksonomiSpesies,
  TaksonomiGenus,
  TaksonomiHabitat,
  TaksonomiDeskripsi,
  TaksonomiSejarahEvolusi,
  TaksonomiGambar,
  TaksonomiKonservasi,
  TaksonomiPerilaku,
  TaksonomiDiet,
  TaksonomiReproduksi,
  TaksonomiReferensi,
  TaksonomiVideoYoutube,
} from "@/lib/supabase-v2"

export interface SpeciesDetails {
  habitat: TaksonomiHabitat | null
  deskripsi: TaksonomiDeskripsi | null
  sejarahEvolusi: TaksonomiSejarahEvolusi | null
  gambar: TaksonomiGambar[]
  konservasi: TaksonomiKonservasi | null
  perilaku: TaksonomiPerilaku | null
  diet: TaksonomiDiet | null
  reproduksi: TaksonomiReproduksi | null
  referensi: TaksonomiReferensi[]
  videos: TaksonomiVideoYoutube[]
}

export interface SpeciesData {
  species: (TaksonomiSpesies & { genus: TaksonomiGenus }) | null
  details: SpeciesDetails
  relatedSpecies: TaksonomiSpesies[]
  images: string[]
}

export interface SpeciesTabProps {
  species: TaksonomiSpesies & { genus: TaksonomiGenus }
  details: SpeciesDetails
}

export interface UserInfo {
  name: string
  email: string
  avatar: string | null
}

export interface SpeciesHeroProps extends SpeciesTabProps {
  images: string[]
  activeImage: number
  setActiveImage: (index: number) => void
  autoSlideshow: boolean
  setAutoSlideshow: (enabled: boolean) => void
  isLoggedIn: boolean
  userInfo: UserInfo
  onToggleLogin: () => void
}
