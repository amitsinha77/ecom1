/*
# Create customer portal and cleaner portal schema

## Purpose
Extend the booking system with tables for customer account management
(addresses, payment methods, reviews, referrals) and cleaner portal
features (check-ins, job photos, job issues, notifications).

## New Tables
1. `addresses` — saved addresses for signed-in customers
2. `payment_methods` — saved Stripe payment method references
3. `reviews` — customer reviews for completed bookings
4. `referrals` — refer-a-friend tracking
5. `check_ins` — cleaner check in/out timestamps
6. `job_photos` — before/after photos uploaded by cleaners
7. `job_issues` — issues reported by cleaners
8. `notifications` — notifications for customers and cleaners

## Security
- addresses, payment_methods, referrals: owner-scoped (auth.uid() = user_id)
- reviews: public read, owner insert/update/delete
- check_ins, job_photos, job_issues: admin + assigned cleaner (via is_assigned_cleaner)
- notifications: owner-scoped by user_id or cleaner_id (matched via profile email)
*/

-- ============ ADDRESSES TABLE ============

CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  address_line1 text NOT NULL,
  postcode text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_addresses" ON public.addresses;
CREATE POLICY "select_own_addresses" ON public.addresses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON public.addresses;
CREATE POLICY "insert_own_addresses" ON public.addresses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON public.addresses;
CREATE POLICY "update_own_addresses" ON public.addresses
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON public.addresses;
CREATE POLICY "delete_own_addresses" ON public.addresses
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ PAYMENT METHODS TABLE ============

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_pm_id text NOT NULL,
  brand text,
  last4 text,
  exp_month integer,
  exp_year integer,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_payment_methods" ON public.payment_methods;
CREATE POLICY "select_own_payment_methods" ON public.payment_methods
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_payment_methods" ON public.payment_methods;
CREATE POLICY "insert_own_payment_methods" ON public.payment_methods
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_payment_methods" ON public.payment_methods;
CREATE POLICY "update_own_payment_methods" ON public.payment_methods
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_payment_methods" ON public.payment_methods;
CREATE POLICY "delete_own_payment_methods" ON public.payment_methods
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ REVIEWS TABLE ============

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_reviews" ON public.reviews;
CREATE POLICY "public_select_reviews" ON public.reviews
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_reviews" ON public.reviews;
CREATE POLICY "insert_own_reviews" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON public.reviews;
CREATE POLICY "update_own_reviews" ON public.reviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reviews" ON public.reviews;
CREATE POLICY "delete_own_reviews" ON public.reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ REFERRALS TABLE ============

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_email text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  reward_earned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_referrals" ON public.referrals;
CREATE POLICY "select_own_referrals" ON public.referrals
  FOR SELECT TO authenticated USING (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS "insert_own_referrals" ON public.referrals;
CREATE POLICY "insert_own_referrals" ON public.referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS "delete_own_referrals" ON public.referrals;
CREATE POLICY "delete_own_referrals" ON public.referrals
  FOR DELETE TO authenticated USING (auth.uid() = referrer_user_id);

-- ============ HELPER: is_assigned_cleaner ============

CREATE OR REPLACE FUNCTION public.is_assigned_cleaner(p_booking_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cleaners c
    JOIN public.bookings b ON b.cleaner_id = c.id
    WHERE b.id = p_booking_id
    AND c.email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );
$$;

-- ============ CHECK_INS TABLE ============

CREATE TABLE IF NOT EXISTS public.check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  cleaner_id uuid NOT NULL REFERENCES public.cleaners(id) ON DELETE CASCADE,
  check_in_time timestamptz NOT NULL DEFAULT now(),
  check_out_time timestamptz,
  check_in_lat double precision,
  check_in_lng double precision
);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_assigned_check_ins" ON public.check_ins;
CREATE POLICY "select_assigned_check_ins" ON public.check_ins
  FOR SELECT TO authenticated USING (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

DROP POLICY IF EXISTS "insert_assigned_check_ins" ON public.check_ins;
CREATE POLICY "insert_assigned_check_ins" ON public.check_ins
  FOR INSERT TO authenticated WITH CHECK (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

DROP POLICY IF EXISTS "update_assigned_check_ins" ON public.check_ins;
CREATE POLICY "update_assigned_check_ins" ON public.check_ins
  FOR UPDATE TO authenticated USING (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  ) WITH CHECK (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

-- ============ JOB_PHOTOS TABLE ============

CREATE TABLE IF NOT EXISTS public.job_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  cleaner_id uuid NOT NULL REFERENCES public.cleaners(id) ON DELETE CASCADE,
  photo_type text NOT NULL DEFAULT 'before' CHECK (photo_type IN ('before', 'after')),
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_assigned_job_photos" ON public.job_photos;
CREATE POLICY "select_assigned_job_photos" ON public.job_photos
  FOR SELECT TO authenticated USING (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

DROP POLICY IF EXISTS "insert_assigned_job_photos" ON public.job_photos;
CREATE POLICY "insert_assigned_job_photos" ON public.job_photos
  FOR INSERT TO authenticated WITH CHECK (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

DROP POLICY IF EXISTS "delete_assigned_job_photos" ON public.job_photos;
CREATE POLICY "delete_assigned_job_photos" ON public.job_photos
  FOR DELETE TO authenticated USING (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

CREATE INDEX IF NOT EXISTS idx_job_photos_booking ON public.job_photos (booking_id);

-- ============ JOB_ISSUES TABLE ============

CREATE TABLE IF NOT EXISTS public.job_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  cleaner_id uuid NOT NULL REFERENCES public.cleaners(id) ON DELETE CASCADE,
  description text NOT NULL,
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high')),
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_assigned_job_issues" ON public.job_issues;
CREATE POLICY "select_assigned_job_issues" ON public.job_issues
  FOR SELECT TO authenticated USING (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

DROP POLICY IF EXISTS "insert_assigned_job_issues" ON public.job_issues;
CREATE POLICY "insert_assigned_job_issues" ON public.job_issues
  FOR INSERT TO authenticated WITH CHECK (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

DROP POLICY IF EXISTS "update_assigned_job_issues" ON public.job_issues;
CREATE POLICY "update_assigned_job_issues" ON public.job_issues
  FOR UPDATE TO authenticated USING (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  ) WITH CHECK (
    public.is_admin() OR public.is_assigned_cleaner(booking_id)
  );

-- ============ NOTIFICATIONS TABLE ============

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  cleaner_id uuid REFERENCES public.cleaners(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'booking',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notif_target CHECK (user_id IS NOT NULL OR cleaner_id IS NOT NULL)
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON public.notifications;
CREATE POLICY "select_own_notifications" ON public.notifications
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR public.is_admin()
  );

DROP POLICY IF EXISTS "update_own_notifications" ON public.notifications;
CREATE POLICY "update_own_notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (
    auth.uid() = user_id OR public.is_admin()
  ) WITH CHECK (
    auth.uid() = user_id OR public.is_admin()
  );

DROP POLICY IF EXISTS "admin_insert_notifications" ON public.notifications;
CREATE POLICY "admin_insert_notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "select_cleaner_notifications" ON public.notifications;
CREATE POLICY "select_cleaner_notifications" ON public.notifications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.cleaners c
      WHERE c.id = notifications.cleaner_id
      AND c.email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "update_cleaner_notifications" ON public.notifications;
CREATE POLICY "update_cleaner_notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.cleaners c
      WHERE c.id = notifications.cleaner_id
      AND c.email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cleaners c
      WHERE c.id = notifications.cleaner_id
      AND c.email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_cleaner ON public.notifications (cleaner_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_booking ON public.check_ins (booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews (booking_id);
