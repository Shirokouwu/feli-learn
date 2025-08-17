# Fix User Registration Permission Error

## Problem

1. Error "permission denied for schema public" saat registrasi user
2. User created tapi `is_active` masih `false` setelah email confirmation

## Root Cause

1. Auto trigger `handle_new_user()` membuat user dengan `is_active: true` langsung
2. Code tidak mengupdate `is_active` saat email dikonfirmasi via callback
3. RLS policies tidak memberikan permission yang tepat untuk insert

## Solution Applied

### 1. Removed Manual Insert

- Menghapus manual insert di `registerAction`
- Menggunakan auto trigger yang sudah ada

### 2. Fixed Auto Trigger

- User dibuat dengan `is_active: false` (belum confirmed)
- Akan diubah menjadi `true` saat email confirmation via callback

### 3. Fixed Callback Route

- Mengupdate `is_active: true` saat user mengkonfirmasi email
- Memastikan user aktif setelah email verification

### 4. Database Migration Required

Jalankan script berikut di Supabase SQL Editor:

**Step 1:** `fix_user_permissions.sql` - Fix trigger dan permissions **Step 2:**
`fix_existing_users.sql` - Fix existing users yang sudah confirmed

## Steps to Fix

1. **Buka Supabase Dashboard**

   - Go to your project
   - Navigate to SQL Editor

2. **Run Migrations (In Order)**

   ```sql
   -- 1. Copy paste isi fix_user_permissions.sql
   -- 2. Copy paste isi fix_existing_users.sql
   ```

3. **Test Registration**
   - Try registering a new user
   - Confirm email
   - Check if `is_active` becomes `true` after confirmation

## Flow Diagram

```
1. User registers → auth.users created + public.users (is_active: false)
2. Email sent to user
3. User clicks email link → /api/auth/callback
4. Callback updates is_active: true
5. User is now active and can access app
```

## Verification

After running the migrations:

1. New registrations should work without permission errors
2. `is_active` should be `false` initially
3. `is_active` should become `true` after email confirmation
4. Existing confirmed users should be activated

## Files Modified

- `app/(auth)/_action.ts` - Removed manual insert
- `app/api/auth/callback/route.ts` - Added is_active update
- `migrations/auto_create_user_trigger.sql` - Changed is_active default
- `migrations/fix_user_permissions.sql` - Updated migration
- `migrations/fix_existing_users.sql` - Fix existing users
