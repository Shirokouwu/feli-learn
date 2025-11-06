import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createServer } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const type = searchParams.get("type"); // Check if this is password recovery
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createServer();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            console.log('user', data.user);

            // Check if this is a password recovery flow
            // If type=recovery, redirect to password reset page instead of home
            if (type === 'recovery') {
                console.log('🔐 Password recovery detected, redirecting to confirm page');
                return NextResponse.redirect(`${origin}/reset-password/confirm`);
            }

            // Check if user exists in our users table
            const { data: existingUser } = await supabase
                .from("users")
                .select("id, is_active")
                .eq("id", data.user.id)
                .single();

            // If user doesn't exist, create them (for OAuth users)
            if (!existingUser) {
                const provider = data.user.app_metadata?.provider || "oauth";
                await supabase.from("users").insert({
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
                    avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
                    provider: provider,
                    is_active: true,
                    role: "user",
                });
            } else {
                // User exists, update is_active to true (for email confirmed users) and last_sign_in_at
                await supabase
                    .from("users")
                    .update({
                        is_active: true, // Activate user when email is confirmed
                        last_sign_in_at: new Date().toISOString()
                    })
                    .eq("id", data.user.id);
            }

            const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === "development";
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
