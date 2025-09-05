# Avatar Upload Feature

Fitur upload avatar untuk profil pengguna menggunakan Supabase Storage.

## Setup

### 1. Supabase Storage Setup

Jalankan migration untuk setup storage bucket:

```sql
-- Jalankan file migrations/setup_storage.sql
```

### 2. Environment Variables

Pastikan environment variables berikut sudah di set:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Migration

Jalankan migration untuk menambah kolom profil:

```sql
-- Jalankan file migrations/add_profile_fields.sql
```

## Features

### Avatar Upload

- **Format yang didukung**: JPEG, PNG, GIF, WebP
- **Ukuran maksimal**: 5MB
- **Kompresi otomatis**: Gambar akan dikompres otomatis untuk menghemat storage
- **Drag & Drop**: Mendukung drag and drop untuk upload
- **Validasi**: Validasi format dan ukuran file

### API Endpoints

#### Upload Avatar

```
POST /api/profile/avatar
```

#### Delete Avatar

```
DELETE /api/profile/avatar
```

### Components

#### AvatarUpload

Komponen untuk upload dan mengelola avatar dengan fitur:

- Preview avatar saat ini
- Upload gambar baru
- Hapus avatar
- Loading state
- Drag & drop support
- Compression otomatis

### Usage

```tsx
import { AvatarUpload } from "@/components/ui/avatar-upload"
;<AvatarUpload
  currentAvatar={profile.avatar_url}
  userName={profile.full_name || profile.email}
  onUpload={uploadAvatar}
  onRemove={removeAvatar}
  uploading={uploadingAvatar}
  size="lg"
/>
```

### File Structure

```
app/api/profile/avatar/route.ts - API endpoint untuk avatar
components/ui/avatar-upload.tsx - Komponen upload avatar
hooks/use-user-profile.ts - Hook untuk mengelola profil user
lib/upload-utils.ts - Utility functions untuk upload
migrations/setup_storage.sql - Setup Supabase storage
```

## Security

- RLS (Row Level Security) policies untuk mengontrol akses file
- User hanya bisa upload/update/delete avatar mereka sendiri
- Validasi format dan ukuran file di backend
- File disimpan dengan nama unik untuk mencegah konflik

## Storage Structure

```
avatars/
└── users/
    ├── {user-id}-{timestamp}.jpg
    ├── {user-id}-{timestamp}.png
    └── ...
```
