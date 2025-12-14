"use client"

import { RefObject } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface FeaturesSectionHeaderProps {
    headerRef: RefObject<HTMLDivElement | null>
    headerInView: boolean
}

export function FeaturesSectionHeader({ headerRef, headerInView }: FeaturesSectionHeaderProps) {
    return (
        <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 xl:mb-20"
        >
            <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={headerInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 lg:mb-6 backdrop-blur-sm"
            >
                <Sparkles size={16} />
                Powerful Features
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 lg:mb-6 text-balance"
            >
                Fitur Unggulan Aplikasi
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-muted-foreground text-base lg:text-lg leading-relaxed"
            >
                Teknologi modern bertemu dengan keindahan alam. Jelajahi, pelajari, dan kagumi dunia Felidae dengan cara yang
                belum pernah ada sebelumnya.
            </motion.p>
        </motion.div>
    )
}
