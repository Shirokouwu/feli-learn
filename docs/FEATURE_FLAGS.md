# Feature Flags Configuration

## Overview

FeliLearn menggunakan environment variables sebagai feature flags untuk enable/disable fitur
tertentu. Ini berguna untuk development, testing, atau menyembunyikan fitur yang belum siap
production.

## Setup

### 1. Copy `.env.example` ke `.env.local`

```bash
cp .env.example .env.local
```

### 2. Isi credentials Supabase & Redis

Dapatkan dari dashboard masing-masing service.

### 3. Set Feature Flags

Edit `.env.local` dan ubah value `true` atau `false`

## Available Feature Flags

### `NEXT_PUBLIC_FEATURE_SCAN_HISTORY`

**Default:** `false`  
**Location:** Sidebar menu & `/profile/scans` route

**Enabled (`true`):**

- Menu "Riwayat Scan" muncul di sidebar
- Halaman `/profile/scans` bisa diakses
- User bisa lihat full scan history
- Tombol "Lihat Semua" muncul di Recent Scans (jika enabled)

**Disabled (`false`):**

- Menu "Riwayat Scan" hilang dari sidebar
- Halaman `/profile/scans` **DIBLOCK** - redirect ke `/profile` jika diakses langsung via URL
- User tidak bisa navigate ke history page dari sidebar
- Tombol "Lihat Semua" disembunyikan di Recent Scans
- **Route Protection:** Server-side guard mencegah akses via direct URL

**Security:** ✅ **Route Guard Active** - User tidak bisa bypass dengan mengetik URL manual

**Use Case:**

- Sembunyikan fitur saat development
- Hide untuk demo/presentation yang fokus ke fitur lain
- Disable saat masih testing database

### `NEXT_PUBLIC_FEATURE_LEADERBOARD`

**Default:** `true`  
**Location:** Profile page content

**Enabled (`true`):**

- Leaderboard card muncul di profile page
- Menampilkan top 10 users berdasarkan total scan

**Disabled (`false`):**

- Leaderboard card tidak render
- Layout jadi 1 kolom (hanya User Scan Stats)

**Use Case:**

- Sembunyikan jika data masih sedikit
- Disable untuk privacy concerns
- Hide saat belum setup RLS policy

### `NEXT_PUBLIC_FEATURE_RECENT_SCANS`

**Default:** `false`  
**Location:** Profile page content

**Enabled (`true`):**

- Section "Scan Terbaru" muncul
- Menampilkan 3 scan terakhir user
- Tombol "Lihat Semua" muncul di header dan footer (jika `FEATURE_SCAN_HISTORY=true`)
- Tombol "Lihat Semua" disembunyikan jika `FEATURE_SCAN_HISTORY=false` (tidak ada halaman tujuan)

**Disabled (`false`):**

- Section "Scan Terbaru" tidak render
- Profile page lebih minimalis
- User cuma lihat "oh barusan scan" (scan stats aja)

**Behavior dengan Feature Flag Lain:**

- `RECENT_SCANS=true` + `SCAN_HISTORY=true` → Section muncul dengan tombol "Lihat Semua"
- `RECENT_SCANS=true` + `SCAN_HISTORY=false` → Section muncul tanpa tombol "Lihat Semua"
- `RECENT_SCANS=false` → Section tidak muncul sama sekali

**Use Case:**

- Sembunyikan saat ingin fokus ke stats & leaderboard aja
- Hide jika user baru pertama kali pakai (belum ada history)
- Disable untuk UI yang lebih clean

## Configuration Examples

### Example 1: Full Features Enabled (Production Ready)

```env
NEXT_PUBLIC_FEATURE_SCAN_HISTORY=true
NEXT_PUBLIC_FEATURE_LEADERBOARD=true
NEXT_PUBLIC_FEATURE_RECENT_SCANS=true
```

**Result:**

- ✅ Sidebar: Profile Saya + Riwayat Scan
- ✅ Profile Page: Stats + Leaderboard + Recent Scans + Quick Actions

### Example 2: Minimal Profile (Demo Mode)

```env
NEXT_PUBLIC_FEATURE_SCAN_HISTORY=false
NEXT_PUBLIC_FEATURE_LEADERBOARD=false
NEXT_PUBLIC_FEATURE_RECENT_SCANS=false
```

**Result:**

- ✅ Sidebar: Profile Saya only
- ✅ Profile Page: Stats + Quick Actions only
- 🎯 Clean & simple untuk fokus demo scanner

### Example 3: Stats & Leaderboard Only (Recommended Awal)

```env
NEXT_PUBLIC_FEATURE_SCAN_HISTORY=false
NEXT_PUBLIC_FEATURE_LEADERBOARD=true
NEXT_PUBLIC_FEATURE_RECENT_SCANS=false
```

**Result:**

- ✅ Sidebar: Profile Saya only
- ✅ Profile Page: Stats + Leaderboard + Quick Actions
- 🎯 User cuma tau statistik dan ranking tanpa detail history

## How It Works

### 1. Environment Variable Check

```typescript
const showScanHistory = process.env.NEXT_PUBLIC_FEATURE_SCAN_HISTORY === "true"
```

### 2. Conditional Rendering

```typescript
// Sidebar
{
  showScanHistory && <MenuItem label="Riwayat Scan" />
}

// Profile Content
{
  showRecentScans && <RecentScansPreview />
}
{
  showLeaderboard && <LeaderboardCard />
}
```

### 3. Array Spread for Dynamic Menu Items

```typescript
items: [
  { label: "Profile Saya", href: "/profile" },
  ...(showScanHistory ? [{ label: "Riwayat Scan", href: "/profile/scans" }] : []),
]
```

## Testing Feature Flags

### Test 1: All Features OFF

```bash
# .env.local
NEXT_PUBLIC_FEATURE_SCAN_HISTORY=false
NEXT_PUBLIC_FEATURE_LEADERBOARD=false
NEXT_PUBLIC_FEATURE_RECENT_SCANS=false
```

**Expected:**

1. Sidebar cuma ada "Profile Saya"
2. Profile page cuma ada: Profile Header + Stats + Quick Actions
3. Tidak ada menu/link ke history page

### Test 2: Scan History ON, Others OFF

```bash
NEXT_PUBLIC_FEATURE_SCAN_HISTORY=true
NEXT_PUBLIC_FEATURE_LEADERBOARD=false
NEXT_PUBLIC_FEATURE_RECENT_SCANS=false
```

**Expected:**

1. Sidebar ada "Profile Saya" + "Riwayat Scan"
2. Profile page: Header + Stats + Quick Actions (NO leaderboard, NO recent scans)
3. Bisa navigate ke `/profile/scans` dari sidebar

### Test 3: All Features ON

```bash
NEXT_PUBLIC_FEATURE_SCAN_HISTORY=true
NEXT_PUBLIC_FEATURE_LEADERBOARD=true
NEXT_PUBLIC_FEATURE_RECENT_SCANS=true
```

**Expected:**

1. Sidebar ada semua menu
2. Profile page ada semua section
3. Full functionality

## Important Notes

### ⚠️ Restart Dev Server

Setelah edit `.env.local`, **WAJIB restart dev server:**

```bash
# Stop server (Ctrl+C)
# Then start again
bun dev
```

### ⚠️ Build Time Variables

Environment variables dengan prefix `NEXT_PUBLIC_` di-inject saat build time, jadi:

- Change .env.local → restart dev server
- Production: re-deploy untuk apply changes

### ✅ Route Protection

**Route Guard Active** untuk `/profile/scans`:

- Jika `FEATURE_SCAN_HISTORY=false`, halaman **DIBLOCK** sepenuhnya
- User yang coba akses via direct URL akan auto-redirect ke `/profile`
- Server-side check mencegah bypass
- Keamanan: User tidak bisa "ngakalin" dengan mengetik URL manual

**Implementation:**

```typescript
// app/profile/scans/page.tsx
if (!isScanHistoryEnabled) {
  redirect("/profile")
}
```

## Troubleshooting

### Feature flag tidak work?

1. ✅ Check typo di `.env.local`
2. ✅ Pastikan value `'true'` atau `'false'` (string, bukan boolean)
3. ✅ Restart dev server
4. ✅ Clear `.next` cache: `rm -rf .next` → `bun dev`

### Sidebar kosong?

1. ✅ Check semua feature flags di `.env.local`
2. ✅ Minimal harus ada menu "Profile Saya"

### Layout broken?

1. ✅ Check grid layout: `lg:grid-cols-2` jadi `lg:grid-cols-1` kalo leaderboard off
2. ✅ Conditional rendering harus pakai `&&` bukan ternary

## Future Features (Planned)

Tambahkan ke `.env.example` untuk future work:

```env
# Future Feature Flags
NEXT_PUBLIC_FEATURE_SOCIAL_SHARE=false     # Share hasil scan ke social media
NEXT_PUBLIC_FEATURE_ACHIEVEMENTS=false     # Badge & gamification system
NEXT_PUBLIC_FEATURE_ANALYTICS=false        # Advanced charts & graphs
NEXT_PUBLIC_FEATURE_EXPORT_DATA=false      # Export scan history to CSV/PDF
NEXT_PUBLIC_FEATURE_DARK_MODE=false        # Dark theme toggle
```

## Best Practices

1. **Default to `false`** untuk fitur baru yang masih development
2. **Document** setiap feature flag di file ini
3. **Test** dengan kombinasi ON/OFF untuk memastikan tidak crash
4. **Keep** `.env.local` di `.gitignore` (jangan commit)
5. **Update** `.env.example` setiap ada flag baru

## Related Files

- `.env.example` - Template dengan semua available flags
- `.env.local` - Local config (gitignored)
- `app/profile/components/ProfileLayoutClient.tsx` - Sidebar conditional rendering
- `app/profile/components/ProfileClient.tsx` - Profile page conditional rendering

## Summary

Feature flags ini memberikan kontrol penuh untuk show/hide fitur tanpa hapus code. Perfect untuk:

- 🎯 Demo/presentation dengan fokus tertentu
- 🧪 A/B testing
- 🚧 Hide fitur yang masih development
- 🔒 Privacy control
- 📊 Conditional features based on user role (future)

**Current Config (Recommended untuk awal):**

```env
NEXT_PUBLIC_FEATURE_SCAN_HISTORY=false   # Hide history menu
NEXT_PUBLIC_FEATURE_LEADERBOARD=true     # Show leaderboard
NEXT_PUBLIC_FEATURE_RECENT_SCANS=false   # Hide recent scans preview
```

Ini kasih profile page yang clean dengan stats & leaderboard tanpa "kebanyakan informasi history".
