import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createServer } from '@/utils/supabase/server'
import ProfileClient from './components/ProfileClient'

export default async function ProfilePage() {
  // Server-side authentication check
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Fetch profile data directly in server component
  const supabase = await createServer()

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    console.error('Profile fetch error:', error)
    redirect('/auth/login')
  }

  return <ProfileClient profile={profile} />
}
