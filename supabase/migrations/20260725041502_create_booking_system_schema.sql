/*
# Create booking system and admin dashboard schema

## Purpose
PureMaids now needs a full booking system with customer accounts, cleaner
management, invoices, and an admin dashboard. This migration creates the
complete schema with role-based access control.

## New Tables

1. `profiles` — extends auth.users with role (customer/admin/cleaner)
2. `cleaners` — directory of cleaning staff assignable to bookings
3. `bookings` — core booking record with pricing, extras, cleaner assignment
4. `invoices` — generated for completed bookings

## Security
- profiles: owner-scoped (users see their own profile)
- cleaners: admin-only
- bookings: customers see own; anon can insert (guest bookings); admin sees all
- invoices: admin-only
- is_admin() function checks profile role = 'admin'
- Auto-creates profile on signup via trigger
*/

-- ============ PROFILES TABLE (must come first for is_admin) ============

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ HELPER FUNCTION (after profiles exists) ============

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ CLEANERS TABLE ============

CREATE TABLE IF NOT EXISTS public.cleaners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  areas text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_cleaners" ON public.cleaners;
CREATE POLICY "admin_select_cleaners" ON public.cleaners
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_cleaners" ON public.cleaners;
CREATE POLICY "admin_insert_cleaners" ON public.cleaners
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_cleaners" ON public.cleaners;
CREATE POLICY "admin_update_cleaners" ON public.cleaners
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_cleaners" ON public.cleaners;
CREATE POLICY "admin_delete_cleaners" ON public.cleaners
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============ BOOKINGS TABLE ============

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  service text NOT NULL,
  bedrooms integer,
  bathrooms integer,
  frequency text,
  postcode text NOT NULL,
  address text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  extras text[] NOT NULL DEFAULT '{}',
  base_price integer NOT NULL,
  extras_price integer NOT NULL DEFAULT 0,
  total_price integer NOT NULL,
  deposit_amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  cleaner_id uuid REFERENCES public.cleaners(id) ON DELETE SET NULL,
  stripe_payment_intent_id text,
  deposit_paid boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON public.bookings;
CREATE POLICY "select_own_bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "anon_insert_bookings" ON public.bookings;
CREATE POLICY "anon_insert_bookings" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_bookings" ON public.bookings;
CREATE POLICY "admin_update_bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (public.is_admin() OR auth.uid() = customer_id)
  WITH CHECK (public.is_admin() OR auth.uid() = customer_id);

DROP POLICY IF EXISTS "admin_delete_bookings" ON public.bookings;
CREATE POLICY "admin_delete_bookings" ON public.bookings
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_cleaner ON public.bookings (cleaner_id);

-- ============ INVOICES TABLE ============

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_select_invoices" ON public.invoices;
CREATE POLICY "admin_select_invoices" ON public.invoices
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_invoices" ON public.invoices;
CREATE POLICY "admin_insert_invoices" ON public.invoices
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_invoices" ON public.invoices;
CREATE POLICY "admin_update_invoices" ON public.invoices
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_invoices" ON public.invoices;
CREATE POLICY "admin_delete_invoices" ON public.invoices
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_invoices_booking ON public.invoices (booking_id);
