"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BarChart3, PieChartIcon, Calendar } from "lucide-react"
import type { TaksonomiSpesies, TaksonomiKonservasi } from "@/lib/supabase-v2"

interface SpeciesVisualizationsProps {
  species: (TaksonomiSpesies & { konservasi: TaksonomiKonservasi | null })[]
  conservationStatuses: string[]
  getConservationStatus: (konservasi: TaksonomiKonservasi | null) => string | null
}

export function CatalogVisualizations({
  species,
  conservationStatuses,
  getConservationStatus,
}: SpeciesVisualizationsProps) {
  // Prepare data for visualizations
  const populationData = species
    .filter((s) => s.konservasi && s.konservasi.total_populasi)
    .slice(0, 5)
    .map((s) => ({
      name: s.nama_umum || s.nama,
      value: Number.parseInt(s.konservasi?.total_populasi || "0", 10) || 0,
    }))

  const conservationData = conservationStatuses.map((status) => {
    const count = species.filter((s) => {
      const conservationStatus = getConservationStatus(s.konservasi)
      return conservationStatus === status
    }).length
    return { status, count }
  })

  const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6"]
  const lastUpdated = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <motion.div
      key="visualizations"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Populasi Spesies
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={populationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-emerald-600" />
            Status Konservasi
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={conservationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            >
              {conservationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Distribusi berdasarkan data terkini
          </p>
        </div>
      </div>
    </motion.div>
  )
}
