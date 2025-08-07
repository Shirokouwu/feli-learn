import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Filter {
  key: string;
  values: any[];
}

interface Genera {
  id: string;
  nama: string;
  deskripsi: string;
  jumlah_spesies: number;
  url_gambar: string;
  created_at: string;
  updated_at: string;
}

interface Species {
  id: string;
  nama: string;
  nama_umum: string;
  genus_id: string;
  distribusi_geografis: any;
  url_gambar: string;
  kerajaan: string;
  filum: string;
  kelas: string;
  ordo: string;
  famili: string;
  kunci: string; // Added this property
  created_at: string;
  updated_at: string;
}

export function useTaxonomyData() {
  return useQuery({
    queryKey: ["taxonomy"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (v5 syntax)
    queryFn: async () => {
      const fetchData = async (table: string, filter: Filter = { key: "", values: [] }) => {
        if (!filter.key || !filter.values.length) return [];
        const { data, error } = await supabase.from(table).select("*").in(filter.key, filter.values);
        if (error) console.error(`Error fetching ${table}:`, error);
        return data || [];
      };

      const fetchGenera = async (): Promise<Genera[]> => {
        const { data, error } = await supabase.from("taksonomi_genus").select("*").order("created_at");
        if (error) throw new Error("Error fetching genus data");
        return data || [];
      };

      const fetchSpecies = async (): Promise<Species[]> => {
        const { data, error } = await supabase.from("taksonomi_spesies").select("*").order("created_at");
        if (error) throw new Error("Error fetching species data");
        return data || [];
      };

      const genera = await fetchGenera();
      const species = await fetchSpecies();

      // Early return if no data
      if (!genera.length || !species.length) {
        return {
          name: "Felidae",
          scientific_name: "Felidae",
          children: [],
        };
      }

      const speciesIds = species.map((s) => s.id);

      const [
        descriptions,
        habitats,
        conservation,
        behaviors,
        diets,
        images,
      ] = await Promise.all([
        fetchData("taksonomi_deskripsi", { key: "spesies_id", values: speciesIds }),
        fetchData("taksonomi_habitat", { key: "spesies_id", values: speciesIds }),
        fetchData("taksonomi_konservasi", { key: "spesies_id", values: speciesIds }),
        fetchData("taksonomi_perilaku", { key: "spesies_id", values: speciesIds }),
        fetchData("taksonomi_diet", { key: "spesies_id", values: speciesIds }),
        fetchData("taksonomi_gambar", { key: "spesies_id", values: speciesIds }),
      ]);

      const mapGenera = (genera: Genera[]) =>
        genera.map((g) => ({
          id: g.id,
          name: g.nama || "",
          scientific_name: g.nama || "",
          description: g.deskripsi || "",
          created_at: g.created_at,
          updated_at: g.updated_at,
          nama: g.nama,
          deskripsi: g.deskripsi,
          jumlah_spesies: g.jumlah_spesies,
          url_gambar: g.url_gambar,
        }));

      const mapSpecies = (species: Species[]) =>
        species.map((s) => {
          const findRelated = (data: any[], key: string) => data.find((item) => item[key] === s.id) || {};
          const filterRelated = (data: any[], key: string) => data.filter((item) => item[key] === s.id) || [];

          const speciesDescription = findRelated(descriptions, "spesies_id");
          const speciesHabitat = findRelated(habitats, "spesies_id");
          const speciesConservation = findRelated(conservation, "spesies_id");
          const speciesBehavior = findRelated(behaviors, "spesies_id");
          const speciesDiet = findRelated(diets, "spesies_id");
          const speciesImages = filterRelated(images, "spesies_id");

          // Build characteristics more efficiently
          const characteristics: Record<string, string> = {};
          if (speciesDescription.warna) characteristics["Warna"] = speciesDescription.warna;
          if (speciesDescription.panjang_tubuh_cm) characteristics["Panjang Tubuh"] = `${speciesDescription.panjang_tubuh_cm} cm`;
          if (speciesDescription.tinggi_bahu_cm) characteristics["Tinggi Bahu"] = `${speciesDescription.tinggi_bahu_cm} cm`;
          if (speciesDescription.berat_kg) characteristics["Berat"] = `${speciesDescription.berat_kg} kg`;
          if (speciesDescription.kecepatan_lari) characteristics["Kecepatan Lari"] = speciesDescription.kecepatan_lari;
          if (speciesDescription.dimorfisme_seksual) characteristics["Dimorfisme Seksual"] = speciesDescription.dimorfisme_seksual;
          if (speciesDescription.pola && Array.isArray(speciesDescription.pola)) characteristics["Pola"] = speciesDescription.pola.join(", ");
          if (speciesDescription.fitur_unik && Array.isArray(speciesDescription.fitur_unik)) characteristics["Fitur Unik"] = speciesDescription.fitur_unik.join(", ");

          return {
            id: s.id,
            name: s.nama_umum || s.nama || "",
            scientific_name: s.nama || "",
            description: speciesDescription.deskripsi_umum || "",
            genus_id: s.genus_id,
            image_url: s.url_gambar || "",
            habitat: Array.isArray(speciesHabitat.tipe)
              ? speciesHabitat.tipe.join(", ")
              : speciesHabitat.tipe || "",
            distribution: Array.isArray(s.distribusi_geografis)
              ? s.distribusi_geografis.join(", ")
              : JSON.stringify(s.distribusi_geografis) || "",
            conservation_status: speciesConservation.status_konservasi_alam || "",
            characteristics,
            created_at: s.created_at,
            updated_at: s.updated_at,
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
          };
        });

      const mappedGenera = mapGenera(genera);
      const mappedSpecies = mapSpecies(species);

      // Create species lookup for better performance in buildTree
      const speciesByGenus = new Map<string, any[]>();
      mappedSpecies.forEach(species => {
        if (!speciesByGenus.has(species.genus_id)) {
          speciesByGenus.set(species.genus_id, []);
        }
        speciesByGenus.get(species.genus_id)?.push({
          ...species,
          children: [],
        });
      });

      const buildTree = (genusId: string | null) => {
        const genusData = mappedGenera.find((g) => g.id === genusId);
        if (!genusData || !genusId) return null;

        const children = speciesByGenus.get(genusId) || [];

        return {
          ...genusData,
          children,
        };
      };

      return {
        name: "Felidae",
        scientific_name: "Felidae",
        children: mappedGenera.map((genus) => buildTree(genus.id)).filter(Boolean),
      };
    },
  });
}
