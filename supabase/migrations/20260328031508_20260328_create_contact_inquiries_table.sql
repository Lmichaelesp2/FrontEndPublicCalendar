/*
  # Create contact inquiries table

  1. New Tables
    - `contact_inquiries`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `inquiry_type` (text, required - one of: 'general', 'sponsorship', 'media', 'technical', 'other')
      - `message` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `contact_inquiries` table
    - Add policy to allow anonymous inserts (for contact form submissions)
    - Add policy to allow authenticated users to view only their own submissions
*/

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('general', 'sponsorship', 'media', 'technical', 'other')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous contact form submissions"
  ON contact_inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own submissions"
  ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');
