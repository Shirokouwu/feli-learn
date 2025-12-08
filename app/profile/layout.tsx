import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createServer } from '@/utils/supabase/server'
import { ProfileLayoutClient } from './components/ProfileLayoutClient'

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Server-side authentication check
    const user = await getCurrentUser()
    if (!user) {
        redirect('/auth/login')
    }

    // Fetch user info for sidebar
    const supabase = await createServer()
    const { data: profile } = await supabase
        .from('users')
        .select('full_name, email, role, avatar_url')
        .eq('id', user.id)
        .single()

    return (
        <ProfileLayoutClient userInfo={profile || undefined}>
            {children}
        </ProfileLayoutClient>
    )
}
