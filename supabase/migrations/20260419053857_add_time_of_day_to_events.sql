/*
  # Add time_of_day column to events table

  ## Summary
  Adds the missing `time_of_day` column to the `events` table. This column was
  already present in the TypeScript Event type and CSV parser mappings but was
  never added to the actual database schema, causing all CSV uploads to fail
  with an internal server error.

  ## Changes
  - `events` table: adds `time_of_day` (text, nullable) column
    - Stores a text label for the time of day (e.g. "Morning", "Afternoon", "Evening")
    - Accepted via CSV headers: time_of_day, timeofday, time_period
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'time_of_day'
  ) THEN
    ALTER TABLE events ADD COLUMN time_of_day text;
  END IF;
END $$;
