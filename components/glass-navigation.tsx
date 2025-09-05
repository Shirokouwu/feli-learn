"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Unlock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"

interface GlassNavigationProps {
   isScrolled: boolean
   fullName?: string
   backHref?: string
   backLabel?: string
   showUserInfo?: boolean
   className?: string
   profilePicture?: string // Optional profile picture URL
}

export function GlassNavigation({
   isScrolled,
   fullName,
   backHref = "/",
   backLabel = "Kembali",
   showUserInfo = true,
   className = "",
   profilePicture = ""
}: GlassNavigationProps) {
   const isMobile = useMobile()


   return (
      <motion.div
         className={`fixed z-50 ${className}`}
         initial={false}
         animate={{
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0)',
            width: isScrolled ? '50%' : isMobile ? '100%' : '90%',
            height: isScrolled ? '60px' : '80px',
            top: isScrolled ? '16px' : '0px',
            borderRadius: isScrolled ? '20px' : '10px',
            backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
            boxShadow: isScrolled
               ? '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
               : '0 0 0 rgba(0, 0, 0, 0)',
            border: isScrolled ? '1px solid rgba(255, 255, 255, 0.2)' : '0px solid rgba(255, 255, 255, 0)'
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
                        ? 'bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/40 text-teal-700 hover:text-teal-800'
                        : 'bg-white/80 backdrop-blur-sm border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
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

               {/* User info */}
               {showUserInfo && (
                  <motion.div
                     className="flex items-center"
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
                     {fullName ? (
                        <div className="flex items-center space-x-2">
                           <span className={`flex items-center transition-all duration-300 text-teal-700 ${isScrolled ? 'text-sm' : 'text-sm'}`}>
                              <Unlock className={`${isScrolled ? 'h-4 w-4' : 'h-4 w-4'} mr-1 transition-all duration-300`} />
                              <span className="inline">
                                 {fullName}
                              </span>
                           </span>
                           <Avatar className={`border-2 border-white/40 transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-12 h-12'}`}>
                              <AvatarImage src={profilePicture} alt={fullName} />
                              <AvatarFallback className="bg-white/20 text-teal-800 font-semibold">
                                 {fullName.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                        </div>
                     ) : (
                        <span className={`flex items-center transition-all duration-300 text-teal-700 ${isScrolled ? 'text-sm' : 'text-sm'}`}>
                           <Lock className={`${isScrolled ? 'h-4 w-4' : 'h-4 w-4'} mr-1 transition-all duration-300`} />
                           <Link href="/login" className="underline ml-1 transition-all duration-300 text-teal-700 hover:text-teal-800 font-medium">
                              Login
                           </Link>
                        </span>
                     )}
                  </motion.div>
               )}
            </motion.div>
         </div>
      </motion.div>
   )
}
