/*
  # Remove Insecure Delete Policy

  1. Security Issue
    - The "Anyone can delete any event" policy has USING (true) which allows unrestricted deletion
    - This is a critical security vulnerability

  2. Changes
    - Drop the insecure DELETE policy
    - Admin delete operations will be moved to an Edge Function using the service role key
    - This ensures proper authentication and authorization for delete operations

  3. Notes
    - Delete operations should only be performed through authenticated Edge Functions
    - This follows security best practices by keeping sensitive operations server-side
*/

-- Drop the insecure policy that allows anyone to delete any event
DROP POLICY IF EXISTS "Anyone can delete any event" ON events;