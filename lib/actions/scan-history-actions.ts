"use server"

import { createServer } from "@/utils/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { deleteScanImage } from "./upload-scan-actions"

export type ScanHistoryItem = {
    id: string
    user_id: string
    spesies_id: string | null
    tanggal_identifikasi: string
    akurasi: number
    foto_scan: string | null
    catatan: string | null
    // Data dari relasi
    spesies?: {
        id: string
        nama: string // Scientific name
        nama_umum: string | null
    } | null
}

/**
 * Mengambil history scan user dengan limit dan offset untuk pagination
 */
export async function getScanHistory(
    limit: number = 10,
    offset: number = 0
): Promise<{ data: ScanHistoryItem[] | null; error: string | null; count: number }> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { data: null, error: "Unauthorized", count: 0 }
        }

        const supabase = await createServer()

        // Get total count
        const { count } = await supabase
            .from("hasil_identifikasi")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)

        // Get paginated data
        const { data, error } = await supabase
            .from("hasil_identifikasi")
            .select(
                `
        id,
        user_id,
        spesies_id,
        tanggal_identifikasi,
        akurasi,
        foto_scan,
        catatan,
        taksonomi_spesies (
          id,
          nama,
          nama_umum
        )
      `
            )
            .eq("user_id", user.id)
            .order("tanggal_identifikasi", { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            console.error("Error fetching scan history:", error)
            return { data: null, error: error.message, count: 0 }
        }

        // Transform data untuk match dengan type
        const transformedData = data?.map((item: any) => ({
            ...item,
            spesies: item.taksonomi_spesies,
        }))

        return { data: transformedData || [], error: null, count: count || 0 }
    } catch (error) {
        console.error("Unexpected error in getScanHistory:", error)
        return { data: null, error: "Internal server error", count: 0 }
    }
}

/**
 * Mengambil recent scans (5 terakhir) untuk ditampilkan di scanner page
 */
export async function getRecentScans(): Promise<{
    data: ScanHistoryItem[] | null
    error: string | null
}> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { data: [], error: null } // Return empty untuk user yang belum login
        }

        const supabase = await createServer()

        const { data, error } = await supabase
            .from("hasil_identifikasi")
            .select(
                `
        id,
        user_id,
        spesies_id,
        tanggal_identifikasi,
        akurasi,
        foto_scan,
        catatan,
        taksonomi_spesies (
          id,
          nama,
          nama_umum
        )
      `
            )
            .eq("user_id", user.id)
            .order("tanggal_identifikasi", { ascending: false })
            .limit(5)

        if (error) {
            console.error("Error fetching recent scans:", error)
            return { data: null, error: error.message }
        }

        // Transform data
        const transformedData = data?.map((item: any) => ({
            ...item,
            spesies: item.taksonomi_spesies,
        }))

        return { data: transformedData || [], error: null }
    } catch (error) {
        console.error("Unexpected error in getRecentScans:", error)
        return { data: null, error: "Internal server error" }
    }
}

/**
 * Menyimpan hasil scan baru ke database
 */
export async function saveScanResult(data: {
    spesies_id: string | null
    akurasi: number
    foto_scan: string | null
    catatan?: string | null
}): Promise<{ success: boolean; error: string | null; id?: string }> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { success: false, error: "Unauthorized" }
        }

        const supabase = await createServer()

        const { data: result, error } = await supabase
            .from("hasil_identifikasi")
            .insert({
                user_id: user.id,
                spesies_id: data.spesies_id,
                akurasi: data.akurasi,
                foto_scan: data.foto_scan,
                catatan: data.catatan || null,
            })
            .select("id")
            .single()

        if (error) {
            console.error("Error saving scan result:", error)
            return { success: false, error: error.message }
        }

        // Revalidate pages yang menampilkan history
        revalidatePath("/scanner")
        revalidatePath("/profile")

        return { success: true, error: null, id: result.id }
    } catch (error) {
        console.error("Unexpected error in saveScanResult:", error)
        return { success: false, error: "Internal server error" }
    }
}

/**
 * Menghapus satu item history scan
 */
export async function deleteScanHistory(
    scanId: string
): Promise<{ success: boolean; error: string | null }> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { success: false, error: "Unauthorized" }
        }

        const supabase = await createServer()

        // Get the scan data first to retrieve foto_scan URL
        const { data: scanData } = await supabase
            .from("hasil_identifikasi")
            .select("foto_scan")
            .eq("id", scanId)
            .eq("user_id", user.id)
            .single()

        // Delete from database
        const { error } = await supabase
            .from("hasil_identifikasi")
            .delete()
            .eq("id", scanId)
            .eq("user_id", user.id) // Pastikan user hanya bisa hapus history miliknya

        if (error) {
            console.error("Error deleting scan history:", error)
            return { success: false, error: error.message }
        }

        // Delete image from storage if exists and is from our bucket
        if (scanData?.foto_scan && scanData.foto_scan.includes("upload-scanner-user")) {
            await deleteScanImage(scanData.foto_scan)
            // Non-critical if delete fails, don't return error
        }

        revalidatePath("/scanner")
        revalidatePath("/profile")

        return { success: true, error: null }
    } catch (error) {
        console.error("Unexpected error in deleteScanHistory:", error)
        return { success: false, error: "Internal server error" }
    }
}

/**
 * Menghapus semua history scan user
 */
export async function clearAllScanHistory(): Promise<{
    success: boolean
    error: string | null
}> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { success: false, error: "Unauthorized" }
        }

        const supabase = await createServer()

        // Get all scan images first
        const { data: allScans } = await supabase
            .from("hasil_identifikasi")
            .select("foto_scan")
            .eq("user_id", user.id)

        // Delete all records
        const { error } = await supabase
            .from("hasil_identifikasi")
            .delete()
            .eq("user_id", user.id)

        if (error) {
            console.error("Error clearing scan history:", error)
            return { success: false, error: error.message }
        }

        // Delete all images from storage (non-blocking)
        if (allScans && allScans.length > 0) {
            Promise.all(
                allScans
                    .filter((scan) => scan.foto_scan && scan.foto_scan.includes("upload-scanner-user"))
                    .map((scan) => deleteScanImage(scan.foto_scan!))
            ).catch((err) => console.error("Error deleting images:", err))
        }

        revalidatePath("/scanner")
        revalidatePath("/profile")

        return { success: true, error: null }
    } catch (error) {
        console.error("Unexpected error in clearAllScanHistory:", error)
        return { success: false, error: "Internal server error" }
    }
}

/**
 * Mengambil statistik scan user
 */
export async function getScanStats(): Promise<{
    data: {
        total_scans: number
        average_accuracy: number
        recent_scans_count: number
        unique_species: number
    } | null
    error: string | null
}> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return {
                data: {
                    total_scans: 0,
                    average_accuracy: 0,
                    recent_scans_count: 0,
                    unique_species: 0,
                },
                error: null,
            }
        }

        const supabase = await createServer()

        // Get all scans for this user
        const { data, error } = await supabase
            .from("hasil_identifikasi")
            .select("id, akurasi, spesies_id, tanggal_identifikasi")
            .eq("user_id", user.id)

        if (error) {
            console.error("Error fetching scan stats:", error)
            return { data: null, error: error.message }
        }

        // Calculate stats
        const total_scans = data?.length || 0
        const average_accuracy =
            total_scans > 0
                ? data.reduce((sum, item) => sum + Number(item.akurasi), 0) / total_scans
                : 0

        // Count recent scans (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const recent_scans_count =
            data?.filter(
                (item) => new Date(item.tanggal_identifikasi) > sevenDaysAgo
            ).length || 0

        // Count unique species
        const uniqueSpeciesIds = new Set(
            data?.filter((item) => item.spesies_id).map((item) => item.spesies_id)
        )
        const unique_species = uniqueSpeciesIds.size

        return {
            data: {
                total_scans,
                average_accuracy: Number(average_accuracy.toFixed(2)),
                recent_scans_count,
                unique_species,
            },
            error: null,
        }
    } catch (error) {
        console.error("Unexpected error in getScanStats:", error)
        return { data: null, error: "Internal server error" }
    }
}

/**
 * Mengambil leaderboard - top users berdasarkan jumlah scan
 */
export async function getLeaderboard(
    limit: number = 10
): Promise<{
    data: Array<{
        user_id: string
        full_name: string | null
        avatar_url: string | null
        total_scans: number
        average_accuracy: number
        rank: number
    }> | null
    error: string | null
}> {
    try {
        const supabase = await createServer()

        // Aggregate scan counts per user
        const { data: scanCounts, error: scanError } = await supabase
            .from("hasil_identifikasi")
            .select("user_id, akurasi")

        if (scanError) {
            console.error("Error fetching scan counts:", scanError)
            return { data: null, error: scanError.message }
        }

        if (!scanCounts || scanCounts.length === 0) {
            return { data: [], error: null }
        }

        // Group by user_id and calculate stats
        const userStats = scanCounts.reduce((acc, scan) => {
            if (!acc[scan.user_id]) {
                acc[scan.user_id] = {
                    total_scans: 0,
                    total_accuracy: 0,
                }
            }
            acc[scan.user_id].total_scans += 1
            acc[scan.user_id].total_accuracy += scan.akurasi
            return acc
        }, {} as Record<string, { total_scans: number; total_accuracy: number }>)

        // Convert to array and sort by total_scans
        const sortedUsers = Object.entries(userStats)
            .map(([user_id, stats]) => ({
                user_id,
                total_scans: stats.total_scans,
                average_accuracy: Number((stats.total_accuracy / stats.total_scans).toFixed(2)),
            }))
            .sort((a, b) => b.total_scans - a.total_scans)
            .slice(0, limit)

        // Fetch user profiles
        const userIds = sortedUsers.map((u) => u.user_id)
        const { data: profiles, error: profileError } = await supabase
            .from("users")
            .select("id, full_name, avatar_url")
            .in("id", userIds)

        if (profileError) {
            console.error("Error fetching user profiles:", profileError)
            return { data: null, error: profileError.message }
        }

        // Merge stats with profiles
        const leaderboard = sortedUsers.map((user, index) => {
            const profile = profiles?.find((p) => p.id === user.user_id)
            return {
                user_id: user.user_id,
                full_name: profile?.full_name || null,
                avatar_url: profile?.avatar_url || null,
                total_scans: user.total_scans,
                average_accuracy: user.average_accuracy,
                rank: index + 1,
            }
        })

        return { data: leaderboard, error: null }
    } catch (error) {
        console.error("Unexpected error in getLeaderboard:", error)
        return { data: null, error: "Internal server error" }
    }
}
