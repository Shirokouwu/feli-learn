"use client"

import { RefObject, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Camera, CheckCircle2, Cpu, ImageIcon, Scan, Upload, Zap } from "lucide-react"
import Image from "next/image"

interface FeaturesSectionScannerProps {
    scannerRef: RefObject<HTMLDivElement | null>
    scannerInView: boolean
}

export function FeaturesSectionScanner({ scannerRef, scannerInView }: FeaturesSectionScannerProps) {
    const [activeStep, setActiveStep] = useState(0)

    const scannerSteps = [
        { icon: Upload, label: "Upload Foto", desc: "Ambil atau pilih foto" },
        { icon: Scan, label: "AI Analisis", desc: "Proses identifikasi" },
        { icon: CheckCircle2, label: "Hasil Akurat", desc: "Lihat detail spesies" },
    ]

    const scannerVisuals = {
        upload: (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52">
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
        scanning: (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52">
                    <motion.div
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="absolute inset-0 border-2 border-primary rounded-3xl"
                    />

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

                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-primary/40" />
                        <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="0.3" className="text-primary/30" />
                        <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="0.3" className="text-primary/30" />
                    </svg>

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

                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-white/50 backdrop-blur-sm"
                        >
                            <Cpu className="text-primary/60" size={20} />
                        </motion.div>
                    </div>

                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                        className="absolute inset-0 border border-primary rounded-3xl"
                    />
                </div>
            </div>
        ),
        result: (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 border-2 border-chart-3 rounded-3xl bg-chart-3/5"
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center"
                        >
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
                                <CheckCircle2 className="text-chart-3" size={32} />
                            </motion.div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
                            <p className="text-sm font-semibold text-foreground/80">Teridentifikasi!</p>
                            <p className="text-xs text-muted-foreground mt-1">Panthera tigris</p>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-[#444] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "98%" }}
                                        transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                        className="h-full bg-primary rounded-full"
                                    />
                                </div>
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.3 }} className="text-xs font-medium text-primary">
                                    98%
                                </motion.span>
                            </div>
                        </motion.div>
                    </div>

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
                            transition={{ delay: 0.5 + i * 0.1, duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-chart-3/60"
                        />
                    ))}
                </div>
            </div>
        ),
    }

    return (
        <motion.div
            ref={scannerRef}
            initial={{ opacity: 0, y: 50 }}
            animate={scannerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20 lg:mb-24 xl:mb-32"
        >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
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
                        className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-4 lg:mb-6"
                    >
                        Identifikasi Spesies dalam <span className="text-primary">Hitungan Detik</span>
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={scannerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="text-muted-foreground text-base lg:text-lg mb-6 lg:mb-8 leading-relaxed"
                    >
                        Cukup arahkan kamera atau upload foto kucing liar yang kamu temui. AI kami yang dilatih dengan puluhan ribu
                        gambar akan mengidentifikasi spesiesnya dengan akurasi tinggi.
                    </motion.p>

                    <div className="flex gap-3 lg:gap-4 mb-6 lg:mb-8">
                        {scannerSteps.map((step, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={scannerInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                onClick={() => setActiveStep(index)}
                                className={`flex-1 p-3 lg:p-4 rounded-xl border transition-all duration-500 text-left ${activeStep === index ? "border-primary bg-primary/10 shadow-lg shadow-primary/15" : "border-border bg-card hover:border-primary/50"
                                    }`}
                            >
                                <step.icon
                                    size={20}
                                    className={`transition-colors duration-300 ${activeStep === index ? "text-primary mb-2" : "text-muted-foreground mb-2"}`}
                                />
                                <p className={`font-semibold text-sm transition-colors duration-300 ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}>
                                    {step.label}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                            </motion.button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 lg:gap-4">
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
                                className="text-center p-3 lg:p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                            >
                                <p className="text-xl lg:text-2xl font-bold text-primary">{stat.value}</p>
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
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-full z-10" />

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

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {activeStep !== 2 &&
                                            scannerSteps.map((_, index) => (
                                                <motion.div
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === activeStep ? "bg-primary" : "bg-primary/30"}`}
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
    )
}
