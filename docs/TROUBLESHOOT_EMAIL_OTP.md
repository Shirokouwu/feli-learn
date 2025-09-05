# Troubleshooting: OTP Email Tidak Diterima

## Kemungkinan Penyebab

### 1. **Email Confirmation Tidak Diaktifkan di Supabase**

- Buka Supabase Dashboard
- Go to **Authentication** → **Settings**
- Pastikan **"Confirm email"** diaktifkan (ON)

### 2. **Email Provider Belum Dikonfigurasi**

Supabase menggunakan email provider untuk mengirim OTP. Cek di:

- **Authentication** → **Settings** → **SMTP Settings**

**Default (Rate Limited):**

- Supabase menggunakan email provider default yang terbatas
- Hanya untuk development/testing
- Sering masuk spam atau delay

**Custom SMTP (Recommended):**

- Gmail, SendGrid, Mailgun, dll
- Lebih reliable untuk production

### 3. **Email Masuk ke Spam/Junk Folder**

- Check folder Spam/Junk di email Anda
- Supabase default email sering dianggap spam

### 4. **URL Redirect Salah**

- Pastikan **Site URL** benar di Supabase
- **Authentication** → **Settings** → **Site URL**
- Harus match dengan `SITE_URL` di `.env.local`

### 5. **Email Template Issues**

- Buka **Authentication** → **Email Templates**
- Pastikan template "Confirm signup" aktif
- Check apakah ada custom template yang error

## Quick Fix Steps

### Step 1: Cek Supabase Settings

1. Buka Supabase Dashboard
2. Project Settings → Authentication → Settings
3. Pastikan:
   ```
   ✅ Confirm email: ON
   ✅ Site URL: http://localhost:3000 (untuk dev)
   ```

### Step 2: Cek Email Templates

1. Authentication → Email Templates
2. Pilih "Confirm signup"
3. Pastikan ada template dan aktif

### Step 3: Test dengan Email Berbeda

- Coba daftar dengan provider email berbeda
- Gmail, Yahoo, Outlook

### Step 4: Cek Console Logs

Tambahkan logging di registerAction:

```typescript
console.log("Sign up result:", { data, error })
if (data.user) {
  console.log("User created:", data.user.id)
  console.log("Email confirmation sent:", data.user.email_confirmed_at)
}
```

### Step 5: Manual Trigger (Development Only)

Jika untuk development, bisa skip email confirmation:

1. Supabase Dashboard → Authentication → Settings
2. Matikan "Confirm email" sementara

## Production Solution

### Setup Custom SMTP (Gmail Example)

1. **Generate App Password Gmail:**

   - Google Account → Security → App passwords
   - Generate password untuk aplikasi

2. **Configure di Supabase:**

   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: your-email@gmail.com
   SMTP Pass: your-app-password
   Sender name: Feli Learn
   Sender email: your-email@gmail.com
   ```

3. **Enable SMTP di Authentication Settings**

## Testing Commands

```bash
# Check if dev server running correctly
curl http://localhost:3000/api/auth/callback

# Test environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SITE_URL
```

## Expected Flow

1. User submit registration form
2. `supabase.auth.signUp()` called
3. Supabase sends confirmation email
4. User clicks link in email
5. Redirected to `/api/auth/callback`
6. Session created, user confirmed
7. Redirect to dashboard

## Debug Checklist

- [ ] Email confirmation enabled in Supabase
- [ ] Site URL matches environment
- [ ] Check spam/junk folder
- [ ] Try different email provider
- [ ] Check Supabase logs
- [ ] Verify email templates
- [ ] Test with SMTP provider
