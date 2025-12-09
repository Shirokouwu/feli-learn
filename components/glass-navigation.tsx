"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Unlock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

interface GlassNavigationProps {
   isScrolled: boolean
   fullName?: string
   backHref?: string
   backLabel?: string
   showUserInfo?: boolean
   className?: string
   profilePicture?: string // Optional profile picture URL
   showThemeToggle?: boolean
}

export function GlassNavigation({
   isScrolled,
   fullName,
   backHref = "/",
   backLabel = "Kembali",
   showUserInfo = true,
   className = "",
   profilePicture = "",
   showThemeToggle = true
}: GlassNavigationProps) {
   const isMobile = useMobile()


   return (
      <motion.div
         className={`fixed z-50 ${className}`}
         initial={false}
         animate={{
            backgroundColor: isScrolled
               ? 'color-mix(in srgb, var(--card) 80%, transparent)'
               : 'color-mix(in srgb, var(--card) 35%, transparent)',
            width: isScrolled ? '50%' : isMobile ? '100%' : '90%',
            height: isScrolled ? '60px' : '80px',
            top: isScrolled ? '16px' : '0px',
            borderRadius: isScrolled ? '20px' : '10px',
            backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
            boxShadow: isScrolled
               ? '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08), inset 0 1px 0 color-mix(in srgb, var(--foreground) 18%, transparent)'
               : '0 0 0 rgba(0, 0, 0, 0)',
            border: isScrolled ? '1px solid color-mix(in srgb, var(--border) 60%, transparent)' : '0px solid transparent'
         }}
         transition={{
            type: 'spring',
            stiffness: 90,
            damping: 38,
            mass: 1.2,
            velocity: 0
         }}
         style={{
            left: '50%',
            transform: 'translateX(-50%)',
            willChange: 'width, height, top, border-radius, background-color',
            overflow: 'hidden', // Prevent content from showing outside during transition
            padding: isScrolled ? '0px' : '10px' // Add padding when not scrolled
         }}
      >
         <div className="container mx-auto h-full">
            <motion.div
               className="flex items-center justify-between h-full"
               animate={{
                  paddingLeft: isScrolled ? '16px' : '0px',
                  paddingRight: isScrolled ? '16px' : '0px'
               }}
               transition={{
                  type: 'spring',
                  stiffness: 110,
                  damping: 36
               }}
            >
               {/* Back button */}
               <motion.div
                  animate={{
                     scale: isScrolled ? 0.95 : 1,
                     opacity: 1
                  }}
                  transition={{
                     type: 'spring',
                     stiffness: 300,
                     damping: 25
                  }}
               >
                  <Button
                     variant="outline"
                     size={isScrolled ? "sm" : "default"}
                     className={`transition-all duration-300 ${isScrolled
                        ? 'bg-card/70 backdrop-blur-sm border-border/80 hover:bg-card/80 text-foreground'
                        : 'bg-card/60 backdrop-blur-md border-border/60 hover:bg-card/80 text-foreground'
                        } shadow-lg hover:shadow-xl`}
                     asChild
                  >
                     <Link href={backHref}>
                        <ArrowLeft className={`${isScrolled ? 'h-4 w-4' : 'h-4 w-4'} mr-2 transition-all duration-300`} />
                        <span className={`${isScrolled ? 'text-sm' : 'text-sm'} transition-all duration-600`}>
                           {backLabel}
                        </span>
                     </Link>
                  </Button>
               </motion.div>

               {(showThemeToggle || showUserInfo) && (
                  <motion.div
                     className="flex items-center gap-3"
                     initial={false}
                     animate={{
                        scale: isScrolled ? 0.95 : 1,
                        opacity: 1
                     }}
                     transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 28
                     }}
                  >
                     {showThemeToggle && (
                        <ThemeToggle className="border-border/70 bg-card/70 text-foreground hover:bg-card/90" />
                     )}

                     {showUserInfo && (
                        fullName ? (
                           <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                              <span className={`flex items-center transition-all duration-300 text-foreground ${isScrolled ? 'text-sm' : 'text-sm'}`}>
                                 <Unlock className={`${isScrolled ? 'h-4 w-4' : 'h-4 w-4'} mr-1 transition-all duration-300`} />
                                 <span className="inline">
                                    {fullName}
                                 </span>
                              </span>
                              {profilePicture ? (
                                 <div className={`relative border-2 border-white/40 rounded-full overflow-hidden transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-12 h-12'}`}>
                                    <img
                                       src={profilePicture}
                                       alt={fullName}
                                       className="w-full h-full object-cover"
                                       referrerPolicy="no-referrer"
                                       crossOrigin="anonymous"
                                       onError={(e) => {
                                          console.error('Image load error:', profilePicture)
                                          e.currentTarget.style.display = 'none'
                                       }}
                                    />
                                 </div>
                              ) : (
                                 <Avatar className={`border-2 border-border/60 transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-12 h-12'}`}>
                                    <AvatarFallback className="bg-foreground/10 text-foreground font-semibold">
                                       {fullName.charAt(0)}
                                    </AvatarFallback>
                                 </Avatar>
                              )}
                           </Link>
                        ) : (
                           <span className={`flex items-center transition-all duration-300 text-foreground ${isScrolled ? 'text-sm' : 'text-sm'}`}>
                              <Lock className={`${isScrolled ? 'h-4 w-4' : 'h-4 w-4'} mr-1 transition-all duration-300`} />
                              <Link href="/login" className="underline ml-1 transition-all duration-300 text-foreground hover:text-foreground/70 font-medium">
                                 Login
                              </Link>
                           </span>
                        )
                     )}
                  </motion.div>
               )}
            </motion.div>
         </div>
      </motion.div>
   )
}
