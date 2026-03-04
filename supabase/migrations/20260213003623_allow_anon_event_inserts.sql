/*
  # Allow anonymous event inserts

  Since the admin panel uses client-side password authentication
  rather than Supabase auth, event inserts are made as anonymous users.
  
  This migration adds an INSERT policy for anonymous users so
  the CSV upload and publish flow works correctly.

  1. Security Changes
    - Add INSERT policy for `anon` role on `events` table
*/

CREATE POLICY "Anon users can insert events"
  ON events
  FOR INSERT
  TO anon
  WITH CHECK (true);
