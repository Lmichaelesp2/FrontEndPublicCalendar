/*
  # Create upload_history table

  Tracks every batch of events uploaded through the admin panel, providing
  a persistent log of what was uploaded and when.

  1. New Tables
    - `upload_history`
      - `id` (uuid, primary key) - Unique identifier for each upload record
      - `event_count` (integer) - Number of events published in this batch
      - `cities` (text[]) - List of cities included in the upload
      - `source` (text) - How the data was loaded: "csv", "tsv", or "paste"
      - `notes` (text) - Optional notes or filename info
      - `uploaded_at` (timestamptz) - When the upload occurred

  2. Security
    - Enable RLS on `upload_history` table
    - Anon users can insert records (admin panel uses anon key with password auth)
    - Anon users can read records (admin panel needs to display history)
*/

CREATE TABLE IF NOT EXISTS upload_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_count integer NOT NULL DEFAULT 0,
  cities text[] DEFAULT '{}',
  source text DEFAULT 'csv',
  notes text DEFAULT '',
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE upload_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert upload history"
  ON upload_history
  FOR INSERT
  TO anon
  WITH CHECK (event_count > 0);

CREATE POLICY "Anon can read upload history"
  ON upload_history
  FOR SELECT
  TO anon
  USING (uploaded_at > now() - interval '1 year');

CREATE INDEX IF NOT EXISTS idx_upload_history_uploaded_at ON upload_history(uploaded_at);
