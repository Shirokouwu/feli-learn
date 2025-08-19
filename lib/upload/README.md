# Upload Utilities

Direktori ini berisi semua utility functions untuk handling file upload yang telah diorganisir
dengan baik untuk memisahkan antara server-side dan client-side code.

## 📁 Struktur File

```
lib/upload/
├── index.ts        # Main export file - centralized imports
├── validation.ts   # Universal functions (server + client safe)
└── client.ts       # Browser-only functions (client-side only)
```

## 🔧 Penggunaan

### Server Side (API Routes)

```typescript
// ✅ Aman - hanya import validation yang universal
import { validateImageFile, generateFileName } from "@/lib/upload/validation"
```

### Client Side (React Components)

```typescript
// ✅ Aman - import sesuai kebutuhan
import { validateImageFile } from "@/lib/upload/validation"
import { compressImage } from "@/lib/upload/client"

// Atau import dari index untuk convenience
import { validateImageFile, compressImage } from "@/lib/upload"
```

## 📋 Functions Available

### `validation.ts` (Universal - Server + Client Safe)

- `validateImageFile()` - Validasi file gambar
- `generateFileName()` - Generate nama file unik
- `formatFileSize()` - Format ukuran file untuk display
- `getFileExtension()` - Ekstrak ekstensi file
- `isValidImageExtension()` - Cek validitas ekstensi
- Constants: `ALLOWED_IMAGE_TYPES`, `ALLOWED_IMAGE_EXTENSIONS`, `MAX_FILE_SIZE`

### `client.ts` (Browser Only - Client Side)

- `compressImage()` - Kompres gambar menggunakan Canvas API
- `createImagePreview()` - Buat preview URL untuk gambar
- `revokeImagePreview()` - Hapus preview URL dari memory

## ⚠️ Important Notes

1. **Server Safety**: File `client.ts` tidak boleh diimport di server-side code
2. **Runtime Checks**: Client functions memiliki runtime check untuk browser environment
3. **Memory Management**: Selalu gunakan `revokeImagePreview()` setelah selesai menggunakan preview
   URL

## 🎯 Best Practices

```typescript
// ❌ JANGAN - Import client functions di API route
import { compressImage } from "@/lib/upload/client" // Error di server!

// ✅ LAKUKAN - Import sesuai environment
// Di server (API route)
import { validateImageFile } from "@/lib/upload/validation"

// Di client (React component)
import { validateImageFile } from "@/lib/upload/validation"
import { compressImage } from "@/lib/upload/client"
```
