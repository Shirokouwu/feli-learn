# Avatar Upload dengan Image Editor Implementation

## Overview

Implementasi lengkap fitur upload avatar dengan image editor/crop menggunakan Next.js 15 App Router,
server actions, optimistic updates, dan integrasi Supabase Storage + `react-easy-crop`.

## Architecture

### Server Actions (`app/profile/actions.ts`)

#### `uploadAvatarAction`

- Menangani upload dan remove avatar dalam satu action
- Validasi file type dan size (JPG, PNG, WebP, max 5MB)
- Otomatis hapus avatar lama sebelum upload yang baru
- Support untuk remove action dengan flag `action: 'remove'`
- Menggunakan `revalidatePath` untuk update UI

#### `removeAvatarAction`

- Dedicated action untuk remove avatar
- Hapus file dari Supabase Storage
- Update database dengan `avatar_url: null`

### Client Components

#### `AvatarUpload` Component (`app/profile/components/AvatarUpload.tsx`)

**New Features:**

- ✅ **Image Editor Integration**: Menggunakan `SimpleImageEditor` dengan `react-easy-crop`
- ✅ **Crop & Edit**: Support crop gambar sebelum upload
- ✅ **Edit Avatar Existing**: Bisa edit/crop avatar yang sudah ada
- ✅ **startTransition**: Fix error optimistic state dengan proper transitions

**Core Features:**

- ✅ Drag & drop interface
- ✅ File validation di client dan server
- ✅ Optimistic updates dengan `startTransition`
- ✅ Dropdown menu dengan Upload, Edit & Crop, Remove options
- ✅ Support multiple sizes (sm, md, lg)
- ✅ Preview avatar dengan fallback ke initials
- ✅ Error handling dengan toast notifications

#### `SimpleImageEditor` Component (`components/ui/simple-image-editor.tsx`)

- Menggunakan `react-easy-crop` library
- Support square crop untuk avatar (aspect ratio 1:1)
- Round crop shape untuk avatar
- Zoom, rotate, dan reposition controls
- Modal dialog interface

### Key Functions

```tsx
// Handle file selection with editor
const handleFileSelect = async (file: File) => {
  if (!validateImageFile(file)) return

  // Show image editor for cropping
  const imageUrl = URL.createObjectURL(file)
  setSelectedImage(imageUrl)
  setShowEditor(true)
}

// Handle crop completion
const handleCropComplete = async (croppedBlob: Blob) => {
  const formData = new FormData()
  const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" })
  formData.append("avatar", croppedFile)

  // Optimistic update with startTransition
  startTransition(() => {
    const previewUrl = URL.createObjectURL(croppedBlob)
    onOptimisticUpdate?.(previewUrl)
  })

  uploadAction(formData)
}
```

### Integration

```tsx
// In ProfileClient.tsx
;<AvatarUpload
  currentAvatar={optimisticProfile.avatar_url}
  userName={optimisticProfile.full_name || optimisticProfile.email}
  onOptimisticUpdate={(avatarUrl) => updateOptimisticProfile({ avatar_url: avatarUrl })}
  size="lg"
  userId={optimisticProfile.id}
  className="ring-4 ring-white"
/>

// Image Editor Modal
{
  showEditor && selectedImage && (
    <SimpleImageEditor
      open={showEditor}
      onOpenChange={handleEditorClose}
      imageSrc={selectedImage}
      onCropComplete={handleCropComplete}
      aspectRatio={1} // Square for avatar
      cropShape="round" // Circular crop
    />
  )
}
```

## User Experience Flow

### Upload New Avatar:

1. **Click Camera Button** → Dropdown menu muncul
2. **Select "Upload Foto"** → File dialog terbuka
3. **Select Image** → Image Editor modal terbuka
4. **Crop & Edit** → User bisa crop, zoom, rotate
5. **Confirm** → Optimistic update + server upload
6. **Success** → Toast notification + UI update

### Edit Existing Avatar:

1. **Click Camera Button** → Dropdown menu muncul
2. **Select "Edit & Crop"** → Image Editor modal terbuka dengan avatar saat ini
3. **Re-crop** → User bisa crop ulang avatar existing
4. **Confirm** → Upload cropped version

### Remove Avatar:

1. **Click Camera Button** → Dropdown menu muncul
2. **Select "Hapus Foto"** → Confirmation dialog
3. **Confirm** → Optimistic update + server remove

## File Structure

```
app/profile/
├── actions.ts                    # Server actions
├── components/
│   ├── AvatarUpload.tsx         # Avatar upload + editor integration
│   ├── ProfileClient.tsx        # Main profile component
│   └── EditProfileModal.tsx     # Profile edit modal
└── page.tsx                     # Profile page (Server Component)

components/ui/
└── simple-image-editor.tsx      # Image crop editor component
```

## Dependencies

```json
{
  "react-easy-crop": "^5.5.0", // Image cropping library
  "sonner": "^2.0.3", // Toast notifications
  "lucide-react": "^0.511.0" // Icons
}
```

## Next.js 15 Features Used

- ✅ **Server Actions** dengan `useActionState`
- ✅ **Optimistic Updates** dengan `useOptimistic` + `startTransition`
- ✅ **Server Components** untuk data fetching
- ✅ **revalidatePath** untuk cache invalidation
- ✅ **TypeScript** dengan full type safety
- ✅ **Error Boundaries** dengan proper error handling

## Error Fixes Applied

### 1. **Optimistic State Error**

```
❌ An optimistic state update occurred outside a transition
✅ Fixed with startTransition wrapper
```

### 2. **useActionState Error**

```
❌ An async function with useActionState was called outside of a transition
✅ Fixed by wrapping optimistic updates with startTransition
```

### 3. **Module Resolution**

```
❌ Can't resolve 'react-image-crop'
✅ Fixed by using correct SimpleImageEditor component with react-easy-crop
```

## Implementation Status ✅

**Avatar Upload + Image Editor functionality berhasil diimplementasikan dengan:**

- ✅ Modern Next.js 15 + React 19 patterns
- ✅ Server actions dengan proper error handling
- ✅ Optimistic updates dengan startTransition
- ✅ Image crop/edit functionality
- ✅ Clean component architecture
- ✅ Responsive design
- ✅ Full TypeScript support

**Ready untuk production! 🚀**
