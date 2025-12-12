"use client"

import type React from "react"

import Link from "next/link"
import { Github, Twitter, Instagram } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollAnimation, staggerContainer, staggerItem } from "@/hooks/use-scroll-animation"

export function Footer() {
  const { ref, isInView } = useScrollAnimation()

  const footerLinks = [
    {
      title: "Fitur",
      links: [
        { label: "AI Scanner", href: "#" },
        { label: "Taxonomy Diagram", href: "#" },
        { label: "Encyclopedia", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

  return (
    <footer ref={ref as React.RefObject<HTMLElement>} id="about" className="py-16 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {/* Brand */}
          {/* @ts-ignore */}
          <motion.div variants={staggerItem} className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              >
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </motion.div>
              <span className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Felidae
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Platform edukasi interaktif untuk mempelajari taksonomi dan spesies keluarga kucing liar.
            </p>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section) => (
          
            <motion.div key={section.title} variants={staggerItem}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border gap-4"
        >
          <p className="text-muted-foreground text-sm">© 2025 Felidae. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <motion.div
                key={social.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.2, y: -2 }}
              >
                <Link href={social.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  <social.icon size={20} />
                  <span className="sr-only">{social.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
