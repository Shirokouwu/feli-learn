"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { Calendar, Clock, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getConservationStatusColor } from "@/lib/conservation-utils"

export interface ScanHistoryCardProps {
    id: string
    name: string
    scientificName: string
    imageUrl: string
    accuracy: number
    date: Date
    conservationStatus?: string
    onView?: () => void
    onDelete?: () => void
    showActions?: boolean
    compact?: boolean
}

export function ScanHistoryCard({
    id,
    name,
    scientificName,
    imageUrl,
    accuracy,
    date,
    conservationStatus,
    onView,
    onDelete,
    showActions = true,
    compact = false,
}: ScanHistoryCardProps) {
    if (compact) {
        // Compact version untuk recent scans di scanner page
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 p-3 border border-emerald-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={onView}
            >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{name}</h4>
                            <p className="text-xs text-gray-500 italic truncate">{scientificName}</p>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-emerald-600 text-xs px-2 py-0.5 flex-shrink-0">
                            {accuracy.toFixed(1)}%
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(date, "d MMM", { locale: localeId })}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(date, "HH:mm", { locale: localeId })}
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Full version untuk history page
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="border border-emerald-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group"
        >
            <div className="relative h-48">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg drop-shadow-sm truncate">{name}</h4>
                            <p className="text-sm text-white/90 italic drop-shadow-sm truncate">
                                {scientificName}
                            </p>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-emerald-600 flex-shrink-0">
                            {accuracy.toFixed(1)}%
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(date, "d MMM yyyy", { locale: localeId })}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {format(date, "HH:mm", { locale: localeId })}
                        </div>
                    </div>

                    {showActions && (
                        <div className="flex gap-1">
                            {onView && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={onView}
                                >
                                    <Eye className="h-4 w-4 text-emerald-600" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={onDelete}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {conservationStatus && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <Badge
                            className={`${getConservationStatusColor(conservationStatus)} text-xs px-2 py-1`}
                        >
                            {conservationStatus}
                        </Badge>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
