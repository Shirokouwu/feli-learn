# 🔧 Reset Password Email Troubleshooting

## ❌ Masalah: Email Reset Password Tidak Terkirim

### Checklist Debugging:

#### ✅ 1. Cek Console Log

Setelah request reset, buka **Browser Console** (F12) atau **Terminal Server**.

**Yang harus muncul:**

```
🔍 Checking email: user@example.com
📧 Sending reset email to: user@example.com
🔗 Redirect URL: http://localhost:3000/reset-password/confirm
📨 Reset email result: { data: ..., error: null }
✅ Reset email sent successfully!
```

**Jika ada error:**

```
❌ Reset password error: { message: "...", status: ..., name: "..." }
```

---

#### ✅ 2. Cek Supabase Email Settings

**Langkah:**

1. Buka **Supabase Dashboard**
2. Pilih project Anda
3. Go to: **Authentication → Providers → Email**

**Pastikan:**

- ✅ Email provider **ENABLED**
- ✅ Confirm email **ENABLED** atau **DISABLED** (tergantung kebutuhan)
- ✅ Secure email change **ENABLED**

---

#### ✅ 3. Cek Email Template

**Langkah:**

1. Buka **Supabase Dashboard**
2. Go to: **Authentication → Email Templates**
3. Pilih: **Reset Password (recovery)**

**Pastikan template aktif:**

```html
<h2>Reset Your Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

**PENTING:** `{{ .ConfirmationURL }}` harus ada di template!

---

#### ✅ 4. Cek SMTP Configuration

**Development (Default):**

- Supabase pakai **inbuilt SMTP**
- Rate limit: **4 emails/hour** per recipient
- Bisa delay sampai 5 menit

**Solusi untuk Development:**

```typescript
// Gunakan email testing service
// Misalnya: Mailtrap, Mailhog, atau ethereal.email

// Atau cek langsung di Supabase:
// Authentication → Users → Cari user → Lihat "Last Sign In"
```

**Production:** Setup custom SMTP di Supabase:

1. Go to: **Project Settings → Auth**
2. Scroll ke: **SMTP Settings**
3. Input custom SMTP (Gmail, SendGrid, AWS SES, dll)

---

#### ✅ 5. Cek User Email Verification Status

**Issue:** Supabase **TIDAK AKAN KIRIM** reset email ke **unverified email**.

**Cek di Supabase:**

1. Go to: **Authentication → Users**
2. Cari user dengan email tersebut
3. Lihat kolom **Email Confirmed At**

**Jika NULL (belum verified):**

```sql
-- Manual verify email (via SQL Editor):
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'user@example.com';
```

**Atau kirim verification email dulu:**

```typescript
const { error } = await supabase.auth.resend({
  type: "signup",
  email: "user@example.com",
})
```

---

#### ✅ 6. Cek Rate Limiting

**Supabase Development Default:**

- Max **4 emails/hour** per recipient
- Cooldown period: **60 detik** per request

**Cek di console:**

```
Error: Email rate limit exceeded
```

**Solusi:**

- Tunggu 1-5 menit
- Atau setup custom SMTP (unlimited)

---

#### ✅ 7. Cek Spam Folder

**Email bisa masuk spam karena:**

- Domain baru (localhost development)
- Tidak ada SPF/DKIM records
- Konten email generic

**Cek folder:**

- Gmail: **Spam**, **Promotions**, **Updates**
- Outlook: **Junk Email**
- Yahoo: **Spam**

---

#### ✅ 8. Test dengan Email Service

**Gunakan Mailtrap (Recommended untuk Development):**

1. Daftar di: https://mailtrap.io (gratis)
2. Copy SMTP credentials
3. Setup di Supabase:

   - **SMTP Host:** `sandbox.smtp.mailtrap.io`
   - **SMTP Port:** `2525`
   - **SMTP User:** `your_username`
   - **SMTP Password:** `your_password`
   - **SMTP Sender Name:** `Felidae Learn`
   - **SMTP Sender Email:** `noreply@felidae.com`

4. Test lagi reset password

---

## 🔍 Debug Flow Lengkap

### 1. Cek Console di Browser/Terminal

```bash
# Start dev server dengan verbose logging
bun dev

# Atau dengan debug mode
DEBUG=* bun dev
```

### 2. Test Request Reset

```typescript
// Di browser console:
const result = await fetch("/api/auth/reset-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@example.com" }),
})

console.log(await result.json())
```

### 3. Cek Supabase Logs

1. Buka **Supabase Dashboard**
2. Go to: **Logs → Auth Logs**
3. Filter by: **password_recovery**
4. Lihat error details

---

## 🎯 Quick Fixes

### Fix 1: Manual Email Verification

```sql
-- Di Supabase SQL Editor:
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'YOUR_EMAIL_HERE';
```

### Fix 2: Bypass Email Confirmation (Development Only)

Di **Supabase Dashboard**:

1. Go to: **Authentication → Providers → Email**
2. Toggle OFF: **Confirm email**
3. Save

### Fix 3: Use Mailtrap for Development

Lihat langkah #8 di atas

### Fix 4: Cek Environment Variable

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # ✅ Harus ada

# Restart server setelah edit .env
```

### Fix 5: Test dengan Real Email Service

```typescript
// Temporary: Langsung test dengan Gmail
// Di actions.ts, tambahin console.log:

console.log("Testing email send...")
console.log("Email:", email)
console.log("Redirect:", process.env.NEXT_PUBLIC_SITE_URL)

// Cek output di terminal
```

---

## 📊 Expected Behavior

### ✅ Successful Flow:

```
1. User input email → Click submit
   ↓
2. Browser console: "✅ Reset email sent successfully!"
   ↓
3. Supabase logs: "password_recovery sent"
   ↓
4. Email received (dalam 1-5 menit)
   ↓
5. User klik link → Redirect ke /reset-password/confirm
   ↓
6. Input password baru → Success!
```

### ❌ Common Errors:

**Error 1: Rate Limit**

```
Error: Email rate limit exceeded
Fix: Tunggu 60 detik atau gunakan custom SMTP
```

**Error 2: Invalid Email**

```
Error: User not found
Fix: Pastikan email terdaftar di auth.users
```

**Error 3: Unverified Email**

```
Error: Email not confirmed
Fix: Verify email dulu (lihat Fix 1)
```

**Error 4: SMTP Error**

```
Error: Failed to send email
Fix: Cek SMTP settings atau gunakan Mailtrap
```

---

## 🚀 Production Checklist

Sebelum deploy ke production:

- [ ] Setup custom SMTP (Gmail/SendGrid/AWS SES)
- [ ] Enable email confirmation
- [ ] Customize email templates (branding)
- [ ] Setup SPF/DKIM records (domain)
- [ ] Test dengan real email addresses
- [ ] Setup monitoring/alerts untuk email failures
- [ ] Add retry logic untuk failed emails

---

## 📚 Resources

- [Supabase Auth Email Guide](https://supabase.com/docs/guides/auth/auth-email)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Mailtrap.io](https://mailtrap.io) - Email testing

---

**Last Updated:** November 6, 2025
