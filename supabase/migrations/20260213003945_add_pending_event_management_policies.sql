/*
  # Add policies for pending event management

  Since the admin panel uses client-side authentication (not Supabase auth),
  admin operations run as the `anon` role. These policies allow the admin
  panel to view all events (including pending) and update event status
  for approval/rejection.

  1. Security Changes
    - Add SELECT policy for `anon` to view all events (calendar already filters by approved)
    - Add UPDATE policy for `anon` to change event status (for admin approval flow)
    - Add DELETE policy for `anon` to remove rejected events
*/

CREATE POLICY "Anon can view all events for admin"
  ON events
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can update events for admin"
  ON events
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete events for admin"
  ON events
  FOR DELETE
  TO anon
  USING (true);
