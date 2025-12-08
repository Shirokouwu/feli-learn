"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import {
  Scan,
  GitBranch,
  BookOpen,
  Upload,
  CheckCircle2,
  Sparkles,
  MousePointerClick,
  ZoomIn,
  Filter,
  MapPin,
  ImageIcon,
  Shield,
  Search,
  ArrowRight,
  Camera,
  Zap,
  Cpu,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SectionBackground } from "@/components/section-background"

function AnimatedRadialDiagram() {
  const diagramRef = useRef(null)
  const isInView = useInView(diagramRef, { once: true, margin: "-100px", amount: 0.3 })

  const speciesData = [
    { angle: -15, name: "Lion" },
    { angle: 0, name: "Tiger" },
    { angle: 15, name: "Leopard" },
    { angle: 45, name: "Cat" },
    { angle: 60, name: "Wildcat" },
    { angle: 75, name: "Sand Cat" },
    { angle: 105, name: "Cougar" },
    { angle: 120, name: "Jaguarundi" },
    { angle: 135, name: "Eyra" },
    { angle: 165, name: "Cheetah" },
    { angle: 180, name: "King Ch." },
    { angle: 195, name: "Asiatic" },
    { angle: 225, name: "Clouded" },
    { angle: 240, name: "Sunda" },
    { angle: 255, name: "Bornean" },
    { angle: 285, name: "Bobcat" },
    { angle: 300, name: "Eurasian" },
    { angle: 315, name: "Iberian" },
  ]

  const genusData = [
    { angle: 0, name: "Panthera", speciesAngles: [-15, 0, 15] },
    { angle: 60, name: "Felis", speciesAngles: [45, 60, 75] },
    { angle: 120, name: "Puma", speciesAngles: [105, 120, 135] },
    { angle: 180, name: "Acinonyx", speciesAngles: [165, 180, 195] },
    { angle: 240, name: "Neofelis", speciesAngles: [225, 240, 255] },
    { angle: 300, name: "Lynx", speciesAngles: [285, 300, 315] },
  ]

  return (
    <div ref={diagramRef} className="relative aspect-square max-w-lg mx-auto w-full">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Outer ring - Species level with animated stroke */}
        <motion.circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={isInView ? { opacity: 0.1, pathLength: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Middle ring - Genus level */}
        <motion.circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={isInView ? { opacity: 0.15, pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Inner ring - Family level */}
        <motion.circle
          cx="200"
          cy="200"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 0.2, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Connection lines from center to genus - animated */}
        {genusData.map((genus, i) => {
          const rad = (genus.angle * Math.PI) / 180
          const x2 = 200 + 120 * Math.cos(rad)
          const y2 = 200 + 120 * Math.sin(rad)
          return (
            <motion.line
              key={`line-genus-${i}`}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={isInView ? { opacity: 0.15, pathLength: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          )
        })}

        {/* Connection lines from genus to species - animated */}
        {genusData.map((genus, gi) => {
          const gRad = (genus.angle * Math.PI) / 180
          const gx = 200 + 120 * Math.cos(gRad)
          const gy = 200 + 120 * Math.sin(gRad)
          return genus.speciesAngles.map((sAngle, si) => {
            const sRad = (sAngle * Math.PI) / 180
            const sx = 200 + 180 * Math.cos(sRad)
            const sy = 200 + 180 * Math.sin(sRad)
            return (
              <motion.line
                key={`line-species-${gi}-${si}`}
                x1={gx}
                y1={gy}
                x2={sx}
                y2={sy}
                stroke="currentColor"
                strokeWidth="1"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={isInView ? { opacity: 0.1, pathLength: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + gi * 0.12 + si * 0.06, ease: [0.22, 1, 0.36, 1] }}
              />
            )
          })
        })}

        {/* Species nodes (outer ring) - staggered animation */}
        {speciesData.map(({ angle, name }, i) => {
          const rad = (angle * Math.PI) / 180
          const x = 200 + 180 * Math.cos(rad)
          const y = 200 + 180 * Math.sin(rad)
          return (
            <motion.g
              key={`species-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 1.2 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
                type: "spring",
                stiffness: 180,
                damping: 15,
              }}
            >
              <circle cx={x} cy={y} r="16" className="fill-chart-3" />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-[6px] font-medium"
              >
                {name.length > 6 ? name.slice(0, 5) + "." : name}
              </text>
            </motion.g>
          )
        })}

        {/* Genus nodes (middle ring) - staggered animation */}
        {genusData.map(({ angle, name }, i) => {
          const rad = (angle * Math.PI) / 180
          const x = 200 + 120 * Math.cos(rad)
          const y = 200 + 120 * Math.sin(rad)
          return (
            <motion.g
              key={`genus-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.7 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
                type: "spring",
                stiffness: 160,
                damping: 12,
              }}
            >
              <motion.circle
                cx={x}
                cy={y}
                r="24"
                className="fill-primary"
                animate={isInView ? { scale: [1, 1.05, 1] } : {}}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 2 + i * 0.4,
                  ease: "easeInOut",
                }}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-primary-foreground text-[8px] font-semibold"
              >
                {name}
              </text>
            </motion.g>
          )
        })}

        {/* Center node - Family (animated first) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.1,
            type: "spring",
            stiffness: 140,
            damping: 10,
          }}
        >
          <motion.circle
            cx="200"
            cy="200"
            r="40"
            className="fill-accent"
            animate={isInView ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1.5, ease: "easeInOut" }}
          />
          {/* Glow effect */}
          <motion.circle
            cx="200"
            cy="200"
            r="45"
            fill="none"
            className="stroke-accent/30"
            strokeWidth="2"
            animate={isInView ? { scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] } : {}}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5, ease: "easeInOut" }}
          />
          <text
            x="200"
            y="195"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-accent-foreground text-[10px] font-bold"
          >
            Felidae
          </text>
          <text
            x="200"
            y="208"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-accent-foreground/80 text-[7px]"
          >
            Family
          </text>
        </motion.g>
      </svg>

      {/* Legend - animated */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-muted-foreground">Family</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Genus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-3"></div>
          <span className="text-muted-foreground">Species</span>
        </div>
      </motion.div>
    </div>
  )
}

export function FeaturesSection() {
  const headerRef = useRef(null)
  const scannerRef = useRef(null)
  const diagramSectionRef = useRef(null)
  const encyclopediaRef = useRef(null)

  const headerInView = useInView(headerRef, { once: true, margin: "-80px", amount: 0.3 })
  const scannerInView = useInView(scannerRef, { once: true, margin: "-80px", amount: 0.2 })
  const diagramInView = useInView(diagramSectionRef, { once: true, margin: "-80px", amount: 0.2 })
  const encyclopediaInView = useInView(encyclopediaRef, { once: true, margin: "-80px", amount: 0.15 })

  const [activeStep, setActiveStep] = useState(0)

  const scannerSteps = [
    { icon: Upload, label: "Upload Foto", desc: "Ambil atau pilih foto" },
    { icon: Scan, label: "AI Analisis", desc: "Proses identifikasi" },
    { icon: CheckCircle2, label: "Hasil Akurat", desc: "Lihat detail spesies" },
  ]

  const scannerVisuals = {
    // Step 0: Upload Foto - shows upload interface
    upload: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52">
          {/* Upload frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-3xl flex flex-col items-center justify-center gap-3 bg-primary/5"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Upload className="text-primary" size={24} />
            </motion.div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-foreground/80">Tap untuk upload</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG hingga 10MB</p>
            </div>
          </motion.div>

          {/* Floating image previews */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shadow-lg"
          >
            <ImageIcon className="text-primary/60" size={20} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -right-4 w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30 flex items-center justify-center shadow-lg"
          >
            <Camera className="text-accent/60" size={18} />
          </motion.div>
        </div>
      </div>
    ),
    // Step 1: AI Analisis - shows scanning animation
    scanning: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52">
          {/* Outer rounded rectangle frame */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute inset-0 border-2 border-primary rounded-3xl"
          />

          {/* Corner brackets */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <motion.path
              d="M 5 20 L 5 5 L 20 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.path
              d="M 80 5 L 95 5 L 95 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.path
              d="M 95 80 L 95 95 L 80 95"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.path
              d="M 20 95 L 5 95 L 5 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </svg>

          {/* Crosshair lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" />
            <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="0.3" className="text-primary/30" />
            <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="0.3" className="text-primary/30" />
          </svg>

          {/* Rotating dashed circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-2"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                className="text-primary/50"
              />
            </svg>
          </motion.div>

          {/* Scanning line animation */}
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
          />

          {/* Center icon with pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-white/50 backdrop-blur-sm"
            >
              <Cpu className="text-primary/60" size={20} />
            </motion.div>
          </div>

          {/* Scanning pulse effect */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
            className="absolute inset-0 border border-primary rounded-3xl"
          />
        </div>
      </div>
    ),
    // Step 2: Hasil Akurat - shows result
    result: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52">
          {/* Success frame */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 border-2 border-chart-3 rounded-3xl bg-chart-3/5"
          />

          {/* Checkmark animation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="text-chart-3" size={32} />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-sm font-semibold text-foreground/80">Teridentifikasi!</p>
              <p className="text-xs text-muted-foreground mt-1">Panthera tigris</p>
              {/* Progress bar */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#444] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                  className="text-xs font-medium text-primary"
                >
                  98%
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Floating success particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                y: [0, -30 - i * 10],
                x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 5)],
              }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-chart-3/60"
            />
          ))}
        </div>
      </div>
    ),
  }

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <SectionBackground variant="mesh" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <Sparkles size={16} />
            Powerful Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance"
          >
            Fitur Unggulan Aplikasi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            Teknologi modern bertemu dengan keindahan alam. Jelajahi, pelajari, dan kagumi dunia Felidae dengan cara
            yang belum pernah ada sebelumnya.
          </motion.p>
        </motion.div>

        <motion.div
          ref={scannerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={scannerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={scannerInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-sm font-semibold mb-6"
              >
                <Scan size={16} />
                AI-Powered Scanner
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={scannerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
              >
                Identifikasi Spesies dalam <span className="text-primary">Hitungan Detik</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={scannerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
              >
                Cukup arahkan kamera atau upload foto kucing liar yang kamu temui. AI kami yang dilatih dengan puluhan
                ribu gambar akan mengidentifikasi spesiesnya dengan akurasi tinggi.
              </motion.p>

              {/* Interactive Steps - staggered with smoother animations */}
              <div className="flex gap-4 mb-8">
                {scannerSteps.map((step, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={scannerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActiveStep(index)}
                    className={`flex-1 p-4 rounded-xl border transition-all duration-500 text-left ${
                      activeStep === index
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <step.icon
                      size={24}
                      className={`transition-colors duration-300 ${activeStep === index ? "text-primary mb-2" : "text-muted-foreground mb-2"}`}
                    />
                    <p
                      className={`font-semibold text-sm transition-colors duration-300 ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Feature highlights - staggered */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "98%", label: "Akurasi" },
                  { value: "<2s", label: "Kecepatan" },
                  { value: "41", label: "Spesies" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={scannerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    className="text-center p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={scannerInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                {/* Phone mockup */}
                <div className="relative mx-auto w-[280px] sm:w-[320px]">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      scannerInView
                        ? {
                            opacity: 1,
                            x: 0,
                            y: [0, -6, 0],
                          }
                        : {}
                    }
                    transition={{
                      opacity: { delay: 0.8, duration: 0.5 },
                      x: { delay: 0.8, duration: 0.5 },
                      y: { delay: 1.3, duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    }}
                    className="absolute -left-2 sm:-left-4 bottom-24 z-20"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1a1a1a] text-white shadow-xl border border-[#333]">
                      <Zap size={14} className="text-primary" />
                      <span className="text-sm font-semibold">Real-time AI</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={
                      scannerInView
                        ? {
                            opacity: 1,
                            x: 0,
                            y: [0, -8, 0],
                          }
                        : {}
                    }
                    transition={{
                      opacity: { delay: 0.6, duration: 0.5 },
                      x: { delay: 0.6, duration: 0.5 },
                      y: { delay: 1.1, duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    }}
                    className="absolute -right-2 sm:right-0 top-8 z-20"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-primary-foreground shadow-lg">
                      <Camera size={14} />
                      <span className="text-sm font-semibold">Live Scan</span>
                    </div>
                  </motion.div>

                  <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-3 shadow-2xl border border-[#333]">
                    {/* Phone notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-full z-10" />

                    {/* Phone screen */}
                    <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden bg-[#f5f5f5]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeStep}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0"
                        >
                          {activeStep === 0 && scannerVisuals.upload}
                          {activeStep === 1 && scannerVisuals.scanning}
                          {activeStep === 2 && scannerVisuals.result}
                        </motion.div>
                      </AnimatePresence>

                      <AnimatePresence>
                        {activeStep === 2 && (
                          <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute bottom-4 left-3 right-3 p-4 rounded-2xl bg-[#2a2a2a] border border-[#444] shadow-2xl"
                          >
                            <div className="flex items-start gap-3">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0"
                              >
                                <CheckCircle2 className="text-primary-foreground" size={20} />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white text-sm">Panthera tigris</p>
                                <p className="text-xs text-gray-400">Harimau / Tiger</p>
                                {/* Progress bar */}
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-[#444] rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: "98%" }}
                                      transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                      className="h-full bg-primary rounded-full"
                                    />
                                  </div>
                                  <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.3 }}
                                    className="text-xs font-medium text-primary"
                                  >
                                    98%
                                  </motion.span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Step indicator dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {activeStep !== 2 &&
                          scannerSteps.map((_, index) => (
                            <motion.div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                index === activeStep ? "bg-primary" : "bg-primary/30"
                              }`}
                              animate={index === activeStep ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Radial Diagram Section */}
        <motion.div
          ref={diagramSectionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={diagramInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-1">
              <AnimatedRadialDiagram />
            </div>

            <div className="order-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={diagramInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-sm font-semibold mb-6"
              >
                <GitBranch size={16} />
                Interactive Diagram
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={diagramInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
              >
                Visualisasi Taksonomi yang <span className="text-primary">Interaktif</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={diagramInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
              >
                Jelajahi hubungan antar spesies dengan diagram radial yang intuitif. Lihat bagaimana setiap kucing liar
                terhubung dalam pohon evolusi keluarga Felidae.
              </motion.p>

              <div className="space-y-4">
                {[
                  { icon: MousePointerClick, title: "Klik untuk Detail", desc: "Lihat informasi lengkap setiap node" },
                  { icon: ZoomIn, title: "Zoom & Pan", desc: "Eksplorasi diagram dengan bebas" },
                  { icon: Filter, title: "Filter Dinamis", desc: "Tampilkan berdasarkan genus atau habitat" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={diagramInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ x: 6, transition: { duration: 0.3 } }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Encyclopedia Section */}
        <motion.div
          ref={encyclopediaRef}
          initial={{ opacity: 0, y: 50 }}
          animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-12 pointer-events-none">
            <motion.div
              animate={{
                opacity: [0.08, 0.15, 0.08],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px]"
            />
            <motion.div
              animate={{
                opacity: [0.05, 0.12, 0.05],
                scale: [1.1, 1, 1.1],
              }}
              transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px]"
            />
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={encyclopediaInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 text-accent text-sm font-semibold mb-6"
              >
                <BookOpen size={16} />
                Complete Encyclopedia
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
              >
                Database Lengkap <span className="text-accent">41 Spesies</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
              >
                Akses informasi mendalam tentang setiap spesies Felidae. Dari habitat, perilaku, hingga status
                konservasi - semua tersedia dalam satu tempat.
              </motion.p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: ImageIcon, value: "500+", label: "Foto HD" },
                  { icon: MapPin, value: "Global", label: "Distribusi" },
                  { icon: Shield, value: "IUCN", label: "Status" },
                  { icon: Search, value: "Cepat", label: "Pencarian" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.3 } }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300"
                  >
                    <stat.icon className="text-accent" size={20} />
                    <div>
                      <p className="font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 transition-all duration-300 hover:scale-105">
                  Jelajahi Ensiklopedia
                  <ArrowRight size={18} />
                </Button>
              </motion.div>
            </div>

            {/* Encyclopedia Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={encyclopediaInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      name: "Harimau",
                      latin: "Panthera tigris",
                      status: "Endangered",
                      image: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=900&q=80",
                    },
                    {
                      name: "Singa",
                      latin: "Panthera leo",
                      status: "Vulnerable",
                      image: "https://images.unsplash.com/photo-1618826411640-d6df44ddf3d0?auto=format&fit=crop&w=900&q=80",
                    },
                    {
                      name: "Macan Tutul",
                      latin: "Panthera pardus",
                      status: "Vulnerable",
                      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80",
                    },
                    {
                      name: "Cheetah",
                      latin: "Acinonyx jubatus",
                      status: "Vulnerable",
                      image: "https://images.unsplash.com/photo-1508672019048-9e4c0b4e53d1?auto=format&fit=crop&w=900&q=80",
                    },
                  ].map((species, index) => (
                    <motion.div
                      key={species.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}
                      className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={species.image}
                        alt={species.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-semibold text-foreground">{species.name}</p>
                        <p className="text-xs text-muted-foreground italic">{species.latin}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">
                          {species.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
