-- DEBUG: Check current user authentication
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  auth.email() as current_email;

-- DEBUG: Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- DEBUG: Check existing policies
SELECT 
  policyname, 
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%avatar%';

-- SIMPLE FIX: Create very permissive policies for testing
DROP POLICY IF EXISTS "Simple avatar upload" ON storage.objects;
DROP POLICY IF EXISTS "Simple avatar read" ON storage.objects;
DROP POLICY IF EXISTS "Simple avatar update" ON storage.objects;
DROP POLICY IF EXISTS "Simple avatar delete" ON storage.objects;

-- Allow any authenticated user to upload to avatars bucket
CREATE POLICY "Simple avatar upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow anyone to read from avatars bucket
CREATE POLICY "Simple avatar read" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow any authenticated user to update in avatars bucket  
CREATE POLICY "Simple avatar update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow any authenticated user to delete from avatars bucket
CREATE POLICY "Simple avatar delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Verify policies are created
SELECT policyname, cmd FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE 'Simple avatar%';
