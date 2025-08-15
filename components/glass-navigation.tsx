"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Unlock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

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
   return (
      <motion.div
         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg top-5 rounded-b-lg'
            : 'bg-transparent'
            } ${className}`}
         initial={false}
         animate={{
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)',
            width: isScrolled ? '40%' : '90%'
         }}
         style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: isScrolled ? '40%' : '90%'
         }}
      >
         <div className="container mx-auto px-4">
            <div className={`flex items-center justify-between py-4 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-4'
               }`}>
               {/* Back button */}
               <Button
                  variant="outline"
                  size="sm"
                  className={`transition-all duration-300 ${isScrolled
                     ? 'bg-white/20 backdrop-blur-sm border-teal-200/50 hover:bg-teal-50/20 text-teal-600 hover:text-teal-700'
                     : 'bg-white/80 backdrop-blur-sm border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
                     } shadow-md`}
                  asChild
               >
                  <Link href={backHref}>
                     <ArrowLeft className="h-4 w-4 mr-2" />
                     {backLabel}
                  </Link>
               </Button>

               {/* User info */}
               {showUserInfo && (
                  <motion.div
                     className="flex items-center"
                     initial={false}
                     animate={{
                        x: 0,
                        opacity: 1
                     }}
                  >
                     {fullName ? (
                        <div className="flex items-center space-x-2">
                           <span className="text-sm flex items-center transition-all duration-300 text-teal-600">
                              <Unlock className="h-4 w-4 mr-1" />
                              {fullName}
                           </span>
                           <Avatar className="border border-teal-200 w-10 h-10">
                              <AvatarImage src={profilePicture} alt={fullName} />
                              <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                           </Avatar>
                        </div>

                     ) : (
                        <span className="text-sm flex items-center transition-all duration-300 text-teal-600">
                           <Lock className="h-4 w-4 mr-1" />
                           Login Diperlukan
                           <Link href="/login" className="underline ml-1 transition-all duration-300 text-teal-600 hover:text-teal-700">
                              Login
                           </Link>
                        </span>
                     )}
                  </motion.div>
               )}
            </div>
         </div>
      </motion.div>
   )
}
