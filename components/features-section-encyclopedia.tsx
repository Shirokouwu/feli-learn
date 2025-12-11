"use client"

import { RefObject } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, BookOpen, ImageIcon, MapPin, Search, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"


interface FeaturesSectionEncyclopediaProps {
    encyclopediaRef: RefObject<HTMLDivElement | null>
    encyclopediaInView: boolean
}

const speciesData = [{
    name: "Harimau",
    latin: "Panthera tigris",
    status: "Endangered",
    image: "https://bskdn.kemendagri.go.id/website/wp-content/uploads/2018/03/Harimau-800x400.jpg",
},
{
    name: "Singa",
    latin: "Panthera leo",
    status: "Vulnerable",
    image: "https://trigger.id/wp-content/uploads/2024/12/Panther-Leo.jpg",
},
{
    name: "Bobcat",
    latin: "Lynx rufus",
    status: "Least Concern",
    image: "https://assets.pikiran-rakyat.com/crop/0x0:0x0/720x0/webp/photo/2023/12/17/3099435796.jpg",
},
{
    name: "Jaguar",
    latin: "Panthera onca",
    status: "Vulnerable",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Jaguar_head_shot-edit2.jpg",
}]

export function FeaturesSectionEncyclopedia({ encyclopediaRef, encyclopediaInView }: FeaturesSectionEncyclopediaProps) {
    const shouldReduceMotion = useReducedMotion()

    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.08,
                delayChildren: shouldReduceMotion ? 0 : 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: "easeOut" },
        },
    }

    return (
        <motion.div
            ref={encyclopediaRef}
            initial={{ opacity: 0, y: 50 }}
            animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative will-change-transform"
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-12 pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.06, 0.11, 0.06], scale: [1, 1.04, 1] }}
                    transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[420px] h-[420px] bg-accent/18 rounded-full blur-[90px] will-change-transform"
                />
                <motion.div
                    animate={{ opacity: [0.04, 0.09, 0.04], scale: [1.02, 1, 1.02] }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 3 }}
                    className="absolute top-1/3 right-1/4 w-[320px] h-[320px] bg-primary/12 rounded-full blur-[70px] will-change-transform"
                />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`, backgroundSize: "32px 32px" }}
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                <div className="order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={encyclopediaInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 text-accent text-sm font-semibold mb-6"
                    >
                        <BookOpen size={16} />
                        Complete Encyclopedia
                    </motion.div>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
                        className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
                    >
                        Database Lengkap <span className="text-accent">41 Spesies</span>
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
                        className="text-muted-foreground text-lg mb-8 leading-relaxed"
                    >
                        Akses informasi mendalam tentang setiap spesies Felidae. Dari habitat, perilaku, hingga status konservasi - semua tersedia dalam satu tempat.
                    </motion.p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {[{ icon: ImageIcon, value: "500+", label: "Foto HD" }, { icon: MapPin, value: "Global", label: "Distribusi" }, { icon: Shield, value: "IUCN", label: "Status" }, { icon: Search, value: "Cepat", label: "Pencarian" }].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.35, delay: 0.3 + index * 0.08, ease: "easeOut" }}
                                whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.15 } }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-200 will-change-transform"
                            >
                                <stat.icon className="text-accent" size={20} />
                                <div>
                                    <p className="font-semibold text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.35, delay: 0.6, ease: "easeOut" }}>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 transition-all duration-200 hover:scale-[1.02] will-change-transform">
                            Jelajahi Ensiklopedia
                            <ArrowRight size={18} />
                        </Button>
                    </motion.div>
                </div>

                <div
                    // initial={{ opacity: 0, scale: 0.95, x: 30 }}
                    // animate={encyclopediaInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                    // transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="order-1 lg:order-2"
                >
                    <div className="relative">
                        <motion.div
                            className="grid grid-cols-2 gap-4"
                            variants={listVariants}
                            initial="hidden"
                            animate={encyclopediaInView ? "show" : undefined}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {speciesData.map((species) => (
                                <motion.div
                                    key={species.name}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.12 } }}
                                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-border/40 bg-card/60 backdrop-blur-sm will-change-transform"
                                >
                                    <img
                                        src={species.image}
                                        alt={species.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-104"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="font-semibold text-foreground">{species.name}</p>
                                        <p className="text-xs text-muted-foreground italic">{species.latin}</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">{species.status}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
