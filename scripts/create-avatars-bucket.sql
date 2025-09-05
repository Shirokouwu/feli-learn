-- Script untuk membuat bucket avatars di Supabase Storage
-- Jalankan ini di SQL Editor Supabase Dashboard

-- Buat bucket avatars jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Hapus policy lama jika ada (optional)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Buat RLS policies untuk bucket avatars dengan folder users
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = 'users'
  AND auth.uid()::text = substring(name from 7 for 36) -- Skip "users/" prefix
);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = 'users'
  AND auth.uid()::text = substring(name from 7 for 36) -- Skip "users/" prefix
);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = 'users'
  AND auth.uid()::text = substring(name from 7 for 36) -- Skip "users/" prefix
);

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = 'users'
);

-- Verifikasi bucket sudah dibuat
SELECT * FROM storage.buckets WHERE id = 'avatars';
