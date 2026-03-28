/*
  # Create event_submissions table

  ## Summary
  Creates a new table to store public event submission requests from the Submit Event form.
  This is separate from the admin-managed `events` table and holds submissions pending review.

  ## New Tables
  - `event_submissions`
    - `id` (uuid, primary key)
    - `event_name` (text) - Name of the event
    - `event_date` (date) - Date of the event
    - `start_time` (text) - Start time
    - `end_time` (text, nullable) - Optional end time
    - `city` (text) - San Antonio / Austin / Dallas / Houston
    - `category` (text) - Networking / Chamber / Technology / Real Estate / Small Business / General Business
    - `venue_name` (text) - Name of the venue
    - `venue_address` (text) - Full address
    - `description` (text) - Event description (max 500 chars enforced at app level)
    - `event_url` (text) - Registration/event link
    - `organizer_name` (text) - Organizer name or organization
    - `contact_email` (text) - Confirmation email
    - `is_recurring` (boolean) - Whether event recurs
    - `recurring_frequency` (text, nullable) - Weekly / Bi-weekly / Monthly
    - `status` (text) - pending / approved / declined
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS
  - Anonymous users can INSERT (public submission form)
  - Authenticated users (admins) can SELECT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS event_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL DEFAULT '',
  event_date date NOT NULL,
  start_time text NOT NULL DEFAULT '',
  end_time text,
  city text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  venue_name text NOT NULL DEFAULT '',
  venue_address text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  event_url text NOT NULL DEFAULT '',
  organizer_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  is_recurring boolean NOT NULL DEFAULT false,
  recurring_frequency text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an event"
  ON event_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON event_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON event_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON event_submissions
  FOR DELETE
  TO authenticated
  USING (true);
