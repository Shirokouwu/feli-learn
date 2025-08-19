import { createServer } from "@/utils/supabase/server"
import type { User } from "@supabase/supabase-js"

export async function getCurrentUser() {
    const supabase = await createServer()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    // Get additional user data from our users table
    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

    return {
        ...user,
        profile: userData
    }
}

export async function getUserById(id: string) {
    const supabase = await createServer()

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single()

    if (error) {
        return null
    }

    return data
}

export async function updateUserProfile(id: string, updates: {
    full_name?: string
    avatar_url?: string
}) {
    const supabase = await createServer()

    const { data, error } = await supabase
        .from("users")
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function isUserAdmin(userId: string): Promise<boolean> {
    const supabase = await createServer()

    const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single()

    return data?.role === "admin"
}
