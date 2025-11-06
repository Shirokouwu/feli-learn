# Reset Password Implementation - Step by Step

## 📋 Daftar Isi

1. [Flow Diagram](#flow-diagram)
2. [Penjelasan Konsep](#penjelasan-konsep)
3. [Implementasi Detail](#implementasi-detail)
4. [Konfigurasi Supabase](#konfigurasi-supabase)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    RESET PASSWORD FLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. User Request Reset
   ┌─────────────────┐
   │   /reset-password│  ← User input email
   └────────┬─────────┘
            │
            ▼
   ┌─────────────────────┐
   │ requestPasswordReset│  ← Server Action
   │  - Validate email   │
   │  - Check if exists  │
   │  - Send reset email │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │  Email Sent to User │
   │  Contains reset link│
   └────────┬────────────┘
            │
            │
2. User Clicks Link
            │
            ▼
   ┌─────────────────────────┐
   │ /reset-password/confirm │  ← Form input password baru
   └────────┬────────────────┘
            │
            ▼
   ┌─────────────────┐
   │  updatePassword │  ← Server Action
   │ - Verify token  │
   │ - Update pwd    │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │   Success!      │
   │   Redirect Home │
   └─────────────────┘
```

---

## 💡 Penjelasan Konsep

### **Apa itu Reset Password?**

Reset password adalah proses mengubah kata sandi user yang lupa password mereka. Prosesnya
menggunakan **email verification** untuk keamanan.

### **Kenapa Pakai Email?**

- **Security**: Memastikan yang reset password adalah pemilik email asli
- **Token-based**: Link reset punya expiration time (biasanya 1 jam)
- **One-time use**: Token hanya bisa dipakai sekali

### **Komponen Utama:**

#### 1. **Request Reset** (`/reset-password`)

- User input email
- System kirim email dengan token unik
- Email berisi link ke halaman confirm

#### 2. **Confirm Reset** (`/reset-password/confirm`)

- User klik link dari email
- Token di-verify otomatis oleh Supabase
- User input password baru
- Password di-update di database

---

## 🛠 Implementasi Detail

### **File Structure:**

```
app/
  (auth)/
    reset-password/
      ├── page.tsx              # Halaman request reset (input email)
      ├── confirm/
      │   └── page.tsx          # Halaman confirm reset (input password baru)
      └── actions.ts            # Server actions (backend logic)
```

---

### **1. Server Actions** (`actions.ts`)

```typescript
// ============================================
// FUNCTION 1: requestPasswordReset
// ============================================

export async function requestPasswordReset(email: string) {
  // Step 1: Validate email format
  if (!email || !email.includes("@")) {
    return { success: false, error: "Format email tidak valid" }
  }

  // Step 2: Cek apakah user ada di database
  const { data: existingUser } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single()

  // Step 3: Kirim reset email
  // NOTE: Kita tetap return success walaupun user tidak ada
  // Ini untuk security (prevent email enumeration)
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`,
  })

  // Step 4: Return result
  return {
    success: true,
    message: "Link reset password telah dikirim ke email Anda",
  }
}
```

**Penjelasan:**

- `resetPasswordForEmail()` adalah fungsi bawaan Supabase
- Supabase otomatis generate token dan kirim email
- `redirectTo` adalah URL tujuan setelah user klik link
- Token akan di-append ke URL otomatis: `/confirm?token=xxx`

---

```typescript
// ============================================
// FUNCTION 2: updatePassword
// ============================================

export async function updatePassword(newPassword: string) {
  // Step 1: Validate password
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password minimal 6 karakter" }
  }

  // Step 2: Update password
  // Token verification dilakukan otomatis oleh Supabase
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  // Step 3: Handle errors
  if (error) {
    if (error.message.includes("session")) {
      return {
        success: false,
        error: "Link sudah expired. Request reset lagi.",
      }
    }
    return { success: false, error: "Gagal update password" }
  }

  // Step 4: Success
  return {
    success: true,
    message: "Password berhasil diupdate",
  }
}
```

**Penjelasan:**

- `updateUser()` fungsi bawaan Supabase untuk update user data
- Supabase otomatis verify token dari URL
- Kalau token expired/invalid, akan return error
- User otomatis login setelah password berhasil diupdate

---

### **2. Request Reset Page** (`page.tsx`)

```typescript
export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Call server action
    const result = await requestPasswordReset(email)

    if (result.success) {
      setMessage({ type: "success", text: result.message })
      setEmail("") // Clear form
    } else {
      setMessage({ type: "error", text: result.error })
    }

    setIsLoading(false)
  }

  return (
    // Form with email input
  )
}
```

**Penjelasan:**

- Simple form dengan 1 input (email)
- Show loading state saat submit
- Display success/error message
- Clear form setelah berhasil

---

### **3. Confirm Reset Page** (`confirm/page.tsx`)

```typescript
export default function ConfirmResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Password tidak cocok" })
      return
    }

    setIsLoading(true)

    // Call server action
    const result = await updatePassword(password)

    if (result.success) {
      setMessage({ type: "success", text: result.message })

      // Auto redirect setelah 2 detik
      setTimeout(() => router.push("/"), 2000)
    } else {
      setMessage({ type: "error", text: result.error })
    }

    setIsLoading(false)
  }

  return (
    // Form with password inputs
  )
}
```

**Penjelasan:**

- Form dengan 2 input (password + confirm)
- Client-side validation (passwords harus match)
- Show/hide password toggle
- Auto redirect setelah success

---

## ⚙️ Konfigurasi Supabase

### **1. Setup Environment Variable**

Tambahkan di `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Atau production URL: https://yourdomain.com
```

### **2. Konfigurasi Email Template**

Masuk ke **Supabase Dashboard**:

1. Buka project Anda
2. Go to: **Authentication → Email Templates**
3. Pilih: **Reset Password**
4. Customize template (opsional)

Template default sudah bagus, tapi bisa custom:

```html
<h2>Reset Your Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, ignore this email.</p>
```

### **3. Setup Redirect URLs**

Di **Supabase Dashboard**:

1. Go to: **Authentication → URL Configuration**
2. Tambahkan di **Redirect URLs**:
   - `http://localhost:3000/reset-password/confirm` (development)
   - `https://yourdomain.com/reset-password/confirm` (production)

---

## 🧪 Testing

### **Test Case 1: Request Reset**

1. Buka: `http://localhost:3000/reset-password`
2. Input email yang terdaftar
3. Click "Kirim Tautan Reset"
4. Check email inbox (atau spam folder)
5. Verify email diterima dengan link reset

### **Test Case 2: Reset Password**

1. Click link di email
2. Verify redirect ke `/reset-password/confirm`
3. Input password baru (min 6 karakter)
4. Input confirm password (harus sama)
5. Click "Reset Kata Sandi"
6. Verify redirect ke homepage
7. Login dengan password baru

### **Test Case 3: Error Handling**

- Input email tidak valid → Show error
- Password tidak match → Show error
- Link expired (tunggu 1 jam) → Show error
- Link sudah dipakai → Show error

---

## 🔧 Troubleshooting

### **Problem 1: Email tidak diterima**

**Penyebab:**

- Email masuk ke spam folder
- Email belum dikonfigurasi di Supabase
- SMTP settings belum setup (production)

**Solusi:**

```typescript
// Check di console apakah ada error
console.log("Reset email result:", result)

// Pastikan redirect URL benar
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`
```

### **Problem 2: Link expired**

**Penyebab:**

- Token default expire setelah 1 jam
- User terlalu lama klik link

**Solusi:**

- Request reset password lagi
- Atau custom expire time di Supabase:
  ```typescript
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "...",
    options: {
      emailRedirectTo: "...",
    },
  })
  ```

### **Problem 3: Redirect tidak jalan**

**Penyebab:**

- Redirect URL belum ditambahkan di Supabase dashboard
- URL typo

**Solusi:**

1. Check Supabase Dashboard → Authentication → URL Configuration
2. Pastikan URL exact match dengan redirect URL di code

---

## 🎯 Key Takeaways

### **Security Best Practices:**

1. ✅ **Jangan reveal** apakah email exist atau tidak
2. ✅ **Token-based** dengan expiration time
3. ✅ **One-time use** token
4. ✅ **Minimal password length** validation
5. ✅ **HTTPS only** di production

### **User Experience:**

1. ✅ **Clear feedback** (loading states, success/error messages)
2. ✅ **Auto redirect** setelah success
3. ✅ **Show/hide password** toggle
4. ✅ **Password confirmation** field

### **Flow Summary:**

```
Request → Email → Click Link → New Password → Success → Auto Login
```

---

## 📚 References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Password Security Best Practices](https://owasp.org/www-community/controls/Password_reset)

---

**Created:** November 6, 2025  
**Version:** 1.0  
**Author:** GitHub Copilot
