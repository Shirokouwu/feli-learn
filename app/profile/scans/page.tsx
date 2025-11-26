import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ScanHistoryClient from './ScanHistoryClient'

export default async function ScanHistoryPage() {
    // Check feature flag first
    const isScanHistoryEnabled = process.env.NEXT_PUBLIC_FEATURE_SCAN_HISTORY === 'true'
    
    if (!isScanHistoryEnabled) {
        // Redirect to profile if feature is disabled
        redirect('/profile')
    }

    const user = await getCurrentUser()

    if (!user) {
        redirect('/auth/login')
    }

    return <ScanHistoryClient />
}
