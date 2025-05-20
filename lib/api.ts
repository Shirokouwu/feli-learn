import { supabase } from "./supabase"

export async function getTaxonomyData() {
  const { data: species, error: speciesError } = await supabase
    .from("taksonomi_spesies")
    .select("*")
    .order("created_at")

  if (speciesError) {
    throw new Error("Error fetching species data")
  }

  const { data: relations, error: relationsError } = await supabase.from("taksonomi_relasi").select("*")

  if (relationsError) {
    throw new Error("Error fetching taxonomy relations")
  }

  // Map the data to match the expected format
  const mappedSpecies = species.map((s) => ({
    id: s.id,
    name: s.nama || s.nama_umum || "",
    scientific_name: s.nama || "",
    description: s.deskripsi || "",
    parent_id: s.genus_id, // Using genus_id as parent_id for the tree structure
    genus_id: s.genus_id,
    image_url: s.url_gambar || "",
    habitat: "", // This would need to come from taksonomi_habitat
    distribution: s.distribusi_geografis ? JSON.stringify(s.distribusi_geografis) : "",
    conservation_status: "", // This would need to come from taksonomi_konservasi
    characteristics: {}, // This would need to come from taksonomi_deskripsi
    created_at: s.created_at,
    updated_at: s.updated_at,
  }))

  // Build the tree structure
  const buildTree = (parentId: string | null): any => {
    const children = mappedSpecies
      .filter((s) => s.parent_id === parentId)
      .map((node) => ({
        ...node,
        children: buildTree(node.id),
      }))

    return children.length ? children : []
  }

  // Start with root nodes (no parent)
  const tree = {
    name: "Felidae",
    scientific_name: "Felidae",
    children: buildTree(null),
  }

  return tree
}
