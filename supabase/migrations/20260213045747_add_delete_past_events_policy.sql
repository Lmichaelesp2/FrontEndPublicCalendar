/*
  # Add Policy to Delete Past Events

  1. Changes
    - Add DELETE policy for `anon` users to remove past events
    - This allows the admin panel to clear out old events
    - Only events with start_date before today can be deleted

  2. Security
    - DELETE policy checks that start_date < CURRENT_DATE
    - This prevents accidental deletion of current/future events
*/

-- Policy: Anyone can delete past events
CREATE POLICY "Anyone can delete past events"
  ON events
  FOR DELETE
  USING (start_date < CURRENT_DATE);
