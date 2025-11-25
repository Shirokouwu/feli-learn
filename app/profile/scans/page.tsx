import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ScanHistoryClient from './ScanHistoryClient'

export default async function ScanHistoryPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/login')
    }

    return <ScanHistoryClient />
}
