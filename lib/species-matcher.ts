import { createClient } from "@/utils/supabase/client";


const supabase = createClient();

export interface ApiClassificationResponse {
    is_felidae: boolean;
    predicted_class: string;
    species_key: string;
    confidence: number;
    all_classes: Array<{
        class: string;
        species_key: string;
        probability: number;
    }>;
}

export interface EnhancedSpeciesData {
    identifikasi: {
        id: string; // ID from taksonomi_spesies table
        akurasi: number;
        nama_umum: string;
        nama_ilmiah: string;
        kunci: string;
        status: {
            konservasi: string;
            endemik: string;
        };
    };
    ringkasan: {
        deskripsi_umum: string;
        karakteristik: {
            berat?: string;
            panjang?: string;
            tinggi?: string;
            umur?: string;
        };
        ciri_khas: string;
        perilaku: string;
    };
    genus: {
        nama: string;
        deskripsi: string;
    };
    distribusi: {
        benua: string[];
        negara: string[];
    };
    konservasi: {
        status_populasi: string;
        ancaman: string[];
        upaya: string[];
        rekomendasi: string[];
    };
    gambar: {
        utama: string;
        galeri: string[];
    };
    video: Array<{
        url: string;
        is_utama: boolean;
    }>;
}

/**
 * Matches species_key from API response with database and fetches complete species information
 */
export async function matchAndFetchSpeciesData(
    apiResponse: ApiClassificationResponse
): Promise<EnhancedSpeciesData | null> {
    try {
        const { species_key, predicted_class, confidence } = apiResponse;

        // Check if species_key exists, if not try to use predicted_class as fallback
        let searchKey = species_key;
        if (!species_key) {
            if (!predicted_class) {
                console.error("Both species_key and predicted_class are missing from API response");
                return null;
            }
            searchKey = predicted_class;
        }

        // console.log("Using search key:", searchKey);

        // Step 1: Find species by search key (kunci field in database)
        // Try with original key first
        let { data: speciesData, error: speciesError } = await supabase
            .from("taksonomi_spesies")
            .select("*")
            .eq("kunci", searchKey)
            .single();

        // If not found with original key, try with normalized key (hyphens to underscores)
        if (speciesError || !speciesData) {
            const normalizedSearchKey = searchKey.replace(/-/g, '_');

            const { data: normalizedData, error: normalizedError } = await supabase
                .from("taksonomi_spesies")
                .select("*")
                .eq("kunci", normalizedSearchKey)
                .single();

            if (normalizedError || !normalizedData) {
                return null;
            }

            speciesData = normalizedData;
            speciesError = normalizedError;
        }

        if (speciesError || !speciesData) {
            return null;
        }

        const spesies_id = speciesData.id;
        const genusName = speciesData.nama ? speciesData.nama.split(' ')[0] : '';

        // Step 2: Fetch related data from all tables using species_id
        const [
            { data: deskripsiData },
            { data: habitatData },
            { data: konservasiData },
            { data: perilakuData },
            { data: dietData },
            { data: gambarData },
            { data: videoData },
            { data: genusData }
        ] = await Promise.all([
            supabase
                .from("taksonomi_deskripsi")
                .select("*")
                .eq("spesies_id", spesies_id)
                .single(),
            supabase
                .from("taksonomi_habitat")
                .select("*")
                .eq("spesies_id", spesies_id)
                .single(),
            supabase
                .from("taksonomi_konservasi")
                .select("*")
                .eq("spesies_id", spesies_id)
                .single(),
            supabase
                .from("taksonomi_perilaku")
                .select("*")
                .eq("spesies_id", spesies_id)
                .single(),
            supabase
                .from("taksonomi_diet")
                .select("*")
                .eq("spesies_id", spesies_id)
                .single(),
            supabase
                .from("taksonomi_gambar")
                .select("*")
                .eq("spesies_id", spesies_id),
            supabase
                .from("taksonomi_video")
                .select("*")
                .eq("spesies_id", spesies_id),
            supabase
                .from("taksonomi_genus")
                .select("*")
                .eq("nama", genusName)
                .single()
        ]);

        // Step 3: Process and structure the data according to the desired format
        const enhancedData: EnhancedSpeciesData = {
            identifikasi: {
                id: spesies_id, // Add the ID from taksonomi_spesies
                akurasi: confidence,
                nama_umum: speciesData.nama_umum || predicted_class,
                nama_ilmiah: speciesData.nama || "",
                kunci: searchKey, // Use the search key that actually worked
                status: {
                    konservasi: konservasiData?.status_konservasi_alam || "Unknown",
                    endemik: extractEndemicStatus(speciesData.distribusi_geografis),
                },
            },
            ringkasan: {
                deskripsi_umum: deskripsiData?.deskripsi_umum || "",
                karakteristik: {
                    berat: deskripsiData?.berat_kg ? `${deskripsiData.berat_kg} kg` : undefined,
                    panjang: deskripsiData?.panjang_tubuh_cm ? `${deskripsiData.panjang_tubuh_cm} cm` : undefined,
                    tinggi: deskripsiData?.tinggi_bahu_cm ? `${deskripsiData.tinggi_bahu_cm} cm` : undefined,
                    umur: deskripsiData?.rentang_hidup || undefined,
                },
                ciri_khas: deskripsiData?.fitur_unik?.join(", ") || "",
                perilaku: perilakuData?.pola_aktivitas || "",
            },
            genus: {
                nama: genusData?.[0]?.nama || "",
                deskripsi: genusData?.[0]?.deskripsi || "",
            },
            distribusi: {
                benua: extractContinents(speciesData.distribusi_geografis),
                negara: extractCountries(speciesData.distribusi_geografis),
            },
            konservasi: {
                status_populasi: konservasiData?.total_populasi || "",
                ancaman: konservasiData?.ancaman || [],
                upaya: konservasiData?.upaya_konservasi || [],
                rekomendasi: konservasiData?.rekomendasi || [],
            },
            gambar: {
                utama: speciesData.url_gambar || "",
                galeri: gambarData?.map((img: any) => img.url) || [],
            },
            video: videoData?.map((vid: any) => ({
                url: vid.url,
                is_utama: vid.video_utama || false,
            })) || [],
        };

        return enhancedData;
    } catch (error) {
        console.error("Error fetching enhanced species data:", error);
        return null;
    }
}

/**
 * Helper function to extract endemic status from distribution data
 */
function extractEndemicStatus(distribusiGeografis: any): string {
    if (!distribusiGeografis) return "Unknown";

    // Handle different data formats
    let countries: string[] = [];

    if (Array.isArray(distribusiGeografis)) {
        countries = distribusiGeografis;
    } else if (typeof distribusiGeografis === 'object' && distribusiGeografis.negara) {
        countries = distribusiGeografis.negara;
    } else if (typeof distribusiGeografis === 'string') {
        try {
            const parsed = JSON.parse(distribusiGeografis);
            countries = Array.isArray(parsed) ? parsed : (parsed.negara || []);
        } catch {
            countries = [distribusiGeografis];
        }
    }

    // Check if endemic to Indonesia
    if (countries.length === 1 && countries[0].toLowerCase().includes('indonesia')) {
        return "Indonesia";
    } else if (countries.length === 1) {
        return countries[0];
    }

    return "Multiple countries";
}

/**
 * Helper function to extract continents from distribution data
 */
function extractContinents(distribusiGeografis: any): string[] {
    if (!distribusiGeografis) return ["Unknown"];

    // Basic continent mapping based on countries
    const continentMap: Record<string, string> = {
        "indonesia": "Asia",
        "malaysia": "Asia",
        "thailand": "Asia",
        "myanmar": "Asia",
        "china": "Asia",
        "india": "Asia",
        "nepal": "Asia",
        "bhutan": "Asia",
        "bangladesh": "Asia",
        "sri lanka": "Asia",
        "africa": "Africa",
        "kenya": "Africa",
        "tanzania": "Africa",
        "south africa": "Africa",
        "namibia": "Africa",
        "botswana": "Africa",
        "zimbabwe": "Africa",
        "america": "America",
        "usa": "America",
        "canada": "America",
        "mexico": "America",
        "brazil": "America",
        "argentina": "America",
    };

    const countries = extractCountries(distribusiGeografis);
    const continents = new Set<string>();

    countries.forEach(country => {
        const continent = continentMap[country.toLowerCase()];
        if (continent) {
            continents.add(continent);
        }
    });

    return continents.size > 0 ? Array.from(continents) : ["Unknown"];
}

/**
 * Helper function to extract countries from distribution data
 */
function extractCountries(distribusiGeografis: any): string[] {
    if (!distribusiGeografis) return ["Unknown"];

    let countries: string[] = [];

    if (Array.isArray(distribusiGeografis)) {
        countries = distribusiGeografis;
    } else if (typeof distribusiGeografis === 'object') {
        if (distribusiGeografis.negara) {
            countries = Array.isArray(distribusiGeografis.negara)
                ? distribusiGeografis.negara
                : [distribusiGeografis.negara];
        } else if (distribusiGeografis.countries) {
            countries = Array.isArray(distribusiGeografis.countries)
                ? distribusiGeografis.countries
                : [distribusiGeografis.countries];
        } else {
            // Try to extract from object values
            countries = Object.values(distribusiGeografis).filter(val =>
                typeof val === 'string'
            ) as string[];
        }
    } else if (typeof distribusiGeografis === 'string') {
        try {
            const parsed = JSON.parse(distribusiGeografis);
            return extractCountries(parsed);
        } catch {
            // Treat as single country or comma-separated list
            countries = distribusiGeografis.split(',').map(c => c.trim());
        }
    }

    return countries.length > 0 ? countries : ["Unknown"];
}
