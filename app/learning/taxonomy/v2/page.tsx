"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dna,
  ExternalLink,
  Eye,
  FileText,
  Fingerprint,
  Flame,
  Layers,
  Leaf,
  Lightbulb,
  Microscope,
  Play,
  Search,
  Share2,
  Sparkles,
  TreePine,
  Zap,
  Check,
  History,
  ChevronRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"

export default function TaxonomyV2Page() {
  const [activeSection, setActiveSection] = useState("intro")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [showTaxonomyExplorer, setShowTaxonomyExplorer] = useState(false)
  const [selectedOrganism, setSelectedOrganism] = useState<string | null>(null)
  const [activeTaxonLevel, setActiveTaxonLevel] = useState<string | null>(null)
  const [showMethodDetails, setShowMethodDetails] = useState<string | null>(null)
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})

  // Refs for scroll sections
  const sectionRefs = {
    intro: useRef<HTMLDivElement>(null),
    what: useRef<HTMLDivElement>(null),
    history: useRef<HTMLDivElement>(null),
    levels: useRef<HTMLDivElement>(null),
    methods: useRef<HTMLDivElement>(null),
    examples: useRef<HTMLDivElement>(null),
    quiz: useRef<HTMLDivElement>(null),
  }

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  // Handle scroll to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      // Find the active section based on scroll position
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const element = ref.current
          const offsetTop = element.offsetTop
          const height = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section)

            // Mark section as completed if not already
            if (!completedSections.includes(section)) {
              setCompletedSections((prev) => [...prev, section])
            }

            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [completedSections])

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs]?.current
    if (section) {
      const offsetTop = section.offsetTop
      window.scrollTo({
        top: offsetTop - 80, // Account for header
        behavior: "smooth",
      })
    }
  }

  // Toggle FAQ expansion
  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSections = Object.keys(sectionRefs).length
    return Math.round((completedSections.length / totalSections) * 100)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/learning/taxonomy" className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                <ChevronLeft size={16} />
                <span className="text-sm">Kembali</span>
              </Link>
              <div className="h-4 w-px bg-gray-200 mx-2"></div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Versi 2
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1">
                <span className="text-sm text-gray-500">Progress:</span>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-emerald-600">{calculateProgress()}%</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-emerald-600 border-emerald-200"
                onClick={() => setShowTaxonomyExplorer(true)}
              >
                <Microscope className="mr-1 h-4 w-4" /> Jelajahi
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-white rounded-full shadow-lg p-2 border border-gray-100">
          <div className="flex flex-col gap-4">
            {Object.entries(sectionRefs).map(([key, _]) => (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => scrollToSection(key)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        activeSection === key
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                      } ${completedSections.includes(key) && activeSection !== key ? "ring-2 ring-emerald-200" : ""}`}
                    >
                      {getSectionIcon(key)}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{getSectionLabel(key)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white"></div>

          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-emerald-500"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 300 + 50}px`,
                    height: `${Math.random() * 300 + 50}px`,
                    opacity: Math.random() * 0.3,
                    filter: "blur(40px)",
                  }}
                  animate={{
                    x: [0, Math.random() * 40 - 20],
                    y: [0, Math.random() * 40 - 20],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: Math.random() * 10 + 10,
                  }}
                />
              ))}
            </div>
          </div>

          {/* DNA helix animation */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              className="w-[800px] h-[800px] opacity-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 200, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-full h-0.5 bg-emerald-600 origin-left"
                  style={{
                    rotate: `${i * 30}deg`,
                  }}
                >
                  {[...Array(10)].map((_, j) => (
                    <motion.div
                      key={j}
                      className="absolute rounded-full bg-emerald-600"
                      style={{
                        left: `${j * 10 + 5}%`,
                        width: "12px",
                        height: "12px",
                        marginTop: "-6px",
                        opacity: 0.7 - j * 0.05,
                      }}
                      animate={{
                        y: [0, j % 2 === 0 ? 15 : -15, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 5,
                        delay: j * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Floating taxonomy elements */}
        <div className="absolute inset-0 pointer-events-none">
          {taxonomyLevels.slice(0, 5).map((level, index) => (
            <motion.div
              key={level.name}
              className="absolute"
              style={{
                top: `${15 + index * 15}%`,
                left: index % 2 === 0 ? "15%" : "75%",
              }}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={{ opacity: 0.7, x: 0 }}
              transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
            >
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-emerald-100 flex items-center gap-2"
                whileHover={{ scale: 1.05, opacity: 1 }}
                animate={{ y: [0, 10, 0] }}
                transition={{
                  y: { repeat: Number.POSITIVE_INFINITY, duration: 3 + index, repeatType: "reverse" },
                  scale: { duration: 0.2 },
                }}
              >
                <div className="bg-emerald-100 p-1.5 rounded-full">{level.icon}</div>
                <span className="font-medium text-emerald-800">{level.name}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <motion.div className="container mx-auto px-4 relative z-10 text-center" style={{ opacity: opacityHero }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Animated badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6 inline-block"
            >
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors px-4 py-2 text-sm">
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatDelay: 5 }}
                >
                  Modul Pembelajaran Interaktif
                </motion.span>
              </Badge>
            </motion.div>

            {/* Main title with animated highlight */}
            <div className="relative mb-6">
              <motion.h1
                className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tight inline-block"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Taksonomi
                <motion.span
                  className="text-emerald-600 inline-block ml-2"
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 10,
                  }}
                >
                  .
                </motion.span>
              </motion.h1>

              {/* Animated underline */}
              <motion.div
                className="h-3 bg-emerald-200 absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full z-[-1]"
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>

            {/* Subtitle with typing effect */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mb-10"
            >
              <TypewriterEffect
                text="Menjelajahi sistem klasifikasi ilmiah yang mengatur keanekaragaman hayati di planet kita"
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              />
            </motion.div>

            {/* Interactive buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-7 font-medium flex items-center gap-3 transition-all shadow-lg shadow-emerald-200/50 group"
                  onClick={() => scrollToSection("what")}
                >
                  <span className="text-lg">Mulai Belajar</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                    className="bg-white/20 rounded-full p-1"
                  >
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-emerald-600 border border-emerald-200 rounded-full px-8 py-7 font-medium flex items-center gap-3 transition-all shadow-lg shadow-emerald-100/50 group"
                  onClick={() => setShowTaxonomyExplorer(true)}
                >
                  <span className="text-lg">Jelajahi Taksonomi</span>
                  <motion.div
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatDelay: 2 }}
                    className="bg-emerald-100 rounded-full p-1"
                  >
                    <Microscope size={20} className="group-hover:scale-110 transition-transform" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                {
                  value: "1.8 Juta+",
                  label: "Spesies Teridentifikasi",
                  icon: <Leaf className="h-5 w-5 text-emerald-500" />,
                },
                {
                  value: "7 Tingkat",
                  label: "Hierarki Taksonomi",
                  icon: <Layers className="h-5 w-5 text-emerald-500" />,
                },
                {
                  value: "250+ Tahun",
                  label: "Sejarah Taksonomi Modern",
                  icon: <History className="h-5 w-5 text-emerald-500" />,
                },
                {
                  value: "4 Metode",
                  label: "Klasifikasi Utama",
                  icon: <Microscope className="h-5 w-5 text-emerald-500" />,
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-emerald-50"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="bg-emerald-50 p-2 rounded-full">{stat.icon}</div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 + i * 0.2 }}
                  >
                    <CountUp
                      end={Number.parseInt(stat.value) || 100}
                      suffix={stat.value.includes("+") ? "+" : stat.value.includes("Juta") ? " Juta+" : ""}
                      className="text-2xl font-bold text-gray-900 block"
                    />
                  </motion.div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md border border-emerald-100 cursor-pointer"
            onClick={() => scrollToSection("what")}
          >
            <ChevronDown className="h-6 w-6 text-emerald-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* What is Taxonomy Section */}
      <section ref={sectionRefs.what} id="what" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced background decoration with animated gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-50/40 to-transparent"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-emerald-100 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-emerald-200 opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Decorative patterns */}
          <svg
            className="absolute top-0 left-0 w-full h-full opacity-5"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="#047857"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            {[...Array(10)].map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 100}
                cy={Math.random() * 100}
                r={Math.random() * 2 + 0.5}
                fill="#047857"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-4 flex items-center"
              >
                <Badge className="bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm">Pengantar</Badge>
                <motion.div
                  className="ml-3 h-px bg-emerald-200 flex-grow"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Apa itu{" "}
                <span className="text-emerald-600 relative inline-block">
                  Taksonomi
                  <motion.div
                    className="absolute -bottom-2 left-0 h-2 bg-emerald-200 w-full rounded-full z-[-1]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </span>
                ?
              </motion.h2>

              <div className="prose prose-lg max-w-none text-gray-600">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-lg leading-relaxed"
                >
                  Taksonomi adalah ilmu yang mempelajari tentang klasifikasi makhluk hidup berdasarkan persamaan dan
                  perbedaan karakteristiknya. Kata "taksonomi" berasal dari bahasa Yunani{" "}
                  <span className="italic font-medium text-emerald-700">taxis</span> yang berarti pengaturan dan{" "}
                  <span className="italic font-medium text-emerald-700">nomos</span> yang berarti hukum.
                </motion.p>

                <motion.p
                  className="mt-4 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  Sistem taksonomi modern yang kita gunakan saat ini didasarkan pada karya{" "}
                  <span className="font-medium text-gray-800">Carl Linnaeus</span>, seorang ahli botani Swedia yang
                  hidup pada abad ke-18. Linnaeus memperkenalkan sistem penamaan binomial dan hierarki klasifikasi yang
                  menjadi dasar taksonomi modern.
                </motion.p>

                <motion.div
                  className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

                  <h3 className="text-xl font-medium text-emerald-800 mb-3 flex items-center gap-2 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                      className="bg-emerald-100 p-2 rounded-full"
                    >
                      <Lightbulb className="h-5 w-5 text-emerald-600" />
                    </motion.div>
                    Mengapa Taksonomi Penting?
                  </h3>
                  <p className="text-gray-700 relative z-10 text-lg">
                    Taksonomi membantu ilmuwan mengorganisir dan memahami keanekaragaman hayati yang luar biasa di Bumi,
                    dengan memungkinkan mereka mengelompokkan organisme berdasarkan hubungan evolusioner dan
                    karakteristik bersama.
                  </p>

                  {/* Interactive benefits list */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: <Search className="h-4 w-4" />, text: "Memudahkan identifikasi spesies baru" },
                      { icon: <Layers className="h-4 w-4" />, text: "Mengorganisir pengetahuan biologis" },
                      { icon: <History className="h-4 w-4" />, text: "Melacak sejarah evolusi" },
                      { icon: <Microscope className="h-4 w-4" />, text: "Mendukung penelitian ilmiah" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-emerald-700 text-sm bg-white/80 p-2 rounded-lg border border-emerald-50"
                      >
                        <div className="bg-emerald-50 p-1.5 rounded-full">{item.icon}</div>
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Button
                    onClick={() => scrollToSection("history")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-lg shadow-emerald-200/50 group relative overflow-hidden"
                  >
                    {/* Button background animation */}
                    <motion.div
                      className="absolute inset-0 bg-emerald-500 rounded-lg z-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />

                    <span className="relative z-10">Pelajari Sejarah Taksonomi</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                      className="relative z-10"
                    >
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              {/* Main image with interactive elements */}
              <motion.div
                className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Interactive overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 z-10">
                  <motion.h3
                    className="text-3xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Sistem Klasifikasi Ilmiah
                  </motion.h3>
                  <motion.p
                    className="text-white/90 text-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Menjelajahi cara ilmuwan mengorganisir keanekaragaman hayati
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="mt-4 bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 w-fit shadow-lg group"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatDelay: 2 }}
                        className="mr-2 bg-white/20 rounded-full p-1"
                      >
                        <Play className="h-5 w-5" />
                      </motion.div>
                      Tonton Video
                    </Button>
                  </motion.div>
                </div>

                {/* Interactive hotspots */}
                {[
                  { top: "20%", left: "20%", label: "Kingdom" },
                  { top: "30%", left: "70%", label: "Phylum" },
                  { top: "60%", left: "30%", label: "Family" },
                  { top: "70%", left: "80%", label: "Species" },
                ].map((spot, i) => (
                  <motion.div
                    key={i}
                    className="absolute z-20 cursor-pointer"
                    style={{ top: spot.top, left: spot.left }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <motion.div
                      className="h-4 w-4 bg-emerald-400 rounded-full relative"
                      animate={{ boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0.7)", "0 0 0 10px rgba(16, 185, 129, 0)"] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <div className="absolute top-0 left-0 transform -translate-y-full -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {spot.label}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Main image */}
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Taksonomi"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transform transition-transform duration-10000 hover:scale-110"
                />
              </motion.div>

              {/* Floating fact cards with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: 50, x: -50 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
                viewport={{ once: true }}
                className="absolute -bottom-12 -left-12 bg-white p-6 rounded-xl shadow-xl max-w-xs border border-emerald-100 backdrop-blur-sm bg-white/90"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-3 rounded-full shrink-0"
                    animate={{
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-lg">Tahukah Kamu?</h4>
                    <p className="text-gray-600">
                      Ada lebih dari <span className="font-bold text-emerald-700">1.8 juta</span> spesies yang telah
                      diidentifikasi, tetapi diperkirakan masih ada 5-30 juta spesies yang belum ditemukan!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Second floating card with enhanced styling */}
              <motion.div
                initial={{ opacity: 0, y: -30, x: 50 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                viewport={{ once: true }}
                className="absolute -top-10 right-0 bg-white p-4 rounded-xl shadow-lg max-w-[200px] border border-emerald-100 backdrop-blur-sm bg-white/90"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-2 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Fingerprint className="h-5 w-5 text-emerald-600" />
                  </motion.div>
                  <p className="font-medium text-emerald-800">Carl Linnaeus</p>
                </div>
                <p className="text-sm text-gray-600">
                  Dikenal sebagai <span className="italic">"Bapak Taksonomi Modern"</span> yang memperkenalkan sistem
                  penamaan binomial pada tahun 1735.
                </p>
              </motion.div>

              {/* New floating element - Timeline snippet */}
              <motion.div
                initial={{ opacity: 0, y: 30, x: -30 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0, type: "spring" }}
                viewport={{ once: true }}
                className="absolute -bottom-24 right-10 bg-white p-4 rounded-xl shadow-lg max-w-[220px] border border-emerald-100 backdrop-blur-sm bg-white/90"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-1.5 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Dna className="h-4 w-4 text-emerald-600" />
                  </motion.div>
                  <p className="font-medium text-emerald-800 text-sm">Evolusi Taksonomi</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                    <div className="h-10 w-0.5 bg-emerald-200"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="text-xs text-gray-600 space-y-6">
                    <p>Aristoteles (384-322 SM)</p>
                    <p>Linnaeus (1735)</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History of Taxonomy Section */}
      <section
        ref={sectionRefs.history}
        id="history"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute top-0 left-0 w-full opacity-5" viewBox="0 0 800 800">
            <motion.path
              d="M0,0 L800,0 L800,800 L0,800 Z"
              fill="none"
              stroke="#047857"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2 }}
              viewport={{ once: true }}
            />
            {[...Array(20)].map((_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 800}
                cy={Math.random() * 800}
                r={Math.random() * 10 + 2}
                fill="#047857"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: i * 0.1 }}
                viewport={{ once: true }}
              />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm">Sejarah</Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Evolusi <span className="text-emerald-600">Sistem Taksonomi</span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Perjalanan taksonomi dari zaman kuno hingga era modern menunjukkan bagaimana pemahaman kita tentang
              keanekaragaman hayati terus berkembang.
            </motion.p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-1 bg-emerald-200 transform -translate-x-1/2"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
            ></motion.div>

            <div className="space-y-32">
              {historyTimeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`relative flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center`}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-1/2 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white transform -translate-x-1/2 z-10"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.2, type: "spring" }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.5, backgroundColor: "#047857" }}
                  ></motion.div>

                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-16 text-right" : "pl-16"}`}>
                    <motion.div
                      className={`bg-white p-8 rounded-xl shadow-lg border border-emerald-100 ${
                        index % 2 === 0 ? "ml-auto" : "mr-auto"
                      } max-w-md hover:shadow-xl transition-shadow`}
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-4 mb-6 justify-start">
                        <motion.div
                          className="bg-emerald-100 p-3 rounded-full"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 1 }}
                        >
                          {event.icon}
                        </motion.div>
                        <div>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 mb-2 px-3 py-1">
                            {event.year}
                          </Badge>
                          <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                        </div>
                      </div>

                      <p className="text-gray-600 text-lg mb-6">{event.description}</p>

                      {event.achievement && (
                        <motion.div
                          className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                          viewport={{ once: true }}
                        >
                          <h4 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-emerald-600" />
                            Pencapaian Utama:
                          </h4>
                          <p className="text-gray-700">{event.achievement}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  {/* Year indicator for the other side */}
                  <div className={`w-1/2 ${index % 2 === 0 ? "pl-16" : "pr-16 text-right"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                      viewport={{ once: true }}
                      className={`inline-block ${index % 2 === 0 ? "" : "ml-auto"}`}
                    >
                      <span className="text-5xl font-bold text-emerald-200">{event.year.split(" ")[0]}</span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-24 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => scrollToSection("levels")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg shadow-emerald-200/50 group"
              >
                Pelajari Tingkatan Taksonomi
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                >
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Taxonomy Levels Section */}
      <section ref={sectionRefs.levels} id="levels" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-40 left-20 w-72 h-72 rounded-full bg-emerald-50 opacity-60"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-emerald-100 opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm">Tingkatan</Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Hierarki <span className="text-emerald-600">Taksonomi</span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Sistem taksonomi modern menggunakan hierarki tingkatan untuk mengklasifikasikan semua makhluk hidup, dari
              yang paling umum hingga yang paling spesifik.
            </motion.p>
          </motion.div>

          {/* Interactive Taxonomy Pyramid */}
          <div className="relative h-[600px] mb-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 800 600" className="w-full h-full max-w-5xl mx-auto">
                <defs>
                  <linearGradient id="pyramidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Pyramid Levels */}
                {taxonomyLevels.map((level, index) => {
                  const totalLevels = taxonomyLevels.length
                  const yPosition = 50 + index * (450 / totalLevels)
                  const width = 700 - index * (600 / totalLevels)

                  return (
                    <g key={level.name}>
                      <motion.path
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: index * 0.15, type: "spring" }}
                        viewport={{ once: true }}
                        d={`M${400 - width / 2},${yPosition} L${400 + width / 2},${yPosition} L${400 + width / 2 - 30},${yPosition + 450 / totalLevels} L${400 - width / 2 + 30},${yPosition + 450 / totalLevels} Z`}
                        fill="url(#pyramidGradient)"
                        stroke="#047857"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setActiveTaxonLevel(level.name)}
                        opacity={activeTaxonLevel === level.name ? 1 : 0.7}
                        filter={activeTaxonLevel === level.name ? "url(#glow)" : ""}
                        whileHover={{ scale: 1.02 }}
                      />

                      <motion.text
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                        viewport={{ once: true }}
                        x="400"
                        y={yPosition + 30}
                        textAnchor="middle"
                        fill="#fff"
                        fontWeight="bold"
                        fontSize="18"
                        className="pointer-events-none select-none"
                      >
                        {level.name}
                      </motion.text>

                      {/* Example text on the right side */}
                      <motion.text
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: activeTaxonLevel === level.name ? 0.8 : 0.4, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                        viewport={{ once: true }}
                        x={400 + width / 2 + 20}
                        y={yPosition + 10}
                        textAnchor="start"
                        fill="#047857"
                        fontSize="14"
                        className="pointer-events-none select-none"
                        opacity={activeTaxonLevel === level.name ? 1 : 0.6}
                      >
                        {level.example.split(" - ")[0]}
                      </motion.text>
                    </g>
                  )
                })}

                {/* Connecting lines between levels */}
                {taxonomyLevels.map((level, index) => {
                  if (index === taxonomyLevels.length - 1) return null

                  const totalLevels = taxonomyLevels.length
                  const currentY = 50 + index * (450 / totalLevels) + 450 / totalLevels
                  const nextY = 50 + (index + 1) * (450 / totalLevels)

                  return (
                    <motion.line
                      key={`line-${index}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.5 }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.15 }}
                      viewport={{ once: true }}
                      x1="400"
                      y1={currentY}
                      x2="400"
                      y2={nextY}
                      stroke="#047857"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="pointer-events-none"
                    />
                  )
                })}
              </svg>

              {/* Info panel for selected level */}
              <AnimatePresence>
                {activeTaxonLevel && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 100 }}
                    className="absolute right-4 top-4 bg-white p-8 rounded-xl shadow-xl border border-emerald-100 max-w-md"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full text-gray-400 hover:text-gray-600"
                      onClick={() => setActiveTaxonLevel(null)}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        className="bg-emerald-100 p-3 rounded-full"
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {taxonomyLevels.find((l) => l.name === activeTaxonLevel)?.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900">{activeTaxonLevel}</h3>
                    </div>

                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {taxonomyLevels.find((l) => l.name === activeTaxonLevel)?.description}
                    </p>

                    <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100">
                      <h4 className="font-medium text-emerald-800 mb-3 flex items-center gap-2">
                        <Microscope className="h-5 w-5 text-emerald-600" />
                        Contoh:
                      </h4>
                      <p className="text-gray-700">
                        {taxonomyLevels.find((l) => l.name === activeTaxonLevel)?.example}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-3">Posisi dalam Hierarki:</h4>
                      <div className="flex items-center">
                        <div className="h-1 bg-emerald-200 rounded-full flex-grow">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${((taxonomyLevels.findIndex((l) => l.name === activeTaxonLevel) + 1) / taxonomyLevels.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm text-emerald-600 font-medium">
                          {taxonomyLevels.findIndex((l) => l.name === activeTaxonLevel) + 1} dari{" "}
                          {taxonomyLevels.length}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-center mb-16">
            <motion.p
              className="text-gray-500 italic flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                👆
              </motion.span>
              Klik pada tingkatan taksonomi untuk melihat detailnya
            </motion.p>
          </div>

          {/* Taxonomy Cards for Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {taxonomyLevels.slice(0, 6).map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="bg-emerald-100 p-3 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                  >
                    {level.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900">{level.name}</h3>
                </div>

                <p className="text-gray-600 mb-6">{level.description}</p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-emerald-600 mb-2">Contoh:</p>
                  <p className="text-gray-700">{level.example}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => scrollToSection("methods")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg shadow-emerald-200/50 group"
              >
                Pelajari Metode Klasifikasi
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                >
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Classification Methods Section */}
      <section
        ref={sectionRefs.methods}
        id="methods"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-0 right-0 w-full h-full opacity-5" viewBox="0 0 800 800">
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={600 + Math.random() * 200}
                cy={Math.random() * 800}
                r={Math.random() * 100 + 50}
                fill="none"
                stroke="#047857"
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 1, delay: i * 0.2 }}
                viewport={{ once: true }}
              />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm">Metode</Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Bagaimana <span className="text-emerald-600">Taksonomi Bekerja</span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Proses klasifikasi taksonomi melibatkan beberapa metode dan kriteria untuk menentukan di mana suatu
              organisme ditempatkan dalam sistem klasifikasi.
            </motion.p>
          </motion.div>

          {/* Classification Methods Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            {classificationMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-xl overflow-hidden border border-emerald-100 group"
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="relative h-56">
                  <Image
                    src={method.image || "/placeholder.svg?height=400&width=600"}
                    alt={method.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-8">
                    <motion.div
                      className="flex items-center gap-4 mb-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-emerald-100 p-3 rounded-full">{method.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{method.name}</h3>
                        <p className="text-white/80 text-sm">{method.since}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      viewport={{ once: true }}
                      className="h-1 bg-emerald-500 rounded-full"
                    ></motion.div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 mb-6 text-lg">{method.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {method.tags.map((tag, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.2 + idx * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-8">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-500">Akurasi</div>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${method.accuracy}%` }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.2 }}
                          viewport={{ once: true }}
                        ></motion.div>
                      </div>
                      <div className="text-sm font-medium text-emerald-600">{method.accuracy}%</div>
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => setShowMethodDetails(method.id)}
                      >
                        <span>Pelajari Lebih Lanjut</span>
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Method Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-xl border border-emerald-100 p-8 overflow-hidden"
          >
            <motion.h3
              className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Microscope className="h-6 w-6 text-emerald-600" />
              Perbandingan Metode Klasifikasi
            </motion.h3>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-emerald-100">
                    <motion.th
                      className="py-5 px-4 text-left text-gray-500 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      Metode
                    </motion.th>
                    <motion.th
                      className="py-5 px-4 text-left text-gray-500 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      Akurasi
                    </motion.th>
                    <motion.th
                      className="py-5 px-4 text-left text-gray-500 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      Aksesibilitas
                    </motion.th>
                    <motion.th
                      className="py-5 px-4 text-left text-gray-500 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      Biaya
                    </motion.th>
                    <motion.th
                      className="py-5 px-4 text-left text-gray-500 font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      Kelebihan Utama
                    </motion.th>
                  </tr>
                </thead>
                <tbody>
                  {classificationMethods.map((method, index) => (
                    <motion.tr
                      key={method.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                    >
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-2 rounded-full">{method.icon}</div>
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${method.accuracy}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              viewport={{ once: true }}
                            ></motion.div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{method.accuracy}%</span>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${method.accessibility}%` }}
                              transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                              viewport={{ once: true }}
                            ></motion.div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{method.accessibility}%</span>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.span
                              key={i}
                              className={`text-lg ${i < method.cost ? "text-emerald-500" : "text-gray-200"}`}
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 + i * 0.05 }}
                              viewport={{ once: true }}
                            >
                              $
                            </motion.span>
                          ))}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-gray-600">{method.mainAdvantage}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => scrollToSection("examples")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg shadow-emerald-200/50 group"
              >
                Lihat Contoh Klasifikasi
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                >
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Examples Section */}
      <section ref={sectionRefs.examples} id="examples" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-40 right-20 w-72 h-72 rounded-full bg-emerald-50 opacity-60"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-emerald-100 opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm">Contoh</Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Klasifikasi dalam <span className="text-emerald-600">Praktik</span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Mari kita lihat bagaimana taksonomi diterapkan pada beberapa contoh organisme dari keluarga Felidae.
            </motion.p>
          </motion.div>

          {/* Example Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {exampleOrganisms.map((organism, index) => (
              <motion.div
                key={organism.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-xl overflow-hidden border border-emerald-100 group"
                whileHover={{
                  y: -15,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="relative h-64">
                  <Image
                    src={organism.image || "/placeholder.svg?height=400&width=600"}
                    alt={organism.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-1">{organism.name}</h3>
                      <p className="text-emerald-300 italic">{organism.scientificName}</p>
                    </motion.div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Keluarga", value: organism.family },
                      { label: "Genus", value: organism.genus },
                      { label: "Habitat", value: organism.habitat },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="flex justify-between text-sm py-2 border-b border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.2 + idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-gray-500">{item.label}:</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => setSelectedOrganism(organism.id)}
                    >
                      <span>Lihat Klasifikasi Lengkap</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Binomial Nomenclature Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="bg-emerald-50 rounded-xl p-10 border border-emerald-100 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <motion.div
                className="md:w-1/3"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-white p-8 rounded-xl shadow-md border border-emerald-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Fingerprint className="h-6 w-6 text-emerald-600" />
                    Penamaan Binomial
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Sistem penamaan binomial adalah metode standar untuk penamaan ilmiah spesies. Sistem ini menggunakan
                    dua kata Latin: genus diikuti oleh spesies.
                  </p>
                  <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100">
                    <p className="text-gray-700">
                      <span className="font-bold italic text-lg">Panthera tigris</span>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="h-0.5 bg-emerald-300 my-2"
                      ></motion.div>
                      <span className="block mt-2">
                        Genus: <span className="font-medium text-emerald-700">Panthera</span>
                      </span>
                      <span className="block">
                        Spesies: <span className="font-medium text-emerald-700">tigris</span>
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="md:w-2/3"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Aturan Penamaan Binomial</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {binomialRules.map((rule, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm border border-emerald-100"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="bg-emerald-100 p-2 rounded-full mt-0.5 shrink-0">
                        <Check className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-lg">{rule.title}</h4>
                        <p className="text-gray-600">{rule.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => scrollToSection("quiz")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg shadow-emerald-200/50 group"
              >
                Uji Pengetahuan Anda
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                >
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quiz Section */}
      <section
        ref={sectionRefs.quiz}
        id="quiz"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-emerald-500"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 100 + 20}px`,
                  height: `${Math.random() * 100 + 20}px`,
                  opacity: Math.random() * 0.3,
                }}
                animate={{
                  y: [0, Math.random() * 30 - 15],
                  x: [0, Math.random() * 30 - 15],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: Math.random() * 10 + 10,
                }}
              />
            ))}
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm">Kuis</Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Uji <span className="text-emerald-600">Pengetahuan</span> Anda
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Jawab pertanyaan-pertanyaan berikut untuk menguji pemahaman Anda tentang taksonomi.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-xl border border-emerald-100 overflow-hidden"
          >
            <div className="p-8">
              <motion.h3
                className="text-2xl font-bold text-gray-900 mb-10 flex items-center gap-3"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Zap className="h-6 w-6 text-emerald-600" />
                Kuis Taksonomi
              </motion.h3>

              <div className="space-y-10">
                {quizQuestions.map((question, qIndex) => (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: qIndex * 0.2 }}
                    viewport={{ once: true }}
                    className="border border-emerald-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-xl font-medium text-gray-900 mb-6 flex items-start gap-4">
                      <span className="bg-emerald-100 text-emerald-700 rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                        {qIndex + 1}
                      </span>
                      <span>{question.question}</span>
                    </h4>

                    <div className="space-y-4 mt-8">
                      {question.options.map((option, oIndex) => (
                        <motion.div
                          key={oIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + qIndex * 0.2 + oIndex * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(16, 185, 129, 0.05)",
                            borderColor: "rgba(16, 185, 129, 0.3)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))
                          }}
                          className={`p-5 rounded-xl border cursor-pointer transition-all ${
                            selectedAnswers[qIndex] === oIndex
                              ? "border-emerald-500 bg-emerald-50/50"
                              : "border-gray-100 hover:bg-emerald-50/30"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                selectedAnswers[qIndex] === oIndex ? "border-emerald-500" : "border-gray-300"
                              }`}
                            >
                              {selectedAnswers[qIndex] === oIndex && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="h-3 w-3 rounded-full bg-emerald-500"
                                ></motion.div>
                              )}
                            </div>
                            <span className="text-gray-700 text-lg">{option}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-10 flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg shadow-lg shadow-emerald-200/50 text-lg"
                    onClick={() => {
                      // Hitung skor
                      const score = Object.entries(selectedAnswers).reduce((acc, [qIndex, answerIndex]) => {
                        const questionIndex = Number.parseInt(qIndex)
                        return quizQuestions[questionIndex].correctAnswer === answerIndex ? acc + 1 : acc
                      }, 0)

                      // Tampilkan alert dengan skor
                      alert(`Skor Anda: ${score} dari ${quizQuestions.length} pertanyaan benar!`)
                    }}
                  >
                    Periksa Jawaban
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-40 left-20 w-72 h-72 rounded-full bg-emerald-50 opacity-60"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-emerald-100 opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 px-3 py-1.5 text-sm">FAQ</Badge>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Pertanyaan <span className="text-emerald-600">Umum</span>
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Jawaban untuk pertanyaan yang sering diajukan tentang taksonomi.
            </motion.p>
          </motion.div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="border border-emerald-100 rounded-xl overflow-hidden bg-white shadow-md"
              >
                <motion.button
                  className="w-full p-6 text-left flex justify-between items-center"
                  onClick={() => toggleFaq(item.id)}
                  whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                >
                  <h3 className="text-xl font-medium text-gray-900 flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: expandedFaq === item.id ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-emerald-100 p-1.5 rounded-full text-emerald-600"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                    {item.question}
                  </h3>
                </motion.button>

                <AnimatePresence>
                  {expandedFaq === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="prose prose-emerald max-w-none text-gray-600">
                          <p className="text-lg">{item.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 to-emerald-700 relative overflow-hidden">
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
                whileInView={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 1, delay: i * 0.2 }}
                viewport={{ once: true }}
              />
            ))}
            <motion.path
              d="M0,400 Q200,200 400,400 T800,400"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2 }}
              viewport={{ once: true }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Siap untuk Menjelajahi Lebih Jauh?
            </motion.h2>

            <motion.p
              className="text-xl text-emerald-100 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Pelajari lebih lanjut tentang keluarga Felidae dan bagaimana taksonomi membantu kita memahami
              keanekaragaman kucing di seluruh dunia.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/database"
                  className="bg-white hover:bg-gray-100 text-emerald-600 px-8 py-4 rounded-lg font-medium text-lg flex items-center gap-3 transition-all shadow-lg"
                >
                  Jelajahi Database Felidae
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
                  >
                    <ArrowRight size={20} />
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/scanner"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center gap-3 transition-all shadow-lg border border-emerald-500"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatDelay: 1 }}
                  >
                    <Microscope size={20} />
                  </motion.span>
                  Coba Scanner AI
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, repeatDelay: 2 }}
              >
                <Leaf className="h-8 w-8 text-emerald-600" />
              </motion.div>
              <span className="text-2xl font-bold text-gray-900">Felidae Learn</span>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Bagikan
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Unduh PDF
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> Referensi
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="mt-10 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p>© 2023 Felidae Learn. Semua hak dilindungi.</p>
          </motion.div>
        </div>
      </footer>

      {/* Taxonomy Explorer Modal */}
      <AnimatePresence>
        {showTaxonomyExplorer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Microscope className="h-6 w-6 text-emerald-600" />
                    Jelajahi Taksonomi
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setShowTaxonomyExplorer(false)}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-6 flex-1 overflow-auto">
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari organisme..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exampleOrganisms.map((organism) => (
                      <Card
                        key={organism.id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedOrganism(organism.id)}
                      >
                        <div className="relative h-32">
                          <Image
                            src={organism.image || "/placeholder.svg?height=300&width=400"}
                            alt={organism.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-900">{organism.name}</h4>
                          <p className="text-sm text-emerald-600 italic">{organism.scientificName}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Organism Detail Modal */}
      <AnimatePresence>
        {selectedOrganism && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              {exampleOrganisms
                .filter((o) => o.id === selectedOrganism)
                .map((organism) => (
                  <div key={organism.id} className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-gray-900">{organism.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setSelectedOrganism(null)}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="relative h-64 md:h-auto">
                          <Image
                            src={organism.image || "/placeholder.svg?height=600&width=800"}
                            alt={organism.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-6">
                          <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-1">Klasifikasi Taksonomi</h4>
                            <p className="text-emerald-600 italic mb-4">{organism.scientificName}</p>

                            <div className="space-y-2">
                              {Object.entries(organism.taxonomy).map(([rank, value]) => (
                                <div key={rank} className="flex justify-between text-sm py-2 border-b border-gray-100">
                                  <span className="text-gray-500 capitalize">{rank}:</span>
                                  <span className="font-medium text-gray-900">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-medium text-gray-900 mb-3">Informasi Tambahan</h4>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Habitat</p>
                                <p className="font-medium text-gray-900">{organism.habitat}</p>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Status Konservasi</p>
                                <p className="font-medium text-gray-900">{organism.conservationStatus}</p>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Distribusi</p>
                                <p className="font-medium text-gray-900">{organism.distribution}</p>
                              </div>

                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Ukuran</p>
                                <p className="font-medium text-gray-900">{organism.size}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border-t border-gray-100">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Deskripsi</h4>
                        <p className="text-gray-600">{organism.description}</p>

                        <div className="mt-6 flex justify-end">
                          <Button
                            variant="outline"
                            className="text-emerald-600 border-emerald-200"
                            onClick={() => setSelectedOrganism(null)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Lihat di Database
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Method Detail Modal */}
      <AnimatePresence>
        {showMethodDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              {classificationMethods
                .filter((m) => m.id === showMethodDetails)
                .map((method) => (
                  <div key={method.id} className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full">{method.icon}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-emerald-600">{method.since}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setShowMethodDetails(null)}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex-1 overflow-auto p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                          <div className="prose prose-emerald max-w-none">
                            <p className="text-lg text-gray-600">{method.description}</p>

                            <h4>Karakteristik Utama</h4>
                            <ul>
                              {method.points.map((point, idx) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>

                            <h4>Kelebihan</h4>
                            <p>{method.advantages}</p>

                            <h4>Keterbatasan</h4>
                            <p>{method.limitations}</p>

                            <h4>Contoh Penerapan</h4>
                            <p>{method.example}</p>
                          </div>
                        </div>

                        <div>
                          <div className="sticky top-6">
                            <div className="rounded-xl overflow-hidden shadow-md mb-6">
                              <Image
                                src={method.image || "/placeholder.svg?height=400&width=600"}
                                alt={method.name}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                              />
                              <div className="p-4 bg-gray-50">
                                <p className="text-sm text-gray-600">{method.imageDesc}</p>
                              </div>
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-6">
                              <h4 className="font-medium text-emerald-800 mb-2">Kapan Digunakan?</h4>
                              <p className="text-sm text-gray-700">{method.whenToUse}</p>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">Perbandingan Metrik</h4>

                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Akurasi</span>
                                  <span className="font-medium">{method.accuracy}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${method.accuracy}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Aksesibilitas</span>
                                  <span className="font-medium">{method.accessibility}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${method.accessibility}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Efisiensi Biaya</span>
                                  <span className="font-medium">{method.costEfficiency}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${method.costEfficiency}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper function to get section icon
function getSectionIcon(section: string) {
  switch (section) {
    case "intro":
      return <Flame className="h-5 w-5" />
    case "what":
      return <BookOpen className="h-5 w-5" />
    case "history":
      return <History className="h-5 w-5" />
    case "levels":
      return <Layers className="h-5 w-5" />
    case "methods":
      return <Microscope className="h-5 w-5" />
    case "examples":
      return <Leaf className="h-5 w-5" />
    case "quiz":
      return <Zap className="h-5 w-5" />
    default:
      return <Lightbulb className="h-5 w-5" />
  }
}

// Helper function to get section label
function getSectionLabel(section: string) {
  switch (section) {
    case "intro":
      return "Pengantar"
    case "what":
      return "Apa itu Taksonomi?"
    case "history":
      return "Sejarah"
    case "levels":
      return "Tingkatan Taksonomi"
    case "methods":
      return "Metode Klasifikasi"
    case "examples":
      return "Contoh"
    case "quiz":
      return "Kuis"
    default:
      return section
  }
}

// Typewriter Effect Component
function TypewriterEffect({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("")

  useEffect(() => {
    let i = 0
    const typing = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1))
        i++
      } else {
        clearInterval(typing)
      }
    }, 40)

    return () => clearInterval(typing)
  }, [text])

  return (
    <p className={className}>
      {displayText}
      {displayText.length < text.length && (
        <span className="inline-block w-0.5 h-5 bg-emerald-500 ml-1 animate-pulse"></span>
      )}
    </p>
  )
}

// CountUp Component
function CountUp({
  end,
  duration = 2,
  suffix = "",
  className = "",
}: {
  end: number
  duration?: number
  suffix?: string
  className?: string
}) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!isInView) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        },
        { threshold: 0.1 },
      )

      const currentElement = document.getElementById(`count-${end}`)
      if (currentElement) {
        observer.observe(currentElement)
      }

      return () => {
        if (currentElement) {
          observer.unobserve(currentElement)
        }
      }
    }

    if (isInView) {
      const step = Math.ceil(end / (duration * 60))
      const interval = setInterval(() => {
        if (countRef.current < end) {
          const nextCount = Math.min(countRef.current + step, end)
          countRef.current = nextCount
          setCount(nextCount)
        } else {
          clearInterval(interval)
        }
      }, 1000 / 60)

      return () => clearInterval(interval)
    }
  }, [end, duration, isInView])

  return (
    <span id={`count-${end}`} className={className}>
      {count}
      {suffix}
    </span>
  )
}

// Data for history timeline
const historyTimeline = [
  {
    year: "384-322 SM",
    title: "Era Aristoteles",
    description:
      "Aristoteles mengklasifikasikan hewan berdasarkan habitat (air, darat, udara) dan karakteristik darah (berdarah atau tidak berdarah).",
    achievement: "Menciptakan sistem klasifikasi pertama yang sistematis untuk organisme hidup.",
    icon: <BookOpen size={20} className="text-emerald-600" />,
  },
  {
    year: "1735",
    title: "Carl Linnaeus",
    description:
      'Menerbitkan "Systema Naturae" dan memperkenalkan sistem penamaan binomial serta hierarki klasifikasi.',
    achievement: "Menciptakan sistem penamaan binomial yang masih digunakan hingga saat ini.",
    icon: <Fingerprint size={20} className="text-emerald-600" />,
  },
  {
    year: "1859",
    title: "Charles Darwin",
    description:
      'Menerbitkan "On the Origin of Species", memberikan dasar teoretis untuk klasifikasi berdasarkan hubungan evolusioner.',
    achievement: "Mengubah pemahaman tentang hubungan antar spesies melalui teori evolusi.",
    icon: <TreePine size={20} className="text-emerald-600" />,
  },
  {
    year: "1950-an",
    title: "Era Molekuler",
    description: "Penemuan struktur DNA oleh Watson dan Crick membuka jalan bagi taksonomi molekuler.",
    achievement: "Memungkinkan klasifikasi berdasarkan kesamaan genetik, bukan hanya karakteristik fisik.",
    icon: <Dna size={20} className="text-emerald-600" />,
  },
  {
    year: "2000-an",
    title: "Era Genomik",
    description: "Sekuensing genom lengkap dan teknologi -omics memungkinkan pendekatan komprehensif dalam taksonomi.",
    achievement: "Memungkinkan rekonstruksi pohon filogenetik yang lebih akurat dan detail.",
    icon: <Microscope size={20} className="text-emerald-600" />,
  },
]

// Data for taxonomy levels
const taxonomyLevels = [
  {
    name: "Kingdom",
    icon: <TreePine size={24} className="text-emerald-600" />,
    description:
      "Tingkatan tertinggi dalam klasifikasi, membagi semua makhluk hidup menjadi beberapa kelompok besar berdasarkan karakteristik fundamental.",
    example: "Animalia - mencakup semua hewan, termasuk manusia.",
  },
  {
    name: "Phylum",
    icon: <Layers size={24} className="text-emerald-600" />,
    description:
      "Subdivisi dari Kingdom, mengelompokkan organisme berdasarkan rencana tubuh dan karakteristik struktural utama.",
    example: "Chordata - hewan dengan notochord (tali saraf dorsal).",
  },
  {
    name: "Class",
    icon: <Layers size={24} className="text-emerald-600" />,
    description: "Subdivisi dari Phylum, mengelompokkan organisme dengan karakteristik yang lebih spesifik.",
    example: "Mammalia - hewan yang menyusui anaknya.",
  },
  {
    name: "Order",
    icon: <Layers size={24} className="text-emerald-600" />,
    description: "Subdivisi dari Class, mengelompokkan organisme berdasarkan karakteristik yang lebih detail.",
    example: "Carnivora - mamalia pemakan daging.",
  },
  {
    name: "Family",
    icon: <Layers size={24} className="text-emerald-600" />,
    description: "Subdivisi dari Order, mengelompokkan genus yang berkerabat dekat.",
    example: "Felidae - keluarga kucing.",
  },
  {
    name: "Genus",
    icon: <Layers size={24} className="text-emerald-600" />,
    description: "Kelompok spesies yang berkerabat sangat dekat, berbagi banyak karakteristik.",
    example: "Panthera - genus yang mencakup harimau, singa, jaguar, dan macan tutul.",
  },
  {
    name: "Species",
    icon: <Layers size={24} className="text-emerald-600" />,
    description:
      "Tingkatan paling spesifik, mendefinisikan kelompok organisme yang dapat berkembang biak dan menghasilkan keturunan yang fertil.",
    example: "Panthera tigris - harimau.",
  },
]

// Data for classification methods
const classificationMethods = [
  {
    id: "morphology",
    name: "Morfologi",
    shortDescription:
      "Metode klasifikasi tradisional yang didasarkan pada karakteristik fisik dan struktural organisme.",
    description:
      "Metode klasifikasi tradisional yang didasarkan pada karakteristik fisik dan struktural organisme, seperti bentuk tubuh, ukuran, dan fitur anatomi. Ini adalah pendekatan tertua dalam taksonomi.",
    since: "Digunakan sejak zaman Aristoteles (384-322 SM)",
    tags: ["Tradisional", "Visual", "Anatomi"],
    points: [
      "Mengamati dan membandingkan struktur fisik organisme secara detail",
      "Mengidentifikasi homologi (struktur dengan asal evolusioner yang sama) dan analogi (struktur dengan fungsi yang sama tetapi asal yang berbeda)",
      "Mempelajari pola pertumbuhan dan perkembangan organisme",
      "Menganalisis karakteristik reproduksi dan siklus hidup",
    ],
    advantages:
      "Dapat dilakukan tanpa peralatan canggih, memungkinkan klasifikasi di lapangan, dan memberikan pemahaman mendalam tentang adaptasi fisik organisme terhadap lingkungannya.",
    limitations:
      "Dapat menyebabkan kesalahan klasifikasi karena konvergensi evolusioner (organisme yang tidak berkerabat dekat mengembangkan fitur serupa) dan tidak selalu mencerminkan hubungan evolusioner yang sebenarnya.",
    example:
      "Harimau diklasifikasikan sebagai Felidae berdasarkan karakteristik morfologi seperti cakar yang dapat ditarik, gigi taring yang panjang, dan struktur tengkorak yang khas untuk predator.",
    image: "/placeholder.svg?height=400&width=600",
    imageDesc: "Perbandingan struktur tengkorak berbagai spesies kucing",
    accuracy: 75,
    accessibility: 95,
    costEfficiency: 90,
    cost: 1,
    mainAdvantage: "Dapat dilakukan di lapangan tanpa peralatan khusus",
    whenToUse:
      "Ideal untuk identifikasi awal di lapangan, studi taksonomi dasar, dan ketika akses ke teknologi terbatas.",
  },
  {
    id: "genetics",
    name: "Genetika dan DNA",
    shortDescription:
      "Metode modern yang menggunakan analisis DNA dan sekuensing genom untuk menentukan hubungan evolusioner.",
    description:
      "Metode modern yang menggunakan analisis DNA dan sekuensing genom untuk menentukan hubungan evolusioner dan klasifikasi yang lebih akurat. Pendekatan ini telah merevolusi taksonomi dalam beberapa dekade terakhir.",
    since: "Berkembang pesat sejak 1950-an",
    tags: ["Modern", "Molekuler", "Presisi Tinggi"],
    points: [
      "Membandingkan sekuens DNA antar organisme untuk menentukan kekerabatan",
      "Menganalisis gen-gen homolog dan variasi genetik dalam populasi",
      "Mempelajari mutasi dan perubahan genetik sepanjang waktu",
      "Menggunakan teknik molekuler seperti PCR, sekuensing DNA, dan analisis filogenetik",
    ],
    advantages:
      "Memberikan hasil yang sangat akurat, dapat mendeteksi hubungan evolusioner yang tidak terlihat melalui morfologi, dan memungkinkan klasifikasi organisme yang sulit dibedakan secara visual.",
    limitations:
      "Memerlukan peralatan laboratorium yang mahal, keahlian teknis khusus, dan sampel DNA yang berkualitas baik. Tidak selalu tersedia untuk penelitian lapangan.",
    example:
      "Analisis DNA mitokondrial telah membantu ilmuwan mengidentifikasi hubungan evolusioner antara berbagai spesies kucing besar dan menentukan kapan mereka berpisah dari nenek moyang yang sama.",
    image: "/placeholder.svg?height=400&width=600",
    imageDesc: "Visualisasi perbandingan sekuens DNA berbagai spesies kucing",
    accuracy: 98,
    accessibility: 60,
    costEfficiency: 40,
    cost: 5,
    mainAdvantage: "Akurasi sangat tinggi dalam menentukan hubungan evolusioner",
    whenToUse:
      "Ideal untuk penelitian taksonomi tingkat lanjut, penyelesaian hubungan filogenetik yang kompleks, dan identifikasi spesies kriptik (spesies yang secara morfologi sangat mirip).",
  },
  {
    id: "phylogenetic",
    name: "Filogenetik",
    shortDescription:
      "Pendekatan yang berfokus pada hubungan evolusioner antara organisme menggunakan pohon kehidupan.",
    description:
      'Pendekatan yang berfokus pada hubungan evolusioner antara organisme, menggunakan "pohon kehidupan" untuk menggambarkan bagaimana spesies berevolusi dari nenek moyang yang sama. Metode ini menggabungkan data morfologi, genetik, dan fosil.',
    since: "Berkembang sejak teori evolusi Darwin (1859)",
    tags: ["Evolusi", "Komprehensif", "Historis"],
    points: [
      "Membangun pohon filogenetik berdasarkan data morfologi dan molekuler",
      "Mengidentifikasi karakter yang diturunkan dari nenek moyang yang sama (synapomorphy)",
      "Mempelajari divergensi evolusioner dan waktu pemisahan spesies",
      "Menganalisis fosil dan catatan geologis untuk mengkalibrasi waktu evolusi",
    ],
    advantages:
      "Memberikan gambaran komprehensif tentang sejarah evolusi dan hubungan antar organisme, menggabungkan berbagai jenis data, dan membantu memahami proses evolusi.",
    limitations:
      "Dapat menjadi kompleks dan memerlukan analisis statistik yang rumit. Hasil dapat bervariasi tergantung pada metode analisis dan data yang digunakan.",
    example:
      "Studi filogenetik menunjukkan bahwa harimau dan singa berpisah dari nenek moyang yang sama sekitar 3.9 juta tahun yang lalu, sementara jaguar berpisah lebih awal.",
    image: "/placeholder.svg?height=400&width=600",
    imageDesc: "Pohon filogenetik menunjukkan hubungan evolusioner antar spesies kucing",
    accuracy: 90,
    accessibility: 70,
    costEfficiency: 65,
    cost: 3,
    mainAdvantage: "Memberikan gambaran komprehensif tentang hubungan evolusioner",
    whenToUse:
      "Ideal untuk studi evolusi, rekonstruksi sejarah kehidupan, dan memahami pola diversifikasi spesies sepanjang waktu geologis.",
  },
  {
    id: "behavioral",
    name: "Perilaku dan Ekologi",
    shortDescription: "Metode yang mempertimbangkan perilaku, habitat, dan interaksi ekologis organisme.",
    description:
      "Metode yang mempertimbangkan perilaku, habitat, dan interaksi ekologis organisme sebagai faktor dalam klasifikasi. Pendekatan ini melengkapi metode klasifikasi lainnya dengan memberikan konteks ekologis.",
    since: "Berkembang pada abad ke-20",
    tags: ["Ekologi", "Perilaku", "Interaksi"],
    points: [
      "Mengamati pola perilaku, komunikasi, dan interaksi sosial",
      "Mempelajari preferensi habitat, adaptasi lingkungan, dan niche ekologis",
      "Menganalisis interaksi dengan organisme lain dalam ekosistem",
      "Mempertimbangkan peran fungsional dalam komunitas biologis",
    ],
    advantages:
      "Memberikan wawasan tentang adaptasi fungsional dan peran ekologis organisme, membantu memahami bagaimana spesies berinteraksi dengan lingkungannya, dan dapat mengungkapkan perbedaan penting antar spesies yang secara morfologis serupa.",
    limitations:
      "Sulit untuk mengukur secara objektif, memerlukan observasi jangka panjang, dan perilaku dapat bervariasi dalam satu spesies tergantung pada kondisi lingkungan.",
    example:
      "Pola berburu dan perilaku sosial harimau berbeda dari kucing besar lainnya. Harimau cenderung soliter dan berburu sendiri, sementara singa hidup dalam kelompok dan berburu secara kolaboratif.",
    image: "/placeholder.svg?height=400&width=600",
    imageDesc: "Dokumentasi perilaku berburu harimau di habitat alami",
    accuracy: 80,
    accessibility: 85,
    costEfficiency: 75,
    cost: 2,
    mainAdvantage: "Memberikan konteks ekologis yang penting untuk pemahaman spesies",
    whenToUse: "Ideal untuk studi ekologi, konservasi, dan memahami adaptasi spesies terhadap lingkungannya.",
  },
]

// Data for example organisms
const exampleOrganisms = [
  {
    id: "tiger",
    name: "Harimau",
    scientificName: "Panthera tigris",
    family: "Felidae",
    genus: "Panthera",
    habitat: "Hutan, padang rumput, rawa",
    conservationStatus: "Terancam punah",
    distribution: "Asia",
    size: "2.5-3.9 m (panjang)",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Harimau adalah spesies kucing terbesar yang masih hidup dan anggota genus Panthera. Harimau dikenal dengan pola belang oranye dengan garis-garis hitam pada bulu mereka.",
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Carnivora",
      family: "Felidae",
      genus: "Panthera",
      species: "P. tigris",
    },
  },
  {
    id: "lion",
    name: "Singa",
    scientificName: "Panthera leo",
    family: "Felidae",
    genus: "Panthera",
    habitat: "Savana, padang rumput",
    conservationStatus: "Rentan",
    distribution: "Afrika, India",
    size: "2.4-3.3 m (panjang)",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Singa adalah spesies kucing besar yang dikenal dengan surai jantan yang khas dan perilaku sosial mereka. Mereka adalah satu-satunya kucing besar yang hidup dalam kelompok yang disebut pride.",
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Carnivora",
      family: "Felidae",
      genus: "Panthera",
      species: "P. leo",
    },
  },
  {
    id: "leopard",
    name: "Macan Tutul",
    scientificName: "Panthera pardus",
    family: "Felidae",
    genus: "Panthera",
    habitat: "Hutan, savana, gurun",
    conservationStatus: "Rentan",
    distribution: "Afrika, Asia",
    size: "1.9-2.4 m (panjang)",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Macan tutul adalah kucing besar yang dikenal dengan bulu berbintik-bintik dan kemampuan memanjat pohon yang luar biasa. Mereka adalah predator yang sangat adaptif dan dapat hidup di berbagai habitat.",
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Chordata",
      class: "Mammalia",
      order: "Carnivora",
      family: "Felidae",
      genus: "Panthera",
      species: "P. pardus",
    },
  },
]

// Data for binomial nomenclature rules
const binomialRules = [
  {
    title: "Dua Kata Latin",
    description: "Nama ilmiah terdiri dari dua kata Latin: genus (dikapitalisasi) diikuti oleh spesies (huruf kecil).",
  },
  {
    title: "Dicetak Miring",
    description: "Nama ilmiah selalu dicetak miring atau digarisbawahi dalam teks untuk membedakannya dari teks biasa.",
  },
  {
    title: "Universalitas",
    description:
      "Nama ilmiah bersifat universal dan digunakan oleh ilmuwan di seluruh dunia, terlepas dari bahasa lokal mereka.",
  },
  {
    title: "Prioritas",
    description:
      "Jika spesies memiliki beberapa nama ilmiah, nama yang diberikan pertama kali (yang valid) memiliki prioritas.",
  },
]

// Data for FAQ items
const faqItems = [
  {
    id: "faq1",
    question: "Apa perbedaan antara taksonomi dan sistematika?",
    answer:
      "Taksonomi adalah ilmu yang mempelajari tentang klasifikasi organisme, sementara sistematika adalah studi yang lebih luas tentang keanekaragaman organisme dan hubungan evolusionernya. Sistematika mencakup taksonomi tetapi juga melibatkan studi tentang proses evolusi dan filogeni.",
  },
  {
    id: "faq2",
    question: "Mengapa taksonomi penting dalam konservasi?",
    answer:
      "Taksonomi sangat penting dalam konservasi karena membantu mengidentifikasi dan mengklasifikasikan spesies yang terancam punah. Tanpa pemahaman taksonomi yang baik, sulit untuk menentukan spesies mana yang membutuhkan upaya konservasi dan bagaimana melindungi keanekaragaman hayati secara efektif.",
  },
  {
    id: "faq3",
    question: "Bagaimana teknologi modern mengubah taksonomi?",
    answer:
      "Teknologi modern seperti sekuensing DNA, genomik, dan bioinformatika telah merevolusi taksonomi dengan memungkinkan klasifikasi berdasarkan data molekuler. Ini telah menghasilkan revisi besar dalam klasifikasi tradisional dan pemahaman yang lebih baik tentang hubungan evolusioner antar organisme.",
  },
  {
    id: "faq4",
    question: "Apa itu spesies kriptik dalam taksonomi?",
    answer:
      "Spesies kriptik adalah spesies yang secara morfologi sangat mirip sehingga sulit dibedakan, tetapi secara genetik berbeda dan tidak dapat menghasilkan keturunan yang fertil jika dikawinkan. Spesies kriptik sering diidentifikasi melalui analisis DNA dan merupakan tantangan dalam taksonomi tradisional.",
  },
  {
    id: "faq5",
    question: "Bagaimana cara menjadi seorang taksonom?",
    answer:
      "Untuk menjadi seorang taksonom, Anda biasanya perlu menempuh pendidikan formal dalam biologi, ekologi, atau bidang terkait, idealnya hingga tingkat pascasarjana. Spesialisasi dalam kelompok organisme tertentu dan pelatihan dalam teknik identifikasi, baik morfologi maupun molekuler, juga penting. Pengalaman lapangan dan laboratorium sangat berharga dalam karir ini.",
  },
]

// Data for quiz questions
const quizQuestions = [
  {
    question: 'Siapakah yang dikenal sebagai "Bapak Taksonomi Modern"?',
    options: ["Charles Darwin", "Aristoteles", "Carl Linnaeus", "Gregor Mendel"],
    correctAnswer: 2,
  },
  {
    question: "Tingkatan taksonomi manakah yang paling spesifik?",
    options: ["Kingdom", "Genus", "Family", "Species"],
    correctAnswer: 3,
  },
  {
    question: "Apa tujuan dari sistem penamaan binomial?",
    options: [
      "Untuk memberikan nama yang unik dan universal untuk setiap organisme",
      "Untuk mengklasifikasikan organisme berdasarkan karakteristik fisik",
      "Untuk menunjukkan hubungan evolusioner antara organisme",
      "Untuk mempermudah identifikasi organisme di lapangan",
    ],
    correctAnswer: 0,
  },
]
