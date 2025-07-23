'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { loginSchema, registerSchema } from '@/lib/schemas'

export async function loginAction(prevState: any, formData: FormData) {
    const supabase = await createClient()

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

    const { data, error } = await supabase.auth.signInWithPassword(formDataLogin)

    if (error) {
        return {
            success: false,
            message: error.message || "Login gagal. Periksa email dan kata sandi Anda.",
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

    const supabase = await createClient()

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) {
        console.log(error)
        return {
            success: false,
            message: error.message || "Registrasi gagal. Silakan coba lagi.",
        }
    }

    // Insert user data into the database
    if (data.user) {
        const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            created_at: new Date().toISOString(),
            is_active: true,
            role: "user",
            provider: "email",
        })

        if (insertError) {
            console.log(insertError)
            return {
                success: false,
                message: insertError.message || "Gagal menyimpan data pengguna.",
            }
        }
    }

    return redirect(`/confirm-email?email=${encodeURIComponent(email)}`)

}

const signInWith = (provider: any) => async () => {
    const supabase = await createClient();

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
    const supabase = await createClient();
    await supabase.auth.signOut();
};

export const signinWithGoogle = signInWith("google");
