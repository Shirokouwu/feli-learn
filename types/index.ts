export interface Genus {
  id: string
  name: string
  scientific_name: string
  description: string
  created_at: string
  click_count?: number
  // Add new fields from taksonomi_genus
  nama?: string
  deskripsi?: string
  jumlah_spesies?: number
  url_gambar?: string
  updated_at?: string
}

export interface Species {
  lifespan: string
  genus: any
  id: string
  name: string
  scientific_name: string
  description: string
  characteristics: Record<string, string>
  habitat: string
  distribution: string
  conservation_status: string
  image_url: string
  genus_id: string
  created_at: string
  click_count?: number

  // Add new fields from taksonomi_spesies
  nama?: string
  nama_umum?: string
  kunci?: string
  author_nama_ilmiah?: string
  tahun_penemuan?: number
  kerajaan?: string
  filum?: string
  kelas?: string
  ordo?: string
  famili?: string
  distribusi_geografis?: any
  url_gambar?: string
  updated_at?: string

  // Add structured data from related tables
  physical?: {
    weight?: number
    length?: number
    height?: number
    color?: string
    colorPalette?: string
    speed?: string
  }

  conservation?: {
    status?: string
    population?: string
    trend?: string
    trendDetails?: string
    threats?: string[]
    efforts?: string[]
    protectedAreas?: string[]
  }

  behavior?: {
    hunting_method: string | undefined
    activity?: string
    social?: string
    territorial?: boolean
    communication?: string[]
    hunting?: string
  }

  diet?: {
    type?: string
    prey?: string[]
    technique?: string
    frequency?: string
  }

  // Add fields from taksonomi_diet
  tipe_diet?: string
  mangsa_utama?: any // JSONB from database
  teknik_berburu?: string
  frekuensi_makan?: string
  kebutuhan_kalori?: string
  tingkat_keberhasilan_berburu?: string
  adaptasi_diet?: string

  additionalImages?: {
    url: string
    title?: string
    description?: string
    photographer?: string
    isMain?: boolean
  }[]
}

export interface SpeciesClick {
  id: string
  species_id?: string
  genus_id?: string
  click_count: number
  last_clicked_at: string
  created_at: string
}
