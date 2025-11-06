# Reset Password Token Fix - Auth Session Missing Error

## 🐛 Problem

Ketika user klik link reset password dari email dan mencoba update password:

```
❌ Error: Auth session missing!
Update password error: AuthSessionMissingError
Status: 400
```

**Root Cause:**

- Link reset password dari Supabase berisi `access_token` di URL hash (`#access_token=...`)
- Token tersebut **tidak di-handle** di halaman `/reset-password/confirm`
- Ketika `updatePassword()` dipanggil, **tidak ada session** → Error!

---

## ✅ Solution

### **Flow yang Benar:**

```
1. User klik link dari email
   ↓
2. URL: /reset-password/confirm#access_token=xxx&type=recovery
   ↓
3. Client-side: Extract token dari URL hash
   ↓
4. Exchange token → Create session (supabase.auth.setSession)
   ↓
5. Session established ✅
   ↓
6. User input password baru
   ↓
7. updatePassword() → Success! ✅
```

---

## 🛠 Implementation

### **1. Update Confirm Page** (`confirm/page.tsx`)

**Added Token Verification on Mount:**

```typescript
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function ConfirmResetPasswordPage() {
  const [isVerifying, setIsVerifying] = useState(true)

  // Verify token saat component mount
  useEffect(() => {
    const verifyResetToken = async () => {
      const supabase = createClient()

      // Extract token dari URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get("access_token")
      const type = hashParams.get("type")

      if (type === "recovery" && accessToken) {
        // Exchange token untuk create session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get("refresh_token") || "",
        })

        if (error) {
          setMessage({
            type: "error",
            text: "Link expired atau tidak valid",
          })
        } else {
          setMessage({
            type: "success",
            text: "Link verified! Silakan masukkan password baru.",
          })
        }
      } else {
        setMessage({
          type: "error",
          text: "Link reset password tidak valid",
        })
      }

      setIsVerifying(false)
    }

    verifyResetToken()
  }, [])
}
```

**Key Changes:**

- ✅ Extract `access_token` dari URL hash
- ✅ Call `supabase.auth.setSession()` untuk create session
- ✅ Verify token type adalah `recovery`
- ✅ Show loading state saat verify
- ✅ Handle error jika token invalid/expired

---

### **2. UI Loading State**

**Added verification loading:**

```tsx
{
  isVerifying ? (
    <div className="mt-8 flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <p className="mt-4 text-sm text-gray-600">Memverifikasi link reset password...</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit}>{/* Form fields... */}</form>
  )
}
```

**Benefits:**

- ✅ User melihat feedback saat token sedang di-verify
- ✅ Form hanya muncul setelah token valid
- ✅ Clear error message jika token invalid

---

## 🔍 Technical Details

### **Supabase Password Recovery Flow:**

#### **Email Link Format:**

```
http://localhost:3000/reset-password/confirm#
    access_token=eyJhbGc...
    &expires_in=3600
    &refresh_token=abc123...
    &token_type=bearer
    &type=recovery
```

#### **Token in URL Hash (not query params!):**

- ❌ `searchParams.get('access_token')` → Won't work!
- ✅ `window.location.hash` → Correct!

#### **Why setSession() is Needed:**

```typescript
// ❌ WRONG - No session, will fail
await supabase.auth.updateUser({ password: newPassword })

// ✅ CORRECT - Create session first
await supabase.auth.setSession({ access_token, refresh_token })
// Now session exists
await supabase.auth.updateUser({ password: newPassword })
```

---

## 🧪 Testing

### **Test Case 1: Valid Token**

1. Request reset password → Email sent
2. Click link in email
3. Observe: "Memverifikasi link..." → Loading
4. Observe: "Link verified! Silakan masukkan password baru" → Success
5. Input new password → Submit
6. Observe: Password updated successfully!

**Console Logs:**

```
🔍 Checking URL params: {
  hasHash: true,
  accessToken: '✓ Present',
  type: 'recovery'
}
✅ Valid recovery token found, exchanging for session...
✅ Session established successfully!
```

---

### **Test Case 2: Invalid/Expired Token**

1. Click old/expired reset link
2. Observe: Error message shown
3. Button disabled (can't submit)

**Console Logs:**

```
❌ Failed to set session: { message: "Token expired" }
```

---

### **Test Case 3: No Token**

1. Navigate directly to `/reset-password/confirm` (no token in URL)
2. Observe: Error message
3. "Link reset password tidak valid"

**Console Logs:**

```
❌ No valid recovery token found
```

---

## 📊 Before vs After

### ❌ **BEFORE:**

```
User clicks email link
  ↓
Page loads /reset-password/confirm
  ↓
User inputs new password
  ↓
Submit → updatePassword()
  ↓
❌ ERROR: Auth session missing!
  ↓
User confused 😕
```

### ✅ **AFTER:**

```
User clicks email link
  ↓
Page loads → Extract token from hash
  ↓
Exchange token → Create session ✅
  ↓
Show "Link verified!" message
  ↓
User inputs new password
  ↓
Submit → updatePassword()
  ↓
✅ SUCCESS! Password updated
  ↓
Auto redirect to home
```

---

## 🎯 Key Learnings

### **1. URL Hash vs Query Params**

```typescript
// Supabase uses HASH for tokens
window.location.hash // ✅ "#access_token=..."
searchParams.get() // ❌ Won't find it
```

### **2. Token Exchange is Required**

```typescript
// Must exchange token for session
supabase.auth.setSession({ access_token, refresh_token })
```

### **3. Verify Before Allowing Form**

```typescript
// Show loading → Verify token → Show form
{
  isVerifying ? <Loading /> : <Form />
}
```

### **4. Handle All Error Cases**

- Token expired
- Token invalid
- No token
- Network error

---

## 🚀 Production Considerations

### **Security:**

- ✅ Token only works once
- ✅ Token expires after 1 hour
- ✅ Must match user's email
- ✅ HTTPS only in production

### **User Experience:**

- ✅ Clear loading state
- ✅ Helpful error messages
- ✅ Auto-redirect on success
- ✅ Link to request new reset

### **Error Handling:**

- ✅ Expired token → Request new reset
- ✅ Invalid token → Clear error message
- ✅ Network error → Retry option
- ✅ Console logs for debugging

---

## 📚 Related Documentation

- [Supabase Password Recovery](https://supabase.com/docs/guides/auth/auth-password-reset)
- [Auth Session Management](https://supabase.com/docs/guides/auth/sessions)
- [URL Hash Parameters](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash)

---

## ✅ Checklist

After implementing this fix:

- [x] Token extracted from URL hash
- [x] Session created via setSession()
- [x] Loading state during verification
- [x] Error handling for invalid tokens
- [x] Success message on valid token
- [x] Form only shown after verification
- [x] Console logging for debugging
- [x] Auto-redirect after success

---

**Fixed:** November 6, 2025  
**Issue:** Auth session missing when updating password  
**Root Cause:** Token not exchanged for session  
**Status:** ✅ Resolved
