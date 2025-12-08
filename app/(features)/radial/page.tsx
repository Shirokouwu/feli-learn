import { Metadata } from "next";
import RadialTaxonomy from "./_radial-component";
import { createServer } from "@/utils/supabase/server";
import RadialWithTimer from "./_radial-with-timer";

export const metadata: Metadata = {
  title: "Radial Taxonomy",
  description: "Visualisasi interaktif hierarki taksonomi Felidae dalam bentuk node radial. Jelajahi hubungan dari Famili ke Genus hingga Spesies untuk memahami struktur klasifikasi kucing besar dan kecil.",
}

export default async function RadialPage() {
  const supabase = await createServer()

  const { data: { user } } = await supabase.auth.getUser()

  // If user is logged in, show the normal component
  if (user) {
    return <RadialTaxonomy fullName={user.user_metadata.full_name} profilePicture={user.user_metadata.avatar_url} />
  }

  return (
    <RadialWithTimer />
  )
}