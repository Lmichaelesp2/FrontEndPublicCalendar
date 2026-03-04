/*
  # Add city_calendar column to events table

  1. Modified Tables
    - `events`
      - Added `city_calendar` (text, nullable, default 'San Antonio')
        - Stores which Texas city this event belongs to
        - Valid values: 'San Antonio', 'Austin', 'Dallas', 'Houston'

  2. Notes
    - Existing events will default to 'San Antonio' since the app was previously SA-only
    - Column is nullable to handle legacy data gracefully
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'city_calendar'
  ) THEN
    ALTER TABLE events ADD COLUMN city_calendar text DEFAULT 'San Antonio';
  END IF;
END $$;
