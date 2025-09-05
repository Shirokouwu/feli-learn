# Avatar Upload Troubleshooting

## Common Errors & Solutions

### 1. Error: "Bucket not found"

**Problem:** Bucket 'avatars' belum dibuat di Supabase Storage.

**Solution:**

1. Login ke Supabase Dashboard
2. Storage → Buckets → "New bucket"
3. Name: `avatars`, Public: ✅, Save

**OR via SQL:**

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

---

### 2. Error: "mime type image/jpeg is not supported"

**Problem:** Bucket memiliki MIME type restrictions yang terlalu ketat.

**Solutions:**

#### Option A: Update bucket MIME types

```sql
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg', 'image/jpg', 'image/png',
  'image/gif', 'image/webp', 'image/avif'
]
WHERE id = 'avatars';
```

#### Option B: Remove MIME restrictions completely

```sql
UPDATE storage.buckets
SET allowed_mime_types = NULL
WHERE id = 'avatars';
```

#### Option C: Recreate bucket (CAREFUL - deletes all files!)

```sql
-- Run scripts/simple-avatars-bucket.sql
```

---

### 3. Error: "Access denied" / "Unauthorized"

**Problem:** RLS policies tidak allowing upload.

**Check user authentication:**

```sql
SELECT auth.uid(); -- Should return user UUID
```

**Check policies exist:**

```sql
SELECT policyname FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%avatar%';
```

**Recreate policies:**

```sql
-- Run scripts/simple-avatars-bucket.sql
```

---

### 4. Error: "File too large"

**Problem:** File melebihi batas ukuran.

**Check bucket limits:**

```sql
SELECT file_size_limit FROM storage.buckets WHERE id = 'avatars';
```

**Update limit:**

```sql
UPDATE storage.buckets
SET file_size_limit = 5242880 -- 5MB
WHERE id = 'avatars';
```

---

### 5. Error: "Invalid file path"

**Problem:** File path tidak sesuai dengan RLS policy.

**Expected path format:** `users/{user-id}-{timestamp}.{ext}`

**Check file upload path in API:**

- Should be: `users/f47ac10b-58cc-4372-a567-0e02b2c3d479-1629123456789.jpg`

---

## Debug Steps

### 1. Check Bucket Status

```sql
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'avatars';
```

### 2. Check RLS Policies

```sql
SELECT
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%avatar%';
```

### 3. Check User Authentication

```sql
SELECT
  auth.uid() as user_id,
  auth.email() as user_email;
```

### 4. Test File Upload (Browser Console)

```javascript
// Check file details before upload
console.log("File info:", {
  name: file.name,
  type: file.type,
  size: file.size,
})
```

### 5. Check API Logs

- Look for upload errors in browser network tab
- Check server logs for detailed error messages

---

## Quick Fix Commands

### Reset Everything (CAREFUL!)

```sql
-- Delete all files and policies
DELETE FROM storage.objects WHERE bucket_id = 'avatars';
DELETE FROM storage.buckets WHERE id = 'avatars';

-- Run scripts/simple-avatars-bucket.sql
```

### Minimal Working Setup

```sql
-- Basic bucket without restrictions
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Simple public read policy
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Simple authenticated upload
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);
```

---

## Prevention Tips

1. **Always test bucket creation first** before coding
2. **Use browser network tab** to see exact error messages
3. **Check file type and size** before upload
4. **Verify user is authenticated** before upload
5. **Use simple policies first**, then add restrictions

## File Structure After Fix

```
Supabase Storage
└── avatars/
    └── users/
        ├── f47ac10b-58cc-4372-a567-0e02b2c3d479-1629123456789.jpg
        ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890-1629123456790.png
        └── ...
```
