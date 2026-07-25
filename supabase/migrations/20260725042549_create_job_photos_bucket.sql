/*
# Create job-photos storage bucket

## Purpose
Cleaners upload before/after photos for each job. These need a Supabase
Storage bucket with appropriate access policies.

## Changes
1. Create a public-read storage bucket called `job-photos`
2. Add storage policies:
   - Authenticated users can upload (cleaners with assigned bookings)
   - Public can read (for before/after gallery on website)
   - Authenticated users can read
   - Admin can delete
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('job-photos', 'job-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Upload: authenticated users can upload to job-photos
DROP POLICY IF EXISTS "authenticated_upload_job_photos" ON storage.objects;
CREATE POLICY "authenticated_upload_job_photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'job-photos');

-- Read: public can read (for website gallery)
DROP POLICY IF EXISTS "public_read_job_photos" ON storage.objects;
CREATE POLICY "public_read_job_photos" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'job-photos');

-- Delete: admin only
DROP POLICY IF EXISTS "admin_delete_job_photos" ON storage.objects;
CREATE POLICY "admin_delete_job_photos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'job-photos' AND public.is_admin()
  );
