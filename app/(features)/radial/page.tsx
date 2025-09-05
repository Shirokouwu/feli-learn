import { Metadata } from "next";
import RadialTaxonomy from "./_radial-component";
import { createServer } from "@/utils/supabase/server";
import RadialWithTimer from "./_radial-with-timer";

export const metadata: Metadata = {
  title: "Radial Taxonomy",
  description: "Explore the radial taxonomy of species and genera.",
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