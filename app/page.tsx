import { HeroSection } from "@/components/hero-section"
import { WhatIsTaxonomy } from "@/components/what-is-taxonomy"
import { WhatIsFelidae } from "@/components/what-is-felidae"
import { WhyTaxonomyMatters } from "@/components/why-taxonomy-matters"
import { TaxonomyEasy } from "@/components/taxonomy-easy"
import { SolutionBridge } from "@/components/solution-bridge"
import { FeaturesSection } from "@/components/features-section"
import { ExplorationBridge } from "@/components/exploration-bridge"
import { TaxonomyDiagramPreview } from "@/components/taxonomy-diagram-preview"
import { EncyclopediaPreview } from "@/components/encyclopedia-preview"
import { ConservationBridge } from "@/components/conservation-bridge"
import { TaxonomyConservation } from "@/components/taxonomy-conservation"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. Pembuka - Selamat datang di dunia Felidae */}
      <HeroSection />

      {/* 2. Edukasi Dasar - Apa itu taksonomi? */}
      <WhatIsTaxonomy />

      {/* 3. Pengenalan Subjek - Siapa itu Felidae? */}
      <WhatIsFelidae />

      {/* 4. Alasan - Kenapa kita harus peduli? */}
      <WhyTaxonomyMatters />

      {/* 5. Reassurance - Jangan khawatir, ini mudah! */}
      <TaxonomyEasy />

      {/* 6. Transisi - Nah, untuk itu kami buat solusinya... */}
      <SolutionBridge />

      {/* 7. Solusi - Fitur-fitur aplikasi */}
      <FeaturesSection />

      {/* 8. Transisi - Penasaran seperti apa? */}
      <ExplorationBridge />

      {/* 9. Preview - Lihat diagram interaktifnya */}
      {/* <TaxonomyDiagramPreview /> */}

      {/* 10. Preview - Jelajahi ensiklopedianya */}
      {/* <EncyclopediaPreview /> */}

      {/* 11. Transisi - Tapi ada hal penting lainnya... */}
      <ConservationBridge />

      {/* 12. Klimaks Emosional - Konservasi & kepunahan */}
      <TaxonomyConservation />

      <FAQSection />

      {/* 14. Call to Action - Setelah termotivasi, ajak bergabung */}
      <CTASection />

      <Footer />

      <ScrollToTop />
    </main>
  )
}
