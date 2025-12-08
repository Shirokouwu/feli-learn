# Quick Fix: Manual Email Verification

## Problem: Supabase tidak kirim reset password email ke unverified email

## Solution: Verify email secara manual via SQL

### Step 1: Buka Supabase SQL Editor

1. Login ke Supabase Dashboard
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar

### Step 2: Jalankan Query Ini

```sql
-- Cek dulu email mana yang belum verified
SELECT
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email_confirmed_at IS NULL;
```

### Step 3: Verify Email

```sql
-- Ganti 'YOUR_EMAIL_HERE' dengan email user Anda
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'YOUR_EMAIL_HERE';
```

### Step 4: Verify Berhasil

```sql
-- Cek lagi, harusnya email_confirmed_at sudah terisi
SELECT
  email,
  email_confirmed_at
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';
```

### Step 5: Test Reset Password Lagi

Sekarang coba request reset password lagi di: http://localhost:3000/reset-password

---

## Alternative: Verify Semua Email Sekaligus

```sql
-- HATI-HATI: Ini verify SEMUA user sekaligus
-- Hanya gunakan di development!
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

---

## Check Hasil

```sql
-- Lihat semua users dan status verification
SELECT
  id,
  email,
  email_confirmed_at,
  CASE
    WHEN email_confirmed_at IS NULL THEN '❌ Not Verified'
    ELSE '✅ Verified'
  END as status
FROM auth.users
ORDER BY created_at DESC;
```

---

## Development: Disable Email Confirmation

Untuk development, bisa disable email confirmation sama sekali:

1. Buka **Supabase Dashboard**
2. Go to: **Authentication → Providers → Email**
3. Toggle OFF: **Confirm email**
4. Click **Save**

Sekarang semua email otomatis verified saat signup.

**⚠️ WARNING:** Jangan lakukan ini di production!
