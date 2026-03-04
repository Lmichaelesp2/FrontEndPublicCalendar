/*
  # Update Delete Policy to Allow All Events

  1. Changes
    - Drop the old policy that only allowed deleting past events
    - Create new policy that allows deleting any event
    - This enables the admin panel to clear all events from the database

  2. Security
    - DELETE policy allows anonymous users to delete any event
    - This is intended for the admin panel functionality
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Anyone can delete past events" ON events;

-- Create new policy that allows deleting any event
CREATE POLICY "Anyone can delete any event"
  ON events
  FOR DELETE
  USING (true);
