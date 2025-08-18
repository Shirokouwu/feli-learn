# Profile and Auth Metadata Synchronization

## Problem

Ketika user mengupdate `full_name` atau `avatar_url` melalui form profile, data hanya tersimpan di
tabel `users` (custom table) tetapi tidak tersinkronisasi dengan `raw_user_meta_data` di Supabase
Auth.

Hal ini menyebabkan:

1. Data di tabel `users` berbeda dengan data di `raw_user_meta_data`
2. Inkonsistensi data antara auth metadata dan profile data
3. Confusion saat debugging atau mengakses user data

## Root Cause

Ada 2 tempat penyimpanan data user yang terpisah:

1. **Tabel `users`** (custom database table)

   - Diupdate oleh API endpoints `/api/profile`
   - Menyimpan profile lengkap (bio, location, website, dll)

2. **Supabase Auth `user_metadata`**
   - Tersimpan di `raw_user_meta_data`
   - Set saat registrasi/login pertama kali
   - Tidak terupdate otomatis saat profile diubah

## Solution Applied

### 1. Profile Update API (`/api/profile` PUT)

Ditambahkan sinkronisasi ke auth metadata:

```typescript
// Update in users table
const { data, error } = await supabase
  .from("users")
  .update({ full_name, avatar_url, bio, location, website })
  .eq("id", user.id)

// BARU: Juga update user metadata di Supabase Auth
if (full_name !== undefined || avatar_url !== undefined) {
  const currentMetadata = user.user_metadata || {}
  const updatedMetadata = {
    ...currentMetadata,
    ...(full_name !== undefined && { full_name }),
    ...(avatar_url !== undefined && { avatar_url }),
  }

  await supabase.auth.updateUser({
    data: updatedMetadata,
  })
}
```

### 2. Avatar Upload API (`/api/profile/avatar` POST)

Sudah ada sinkronisasi (sudah benar):

```typescript
// Update auth.users metadata for consistency
await supabase.auth.updateUser({
  data: { avatar_url: publicUrl },
})
```

### 3. Avatar Remove API (`/api/profile/avatar` DELETE)

Ditambahkan sinkronisasi:

```typescript
// BARU: Also remove from auth metadata
const currentMetadata = user.user_metadata || {}
await supabase.auth.updateUser({
  data: {
    ...currentMetadata,
    avatar_url: null,
  },
})
```

## How It Works

### Before Fix

```
User updates profile → Only `users` table updated → `raw_user_meta_data` stays old
```

### After Fix

```
User updates profile → `users` table updated → `raw_user_meta_data` also updated ✅
```

## Data Flow

1. User submits profile form
2. API updates `users` table dengan data lengkap
3. API juga updates `auth.users.user_metadata` untuk `full_name` dan `avatar_url`
4. Kedua source data sekarang tersinkronisasi

## Benefits

1. **Konsistensi Data**: `users` table dan `raw_user_meta_data` selalu sama
2. **Backward Compatibility**: Apps yang menggunakan auth metadata tetap berfungsi
3. **Debugging**: Tidak ada confusion antara 2 source data
4. **Future Proof**: Jika ada fitur yang menggunakan auth metadata

## Testing

Untuk memastikan fix berfungsi:

1. **Test Profile Update**:

   ```
   1. Login ke app
   2. Edit nama di profile form
   3. Save changes
   4. Check database: both `users.full_name` and `raw_user_meta_data.full_name` updated
   ```

2. **Test Avatar Upload**:

   ```
   1. Upload new avatar
   2. Check database: both `users.avatar_url` and `raw_user_meta_data.avatar_url` updated
   ```

3. **Test Avatar Remove**:
   ```
   1. Remove avatar
   2. Check database: both sources set avatar_url to null
   ```

## Error Handling

Jika auth metadata update gagal:

- Profile update tetap berhasil di `users` table
- Error di log sebagai warning, tidak menggagalkan request
- User masih dapat menggunakan app normal

Ini memastikan:

- User experience tidak terganggu
- Core functionality tetap bekerja
- Sync issue hanya mempengaruhi metadata

## Files Modified

1. `app/api/profile/route.ts` - Added auth metadata sync untuk profile update
2. `app/api/profile/avatar/route.ts` - Added auth metadata sync untuk avatar remove
3. `docs/PROFILE_AUTH_SYNC.md` - Documentation ini

## API Changes

### Profile Update (PUT /api/profile)

- **BEFORE**: Only updates `users` table
- **AFTER**: Updates both `users` table and auth metadata

### Avatar Remove (DELETE /api/profile/avatar)

- **BEFORE**: Only removes from `users` table and storage
- **AFTER**: Also removes from auth metadata

### Avatar Upload (POST /api/profile/avatar)

- **NO CHANGE**: Already syncs to auth metadata correctly

## Future Considerations

Untuk sync yang lebih robust, bisa dipertimbangkan:

1. **Database Triggers**: Auto sync dari `users` table ke auth
2. **Background Jobs**: Periodic sync untuk handle sync failures
3. **Validation**: Ensure both sources always match

Tapi untuk sekarang, current solution sudah cukup untuk mayoritas use cases.
