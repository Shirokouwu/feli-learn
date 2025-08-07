import { Metadata } from "next";
import RadialTaxonomy from "./_radial-component";
import { createClient } from "@/utils/supabase/server";
import { Lock, LogIn, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import RadialWithTimer from "./_radial-with-timer";

export const metadata: Metadata = {
  title: "Radial Taxonomy",
  description: "Explore the radial taxonomy of species and genera.",

}

export default async function RadialPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  // If user is logged in, show the normal component
  if (data?.user) {
    return <RadialTaxonomy fullName={data.user.user_metadata.full_name || ""} />
  }

  return (
    <RadialWithTimer /> 
  )
}