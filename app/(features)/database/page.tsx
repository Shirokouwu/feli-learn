import { Badge } from "@/components/ui/badge"
import { Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Navbar } from "@/components/navbar-v2"
import { DatabaseContent } from "@/components/database-exlopedia/database-content"
import { Suspense } from "react"
import { DatabaseContentSkeleton } from "@/components/database-exlopedia/database-content-skeleton"

export default function DatabasePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-neutral-50/50 to-neutral-100/30 relative">
        {/* Hero Background Section - Static Content */}
        <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500" />
          <div className="absolute inset-0 bg-[url('https://i.ibb.co.com/Mdn3P2m/unnamed-2.png')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Floating Breadcrumb */}
          <div className="absolute top-3 sm:top-4 md:top-8 left-0 right-0 z-10">
            <div className="container max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-3 border border-white/20 shadow-lg shadow-black/10 w-fit">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/"
                        className="flex items-center gap-1 text-white/90 hover:text-white transition-colors text-xs sm:text-sm md:text-base"
                      >
                        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Beranda</span>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-white/70" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-white font-medium text-xs sm:text-sm md:text-base">
                        Database
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-4 md:p-8 text-white">
            <div className="container max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
              <div className="opacity-100">
                <Badge className="mb-3 sm:mb-3 md:mb-4 bg-white/10 text-white border-white/20 text-sm sm:text-sm backdrop-blur-xl shadow-lg shadow-black/10">
                  <span className="font-semibold">Database Penelitian</span>
                </Badge>
                <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-3 md:mb-4 leading-tight">
                  Database Global Felidae
                </h1>
                <p className="text-white/95 text-sm sm:text-sm md:text-lg lg:text-xl leading-relaxed max-w-3xl font-medium">
                  Jelajahi keanekaragaman keluarga Felidae melalui database komprehensif kami, mencakup karakteristik,
                  habitat, perilaku, dan status konservasi setiap spesies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Database Content with Suspense for Streaming */}
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8 md:py-16">
          <Suspense fallback={<DatabaseContentSkeleton />}>
            <DatabaseContent />
          </Suspense>
        </div>
      </main>
    </>
  )
}
