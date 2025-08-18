"use client"

import { motion } from "framer-motion";


export default function SkeletonProfile() {
   return (
      <>
         <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="mb-6"
            >
               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Cover Photo Skeleton */}
                  <div className="h-32 bg-gradient-to-r from-emerald-400 to-emerald-600 relative">
                     <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=800')] opacity-10 mix-blend-overlay"></div>
                  </div>

                  {/* Profile Content Skeleton */}
                  <div className="px-6 pb-6 relative">
                     {/* Avatar Skeleton */}
                     <div className="absolute -top-12 left-6 ring-4 ring-white rounded-full">
                        <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                     </div>

                     {/* Profile Info Skeleton */}
                     <div className="pt-16">
                        <div className="space-y-3">
                           <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                           <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                           <div className="flex gap-4">
                              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Stats Skeleton */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                     <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                     </div>
                     <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
               ))}
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6">
               <div className="flex gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ))}
               </div>
               <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
}