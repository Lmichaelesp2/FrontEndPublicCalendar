/*
  # Add Event Category Column

  1. Modified Tables
    - `events`
      - `event_category` (text, nullable) - Categorizes events into types like
        'technology', 'real_estate', 'chamber', 'small_business', etc.
        Used to power category-specific calendar pages.

  2. Notes
    - Existing events will have NULL category (general/uncategorized)
    - An index is added on event_category for efficient filtering
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_category'
  ) THEN
    ALTER TABLE events ADD COLUMN event_category text DEFAULT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_events_event_category ON events (event_category);
