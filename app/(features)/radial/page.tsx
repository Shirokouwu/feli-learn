import { Metadata } from "next";
import RadialTaxonomy from "./radial-component";
import { createClient } from "@/utils/supabase/server";
import { Lock, LogIn, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Radial Taxonomy",
  description: "Explore the radial taxonomy of species and genera.",

}

export default async function RadialPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-teal-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-teal-800 mb-2">Login Diperlukan</h3>
          <p className="text-neutral-600 mb-6">
            Untuk mengakses visualisasi radial Felidae, Anda perlu login terlebih dahulu atau nonaktifkan fitur
            wajib login.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <LogIn className="h-4 w-4 mr-2" />
              Login Sekarang
            </Button>

          </div>
        </div>
      </div>
    )
  }

  return (
    <RadialTaxonomy />
  );
}