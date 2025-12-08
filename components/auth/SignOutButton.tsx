"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"
import { useFormStatus } from "react-dom"
import * as React from "react"

interface SignOutButtonProps extends React.ComponentProps<typeof Button> {
    action: (formData: FormData) => Promise<any>
}

function SubmitButton(props: React.ComponentProps<typeof Button>) {
    const { pending } = useFormStatus()
    return (
        <Button
            {...props}
            type="submit"
            aria-busy={pending}
            disabled={pending || props.disabled}
        >
            {pending ? (
                <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing out…</span>
                </span>
            ) : (
                <span className="inline-flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </span>
            )}
        </Button>
    )
}

export default function SignOutButton({ action, className, ...rest }: SignOutButtonProps) {
    return (
        <form action={action}>
            <SubmitButton
                className={className}
                {...rest}
            />
        </form>
    )
}
