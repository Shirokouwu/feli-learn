"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  History,
  Layers,
  Lightbulb,
  List,
  Microscope,
  TreePine,
  ChevronDown,
  Check,
  Award,
  Brain,
  Zap,
  Play,
  PauseCircle,
  Dna,
  Leaf,
  AlertTriangle,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TaxonomyLearningPage() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showTaxonomyTree, setShowTaxonomyTree] = useState(false)
  const [activeRank, setActiveRank] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeClassMethod, setActiveClassMethod] = useState("morphology")

  // Refs for each section to track visibility
  const sectionRefs = {
    introduction: useRef<HTMLElement>(null),
    history: useRef<HTMLElement>(null),
    taxonomicRanks: useRef<HTMLElement>(null),
    classification: useRef<HTMLElement>(null),
    example: useRef<HTMLElement>(null),
    importance: useRef<HTMLElement>(null),
  }

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)

      // Determine which section is currently in view
      Object.entries(sectionRefs).forEach(([section, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            setActiveSection(section)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle video play/pause
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  // Handle quiz submission
  const handleQuizSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length === quizQuestions.length) {
      setQuizCompleted(true)
    }
  }

  // Calculate quiz score
  const calculateScore = () => {
    let correctAnswers = 0
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })
    return (correctAnswers / quizQuestions.length) * 100
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs].current
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative">
      {/* Fixed Navigation Progress */}
      <div className="fixed top-16 left-0 w-full z-40 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Modul Pembelajaran
              </Badge>
              <h2 className="text-lg font-medium hidden sm:block">Memahami Taksonomi</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                {Object.entries(sectionRefs).map(([key, _]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    size="sm"
                    className={`text-sm ${activeSection === key ? "text-emerald-600 font-medium" : "text-gray-500"}`}
                    onClick={() => scrollToSection(key)}
                  >
                    {sectionLabels[key as keyof typeof sectionLabels]}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-emerald-600 border-emerald-200"
                onClick={() => setShowQuiz(true)}
              >
                <Zap className="mr-1 h-4 w-4" /> Kuis
              </Button>
            </div>
          </div>
          <Progress value={scrollProgress} className="h-1" />
        </div>
      </div>

      {/* Hero Section with 3D Animation */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/70 to-white/30" />
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-no-repeat bg-cover bg-center opacity-20" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors">
              Modul Pembelajaran Interaktif
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Memahami{" "}
              <span className="text-emerald-600 relative">
                Taksonomi
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="#059669" strokeWidth="2" />
                </svg>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
              Menjelajahi sistem klasifikasi ilmiah yang mengatur keanekaragaman hayati di planet kita
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-lg font-medium flex items-center gap-2 transition-all"
                onClick={() => scrollToSection("introduction")}
              >
                Mulai Belajar <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-100 text-emerald-600 border border-emerald-200 px-6 py-6 rounded-lg font-medium flex items-center gap-2 transition-all"
                onClick={() => setShowTaxonomyTree(true)}
              >
                Lihat Pohon Taksonomi <Layers size={18} />
              </Button>
            </div>
          </motion.div>

          {/* Floating Elements Animation */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                ease: "easeInOut",
              }}
              className="absolute top-10 left-[15%]"
            >
              <div className="bg-emerald-100 p-3 rounded-full shadow-lg">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -8, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 7,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-20 right-[20%]"
            >
              <div className="bg-emerald-100 p-3 rounded-full shadow-lg">
                <Dna className="h-8 w-8 text-emerald-600" />
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, 3, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 5,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-20 left-[30%]"
            >
              <div className="bg-emerald-100 p-3 rounded-full shadow-lg">
                <Microscope className="h-8 w-8 text-emerald-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section with Video */}
      <section id="introduction" ref={sectionRefs.introduction} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <BookOpen size={20} />
                <h2 className="text-lg font-medium">Pengantar</h2>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Apa itu Taksonomi?</h3>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Taksonomi adalah ilmu yang mempelajari tentang klasifikasi makhluk hidup berdasarkan persamaan dan
                  perbedaan karakteristiknya. Kata "taksonomi" berasal dari bahasa Yunani "taxis" yang berarti
                  pengaturan dan "nomos" yang berarti hukum.
                </p>
                <p className="mt-4">
                  Sistem taksonomi modern yang kita gunakan saat ini didasarkan pada karya Carl Linnaeus, seorang ahli
                  botani Swedia yang hidup pada abad ke-18. Linnaeus memperkenalkan sistem penamaan binomial dan
                  hierarki klasifikasi yang menjadi dasar taksonomi modern.
                </p>
                <p className="mt-4">
                  Taksonomi membantu ilmuwan mengorganisir dan memahami keanekaragaman hayati yang luar biasa di Bumi,
                  dengan memungkinkan mereka mengelompokkan organisme berdasarkan hubungan evolusioner dan karakteristik
                  bersama.
                </p>
              </div>

              {/* Interactive Fact Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-emerald-50 p-4 rounded-lg border border-emerald-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                      <Award size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-emerald-800 mb-1">Tahukah Kamu?</h4>
                      <p className="text-sm text-gray-600">
                        Ada lebih dari 1.8 juta spesies yang telah diidentifikasi dan diklasifikasikan, tetapi
                        diperkirakan masih ada 5-30 juta spesies yang belum ditemukan!
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-emerald-50 p-4 rounded-lg border border-emerald-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                      <Brain size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-emerald-800 mb-1">Fakta Menarik</h4>
                      <p className="text-sm text-gray-600">
                        Nama ilmiah selalu ditulis dalam bahasa Latin atau dilatinkan, dan dicetak miring untuk
                        membedakannya dari teks biasa.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl relative group">
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button variant="outline" size="lg" className="bg-white/90 hover:bg-white" onClick={toggleVideo}>
                    {isVideoPlaying ? <PauseCircle className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isVideoPlaying ? "Pause Video" : "Play Video"}
                  </Button>
                </div>
                <video
                  ref={videoRef}
                  poster="/placeholder.svg?height=600&width=800"
                  className="w-full h-auto object-cover"
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src="https://example.com/taxonomy-intro.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-emerald-50 p-4 rounded-lg border border-emerald-100 shadow-lg max-w-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                    <Lightbulb size={20} className="text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Taksonomi membantu kita memahami hubungan evolusioner antara berbagai spesies dan mengorganisir
                    pengetahuan biologis.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* History Section with Timeline */}
      <section id="history" ref={sectionRefs.history} className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row-reverse gap-12 items-center"
          >
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                <History size={20} />
                <h2 className="text-lg font-medium">Sejarah</h2>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Evolusi Sistem Taksonomi</h3>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p>
                  Sejarah taksonomi dimulai jauh sebelum ilmu pengetahuan modern. Aristoteles, filsuf Yunani, adalah
                  salah satu orang pertama yang mencoba mengklasifikasikan hewan berdasarkan karakteristik fisik mereka
                  pada abad ke-4 SM.
                </p>
                <p className="mt-4">
                  Namun, taksonomi modern dimulai dengan Carl Linnaeus yang pada tahun 1735 menerbitkan "Systema
                  Naturae". Linnaeus memperkenalkan sistem penamaan binomial (genus dan spesies) dan hierarki
                  klasifikasi yang menjadi dasar taksonomi hingga saat ini.
                </p>
                <p className="mt-4">
                  Seiring waktu, sistem taksonomi terus berkembang. Pada abad ke-20, kemajuan dalam genetika dan biologi
                  molekuler telah menyempurnakan sistem klasifikasi, memungkinkan ilmuwan untuk mengklasifikasikan
                  organisme berdasarkan hubungan evolusioner yang lebih akurat.
                </p>
              </div>
            </div>

            <div className="md:w-1/2">
              {/* Interactive Timeline */}
              <div className="relative pl-8 border-l-2 border-emerald-200">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="mb-8 relative"
                  >
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-emerald-600 border-4 border-emerald-100" />
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                          {event.year}
                        </Badge>
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Taxonomic Ranks Section with Interactive Cards */}
      <section id="taxonomic-ranks" ref={sectionRefs.taxonomicRanks} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
              <Layers size={20} />
              <h2 className="text-lg font-medium">Tingkatan Taksonomi</h2>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Hierarki Klasifikasi</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistem taksonomi modern menggunakan hierarki tingkatan untuk mengklasifikasikan semua makhluk hidup, dari
              yang paling umum hingga yang paling spesifik.
            </p>
          </motion.div>

          {/* Interactive Taxonomy Pyramid */}
          <div className="mb-16 relative h-[400px] hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 800 400" className="w-full h-full">
                <defs>
                  <linearGradient id="pyramidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Pyramid Levels */}
                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0 }}
                  viewport={{ once: true }}
                  d="M400,50 L600,100 L200,100 Z"
                  fill="url(#pyramidGradient)"
                  stroke="#047857"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveRank("Kingdom")}
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  d="M200,100 L600,100 L550,150 L250,150 Z"
                  fill="url(#pyramidGradient)"
                  stroke="#047857"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveRank("Phylum")}
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  d="M250,150 L550,150 L500,200 L300,200 Z"
                  fill="url(#pyramidGradient)"
                  stroke="#047857"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveRank("Class")}
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  d="M300,200 L500,200 L450,250 L350,250 Z"
                  fill="url(#pyramidGradient)"
                  stroke="#047857"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveRank("Order")}
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  d="M350,250 L450,250 L425,300 L375,300 Z"
                  fill="url(#pyramidGradient)"
                  stroke="#047857"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveRank("Family")}
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  d="M375,300 L425,300 L415,325 L385,325 Z"
                  fill="url(#pyramidGradient)"
                  stroke="#047857"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveRank("Genus")}
                />

                <motion.path
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                  d="M385,325 L415,325 L405,350 L395,350 Z"
                  fill="url(#pyramidGradient)"
                  stroke="#047857"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveRank("Species")}
                />

                {/* Labels */}
                <text x="400" y="85" textAnchor="middle" fill="#fff" fontWeight="bold">
                  Kingdom
                </text>
                <text x="400" y="135" textAnchor="middle" fill="#fff" fontWeight="bold">
                  Phylum
                </text>
                <text x="400" y="185" textAnchor="middle" fill="#fff" fontWeight="bold">
                  Class
                </text>
                <text x="400" y="235" textAnchor="middle" fill="#fff" fontWeight="bold">
                  Order
                </text>
                <text x="400" y="285" textAnchor="middle" fill="#fff" fontWeight="bold">
                  Family
                </text>
                <text x="400" y="315" textAnchor="middle" fill="#fff" fontWeight="bold">
                  Genus
                </text>
                <text x="400" y="340" textAnchor="middle" fill="#fff" fontWeight="bold">
                  Species
                </text>
              </svg>
            </div>

            {/* Tooltip for active rank */}
            <AnimatePresence>
              {activeRank && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute top-0 right-0 bg-white p-4 rounded-lg shadow-lg border border-emerald-100 max-w-xs"
                >
                  <h4 className="font-bold text-emerald-700 mb-2">{activeRank}</h4>
                  <p className="text-sm text-gray-600">
                    {taxonomicRanks.find((r) => r.name === activeRank)?.description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-emerald-600">Contoh:</p>
                    <p className="text-sm text-gray-700">
                      {taxonomicRanks.find((r) => r.name === activeRank)?.example}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => setActiveRank(null)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Taxonomic Rank Cards for Mobile and Tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {taxonomicRanks.map((rank, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 taxonomy-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full">{rank.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900">{rank.name}</h4>
                </div>
                <p className="text-gray-600 mb-4">{rank.description}</p>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h5 className="font-medium text-emerald-800 mb-2">Contoh:</h5>
                  <p className="text-gray-700">{rank.example}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Classification Works - Enhanced Interactive Section */}
      <section id="classification" ref={sectionRefs.classification} className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
              <Microscope size={20} />
              <h2 className="text-lg font-medium">Proses Klasifikasi</h2>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Bagaimana Taksonomi Bekerja</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proses klasifikasi taksonomi melibatkan beberapa metode dan kriteria untuk menentukan di mana suatu
              organisme ditempatkan dalam sistem klasifikasi.
            </p>
          </motion.div>

          {/* Interactive Classification Explorer */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left sidebar with method selection */}
              <div className="bg-emerald-50 p-6 border-r border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-6 flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-emerald-600" />
                  Metode Klasifikasi
                </h4>

                <div className="space-y-2">
                  {classificationMethods.map((method, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 5 }}
                      className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 ${
                        activeClassMethod === method.id
                          ? "bg-white shadow-md border border-emerald-100"
                          : "hover:bg-white/50"
                      }`}
                      onClick={() => setActiveClassMethod(method.id)}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          activeClassMethod === method.id ? "bg-emerald-100" : "bg-emerald-100/50"
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            activeClassMethod === method.id ? "text-emerald-700" : "text-gray-700"
                          }`}
                        >
                          {method.name}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">{method.shortDesc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Main content area */}
              <div className="col-span-4 p-0">
                <AnimatePresence mode="wait">
                  {classificationMethods.map(
                    (method) =>
                      activeClassMethod === method.id && (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="h-full"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                            {/* Method description */}
                            <div className="p-8 border-r border-gray-100">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="bg-emerald-100 p-3 rounded-full">{method.icon}</div>
                                <div>
                                  <h4 className="text-2xl font-bold text-gray-900">{method.name}</h4>
                                  <p className="text-sm text-emerald-600">{method.since}</p>
                                </div>
                              </div>

                              <div className="prose prose-emerald max-w-none text-gray-600">
                                <p className="text-lg">{method.description}</p>

                                <h5 className="text-emerald-700 font-medium mt-6 mb-3">Karakteristik Utama:</h5>
                                <ul className="space-y-3">
                                  {method.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <div className="bg-emerald-100 p-1 rounded-full mt-1 shrink-0">
                                        <Check className="h-3 w-3 text-emerald-600" />
                                      </div>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>

                                <div className="mt-6 bg-emerald-50 p-4 rounded-lg">
                                  <h5 className="font-medium text-emerald-800 mb-2 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4 text-emerald-600" />
                                    Kelebihan:
                                  </h5>
                                  <p className="text-sm">{method.advantages}</p>
                                </div>

                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                  <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                                    Keterbatasan:
                                  </h5>
                                  <p className="text-sm">{method.limitations}</p>
                                </div>
                              </div>
                            </div>

                            {/* Visual examples */}
                            <div className="bg-gray-50 p-8 flex flex-col">
                              <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-emerald-600" />
                                Contoh Penerapan
                              </h5>

                              <div className="relative rounded-xl overflow-hidden shadow-md mb-6 aspect-video">
                                <Image
                                  src={method.image || "/placeholder.svg?height=400&width=600"}
                                  alt={method.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                                  <p className="text-white font-medium">{method.imageTitle}</p>
                                  <p className="text-white/80 text-sm">{method.imageDesc}</p>
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                <h5 className="font-medium text-emerald-800 mb-3">
                                  Contoh Kasus: {method.exampleTitle}
                                </h5>
                                <p className="text-sm text-gray-700">{method.example}</p>
                              </div>

                              {/* Interactive comparison slider */}
                              <div className="mt-auto">
                                <h5 className="font-medium text-gray-900 mb-3">Perbandingan dengan Metode Lain:</h5>
                                <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                                    style={{ width: `${method.accuracy}%` }}
                                  ></div>
                                  <div className="absolute inset-0 flex items-center justify-between px-4">
                                    <span className="text-xs font-medium text-white">Akurasi</span>
                                    <span className="text-xs font-medium text-gray-700">{method.accuracy}%</span>
                                  </div>
                                </div>

                                <div className="mt-2 relative h-12 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                                    style={{ width: `${method.accessibility}%` }}
                                  ></div>
                                  <div className="absolute inset-0 flex items-center justify-between px-4">
                                    <span className="text-xs font-medium text-white">Aksesibilitas</span>
                                    <span className="text-xs font-medium text-gray-700">{method.accessibility}%</span>
                                  </div>
                                </div>

                                <div className="mt-2 relative h-12 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                                    style={{ width: `${method.costEfficiency}%` }}
                                  ></div>
                                  <div className="absolute inset-0 flex items-center justify-between px-4">
                                    <span className="text-xs font-medium text-white">Efisiensi Biaya</span>
                                    <span className="text-xs font-medium text-gray-700">{method.costEfficiency}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Interactive Timeline of Classification Evolution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 overflow-hidden"
          >
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              Evolusi Metode Klasifikasi
            </h4>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-emerald-200 transform md:translate-x-px"></div>

              <div className="space-y-12">
                {classificationEvolution.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } gap-8 items-center`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-emerald-100 transform -translate-x-1.5 md:-translate-x-2"></div>

                    {/* Year marker */}
                    <div className="md:w-1/2 flex md:justify-end">
                      <div
                        className={`bg-emerald-100 px-3 py-1 rounded-full text-sm font-medium text-emerald-800 ${
                          index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                        }`}
                      >
                        {item.year}
                      </div>
                    </div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <h5 className="font-medium text-emerald-700 mb-2">{item.title}</h5>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Example Classification */}
      <section id="example" ref={sectionRefs.example} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
              <List size={20} />
              <h2 className="text-lg font-medium">Contoh Klasifikasi</h2>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Klasifikasi Harimau (Panthera tigris)</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mari kita lihat bagaimana harimau diklasifikasikan dalam sistem taksonomi modern.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl shadow-lg border border-emerald-100"
          >
            <div className="absolute top-0 left-0 w-1/3 h-full hidden md:block">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Harimau"
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:hidden w-full h-48">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Harimau"
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:ml-[33%] p-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tigerClassification.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-gray-100 pb-4"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h4 className="text-lg font-medium text-emerald-700 cursor-help flex items-center">
                            {item.rank}
                            <span className="ml-1 text-gray-400 text-xs">(?)</span>
                          </h4>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm max-w-xs">
                            {taxonomicRanks.find((r) => r.name === item.rank)?.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-emerald-700 mb-2">Fakta Menarik:</h4>
                <p className="text-gray-600">
                  Harimau adalah anggota genus Panthera, yang juga mencakup singa, jaguar, dan macan tutul. Semua
                  anggota genus ini memiliki kemampuan untuk mengaum, yang membedakan mereka dari kucing kecil.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Importance of Taxonomy */}
      <section id="importance" ref={sectionRefs.importance} className="py-16 px-4 sm:px-6 lg:px-8 bg-emerald-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
              <Lightbulb size={20} />
              <h2 className="text-lg font-medium">Pentingnya Taksonomi</h2>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Mengapa Taksonomi Penting?</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Taksonomi memiliki peran penting dalam berbagai bidang ilmu dan kehidupan sehari-hari.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {importancePoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white rounded-xl shadow-md p-6 border border-emerald-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full">{point.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900">{point.title}</h4>
                </div>
                <p className="text-gray-600">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-emerald-600">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Siap untuk Menjelajahi Lebih Jauh?</h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Pelajari lebih lanjut tentang keluarga Felidae dan bagaimana taksonomi membantu kita memahami
              keanekaragaman kucing di seluruh dunia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/database-explorer"
                className="bg-white hover:bg-gray-100 text-emerald-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                Jelajahi Database Felidae <ArrowRight size={18} />
              </Link>
              <Link
                href="/scanner"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                Coba Scanner AI <Microscope size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Kuis Taksonomi</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => {
                      setShowQuiz(false)
                      setQuizCompleted(false)
                      setSelectedAnswers({})
                    }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {!quizCompleted ? (
                  <>
                    <div className="space-y-6">
                      {quizQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="border border-gray-100 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {qIndex + 1}. {question.question}
                          </h4>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div
                                key={oIndex}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  selectedAnswers[qIndex] === oIndex
                                    ? "bg-emerald-50 border-emerald-200"
                                    : "border-gray-100 hover:bg-gray-50"
                                }`}
                                onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex })}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                      selectedAnswers[qIndex] === oIndex
                                        ? "border-emerald-500 bg-emerald-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {selectedAnswers[qIndex] === oIndex && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <span className="text-gray-700">{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(selectedAnswers).length !== quizQuestions.length}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Periksa Jawaban
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="mb-4 inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100">
                      <Award className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Hasil Kuis</h3>
                    <p className="text-gray-600 mb-6">Skor Anda: {calculateScore()}%</p>

                    <div className="space-y-4 text-left mb-6">
                      {quizQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="border border-gray-100 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {qIndex + 1}. {question.question}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                selectedAnswers[qIndex] === question.correctAnswer ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {selectedAnswers[qIndex] === question.correctAnswer ? (
                                <Check className="h-3 w-3 text-white" />
                              ) : (
                                <ChevronDown className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {selectedAnswers[qIndex] === question.correctAnswer
                                ? "Jawaban benar!"
                                : `Jawaban yang benar: ${question.options[question.correctAnswer]}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        setShowQuiz(false)
                        setQuizCompleted(false)
                        setSelectedAnswers({})
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Tutup
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taxonomy Tree Modal */}
      <AnimatePresence>
        {showTaxonomyTree && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Pohon Taksonomi</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={() => setShowTaxonomyTree(false)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative h-[500px] w-full">
                  <svg viewBox="0 0 1000 500" className="w-full h-full">
                    {/* Tree Branches */}
                    <path d="M500,50 L500,100" stroke="#047857" strokeWidth="2" />
                    <path d="M500,100 L300,150 M500,100 L700,150" stroke="#047857" strokeWidth="2" />
                    <path d="M300,150 L200,200 M300,150 L400,200" stroke="#047857" strokeWidth="2" />
                    <path d="M700,150 L600,200 M700,150 L800,200" stroke="#047857" strokeWidth="2" />
                    <path d="M200,200 L150,250 M200,200 L250,250" stroke="#047857" strokeWidth="2" />
                    <path d="M400,200 L350,250 M400,200 L450,250" stroke="#047857" strokeWidth="2" />
                    <path d="M600,200 L550,250 M600,200 L650,250" stroke="#047857" strokeWidth="2" />
                    <path d="M800,200 L750,250 M800,200 L850,250" stroke="#047857" strokeWidth="2" />

                    {/* Tree Nodes */}
                    <circle cx="500" cy="50" r="30" fill="#059669" />
                    <circle cx="300" cy="150" r="25" fill="#10b981" />
                    <circle cx="700" cy="150" r="25" fill="#10b981" />
                    <circle cx="200" cy="200" r="20" fill="#34d399" />
                    <circle cx="400" cy="200" r="20" fill="#34d399" />
                    <circle cx="600" cy="200" r="20" fill="#34d399" />
                    <circle cx="800" cy="200" r="20" fill="#34d399" />
                    <circle cx="150" cy="250" r="15" fill="#6ee7b7" />
                    <circle cx="250" cy="250" r="15" fill="#6ee7b7" />
                    <circle cx="350" cy="250" r="15" fill="#6ee7b7" />
                    <circle cx="450" cy="250" r="15" fill="#6ee7b7" />
                    <circle cx="550" cy="250" r="15" fill="#6ee7b7" />
                    <circle cx="650" cy="250" r="15" fill="#6ee7b7" />
                    <circle cx="750" cy="250" r="15" fill="#6ee7b7" />
                    <circle cx="850" cy="250" r="15" fill="#6ee7b7" />

                    {/* Labels */}
                    <text x="500" y="55" textAnchor="middle" fill="#fff" fontWeight="bold">
                      Animalia
                    </text>
                    <text x="300" y="155" textAnchor="middle" fill="#fff" fontWeight="bold">
                      Chordata
                    </text>
                    <text x="700" y="155" textAnchor="middle" fill="#fff" fontWeight="bold">
                      Arthropoda
                    </text>
                    <text x="200" y="205" textAnchor="middle" fill="#fff" fontWeight="bold">
                      Mammalia
                    </text>
                    <text x="400" y="205" textAnchor="middle" fill="#fff" fontWeight="bold">
                      Aves
                    </text>
                    <text x="600" y="205" textAnchor="middle" fill="#fff" fontWeight="bold">
                      Insecta
                    </text>
                    <text x="800" y="205" textAnchor="middle" fill="#fff" fontWeight="bold">
                      Arachnida
                    </text>
                  </svg>
                </div>

                <div className="mt-6 bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-medium text-emerald-800 mb-2">Tentang Pohon Taksonomi:</h4>
                  <p className="text-gray-700">
                    Pohon taksonomi menggambarkan hubungan evolusioner antara berbagai kelompok organisme. Semakin dekat
                    dua organisme dalam pohon, semakin dekat hubungan evolusioner mereka. Pohon ini membantu ilmuwan
                    memahami bagaimana berbagai spesies berevolusi dari nenek moyang yang sama.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Data for the taxonomic ranks section
const taxonomicRanks = [
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
  {
    name: "Subspecies",
    icon: <Layers size={24} className="text-emerald-600" />,
    description: "Subdivisi dari Species, menunjukkan variasi geografis atau genetik dalam suatu spesies.",
    example: "Panthera tigris sumatrae - harimau Sumatera.",
  },
  {
    name: "Binomial Nomenclature",
    icon: <BookOpen size={24} className="text-emerald-600" />,
    description:
      "Sistem penamaan ilmiah yang menggunakan kombinasi nama genus dan spesies untuk mengidentifikasi organisme secara unik.",
    example: "Panthera tigris - nama ilmiah untuk harimau.",
  },
]

// Enhanced data for classification methods
const classificationMethods = [
  {
    id: "morphology",
    name: "Morfologi",
    shortDesc: "Klasifikasi berdasarkan bentuk & struktur",
    icon: <Microscope size={24} className="text-emerald-600" />,
    since: "Digunakan sejak zaman Aristoteles (384-322 SM)",
    description:
      "Metode klasifikasi tradisional yang didasarkan pada karakteristik fisik dan struktural organisme, seperti bentuk tubuh, ukuran, dan fitur anatomi. Ini adalah pendekatan tertua dalam taksonomi.",
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
    exampleTitle: "Klasifikasi Harimau",
    image: "/placeholder.svg?height=400&width=600",
    imageTitle: "Analisis Morfologi Felidae",
    imageDesc: "Perbandingan struktur tengkorak berbagai spesies kucing",
    accuracy: 75,
    accessibility: 95,
    costEfficiency: 90,
  },
  {
    id: "genetics",
    name: "Genetika dan DNA",
    shortDesc: "Klasifikasi berdasarkan analisis DNA",
    icon: <Dna size={24} className="text-emerald-600" />,
    since: "Berkembang pesat sejak 1950-an",
    description:
      "Metode modern yang menggunakan analisis DNA dan sekuensing genom untuk menentukan hubungan evolusioner dan klasifikasi yang lebih akurat. Pendekatan ini telah merevolusi taksonomi dalam beberapa dekade terakhir.",
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
    exampleTitle: "Analisis DNA Mitokondrial Felidae",
    image: "/placeholder.svg?height=400&width=600",
    imageTitle: "Sekuensing DNA Felidae",
    imageDesc: "Visualisasi perbandingan sekuens DNA berbagai spesies kucing",
    accuracy: 98,
    accessibility: 60,
    costEfficiency: 40,
  },
  {
    id: "phylogenetic",
    name: "Filogenetik",
    shortDesc: "Klasifikasi berdasarkan hubungan evolusi",
    icon: <TreePine size={24} className="text-emerald-600" />,
    since: "Berkembang sejak teori evolusi Darwin (1859)",
    description:
      "Pendekatan yang berfokus pada hubungan evolusioner antara organisme, menggunakan 'pohon kehidupan' untuk menggambarkan bagaimana spesies berevolusi dari nenek moyang yang sama. Metode ini menggabungkan data morfologi, genetik, dan fosil.",
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
    exampleTitle: "Filogeni Panthera",
    image: "/placeholder.svg?height=400&width=600",
    imageTitle: "Pohon Filogenetik Felidae",
    imageDesc: "Visualisasi hubungan evolusioner antar spesies kucing",
    accuracy: 90,
    accessibility: 70,
    costEfficiency: 65,
  },
  {
    id: "behavioral",
    name: "Perilaku dan Ekologi",
    shortDesc: "Klasifikasi berdasarkan perilaku & habitat",
    icon: <Lightbulb size={24} className="text-emerald-600" />,
    since: "Berkembang pada abad ke-20",
    description:
      "Metode yang mempertimbangkan perilaku, habitat, dan interaksi ekologis organisme sebagai faktor dalam klasifikasi. Pendekatan ini melengkapi metode klasifikasi lainnya dengan memberikan konteks ekologis.",
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
    exampleTitle: "Perilaku Sosial Felidae",
    image: "/placeholder.svg?height=400&width=600",
    imageTitle: "Pola Perilaku Harimau",
    imageDesc: "Dokumentasi perilaku berburu harimau di habitat alami",
    accuracy: 80,
    accessibility: 85,
    costEfficiency: 75,
  },
]

// Data for classification evolution timeline
const classificationEvolution = [
  {
    year: "384-322 SM",
    title: "Klasifikasi Aristoteles",
    description:
      "Aristoteles mengklasifikasikan hewan berdasarkan habitat (air, darat, udara) dan karakteristik darah (berdarah atau tidak berdarah).",
  },
  {
    year: "1735",
    title: "Sistem Linnaeus",
    description:
      "Carl Linnaeus memperkenalkan sistem hierarkis dan penamaan binomial dalam 'Systema Naturae', menjadi dasar taksonomi modern.",
  },
  {
    year: "1859",
    title: "Teori Evolusi Darwin",
    description:
      "Charles Darwin menerbitkan 'On the Origin of Species', memberikan dasar teoretis untuk klasifikasi berdasarkan hubungan evolusioner.",
  },
  {
    year: "1950-an",
    title: "Revolusi Molekuler",
    description:
      "Penemuan struktur DNA oleh Watson dan Crick membuka jalan bagi taksonomi molekuler dan analisis genetik.",
  },
  {
    year: "1960-an",
    title: "Kladistik",
    description:
      "Willi Hennig mengembangkan metode kladistik, fokus pada karakter yang diturunkan bersama untuk membangun pohon filogenetik.",
  },
  {
    year: "1990-an",
    title: "Filogenetik Molekuler",
    description:
      "Kemajuan dalam sekuensing DNA memungkinkan rekonstruksi hubungan evolusioner berdasarkan data molekuler skala besar.",
  },
  {
    year: "2000-an",
    title: "Era Genomik",
    description:
      "Sekuensing genom lengkap dan teknologi -omics lainnya memungkinkan pendekatan komprehensif dalam taksonomi dan filogenetik.",
  },
]

// Data for tiger classification example
const tigerClassification = [
  {
    rank: "Kingdom",
    value: "Animalia",
    description: "Semua hewan.",
  },
  {
    rank: "Phylum",
    value: "Chordata",
    description: "Hewan dengan notochord.",
  },
  {
    rank: "Class",
    value: "Mammalia",
    description: "Hewan menyusui.",
  },
  {
    rank: "Order",
    value: "Carnivora",
    description: "Pemakan daging.",
  },
  {
    rank: "Family",
    value: "Felidae",
    description: "Keluarga kucing.",
  },
  {
    rank: "Genus",
    value: "Panthera",
    description: "Kucing besar yang bisa mengaum.",
  },
  {
    rank: "Species",
    value: "Panthera tigris",
    description: "Harimau.",
  },
]

// Data for importance of taxonomy section
const importancePoints = [
  {
    title: "Konservasi Keanekaragaman Hayati",
    description:
      "Taksonomi membantu mengidentifikasi dan mengklasifikasikan spesies yang terancam punah, memungkinkan upaya konservasi yang lebih efektif.",
    icon: <Leaf size={24} className="text-emerald-600" />,
  },
  {
    title: "Pengembangan Ilmu Pengetahuan",
    description:
      "Taksonomi memberikan dasar untuk memahami hubungan evolusioner dan keanekaragaman hayati, yang penting untuk penelitian di berbagai bidang ilmu.",
    icon: <Brain size={24} className="text-emerald-600" />,
  },
  {
    title: "Aplikasi Praktis",
    description:
      "Taksonomi digunakan dalam berbagai aplikasi praktis, seperti identifikasi hama dan penyakit, pengembangan obat-obatan, dan pengelolaan sumber daya alam.",
    icon: <Microscope size={24} className="text-emerald-600" />,
  },
]

// Data for quiz questions
const quizQuestions = [
  {
    question: "Siapakah bapak taksonomi modern?",
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

// Data for section labels
const sectionLabels = {
  introduction: "Pengantar",
  history: "Sejarah",
  taxonomicRanks: "Tingkatan Taksonomi",
  classification: "Klasifikasi",
  example: "Contoh",
  importance: "Pentingnya",
}

// Data for timeline events
const timelineEvents = [
  {
    year: "Abad ke-4 SM",
    title: "Aristoteles",
    description: "Mengklasifikasikan hewan berdasarkan karakteristik fisik.",
  },
  {
    year: "1735",
    title: "Carl Linnaeus",
    description: "Menerbitkan 'Systema Naturae' dan memperkenalkan sistem penamaan binomial.",
  },
  {
    year: "Abad ke-20",
    title: "Perkembangan Genetika",
    description: "Kemajuan dalam genetika dan biologi molekuler menyempurnakan sistem klasifikasi.",
  },
]
