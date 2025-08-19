import { NextResponse } from "next/server"
import { getCurrentUser, updateUserProfile } from "@/lib/auth"
import { createServer } from "@/utils/supabase/server"

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            )
        }

        // Fetch complete user profile from database
        const supabase = await createServer()
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching user profile:', profileError)
            // If database fails, fallback to auth data
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            full_name: profile?.full_name || user.user_metadata?.full_name || "",
            avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || "",
            bio: profile?.bio || "",
            location: profile?.location || "",
            website: profile?.website || "",
            role: profile?.role || "user",
            created_at: profile?.created_at || user.created_at,
            updated_at: profile?.updated_at || user.updated_at,
            last_sign_in_at: profile?.last_sign_in_at || user.last_sign_in_at
        })
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { full_name, avatar_url, bio, location, website } = body

        const supabase = await createServer()

        // Update in users table
        const { data, error } = await supabase
            .from("users")
            .update({
                full_name,
                avatar_url,
                bio,
                location,
                website,
                updated_at: new Date().toISOString()
            })
            .eq("id", user.id)
            .select()
            .single()

        if (error) {
            console.error("Error updating profile:", error)
            return NextResponse.json(
                { error: "Failed to update profile" },
                { status: 500 }
            )
        }

        // Also update user metadata in Supabase Auth if full_name or avatar_url changed
        if (full_name !== undefined || avatar_url !== undefined) {
            const currentMetadata = user.user_metadata || {}
            const updatedMetadata = {
                ...currentMetadata,
                ...(full_name !== undefined && { full_name }),
                ...(avatar_url !== undefined && { avatar_url })
            }

            const { error: authError } = await supabase.auth.updateUser({
                data: updatedMetadata
            })

            if (authError) {
                console.error("Error updating auth metadata:", authError)
                // Continue anyway since main profile was updated successfully
                // This is just sync for consistency
            }
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error updating user profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
