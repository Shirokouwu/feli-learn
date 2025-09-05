-- Simple fix for avatar upload RLS policies
-- This script creates minimal policies to allow authenticated users to upload avatars

-- 1. Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- 2. Drop all existing avatar-related policies
DROP POLICY IF EXISTS "Simple avatar upload" ON storage.objects;
DROP POLICY IF EXISTS "Simple avatar read" ON storage.objects;
DROP POLICY IF EXISTS "Simple avatar update" ON storage.objects;
DROP POLICY IF EXISTS "Simple avatar delete" ON storage.objects;
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated avatar upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;

-- 3. Create simple, working policies
CREATE POLICY "Simple avatar upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Simple avatar read" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Simple avatar update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Simple avatar delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- 4. Verify setup
SELECT 'Bucket created' as status, id, name, public FROM storage.buckets WHERE id = 'avatars';
SELECT 'Policies created' as status, policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'Simple avatar%';
