"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Database,
    Search,
    CheckCircle,
    XCircle,
    BarChart3,
    Download,
    BookOpen,
    TreePine,
    Leaf,
    ChevronDown,
    ChevronRight,
    List
} from "lucide-react"
import { fetchAllSpecies, fetchAllGenera } from "@/lib/supabase-v2"
import type { TaksonomiSpesies, TaksonomiGenus } from "@/lib/supabase-v2"

// Your folder data organized by genus
const FELIDAE_GENUS = {
    "Acinonyx": [
        "acinonyx-jubatus"  // Cheetah
    ],
    "Caracal": [
        "caracal-caracal"
    ],
    "Catopuma": [
        "catopuma-temminckii"
    ],
    "Felis": [
        "felis-bieti",
        "felis-catus",
        "felis-lybica",
        "felis-margarita",
        "felis-nigripes",
        "felis-silvestris"
    ],
    "Herpailurus": [
        "herpailurus-yagouaroundi"
    ],
    "Leopardus": [
        "leopardus-colocola",
        "leopardus-pardalis",
        "leopardus-wiedii"
    ],
    "Leptailurus": [
        "leptailurus-serval"
    ],
    "Lynx": [
        "lynx-canadensis",
        "lynx-lynx",
        "lynx-pardinus",
        "lynx-rufus"
    ],
    "Neofelis": [
        "neofelis-nebulosa"
    ],
    "Otocolobus": [
        "otocolobus-manul"
    ],
    "Panthera": [
        "panthera-leo",
        "panthera-onca",
        "panthera-pardus",
        "panthera-tigris",
        "panthera-uncia"
    ],
    "Prionailurus": [
        "prionailurus-bengalensis",
        "prionailurus-planiceps",
        "prionailurus-rubiginosus",
        "prionailurus-viverrinus"
    ],
    "Puma": [
        "puma-concolor"
    ]
}

// Flatten to get all species keys
const YOUR_FOLDER_DATA = Object.values(FELIDAE_GENUS).flat()

interface DatabaseStats {
    totalGenera: number
    totalSpecies: number
    generaWithSpecies: number
}

interface SpeciesWithGenus extends TaksonomiSpesies {
    genus?: TaksonomiGenus
}

export default function ListPage() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DatabaseStats | null>(null)
    const [species, setSpecies] = useState<SpeciesWithGenus[]>([])
    const [genera, setGenera] = useState<TaksonomiGenus[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "in-database" | "missing">("all")
    const [activeTab, setActiveTab] = useState("overview")
    const [expandedGenera, setExpandedGenera] = useState<Set<string>>(new Set())

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)

                const [speciesData, generaData] = await Promise.all([
                    fetchAllSpecies(),
                    fetchAllGenera()
                ])

                console.log("Total folder data:", YOUR_FOLDER_DATA.length)
                console.log("Folder data:", YOUR_FOLDER_DATA)

                setSpecies(speciesData)
                setGenera(generaData)

                console.log("Species in database:", speciesData.length)
                console.log("Species keys in database:", speciesData.map(s => s.kunci))

                const stats: DatabaseStats = {
                    totalGenera: generaData.length,
                    totalSpecies: speciesData.length,
                    generaWithSpecies: new Set(speciesData.map(s => s.genus_id)).size
                }
                setStats(stats)

            } catch (error) {
                console.error("Error loading data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Check which species from your folders are in database
    const speciesInDatabase = species.filter(s => YOUR_FOLDER_DATA.includes(s.kunci))
    const missingSpecies = YOUR_FOLDER_DATA.filter(folderKey =>
        !species.some(s => s.kunci === folderKey)
    )

    // Get unique genera from your folder data
    const yourGenera = Object.keys(FELIDAE_GENUS)
    const generaInDatabase = yourGenera.filter(genusName =>
        genera.some(g => g.nama.toLowerCase() === genusName.toLowerCase())
    )

    // Toggle genus expansion
    const toggleGenus = (genusName: string) => {
        const newExpanded = new Set(expandedGenera)
        if (newExpanded.has(genusName)) {
            newExpanded.delete(genusName)
        } else {
            newExpanded.add(genusName)
        }
        setExpandedGenera(newExpanded)
    }

    // Filter species based on search and status
    const filteredSpecies = species.filter(s => {
        const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.nama_umum && s.nama_umum.toLowerCase().includes(searchTerm.toLowerCase())) ||
            s.kunci.toLowerCase().includes(searchTerm.toLowerCase())

        if (filterStatus === "all") return matchesSearch
        if (filterStatus === "in-database") return matchesSearch && YOUR_FOLDER_DATA.includes(s.kunci)
        if (filterStatus === "missing") return matchesSearch && !YOUR_FOLDER_DATA.includes(s.kunci)

        return matchesSearch
    })

    const exportToCSV = () => {
        const headers = ["Nama Ilmiah", "Nama Umum", "Kunci", "Genus", "Status di Folder", "URL Gambar"]
        const csvData = [
            headers,
            ...species.map(s => [
                s.nama,
                s.nama_umum || "",
                s.kunci,
                s.genus?.nama || "",
                YOUR_FOLDER_DATA.includes(s.kunci) ? "Ada" : "Tidak Ada",
                s.url_gambar || ""
            ])
        ]

        const csvContent = csvData.map(row =>
            row.map(cell => `"${cell}"`).join(",")
        ).join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `database-species-checklist-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-emerald-700">Memuat data database...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="h-8 w-8 text-emerald-600" />
                        <h1 className="text-3xl font-bold text-emerald-900">
                            Database Species Checklist
                        </h1>
                    </div>
                    <p className="text-emerald-700">
                        Menampilkan status genus dan spesies yang ada di database vs folder data Anda
                    </p>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-emerald-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-emerald-700">
                                    <TreePine className="h-5 w-5" />
                                    Total Genus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-900">
                                    {stats?.totalGenera || 0}
                                </div>
                                <p className="text-sm text-emerald-600">
                                    {generaInDatabase.length} dari {yourGenera.length} genus Anda ada di database
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-emerald-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-emerald-700">
                                    <Leaf className="h-5 w-5" />
                                    Total Spesies
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-900">
                                    {stats?.totalSpecies || 0}
                                </div>
                                <p className="text-sm text-emerald-600">
                                    {speciesInDatabase.length} dari {YOUR_FOLDER_DATA.length} spesies Anda ada di database
                                </p>
                                <p className="text-xs text-gray-500">
                                    Total folder Anda: {YOUR_FOLDER_DATA.length} spesies
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-green-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="h-5 w-5" />
                                    Spesies Tersedia
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900">
                                    {speciesInDatabase.length}
                                </div>
                                <p className="text-sm text-green-600">
                                    Spesies dari folder Anda yang sudah ada di database
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border-red-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    <XCircle className="h-5 w-5" />
                                    Spesies Belum Ada
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-900">
                                    {missingSpecies.length}
                                </div>
                                <p className="text-sm text-red-600">
                                    Spesies dari folder Anda yang belum ada di database
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Content with Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="by-genus" className="flex items-center gap-2">
                                <TreePine className="h-4 w-4" />
                                By Genus
                            </TabsTrigger>
                            <TabsTrigger value="species-list" className="flex items-center gap-2">
                                <List className="h-4 w-4" />
                                Species List
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Your Folder Summary */}
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-blue-700">
                                            <Database className="h-5 w-5" />
                                            Ringkasan Folder Anda
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-white rounded-lg border">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {Object.keys(FELIDAE_GENUS).length}
                                                </div>
                                                <div className="text-sm text-gray-600">Genus</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg border">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {YOUR_FOLDER_DATA.length}
                                                </div>
                                                <div className="text-sm text-gray-600">Spesies</div>
                                            </div>
                                        </div>

                                        {/* Genus breakdown */}
                                        <div>
                                            <h4 className="font-medium text-blue-700 mb-2">Distribusi per Genus:</h4>
                                            <div className="space-y-1">
                                                {Object.entries(FELIDAE_GENUS).map(([genusName, speciesList]) => (
                                                    <div key={genusName} className="flex justify-between text-sm">
                                                        <span className="font-medium">{genusName}</span>
                                                        <span className="text-gray-600">{speciesList.length} spesies</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Database Status Summary */}
                                <Card className="border-emerald-200 bg-emerald-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-emerald-700">
                                            <BarChart3 className="h-5 w-5" />
                                            Status Database
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-white rounded-lg border">
                                                <div className="text-2xl font-bold text-emerald-600">
                                                    {speciesInDatabase.length}
                                                </div>
                                                <div className="text-sm text-gray-600">Sudah Ada</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg border">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {missingSpecies.length}
                                                </div>
                                                <div className="text-sm text-gray-600">Belum Ada</div>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium">Progress Kelengkapan</span>
                                                <span className="text-emerald-600 font-bold">
                                                    {Math.round((speciesInDatabase.length / YOUR_FOLDER_DATA.length) * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-emerald-500 h-3 rounded-full transition-all"
                                                    style={{
                                                        width: `${(speciesInDatabase.length / YOUR_FOLDER_DATA.length) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Status per genus */}
                                        <div>
                                            <h4 className="font-medium text-emerald-700 mb-2">Status per Genus:</h4>
                                            <div className="space-y-1">
                                                {Object.entries(FELIDAE_GENUS).map(([genusName, expectedSpecies]) => {
                                                    const inDb = expectedSpecies.filter(key =>
                                                        species.some(s => s.kunci === key)
                                                    ).length
                                                    const total = expectedSpecies.length
                                                    const percentage = Math.round((inDb / total) * 100)

                                                    return (
                                                        <div key={genusName} className="flex items-center justify-between text-sm">
                                                            <span className="font-medium">{genusName}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-600">{inDb}/{total}</span>
                                                                <div
                                                                    className={`w-2 h-2 rounded-full ${percentage === 100 ? 'bg-green-500' :
                                                                            percentage > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                                                        }`}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Missing Species Alert */}
                            {missingSpecies.length > 0 && (
                                <Card className="border-red-200 bg-red-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-red-700">
                                            <XCircle className="h-5 w-5" />
                                            Spesies yang Perlu Ditambahkan ({missingSpecies.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-red-600 mb-4">
                                            Spesies berikut ada di folder Anda tapi belum ada di database:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {Object.entries(FELIDAE_GENUS).map(([genusName, expectedSpecies]) => {
                                                const missing = expectedSpecies.filter(key =>
                                                    !species.some(s => s.kunci === key)
                                                )

                                                if (missing.length === 0) return null

                                                return (
                                                    <div key={genusName} className="bg-white rounded-lg p-3 border border-red-200">
                                                        <h5 className="font-medium text-red-700 mb-2">{genusName}</h5>
                                                        <div className="space-y-1">
                                                            {missing.map((key) => (
                                                                <div key={key} className="text-sm">
                                                                    <code className="bg-red-100 px-2 py-1 rounded text-xs">
                                                                        {key}
                                                                    </code>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-700">
                                        <BookOpen className="h-5 w-5" />
                                        Aksi Cepat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Button
                                            onClick={() => setActiveTab("by-genus")}
                                            variant="outline"
                                            className="flex items-center gap-2 h-auto p-4"
                                        >
                                            <TreePine className="h-5 w-5" />
                                            <div className="text-left">
                                                <div className="font-medium">Lihat per Genus</div>
                                                <div className="text-sm text-gray-500">Browse hierarkis</div>
                                            </div>
                                        </Button>

                                        <Button
                                            onClick={() => setActiveTab("species-list")}
                                            variant="outline"
                                            className="flex items-center gap-2 h-auto p-4"
                                        >
                                            <List className="h-5 w-5" />
                                            <div className="text-left">
                                                <div className="font-medium">Lihat Semua Spesies</div>
                                                <div className="text-sm text-gray-500">Tabel lengkap</div>
                                            </div>
                                        </Button>

                                        <Button
                                            onClick={exportToCSV}
                                            variant="outline"
                                            className="flex items-center gap-2 h-auto p-4"
                                        >
                                            <Download className="h-5 w-5" />
                                            <div className="text-left">
                                                <div className="font-medium">Export Data</div>
                                                <div className="text-sm text-gray-500">Download CSV</div>
                                            </div>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* By Genus Tab */}
                        <TabsContent value="by-genus" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TreePine className="h-5 w-5" />
                                        Browse by Genus ({Object.keys(FELIDAE_GENUS).length} genera)
                                    </CardTitle>
                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span>Ada di Database</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span>Belum Ada di Database</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(FELIDAE_GENUS).map(([genusName, expectedSpecies]) => {
                                            const isExpanded = expandedGenera.has(genusName)

                                            // Check which species from this genus are in database
                                            const speciesInDatabase = expectedSpecies.filter(key =>
                                                species.some(s => s.kunci === key)
                                            )
                                            const missingSpecies = expectedSpecies.filter(key =>
                                                !species.some(s => s.kunci === key)
                                            )

                                            // Get completion percentage
                                            const completionRate = (speciesInDatabase.length / expectedSpecies.length) * 100

                                            // Determine border and background color based on completion
                                            let borderColor = "border-gray-200"
                                            let bgColor = "bg-white"
                                            let headerColor = "text-gray-700"

                                            if (completionRate === 100) {
                                                borderColor = "border-green-300"
                                                bgColor = "bg-green-50"
                                                headerColor = "text-green-800"
                                            } else if (completionRate > 0) {
                                                borderColor = "border-amber-300"
                                                bgColor = "bg-amber-50"
                                                headerColor = "text-amber-800"
                                            } else {
                                                borderColor = "border-red-300"
                                                bgColor = "bg-red-50"
                                                headerColor = "text-red-800"
                                            }

                                            return (
                                                <div key={genusName} className={`border rounded-lg p-4 ${borderColor} ${bgColor}`}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-between p-0 h-auto hover:bg-transparent"
                                                        onClick={() => toggleGenus(genusName)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                            <div className="text-left">
                                                                <div className={`font-semibold text-lg ${headerColor}`}>
                                                                    {genusName}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {expectedSpecies.length} spesies total • {speciesInDatabase.length} ada di database
                                                                </div>
                                                                {/* Progress bar */}
                                                                <div className="mt-2 w-48">
                                                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                                        <span>Progress</span>
                                                                        <span>{Math.round(completionRate)}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                                        <div
                                                                            className={`h-2 rounded-full transition-all ${completionRate === 100 ? 'bg-green-500' :
                                                                                    completionRate > 0 ? 'bg-amber-500' : 'bg-red-500'
                                                                                }`}
                                                                            style={{ width: `${completionRate}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-green-100 text-green-700 border-green-300"
                                                            >
                                                                ✅ {speciesInDatabase.length}
                                                            </Badge>
                                                            {missingSpecies.length > 0 && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-red-100 text-red-700 border-red-300"
                                                                >
                                                                    ❌ {missingSpecies.length}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </Button>

                                                    {isExpanded && (
                                                        <div className="mt-4 pl-8 space-y-3">
                                                            {/* Species in database */}
                                                            {speciesInDatabase.length > 0 && (
                                                                <div>
                                                                    <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                                                                        <CheckCircle className="h-4 w-4" />
                                                                        Ada di Database ({speciesInDatabase.length})
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        {speciesInDatabase.map((key) => {
                                                                            const speciesData = species.find(s => s.kunci === key)
                                                                            return (
                                                                                <div
                                                                                    key={key}
                                                                                    className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                                                        <div>
                                                                                            <div className="font-medium italic text-gray-800">
                                                                                                {speciesData?.nama || key}
                                                                                            </div>
                                                                                            <div className="text-sm text-gray-600">
                                                                                                {speciesData?.nama_umum || "No common name"}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <code className="text-xs bg-white px-2 py-1 rounded border">
                                                                                        {key}
                                                                                    </code>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Missing species */}
                                                            {missingSpecies.length > 0 && (
                                                                <div>
                                                                    <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                                                                        <XCircle className="h-4 w-4" />
                                                                        Belum Ada di Database ({missingSpecies.length})
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        {missingSpecies.map((key) => (
                                                                            <div
                                                                                key={key}
                                                                                className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                                                    <div>
                                                                                        <div className="font-medium text-gray-800">
                                                                                            {key.split('-').map(word =>
                                                                                                word.charAt(0).toUpperCase() + word.slice(1)
                                                                                            ).join(' ')}
                                                                                        </div>
                                                                                        <div className="text-sm text-red-600">
                                                                                            Perlu ditambahkan ke database
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <code className="text-xs bg-white px-2 py-1 rounded border">
                                                                                    {key}
                                                                                </code>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Species List Tab */}
                        <TabsContent value="species-list" className="space-y-6">
                            {/* Controls */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Cari spesies (nama ilmiah, nama umum, atau kunci)..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={filterStatus === "all" ? "default" : "outline"}
                                                onClick={() => setFilterStatus("all")}
                                                size="sm"
                                            >
                                                Semua ({species.length})
                                            </Button>
                                            <Button
                                                variant={filterStatus === "in-database" ? "default" : "outline"}
                                                onClick={() => setFilterStatus("in-database")}
                                                size="sm"
                                                className="text-green-600 border-green-200"
                                            >
                                                Ada di Folder ({speciesInDatabase.length})
                                            </Button>
                                            <Button
                                                variant={filterStatus === "missing" ? "default" : "outline"}
                                                onClick={() => setFilterStatus("missing")}
                                                size="sm"
                                                className="text-red-600 border-red-200"
                                            >
                                                Tidak di Folder ({species.length - speciesInDatabase.length})
                                            </Button>
                                            <Button onClick={exportToCSV} variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Export CSV
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Species Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Daftar Spesies ({filteredSpecies.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Nama Ilmiah</TableHead>
                                                    <TableHead>Nama Umum</TableHead>
                                                    <TableHead>Kunci</TableHead>
                                                    <TableHead>Genus</TableHead>
                                                    <TableHead>Famili</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredSpecies.map((species) => {
                                                    const isInFolder = YOUR_FOLDER_DATA.includes(species.kunci)
                                                    return (
                                                        <TableRow key={species.id}>
                                                            <TableCell>
                                                                {isInFolder ? (
                                                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        Ada
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-red-100 text-red-700 border-red-200">
                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                        Tidak Ada
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-medium italic">
                                                                {species.nama}
                                                            </TableCell>
                                                            <TableCell>{species.nama_umum || "-"}</TableCell>
                                                            <TableCell>
                                                                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                                    {species.kunci}
                                                                </code>
                                                            </TableCell>
                                                            <TableCell>{species.genus?.nama || "-"}</TableCell>
                                                            <TableCell>{species.famili}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    )
}