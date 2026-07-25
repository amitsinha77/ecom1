/*
# Create contact and booking enquiry tables

## Purpose
PureMaids is a public marketing website (no sign-in). Visitors submit
contact enquiries and booking requests through public forms. These tables
store those submissions so the team can follow up.

## New Tables

1. `contact_enquiries`
   - Stores messages submitted via the contact form.
   - `id` (uuid, primary key)
   - `name` (text, not null) — sender's full name
   - `email` (text, not null) — sender's email
   - `phone` (text, nullable) — optional phone number
   - `subject` (text, nullable) — optional subject line
   - `message` (text, not null) — the enquiry body
   - `status` (text, default 'new') — tracking status
   - `created_at` (timestamptz, default now())

2. `booking_enquiries`
   - Stores booking requests submitted via the online booking flow.
   - `id` (uuid, primary key)
   - `service` (text, not null) — service slug
   - `bedrooms` (text, nullable)
   - `bathrooms` (text, nullable)
   - `frequency` (text, nullable) — weekly / fortnightly / one-off
   - `estimate` (integer, nullable) — estimated price in pence-less GBP
   - `preferred_date` (text, not null) — requested date
   - `preferred_time` (text, not null) — requested time
   - `address` (text, not null)
   - `postcode` (text, not null)
   - `name` (text, not null)
   - `email` (text, not null)
   - `phone` (text, not null)
   - `notes` (text, nullable)
   - `status` (text, default 'pending')
   - `created_at` (timestamptz, default now())

## Security
- RLS enabled on both tables.
- INSERT allowed for `anon, authenticated` so public form submissions work
  without a sign-in. The data is intentionally public-write (enquiry forms).
- SELECT/UPDATE/DELETE restricted to `authenticated` only so only staff with
  a Supabase account can read or manage submissions. The anon-key website
  cannot read back submissions.
*/

CREATE TABLE IF NOT EXISTS contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_enquiries" ON contact_enquiries;
CREATE POLICY "anon_insert_contact_enquiries" ON contact_enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_enquiries" ON contact_enquiries;
CREATE POLICY "auth_select_contact_enquiries" ON contact_enquiries
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact_enquiries" ON contact_enquiries;
CREATE POLICY "auth_update_contact_enquiries" ON contact_enquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact_enquiries" ON contact_enquiries;
CREATE POLICY "auth_delete_contact_enquiries" ON contact_enquiries
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at
  ON contact_enquiries (created_at DESC);

CREATE TABLE IF NOT EXISTS booking_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  bedrooms text,
  bathrooms text,
  frequency text,
  estimate integer,
  preferred_date text NOT NULL,
  preferred_time text NOT NULL,
  address text NOT NULL,
  postcode text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE booking_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_booking_enquiries" ON booking_enquiries;
CREATE POLICY "anon_insert_booking_enquiries" ON booking_enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_booking_enquiries" ON booking_enquiries;
CREATE POLICY "auth_select_booking_enquiries" ON booking_enquiries
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_booking_enquiries" ON booking_enquiries;
CREATE POLICY "auth_update_booking_enquiries" ON booking_enquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_booking_enquiries" ON booking_enquiries;
CREATE POLICY "auth_delete_booking_enquiries" ON booking_enquiries
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_booking_enquiries_created_at
  ON booking_enquiries (created_at DESC);
