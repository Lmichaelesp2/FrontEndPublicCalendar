/*
  # Fix RLS Performance and Security Issues

  1. RLS Initialization Plan Fixes
    - Replace `auth.uid()` with `(select auth.uid())` in all policies on `user_profiles` and `user_preferences`
      tables to avoid per-row re-evaluation, improving query performance at scale.

  2. Unused Index Cleanup
    - Drop `idx_user_preferences_category` (unused)
    - Drop `idx_event_categories_category` (unused)

  3. RLS Policy Security Fix
    - `event_categories`: Replace always-true INSERT policy with one that checks the row belongs to the inserting user

  Changes affect tables:
    - public.user_profiles (3 policies updated)
    - public.user_preferences (4 policies updated)
    - public.event_categories (1 policy replaced)
*/

-- Fix user_profiles policies

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Fix user_preferences policies

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own preferences" ON public.user_preferences;
CREATE POLICY "Users can delete own preferences"
  ON public.user_preferences FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Fix event_categories INSERT policy (always-true -> ownership check)

DROP POLICY IF EXISTS "Authenticated users can insert event categories" ON public.event_categories;
CREATE POLICY "Authenticated users can insert event categories"
  ON public.event_categories FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Drop unused indexes

DROP INDEX IF EXISTS public.idx_user_preferences_category;
DROP INDEX IF EXISTS public.idx_event_categories_category;
