"use client"

import { RefObject } from "react"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, ImageIcon, MapPin, Search, Shield } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface FeaturesSectionEncyclopediaProps {
    encyclopediaRef: RefObject<HTMLDivElement | null>
    encyclopediaInView: boolean
}

export function FeaturesSectionEncyclopedia({ encyclopediaRef, encyclopediaInView }: FeaturesSectionEncyclopediaProps) {
    return (
        <motion.div
            ref={encyclopediaRef}
            initial={{ opacity: 0, y: 50 }}
            animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
        >
            <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-12 pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{ opacity: [0.05, 0.12, 0.05], scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px]"
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
                        Akses informasi mendalam tentang setiap spesies Felidae. Dari habitat, perilaku, hingga status konservasi - semua tersedia dalam satu tempat.
                    </motion.p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {[{ icon: ImageIcon, value: "500+", label: "Foto HD" }, { icon: MapPin, value: "Global", label: "Distribusi" }, { icon: Shield, value: "IUCN", label: "Status" }, { icon: Search, value: "Cepat", label: "Pencarian" }].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.35 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ y: -6, scale: 1.03, transition: { type: "spring", stiffness: 220, damping: 18 } }}
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

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 transition-all duration-300 hover:scale-105">
                            Jelajahi Ensiklopedia
                            <ArrowRight size={18} />
                        </Button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 30 }}
                    animate={encyclopediaInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="order-1 lg:order-2"
                >
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            {[{
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
                            }].map((species, index) => (
                                <motion.div
                                    key={species.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={encyclopediaInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.7, delay: 0.35 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ y: -8, scale: 1.04, transition: { type: "spring", stiffness: 210, damping: 20 } }}
                                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                                >
                                    <Image src={species.image} alt={species.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="font-semibold text-foreground">{species.name}</p>
                                        <p className="text-xs text-muted-foreground italic">{species.latin}</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">{species.status}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
