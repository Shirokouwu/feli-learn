# Setup Bucket Avatars di Supabase

## Langkah-langkah:

### 1. Via Supabase Dashboard (Recommended)

1. **Login ke Supabase Dashboard**

   - Buka https://supabase.com/dashboard
   - Login ke project Anda

2. **Buka Storage**

   - Klik "Storage" di sidebar kiri
   - Klik "Buckets"

3. **Buat Bucket Baru**

   - Klik "New bucket"
   - Nama bucket: `avatars`
   - Public bucket: ✅ **Enabled** (penting!)
   - Klik "Save"

4. **Setup Policies (Optional - sudah otomatis)**
   - Bucket akan otomatis mendapat RLS policies
   - Jika perlu custom policies, gunakan SQL editor

### 2. Via SQL Editor (Alternative)

1. **Buka SQL Editor**

   - Klik "SQL Editor" di dashboard
   - Buat query baru

2. **Jalankan Script**

   ```sql
   -- Copy paste dari scripts/create-avatars-bucket.sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('avatars', 'avatars', true);
   ```

3. **Verifikasi**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'avatars';
   ```

### 3. Test Upload

Setelah bucket dibuat, test upload avatar dari aplikasi:

1. Login ke aplikasi
2. Pergi ke halaman Profile
3. Klik ikon camera di avatar
4. Upload gambar
5. Cek di Storage bucket apakah file terupload

### 4. Troubleshooting

**Error: "Bucket not found"**

- Pastikan bucket name exact: `avatars`
- Pastikan bucket adalah public
- Check typo di kode API

**Error: "Access denied"**

- Pastikan RLS policies sudah ada
- Check user authentication
- Verifikasi user ID

**Error: "File too large"**

- Max file size: 5MB
- Compress gambar sebelum upload
- Check file validation

### 5. Monitoring

**Check bucket contents:**

```sql
SELECT * FROM storage.objects WHERE bucket_id = 'avatars';
```

**Check policies:**

```sql
SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';
```

Setelah setup selesai, avatar upload harus bekerja normal!

**Struktur folder yang akan dibuat:**

```
Bucket: avatars/
└── users/
    ├── f47ac10b-58cc-4372-a567-0e02b2c3d479-1629123456789.jpg
    ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890-1629123456790.png
    └── ...
```

🚀
