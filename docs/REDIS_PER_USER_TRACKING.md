# Redis Per-User Scanner Tracking

## Overview

Implementasi tracking scanner per-user menggunakan Redis (Upstash) dengan support untuk:

- **Global Stats**: Total scan dari semua user
- **Per-User Stats**: Track scan individual untuk setiap user yang login

## Architecture

### Redis Key Structure

#### Global Stats (semua user)

```
scan:global:today:2025-11-04  → Counter scan hari ini (global)
scan:global:total             → Total scan keseluruhan (global)
```

#### Per-User Stats

```
scan:user:{userId}:today:2025-11-04  → Counter scan hari ini (per user)
scan:user:{userId}:total             → Total scan user tersebut
```

## API Endpoints

### 1. `/api/scan-stats` (Global Stats)

**GET** - Fetch global scan statistics

```json
{
  "todayScans": 150,
  "totalScans": 5432
}
```

**POST** - Increment scan counter (both global and per-user)

- Increment global counter
- Jika user login, increment per-user counter juga
- Return: `{ message: "Scan recorded", userId: string | null }`

### 2. `/api/scan-stats/user` (Per-User Stats)

**GET** - Fetch per-user scan statistics (requires authentication)

```json
{
  "todayScans": 5,
  "totalScans": 47,
  "userId": "user-uuid-here"
}
```

**401 Error** - Jika user belum login

```json
{
  "error": "Unauthorized - Please login to view your stats"
}
```

## Hooks

### `useScanStats()`

Fetch global scan statistics (semua user)

```tsx
const { data, isLoading, isError, refetch } = useScanStats()
```

### `useUserScanStats()`

Fetch per-user scan statistics (user yang login)

```tsx
const { data, isLoading, isError, refetch } = useUserScanStats()
// Returns error jika user belum login
```

### `useIncrementScan()`

Increment scan counter (global + per-user)

```tsx
const mutation = useIncrementScan()
mutation.mutate() // Trigger scan increment
```

## Components

### `ScanCounter`

Component untuk display scan statistics dengan toggle view

**Props:**

- `className?: string` - CSS classes
- `showUserStats?: boolean` - Enable toggle antara global dan per-user stats

**Usage:**

```tsx
// Show global stats only
<ScanCounter />

// Show with toggle (global/user)
<ScanCounter showUserStats={true} />
```

**Features:**

- Toggle button untuk switch antara Global Stats dan Your Stats
- Live indicator (loading/error/live)
- Animated counter
- Auto-refresh every 2 minutes
- Click to retry on error

### `UserScanStatsCard`

Component khusus untuk menampilkan detailed user scan statistics (untuk profile page)

**Props:** None (automatically fetches user stats)

**Usage:**

```tsx
import { UserScanStatsCard } from "@/app/profile/components/UserScanStatsCard"

;<UserScanStatsCard />
```

**Features:**

- Display total scans dengan animated counter
- Today's scan count
- Percentage dari total
- Motivational messages berdasarkan achievement level
- Loading skeleton
- Error state handling
- Animated entrance dengan framer-motion
- Decorative background elements

## Flow Diagram

```
User melakukan scan
       ↓
POST /api/scan-stats
       ↓
   [Check Auth]
       ↓
   ┌─────────────┐
   │ Increment:  │
   │ - Global    │
   │ - Per-User* │ (*if authenticated)
   └─────────────┘
       ↓
   Return success
       ↓
   Invalidate React Query cache
       ↓
   Auto-refetch stats
```

## Benefits

### ✅ Global Stats

- Tracking total penggunaan aplikasi
- Monitoring aktivitas keseluruhan
- Analytics untuk dashboard admin

### ✅ Per-User Stats

- User dapat track scan mereka sendiri
- Gamification (leaderboard, achievements)
- User engagement metrics
- Personal usage history

### ✅ Dual Tracking

- Satu POST request = update both
- Efisien dan consistent
- No additional overhead

## Implementation Details

### Authentication

- Menggunakan Supabase Auth
- Session-based user identification
- Graceful fallback untuk guest users

### Caching Strategy

- React Query untuk client-side caching
- Stale time: 30 seconds
- Refetch interval: 2 minutes
- Refetch on window focus: enabled

### Error Handling

- Retry logic untuk failed requests
- Visual error indicators
- Click to retry functionality
- Graceful degradation

## Environment Variables

```bash
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

## Example Usage

### Scanner Page (With Toggle)

```tsx
import { ScanCounter } from "@/components/scanner"

export default function ScannerPage() {
  return (
    <div>
      {/* User dapat toggle antara global dan personal stats */}
      <ScanCounter showUserStats={true} />
    </div>
  )
}
```

### Profile Page (Detailed Stats)

```tsx
import { UserScanStatsCard } from "@/app/profile/components/UserScanStatsCard"

export default function ProfilePage() {
  return (
    <div>
      {/* Detailed scan statistics untuk user profile */}
      <UserScanStatsCard />
    </div>
  )
}
```

### Homepage (Global Stats Only)

```tsx
import { ScanCounter } from "@/components/scanner"

export default function HomePage() {
  return (
    <div>
      {/* Global stats tanpa toggle */}
      <ScanCounter />
    </div>
  )
}
```

### Custom Hook Usage

```tsx
"use client"

import { useScanStats, useUserScanStats } from "@/hooks"

export function CustomStatsDisplay() {
  const globalStats = useScanStats()
  const userStats = useUserScanStats()

  return (
    <div>
      <h2>Global: {globalStats.data?.totalScans}</h2>
      <h2>Your Scans: {userStats.data?.totalScans}</h2>
    </div>
  )
}
```

## Testing

### Test Global Stats

```bash
# GET global stats
curl http://localhost:3000/api/scan-stats

# POST increment
curl -X POST http://localhost:3000/api/scan-stats
```

### Test User Stats

```bash
# GET user stats (requires auth cookie)
curl -H "Cookie: sb-access-token=..." http://localhost:3000/api/scan-stats/user
```

## Future Enhancements

- [ ] Leaderboard untuk top scanners
- [ ] Weekly/Monthly stats
- [ ] Achievement system
- [ ] Export stats to CSV
- [ ] Admin dashboard untuk monitoring
- [ ] Rate limiting per user
- [ ] Scan history dengan timestamps

## Notes

- Redis keys dengan format `:today:YYYY-MM-DD` otomatis reset tiap hari
- Global stats tetap di-maintain untuk backward compatibility
- Per-user stats opsional (tidak break existing functionality)
- Guest users tetap ter-track di global stats
