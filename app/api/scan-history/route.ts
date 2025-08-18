import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"

// Sample data - nanti bisa diganti dengan data real dari database
const SAMPLE_HISTORY_DATA = [
    {
        id: "hist-001",
        name: "Harimau Sumatera",
        scientificName: "Panthera tigris sumatrae",
        imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=2940&auto=format&fit=crop",
        accuracy: 98.7,
        date: new Date(2023, 10, 15, 14, 30),
        conservationStatus: "Critically Endangered",
        family: "Felidae",
        genus: "Panthera",
    },
    {
        id: "hist-002",
        name: "Singa Afrika",
        scientificName: "Panthera leo",
        imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=2940&auto=format&fit=crop",
        accuracy: 97.3,
        date: new Date(2023, 10, 14, 9, 45),
        conservationStatus: "Vulnerable",
        family: "Felidae",
        genus: "Panthera",
    },
    {
        id: "hist-003",
        name: "Macan Tutul",
        scientificName: "Panthera pardus",
        imageUrl: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=2940&auto=format&fit=crop",
        accuracy: 95.8,
        date: new Date(2023, 10, 12, 16, 20),
        conservationStatus: "Vulnerable",
        family: "Felidae",
        genus: "Panthera",
    },
    {
        id: "hist-004",
        name: "Kucing Domestik",
        scientificName: "Felis catus",
        imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2943&auto=format&fit=crop",
        accuracy: 99.2,
        date: new Date(2023, 10, 10, 11, 15),
        conservationStatus: "Least Concern",
        family: "Felidae",
        genus: "Felis",
    },
    {
        id: "hist-005",
        name: "Cheetah",
        scientificName: "Acinonyx jubatus",
        imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?q=80&w=2940&auto=format&fit=crop",
        accuracy: 96.5,
        date: new Date(2023, 10, 8, 13, 50),
        conservationStatus: "Vulnerable",
        family: "Felidae",
        genus: "Acinonyx",
    },
    {
        id: "hist-006",
        name: "Lynx",
        scientificName: "Lynx lynx",
        imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?q=80&w=2940&auto=format&fit=crop",
        accuracy: 93.1,
        date: new Date(2023, 10, 5, 10, 30),
        conservationStatus: "Least Concern",
        family: "Felidae",
        genus: "Lynx",
    },
]

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            )
        }

        // TODO: Replace with actual database query
        // const supabase = await createClient()
        // const { data: scanHistory, error } = await supabase
        //   .from("scan_history")
        //   .select("*")
        //   .eq("user_id", user.id)
        //   .order("created_at", { ascending: false })

        // For now, return sample data
        return NextResponse.json(SAMPLE_HISTORY_DATA)

    } catch (error) {
        console.error("Error fetching scan history:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            )
        }

        // TODO: Delete all scan history for user from database
        // const supabase = await createClient()
        // const { error } = await supabase
        //   .from("scan_history")
        //   .delete()
        //   .eq("user_id", user.id)

        return NextResponse.json({
            message: "All scan history cleared successfully"
        })

    } catch (error) {
        console.error("Error clearing scan history:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
