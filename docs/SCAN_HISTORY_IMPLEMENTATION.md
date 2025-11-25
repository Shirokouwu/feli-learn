# Dokumentasi Implementasi History Scanning

## Overview

Implementasi lengkap untuk tracking dan menampilkan history scan identifikasi spesies. Setiap scan
yang berhasil akan otomatis tersimpan ke database dan dapat dilihat di halaman scanner dan profile.

## Database Schema

```sql
CREATE TABLE hasil_identifikasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    spesies_id UUID REFERENCES taksonomi_spesies(id) ON DELETE SET NULL,
    tanggal_identifikasi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    akurasi DECIMAL(5,2),
    foto_scan TEXT,
    catatan TEXT
);
```

## File Structure

### Server Actions

- `lib/actions/scan-history-actions.ts` - Server-side functions untuk CRUD operations

### Hooks

- `hooks/use-scan-history.ts` - Hook untuk full history dengan pagination, search, dan delete
- `hooks/use-recent-scans.ts` - Hook untuk recent scans (5 terakhir) dan statistics
- `hooks/use-scanner-logic.ts` - Updated untuk auto-save hasil scan ke database

### Components

- `components/scanner/scan-history-card.tsx` - Reusable card component untuk menampilkan history
  item
- `components/scanner/recent-scans.tsx` - Component untuk menampilkan recent scans di scanner page
- `components/scanner/scan-history.tsx` - Updated untuk menggunakan real data dari database

### Pages

- `app/profile/scans/page.tsx` - Server component untuk scan history page
- `app/profile/scans/ScanHistoryClient.tsx` - Client component dengan full history UI

## Features

### 1. Auto-Save Scan Results

Setiap scan yang berhasil otomatis tersimpan ke database dengan informasi:

- User ID
- Spesies ID (jika ditemukan di database)
- Akurasi identifikasi
- Foto scan (base64 atau URL)
- Catatan/notes

### 2. Recent Scans Display (Scanner Page)

- Menampilkan 5 scan terakhir user
- Card compact dengan info penting
- Auto-refresh setelah scan baru
- Click to view full history

### 3. Full History Page (Profile)

- Grid layout dengan card yang lebih detail
- Search & filter berdasarkan nama spesies
- Sort: Newest, Oldest, Highest Accuracy
- Delete individual item atau clear all
- Statistics cards:
  - Total Scans
  - Average Accuracy
  - Unique Species
  - Last 7 Days Count

### 4. Detail Dialog

- View lengkap hasil scan
- Foto scan
- Info spesies (nama, scientific name, family, genus)
- Status konservasi
- Akurasi identifikasi
- Tanggal scan
- Link ke taxonomy page

## API Reference

### Server Actions

#### `getScanHistory(limit, offset)`

Fetch paginated scan history dengan relasi ke taksonomi_spesies.

```typescript
const { data, error, count } = await getScanHistory(10, 0)
```

#### `getRecentScans()`

Fetch 5 scan terakhir user.

```typescript
const { data, error } = await getRecentScans()
```

#### `saveScanResult(data)`

Simpan hasil scan baru.

```typescript
const result = await saveScanResult({
  spesies_id: "uuid",
  akurasi: 95.5,
  foto_scan: "base64_or_url",
  catatan: "Notes",
})
```

#### `deleteScanHistory(scanId)`

Hapus satu item history.

```typescript
const { success, error } = await deleteScanHistory(scanId)
```

#### `clearAllScanHistory()`

Hapus semua history user.

```typescript
const { success, error } = await clearAllScanHistory()
```

#### `getScanStats()`

Dapatkan statistik scan user.

```typescript
const { data, error } = await getScanStats()
// data: { total_scans, average_accuracy, recent_scans_count, unique_species }
```

### Hooks

#### `useScanHistory(filters)`

```typescript
const {
  historyData, // Processed & filtered data
  loading, // Loading state
  deleteItem, // Function to delete item
  clearAll, // Function to clear all
  clearingAll, // Loading state for clear all
  deletingItem, // Loading state for delete
  refetch, // Manual refetch
  invalidate, // Invalidate cache
} = useScanHistory({
  search: "",
  sortBy: "newest", // "newest" | "oldest" | "accuracy"
})
```

#### `useRecentScans()`

```typescript
const {
  recentScans, // Last 5 scans
  isLoading,
  error,
  refetch,
} = useRecentScans()
```

#### `useScanStats()`

```typescript
const {
  stats: { total_scans, average_accuracy, recent_scans_count, unique_species },
  isLoading,
  error,
  refetch,
} = useScanStats()
```

## UI Components

### ScanHistoryCard

Reusable card dengan 2 mode: compact & full

```tsx
<ScanHistoryCard
  id={item.id}
  name={item.name}
  scientificName={item.scientificName}
  imageUrl={item.imageUrl}
  accuracy={item.accuracy}
  date={item.date}
  conservationStatus={item.conservationStatus}
  onView={() => handleView(item)}
  onDelete={() => handleDelete(item.id)}
  showActions={true}
  compact={false} // true for compact mode
/>
```

### RecentScans

Display recent scans di scanner page

```tsx
<RecentScans />
```

## User Flow

### Scanner Page

1. User melakukan scan
2. Hasil scan otomatis tersimpan ke database
3. Recent scans section otomatis update
4. User bisa click item untuk view detail
5. User bisa click "Lihat Semua" untuk full history

### Profile Page

1. User navigate ke Profile > Riwayat Scan
2. Melihat statistics cards (total, accuracy, dll)
3. Bisa search & filter history
4. Bisa delete individual atau clear all
5. Click item untuk view detail
6. Link ke taxonomy page untuk explore spesies

## Performance Optimizations

1. **React Query Caching**

   - Stale time 1-2 menit
   - Auto-invalidate setelah scan baru
   - Optimistic updates

2. **Pagination**

   - Server-side pagination ready (default 50 items)
   - Bisa extend untuk infinite scroll

3. **Image Optimization**

   - Next.js Image component
   - Lazy loading
   - Proper aspect ratios

4. **Animations**
   - Framer Motion untuk smooth transitions
   - AnimatePresence untuk enter/exit
   - Stagger animations di grid

## Testing Checklist

- [ ] Scan berhasil tersimpan ke database
- [ ] Recent scans muncul di scanner page
- [ ] Full history page menampilkan semua scan
- [ ] Search & filter berfungsi
- [ ] Delete item berfungsi
- [ ] Clear all berfungsi
- [ ] Statistics akurat
- [ ] Detail dialog menampilkan info lengkap
- [ ] Auto-refresh setelah scan baru
- [ ] Mobile responsive
- [ ] Loading states proper
- [ ] Error handling

## Future Enhancements

1. Export history to CSV/PDF
2. Share scan results
3. Compare multiple scans
4. Advanced filters (by date range, conservation status)
5. Infinite scroll pagination
6. Scan analytics & insights
7. Leaderboard/achievements

## Troubleshooting

### History tidak muncul

- Pastikan user sudah login
- Check console untuk error API
- Verify database connection
- Check RLS policies di Supabase

### Scan tidak tersimpan

- Check `saveScanResult` function di console
- Verify `hasil_identifikasi` table exists
- Check user_id dan spesies_id valid
- Review error logs

### Performance issues

- Check network tab untuk API calls
- Verify React Query cache settings
- Consider pagination if data > 100 items
- Optimize images (compress, resize)
