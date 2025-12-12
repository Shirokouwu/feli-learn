import { Suspense } from "react"
import { connection } from "next/server"
import { Loader2 } from "lucide-react"
import { ConfirmResetPasswordForm } from "./confirm-form"

function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-gray-600">Memuat halaman reset password...</p>
            </div>
        </div>
    )
}

export default async function ConfirmResetPasswordPage() {
    // Mark this page as dynamic - it needs to read URL params at runtime
    await connection()

    return (
        <Suspense fallback={<LoadingFallback />}>
            <ConfirmResetPasswordForm />
        </Suspense>
    )
}

