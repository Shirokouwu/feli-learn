# useActionState Error Fix

## Problem

```
❌ An async function with useActionState was called outside of a transition.
This is likely not what you intended (for example, isPending will not update correctly).
Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.
```

## Root Cause

Fungsi `uploadAction` dari `useActionState` dipanggil secara langsung tanpa wrapping dalam
`startTransition` atau form action.

### Before (Incorrect):

```tsx
// ❌ Action dipanggil di luar transition
startTransition(() => {
  // Optimistic update
  onOptimisticUpdate?.(previewUrl)
})

// ❌ Action dipanggil terpisah dari transition
uploadAction(formData)
```

## Solution

Pindahkan pemanggilan action ke dalam `startTransition` bersama dengan optimistic update.

### After (Correct):

```tsx
// ✅ Action dan optimistic update dalam satu transition
startTransition(() => {
  // Optimistic update
  const previewUrl = URL.createObjectURL(croppedBlob)
  onOptimisticUpdate?.(previewUrl)

  // Action dipanggil dalam transition yang sama
  uploadAction(formData)
})
```

## Code Changes

### 1. handleCropComplete Function

```tsx
const handleCropComplete = async (croppedBlob: Blob) => {
  try {
    const formData = new FormData()
    const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" })
    formData.append("avatar", croppedFile)

    // ✅ Both optimistic update and action in same startTransition
    startTransition(() => {
      const previewUrl = URL.createObjectURL(croppedBlob)
      onOptimisticUpdate?.(previewUrl)

      setTimeout(() => {
        URL.revokeObjectURL(previewUrl)
      }, 1000)

      // Action called inside startTransition
      uploadAction(formData)
    })

    // Cleanup
    setShowEditor(false)
    URL.revokeObjectURL(selectedImage)
    setSelectedImage("")
  } catch (error) {
    toast.error("Gagal mengunggah foto profil")
    onOptimisticUpdate?.(currentAvatar || null)
  }
}
```

### 2. handleRemove Function

```tsx
const handleRemove = async () => {
  if (!window.confirm("Apakah Anda yakin ingin menghapus foto profil?")) return

  try {
    const formData = new FormData()
    formData.append("action", "remove")

    // ✅ Both optimistic update and action in same startTransition
    startTransition(() => {
      onOptimisticUpdate?.(null)
      uploadAction(formData)
    })
  } catch (error) {
    toast.error("Gagal menghapus foto profil")
    onOptimisticUpdate?.(currentAvatar || null)
  }
}
```

## Why This Works

1. **Consistent State**: Optimistic update dan server action terjadi dalam transaction yang sama
2. **Proper isPending**: `isPending` dari `useActionState` akan update dengan benar
3. **React Guidelines**: Mengikuti panduan React 19 untuk concurrent features
4. **Better UX**: UI lebih responsive dan consistent

## Alternative Solutions

### Option 1: Form with formAction (Recommended for forms)

```tsx
<form action={uploadAction}>
  <input type="file" name="avatar" />
  <button type="submit">Upload</button>
</form>
```

### Option 2: Button with action prop

```tsx
<button
  action={() => {
    const formData = new FormData()
    formData.append("avatar", file)
    return uploadAction(formData)
  }}>
  Upload
</button>
```

### Option 3: startTransition (Our Choice)

```tsx
startTransition(() => {
  uploadAction(formData)
})
```

## Result

✅ **Error Fixed**: No more useActionState transition warnings ✅ **Better UX**: isPending updates
correctly  
✅ **Consistent State**: Optimistic updates work properly ✅ **React 19 Compliant**: Follows
concurrent features best practices

## Implementation Status

**Error berhasil diperbaiki!** Avatar upload dengan image editor sekarang bekerja tanpa warning dan
mengikuti best practices Next.js 15 + React 19. 🚀
