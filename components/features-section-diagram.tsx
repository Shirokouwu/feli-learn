"use client"

import { RefObject, useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { GitBranch, MousePointerClick, ZoomIn, Filter } from "lucide-react"

interface FeaturesSectionDiagramProps {
    diagramRef: RefObject<HTMLDivElement | null>
    diagramInView: boolean
}

function AnimatedRadialDiagram({ sectionInView }: { sectionInView?: boolean }) {
    const [mounted, setMounted] = useState(false)
    const diagramRef = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(diagramRef, { once: true, margin: "-100px", amount: 0.3 })

    const diagramColors = {
        ring: "var(--chart-3, #8bf0c6)",
        ringMuted: "rgba(139, 240, 198, 0.25)",
        species: "var(--chart-3, #7cf2b5)",
        genus: "var(--primary, #7cc3ff)",
        family: "var(--accent, #f7b267)",
        text: "var(--foreground, #f8fafc)",
        halo: "rgba(124, 242, 181, 0.08)",
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isVisible = isInView || sectionInView

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
                <defs>
                    <radialGradient id="diagram-glow" cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor={diagramColors.halo} stopOpacity="0.6" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <circle cx="200" cy="200" r="190" fill="url(#diagram-glow)" />

                <motion.circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="none"
                    stroke={diagramColors.ring}
                    strokeWidth={1.25}
                    strokeDasharray="4 4"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={isVisible ? { opacity: 0.6, pathLength: 1 } : {}}
                    transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />

                <motion.circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="none"
                    stroke={diagramColors.ring}
                    strokeWidth={1.25}
                    strokeDasharray="4 4"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={isVisible ? { opacity: 0.55, pathLength: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />

                <motion.circle
                    cx="200"
                    cy="200"
                    r="60"
                    fill="none"
                    stroke={diagramColors.ring}
                    strokeWidth={1.25}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isVisible ? { opacity: 0.5, scale: 1 } : {}}
                    transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                />

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
                            stroke={diagramColors.ring}
                            strokeWidth="1"
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={isVisible ? { opacity: 0.5, pathLength: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                    )
                })}

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
                                stroke={diagramColors.ring}
                                strokeWidth="1"
                                initial={{ opacity: 0, pathLength: 0 }}
                                animate={isVisible ? { opacity: 0.4, pathLength: 1 } : {}}
                                transition={{ duration: 0.6, delay: 0.8 + gi * 0.12 + si * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            />
                        )
                    })
                })}

                {speciesData.map(({ angle, name }, i) => {
                    const rad = (angle * Math.PI) / 180
                    const x = 200 + 180 * Math.cos(rad)
                    const y = 200 + 180 * Math.sin(rad)
                    return (
                        <motion.g
                            key={`species-${i}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 1.2 + i * 0.05, ease: [0.22, 1, 0.36, 1], type: "spring", stiffness: 180, damping: 15 }}
                        >
                            <circle cx={x} cy={y} r="16" fill={diagramColors.species} stroke={diagramColors.ringMuted} strokeWidth="2" />
                            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={diagramColors.text} className="text-[6px] font-medium">
                                {name.length > 6 ? name.slice(0, 5) + "." : name}
                            </text>
                        </motion.g>
                    )
                })}

                {genusData.map(({ angle, name }, i) => {
                    const rad = (angle * Math.PI) / 180
                    const x = 200 + 120 * Math.cos(rad)
                    const y = 200 + 120 * Math.sin(rad)
                    return (
                        <motion.g
                            key={`genus-${i}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.7 + i * 0.12, ease: [0.22, 1, 0.36, 1], type: "spring", stiffness: 160, damping: 12 }}
                        >
                            <motion.circle
                                cx={x}
                                cy={y}
                                r="24"
                                fill={diagramColors.genus}
                                stroke={diagramColors.ringMuted}
                                strokeWidth="2"
                                animate={isInView ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 2 + i * 0.4, ease: "easeInOut" }}
                            />
                            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={diagramColors.text} className="text-[8px] font-semibold">
                                {name}
                            </text>
                        </motion.g>
                    )
                })}

                <motion.g initial={{ opacity: 0, scale: 0 }} animate={isVisible ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 140, damping: 10 }}>
                    <motion.circle
                        cx="200"
                        cy="200"
                        r="40"
                        fill={diagramColors.family}
                        stroke={diagramColors.ringMuted}
                        strokeWidth="2"
                        animate={isVisible ? { scale: [1, 1.08, 1] } : {}}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1.5, ease: "easeInOut" }}
                    />
                    <motion.circle
                        cx="200"
                        cy="200"
                        r="45"
                        fill="none"
                        stroke={diagramColors.family}
                        strokeWidth="2"
                        animate={isVisible ? { scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] } : {}}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5, ease: "easeInOut" }}
                    />
                    <text x="200" y="195" textAnchor="middle" dominantBaseline="middle" fill={diagramColors.text} className="text-[10px] font-bold">
                        Felidae
                    </text>
                    <text x="200" y="208" textAnchor="middle" dominantBaseline="middle" fill={diagramColors.text} className="text-[7px]">
                        Family
                    </text>
                </motion.g>
            </svg>

            <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: diagramColors.family }}></div>
                    <span className="text-muted-foreground">Family</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: diagramColors.genus }}></div>
                    <span className="text-muted-foreground">Genus</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: diagramColors.species }}></div>
                    <span className="text-muted-foreground">Species</span>
                </div>
            </motion.div>
        </div>
    )
}

export function FeaturesSectionDiagram({ diagramRef, diagramInView }: FeaturesSectionDiagramProps) {
    return (
        <motion.div
            ref={diagramRef}
            initial={{ opacity: 0, y: 50 }}
            animate={diagramInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-32"
        >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-1">
                    <AnimatedRadialDiagram sectionInView={diagramInView} />
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
                        Jelajahi hubungan antar spesies dengan diagram radial yang intuitif. Lihat bagaimana setiap kucing liar terhubung dalam pohon evolusi keluarga Felidae.
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
    )
}
