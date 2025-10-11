"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Globe,
  Search,
  Download,
  Copy,
  CheckCheck,
  ExternalLink,
  BookMarked,
  GraduationCap,
  Library,
  Filter,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Types
interface Reference {
  title: string
  authors: string
  year: number
  category: "journal" | "book" | "website" | "conference"
  keywords: string[]
  citation: {
    apa: string
    mla: string
    chicago: string
    harvard: string
  }
  abstract?: string
  journal?: string
  volume?: string
  issue?: string
  pages?: string
  publisher?: string
  website?: string
  accessDate?: string
  conference?: string
  location?: string
  doi?: string
  url?: string
  pdf?: string
}

// Sample references data
const references: Reference[] = [
  {
    title: "Taxonomy in the twenty-first century: Recommendations for ecologists",
    authors: "Garnett, S. T., & Christidis, L.",
    year: 2017,
    category: "journal",
    journal: "Biological Journal of the Linnean Society",
    volume: "121",
    issue: "3",
    pages: "623-639",
    doi: "10.1093/biolinnean/blx003",
    url: "https://academic.oup.com/biolinnean/article/121/3/623/3104071",
    keywords: ["Taxonomy", "Classification", "Biodiversity", "Systematics", "Nomenclature"],
    citation: {
      apa: "Garnett, S. T., & Christidis, L. (2017). Taxonomy in the twenty-first century: Recommendations for ecologists. Biological Journal of the Linnean Society, 121(3), 623-639. https://doi.org/10.1093/biolinnean/blx003",
      mla: 'Garnett, Stephen T., and Les Christidis. "Taxonomy in the twenty-first century: Recommendations for ecologists." Biological Journal of the Linnean Society, vol. 121, no. 3, 2017, pp. 623-639.',
      chicago:
        'Garnett, Stephen T., and Les Christidis. "Taxonomy in the twenty-first century: Recommendations for ecologists." Biological Journal of the Linnean Society 121, no. 3 (2017): 623-639.',
      harvard:
        "Garnett, S.T. and Christidis, L., 2017. Taxonomy in the twenty-first century: Recommendations for ecologists. Biological Journal of the Linnean Society, 121(3), pp.623-639.",
    },
    abstract:
      "Taxonomy is a scientific discipline that has provided the universal naming and classification system of biodiversity for centuries and continues effectively to accommodate new knowledge. A recent publication by Garnett and Christidis expressed concerns regarding the impact of taxonomic progress on conservation and proposed the establishment of a system to govern taxonomic changes. Their proposal to 'restrict freedom of taxonomic action' through governing subcommittees that would 'review taxonomic papers for compliance' and their assertion that 'the scientific community's failure to govern taxonomy threatens the effectiveness of global efforts to halt biodiversity loss, damages the credibility of science, and is expensive to society' are flawed in many respects. They also assert that the lack of governance of taxonomy damages conservation efforts, harms the credibility of science, and is costly to society. Despite its fairly recent release, Garnett and Christidis' proposition has already been rejected by a number of colleagues. Herein, we contribute to the conversation between taxonomists and conservation biologists aiming to clarify some misunderstandings and issues in the proposition by Garnett and Christidis.",
    pdf: "/papers/garnett_taxonomy_2017.pdf",
  },
  {
    title: "Principles of Animal Taxonomy",
    authors: "Simpson, G. G.",
    year: 1961,
    category: "book",
    publisher: "Columbia University Press",
    pages: "247",
    url: "https://www.jstor.org/stable/10.7312/simp92414",
    keywords: ["Taxonomy", "Zoology", "Classification", "Evolutionary theory", "Systematics"],
    citation: {
      apa: "Simpson, G. G. (1961). Principles of Animal Taxonomy. Columbia University Press.",
      mla: "Simpson, George Gaylord. Principles of Animal Taxonomy. Columbia University Press, 1961.",
      chicago: "Simpson, George Gaylord. Principles of Animal Taxonomy. Columbia University Press, 1961.",
      harvard: "Simpson, G.G., 1961. Principles of Animal Taxonomy. Columbia University Press.",
    },
    abstract:
      "This classic work by George Gaylord Simpson establishes a basis for understanding the aims and methods of taxonomy and systematics. Though focused on animals, the principles established in this book apply broadly across the taxonomic spectrum. Simpson addresses the full range of taxonomic procedure, from field collection to the presentation of results, and provides a wealth of practical examples to illustrate his theoretical points. The book remains a fundamental resource for understanding the historical development and theoretical foundations of systematic biology.",
    pdf: "/papers/simpson_principles_1961.pdf",
  },
  {
    title: "Integrative taxonomy: a multisource approach to exploring biodiversity",
    authors: "Dayrat, B.",
    year: 2005,
    category: "journal",
    journal: "Annual Review of Ecology, Evolution, and Systematics",
    volume: "36",
    pages: "249-268",
    doi: "10.1146/annurev.ecolsys.35.112202.130205",
    url: "https://www.annualreviews.org/doi/10.1146/annurev.ecolsys.35.112202.130205",
    keywords: ["Integrative taxonomy", "Molecular systematics", "Morphology", "Species delimitation", "Biodiversity"],
    citation: {
      apa: "Dayrat, B. (2005). Integrative taxonomy: a multisource approach to exploring biodiversity. Annual Review of Ecology, Evolution, and Systematics, 36, 249-268. https://doi.org/10.1146/annurev.ecolsys.35.112202.130205",
      mla: 'Dayrat, Benoît. "Integrative taxonomy: a multisource approach to exploring biodiversity." Annual Review of Ecology, Evolution, and Systematics, vol. 36, 2005, pp. 249-268.',
      chicago:
        'Dayrat, Benoît. "Integrative taxonomy: a multisource approach to exploring biodiversity." Annual Review of Ecology, Evolution, and Systematics 36 (2005): 249-268.',
      harvard:
        "Dayrat, B., 2005. Integrative taxonomy: a multisource approach to exploring biodiversity. Annual Review of Ecology, Evolution, and Systematics, 36, pp.249-268.",
    },
    abstract:
      "Taxonomy, the science of discovering, describing, and naming species, has been facing a crisis for several decades. The number of professional taxonomists has been declining, and the pace of species description has been slow compared to the estimated number of species on Earth. In response to this crisis, integrative taxonomy has emerged as a comprehensive approach that uses multiple lines of evidence (morphological, molecular, ecological, behavioral) to delimit species boundaries. This review examines the conceptual framework of integrative taxonomy, its methodological approaches, and its potential to accelerate the pace of species discovery and description. The integration of traditional morphological approaches with molecular techniques and other data sources is seen as a promising path forward for taxonomy in the twenty-first century.",
    pdf: "/papers/dayrat_integrative_2005.pdf",
  },
  {
    title: "The new taxonomy",
    authors: "Wheeler, Q. D. (Ed.)",
    year: 2008,
    category: "book",
    publisher: "CRC Press",
    pages: "237",
    url: "https://www.routledge.com/The-New-Taxonomy/Wheeler/p/book/9780367379391",
    keywords: ["Taxonomy", "Systematics", "Biodiversity", "Phylogenetics", "DNA barcoding"],
    citation: {
      apa: "Wheeler, Q. D. (Ed.). (2008). The new taxonomy. CRC Press.",
      mla: "Wheeler, Quentin D., editor. The New Taxonomy. CRC Press, 2008.",
      chicago: "Wheeler, Quentin D., ed. The New Taxonomy. CRC Press, 2008.",
      harvard: "Wheeler, Q.D. ed., 2008. The new taxonomy. CRC Press.",
    },
    abstract:
      "Taxonomy, the science of classifying organisms, has been in existence for nearly 250 years. Through the years, it has evolved to include new theories, techniques, and sources of data, many of which are currently the subject of intense research and debate. This book examines the state of taxonomy at the beginning of the 21st century and looks forward to its future. It addresses the crisis in taxonomy caused by a declining number of taxonomists and the increasing number of species that remain to be discovered. The book explores the impact of new technologies, such as DNA sequencing and computer-based imaging systems, on taxonomic research and discusses how these technologies are changing the way species are discovered, identified, and classified. The contributors also examine the role of taxonomy in conservation biology and ecosystem management.",
    pdf: "/papers/wheeler_new_taxonomy_2008.pdf",
  },
  {
    title: "Taxonomy: Impediment or Expedient?",
    authors: "Godfray, H. C. J.",
    year: 2002,
    category: "journal",
    journal: "Science",
    volume: "295",
    issue: "5557",
    pages: "1030-1031",
    doi: "10.1126/science.1067056",
    url: "https://science.sciencemag.org/content/295/5557/1030",
    keywords: ["Taxonomy", "Biodiversity", "Conservation", "Systematics", "Taxonomic impediment"],
    citation: {
      apa: "Godfray, H. C. J. (2002). Taxonomy: Impediment or Expedient? Science, 295(5557), 1030-1031. https://doi.org/10.1126/science.1067056",
      mla: 'Godfray, H. Charles J. "Taxonomy: Impediment or Expedient?" Science, vol. 295, no. 5557, 2002, pp. 1030-1031.',
      chicago: 'Godfray, H. Charles J. "Taxonomy: Impediment or Expedient?" Science 295, no. 5557 (2002): 1030-1031.',
      harvard: "Godfray, H.C.J., 2002. Taxonomy: Impediment or Expedient?. Science, 295(5557), pp.1030-1031.",
    },
    abstract:
      "Taxonomy, the naming and classification of organisms, is fundamental to understanding biodiversity. However, there is a growing concern that taxonomy is not keeping pace with the need for species identification and classification, particularly in the context of biodiversity conservation. This phenomenon has been termed the 'taxonomic impediment.' This article examines the challenges facing taxonomy and proposes solutions to overcome the taxonomic impediment. The author argues for a revitalization of taxonomy through increased funding, training of new taxonomists, and the adoption of new technologies, such as DNA barcoding and web-based taxonomic resources. The article also discusses the importance of taxonomy for biodiversity conservation and sustainable development.",
    pdf: "/papers/godfray_taxonomy_2002.pdf",
  },
  {
    title: "Taxonomy and Classification of Living Organisms",
    authors: "Blackwelder, R. E.",
    year: 1967,
    category: "book",
    publisher: "University of Chicago Press",
    pages: "698",
    keywords: ["Taxonomy", "Classification", "Systematics", "Biological nomenclature", "Phylogeny"],
    citation: {
      apa: "Blackwelder, R. E. (1967). Taxonomy and Classification of Living Organisms. University of Chicago Press.",
      mla: "Blackwelder, Richard E. Taxonomy and Classification of Living Organisms. University of Chicago Press, 1967.",
      chicago:
        "Blackwelder, Richard E. Taxonomy and Classification of Living Organisms. University of Chicago Press, 1967.",
      harvard: "Blackwelder, R.E., 1967. Taxonomy and Classification of Living Organisms. University of Chicago Press.",
    },
    abstract:
      "This comprehensive volume provides a detailed overview of the principles and practices of biological taxonomy and classification. The author explores the historical development of taxonomic systems, from Aristotle to modern phylogenetic approaches, and examines the theoretical foundations of classification. The book covers all major groups of living organisms and provides guidance on the practical aspects of taxonomic work, including specimen collection, preservation, and description. It also addresses the challenges of biological nomenclature and the application of taxonomic knowledge in fields such as ecology, conservation, and agriculture. This work remains a valuable resource for students and practitioners of systematic biology.",
    pdf: "/papers/blackwelder_taxonomy_1967.pdf",
  },
  {
    title: "The Catalogue of Life: towards an integrative taxonomic backbone for biodiversity",
    authors:
      "Roskov, Y., Kunze, T., Orrell, T., Abucay, L., Paglinawan, L., Culham, A., Bailly, N., Kirk, P., Bourgoin, T., Baillargeon, G., Decock, W., De Wever, A., & Didžiulis, V.",
    year: 2014,
    category: "website",
    website: "Catalogue of Life",
    url: "https://www.catalogueoflife.org/",
    accessDate: "15 Maret 2024",
    keywords: [
      "Biodiversity database",
      "Species checklist",
      "Taxonomic backbone",
      "Global species database",
      "Biodiversity informatics",
    ],
    citation: {
      apa: "Roskov, Y., Kunze, T., Orrell, T., Abucay, L., Paglinawan, L., Culham, A., Bailly, N., Kirk, P., Bourgoin, T., Baillargeon, G., Decock, W., De Wever, A., & Didžiulis, V. (2014). The Catalogue of Life: towards an integrative taxonomic backbone for biodiversity. https://www.catalogueoflife.org/",
      mla: 'Roskov, Y., et al. "The Catalogue of Life: towards an integrative taxonomic backbone for biodiversity." Catalogue of Life, 2014, www.catalogueoflife.org/.',
      chicago:
        'Roskov, Y., T. Kunze, T. Orrell, L. Abucay, L. Paglinawan, A. Culham, N. Bailly, et al. "The Catalogue of Life: towards an integrative taxonomic backbone for biodiversity." 2014. https://www.catalogueoflife.org/.',
      harvard:
        "Roskov, Y., Kunze, T., Orrell, T., Abucay, L., Paglinawan, L., Culham, A., Bailly, N., Kirk, P., Bourgoin, T., Baillargeon, G., Decock, W., De Wever, A. and Didžiulis, V., 2014. The Catalogue of Life: towards an integrative taxonomic backbone for biodiversity. Available at: https://www.catalogueoflife.org/ (Accessed: 15 March 2024).",
    },
    abstract:
      "The Catalogue of Life is a comprehensive global index of the world's known species of animals, plants, fungi, and microorganisms. It aims to provide a taxonomic backbone for global biodiversity initiatives by integrating data from numerous taxonomic databases and checklists. This resource serves as a critical reference for biodiversity research, conservation planning, and environmental management. The Catalogue of Life is continuously updated and expanded through collaborations with taxonomic experts and institutions worldwide. It provides standardized taxonomic information, including scientific names, synonyms, common names, and classification hierarchies, making it an essential tool for biodiversity informatics and global species inventories.",
  },
  {
    title: "DNA barcoding and taxonomy: dark taxa and dark texts",
    authors: "Page, R. D.",
    year: 2016,
    category: "journal",
    journal: "Philosophical Transactions of the Royal Society B: Biological Sciences",
    volume: "371",
    issue: "1702",
    pages: "20150334",
    doi: "10.1098/rstb.2015.0334",
    url: "https://royalsocietypublishing.org/doi/10.1098/rstb.2015.0334",
    keywords: ["DNA barcoding", "Taxonomy", "Biodiversity", "Dark taxa", "Taxonomic literature"],
    citation: {
      apa: "Page, R. D. (2016). DNA barcoding and taxonomy: dark taxa and dark texts. Philosophical Transactions of the Royal Society B: Biological Sciences, 371(1702), 20150334. https://doi.org/10.1098/rstb.2015.0334",
      mla: 'Page, Roderic D. "DNA barcoding and taxonomy: dark taxa and dark texts." Philosophical Transactions of the Royal Society B: Biological Sciences, vol. 371, no. 1702, 2016, p. 20150334.',
      chicago:
        'Page, Roderic D. "DNA barcoding and taxonomy: dark taxa and dark texts." Philosophical Transactions of the Royal Society B: Biological Sciences 371, no. 1702 (2016): 20150334.',
      harvard:
        "Page, R.D., 2016. DNA barcoding and taxonomy: dark taxa and dark texts. Philosophical Transactions of the Royal Society B: Biological Sciences, 371(1702), p.20150334.",
    },
    abstract:
      "Both classical taxonomy and DNA barcoding are engaged in the task of digitizing the living world. Much of the taxonomic literature remains undigitized, and many of the new species being described are invisible to search engines. However, DNA barcoding is generating a wealth of computable data that is being actively incorporated into global resources. Taxonomy needs to adopt the tools and practices of digital science to ensure that the products of its research are maximally reusable. The taxonomic community needs to embrace the technologies that will enable it to actively contribute to the process of digitizing biodiversity.",
    pdf: "/papers/page_dna_barcoding_2016.pdf",
  },
  {
    title: "Taxonomy and the DNA Barcoding Enterprise",
    authors: "Hebert, P. D. N., & Gregory, T. R.",
    year: 2005,
    category: "journal",
    journal: "Systematic Biology",
    volume: "54",
    issue: "5",
    pages: "852-859",
    doi: "10.1080/10635150500354886",
    url: "https://academic.oup.com/sysbio/article/54/5/852/1682114",
    keywords: ["DNA barcoding", "Taxonomy", "Species identification", "Molecular systematics", "Biodiversity"],
    citation: {
      apa: "Hebert, P. D. N., & Gregory, T. R. (2005). Taxonomy and the DNA Barcoding Enterprise. Systematic Biology, 54(5), 852-859. https://doi.org/10.1080/10635150500354886",
      mla: 'Hebert, Paul D. N., and T. Ryan Gregory. "Taxonomy and the DNA Barcoding Enterprise." Systematic Biology, vol. 54, no. 5, 2005, pp. 852-859.',
      chicago:
        'Hebert, Paul D. N., and T. Ryan Gregory. "Taxonomy and the DNA Barcoding Enterprise." Systematic Biology 54, no. 5 (2005): 852-859.',
      harvard:
        "Hebert, P.D.N. and Gregory, T.R., 2005. Taxonomy and the DNA Barcoding Enterprise. Systematic Biology, 54(5), pp.852-859.",
    },
    abstract:
      "DNA barcoding has been proposed as a technique to identify species based on sequence diversity in short, standardized gene regions. Despite broad scientific support for barcoding as a means to identify known specimens and to discover overlooked species, some critics have suggested that it threatens traditional taxonomy. We believe that such criticism is misplaced. Rather than threatening taxonomy, DNA barcoding is a tool that will speed the discovery and identification of new species, while making their subsequent taxonomic characterization easier. Far from threatening traditional taxonomy, DNA barcoding will be one of its strongest allies.",
    pdf: "/papers/hebert_taxonomy_dna_2005.pdf",
  },
  {
    title: "The Future of Taxonomy",
    authors: "Wheeler, Q. D., & Valdecasas, A. G.",
    year: 2010,
    category: "conference",
    conference: "Proceedings of the National Academy of Sciences Conference on Systematics and Biodiversity",
    location: "Washington, DC, USA",
    url: "https://www.pnas.org/content/107/suppl_2/19029",
    doi: "10.1073/pnas.0913067107",
    keywords: ["Taxonomy", "Biodiversity", "Systematics", "Cybertaxonomy", "Species discovery"],
    citation: {
      apa: "Wheeler, Q. D., & Valdecasas, A. G. (2010). The Future of Taxonomy. Proceedings of the National Academy of Sciences Conference on Systematics and Biodiversity, Washington, DC, USA. https://doi.org/10.1073/pnas.0913067107",
      mla: 'Wheeler, Quentin D., and Antonio G. Valdecasas. "The Future of Taxonomy." Proceedings of the National Academy of Sciences Conference on Systematics and Biodiversity, 2010, Washington, DC, USA.',
      chicago:
        'Wheeler, Quentin D., and Antonio G. Valdecasas. "The Future of Taxonomy." Proceedings of the National Academy of Sciences Conference on Systematics and Biodiversity, Washington, DC, USA, 2010.',
      harvard:
        "Wheeler, Q.D. and Valdecasas, A.G., 2010. The Future of Taxonomy. Proceedings of the National Academy of Sciences Conference on Systematics and Biodiversity, Washington, DC, USA.",
    },
    abstract:
      "Taxonomy, the science of discovering, describing, classifying, and naming organisms, is fundamental to understanding biodiversity. However, taxonomy faces numerous challenges in the 21st century, including a shortage of trained taxonomists, inadequate funding, and the vast number of undescribed species. This paper examines the future of taxonomy in light of these challenges and explores how new technologies and approaches can revitalize the field. The authors argue for a renewed commitment to taxonomy as a cornerstone of biodiversity science and propose strategies for integrating traditional taxonomic methods with emerging technologies, such as DNA barcoding, digital imaging, and online databases. They also discuss the importance of training the next generation of taxonomists and ensuring that taxonomic information is accessible to a wide range of users, from scientists to policymakers and the general public.",
    pdf: "/papers/wheeler_future_taxonomy_2010.pdf",
  },
  {
    title: "Taxonomy, DNA, and the Barcode of Life",
    authors: "Schindel, D. E., & Miller, S. E.",
    year: 2005,
    category: "journal",
    journal: "Proceedings of the National Academy of Sciences",
    volume: "102",
    issue: "suppl 1",
    pages: "6491-6492",
    doi: "10.1073/pnas.0501889102",
    keywords: ["DNA barcoding", "Taxonomy", "Species identification", "Biodiversity", "Molecular systematics"],
    citation: {
      apa: "Schindel, D. E., & Miller, S. E. (2005). Taxonomy, DNA, and the Barcode of Life. Proceedings of the National Academy of Sciences, 102(suppl 1), 6491-6492. https://doi.org/10.1073/pnas.0501889102",
      mla: 'Schindel, David E., and Scott E. Miller. "Taxonomy, DNA, and the Barcode of Life." Proceedings of the National Academy of Sciences, vol. 102, no. suppl 1, 2005, pp. 6491-6492.',
      chicago:
        'Schindel, David E., and Scott E. Miller. "Taxonomy, DNA, and the Barcode of Life." Proceedings of the National Academy of Sciences 102, no. suppl 1 (2005): 6491-6492.',
      harvard:
        "Schindel, D.E. and Miller, S.E., 2005. Taxonomy, DNA, and the Barcode of Life. Proceedings of the National Academy of Sciences, 102(suppl 1), pp.6491-6492.",
    },
    abstract:
      "The Consortium for the Barcode of Life (CBOL) is an international initiative devoted to developing DNA barcoding as a global standard for the identification of biological species. CBOL's mission is to promote the exploration and development of DNA barcoding as a standard for species identification. This paper introduces a special issue of PNAS that explores the scientific potential of DNA barcoding and its implications for taxonomy and biodiversity science. The authors discuss how DNA barcoding can complement traditional taxonomy and accelerate the process of species discovery and identification. They also address concerns about the relationship between DNA barcoding and traditional taxonomy, emphasizing that barcoding is a tool that can enhance, rather than replace, taxonomic expertise.",
    pdf: "/papers/schindel_taxonomy_dna_2005.pdf",
  },
]

// Additional resources data
const additionalResources = {
  databases: [
    {
      name: "Integrated Taxonomic Information System (ITIS)",
      url: "https://www.itis.gov/",
      description: "Database taksonomi yang menyediakan informasi tentang nama ilmiah dan klasifikasi organisme.",
    },
    {
      name: "Global Biodiversity Information Facility (GBIF)",
      url: "https://www.gbif.org/",
      description: "Platform global untuk data keanekaragaman hayati, termasuk informasi taksonomi.",
    },
    {
      name: "World Register of Marine Species (WoRMS)",
      url: "https://www.marinespecies.org/",
      description: "Database taksonomi komprehensif untuk spesies laut.",
    },
    {
      name: "Tree of Life Web Project",
      url: "https://tolweb.org/",
      description: "Proyek kolaboratif yang menggambarkan hubungan filogenetik antar organisme.",
    },
  ],
  journals: [
    {
      name: "Systematic Biology",
      url: "https://academic.oup.com/sysbio",
      description: "Jurnal terkemuka dalam bidang sistematika dan evolusi.",
    },
    {
      name: "Taxon",
      url: "https://onlinelibrary.wiley.com/journal/19968175",
      description: "Jurnal resmi International Association for Plant Taxonomy.",
    },
    {
      name: "Zootaxa",
      url: "https://www.mapress.com/zt/",
      description: "Jurnal taksonomi zoologi dengan cakupan global.",
    },
    {
      name: "Journal of Taxonomy",
      url: "https://www.europeanjournaloftaxonomy.eu/",
      description: "Jurnal akses terbuka yang didedikasikan untuk taksonomi dan sistematika.",
    },
  ],
  courses: [
    {
      name: "Introduction to Taxonomy and Systematics",
      url: "https://www.coursera.org/learn/taxonomy-systematics",
      description: "Kursus online yang mencakup prinsip-prinsip dasar taksonomi dan sistematika.",
    },
    {
      name: "Taxonomy: Life's Filing System",
      url: "https://www.edx.org/course/taxonomy-lifes-filing-system",
      description: "Kursus pengantar tentang sistem klasifikasi biologis.",
    },
    {
      name: "Phylogenetic Systematics",
      url: "https://www.futurelearn.com/courses/phylogenetic-systematics",
      description: "Kursus tentang metode filogenetik dalam sistematika.",
    },
    {
      name: "DNA Barcoding and Biodiversity",
      url: "https://www.open.edu/openlearn/nature-environment/dna-barcoding-and-biodiversity",
      description: "Kursus tentang penggunaan DNA barcoding dalam identifikasi spesies.",
    },
  ],
}

export default function TaxonomyReferencesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeYear, setActiveYear] = useState("all")
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null)
  const [filteredReferences, setFilteredReferences] = useState<Reference[]>([])

  // Filter references based on search query, category, and year
  useEffect(() => {
    let filtered = references

    if (searchQuery) {
      filtered = filtered.filter(
        (ref) =>
          ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ref.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ref.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ref.publisher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ref.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((ref) => ref.category === activeCategory)
    }

    if (activeYear !== "all") {
      filtered = filtered.filter((ref) => ref.year.toString() === activeYear)
    }

    setFilteredReferences(filtered)
  }, [searchQuery, activeCategory, activeYear])

  // Handle copy citation
  const handleCopyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation)
    setCopiedCitation(citation)
    setTimeout(() => setCopiedCitation(null), 2000)
  }

  // Get unique years for filter
  const years = [...new Set(references.map((ref) => ref.year))].sort((a, b) => b - a)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 800 800">
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 800}
                cy={Math.random() * 800}
                r={Math.random() * 100 + 50}
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 1, delay: i * 0.2 }}
              />
            ))}
            <motion.path
              d="M0,400 Q200,200 400,400 T800,400"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center mb-4">
            <Link
              href="/learning/taxonomy/v2"
              className="text-white/80 hover:text-white flex items-center gap-1 transition-colors duration-200 hover:translate-x-[-2px]"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Modul Taksonomi</span>
            </Link>
          </div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Referensi Akademik
          </motion.h1>

          <motion.p
            className="text-xl text-white/90 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Daftar lengkap sumber ilmiah dan akademik yang digunakan dalam modul pembelajaran Taksonomi
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Cari referensi berdasarkan judul, penulis, atau kata kunci..."
                className="pl-10 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 w-full transition-all duration-200 focus:bg-white/15 focus:border-white/30 hover:bg-white/15"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white w-[180px] transition-all duration-200 hover:bg-white/15 hover:border-white/30">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="journal">Jurnal</SelectItem>
                  <SelectItem value="book">Buku</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="conference">Konferensi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={activeYear} onValueChange={setActiveYear}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white w-[150px] transition-all duration-200 hover:bg-white/15 hover:border-white/30">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 flex items-center gap-2 text-white/80 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FileText size={14} />
            <span>{references.length} referensi tersedia</span>
            <span className="mx-2">•</span>
            <span>Terakhir diperbarui: Maret 2024</span>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Tabs for different citation styles */}
          <Tabs defaultValue="apa" className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Daftar Referensi</h2>
              <TabsList>
                <TabsTrigger value="apa">APA</TabsTrigger>
                <TabsTrigger value="mla">MLA</TabsTrigger>
                <TabsTrigger value="chicago">Chicago</TabsTrigger>
                <TabsTrigger value="harvard">Harvard</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="apa" className="space-y-8">
              {/* Filter information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-emerald-600" />
                  <span className="text-gray-600">
                    {filteredReferences.length === references.length
                      ? "Menampilkan semua referensi"
                      : `Menampilkan ${filteredReferences.length} dari ${references.length} referensi`}
                  </span>
                </div>

                {(searchQuery || activeCategory !== "all" || activeYear !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setActiveCategory("all")
                      setActiveYear("all")
                    }}
                  >
                    Reset Filter
                  </Button>
                )}
              </div>

              {/* References list */}
              {filteredReferences.length > 0 ? (
                <div className="space-y-6">
                  {filteredReferences.map((reference, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/20 hover:border-emerald-100 hover:translate-y-[-2px]">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between">
                            <Badge
                              className={`
                                transition-all duration-200
                                ${reference.category === "journal" ? "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:scale-105" : ""}
                                ${reference.category === "book" ? "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:scale-105" : ""}
                                ${reference.category === "website" ? "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:scale-105" : ""}
                                ${reference.category === "conference" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:scale-105" : ""}
                              `}
                            >
                              {reference.category === "journal" && "Jurnal"}
                              {reference.category === "book" && "Buku"}
                              {reference.category === "website" && "Website"}
                              {reference.category === "conference" && "Konferensi"}
                            </Badge>
                            <span className="text-gray-500 text-sm">{reference.year}</span>
                          </div>
                          <CardTitle className="text-xl mt-2">{reference.title}</CardTitle>
                          <CardDescription className="text-gray-600 font-medium">{reference.authors}</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="text-sm text-gray-600">
                            {reference.category === "journal" && (
                              <p className="italic">
                                {reference.journal}, {reference.volume}
                                {reference.issue ? `(${reference.issue})` : ""}, {reference.pages}.
                              </p>
                            )}

                            {reference.category === "book" && (
                              <p>
                                {reference.publisher}. {reference.pages && `${reference.pages} halaman.`}
                              </p>
                            )}

                            {reference.category === "website" && (
                              <p>
                                {reference.website}. Diakses pada {reference.accessDate}.
                              </p>
                            )}

                            {reference.category === "conference" && (
                              <p>
                                {reference.conference}, {reference.location}.
                              </p>
                            )}
                          </div>

                          {reference.abstract && (
                            <Accordion type="single" collapsible className="mt-3">
                              <AccordionItem value="abstract" className="border-b-0">
                                <AccordionTrigger className="text-sm text-emerald-600 py-2 hover:no-underline hover:text-emerald-700 transition-colors duration-200">
                                  Lihat Abstrak
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                  {reference.abstract}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}

                          <div className="flex flex-wrap gap-2 mt-4">
                            {reference.keywords.map((keyword, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 hover:border-gray-300"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter className="border-t bg-gray-50 flex justify-between pt-3">
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                    onClick={() => handleCopyCitation(reference.citation.apa)}
                                  >
                                    {copiedCitation === reference.citation.apa ? (
                                      <CheckCheck size={16} className="mr-1 text-emerald-600" />
                                    ) : (
                                      <Copy size={16} className="mr-1" />
                                    )}
                                    <span className="text-xs">Salin Sitasi</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Salin sitasi dalam format APA</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {reference.doi && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                      onClick={() => window.open(`https://doi.org/${reference.doi}`, "_blank")}
                                    >
                                      <ExternalLink size={16} className="mr-1" />
                                      <span className="text-xs">DOI</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Buka DOI: {reference.doi}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            {reference.url && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                      onClick={() => window.open(reference.url, "_blank")}
                                    >
                                      <Globe size={16} className="mr-1" />
                                      <span className="text-xs">Sumber</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Kunjungi sumber asli</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>

                          {reference.pdf && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 hover:shadow-sm"
                            >
                              <Download size={16} className="mr-1" />
                              <span className="text-xs">Unduh PDF</span>
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak ada referensi yang ditemukan</h3>
                  <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mla">
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <BookMarked size={48} className="mx-auto text-emerald-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">Format Sitasi MLA</h3>
                <p className="text-gray-600 mb-4">
                  Format MLA (Modern Language Association) umumnya digunakan dalam bidang humaniora, terutama dalam
                  studi bahasa dan sastra.
                </p>
                <Button variant="outline" className="text-emerald-600 border-emerald-200">
                  Ubah ke Format MLA
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="chicago">
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <BookMarked size={48} className="mx-auto text-emerald-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">Format Sitasi Chicago</h3>
                <p className="text-gray-600 mb-4">
                  Format Chicago umumnya digunakan dalam bidang sejarah, seni, dan beberapa disiplin ilmu sosial.
                </p>
                <Button variant="outline" className="text-emerald-600 border-emerald-200">
                  Ubah ke Format Chicago
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="harvard">
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <BookMarked size={48} className="mx-auto text-emerald-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">Format Sitasi Harvard</h3>
                <p className="text-gray-600 mb-4">
                  Format Harvard umumnya digunakan dalam bidang ilmu sosial dan sains.
                </p>
                <Button variant="outline" className="text-emerald-600 border-emerald-200">
                  Ubah ke Format Harvard
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Resources Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Library className="text-emerald-600" />
              Sumber Belajar Tambahan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="transition-all duration-300 hover:shadow-md hover:border-emerald-100 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-lg">Basis Data Taksonomi Global</CardTitle>
                  <CardDescription>Kumpulan database taksonomi dari seluruh dunia</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {additionalResources.databases.map((resource, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-emerald-500 mt-1 shrink-0" />
                        <div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline font-medium flex items-center group transition-all duration-200"
                          >
                            {resource.name}
                            <ExternalLink
                              size={12}
                              className="ml-1 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[-2px]"
                            />
                          </a>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md hover:border-emerald-100 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-lg">Jurnal Ilmiah Terkait</CardTitle>
                  <CardDescription>Jurnal-jurnal terkemuka dalam bidang taksonomi</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {additionalResources.journals.map((resource, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-emerald-500 mt-1 shrink-0" />
                        <div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline font-medium flex items-center group transition-all duration-200"
                          >
                            {resource.name}
                            <ExternalLink
                              size={12}
                              className="ml-1 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[-2px]"
                            />
                          </a>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md hover:border-emerald-100 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/30">
                <CardHeader>
                  <CardTitle className="text-lg">Kursus & Pembelajaran</CardTitle>
                  <CardDescription>Sumber belajar online tentang taksonomi</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {additionalResources.courses.map((resource, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-emerald-500 mt-1 shrink-0" />
                        <div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline font-medium flex items-center group transition-all duration-200"
                          >
                            {resource.name}
                            <ExternalLink
                              size={12}
                              className="ml-1 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[-2px]"
                            />
                          </a>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Citation Guide */}
          <section className="mt-16 bg-gray-50 rounded-xl p-8 border border-gray-100">
            <div className="flex items-start gap-6">
              <div className="bg-emerald-100 p-3 rounded-full">
                <GraduationCap size={24} className="text-emerald-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Panduan Sitasi Akademik</h2>
                <p className="text-gray-600 mb-4">
                  Berikut adalah panduan singkat tentang cara mengutip sumber-sumber dalam modul ini untuk keperluan
                  akademik Anda.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Format APA (American Psychological Association)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Format APA umumnya digunakan dalam bidang ilmu sosial, pendidikan, dan psikologi.
                    </p>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100 text-sm">
                      <p className="font-mono">
                        Penulis, A. A. (Tahun). Judul artikel. <em>Nama Jurnal</em>, Volume(Issue), halaman.
                        https://doi.org/xxx
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Format MLA (Modern Language Association)</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Format MLA umumnya digunakan dalam bidang humaniora, terutama dalam studi bahasa dan sastra.
                    </p>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100 text-sm">
                      <p className="font-mono">
                        Penulis, Nama. "Judul Artikel." <em>Nama Jurnal</em>, vol. X, no. X, Tahun, pp. XX-XX.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-md hover:shadow-emerald-200/50 hover:translate-y-[-1px]">
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Panduan Sitasi Lengkap
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Felidae Learn - Referensi Taksonomi</h3>
              <p className="text-gray-600 text-sm">Kumpulan referensi ilmiah untuk modul pembelajaran Taksonomi</p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-200"
              >
                <FileText className="mr-2 h-4 w-4" />
                Kebijakan Sitasi
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-200"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Panduan Akademik
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 Felidae Learn. Semua hak dilindungi.</p>
            <p className="mt-1">Referensi ini disusun untuk tujuan pendidikan dan penelitian akademik.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
