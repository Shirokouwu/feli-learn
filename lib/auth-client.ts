import { createClient } from "@/utils/supabase/client";

export function getAuthClient() {
    const { auth } = createClient();
    return auth;
}

export const getUserClient = async () => {
    const { data: { user }, error } = await createClient().auth.getUser();

    if (error || !user) {
        return null;
    }

    // Get additional user data from our users table
    const { data: userData } = await createClient()
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    return {
        ...user,
        profile: userData
    };
}