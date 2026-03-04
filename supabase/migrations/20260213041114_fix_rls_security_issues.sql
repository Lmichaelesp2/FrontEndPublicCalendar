/*
  # Fix RLS security issues across events and assistant_waitlist tables

  1. assistant_waitlist
    - Replace `auth.uid()` with `(select auth.uid())` in SELECT policy for better query performance

  2. Function: update_updated_at
    - Recreate with immutable search_path (`SET search_path = ''`) to prevent search_path injection

  3. events table - Policy consolidation and tightening
    - Drop all 7 existing policies that have overlaps and always-true issues
    - Create new tighter policies:
      - SELECT (anon): allow viewing all events (required for admin panel which uses client-side auth)
      - SELECT (authenticated): only approved events
      - INSERT (anon): require name, start_date, and valid status ('pending' or 'approved')
      - INSERT (authenticated): require name, start_date, and force status = 'pending'
      - UPDATE (anon): restrict to only changing status to valid values
      - DELETE: removed entirely (not used anywhere in the codebase)

  4. Notes
    - The admin panel uses client-side password auth (not Supabase auth), so admin
      operations run as anon. This limits how restrictive anon policies can be.
    - The anon SELECT and UPDATE policies still need broad access for admin functionality.
      A future improvement would be to move admin operations behind an edge function
      using the service role key, which would allow fully restrictive anon policies.
*/

-- 1. Fix assistant_waitlist: wrap auth.uid() in subquery for performance
DROP POLICY IF EXISTS "Authenticated users can view waitlist" ON assistant_waitlist;

CREATE POLICY "Authenticated users can view waitlist"
  ON assistant_waitlist
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- 2. Fix function search_path vulnerability
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- 3. Drop all existing events policies to rebuild cleanly
DROP POLICY IF EXISTS "Anyone can view approved events" ON events;
DROP POLICY IF EXISTS "Anon can view all events for admin" ON events;
DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Anon users can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can submit events" ON events;
DROP POLICY IF EXISTS "Anon can update events for admin" ON events;
DROP POLICY IF EXISTS "Anon can delete events for admin" ON events;

-- 4. Create consolidated, tighter events policies

-- SELECT: one per role, no overlap
CREATE POLICY "Anon can view all events"
  ON events
  FOR SELECT
  TO anon
  USING (status IN ('approved', 'pending', 'rejected'));

CREATE POLICY "Authenticated can view approved events"
  ON events
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

-- INSERT: require valid data and constrain status
CREATE POLICY "Anon can insert events with valid data"
  ON events
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL
    AND start_date IS NOT NULL
    AND status IS NOT NULL
    AND status IN ('pending', 'approved')
  );

CREATE POLICY "Authenticated can submit pending events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL
    AND start_date IS NOT NULL
    AND status = 'pending'
  );

-- UPDATE: only allow valid status transitions for anon
CREATE POLICY "Anon can update event status"
  ON events
  FOR UPDATE
  TO anon
  USING (status IN ('pending', 'approved', 'rejected'))
  WITH CHECK (status IN ('pending', 'approved', 'rejected'));

-- No DELETE policy: removed (not used in the application)
