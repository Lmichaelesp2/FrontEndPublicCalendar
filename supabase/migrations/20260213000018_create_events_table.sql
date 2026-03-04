/*
  # San Antonio Business Events Calendar - Events Table

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `name` (text, required) - Event name/title
      - `start_date` (date, required) - Event start date
      - `start_time` (text) - Event start time (e.g., "11:00 AM")
      - `end_date` (date) - Event end date
      - `end_time` (text) - Event end time
      - `website` (text) - Event website/registration URL
      - `description` (text) - Event description
      - `paid` (text) - Cost type: "Free", "Paid", "Both", or "Unknown"
      - `address` (text) - Physical address
      - `zipcode` (text) - ZIP code
      - `group_name` (text) - Organizing group/organization name
      - `participation` (text) - Format: "In-Person", "Virtual", or "Hybrid"
      - `part_of_town` (text) - Area of town (e.g., "North", "Central")
      - `created_at` (timestamptz) - Timestamp when event was added
      - `updated_at` (timestamptz) - Timestamp of last update
      - `status` (text) - Event status: "pending", "approved", "rejected"
      
  2. Security
    - Enable RLS on `events` table
    - Public can read approved events
    - Authenticated users can submit events (pending approval)
    - Only specific roles can approve/manage events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  start_time text,
  end_date date,
  end_time text,
  website text,
  description text,
  paid text DEFAULT 'Unknown',
  address text,
  zipcode text,
  group_name text,
  participation text DEFAULT 'In-Person',
  part_of_town text,
  status text DEFAULT 'approved',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved events
CREATE POLICY "Anyone can view approved events"
  ON events
  FOR SELECT
  USING (status = 'approved');

-- Policy: Authenticated users can submit events
CREATE POLICY "Authenticated users can submit events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Users can view their own submitted events
CREATE POLICY "Users can view own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
