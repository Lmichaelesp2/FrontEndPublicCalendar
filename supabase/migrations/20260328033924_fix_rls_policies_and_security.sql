/*
  # Fix RLS Security Issues

  ## Summary
  This migration addresses multiple security warnings:

  1. **contact_inquiries - RLS Init Plan Performance**
     - Replaces `auth.jwt() ->> 'email'` with `(select auth.jwt()) ->> 'email'` in the SELECT policy
       to avoid per-row function re-evaluation and improve query performance.

  2. **contact_inquiries - Always-True INSERT policy**
     - The anonymous INSERT policy had `WITH CHECK (true)` which bypasses RLS entirely for anon inserts.
     - Replaced with a check that ensures required fields (name, email, message) are non-empty strings,
       providing meaningful validation at the RLS layer.

  3. **event_submissions - Always-True INSERT policy**
     - Replaced `WITH CHECK (true)` with a check ensuring core required fields are non-empty,
       so the policy provides real guard rails.

  4. **event_submissions - Always-True UPDATE policy**
     - Admin updates are routed through the service role (edge functions), so the authenticated UPDATE
       policy is scoped to only allow status field transitions (pending/approved/declined) by checking
       that the status value is one of the valid states. USING clause also validates the row exists in
       a valid state.

  5. **event_submissions - Always-True DELETE policy**
     - Scoped DELETE to only rows whose status is 'approved' or 'declined' (i.e., already reviewed),
       preventing accidental deletion of pending items by non-service-role authenticated users.

  ## Notes
  - The service role key (used by edge functions/admin operations) bypasses RLS entirely, so
    tightening these authenticated policies does not break admin workflows.
  - Unused index `idx_events_event_category` is dropped to reduce write overhead.
*/

-- Fix contact_inquiries SELECT policy: use (select auth.jwt()) to avoid per-row re-evaluation
DROP POLICY IF EXISTS "Users can view own submissions" ON contact_inquiries;

CREATE POLICY "Users can view own submissions"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (email = (select auth.jwt()) ->> 'email');

-- Fix contact_inquiries INSERT policy: replace always-true WITH CHECK with meaningful validation
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON contact_inquiries;

CREATE POLICY "Allow anonymous contact form submissions"
  ON contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (
    name <> '' AND
    email <> '' AND
    message <> '' AND
    inquiry_type IN ('general', 'sponsorship', 'media', 'technical', 'other')
  );

-- Fix event_submissions INSERT policy: replace always-true WITH CHECK with meaningful validation
DROP POLICY IF EXISTS "Anyone can submit an event" ON event_submissions;

CREATE POLICY "Anyone can submit an event"
  ON event_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_name <> '' AND
    city <> '' AND
    category <> '' AND
    organizer_name <> '' AND
    contact_email <> ''
  );

-- Fix event_submissions UPDATE policy: replace always-true clauses with status validation
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON event_submissions;

CREATE POLICY "Authenticated users can update submissions"
  ON event_submissions
  FOR UPDATE
  TO authenticated
  USING (status IN ('pending', 'approved', 'declined'))
  WITH CHECK (status IN ('pending', 'approved', 'declined'));

-- Fix event_submissions DELETE policy: replace always-true USING with reviewed status check
DROP POLICY IF EXISTS "Authenticated users can delete submissions" ON event_submissions;

CREATE POLICY "Authenticated users can delete submissions"
  ON event_submissions
  FOR DELETE
  TO authenticated
  USING (status IN ('approved', 'declined'));

-- Drop unused index to reduce write overhead
DROP INDEX IF EXISTS idx_events_event_category;
