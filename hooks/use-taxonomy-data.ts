import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export function useTaxonomyData() {
  return useQuery({
    queryKey: ["taxonomy"],
    queryFn: async () => {
      // Fetch genus data
      const { data: genera, error: generaError } = await supabase
        .from("taksonomi_genus")
        .select("*")
        .order("created_at")

      if (generaError) {
        throw new Error("Error fetching genus data")
      }

      // Fetch species data
      const { data: species, error: speciesError } = await supabase
        .from("taksonomi_spesies")
        .select("*")
        .order("created_at")

      if (speciesError) {
        throw new Error("Error fetching species data")
      }

      // Fetch related data for each species
      const speciesIds = species.map((s) => s.id)

      // Fetch descriptions
      const { data: descriptions, error: descriptionsError } = await supabase
        .from("taksonomi_deskripsi")
        .select("*")
        .in("spesies_id", speciesIds)

      if (descriptionsError) {
        console.error("Error fetching descriptions:", descriptionsError)
      }

      // Fetch habitats
      const { data: habitats, error: habitatsError } = await supabase
        .from("taksonomi_habitat")
        .select("*")
        .in("spesies_id", speciesIds)

      if (habitatsError) {
        console.error("Error fetching habitats:", habitatsError)
      }

      // Fetch conservation data
      const { data: conservation, error: conservationError } = await supabase
        .from("taksonomi_konservasi")
        .select("*")
        .in("spesies_id", speciesIds)

      if (conservationError) {
        console.error("Error fetching conservation data:", conservationError)
      }

      // Fetch behavior data
      const { data: behaviors, error: behaviorsError } = await supabase
        .from("taksonomi_perilaku")
        .select("*")
        .in("spesies_id", speciesIds)

      if (behaviorsError) {
        console.error("Error fetching behavior data:", behaviorsError)
      }

      // Fetch diet data
      const { data: diets, error: dietsError } = await supabase
        .from("taksonomi_diet")
        .select("*")
        .in("spesies_id", speciesIds)

      if (dietsError) {
        console.error("Error fetching diet data:", dietsError)
      }

      // Fetch additional images
      const { data: images, error: imagesError } = await supabase
        .from("taksonomi_gambar")
        .select("*")
        .in("spesies_id", speciesIds)

      if (imagesError) {
        console.error("Error fetching images:", imagesError)
      }

      // Map genus data to match expected format
      const mappedGenera = genera.map((g) => ({
        id: g.id,
        name: g.nama || "",
        scientific_name: g.nama || "",
        description: g.deskripsi || "",
        created_at: g.created_at,
        updated_at: g.updated_at,
        // Keep original fields for compatibility
        nama: g.nama,
        deskripsi: g.deskripsi,
        jumlah_spesies: g.jumlah_spesies,
        url_gambar: g.url_gambar,
      }))

      // Map species data to match expected format and include related data
      const mappedSpecies = species.map((s) => {
        // Find related data for this species
        const speciesDescription = descriptions?.find((d) => d.spesies_id === s.id) || {}
        const speciesHabitat = habitats?.find((h) => h.spesies_id === s.id) || {}
        const speciesConservation = conservation?.find((c) => c.spesies_id === s.id) || {}
        const speciesBehavior = behaviors?.find((b) => b.spesies_id === s.id) || {}
        const speciesDiet = diets?.find((d) => d.spesies_id === s.id) || {}
        const speciesImages = images?.filter((i) => i.spesies_id === s.id) || []

        // Build characteristics object from description data
        const characteristics: Record<string, string> = {}
        if (speciesDescription.warna) characteristics["Warna"] = speciesDescription.warna
        if (speciesDescription.panjang_tubuh_cm)
          characteristics["Panjang Tubuh"] = `${speciesDescription.panjang_tubuh_cm} cm`
        if (speciesDescription.tinggi_bahu_cm)
          characteristics["Tinggi Bahu"] = `${speciesDescription.tinggi_bahu_cm} cm`
        if (speciesDescription.berat_kg) characteristics["Berat"] = `${speciesDescription.berat_kg} kg`
        if (speciesDescription.kecepatan_lari) characteristics["Kecepatan Lari"] = speciesDescription.kecepatan_lari
        if (speciesDescription.dimorfisme_seksual)
          characteristics["Dimorfisme Seksual"] = speciesDescription.dimorfisme_seksual

        // Add pola (patterns) if available
        if (speciesDescription.pola && Array.isArray(speciesDescription.pola)) {
          characteristics["Pola"] = speciesDescription.pola.join(", ")
        }

        // Add fitur_unik (unique features) if available
        if (speciesDescription.fitur_unik && Array.isArray(speciesDescription.fitur_unik)) {
          characteristics["Fitur Unik"] = speciesDescription.fitur_unik.join(", ")
        }

        return {
          id: s.id,
          name: s.nama_umum || s.nama || "",
          scientific_name: s.nama || "",
          description: speciesDescription.deskripsi_umum || "",
          genus_id: s.genus_id,
          image_url: s.url_gambar || "",
          habitat: speciesHabitat.tipe
            ? Array.isArray(speciesHabitat.tipe)
              ? speciesHabitat.tipe.join(", ")
              : speciesHabitat.tipe
            : "",
          distribution: s.distribusi_geografis
            ? Array.isArray(s.distribusi_geografis)
              ? s.distribusi_geografis.join(", ")
              : JSON.stringify(s.distribusi_geografis)
            : "",
          conservation_status: speciesConservation.status_konservasi_alam || "",
          characteristics,
          created_at: s.created_at,
          updated_at: s.updated_at,

          // Additional data from related tables
          physical: {
            weight: speciesDescription.berat_kg,
            length: speciesDescription.panjang_tubuh_cm,
            height: speciesDescription.tinggi_bahu_cm,
            color: speciesDescription.warna,
            colorPalette: speciesDescription.palate_warna,
            speed: speciesDescription.kecepatan_lari,
          },

          conservation: {
            status: speciesConservation.status_konservasi_alam,
            population: speciesConservation.total_populasi,
            trend: speciesConservation.tren_populasi,
            trendDetails: speciesConservation.detail_tren,
            threats: speciesConservation.ancaman,
            efforts: speciesConservation.upaya_konservasi,
            protectedAreas: speciesConservation.perlindungan_area_konservasi,
          },

          behavior: {
            activity: speciesBehavior.pola_aktivitas,
            social: speciesBehavior.struktur_sosial,
            territorial: speciesBehavior.teritorial,
            communication: speciesBehavior.komunikasi,
            hunting: speciesBehavior.perilaku_berburu,
          },

          diet: {
            type: speciesDiet.tipe_diet,
            prey: speciesDiet.mangsa_utama,
            technique: speciesDiet.teknik_berburu,
            frequency: speciesDiet.frekuensi_makan,
          },

          additionalImages: speciesImages.map((img) => ({
            url: img.url,
            title: img.judul,
            description: img.deskripsi,
            photographer: img.fotografer,
            isMain: img.gambar_utama,
          })),

          // Keep original fields for compatibility
          nama: s.nama,
          nama_umum: s.nama_umum,
          kunci: s.kunci,
          distribusi_geografis: s.distribusi_geografis,
          url_gambar: s.url_gambar,
          kerajaan: s.kerajaan,
          filum: s.filum,
          kelas: s.kelas,
          ordo: s.ordo,
          famili: s.famili,
        }
      })

      // Build the tree structure
      const buildTree = (genusId: string | null): any => {
        const genusData = mappedGenera.find((g) => g.id === genusId)
        if (!genusData) return null

        const children = mappedSpecies
          .filter((s) => s.genus_id === genusId)
          .map((speciesData) => ({
            ...speciesData,
            children: [],
          }))

        return {
          ...genusData,
          children,
        }
      }

      // Start with root nodes (genera)
      const tree = {
        name: "Felidae",
        scientific_name: "Felidae",
        children: mappedGenera.map((genus) => buildTree(genus.id)).filter(Boolean),
      }

      return tree
    },
  })
}
