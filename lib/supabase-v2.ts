import { createClient } from "@supabase/supabase-js"

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  throw new Error("Missing Supabase environment variables")
}

// Create Supabase client with better configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      "Content-Type": "application/json",
    },
  },
})

// Type definitions based on your schema
export type TaksonomiGenus = {
  id: string
  nama: string
  deskripsi: string | null
  jumlah_spesies: number | null
  url_gambar: string | null
  created_at: string
  updated_at: string
}

export type TaksonomiSpesies = {
  id: string
  genus_id: string
  nama: string
  nama_umum: string | null
  kunci: string
  author_nama_ilmiah: string | null
  tahun_penemuan: number | null
  kerajaan: string
  filum: string
  kelas: string
  ordo: string
  famili: string
  distribusi_geografis: string[] | null
  url_gambar: string | null
  created_at: string
  updated_at: string
  genus?: TaksonomiGenus
}

export type TaksonomiHabitat = {
  id: string
  spesies_id: string
  tipe: string[]
  karakteristik: string[]
  preferensi: string | null
  created_at: string
  updated_at: string
}

export type TaksonomiDeskripsi = {
  id: string
  spesies_id: string
  deskripsi_umum: string | null
  morfologi: string | null
  warna: string | null
  palate_warna: string | null
  pola: string[] | null
  panjang_tubuh_cm: number | null
  tinggi_bahu_cm: number | null
  berat_kg: number | null
  dimorfisme_seksual: string | null
  adaptasi_fisik: string | null
  kecepatan_lari: string | null
  fitur_unik: string[] | null
  posisi_ekologis: string | null
  pentingnya_ekologis: string | null
  ukuran_wilayah_km2: number | null
  sumber_informasi: string | null
  tanggal_verifikasi: string | null
  created_at: string
  updated_at: string
}

export type TaksonomiSejarahEvolusi = {
  id: string
  spesies_id: string
  waktu_kemunculan: string | null
  nenek_moyang: string | null
  hubungan_filogenetik: string | null
  fosil_tertua: string | null
  lokasi_fosil: string | null
  perubahan_evolusi: string | null
  adaptasi_evolusi: any | null
  divergensi_genetik: string | null
  studi_dna: string | null
  spesies_terkait: string[] | null
  jalur_migrasi: string | null
  faktor_isolasi: string | null
  sumber_informasi: string | null
  tanggal_verifikasi: string | null
  created_at: string
  updated_at: string
}

export type TaksonomiGambar = {
  id: string
  spesies_id: string
  url: string
  judul: string | null
  deskripsi: string | null
  fotografer: string | null
  tanggal_diambil: string | null
  lokasi: string | null
  lisensi: string | null
  gambar_utama: boolean
  created_at: string
  updated_at: string
}

export type TaksonomiKonservasi = {
  id: string
  spesies_id: string
  status_konservasi_alam: string | null
  tahun_penilaian: number | null
  tren_populasi: string | null
  total_populasi: string | null
  detail_tren: string | null
  ancaman: string[] | null
  upaya_konservasi: string[] | null
  rekomendasi_konservasi: string[] | null
  perlindungan_area_konservasi: string[] | null
  created_at: string
  updated_at: string
}

export type TaksonomiPerilaku = {
  id: string
  spesies_id: string
  pola_aktivitas: string | null
  struktur_sosial: string | null
  teritorial: boolean | null
  komunikasi: string[] | null
  perilaku_kawin: string | null
  perilaku_pengasuhan: string | null
  perilaku_berburu: string | null
  created_at: string
  updated_at: string
}

export type TaksonomiDiet = {
  id: string
  spesies_id: string
  tipe_diet: string | null
  mangsa_utama: string[] | null
  teknik_berburu: string | null
  frekuensi_makan: string | null
  kebutuhan_kalori: string | null
  tingkat_keberhasilan_berburu: string | null
  adaptasi_diet: string | null
  created_at: string
  updated_at: string
}

export type TaksonomiReproduksi = {
  id: string
  spesies_id: string
  sistem_reproduksi: string | null
  musim_kawin: string | null
  durasi_kehamilan: string | null
  ukuran_kelahiran: string | null
  interval_kelahiran: string | null
  usia_matang_seksual: string | null
  harapan_hidup: string | null
  rasio_jenis_kelamin: string | null
  created_at: string
  updated_at: string
}

export type TaksonomiReferensi = {
  id: string
  spesies_id: string
  judul: string
  penulis: string | null
  tahun: number | null
  jenis_publikasi: string | null
  url: string | null
  doi: string | null
  catatan: string | null
  created_at: string
  updated_at: string
}

// New type for YouTube videos
export type TaksonomiVideoYoutube = {
  id: string
  spesies_id: string
  url: string
  is_utama: boolean
  created_at: string
  updated_at: string
}

// Helper functions to fetch data with better error handling
export async function fetchAllSpecies() {
  try {
    console.log("Fetching all species...")

    const { data, error } = await supabase
      .from("taksonomi_spesies")
      .select(`
        *,
        genus:genus_id(*),
        konservasi:taksonomi_konservasi(*)
      `)
      .order("nama")

    if (error) {
      console.error("Supabase error fetching species:", error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} species`)
    return data as (TaksonomiSpesies & {
      genus: TaksonomiGenus
      konservasi: TaksonomiKonservasi | null
    })[]
  } catch (error) {
    console.error("Error fetching species:", error)
    // Return empty array as fallback
    return []
  }
}

export async function fetchSpeciesByKey(key: string) {
  try {
    console.log(`Fetching species by key: ${key}`)

    const { data, error } = await supabase
      .from("taksonomi_spesies")
      .select(`
        *,
        genus:genus_id(*)
      `)
      .eq("kunci", key)
      .single()

    if (error) {
      console.error("Supabase error fetching species by key:", error)
      throw error
    }

    console.log("Successfully fetched species by key")
    return data as TaksonomiSpesies & { genus: TaksonomiGenus }
  } catch (error) {
    console.error("Error fetching species by key:", error)
    return null
  }
}

export async function fetchSpeciesDetails(speciesId: string) {
  try {
    console.log(`Fetching details for species: ${speciesId}`)

    // Fetch all related data for a species
    const [
      habitatResult,
      deskripsiResult,
      sejarahEvolusiResult,
      gambarResult,
      konservasiResult,
      perilakuResult,
      dietResult,
      reproduksiResult,
      referensiResult,
    ] = await Promise.all([
      supabase.from("taksonomi_habitat").select("*").eq("spesies_id", speciesId).single(),
      supabase.from("taksonomi_deskripsi").select("*").eq("spesies_id", speciesId).single(),
      supabase.from("taksonomi_sejarah_evolusi").select("*").eq("spesies_id", speciesId).single(),
      supabase.from("taksonomi_gambar").select("*").eq("spesies_id", speciesId),
      supabase.from("taksonomi_konservasi").select("*").eq("spesies_id", speciesId).single(),
      supabase.from("taksonomi_perilaku").select("*").eq("spesies_id", speciesId).single(),
      supabase.from("taksonomi_diet").select("*").eq("spesies_id", speciesId).single(),
      supabase.from("taksonomi_reproduksi").select("*").eq("spesies_id", speciesId).single(),
      supabase.from("taksonomi_referensi").select("*").eq("spesies_id", speciesId),
    ])

    console.log("Successfully fetched species details")

    return {
      habitat: habitatResult.data as TaksonomiHabitat,
      deskripsi: deskripsiResult.data as TaksonomiDeskripsi,
      sejarahEvolusi: sejarahEvolusiResult.data as TaksonomiSejarahEvolusi,
      gambar: gambarResult.data as TaksonomiGambar[],
      konservasi: konservasiResult.data as TaksonomiKonservasi,
      perilaku: perilakuResult.data as TaksonomiPerilaku,
      diet: dietResult.data as TaksonomiDiet,
      reproduksi: reproduksiResult.data as TaksonomiReproduksi,
      referensi: referensiResult.data as TaksonomiReferensi[],
    }
  } catch (error) {
    console.error("Error fetching species details:", error)
    // Return empty objects as fallback
    return {
      habitat: null,
      deskripsi: null,
      sejarahEvolusi: null,
      gambar: [],
      konservasi: null,
      perilaku: null,
      diet: null,
      reproduksi: null,
      referensi: [],
    }
  }
}

export async function fetchAllGenera() {
  try {
    console.log("Fetching all genera...")

    const { data, error } = await supabase.from("taksonomi_genus").select("*").order("nama")

    if (error) {
      console.error("Supabase error fetching genera:", error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} genera`)
    return data as TaksonomiGenus[]
  } catch (error) {
    console.error("Error fetching genera:", error)
    // Return empty array as fallback
    return []
  }
}

export async function fetchConservationStatuses() {
  try {
    console.log("Fetching conservation statuses...")

    const { data, error } = await supabase
      .from("taksonomi_konservasi")
      .select("status_konservasi_alam")
      .not("status_konservasi_alam", "is", null)

    if (error) {
      console.error("Supabase error fetching conservation statuses:", error)
      throw error
    }

    // Extract unique statuses
    const statuses = [...new Set(data.map((item) => item.status_konservasi_alam))]
    const filteredStatuses = statuses.filter(Boolean) as string[]

    console.log(`Successfully fetched ${filteredStatuses.length} conservation statuses`)
    return filteredStatuses
  } catch (error) {
    console.error("Error fetching conservation statuses:", error)
    // Return default statuses as fallback
    return ["Critically Endangered", "Endangered", "Vulnerable", "Near Threatened", "Least Concern"]
  }
}

export async function fetchSpeciesImages(speciesId: string) {
  try {
    console.log(`Fetching images for species: ${speciesId}`)

    const { data, error } = await supabase
      .from("taksonomi_gambar")
      .select("*")
      .eq("spesies_id", speciesId)
      .order("gambar_utama", { ascending: false })

    if (error) {
      console.error("Supabase error fetching species images:", error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} images`)
    return data as TaksonomiGambar[]
  } catch (error) {
    console.error("Error fetching species images:", error)
    return []
  }
}

export async function fetchRelatedSpecies(genusId: string, currentSpeciesId: string) {
  try {
    console.log(`Fetching related species for genus: ${genusId}`)

    const { data, error } = await supabase
      .from("taksonomi_spesies")
      .select("*")
      .eq("genus_id", genusId)
      .neq("id", currentSpeciesId)
      .limit(3)

    if (error) {
      console.error("Supabase error fetching related species:", error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} related species`)
    return data as TaksonomiSpesies[]
  } catch (error) {
    console.error("Error fetching related species:", error)
    return []
  }
}

// New function to fetch YouTube videos for a species
export async function fetchSpeciesVideos(speciesId: string) {
  try {
    console.log(`Fetching YouTube videos for species: ${speciesId}`)

    const { data, error } = await supabase
      .from("taksonomi_video_youtube")
      .select("*")
      .eq("spesies_id", speciesId)
      .order("is_utama", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error fetching species videos:", error)
      throw error
    }

    console.log(`Successfully fetched ${data?.length || 0} videos`)
    return data as TaksonomiVideoYoutube[]
  } catch (error) {
    console.error("Error fetching species videos:", error)
    return []
  }
}

// ======================= LIST ========================================

// Database statistics function
export async function fetchDatabaseStatistics() {
  try {
    console.log("Fetching database statistics...")

    const [generaResult, speciesResult, speciesCountResult] = await Promise.all([
      supabase.from("taksonomi_genus").select("id", { count: "exact", head: true }),
      supabase.from("taksonomi_spesies").select("id", { count: "exact", head: true }),
      supabase.from("taksonomi_spesies").select("genus_id").not("genus_id", "is", null),
    ])

    // Count unique genera that have species
    const generaWithSpecies = new Set(speciesCountResult.data?.map((s) => s.genus_id)).size

    const statistics = {
      totalGenera: generaResult.count || 0,
      totalSpecies: speciesResult.count || 0,
      generaWithSpecies,
      lastUpdated: new Date().toISOString(),
    }

    console.log("Database statistics:", statistics)
    return statistics
  } catch (error) {
    console.error("Error fetching database statistics:", error)
    return {
      totalGenera: 0,
      totalSpecies: 0,
      generaWithSpecies: 0,
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")
    const { data, error } = await supabase.from("taksonomi_spesies").select("count").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return false
    }

    console.log("Supabase connection test successful")
    return true
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return false
  }
}
