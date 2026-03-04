/*
  # Create assistant waitlist table

  1. New Tables
    - `assistant_waitlist`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `assistant_waitlist` table
    - Add policy for anonymous users to insert their email
    - Add policy for authenticated users to view all entries
*/

CREATE TABLE IF NOT EXISTS assistant_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assistant_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
  ON assistant_waitlist
  FOR INSERT
  TO anon
  WITH CHECK (email IS NOT NULL AND email <> '');

CREATE POLICY "Authenticated users can view waitlist"
  ON assistant_waitlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
