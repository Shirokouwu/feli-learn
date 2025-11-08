'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServer } from '@/utils/supabase/server'
import { loginSchema, registerSchema } from '@/lib/schemas'

export async function loginAction(prevState: any, formData: FormData) {
    const supabase = await createServer()

    const formDataLogin = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const validatedFields = loginSchema.safeParse(formDataLogin)

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validasi gagal. Periksa kembali input Anda.",
        }
    }

    const checkUserRegistered = await supabase.from('users').select('id').eq('email', formDataLogin.email).single()

    console.log(checkUserRegistered)

    if (checkUserRegistered.error || !checkUserRegistered.data.id) {
        return {
            success: false,
            message: "Email tidak terdaftar. Silakan daftar terlebih dahulu.",
            errors: { email: ["Email tidak terdaftar. Silakan daftar terlebih dahulu."] }
        }
    }

    const { data, error } = await supabase.auth.signInWithPassword(formDataLogin)

    if (error) {
        console.error("❌ Login error:", error)
        console.error("Error details:", {
            message: error.message,
            status: error.status,
            name: error.name
        })

        // Return user-friendly error messages
        let errorMessage = "Login gagal. Periksa email dan kata sandi Anda."

        if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Email atau kata sandi salah. Silakan coba lagi."
        } else if (error.message.includes("Email not confirmed")) {
            errorMessage = "Email Anda belum diverifikasi. Silakan cek email Anda."
        } else if (error.message.includes("Too many requests")) {
            errorMessage = "Terlalu banyak percobaan login. Silakan coba lagi nanti."
        }

        return {
            success: false,
            message: errorMessage,
            errors: {}
        }
    }

    // Update last_sign_in_at in the database
    if (data.user) {
        await supabase.from("users").update({ last_sign_in_at: new Date().toISOString() }).eq("id", data.user.id)
    }

    revalidatePath('/', 'layout')
    redirect('/')


}

export async function registerAction(prevState: any, formData: FormData) {

    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const terms = formData.get("terms") === "on"

    // Validate form data
    const validatedFields = registerSchema.safeParse({
        fullName,
        email,
        password,
        confirmPassword,
        terms,
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors)
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validasi gagal. Periksa kembali input Anda.",
        }
    }

    const supabase = await createServer()

    // Sign up with Supabase (auto trigger will create user record)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/callback`
        },
    })

    console.log("Sign up result:", { data, error });

    if (error) {
        console.error("❌ Registration error:", error)
        console.error("Error details:", {
            message: error.message,
            status: error.status,
            name: error.name
        })

        // Return user-friendly error messages
        let errorMessage = "Registrasi gagal. Silakan coba lagi."

        if (error.message.includes("User already registered")) {
            errorMessage = "Email sudah terdaftar. Silakan gunakan email lain atau login."
        } else if (error.message.includes("Password should be")) {
            errorMessage = "Password terlalu lemah. Minimal 6 karakter."
        } else if (error.message.includes("Invalid email")) {
            errorMessage = "Format email tidak valid."
        } else if (error.message.includes("rate limit")) {
            errorMessage = "Terlalu banyak percobaan. Silakan coba lagi nanti."
        }

        return {
            success: false,
            message: errorMessage,
            errors: {}
        }
    }

    if (data.user) {
        console.log("User created:", {
            id: data.user.id,
            email: data.user.email,
            email_confirmed_at: data.user.email_confirmed_at,
            confirmation_sent_at: data.user.confirmation_sent_at
        });
    }

    // User record is automatically created by the auto trigger
    // No manual insert needed

    console.log("Redirecting to confirm-email page");
    return redirect(`/confirm-email?email=${encodeURIComponent(email)}`)

}

const signInWith = (provider: any) => async () => {
    const supabase = await createServer();

    const auth_callback_url = `${process.env.SITE_URL}/api/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    });

    console.log(data);

    if (error) {
        console.log(error);
    }

    if (data?.url) {
        redirect(data.url);
    } else {
        console.log("No URL returned from OAuth sign-in");
    }
};

export const signOut = async () => {
    const supabase = await createServer();
    await supabase.auth.signOut();
};

export const signinWithGoogle = signInWith("google");
