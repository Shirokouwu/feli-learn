import { createServer } from "@/utils/supabase/server"
import { NextResponse } from "next/server"




export async function POST(request: Request) {
  const supabase = await createServer()
  try {
    const { id, type } = await request.json()

     console.log(`Tracked ${type} view for ID: ${id}`)

    if (!id || !type || (type !== "species" && type !== "genus" && type !== "family")) {
      return NextResponse.json(
        { error: "Invalid request. Provide id and type (species, genus, or family)" },
        { status: 400 },
      )
    }

    // Jika ID adalah "felidae", ini adalah node keluarga dan tidak perlu dilacak di database
    // karena bukan UUID yang valid
    if (id === "felidae") {
      return NextResponse.json({ success: true, message: "Family node view tracked in memory only" })
    }

    const tableName = "species_clicks" // Table name
    const now = new Date().toISOString()

    // Cek apakah record sudah ada
    const { data: existingRecord, error: fetchError } = await supabase
      .from(tableName)
      .select("*")
      .or(`species_id.eq.${id},genus_id.eq.${id}`)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 adalah "no rows returned"
      console.error("Error checking existing record:", fetchError)
      throw fetchError
    }

    if (existingRecord) {
      // Update existing record
      const { data, error } = await supabase
        .from(tableName)
        .update({
          click_count: existingRecord.click_count + 1,
          last_clicked_at: now,
        })
        .eq("id", existingRecord.id)
        .select()

      if (error) {
        console.error("Error updating click count:", error)
        throw error
      }

      return NextResponse.json({ success: true, data, updated: true })
    } else {
      // Insert new record
      let insertData = {}

      if (type === "species") {
        insertData = {
          species_id: id,
          genus_id: null,
          click_count: 1,
          last_clicked_at: now,
        }
      } else if (type === "genus") {
        insertData = {
          species_id: null,
          genus_id: id,
          click_count: 1,
          last_clicked_at: now,
        }
      }

      const { data, error } = await supabase.from(tableName).insert(insertData).select()

      if (error) {
        // Jika terjadi error unique constraint, coba update lagi
        // Ini menangani kasus race condition
        if (error.code === "23505") {
          // PostgreSQL unique violation code
          console.log("Unique constraint violation, trying update instead")

          // Coba dapatkan record yang sudah ada
          const { data: conflictRecord, error: conflictFetchError } = await supabase
            .from(tableName)
            .select("*")
            .or(`species_id.eq.${id},genus_id.eq.${id}`)
            .single()

          if (conflictFetchError) {
            console.error("Error fetching conflict record:", conflictFetchError)
            throw conflictFetchError
          }

          // Update record yang sudah ada
          const { data: updatedData, error: updateError } = await supabase
            .from(tableName)
            .update({
              click_count: conflictRecord.click_count + 1,
              last_clicked_at: now,
            })
            .eq("id", conflictRecord.id)
            .select()

          if (updateError) {
            console.error("Error updating after conflict:", updateError)
            throw updateError
          }

          return NextResponse.json({ success: true, data: updatedData, conflictResolved: true })
        } else {
          console.error("Error inserting click record:", error)
          throw error
        }
      }

      return NextResponse.json({ success: true, data, inserted: true })
    }
  } catch (error) {
    console.error("Error tracking click:", error)
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 })
  }
}
